"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { QuestionCard } from "@/components/test/question-card";
import type { Question } from "@/types/question";

interface PracticeResultsCardProps {
  questions: Question[];
  answers: Record<number, string>;
  timeSpent: number;  // seconds
  saveError: boolean;
  fallbackNotes?: string[];
  onPracticeAgain?: () => void;
  onExit: () => void;
}

function isCorrect(q: Question, ans: string | undefined): boolean {
  if (ans == null || ans === "") return false;
  const ca = q.correctAnswer.trim();
  const ua = ans.trim();
  if (q.type === "spr") {
    const an = parseFloat(ua);
    const cn = parseFloat(ca);
    if (!isNaN(an) && !isNaN(cn)) return Math.abs(an - cn) < 1e-9;
    return ua.toLowerCase() === ca.toLowerCase();
  }
  return ua.toUpperCase() === ca.toUpperCase();
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function PracticeResultsCard({
  questions,
  answers,
  timeSpent,
  saveError,
  fallbackNotes,
  onPracticeAgain,
  onExit,
}: PracticeResultsCardProps) {
  const correctCount = questions.filter((q, i) => isCorrect(q, answers[i])).length;
  const total = questions.length;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Per-skill breakdown — only shows if more than one skill is represented
  const bySkill = new Map<string, { correct: number; total: number }>();
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const key = q.skill;
    const row = bySkill.get(key) ?? { correct: 0, total: 0 };
    row.total += 1;
    if (isCorrect(q, answers[i])) row.correct += 1;
    bySkill.set(key, row);
  }
  const showBreakdown = bySkill.size > 1;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      {/* Summary */}
      <GlassCard className="text-center">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Practice Results
        </div>
        <h2 className="mb-2 font-display text-[3rem] leading-none text-white">
          {correctCount}/{total}
        </h2>
        <p className="text-sm text-text-muted">
          {percent}% &middot; {formatDuration(timeSpent)}
        </p>

        {saveError && (
          <p className="mt-4 rounded-radius-sm border border-accent-red/20 bg-accent-red-soft px-4 py-2 text-xs text-accent-red">
            Your score couldn&apos;t be saved. Please refresh and try again.
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {onPracticeAgain && (
            <button
              onClick={onPracticeAgain}
              className="rounded-radius-md bg-panther-red px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-panther-red/90"
            >
              Practice again
            </button>
          )}
          <button
            onClick={onExit}
            className="rounded-radius-md border border-border-default px-5 py-2.5 text-sm text-text-secondary transition hover:border-border-light"
          >
            Back
          </button>
        </div>
      </GlassCard>

      {/* Skill breakdown (only if multi-skill) */}
      {showBreakdown && (
        <GlassCard>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Skill Breakdown
          </h3>
          <div className="flex flex-col gap-2">
            {Array.from(bySkill.entries())
              .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
              .map(([sk, row]) => {
                const pct = row.total > 0 ? row.correct / row.total : 0;
                const bar =
                  pct >= 0.8
                    ? "bg-emerald-400"
                    : pct >= 0.6
                    ? "bg-lime-400"
                    : pct >= 0.4
                    ? "bg-amber-400"
                    : "bg-red-400";
                return (
                  <div key={sk} className="flex items-center gap-3 text-xs">
                    <span className="w-40 truncate text-text-secondary" title={sk}>
                      {sk}
                    </span>
                    <div className="flex-1 overflow-hidden rounded-full bg-bg-secondary">
                      <div
                        className={`h-1.5 ${bar}`}
                        style={{ width: `${Math.max(pct * 100, 3)}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-text-muted">
                      {row.correct}/{row.total}
                    </span>
                  </div>
                );
              })}
          </div>
        </GlassCard>
      )}

      {/* Fallback notes */}
      {fallbackNotes && fallbackNotes.length > 0 && (
        <GlassCard>
          <p className="text-xs text-amber-300">
            {fallbackNotes.map((note, i) => (
              <span key={i} className="block">
                {note}
              </span>
            ))}
          </p>
        </GlassCard>
      )}

      {/* Per-question review */}
      <GlassCard>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Question Review
        </h3>
        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div key={i} className="border-b border-border-default pb-5 last:border-0 last:pb-0">
              <QuestionCard
                question={q}
                selectedAnswer={answers[i]}
                onAnswer={() => {}}
                showExplanation={true}
                locked={true}
                questionNumber={i + 1}
              />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
