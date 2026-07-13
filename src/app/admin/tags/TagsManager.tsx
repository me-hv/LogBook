"use client";

import { useState } from "react";
import { Plus, Trash2, Edit3, Tags } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { createTag, updateTag, deleteTag } from "../actions";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagsManagerProps {
  initialTags: Tag[];
}

export function TagsManager({ initialTags }: TagsManagerProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  
  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
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

  const handleEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setName(tag.name);
    setSlug(tag.slug);
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setError("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    const res = await deleteTag(id);
    if (res.success) {
      setTags(tags.filter((t) => t.id !== id));
      if (editingId === id) handleCancel();
    } else {
      alert("Failed to delete tag: " + res.error);
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
        const res = await updateTag(editingId, { name, slug });
        if (res.success && res.tag) {
          setTags(
            tags.map((t) =>
              t.id === editingId
                ? {
                    ...t,
                    name: res.tag!.name,
                    slug: res.tag!.slug,
                  }
                : t
            )
          );
          handleCancel();
        } else {
          setError(res.error || "Failed to update tag.");
        }
      } else {
        // Create
        const res = await createTag({ name, slug });
        if (res.success && res.tag) {
          setTags([
            ...tags,
            {
              id: res.tag!.id,
              name: res.tag!.name,
              slug: res.tag!.slug,
            },
          ]);
          handleCancel();
        } else {
          setError(res.error || "Failed to create tag.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const headers = ["Name", "Slug", "Actions"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tags Management"
        description="Create and organize granular tags for labeling your posts."
      />

      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Left Side: Table */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider px-1">
            Available Tags
          </h2>

          {tags.length === 0 ? (
            <EmptyState
              title="No tags found"
              description="Create a tag using the form on the right."
              icon={<Tags className="w-8 h-8" />}
            />
          ) : (
            <DataTable headers={headers}>
              {tags.map((tag) => (
                <tr
                  key={tag.id}
                  className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                    {tag.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-zinc-650 dark:text-zinc-400">
                    #{tag.slug}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="p-1.5 rounded-lg text-zinc-550 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                        title="Edit tag"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
                        className="p-1.5 rounded-lg text-zinc-550 dark:text-zinc-450 hover:text-red-650 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                        title="Delete tag"
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
            {editingId ? "Edit Tag" : "Create Tag"}
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
                placeholder="TypeScript"
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
                placeholder="typescript"
                className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
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
