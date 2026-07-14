"use client";

import { useState, useTransition } from "react";
import { sendCustomNewsletter } from "@/app/admin/actions";
import { Send, Eye, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function NewsletterEditor() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!subject.trim() || !content.trim()) {
      setError("Please fill out both the subject and the HTML message content.");
      return;
    }

    startTransition(async () => {
      const res = await sendCustomNewsletter(subject, content);
      if (res.success) {
        setSuccess(`Newsletter campaign sent successfully to ${res.count} active subscribers!`);
        setSubject("");
        setContent("");
      } else {
        setError(res.error || "Failed to transmit newsletter campaign");
      }
    });
  };

  // Reusable CSS styling wrapper matching services/emails.ts styles for preview accuracy
  const previewHtml = `
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #fafafa; color: #18181b; padding: 15px; margin: 0; }
          .container { max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
          .logo { font-size: 16px; font-weight: bold; color: #18181b; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
          h1 { font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 12px; }
          p { font-size: 13px; line-height: 1.5; color: #52525b; margin-top: 0; margin-bottom: 12px; }
          .footer { margin-top: 24px; border-top: 1px solid #e4e4e7; padding-top: 16px; text-align: center; font-size: 10px; color: #a1a1aa; }
          .btn { display: inline-block; background-color: #18181b; color: #ffffff !important; font-size: 12px; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 10px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">LogBook Newsletter</div>
          ${content || "<p className='italic text-zinc-400'>Type HTML content in the editor to see it render here...</p>"}
          <div class="footer">
            <p>You received this because you subscribed to LogBook.</p>
            <p><a href="#" style="color:#71717a; text-decoration:underline;">Unsubscribe</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Campaign Composer Form */}
      <form onSubmit={handleSend} className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Campaign Composer
          </h4>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            Design and send custom email announcements.
          </p>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
            Email Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isPending}
            placeholder="Announcing our latest project series! 🚀"
            className="block w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all disabled:opacity-60"
            required
          />
        </div>

        {/* HTML message content */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              HTML Body Content
            </label>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold lowercase">
              Basic HTML supported
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending}
            placeholder="<h1>Big news!</h1>\n<p>We are excited to share that...</p>\n<a href='https://logbook.com' class='btn'>Learn More</a>"
            rows={10}
            className="block w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all font-mono disabled:opacity-60"
            required
          />
        </div>

        {/* Action button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold hover:bg-zinc-850 dark:hover:bg-zinc-200 transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Transmitting emails...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send Campaign</span>
            </>
          )}
        </button>

        {/* States feedback */}
        {success && (
          <div className="flex items-center gap-2.5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2.5 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Live Preview Panel */}
      <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900/60 pb-3">
          <Eye className="w-4.5 h-4.5 text-zinc-400" />
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Live Email Preview
          </h4>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 h-[360px]">
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full border-none bg-white"
            title="Live Email Preview"
          />
        </div>
      </div>
    </div>
  );
}
