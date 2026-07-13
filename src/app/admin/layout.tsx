import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Validate that user has admin or author role (simple RBAC)
  const role = session.user.role;
  if (role !== "admin" && role !== "author") {
    redirect("/login");
  }

  return <>{children}</>;
}
