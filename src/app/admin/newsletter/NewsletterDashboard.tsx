"use client";

import { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { SubscriberGrowthChart } from "@/components/SubscriberGrowthChart";
import { NewsletterEditor } from "@/components/NewsletterEditor";
import { getNewsletterStats } from "../actions";
import { Users, UserCheck, UserMinus, Percent, MailOpen, MousePointerClick, Loader2 } from "lucide-react";

export function NewsletterDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadStats = () => {
    startTransition(async () => {
      const res = await getNewsletterStats();
      if (res.success) {
        setStats(res.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="w-8 h-8 text-zinc-900 dark:text-zinc-50 animate-spin" />
        <span className="text-xs font-semibold text-zinc-550 dark:text-zinc-500 uppercase tracking-wider">
          Loading newsletter dashboard details...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex-1">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Newsletter Campaigns"
          description="Send email alerts, compile text layouts, and track newsletter acquisition metrics."
        />
      </div>

      {/* Summary Analytics Cards grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Subscribers"
          value={stats?.total || 0}
          subtext="total historical signups"
          icon={<Users className="w-4.5 h-4.5" />}
        />
        <AnalyticsCard
          title="Active List size"
          value={stats?.active || 0}
          subtext="receiving email campaigns"
          icon={<UserCheck className="w-4.5 h-4.5" />}
        />
        <AnalyticsCard
          title="Open Rate"
          value={stats?.openRate || "0%"}
          subtext="average email opens"
          icon={<MailOpen className="w-4.5 h-4.5" />}
        />
        <AnalyticsCard
          title="Click Rate"
          value={stats?.clickRate || "0%"}
          subtext="click-through percentage"
          icon={<MousePointerClick className="w-4.5 h-4.5" />}
        />
      </div>

      {/* Charts & growth dynamics */}
      <div className="grid gap-6 items-start">
        <SubscriberGrowthChart data={stats?.growthData || []} />
      </div>

      {/* Campaign editor card */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">
            Publish Campaign
          </h3>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            Compose and draft custom announcements or digests for active lists.
          </p>
        </div>
        <NewsletterEditor />
      </div>
    </div>
  );
}
