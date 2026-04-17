"use client";

import { cn } from "@/lib/utils";

interface QuestionNavigatorProps {
  total: number;
  current: number;
  answered: Set<number>;
  flagged: Set<number>;
  onJump: (index: number) => void;
  onToggleFlag: (index: number) => void;
}

export function QuestionNavigator({
  total,
  current,
  answered,
  flagged,
  onJump,
  onToggleFlag,
}: QuestionNavigatorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="kicker">
          Questions
        </span>
        <button
          onClick={() => onToggleFlag(current)}
          className={cn(
            " px-2.5 py-1 text-xs font-medium transition-colors",
            flagged.has(current)
              ? "bg-accent-amber-soft text-accent-amber"
              : "bg-paper-card text-text-muted hover:text-text-secondary"
          )}
        >
          {flagged.has(current) ? "Unflag" : "Flag"}
        </button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(36px,1fr))] gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const isCurrent = i === current;
          const isAnswered = answered.has(i);
          const isFlagged = flagged.has(i);

          return (
            <button
              key={i}
              onClick={() => onJump(i)}
              aria-label={`Go to question ${i + 1}${isFlagged ? " (flagged)" : ""}${isAnswered ? " (answered)" : ""}`}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "flex h-9 w-9 items-center justify-center  text-xs font-semibold transition-all duration-150",
                isCurrent && "bg-panther-red text-ink shadow-md",
                !isCurrent && isAnswered && "bg-paper-card text-text-primary",
                !isCurrent && !isAnswered && "border border-border-default text-text-muted hover:border-border-light",
                isFlagged && !isCurrent && "ring-1 ring-accent-amber"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
