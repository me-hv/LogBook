"use client";

import { useState } from "react";
import { InstallButton } from "./InstallButton";
import { AppReviewPanel } from "./AppReviewPanel";
import { Star, Download, ShieldCheck, X, Cpu, Palette, Settings } from "lucide-react";

interface MarketplaceCardProps {
  app: {
    id: string;
    name: string;
    slug: string;
    description: string;
    version: string;
    category: string;
    price: number;
    downloads: number;
    installs: number;
    rating: number;
  };
  onInstalledStateChange?: () => void;
}

export function MarketplaceCard({ app, onInstalledStateChange }: MarketplaceCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const getCategoryIcon = () => {
    switch (app.category) {
      case "theme":
        return <Palette className="w-4 h-4 text-emerald-500" />;
      case "ai":
        return <Cpu className="w-4 h-4 text-violet-500" />;
      default:
        return <Settings className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="bg-white dark:bg-zinc-950/45 p-5 border border-zinc-200 dark:border-zinc-850 rounded-3xl text-left space-y-4 hover:shadow-lg dark:hover:bg-zinc-900/10 cursor-pointer transition-all flex flex-col justify-between"
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              {getCategoryIcon()}
            </div>

            <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-wide px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900">
              {app.category}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1">
            <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-50 leading-snug">
              {app.name}
            </h4>
            <p className="text-[10px] text-zinc-450 font-semibold line-clamp-2 leading-relaxed">
              {app.description}
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{app.rating}</span>
          </div>

          <span className="text-xs font-black text-zinc-900 dark:text-zinc-50">
            {app.price === 0 ? "Free" : `$${app.price.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Detail & Installation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-450 hover:text-zinc-900 rounded-lg cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Header info */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                {getCategoryIcon()}
              </div>

              <div className="space-y-1 text-left">
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 leading-tight">
                  {app.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold text-zinc-400">
                  <span className="uppercase">{app.category}</span>
                  <span>•</span>
                  <span>Version {app.version}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{app.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="text-left space-y-2">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                Description
              </span>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold">
                {app.description}
              </p>
            </div>

            {/* Invariant validation banner */}
            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-3 border border-zinc-150 dark:border-zinc-900 rounded-2xl flex items-center justify-between text-left gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-400 uppercase tracking-wide">
                  Verified Signature Safe
                </span>
              </div>
              <span className="text-xs font-black text-zinc-900 dark:text-zinc-50">
                {app.price === 0 ? "Free" : `$${app.price.toFixed(2)}`}
              </span>
            </div>

            {/* Installation Button */}
            <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-900/60">
              <InstallButton appId={app.id} onStateChange={onInstalledStateChange} />
            </div>

            {/* App Reviews panel section */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
              <AppReviewPanel appId={app.id} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export const dynamic = "force-dynamic";
