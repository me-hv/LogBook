"use client";

import { useEffect, useState, useTransition } from "react";
import { getTenantDomainsAction, addTenantDomainAction, verifyTenantDomainAction, deleteTenantDomainAction } from "@/app/admin/actions";
import { Globe, Plus, Trash2, ShieldCheck, Loader2, Check, AlertCircle } from "lucide-react";

export function DomainManager() {
  const [domains, setDomains] = useState<any[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadDomains = () => {
    startTransition(async () => {
      const res = await getTenantDomainsAction();
      if (res.success && res.data) {
        setDomains(res.data);
      }
    });
  };

  useEffect(() => {
    loadDomains();
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    startTransition(async () => {
      const res = await addTenantDomainAction(newDomain);
      if (res.success) {
        setNewDomain("");
        loadDomains();
      } else {
        alert(res.error || "Failed to add domain.");
      }
    });
  };

  const handleVerify = (id: string) => {
    startTransition(async () => {
      const res = await verifyTenantDomainAction(id);
      if (res.success) {
        loadDomains();
      } else {
        alert(res.error || "Verification failed.");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this domain mapping?")) return;

    startTransition(async () => {
      const res = await deleteTenantDomainAction(id);
      if (res.success) {
        loadDomains();
      } else {
        alert(res.error || "Failed to delete.");
      }
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-650">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Custom Domain Management
          </h3>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
            Map white-labeled domains and configure DNS TXT verification keys.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAdd} className="flex gap-3">
        <input
          type="text"
          required
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="e.g. blog.acme.com"
          className="flex-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1 font-mono"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          <span>Add Domain</span>
        </button>
      </form>

      {/* DNS instruction parameters card */}
      <div className="bg-zinc-50 dark:bg-zinc-900/30 p-4 border border-zinc-150 dark:border-zinc-900 rounded-2xl space-y-2">
        <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-400 uppercase tracking-wide block">
          Required DNS Configuration (CNAME Record)
        </span>
        <div className="grid gap-2 grid-cols-2 text-[10px] font-mono text-zinc-500 leading-relaxed">
          <div><strong className="text-zinc-700 dark:text-zinc-300">Type:</strong> CNAME</div>
          <div><strong className="text-zinc-700 dark:text-zinc-300">Name:</strong> blog (or wildcard @)</div>
          <div><strong className="text-zinc-700 dark:text-zinc-300">Value:</strong> cname.logbook-edge.com</div>
          <div><strong className="text-zinc-700 dark:text-zinc-300">TTL:</strong> 3600</div>
        </div>
      </div>

      {/* Domain mapping feed */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-900/60 font-semibold">
        {domains.length > 0 ? (
          domains.map((d) => (
            <div key={d.id} className="py-3 flex items-center justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/5 px-2 rounded-xl">
              <div>
                <span className="text-xs text-zinc-900 dark:text-zinc-100 font-mono block">
                  {d.domain}
                </span>
                <div className="flex gap-2 text-[9px] font-bold mt-1">
                  {d.verified ? (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>DNS Active SSL</span>
                    </span>
                  ) : (
                    <span className="text-amber-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Pending Verification</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!d.verified && (
                  <button
                    onClick={() => handleVerify(d.id)}
                    disabled={isPending}
                    className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[10px] font-bold rounded-lg cursor-pointer border border-zinc-200 dark:border-zinc-800"
                  >
                    Verify DNS
                  </button>
                )}

                <button
                  onClick={() => handleDelete(d.id)}
                  disabled={isPending}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-rose-500 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <span className="text-[10px] text-zinc-450 italic block text-center py-6">
            No custom domains added yet. Enter domain above to register!
          </span>
        )}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
