"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { PostList } from "@/components/PostList";
import { MOCK_POSTS } from "@/lib/mockPosts";

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = MOCK_POSTS.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(({ tag }) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Articles & Insights
          </h1>
          <p className="text-sm sm:text-base text-zinc-650 dark:text-zinc-400 max-w-xl leading-relaxed">
            Thoughts, tutorials, and articles written by the LogBook team. Explore topics from web development to design workflows.
          </p>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Main List */}
      <PostList
        posts={filteredPosts}
        fallbackText={`No articles found matching "${searchQuery}"`}
      />
    </div>
  );
}
