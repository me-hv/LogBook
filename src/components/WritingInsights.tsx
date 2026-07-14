"use client";

import { useEffect, useState, useTransition } from "react";
import { generateAICompletionAction } from "@/app/admin/actions";
import { Sparkles, Loader2, FileText, CheckCircle2 } from "lucide-react";

interface InsightsResponse {
  readingLevel: string;
  complexity: string;
  passiveVoiceCount: number;
  repetitionScore: number;
  suggestions: string[];
}

interface WritingInsightsProps {
  content: string;
}

export function WritingInsights({ content }: WritingInsightsProps) {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const analyzeInsights = () => {
    if (!content.trim()) return;

    startTransition(async () => {
      const res = await generateAICompletionAction("insights", content);
      if (res.success && res.data) {
        try {
          const parsed = JSON.parse(res.data) as InsightsResponse;
          setData(parsed);
        } catch (e) {
          console.error("Failed to parse Insights output", e);
        }
      }
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      analyzeInsights();
    }, 4000);

    return () => clearTimeout(delayDebounce);
  }, [content]);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 bg-white dark:bg-zinc-950/20 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/60 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4.5 h-4.5 text-zinc-900 dark:text-zinc-50" />
          <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Reading & Clarity Insights
          </h4>
        </div>
        {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />}
      </div>

      {!data ? (
        <div className="text-center py-6 text-zinc-400 text-xs italic">
          Scans content for sentence complexity and readability metrics.
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Main Heuristic Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 border border-zinc-150 dark:border-zinc-850 rounded-2xl space-y-1">
              <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                Reading Level
              </span>
              <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50 block">
                {data.readingLevel}
              </span>
            </div>

            <div className="p-3.5 border border-zinc-150 dark:border-zinc-850 rounded-2xl space-y-1">
              <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                Passive Voice Counts
              </span>
              <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50 block">
                {data.passiveVoiceCount} instances
              </span>
            </div>

            <div className="p-3.5 border border-zinc-150 dark:border-zinc-850 rounded-2xl col-span-2 space-y-1">
              <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                Complexity Analysis
              </span>
              <p className="text-xs text-zinc-650 dark:text-zinc-455 font-semibold">
                {data.complexity}
              </p>
            </div>
          </div>

          {/* Grammar Suggestions */}
          <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-900/60 pt-3">
            <h6 className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              Style Improvements
            </h6>
            <div className="space-y-2">
              {data.suggestions.map((s, idx) => (
                <div key={idx} className="flex gap-2 items-start text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
