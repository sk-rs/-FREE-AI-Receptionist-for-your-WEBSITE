import React, { useState } from 'react';
import {
  UserCheck,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import { ExtractedLead } from '../../types';

interface LeadInspectorProps {
  lead: ExtractedLead;
  onReset: () => void;
}

export const LeadInspector: React.FC<LeadInspectorProps> = ({ lead, onReset }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const isQualified = Boolean(lead.name || lead.phone || lead.email);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Live Lead Extraction
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              lead.status === 'qualified'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {lead.status === 'qualified' ? 'Qualified Lead' : 'Active Conversation'}
          </span>
          <button
            onClick={onReset}
            className="text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        As the visitor converses with the AI receptionist in the test simulator, the server continuously extracts their contact details and emergency triage status:
      </p>

      {/* Extracted Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Name */}
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-400">Name:</span>
            <span className={`font-medium truncate ${lead.name ? 'text-white' : 'text-slate-500 italic'}`}>
              {lead.name || 'Not mentioned yet'}
            </span>
          </div>
          {lead.name && (
            <button
              onClick={() => copyText(lead.name!, 'name')}
              className="text-slate-400 hover:text-indigo-400 ml-2"
              title="Copy Name"
            >
              {copiedField === 'name' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Phone */}
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className={`font-medium truncate ${lead.phone ? 'text-emerald-300 font-mono' : 'text-slate-500 italic'}`}>
              {lead.phone || 'Awaiting phone...'}
            </span>
          </div>
          {lead.phone && (
            <button
              onClick={() => copyText(lead.phone!, 'phone')}
              className="text-slate-400 hover:text-indigo-400 ml-2"
              title="Copy Phone"
            >
              {copiedField === 'phone' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Email */}
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className={`font-medium truncate ${lead.email ? 'text-slate-200' : 'text-slate-500 italic'}`}>
              {lead.email || 'Awaiting email...'}
            </span>
          </div>
          {lead.email && (
            <button
              onClick={() => copyText(lead.email!, 'email')}
              className="text-slate-400 hover:text-indigo-400 ml-2"
              title="Copy Email"
            >
              {copiedField === 'email' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Emergency Triage Status */}
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 flex items-center justify-between">
          <span className="text-slate-400">Emergency:</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
              lead.isEmergency
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                : 'text-slate-500'
            }`}
          >
            {lead.isEmergency ? 'HIGH URGENCY' : 'Standard Routine'}
          </span>
        </div>
      </div>

      {/* Issue Summary */}
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 space-y-1 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <FileText className="h-3.5 w-3.5" />
          <span>Extracted Issue Summary:</span>
        </div>
        <p className={`pl-5 ${lead.issueSummary ? 'text-slate-200 font-medium' : 'text-slate-500 italic'}`}>
          {lead.issueSummary || 'The AI will summarize the customer\'s core problem here once discussed in chat.'}
        </p>
      </div>
    </div>
  );
};
