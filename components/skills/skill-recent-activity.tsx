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
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Recent activity
        </div>
        <p className="text-xs text-text-muted">
          No sessions yet &mdash; tap Practice below to start building your history.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Recent activity
      </div>
      <div className="flex gap-2">
        {recent.map((a) => {
          const skipped = !a.selectedAnswer;
          const bg = skipped
            ? "bg-slate-500"
            : a.correct
            ? "bg-emerald-400"
            : "bg-red-400";
          return (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className={`h-6 w-6 rounded ${bg} transition hover:scale-110`}
              title={skipped ? "Skipped" : a.correct ? "Correct" : "Incorrect"}
            />
          );
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-radius-md border border-border-default bg-bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="text-xs text-text-muted">
                {selected.domain} &middot; {selected.skill}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-text-muted hover:text-text-secondary"
              >
                ✕
              </button>
            </div>
            <div className="mb-4 text-sm text-text-primary">
              {renderMath(selected.stem || "")}
            </div>
            {selected.choices && selected.choices.length > 0 && (
              <div className="mb-4 flex flex-col gap-1.5">
                {selected.choices.map((c) => {
                  const isUser = c.key === selected.selectedAnswer;
                  const isCorrect = c.key === selected.correctAnswer;
                  let cls = "bg-bg-secondary text-text-muted";
                  if (isCorrect) cls = "bg-emerald-400/15 text-emerald-300";
                  else if (isUser) cls = "bg-red-400/15 text-red-300";
                  return (
                    <div
                      key={c.key}
                      className={`flex gap-2 rounded-md px-3 py-1.5 text-xs ${cls}`}
                    >
                      <span className="font-bold">{c.key}.</span>
                      <span className="flex-1">{renderMath(c.text)}</span>
                      {isUser && <span className="text-[10px]">your answer</span>}
                      {isCorrect && !isUser && <span className="text-[10px]">correct</span>}
                    </div>
                  );
                })}
              </div>
            )}
            {selected.explanation && (
              <div className="rounded-radius-sm border border-border-default bg-bg-surface p-3 text-xs text-text-secondary">
                <div className="mb-1 font-semibold text-text-muted">Explanation</div>
                {renderMath(selected.explanation)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
