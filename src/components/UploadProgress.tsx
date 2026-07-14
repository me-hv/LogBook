"use client";

import { X } from "lucide-react";

interface UploadProgressProps {
  fileName: string;
  progress: number;
  onCancel?: () => void;
}

export function UploadProgress({ fileName, progress, onCancel }: UploadProgressProps) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/40 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
      <div className="flex justify-between items-center gap-4 text-xs font-semibold">
        <span className="text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
          {fileName}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 dark:text-zinc-400">{progress}%</span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              title="Cancel Upload"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-zinc-900 dark:bg-zinc-50 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
