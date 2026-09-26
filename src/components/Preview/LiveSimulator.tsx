import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Calendar,
  CheckCircle2,
  Star,
  ExternalLink,
  Laptop,
  Maximize2,
  RefreshCw,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import { WidgetConfig, ExtractedLead } from '../../types';
import { InteractiveWidget } from '../Widget/InteractiveWidget';

interface LiveSimulatorProps {
  config: WidgetConfig;
  extractedLead: ExtractedLead;
  onLeadUpdated: (lead: ExtractedLead) => void;
  onResetChatRef: (resetFn: () => void) => void;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({
  config,
  extractedLead,
  onLeadUpdated,
  onResetChatRef,
}) => {
  const [template, setTemplate] = useState<'hvac' | 'dental' | 'saas' | 'clean'>('hvac');

  return (
    <div className="relative flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Top Browser Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 gap-2 backdrop-blur-md">
        {/* Mock Window Dots & URL */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-1 border border-slate-800 text-xs text-slate-400 font-mono">
            <span className="text-emerald-400">https://</span>
            <span className="text-slate-200">
              {template === 'hvac'
                ? 'summitheatingandair.com'
                : template === 'dental'
                ? 'evergreenfamilydental.com'
                : template === 'saas'
                ? 'hyperscale.dev'
                : 'your-website.com'}
            </span>
          </div>
        </div>

        {/* Website Template Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1 text-xs">
          <button
            onClick={() => setTemplate('hvac')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              template === 'hvac'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Contractor / HVAC
          </button>
          <button
            onClick={() => setTemplate('dental')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              template === 'dental'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dental Practice
          </button>
          <button
            onClick={() => setTemplate('saas')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              template === 'saas'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SaaS / Tech
          </button>
          <button
            onClick={() => setTemplate('clean')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              template === 'clean'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clean Canvas
          </button>
        </div>
      </div>

      {/* Mock Website Viewport Content */}
      <div className="relative flex-1 overflow-y-auto bg-slate-900 selection:bg-indigo-500 selection:text-white">
        {template === 'hvac' && (
          <div className="min-h-full bg-slate-950 text-slate-100 font-sans pb-24">
            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-6 w-6 text-amber-500" />
                <span className="font-bold text-lg tracking-tight text-white">{config.businessName}</span>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-xs text-slate-300">
                <span className="hover:text-white cursor-pointer">Heating</span>
                <span className="hover:text-white cursor-pointer">Air Conditioning</span>
                <span className="hover:text-white cursor-pointer">Emergency Plumbing</span>
                <span className="hover:text-white cursor-pointer">Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> 24/7 Dispatch
                </span>
              </div>
            </div>

            {/* Hero */}
            <div className="relative px-6 py-14 sm:py-20 max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Fast On-Call Technicians • 89$ Standard Diagnostic Fee</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Emergency HVAC & Plumbing Done Right.
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Whether your furnace quit in freezing temperatures or your AC is blowing hot air, our licensed technicians are ready 24/7. Ask our AI receptionist in the corner for an instant quote!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  className="rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  Book Service Online
                </button>
                <button className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800">
                  View Service Area (35-Mile Radius)
                </button>
              </div>
            </div>

            {/* Service Pillars */}
            <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs uppercase">
                  AC
                </div>
                <h3 className="font-bold text-sm text-white">Air Conditioning Repair</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fast diagnosis for refrigerant leaks, frozen coils, and broken capacitors with upfront pricing.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
                <div className="h-8 w-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs uppercase">
                  Heat
                </div>
                <h3 className="font-bold text-sm text-white">Furnace & Heat Pumps</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Emergency no-heat calls prioritized 24 hours a day with fully stocked trucks.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                  Pipe
                </div>
                <h3 className="font-bold text-sm text-white">Water Heaters & Leaks</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tankless and conventional water heater installations, drain cleaning, and pipe bursts.
                </p>
              </div>
            </div>
          </div>
        )}

        {template === 'dental' && (
          <div className="min-h-full bg-slate-950 text-slate-100 font-sans pb-24">
            <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                  D
                </div>
                <span className="font-bold text-lg text-white">{config.businessName}</span>
              </div>
              <div className="text-xs text-emerald-400 font-medium">
                Welcoming New Patients & Same-Day Emergencies
              </div>
            </div>
            <div className="px-6 py-16 max-w-3xl mx-auto text-center space-y-5">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                Gentle Family & Cosmetic Dentistry
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white">
                Modern Dental Care Designed Around Your Comfort.
              </h1>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                Delta Dental, MetLife, Cigna & PPOs accepted. Chat with our receptionist for appointment availability and insurance questions.
              </p>
            </div>
          </div>
        )}

        {template === 'saas' && (
          <div className="min-h-full bg-slate-950 text-slate-100 font-sans pb-24">
            <div className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <span className="font-bold text-white">{config.businessName}</span>
              </div>
              <span className="text-xs text-slate-400">Open-Source Developer Edition</span>
            </div>
            <div className="px-6 py-16 max-w-3xl mx-auto text-center space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                <Laptop className="h-3.5 w-3.5" />
                <span>Zero-Dependency Vanilla JavaScript Script Tag</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Turn Every Website Visitor Into a Qualified Lead.
              </h1>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                Embed in 60 seconds into WordPress, Shopify, or Webflow. Instant answers, emergency triage, and lead extraction.
              </p>
            </div>
          </div>
        )}

        {template === 'clean' && (
          <div className="min-h-full flex items-center justify-center p-8 text-center text-slate-500">
            <div className="space-y-2">
              <div className="text-base font-semibold text-slate-400">Clean Test Canvas</div>
              <p className="text-xs max-w-md">
                Interact with the live widget in the corner. Notice how it behaves, responds, and extracts customer contact information in real-time.
              </p>
            </div>
          </div>
        )}

        {/* Live Floating Widget Rendered Right Here Inside Simulator */}
        <InteractiveWidget
          config={config}
          onLeadUpdated={onLeadUpdated}
          onResetRef={onResetChatRef}
        />
      </div>
    </div>
  );
};
