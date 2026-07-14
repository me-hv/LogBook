"use client";

import { useTransition } from "react";
import { togglePluginAction, uninstallPluginAction } from "@/app/admin/actions";
import { Cpu, Settings2, Trash2, ShieldAlert } from "lucide-react";

interface InstalledPluginsTableProps {
  installed: any[];
  onReload: () => void;
  onOpenSettings: (pluginId: string, name: string, settings: any) => void;
}

export function InstalledPluginsTable({
  installed,
  onReload,
  onOpenSettings,
}: InstalledPluginsTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleEnable = (id: string) => {
    startTransition(async () => {
      const res = await togglePluginAction(id);
      if (res.success) {
        onReload();
      }
    });
  };

  const handleUninstall = (id: string) => {
    if (!confirm("Are you sure you want to uninstall this extension? All configuration settings will be deleted.")) return;

    startTransition(async () => {
      const res = await uninstallPluginAction(id);
      if (res.success) {
        onReload();
      }
    });
  };

  return (
    <div className="space-y-4 text-left">
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950/20">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
              <th className="px-5 py-3">Extension Name</th>
              <th className="px-5 py-3">Installed Version</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Last Updated</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60 text-zinc-700 dark:text-zinc-350">
            {installed.length > 0 ? (
              installed.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all font-semibold">
                  <td className="px-5 py-3 flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="text-zinc-900 dark:text-zinc-50 block">{p.name}</span>
                      <span className="text-[9px] text-zinc-450 block italic">id: {p.id}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-zinc-500">v{p.version}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        p.enabled
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
                      }`}
                    >
                      {p.enabled ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-550">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right space-x-1">
                    <button
                      onClick={() => handleToggleEnable(p.id)}
                      disabled={isPending}
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide cursor-pointer transition-all border ${
                        p.enabled
                          ? "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                          : "bg-zinc-900 text-zinc-50 border-transparent hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      }`}
                    >
                      {p.enabled ? "Disable" : "Enable"}
                    </button>
                    
                    <button
                      onClick={() => onOpenSettings(p.id, p.name, p.settings)}
                      className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                      title="Plugin Settings"
                    >
                      <Settings2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleUninstall(p.id)}
                      disabled={isPending}
                      className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                      title="Uninstall Extension"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-450 italic">
                  No extensions currently installed. Head over to the Marketplace tab to browse extensions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
