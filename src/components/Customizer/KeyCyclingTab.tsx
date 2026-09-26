import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Zap,
  Cpu
} from 'lucide-react';
import { KeyPoolInfo } from '../../types';

interface KeyCyclingTabProps {
  keyPoolInfo: KeyPoolInfo | null;
  onRefreshKeyStatus: () => void;
}

export const KeyCyclingTab: React.FC<KeyCyclingTabProps> = ({
  keyPoolInfo,
  onRefreshKeyStatus,
}) => {
  const [copiedExample, setCopiedExample] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const envSample = `# Option 1: Comma-separated list for multi-key cycling
GEMINI_API_KEYS="AIzaSyKey1...,AIzaSyKey2...,AIzaSyKey3..."

# Option 2: Numbered individual keys
GEMINI_API_KEY_1="AIzaSyKey1..."
GEMINI_API_KEY_2="AIzaSyKey2..."

# Option 3: Standard single key (auto-injected in AI Studio)
GEMINI_API_KEY="AIzaSyDefault..."`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshKeyStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="space-y-5">
      {/* Key Pool Diagnostic Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <span>Key Pool & Failover Status</span>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Check Health</span>
          </button>
        </div>

        {keyPoolInfo ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950 p-3">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  keyPoolInfo.hasKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-200">
                  {keyPoolInfo.hasKey
                    ? `${keyPoolInfo.totalKeys} Gemini Key(s) In Rotation Pool`
                    : 'Smart Local Mode (No External Key Detected)'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{keyPoolInfo.hint}</div>
              </div>
            </div>

            {keyPoolInfo.activePool && keyPoolInfo.activePool.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-slate-400">Configured Key Slots:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {keyPoolInfo.activePool.map((k) => (
                    <div
                      key={k.index}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-indigo-400 font-bold">
                          #{k.index}
                        </span>
                        <span className="font-mono text-slate-300">{k.masked}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          k.isCoolingDown
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {k.isCoolingDown ? 'Cooldown (90s)' : 'Active / Ready'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-slate-400">Loading pool diagnostics...</div>
        )}
      </div>

      {/* How Multi-Key Cycling Works */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Zap className="h-4 w-4 text-amber-400" />
          <span>Why Cycling Keys Prevents 429 Quota Exhaustion</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Free-tier Gemini API keys have generous quotas, but sudden bursts of traffic from Reddit ("Show HN"), Product Hunt, or live client testing can temporarily hit the <code className="text-indigo-300 font-mono">429 RESOURCE_EXHAUSTED</code> limit.
        </p>

        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-200">Round-Robin Distribution:</strong> Successive visitor questions are load-balanced across your configured keys.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-200">Instant Failover:</strong> If a key hits 429 rate limit mid-conversation, the server seamlessly retries with the next healthy key in milliseconds without the visitor ever noticing.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-200">Zero-Crash Local Net:</strong> If every key runs out at once, our instant regex safety net and Q&A fuzzy matcher steps in so your widget still captures leads.
            </span>
          </div>
        </div>
      </div>

      {/* How to Generate New Keys */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <KeyRound className="h-4 w-4 text-indigo-400" />
            <span>How to Generate New Gemini API Keys</span>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>Google AI Studio</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
          <li>
            Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-mono">aistudio.google.com/app/apikey</a>.
          </li>
          <li>
            Click <strong>"Create API Key"</strong> (you can create multiple keys across one or more Google Cloud projects for maximum cycling quota!).
          </li>
          <li>
            In AI Studio Build, configure your key under <strong>Settings &gt; Secrets</strong> as <code className="text-indigo-300 font-mono">GEMINI_API_KEY</code>, or add multiple keys in your <code className="text-indigo-300 font-mono">.env</code> file.
          </li>
        </ol>

        {/* Copyable Env Snippet */}
        <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono text-slate-400">.env Multi-Key Configuration:</span>
            <button
              onClick={() => copyToClipboard(envSample)}
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {copiedExample ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedExample ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
            {envSample}
          </pre>
        </div>
      </div>
    </div>
  );
};
