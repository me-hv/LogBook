"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Trash2, Edit3, Eye, FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { deletePost } from "../actions";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  createdAt: string;
  category: { id: string; name: string } | null;
  tags: { id: string; name: string }[];
}

interface PostsManagerProps {
  initialPosts: Post[];
}

export function PostsManager({ initialPosts }: PostsManagerProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeletingId(id);
    const res = await deletePost(id);
    if (res.success) {
      setPosts(posts.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete post: " + res.error);
    }
    setDeletingId(null);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const headers = ["Title", "Category", "Views", "Status", "Actions"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Posts Management"
        description="Write, publish, edit, or remove your blog articles."
        actionLabel="New Post"
        actionHref="/admin/posts/new"
        actionIcon={<Plus className="w-4 h-4" />}
      />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-950/40 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-9 pr-4 py-2 border border-zinc-205 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
          />
        </div>

        {/* Filter */}
        <div className="relative w-full sm:w-auto flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full sm:w-40 px-3 py-2 border border-zinc-205 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-550 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      {filteredPosts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="Try modifying your search queries or filter, or create a brand new post."
          icon={<FileText className="w-8 h-8" />}
          actionLabel="New Post"
          onAction={() => window.location.href = "/admin/posts/new"}
        />
      ) : (
        <DataTable headers={headers}>
          {filteredPosts.map((post) => (
            <tr
              key={post.id}
              className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors"
            >
              <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50 max-w-xs truncate">
                <div>
                  <p>{post.title}</p>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">/{post.slug}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-zinc-650 dark:text-zinc-400">
                {post.category?.name || "Uncategorized"}
              </td>
              <td className="px-6 py-4 font-mono text-zinc-650 dark:text-zinc-400">
                {post.views}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    post.status === "published"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40"
                      : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40"
                  }`}
                >
                  {post.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="inline-flex items-center gap-2">
                  <Link
                    href={`/blog`} // Preview links to the blog
                    target="_blank"
                    className="p-1.5 rounded-lg text-zinc-550 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                    title="View blog"
                  >
                    <Eye className="w-4.5 h-4.5" />
                  </Link>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="p-1.5 rounded-lg text-zinc-550 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                    title="Edit post"
                  >
                    <Edit3 className="w-4.5 h-4.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="p-1.5 rounded-lg text-zinc-550 dark:text-zinc-450 hover:text-red-650 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all disabled:opacity-50 cursor-pointer"
                    title="Delete post"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
