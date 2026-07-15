"use client";

import { useEffect, useState, useTransition } from "react";
import { getActiveTenantAction, updateTenantSettingsAction } from "@/app/admin/actions";
import { Check, Loader2, Sparkles, Building } from "lucide-react";

export function TenantSettings() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getActiveTenantAction();
      if (res.success && res.tenant) {
        setName(res.tenant.name);
        setSlug(res.tenant.slug);
        setLogo(res.tenant.logo || "");
        setCustomDomain(res.tenant.customDomain || "");
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateTenantSettingsAction({ name, slug, logo, customDomain });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl max-w-xl text-left space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-650 dark:text-zinc-400">
          <Building className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Workspace Configuration
          </h3>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
            Configure metadata, subdomain URLs, and branding parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 p-3 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Workspace configurations updated successfully!</span>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
              Workspace Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
              Logo Image URL
            </label>
            <input
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="block w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
            Subdomain URL Slug
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="block w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 flex-grow"
            />
            <div className="flex items-center px-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-450 font-semibold font-mono">
              .logbook.app
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Workspace Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
export const dynamic = "force-dynamic";
