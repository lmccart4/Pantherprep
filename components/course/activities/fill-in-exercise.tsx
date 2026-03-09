"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";
import { AnimatedCheck, AnimatedX } from "@/components/icons";

export interface FillInItem {
  prompt: string;
  answer: number | string;
  tolerance?: number;
  solution: string;
  tier?: number;
}

interface FillInExerciseProps {
  title: string;
  subtitle?: string;
  icon?: string;
  items: FillInItem[];
  accentColor: string;
  onComplete: (score: number, total: number) => void;
}

export function FillInExercise({
  title,
  subtitle,
  icon,
  items,
  accentColor,
  onComplete,
}: FillInExerciseProps) {
  const [answers, setAnswers] = useState<Record<number, { value: string; checked: boolean; correct: boolean }>>({});

  const total = items.length;
  const checked = items.filter((_, i) => answers[i]?.checked).length;
  const correct = items.filter((_, i) => answers[i]?.correct).length;
  const allDone = checked >= total;

  function checkAnswer(i: number) {
    const a = answers[i];
    if (!a || a.checked) return;
    const item = items[i];
    let isCorrect: boolean;
    if (typeof item.answer === "string") {
      isCorrect = a.value.trim().toLowerCase() === item.answer.trim().toLowerCase();
    } else {
      const val = parseFloat(a.value);
      const tol = item.tolerance ?? 0.01;
      isCorrect = !isNaN(val) && Math.abs(val - item.answer) <= tol;
    }
    setAnswers((prev) => ({ ...prev, [i]: { ...prev[i], checked: true, correct: isCorrect } }));
  }

  return (
    <div className="mx-auto min-h-screen max-w-[700px] px-5 pb-16 pt-14">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-text-primary">{icon} {title}</h2>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
        <div className="mt-2 text-[.82rem] text-text-muted">
          {checked}/{total} answered · {correct} correct
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => {
          const a = answers[i];
          const isText = typeof item.answer === "string";
          return (
            <div key={i} className="rounded-xl border border-border-default bg-bg-surface p-4">
              {item.tier && (
                <span
                  className="mb-2 inline-block rounded px-2 py-0.5 text-[.72rem] font-bold uppercase"
                  style={{
                    backgroundColor: item.tier === 1 ? "rgba(34,197,94,.1)" : "rgba(251,191,36,.1)",
                    color: item.tier === 1 ? "var(--color-accent-green)" : "var(--color-accent-amber)",
                  }}
                >
                  {item.tier === 1 ? "Easy" : item.tier === 2 ? "Medium" : "Hard"}
                </span>
              )}
              <div className="mb-3 text-[.93rem] leading-[1.7] text-[#ddd]">{renderMath(item.prompt)}</div>
              <div className="flex items-center gap-3">
                <span className="text-[.85rem] text-text-muted">Answer:</span>
                <input
                  type={isText ? "text" : "number"}
                  step={isText ? undefined : "any"}
                  placeholder="?"
                  value={a?.value ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [i]: { value: e.target.value, checked: false, correct: false },
                    }))
                  }
                  disabled={a?.checked}
                  className={`${isText ? "w-36" : "w-24"} rounded-lg border border-border-default bg-bg-deep px-3 py-2 font-mono text-base text-text-primary focus:border-[var(--color-accent-blue)] focus:outline-none disabled:opacity-60`}
                />
                {!a?.checked && (
                  <button
                    onClick={() => checkAnswer(i)}
                    className="cursor-pointer rounded-lg border-none px-4 py-2 text-sm font-bold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    Check
                  </button>
                )}
              </div>
              {a?.checked && (
                <div
                  className="mt-3 rounded-lg border-l-[3px] bg-bg-deep p-3 text-[.85rem] leading-relaxed text-text-muted"
                  style={{ borderLeftColor: a.correct ? "var(--color-accent-green)" : "var(--color-accent-red)" }}
                >
                  <span className="mr-1 inline-flex align-middle">{a.correct ? <AnimatedCheck size={16} /> : <AnimatedX size={16} />}</span>
                  {a.correct ? "Correct! " : "Not quite. "}
                  {renderMath(item.solution)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => onComplete(correct, total)}
            className="cursor-pointer rounded-lg border-none px-8 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
