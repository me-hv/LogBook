import Link from "next/link";
import { Eye, Clock, ArrowUpRight } from "lucide-react";

interface PerformancePostItem {
  title: string;
  slug: string;
  views: number;
  readingTime: number;
}

interface PopularPostsTableProps {
  title: string;
  description?: string;
  posts: PerformancePostItem[];
}

export function PopularPostsTable({ title, description, posts }: PopularPostsTableProps) {
  return (
    <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
      <div>
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900/60">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-3 first:pt-0 last:pb-0 gap-4"
            >
              <div className="space-y-0.5 min-w-0">
                <h5 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate hover:text-zinc-550 dark:hover:text-zinc-400">
                  <Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center gap-1">
                    <span>{post.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 inline text-zinc-400" />
                  </Link>
                </h5>
                <div className="flex items-center gap-2.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readingTime} min read</span>
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
                <Eye className="w-4 h-4 text-zinc-405" />
                <span>{post.views}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-zinc-400 text-xs italic">
          No articles matched this criteria
        </div>
      )}
    </div>
  );
}
