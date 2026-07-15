"use client";

import { useState, useTransition } from "react";
import { createAiAgentJobAction, simulateAiAgentRunAction } from "@/app/admin/actions";
import { Calendar, Loader2, Sparkles, Check, Clock } from "lucide-react";

export function PublishSuggestions() {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleTrigger = () => {
    setLoading(true);
    startTransition(async () => {
      const res = await createAiAgentJobAction("publish", "Find recommended schedule publication times");
      if (res.success && res.data) {
        const runRes = await simulateAiAgentRunAction(res.data.id);
        if (runRes.success && runRes.data) {
          setJob(runRes.data);
        }
      }
      setLoading(false);
    });
  };

  const details = job?.output ? JSON.parse(job.output) : null;

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-4 max-w-xl font-semibold">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-3">
        <Calendar className="w-5 h-5 text-indigo-500" />
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            AI Publishing Agent
          </h3>
          <p className="text-[9px] text-zinc-450 dark:text-zinc-500">
            Determine high-traffic publish times and auto-draft newsletter copies.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-center">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
          <span className="text-[10px] text-zinc-450">Analyzing subscriber opening rates patterns...</span>
        </div>
      ) : details ? (
        <div className="space-y-4">
          {/* Best Time */}
          <div className="flex items-center gap-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-150 dark:border-indigo-900/60 rounded-2xl">
            <Clock className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <div>
              <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider block">Recommended Publish Time</span>
              <span className="text-xs font-black text-indigo-950 dark:text-indigo-400 block mt-0.5">
                {details.recommendTime}
              </span>
            </div>
          </div>

          {/* Social posts preview */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-zinc-400 uppercase block">Social Share Copy</span>
            <p className="text-[10px] text-zinc-650 dark:text-zinc-350 leading-relaxed font-normal bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-150 dark:border-zinc-900">
              {details.socialPosts}
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-zinc-400 uppercase block">Newsletter Summary Copy</span>
            <p className="text-[10px] text-zinc-450 leading-relaxed font-normal">
              {details.summary}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setJob(null)}
              className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer"
            >
              Close suggestions
            </button>
          </div>
        </div>
      ) : (
        <div className="py-2">
          <button
            onClick={handleTrigger}
            disabled={isPending}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Publish schedules</span>
          </button>
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
