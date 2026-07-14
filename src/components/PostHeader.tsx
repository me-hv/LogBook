import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { ReadingTime } from "./ReadingTime";

interface PostHeaderProps {
  post: {
    title: string;
    coverImage: string | null;
    publishedAt: string | null;
    content: string;
    category: { name: string; slug: string } | null;
    author: { name: string | null; image: string | null };
  };
}

export function PostHeader({ post }: PostHeaderProps) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Draft";

  const authorName = post.author.name || "Anonymous";

  return (
    <header className="mb-10 space-y-6">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Articles</span>
      </Link>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-[240px] sm:h-[360px] md:h-[400px] rounded-3xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-101 duration-500"
          />
        </div>
      )}

      <div className="space-y-4">
        {/* Category Badge */}
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-850 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
          {post.title}
        </h1>

        {/* Metadata info */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-150 dark:border-zinc-900">
          {/* Author */}
          <div className="flex items-center gap-2">
            {post.author.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.author.image}
                alt={authorName}
                className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
              />
            ) : (
              <User className="w-4 h-4 text-zinc-400" />
            )}
            <span className="font-semibold text-zinc-800 dark:text-zinc-250">
              {authorName}
            </span>
          </div>

          <span className="text-zinc-300 dark:text-zinc-800">•</span>

          {/* Date */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>

          <span className="text-zinc-300 dark:text-zinc-800">•</span>

          {/* Reading Time */}
          <ReadingTime content={post.content} />
        </div>
      </div>
    </header>
  );
}
