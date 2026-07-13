import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";

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

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-zinc-50 dark:bg-black transition-colors">
      <AdminSidebar />
      <main className="flex-grow p-6 md:p-10 max-w-6xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
