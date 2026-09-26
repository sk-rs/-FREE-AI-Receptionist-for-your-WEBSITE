# Code Customization Guide

This document details how developers and site owners can customize the AI Receptionist Widget directly in the code or HTML snippet.

---

## 1. Customizing in the HTML Embed Snippet

The fastest way to customize the widget without touching any JavaScript files is by setting `data-*` attributes directly on the `<script>` tag.

```html
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
```

---

## 2. Changing the Launcher Icon

The widget includes five built-in SVG icons that do not rely on external font libraries or emojis:

- `data-icon="bot"`: A clean modern robot icon.
- `data-icon="headset"`: A customer service / dispatch headset icon.
- `data-icon="message"`: A chat bubble icon.
- `data-icon="sparkles"`: An AI sparkle icon.
- `data-icon="phone"`: A phone receiver icon.

### Using a Custom Logo or Avatar Image
To use your own company logo or avatar instead of an SVG icon, supply the image URL:
```html
<script
  src="https://your-domain.com/widget.js"
  data-icon-url="https://your-site.com/avatar.png"
  async
></script>
```

---

## 3. Changing the Color Scheme

The widget supports any valid CSS hex code, RGB, or HSL value:

- `data-color`: Controls the floating launcher button, the chat window header, and user chat bubbles.
  - Classic Black: `data-color="#000000"`
  - Modern Indigo: `data-color="#4f46e5"`
  - High-Trust Emerald: `data-color="#059669"`
  - Slate Dark: `data-color="#0f172a"`
- `data-text-color`: Controls the text and icon color inside the header and launcher.
  - White on dark background: `data-text-color="#ffffff"`
  - Black on light background: `data-text-color="#000000"`

---

## 4. Changing Typography and Font

The `data-font` attribute accepts any valid CSS font stack:

```html
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
```

---

## 5. Changing Screen Placement

Choose which corner of the browser the widget anchors to:

- Bottom-Right (Standard):
  ```html
  data-position="right"
  ```
- Bottom-Left (Ideal if you have existing bottom-right support badges):
  ```html
  data-position="left"
  ```

---

## 6. Changing Default Settings Inside `public/widget.js`

If you are hosting `widget.js` yourself, open `public/widget.js` and edit lines 25 to 40:

```javascript
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
```

---

## 7. Customizing the Backend AI Responses

### In the C# Backend (`backend/Services/PromptBuilder.cs`)
You can adjust the system prompt that guides Gemini:
```csharp
public static class PromptBuilder
{
    public static string BuildSystemPrompt(Tenant tenant, List<KnowledgeBaseEntry> knowledgeBase)
    {
        return $@"You are a friendly, professional virtual receptionist for {tenant.BusinessName}.
- Answer questions accurately using the knowledge base.
- Treat emergencies (floods, no heat, gas odors) with immediate priority.
- Collect visitor name, phone number, and brief issue description.
- Keep responses short and conversational (2-3 sentences max).";
    }
}
```

### In the Node.js Server (`server.ts`)
Look for the `systemPrompt` variable in `server.ts` to adjust the model's instructions and tone.
