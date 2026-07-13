import React, { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-1">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
