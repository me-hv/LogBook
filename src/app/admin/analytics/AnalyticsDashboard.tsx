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
import { getAnalyticsData, getAIUsageStatsAction } from "../actions";
import { BarChart3, Eye, Users, FileText, Clock, Award, Loader2, Brain, Wand2, History } from "lucide-react";

export function AnalyticsDashboard() {
  const [range, setRange] = useState("30days");
  const [data, setData] = useState<any>(null);
  const [aiStats, setAiStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"traffic" | "ai">("traffic");
  const [isPending, startTransition] = useTransition();

  const loadAnalytics = (timeRange: string) => {
    if (!data) setLoading(true);
    startTransition(async () => {
      const [res, aiRes] = await Promise.all([
        getAnalyticsData(timeRange),
        getAIUsageStatsAction(),
      ]);

      if (res.success) {
        setData(res.data);
      }
      if (aiRes.success) {
        setAiStats(aiRes.data);
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
    <div className="space-y-8 flex-1 text-left">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="Content Analytics"
          description="Analyze post pageviews, reader acquisition channels, geographic distributions, and performance trends."
        />
        <div className="flex items-center gap-3">
          {isPending && <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />}
          {activeTab === "traffic" && <DateRangeSelector value={range} onChange={setRange} />}
        </div>
      </div>

      {/* Tab Selector Switcher */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-850 pb-2">
        <button
          onClick={() => setActiveTab("traffic")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "traffic"
              ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
              : "text-zinc-550 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          Traffic & Engagement
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ai"
              ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
              : "text-zinc-550 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          AI Writing Copilot Metrics
        </button>
      </div>

      {activeTab === "traffic" ? (
        <>
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
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-550 flex items-center gap-2">
                <Award className="w-5 h-5 text-zinc-455" />
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
        </>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* AI Usage Summary Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnalyticsCard
              title="AI Assistant Requests"
              value={aiStats?.totalRequests || 0}
              subtext="completed outline / rewrite jobs"
              icon={<Brain className="w-4.5 h-4.5" />}
            />
            <AnalyticsCard
              title="Total Tokens Consumed"
              value={aiStats?.totalTokens || 0}
              subtext="Gemini generation token counts"
              icon={<Wand2 className="w-4.5 h-4.5" />}
            />
            <AnalyticsCard
              title="Avg Tokens / Completion"
              value={aiStats?.totalRequests ? Math.round(aiStats.totalTokens / aiStats.totalRequests) : 0}
              subtext="average length per AI run"
              icon={<Clock className="w-4.5 h-4.5" />}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-4">
            {/* Feature Usage breakdown table */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                  AI Feature Usage Distribution
                </h3>
                <p className="text-xs text-zinc-500">
                  Track tokens consumption across outlines, rewrites, and summaries.
                </p>
              </div>

              <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                      <th className="px-5 py-3">Feature Type</th>
                      <th className="px-5 py-3">Requests Count</th>
                      <th className="px-5 py-3 text-right">Tokens Used</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60 text-zinc-700 dark:text-zinc-350">
                    {aiStats?.featureBreakdown && aiStats.featureBreakdown.length > 0 ? (
                      aiStats.featureBreakdown.map((feat: any) => (
                        <tr key={feat.type} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all font-semibold">
                          <td className="px-5 py-3 uppercase tracking-wider text-[10px] text-zinc-900 dark:text-zinc-50">
                            {feat.type}
                          </td>
                          <td className="px-5 py-3">{feat.count} runs</td>
                          <td className="px-5 py-3 text-right font-mono text-zinc-900 dark:text-zinc-50">{feat.tokens}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-zinc-400 italic">
                          No AI usage data recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent AI timeline */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4.5 h-4.5" />
                  <span>Recent AI Copilot Run History</span>
                </h3>
                <p className="text-xs text-zinc-500">
                  Chronological history of AI operations executed by creators.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-5 space-y-4">
                {aiStats?.recentJobs && aiStats.recentJobs.length > 0 ? (
                  aiStats.recentJobs.map((job: any) => (
                    <div key={job.id} className="text-xs space-y-0.5 border-b border-zinc-150 dark:border-zinc-900/60 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                        <span>{job.user?.name || job.user?.email || "Creator"}</span>
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-0.5">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase text-[9px] tracking-wider bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">
                          {job.type}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {job.tokensUsed} tokens
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-zinc-400 italic">
                    No AI jobs recorded.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
