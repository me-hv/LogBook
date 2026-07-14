import { AnalyticsDashboard } from "./AnalyticsDashboard";

export const metadata = {
  title: "Analytics | LogBook Admin",
  description: "CMS content performance analytics, views, device types, and acquisition details.",
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}

export const dynamic = "force-dynamic";
