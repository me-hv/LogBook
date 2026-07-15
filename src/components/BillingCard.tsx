"use client";

import { useEffect, useState, useTransition } from "react";
import { getTenantUsageStatsAction, updateTenantPlanAction } from "@/app/admin/actions";
import { Check, ShieldCheck, Zap, Loader2 } from "lucide-react";

export function BillingCard() {
  const [stats, setStats] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const loadStats = () => {
    startTransition(async () => {
      const res = await getTenantUsageStatsAction();
      if (res.success) {
        setStats(res.data);
      }
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleUpdatePlan = (plan: string) => {
    startTransition(async () => {
      const res = await updateTenantPlanAction(plan);
      if (res.success) {
        loadStats();
      }
    });
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "$0",
      description: "Ideal for personal creators.",
      features: ["100 publications", "1 GB media library storage", "3 workspace collaborators"],
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "$29",
      description: "Best for growing writing teams.",
      features: ["Unlimited publications", "50 GB media library storage", "10 workspace collaborators", "Custom subdomain routing"],
    },
    {
      id: "business",
      name: "Business Plan",
      price: "$99",
      description: "For corporate publishing workflows.",
      features: ["Unlimited publications", "Unlimited storage libraries", "Unlimited team seats", "Custom Domain verification", "Dedicated SSL provisioning"],
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Current Usage meters */}
      <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl space-y-4">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Plan limits & Current Usage
          </h3>
          <span className="text-[10px] text-zinc-450 dark:text-zinc-500 block">
            Workspace is currently registered under the <strong className="uppercase">{stats.plan}</strong> Tier.
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Post Limit */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wide">
              <span>Publications</span>
              <span>
                {stats.usage.posts} / {stats.limits.posts > 100000 ? "∞" : stats.limits.posts}
              </span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-zinc-900 dark:bg-zinc-50 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (stats.usage.posts / (stats.limits.posts > 100000 ? stats.usage.posts : stats.limits.posts)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Members Limit */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wide">
              <span>Workspace Members</span>
              <span>
                {stats.usage.members} / {stats.limits.members > 100000 ? "∞" : stats.limits.members}
              </span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-zinc-900 dark:bg-zinc-50 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (stats.usage.members / (stats.limits.members > 100000 ? stats.usage.members : stats.limits.members)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Subscribers count */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wide">
              <span>Newsletter Subscribers</span>
              <span>{stats.usage.subscribers}</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Plans List Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        {plans.map((p) => {
          const isCurrent = stats.plan === p.id;
          return (
            <div
              key={p.id}
              className={`bg-white dark:bg-zinc-950/45 p-6 border rounded-3xl flex flex-col justify-between shadow-sm space-y-6 ${
                isCurrent
                  ? "border-zinc-900 dark:border-zinc-200 ring-1 ring-zinc-900 dark:ring-zinc-200"
                  : "border-zinc-200 dark:border-zinc-850"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                    {p.name}
                  </h4>
                  {isCurrent && (
                    <span className="bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                      Current Plan
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold tracking-tight">{p.price}</span>
                  <span className="text-[10px] font-bold text-zinc-400">/ month</span>
                </div>

                <p className="text-[11px] text-zinc-450 dark:text-zinc-500">
                  {p.description}
                </p>

                <ul className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900/60">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex gap-2 text-[10px] font-semibold text-zinc-650 dark:text-zinc-400">
                      <Check className="w-3.5 h-3.5 text-zinc-450 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {!isCurrent && (
                <button
                  onClick={() => handleUpdatePlan(p.id)}
                  disabled={isPending}
                  className="w-full py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-zinc-50 transition-colors cursor-pointer"
                >
                  Activate {p.name}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
