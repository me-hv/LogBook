"use client";

import { useEffect, useState, useTransition } from "react";
import { getPostRevisions, restorePostRevision } from "@/app/admin/actions";
import { History, RefreshCw, Loader2, ArrowLeft, Calendar, FileText } from "lucide-react";

interface RevisionItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  editor: {
    name: string | null;
    image: string | null;
  };
}

interface RevisionViewerProps {
  postId: string;
  currentTitle: string;
  currentContent: string;
  onRestore: () => void;
}

export function RevisionViewer({ postId, currentTitle, currentContent, onRestore }: RevisionViewerProps) {
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [selectedRevision, setSelectedRevision] = useState<RevisionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadRevisions = async () => {
    const res = await getPostRevisions(postId);
    if (res.success) {
      setRevisions(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRevisions();
  }, [postId]);

  const handleRestore = (revId: string) => {
    if (!confirm("Are you sure you want to restore the article to this revision snapshot? Any unsaved edits in your current editor will be overwritten.")) return;

    startTransition(async () => {
      const res = await restorePostRevision(postId, revId);
      if (res.success) {
        onRestore();
        alert("Snapshot successfully restored! Reloading editor content.");
      } else {
        alert(res.error || "Failed to restore version snapshot");
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 gap-2 text-zinc-400 text-xs">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading revision logs...</span>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 bg-white dark:bg-zinc-950/20 shadow-sm space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/60 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4.5 h-4.5 text-zinc-900 dark:text-zinc-50" />
          <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Revision Snapshots ({revisions.length})
          </h4>
        </div>
        {selectedRevision && (
          <button
            onClick={() => setSelectedRevision(null)}
            className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to list</span>
          </button>
        )}
      </div>

      {!selectedRevision ? (
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {revisions.length > 0 ? (
            revisions.map((rev) => (
              <div
                key={rev.id}
                onClick={() => setSelectedRevision(rev)}
                className="p-3 border border-zinc-200 dark:border-zinc-850 rounded-2xl hover:border-zinc-400 dark:hover:border-zinc-700 transition-all cursor-pointer bg-zinc-50/50 dark:bg-zinc-950/10 hover:shadow-xs flex justify-between items-center"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                    {rev.title}
                  </div>
                  <div className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">
                    Edited by {rev.editor.name || "Collaborator"}
                  </div>
                </div>
                <div className="text-[10px] text-zinc-400 flex items-center gap-1 select-none">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-zinc-400 italic text-xs">
              No version history snapshots logged yet.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 bg-zinc-50/30">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider select-none">
              Revision Snapshot details
            </div>
            
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-zinc-450 uppercase">Snapshot Title:</h5>
              <p className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-50 pl-2 border-l border-zinc-300">
                {selectedRevision.title}
              </p>
            </div>

            <div className="space-y-1">
              <h5 className="text-xs font-bold text-zinc-450 uppercase">Snapshot Content Markdown:</h5>
              <div className="max-h-48 overflow-y-auto text-xs font-mono p-3 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl whitespace-pre-wrap break-words select-text">
                {selectedRevision.content}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleRestore(selectedRevision.id)}
            disabled={isPending}
            className="w-full py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold hover:bg-zinc-850 dark:hover:bg-zinc-200 transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>Restore this Revision snapshot</span>
          </button>
        </div>
      )}
    </div>
  );
}
