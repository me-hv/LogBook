"use client";

import { useEffect, useState, useTransition } from "react";
import { getTenantMembersListAction, inviteTenantMemberAction, removeTenantMemberAction } from "@/app/admin/actions";
import { Mail, Plus, Trash2, UserPlus, ShieldAlert, Loader2 } from "lucide-react";

export function TeamMembersTable() {
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("author");

  const loadMembers = () => {
    startTransition(async () => {
      const res = await getTenantMembersListAction();
      if (res.success && res.data) {
        setMembers(res.data.members || []);
        setInvitations(res.data.invitations || []);
      }
    });
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    startTransition(async () => {
      const res = await inviteTenantMemberAction(inviteEmail, inviteRole);
      if (res.success) {
        setInviteEmail("");
        loadMembers();
      }
    });
  };

  const handleRemove = (id: string) => {
    if (!confirm("Are you sure you want to remove this user from the workspace?")) return;

    startTransition(async () => {
      const res = await removeTenantMemberAction(id);
      if (res.success) {
        loadMembers();
      }
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Invite Member form box */}
      <div className="bg-white dark:bg-zinc-950/40 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl max-w-xl">
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="flex gap-2 items-center text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            <UserPlus className="w-4 h-4 text-zinc-400" />
            <span>Invite Collaborator</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-450 uppercase block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="developer@acme.com"
                className="block w-full px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>

            <div className="w-full sm:w-36 space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-450 uppercase block">
                Workspace Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="block w-full px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="author">Author</option>
                <option value="contributor">Contributor</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Send Invitation</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Members table */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">
          Active Collaborators
        </h4>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950/20">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Collaborator</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60 font-semibold">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                  <td className="px-5 py-3 flex items-center gap-3">
                    {m.image ? (
                      <img src={m.image} alt={m.name || ""} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center font-bold text-[10px]">
                        {(m.name || m.email).substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="text-zinc-900 dark:text-zinc-50 block">{m.name || "Pending User"}</span>
                      <span className="text-[10px] text-zinc-400 block">{m.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="uppercase text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {m.role !== "owner" && (
                      <button
                        onClick={() => handleRemove(m.id)}
                        disabled={isPending}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-rose-500 rounded-lg cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending invites */}
      {invitations.length > 0 && (
        <div className="space-y-4 pt-4">
          <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">
            Pending Invitations
          </h4>
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950/20 max-w-xl">
            <table className="w-full text-xs border-collapse">
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60 font-semibold">
                {invitations.map((i) => (
                  <tr key={i.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                    <td className="px-5 py-3 flex items-center gap-2 text-zinc-650 dark:text-zinc-400">
                      <Mail className="w-4 h-4 text-zinc-400" />
                      <span>{i.email}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="uppercase text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-105/50 text-zinc-500">
                        {i.role} (Pending)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
