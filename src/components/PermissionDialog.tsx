"use client";

import { ShieldAlert, Check, X } from "lucide-react";

interface PermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pluginName: string;
  permissions: string[];
}

export function PermissionDialog({
  isOpen,
  onClose,
  onConfirm,
  pluginName,
  permissions,
}: PermissionDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-xl animate-in fade-in duration-200 text-left">
        <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-3">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
              Review Extension Permissions
            </h3>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
              Confirm scopes access before activating.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-zinc-650 dark:text-zinc-405 leading-relaxed">
            The plugin <strong className="text-zinc-900 dark:text-zinc-50">"{pluginName}"</strong> requests permission to access the following capabilities in LogBook:
          </p>

          <div className="space-y-1.5 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-850">
            {permissions.map((perm) => (
              <div key={perm} className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-350">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                <span className="font-mono text-[10px]">{perm}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-zinc-450 dark:text-zinc-500 italic leading-relaxed">
            Only install plugins from sources you trust. Malicious plugins can leak data, modify settings, or execute malicious operations.
          </p>
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t border-zinc-150 dark:border-zinc-900">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 border border-zinc-250 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-400 text-xs font-bold cursor-pointer"
          >
            Deny Access
          </button>
          <button
            onClick={onConfirm}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer"
          >
            Grant & Install
          </button>
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
