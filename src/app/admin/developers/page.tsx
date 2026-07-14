"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DeveloperSidebar } from "@/components/DeveloperSidebar";
import { ApiKeyTable } from "@/components/ApiKeyTable";
import { WebhookManager } from "@/components/WebhookManager";
import { IntegrationCard } from "@/components/IntegrationCard";
import { ApiUsageChart } from "@/components/ApiUsageChart";

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState("keys");

  return (
    <div className="space-y-8 flex-1">
      {/* Page Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Developer Settings"
          description="Manage developer access tokens, configure real-time outbound webhooks, and customize Discord or Slack integration announcements."
        />
      </div>

      {/* Main Split Grid Workspace */}
      <div className="grid md:grid-cols-[260px_1fr] items-start gap-8">
        <DeveloperSidebar activeTab={activeTab} onChangeTab={setActiveTab} />
        
        <div className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-850 p-6 sm:p-8 rounded-3xl min-h-[300px]">
          {activeTab === "keys" && <ApiKeyTable />}
          {activeTab === "webhooks" && <WebhookManager />}
          {activeTab === "integrations" && <IntegrationCard />}
          {activeTab === "monitoring" && <ApiUsageChart />}
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
