"use client";

import { useState, useTransition } from "react";
import { createAiAgentJobAction, simulateAiAgentRunAction, approveAiSuggestionAction } from "@/app/admin/actions";
import { Sparkles, Loader2, Check, AlertCircle, ArrowRight } from "lucide-react";

export function AIRecommendationCard() {
  const [job, setJob] = useState<any>(null);
  const [loadingStep, setLoadingStep] = useState<"idle" | "creating" | "running">("idle");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleTrigger = () => {
    setLoadingStep("creating");
    startTransition(async () => {
      const res = await createAiAgentJobAction("editorial", "Recommend layout topics & outlines");
      if (res.success && res.data) {
        setJob(res.data);
        setLoadingStep("running");
        
        // Execute background inference simulation
        const runRes = await simulateAiAgentRunAction(res.data.id);
        if (runRes.success && runRes.data) {
          setJob(runRes.data);
        }
      }
      setLoadingStep("idle");
    });
  };

  const handleApprove = () => {
    if (!job) return;
    startTransition(async () => {
      const res = await approveAiSuggestionAction(job.id);
      if (res.success) {
        setJob(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    });
  };

  const details = job?.output ? JSON.parse(job.output) : null;

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-4 max-w-xl font-semibold">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-3">
        <Sparkles className="w-5 h-5 text-violet-500 animate-pulse" />
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            AI Editorial Suggestion Agent
          </h3>
          <p className="text-[9px] text-zinc-450 dark:text-zinc-500">
            Auto-generate outlines and find content gaps matching your publication.
          </p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 p-3 rounded-xl text-xs font-bold text-emerald-850 dark:text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Outline draft post created successfully! Check your drafts list.</span>
        </div>
      )}

      {loadingStep !== "idle" ? (
        <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
          <span className="text-[10px] text-zinc-450">
            {loadingStep === "creating" ? "Queueing AI Agent job..." : "AI model running outlines inference..."}
          </span>
        </div>
      ) : details ? (
        <div className="space-y-4">
          {/* Topics */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-zinc-400 uppercase block">Suggested Topics</span>
            <ul className="space-y-1">
              {details.topics.map((t: string) => (
                <li key={t} className="text-[10px] text-zinc-650 dark:text-zinc-350 list-disc list-inside">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Outline */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-zinc-400 uppercase block">Inferred Outline Layout</span>
            <pre className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-[9px] font-mono text-zinc-500 overflow-x-auto leading-relaxed border border-zinc-150 dark:border-zinc-850">
              {details.outlines}
            </pre>
          </div>

          {/* Gaps */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-zinc-400 uppercase block">Content Gaps Analysis</span>
            <p className="text-[10px] text-zinc-450 leading-relaxed font-normal">
              {details.gaps}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900/60 flex justify-end gap-2">
            <button
              onClick={() => setJob(null)}
              className="px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl text-xs font-bold text-zinc-450 hover:text-zinc-700 cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={handleApprove}
              disabled={isPending}
              className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Approve Outline</span>
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
            <span>Generate Topic Outlines</span>
          </button>
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
