"use client";

import { PluginInfo } from "@/lib/plugins-registry";
import { Cpu, ShieldCheck, HelpCircle } from "lucide-react";

interface PluginCardProps {
  plugin: PluginInfo;
  isInstalled: boolean;
  isEnabled: boolean;
  onInstall: (plugin: PluginInfo) => void;
  onConfigure: () => void;
}

export function PluginCard({
  plugin,
  isInstalled,
  isEnabled,
  onInstall,
  onConfigure,
}: PluginCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-950/40 p-5 border border-zinc-200 dark:border-zinc-850 rounded-2xl flex flex-col justify-between shadow-sm space-y-4 text-left">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-650 dark:text-zinc-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                {plugin.name}
              </h4>
              <span className="text-[9px] text-zinc-450 dark:text-zinc-500 block">
                by {plugin.author} • v{plugin.version}
              </span>
            </div>
          </div>

          {isInstalled && (
            <span
              className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                isEnabled
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
              }`}
            >
              {isEnabled ? "Active" : "Disabled"}
            </span>
          )}
        </div>

        <p className="text-[11px] text-zinc-550 dark:text-zinc-400 leading-relaxed min-h-[44px]">
          {plugin.description}
        </p>

        {/* Permissions details list */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900/60 space-y-1">
          <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Requested Scopes</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {plugin.permissions.map((p) => (
              <span
                key={p}
                className="px-1.5 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-850 text-zinc-600 dark:text-zinc-400 font-mono text-[8px]"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        {isInstalled ? (
          <button
            onClick={onConfigure}
            className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-400 text-xs font-bold transition-colors cursor-pointer"
          >
            Configure Plugin
          </button>
        ) : (
          <button
            onClick={() => onInstall(plugin)}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Install Extension
          </button>
        )}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
