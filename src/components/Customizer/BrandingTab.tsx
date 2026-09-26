import React from 'react';
import { Building2, User, MessageCircle, AlertTriangle, Sparkles, Type } from 'lucide-react';
import { WidgetConfig } from '../../types';

interface BrandingTabProps {
  config: WidgetConfig;
  onChange: (updated: Partial<WidgetConfig>) => void;
}

export const BrandingTab: React.FC<BrandingTabProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-5">
      {/* Business Identity */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Building2 className="h-4 w-4 text-indigo-400" />
          <span>Business Identity</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Business / Practice Name
          </label>
          <input
            type="text"
            value={config.businessName}
            onChange={(e) => onChange({ businessName: e.target.value })}
            placeholder="e.g. Apex Heating & Air Conditioning"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Industry / Vertical
          </label>
          <input
            type="text"
            value={config.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
            placeholder="e.g. HVAC & Plumbing, Dental Practice, Legal..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['HVAC & Plumbing', 'Dental Clinic', 'Roofing & Contracting', 'Law Firm', 'SaaS / AI'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onChange({ industry: tag })}
                className="text-[11px] rounded-md border border-slate-800 bg-slate-800/80 px-2 py-0.5 text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Receptionist Persona */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <User className="h-4 w-4 text-indigo-400" />
          <span>Receptionist Persona</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Receptionist Name
            </label>
            <input
              type="text"
              value={config.receptionistName}
              onChange={(e) => onChange({ receptionistName: e.target.value })}
              placeholder="e.g. Sarah, Kelly, Dispatch Bot"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Title / Subtitle
            </label>
            <input
              type="text"
              value={config.receptionistTitle}
              onChange={(e) => onChange({ receptionistTitle: e.target.value })}
              placeholder="e.g. Live Concierge & Dispatch"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Initial Welcome Greeting
          </label>
          <textarea
            rows={2}
            value={config.welcomeGreeting}
            onChange={(e) => onChange({ welcomeGreeting: e.target.value })}
            placeholder="Greeting displayed when a visitor first opens the widget..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Input Field Placeholder
          </label>
          <input
            type="text"
            value={config.placeholderText}
            onChange={(e) => onChange({ placeholderText: e.target.value })}
            placeholder="Type your question or issue..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Emergency & Urgency Triage Toggle */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.showEmergencyBanner}
            onChange={(e) => onChange({ showEmergencyBanner: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>Smart Emergency Detection Banner</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              When enabled, any visitor message mentioning urgent hazards (e.g. burst pipe, gas odor, no heat, electrical sparks) will automatically flag with high priority and display an immediate dispatch assurance badge.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
