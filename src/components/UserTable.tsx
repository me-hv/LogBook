"use client";

import { useState, useTransition } from "react";
import { toggleUserSuspension, deleteUserAction } from "@/app/admin/actions";
import { RoleSelector } from "./RoleSelector";
import { Search, ShieldAlert, Loader2, Ban, Trash2 } from "lucide-react";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface UserTableProps {
  initialUsers: UserItem[];
  currentUserRole: string;
  currentUserId: string;
  onRefresh: () => void;
}

export function UserTable({ initialUsers, currentUserRole, currentUserId, onRefresh }: UserTableProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = initialUsers.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggleSuspend = (id: string) => {
    startTransition(async () => {
      const res = await toggleUserSuspension(id);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.error || "Failed to modify user status");
      }
    });
  };

  const handleDeleteUser = (id: string) => {
    startTransition(async () => {
      const res = await deleteUserAction(id);
      if (res.success) {
        setDeleteId(null);
        onRefresh();
      } else {
        alert(res.error || "Failed to delete user profile");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Header controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users name or email..."
            className="block w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
          />
        </div>
      </div>

      {/* Grid details */}
      <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
              <th className="px-5 py-3">User Profile</th>
              <th className="px-5 py-3">Assigned Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Registered Date</th>
              <th className="px-5 py-3 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60 text-zinc-700 dark:text-zinc-350">
            {filtered.length > 0 ? (
              filtered.map((user) => {
                const isSelf = user.id === currentUserId;
                const canModify =
                  !isSelf &&
                  (currentUserRole === "superadmin" ||
                    (currentUserRole === "admin" && user.role !== "superadmin"));

                return (
                  <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all">
                    <td className="px-5 py-3 select-text">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {user.name || "Anonymous User"} {isSelf && "(You)"}
                      </div>
                      <div className="text-[10px] text-zinc-400">{user.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      <RoleSelector
                        userId={user.id}
                        currentRole={user.role}
                        currentUserRole={currentUserRole}
                        onSuccess={onRefresh}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          user.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right space-x-1">
                      {canModify && (
                        <>
                          <button
                            onClick={() => handleToggleSuspend(user.id)}
                            disabled={isPending}
                            className={`p-1.5 rounded-lg hover:bg-zinc-500/5 transition-colors cursor-pointer inline-flex ${
                              user.status === "suspended"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                            title={user.status === "suspended" ? "Unsuspend user" : "Suspend user"}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(user.id)}
                            disabled={isPending}
                            className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/5 transition-colors cursor-pointer inline-flex"
                            title="Delete User account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-400 italic">
                  No collaboration profiles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete User Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Delete User Account</h3>
              <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-455 leading-relaxed">
                Are you sure you want to permanently delete this user account? All posts, comments, and revisions created by this author will be scrubbed.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-650 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(deleteId)}
                disabled={isPending}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
