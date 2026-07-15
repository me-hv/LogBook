"use client";

import { useState } from "react";
import { AuditLogTable } from "./AuditLogTable";
import { SessionManager } from "./SessionManager";
import { RoleEditor } from "./RoleEditor";
import { ApprovalWorkflowBuilder } from "./ApprovalWorkflowBuilder";
import { MFASettings } from "./MFASettings";
import { ShieldCheck, Users, Key, Settings, Cpu } from "lucide-react";

export function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState<"logs" | "sessions" | "rbac" | "workflows" | "mfa">("logs");

  const tabs = [
    { id: "logs", label: "Audit Trails", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "sessions", label: "Active Sessions", icon: <Key className="w-4 h-4" /> },
    { id: "rbac", label: "RBAC Custom Roles", icon: <Users className="w-4 h-4" /> },
    { id: "workflows", label: "Editorial Workflow", icon: <Cpu className="w-4 h-4" /> },
    { id: "mfa", label: "MFA Settings", icon: <Settings className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-6 text-left flex-1">
      {/* Tab controls */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                : "text-zinc-550 hover:bg-zinc-150 dark:hover:bg-zinc-900"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab bodies */}
      <div className="space-y-6">
        {activeTab === "logs" && <AuditLogTable />}
        {activeTab === "sessions" && <SessionManager />}
        {activeTab === "rbac" && <RoleEditor />}
        {activeTab === "workflows" && <ApprovalWorkflowBuilder />}
        {activeTab === "mfa" && <MFASettings />}
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
