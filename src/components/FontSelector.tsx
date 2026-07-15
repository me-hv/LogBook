"use client";

interface FontSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
  const fonts = [
    { id: "Inter", label: "Inter (Geometric Sans-Serif)" },
    { id: "Georgia", label: "Georgia (Elegant Serif)" },
    { id: "Outfit", label: "Outfit (Modern Minimalist)" },
    { id: "Playfair Display", label: "Playfair Display (Classy Title Serif)" },
  ];

  return (
    <div className="space-y-2 text-left font-semibold">
      <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block">
        Typography Set
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/20 text-xs focus:outline-none focus:ring-1"
      >
        {fonts.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
export const dynamic = "force-dynamic";
