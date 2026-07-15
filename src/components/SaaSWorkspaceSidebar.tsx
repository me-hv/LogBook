"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Users, CreditCard, Globe, ArrowLeft, BookOpen, ShieldCheck, Palette, Sparkles } from "lucide-react";

export function SaaSWorkspaceSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Workspace Settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-4 h-4" />,
      active: pathname === "/dashboard/settings",
    },
    {
      name: "Team Collaborators",
      href: "/dashboard/team",
      icon: <Users className="w-4 h-4" />,
      active: pathname === "/dashboard/team",
    },
    {
      name: "Usage & Billing",
      href: "/dashboard/billing",
      icon: <CreditCard className="w-4 h-4" />,
      active: pathname === "/dashboard/billing",
    },
    {
      name: "Custom Domains",
      href: "/dashboard/domains",
      icon: <Globe className="w-4 h-4" />,
      active: pathname === "/dashboard/domains",
    },
    {
      name: "Branding & Themes",
      href: "/dashboard/branding",
      icon: <Palette className="w-4 h-4" />,
      active: pathname === "/dashboard/branding",
    },
    {
      name: "Security & Governance",
      href: "/dashboard/security",
      icon: <ShieldCheck className="w-4 h-4" />,
      active: pathname === "/dashboard/security",
    },
    {
      name: "Autonomous AI Agents",
      href: "/dashboard/ai",
      icon: <Sparkles className="w-4 h-4" />,
      active: pathname === "/dashboard/ai",
    },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-black border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between transition-colors text-left">
      <div className="space-y-6">
        {/* Brand */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-2 text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            <BookOpen className="w-5 h-5" />
            <span>Workspace Control</span>
          </div>
          <span className="text-[10px] text-zinc-450 dark:text-zinc-500 px-2 block">
            Manage SaaS tenants, workspaces, members, and custom DNS records.
          </span>
        </div>

        {/* Links */}
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

      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/admin"
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-950/60 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          <span>Back to CMS Admin</span>
        </Link>
      </div>
    </aside>
  );
}
export const dynamic = "force-dynamic";
