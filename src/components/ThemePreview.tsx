"use client";

import { useState } from "react";
import { Eye, Palette, Layout, Moon, Sun } from "lucide-react";

export function ThemePreview() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [accentColor, setAccentColor] = useState("#6366f1"); // Indigo

  const colors = [
    { code: "#6366f1", label: "Indigo" },
    { code: "#10b981", label: "Emerald" },
    { code: "#f59e0b", label: "Amber" },
    { code: "#ec4899", label: "Pink" },
  ];

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-650">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Theme Customizer Preview
          </h3>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
            Configure custom theme properties and layout variables dynamically.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Color Palette Accent
            </span>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setAccentColor(c.code)}
                  style={{ backgroundColor: c.code }}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all border ${
                    accentColor === c.code ? "ring-2 ring-offset-2 ring-zinc-500" : "border-transparent"
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Mode Variant
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setThemeMode("light")}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  themeMode === "light"
                    ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-transparent"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-400"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setThemeMode("dark")}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  themeMode === "dark"
                    ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-transparent"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-400"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Mockup */}
        <div
          className={`border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 transition-all duration-350 ${
            themeMode === "light" ? "bg-zinc-50 text-zinc-900" : "bg-zinc-950 text-zinc-50"
          }`}
        >
          <div className="border-b border-zinc-200 dark:border-zinc-850 pb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono">logbook-preview.dev</span>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <h4 className="text-sm font-black leading-snug">
              Unveiling our Planet-Scale Global Deployment release
            </h4>
            <div className="flex items-center gap-2 text-[9px] font-semibold text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-zinc-250 dark:bg-zinc-900 text-[8px] font-bold uppercase tracking-wide">
                Tech
              </span>
              <span>July 15, 2026</span>
            </div>
            <p className="text-[10px] text-zinc-450 leading-relaxed font-semibold">
              Today we are excited to showcase our distributed multi-region edge catalog database cluster structures.
            </p>

            <button
              style={{ backgroundColor: accentColor }}
              className="px-3.5 py-1.5 rounded-xl text-[9px] font-bold text-white uppercase tracking-wide cursor-default"
            >
              Read Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
