"use client";

import { useState, useTransition } from "react";
import { removeSubscriberAction } from "@/app/admin/actions";
import { Search, Download, Trash2, ShieldAlert, Loader2 } from "lucide-react";

interface SubscriberItem {
  id: string;
  email: string;
  status: string;
  source: string;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

interface SubscriberTableProps {
  initialSubscribers: SubscriberItem[];
  onRefresh: () => void;
}

export function SubscriberTable({ initialSubscribers, onRefresh }: SubscriberTableProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter subscribers local check
  const filtered = initialSubscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  // Export to CSV
  const exportToCSV = () => {
    if (initialSubscribers.length === 0) return;
    
    const headers = ["Email", "Status", "Source", "Subscribed At", "Unsubscribed At"];
    const rows = initialSubscribers.map((s) => [
      s.email,
      s.status,
      s.source,
      s.subscribedAt,
      s.unsubscribedAt || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((f) => `"${f}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `logbook_subscribers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Remove subscriber action
  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await removeSubscriberAction(id);
      if (res.success) {
        setDeleteId(null);
        onRefresh();
      } else {
        alert(res.error || "Failed to remove subscriber");
      }
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Controls header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email subscribers..."
            className="block w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
          />
        </div>

        {/* CSV export */}
        <button
          onClick={exportToCSV}
          disabled={initialSubscribers.length === 0}
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-650 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
              <th className="px-5 py-3">Subscriber Email</th>
              <th className="px-5 py-3">Channel Source</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Registered Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60 text-zinc-700 dark:text-zinc-350">
            {filtered.length > 0 ? (
              filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all">
                  <td className="px-5 py-3 font-semibold text-zinc-900 dark:text-zinc-50 select-text">
                    {sub.email}
                  </td>
                  <td className="px-5 py-3 capitalize">{sub.source}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        sub.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : sub.status === "unsubscribed"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {new Date(sub.subscribedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setDeleteId(sub.id)}
                      className="text-zinc-450 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/5 cursor-pointer"
                      title="Remove Subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-400 italic">
                  No subscription records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Remove Subscriber</h3>
              <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-450 leading-relaxed">
                Are you sure you want to delete this subscription record? The user will no longer receive weekly summaries or newsletter campaigns.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-650 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                disabled={isPending}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
