import { Clock } from "lucide-react";

interface ReadingTimeProps {
  content: string;
  className?: string;
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function ReadingTime({ content, className = "" }: ReadingTimeProps) {
  const minutes = calculateReadingTime(content);

  return (
    <span className={`inline-flex items-center gap-1 text-zinc-550 dark:text-zinc-400 ${className}`}>
      <Clock className="w-3.5 h-3.5" />
      <span>{minutes} min read</span>
    </span>
  );
}
