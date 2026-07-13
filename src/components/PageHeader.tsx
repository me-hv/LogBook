import Link from "next/link";
import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionHref,
  actionIcon,
  onAction,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {description}
        </p>
      </div>
      {actionLabel && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
            >
              {actionIcon && <span className="w-4 h-4">{actionIcon}</span>}
              <span>{actionLabel}</span>
            </Link>
          ) : onAction ? (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
            >
              {actionIcon && <span className="w-4 h-4">{actionIcon}</span>}
              <span>{actionLabel}</span>
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
