"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, UploadCloud } from "lucide-react";
import { MediaGrid } from "./MediaGrid";
import { MediaUploader } from "./MediaUploader";
import { getMediaList } from "@/app/admin/actions";

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

interface MediaSelectorProps {
  onClose: () => void;
  onSelect: (url: string, filename: string) => void;
  title?: string;
}

export function MediaSelector({ onClose, onSelect, title = "Select Media Asset" }: MediaSelectorProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    const list = await getMediaList();
    // Serialize / Cast to ensure type compatibility
    setMediaList(
      list.map((m: any) => ({
        id: m.id,
        filename: m.filename,
        originalName: m.originalName,
        url: m.url,
        size: m.size,
        mimeType: m.mimeType,
        createdAt: m.createdAt.toISOString(),
        uploadedBy: {
          name: m.uploadedBy.name,
          email: m.uploadedBy.email,
        },
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

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
        name: "", // placeholder as it's newly uploaded by current user
        email: "",
      },
    };
    setMediaList((prev) => [formatted, ...prev]);
    setActiveTab("library");
    setSelectedMedia(formatted);
  };

  const handleDeleteSuccess = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
    if (selectedMedia?.id === id) setSelectedMedia(null);
  };

  const handleRenameSuccess = (id: string, newName: string) => {
    setMediaList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, filename: newName } : m))
    );
    if (selectedMedia?.id === id) {
      setSelectedMedia((prev) => (prev ? { ...prev, filename: newName } : null));
    }
  };

  const handleInsert = () => {
    if (selectedMedia) {
      onSelect(selectedMedia.url, selectedMedia.filename);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              {title}
            </h3>
            <p className="text-xs text-zinc-450 dark:text-zinc-500">
              Manage assets or select one to insert.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-450 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switchers */}
        <div className="flex px-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10">
          <button
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "library"
                ? "border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50"
                : "border-transparent text-zinc-450 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Library</span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "upload"
                ? "border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50"
                : "border-transparent text-zinc-450 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File</span>
          </button>
        </div>

        {/* Content Workspace */}
        <div className="flex-grow p-6 overflow-y-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-50 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">Loading media assets...</p>
            </div>
          ) : activeTab === "library" ? (
            <MediaGrid
              initialMedia={mediaList}
              onDeleteSuccess={handleDeleteSuccess}
              onRenameSuccess={handleRenameSuccess}
              onSelect={setSelectedMedia}
              selectedMediaId={selectedMedia?.id}
            />
          ) : (
            <div className="max-w-md mx-auto py-6">
              <MediaUploader onUploadSuccess={handleUploadSuccess} />
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[300px] font-medium">
            {selectedMedia ? (
              <span>
                Selected: <strong className="text-zinc-900 dark:text-zinc-100">{selectedMedia.filename}</strong>
              </span>
            ) : (
              <span>No asset selected.</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!selectedMedia}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 cursor-pointer shadow-sm transition-colors"
            >
              Insert Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
