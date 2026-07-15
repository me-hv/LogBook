"use client";

import { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MarketplaceSearch } from "@/components/MarketplaceSearch";
import { MarketplaceCard } from "@/components/MarketplaceCard";
import { ThemePreview } from "@/components/ThemePreview";
import { getMarketplaceAppsAction } from "@/app/admin/actions";
import { Loader2, Palette } from "lucide-react";

export default function AdminMarketplacePage() {
  const [apps, setApps] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [isPending, startTransition] = useTransition();

  const loadApps = () => {
    startTransition(async () => {
      const res = await getMarketplaceAppsAction();
      if (res.success && res.data) {
        setApps(res.data);
      }
    });
  };

  useEffect(() => {
    loadApps();
  }, []);

  const filteredApps = apps.filter((app) => {
    const matchesQuery = app.name.toLowerCase().includes(query.toLowerCase()) ||
                         app.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || app.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-8 flex-1 text-left">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Marketplace Extensions & Themes"
          description="Browse and install plugins, design themes, and integrations published by the developer community."
        />
      </div>

      {/* Theme Customizer Live Preview Section */}
      <ThemePreview />

      {/* Query Filters */}
      <MarketplaceSearch
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
      />

      {/* Apps catalog grid layout */}
      {isPending ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <MarketplaceCard
              key={app.id}
              app={app}
              onInstalledStateChange={loadApps}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center text-zinc-450 italic">
          No extensions found matching your filters.
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
