import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PostList } from "@/components/PostList";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: "Search Articles | LogBook",
  description: "Search for tutorials, guides, and programming notes on LogBook.",
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  let posts: any[] = [];
  if (query) {
    posts = await prisma.post.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
          { tags: { some: { tag: { name: { contains: query, mode: "insensitive" } } } } },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  const serializedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    published: post.status === "published",
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    status: post.status,
    readingTime: post.readingTime,
    views: post.views,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    category: post.category ? { id: post.category.id, name: post.category.name, slug: post.category.slug } : null,
    author: { id: post.author.id, name: post.author.name, email: post.author.email, image: post.author.image },
    tags: post.tags.map((t: any) => ({ tag: { id: t.tag.id, name: t.tag.name, slug: t.tag.slug } })),
  }));

  const breadcrumbs = [
    { name: "Blog", href: "/blog" },
    { name: "Search" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header Info */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-550 flex items-center gap-2.5 leading-none">
          <Search className="w-8 h-8" />
          <span>Search Articles</span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
          Looking for something specific? Search across all post titles, content, categories, and tags.
        </p>
      </div>

      {/* Search Input Bar form */}
      <form action="/search" method="GET" className="relative max-w-xl">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-450 dark:text-zinc-500">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Type keywords (e.g. Next.js, Tailwind)..."
          className="block w-full pl-11 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950/40 text-sm placeholder-zinc-450 dark:placeholder-zinc-500 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all shadow-sm"
        />
      </form>

      {/* Results Section */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
        {query ? (
          <div>
            <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-6">
              Search results for &quot;<span className="text-zinc-900 dark:text-zinc-50">{query}</span>&quot; ({serializedPosts.length})
            </h2>
            <PostList
              posts={serializedPosts}
              fallbackText={`No articles matched your search query "${query}".`}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center">
            <Search className="w-10 h-10 text-zinc-400 mb-3" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-250">Begin your search</h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 max-w-xs">
              Type a topic or keyword in the box above to find relevant reading material.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
