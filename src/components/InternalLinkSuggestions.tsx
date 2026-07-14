"use client";

import { useEffect, useState, useTransition } from "react";
import { suggestInternalLinksAction } from "@/app/admin/actions";
import { Link2, Loader2, ArrowRight } from "lucide-react";

interface LinkSuggestion {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  matchScore: number;
}

interface InternalLinkSuggestionsProps {
  postId?: string;
  content: string;
  onInsertLink: (title: string, slug: string) => void;
}

export function InternalLinkSuggestions({ postId, content, onInsertLink }: InternalLinkSuggestionsProps) {
  const [links, setLinks] = useState<LinkSuggestion[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchLinks = () => {
    if (!content.trim()) return;

    startTransition(async () => {
      const res = await suggestInternalLinksAction(postId || "new", content);
      if (res.success && res.data) {
        setLinks(res.data);
      }
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchLinks();
    }, 4500);

    return () => clearTimeout(delayDebounce);
  }, [content, postId]);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 bg-white dark:bg-zinc-950/20 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/60 pb-3">
        <div className="flex items-center gap-2">
          <Link2 className="w-4.5 h-4.5 text-zinc-900 dark:text-zinc-50" />
          <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Internal Linking Suggestions
          </h4>
        </div>
        {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />}
      </div>

      {links.length === 0 ? (
        <div className="text-center py-6 text-zinc-400 text-xs italic">
          No matching internal articles found.
        </div>
      ) : (
        <div className="space-y-2.5 animate-in fade-in duration-200">
          {links.map((link) => (
            <div
              key={link.id}
              onClick={() => onInsertLink(link.title, link.slug)}
              className="p-3 border border-zinc-150 dark:border-zinc-850 rounded-2xl hover:border-zinc-450 dark:hover:border-zinc-750 bg-zinc-50/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/10 transition-all cursor-pointer flex justify-between items-center group"
            >
              <div className="space-y-0.5 max-w-[85%]">
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
                  {link.title}
                </h5>
                <p className="text-[10px] text-zinc-400 truncate">
                  /blog/{link.slug}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
