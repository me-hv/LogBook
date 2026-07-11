import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Folder } from "lucide-react";
import { MOCK_POSTS } from "@/lib/mockPosts";
import { PostList } from "@/components/PostList";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  // Find matching posts
  const filteredPosts = MOCK_POSTS.filter(
    (post) => post.category?.slug.toLowerCase() === slug.toLowerCase()
  );

  // Determine category name
  const categoryName =
    filteredPosts[0]?.category?.name ||
    slug.charAt(0).toUpperCase() + slug.slice(1);

  if (filteredPosts.length === 0) {
    // If slug doesn't exist at all in mock posts, return a fallback or 404
    // For demo purposes, we will proceed but check if the category slug is in our known mock dataset.
    const knownSlugs = ["development", "design"];
    if (!knownSlugs.includes(slug.toLowerCase())) {
      notFound();
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to blog</span>
      </Link>

      {/* Header */}
      <div className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-50">
          <Folder className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Category
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-0.5">
            {categoryName}
          </h1>
        </div>
      </div>

      {/* Posts */}
      <PostList
        posts={filteredPosts}
        fallbackText={`No articles found under the category "${categoryName}".`}
      />
    </div>
  );
}
export const dynamicParams = true;
