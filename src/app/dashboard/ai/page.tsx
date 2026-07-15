"use client";

import { PageHeader } from "@/components/PageHeader";
import { AIAgentDashboard } from "@/components/AIAgentDashboard";

export default function WorkspaceAIAgentPage() {
  return (
    <div className="space-y-8 flex-1">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Autonomous AI Publishing Agents"
          description="Trigger background outline generation jobs, check spelling & brand voice readabilities, and analyze traffic query trends."
        />
      </div>

      <AIAgentDashboard />
    </div>
  );
}
export const dynamic = "force-dynamic";
