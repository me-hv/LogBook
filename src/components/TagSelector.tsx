"use client";

import { useState } from "react";
import { Search, Check, Plus } from "lucide-react";

interface Tag {
  id: string;
  name: string;
}

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagSelector({ tags, selectedTags, onChange }: TagSelectorProps) {
  const [search, setSearch] = useState("");

  const handleToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
        Tags Selection
      </label>

      {/* Search Input */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-3.5 h-3.5" />
        </span>
        <input
          type="text"
          placeholder="Filter tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-8 pr-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
        />
      </div>

      {/* Badges list */}
      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-900 rounded-xl transition-all">
        {filteredTags.length === 0 ? (
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 italic p-1">
            No matching tags...
          </span>
        ) : (
          filteredTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleToggle(tag.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50 text-zinc-50 dark:text-zinc-900 shadow-sm scale-[0.98]"
                    : "bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:border-zinc-450 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {isSelected ? (
                  <Check className="w-3 h-3 text-zinc-50 dark:text-zinc-900" />
                ) : (
                  <Plus className="w-3 h-3 text-zinc-400" />
                )}
                <span>{tag.name}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
