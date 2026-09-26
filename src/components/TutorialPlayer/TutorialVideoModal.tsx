import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Check,
  Code,
  Laptop,
  Palette,
  Building2,
  Send,
  ExternalLink,
  Bot,
  Headphones,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface TutorialVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset?: () => void;
}

interface Chapter {
  id: number;
  title: string;
  startTime: number;
  endTime: number;
  description: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Select Icon and Styling',
    startTime: 0,
    endTime: 9,
    description: 'Customize the launcher button icon, border radius, and primary color.'
  },
  {
    id: 2,
    title: 'Configure Business Identity',
    startTime: 9,
    endTime: 18,
    description: 'Enter your business name, industry, and custom greeting.'
  },
  {
    id: 3,
    title: 'Generate Embed Snippet',
    startTime: 18,
    endTime: 27,
    description: 'Open the embed generator and copy the one-line script snippet.'
  },
  {
    id: 4,
    title: 'Embed into Website Code',
    startTime: 27,
    endTime: 36,
    description: 'Paste into HTML, WordPress, Shopify, or Webflow before closing body tag.'
  },
  {
    id: 5,
    title: 'Live Visitor Chat and Lead Capture',
    startTime: 36,
    endTime: 45,
    description: 'Test the live widget, ask questions, and verify lead extraction.'
  }
];

const TOTAL_DURATION = 45; // 45 seconds simulated tutorial

export const TutorialVideoModal: React.FC<TutorialVideoModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Playback timer loop
  useEffect(() => {
    if (!isOpen) return;

    const tick = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying && !isScrubbing) {
        setCurrentTime((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return next;
        });
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [isOpen, isPlaying, isScrubbing, playbackSpeed]);

  // Keyboard shortcuts (Space = toggle play, Esc = close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentChapter = CHAPTERS.find(
    (c) => currentTime >= c.startTime && currentTime <= c.endTime
  ) || CHAPTERS[CHAPTERS.length - 1];

  const seekTo = (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, TOTAL_DURATION));
    setCurrentTime(clamped);
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(ratio * TOTAL_DURATION);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Cursor and simulated interaction state derived from currentTime:
  // Step 1 (0-9s): Styling and icon selection
  // Step 2 (9-18s): Branding inputs
  // Step 3 (18-27s): Opening embed code and clicking copy
  // Step 4 (27-36s): Code editor paste into index.html / theme.liquid
  // Step 5 (36-45s): Live test and lead extraction

  const getCursorState = () => {
    const t = currentTime;

    if (t < 9) {
      // Step 1: Icon & Styling
      if (t < 3) {
        // Move towards Color Selector
        const progress = t / 3;
        return {
          x: 22 + progress * 10,
          y: 35 + Math.sin(progress * Math.PI) * 4,
          clicking: t > 2.6 && t < 3.0,
          actionText: 'Selecting brand primary color'
        };
      } else if (t < 6) {
        // Move to Headset Icon
        const progress = (t - 3) / 3;
        return {
          x: 32 + progress * 8,
          y: 45 + progress * 5,
          clicking: t > 5.4 && t < 5.8,
          actionText: 'Choosing launcher icon: Support Headset'
        };
      } else {
        // Move to Border Radius
        const progress = (t - 6) / 3;
        return {
          x: 40 - progress * 12,
          y: 58 + progress * 4,
          clicking: t > 8.4 && t < 8.8,
          actionText: 'Setting corner curvature: Rounded'
        };
      }
    } else if (t < 18) {
      // Step 2: Branding tab & Typing
      const rel = t - 9;
      if (rel < 3) {
        return {
          x: 18 + rel * 5,
          y: 20 + rel * 2,
          clicking: rel > 2.4 && rel < 2.8,
          actionText: 'Switching to Business Identity tab'
        };
      } else if (rel < 6) {
        return {
          x: 28 + (rel - 3) * 2,
          y: 35,
          clicking: false,
          actionText: 'Entering business name: Apex Heating & Air'
        };
      } else {
        return {
          x: 32,
          y: 50,
          clicking: rel > 8.4,
          actionText: 'Updating receptionist welcome message'
        };
      }
    } else if (t < 27) {
      // Step 3: Get Embed Code
      const rel = t - 18;
      if (rel < 4) {
        const p = rel / 4;
        return {
          x: 32 + p * 48,
          y: 50 - p * 38,
          clicking: rel > 3.4,
          actionText: 'Clicking [Get Embed Snippet] button'
        };
      } else {
        const p = (rel - 4) / 5;
        return {
          x: 65 + p * 5,
          y: 32 + p * 8,
          clicking: rel > 6.8 && rel < 7.4,
          actionText: 'Clicking [Copy Code] to clipboard'
        };
      }
    } else if (t < 36) {
      // Step 4: Code editor paste
      const rel = t - 27;
      if (rel < 4) {
        const p = rel / 4;
        return {
          x: 70 - p * 30,
          y: 40 + p * 15,
          clicking: rel > 3.4,
          actionText: 'Navigating to website index.html file'
        };
      } else {
        return {
          x: 42,
          y: 65,
          clicking: rel > 5.5 && rel < 6.2,
          actionText: 'Pasting script snippet right above </body> tag'
        };
      }
    } else {
      // Step 5: Live Test & Chat
      const rel = t - 36;
      if (rel < 4) {
        const p = rel / 4;
        return {
          x: 42 + p * 42,
          y: 65 + p * 18,
          clicking: rel > 3.2 && rel < 3.8,
          actionText: 'Clicking live floating widget launcher'
        };
      } else if (rel < 6.5) {
        return {
          x: 82,
          y: 84,
          clicking: rel > 6.0,
          actionText: 'Sending customer question: Need emergency AC service'
        };
      } else {
        return {
          x: 80,
          y: 72,
          clicking: false,
          actionText: 'AI Receptionist answers and captures lead information'
        };
      }
    }
  };

  const cursor = getCursorState();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      {/* Modal Container in Black & White */}
      <div
        ref={containerRef}
        className={`relative w-full ${
          isFullscreen ? 'max-w-none h-full' : 'max-w-5xl h-[86vh] max-h-[820px]'
        } flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-2xl overflow-hidden transition-all duration-200`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 sm:px-6 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black font-bold">
              <Play className="h-4 w-4 fill-current ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                  Setup Tutorial Video
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  Step {currentChapter.id} of {CHAPTERS.length}
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Beginner walkthrough: Customizing, copying snippet, and embedding into your website.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                seekTo(TOTAL_DURATION);
                setIsPlaying(false);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              Skip Tutorial
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors hidden sm:block"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Close Tutorial"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Simulation Screen Viewport */}
        <div className="relative flex-1 bg-black overflow-hidden flex flex-col justify-center items-center">
          {/* Simulated Display Screen Frame */}
          <div className="relative w-full h-full p-2 sm:p-4 flex flex-col select-none">
            {/* Screen Window Frame */}
            <div className="relative w-full h-full rounded-xl border border-neutral-800 bg-neutral-900/90 overflow-hidden flex flex-col shadow-inner">
              {/* Fake Browser Tab Bar */}
              <div className="h-8 border-b border-neutral-800 bg-neutral-950 px-3 flex items-center justify-between text-xs font-mono text-neutral-400">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                  </div>
                  <span className="text-[11px] text-neutral-300 pl-2">
                    {currentTime < 27
                      ? 'AI Receptionist Studio — Customize'
                      : currentTime < 36
                      ? 'Visual Studio Code — website/index.html'
                      : 'Live Client Website — Verification Test'}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                  Simulation 1080p
                </div>
              </div>

              {/* Viewport Content Changes According to Step */}
              <div className="relative flex-1 overflow-hidden bg-neutral-950 text-neutral-200">
                {/* Scene 1 & 2: Studio Customizer UI (0 - 27s) */}
                {currentTime < 27 && (
                  <div className="h-full flex flex-col sm:flex-row p-4 gap-4">
                    {/* Left Customizer Panel */}
                    <div className="w-full sm:w-1/2 border border-neutral-800 rounded-xl bg-neutral-900/70 p-4 space-y-4">
                      {/* Tabs */}
                      <div className="flex gap-2 border-b border-neutral-800 pb-2 text-xs">
                        <span
                          className={`px-3 py-1 rounded font-semibold ${
                            currentTime < 9 ? 'bg-white text-black' : 'text-neutral-400'
                          }`}
                        >
                          Styling and Icon
                        </span>
                        <span
                          className={`px-3 py-1 rounded font-semibold ${
                            currentTime >= 9 && currentTime < 18
                              ? 'bg-white text-black'
                              : 'text-neutral-400'
                          }`}
                        >
                          Business Identity
                        </span>
                      </div>

                      {/* Controls Area */}
                      {currentTime < 9 ? (
                        <div className="space-y-4 text-xs">
                          <div>
                            <div className="text-neutral-400 mb-1.5 font-medium">Primary Brand Color</div>
                            <div className="flex gap-2 items-center">
                              <span
                                className={`h-6 w-6 rounded-full border-2 ${
                                  currentTime > 2.6 ? 'border-white bg-white' : 'border-neutral-500 bg-neutral-700'
                                }`}
                              />
                              <span className="font-mono text-neutral-300">
                                {currentTime > 2.6 ? '#ffffff (Crisp White)' : '#0f172a (Obsidian)'}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="text-neutral-400 mb-1.5 font-medium">Launcher Icon</div>
                            <div className="grid grid-cols-4 gap-2">
                              <div
                                className={`p-2 rounded border text-center flex flex-col items-center gap-1 ${
                                  currentTime > 5.4 ? 'border-neutral-700 text-neutral-500' : 'border-white text-white'
                                }`}
                              >
                                <Bot className="h-4 w-4" />
                                <span className="text-[10px]">Bot</span>
                              </div>
                              <div
                                className={`p-2 rounded border text-center flex flex-col items-center gap-1 ${
                                  currentTime > 5.4 ? 'border-white text-white bg-neutral-800' : 'border-neutral-700 text-neutral-500'
                                }`}
                              >
                                <Headphones className="h-4 w-4" />
                                <span className="text-[10px]">Headset</span>
                              </div>
                              <div className="p-2 rounded border border-neutral-800 text-neutral-500 text-center flex flex-col items-center gap-1">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-[10px]">Spark</span>
                              </div>
                              <div className="p-2 rounded border border-neutral-800 text-neutral-500 text-center flex flex-col items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span className="text-[10px]">Bubble</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-neutral-400 mb-1.5 font-medium">Corner Curvature</div>
                            <div className="flex gap-2">
                              <span className="px-3 py-1 rounded border border-neutral-800 text-neutral-500">Sharp</span>
                              <span className="px-3 py-1 rounded border border-white text-white bg-neutral-800">Rounded</span>
                              <span className="px-3 py-1 rounded border border-neutral-800 text-neutral-500">Soft</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 text-xs">
                          <div>
                            <div className="text-neutral-400 mb-1 font-medium">Business / Practice Name</div>
                            <div className="p-2 rounded border border-white bg-black font-mono text-white">
                              {currentTime > 12 ? 'Apex Heating & Air Conditioning' : 'Apex Heating'}
                            </div>
                          </div>
                          <div>
                            <div className="text-neutral-400 mb-1 font-medium">Industry Vertical</div>
                            <div className="p-2 rounded border border-neutral-800 bg-neutral-950 text-neutral-300">
                              HVAC and Plumbing Services
                            </div>
                          </div>
                          <div>
                            <div className="text-neutral-400 mb-1 font-medium">Welcome Greeting</div>
                            <div className="p-2 rounded border border-neutral-800 bg-neutral-950 text-neutral-300">
                              {currentTime > 15
                                ? 'Welcome to Apex Heating. Need urgent service or a repair estimate?'
                                : 'Hello. How can we assist you today?'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Live Preview Panel */}
                    <div className="flex-1 border border-neutral-800 rounded-xl bg-neutral-950 p-4 relative flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-900 pb-2">
                        <span>Live Preview Viewport</span>
                        <div
                          className={`px-3 py-1 rounded font-bold text-xs ${
                            currentTime >= 18 && currentTime < 22
                              ? 'bg-white text-black scale-105'
                              : 'bg-neutral-800 text-white'
                          }`}
                        >
                          [Get Embed Snippet]
                        </div>
                      </div>

                      <div className="text-center py-8 text-neutral-500 text-xs">
                        Website Sandbox Canvas
                      </div>

                      {/* Floating Widget Display in Studio Preview */}
                      <div className="self-end flex flex-col items-end gap-2">
                        {currentTime >= 6 && currentTime < 18 && (
                          <div className="w-56 p-3 rounded-xl border border-neutral-800 bg-neutral-900 text-xs shadow-xl space-y-1.5">
                            <div className="font-bold text-white flex items-center justify-between">
                              <span>Apex Heating & Air</span>
                              <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            </div>
                            <p className="text-[11px] text-neutral-400">
                              {currentTime > 15
                                ? 'Welcome to Apex Heating. Need urgent service?'
                                : 'Hello. How can we assist you today?'}
                            </p>
                          </div>
                        )}
                        <div className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-lg">
                          {currentTime > 5.4 ? <Headphones className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                        </div>
                      </div>
                    </div>

                    {/* Pop-up Embed Modal Simulation (18 - 27s) */}
                    {currentTime >= 18 && (
                      <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4">
                        <div className="w-full max-w-lg border border-neutral-700 rounded-xl bg-neutral-900 p-5 space-y-3 shadow-2xl">
                          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                            <span className="font-bold text-sm text-white">Embed Script Snippet</span>
                            <span className="text-xs text-neutral-400">Step 3</span>
                          </div>
                          <p className="text-xs text-neutral-400">
                            Copy this one line into WordPress, Shopify, Squarespace, or HTML:
                          </p>
                          <div className="p-3 rounded bg-black font-mono text-[11px] text-neutral-300 border border-neutral-800 overflow-x-auto whitespace-pre">
{`<script
  src="https://your-domain.com/widget.js"
  data-business="Apex Heating & Air"
  data-color="#ffffff"
  async>
</script>`}
                          </div>
                          <div className="flex justify-end pt-1">
                            <div
                              className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                                currentTime > 22.8
                                  ? 'bg-emerald-500 text-black'
                                  : 'bg-white text-black'
                              }`}
                            >
                              {currentTime > 22.8 ? 'Copied to Clipboard' : 'Copy Code'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Scene 3: Code Editor / Pasting into Website (27 - 36s) */}
                {currentTime >= 27 && currentTime < 36 && (
                  <div className="h-full flex flex-col p-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-xs font-mono text-neutral-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-white" />
                        <span className="text-white font-bold">index.html (or WordPress theme.liquid)</span>
                      </div>
                      <span>UTF-8 • HTML5</span>
                    </div>

                    <div className="flex-1 rounded-xl bg-black border border-neutral-800 p-4 font-mono text-xs text-neutral-300 leading-relaxed overflow-hidden">
                      <div className="text-neutral-500">&lt;!DOCTYPE html&gt;</div>
                      <div className="text-neutral-500">&lt;html lang="en"&gt;</div>
                      <div className="text-neutral-500 pl-4">&lt;head&gt;</div>
                      <div className="text-neutral-400 pl-8">&lt;title&gt;Apex Heating & Air Conditioning&lt;/title&gt;</div>
                      <div className="text-neutral-500 pl-4">&lt;/head&gt;</div>
                      <div className="text-neutral-500 pl-4">&lt;body&gt;</div>
                      <div className="text-neutral-400 pl-8">&lt;header&gt;Welcome to Our Homepage&lt;/header&gt;</div>
                      <div className="text-neutral-400 pl-8">&lt;main&gt;Contractor services and contact details...&lt;/main&gt;</div>
                      <div className="text-neutral-600 pl-8">&lt;!-- Paste the widget script right before the closing body tag --&gt;</div>

                      {/* Pasted Snippet Animation */}
                      {currentTime >= 31 && (
                        <div className="my-2 p-2 rounded bg-neutral-900/90 border border-white text-white font-mono text-xs pl-8 animate-fadeIn">
                          <div>&lt;script</div>
                          <div className="pl-4">src="https://your-domain.com/widget.js"</div>
                          <div className="pl-4">data-business="Apex Heating & Air"</div>
                          <div className="pl-4">data-color="#ffffff"</div>
                          <div className="pl-4">async&gt;&lt;/script&gt;</div>
                        </div>
                      )}

                      <div className="text-neutral-500 pl-4">&lt;/body&gt;</div>
                      <div className="text-neutral-500">&lt;/html&gt;</div>
                    </div>
                  </div>
                )}

                {/* Scene 4: Live Website Verification & Visitor Chat (36 - 45s) */}
                {currentTime >= 36 && (
                  <div className="h-full flex flex-col p-4 relative">
                    <div className="border-b border-neutral-800 pb-2 text-xs text-neutral-400 flex justify-between items-center mb-3">
                      <span className="font-bold text-white">Production Website: apexheatingandair.com</span>
                      <span className="text-[11px] text-emerald-400 font-mono">Widget Active (24/7)</span>
                    </div>

                    <div className="flex-1 border border-neutral-800 rounded-xl bg-neutral-900/40 p-6 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-black text-white">Apex Heating and Air Conditioning</h2>
                        <p className="text-xs text-neutral-400 mt-1">
                          Licensed 24/7 HVAC and Plumbing Services in Greater Metro.
                        </p>
                      </div>

                      {/* Open Chat Window */}
                      {currentTime >= 39 && (
                        <div className="self-end w-80 rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                            <span className="font-bold text-xs text-white">Apex Heating AI Receptionist</span>
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="p-2 rounded bg-neutral-900 text-neutral-300">
                              Welcome to Apex Heating. Need urgent service or a repair estimate?
                            </div>
                            <div className="p-2 rounded bg-white text-black font-medium self-end text-right ml-6">
                              My air conditioner stopped working and is blowing hot air!
                            </div>
                            {currentTime >= 42 && (
                              <div className="p-2 rounded bg-neutral-900 text-neutral-200 border border-neutral-800">
                                We treat urgent cooling issues with high priority. Could you share your name and phone number so our on-call technician can reach you right away?
                              </div>
                            )}
                          </div>

                          <div className="p-1 rounded border border-neutral-800 bg-neutral-900 text-[11px] text-neutral-500">
                            Type message or phone number...
                          </div>
                        </div>
                      )}

                      {/* Launcher Icon */}
                      <div className="self-end flex items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-2xl">
                          <Headphones className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Animated Mouse Cursor */}
                <div
                  className="pointer-events-none absolute z-40 transition-all duration-300 ease-out"
                  style={{
                    left: `${cursor.x}%`,
                    top: `${cursor.y}%`,
                    transform: 'translate(-2px, -2px)'
                  }}
                >
                  {/* Cursor Arrow */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="drop-shadow-lg"
                  >
                    <path
                      d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L5.5 3.21Z"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* Click Ripple Indicator */}
                  {cursor.clicking && (
                    <span className="absolute -top-2 -left-2 h-8 w-8 rounded-full border-2 border-white animate-ping opacity-75" />
                  )}

                  {/* Tooltip Description on Cursor */}
                  <div className="absolute left-6 top-2 whitespace-nowrap rounded bg-white px-2 py-0.5 text-[10px] font-mono text-black font-semibold shadow-md border border-neutral-300">
                    {cursor.actionText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Player Controls (Seekable Scrubber & Buttons) */}
        <div className="border-t border-neutral-800 bg-neutral-950 p-4 space-y-3 shrink-0">
          {/* Chapter Quick Navigation Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {CHAPTERS.map((ch) => {
              const isActive = currentChapter.id === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => seekTo(ch.startTime)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors border ${
                    isActive
                      ? 'border-white bg-white text-black font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  Step {ch.id}: {ch.title}
                </button>
              );
            })}
          </div>

          {/* Interactive Timeline Scrubber */}
          <div
            onClick={handleScrubberClick}
            className="group relative h-3 w-full rounded-full bg-neutral-800 cursor-pointer flex items-center"
          >
            {/* Played Fill Bar */}
            <div
              className="h-full rounded-full bg-white relative transition-all"
              style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
            >
              {/* Scrubber Knob */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md border-2 border-black scale-100 group-hover:scale-125 transition-transform" />
            </div>

            {/* Chapter Break Marks */}
            {CHAPTERS.slice(1).map((ch) => (
              <div
                key={ch.id}
                className="absolute top-0 bottom-0 w-0.5 bg-neutral-950 opacity-80"
                style={{ left: `${(ch.startTime / TOTAL_DURATION) * 100}%` }}
                title={ch.title}
              />
            ))}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
              </button>

              {/* Restart */}
              <button
                onClick={() => {
                  seekTo(0);
                  setIsPlaying(true);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                title="Restart Video"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Time Display */}
              <div className="font-mono text-neutral-300 text-xs">
                <span>{formatTime(currentTime)}</span>
                <span className="text-neutral-600"> / </span>
                <span className="text-neutral-500">{formatTime(TOTAL_DURATION)}</span>
              </div>
            </div>

            {/* Current Step Description */}
            <div className="hidden md:block text-xs text-neutral-400 italic max-w-sm truncate text-center">
              {currentChapter.description}
            </div>

            {/* Speed Options & Close */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 text-[11px] hidden sm:inline">Speed:</span>
              {[1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold border transition-colors ${
                    playbackSpeed === spd
                      ? 'border-white bg-white text-black'
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}

              <button
                onClick={onClose}
                className="ml-2 px-3 py-1 rounded-lg bg-neutral-800 text-white font-medium hover:bg-neutral-700 text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
