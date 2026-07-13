"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface UserMenuProps {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
    role?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      console.error("Failed to sign out:", error);
    }
  };

  const displayName = user.name || user.email.split("@")[0];
  const userRole = user.role || "author";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 flex items-center justify-center text-xs font-bold uppercase">
            {displayName.substring(0, 2)}
          </div>
        )}
        <span className="hidden sm:inline text-sm font-medium text-zinc-900 dark:text-zinc-550">
          {displayName}
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 p-2 shadow-lg z-50 transition-all animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Details Header */}
          <div className="px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-850 mb-1">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {displayName}
            </p>
            <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
            <span className="inline-block px-2 py-0.5 mt-2 rounded-md bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-wider text-zinc-650 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800">
              {userRole}
            </span>
          </div>

          {/* Links */}
          <div className="space-y-0.5">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            {/* Logout Trigger */}
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
