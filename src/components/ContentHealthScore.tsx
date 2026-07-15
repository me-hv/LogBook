"use client";

import { useState, useTransition } from "react";
import { createAiAgentJobAction, simulateAiAgentRunAction } from "@/app/admin/actions";
import { ShieldAlert, Loader2, Sparkles, AlertTriangle, Check } from "lucide-react";

export function ContentHealthScore() {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleTrigger = () => {
    setLoading(true);
    startTransition(async () => {
      const res = await createAiAgentJobAction("review", "Check draft article text health parameters");
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
        <ShieldAlert className="w-5 h-5 text-emerald-500 animate-pulse" />
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            AI Content Review Agent
          </h3>
          <p className="text-[9px] text-zinc-450 dark:text-zinc-500">
            Scan grammar parameters, readability statistics, and tone check parameters.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-center">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
          <span className="text-[10px] text-zinc-450">Reviewing readability metrics indexes...</span>
        </div>
      ) : details ? (
        <div className="space-y-4">
          {/* Health index progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-zinc-450">READABILITY INDEX</span>
              <span className="text-emerald-500">85/100 (Optimal)</span>
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[85%]" />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* Grammar review */}
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-350 block">Grammar check</span>
                <p className="text-[10px] text-zinc-450 font-normal leading-relaxed">{details.grammar}</p>
              </div>
            </div>

            {/* Tone analysis */}
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-350 block">Brand voice audit</span>
                <p className="text-[10px] text-zinc-450 font-normal leading-relaxed">{details.tone}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setJob(null)}
              className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer"
            >
              Done
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
            <span>Audit Grammar & Tone</span>
          </button>
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
