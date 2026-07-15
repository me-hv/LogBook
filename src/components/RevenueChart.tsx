"use client";

import { DollarSign, BarChart3, TrendingUp, Percent } from "lucide-react";

export function RevenueChart() {
  const weeklyEarnings = [
    { day: "Mon", val: 120 },
    { day: "Tue", val: 340 },
    { day: "Wed", val: 230 },
    { day: "Thu", val: 450 },
    { day: "Fri", val: 560 },
    { day: "Sat", val: 890 },
    { day: "Sun", val: 670 },
  ];

  const maxVal = Math.max(...weeklyEarnings.map((d) => d.val));

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-6 max-w-xl">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-650">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-550 uppercase tracking-wider">
            Developer Monetization Revenue
          </h3>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
            Check installation subscriptions revenue logs and platform payout shares.
          </p>
        </div>
      </div>

      {/* Overview totals */}
      <div className="grid gap-4 grid-cols-3">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-900 rounded-2xl">
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">
            Net Earnings
          </span>
          <span className="text-sm font-black text-zinc-900 dark:text-zinc-50 block mt-1">
            $3,260.00
          </span>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-900 rounded-2xl">
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">
            Platform share (15%)
          </span>
          <span className="text-sm font-black text-zinc-900 dark:text-zinc-50 block mt-1">
            $489.00
          </span>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-900 rounded-2xl">
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">
            Developer payout
          </span>
          <span className="text-sm font-black text-zinc-900 dark:text-zinc-50 block mt-1">
            $2,771.00
          </span>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="space-y-3 pt-2">
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
          Weekly Performance
        </span>

        <div className="flex items-end justify-between h-32 gap-3 pt-4 border-b border-zinc-200 dark:border-zinc-900">
          {weeklyEarnings.map((d) => {
            const pct = (d.val / maxVal) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[8px] font-mono text-zinc-450 font-bold">${d.val}</span>
                <div
                  style={{ height: `${pct * 0.7}%` }}
                  className="w-full bg-zinc-900 dark:bg-zinc-50 rounded-t-lg transition-all duration-500"
                />
                <span className="text-[9px] text-zinc-400 font-bold block mb-1">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
