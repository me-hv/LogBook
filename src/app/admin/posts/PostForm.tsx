"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { createPost, updatePost } from "../actions";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface PostFormProps {
  categories: Category[];
  tags: Tag[];
  initialPost?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    status: string;
    categoryId: string | null;
    tagIds: string[];
  };
}

export function PostForm({ categories, tags, initialPost }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || "");
  const [status, setStatus] = useState(initialPost?.status || "draft");
  const [categoryId, setCategoryId] = useState(initialPost?.categoryId || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(initialPost?.tagIds || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialPost) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      setError("Title, Slug, and Content are required fields.");
      return;
    }
    setError("");
    setLoading(true);

    const payload = {
      title,
      slug,
      excerpt: excerpt || undefined,
      content,
      coverImage: coverImage || undefined,
      status,
      categoryId: categoryId || undefined,
      tagIds: selectedTags,
    };

    try {
      let res;
      if (initialPost) {
        res = await updatePost(initialPost.id, payload);
      } else {
        res = await createPost(payload);
      }

      if (res.success) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        setError(res.error || "Something went wrong.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title={initialPost ? "Edit Post" : "Create New Post"}
        description={initialPost ? "Modify your post details and update publication settings." : "Write a new article for your Markdown-first blog."}
      />

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-sm text-red-650 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Inputs */}
          <div className="md:col-span-2 space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                Post Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="How to Learn Next.js"
                className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                URL Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="how-to-learn-nextjs"
                className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of your article..."
                rows={2}
                className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all resize-none"
              />
            </div>

            {/* Content Placeholder */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                Markdown Content
              </label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Write your markdown content here..."
                rows={12}
                className="block w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-sm font-mono text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all"
              />
            </div>
          </div>

          {/* Sidebar Settings (Category, Tags, status, cover image) */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Publish Options</h3>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
                  Post Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 appearance-none cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Cover Image */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 appearance-none cursor-pointer"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags Checkboxes */}
            <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Tags</h3>
              {tags.length === 0 ? (
                <p className="text-xs text-zinc-500">No tags created yet.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center gap-2 cursor-pointer text-xs text-zinc-650 dark:text-zinc-350 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        className="rounded border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 focus:ring-zinc-900"
                      />
                      <span>{tag.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 items-center justify-end border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <Link
            href="/admin/posts"
            className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? "Saving..." : "Save Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
