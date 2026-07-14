import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Folder } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PostList } from "@/components/PostList";
import { Pagination } from "@/components/Pagination";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};

  return {
    title: `${category.name} | LogBook Categories`,
    description: category.description || `Articles published under ${category.name} on LogBook.`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const postsPerPage = 6;
  const currentPage = parseInt(pageParam || "1", 10);
  const skip = (currentPage - 1) * postsPerPage;

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: {
        categoryId: category.id,
        status: "published",
      },
      skip,
      take: postsPerPage,
      orderBy: {
        createdAt: "desc",
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
    }),
    prisma.post.count({
      where: {
        categoryId: category.id,
        status: "published",
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / postsPerPage);

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
    tags: post.tags.map((t) => ({ tag: { id: t.tag.id, name: t.tag.name, slug: t.tag.slug } })),
  }));

  const breadcrumbs = [
    { name: "Blog", href: "/blog" },
    { name: category.name },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header Banner */}
      <div className="flex items-center gap-4 pb-8 border-b border-zinc-200 dark:border-zinc-800">
        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-550 shadow-sm">
          <Folder className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Category Archive
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-0.5 leading-none">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xs text-zinc-500 mt-1">{category.description}</p>
          )}
        </div>
      </div>

      {/* Main post list */}
      <PostList
        posts={serializedPosts}
        fallbackText={`No articles found under the category "${category.name}".`}
      />

      {/* Pagination control */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={`/category/${slug}`}
      />
    </div>
  );
}
export const dynamicParams = true;
