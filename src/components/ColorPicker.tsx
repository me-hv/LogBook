"use client";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const presets = ["#18181b", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];

  return (
    <div className="space-y-2 text-left font-semibold">
      <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
          />
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-1.5">
          {presets.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              style={{ backgroundColor: color }}
              className={`w-5 h-5 rounded-full cursor-pointer border ${
                value.toLowerCase() === color.toLowerCase()
                  ? "ring-2 ring-offset-2 ring-zinc-500"
                  : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
