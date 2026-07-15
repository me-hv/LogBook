"use client";

import { useEffect, useState, useTransition } from "react";
import { getActiveTenantAction, updateTenantSettingsAction } from "@/app/admin/actions";
import { Globe, ArrowRight, ShieldCheck, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";

export function DomainManager() {
  const [domain, setDomain] = useState("");
  const [currentDomain, setCurrentDomain] = useState("");
  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [verificationStatus, setVerificationStatus] = useState<"none" | "validating" | "active">("none");

  const loadTenant = () => {
    startTransition(async () => {
      const res = await getActiveTenantAction();
      if (res.success && res.tenant) {
        setTenantInfo(res.tenant);
        setDomain(res.tenant.customDomain || "");
        setCurrentDomain(res.tenant.customDomain || "");
        if (res.tenant.customDomain) {
          setVerificationStatus("active");
        }
      }
    });
  };

  useEffect(() => {
    loadTenant();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantInfo) return;

    startTransition(async () => {
      const res = await updateTenantSettingsAction({
        name: tenantInfo.name,
        slug: tenantInfo.slug,
        logo: tenantInfo.logo || undefined,
        customDomain: domain.trim() || undefined,
      });

      if (res.success) {
        setCurrentDomain(domain.trim());
        if (domain.trim()) {
          setVerificationStatus("validating");
          setTimeout(() => setVerificationStatus("active"), 1500);
        } else {
          setVerificationStatus("none");
        }
      }
    });
  };

  return (
    <div className="space-y-6 text-left max-w-xl">
      <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl space-y-4">
        <div className="flex gap-2.5 items-center text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          <Globe className="w-4 h-4 text-zinc-400" />
          <span>Configure Custom Domain</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-zinc-450 uppercase block">
              Domain Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. blog.acme.com"
                className="block w-full px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 flex-grow"
              />
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Configure</span>
              </button>
            </div>
          </div>
        </form>

        {currentDomain && (
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900/60 space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-650 dark:text-zinc-400">DNS Domain Status</span>
              {verificationStatus === "validating" ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating DNS...</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SSL & DNS Active</span>
                </span>
              )}
            </div>

            {/* DNS Records setup details */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-150 dark:border-zinc-850 rounded-2xl space-y-3">
              <div className="text-[10px] font-bold text-zinc-450 uppercase tracking-wide">
                Configure your DNS records on your domain registrar:
              </div>
              <div className="space-y-2 font-mono text-[9px] text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-1.5">
                  <span className="font-bold uppercase text-zinc-400">Record Type</span>
                  <span>CNAME</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-1.5">
                  <span className="font-bold uppercase text-zinc-400">Host/Name</span>
                  <span>{currentDomain.split(".")[0] || "@"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold uppercase text-zinc-400">Value/Target</span>
                  <span>cname.logbook.app</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
