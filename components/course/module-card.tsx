"use client";

import { cn } from "@/lib/utils";

interface ModuleCardProps {
  moduleNum: number;
  title: string;
  description: string;
  tags?: string[];
  href: string;
  accentColor?: string;
  isBoss?: boolean;
  completed?: boolean;
}

export function ModuleCard({
  moduleNum,
  title,
  description,
  tags = [],
  href,
  accentColor = "var(--color-accent)",
  isBoss = false,
  completed = false,
}: ModuleCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "group flex items-center gap-4  border bg-bg-card p-5 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        completed
          ? "border-green-500/30 hover:border-green-500/50"
          : isBoss
          ? "border-accent-amber/30 hover:border-accent-amber"
          : "border-border-default hover:border-border-light"
      )}
    >
      {/* Module number / completion indicator */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-ink"
        )}
        style={{ backgroundColor: completed ? "#16a34a" : isBoss ? "#f59e0b" : accentColor }}
      >
        {completed ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          moduleNum
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <h4 className="text-sm font-semibold text-ink group-hover:text-text-primary">
            {title}
          </h4>
          {completed && (
            <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-green-400">
              Completed
            </span>
          )}
        </div>
        <p className="text-xs leading-relaxed text-text-muted">{description}</p>
        {tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider",
                  tag === "lesson" && "bg-accent-blue/10 text-accent-blue",
                  tag === "practice" && "bg-accent-green/10 text-accent-green",
                  tag === "quiz" && "bg-accent-purple/10 text-accent-purple",
                  tag === "boss" && "bg-accent-amber/10 text-accent-amber",
                  tag === "diagnostic" && "bg-panther-red/10 text-panther-light-red",
                  tag === "review" && "bg-accent-cyan/10 text-accent-cyan"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0 text-text-muted transition-colors group-hover:text-text-secondary"
      >
        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
