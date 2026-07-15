"use client";

import { BarChart3, TrendingUp, Sparkles, HelpCircle } from "lucide-react";

export function TrendAnalysisCard() {
  const trends = [
    { topic: "Next.js 16 layouts", volume: "High", index: "+34.5%", desc: "AI detected increased interest in Next.js 16 layout guides." },
    { topic: "Prisma database indexes", volume: "Medium", index: "+15.2%", desc: "Prisma configuration guides are outperforming typical stats by 25%." },
    { topic: "DKIM/DMARC domains validation", volume: "High", index: "+45.1%", desc: "Increased clicks tracking on enterprise domains setups." },
  ];

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-4 max-w-xl font-semibold">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-3">
        <TrendingUp className="w-5 h-5 text-indigo-500" />
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            AI Analytics & Trend Analysis
          </h3>
          <p className="text-[9px] text-zinc-450 dark:text-zinc-500">
            Explain traffic shifts and outline trending topics recommendations.
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {trends.map((t) => (
          <div
            key={t.topic}
            className="p-3 border border-zinc-150 dark:border-zinc-900 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 block">
                {t.topic}
              </span>
              <p className="text-[9px] text-zinc-450 font-normal leading-relaxed">
                {t.desc}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {t.index}
              </span>
              <span className="text-[9px] font-bold text-zinc-450 uppercase border border-zinc-200 dark:border-zinc-850 px-2 py-0.5 rounded">
                Vol: {t.volume}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
