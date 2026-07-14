"use client";

import { CommentForm } from "./CommentForm";

interface ReplyFormProps {
  postId: string;
  parentId: string;
  onSuccess: (reply: any) => void;
  onCancel: () => void;
}

export function ReplyForm({ postId, parentId, onSuccess, onCancel }: ReplyFormProps) {
  return (
    <div className="space-y-2 mt-3 pl-4 border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-top-1 duration-150">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
          Replying to comment
        </span>
        <button
          onClick={onCancel}
          className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
      <CommentForm
        postId={postId}
        parentId={parentId}
        onSuccess={onSuccess}
        placeholder="Reply to this thread..."
      />
    </div>
  );
}
