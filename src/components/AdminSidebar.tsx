"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Tags,
  Settings,
  LogOut,
  BookOpen,
  Image,
  BarChart3,
  Mail,
  Users,
  MessageSquare,
  UserCheck,
  Code,
  Puzzle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: pathname === "/admin",
    },
    {
      name: "Posts",
      href: "/admin/posts",
      icon: <FileText className="w-4 h-4" />,
      active: pathname.startsWith("/admin/posts"),
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: <FolderKanban className="w-4 h-4" />,
      active: pathname.startsWith("/admin/categories"),
    },
    {
      name: "Tags",
      href: "/admin/tags",
      icon: <Tags className="w-4 h-4" />,
      active: pathname.startsWith("/admin/tags"),
    },
    {
      name: "Media",
      href: "/admin/media",
      icon: <Image className="w-4 h-4" />,
      active: pathname.startsWith("/admin/media"),
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="w-4 h-4" />,
      active: pathname.startsWith("/admin/analytics"),
    },
    {
      name: "Subscribers",
      href: "/admin/subscribers",
      icon: <Users className="w-4 h-4" />,
      active: pathname.startsWith("/admin/subscribers"),
    },
    {
      name: "Newsletter",
      href: "/admin/newsletter",
      icon: <Mail className="w-4 h-4" />,
      active: pathname.startsWith("/admin/newsletter"),
    },
    {
      name: "Comments",
      href: "/admin/comments",
      icon: <MessageSquare className="w-4 h-4" />,
      active: pathname.startsWith("/admin/comments"),
    },
    {
      name: "Team Collaboration",
      href: "/admin/users",
      icon: <UserCheck className="w-4 h-4" />,
      active: pathname.startsWith("/admin/users"),
    },
    {
      name: "Developers",
      href: "/admin/developers",
      icon: <Code className="w-4 h-4" />,
      active: pathname.startsWith("/admin/developers"),
    },
    {
      name: "App Marketplace",
      href: "/admin/marketplace",
      icon: <Puzzle className="w-4 h-4" />,
      active: pathname.startsWith("/admin/marketplace"),
    },
    {
      name: "Developer Console",
      href: "/admin/developer-console",
      icon: <Code className="w-4 h-4" />,
      active: pathname.startsWith("/admin/developer-console"),
    },
    {
      name: "SaaS Workspace",
      href: "/dashboard/settings",
      icon: <Settings className="w-4 h-4" />,
      active: pathname.startsWith("/dashboard"),
    },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-black border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between transition-colors">
      <div className="space-y-6">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 px-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-550">
            <BookOpen className="w-6 h-6 text-zinc-900 dark:text-zinc-50" />
            <span>LogBook</span>
          </Link>
          <div className="px-2">
            <WorkspaceSwitcher />
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                item.active
                  ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-950/60 hover:text-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
