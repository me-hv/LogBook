import { UsersDashboard } from "./UsersDashboard";

export const metadata = {
  title: "User Management | LogBook Admin",
  description: "Invite team authors, manage permissions, suspend, or update roles.",
};

export default function UsersPage() {
  return <UsersDashboard />;
}

export const dynamic = "force-dynamic";
