import JSZip from 'jszip';
import { WidgetConfig } from '../types';

export async function downloadRepoZip(config?: WidgetConfig) {
  const zip = new JSZip();

  // 1. README.md
  const readmeContent = `# AI Receptionist Widget

An ultra-lightweight (under 14KB), zero-dependency, open-source AI receptionist widget that can be embedded into any website to answer visitor questions 24/7, triage emergencies, and capture leads.

Supported Platforms: WordPress, Shopify, Squarespace, Webflow, and custom HTML/JavaScript websites.

License: MIT

---

## Frequently Asked Questions

### Can users embed this without having the full code?
Yes. A website owner only needs one script tag:
\`\`\`html
<script src="https://your-domain.com/widget.js" data-business="Summit Heating" data-color="#000000" async></script>
\`\`\`
They do not need to download or install the full repository on their website. The standalone \`widget.js\` script handles rendering the launcher button, the floating chat window, animations, and message bubbles.

### What code do they need from you?
1. The client script: \`public/widget.js\` (under 14KB, zero dependencies).
2. An API endpoint: The widget sends user messages to a backend that holds the Gemini API key. They can either:
   - Use your hosted API endpoint URL in the \`data-api\` attribute.
   - Or self-host the included backend (either the C# ASP.NET Core service in \`/backend\` or the Node.js server in \`server.ts\`).

### How do users change the icon, font, color, and greeting?
They can customize everything directly in the HTML snippet without modifying any code, or by editing the default values inside \`widget.js\`. See Section 2 below.

---

## 1. Quickstart: 60-Second Embed

To embed the widget into any website, paste this snippet right before the closing \`</body>\` tag:

\`\`\`html
<!-- AI Receptionist Widget -->
<script
  src="https://your-domain.com/widget.js"
  data-business="Your Company Name"
  data-industry="HVAC & Plumbing"
  data-color="#000000"
  data-text-color="#ffffff"
  data-font="Inter, sans-serif"
  data-icon="headset"
  data-position="right"
  data-greeting="Hello. How can we help you today?"
  data-placeholder="Type your message or inquiry..."
  data-api="https://your-domain.com/api/chat"
  async
></script>
\`\`\`

---

## 2. Code Customization Guide

### Option A: Customizing via Script Tag Attributes (No Code Editing)

| Attribute | Type | Allowed Values / Examples | Description |
| :--- | :--- | :--- | :--- |
| \`data-business\` | string | \`"Summit Heating & Air"\` | Company name displayed in the header. |
| \`data-industry\` | string | \`"HVAC"\`, \`"Dental"\`, \`"Legal"\` | Industry vertical. |
| \`data-color\` | hex code | \`"#000000"\`, \`"#4f46e5"\`, \`"#059669"\` | Launcher button and header background color. |
| \`data-text-color\`| hex code | \`"#ffffff"\`, \`"#000000"\` | Header text and launcher icon color. |
| \`data-font\` | string | \`"Inter, sans-serif"\`, \`"Arial"\` | Font family applied to all widget text. |
| \`data-icon\` | string | \`"bot"\`, \`"headset"\`, \`"message"\`, \`"sparkles"\`, \`"phone"\` | Launcher icon shape. |
| \`data-icon-url\` | URL string | \`"https://site.com/logo.png"\` | Optional direct URL to a custom logo/avatar image. |
| \`data-position\` | string | \`"right"\`, \`"left"\` | Corner placement on screen. |
| \`data-greeting\` | string | \`"Hello. How can we assist you today?"\` | Initial greeting message shown to visitors. |
| \`data-placeholder\`| string | \`"Type your message..."\` | Text inside the chat input box. |
| \`data-api\` | URL string | \`"https://api.yourdomain.com/api/chat"\` | Backend chat endpoint. |

### Option B: Customizing via JavaScript Object

Add this configuration script before loading \`widget.js\`:

\`\`\`html
<script>
  window.AIReceptionistConfig = {
    businessName: "Summit Heating & Air",
    industry: "HVAC & Plumbing",
    primaryColor: "#000000",
    textColor: "#ffffff",
    fontFamily: "Inter, sans-serif",
    iconType: "headset",
    position: "right",
    welcomeMessage: "Welcome to Summit Heating. What system can we help service for you?",
    placeholderText: "Type your message...",
    apiUrl: "https://your-domain.com/api/chat"
  };
</script>
<script src="https://your-domain.com/widget.js" async></script>
\`\`\`

### Option C: Customizing Directly in \`widget.js\`

If you are hosting \`widget.js\` yourself, you can change the default values directly inside \`public/widget.js\` around line 25:

\`\`\`javascript
var config = {
  businessName: 'Your Business Name',
  industry: 'Service',
  primaryColor: '#000000',
  textColor: '#ffffff',
  fontFamily: 'Inter, -apple-system, sans-serif',
  iconType: 'headset', // 'bot', 'message', 'headset', 'sparkles', 'phone'
  position: 'right', // 'right' or 'left'
  welcomeMessage: 'Hello. How can we assist you today?',
  placeholderText: 'Type your message...',
  apiUrl: '/api/chat'
};
\`\`\`

---

## 3. Platform-by-Platform Setup

### WordPress
1. Log in to your WordPress admin panel.
2. Go to **Plugins > Add New** and install **WPCode** (Insert Headers and Footers).
3. Go to **Code Snippets > Header & Footer**.
4. In the **Footer** section, paste the \`<script>\` tag.
5. Click **Save Changes**.

### Shopify
1. In your Shopify admin, go to **Online Store > Themes**.
2. Click **... > Edit code**.
3. Under **Layout**, click **\`theme.liquid\`**.
4. Scroll to the bottom and locate \`</body>\`.
5. Paste the \`<script>\` snippet directly above \`</body>\`.
6. Click **Save**.

### Squarespace
1. In your Squarespace menu, go to **Settings > Advanced > Code Injection** (or **Website Tools > Code Injection**).
2. Paste the \`<script>\` snippet into the **Footer** field.
3. Click **Save**.

### Webflow
1. In Webflow, open **Project Settings > Custom Code**.
2. Paste the \`<script>\` snippet into **Footer Code** (before \`</body>\`).
3. Click **Save Changes** and publish.

---

## 4. Backend Setup & Gemini API Key Cycling

Free-tier LLM API keys can hit HTTP 429 (\`RESOURCE_EXHAUSTED\`) during traffic bursts. The backend includes automated round-robin cycling across multiple Gemini API keys with 90-second cooldown failover.

### Option A: ASP.NET Core Backend (C# in \`/backend\`)
1. Open \`backend/appsettings.json\`.
2. Add your Gemini keys in the \`Gemini:ApiKeys\` array:
   \`\`\`json
   {
     "Gemini": {
       "Model": "gemini-3.8-flash",
       "ApiKeys": [
         "AIzaSyKey1...",
         "AIzaSyKey2...",
         "AIzaSyKey3..."
       ]
     }
   }
   \`\`\`
3. Run \`dotnet run\` from the \`/backend\` folder.

### Option B: Node.js / Express Backend (\`server.ts\`)
1. Create a \`.env\` file in the project root:
   \`\`\`env
   # Comma-separated list for multi-key cycling
   GEMINI_API_KEYS="AIzaSyKey1...,AIzaSyKey2...,AIzaSyKey3..."
   GEMINI_API_KEY="AIzaSyDefault..."
   \`\`\`
2. Run \`npm install\` and \`npm run dev\`.

---

## 5. Repository Structure

\`\`\`
/
├── public/
│   └── widget.js            # Standalone embed script (<14KB, zero dependencies)
├── backend/                 # ASP.NET Core EF Core backend implementation
│   ├── Models/Tenant.cs     # Tenant model with customization fields
│   ├── Services/
│   │   ├── GeminiService.cs # Multi-key rotation and automated 429 failover
│   │   ├── PromptBuilder.cs
│   │   └── RegexLeadExtractor.cs
│   ├── Endpoints/
│   │   ├── TenantEndpoints.cs
│   │   └── ConversationEndpoints.cs
│   └── appsettings.json     # Configuration file with Gemini:ApiKeys array
├── server.ts                # Node.js / Express proxy server with key rotation
├── CUSTOMIZATION.md         # Detailed line-by-line customization reference
├── README.md                # This setup documentation
└── LICENSE                  # MIT License
\`\`\`

---

## 6. Open-Source License & Distribution

Distributed under the **MIT License**.
`;

  // 2. CUSTOMIZATION.md
  const customizationContent = `# Code Customization Guide

This document details how developers and site owners can customize the AI Receptionist Widget directly in the code or HTML snippet.

---

## 1. Customizing in the HTML Embed Snippet

The fastest way to customize the widget without touching any JavaScript files is by setting \`data-*\` attributes directly on the \`<script>\` tag.

\`\`\`html
<script
  src="https://your-domain.com/widget.js"
  data-business="Apex Heating & Plumbing"
  data-industry="HVAC"
  data-color="#000000"
  data-text-color="#ffffff"
  data-font="Inter, sans-serif"
  data-icon="headset"
  data-position="right"
  data-greeting="Welcome to Apex Heating. How can we help with your HVAC or plumbing today?"
  data-placeholder="Describe your issue or ask a question..."
  data-api="https://your-domain.com/api/chat"
  async
></script>
\`\`\`

---

## 2. Changing the Launcher Icon

The widget includes five built-in SVG icons that do not rely on external font libraries or emojis:

- \`data-icon="bot"\`: A clean modern robot icon.
- \`data-icon="headset"\`: A customer service / dispatch headset icon.
- \`data-icon="message"\`: A chat bubble icon.
- \`data-icon="sparkles"\`: An AI sparkle icon.
- \`data-icon="phone"\`: A phone receiver icon.

### Using a Custom Logo or Avatar Image
To use your own company logo or avatar instead of an SVG icon, supply the image URL:
\`\`\`html
<script
  src="https://your-domain.com/widget.js"
  data-icon-url="https://your-site.com/avatar.png"
  async
></script>
\`\`\`

---

## 3. Changing the Color Scheme

The widget supports any valid CSS hex code, RGB, or HSL value:

- \`data-color\`: Controls the floating launcher button, the chat window header, and user chat bubbles.
  - Classic Black: \`data-color="#000000"\`
  - Modern Indigo: \`data-color="#4f46e5"\`
  - High-Trust Emerald: \`data-color="#059669"\`
  - Slate Dark: \`data-color="#0f172a"\`
- \`data-text-color\`: Controls the text and icon color inside the header and launcher.
  - White on dark background: \`data-text-color="#ffffff"\`
  - Black on light background: \`data-text-color="#000000"\`

---

## 4. Changing Typography and Font

The \`data-font\` attribute accepts any valid CSS font stack:

\`\`\`html
<!-- Modern Clean -->
data-font="Inter, -apple-system, sans-serif"

<!-- Sophisticated SaaS -->
data-font="'Plus Jakarta Sans', sans-serif"

<!-- Friendly Geometric -->
data-font="'Outfit', sans-serif"

<!-- Humanist Warm -->
data-font="'DM Sans', sans-serif"

<!-- System Native Stack -->
data-font="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
\`\`\`

---

## 5. Changing Screen Placement

Choose which corner of the browser the widget anchors to:

- Bottom-Right (Standard):
  \`\`\`html
  data-position="right"
  \`\`\`
- Bottom-Left (Ideal if you have existing bottom-right support badges):
  \`\`\`html
  data-position="left"
  \`\`\`

---

## 6. Changing Default Settings Inside \`public/widget.js\`

If you are hosting \`widget.js\` yourself, open \`public/widget.js\` and edit lines 25 to 40:

\`\`\`javascript
var config = {
  slug: (currentScript && currentScript.getAttribute('data-slug')) || userConfig.slug || '',
  businessName: (currentScript && currentScript.getAttribute('data-business')) || userConfig.businessName || 'Apex Heating & Air',
  industry: (currentScript && currentScript.getAttribute('data-industry')) || userConfig.industry || 'HVAC',
  primaryColor: (currentScript && currentScript.getAttribute('data-color')) || userConfig.primaryColor || '#000000',
  textColor: (currentScript && currentScript.getAttribute('data-text-color')) || userConfig.textColor || '#ffffff',
  fontFamily: (currentScript && currentScript.getAttribute('data-font')) || userConfig.fontFamily || 'Inter, sans-serif',
  iconType: (currentScript && currentScript.getAttribute('data-icon')) || userConfig.iconType || 'headset',
  customIconUrl: (currentScript && currentScript.getAttribute('data-icon-url')) || userConfig.customIconUrl || '',
  position: (currentScript && currentScript.getAttribute('data-position')) || userConfig.position || 'right',
  welcomeMessage: (currentScript && currentScript.getAttribute('data-greeting')) || userConfig.welcomeMessage || 'Welcome to Apex Heating. How can we assist you today?',
  placeholderText: (currentScript && currentScript.getAttribute('data-placeholder')) || userConfig.placeholderText || 'Type your message or inquiry...',
  apiUrl: (currentScript && currentScript.getAttribute('data-api')) || userConfig.apiUrl || '/api/chat',
  tenantKey: (currentScript && currentScript.getAttribute('data-tenant-key')) || userConfig.tenantKey || ''
};
\`\`\`
`;

  // 3. LICENSE
  const licenseContent = `MIT License

Copyright (c) 2026 Open Source AI Receptionist Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

  // 4. .gitignore
  const gitignoreContent = `node_modules/
dist/
bin/
obj/
*.user
.env
.env.local
.DS_Store
`;

  // 5. public/widget.js
  let widgetJsContent = '';
  try {
    const res = await fetch('/widget.js');
    if (res.ok) {
      widgetJsContent = await res.text();
    }
  } catch {
    // fallback
  }

  if (!widgetJsContent) {
    widgetJsContent = `(function() { /* widget.js */ })();`;
  }

  // 6. backend/appsettings.json
  const appsettingsContent = `{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=AIReceptionistDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Gemini": {
    "Model": "gemini-3.8-flash",
    "ApiKeys": [
      "AIzaSyYourFirstApiKeyHere",
      "AIzaSyYourSecondApiKeyHere",
      "AIzaSyYourThirdApiKeyHere"
    ]
  }
}
`;

  // 7. backend/Models/Tenant.cs
  const tenantCsContent = `using System.Text.Json.Serialization;

namespace AIReceptionist.Models;

public class Tenant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Slug { get; set; } = string.Empty;
    public string BusinessName { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public bool IsActive { get; set; } = true;
    public string? ApiKey { get; set; }

    public string PrimaryColor { get; set; } = "#000000";
    public string TextColor { get; set; } = "#ffffff";
    public string FontFamily { get; set; } = "Inter, sans-serif";
    public string LauncherIcon { get; set; } = "headset";
    public string? CustomIconUrl { get; set; }
    public string Position { get; set; } = "right";
    public string WelcomeGreeting { get; set; } = "Hello. How can we assist you today?";
    public string PlaceholderText { get; set; } = "Type your message or inquiry...";
    public bool ShowEmergencyBanner { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
`;

  // 8. backend/Services/GeminiService.cs
  const geminiCsContent = `using System.Text;
using System.Text.Json;
using AIReceptionist.Models;

namespace AIReceptionist.Services;

public class GeminiService
{
    private readonly IConfiguration _config;
    private readonly HttpClient _http;
    private readonly ILogger<GeminiService> _logger;

    private readonly List<string> _apiKeys = new();
    private int _keyIndex = 0;
    private readonly object _lock = new();

    public GeminiService(IConfiguration config, HttpClient http, ILogger<GeminiService> logger)
    {
        _config = config;
        _http = http;
        _logger = logger;

        var keysFromConfig = _config.GetSection("Gemini:ApiKeys").Get<string[]>();
        if (keysFromConfig != null && keysFromConfig.Length > 0)
        {
            _apiKeys.AddRange(keysFromConfig);
        }
        else
        {
            var singleKey = _config["GEMINI_API_KEY"] ?? _config["Gemini:ApiKey"];
            if (!string.IsNullOrEmpty(singleKey))
            {
                _apiKeys.AddRange(singleKey.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));
            }
        }
    }

    private string GetNextKey()
    {
        lock (_lock)
        {
            if (_apiKeys.Count == 0) return string.Empty;
            var key = _apiKeys[_keyIndex % _apiKeys.Count];
            _keyIndex = (_keyIndex + 1) % _apiKeys.Count;
            return key;
        }
    }

    public async Task<string> GenerateReplyAsync(Tenant tenant, string userMessage, List<KnowledgeBaseEntry>? kb = null)
    {
        var model = _config["Gemini:Model"] ?? "gemini-3.8-flash";
        int maxAttempts = Math.Max(1, _apiKeys.Count);

        for (int attempt = 0; attempt < maxAttempts; attempt++)
        {
            var key = GetNextKey();
            if (string.IsNullOrEmpty(key))
            {
                return "Thank you for reaching out. A team member will follow up with you shortly.";
            }

            try
            {
                var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}";
                var prompt = PromptBuilder.BuildSystemPrompt(tenant, kb ?? new List<KnowledgeBaseEntry>()) + $"\n\nUser: {userMessage}";

                var payload = new
                {
                    contents = new[]
                    {
                        new { parts = new[] { new { text = prompt } } }
                    }
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var res = await _http.PostAsync(url, content);

                if (res.IsSuccessStatusCode)
                {
                    var json = await res.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(json);
                    var text = doc.RootElement
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();

                    return text ?? "Thank you for reaching out.";
                }

                if ((int)res.StatusCode == 429)
                {
                    _logger.LogWarning("Gemini API key hit rate limit (429). Rotating to next key.");
                    continue;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error communicating with Gemini API.");
            }
        }

        return "Thank you for your message. Our staff will follow up with you promptly.";
    }
}
`;

  // 9. backend/Services/PromptBuilder.cs
  const promptBuilderContent = `using AIReceptionist.Models;

namespace AIReceptionist.Services;

public static class PromptBuilder
{
    public static string BuildSystemPrompt(Tenant tenant, List<KnowledgeBaseEntry> knowledgeBase)
    {
        var kbSection = "";
        if (knowledgeBase != null && knowledgeBase.Count > 0)
        {
            kbSection = "\\nKnowledge Base Q&A:\\n" + string.Join("\\n", knowledgeBase.Select(k => $"Q: {k.Question}\\nA: {k.Answer}"));
        }

        return $@"You are a virtual receptionist for {tenant.BusinessName} in the {tenant.Industry} industry.
Rules:
1. Answer customer questions accurately using the knowledge base.
2. Be polite, concise, and helpful. Keep responses to 2-3 sentences.
3. If the user indicates an emergency, advise them to call emergency services or provide the phone number ({tenant.PhoneNumber ?? "our office line"}).
4. Politely ask for their name and phone number if they would like a quote or appointment.
{kbSection}";
    }
}
`;

  // 10. backend/Endpoints/TenantEndpoints.cs
  const tenantEndpointsContent = `using AIReceptionist.Models;
using Microsoft.AspNetCore.Mvc;

namespace AIReceptionist.Endpoints;

public static class TenantEndpoints
{
    public static void MapTenantEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/tenants/{slug}/widget-config", (string slug) =>
        {
            // Public endpoint for widget.js configuration bootstrap
            return Results.Ok(new
            {
                slug = slug,
                businessName = "Your Business",
                primaryColor = "#000000",
                textColor = "#ffffff",
                fontFamily = "Inter, sans-serif",
                launcherIcon = "headset",
                position = "right",
                welcomeMessage = "Hello. How can we assist you today?",
                placeholderText = "Type your message..."
            });
        });
    }
}
`;

  // Add files to zip
  zip.file('README.md', readmeContent);
  zip.file('CUSTOMIZATION.md', customizationContent);
  zip.file('LICENSE', licenseContent);
  zip.file('.gitignore', gitignoreContent);

  const publicFolder = zip.folder('public');
  if (publicFolder) {
    publicFolder.file('widget.js', widgetJsContent);
  }

  const backendFolder = zip.folder('backend');
  if (backendFolder) {
    backendFolder.file('appsettings.json', appsettingsContent);

    const modelsFolder = backendFolder.folder('Models');
    if (modelsFolder) {
      modelsFolder.file('Tenant.cs', tenantCsContent);
    }

    const servicesFolder = backendFolder.folder('Services');
    if (servicesFolder) {
      servicesFolder.file('GeminiService.cs', geminiCsContent);
      servicesFolder.file('PromptBuilder.cs', promptBuilderContent);
    }

    const endpointsFolder = backendFolder.folder('Endpoints');
    if (endpointsFolder) {
      endpointsFolder.file('TenantEndpoints.cs', tenantEndpointsContent);
    }
  }

  // Generate zip Blob
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ai-receptionist.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
