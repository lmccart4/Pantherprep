"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";
import type { StoredAnswer } from "@/lib/adaptive/performance-service";

interface SkillRecentActivityProps {
  answers: StoredAnswer[];  // expected ordered desc by timestamp
}

export function SkillRecentActivity({ answers }: SkillRecentActivityProps) {
  const recent = answers.slice(0, 5);
  const [selected, setSelected] = useState<StoredAnswer | null>(null);

  if (recent.length === 0) {
    return (
      <div>
        <div className="mb-2 kicker">Recent activity</div>
        <p className="font-body text-[13px] italic text-ink-3">
          No sessions yet &mdash; tap Practice below to start building your history.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 kicker">Recent activity</div>
      <div className="flex flex-col">
        {recent.map((a, i) => {
          const skipped = !a.selectedAnswer;
          const dot = skipped ? "bg-ink-4" : a.correct ? "bg-green" : "bg-accent";
          const label = skipped ? "Skipped" : a.correct ? "Correct" : "Missed";
          const labelColor = skipped ? "text-ink-3" : a.correct ? "text-green" : "text-accent";
          return (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className={`flex items-center justify-between gap-3 border-b border-dashed border-rule-hair py-2 text-left transition-colors hover:bg-paper-2 ${
                i === recent.length - 1 ? "border-b-0" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 ${dot}`} />
                <span className="font-body text-[13px] text-ink-2">
                  {(a.difficulty ?? "M") === "F" ? "Easy" : (a.difficulty ?? "M") === "C" ? "Hard" : "Medium"}
                </span>
              </div>
              <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${labelColor}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-xl overflow-y-auto border-2 border-ink bg-paper-card p-6 shadow-[5px_5px_0_var(--color-ink)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3 border-b border-rule-hair pb-3">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
                {selected.domain} &middot; {selected.skill}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="font-mono text-[12px] font-bold text-ink-3 hover:text-accent"
              >
                ✕
              </button>
            </div>
            <div className="mb-4 font-body text-[15px] leading-[1.55] text-ink">
              {renderMath(selected.stem || "")}
            </div>
            {selected.choices && selected.choices.length > 0 && (
              <div className="mb-4 flex flex-col gap-2">
                {selected.choices.map((c) => {
                  const isUser = c.key === selected.selectedAnswer;
                  const isCorrect = c.key === selected.correctAnswer;
                  let cls = "border-rule-hair bg-paper-card text-ink-2";
                  if (isCorrect) cls = "border-green bg-green-soft text-ink";
                  else if (isUser) cls = "border-accent bg-accent-soft text-ink";
                  return (
                    <div
                      key={c.key}
                      className={`flex gap-3 border-2 px-3 py-2 font-body text-[13px] ${cls}`}
                    >
                      <span className="font-mono text-[11px] font-bold">{c.key}.</span>
                      <span className="flex-1">{renderMath(c.text)}</span>
                      {isUser && (
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                          your pick
                        </span>
                      )}
                      {isCorrect && !isUser && (
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-green">
                          correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {selected.explanation && (
              <div className="border-2 border-ink bg-paper-2 p-4">
                <div className="mb-2 kicker">Why</div>
                <div className="font-body text-[13px] italic leading-[1.55] text-ink-2">
                  {renderMath(selected.explanation)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
