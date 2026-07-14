"use client";

import { useState, useTransition } from "react";
import { createComment } from "@/app/admin/actions";
import { authClient } from "@/lib/auth-client";
import { Send, Loader2 } from "lucide-react";
import Link from "next/link";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess: (comment: any) => void;
  placeholder?: string;
}

export function CommentForm({
  postId,
  parentId,
  onSuccess,
  placeholder = "Write a constructive comment...",
}: CommentFormProps) {
  const { data: session } = authClient.useSession();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const res = await createComment(postId, content, parentId);
      if (res.success) {
        setContent("");
        onSuccess(res.comment);
      } else {
        alert(res.error || "An error occurred while posting your comment.");
      }
    });
  };

  if (!session?.user) {
    return (
      <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20 text-center space-y-2.5">
        <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400">
          Want to join the discussion? Sign in to comment.
        </p>
        <Link
          href="/login"
          className="inline-flex px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold hover:bg-zinc-850 dark:hover:bg-zinc-200 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          disabled={isPending}
          rows={3}
          className="block w-full px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950/40 text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all resize-none disabled:opacity-60"
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold hover:bg-zinc-850 dark:hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Post Comment</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
