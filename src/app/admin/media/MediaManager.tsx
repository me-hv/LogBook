"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MediaGrid } from "@/components/MediaGrid";
import { MediaUploader } from "@/components/MediaUploader";

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

interface MediaManagerProps {
  initialMedia: MediaItem[];
}

export function MediaManager({ initialMedia }: MediaManagerProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);

  const handleUploadSuccess = (newMedia: any) => {
    const formatted: MediaItem = {
      id: newMedia.id,
      filename: newMedia.filename,
      originalName: newMedia.originalName,
      url: newMedia.url,
      size: newMedia.size,
      mimeType: newMedia.mimeType,
      createdAt: newMedia.createdAt,
      uploadedBy: {
        name: "",
        email: "",
      },
    };
    setMediaList((prev) => [formatted, ...prev]);
  };

  const handleDeleteSuccess = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRenameSuccess = (id: string, newName: string) => {
    setMediaList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, filename: newName } : m))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Upload, rename, preview, and manage image assets for your blog articles."
      />

      <div className="grid gap-6 lg:grid-cols-4 items-start">
        {/* Main Grid: 3 columns */}
        <div className="lg:col-span-3 space-y-4">
          <MediaGrid
            initialMedia={mediaList}
            onDeleteSuccess={handleDeleteSuccess}
            onRenameSuccess={handleRenameSuccess}
          />
        </div>

        {/* Upload Side Panel: 1 column */}
        <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Upload Images
          </h3>
          <MediaUploader onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>
    </div>
  );
}
