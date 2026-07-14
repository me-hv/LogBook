import { ReactNode } from "react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function AnalyticsCard({ title, value, subtext, icon, trend, trendValue }: AnalyticsCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
          {value}
        </h3>
        
        <div className="flex items-center gap-1.5">
          {trend && trendValue && (
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-lg flex items-center justify-center ${
                trend === "up"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : trend === "down"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {trend === "up" ? "▲" : trend === "down" ? "▼" : "•"} {trendValue}
            </span>
          )}
          {subtext && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
