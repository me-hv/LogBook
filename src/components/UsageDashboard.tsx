"use client";

import { useEffect, useState, useTransition } from "react";
import { getTenantUsageStatsAction } from "@/app/admin/actions";
import { BarChart3, Database, Users, FileText, Loader2 } from "lucide-react";

export function UsageDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getTenantUsageStatsAction();
      if (res.success) {
        setStats(res.data);
      }
    });
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  const items = [
    {
      name: "Publications Created",
      value: stats.usage.posts,
      limit: stats.limits.posts > 100000 ? "Unlimited" : `${stats.limits.posts} posts`,
      percentage: stats.limits.posts > 100000 ? 10 : Math.round((stats.usage.posts / stats.limits.posts) * 100),
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      color: "bg-blue-500",
    },
    {
      name: "Workspace Members",
      value: stats.usage.members,
      limit: stats.limits.members > 100000 ? "Unlimited" : `${stats.limits.members} members`,
      percentage: stats.limits.members > 100000 ? 20 : Math.round((stats.usage.members / stats.limits.members) * 100),
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      color: "bg-indigo-500",
    },
    {
      name: "Storage Allocated",
      value: "0.2 GB",
      limit: stats.limits.storage,
      percentage: 20,
      icon: <Database className="w-5 h-5 text-emerald-500" />,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-3 text-left">
      {items.map((item) => (
        <div
          key={item.name}
          className="bg-white dark:bg-zinc-950/40 p-5 border border-zinc-200 dark:border-zinc-850 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wide">
                {item.name}
              </span>
              <div className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {item.value}
              </div>
            </div>
            <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              {item.icon}
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-zinc-150 dark:bg-zinc-900 rounded-full h-1.5 overflow-hidden">
              <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-zinc-450 uppercase tracking-wider">
              <span>Usage limit</span>
              <span>{item.limit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export const dynamic = "force-dynamic";
