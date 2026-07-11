import Link from "next/link";
import { BookOpen, Award, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Founded", value: "2026" },
    { label: "Format Support", value: "Markdown & MDX" },
    { label: "Load Time", value: "<100ms" },
    { label: "Theme Options", value: "Light & Dark" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
      {/* Intro */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
          About LogBook
        </h1>
        <p className="text-lg text-zinc-650 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          LogBook was conceived out of a simple need: a blogging platform that is fast, beautiful, and respects writing in its native format—Markdown.
        </p>
      </section>

      {/* Grid Features */}
      <section className="grid gap-8 sm:grid-cols-2 mb-20">
        <div className="flex gap-4 p-6 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <BookOpen className="w-6 h-6 text-zinc-900 dark:text-zinc-50 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Focus on Writing
            </h3>
            <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
              No bloated block editors or complex layouts. Write in clean Markdown or MDX and let our engine handle the rest.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-6 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <Zap className="w-6 h-6 text-zinc-900 dark:text-zinc-50 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Uncompromising Speed
            </h3>
            <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
              LogBook compiles to static HTML on build time, guaranteeing sub-second loads and near-perfect SEO scores.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-6 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <ShieldCheck className="w-6 h-6 text-zinc-900 dark:text-zinc-50 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Secure by Design
            </h3>
            <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
              No databases exposed to public readers. Everything is static client-side or securely cached behind modern edge middleware.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-6 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <Heart className="w-6 h-6 text-zinc-900 dark:text-zinc-50 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Developer-First
            </h3>
            <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
              Built on a standard Next.js, React, Tailwind, and Prisma stack. Customize, extend, and deploy it anywhere within seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-10 border-y border-zinc-150 dark:border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-16">
        {stats.map((stat, i) => (
          <div key={i}>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Ready to share your story?
        </h2>
        <p className="text-sm sm:text-base text-zinc-650 dark:text-zinc-400 mb-8 max-w-md mx-auto">
          Start writing your next blog post in minutes with our clean Markdown interface.
        </p>
        <Link
          href="/admin"
          className="inline-flex px-6 py-3 rounded-full text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Get Started Now
        </Link>
      </section>
    </div>
  );
}
import { Zap } from "lucide-react";
