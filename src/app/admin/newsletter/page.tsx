import { NewsletterDashboard } from "./NewsletterDashboard";

export const metadata = {
  title: "Newsletter Campaigns | LogBook Admin",
  description: "Send email campaigns, analyze subscription metrics and monitor growth rates.",
};

export default function NewsletterPage() {
  return <NewsletterDashboard />;
}

export const dynamic = "force-dynamic";
