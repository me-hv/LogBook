"use client";

import { Activity, Zap, ThumbsUp, AlertCircle } from "lucide-react";

export function ApiUsageChart() {
  const chartData = [
    { label: "Mon", value: 120 },
    { label: "Tue", value: 190 },
    { label: "Wed", value: 340 },
    { label: "Thu", value: 280 },
    { label: "Fri", value: 410 },
    { label: "Sat", value: 150 },
    { label: "Sun", value: 220 },
  ];

  const maxVal = Math.max(...chartData.map((d) => d.value));

  const stats = [
    { label: "Average Response Time", value: "142ms", sub: "Global performance latency", icon: Zap, color: "text-amber-500 bg-amber-500/10" },
    { label: "Success Rate", value: "99.85%", sub: "Completed v1 requests", icon: ThumbsUp, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Active Connections", value: "12", sub: "Live requests sessions today", icon: Activity, color: "text-indigo-500 bg-indigo-500/10" },
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          API Monitoring & Usage
        </h3>
        <p className="text-xs text-zinc-500">
          Track traffic query volumes, latency loads, and error rates of public integrations.
        </p>
      </div>

      {/* Grid of stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-zinc-950/40 p-5 border border-zinc-200 dark:border-zinc-850 rounded-2xl shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-1.5 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[9px] text-zinc-450 dark:text-zinc-500 block">
                  {stat.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Usage Chart card */}
      <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl shadow-sm space-y-4">
        <div>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            API Request Volume (Last 7 Days)
          </h4>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
            Requests counts logged over the week.
          </p>
        </div>

        {/* SVG bar chart */}
        <div className="h-48 w-full flex items-end justify-between gap-2.5 pt-4">
          {chartData.map((d, idx) => {
            const pct = (d.value / maxVal) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="text-[9px] font-mono text-zinc-400 font-bold mb-1">
                  {d.value}
                </div>
                <div
                  style={{ height: `${pct}%` }}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 rounded-lg min-h-[8px] transition-all duration-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 cursor-pointer"
                />
                <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
