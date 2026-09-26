import React from 'react';
import {
  Code,
  FileText,
  KeyRound,
  Download,
  Share2,
  Sparkles,
  Bot,
  RefreshCw,
  Layers,
  ChevronDown
} from 'lucide-react';
import { INDUSTRY_PRESETS } from '../constants/presets';
import { WidgetConfig, KeyPoolInfo } from '../types';

interface NavbarProps {
  config: WidgetConfig;
  onSelectPreset: (presetId: string) => void;
  onOpenEmbed: () => void;
  onOpenDocs: () => void;
  onOpenKeyModal: () => void;
  keyPoolInfo: KeyPoolInfo | null;
  onResetChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  onSelectPreset,
  onOpenEmbed,
  onOpenDocs,
  onOpenKeyModal,
  keyPoolInfo,
  onResetChat
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: config.primaryColor }}
          >
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-tight text-base sm:text-lg">
                AI Receptionist
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                Open Source (MIT)
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-400">
              Drop-in Widget & Customizer for WordPress, Shopify & Squarespace
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Key Cycling Status Button */}
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors ${
              keyPoolInfo && keyPoolInfo.hasKey
                ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40'
                : 'border-amber-500/30 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40'
            }`}
            title="Multi-Key Rotation & 429 Protection Status"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Key Pool:</span>
            <span>
              {keyPoolInfo && keyPoolInfo.totalKeys > 0
                ? `${keyPoolInfo.totalKeys} Active Key(s)`
                : 'Local Smart Mode'}
            </span>
          </button>

          {/* Preset Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Templates</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Industry Presets
              </div>
              {INDUSTRY_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPreset(p.id)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* GitHub README / Docs Button */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">README.md & Docs</span>
          </button>

          {/* Embed Snippet Generator (Primary CTA) */}
          <button
            onClick={onOpenEmbed}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: config.primaryColor }}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Get Embed Code</span>
          </button>
        </div>
      </div>
    </header>
  );
};
