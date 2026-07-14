"use client";

import { useState } from "react";
import { Save, UploadCloud } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { saveSettings } from "../actions";

interface SettingsData {
  siteTitle: string;
  siteDescription: string;
  socialLinks: {
    github: string;
    twitter: string;
  };
  discordWebhookUrl?: string;
  slackWebhookUrl?: string;
}

interface SettingsManagerProps {
  initialSettings: SettingsData;
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [siteTitle, setSiteTitle] = useState(initialSettings.siteTitle);
  const [siteDescription, setSiteDescription] = useState(initialSettings.siteDescription);
  const [github, setGithub] = useState(initialSettings.socialLinks.github);
  const [twitter, setTwitter] = useState(initialSettings.socialLinks.twitter);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    setLoading(true);

    const payload = {
      siteTitle,
      siteDescription,
      socialLinks: {
        github,
        twitter,
      },
      discordWebhookUrl: initialSettings.discordWebhookUrl || "",
      slackWebhookUrl: initialSettings.slackWebhookUrl || "",
    };

    try {
      const res = await saveSettings(payload);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || "Failed to save settings.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Site Settings"
        description="Configure your blogging platform, metadata, and social media integrations."
      />

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/40 rounded-xl text-sm text-emerald-700 dark:text-emerald-450">
          Settings saved successfully!
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-sm text-red-650 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-6 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-150 dark:border-zinc-900 pb-3">
            General Site Information
          </h3>

          {/* Site Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
              Site Title
            </label>
            <input
              type="text"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="LogBook"
              className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
            />
          </div>

          {/* Site Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
              Site Description
            </label>
            <textarea
              required
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              placeholder="Your Markdown-first blogging platform."
              rows={3}
              className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all resize-none"
            />
          </div>

          {/* Logo Upload Placeholder */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
              Logo Icon
            </label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/10 transition-colors">
              <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                Click to upload logo
              </p>
              <p className="text-[10px] text-zinc-400 mt-1">
                SVG, PNG, JPG up to 2MB (Media upload placeholder only)
              </p>
            </div>
          </div>
        </div>

        {/* Social Integrations */}
        <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-6 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-150 dark:border-zinc-900 pb-3">
            Social Media Integration
          </h3>

          {/* GitHub */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
              GitHub URL
            </label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/..."
              className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
            />
          </div>

          {/* Twitter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
              Twitter (X) URL
            </label>
            <input
              type="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://twitter.com/..."
              className="block w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving Settings..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
