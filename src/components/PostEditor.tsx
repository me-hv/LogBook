"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, AlertCircle, Sparkles, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { CategorySelector } from "./CategorySelector";
import { TagSelector } from "./TagSelector";
import { MarkdownEditor } from "./MarkdownEditor";
import { calculateReadingTime } from "./ReadingTime";
import { MediaSelector } from "./MediaSelector";
import { createPost, updatePost } from "@/app/admin/actions";
import { RevisionViewer } from "./RevisionViewer";
import { EditorialNotes } from "./EditorialNotes";
import { SEOScoreCard } from "./SEOScoreCard";
import { TagSuggestions } from "./TagSuggestions";
import { WritingInsights } from "./WritingInsights";
import { AIAssistantPanel } from "./AIAssistantPanel";
import { InternalLinkSuggestions } from "./InternalLinkSuggestions";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface PostEditorProps {
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

export function PostEditor({ categories, tags, initialPost }: PostEditorProps) {
  const router = useRouter();
  
  // Fields State
  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || "");
  const [status, setStatus] = useState(initialPost?.status || "draft");
  const [categoryId, setCategoryId] = useState(initialPost?.categoryId || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(initialPost?.tagIds || []);
  
  // UI Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveIndicator, setSaveIndicator] = useState("");
  const [showCoverSelector, setShowCoverSelector] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"settings" | "ai">("settings");

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

  const handleSave = async (forcedStatus?: string) => {
    if (!title.trim()) {
      setError("Post Title is required.");
      return;
    }
    if (!slug.trim()) {
      setError("URL Slug is required.");
      return;
    }
    if (!content.trim()) {
      setError("Markdown content cannot be empty.");
      return;
    }
    
    setError("");
    setLoading(true);
    setSaveIndicator("Saving...");

    const activeStatus = forcedStatus || status;
    const readingTime = calculateReadingTime(content);

    const payload = {
      title,
      slug,
      excerpt: excerpt || undefined,
      content,
      coverImage: coverImage || undefined,
      status: activeStatus,
      categoryId: categoryId || undefined,
      tagIds: selectedTags,
      readingTime,
    };

    try {
      let res;
      if (initialPost) {
        res = await updatePost(initialPost.id, payload);
      } else {
        res = await createPost(payload);
      }

      if (res.success) {
        setSaveIndicator("All changes saved!");
        setTimeout(() => setSaveIndicator(""), 3000);
        
        // Remove localStorage drafts
        localStorage.removeItem(`logbook-draft-${initialPost?.id || "new"}`);

        router.push("/admin/posts");
        router.refresh();
      } else {
        setError(res.error || "Failed to save post. Possible duplicate slug.");
        setSaveIndicator("");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
      setSaveIndicator("");
    } finally {
      setLoading(false);
    }
  };

  // Auto-save local storage backups
  useEffect(() => {
    const backupKey = `logbook-draft-${initialPost?.id || "new"}`;
    
    const interval = setInterval(() => {
      if (title.trim() || content.trim()) {
        const backupData = {
          title,
          slug,
          excerpt,
          content,
          coverImage,
          status,
          categoryId,
          selectedTags,
        };
        localStorage.setItem(backupKey, JSON.stringify(backupData));
        setSaveIndicator("Local backup saved.");
        setTimeout(() => setSaveIndicator(""), 2000);
      }
    }, 15000); // Auto-save locally every 15s

    return () => clearInterval(interval);
  }, [title, slug, excerpt, content, coverImage, status, categoryId, selectedTags, initialPost]);

  // Load local backups if any on mount
  useEffect(() => {
    const backupKey = `logbook-draft-${initialPost?.id || "new"}`;
    const localBackup = localStorage.getItem(backupKey);
    if (localBackup) {
      const restore = confirm("A newer local draft backup of this post was found. Restore it?");
      if (restore) {
        try {
          const data = JSON.parse(localBackup);
          setTitle(data.title || "");
          setSlug(data.slug || "");
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setCoverImage(data.coverImage || "");
          setStatus(data.status || "draft");
          setCategoryId(data.categoryId || "");
          setSelectedTags(data.selectedTags || []);
        } catch (e) {
          console.error("Failed to restore backup", e);
        }
      }
    }
  }, [initialPost]);

  // Hotkey listener (Ctrl + S: Save Draft, Ctrl + Enter: Publish)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + S -> Save draft
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave("draft");
      }
      // Ctrl + Enter -> Publish
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSave("published");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, slug, excerpt, content, coverImage, status, categoryId, selectedTags]);

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {initialPost ? "Edit Blog Article" : "Write Blog Article"}
          </h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-1">
            Build and preview markdown content before publishing.
          </p>
        </div>
        
        {/* Status Indicators & Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {saveIndicator && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold px-2.5 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{saveIndicator}</span>
            </div>
          )}
          
          <Link
            href="/admin/posts"
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Cancel
          </Link>
          
          <button
            onClick={() => handleSave()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-sm text-red-650 dark:text-red-400">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor & Configuration Columns */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] items-start">
        {/* Left Column: Markdown Editor */}
        <div className="space-y-4">
          {/* Post Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post Title..."
              className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-905/40 text-sm font-semibold text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
            />
          </div>

          {/* Markdown Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Markdown Body
            </label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="# Markdown header... Write your blog post contents here."
            />
          </div>
        </div>

        {/* Right Column: Side Settings Panel */}
        <div className="space-y-6">
          {/* Sidebar Tab Header */}
          <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <button
              type="button"
              onClick={() => setActiveSidebarTab("settings")}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSidebarTab === "settings"
                  ? "bg-zinc-900 dark:bg-zinc-550 text-zinc-50 dark:text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              Settings & Notes
            </button>
            <button
              type="button"
              onClick={() => setActiveSidebarTab("ai")}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSidebarTab === "ai"
                  ? "bg-zinc-900 dark:bg-zinc-550 text-zinc-50 dark:text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              AI Co-pilot & SEO
            </button>
          </div>

          {activeSidebarTab === "settings" ? (
            <>
              {/* General Metadata Card */}
              <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-zinc-150 dark:border-zinc-900 pb-3">
                  <Sparkles className="w-4.5 h-4.5 text-zinc-400" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Metadata</h3>
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-slug"
                    className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all font-mono"
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
                    Excerpt
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short summary..."
                    rows={3}
                    className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all resize-none"
                  />
                </div>

                {/* Cover Image */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
                    Cover Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all flex-grow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCoverSelector(true)}
                      className="px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center"
                      title="Choose from Media Library"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cover Media Selector Modal */}
              {showCoverSelector && (
                <MediaSelector
                  onClose={() => setShowCoverSelector(false)}
                  onSelect={(url) => setCoverImage(url)}
                  title="Select Cover Image"
                />
              )}

              {/* Publishing taxonomy card */}
              <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                  Publishing Options
                </h3>

                {/* Status Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-455 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 appearance-none cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Category Select */}
                <CategorySelector
                  categories={categories}
                  value={categoryId}
                  onChange={setCategoryId}
                />

                {/* Tag Selector */}
                <TagSelector
                  tags={tags}
                  selectedTags={selectedTags}
                  onChange={setSelectedTags}
                />
              </div>

              {/* Editorial Notes & Revision snap widgets (Only for existing posts) */}
              {initialPost && (
                <div className="space-y-6">
                  <EditorialNotes postId={initialPost.id} />
                  <RevisionViewer
                    postId={initialPost.id}
                    currentTitle={title}
                    currentContent={content}
                    onRestore={() => window.location.reload()}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              <AIAssistantPanel
                content={content}
                onInsertText={(txt) => setContent(content + (content ? "\n\n" : "") + txt)}
                onApplyExcerpt={setExcerpt}
              />
              <SEOScoreCard
                title={title}
                content={content}
                onApplyTitle={setTitle}
                onApplyMeta={setExcerpt}
              />
              <TagSuggestions
                content={content}
                onApplyCategory={(name) => {
                  const match = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
                  if (match) setCategoryId(match.id);
                }}
                onApplyTag={(name) => {
                  const match = tags.find(t => t.name.toLowerCase() === name.toLowerCase());
                  if (match && !selectedTags.includes(match.id)) {
                    setSelectedTags([...selectedTags, match.id]);
                  }
                }}
              />
              <WritingInsights content={content} />
              <InternalLinkSuggestions
                postId={initialPost?.id}
                content={content}
                onInsertLink={(lTitle, lSlug) => {
                  setContent(content + (content ? "\n\n" : "") + `[${lTitle}](/blog/${lSlug})`);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
