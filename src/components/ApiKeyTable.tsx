"use client";

import { useEffect, useState, useTransition } from "react";
import { getApiKeysListAction, createApiKeyAction, revokeApiKeyAction } from "@/app/admin/actions";
import { Key, Copy, Check, Trash2, Plus, AlertCircle, X, ShieldAlert } from "lucide-react";

export function ApiKeyTable() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Create Key Form State
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState("read:posts");
  const [expiresInDays, setExpiresInDays] = useState("30");
  const [newKeyPlaintext, setNewKeyPlaintext] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadKeys = () => {
    startTransition(async () => {
      const res = await getApiKeysListAction();
      if (res.success) {
        setKeys(res.data || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      let expiresAt: Date | null = null;
      if (expiresInDays !== "never") {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays, 10));
      }

      const res = await createApiKeyAction(name, permissions, expiresAt);
      if (res.success && res.data) {
        setNewKeyPlaintext(res.data.rawToken);
        setName("");
        loadKeys();
      }
    });
  };

  const handleRevokeKey = (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? External applications using it will be blocked immediately.")) return;
    
    startTransition(async () => {
      const res = await revokeApiKeyAction(id);
      if (res.success) {
        loadKeys();
      }
    });
  };

  const copyToClipboard = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
        Loading API Tokens...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Personal Access Tokens
          </h3>
          <p className="text-xs text-zinc-500">
            Use these secret API keys to authenticate your requests against the LogBook headless endpoints.
          </p>
        </div>
        <button
          onClick={() => {
            setNewKeyPlaintext("");
            setShowCreateModal(true);
          }}
          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Token</span>
        </button>
      </div>

      {/* Warning showing raw token ONLY ONCE */}
      {newKeyPlaintext && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 p-5 rounded-2xl space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
            <Check className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Token Generated Successfully</span>
          </div>
          <p className="text-xs text-emerald-750 dark:text-emerald-400/80 leading-relaxed">
            Make sure to copy your personal access token now. You won't be able to see it again!
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={newKeyPlaintext}
              className="flex-1 px-3 py-1.5 border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-zinc-900 rounded-xl text-xs text-zinc-900 dark:text-zinc-50 font-mono focus:outline-none"
            />
            <button
              onClick={() => copyToClipboard(newKeyPlaintext)}
              className="px-3 py-1.5 border border-emerald-200 dark:border-emerald-900 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Keys list table */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950/20">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
              <th className="px-5 py-3">Token Name</th>
              <th className="px-5 py-3">Permissions</th>
              <th className="px-5 py-3">Expires At</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60 text-zinc-700 dark:text-zinc-350">
            {keys.length > 0 ? (
              keys.map((k) => (
                <tr key={k.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all font-semibold">
                  <td className="px-5 py-3 flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-900 dark:text-zinc-50">{k.name}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[9px] font-bold font-mono">
                      {k.permissions}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-500">
                    {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-5 py-3 text-zinc-500">
                    {new Date(k.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleRevokeKey(k.id)}
                      disabled={isPending}
                      className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-450 hover:text-rose-500 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      title="Revoke Token"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-450 italic">
                  No Personal Access Tokens found. Click "New Token" to generate one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Token Modal Overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                Generate Developer Token
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
                  Token Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Headless static site generator"
                  className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                  Permissions Scope
                </label>
                <select
                  value={permissions}
                  onChange={(e) => setPermissions(e.target.value)}
                  className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none cursor-pointer"
                >
                  <option value="read:posts">read:posts (Query posts, categories, tags)</option>
                  <option value="read:posts,write:posts">read:posts, write:posts (Create/edit content headless)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider block">
                  Expiration
                </label>
                <select
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(e.target.value)}
                  className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none cursor-pointer"
                >
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="never">Never Expire</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-zinc-150 dark:border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 border border-zinc-250 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-400 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
