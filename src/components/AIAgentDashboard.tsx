"use client";

import { AIRecommendationCard } from "./AIRecommendationCard";
import { PublishSuggestions } from "./PublishSuggestions";
import { ContentHealthScore } from "./ContentHealthScore";
import { TrendAnalysisCard } from "./TrendAnalysisCard";
import { AIJobHistory } from "./AIJobHistory";
import { Sparkles, BarChart2, Calendar, ClipboardCheck } from "lucide-react";

export function AIAgentDashboard() {
  return (
    <div className="space-y-8 flex-1 text-left font-semibold">
      {/* Overview Analytics Summary */}
      <TrendAnalysisCard />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Outline recommendation */}
        <AIRecommendationCard />

        {/* Readability review */}
        <ContentHealthScore />

        {/* Publish calendar time */}
        <PublishSuggestions />

        {/* Logs log lists history */}
        <AIJobHistory />
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
