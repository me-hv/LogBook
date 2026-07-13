import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { getPostBySlug } from "@/services/db";
import { prisma } from "@/lib/prisma";
import { PostHeader } from "@/components/PostHeader";
import { MarkdownPreview } from "@/components/MarkdownPreview";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: `${post.title} | LogBook`,
    description: post.excerpt || `Read ${post.title} on LogBook.`,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  // Update views in the background (non-blocking)
  prisma.post
    .update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })
    .catch((err) => console.error("Failed to increment views", err));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // Fetch related posts from the same category
  const relatedPosts = post.categoryId
    ? await prisma.post.findMany({
        where: {
          categoryId: post.categoryId,
          status: "published",
          NOT: { id: post.id },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      })
    : [];

  const serializedPost = {
    title: post.title,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    content: post.content,
    category: post.category ? { name: post.category.name, slug: post.category.slug } : null,
    author: { name: post.author.name, image: post.author.image },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Article Header */}
      <PostHeader post={serializedPost} />

      {/* Main Content Layout */}
      <div className="grid gap-10 md:grid-cols-[1fr_60px] items-start">
        {/* Article content */}
        <article className="min-w-0 bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm">
          <MarkdownPreview content={post.content} />
          
          {/* Tags list */}
          {post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* Share buttons (Sticky sidebar on desktop, bottom bar on mobile) */}
        <div className="md:sticky md:top-24 flex md:flex-col justify-center gap-3 bg-white dark:bg-zinc-950/40 p-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-[#1DA1F2] dark:hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/5 dark:hover:bg-[#1DA1F2]/10 transition-colors flex items-center justify-center"
            title="Share on X"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-[#1877F2] dark:hover:text-[#1877F2] hover:bg-[#1877F2]/5 dark:hover:bg-[#1877F2]/10 transition-colors flex items-center justify-center"
            title="Share on Facebook"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] hover:bg-[#0A66C2]/5 dark:hover:bg-[#0A66C2]/10 transition-colors flex items-center justify-center"
            title="Share on LinkedIn"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Related Publications
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.id}
                href={`/blog/${rp.slug}`}
                className="group block bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-sm"
              >
                <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                  {post.category?.name}
                </p>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:underline mt-1.5 line-clamp-2">
                  {rp.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                  {rp.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
