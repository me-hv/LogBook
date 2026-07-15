"use client";

import { useEffect, useState, useTransition } from "react";
import { getActiveSessionsAction, revokeUserSessionAction } from "@/app/admin/actions";
import { Key, Trash2, Smartphone, Monitor, Loader2, Check } from "lucide-react";

export function SessionManager() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const loadSessions = () => {
    startTransition(async () => {
      const res = await getActiveSessionsAction();
      if (res.success && res.data) {
        setSessions(res.data);
      }
    });
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevoke = (id: string) => {
    if (!confirm("Are you sure you want to revoke this session? The device will be signed out immediately.")) return;

    startTransition(async () => {
      const res = await revokeUserSessionAction(id);
      if (res.success) {
        loadSessions();
      }
    });
  };

  return (
    <div className="space-y-4 text-left max-w-xl">
      <h3 className="text-xs font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
        Active Device Sessions
      </h3>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950/20 divide-y divide-zinc-200 dark:divide-zinc-900/60 font-semibold">
        {isPending && sessions.length === 0 ? (
          <div className="py-8 text-center">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-400 mx-auto" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((s) => {
            const isMobile = s.userAgent.toLowerCase().includes("mobile") || s.userAgent.toLowerCase().includes("android");
            return (
              <div key={s.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-450">
                    {isMobile ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs text-zinc-900 dark:text-zinc-50 block truncate max-w-[240px]">
                      {s.userAgent}
                    </span>
                    <div className="flex gap-2 text-[9px] text-zinc-400 font-normal">
                      <span>IP: {s.ipAddress}</span>
                      <span>•</span>
                      <span>Expires: {s.expiresAt}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRevoke(s.id)}
                  disabled={isPending}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                  title="Sign out device"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-zinc-450 italic">
            No active sessions detected.
          </div>
        )}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
