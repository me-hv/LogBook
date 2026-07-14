"use client";

import { useEffect, useState, useTransition } from "react";
import { getPluginsListAction, installPluginAction } from "@/app/admin/actions";
import { PLUGINS_REGISTRY, PluginInfo } from "@/lib/plugins-registry";
import { PluginCard } from "./PluginCard";
import { InstalledPluginsTable } from "./InstalledPluginsTable";
import { PermissionDialog } from "./PermissionDialog";
import { PluginSettings } from "./PluginSettings";
import { Search, Loader2, Sparkles, Sliders } from "lucide-react";

export function PluginMarketplace() {
  const [activeTab, setActiveTab] = useState<"explore" | "installed">("explore");
  const [installed, setInstalled] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Dialog States
  const [selectedPlugin, setSelectedPlugin] = useState<PluginInfo | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  // Settings Edit States
  const [editPluginId, setEditPluginId] = useState("");
  const [editPluginName, setEditPluginName] = useState("");
  const [editPluginSettings, setEditPluginSettings] = useState<Record<string, string>>({});
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const loadInstalledPlugins = () => {
    startTransition(async () => {
      const res = await getPluginsListAction();
      if (res.success) {
        setInstalled(res.data || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadInstalledPlugins();
  }, []);

  const handleInstallTrigger = (plugin: PluginInfo) => {
    setSelectedPlugin(plugin);
    setShowPermissionDialog(true);
  };

  const handleConfirmInstall = () => {
    if (!selectedPlugin) return;
    setShowPermissionDialog(false);

    startTransition(async () => {
      const res = await installPluginAction(selectedPlugin.id);
      if (res.success) {
        loadInstalledPlugins();
        setSelectedPlugin(null);
      }
    });
  };

  const handleOpenConfigure = (pluginId: string, name: string, settings: any) => {
    setEditPluginId(pluginId);
    setEditPluginName(name);
    setEditPluginSettings(settings || {});
    setShowSettingsDialog(true);
  };

  // Filter explore list based on search bar query
  const filteredExploreList = PLUGINS_REGISTRY.filter((plugin) => {
    const matchesQuery =
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 text-zinc-900 dark:text-zinc-550 animate-spin" />
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Connecting to Extension Registry...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left flex-1">
      {/* Search & Tabs control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        {/* Tab switchers */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("explore")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "explore"
                ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                : "text-zinc-550 hover:bg-zinc-150 dark:hover:bg-zinc-900"
            }`}
          >
            Explore Plugins
          </button>
          <button
            onClick={() => setActiveTab("installed")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "installed"
                ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                : "text-zinc-550 hover:bg-zinc-150 dark:hover:bg-zinc-900"
            }`}
          >
            Installed ({installed.length})
          </button>
        </div>

        {/* Search Input filter */}
        {activeTab === "explore" && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search marketplace..."
              className="block w-full pl-9 pr-4 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
            />
          </div>
        )}
      </div>

      {activeTab === "explore" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExploreList.length > 0 ? (
            filteredExploreList.map((p) => {
              const matchedInstalled = installed.find((inst) => inst.id === p.id);
              return (
                <PluginCard
                  key={p.id}
                  plugin={p}
                  isInstalled={!!matchedInstalled}
                  isEnabled={matchedInstalled ? matchedInstalled.enabled : false}
                  onInstall={handleInstallTrigger}
                  onConfigure={() =>
                    handleOpenConfigure(p.id, p.name, matchedInstalled?.settings)
                  }
                />
              );
            })
          ) : (
            <div className="sm:col-span-2 lg:col-span-3 py-16 text-center text-zinc-450 italic">
              No matching extensions found. Try adjusting keywords parameters.
            </div>
          )}
        </div>
      ) : (
        <InstalledPluginsTable
          installed={installed}
          onReload={loadInstalledPlugins}
          onOpenSettings={handleOpenConfigure}
        />
      )}

      {/* Permissions Check Modal */}
      <PermissionDialog
        isOpen={showPermissionDialog}
        onClose={() => {
          setShowPermissionDialog(false);
          setSelectedPlugin(null);
        }}
        onConfirm={handleConfirmInstall}
        pluginName={selectedPlugin?.name || ""}
        permissions={selectedPlugin?.permissions || []}
      />

      {/* Settings Modal */}
      {showSettingsDialog && (
        <PluginSettings
          pluginId={editPluginId}
          pluginName={editPluginName}
          currentSettings={editPluginSettings}
          onClose={() => setShowSettingsDialog(false)}
          onSaveSuccess={() => {
            setShowSettingsDialog(false);
            loadInstalledPlugins();
          }}
        />
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
