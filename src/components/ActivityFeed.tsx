"use client";

import { useEffect, useState, useTransition } from "react";
import { getActivityLogs } from "@/app/admin/actions";
import { History, UserCheck, Shield, FileText, Send, Calendar, Loader2 } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

export function ActivityFeed() {
  const [logs, setLogs] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getActivityLogs(10);
      if (res.success) {
        setLogs(res.data || []);
      }
      setLoading(false);
    });
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "post_created":
        return <FileText className="w-4 h-4 text-sky-500" />;
      case "post_edited":
        return <History className="w-4 h-4 text-amber-500" />;
      case "post_published":
        return <Send className="w-4 h-4 text-emerald-500" />;
      case "post_scheduled":
        return <Calendar className="w-4 h-4 text-violet-500" />;
      case "role_changed":
        return <Shield className="w-4 h-4 text-indigo-500" />;
      case "user_invited":
        return <UserCheck className="w-4 h-4 text-teal-500" />;
      default:
        return <History className="w-4 h-4 text-zinc-450" />;
    }
  };

  const formatActionTitle = (action: string) => {
    return action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-zinc-400 text-xs">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading editorial timeline...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 text-left">
      <div className="space-y-1">
        <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          Publishing Timeline
        </h4>
        <p className="text-xs text-zinc-550 dark:text-zinc-400">
          Editorial audit trail logging recent user events and publishes.
        </p>
      </div>

      <div className="space-y-4">
        {logs.length > 0 ? (
          logs.map((item) => (
            <div key={item.id} className="flex gap-4 items-start group select-none">
              <div className="mt-1 w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center flex-shrink-0">
                {getActionIcon(item.action)}
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                    {formatActionTitle(item.action)}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                    {new Date(item.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
                  {item.details || "No details provided"}
                </p>
                <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  by {item.user.name || item.user.email}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-zinc-400 italic text-xs">
            No editorial activity logs recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
