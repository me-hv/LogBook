import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PostList } from "@/components/PostList";
import { AuthorCard } from "@/components/AuthorCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const author = await prisma.user.findFirst({
    where: {
      OR: [
        { id: slug },
        { name: { mode: "insensitive", equals: slug.replace(/-/g, " ") } }
      ]
    }
  });

  if (!author) return {};

  return {
    title: `${author.name || "Anonymous"} | Author Profile`,
    description: `Articles written by ${author.name || "Anonymous"} on LogBook.`,
  };
}

export default async function AuthorProfilePage({ params }: PageProps) {
  const { slug } = await params;

  const author = await prisma.user.findFirst({
    where: {
      OR: [
        { id: slug },
        { name: { mode: "insensitive", equals: slug.replace(/-/g, " ") } }
      ]
    }
  });

  if (!author) {
    notFound();
  }

  const posts = await prisma.post.findMany({
    where: {
      authorId: author.id,
      status: "published",
    },
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
  });

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
    { name: author.name || "Author" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
      <Breadcrumbs items={breadcrumbs} />

      {/* Author Card Info */}
      <AuthorCard
        author={{
          id: author.id,
          name: author.name,
          image: author.image,
          email: author.email,
        }}
      />

      {/* Published Posts Grid Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-555 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-3">
          Published Articles
        </h3>
        <PostList
          posts={serializedPosts}
          fallbackText={`No articles have been published by ${author.name || "this author"} yet.`}
        />
      </div>
    </div>
  );
}
export const dynamicParams = true;
