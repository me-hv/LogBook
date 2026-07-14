"use client";

import { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/PageHeader";
import { getModerationCommentsList, moderateCommentAction, deleteCommentAction } from "../actions";
import { Search, Check, Ban, AlertOctagon, Trash2, Loader2, ArrowUpRight, MessageSquareOff } from "lucide-react";
import Link from "next/link";

interface CommentItem {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  author: {
    name: string | null;
    email: string;
    image: string | null;
  };
  post: {
    title: string;
    slug: string;
  };
}

export function CommentModerationManager() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadComments = () => {
    startTransition(async () => {
      const res = await getModerationCommentsList(statusFilter, search);
      if (res.success) {
        setComments(res.data || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadComments();
  }, [statusFilter, search]);

  const handleModerate = (id: string, nextStatus: string) => {
    startTransition(async () => {
      const res = await moderateCommentAction(id, nextStatus);
      if (res.success) {
        // Optimistically update status in state
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
        );
      } else {
        alert(res.error || "Failed to update comment status");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this comment? This cannot be undone.")) return;

    startTransition(async () => {
      const res = await deleteCommentAction(id);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(res.error || "Failed to delete comment");
      }
    });
  };

  const tabs = [
    { key: "all", label: "All Comments" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "spam", label: "Spam" },
  ];

  return (
    <div className="space-y-8 flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 gap-4">
        <PageHeader
          title="Comment Moderation"
          description="Moderate reader comments, reject spam links, or scrub discussion threads."
        />
        {isPending && <Loader2 className="w-4 h-4 text-zinc-550 animate-spin" />}
      </div>

      {/* Tabs and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex overflow-x-auto w-full md:w-auto p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.key
                  ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search comments content or author..."
            className="block w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-2">
          <Loader2 className="w-8 h-8 text-zinc-900 dark:text-zinc-50 animate-spin" />
          <span className="text-xs text-zinc-400">Querying comment lists...</span>
        </div>
      ) : comments.length > 0 ? (
        <div className="grid gap-5">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
            >
              {/* Meta header info */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50">
                      {comment.author.name || "Anonymous"}
                    </span>
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500">
                      ({comment.author.email})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                    <span>commented on</span>
                    <Link
                      href={`/blog/${comment.post.slug}`}
                      target="_blank"
                      className="text-zinc-750 dark:text-zinc-300 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>{comment.post.title}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      comment.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : comment.status === "pending"
                        ? "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                        : comment.status === "rejected"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {comment.status}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-semibold select-none">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50/50 dark:bg-zinc-950/20 p-4 border border-zinc-150 dark:border-zinc-900 rounded-2xl break-words select-text font-mono">
                {comment.content}
              </div>

              {/* Action moderation buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-900/60">
                <div className="flex items-center gap-2">
                  {comment.status !== "approved" && (
                    <button
                      onClick={() => handleModerate(comment.id, "approved")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  {comment.status !== "rejected" && (
                    <button
                      onClick={() => handleModerate(comment.id, "rejected")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                  {comment.status !== "spam" && (
                    <button
                      onClick={() => handleModerate(comment.id, "spam")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Mark Spam</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/5 transition-all cursor-pointer"
                  title="Permanently Delete Comment"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center text-zinc-400 dark:text-zinc-550 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-3xl space-y-3 flex flex-col items-center">
          <MessageSquareOff className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
          <p className="text-xs sm:text-sm font-semibold italic">No comments found matching this filter criteria</p>
        </div>
      )}
    </div>
  );
}
