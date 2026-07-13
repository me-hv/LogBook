import { prisma } from "@/lib/prisma";
import { PostForm } from "../PostForm";

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <PostForm categories={categories} tags={tags} />;
}
