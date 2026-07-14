import { prisma } from "@/lib/prisma";
import { BlogIndexClient } from "./BlogIndexClient";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  
  const currentPage = parseInt(pageParam || "1", 10);
  const postsPerPage = 6;
  const skip = (currentPage - 1) * postsPerPage;

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: { status: "published" },
      skip,
      take: postsPerPage,
      orderBy: { createdAt: "desc" },
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
      where: { status: "published" },
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

  return (
    <BlogIndexClient
      initialPosts={serializedPosts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
export const dynamic = "force-dynamic";
