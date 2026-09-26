import React, { useState } from 'react';
import {
  Palette,
  Layout,
  MessageSquare,
  Bot,
  Headphones,
  Sparkles,
  PhoneCall,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { THEME_PRESETS, FONT_OPTIONS } from '../../constants/presets';
import { WidgetConfig, IconType, FontFamilyType, BorderRadiusType } from '../../types';

interface StylingTabProps {
  config: WidgetConfig;
  onChange: (updated: Partial<WidgetConfig>) => void;
}

export const StylingTab: React.FC<StylingTabProps> = ({ config, onChange }) => {
  const [newChipText, setNewChipText] = useState('');

  const handleAddChip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChipText.trim()) return;
    onChange({ quickChips: [...config.quickChips, newChipText.trim()] });
    setNewChipText('');
  };

  const handleRemoveChip = (index: number) => {
    const next = [...config.quickChips];
    next.splice(index, 1);
    onChange({ quickChips: next });
  };

  const iconOptions: { type: IconType; label: string; icon: React.ReactNode }[] = [
    { type: 'bot', label: 'Bot', icon: <Bot className="h-4 w-4" /> },
    { type: 'message', label: 'Bubble', icon: <MessageSquare className="h-4 w-4" /> },
    { type: 'headset', label: 'Support', icon: <Headphones className="h-4 w-4" /> },
    { type: 'sparkles', label: 'AI Spark', icon: <Sparkles className="h-4 w-4" /> },
    { type: 'phone', label: 'Phone', icon: <PhoneCall className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Brand Color & Themes */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Palette className="h-4 w-4 text-indigo-400" />
            <span>Brand Colors & Theme</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">{config.primaryColor}</span>
            <input
              type="color"
              value={config.primaryColor}
              onChange={(e) => onChange({ primaryColor: e.target.value, bubbleColorUser: e.target.value })}
              className="h-7 w-7 cursor-pointer rounded-md border border-slate-700 bg-transparent p-0"
              title="Pick custom hex color"
            />
          </div>
        </div>

        {/* Curated Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {THEME_PRESETS.map((t) => {
            const isSelected = config.primaryColor.toLowerCase() === t.primary.toLowerCase();
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onChange({ primaryColor: t.primary, bubbleColorUser: t.primary })}
                className={`relative flex items-center gap-2.5 rounded-lg border p-2 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full shadow-sm shrink-0"
                  style={{ backgroundColor: t.primary }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-slate-200 truncate">{t.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{t.badge}</div>
                </div>
                {isSelected && <Check className="h-3 w-3 text-indigo-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Launcher Icon & Position */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Layout className="h-4 w-4 text-indigo-400" />
          <span>Launcher & Position</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Floating Trigger Button Icon
          </label>
          <div className="grid grid-cols-5 gap-2">
            {iconOptions.map((opt) => {
              const active = config.iconType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => onChange({ iconType: opt.type })}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2.5 text-xs transition-all ${
                    active
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {opt.icon}
                  <span className="text-[10px]">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Position on screen */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Corner Placement
            </label>
            <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => onChange({ position: 'bottom-left' })}
                className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
                  config.position === 'bottom-left'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bottom Left
              </button>
              <button
                type="button"
                onClick={() => onChange({ position: 'bottom-right' })}
                className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
                  config.position === 'bottom-right'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bottom Right
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Corner Curvature
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1">
              {(['sharp', 'rounded', 'soft'] as BorderRadiusType[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onChange({ borderRadius: r })}
                  className={`rounded-md py-1.5 text-xs font-medium capitalize transition-colors ${
                    config.borderRadius === r
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Typography / Font */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Widget Typography / Font Family
          </label>
          <select
            value={config.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value as FontFamilyType })}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} — {f.style}
              </option>
            ))}
          </select>
        </div>

        {/* Audio Chime */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            {config.soundEnabled ? (
              <Volume2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-500" />
            )}
            <div>
              <div className="text-xs font-semibold text-slate-200">Subtle Audio Chime</div>
              <div className="text-[11px] text-slate-400">Play pleasant audio chime on AI response</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange({ soundEnabled: !config.soundEnabled })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              config.soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                config.soundEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Quick Reply Chips */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-200">
            Quick-Action Suggested Questions
          </div>
          <button
            type="button"
            onClick={() => onChange({ enableQuickChips: !config.enableQuickChips })}
            className="text-xs text-indigo-400 hover:underline"
          >
            {config.enableQuickChips ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {config.enableQuickChips && (
          <>
            <form onSubmit={handleAddChip} className="flex gap-2">
              <input
                type="text"
                value={newChipText}
                onChange={(e) => setNewChipText(e.target.value)}
                placeholder="Add suggested question..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </form>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {config.quickChips.map((chip, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300"
                >
                  <span className="truncate pr-2">{chip}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChip(idx)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
