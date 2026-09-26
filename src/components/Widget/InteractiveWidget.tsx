import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Bot,
  Headphones,
  Sparkles,
  PhoneCall,
  Send,
  X,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { WidgetConfig, ChatMessage, ExtractedLead } from '../../types';
import { playChime } from '../../utils/sound';

interface InteractiveWidgetProps {
  config: WidgetConfig;
  onLeadUpdated?: (lead: ExtractedLead) => void;
  onResetRef?: (resetFn: () => void) => void;
}

export const InteractiveWidget: React.FC<InteractiveWidgetProps> = ({
  config,
  onLeadUpdated,
  onResetRef
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasEmergency, setHasEmergency] = useState(false);
  const [latestLead, setLatestLead] = useState<ExtractedLead>({
    name: null,
    phone: null,
    email: null,
    issueSummary: null,
    isEmergency: false,
    status: 'active',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome greeting
  const initGreeting = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: config.welcomeGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setHasEmergency(false);
    setLatestLead({
      name: null,
      phone: null,
      email: null,
      issueSummary: null,
      isEmergency: false,
      status: 'active',
    });
  };

  useEffect(() => {
    initGreeting();
  }, [config.welcomeGreeting]);

  useEffect(() => {
    if (onResetRef) {
      onResetRef(initGreeting);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          tenantConfig: {
            businessName: config.businessName,
            industry: config.industry,
            receptionistName: config.receptionistName,
            knowledgeBase: config.knowledgeBase,
          },
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "Thanks! Someone from our team will follow up with you shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (config.soundEnabled) {
        playChime();
      }

      if (data.lead) {
        const isQualified = Boolean(data.lead.name && (data.lead.phone || data.lead.email));
        const updatedLead: ExtractedLead = {
          name: data.lead.name || latestLead.name,
          phone: data.lead.phone || latestLead.phone,
          email: data.lead.email || latestLead.email,
          issueSummary: data.lead.issueSummary || latestLead.issueSummary,
          isEmergency: Boolean(data.lead.isEmergency || latestLead.isEmergency),
          status: isQualified ? 'qualified' : 'active',
        };

        setLatestLead(updatedLead);
        if (updatedLead.isEmergency) {
          setHasEmergency(true);
        }
        if (onLeadUpdated) {
          onLeadUpdated(updatedLead);
        }
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Thanks for reaching out! We received your message and our team will follow up right away. What is the best phone number to reach you?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const getBorderRadiusClass = () => {
    switch (config.borderRadius) {
      case 'sharp':
        return 'rounded-lg';
      case 'soft':
        return 'rounded-3xl';
      default:
        return 'rounded-2xl';
    }
  };

  const renderLauncherIcon = () => {
    switch (config.iconType) {
      case 'bot':
        return <Bot className="h-6 w-6 text-white" />;
      case 'headset':
        return <Headphones className="h-6 w-6 text-white" />;
      case 'sparkles':
        return <Sparkles className="h-6 w-6 text-white" />;
      case 'phone':
        return <PhoneCall className="h-6 w-6 text-white" />;
      default:
        return <MessageSquare className="h-6 w-6 text-white" />;
    }
  };

  const isLeft = config.position === 'bottom-left';

  return (
    <div
      className={`fixed z-30 flex flex-col ${
        isLeft ? 'items-start left-4 sm:left-8' : 'items-end right-4 sm:right-8'
      } bottom-4 sm:bottom-8`}
      style={{ fontFamily: config.fontFamily }}
    >
      {/* Expanded Chat Box */}
      {isOpen && (
        <div
          className={`flex flex-col w-[350px] sm:w-[390px] h-[540px] max-h-[calc(100vh-120px)] bg-white text-slate-900 shadow-2xl border border-slate-200/80 mb-3 overflow-hidden transition-all duration-200 ${getBorderRadiusClass()}`}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 shadow-sm"
            style={{ backgroundColor: config.primaryColor, color: config.headerTextColor }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold backdrop-blur-sm">
                  {config.receptionistName.charAt(0) || 'R'}
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-bold leading-tight">{config.businessName}</div>
                <div className="text-[11px] opacity-90 flex items-center gap-1.5 mt-0.5">
                  <span>{config.receptionistName} • {config.receptionistTitle}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={initGreeting}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="Restart conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="Minimize chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Emergency Alert Banner */}
          {config.showEmergencyBanner && hasEmergency && (
            <div className="bg-rose-50 border-b border-rose-200 px-3.5 py-2 flex items-center gap-2 text-rose-800 text-xs font-semibold animate-pulse">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
              <span>Priority Alert: Urgent issue detected. Dispatch alerted!</span>
            </div>
          )}

          {/* Qualified Lead Notification Badge */}
          {latestLead.status === 'qualified' && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-3.5 py-1.5 flex items-center justify-between text-emerald-800 text-[11px] font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                Contact Info Saved ({latestLead.phone || latestLead.email})
              </span>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                Qualified
              </span>
            </div>
          )}

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70 text-sm">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 shadow-sm text-sm leading-relaxed ${
                      isUser
                        ? 'text-white rounded-2xl rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-2xl rounded-bl-xs'
                    }`}
                    style={isUser ? { backgroundColor: config.primaryColor } : {}}
                  >
                    {m.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 shadow-sm flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Action Chips */}
          {config.enableQuickChips && config.quickChips.length > 0 && messages.length <= 2 && (
            <div className="px-3 py-2 bg-slate-100/70 border-t border-slate-200/60 overflow-x-auto flex gap-1.5 no-scrollbar">
              {config.quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  disabled={isLoading}
                  className="whitespace-nowrap rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-2xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={config.placeholderText || "Type your question..."}
              disabled={isLoading}
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white border border-transparent focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="h-9 w-9 rounded-full flex items-center justify-center text-white transition-transform active:scale-95 disabled:opacity-40 disabled:scale-100 shadow-md"
              style={{ backgroundColor: config.primaryColor }}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
        style={{ backgroundColor: config.primaryColor }}
        aria-label="Open AI Receptionist Chat"
      >
        {/* Pulsing ring indicator */}
        <span
          className="absolute -inset-1 rounded-full opacity-35 animate-ping"
          style={{ backgroundColor: config.primaryColor }}
        />

        {isOpen ? (
          <X className="h-6 w-6 text-white transition-transform group-hover:rotate-90" />
        ) : (
          renderLauncherIcon()
        )}

        {/* Online Status Green Dot */}
        <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
      </button>
    </div>
  );
};
