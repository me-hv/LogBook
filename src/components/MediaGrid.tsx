"use client";

import { useState } from "react";
import { Search, Image as ImageIcon } from "lucide-react";
import { MediaCard } from "./MediaCard";
import { EmptyState } from "./EmptyState";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: any;
  uploadedBy: {
    name: string | null;
    email: string;
  };
}

interface MediaGridProps {
  initialMedia: MediaItem[];
  onDeleteSuccess: (id: string) => void;
  onRenameSuccess: (id: string, newName: string) => void;
  onSelect?: (media: MediaItem) => void;
  selectedMediaId?: string;
}

export function MediaGrid({
  initialMedia,
  onDeleteSuccess,
  onRenameSuccess,
  onSelect,
  selectedMediaId,
}: MediaGridProps) {
  const [search, setSearch] = useState("");

  const filteredMedia = initialMedia.filter(
    (item) =>
      item.filename.toLowerCase().includes(search.toLowerCase()) ||
      item.originalName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Input Filter */}
      <div className="relative max-w-sm">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search media files by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all shadow-sm"
        />
      </div>

      {/* Grid List */}
      {filteredMedia.length === 0 ? (
        <EmptyState
          title="No assets found"
          description={search ? `No media matching "${search}" was found.` : "Upload your first asset to the media library."}
          icon={<ImageIcon className="w-8 h-8" />}
        />
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredMedia.map((item) => (
            <MediaCard
              key={item.id}
              media={item}
              onDeleteSuccess={onDeleteSuccess}
              onRenameSuccess={onRenameSuccess}
              onSelect={onSelect}
              isSelected={selectedMediaId === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
