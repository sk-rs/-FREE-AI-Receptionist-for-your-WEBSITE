using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;

namespace AIReceptionist.Services;

public class GeminiService
{
    private readonly HttpClient _httpClient;
    private readonly List<string> _apiKeys = new();
    private static int _keyIndex = 0;
    private static readonly ConcurrentDictionary<string, DateTime> _cooldowns = new();

    public GeminiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;

        // 1. Check array configuration: Gemini:ApiKeys:0, Gemini:ApiKeys:1, etc.
        var keysSection = configuration.GetSection("Gemini:ApiKeys").Get<string[]>();
        if (keysSection != null && keysSection.Length > 0)
        {
            _apiKeys.AddRange(keysSection.Where(k => !string.IsNullOrWhiteSpace(k)).Select(k => k.Trim()));
        }

        // 2. Check comma or semicolon delimited string: Gemini:ApiKeys
        var delimitedKeys = configuration["Gemini:ApiKeys"];
        if (!string.IsNullOrWhiteSpace(delimitedKeys))
        {
            var split = delimitedKeys.Split(new[] { ',', ';', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                                     .Select(k => k.Trim())
                                     .Where(k => !string.IsNullOrWhiteSpace(k));
            _apiKeys.AddRange(split);
        }

        // 3. Fallback to single Gemini:ApiKey
        var singleKey = configuration["Gemini:ApiKey"];
        if (!string.IsNullOrWhiteSpace(singleKey))
        {
            _apiKeys.Add(singleKey.Trim());
        }

        // Distinct deduplication
        _apiKeys = _apiKeys.Distinct().ToList();

        if (_apiKeys.Count == 0)
        {
            throw new InvalidOperationException("No Gemini API keys configured. Set 'Gemini:ApiKeys' or 'Gemini:ApiKey' in appsettings.json or user-secrets.");
        }
    }

    /// <summary>
    /// Gets the total number of configured keys in the rotation pool.
    /// </summary>
    public int KeyPoolCount => _apiKeys.Count;

    /// <summary>
    /// Retrieves the next available healthy API key using round-robin rotation, skipping keys currently cooling down.
    /// </summary>
    private string GetNextHealthyKey()
    {
        var now = DateTime.UtcNow;
        var count = _apiKeys.Count;

        for (int i = 0; i < count; i++)
        {
            var index = Math.Abs(Interlocked.Increment(ref _keyIndex) % count);
            var candidateKey = _apiKeys[index];

            if (!_cooldowns.TryGetValue(candidateKey, out var cooldownUntil) || cooldownUntil <= now)
            {
                return candidateKey;
            }
        }

        // If all keys are currently cooling down, return the round-robin key anyway as best effort
        var fallbackIndex = Math.Abs(Interlocked.Increment(ref _keyIndex) % count);
        return _apiKeys[fallbackIndex];
    }

    /// <summary>
    /// Puts a specific key into cooldown after receiving HTTP 429 (Too Many Requests) or quota exhaustion.
    /// </summary>
    private void MarkKeyCooldown(string key, int seconds = 90)
    {
        _cooldowns[key] = DateTime.UtcNow.AddSeconds(seconds);
    }

    public async Task<string> GetResponseAsync(string systemPrompt, List<(string role, string content)> conversationHistory)
    {
        var contents = conversationHistory.Select(m => new
        {
            role = m.role == "assistant" ? "model" : "user",
            parts = new[] { new { text = m.content } }
        }).ToList();

        var requestBody = new
        {
            system_instruction = new { parts = new[] { new { text = systemPrompt } } },
            contents
        };

        var json = JsonSerializer.Serialize(requestBody);

        var attempts = 0;
        var maxAttempts = Math.Max(2, _apiKeys.Count);
        Exception? lastError = null;

        while (attempts < maxAttempts)
        {
            attempts++;
            var activeKey = GetNextHealthyKey();
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={activeKey}";

            try
            {
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(url, content);
                var responseText = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    var isQuotaExceeded = response.StatusCode == System.Net.HttpStatusCode.TooManyRequests ||
                                          responseText.Contains("RESOURCE_EXHAUSTED", StringComparison.OrdinalIgnoreCase) ||
                                          responseText.Contains("quota", StringComparison.OrdinalIgnoreCase);

                    if (isQuotaExceeded)
                    {
                        Console.WriteLine($"[Gemini Key Cycling] Key hit quota limit (HTTP 429). Rotating to next key. Attempt {attempts} of {maxAttempts}.");
                        MarkKeyCooldown(activeKey, 90);
                        continue;
                    }

                    throw new Exception($"Gemini API error ({response.StatusCode}): {responseText}");
                }

                using var doc = JsonDocument.Parse(responseText);
                var reply = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                return reply ?? "I apologize, but I could not generate a response.";
            }
            catch (Exception ex)
            {
                lastError = ex;
                if (ex.Message.Contains("429") || ex.Message.Contains("RESOURCE_EXHAUSTED", StringComparison.OrdinalIgnoreCase))
                {
                    MarkKeyCooldown(activeKey, 90);
                }

                if (attempts < maxAttempts)
                {
                    await Task.Delay(400 * attempts);
                }
            }
        }

        throw lastError ?? new Exception("Gemini request failed after cycling through available API keys.");
    }

    public async Task<ExtractedLeadInfo?> ExtractLeadInfoAsync(List<(string role, string content)> conversationHistory)
    {
        var transcript = string.Join("\n", conversationHistory.Select(m =>
            $"{(m.role == "user" ? "Visitor" : "Receptionist")}: {m.content}"));

        var extractionPrompt =
            "Read this customer service conversation transcript and extract any of the following details " +
            "the VISITOR has mentioned, if present. Respond with ONLY raw JSON, no markdown formatting, no backticks, no explanation.\n\n" +
            "Format exactly like this:\n" +
            "{\"name\": null, \"phone\": null, \"email\": null, \"issueSummary\": null, \"isEmergency\": false}\n\n" +
            "Rules:\n" +
            "- Use null for anything not mentioned\n" +
            "- \"issueSummary\" should be a short phrase like \"furnace not working\" or \"AC leaking water\"\n" +
            "- \"isEmergency\" is true only for urgent safety/comfort issues (no heat, no AC in extreme weather, flooding, gas smell, electrical hazard, no power)\n\n" +
            "TRANSCRIPT:\n" + transcript;

        var attempts = 0;
        var maxAttempts = Math.Min(3, _apiKeys.Count);

        while (attempts < maxAttempts)
        {
            attempts++;
            var activeKey = GetNextHealthyKey();
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={activeKey}";

            var requestBody = new
            {
                contents = new[]
                {
                    new { role = "user", parts = new[] { new { text = extractionPrompt } } }
                }
            };

            try
            {
                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(url, content);
                if (!response.IsSuccessStatusCode)
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                    {
                        MarkKeyCooldown(activeKey, 90);
                        continue;
                    }
                    return null;
                }

                var responseText = await response.Content.ReadAsStringAsync();

                using var doc = JsonDocument.Parse(responseText);
                var rawText = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString() ?? "{}";

                rawText = rawText.Trim().Trim('`').Replace("json", "", StringComparison.OrdinalIgnoreCase).Trim();

                return JsonSerializer.Deserialize<ExtractedLeadInfo>(rawText, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch
            {
                // Continue to next attempt or exit
            }
        }

        return null;
    }

    public class ExtractedLeadInfo
    {
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? IssueSummary { get; set; }
        public bool IsEmergency { get; set; }
    }
}
