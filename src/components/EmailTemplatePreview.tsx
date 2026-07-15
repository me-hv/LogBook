"use client";

import { useEffect, useState } from "react";
import { getTenantBrandingAction } from "@/app/admin/actions";
import { Mail, ShieldCheck, Check } from "lucide-react";

export function EmailTemplatePreview() {
  const [branding, setBranding] = useState<any>(null);

  useEffect(() => {
    getTenantBrandingAction().then((res) => {
      if (res.success && res.data) {
        setBranding(res.data);
      }
    });
  }, []);

  const primaryColor = branding?.primaryColor || "#18181b";
  const appName = branding?.appName || "LogBook";

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-6 max-w-xl">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-650">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Custom Email Newsletter Template
          </h3>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
            Preview the white-labeled email layout sent to subscribers.
          </p>
        </div>
      </div>

      {/* Email mockup window */}
      <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/10 p-4">
        {/* Email Header info */}
        <div className="border-b border-zinc-200 dark:border-zinc-850 pb-3 mb-4 text-[10px] font-semibold text-zinc-400 space-y-1">
          <div><span className="font-bold text-zinc-900 dark:text-zinc-300">From:</span> newsletter@mg.{appName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com</div>
          <div><span className="font-bold text-zinc-900 dark:text-zinc-300">Subject:</span> New publication published!</div>
        </div>

        {/* Email body wrapper */}
        <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-150 dark:border-zinc-900 rounded-xl space-y-4 max-w-md mx-auto text-center">
          {branding?.logoUrl ? (
            <img src={branding.logoUrl} alt="Logo" className="w-8 h-8 rounded mx-auto object-cover" />
          ) : (
            <div style={{ backgroundColor: primaryColor }} className="w-8 h-8 rounded-xl mx-auto" />
          )}

          <span style={{ fontFamily: branding?.fontFamily || "Inter" }} className="text-xs font-black text-zinc-900 dark:text-zinc-100 block">
            {appName}
          </span>

          <h3 style={{ color: primaryColor }} className="text-sm font-extrabold tracking-tight mt-4">
            Weekly Digest Edition
          </h3>

          <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold">
            Hello Reader! Here is the latest round-up of stories published this week on our brand-new branded newsletter portal.
          </p>

          <div className="pt-2">
            <button
              style={{ backgroundColor: primaryColor }}
              className="px-5 py-2 rounded-xl text-[9px] font-bold text-white uppercase tracking-wide cursor-default"
            >
              Read Full Digest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
