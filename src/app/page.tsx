import Link from "next/link";
import {
  FileText,
  Zap,
  Globe,
  LayoutDashboard,
  Hash,
  Moon,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";

export default function Home() {
  const features = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Markdown Support",
      description:
        "Write naturally using standard Markdown syntax with rich syntax highlighting and nested MDX support.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Fast Performance",
      description:
        "Blazing-fast page loads powered by the Next.js App Router, Turbopack, and optimized asset loading.",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "SEO Optimized",
      description:
        "Engineered with clean HTML, semantic structure, JSON-LD schemas, and automatic metadata generation.",
    },
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: "Admin Dashboard",
      description:
        "Create, edit, delete, and publish posts, with full draft states and integrated asset management.",
    },
    {
      icon: <Hash className="w-5 h-5" />,
      title: "Categories & Tags",
      description:
        "Organize your content granularly using multi-category classifications and indexable taxonomies.",
    },
    {
      icon: <Moon className="w-5 h-5" />,
      title: "Dark Mode Ready",
      description:
        "A beautiful dark theme crafted natively with modern color spaces like HSL and OKLCH.",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-white dark:bg-black transition-colors">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none h-[600px] z-0" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-16 sm:pt-32 sm:pb-24 text-center">
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-650 dark:text-zinc-400 mb-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
          <span>Introducing LogBook v1.0</span>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 max-w-2xl mx-auto leading-[1.1]">
          LogBook
        </h1>
        
        <p className="text-xl sm:text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4 max-w-xl mx-auto">
          Your Markdown-first blogging platform.
        </p>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
          Write, publish, and manage your content with the power of Markdown. Built for developers, designers, and creators who value simplicity and speed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 w-full sm:w-auto justify-center px-6 py-3 rounded-full text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/blog"
            className="flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-zinc-900 dark:text-zinc-50"
          >
            View Blog
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-150 dark:border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Everything you need for a modern blog
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            A developer-friendly blogging system packed with all the essentials.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* Tech Stack Callout */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="p-8 sm:p-12 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-950/20 backdrop-blur-sm max-w-3xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Built on a modern developer stack
          </h3>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
            LogBook harnesses standard technologies to offer seamless authoring and lightning fast delivery.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-md bg-zinc-200/60 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300">
              Next.js 15
            </span>
            <span className="px-3 py-1.5 rounded-md bg-zinc-200/60 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300">
              React 19
            </span>
            <span className="px-3 py-1.5 rounded-md bg-zinc-200/60 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300">
              TypeScript
            </span>
            <span className="px-3 py-1.5 rounded-md bg-zinc-200/60 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300">
              Tailwind CSS v4
            </span>
            <span className="px-3 py-1.5 rounded-md bg-zinc-200/60 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300">
              Prisma ORM
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
