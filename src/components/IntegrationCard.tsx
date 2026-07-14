"use client";

import { useEffect, useState, useTransition } from "react";
import { getSettings, saveSettings } from "@/app/admin/actions";
import { Cpu, Check, MessageSquare, Bell, ArrowRight, Loader2 } from "lucide-react";

export function IntegrationCard() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Inputs
  const [discordUrl, setDiscordUrl] = useState("");
  const [slackUrl, setSlackUrl] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    startTransition(async () => {
      const res = await getSettings();
      if (res) {
        setSettings(res);
        setDiscordUrl(res.discordWebhookUrl || "");
        setSlackUrl(res.slackWebhookUrl || "");
      }
      setLoading(false);
    });
  }, []);

  const handleSaveIntegrations = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    startTransition(async () => {
      const updated = {
        ...settings,
        discordWebhookUrl: discordUrl,
        slackWebhookUrl: slackUrl,
      };

      const res = await saveSettings(updated);
      if (res.success) {
        setSavedMessage("Integrations updated successfully!");
        setTimeout(() => setSavedMessage(""), 3000);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
        Loading configurations...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-2xl">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          Third-party Chat announcements
        </h3>
        <p className="text-xs text-zinc-500">
          Automatically post announcements and link updates to Discord channels or Slack workspaces when posts are published.
        </p>
      </div>

      <form onSubmit={handleSaveIntegrations} className="space-y-6">
        {savedMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{savedMessage}</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Discord Card */}
          <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl space-y-3.5 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                    Discord Channel Webhook
                  </h4>
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
                    Send updates to Discord text channels when new articles go live.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Webhook URL
              </label>
              <input
                type="url"
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>

          {/* Slack Card */}
          <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl space-y-3.5 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 dark:text-rose-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                    Slack Incoming Webhook
                  </h4>
                  <p className="text-[10px] text-zinc-455 dark:text-zinc-500">
                    Publish changelogs and articles to Slack channels.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-455 dark:text-zinc-500 uppercase tracking-wider">
                Webhook URL
              </label>
              <input
                type="url"
                value={slackUrl}
                onChange={(e) => setSlackUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Save Integration Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
export const dynamic = "force-dynamic";
