import { WidgetConfig } from '../types';

export function generateReadmeMarkdown(config: WidgetConfig, hostUrl?: string): string {
  const host = hostUrl || 'https://your-domain.com';

  return `# AI Receptionist Widget

An ultra-lightweight (under 14KB), zero-dependency, open-source AI receptionist widget designed for local business websites to capture inquiries, answer common questions, and qualify visitor leads around the clock.

Supported Platforms: WordPress, Shopify, Squarespace, Webflow, and standard HTML/JavaScript web applications. Powered by Google Gemini with automated Multi-Key Cycling and fallback resilience.

License: MIT

---

## 1. Overview

Most visitors to contractor, dental, clinic, legal, and professional service websites bounce without submitting a contact form or calling. The AI Receptionist Widget is an open-source, embeddable script that mounts on any website, answers visitor questions from an authenticated knowledge base, and captures visitor names, phone numbers, and job descriptions into structured leads.

Key characteristics:
- Standalone: Zero external runtime dependencies (no jQuery, no bulky UI frameworks).
- Asynchronous and fast: Under 14KB transfer footprint; does not block page rendering or affect Core Web Vitals.
- Multi-Key Rotation: Automatically cycles through a pool of Gemini API keys to eliminate HTTP 429 quota exhaustion during traffic spikes.
- Full Visual Customization: Configure launcher icon, typography, colors, position, and welcome messaging.

---

## 2. Quickstart Embed Snippet

Paste this script tag directly before the closing \`</body>\` tag on any webpage:

\`\`\`html
<!-- AI Receptionist Widget -->
<script
  src="${host}/widget.js"
  data-business="${config.businessName}"
  data-industry="${config.industry}"
  data-color="${config.primaryColor}"
  data-font="${config.fontFamily}"
  data-icon="${config.iconType}"
  data-position="${config.position === 'bottom-left' ? 'left' : 'right'}"
  data-greeting="${config.welcomeGreeting}"
  data-api="${host}/api/chat"
  async
></script>
\`\`\`

---

## 3. Customization API

All visual and behavioral properties can be configured via \`data-*\` attributes on the \`<script>\` tag or via the \`window.AIReceptionistConfig\` object.

### Supported Script Tag Attributes

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`data-business\` | string | \`"Customer Support"\` | Company or practice name shown in the widget header. |
| \`data-industry\` | string | \`"Service"\` | Industry vertical (e.g. "HVAC & Plumbing", "Dental", "Legal"). |
| \`data-color\` | hex color | \`"#4f46e5"\` | Primary brand color for launcher button, header, and user bubbles. |
| \`data-text-color\`| hex color | \`"#ffffff"\` | Header and launcher text/icon color. |
| \`data-font\` | string | \`"Inter, sans-serif"\` | CSS font family applied to widget text and inputs. |
| \`data-icon\` | string | \`"bot"\` | Launcher icon: \`"bot"\`, \`"message"\`, \`"headset"\`, \`"sparkles"\`, \`"phone"\`. |
| \`data-icon-url\` | URL string | \`""\` | Optional direct URL to a custom logo or PNG/SVG avatar. |
| \`data-position\` | string | \`"right"\` | Corner alignment: \`"right"\` or \`"left"\`. |
| \`data-greeting\` | string | \`"Hello..."\` | Initial welcome message displayed in the chat body. |
| \`data-placeholder\`| string | \`"Type..."\` | Placeholder text inside the message input field. |
| \`data-api\` | URL string | \`"/api/chat"\` | Backend endpoint handling chat completions. |
| \`data-slug\` | string | \`""\` | Optional tenant slug to load remote branding from database. |

### Global JavaScript Configuration Object

Alternatively, define \`window.AIReceptionistConfig\` before \`widget.js\` loads:

\`\`\`html
<script>
  window.AIReceptionistConfig = {
    businessName: "${config.businessName}",
    industry: "${config.industry}",
    primaryColor: "${config.primaryColor}",
    fontFamily: "${config.fontFamily}",
    iconType: "${config.iconType}",
    position: "${config.position === 'bottom-left' ? 'left' : 'right'}",
    welcomeMessage: "${config.welcomeGreeting}",
    apiUrl: "${host}/api/chat"
  };
</script>
<script src="${host}/widget.js" async></script>
\`\`\`

---

## 4. CMS Integration Guides

### WordPress Integration

#### Option A: Using the WPCode Plugin (Recommended for Non-Developers)
1. In your WordPress administrator dashboard, navigate to **Plugins > Add New**.
2. Search for **WPCode** (Insert Headers and Footers), then click **Install Now** and **Activate**.
3. In the left navigation menu, go to **Code Snippets > Header & Footer**.
4. Scroll to the **Footer** section.
5. Paste your \`<script>\` snippet into the textarea:
   \`\`\`html
   <script
     src="${host}/widget.js"
     data-business="${config.businessName}"
     data-color="${config.primaryColor}"
     data-api="${host}/api/chat"
     async
   ></script>
   \`\`\`
6. Click **Save Changes**. The widget is now active across all public pages.

#### Option B: Via Child Theme functions.php
Add this hook to your active child theme's \`functions.php\`:
\`\`\`php
function enqueue_ai_receptionist_widget() {
    ?>
    <script
      src="${host}/widget.js"
      data-business="${config.businessName}"
      data-color="${config.primaryColor}"
      data-api="${host}/api/chat"
      async
    ></script>
    <?php
}
add_action('wp_footer', 'enqueue_ai_receptionist_widget');
\`\`\`

---

### Shopify Integration

1. Log into your **Shopify Admin**.
2. Navigate to **Online Store > Themes**.
3. Next to your active theme, click the **Actions (...)** button and select **Edit code**.
4. In the file explorer on the left under **Layout**, click **theme.liquid**.
5. Scroll to the bottom of the template and locate the closing \`</body>\` tag.
6. Insert the widget snippet directly above \`</body>\`:
   \`\`\`html
   <script
     src="${host}/widget.js"
     data-business="{{ shop.name }}"
     data-color="${config.primaryColor}"
     data-api="${host}/api/chat"
     async
   ></script>
   \`\`\`
7. Click **Save**.

---

### Squarespace Integration

1. Log into your **Squarespace** account and open your website settings.
2. Navigate to **Website Tools > Code Injection** (or **Settings > Advanced > Code Injection**).
3. In the **Footer** code block, paste:
   \`\`\`html
   <script
     src="${host}/widget.js"
     data-business="${config.businessName}"
     data-color="${config.primaryColor}"
     data-api="${host}/api/chat"
     async
   ></script>
   \`\`\`
4. Click **Save**.

---

### Webflow Integration

1. Open your project in the **Webflow Designer**.
2. Open **Project Settings** from the top-left menu.
3. Select the **Custom Code** tab.
4. Scroll to **Footer Code** (Before \`</body>\` tag).
5. Paste your \`<script>\` snippet and click **Save Changes**.
6. Publish to your production domain.

---

## 5. Multi-API Key Cycling Engine

Free-tier LLM API keys can experience HTTP 429 (\`RESOURCE_EXHAUSTED\`) during traffic spikes. The AI Receptionist includes server-side key rotation across multiple Gemini API keys.

### Rotation Mechanics:
1. **Round-Robin Cycling:** Every incoming request cycles to the next key in the pool, distributing request limits evenly.
2. **Automated Cooldown on 429:** When a key encounters a rate limit or quota ceiling, the backend places that specific key on a 90-second cooldown and automatically retries the request with the next healthy key in the pool.
3. **Safety Fallback:** If all keys are cooling down simultaneously, the system falls back to regex lead capture and local knowledge base lookup, ensuring visitor messages are never dropped.

### Backend Configuration (.NET / C# in backend/appsettings.json):
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

### Backend Configuration (Node.js in .env):
\`\`\`env
# Comma-separated list of keys
GEMINI_API_KEYS="AIzaSyKey1...,AIzaSyKey2...,AIzaSyKey3..."

# Standard single key fallback
GEMINI_API_KEY="AIzaSyDefault..."
\`\`\`

---

## 6. Repository Architecture

\`\`\`
/
|-- public/
|   \`-- widget.js             # Standalone vanilla JS embed script (<14KB)
|-- backend/                  # ASP.NET Core EF Core backend implementation
|   |-- Models/
|   |   \`-- Tenant.cs         # Tenant model with customization fields
|   |-- Endpoints/
|   |   |-- TenantEndpoints.cs
|   |   \`-- ConversationEndpoints.cs
|   |-- Services/
|   |   |-- GeminiService.cs  # Multi-key cycling and retry logic
|   |   |-- PromptBuilder.cs
|   |   \`-- RegexLeadExtractor.cs
|   \`-- appsettings.json
|-- server.ts                 # Node.js / Express proxy server with key rotation
|-- src/                      # Interactive testbed and configuration utility
|-- README.md                 # Complete documentation
\`-- LICENSE                   # MIT License
\`\`\`

---

## 7. Open-Source Distribution & Compliance

This repository is maintained as an open-source technical resource and research project under the MIT License.

Distribution Strategy:
- Passive Visibility: Public publication on GitHub, technical write-ups on developer forums (Hacker News "Show HN", Reddit r/SideProject, r/webdev, Product Hunt).
- No Advertising: This project relies on organic developer adoption without paid commercial campaigns, customer solicitation, or targeted advertising.
- Licensing: Full permission to self-host, fork, modify, and redistribute under standard MIT terms.
`;
}
