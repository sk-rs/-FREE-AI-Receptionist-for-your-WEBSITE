import React, { useState } from 'react';
import {
  FileText,
  FolderGit2,
  Play,
  Download,
  Copy,
  Check,
  Code,
  Sliders,
  Terminal,
  ExternalLink,
  Bot,
  HelpCircle,
  Package
} from 'lucide-react';
import { TutorialVideoModal } from './components/TutorialPlayer/TutorialVideoModal';
import { RepoFilesViewer } from './components/RepoFilesViewer';
import { InteractiveWidget } from './components/Widget/InteractiveWidget';
import { DEFAULT_WIDGET_CONFIG } from './constants/presets';
import { WidgetConfig } from './types';
import { downloadRepoZip } from './utils/zipGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'readme' | 'customization' | 'files'>('readme');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Black and white monochrome widget config
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    ...DEFAULT_WIDGET_CONFIG,
    businessName: 'AI Receptionist',
    industry: 'Customer Support',
    primaryColor: '#000000',
    textColor: '#ffffff',
    headerTextColor: '#ffffff',
    bubbleColorUser: '#000000',
    bubbleColorAi: '#f4f4f5',
    fontFamily: 'Inter',
    iconType: 'headset',
    position: 'bottom-right',
    welcomeGreeting: 'Hello. How can we assist you with our services today?',
    placeholderText: 'Type your message or inquiry...',
    showEmergencyBanner: false,
    soundEnabled: false,
    enableQuickChips: false,
    quickChips: []
  });

  const embedSnippet = `<!-- AI Receptionist Widget (<14KB, Zero Dependencies) -->
<script
  src="https://your-domain.com/widget.js"
  data-business="Your Company"
  data-industry="Support"
  data-color="#000000"
  data-text-color="#ffffff"
  data-font="Inter, sans-serif"
  data-icon="headset"
  data-position="right"
  data-greeting="Hello. How can we assist you today?"
  data-api="https://your-domain.com/api/chat"
  async>
</script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadRepoZip(widgetConfig);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadWidgetJsOnly = () => {
    const link = document.createElement('a');
    link.href = '/widget.js';
    link.download = 'widget.js';
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-100 font-sans selection:bg-white selection:text-black">
      {/* Top GitHub Repo Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Repo Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-sm sm:text-base">
                  ai-receptionist-widget
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-700">
                  Public
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800 hidden sm:inline">
                  MIT License
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Watch Tutorial Video Button */}
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 hover:border-neutral-500 transition-colors shadow-sm"
            >
              <Play className="h-3.5 w-3.5 fill-current text-white" />
              <span>Watch Tutorial</span>
            </button>

            {/* Download Repo ZIP */}
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50"
            >
              <Package className="h-3.5 w-3.5 text-white" />
              <span>{isZipping ? 'Bundling ZIP...' : 'Download Repo (.zip)'}</span>
            </button>

            {/* Copy Embed Snippet */}
            <button
              onClick={copySnippet}
              className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-black hover:bg-neutral-200 transition-colors shadow-sm"
            >
              {copiedSnippet ? <Check className="h-3.5 w-3.5 text-black" /> : <Copy className="h-3.5 w-3.5 text-black" />}
              <span>{copiedSnippet ? 'Copied' : 'Copy Embed Snippet'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Quick Answer Banner */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-base font-bold text-white">
              Open-Source AI Receptionist Repository Package
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
              Zero dependencies, under 14KB client footprint. Embeddable on WordPress, Shopify, Squarespace, or vanilla HTML with one script tag. All colors, icons, fonts, and greetings are customizable directly from code.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <Play className="h-3 w-3 fill-current text-white" />
              <span>45s Video Walkthrough</span>
            </button>
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 rounded-lg border border-white bg-white px-3 py-1.5 text-xs font-bold text-black hover:bg-neutral-200 transition-colors"
            >
              <Download className="h-3 w-3 text-black" />
              <span>{isZipping ? 'Bundling...' : 'Download ZIP Package'}</span>
            </button>
          </div>
        </div>

        {/* Essential Answers Q&A Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5 text-neutral-400" />
              <span>Can users embed without the full code?</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              <strong className="text-neutral-200">Yes.</strong> Site owners do not need your C# code or full repository. They only need your single <code className="text-neutral-200 font-mono">&lt;script src=".../widget.js"&gt;&lt;/script&gt;</code> tag placed before their <code className="text-neutral-200 font-mono">&lt;/body&gt;</code> tag. The script automatically renders the launcher button, floating chat window, and sends messages to your API.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5 text-neutral-400" />
              <span>How will users see the UI on GitHub?</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              When people visit your GitHub repository, GitHub displays the <strong className="text-neutral-200">README.md</strong>. Your README includes the animated video walkthrough, live embed instructions, and architecture guide. If you also enable free <strong className="text-neutral-200">GitHub Pages</strong>, anyone can click a public link to try the live widget in their browser without downloading anything.
            </p>
          </div>
        </div>

        {/* Documentation Tabs */}
        <div className="border border-neutral-800 rounded-xl bg-neutral-950 overflow-hidden shadow-xl">
          {/* Tab Navigation Bar */}
          <div className="flex border-b border-neutral-800 bg-neutral-900/80 px-4 pt-2 gap-2 text-xs font-mono overflow-x-auto">
            <button
              onClick={() => setActiveTab('readme')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold border-b-2 transition-colors ${
                activeTab === 'readme'
                  ? 'border-white text-white bg-neutral-950'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>README.md (Setup & Integration)</span>
            </button>

            <button
              onClick={() => setActiveTab('customization')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold border-b-2 transition-colors ${
                activeTab === 'customization'
                  ? 'border-white text-white bg-neutral-950'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>CUSTOMIZATION.md (Icon, Font & Color)</span>
            </button>

            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold border-b-2 transition-colors ${
                activeTab === 'files'
                  ? 'border-white text-white bg-neutral-950'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>Repository Code Files</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'readme' && (
              <div className="space-y-6 text-xs text-neutral-300 leading-relaxed font-sans">
                {/* 1-Minute Quickstart */}
                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    1. Quickstart: 60-Second Embed
                  </h2>
                  <p className="text-neutral-400">
                    Paste this snippet directly before the closing <code className="text-neutral-200 font-mono">&lt;/body&gt;</code> tag on any webpage:
                  </p>
                  <div className="relative rounded-lg border border-neutral-800 bg-neutral-900 p-4 font-mono text-xs text-neutral-200 overflow-x-auto whitespace-pre">
                    {embedSnippet}
                  </div>
                </div>

                {/* Frequently Asked Questions */}
                <div className="space-y-3 pt-4 border-t border-neutral-800">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    2. Embedding Without Full Code
                  </h2>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-4 space-y-2">
                    <div className="font-semibold text-white">Can users embed this without having the full code?</div>
                    <p className="text-neutral-400">
                      Yes. A website owner only needs the single <code className="text-neutral-200 font-mono">&lt;script src=".../widget.js"&gt;&lt;/script&gt;</code> tag. They do not need to install Node.js, C#, or React on their site.
                    </p>
                  </div>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-4 space-y-2">
                    <div className="font-semibold text-white">What code do they need from you?</div>
                    <p className="text-neutral-400">
                      1. The client script: <code className="text-neutral-200 font-mono">public/widget.js</code> (under 14KB, zero dependencies).<br />
                      2. An API endpoint: The widget sends messages to a backend holding the Gemini API key. They can use your hosted API URL or self-host the included C# or Node server.
                    </p>
                  </div>
                </div>

                {/* Platform Integrations */}
                <div className="space-y-3 pt-4 border-t border-neutral-800">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    3. CMS Platform Setup
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 space-y-1">
                      <div className="font-bold text-white">WordPress</div>
                      <p className="text-neutral-400 text-[11px]">
                        Install the free WPCode plugin, go to Header &amp; Footer, paste into the Footer box, and save.
                      </p>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 space-y-1">
                      <div className="font-bold text-white">Shopify</div>
                      <p className="text-neutral-400 text-[11px]">
                        Go to Online Store &gt; Themes &gt; Edit code, open theme.liquid, and paste directly above the &lt;/body&gt; tag.
                      </p>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 space-y-1">
                      <div className="font-bold text-white">Squarespace</div>
                      <p className="text-neutral-400 text-[11px]">
                        Go to Settings &gt; Advanced &gt; Code Injection, paste into the Footer box, and click Save.
                      </p>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 space-y-1">
                      <div className="font-bold text-white">Webflow</div>
                      <p className="text-neutral-400 text-[11px]">
                        In Project Settings &gt; Custom Code, paste into Footer Code (before &lt;/body&gt;), and publish.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'customization' && (
              <div className="space-y-6 text-xs text-neutral-300 leading-relaxed font-sans">
                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Changing Icon, Font, Color, and Greeting Directly in Code
                  </h2>
                  <p className="text-neutral-400">
                    All customization parameters can be modified directly through the HTML snippet or inside <code className="text-neutral-200 font-mono">public/widget.js</code>.
                  </p>
                </div>

                {/* Table of Customization Options */}
                <div className="overflow-x-auto rounded-lg border border-neutral-800">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-3">Attribute</th>
                        <th className="p-3">Options / Examples</th>
                        <th className="p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      <tr>
                        <td className="p-3 font-semibold text-white">data-icon</td>
                        <td className="p-3 text-neutral-400">"bot", "headset", "message", "sparkles", "phone"</td>
                        <td className="p-3">Changes the floating launcher button SVG icon.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">data-icon-url</td>
                        <td className="p-3 text-neutral-400">"https://site.com/logo.png"</td>
                        <td className="p-3">Optional URL for a custom company logo or avatar image.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">data-color</td>
                        <td className="p-3 text-neutral-400">"#000000", "#4f46e5", "#059669"</td>
                        <td className="p-3">Primary brand color for the launcher button and chat header.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">data-text-color</td>
                        <td className="p-3 text-neutral-400">"#ffffff", "#000000"</td>
                        <td className="p-3">Text and icon color inside the header and launcher.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">data-font</td>
                        <td className="p-3 text-neutral-400">"Inter, sans-serif", "'Outfit', sans-serif"</td>
                        <td className="p-3">CSS font family applied to all widget text.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">data-position</td>
                        <td className="p-3 text-neutral-400">"right", "left"</td>
                        <td className="p-3">Bottom-right or bottom-left corner screen placement.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">data-greeting</td>
                        <td className="p-3 text-neutral-400">"Welcome! How can we assist you today?"</td>
                        <td className="p-3">Initial welcome message shown to visitors when opening chat.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Direct Editing in widget.js */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Editing Default Values Inside public/widget.js
                  </h3>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 font-mono text-[11px] text-neutral-300 leading-relaxed overflow-x-auto whitespace-pre">
{`var config = {
  businessName: 'Your Business Name',
  primaryColor: '#000000',
  textColor: '#ffffff',
  fontFamily: 'Inter, -apple-system, sans-serif',
  iconType: 'headset', // 'bot', 'message', 'headset', 'sparkles', 'phone'
  position: 'right',   // 'right' or 'left'
  welcomeMessage: 'Hello. How can we assist you today?',
  apiUrl: '/api/chat'
};`}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="h-[600px]">
                <RepoFilesViewer config={widgetConfig} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Live Widget in Bottom Corner for Immediate Testing */}
      <InteractiveWidget config={widgetConfig} />

      {/* Video Tutorial Modal */}
      <TutorialVideoModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
