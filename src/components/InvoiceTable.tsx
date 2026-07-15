"use client";

import { useEffect, useState, useTransition } from "react";
import { getInvoiceHistoryAction } from "@/app/admin/actions";
import { Receipt, Download, Loader2 } from "lucide-react";

export function InvoiceTable() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getInvoiceHistoryAction();
      if (res.success && res.data) {
        setInvoices(res.data);
      }
    });
  }, []);

  return (
    <div className="space-y-4 text-left">
      <h3 className="text-xs font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
        Billing & Invoices History
      </h3>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950/20">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
              <th className="px-5 py-3">Date Issued</th>
              <th className="px-5 py-3">Invoice Reference</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60 text-zinc-700 dark:text-zinc-350 font-semibold">
            {isPending ? (
              <tr>
                <td colSpan={5} className="py-8 text-center">
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-450 mx-auto" />
                </td>
              </tr>
            ) : invoices.length > 0 ? (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                  <td className="px-5 py-3">{inv.issuedAt}</td>
                  <td className="px-5 py-3 text-zinc-450 text-[10px] font-mono">{inv.stripeInvoiceId || inv.id}</td>
                  <td className="px-5 py-3">
                    {inv.currency} {inv.amount}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        inv.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-50 rounded-lg cursor-pointer"
                      title="Download Invoice PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-450 italic">
                  No billing invoices generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
