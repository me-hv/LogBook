import { prisma } from "@/lib/prisma";
import { PostsManager } from "./PostsManager";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  // Normalize posts to match what the client component expects
  const serializedPosts = posts.map(post => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    tags: post.tags.map(pt => pt.tag),
  }));

  return <PostsManager initialPosts={serializedPosts} />;
}
