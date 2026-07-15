"use client";

import { useEffect, useState, useTransition } from "react";
import { checkAppInstalledAction, installMarketplaceAppAction, uninstallMarketplaceAppAction } from "@/app/admin/actions";
import { Loader2, Download, Trash2, Check } from "lucide-react";

interface InstallButtonProps {
  appId: string;
  onStateChange?: () => void;
}

export function InstallButton({ appId, onStateChange }: InstallButtonProps) {
  const [installed, setInstalled] = useState(false);
  const [isPending, startTransition] = useTransition();

  const checkStatus = () => {
    startTransition(async () => {
      const res = await checkAppInstalledAction(appId);
      if (res.success) {
        setInstalled(res.installed);
      }
    });
  };

  useEffect(() => {
    checkStatus();
  }, [appId]);

  const handleToggle = () => {
    startTransition(async () => {
      if (installed) {
        const res = await uninstallMarketplaceAppAction(appId);
        if (res.success) {
          setInstalled(false);
          onStateChange?.();
        } else {
          alert(res.error || "Failed to uninstall.");
        }
      } else {
        const res = await installMarketplaceAppAction(appId);
        if (res.success) {
          setInstalled(true);
          onStateChange?.();
        } else {
          alert(res.error || "Failed to install.");
        }
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
        installed
          ? "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20"
          : "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 border-transparent"
      }`}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : installed ? (
        <Trash2 className="w-3.5 h-3.5" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      <span>{installed ? "Uninstall Extension" : "Install to Workspace"}</span>
    </button>
  );
}
export const dynamic = "force-dynamic";
