"use client";

import { useState, useTransition } from "react";
import { savePluginSettingsAction } from "@/app/admin/actions";
import { Check, Loader2, Settings } from "lucide-react";

interface PluginSettingsProps {
  pluginId: string;
  pluginName: string;
  currentSettings: Record<string, string>;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export function PluginSettings({
  pluginId,
  pluginName,
  currentSettings,
  onClose,
  onSaveSuccess,
}: PluginSettingsProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>(currentSettings);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleFieldChange = (key: string, val: string) => {
    setFormValues({ ...formValues, [key]: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await savePluginSettingsAction(pluginId, formValues);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSaveSuccess();
        }, 1500);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-xl animate-in fade-in duration-200 text-left">
        <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-3">
          <div className="p-2 bg-zinc-900/5 dark:bg-zinc-50/5 text-zinc-650 dark:text-zinc-400 rounded-xl">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
              {pluginName} Settings
            </h3>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
              Customize extension parameters and options.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 p-2.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {Object.keys(formValues).map((key) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  required
                  value={formValues[key]}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-zinc-150 dark:border-zinc-900">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-zinc-250 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-400 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
