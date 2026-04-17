"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-[6px] flex-1 overflow-hidden border border-ink bg-paper">
        <div
          className="h-full bg-ink transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.14em] tabular-nums text-ink-2">
        {current + 1} / {total}
      </span>
    </div>
  );
}
