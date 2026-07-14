"use client";

import { useState } from "react";

interface ChartItem {
  date: string;
  views: number;
  visitors: number;
}

interface ViewsChartProps {
  data: ChartItem[];
}

export function ViewsChart({ data }: ViewsChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-400 text-xs italic bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
        No metrics data available for this range
      </div>
    );
  }

  // Find max values for scaling
  const maxViews = Math.max(...data.map((d) => d.views), 10);
  const maxVisitors = Math.max(...data.map((d) => d.visitors), 10);
  const maxValue = Math.max(maxViews, maxVisitors);

  // SVG dimensions
  const width = 600;
  const height = 240;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Generate points
  const points = data.map((item, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * chartWidth;
    const y = padding + chartHeight - (item.views / maxValue) * chartHeight;
    return { x, y, item, idx };
  });

  const visitorPoints = data.map((item, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * chartWidth;
    const y = padding + chartHeight - (item.visitors / maxValue) * chartHeight;
    return { x, y, item, idx };
  });

  // Build SVG Paths
  const linePath = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  const visitorLinePath = visitorPoints.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  // Format date labels
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  };

  return (
    <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Views & Visitors Over Time
          </h4>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            Track daily publication views compared to unique sessions.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-50 inline-block" />
            <span className="text-zinc-650 dark:text-zinc-400">Pageviews</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-zinc-450 dark:bg-zinc-600 inline-block" />
            <span className="text-zinc-650 dark:text-zinc-400">Visitors</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(113, 113, 122)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="rgb(113, 113, 122)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & values */}
          {gridLines.map((ratio, idx) => {
            const y = padding + chartHeight - ratio * chartHeight;
            const val = Math.round(ratio * maxValue);
            return (
              <g key={idx} className="opacity-40 dark:opacity-30">
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="text-zinc-200 dark:text-zinc-800"
                />
                <text
                  x={padding - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  className="fill-zinc-400 dark:fill-zinc-500 font-bold"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area under views */}
          {areaPath && (
            <path d={areaPath} fill="url(#chartGrad)" />
          )}

          {/* Line for Visitors */}
          {visitorLinePath && (
            <path
              d={visitorLinePath}
              fill="none"
              stroke="rgb(161, 161, 170)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="dark:stroke-zinc-600"
            />
          )}

          {/* Line for Views */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-zinc-900 dark:text-zinc-50"
            />
          )}

          {/* Interaction circles */}
          {points.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={activeIdx === idx ? 6 : 0}
              className="fill-zinc-900 dark:fill-zinc-50 stroke-white dark:stroke-zinc-950 stroke-2 transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
            />
          ))}

          {/* Date labels at bottom */}
          {data.length > 0 && (
            <>
              {/* Start Date */}
              <text
                x={padding}
                y={height - padding + 18}
                fontSize="10"
                className="fill-zinc-400 dark:fill-zinc-500 font-bold"
              >
                {formatDateLabel(data[0].date)}
              </text>

              {/* Mid Date */}
              {data.length > 2 && (
                <text
                  x={width / 2}
                  y={height - padding + 18}
                  textAnchor="middle"
                  fontSize="10"
                  className="fill-zinc-400 dark:fill-zinc-500 font-bold"
                >
                  {formatDateLabel(data[Math.floor(data.length / 2)].date)}
                </text>
              )}

              {/* End Date */}
              <text
                x={width - padding}
                y={height - padding + 18}
                textAnchor="end"
                fontSize="10"
                className="fill-zinc-400 dark:fill-zinc-500 font-bold"
              >
                {formatDateLabel(data[data.length - 1].date)}
              </text>
            </>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activeIdx !== null && data[activeIdx] && (
          <div
            className="absolute p-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-xl shadow-xl text-xs space-y-1.5 pointer-events-none z-10 border border-zinc-800 dark:border-zinc-200 animate-in fade-in zoom-in-95 duration-100"
            style={{
              left: `${(activeIdx / (data.length - 1 || 1)) * 90}%`,
              top: "-40px",
            }}
          >
            <p className="font-bold border-b border-zinc-800 dark:border-zinc-250 pb-1 mb-1 opacity-80">
              {formatDateLabel(data[activeIdx].date)}
            </p>
            <div className="flex justify-between gap-4">
              <span>Views:</span>
              <span className="font-bold">{data[activeIdx].views}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Visitors:</span>
              <span className="font-bold">{data[activeIdx].visitors}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
