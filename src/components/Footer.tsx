import Link from "next/link";
import { GitBranch } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          {/* Copyright & Info */}
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            <span>© {currentYear} LogBook. All rights reserved.</span>
            <span className="mx-2 hidden md:inline">|</span>
            <span className="block md:inline mt-1 md:mt-0">
              Built with <span className="font-semibold text-zinc-700 dark:text-zinc-300">Next.js</span> and{" "}
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">TypeScript</span>.
            </span>
          </div>

          {/* Socials / Links */}
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors flex items-center gap-1.5 text-sm font-medium"
            >
              <GitBranch className="w-4 h-4" />
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
