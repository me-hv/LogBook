"use client";

import { useEffect, useState, useTransition } from "react";
import { getPostComments } from "@/app/admin/actions";
import { CommentCard } from "./CommentCard";
import { CommentForm } from "./CommentForm";
import { Loader2, MessageSquareCode } from "lucide-react";

interface CommentListProps {
  postId: string;
  postAuthorId: string;
}

interface CommentItem {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  status: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    email: string;
  };
  replies?: CommentItem[];
}

export function CommentList({ postId, postAuthorId }: CommentListProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "active">("newest");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadComments = () => {
    startTransition(async () => {
      const res = await getPostComments(postId);
      if (res.success) {
        setComments(res.data || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  // Hierarchical nesting utility
  const buildCommentTree = (list: CommentItem[]): CommentItem[] => {
    const map = new Map<string, CommentItem>();
    const tree: CommentItem[] = [];

    // Pre-populate mapping
    list.forEach((c) => {
      map.set(c.id, { ...c, replies: [] });
    });

    list.forEach((c) => {
      const item = map.get(c.id)!;
      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(item);
        } else {
          // If parent is deleted/missing, treat as root
          tree.push(item);
        }
      } else {
        tree.push(item);
      }
    });

    // Apply sorting to top-level and children recursively
    const sortTreeNodes = (nodes: CommentItem[]): CommentItem[] => {
      return nodes
        .map((n) => {
          if (n.replies && n.replies.length > 0) {
            n.replies = sortTreeNodes(n.replies);
          }
          return n;
        })
        .sort((a, b) => {
          if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          } else if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          } else {
            // "active" (replies count descending)
            const countA = a.replies?.length || 0;
            const countB = b.replies?.length || 0;
            return countB - countA;
          }
        });
    };

    return sortTreeNodes(tree);
  };

  const handleAddComment = (comment: CommentItem) => {
    setComments((prev) => [...prev, comment]);
  };

  const handleDeleteComment = (id: string) => {
    // Delete comment and its replies from state
    setComments((prev) => {
      const idsToDelete = new Set<string>([id]);
      
      // Multi pass to catch nested child replies
      let added = true;
      while (added) {
        added = false;
        prev.forEach((c) => {
          if (c.parentId && idsToDelete.has(c.parentId) && !idsToDelete.has(c.id)) {
            idsToDelete.add(c.id);
            added = true;
          }
        });
      }

      return prev.filter((c) => !idsToDelete.has(c.id));
    });
  };

  const commentTree = buildCommentTree(comments);

  return (
    <div className="space-y-6">
      {/* Header sorting tools */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <MessageSquareCode className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">
            Discussion ({comments.length})
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-450 dark:text-zinc-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            <option value="newest" className="dark:bg-zinc-950">Newest</option>
            <option value="oldest" className="dark:bg-zinc-950">Oldest</option>
            <option value="active" className="dark:bg-zinc-950">Most Active</option>
          </select>
        </div>
      </div>

      {/* Top Comment form */}
      <CommentForm postId={postId} onSuccess={handleAddComment} />

      {/* List comments */}
      {loading ? (
        <div className="flex items-center justify-center py-10 gap-2 text-zinc-400 text-xs font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading comments thread...</span>
        </div>
      ) : commentTree.length > 0 ? (
        <div className="space-y-1.5 divide-y divide-zinc-100 dark:divide-zinc-900/60 pb-12">
          {commentTree.map((item) => (
            <CommentCard
              key={item.id}
              comment={item}
              postAuthorId={postAuthorId}
              onAddReply={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-xs sm:text-sm italic">
          No comments yet. Start the conversation!
        </div>
      )}
    </div>
  );
}
