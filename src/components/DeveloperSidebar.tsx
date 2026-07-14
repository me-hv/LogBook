"use client";

import { Key, Webhook, Cpu, BarChart2 } from "lucide-react";

interface DeveloperSidebarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export function DeveloperSidebar({ activeTab, onChangeTab }: DeveloperSidebarProps) {
  const tabs = [
    { id: "keys", label: "API Keys", icon: Key },
    { id: "webhooks", label: "Webhooks", icon: Webhook },
    { id: "integrations", label: "Third-party Integrations", icon: Cpu },
    { id: "monitoring", label: "API Monitoring", icon: BarChart2 },
  ];

  return (
    <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 space-y-4">
      <div>
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          Developer Workspace
        </h3>
        <p className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-relaxed">
          Expose your content headless, configure outbound webhooks, and connect Discord/Slack notifications.
        </p>
      </div>

      <div className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                  : "text-zinc-550 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
