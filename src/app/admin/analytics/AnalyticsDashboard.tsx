"use client";

import { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { ViewsChart } from "@/components/ViewsChart";
import { DeviceChart } from "@/components/DeviceChart";
import { TrafficSourceTable } from "@/components/TrafficSourceTable";
import { GeographyMap } from "@/components/GeographyMap";
import { PopularPostsTable } from "@/components/PopularPostsTable";
import { getAnalyticsData } from "../actions";
import { BarChart3, Eye, Users, FileText, Clock, Award, Loader2 } from "lucide-react";

export function AnalyticsDashboard() {
  const [range, setRange] = useState("30days");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadAnalytics = (timeRange: string) => {
    if (!data) setLoading(true);
    startTransition(async () => {
      const res = await getAnalyticsData(timeRange);
      if (res.success) {
        setData(res.data);
      } else {
        console.error("Failed to load analytics:", res.error);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadAnalytics(range);
  }, [range]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="w-8 h-8 text-zinc-900 dark:text-zinc-50 animate-spin" />
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-450 uppercase tracking-wider">
          Loading metrics details...
        </span>
      </div>
    );
  }

  const cards = data?.cards || {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    uniqueVisitors: 0,
    weeklyViews: 0,
    monthlyViews: 0,
    avgReadingTime: 0,
    mostPopularPost: "None",
  };

  return (
    <div className="space-y-8 flex-1">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Content Analytics"
          description="Analyze post pageviews, reader acquisition channels, geographic distributions, and performance trends."
        />
        <div className="flex items-center gap-3">
          {isPending && <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />}
          <DateRangeSelector value={range} onChange={setRange} />
        </div>
      </div>

      {/* Analytics summary cards grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Pageviews"
          value={cards.totalViews}
          subtext="views in selected period"
          icon={<Eye className="w-4.5 h-4.5" />}
          trend="up"
          trendValue="Live"
        />
        <AnalyticsCard
          title="Unique Sessions"
          value={cards.uniqueVisitors}
          subtext="distinct readers today"
          icon={<Users className="w-4.5 h-4.5" />}
        />
        <AnalyticsCard
          title="Total Publications"
          value={`${cards.publishedPosts} / ${cards.totalPosts}`}
          subtext={`${cards.draftPosts} draft articles pending`}
          icon={<FileText className="w-4.5 h-4.5" />}
        />
        <AnalyticsCard
          title="Average Reading Time"
          value={`${cards.avgReadingTime}m`}
          subtext="estimated length per article"
          icon={<Clock className="w-4.5 h-4.5" />}
        />
      </div>

      {/* Main Charts & Acquisition breakdown */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px] items-start">
        <ViewsChart data={data?.chartData || []} />
        <DeviceChart data={data?.deviceData || []} />
      </div>

      {/* Traffic Sources & Detailed referral stats */}
      <TrafficSourceTable
        sources={data?.trafficData || []}
        referrers={data?.referrerData || []}
      />

      {/* Country & City insights */}
      <GeographyMap
        countries={data?.countryData || []}
        cities={data?.cityData || []}
      />

      {/* Popular Post Table lists */}
      <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Award className="w-5 h-5 text-zinc-450" />
            <span>Post Performance Leaderboards</span>
          </h3>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            Compare your best performing articles against low-engagement ones.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <PopularPostsTable
            title="Most Popular Articles"
            description="Highly read publications."
            posts={data?.performance?.mostViewed || []}
          />
          <PopularPostsTable
            title="Recently Published"
            description="Lately released articles."
            posts={data?.performance?.recentlyPublished || []}
          />
          <PopularPostsTable
            title="Lowest Engagement"
            description="Least read publications."
            posts={data?.performance?.lowestPerforming || []}
          />
        </div>
      </div>
    </div>
  );
}
