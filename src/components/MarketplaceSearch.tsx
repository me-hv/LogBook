"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface MarketplaceSearchProps {
  query: string;
  onQueryChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
}

export function MarketplaceSearch({ query, onQueryChange, category, onCategoryChange }: MarketplaceSearchProps) {
  const categories = [
    { id: "all", label: "All Catalog" },
    { id: "plugin", label: "Plugins" },
    { id: "theme", label: "Themes" },
    { id: "ai", label: "AI assistants" },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-semibold text-left">
      {/* Category selector pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onCategoryChange(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              category === c.id
                ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                : "text-zinc-550 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Query input search bar */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-450" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search extensions, themes..."
          className="block w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
        />
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
