import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/PostEditor";

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <PostEditor categories={categories} tags={tags} />;
}
