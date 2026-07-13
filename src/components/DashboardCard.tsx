import React, { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}

export function DashboardCard({ title, value, icon, description }: DashboardCardProps) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between shadow-sm">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {value}
        </div>
        {description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-50 flex-shrink-0 shadow-sm">
        {icon}
      </div>
    </div>
  );
}
