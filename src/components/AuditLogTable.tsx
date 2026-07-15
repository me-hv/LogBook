"use client";

import { useEffect, useState, useTransition } from "react";
import { getAuditLogsAction } from "@/app/admin/actions";
import { ShieldCheck, Search, Loader2 } from "lucide-react";

export function AuditLogTable() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getAuditLogsAction();
      if (res.success && res.data) {
        setLogs(res.data);
      }
    });
  }, []);

  const filteredLogs = logs.filter((log) => {
    const text = `${log.action} ${log.resourceType} ${log.userName} ${log.userEmail}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-xs font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
          Compliance Audit Trails
        </h3>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-zinc-450" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail..."
            className="block w-full pl-9 pr-4 py-1 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
          />
        </div>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950/20">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Actor</th>
              <th className="px-5 py-3">Resource</th>
              <th className="px-5 py-3 text-right">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60 text-zinc-700 dark:text-zinc-350 font-semibold">
            {isPending ? (
              <tr>
                <td colSpan={5} className="py-8 text-center">
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-400 mx-auto" />
                </td>
              </tr>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                  <td className="px-5 py-3 text-zinc-450">{log.createdAt}</td>
                  <td className="px-5 py-3">
                    <span className="font-bold text-zinc-900 dark:text-zinc-50 font-mono text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <span className="block text-zinc-900 dark:text-zinc-100">{log.userName}</span>
                      <span className="block text-[9px] text-zinc-400 font-normal">{log.userEmail}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-[9px] text-zinc-500">
                    {log.resourceType} ({log.resourceId?.substring(0, 8) || "N/A"})
                  </td>
                  <td className="px-5 py-3 text-right text-zinc-450 font-mono text-[10px]">
                    {log.ipAddress}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-450 italic">
                  No audit logs recorded for this workspace.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
