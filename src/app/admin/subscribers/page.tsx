import { SubscriberManager } from "./SubscriberManager";

export const metadata = {
  title: "Subscribers | LogBook Admin",
  description: "Manage subscription list, export email data, or remove subscriber logs.",
};

export default function SubscribersPage() {
  return <SubscriberManager />;
}

export const dynamic = "force-dynamic";
