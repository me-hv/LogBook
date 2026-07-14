import Link from "next/link";
import { GitBranch } from "lucide-react";
import { SubscribeForm } from "./SubscribeForm";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-8 items-start pb-8 border-b border-zinc-200 dark:border-zinc-900/60">
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
              LogBook
            </h4>
            <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed max-w-sm">
              Write, publish, and manage your content with the power of Markdown. Subscribe to updates to stay up to date.
            </p>
          </div>
          <SubscribeForm
            source="footer"
            title="Stay Updated"
            description="Join our mailing list to receive notification alerts when new posts are published."
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left pt-2">
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
