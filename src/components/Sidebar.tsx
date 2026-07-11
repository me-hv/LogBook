import Link from "next/link";
import React, { ReactNode } from "react";

interface SidebarItem {
  name: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
}

interface SidebarProps {
  title?: string;
  items: SidebarItem[];
  extraContent?: ReactNode;
}

export function Sidebar({ title, items, extraContent }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 p-6 transition-colors">
      {title && (
        <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 px-2">
          {title}
        </h2>
      )}
      <nav className="space-y-1">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              item.active
                ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                : "text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-950/60 hover:text-zinc-900 dark:hover:text-zinc-50"
            }`}
          >
            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      {extraContent && <div className="mt-8 pt-6 border-t border-zinc-150 dark:border-zinc-900">{extraContent}</div>}
    </aside>
  );
}
