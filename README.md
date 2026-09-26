# AI Receptionist Widget

An ultra-lightweight (under 14KB), zero-dependency, open-source AI receptionist widget that can be embedded into any website to answer visitor questions 24/7, triage emergencies, and capture leads.

Supported Platforms: WordPress, Shopify, Squarespace, Webflow, and custom HTML/JavaScript websites.

License: MIT

---

## Frequently Asked Questions

### Does this widget slow down website load times?
No. `widget.js` is under 14KB minified and has zero external dependencies (no jQuery, React, or large CSS frameworks required on the client site). It loads asynchronously with the `async` attribute, ensuring it never blocks initial DOM parsing, First Contentful Paint (FCP), or page rendering.

### How does API key cycling and rate-limit failover work?
Free-tier Google Gemini API keys can hit HTTP 429 (`RESOURCE_EXHAUSTED`) during concurrent traffic spikes. The included backend services (both Node.js and .NET) feature automatic multi-key round-robin cycling. If a key encounters a rate limit, it is placed on a 90-second cooldown and the request is transparently retried using the next healthy key in your pool.

### How does automatic lead qualification and extraction work?
As visitors converse with the AI receptionist, the system continuously analyzes message context and applies structured extraction prompts and regex evaluators to identify contact details (name, email, phone number) and urgency indicators. Qualified leads are saved to your database and can be retrieved via the `/api/tenants/{tenantSlug}/conversations` endpoint.

### Is the widget mobile responsive?
Yes. On desktop displays, the chat window floats unobtrusively in the bottom-right or bottom-left corner of the viewport. On mobile screens (under 640px), the widget adapts into a full-height touch sheet with smooth scrolling and responsive virtual keyboard spacing.

### Can I self-host both the backend and widget assets?
Yes. Everything in this repository is 100% open-source under the MIT license. You can host `widget.js` on your own CDN (or serve it from static storage like Cloudflare R2, AWS S3, or your web server) and run either the Node.js (`server.ts`) or .NET (`backend/`) backend on any cloud provider or VPS.

---

## 1. Quickstart: 60-Second Embed

To embed the widget into any website, paste this snippet right before the closing `</body>` tag:

```html
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
```

---

## 2. Code Customization Guide

### Option A: Customizing via Script Tag Attributes (No Code Editing)

| Attribute | Type | Allowed Values / Examples | Description |
| :--- | :--- | :--- | :--- |
| `data-business` | string | `"Summit Heating & Air"` | Company name displayed in the header. |
| `data-industry` | string | `"HVAC"`, `"Dental"`, `"Legal"` | Industry vertical. |
| `data-color` | hex code | `"#000000"`, `"#4f46e5"`, `"#059669"` | Launcher button and header background color. |
| `data-text-color`| hex code | `"#ffffff"`, `"#000000"` | Header text and launcher icon color. |
| `data-font` | string | `"Inter, sans-serif"`, `"Arial"` | Font family applied to all widget text. |
| `data-icon` | string | `"bot"`, `"headset"`, `"message"`, `"sparkles"`, `"phone"` | Launcher icon shape. |
| `data-icon-url` | URL string | `"https://site.com/logo.png"` | Optional direct URL to a custom logo/avatar image. |
| `data-position` | string | `"right"`, `"left"` | Corner placement on screen. |
| `data-greeting` | string | `"Hello. How can we assist you today?"` | Initial greeting message shown to visitors. |
| `data-placeholder`| string | `"Type your message..."` | Text inside the chat input box. |
| `data-api` | URL string | `"https://api.yourdomain.com/api/chat"` | Backend chat endpoint. |

### Option B: Customizing via JavaScript Object

Add this configuration script before loading `widget.js`:

```html
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
```

### Option C: Customizing Directly in `widget.js`

If you are hosting `widget.js` yourself, you can change the default values directly inside `public/widget.js` around line 25:

```javascript
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
```

---

## 3. Platform-by-Platform Setup

### WordPress
1. Log in to your WordPress admin panel.
2. Go to **Plugins > Add New** and install **WPCode** (Insert Headers and Footers).
3. Go to **Code Snippets > Header & Footer**.
4. In the **Footer** section, paste the `<script>` tag.
5. Click **Save Changes**.

### Shopify
1. In your Shopify admin, go to **Online Store > Themes**.
2. Click **... > Edit code**.
3. Under **Layout**, click **`theme.liquid`**.
4. Scroll to the bottom and locate `</body>`.
5. Paste the `<script>` snippet directly above `</body>`.
6. Click **Save**.

### Squarespace
1. In your Squarespace menu, go to **Settings > Advanced > Code Injection** (or **Website Tools > Code Injection**).
2. Paste the `<script>` snippet into the **Footer** field.
3. Click **Save**.

### Webflow
1. In Webflow, open **Project Settings > Custom Code**.
2. Paste the `<script>` snippet into **Footer Code** (before `</body>`).
3. Click **Save Changes** and publish.

---

## 4. Backend Setup & Gemini API Key Cycling

Free-tier LLM API keys can hit HTTP 429 (`RESOURCE_EXHAUSTED`) during traffic bursts. The backend includes automated round-robin cycling across multiple Gemini API keys with 90-second cooldown failover.

### Option A: ASP.NET Core Backend (C# in `/backend`)
1. Open `backend/appsettings.json`.
2. Add your Gemini keys in the `Gemini:ApiKeys` array:
   ```json
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
   ```
3. Run `dotnet run` from the `/backend` folder.

### Option B: Node.js / Express Backend (`server.ts`)
1. Create a `.env` file in the project root:
   ```env
   # Comma-separated list for multi-key cycling
   GEMINI_API_KEYS="AIzaSyKey1...,AIzaSyKey2...,AIzaSyKey3..."
   GEMINI_API_KEY="AIzaSyDefault..."
   ```
2. Run `npm install` and `npm run dev`.

---

## 5. Repository Structure

```
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
```

---

## 6. Open-Source License & Distribution

Distributed under the **MIT License**.

This project is built for open-source developer distribution via passive visibility (public GitHub repository, technical documentation, Show HN, Reddit r/SideProject, and Product Hunt) without paid advertisements or commercial solicitation.
