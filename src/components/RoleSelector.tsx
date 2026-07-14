"use client";

import { useTransition } from "react";
import { updateUserRole } from "@/app/admin/actions";

interface RoleSelectorProps {
  userId: string;
  currentRole: string;
  currentUserRole: string;
  onSuccess: () => void;
}

const ROLES = [
  { key: "contributor", label: "Contributor" },
  { key: "author", label: "Author" },
  { key: "editor", label: "Editor" },
  { key: "admin", label: "Admin" },
  { key: "superadmin", label: "Super Admin" },
];

export function RoleSelector({ userId, currentRole, currentUserRole, onSuccess }: RoleSelectorProps) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRole = e.target.value;
    if (nextRole === currentRole) return;

    if (!confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) {
      e.target.value = currentRole;
      return;
    }

    startTransition(async () => {
      const res = await updateUserRole(userId, nextRole);
      if (res.success) {
        onSuccess();
      } else {
        alert(res.error || "Failed to update role");
        e.target.value = currentRole;
      }
    });
  };

  // Only admins and superadmins can modify roles. Only superadmins can assign superadmin.
  const isSuperAdmin = currentUserRole === "superadmin";
  const isAdmin = currentUserRole === "admin";
  const disabled = !isSuperAdmin && !isAdmin;

  return (
    <select
      value={currentRole}
      onChange={handleRoleChange}
      disabled={isPending || disabled}
      className="bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer disabled:opacity-60"
    >
      {ROLES.map((role) => {
        // Prevent admins from assigning superadmin
        if (role.key === "superadmin" && !isSuperAdmin) return null;
        return (
          <option key={role.key} value={role.key} className="dark:bg-zinc-950">
            {role.label}
          </option>
        );
      })}
    </select>
  );
}
