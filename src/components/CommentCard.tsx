"use client";

import { useState, useTransition } from "react";
import { ReplyForm } from "./ReplyForm";
import { deleteCommentAction } from "@/app/admin/actions";
import { authClient } from "@/lib/auth-client";
import { MessageSquare, Trash2, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";

interface AuthorItem {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
}

interface CommentItem {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  status: string;
  createdAt: string;
  author: AuthorItem;
  replies?: CommentItem[];
}

interface CommentCardProps {
  comment: CommentItem;
  postAuthorId: string;
  depth?: number;
  onAddReply: (reply: CommentItem) => void;
  onDeleteComment: (id: string) => void;
}

export function CommentCard({
  comment,
  postAuthorId,
  depth = 0,
  onAddReply,
  onDeleteComment,
}: CommentCardProps) {
  const { data: session } = authClient.useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentUser = session?.user;
  const isCommentAuthor = currentUser?.id === comment.authorId;
  const isPostAuthor = currentUser?.id === postAuthorId;
  const isAdmin = currentUser?.role === "admin";

  // Calculate 15 mins window for deletion for comment author
  const createdDate = new Date(comment.createdAt);
  const timeDiffMins = (Date.now() - createdDate.getTime()) / (1000 * 60);
  const canDelete = isAdmin || isPostAuthor || (isCommentAuthor && timeDiffMins < 15);

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    startTransition(async () => {
      const res = await deleteCommentAction(comment.id);
      if (res.success) {
        onDeleteComment(comment.id);
      } else {
        alert(res.error || "Failed to delete comment");
      }
    });
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={depth > 0 ? "pl-4 sm:pl-6 border-l border-zinc-200 dark:border-zinc-800 mt-4" : "mt-6"}>
      <div className="bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-900 rounded-2xl p-4 sm:p-5 space-y-3.5 hover:border-zinc-200 dark:hover:border-zinc-800 transition-all duration-300">
        
        {/* Comment Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {comment.author.image ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-850">
                <Image
                  src={comment.author.image}
                  alt={comment.author.name || "User profile"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                {getInitials(comment.author.name)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
                  {comment.author.name || "Anonymous"}
                </span>
                {comment.authorId === postAuthorId && (
                  <span className="px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-[9px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider scale-95">
                    Author
                  </span>
                )}
              </div>
              <span className="block text-[10px] text-zinc-450 dark:text-zinc-500">
                {new Date(comment.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Collapse toggle */}
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                title={isCollapsed ? "Expand replies" : "Collapse replies"}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}

            {/* Delete comment */}
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-450 p-1.5 rounded-lg hover:bg-rose-500/5 transition-colors cursor-pointer disabled:opacity-50"
                title="Delete comment"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Content body (Hidden if collapsed) */}
        {!isCollapsed && (
          <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed break-words whitespace-pre-wrap select-text pl-1.5">
            {comment.content}
          </div>
        )}

        {/* Action controls footer */}
        {!isCollapsed && (
          <div className="flex items-center gap-4 pt-1.5 pl-1.5">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider select-none">
                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
              </span>
            )}
          </div>
        )}

        {/* Reply Form */}
        {showReplyForm && !isCollapsed && (
          <ReplyForm
            postId={comment.postId}
            parentId={comment.id}
            onSuccess={(reply) => {
              setShowReplyForm(false);
              onAddReply(reply);
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        )}
      </div>

      {/* Recursive replies render */}
      {!isCollapsed && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-1.5">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              postAuthorId={postAuthorId}
              depth={depth + 1}
              onAddReply={onAddReply}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
