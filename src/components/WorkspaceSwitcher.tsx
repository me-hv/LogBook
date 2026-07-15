"use client";

import { useEffect, useState, useTransition } from "react";
import { getTenantsListAction, switchActiveTenantAction, createTenantAction } from "@/app/admin/actions";
import { ChevronDown, Plus, Globe, Check, PlusCircle, LayoutGrid, X } from "lucide-react";

export function WorkspaceSwitcher() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [activeTenant, setActiveTenant] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Create Workspace Form State
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const loadWorkspaces = () => {
    startTransition(async () => {
      const res = await getTenantsListAction();
      if (res.success && res.data) {
        setTenants(res.data);
        // Look up cookie or set first as default
        const activeId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("logbook_active_tenant="))
          ?.split("=")[1];
        
        const active = res.data.find((t: any) => t.id === activeId) || res.data[0];
        setActiveTenant(active);
      }
    });
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const handleSwitchWorkspace = (id: string) => {
    startTransition(async () => {
      const res = await switchActiveTenantAction(id);
      if (res.success) {
        setIsOpen(false);
        window.location.reload();
      }
    });
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) return;

    startTransition(async () => {
      const res = await createTenantAction(newName, newSlug);
      if (res.success) {
        setNewName("");
        setNewSlug("");
        setShowCreateModal(false);
        window.location.reload();
      }
    });
  };

  return (
    <div className="relative text-left z-20 select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-xs font-bold text-zinc-900 dark:text-zinc-50 cursor-pointer"
      >
        <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
        <span>{activeTenant?.name || "Loading Workspace..."}</span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl shadow-xl p-2.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider px-2.5 py-1.5">
            Switch Workspace
          </div>

          <div className="max-h-40 overflow-y-auto space-y-0.5 pr-0.5">
            {tenants.map((t) => {
              const isSelected = t.id === activeTenant?.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSwitchWorkspace(t.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                      : "text-zinc-550 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <span className="truncate">{t.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-900/60 pt-1.5 mt-1.5">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowCreateModal(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-zinc-550 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-left cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-zinc-400" />
              <span>New Workspace</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-900/60 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-550 uppercase tracking-wider">
                Create Workspace
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                  Subdomain URL Slug
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="acme"
                    className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 flex-grow"
                  />
                  <div className="flex items-center px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-450 font-semibold font-mono">
                    .logbook.app
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-zinc-150 dark:border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 border border-zinc-250 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-400 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
