import { Share2, Globe, Search, Link as LinkIcon } from "lucide-react";

interface TrafficSourceItem {
  source: string;
  count: number;
  percentage: number;
}

interface ReferrerItem {
  name: string;
  count: number;
}

interface TrafficSourceTableProps {
  sources: TrafficSourceItem[];
  referrers: ReferrerItem[];
}

export function TrafficSourceTable({ sources, referrers }: TrafficSourceTableProps) {
  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case "direct traffic":
        return <Globe className="w-4 h-4" />;
      case "search engines":
        return <Search className="w-4 h-4" />;
      case "social media":
        return <Share2 className="w-4 h-4" />;
      default:
        return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 grid md:grid-cols-2 gap-8 items-start">
      {/* Channels Breakdown */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Acquisition Channels
          </h4>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            How visitors discovered your blog pages.
          </p>
        </div>

        <div className="space-y-4">
          {sources.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-400 font-medium">
                  <span className="text-zinc-400">{getSourceIcon(item.source)}</span>
                  <span>{item.source}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-450 dark:text-zinc-500 font-medium">{item.count} views</span>
                  <span className="font-extrabold text-zinc-900 dark:text-zinc-50 w-8 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
                <div
                  className="bg-zinc-900 dark:bg-zinc-100 h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referrers Details */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Top Referrers
          </h4>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            Specific domains referring visits to your posts.
          </p>
        </div>

        {referrers.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900/60">
            {referrers.map((ref, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5 text-xs sm:text-sm first:pt-0 last:pb-0">
                <span className="text-zinc-700 dark:text-zinc-350 font-medium truncate max-w-[200px]">
                  {ref.name}
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50">
                  {ref.count} <span className="text-xs text-zinc-450 dark:text-zinc-500 font-normal">views</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-400 text-xs italic">
            No external referring links logged
          </div>
        )}
      </div>
    </div>
  );
}
