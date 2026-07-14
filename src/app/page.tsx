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
import { SubscribeForm } from "@/components/SubscribeForm";

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-6 select-none animate-fade-in">
          <span>Introducing Phase 8</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
          Write with <span className="underline decoration-zinc-400 dark:decoration-zinc-700 underline-offset-8">Markdown</span>,<br/>
          deliver in milliseconds.
        </h1>
        
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
          LogBook is a lightweight blogging system featuring instant previews, category index mapping, dynamic feeds, and full analytics.
        </p>

        <div className="flex justify-center gap-3">
          <Link
            href="/blog"
            className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-sm font-bold hover:bg-zinc-850 dark:hover:bg-zinc-200 transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Read Blog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            <span>CMS Login</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-200 dark:border-zinc-900/60">
        <div className="max-w-xl mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
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
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
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

      {/* Subscription Callout on Homepage */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        <SubscribeForm
          source="homepage"
          title="Subscribe to the LogBook Newsletter"
          description="Receive email summaries of web development notes, tips, and articles once a week."
        />
      </section>
    </div>
  );
}
