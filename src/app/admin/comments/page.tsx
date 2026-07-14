import { CommentModerationManager } from "./CommentModerationManager";

export const metadata = {
  title: "Comment Moderation | LogBook Admin",
  description: "Approve, reject, delete, or mark comments as spam across your publications.",
};

export default function CommentsModerationPage() {
  return <CommentModerationManager />;
}

export const dynamic = "force-dynamic";
