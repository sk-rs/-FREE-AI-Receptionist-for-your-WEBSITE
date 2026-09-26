import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Check, Sparkles, HelpCircle } from 'lucide-react';
import { INDUSTRY_PRESETS } from '../../constants/presets';
import { WidgetConfig, KnowledgeBaseItem } from '../../types';

interface KnowledgeBaseTabProps {
  config: WidgetConfig;
  onChange: (updated: Partial<WidgetConfig>) => void;
}

export const KnowledgeBaseTab: React.FC<KnowledgeBaseTabProps> = ({ config, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newItem: KnowledgeBaseItem = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    };

    onChange({ knowledgeBase: [...config.knowledgeBase, newItem] });
    setNewQuestion('');
    setNewAnswer('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onChange({ knowledgeBase: config.knowledgeBase.filter((k) => k.id !== id) });
  };

  const startEdit = (item: KnowledgeBaseItem) => {
    setEditingId(item.id);
    setEditQuestion(item.question);
    setEditAnswer(item.answer);
  };

  const saveEdit = (id: string) => {
    onChange({
      knowledgeBase: config.knowledgeBase.map((k) =>
        k.id === id ? { ...k, question: editQuestion.trim(), answer: editAnswer.trim() } : k
      ),
    });
    setEditingId(null);
  };

  const loadPresetKB = (presetId: string) => {
    const preset = INDUSTRY_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      onChange({ knowledgeBase: preset.knowledgeBase });
    }
  };

  return (
    <div className="space-y-5">
      {/* Overview & Quick Packs */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <span>Business Knowledge Base</span>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {config.knowledgeBase.length} Q&A Entries
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The AI receptionist references these answers whenever a visitor asks about your services, pricing, business hours, emergency policies, or licensing.
        </p>

        {/* Load Templates */}
        <div>
          <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Load Curated Industry Q&A Pack:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {INDUSTRY_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => loadPresetKB(p.id)}
                className="text-xs rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 text-slate-300 hover:border-indigo-500 hover:text-white transition-colors"
              >
                {p.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Q&A Button / Form */}
      {!isAdding ? (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-3 text-xs font-semibold text-indigo-400 hover:border-indigo-500 hover:bg-slate-900/60 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Q&A Pair</span>
        </button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-xl border border-indigo-500/50 bg-slate-900/90 p-4 space-y-3 shadow-lg">
          <div className="text-xs font-semibold text-indigo-300">New Knowledge Base Entry</div>
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Customer Question / Trigger
            </label>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="e.g. Do you offer free estimates?"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Accurate Answer from Business
            </label>
            <textarea
              rows={2}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="e.g. Yes! We provide 100% free in-person and photo estimates with no obligation."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
            >
              Save Entry
            </button>
          </div>
        </form>
      )}

      {/* List of Knowledge Entries */}
      <div className="space-y-3">
        {config.knowledgeBase.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2 hover:border-slate-700 transition-colors"
          >
            {editingId === item.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none resize-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => saveEdit(item.id)}
                    className="rounded bg-indigo-600 px-2.5 py-1 text-xs text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>{item.question}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="text-slate-400 hover:text-indigo-400 p-1 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-400 pl-5 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                  {item.answer}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
