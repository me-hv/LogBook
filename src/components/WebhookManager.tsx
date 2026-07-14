"use client";

import { useEffect, useState, useTransition } from "react";
import { getWebhooksListAction, createWebhookAction, toggleWebhookAction, deleteWebhookAction } from "@/app/admin/actions";
import { Webhook, Trash2, Plus, X, Globe, Link2, KeyRound } from "lucide-react";

export function WebhookManager() {
  const [hooks, setHooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Create Form State
  const [url, setUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["post.published"]);
  const [showAddModal, setShowAddModal] = useState(false);

  const availableEvents = [
    { id: "post.created", label: "Post Created" },
    { id: "post.updated", label: "Post Updated" },
    { id: "post.published", label: "Post Published" },
    { id: "comment.created", label: "Comment Created" },
    { id: "subscriber.created", label: "Subscriber Created" },
  ];

  const loadHooks = () => {
    startTransition(async () => {
      const res = await getWebhooksListAction();
      if (res.success) {
        setHooks(res.data || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadHooks();
  }, []);

  const handleToggleEvent = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    startTransition(async () => {
      const eventsStr = selectedEvents.join(",");
      const res = await createWebhookAction(url, secret || "logbook_secret", eventsStr);
      if (res.success) {
        setUrl("");
        setSecret("");
        setSelectedEvents(["post.published"]);
        setShowAddModal(false);
        loadHooks();
      }
    });
  };

  const handleToggleHook = (id: string) => {
    startTransition(async () => {
      const res = await toggleWebhookAction(id);
      if (res.success) {
        loadHooks();
      }
    });
  };

  const handleDeleteHook = (id: string) => {
    if (!confirm("Are you sure you want to delete this webhook subscription?")) return;

    startTransition(async () => {
      const res = await deleteWebhookAction(id);
      if (res.success) {
        loadHooks();
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
        Loading webhook subscriptions...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Webhooks Subscriptions
          </h3>
          <p className="text-xs text-zinc-555 dark:text-zinc-400">
            Subscribe to real-time event updates and push data directly to third-party endpoints.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Webhook</span>
        </button>
      </div>

      {/* Webhooks grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {hooks.length > 0 ? (
          hooks.map((h) => (
            <div
              key={h.id}
              className="bg-white dark:bg-zinc-950/40 p-5 border border-zinc-200 dark:border-zinc-850 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50 font-bold text-xs truncate max-w-[200px]">
                    <Globe className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <span className="truncate">{h.url}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleHook(h.id)}
                      disabled={isPending}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                        h.active ? "bg-zinc-900 dark:bg-zinc-50" : "bg-zinc-200 dark:bg-zinc-800"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-zinc-900 transition-transform ${
                          h.active ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteHook(h.id)}
                      disabled={isPending}
                      className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      title="Delete Webhook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {h.events.split(",").map((evt: string) => (
                    <span
                      key={evt}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-550 dark:text-zinc-400 font-mono text-[9px] font-bold"
                    >
                      {evt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-zinc-450 dark:text-zinc-500 flex justify-between items-center border-t border-zinc-100 dark:border-zinc-900/60 pt-3">
                <span>Created {new Date(h.createdAt).toLocaleDateString()}</span>
                <span>Active: {h.active ? "Yes" : "No"}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 py-12 text-center text-zinc-450 italic border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            No webhook endpoints registered. Click "Add Webhook" to listen to events.
          </div>
        )}
      </div>

      {/* Add Webhook Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-550 uppercase tracking-wider">
                Register Webhook Endpoint
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWebhook} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                  Endpoint URL
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center px-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-450">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yourdomain.com/webhooks"
                    className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 flex-grow"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                  Signing Secret (Optional)
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center px-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-455">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Custom webhook token verify secret..."
                    className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 flex-grow"
                  />
                </div>
              </div>

              {/* Event selectors checkmarks */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                  Event Subscriptions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableEvents.map((evt) => {
                    const isChecked = selectedEvents.includes(evt.id);
                    return (
                      <button
                        key={evt.id}
                        type="button"
                        onClick={() => handleToggleEvent(evt.id)}
                        className={`px-3 py-2 rounded-xl text-left border text-[10px] font-bold transition-all cursor-pointer flex justify-between items-center ${
                          isChecked
                            ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-transparent"
                            : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        <span>{evt.label}</span>
                        {isChecked && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-zinc-150 dark:border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 border border-zinc-250 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-400 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || selectedEvents.length === 0}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Save Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
