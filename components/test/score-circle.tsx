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

  const colorClass =
    pct >= 80
      ? "text-accent-green"
      : pct >= 60
        ? "text-panther-red"
        : pct >= 40
          ? "text-accent-amber"
          : "text-accent-red";

  const strokeColor =
    pct >= 80
      ? "#22c55e"
      : pct >= 60
        ? "var(--color-accent)"
        : pct >= 40
          ? "#f59e0b"
          : "#ef4444";

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative h-36 w-36 animate-[card-rise_0.5s_ease-out_forwards]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-bold", colorClass)}>{pct}%</span>
          <span className="text-xs text-text-muted">
            {correct}/{total}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-text-secondary">{label}</span>
      )}
    </div>
  );
}
