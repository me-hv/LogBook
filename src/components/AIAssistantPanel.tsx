"use client";

import { useState, useTransition } from "react";
import { generateAICompletionAction } from "@/app/admin/actions";
import { Sparkles, Loader2, List, FileText, ChevronDown, Check, Clipboard } from "lucide-react";

interface AIAssistantPanelProps {
  content: string;
  onInsertText: (text: string) => void;
  onApplyExcerpt: (text: string) => void;
}

const TONES = ["Professional", "Technical", "Casual", "Educational", "Marketing"];

export function AIAssistantPanel({ content, onInsertText, onApplyExcerpt }: AIAssistantPanelProps) {
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [outlineTopic, setOutlineTopic] = useState("");
  const [expandNotes, setExpandNotes] = useState("");
  const [rewriteText, setRewriteText] = useState("");
  
  const [result, setResult] = useState("");
  const [summaries, setSummaries] = useState<any | null>(null);
  
  const [activeTab, setActiveTab] = useState<"copilot" | "summarize">("copilot");
  const [isPending, startTransition] = useTransition();

  const handleAction = (type: string, inputData: string) => {
    if (!inputData.trim() && type !== "summarize") {
      alert("Please provide some input text or a topic first.");
      return;
    }

    setResult("");
    setSummaries(null);

    startTransition(async () => {
      const res = await generateAICompletionAction(type, inputData, type === "rewrite" ? selectedTone : undefined);
      if (res.success && res.data) {
        if (type === "summarize") {
          try {
            const parsed = JSON.parse(res.data);
            setSummaries(parsed);
          } catch (e) {
            setResult(res.data);
          }
        } else {
          setResult(res.data);
        }
      } else {
        alert(res.error || "AI assistant encountered an error.");
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 bg-white dark:bg-zinc-950/20 shadow-sm space-y-4 text-left">
      {/* Header Tabs */}
      <div className="flex border-b border-zinc-150 dark:border-zinc-900 pb-2 gap-4">
        <button
          onClick={() => setActiveTab("copilot")}
          className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer ${
            activeTab === "copilot"
              ? "text-zinc-900 dark:text-zinc-50 border-b-2 border-zinc-900 dark:border-zinc-50"
              : "text-zinc-400 hover:text-zinc-650"
          }`}
        >
          Co-pilot Commands
        </button>
        <button
          onClick={() => setActiveTab("summarize")}
          className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer ${
            activeTab === "summarize"
              ? "text-zinc-900 dark:text-zinc-50 border-b-2 border-zinc-900 dark:border-zinc-50"
              : "text-zinc-400 hover:text-zinc-650"
          }`}
        >
          AI Summaries
        </button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center py-6 gap-2 text-zinc-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating AI output...</span>
        </div>
      )}

      {!isPending && activeTab === "copilot" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Generate Outline */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              Generate Outline
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={outlineTopic}
                onChange={(e) => setOutlineTopic(e.target.value)}
                placeholder="Topic: E.g., Caching in Next.js"
                className="flex-grow px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
              <button
                onClick={() => handleAction("outline", outlineTopic)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold hover:bg-zinc-850 transition-colors cursor-pointer"
              >
                Outline
              </button>
            </div>
          </div>

          {/* Expand notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              Expand bullet points to paragraphs
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={expandNotes}
                onChange={(e) => setExpandNotes(e.target.value)}
                placeholder="Notes: Next.js is fast. Static renders."
                className="flex-grow px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
              <button
                onClick={() => handleAction("expand", expandNotes)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold hover:bg-zinc-850 transition-colors cursor-pointer"
              >
                Expand
              </button>
            </div>
          </div>

          {/* Tone Rewrite */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              Rewrite text block
            </label>
            <textarea
              value={rewriteText}
              onChange={(e) => setRewriteText(e.target.value)}
              placeholder="Paste sentence to rewrite..."
              rows={2}
              className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
            />
            <div className="flex gap-2 justify-between items-center">
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="px-2 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-400 focus:outline-none"
              >
                {TONES.map((t) => (
                  <option key={t} value={t} className="dark:bg-zinc-950">
                    {t} Tone
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction("simplify", rewriteText)}
                  className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  Simplify
                </button>
                <button
                  onClick={() => handleAction("rewrite", rewriteText)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold hover:bg-zinc-850 transition-colors cursor-pointer"
                >
                  Rewrite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summarize view */}
      {!isPending && activeTab === "summarize" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <button
            onClick={() => handleAction("summarize", content)}
            className="w-full py-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl hover:bg-zinc-850 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Article Summaries</span>
          </button>

          {summaries && (
            <div className="space-y-3.5 pt-2 border-t border-zinc-100 dark:border-zinc-900/60">
              {/* Short summary */}
              <div className="space-y-1 bg-zinc-50/50 dark:bg-zinc-900/20 p-3 border border-zinc-150 dark:border-zinc-850 rounded-xl relative group">
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Short Summary
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 pr-10">
                  {summaries.shortSummary}
                </p>
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onApplyExcerpt(summaries.shortSummary)}
                    className="p-1 rounded bg-zinc-900 text-white text-[9px] font-bold hover:bg-zinc-800"
                    title="Apply as excerpt"
                  >
                    Use Excerpt
                  </button>
                  <button
                    onClick={() => copyToClipboard(summaries.shortSummary)}
                    className="p-1 rounded border border-zinc-300 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Social summary */}
              <div className="space-y-1 bg-zinc-50/50 dark:bg-zinc-900/20 p-3 border border-zinc-150 dark:border-zinc-850 rounded-xl relative group">
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Social Post Summary
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 pr-10">
                  {summaries.socialSummary}
                </p>
                <button
                  onClick={() => copyToClipboard(summaries.socialSummary)}
                  className="absolute top-2 right-2 p-1 rounded border border-zinc-300 bg-white dark:bg-zinc-950 text-zinc-650 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Newsletter summary */}
              <div className="space-y-1 bg-zinc-50/50 dark:bg-zinc-900/20 p-3 border border-zinc-150 dark:border-zinc-850 rounded-xl relative group">
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Newsletter Summary
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 pr-10">
                  {summaries.newsletterSummary}
                </p>
                <button
                  onClick={() => copyToClipboard(summaries.newsletterSummary)}
                  className="absolute top-2 right-2 p-1 rounded border border-zinc-300 bg-white dark:bg-zinc-950 text-zinc-650 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generic results box for outlined lists */}
      {!isPending && result && (
        <div className="p-4 border border-zinc-200 dark:border-zinc-850 rounded-2xl bg-zinc-50/30 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 uppercase tracking-wider select-none border-b pb-2">
            <span>AI Assistant Result</span>
            <button
              onClick={() => onInsertText(result)}
              className="text-zinc-900 dark:text-zinc-50 hover:underline cursor-pointer"
            >
              Insert in Editor
            </button>
          </div>
          <div className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto pr-1 select-text">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
