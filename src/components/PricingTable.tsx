"use client";

import { useTransition } from "react";
import { createStripeCheckoutSessionAction } from "@/app/admin/actions";
import { Check, ShieldCheck, HelpCircle, Loader2 } from "lucide-react";

interface PricingTableProps {
  currentPlan: string;
}

export function PricingTable({ currentPlan }: PricingTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = (planName: string) => {
    startTransition(async () => {
      const res = await createStripeCheckoutSessionAction(planName);
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        alert(res.error || "Failed to initiate billing session.");
      }
    });
  };

  const plans = [
    {
      id: "FREE",
      name: "Free Plan",
      price: "$0",
      description: "For hobbyists and personal creators.",
      features: [
        "100 publication posts",
        "1 GB media library",
        "3 collaborators seats",
        "LogBook subdomain",
      ],
    },
    {
      id: "STARTER",
      name: "Starter Plan",
      price: "$9",
      description: "Ideal for individual writers.",
      features: [
        "1,000 publication posts",
        "10 GB media library",
        "5 collaborators seats",
        "1 Custom Domain mapping",
        "AI Writing Assistant tools",
      ],
    },
    {
      id: "PRO",
      name: "Pro Plan",
      price: "$29",
      description: "Perfect for professional teams.",
      features: [
        "Unlimited publication posts",
        "100 GB media library",
        "20 collaborators seats",
        "5 Custom Domains mapping",
        "AI Writing Assistant tools",
      ],
    },
    {
      id: "BUSINESS",
      name: "Business Plan",
      price: "$99",
      description: "For corporate publishing engines.",
      features: [
        "Unlimited everything",
        "Priority 24/7 email support",
        "Advanced custom analytics widgets",
      ],
    },
    {
      id: "ENTERPRISE",
      name: "Enterprise",
      price: "Custom",
      description: "High volume enterprise scaling.",
      features: [
        "SLA up-times guarantees",
        "Dedicated account managers",
        "Custom API Rate Limit quotas",
      ],
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <h3 className="text-xs font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-wider">
        Subscription Tiers
      </h3>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {plans.map((p) => {
          const isCurrent = currentPlan.toUpperCase() === p.id;
          return (
            <div
              key={p.id}
              className={`bg-white dark:bg-zinc-950/40 p-5 border rounded-3xl flex flex-col justify-between shadow-sm space-y-6 transition-all ${
                isCurrent
                  ? "border-zinc-900 dark:border-zinc-200 ring-1 ring-zinc-900 dark:ring-zinc-200"
                  : "border-zinc-200 dark:border-zinc-850 hover:scale-[1.01]"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[11px] font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider block">
                      {p.name}
                    </h4>
                    {isCurrent && (
                      <span className="text-[8px] font-bold text-zinc-400 block mt-0.5">
                        Active Workspace Tier
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-extrabold tracking-tight">{p.price}</span>
                  {p.price !== "Custom" && <span className="text-[9px] font-bold text-zinc-400">/mo</span>}
                </div>

                <p className="text-[10px] text-zinc-500 leading-normal min-h-[30px]">
                  {p.description}
                </p>

                <ul className="space-y-2 pt-2 border-t border-zinc-150 dark:border-zinc-900/60">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex gap-2 text-[9px] font-semibold text-zinc-650 dark:text-zinc-400">
                      <Check className="w-3.5 h-3.5 text-zinc-450 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {isCurrent ? (
                <div className="w-full text-center py-1.5 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl text-[10px] font-bold text-zinc-450 uppercase tracking-wider select-none">
                  Current Tier
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(p.id)}
                  disabled={isPending}
                  className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-[10px] font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>{p.price === "Custom" ? "Contact Sales" : "Upgrade"}</span>
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
