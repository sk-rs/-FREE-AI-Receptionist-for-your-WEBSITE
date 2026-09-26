import React, { useState } from 'react';
import { FileCode, FileText, Copy, Check, Download, Folder, File, ExternalLink } from 'lucide-react';
import { WidgetConfig } from '../types';
import { generateReadmeMarkdown } from '../utils/readmeContent';
import {
  getScriptSnippet,
  getWordPressGuide,
  getShopifyGuide,
  getSquarespaceGuide,
  getWebflowGuide
} from '../utils/embedSnippet';

interface RepoFilesViewerProps {
  config: WidgetConfig;
}

export const RepoFilesViewer: React.FC<RepoFilesViewerProps> = ({ config }) => {
  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  const files: { [key: string]: { path: string; language: string; content: string; description: string } } = {
    'widget.js': {
      path: 'public/widget.js',
      language: 'javascript',
      description: 'Zero-dependency standalone embed script for any website.',
      content: `/**
 * AI Receptionist Standalone Embeddable Widget
 * License: MIT
 * Zero dependencies, pure vanilla JavaScript
 */
(function() {
  'use strict';

  if (window.__AI_RECEPTIONIST_LOADED__) return;
  window.__AI_RECEPTIONIST_LOADED__ = true;

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
    businessName: (currentScript && currentScript.getAttribute('data-business')) || userConfig.businessName || '${config.businessName}',
    industry: (currentScript && currentScript.getAttribute('data-industry')) || userConfig.industry || '${config.industry}',
    primaryColor: (currentScript && currentScript.getAttribute('data-color')) || userConfig.primaryColor || '${config.primaryColor}',
    textColor: (currentScript && currentScript.getAttribute('data-text-color')) || userConfig.textColor || '${config.textColor}',
    fontFamily: (currentScript && currentScript.getAttribute('data-font')) || userConfig.fontFamily || '${config.fontFamily}',
    iconType: (currentScript && currentScript.getAttribute('data-icon')) || userConfig.iconType || '${config.iconType}',
    customIconUrl: (currentScript && currentScript.getAttribute('data-icon-url')) || userConfig.customIconUrl || '',
    position: (currentScript && currentScript.getAttribute('data-position')) || userConfig.position || '${config.position === 'bottom-left' ? 'left' : 'right'}',
    welcomeMessage: (currentScript && currentScript.getAttribute('data-greeting')) || userConfig.welcomeMessage || '${config.welcomeGreeting.replace(/'/g, "\\'")}',
    placeholderText: (currentScript && currentScript.getAttribute('data-placeholder')) || userConfig.placeholderText || '${config.placeholderText.replace(/'/g, "\\'")}',
    apiUrl: (currentScript && currentScript.getAttribute('data-api')) || userConfig.apiUrl || '${currentHost}/api/chat',
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

  // Styles and initialization...
})();`
    },
    'README.md': {
      path: 'README.md',
      language: 'markdown',
      description: 'Step-by-step setup documentation for developers and CMS site owners.',
      content: generateReadmeMarkdown(config, currentHost)
    },
    'Tenant.cs': {
      path: 'backend/Models/Tenant.cs',
      language: 'csharp',
      description: 'C# EF Core model with customization properties (colors, font, icon, position).',
      content: `using System.Text.Json.Serialization;

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
}`
    },
    'GeminiService.cs': {
      path: 'backend/Services/GeminiService.cs',
      language: 'csharp',
      description: 'C# Gemini service featuring multi-API key rotation and automated 429 quota failover.',
      content: `using System.Collections.Concurrent;
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

        // Support array of keys or comma-separated string
        var keysSection = configuration.GetSection("Gemini:ApiKeys").Get<string[]>();
        if (keysSection != null && keysSection.Length > 0)
        {
            _apiKeys.AddRange(keysSection.Where(k => !string.IsNullOrWhiteSpace(k)).Select(k => k.Trim()));
        }

        var delimitedKeys = configuration["Gemini:ApiKeys"];
        if (!string.IsNullOrWhiteSpace(delimitedKeys))
        {
            var split = delimitedKeys.Split(new[] { ',', ';', '\\n' }, StringSplitOptions.RemoveEmptyEntries)
                                     .Select(k => k.Trim());
            _apiKeys.AddRange(split);
        }

        var singleKey = configuration["Gemini:ApiKey"];
        if (!string.IsNullOrWhiteSpace(singleKey))
        {
            _apiKeys.Add(singleKey.Trim());
        }

        _apiKeys = _apiKeys.Distinct().ToList();
    }

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
        return _apiKeys[Math.Abs(Interlocked.Increment(ref _keyIndex) % count)];
    }

    private void MarkKeyCooldown(string key, int seconds = 90)
    {
        _cooldowns[key] = DateTime.UtcNow.AddSeconds(seconds);
    }

    // Call GetResponseAsync with automated failover...
}`
    },
    'TenantEndpoints.cs': {
      path: 'backend/Endpoints/TenantEndpoints.cs',
      language: 'csharp',
      description: 'API endpoints for fetching and updating widget customization options.',
      content: `using AIReceptionist.Data;
using AIReceptionist.Models;
using AIReceptionist.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIReceptionist.Endpoints;

public static class TenantEndpoints
{
    public static void MapTenantEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/tenants");

        // Public endpoint: Called by widget.js to load tenant branding
        group.MapGet("/{slug}/widget-config", async (string slug, AppDbContext db) =>
        {
            var tenant = await db.Tenants
                .Where(t => t.Slug == slug && t.IsActive)
                .Select(t => new
                {
                    businessName = t.BusinessName,
                    industry = t.Industry,
                    primaryColor = t.PrimaryColor,
                    textColor = t.TextColor,
                    fontFamily = t.FontFamily,
                    launcherIcon = t.LauncherIcon,
                    customIconUrl = t.CustomIconUrl,
                    position = t.Position,
                    welcomeMessage = t.WelcomeMessage,
                    placeholderText = t.PlaceholderText
                })
                .FirstOrDefaultAsync();

            return tenant is not null ? Results.Ok(tenant) : Results.NotFound();
        });
    }
}`
    },
    'appsettings.json': {
      path: 'backend/appsettings.json',
      language: 'json',
      description: 'Configuration file with Gemini:ApiKeys array for key cycling.',
      content: `{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\\\mssqllocaldb;Database=AIReceptionistDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "Gemini": {
    "Model": "gemini-3.8-flash",
    "ApiKeys": [
      "AIzaSyKey1...",
      "AIzaSyKey2...",
      "AIzaSyKey3..."
    ]
  }
}`
    }
  };

  const [selectedKey, setSelectedKey] = useState<string>('widget.js');
  const [copied, setCopied] = useState(false);

  const activeFile = files[selectedKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedKey;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* File Tree Sidebar */}
      <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/60 p-3 space-y-1 shrink-0">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Repository Files
        </div>

        <div className="space-y-1">
          {Object.keys(files).map((key) => {
            const isSelected = selectedKey === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedKey(key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-left transition-colors ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {key.endsWith('.cs') ? (
                    <FileCode className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  ) : key.endsWith('.js') ? (
                    <FileCode className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  ) : key.endsWith('.json') ? (
                    <FileCode className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">{key}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-800/80 mt-4 px-2 space-y-2">
          <div className="text-[11px] text-slate-400 leading-relaxed">
            {activeFile.description}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Path: {activeFile.path}
          </div>
        </div>
      </div>

      {/* File Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* File Action Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <span className="text-slate-500">repo /</span>
            <span className="font-semibold text-white">{activeFile.path}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Download className="h-3 w-3" />
              <span>Download</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 bg-slate-950 leading-relaxed whitespace-pre">
          {activeFile.content}
        </div>
      </div>
    </div>
  );
};
