import React from 'react';
import { X, GitBranch, Globe, Code, ArrowRight, ShieldCheck, CheckCircle2, Terminal, Layers } from 'lucide-react';

interface GitHubWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubWorkflowModal: React.FC<GitHubWorkflowModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">How GitHub Distribution and Live Hosting Works</h2>
              <p className="text-xs text-neutral-400">
                Understanding how visitors find your repo, view the studio UI, and embed your widget.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-neutral-300 leading-relaxed">
          {/* Visual Architecture Diagram */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 font-mono space-y-3">
            <div className="text-neutral-400 text-[11px] font-semibold uppercase tracking-wider">
              Distribution Architecture
            </div>
            <pre className="text-neutral-200 text-[11px] whitespace-pre overflow-x-auto leading-relaxed">
{`Your GitHub Repository (Code & Documentation)
├── README.md               -> Explains the project & links to Live Studio Demo
├── public/widget.js        -> The standalone script that runs on visitor websites
├── backend/ & server.ts    -> The API server that handles Gemini key cycling
└── src/                    -> The visual studio UI you are using right now

                 │
                 ├──> 1. PUSH TO GITHUB (Public open-source repository)
                 │       Anyone can read your code, star, fork, and verify your research.
                 │
                 └──> 2. HOST THE LIVE STUDIO (Free 1-Click with Vercel or GitHub Pages)
                         Anyone can click the demo link in your README, customize
                         their widget visually, and copy the embed code.`}
            </pre>
          </div>

          {/* 3 Step Breakdown */}
          <div className="space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4 space-y-2">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-mono font-bold">1</span>
                <span>You post the code to GitHub</span>
              </div>
              <p className="text-neutral-400 pl-7">
                When you create a public GitHub repository (e.g., <code className="text-neutral-200">github.com/your-username/ai-receptionist</code>) and push these files, GitHub displays your repository files and your formatted <code className="text-neutral-200">README.md</code>. Developers from Hacker News, Reddit, or Y Combinator can inspect your code and license.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4 space-y-2">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-mono font-bold">2</span>
                <span>How users see this UI online (Live Hosting)</span>
              </div>
              <p className="text-neutral-400 pl-7">
                To let visitors click a link and use this exact visual customizer in their browser without installing anything, you connect your GitHub repo to a free web host:
              </p>
              <ul className="list-disc list-inside pl-7 space-y-1 text-neutral-300">
                <li>
                  <strong className="text-white">Option A: Vercel or Cloud Run (Recommended):</strong> Takes 60 seconds. Import your GitHub repo, click Deploy, and you get a permanent URL like <code className="text-neutral-200">https://ai-receptionist.vercel.app</code>.
                </li>
                <li>
                  <strong className="text-white">Option B: GitHub Pages:</strong> In your repo Settings under Pages, enable GitHub Pages to host the static application for free at <code className="text-neutral-200">your-username.github.io/ai-receptionist</code>.
                </li>
              </ul>
              <p className="text-neutral-400 pl-7">
                You place this live URL right at the very top of your <code className="text-neutral-200">README.md</code>: <code className="text-neutral-200">[Live Interactive Studio and Demo](https://your-url.com)</code>.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4 space-y-2">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-mono font-bold">3</span>
                <span>How website owners use the widget</span>
              </div>
              <p className="text-neutral-400 pl-7">
                Business owners or web designers do not need to download or compile anything. They open your live studio, customize their colors and questions, click <strong className="text-white">Get Embed Snippet</strong>, and paste the one-line tag into their WordPress, Shopify, or Squarespace header/footer. The widget immediately floats on their website.
              </p>
            </div>
          </div>

          {/* Passive Visibility Compliance Confirmation */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-white text-xs">Zero-Advertising and Passive Visibility</div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Publishing open-source code on GitHub and hosting a public interactive documentation site is standard technical distribution. You are not running paid ads or commercial solicitation, keeping your status clean and fully compliant with academic and open-source contribution guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 bg-neutral-900/90 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
