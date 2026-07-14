"use client";

import { useState, useTransition } from "react";
import { subscribeAction } from "@/app/admin/actions";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface SubscribeFormProps {
  source?: string;
  title?: string;
  description?: string;
}

export function SubscribeForm({
  source = "newsletter",
  title = "Subscribe to our Newsletter",
  description = "Get the latest publications, tutorials, and announcements delivered directly to your inbox.",
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    startTransition(async () => {
      const res = await subscribeAction(email, source);
      if (res.success) {
        setSuccess(res.message || "Thank you for subscribing!");
        setEmail("");
      } else {
        setError(res.error || "An error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="w-full p-6 sm:p-8 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-4">
      <div className="space-y-1.5">
        <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Mail className="w-4 h-4" />
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            placeholder="you@example.com"
            className="block w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950/40 text-sm placeholder-zinc-400 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all disabled:opacity-60"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Joining...</span>
            </>
          ) : (
            <span>Subscribe</span>
          )}
        </button>
      </form>

      {/* States Feedback overlays */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
