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

const DOMAIN_COLORS: Record<string, string> = {
  "Algebra": "#60a5fa",
  "Advanced Math": "#a78bfa",
  "Problem-Solving & Data Analysis": "#34d399",
  "Geometry & Trigonometry": "#fb923c",
  "Craft and Structure": "#60a5fa",
  "Information and Ideas": "#a78bfa",
  "Standard English Conventions": "#34d399",
  "Expression of Ideas": "#fb923c",
};

export function DomainBreakdown({ stats, className }: DomainBreakdownProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {stats.map((s) => {
        const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        const color = DOMAIN_COLORS[s.domain] ?? "#9898a8";

        return (
          <div key={s.domain} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{s.domain}</span>
              <span className="font-mono text-xs text-text-muted">
                {s.correct}/{s.total} ({pct}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
