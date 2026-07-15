"use client";

import { PageHeader } from "@/components/PageHeader";
import { TeamMembersTable } from "@/components/TeamMembersTable";

export default function WorkspaceTeamPage() {
  return (
    <div className="space-y-8 flex-1">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Team Collaborators"
          description="Invite other authors, editors, and contributors to write and manage content on your publication."
        />
      </div>

      <TeamMembersTable />
    </div>
  );
}
export const dynamic = "force-dynamic";
