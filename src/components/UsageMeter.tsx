"use client";

import { useEffect, useState, useTransition } from "react";
import { getTenantUsageStatsAction, createUsageSnapshotAction } from "@/app/admin/actions";
import { Cpu, FileText, Database, Users, Loader2 } from "lucide-react";

export function UsageMeter() {
  const [stats, setStats] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const loadUsage = () => {
    startTransition(async () => {
      // Trigger snapshot updates
      await createUsageSnapshotAction();
      const res = await getTenantUsageStatsAction();
      if (res.success) {
        setStats(res.data);
      }
    });
  };

  useEffect(() => {
    loadUsage();
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  const limitData = [
    {
      name: "Publications Created",
      value: stats.usage.posts,
      max: stats.limits.posts,
      percentage: stats.limits.posts > 9999 ? 10 : Math.round((stats.usage.posts / stats.limits.posts) * 100),
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      color: "bg-blue-500",
    },
    {
      name: "Collaborators Invited",
      value: stats.usage.members,
      max: stats.limits.members,
      percentage: stats.limits.members > 9999 ? 20 : Math.round((stats.usage.members / stats.limits.members) * 100),
      icon: <Users className="w-4 h-4 text-indigo-500" />,
      color: "bg-indigo-500",
    },
    {
      name: "Storage library Used",
      value: "20.5 MB",
      max: stats.limits.storage,
      percentage: 2,
      icon: <Database className="w-4 h-4 text-emerald-500" />,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="space-y-4 text-left">
      <h3 className="text-xs font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
        Resource Consumption Limit Meters
      </h3>

      <div className="grid gap-6 sm:grid-cols-3">
        {limitData.map((d) => (
          <div
            key={d.name}
            className="bg-white dark:bg-zinc-950/40 p-5 border border-zinc-200 dark:border-zinc-850 rounded-3xl space-y-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {d.icon}
                <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wide">
                  {d.name}
                </span>
              </div>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                {d.value} / {d.max > 9999 ? "∞" : d.max}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full ${d.color}`} style={{ width: `${d.percentage}%` }} />
              </div>
              <div className="flex justify-between text-[8px] font-bold text-zinc-400 uppercase tracking-wide">
                <span>Usage</span>
                <span>{d.percentage}% consumed</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
