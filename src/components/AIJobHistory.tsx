"use client";

import { useEffect, useState, useTransition } from "react";
import { getAiAgentJobsAction } from "@/app/admin/actions";
import { Cpu, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

export function AIJobHistory() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getAiAgentJobsAction();
      if (res.success && res.data) {
        setJobs(res.data);
      }
    });
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case "running":
        return <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-4 max-w-xl font-semibold">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-3">
        <Cpu className="w-5 h-5 text-zinc-455" />
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          AI Agent Task History & Logs
        </h3>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-900/60 max-h-[300px] overflow-y-auto pr-1">
        {isPending ? (
          <div className="py-8 text-center">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-400 mx-auto" />
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(job.status)}
                <div>
                  <span className="text-xs text-zinc-900 dark:text-zinc-150 block capitalize">
                    {job.type} Assistant Audit
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono block">
                    ID: {job.id.substring(0, 10)}... • Created: {new Date(job.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <span className="text-[9px] font-bold text-zinc-450 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-lg">
                {job.tokensUsed} Tokens
              </span>
            </div>
          ))
        ) : (
          <span className="text-[10px] text-zinc-450 italic block text-center py-6">
            No agent jobs logged in this workspace session.
          </span>
        )}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
