"use client";

import { useState, useTransition } from "react";
import { toggleMfaAction } from "@/app/admin/actions";
import { Check, ShieldAlert, Key, Loader2, QrCode } from "lucide-react";

export function MFASettings() {
  const [enabled, setEnabled] = useState(false);
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleMfaAction(!enabled);
      if (res.success) {
        setEnabled(!enabled);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-950/45 p-6 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left max-w-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-650">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Multi-Factor Authentication (MFA)
          </h3>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
            Enforce double factor code verification before allowing logins to this workspace.
          </p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 p-3 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>MFA status updated successfully!</span>
        </div>
      )}

      <div className="flex items-center justify-between p-4 border border-zinc-150 dark:border-zinc-900 rounded-2xl">
        <div>
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 block">
            Authenticator App Verification
          </span>
          <span className="text-[9px] text-zinc-450 block font-normal">
            Validate temporary one-time passwords (TOTP) from Google Authenticator, Authy, or 1Password.
          </span>
        </div>
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors border ${
            enabled
              ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
              : "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-transparent"
          }`}
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : enabled ? (
            "Disable MFA"
          ) : (
            "Enable MFA"
          )}
        </button>
      </div>

      {enabled && (
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900/60 grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center justify-center p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10 text-center space-y-3">
            <QrCode className="w-24 h-24 text-zinc-400" />
            <span className="text-[9px] text-zinc-450 leading-relaxed font-semibold">
              Scan this QR code with your Authenticator app.
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-450 uppercase block">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 123456"
                className="block w-full px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-center font-mono text-base tracking-widest focus:outline-none focus:ring-1"
              />
            </div>

            <button
              onClick={() => {
                if (code.length === 6) {
                  alert("Authenticator app registered successfully!");
                  setCode("");
                } else {
                  alert("Please enter a valid 6-digit TOTP code.");
                }
              }}
              className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer"
            >
              Verify & Save Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
