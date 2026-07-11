import { Post } from "@/types";
import { PostCard } from "./PostCard";

interface PostListProps {
  posts: Post[];
  fallbackText?: string;
}

export function PostList({ posts, fallbackText = "No posts found." }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center">
        <p className="text-zinc-550 dark:text-zinc-400 font-medium mb-1">
          {fallbackText}
        </p>
        <p className="text-xs text-zinc-450 dark:text-zinc-500">
          Check back later or try adjusting your search parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
