"use client";

import { PageHeader } from "@/components/PageHeader";
import { TenantSettings } from "@/components/TenantSettings";

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-8 flex-1">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Workspace Settings"
          description="Configure branding details, upload publication logos, and manage subdomain slugs."
        />
      </div>

      <TenantSettings />
    </div>
  );
}
export const dynamic = "force-dynamic";
