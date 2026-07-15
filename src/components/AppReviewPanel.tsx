"use client";

import { useEffect, useState, useTransition } from "react";
import { getAppReviewsAction, submitAppReviewAction } from "@/app/admin/actions";
import { Star, MessageSquare, Send, Loader2, Check } from "lucide-react";

interface AppReviewPanelProps {
  appId: string;
}

export function AppReviewPanel({ appId }: AppReviewPanelProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadReviews = () => {
    startTransition(async () => {
      const res = await getAppReviewsAction(appId);
      if (res.success && res.data) {
        setReviews(res.data);
      }
    });
  };

  useEffect(() => {
    loadReviews();
  }, [appId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    startTransition(async () => {
      const res = await submitAppReviewAction(appId, rating, text);
      if (res.success) {
        setText("");
        setSuccess(true);
        loadReviews();
        setTimeout(() => setSuccess(false), 2000);
      }
    });
  };

  return (
    <div className="space-y-6 text-left font-semibold">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-3">
        <MessageSquare className="w-4.5 h-4.5 text-zinc-400" />
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          Extension Reviews & Ratings
        </h4>
      </div>

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 p-3 rounded-xl text-xs font-bold text-emerald-850 dark:text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Review submitted successfully!</span>
        </div>
      )}

      {/* Review Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-zinc-450 uppercase">Rating:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  className={`w-4.5 h-4.5 ${
                    star <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a public review for this extension..."
            rows={2}
            className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || !text.trim()}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2"
          >
            {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            <span>Post Review</span>
          </button>
        </div>
      </form>

      {/* Reviews feed list */}
      <div className="space-y-3 pt-2">
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div
              key={r.id}
              className="p-3 border border-zinc-150 dark:border-zinc-900 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10"
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {r.user?.name || "Member"}
                </span>

                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= r.rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-zinc-450 leading-relaxed font-normal">{r.review}</p>
            </div>
          ))
        ) : (
          <span className="text-[10px] text-zinc-450 italic block text-center py-4">
            No reviews yet. Be the first to leave one!
          </span>
        )}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
