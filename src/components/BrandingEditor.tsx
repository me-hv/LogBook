"use client";

import { useEffect, useState, useTransition } from "react";
import { getTenantBrandingAction, saveTenantBrandingAction } from "@/app/admin/actions";
import { ColorPicker } from "./ColorPicker";
import { FontSelector } from "./FontSelector";
import { LivePreview } from "./LivePreview";
import { Layout, Save, Check, Loader2 } from "lucide-react";

export function BrandingEditor() {
  const [appName, setAppName] = useState("LogBook");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#18181b");
  const [secondaryColor, setSecondaryColor] = useState("#71717a");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [customCss, setCustomCss] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getTenantBrandingAction();
      if (res.success && res.data) {
        setAppName(res.data.appName);
        setLogoUrl(res.data.logoUrl || "");
        setFaviconUrl(res.data.faviconUrl || "");
        setPrimaryColor(res.data.primaryColor);
        setSecondaryColor(res.data.secondaryColor);
        setFontFamily(res.data.fontFamily);
        setCustomCss(res.data.customCss || "");
      }
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await saveTenantBrandingAction({
        appName,
        logoUrl: logoUrl || undefined,
        faviconUrl: faviconUrl || undefined,
        primaryColor,
        secondaryColor,
        fontFamily,
        customCss: customCss || undefined,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 font-semibold">
      {/* Configuration Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl space-y-4 text-left">
        <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-3">
          <Layout className="w-5 h-5 text-zinc-450" />
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Custom Branding Configurations
          </h3>
        </div>

        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 p-3 rounded-xl text-xs font-bold text-emerald-850 dark:text-emerald-400 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>White-label brand assets updated successfully!</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-zinc-450 uppercase">Application Name</label>
          <input
            type="text"
            required
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g. Acme Hub"
            className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-zinc-450 uppercase">Logo Asset URL</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-zinc-450 uppercase">Favicon Asset URL</label>
          <input
            type="text"
            value={faviconUrl}
            onChange={(e) => setFaviconUrl(e.target.value)}
            placeholder="https://example.com/favicon.ico"
            className="block w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
          />
        </div>

        {/* Color configurations */}
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Primary Accent" value={primaryColor} onChange={setPrimaryColor} />
          <ColorPicker label="Secondary Accent" value={secondaryColor} onChange={setSecondaryColor} />
        </div>

        {/* Typography selector */}
        <FontSelector value={fontFamily} onChange={setFontFamily} />

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-zinc-450 uppercase">Custom CSS Overrides</label>
          <textarea
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            placeholder="e.g. :root { --border-radius: 12px; }"
            rows={2}
            className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs font-mono focus:outline-none focus:ring-1"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <Save className="w-3.5 h-3.5" />
            <span>Save Branding</span>
          </button>
        </div>
      </form>

      {/* Live Preview Panel */}
      <div className="space-y-6">
        <LivePreview
          appName={appName}
          logoUrl={logoUrl}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          fontFamily={fontFamily}
        />
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
