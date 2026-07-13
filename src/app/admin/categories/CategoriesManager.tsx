"use client";

import { useState } from "react";
import { Plus, Trash2, Edit3, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { createCategory, updateCategory, deleteCategory } from "../actions";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
}

interface CategoriesManagerProps {
  initialCategories: Category[];
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  
  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setError("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Posts linked to it will be set to uncategorized.")) return;
    const res = await deleteCategory(id);
    if (res.success) {
      setCategories(categories.filter((c) => c.id !== id));
      if (editingId === id) handleCancel();
    } else {
      alert("Failed to delete category: " + res.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      setError("Name and Slug are required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (editingId) {
        // Update
        const res = await updateCategory(editingId, { name, slug, description: description || undefined });
        if (res.success && res.category) {
          setCategories(
            categories.map((c) =>
              c.id === editingId
                ? {
                    ...c,
                    name: res.category!.name,
                    slug: res.category!.slug,
                    description: res.category!.description,
                  }
                : c
            )
          );
          handleCancel();
        } else {
          setError(res.error || "Failed to update category.");
        }
      } else {
        // Create
        const res = await createCategory({ name, slug, description: description || undefined });
        if (res.success && res.category) {
          setCategories([
            ...categories,
            {
              id: res.category!.id,
              name: res.category!.name,
              slug: res.category!.slug,
              description: res.category!.description,
              postCount: 0,
            },
          ]);
          handleCancel();
        } else {
          setError(res.error || "Failed to create category.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const headers = ["Name", "Slug", "Post Count", "Actions"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories Management"
        description="Organize your blog posts into distinct content categories."
      />

      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Left Side: Table */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider px-1">
            Available Categories
          </h2>

          {categories.length === 0 ? (
            <EmptyState
              title="No categories found"
              description="Create a category using the form on the right."
              icon={<FolderKanban className="w-8 h-8" />}
            />
          ) : (
            <DataTable headers={headers}>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                    <div>
                      <p>{cat.name}</p>
                      {cat.description && (
                        <p className="text-xs text-zinc-400 font-normal mt-0.5 line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-zinc-650 dark:text-zinc-400">
                    /{cat.slug}
                  </td>
                  <td className="px-6 py-4 text-zinc-650 dark:text-zinc-400">
                    {cat.postCount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 rounded-lg text-zinc-550 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                        title="Edit category"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 rounded-lg text-zinc-550 dark:text-zinc-450 hover:text-red-650 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                        title="Delete category"
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

        {/* Right Side: Form */}
        <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            {editingId ? "Edit Category" : "Create Category"}
          </h3>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-red-650 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Next.js Development"
                className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="nextjs-development"
                className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Articles relating to Next.js framework..."
                rows={3}
                className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-355 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
