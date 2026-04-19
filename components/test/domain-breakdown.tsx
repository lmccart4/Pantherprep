"use client";

import { cn } from "@/lib/utils";

interface DomainStat {
  domain: string;
  correct: number;
  total: number;
}

interface DomainBreakdownProps {
  stats: DomainStat[];
  className?: string;
}

export function DomainBreakdown({ stats, className }: DomainBreakdownProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {stats.map((s, i) => {
        const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        const tone =
          pct >= 80
            ? "text-green"
            : pct >= 60
            ? "text-ink"
            : pct >= 40
            ? "text-amber"
            : "text-accent";

        return (
          <div
            key={s.domain}
            className={cn(
              "flex flex-col gap-2 py-3",
              i > 0 && "border-t-2 border-rule-hair"
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-body text-sm text-ink">{s.domain}</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3">
                <span className="text-ink">
                  {s.correct}/{s.total}
                </span>
                <span className="mx-1.5 text-ink-4">·</span>
                <span className={tone}>{pct}%</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-rule-hair">
              <div
                className="h-full bg-ink transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
