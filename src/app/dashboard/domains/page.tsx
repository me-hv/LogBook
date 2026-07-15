"use client";

import { PageHeader } from "@/components/PageHeader";
import { DomainManager } from "@/components/DomainManager";

export default function WorkspaceDomainsPage() {
  return (
    <div className="space-y-8 flex-1">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Custom Domains"
          description="Map your publication to a custom domain (e.g. blog.acme.com) by configuring DNS records."
        />
      </div>

      <DomainManager />
    </div>
  );
}
export const dynamic = "force-dynamic";
