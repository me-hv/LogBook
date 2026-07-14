"use client";

import { useEffect, useState, useTransition } from "react";
import { getEditorialNotes, createEditorialNote } from "@/app/admin/actions";
import { authClient } from "@/lib/auth-client";
import { FileText, Send, Loader2 } from "lucide-react";

interface NoteItem {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface EditorialNotesProps {
  postId: string;
}

export function EditorialNotes({ postId }: EditorialNotesProps) {
  const { data: session } = authClient.useSession();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const currentUser = session?.user;
  const isAllowedRole =
    currentUser?.role === "editor" ||
    currentUser?.role === "admin" ||
    currentUser?.role === "superadmin";

  const loadNotes = async () => {
    const res = await getEditorialNotes(postId);
    if (res.success) {
      setNotes(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, [postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const res = await createEditorialNote(postId, content);
      if (res.success) {
        setContent("");
        loadNotes();
      } else {
        alert(res.error || "Failed to leave editorial note");
      }
    });
  };

  if (!isAllowedRole) return null;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 bg-white dark:bg-zinc-950/20 shadow-sm space-y-4 text-left">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900/60 pb-3">
        <FileText className="w-4.5 h-4.5 text-zinc-900 dark:text-zinc-50" />
        <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          Editorial Notes ({notes.length})
        </h4>
      </div>

      {/* List notes */}
      {loading ? (
        <div className="flex items-center justify-center py-6 text-zinc-400">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        <div className="max-h-40 overflow-y-auto space-y-3 pr-1 divide-y divide-zinc-100 dark:divide-zinc-900/60">
          {notes.length > 0 ? (
            notes.map((note, idx) => (
              <div key={note.id} className={`pt-3 first:pt-0 space-y-1`}>
                <div className="flex justify-between items-center text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider">
                  <span>{note.author.name || "Editor"}</span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-normal select-text pl-1">
                  {note.content}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-zinc-400 italic text-xs">
              No editorial review notes logged.
            </div>
          )}
        </div>
      )}

      {/* Form composer note */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          placeholder="Suggest grammar changes, SEO keywords..."
          className="flex-grow px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all disabled:opacity-60"
          required
        />
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold hover:bg-zinc-850 dark:hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </form>
    </div>
  );
}
