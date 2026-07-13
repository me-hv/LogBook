import { getPosts } from "@/services/db";
import { BlogIndexClient } from "./BlogIndexClient";

export default async function BlogIndexPage() {
  const posts = await getPosts({ status: "published" });

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

  return <BlogIndexClient initialPosts={serializedPosts} />;
}
