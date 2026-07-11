import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative flex flex-col p-6 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm">
      {/* Background soft gradient on hover */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-50 to-transparent dark:from-zinc-900/10 dark:to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="mb-4 text-zinc-900 dark:text-zinc-50 w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 group-hover:scale-105 transition-transform duration-300">
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
        {title}
      </h3>
      
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}
