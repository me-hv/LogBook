"use client";

import { useEffect, useState, useTransition } from "react";
import { publishMarketplaceAppAction, getDeveloperAppsAction } from "@/app/admin/actions";
import { RevenueChart } from "./RevenueChart";
import { Terminal, Send, Check, Loader2, Sparkles } from "lucide-react";

export function DeveloperDashboard() {
  const [apps, setApps] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("plugin");
  const [price, setPrice] = useState("0.0");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadApps = () => {
    startTransition(async () => {
      const res = await getDeveloperAppsAction();
      if (res.success && res.data) {
        setApps(res.data);
      }
    });
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    startTransition(async () => {
      const res = await publishMarketplaceAppAction(name, slug, desc, category, parseFloat(price) || 0.0);
      if (res.success) {
        setName("");
        setSlug("");
        setDesc("");
        setPrice("0.0");
        setSuccess(true);
        loadApps();
        setTimeout(() => setSuccess(false), 2000);
      } else {
        alert(res.error || "Publish failed.");
      }
    });
  };

  return (
    <div className="space-y-8 text-left font-semibold">
      {/* Revenue performance overview */}
      <RevenueChart />

      {/* App publication and listings */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Publisher form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-3">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                Register New App Bundle
              </h3>
              <p className="text-[9px] text-zinc-400">
                Publish a plugin, custom layout theme, or integration tool to catalog.
              </p>
            </div>
          </div>

          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 p-3 rounded-xl text-xs font-bold text-emerald-850 dark:text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Bundle registered and approved successfully!</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 uppercase">Extension Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Markdown Outline Wizard"
              className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 uppercase">Package Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. outline-wizard"
              className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
            >
              <option value="plugin">Plugin Extension</option>
              <option value="theme">Custom Theme Layout</option>
              <option value="ai">AI Integration</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 uppercase">Price (USD)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-450 uppercase">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter brief description logs..."
              rows={2}
              className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <Send className="w-3.5 h-3.5" />
              <span>Publish App</span>
            </button>
          </div>
        </form>

        {/* Listings */}
        <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-3">
            <Terminal className="w-5 h-5 text-zinc-450" />
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
              Published Bundles
            </h3>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-900/60 max-h-[380px] overflow-y-auto pr-1">
            {apps.length > 0 ? (
              apps.map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-150 block truncate max-w-[180px]">
                      {app.name}
                    </span>
                    <span className="text-[9px] text-zinc-400 font-mono block">
                      Downloads: {app.downloads} • Installs: {app.installs}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-zinc-450 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-lg">
                    {app.price === 0 ? "Free" : `$${app.price}`}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-[10px] text-zinc-450 italic block text-center py-8">
                No apps published yet. Submit the form to publish!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
