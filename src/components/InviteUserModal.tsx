"use client";

import { useState, useTransition } from "react";
import { inviteUserAction } from "@/app/admin/actions";
import { Mail, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = [
  { key: "contributor", label: "Contributor (Drafts only)" },
  { key: "author", label: "Author (Create, edit, & publish own)" },
  { key: "editor", label: "Editor (Edit & publish all)" },
  { key: "admin", label: "Admin (Manage users & settings)" },
];

export function InviteUserModal({ isOpen, onClose, onSuccess }: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("author");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    startTransition(async () => {
      const res = await inviteUserAction(email, role);
      if (res.success) {
        setSuccess(`Invitation email successfully dispatched to ${email}!`);
        setEmail("");
        setTimeout(() => {
          onSuccess();
          onClose();
          setSuccess("");
        }, 2000);
      } else {
        setError(res.error || "Failed to invite collaborator");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-6 animate-in zoom-in-95 duration-200 relative text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">
            Invite Team Member
          </h3>
          <p className="text-xs text-zinc-550 dark:text-zinc-450 leading-relaxed">
            Send an email invitation link to join your publishing workflow.
          </p>
        </div>

        <form onSubmit={handleInvite} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                placeholder="collaborator@example.com"
                className="block w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all disabled:opacity-60"
                required
              />
            </div>
          </div>

          {/* Role select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
              Assigned Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isPending}
              className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all cursor-pointer disabled:opacity-60"
            >
              {ROLES.map((r) => (
                <option key={r.key} value={r.key} className="dark:bg-zinc-950">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-xs font-bold hover:bg-zinc-850 dark:hover:bg-zinc-200 transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sending invite email...</span>
              </>
            ) : (
              <span>Send Invitation</span>
            )}
          </button>

          {/* Feedback states */}
          {success && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium">
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
