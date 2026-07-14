"use client";

import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function Dropzone({ onFilesSelected, disabled }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
        disabled
          ? "opacity-50 cursor-not-allowed border-zinc-200 dark:border-zinc-800"
          : isDragActive
          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900/30 scale-[1.01]"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <UploadCloud className={`w-10 h-10 mb-3 transition-colors ${isDragActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`} />
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Drag & drop images here
      </h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        or click to browse your machine
      </p>
      <p className="text-[10px] text-zinc-400 mt-2 font-medium">
        Supports JPEG, PNG, WEBP, GIF, SVG up to 5MB
      </p>
    </div>
  );
}
