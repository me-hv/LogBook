"use client";

import { useEffect, useState, useTransition } from "react";
import { getPostReactions, togglePostReaction } from "@/app/admin/actions";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

interface ReactionBarProps {
  postId: string;
}

const REACTION_TYPES = [
  { key: "like", label: "Like", emoji: "👍" },
  { key: "love", label: "Love", emoji: "❤️" },
  { key: "fire", label: "Fire", emoji: "🔥" },
  { key: "insightful", label: "Insight", emoji: "💡" },
  { key: "bookmark", label: "Save", emoji: "🔖" },
];

export function ReactionBar({ postId }: ReactionBarProps) {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const [counts, setCounts] = useState<Record<string, number>>({
    like: 0,
    love: 0,
    fire: 0,
    insightful: 0,
    bookmark: 0,
  });
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadReactions() {
      const res = await getPostReactions(postId);
      if (res.success && res.counts && res.userReactions) {
        setCounts(res.counts);
        setUserReactions(res.userReactions);
      }
      setLoading(false);
    }
    loadReactions();
  }, [postId]);

  const handleReact = (type: string) => {
    if (!isLoggedIn) {
      alert("You must be logged in to react to posts.");
      return;
    }

    // Optimistic UI updates
    const alreadyReacted = userReactions.includes(type);
    const updatedUserReactions = alreadyReacted
      ? userReactions.filter((r) => r !== type)
      : [...userReactions, type];

    const updatedCounts = {
      ...counts,
      [type]: Math.max(0, counts[type] + (alreadyReacted ? -1 : 1)),
    };

    setCounts(updatedCounts);
    setUserReactions(updatedUserReactions);

    startTransition(async () => {
      const res = await togglePostReaction(postId, type);
      if (res.success && res.counts && res.userReactions) {
        setCounts(res.counts);
        setUserReactions(res.userReactions);
      } else {
        // Rollback
        setCounts(counts);
        setUserReactions(userReactions);
        alert(res.error || "Failed to save reaction");
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-zinc-400 text-xs">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Loading article interactions...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 py-4 items-center">
      {REACTION_TYPES.map((reaction) => {
        const isActive = userReactions.includes(reaction.key);
        const count = counts[reaction.key] || 0;

        return (
          <button
            key={reaction.key}
            onClick={() => handleReact(reaction.key)}
            disabled={isPending}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer select-none ${
              isActive
                ? "bg-zinc-900 border-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-900 shadow-xs"
                : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            }`}
            title={reaction.label}
          >
            <span className="text-sm">{reaction.emoji}</span>
            <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
