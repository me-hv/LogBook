import { MapPin, Globe } from "lucide-react";

interface GeoItem {
  name: string;
  count: number;
}

interface GeographyMapProps {
  countries: GeoItem[];
  cities: GeoItem[];
}

export function GeographyMap({ countries, cities }: GeographyMapProps) {
  const maxCountry = countries.length > 0 ? countries[0].count : 1;
  const maxCity = cities.length > 0 ? cities[0].count : 1;

  return (
    <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 grid md:grid-cols-2 gap-8 items-start">
      {/* Countries Breakdown */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Globe className="w-4 h-4 text-zinc-400" />
            <span>Top Countries</span>
          </h4>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            Geographic location of your readers by country.
          </p>
        </div>

        {countries.length > 0 ? (
          <div className="space-y-3">
            {countries.map((item, idx) => {
              const pct = Math.round((item.count / maxCountry) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-zinc-650 dark:text-zinc-400 font-medium">
                      {item.name}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">
                      {item.count} <span className="text-[10px] font-normal text-zinc-400">views</span>
                    </span>
                  </div>
                  <div className="w-full h-1 bg-zinc-50 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="bg-zinc-900 dark:bg-zinc-100 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-400 text-xs italic">
            No country views logged
          </div>
        )}
      </div>

      {/* Cities Breakdown */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zinc-400" />
            <span>Top Cities</span>
          </h4>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            Geographic location of your readers by city.
          </p>
        </div>

        {cities.length > 0 ? (
          <div className="space-y-3">
            {cities.map((item, idx) => {
              const pct = Math.round((item.count / maxCity) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-zinc-650 dark:text-zinc-400 font-medium">
                      {item.name}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">
                      {item.count} <span className="text-[10px] font-normal text-zinc-400">views</span>
                    </span>
                  </div>
                  <div className="w-full h-1 bg-zinc-50 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="bg-zinc-900 dark:bg-zinc-100 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-400 text-xs italic">
            No city views logged
          </div>
        )}
      </div>
    </div>
  );
}
