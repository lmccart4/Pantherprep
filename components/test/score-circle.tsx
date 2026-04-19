"use client";

import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  correct: number;
  total: number;
  label?: string;
  className?: string;
}

export function ScoreCircle({ correct, total, label, className }: ScoreCircleProps) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const accentClass =
    pct >= 80
      ? "text-green"
      : pct >= 60
      ? "text-ink"
      : pct >= 40
      ? "text-amber"
      : "text-accent";

  const barClass =
    pct >= 80
      ? "bg-green"
      : pct >= 60
      ? "bg-ink"
      : pct >= 40
      ? "bg-amber"
      : "bg-accent";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {label && (
        <span className="kicker">{label}</span>
      )}
      <div className="flex items-baseline gap-1">
        <span className={cn("font-display text-[4rem] leading-none font-bold", accentClass)}>
          {pct}
        </span>
        <span className={cn("font-display text-2xl leading-none", accentClass)}>%</span>
      </div>
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
        {correct} / {total} correct
      </div>
      {/* Horizontal progress bar — replaces the SVG ring */}
      <div className="mt-1 h-1.5 w-32 bg-rule-hair">
        <div
          className={cn("h-full transition-[width] duration-700 ease-out", barClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
