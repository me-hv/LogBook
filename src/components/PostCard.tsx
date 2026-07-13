import Link from "next/link";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Draft";

  return (
    <article className="group flex flex-col p-6 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm">
      {/* Category & Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {post.category && (
          <Link
            href={`/categories/${post.category.slug}`}
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-850 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            {post.category.name}
          </Link>
        )}
        {post.tags.map(({ tag }) => (
          <Link
            key={tag.id}
            href={`/tags/${tag.slug}`}
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            #{tag.name}
          </Link>
        ))}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-2 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-zinc-650 dark:text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
        {post.content.replace(/[#*`_\[\]]/g, "").substring(0, 160)}...
      </p>

      {/* Footer Meta */}
      <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <User className="w-3.5 h-3.5" />
          <span>{post.author.name || "Anonymous"}</span>
        </div>
      </div>
      
      {/* Read More Link */}
      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50 hover:gap-1.5 transition-all self-start"
      >
        <span>Read article</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </article>
  );
}
