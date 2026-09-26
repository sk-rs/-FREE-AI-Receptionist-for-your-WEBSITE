using System.Text.Json.Serialization;

namespace AIReceptionist.Models;

public class Tenant
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // URL slug for embed script and public routing, e.g. "joes-hvac"
    public string Slug { get; set; } = string.Empty;

    public string BusinessName { get; set; } = string.Empty;

    public string Industry { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Customization Settings
    public string PrimaryColor { get; set; } = "#4f46e5";
    public string TextColor { get; set; } = "#ffffff";
    public string FontFamily { get; set; } = "Inter, -apple-system, sans-serif";
    public string LauncherIcon { get; set; } = "bot"; // "bot", "message", "headset", "sparkles", "phone", "custom"
    public string? CustomIconUrl { get; set; }
    public string Position { get; set; } = "bottom-right"; // "bottom-right", "bottom-left"
    public string WelcomeMessage { get; set; } = "Hello! How can we assist you today?";
    public string PlaceholderText { get; set; } = "Type your message or inquiry...";

    public List<KnowledgeBaseEntry> KnowledgeBase { get; set; } = new();
    public List<Conversation> Conversations { get; set; } = new();

    public string ApiKey { get; set; } = Guid.NewGuid().ToString("N");
}
