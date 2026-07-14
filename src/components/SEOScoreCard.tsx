"use client";

import { useEffect, useState, useTransition } from "react";
import { generateAICompletionAction } from "@/app/admin/actions";
import { Sparkles, Loader2, Award, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface SEOResponse {
  titles: string[];
  metaDescription: string;
  keywords: string[];
  score: number;
  suggestions: string[];
}

interface SEOScoreCardProps {
  title: string;
  content: string;
  onApplyTitle: (title: string) => void;
  onApplyMeta: (desc: string) => void;
}

export function SEOScoreCard({ title, content, onApplyTitle, onApplyMeta }: SEOScoreCardProps) {
  const [data, setData] = useState<SEOResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const analyzeSEO = () => {
    if (!content.trim()) return;

    startTransition(async () => {
      const res = await generateAICompletionAction("seo", `Title: ${title}\n\nContent:\n${content}`);
      if (res.success && res.data) {
        try {
          const parsed = JSON.parse(res.data) as SEOResponse;
          setData(parsed);
        } catch (e) {
          console.error("Failed to parse SEO output", e);
        }
      }
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      analyzeSEO();
    }, 2000); // debounce analysis to prevent rate limits

    return () => clearTimeout(delayDebounce);
  }, [title, content]);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 bg-white dark:bg-zinc-950/20 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/60 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-zinc-900 dark:text-zinc-50" />
          <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            SEO Copilot
          </h4>
        </div>
        {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />}
      </div>

      {!data ? (
        <div className="text-center py-6 text-zinc-400 text-xs italic">
          Write content to trigger real-time SEO score metrics.
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Score Circle Banner */}
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200 dark:border-zinc-850 rounded-2xl">
            <div className="w-12 h-12 rounded-full border-4 border-zinc-900 dark:border-zinc-50 flex items-center justify-center text-sm font-extrabold text-zinc-900 dark:text-zinc-50 flex-shrink-0">
              {data.score}
            </div>
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                SEO Optimization Score
              </h5>
              <p className="text-[10px] text-zinc-550 dark:text-zinc-450 leading-normal">
                {data.score >= 80 ? "Excellent keywords distribution!" : "Needs few improvements to rank higher."}
              </p>
            </div>
          </div>

          {/* AI Title Suggestions */}
          <div className="space-y-2">
            <h6 className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              Title Recommendations
            </h6>
            <div className="space-y-1.5">
              {data.titles.slice(0, 3).map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => onApplyTitle(t)}
                  className="p-2 border border-zinc-150 dark:border-zinc-850 rounded-xl hover:border-zinc-400 dark:hover:border-zinc-700 transition-all cursor-pointer flex justify-between items-center text-xs text-zinc-800 dark:text-zinc-300 font-semibold"
                >
                  <span className="truncate pr-2">{t}</span>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 text-zinc-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Meta Description */}
          <div className="space-y-2">
            <h6 className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              Suggested Meta Description
            </h6>
            <div
              onClick={() => onApplyMeta(data.metaDescription)}
              className="p-3 border border-zinc-150 dark:border-zinc-850 bg-zinc-50/20 rounded-xl hover:border-zinc-400 dark:hover:border-zinc-700 transition-all cursor-pointer text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed relative group"
            >
              <p className="pr-4">{data.metaDescription}</p>
              <ArrowRight className="w-3.5 h-3.5 absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
            </div>
          </div>

          {/* Keyword tags list */}
          <div className="space-y-2">
            <h6 className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              High-Value Keywords
            </h6>
            <div className="flex flex-wrap gap-1.5">
              {data.keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-650 dark:text-zinc-450 font-bold select-all"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Heuristic Action checklist */}
          <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-900/60 pt-3">
            <h6 className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              Suggestions list
            </h6>
            <div className="space-y-1.5">
              {data.suggestions.map((s, idx) => (
                <div key={idx} className="flex gap-2 items-start text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
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
