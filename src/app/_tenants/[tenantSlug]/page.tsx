import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";

interface TenantPageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default async function TenantLandingPage({ params }: TenantPageProps) {
  const { tenantSlug } = await params;

  // Resolve tenant by slug or custom domain
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

  // Fetch published posts belonging to this tenant
  const posts = await prisma.post.findMany({
    where: {
      tenantId: tenant.id,
      status: "published",
    },
    orderBy: { publishedAt: "desc" },
    include: {
      category: { select: { name: true, slug: true } },
      author: { select: { name: true, image: true } },
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased font-sans select-none text-left">
      {/* Header bar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          {tenant.logo ? (
            <img src={tenant.logo} alt={tenant.name} className="w-8 h-8 rounded-xl object-cover" />
          ) : (
            <BookOpen className="w-6 h-6 text-zinc-900 dark:text-zinc-50" />
          )}
          <span className="text-base font-extrabold tracking-tight">{tenant.name}</span>
        </div>
      </header>

      {/* Hero section */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent leading-tight">
            Welcome to {tenant.name}
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
            Read the latest updates, technical tutorials, and articles published by our team.
          </p>
        </div>

        {/* Posts lists grid */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-2">
            Latest Publications
          </h2>

          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200"
                >
                  <div className="space-y-2">
                    {post.coverImage && (
                      <img src={post.coverImage} alt={post.title} className="w-full h-40 object-cover rounded-2xl mb-2" />
                    )}
                    <div className="flex gap-2 items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                      <span>{post.category?.name || "Uncategorized"}</span>
                      <span>•</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-550 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {post.excerpt || "No summary preview provided."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.author?.image && (
                        <img src={post.author.image} alt={post.author.name || ""} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="text-[10px] font-bold text-zinc-650 dark:text-zinc-400">
                        {post.author?.name || "Author"}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[10px] font-bold text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-zinc-450 italic border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              No publications have been released by this workspace yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
export const dynamic = "force-dynamic";
