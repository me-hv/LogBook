import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-6 uppercase tracking-wider">
      <Link
        href="/"
        className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
      >
        Home
      </Link>
      
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-zinc-900 dark:text-zinc-550 font-bold">
                {item.name}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
