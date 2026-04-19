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
      <div className="flex items-center justify-between border-b-2 border-ink pb-2">
        <span className="kicker">Questions</span>
        <button
          onClick={() => onToggleFlag(current)}
          className={cn(
            "border-2 border-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-colors",
            flagged.has(current)
              ? "bg-amber text-paper"
              : "bg-paper-card text-ink hover:bg-ink hover:text-paper"
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
                "relative flex h-9 w-9 items-center justify-center border-2 font-mono text-xs font-bold transition-colors",
                isCurrent && "border-ink bg-accent text-paper shadow-[3px_3px_0_var(--color-ink)]",
                !isCurrent && isAnswered && "border-ink bg-ink text-paper",
                !isCurrent && !isAnswered && "border-rule-hair bg-paper-card text-ink-3 hover:border-ink hover:text-ink",
                isFlagged && !isCurrent && "border-amber bg-amber-soft text-amber"
              )}
            >
              {String(i + 1).padStart(2, "0")}
              {isFlagged && !isCurrent && (
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 bg-amber" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
      {/* Legend */}
      <div className="mt-2 flex flex-col gap-1 border-t-2 border-ink pt-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 border-2 border-ink bg-ink" /> Answered
          </span>
          <span className="text-ink">{answered.size}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 border-2 border-ink bg-accent" /> Current
          </span>
          <span className="text-ink">1</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 border-2 border-amber bg-amber-soft" /> Flagged
          </span>
          <span className="text-ink">{flagged.size}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 border-2 border-rule-hair bg-paper-card" /> Unseen
          </span>
          <span className="text-ink">{Math.max(0, total - answered.size)}</span>
        </div>
      </div>
    </div>
  );
}
