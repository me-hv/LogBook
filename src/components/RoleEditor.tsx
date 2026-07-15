"use client";

import { useState } from "react";
import { ShieldAlert, Check, Shield } from "lucide-react";

export function RoleEditor() {
  const [activeRole, setActiveRole] = useState("ADMIN");
  const [scopes, setScopes] = useState<Record<string, Record<string, boolean>>>({
    SUPERADMIN: { "posts.read": true, "posts.write": true, "users.manage": true, "settings.write": true, "plugins.manage": true },
    ADMIN: { "posts.read": true, "posts.write": true, "users.manage": true, "settings.write": true, "plugins.manage": false },
    EDITOR: { "posts.read": true, "posts.write": true, "users.manage": false, "settings.write": false, "plugins.manage": false },
    AUTHOR: { "posts.read": true, "posts.write": false, "users.manage": false, "settings.write": false, "plugins.manage": false },
  });

  const handleToggleScope = (role: string, scopeKey: string) => {
    if (role === "SUPERADMIN") return; // enforce invariant check
    setScopes({
      ...scopes,
      [role]: {
        ...scopes[role],
        [scopeKey]: !scopes[role]?.[scopeKey],
      },
    });
  };

  const scopeKeys = [
    { key: "posts.read", label: "Read Publications", desc: "View all articles, revisions and drafts." },
    { key: "posts.write", label: "Publish & Edit Publications", desc: "Publish, update and delete posts." },
    { key: "users.manage", label: "Manage Workspace Members", desc: "Invite members and change roles." },
    { key: "settings.write", label: "Write Workspace settings", desc: "Change branding and custom domains." },
    { key: "plugins.manage", label: "Manage plugins marketplace", desc: "Install and toggle extensions." },
  ];

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-650">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-550 uppercase tracking-wider">
            RBAC Custom Roles Scopes
          </h3>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
            Define fine-grained permission boundaries for default roles inside your workspace.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Role listing */}
        <div className="space-y-1.5 border-r border-zinc-200 dark:border-zinc-900 pr-4">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            Default Roles
          </span>
          {Object.keys(scopes).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer block ${
                activeRole === role
                  ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                  : "text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Scope configurations */}
        <div className="sm:col-span-2 space-y-4">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
            Scope Mapping Configuration — <strong className="text-zinc-700 dark:text-zinc-300 font-mono">{activeRole}</strong>
          </span>

          <div className="space-y-2.5">
            {scopeKeys.map((s) => {
              const isAllowed = !!scopes[activeRole]?.[s.key];
              return (
                <div
                  key={s.key}
                  className="flex items-center justify-between p-3 border border-zinc-150 dark:border-zinc-900 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10"
                >
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 block">
                      {s.label}
                    </span>
                    <span className="text-[9px] text-zinc-450 block font-normal leading-relaxed">
                      {s.desc}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleScope(activeRole, s.key)}
                    disabled={activeRole === "SUPERADMIN"}
                    className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide cursor-pointer transition-colors border ${
                      isAllowed
                        ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-transparent"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {isAllowed ? "Allowed" : "Disabled"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
