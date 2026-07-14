import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

interface RelatedPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  readingTime: number;
}

interface RelatedPostsProps {
  posts: RelatedPostItem[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="space-y-6">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
        Related Publications
      </h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-350 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] w-full bg-zinc-50 dark:bg-zinc-900/40 overflow-hidden border-b border-zinc-150 dark:border-zinc-900">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-101 duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-xs italic">
                  No preview available
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-850 dark:group-hover:text-zinc-200 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                {post.excerpt && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider pt-2 border-t border-zinc-100 dark:border-zinc-900/60">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
