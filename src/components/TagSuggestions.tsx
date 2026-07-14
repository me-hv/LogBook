"use client";

import { useEffect, useState, useTransition } from "react";
import { generateAICompletionAction } from "@/app/admin/actions";
import { Sparkles, Loader2, Tags, ArrowRight } from "lucide-react";

interface TagSuggestionsResponse {
  categories: string[];
  tags: string[];
}

interface TagSuggestionsProps {
  content: string;
  onApplyCategory: (cat: string) => void;
  onApplyTag: (tag: string) => void;
}

export function TagSuggestions({ content, onApplyCategory, onApplyTag }: TagSuggestionsProps) {
  const [data, setData] = useState<TagSuggestionsResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const analyzeTags = () => {
    if (!content.trim()) return;

    startTransition(async () => {
      const res = await generateAICompletionAction("tags", content);
      if (res.success && res.data) {
        try {
          const parsed = JSON.parse(res.data) as TagSuggestionsResponse;
          setData(parsed);
        } catch (e) {
          console.error("Failed to parse TagSuggestions output", e);
        }
      }
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      analyzeTags();
    }, 3000);

    return () => clearTimeout(delayDebounce);
  }, [content]);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 bg-white dark:bg-zinc-950/20 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/60 pb-3">
        <div className="flex items-center gap-2">
          <Tags className="w-4.5 h-4.5 text-zinc-900 dark:text-zinc-50" />
          <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            AI Tag & Taxonomy Suggestor
          </h4>
        </div>
        {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />}
      </div>

      {!data ? (
        <div className="text-center py-6 text-zinc-400 text-xs italic">
          Analyses taxonomy mapping once you write content.
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Category Recommendations */}
          <div className="space-y-2">
            <h6 className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              Suggested Categories
            </h6>
            <div className="flex flex-wrap gap-1.5">
              {data.categories.map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onApplyCategory(cat)}
                  className="px-2.5 py-1 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-zinc-800 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{cat}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Tags Recommendations */}
          <div className="space-y-2">
            <h6 className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              Suggested Tags (One-Click Assign)
            </h6>
            <div className="flex flex-wrap gap-1.5">
              {data.tags.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onApplyTag(tag)}
                  className="px-2.5 py-1 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-zinc-800 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>#{tag}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
