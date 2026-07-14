"use client";

import { PageHeader } from "@/components/PageHeader";
import { PluginMarketplace } from "@/components/PluginMarketplace";

export default function PluginsPage() {
  return (
    <div className="space-y-8 flex-1">
      {/* Header page details */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Extension Marketplace"
          description="Extend your LogBook publishing engine with dynamic SEO checklists, analytics widgets, syntax theme pack prebuilt highlightings, and automated social sharing."
        />
      </div>

      <PluginMarketplace />
    </div>
  );
}
export const dynamic = "force-dynamic";
