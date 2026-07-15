"use client";

import { PageHeader } from "@/components/PageHeader";
import { SecurityDashboard } from "@/components/SecurityDashboard";

export default function WorkspaceSecurityPage() {
  return (
    <div className="space-y-8 flex-1">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Enterprise Governance & Security"
          description="Enforce Multi-Factor Authentication setups, revoke active device sessions, inspect compliance audit logs, and configure custom editorial approval chains."
        />
      </div>

      <SecurityDashboard />
    </div>
  );
}
export const dynamic = "force-dynamic";
