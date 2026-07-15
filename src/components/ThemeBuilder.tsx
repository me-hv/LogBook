"use client";

import { useState } from "react";
import { Check, Columns, Sparkles, Monitor } from "lucide-react";

export function ThemeBuilder() {
  const [activePreset, setActivePreset] = useState("minimal");

  const presets = [
    { id: "minimal", label: "Clean Minimalist", desc: "Monochrome tones, high contrast, clean headers.", colors: ["#18181b", "#71717a"] },
    { id: "cyberpunk", label: "Neon Dark Cyber", desc: "Dark background, neon purple accents and gradients.", colors: ["#8b5cf6", "#ec4899"] },
    { id: "nature", label: "Forest Emerald", desc: "Earth tones, calm deep green accents.", colors: ["#059669", "#10b981"] },
  ];

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-650">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Workspace Preset Layouts
          </h3>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
            Quickly apply design systems preset palettes matching your brand tone.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {presets.map((p) => {
          const isActive = activePreset === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setActivePreset(p.id)}
              className={`p-4 border rounded-2xl cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-all flex flex-col justify-between h-36 ${
                isActive ? "border-zinc-900 dark:border-zinc-50" : "border-zinc-200 dark:border-zinc-850"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {p.label}
                  </span>
                  {isActive && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />}
                </div>
                <p className="text-[9px] text-zinc-450 leading-relaxed font-semibold">
                  {p.desc}
                </p>
              </div>

              {/* Color dots preview */}
              <div className="flex gap-2">
                {p.colors.map((c) => (
                  <div
                    key={c}
                    style={{ backgroundColor: c }}
                    className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-800"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
