"use client";

import { useEffect, useState, useTransition, use } from "react";
import { unsubscribeAction } from "@/app/admin/actions";
import { Mail, CheckCircle2, AlertCircle, Loader2, Home } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function UnsubscribePage({ params }: PageProps) {
  const { token } = use(params);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleUnsubscribe = () => {
    setError("");
    setSuccess("");
    
    startTransition(async () => {
      const res = await unsubscribeAction(token);
      if (res.success) {
        setSuccess(res.message || "You have been unsubscribed.");
      } else {
        setError(res.error || "An error occurred.");
      }
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-zinc-50 dark:bg-black py-24 sm:py-32">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-50 mx-auto">
          <Mail className="w-5 h-5" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            Unsubscribe from LogBook
          </h1>
          <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed">
            We are sorry to see you go! Click the button below to confirm unsubscribe.
          </p>
        </div>

        {!success && !error && (
          <button
            onClick={handleUnsubscribe}
            disabled={isPending}
            className="w-full py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Confirm Unsubscribe</span>
            )}
          </button>
        )}

        {success && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs sm:text-sm font-medium text-left">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
            
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs sm:text-sm font-medium text-left">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
            
            <button
              onClick={handleUnsubscribe}
              disabled={isPending}
              className="text-xs font-bold text-zinc-900 dark:text-zinc-50 underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
