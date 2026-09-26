/**
 * AI Receptionist Standalone Embeddable Widget
 * License: MIT
 * Zero dependencies, pure vanilla JavaScript
 */
(function() {
  'use strict';

  if (window.__AI_RECEPTIONIST_LOADED__) return;
  window.__AI_RECEPTIONIST_LOADED__ = true;

  // Retrieve configuration from current script tag attributes or global object
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('widget.js') !== -1) {
        return scripts[i];
      }
    }
    return scripts[scripts.length - 1];
  })();

  var userConfig = window.AIReceptionistConfig || {};

  var config = {
    slug: (currentScript && currentScript.getAttribute('data-slug')) || userConfig.slug || '',
    businessName: (currentScript && currentScript.getAttribute('data-business')) || userConfig.businessName || 'Customer Support',
    industry: (currentScript && currentScript.getAttribute('data-industry')) || userConfig.industry || 'Service',
    primaryColor: (currentScript && currentScript.getAttribute('data-color')) || userConfig.primaryColor || '#4f46e5',
    textColor: (currentScript && currentScript.getAttribute('data-text-color')) || userConfig.textColor || '#ffffff',
    fontFamily: (currentScript && currentScript.getAttribute('data-font')) || userConfig.fontFamily || 'Inter, -apple-system, sans-serif',
    iconType: (currentScript && currentScript.getAttribute('data-icon')) || userConfig.iconType || 'bot',
    customIconUrl: (currentScript && currentScript.getAttribute('data-icon-url')) || userConfig.customIconUrl || '',
    position: (currentScript && currentScript.getAttribute('data-position')) || userConfig.position || 'right',
    welcomeMessage: (currentScript && currentScript.getAttribute('data-greeting')) || userConfig.welcomeMessage || 'Hello. How can we assist you today?',
    placeholderText: (currentScript && currentScript.getAttribute('data-placeholder')) || userConfig.placeholderText || 'Type your message or inquiry...',
    apiUrl: (currentScript && currentScript.getAttribute('data-api')) || userConfig.apiUrl || '/api/chat',
    tenantKey: (currentScript && currentScript.getAttribute('data-tenant-key')) || userConfig.tenantKey || ''
  };

  // SVGs for launcher icons (no emojis)
  var ICONS = {
    bot: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
    message: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    headset: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>',
    sparkles: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
    phone: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    send: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>'
  };

  function getLauncherIconSvg(type, customUrl) {
    if (customUrl) {
      return '<img src="' + customUrl + '" alt="Chat" style="width:28px;height:28px;border-radius:50%;object-fit:cover;" />';
    }
    return ICONS[type] || ICONS.bot;
  }

  // Inject Stylesheet
  var style = document.createElement('style');
  style.id = 'ai-receptionist-styles';
  style.innerHTML = [
    '#ai-receptionist-root { position: fixed; z-index: 2147483640; bottom: 24px; font-family: ' + config.fontFamily + '; }',
    '#ai-receptionist-root.pos-right { right: 24px; }',
    '#ai-receptionist-root.pos-left { left: 24px; }',
    '#ai-receptionist-launcher { width: 56px; height: 56px; border-radius: 50%; box-shadow: 0 8px 24px rgba(0,0,0,0.2); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; outline: none; transition: transform 0.2s ease, box-shadow 0.2s ease; position: relative; }',
    '#ai-receptionist-launcher:hover { transform: scale(1.06); box-shadow: 0 12px 30px rgba(0,0,0,0.25); }',
    '#ai-receptionist-launcher:active { transform: scale(0.95); }',
    '#ai-receptionist-launcher .online-dot { position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; background: #22c55e; border: 2px solid #ffffff; border-radius: 50%; }',
    '#ai-receptionist-window { display: none; width: 380px; max-width: calc(100vw - 32px); height: 550px; max-height: calc(100vh - 100px); background: #ffffff; border-radius: 16px; box-shadow: 0 16px 36px rgba(0,0,0,0.2); border: 1px solid rgba(0,0,0,0.08); flex-direction: column; overflow: hidden; margin-bottom: 12px; transition: opacity 0.2s ease; }',
    '#ai-receptionist-window.is-open { display: flex; }',
    '#ai-receptionist-header { padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; }',
    '#ai-receptionist-header .title-area { display: flex; flex-direction: column; }',
    '#ai-receptionist-header .business-name { font-weight: 700; font-size: 15px; line-height: 1.2; }',
    '#ai-receptionist-header .status-line { font-size: 11px; opacity: 0.85; margin-top: 3px; display: flex; align-items: center; gap: 5px; }',
    '#ai-receptionist-header .status-indicator { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; display: inline-block; }',
    '#ai-receptionist-header .close-btn { background: none; border: none; color: inherit; cursor: pointer; padding: 4px; border-radius: 6px; display: flex; align-items: center; justify-content: center; opacity: 0.85; }',
    '#ai-receptionist-header .close-btn:hover { opacity: 1; background: rgba(255,255,255,0.15); }',
    '#ai-receptionist-body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f8fafc; font-size: 13.5px; line-height: 1.45; }',
    '#ai-receptionist-body .msg { max-width: 82%; padding: 9px 13px; border-radius: 14px; word-break: break-word; }',
    '#ai-receptionist-body .msg.ai { align-self: flex-start; background: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; border-bottom-left-radius: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }',
    '#ai-receptionist-body .msg.user { align-self: flex-end; color: #ffffff; border-bottom-right-radius: 2px; }',
    '#ai-receptionist-body .msg.loading { align-self: flex-start; background: #ffffff; color: #94a3b8; border: 1px solid #e2e8f0; border-bottom-left-radius: 2px; font-style: italic; }',
    '#ai-receptionist-footer { display: flex; padding: 10px 12px; background: #ffffff; border-top: 1px solid #e2e8f0; gap: 8px; align-items: center; }',
    '#ai-receptionist-input { flex: 1; border: 1px solid #cbd5e1; border-radius: 20px; padding: 8px 14px; font-size: 13px; outline: none; font-family: inherit; }',
    '#ai-receptionist-input:focus { border-color: ' + config.primaryColor + '; }',
    '#ai-receptionist-send-btn { width: 36px; height: 36px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #ffffff; outline: none; transition: opacity 0.2s; }',
    '#ai-receptionist-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }'
  ].join('\n');
  document.head.appendChild(style);

  // Build DOM Structure
  var root = document.createElement('div');
  root.id = 'ai-receptionist-root';
  root.className = config.position === 'left' ? 'pos-left' : 'pos-right';

  root.innerHTML = [
    '<div id="ai-receptionist-window">',
    '  <div id="ai-receptionist-header" style="background-color:' + config.primaryColor + '; color:' + config.textColor + ';">',
    '    <div class="title-area">',
    '      <div class="business-name">' + escapeHtml(config.businessName) + '</div>',
    '      <div class="status-line"><span class="status-indicator"></span> 24/7 Virtual Receptionist</div>',
    '    </div>',
    '    <button class="close-btn" id="ai-receptionist-close-btn" aria-label="Close Chat">' + ICONS.close + '</button>',
    '  </div>',
    '  <div id="ai-receptionist-body">',
    '    <div class="msg ai">' + escapeHtml(config.welcomeMessage) + '</div>',
    '  </div>',
    '  <form id="ai-receptionist-footer">',
    '    <input type="text" id="ai-receptionist-input" placeholder="' + escapeHtml(config.placeholderText) + '" autocomplete="off" />',
    '    <button type="submit" id="ai-receptionist-send-btn" style="background-color:' + config.primaryColor + ';" aria-label="Send Message">' + ICONS.send + '</button>',
    '  </form>',
    '</div>',
    '<button id="ai-receptionist-launcher" style="background-color:' + config.primaryColor + '; color:' + config.textColor + ';" aria-label="Open Chat">',
    '  <span id="ai-receptionist-launcher-icon">' + getLauncherIconSvg(config.iconType, config.customIconUrl) + '</span>',
    '  <span class="online-dot"></span>',
    '</button>'
  ].join('');

  document.body.appendChild(root);

  // References
  var launcher = document.getElementById('ai-receptionist-launcher');
  var win = document.getElementById('ai-receptionist-window');
  var closeBtn = document.getElementById('ai-receptionist-close-btn');
  var form = document.getElementById('ai-receptionist-footer');
  var input = document.getElementById('ai-receptionist-input');
  var body = document.getElementById('ai-receptionist-body');

  var history = [];

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Toggle Window
  launcher.addEventListener('click', function() {
    var isOpen = win.classList.toggle('is-open');
    if (isOpen) {
      input.focus();
    }
  });

  closeBtn.addEventListener('click', function() {
    win.classList.remove('is-open');
  });

  // Handle Form Submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;

    input.value = '';

    // Append User Bubble
    var userBubble = document.createElement('div');
    userBubble.className = 'msg user';
    userBubble.style.backgroundColor = config.primaryColor;
    userBubble.textContent = text;
    body.appendChild(userBubble);
    body.scrollTop = body.scrollHeight;

    // Loading Indicator
    var loadingBubble = document.createElement('div');
    loadingBubble.className = 'msg loading';
    loadingBubble.textContent = 'Typing response...';
    body.appendChild(loadingBubble);
    body.scrollTop = body.scrollHeight;

    // Build Request Payload
    var payload = {
      message: text,
      history: history,
      tenantConfig: {
        slug: config.slug,
        businessName: config.businessName,
        industry: config.industry
      }
    };

    var headers = {
      'Content-Type': 'application/json'
    };
    if (config.tenantKey) {
      headers['X-Tenant-Key'] = config.tenantKey;
    }

    fetch(config.apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    .then(function(res) {
      if (!res.ok) throw new Error('Network error: ' + res.status);
      return res.json();
    })
    .then(function(data) {
      if (loadingBubble.parentNode) {
        body.removeChild(loadingBubble);
      }
      var reply = data.reply || data.aiMessage && data.aiMessage.content || 'Thank you for your message. Our staff will follow up shortly.';
      var aiBubble = document.createElement('div');
      aiBubble.className = 'msg ai';
      aiBubble.textContent = reply;
      body.appendChild(aiBubble);
      body.scrollTop = body.scrollHeight;

      history.push({ role: 'user', content: text });
      history.push({ role: 'assistant', content: reply });
    })
    .catch(function(err) {
      if (loadingBubble.parentNode) {
        body.removeChild(loadingBubble);
      }
      var errorBubble = document.createElement('div');
      errorBubble.className = 'msg ai';
      errorBubble.textContent = 'Thank you for reaching out. We received your note and will follow up with you promptly.';
      body.appendChild(errorBubble);
      body.scrollTop = body.scrollHeight;
    });
  });

  // Optional: Auto-fetch remote tenant config if data-slug is specified
  if (config.slug && config.apiUrl) {
    var baseApi = config.apiUrl.replace(/\/chat\/?$/, '');
    var tenantConfigUrl = baseApi + '/tenants/' + encodeURIComponent(config.slug) + '/widget-config';
    fetch(tenantConfigUrl)
      .then(function(res) { return res.json(); })
      .then(function(remote) {
        if (remote) {
          if (remote.primaryColor) {
            config.primaryColor = remote.primaryColor;
            launcher.style.backgroundColor = remote.primaryColor;
            document.getElementById('ai-receptionist-header').style.backgroundColor = remote.primaryColor;
            document.getElementById('ai-receptionist-send-btn').style.backgroundColor = remote.primaryColor;
          }
          if (remote.businessName) {
            config.businessName = remote.businessName;
            document.querySelector('#ai-receptionist-header .business-name').textContent = remote.businessName;
          }
          if (remote.launcherIcon) {
            config.iconType = remote.launcherIcon;
            document.getElementById('ai-receptionist-launcher-icon').innerHTML = getLauncherIconSvg(remote.launcherIcon, remote.customIconUrl);
          }
        }
      })
      .catch(function() {
        // Fall back to script attributes
      });
  }
})();
