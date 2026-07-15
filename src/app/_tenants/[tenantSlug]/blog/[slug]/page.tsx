import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowLeft } from "lucide-react";
import { MarkdownPreview } from "@/components/MarkdownPreview";

interface TenantPostPageProps {
  params: Promise<{ tenantSlug: string; slug: string }>;
}

export default async function TenantPostDetailsPage({ params }: TenantPostPageProps) {
  const { tenantSlug, slug } = await params;

  // Resolve tenant
  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { slug: tenantSlug },
        { customDomain: tenantSlug },
      ],
    },
  });

  if (!tenant) {
    return notFound();
  }

  // Find post in tenant workspace
  const post = await prisma.post.findFirst({
    where: {
      tenantId: tenant.id,
      slug,
      status: "published",
    },
    include: {
      category: { select: { name: true } },
      author: { select: { name: true, image: true } },
    },
  });

  if (!post) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased font-sans select-none text-left">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 px-6 py-4 flex justify-between items-center z-10">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to publication</span>
        </Link>
        <span className="text-xs font-extrabold tracking-tight uppercase text-zinc-400">{tenant.name}</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-8 select-text">
        <div className="space-y-4">
          <div className="flex gap-2.5 items-center text-xs text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wide">
            <span>{post.category?.name || "Uncategorized"}</span>
            <span>•</span>
            <span>{post.readingTime} min read</span>
            {post.publishedAt && (
              <>
                <span>•</span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-zinc-900 dark:text-zinc-50">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 pt-2">
            {post.author?.image && (
              <img src={post.author.image} alt={post.author.name || ""} className="w-8 h-8 rounded-full" />
            )}
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-350">
              By {post.author?.name || "Author"}
            </span>
          </div>
        </div>

        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="w-full h-80 object-cover rounded-3xl" />
        )}

        <div className="prose dark:prose-invert max-w-none pt-4">
          <MarkdownPreview content={post.content} />
        </div>
      </main>
    </div>
  );
}
export const dynamic = "force-dynamic";
