import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { MOCK_POSTS } from "@/lib/mockPosts";
import { markdownToHtml, extractHeadings } from "@/lib/markdown";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { TableOfContents } from "@/components/TableOfContents";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = MOCK_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const htmlContent = await markdownToHtml(post.content);
  const headings = extractHeadings(post.content);

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Draft";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to articles</span>
      </Link>

      <div className="grid gap-12 lg:grid-cols-[1fr_250px]">
        {/* Main Post Content */}
        <article className="min-w-0">
          {/* Header Metadata */}
          <header className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            {post.category && (
              <Link
                href={`/categories/${post.category.slug}`}
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-850 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors inline-block mb-4"
              >
                {post.category.name}
              </Link>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 leading-[1.1]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-550 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="font-medium text-zinc-900 dark:text-zinc-300">
                  {post.author.name || "Anonymous"}
                </span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-800">•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-800">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </header>

          {/* Rendered Body */}
          <MarkdownRenderer content={htmlContent} />

          {/* Footer Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-zinc-150 dark:border-zinc-900 flex flex-wrap gap-2.5">
              {post.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="text-xs font-semibold px-3 py-1 rounded-md bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar Table of Contents */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}
export const dynamicParams = true;
