# AI Receptionist Widget

An ultra-lightweight (under 14KB), zero-dependency, open-source AI receptionist widget that can be embedded into any website to answer visitor questions 24/7, triage emergencies, and capture leads.

Supported Platforms: WordPress, Shopify, Squarespace, Webflow, and custom HTML/JavaScript websites.

License: MIT

---

## Frequently Asked Questions

### Can users embed this without having the full code?
Yes. A website owner only needs one script tag:
```html
<script src="https://your-domain.com/widget.js" data-business="Summit Heating" data-color="#000000" async></script>
```
They do not need to download or install the full repository on their website. The standalone `widget.js` script handles rendering the launcher button, the floating chat window, animations, and message bubbles.

### What code do they need from you?
1. The client script: `public/widget.js` (under 14KB, zero dependencies).
2. An API endpoint: The widget sends user messages to a backend that holds the Gemini API key. They can either:
   - Use your hosted API endpoint URL in the `data-api` attribute.
   - Or self-host the included backend (either the C# ASP.NET Core service in `/backend` or the Node.js server in `server.ts`).

### How do users change the icon, font, color, and greeting?
They can customize everything directly in the HTML snippet without modifying any code, or by editing the default values inside `widget.js`. See Section 3 below.

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
