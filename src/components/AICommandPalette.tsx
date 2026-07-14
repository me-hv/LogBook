"use client";

import { useState, useTransition } from "react";
import { generateAICompletionAction } from "@/app/admin/actions";
import { Sparkles, Loader2, RefreshCw, Wand2, HelpCircle } from "lucide-react";

interface AICommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  onInsertResult: (resultText: string) => void;
}

const COMMANDS = [
  { key: "rewrite", label: "Rewrite selection", desc: "Rewrite clear and flow-friendly" },
  { key: "expand", label: "Expand bullets", desc: "Turn bullet points into paragraphs" },
  { key: "simplify", label: "Simplify content", desc: "Make complex explanations simple" },
  { key: "outline", label: "Generate outlines", desc: "Build outline from topic notes" },
];

export function AICommandPalette({ isOpen, onClose, selectedText, onInsertResult }: AICommandPaletteProps) {
  const [inputText, setInputText] = useState(selectedText || "");
  const [isPending, startTransition] = useTransition();

  const handleCommand = (type: string) => {
    const inputPayload = inputText.trim() || selectedText;
    if (!inputPayload) {
      alert("Please enter or select some text first.");
      return;
    }

    startTransition(async () => {
      const res = await generateAICompletionAction(type, inputPayload);
      if (res.success && res.data) {
        onInsertResult(res.data);
        onClose();
      } else {
        alert(res.error || "AI Command failed to process.");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-6 animate-in zoom-in-95 duration-200 relative text-left">
        
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-zinc-650" />
            <span>AI Command Palette</span>
          </h3>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
            Select a quick command to rewrite or expand selected editor text.
          </p>
        </div>

        {/* Input Text block */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
            Context Text Selection
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a topic or paste text to apply commands..."
            rows={3}
            className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
        </div>

        {/* Commands Listing Grid */}
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
            Choose AI Command
          </span>
          {isPending ? (
            <div className="flex items-center justify-center py-6 gap-2 text-zinc-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Applying command heuristics...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {COMMANDS.map((cmd) => (
                <button
                  key={cmd.key}
                  onClick={() => handleCommand(cmd.key)}
                  className="p-3 border border-zinc-150 dark:border-zinc-850 hover:border-zinc-400 dark:hover:border-zinc-700 rounded-2xl text-left bg-zinc-50/30 hover:bg-zinc-50/80 transition-all cursor-pointer space-y-1"
                >
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                    {cmd.label}
                  </div>
                  <div className="text-[9px] text-zinc-400 dark:text-zinc-500">
                    {cmd.desc}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info close */}
        <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-900/60 pt-4">
          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 italic">
            Press Escape to cancel
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold rounded-xl text-zinc-650 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
