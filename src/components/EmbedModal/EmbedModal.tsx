import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Code,
  FileCode,
  Download,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { WidgetConfig } from '../../types';
import {
  getScriptSnippet,
  getInlineConfigSnippet,
  getWordPressGuide,
  getShopifyGuide,
  getSquarespaceGuide,
  getWebflowGuide,
  getReactSnippet
} from '../../utils/embedSnippet';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WidgetConfig;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose, config }) => {
  const [activeTab, setActiveTab] = useState<'script' | 'wordpress' | 'shopify' | 'squarespace' | 'webflow' | 'react'>('script');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWidgetJs = () => {
    window.open('/widget.js', '_blank');
  };

  let contentToCopy = '';
  switch (activeTab) {
    case 'script':
      contentToCopy = getScriptSnippet(config, currentHost);
      break;
    case 'wordpress':
      contentToCopy = getWordPressGuide(config, currentHost);
      break;
    case 'shopify':
      contentToCopy = getShopifyGuide(config, currentHost);
      break;
    case 'squarespace':
      contentToCopy = getSquarespaceGuide(config, currentHost);
      break;
    case 'webflow':
      contentToCopy = getWebflowGuide(config, currentHost);
      break;
    case 'react':
      contentToCopy = getReactSnippet(config, currentHost);
      break;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: config.primaryColor }}
            >
              <Code className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Embed AI Receptionist Snippet</h2>
              <p className="text-xs text-slate-400">
                1-line drop-in code for WordPress, Shopify, Squarespace, and custom websites.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Platform Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 overflow-x-auto no-scrollbar gap-1 pt-2">
          {[
            { id: 'script', label: 'HTML / Vanilla' },
            { id: 'wordpress', label: 'WordPress' },
            { id: 'shopify', label: 'Shopify' },
            { id: 'squarespace', label: 'Squarespace' },
            { id: 'webflow', label: 'Webflow' },
            { id: 'react', label: 'React / Next.js' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              {activeTab === 'script' && 'Direct Script Tag (Paste right before </body>)'}
              {activeTab === 'wordpress' && 'WordPress Integration Guide'}
              {activeTab === 'shopify' && 'Shopify theme.liquid Integration'}
              {activeTab === 'squarespace' && 'Squarespace Code Injection Guide'}
              {activeTab === 'webflow' && 'Webflow Custom Code Guide'}
              {activeTab === 'react' && 'React Component Wrapper'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadWidgetJs}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                title="Download the standalone widget.js script bundle"
              >
                <Download className="h-3.5 w-3.5" />
                <span>widget.js</span>
              </button>
              <button
                onClick={() => copyToClipboard(contentToCopy)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
            {contentToCopy}
          </div>

          {/* Integration Notes */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Zero-Performance Impact:</span>
            </div>
            <p className="leading-relaxed">
              The <code className="text-indigo-400 font-mono">widget.js</code> script is under 14KB gzipped, has zero dependencies (no jQuery, no heavy frameworks), and executes asynchronously. It will not hurt Google PageSpeed or Core Web Vitals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
