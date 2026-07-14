"use client";

import { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SubscriberTable } from "@/components/SubscriberTable";
import { getSubscriberList } from "../actions";
import { Loader2 } from "lucide-react";

export function SubscriberManager() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadSubscribers = () => {
    startTransition(async () => {
      const res = await getSubscriberList();
      if (res.success) {
        setSubscribers(res.data || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="w-8 h-8 text-zinc-900 dark:text-zinc-50 animate-spin" />
        <span className="text-xs font-semibold text-zinc-555 dark:text-zinc-500 uppercase tracking-wider">
          Loading subscribers database...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex-1">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Subscriber Management"
          description="View, search, filter, and manage subscribers. Export active lists in CSV format."
        />
        {isPending && <Loader2 className="w-4 h-4 text-zinc-550 animate-spin" />}
      </div>

      {/* Main Subscriber Table */}
      <SubscriberTable
        initialSubscribers={subscribers}
        onRefresh={loadSubscribers}
      />
    </div>
  );
}
