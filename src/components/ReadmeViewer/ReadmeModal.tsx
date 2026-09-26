import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  BookOpen,
  FileText,
  ExternalLink,
  ShieldCheck,
  Star,
  GitBranch
} from 'lucide-react';
import { WidgetConfig } from '../../types';
import { generateReadmeMarkdown } from '../../utils/readmeContent';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WidgetConfig;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose, config }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
  const markdownText = generateReadmeMarkdown(config, currentHost);

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReadmeFile = () => {
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">GitHub README.md & Distribution Docs</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  YC S26 / Open-Source Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Engineered for organic developer adoption, Show HN, and zero-ad passive visibility.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadReadmeFile}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download README.md</span>
            </button>
            <button
              onClick={copyMarkdown}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                viewMode === 'preview'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rendered Preview
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                viewMode === 'raw'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Markdown
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Zero-Ad Compliance Verified</span>
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400" />
              <span>Target: GitHub Stars & Forks</span>
            </span>
          </div>
        </div>

        {/* Markdown Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 font-sans text-sm text-slate-200">
          {viewMode === 'raw' ? (
            <pre className="font-mono text-xs text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
              {markdownText}
            </pre>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto prose prose-invert prose-indigo">
              {/* Rendered View */}
              <div className="border-b border-slate-800 pb-4 space-y-3">
                <h1 className="text-2xl font-black text-white">AI Receptionist Widget</h1>
                <p className="text-slate-300 text-sm leading-relaxed">
                  An ultra-lightweight (&lt;14KB), zero-dependency, open-source AI receptionist widget that turns local business website visitors into qualified leads 24/7.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded border border-blue-500/30 font-semibold">
                    MIT License
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/30 font-semibold">
                    0 Runtime Dependencies
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded border border-purple-500/30 font-semibold">
                    Gemini 3.8 Flash
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white">1. The Problem and Solution</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  82% of visitors to contractor, dental, legal, and home-service websites bounce without filling out a contact form or calling. When an air conditioner dies at 9 PM or a pipe bursts on Sunday, visitors want immediate answers — not a "We'll reply in 24-48 business hours" form.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white">2. 60-Second Quickstart</h2>
                <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs text-indigo-300 border border-slate-800 overflow-x-auto">
                  {`<script src="${currentHost}/widget.js" data-business="${config.businessName}" data-color="${config.primaryColor}" async></script>`}
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white">3. Multi-API-Key Rotation and Zero-Downtime Resilience</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The backend cycles through multiple configured Gemini keys in round-robin fashion, immediately cools down keys that hit 429 quota exhaustion, and retries with the next healthy key in milliseconds without the visitor ever noticing.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white">4. Multi-Platform Compatibility</h2>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                  <li><strong>WordPress:</strong> Compatible with WPCode plugin and standard child themes.</li>
                  <li><strong>Shopify:</strong> Drop into <code className="font-mono text-indigo-300">theme.liquid</code> before closing body tag.</li>
                  <li><strong>Squarespace:</strong> Supports Code Injection in site settings.</li>
                  <li><strong>Webflow:</strong> Custom code footer block.</li>
                  <li><strong>React / Next.js:</strong> Fully typed React wrapper hook.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white">5. License and Open-Source Compliance</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Distributed under the <strong>MIT License</strong>. Operates purely through passive developer visibility (GitHub repository, Show HN, r/SideProject writeups) without commercial advertising.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
