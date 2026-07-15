"use client";

import { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/PageHeader";
import { UsageMeter } from "@/components/UsageMeter";
import { PricingTable } from "@/components/PricingTable";
import { InvoiceTable } from "@/components/InvoiceTable";
import { getActiveTenantAction, createStripePortalSessionAction } from "@/app/admin/actions";
import { CreditCard, ExternalLink, Loader2, Sparkles } from "lucide-react";

export default function WorkspaceBillingPage() {
  const [tenant, setTenant] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getActiveTenantAction();
      if (res.success && res.tenant) {
        setTenant(res.tenant);
      }
    });
  }, []);

  const handlePortalRedirect = () => {
    startTransition(async () => {
      const res = await createStripePortalSessionAction();
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        alert(res.error || "Failed to launch billing portal.");
      }
    });
  };

  return (
    <div className="space-y-8 flex-1 text-left">
      {/* Page Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Usage & SaaS Billing"
          description="Check current publication post count limits, manage premium subscription plans, and review historical payment invoices."
        />

        {tenant?.stripeCustomerId && (
          <button
            onClick={handlePortalRedirect}
            disabled={isPending}
            className="sm:self-end px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-xs font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ExternalLink className="w-3.5 h-3.5" />
            )}
            <span>Stripe Customer Portal</span>
          </button>
        )}
      </div>

      {/* Usage meters */}
      <UsageMeter />

      {/* Pricing Comparison Selector Table */}
      <PricingTable currentPlan={tenant?.plan || "FREE"} />

      {/* Historical Invoices */}
      <InvoiceTable />
    </div>
  );
}
export const dynamic = "force-dynamic";
