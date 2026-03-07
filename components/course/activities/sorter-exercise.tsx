"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";
import { AnimatedCheck, AnimatedX } from "@/components/icons";

export interface SorterItem {
  text: string;
  correct: string;
}

interface SorterExerciseProps {
  title: string;
  subtitle?: string;
  icon?: string;
  items: SorterItem[];
  buckets: string[];
  accentColor: string;
  onComplete: (score: number, total: number) => void;
}

export function SorterExercise({
  title,
  subtitle,
  icon,
  items,
  buckets,
  accentColor,
  onComplete,
}: SorterExerciseProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState(false);

  const total = items.length;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === total;
  const score = Object.entries(answers).filter(([i, a]) => a === items[Number(i)].correct).length;

  function assign(itemIdx: number, bucket: string) {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [itemIdx]: bucket }));
  }

  function reveal() {
    setRevealed(true);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[700px] px-5 pb-16 pt-14">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-text-primary">{icon} {title}</h2>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
        <div className="mt-2 text-[.82rem] text-text-muted">
          {answered}/{total} sorted{revealed ? ` · ${score} correct` : ""}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => {
          const assigned = answers[i];
          const isCorrect = assigned === item.correct;
          return (
            <div
              key={i}
              className="rounded-xl border bg-bg-surface p-4"
              style={{
                borderColor: revealed
                  ? isCorrect
                    ? "var(--color-accent-green)"
                    : "var(--color-accent-red)"
                  : "var(--color-border-default)",
              }}
            >
              <div className="mb-3 text-[.93rem] leading-[1.7] text-[#ddd]">{renderMath(item.text)}</div>
              <div className="flex flex-wrap gap-1.5">
                {buckets.map((b) => {
                  const isActive = assigned === b;
                  return (
                    <button
                      key={b}
                      onClick={() => assign(i, b)}
                      disabled={revealed}
                      className="cursor-pointer rounded-lg border px-3 py-1.5 text-[.82rem] font-medium transition-all"
                      style={{
                        backgroundColor: isActive ? `${accentColor}15` : "transparent",
                        borderColor: isActive ? accentColor : "var(--color-border-default)",
                        color: isActive ? accentColor : "var(--color-text-secondary)",
                      }}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
              {revealed && !isCorrect && (
                <div className="mt-2 text-[.82rem] text-text-muted">
                  Correct: <strong style={{ color: "var(--color-accent-green)" }}>{item.correct}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        {!revealed && allAnswered && (
          <button
            onClick={reveal}
            className="cursor-pointer rounded-lg border-none px-8 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
          >
            Check Answers
          </button>
        )}
        {revealed && (
          <button
            onClick={() => onComplete(score, total)}
            className="cursor-pointer rounded-lg border-none px-8 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
