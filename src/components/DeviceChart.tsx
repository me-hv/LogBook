import { Monitor, Smartphone, Tablet } from "lucide-react";

interface DeviceItem {
  name: string;
  value: number;
}

interface DeviceChartProps {
  data: DeviceItem[];
}

export function DeviceChart({ data }: DeviceChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  const getPercentage = (val: number) => {
    if (total === 0) return 0;
    return Math.round((val / total) * 100);
  };

  const getDeviceIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "desktop":
        return <Monitor className="w-4 h-4" />;
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getDeviceColor = (name: string) => {
    switch (name.toLowerCase()) {
      case "desktop":
        return "bg-zinc-900 dark:bg-zinc-100";
      case "mobile":
        return "bg-zinc-550 dark:bg-zinc-400";
      case "tablet":
        return "bg-zinc-300 dark:bg-zinc-650";
      default:
        return "bg-zinc-900";
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          Device Distribution
        </h4>
        <p className="text-xs text-zinc-550 dark:text-zinc-400">
          Breakdown of readers by hardware device type.
        </p>
      </div>

      {/* Stacked Progress Bar */}
      {total > 0 ? (
        <div className="space-y-6">
          <div className="w-full h-3 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex">
            {data.map((item, idx) => {
              const pct = getPercentage(item.value);
              if (pct === 0) return null;
              return (
                <div
                  key={idx}
                  style={{ width: `${pct}%` }}
                  className={`${getDeviceColor(item.name)} h-full transition-all duration-500`}
                  title={`${item.name}: ${pct}%`}
                />
              );
            })}
          </div>

          {/* Details list */}
          <div className="space-y-3">
            {data.map((item, idx) => {
              const pct = getPercentage(item.value);
              return (
                <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-400 font-medium">
                    <span className="text-zinc-400">{getDeviceIcon(item.name)}</span>
                    <span className="capitalize">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-450 dark:text-zinc-500 font-semibold">{item.value} views</span>
                    <span className="font-extrabold text-zinc-900 dark:text-zinc-50 w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-8 flex items-center justify-center text-zinc-400 text-xs italic">
          No device metrics log recorded yet
        </div>
      )}
    </div>
  );
}
