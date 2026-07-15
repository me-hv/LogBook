"use client";

import { Palette } from "lucide-react";

interface LivePreviewProps {
  appName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export function LivePreview({ appName, logoUrl, primaryColor, secondaryColor, fontFamily }: LivePreviewProps) {
  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-4">
      <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block">
        White-Label Platform Live Preview
      </span>

      <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/10 h-64 flex flex-col justify-between">
        {/* App navbar mockup */}
        <header className="border-b border-zinc-250 dark:border-zinc-900 px-4 py-3 flex items-center justify-between bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-5 h-5 rounded object-cover" />
            ) : (
              <div style={{ backgroundColor: primaryColor }} className="w-5 h-5 rounded-lg" />
            )}
            <span style={{ fontFamily }} className="text-xs font-black text-zinc-900 dark:text-zinc-50">
              {appName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-250 dark:bg-zinc-800" />
            <span className="w-6 h-2.5 rounded bg-zinc-250 dark:bg-zinc-800" />
          </div>
        </header>

        {/* Content body mockup */}
        <div className="p-4 flex-1 flex flex-col justify-center items-center text-center space-y-3">
          <h4 style={{ fontFamily, color: primaryColor }} className="text-sm font-black leading-snug">
            Welcome to {appName}
          </h4>
          <p style={{ color: secondaryColor }} className="text-[10px] max-w-xs leading-relaxed font-semibold">
            This workspace dashboard, branding parameters, and accents are completely white-labeled.
          </p>

          <button
            style={{ backgroundColor: primaryColor }}
            className="px-4 py-1.5 rounded-xl text-[9px] font-bold text-white uppercase tracking-wide cursor-default"
          >
            Explore Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
