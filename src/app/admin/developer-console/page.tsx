"use client";

import { PageHeader } from "@/components/PageHeader";
import { DeveloperDashboard } from "@/components/DeveloperDashboard";

export default function DeveloperConsolePage() {
  return (
    <div className="space-y-8 flex-1 text-left">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Developer Console & Analytics"
          description="Create plugins, design custom themes, check downloads, and review monetization payouts."
        />
      </div>

      <DeveloperDashboard />
    </div>
  );
}
export const dynamic = "force-dynamic";
