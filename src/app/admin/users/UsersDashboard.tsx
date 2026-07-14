"use client";

import { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/PageHeader";
import { UserTable } from "@/components/UserTable";
import { InviteUserModal } from "@/components/InviteUserModal";
import { getUsersList } from "../actions";
import { authClient } from "@/lib/auth-client";
import { UserPlus, Loader2 } from "lucide-react";

export function UsersDashboard() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadUsers = () => {
    startTransition(async () => {
      const res = await getUsersList();
      if (res.success) {
        setUsers(res.data || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="w-8 h-8 text-zinc-900 dark:text-zinc-550 animate-spin" />
        <span className="text-xs font-semibold text-zinc-550 dark:text-zinc-500 uppercase tracking-wider">
          Loading collaboration team list...
        </span>
      </div>
    );
  }

  const currentUser = session?.user;

  return (
    <div className="space-y-8 flex-1">
      {/* Header with Invite trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 gap-4">
        <PageHeader
          title="Team & Collaboration"
          description="Manage user roles, invite new writers, or suspend accounts from a single workspace."
        />
        <button
          onClick={() => setIsInviteOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Collaborator</span>
        </button>
      </div>

      {/* Main Table view */}
      {currentUser && (
        <UserTable
          initialUsers={users}
          currentUserRole={currentUser.role || "author"}
          currentUserId={currentUser.id}
          onRefresh={loadUsers}
        />
      )}

      {/* Invite user modal overlay */}
      <InviteUserModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={loadUsers}
      />
    </div>
  );
}
