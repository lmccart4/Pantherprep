"use client";

import { useState } from "react";

export interface InteractiveChecklistProps {
  title: string;
  items: string[];
  accentColor: string;
  requireAll?: boolean;
  onComplete: () => void;
}

export function InteractiveChecklist({
  title,
  items,
  accentColor,
  requireAll = false,
  onComplete,
}: InteractiveChecklistProps) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    items.map(() => false),
  );

  const doneCount = checked.filter(Boolean).length;
  const allDone = doneCount === items.length;
  const canContinue = requireAll ? allDone : true;

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-xl">
        {/* Glass card */}
        <div
          className="rounded-2xl border border-white/5 p-6 shadow-lg backdrop-blur-2xl"
          style={{ background: "rgba(15, 15, 22, 0.75)" }}
        >
          {/* Header */}
          <h2 className="mb-1 font-display text-xl font-bold text-text-primary">
            {title}
          </h2>
          <p className="mb-5 text-sm" style={{ color: accentColor }}>
            {doneCount}/{items.length} complete
          </p>

          {/* Checklist items */}
          <ul className="space-y-1">
            {items.map((label, i) => {
              const isDone = checked[i];
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    {/* Checkbox */}
                    <span
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border text-xs font-bold transition-all"
                      style={{
                        borderColor: isDone ? accentColor : "rgba(255,255,255,0.12)",
                        background: isDone ? accentColor : "transparent",
                        color: isDone ? "#fff" : "transparent",
                      }}
                    >
                      {isDone ? "\u2713" : ""}
                    </span>

                    {/* Label */}
                    <span
                      className="text-sm leading-relaxed transition-all"
                      style={{
                        color: isDone ? "rgba(255,255,255,0.4)" : "#ccc",
                        textDecoration: isDone ? "line-through" : "none",
                      }}
                      dangerouslySetInnerHTML={{ __html: label }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Progress bar */}
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(doneCount / items.length) * 100}%`,
                background: accentColor,
              }}
            />
          </div>
        </div>

        {/* Continue button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onComplete}
            disabled={!canContinue}
            className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: canContinue ? accentColor : "rgba(255,255,255,0.08)",
            }}
          >
            Continue &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
