"use client";

import { useEffect, useState } from "react";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0.1 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
        On this page
      </h3>
      <ul className="space-y-2 text-xs sm:text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${Math.max(0, (heading.level - 2) * 12)}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors py-0.5 line-clamp-1 ${
                activeId === heading.id
                  ? "text-zinc-900 dark:text-zinc-50 font-medium border-l border-zinc-900 dark:border-zinc-50 pl-2 -ml-2"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
