"use client";

import { useState } from "react";
import Image from "next/image";
import { Link2, Trash2, Edit3, Check, FileText } from "lucide-react";
import { renameMediaAction, deleteMediaAction } from "@/app/admin/actions";

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

interface MediaCardProps {
  media: MediaItem;
  onDeleteSuccess: (id: string) => void;
  onRenameSuccess: (id: string, newName: string) => void;
  onSelect?: (media: MediaItem) => void;
  isSelected?: boolean;
}

export function MediaCard({ media, onDeleteSuccess, onRenameSuccess, onSelect, isSelected }: MediaCardProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(media.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy url", err);
    }
  };

  const handleRename = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = prompt("Enter a new name for this asset:", media.filename);
    if (!newName || newName.trim() === "" || newName === media.filename) return;

    setLoading(true);
    const res = await renameMediaAction(media.id, newName.trim());
    setLoading(false);

    if (res.success && res.media) {
      onRenameSuccess(media.id, res.media.filename);
    } else {
      alert(res.error || "Failed to rename asset.");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this asset? This cannot be undone.")) return;

    setLoading(true);
    const res = await deleteMediaAction(media.id);
    setLoading(false);

    if (res.success) {
      onDeleteSuccess(media.id);
    } else {
      alert(res.error || "Failed to delete asset.");
    }
  };

  const formattedDate = new Date(media.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      onClick={() => onSelect?.(media)}
      className={`group relative flex flex-col bg-white dark:bg-zinc-950/40 border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm ${
        onSelect ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "border-zinc-900 dark:border-zinc-100 ring-1 ring-zinc-900 dark:ring-zinc-100"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow"
      }`}
    >
      {/* Thumbnail area */}
      <div className="relative w-full aspect-square bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-150 dark:border-zinc-900 flex items-center justify-center overflow-hidden">
        {media.mimeType.startsWith("image/") ? (
          <Image
            src={media.url}
            alt={media.filename}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-102 duration-300"
            loading="lazy"
          />
        ) : (
          <FileText className="w-12 h-12 text-zinc-400" />
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={handleCopyUrl}
            className="p-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 shadow transition-all scale-95 group-hover:scale-100 duration-200 cursor-pointer"
            title="Copy Public URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleRename}
            className="p-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 shadow transition-all scale-95 group-hover:scale-100 duration-200 cursor-pointer"
            title="Rename Asset"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-white text-red-650 hover:bg-red-50 shadow transition-all scale-95 group-hover:scale-100 duration-200 cursor-pointer"
            title="Delete Asset"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info details bar */}
      <div className="p-4 space-y-1">
        <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 truncate" title={media.filename}>
          {media.filename}
        </h4>
        <div className="flex justify-between items-center text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">
          <span>{formatSize(media.size)}</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-zinc-900 dark:border-zinc-550 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
