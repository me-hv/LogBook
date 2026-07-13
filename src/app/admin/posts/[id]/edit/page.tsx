import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/PostEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  const [post, categories, tags] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: {
        tags: {
          select: {
            tagId: true,
          },
        },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) {
    redirect("/admin/posts");
  }

  const serializedPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    status: post.status,
    categoryId: post.categoryId,
    tagIds: post.tags.map((t) => t.tagId),
  };

  return <PostEditor categories={categories} tags={tags} initialPost={serializedPost} />;
}
