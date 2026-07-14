"use client";

interface GrowthItem {
  date: string;
  subscribers: number;
}

interface SubscriberGrowthChartProps {
  data: GrowthItem[];
}

export function SubscriberGrowthChart({ data }: SubscriberGrowthChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-400 text-xs italic bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
        No subscription growth history logged
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.subscribers), 10);

  const width = 600;
  const height = 220;
  const padding = 25;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Generate coordinate points
  const points = data.map((item, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * chartWidth;
    const y = padding + chartHeight - (item.subscribers / maxVal) * chartHeight;
    return { x, y, item };
  });

  const linePath = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  };

  return (
    <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
      <div>
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          Subscriber Growth History
        </h4>
        <p className="text-xs text-zinc-550 dark:text-zinc-400">
          Cumulative subscriber growth trajectory over the past 30 days.
        </p>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(113, 113, 122)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="rgb(113, 113, 122)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid helper dashes */}
          {[0, 0.5, 1].map((ratio, idx) => {
            const y = padding + chartHeight - ratio * chartHeight;
            const val = Math.round(ratio * maxVal);
            return (
              <g key={idx} className="opacity-30 dark:opacity-20">
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-zinc-300 dark:text-zinc-700"
                />
                <text
                  x={padding - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  className="fill-zinc-400 font-bold"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area gradient */}
          {areaPath && <path d={areaPath} fill="url(#growthGrad)" />}

          {/* Sparkline curve */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-zinc-900 dark:text-zinc-50"
            />
          )}

          {/* Labels */}
          {data.length > 0 && (
            <>
              <text
                x={padding}
                y={height - padding + 15}
                fontSize="9"
                className="fill-zinc-400 font-bold"
              >
                {formatDateLabel(data[0].date)}
              </text>
              <text
                x={width - padding}
                y={height - padding + 15}
                textAnchor="end"
                fontSize="9"
                className="fill-zinc-400 font-bold"
              >
                {formatDateLabel(data[data.length - 1].date)}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
