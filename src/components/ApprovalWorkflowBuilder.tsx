"use client";

import { useState, useTransition } from "react";
import { saveApprovalWorkflowAction } from "@/app/admin/actions";
import { Check, ShieldCheck, HelpCircle, Loader2, ArrowRight } from "lucide-react";

export function ApprovalWorkflowBuilder() {
  const [stages, setStages] = useState({
    legal: true,
    editorial: true,
    seo: false,
  });
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggleStage = (key: keyof typeof stages) => {
    setStages({
      ...stages,
      [key]: !stages[key],
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await saveApprovalWorkflowAction(stages);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left max-w-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-650">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Editorial Approval chains
          </h3>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
            Configure multi-step reviewer chains required to publish content.
          </p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 p-3 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Approval workflow changes updated successfully!</span>
        </div>
      )}

      {/* Checklist selectors */}
      <div className="space-y-3.5">
        {/* Editorial review */}
        <div className="flex items-center justify-between p-3 border border-zinc-150 dark:border-zinc-900 rounded-2xl">
          <div>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 block">
              Editorial Review Step
            </span>
            <span className="text-[9px] text-zinc-450 block font-normal">
              Requires Senior Editor review approval before scheduling.
            </span>
          </div>
          <button
            onClick={() => handleToggleStage("editorial")}
            className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide cursor-pointer border ${
              stages.editorial
                ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-transparent"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            }`}
          >
            {stages.editorial ? "Required" : "Optional"}
          </button>
        </div>

        {/* Legal review */}
        <div className="flex items-center justify-between p-3 border border-zinc-150 dark:border-zinc-900 rounded-2xl">
          <div>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 block">
              Legal Compliance Audit
            </span>
            <span className="text-[9px] text-zinc-450 block font-normal">
              Requires Legal Counsel review signature verifying copyright permissions.
            </span>
          </div>
          <button
            onClick={() => handleToggleStage("legal")}
            className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide cursor-pointer border ${
              stages.legal
                ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-transparent"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            }`}
          >
            {stages.legal ? "Required" : "Optional"}
          </button>
        </div>

        {/* SEO review */}
        <div className="flex items-center justify-between p-3 border border-zinc-150 dark:border-zinc-900 rounded-2xl">
          <div>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 block">
              SEO optimization Checklist
            </span>
            <span className="text-[9px] text-zinc-450 block font-normal">
              Requires SEO auditor rating pass checking keyword density parameters.
            </span>
          </div>
          <button
            onClick={() => handleToggleStage("seo")}
            className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide cursor-pointer border ${
              stages.seo
                ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-transparent"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            }`}
          >
            {stages.seo ? "Required" : "Optional"}
          </button>
        </div>
      </div>

      {/* Visual Workflow Steps */}
      <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900/60">
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
          Workflow Preview Map
        </span>
        <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold text-zinc-550 dark:text-zinc-400">
          <span className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            1. Draft creation
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          {stages.legal && (
            <>
              <span className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                2. Legal review
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </>
          )}
          {stages.editorial && (
            <>
              <span className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                3. Editorial check
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </>
          )}
          {stages.seo && (
            <>
              <span className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                4. SEO Audit
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </>
          )}
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg">
            Released Publish
          </span>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2"
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Save Workflow Chain</span>
        </button>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
