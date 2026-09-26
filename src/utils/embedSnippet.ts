import { WidgetConfig } from '../types';

export function getScriptSnippet(config: WidgetConfig, hostUrl?: string): string {
  const host = hostUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com');

  return `<!-- AI Receptionist Widget (Open-Source) -->
<script
  src="${host}/widget.js"
  data-business="${escapeHtml(config.businessName)}"
  data-industry="${escapeHtml(config.industry)}"
  data-color="${config.primaryColor}"
  data-position="${config.position === 'bottom-left' ? 'left' : 'right'}"
  data-api="${host}/api/chat"
  async
></script>`;
}

export function getInlineConfigSnippet(config: WidgetConfig, hostUrl?: string): string {
  const host = hostUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com');

  return `<!-- AI Receptionist - Advanced Config Setup -->
<script>
  window.AIReceptionistConfig = {
    businessName: ${JSON.stringify(config.businessName)},
    industry: ${JSON.stringify(config.industry)},
    receptionistName: ${JSON.stringify(config.receptionistName)},
    primaryColor: ${JSON.stringify(config.primaryColor)},
    position: ${JSON.stringify(config.position === 'bottom-left' ? 'left' : 'right')},
    fontFamily: ${JSON.stringify(config.fontFamily)},
    apiUrl: "${host}/api/chat",
    quickChips: ${JSON.stringify(config.quickChips)}
  };
</script>
<script src="${host}/widget.js" async></script>`;
}

export function getWordPressGuide(config: WidgetConfig, hostUrl?: string): string {
  const scriptTag = getScriptSnippet(config, hostUrl);
  return `### Method 1: Using "WPCode" Plugin (Recommended for Non-Developers)
1. In your WordPress Admin, go to **Plugins > Add New** and search for **WPCode** (Insert Headers and Footers).
2. Install & Activate **WPCode**.
3. Go to **Code Snippets > Header & Footer**.
4. Paste the following into the **Footer** section:

\`\`\`html
${scriptTag}
\`\`\`

5. Click **Save Changes**. The widget is now active across all your pages!

---

### Method 2: Via Child Theme \`functions.php\` (For Developers)
Add this snippet to your child theme's \`functions.php\`:

\`\`\`php
function add_ai_receptionist_widget() {
    ?>
    ${scriptTag}
    <?php
}
add_action('wp_footer', 'add_ai_receptionist_widget');
\`\`\``;
}

export function getShopifyGuide(config: WidgetConfig, hostUrl?: string): string {
  const scriptTag = getScriptSnippet(config, hostUrl);
  return `### Step-by-Step Shopify Integration
1. Log into your **Shopify Admin Dashboard**.
2. Navigate to **Online Store > Themes**.
3. On your active theme, click the **... (three dots)** button and select **Edit code**.
4. In the left file tree under **Layout**, click **\`theme.liquid\`**.
5. Scroll down to the bottom of the file to find the closing \`</body>\` tag.
6. Paste the following snippet directly above \`</body>\`:

\`\`\`html
${scriptTag}
\`\`\`

7. Click **Save**. Open your storefront in a new tab to test your live AI receptionist!`;
}

export function getSquarespaceGuide(config: WidgetConfig, hostUrl?: string): string {
  const scriptTag = getScriptSnippet(config, hostUrl);
  return `### Step-by-Step Squarespace Integration
1. Log into your **Squarespace** site dashboard.
2. Go to **Settings > Developer Tools > Code Injection** (or **Website Tools > Code Injection** on newer Squarespace versions).
3. Scroll down to the **Footer** injection box.
4. Paste this snippet into the **Footer** field:

\`\`\`html
${scriptTag}
\`\`\`

5. Click **Save** in the top left corner.
*(Note: Code Injection requires Squarespace Business or Commerce plan).*`;
}

export function getWebflowGuide(config: WidgetConfig, hostUrl?: string): string {
  const scriptTag = getScriptSnippet(config, hostUrl);
  return `### Step-by-Step Webflow Integration
1. Open your project in the **Webflow Designer**.
2. Click the **Webflow Logo** in top-left and select **Project Settings**.
3. Navigate to the **Custom Code** tab.
4. Scroll to **Footer Code** (Before \`</body>\` tag).
5. Paste the snippet:

\`\`\`html
${scriptTag}
\`\`\`

6. Click **Save Changes**, then click **Publish > Publish to Selected Domains**.`;
}

export function getReactSnippet(config: WidgetConfig, hostUrl?: string): string {
  const host = hostUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com');

  return `import React, { useEffect } from 'react';

export function AIReceptionist() {
  useEffect(() => {
    // Avoid double loading in StrictMode
    if (document.getElementById('ai-receptionist-script')) return;

    window.AIReceptionistConfig = {
      businessName: ${JSON.stringify(config.businessName)},
      industry: ${JSON.stringify(config.industry)},
      primaryColor: ${JSON.stringify(config.primaryColor)},
      position: ${JSON.stringify(config.position === 'bottom-left' ? 'left' : 'right')},
      apiUrl: '${host}/api/chat'
    };

    const script = document.createElement('script');
    script.id = 'ai-receptionist-script';
    script.src = '${host}/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById('ai-receptionist-widget');
      if (existing) existing.remove();
    };
  }, []);

  return null;
}`;
}

function escapeHtml(str: string): string {
  return str.replace(/"/g, '&quot;');
}
