"use client";

import { useState } from "react";
import { Edit3, Eye, FileText } from "lucide-react";
import { MarkdownPreview } from "./MarkdownPreview";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Word and character counts
  const charCount = value.length;
  const wordCount = value.trim().split(/\s+/).filter((w) => w.length > 0).length;

  return (
    <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 rounded-2xl overflow-hidden shadow-sm h-[600px]">
      {/* Editor Header / Tab switcher */}
      <div className="flex justify-between items-center px-4 py-2 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
        {/* Mobile Tabs / Toggle */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "edit"
                ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-955 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "preview"
                ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-955 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Info Indicators */}
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-zinc-450 dark:text-zinc-555 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Markdown Supported</span>
          </div>
        </div>
      </div>

      {/* Main Workspace (Split Screen on md+, Tabbed on mobile) */}
      <div className="flex-grow grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 h-0 overflow-hidden">
        {/* Editor Area */}
        <div
          className={`flex flex-col h-full ${
            activeTab === "edit" ? "flex" : "hidden md:flex"
          }`}
        >
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "# Start writing in Markdown..."}
            className="w-full h-full p-6 bg-white dark:bg-zinc-950/20 text-sm font-mono text-zinc-900 dark:text-zinc-50 focus:outline-none resize-none overflow-y-auto leading-relaxed"
          />
        </div>

        {/* Live Preview Area */}
        <div
          className={`flex flex-col h-full p-6 overflow-y-auto bg-zinc-50/20 dark:bg-zinc-950/10 ${
            activeTab === "preview" ? "flex" : "hidden md:flex"
          }`}
        >
          {value.trim() === "" ? (
            <p className="text-zinc-400 dark:text-zinc-500 text-sm italic">
              Nothing to preview yet...
            </p>
          ) : (
            <MarkdownPreview content={value} />
          )}
        </div>
      </div>

      {/* Editor Footer / Word Count */}
      <div className="flex justify-between items-center px-6 py-2 bg-zinc-50 dark:bg-zinc-905/40 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        <div className="flex gap-4">
          <span>
            Words: <strong className="text-zinc-800 dark:text-zinc-200">{wordCount}</strong>
          </span>
          <span>
            Characters: <strong className="text-zinc-800 dark:text-zinc-200">{charCount}</strong>
          </span>
        </div>
        <div className="hidden xs:block text-[10px] text-zinc-400 font-semibold italic">
          Press Ctrl + S to save draft
        </div>
      </div>
    </div>
  );
}
