"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { QuestionCard } from "@/components/test/question-card";
import type { Question } from "@/types/question";
import type { MasteryDeltaRow } from "@/lib/mastery-delta";

interface PracticeResultsCardProps {
  questions: Question[];
  answers: Record<number, string>;
  timeSpent: number;  // seconds
  saveError: boolean;
  fallbackNotes?: string[];
  masteryDeltas?: MasteryDeltaRow[];
  course?: string;
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
  masteryDeltas,
  course,
  onPracticeAgain,
  onExit,
}: PracticeResultsCardProps) {
  const [showAllDeltas, setShowAllDeltas] = useState(false);

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
      <GlassCard raised className="text-center">
        <div className="kicker mb-2">Practice Results</div>
        <h2 className="mb-2 font-display text-[3rem] leading-none text-ink">
          {correctCount}/{total}
        </h2>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-3">
          {percent}% &middot; {formatDuration(timeSpent)}
        </p>

        {saveError && (
          <p className="mt-4 border-2 border-accent bg-accent-soft px-4 py-2 text-xs text-accent">
            Your score couldn&apos;t be saved. Please refresh and try again.
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {onPracticeAgain && (
            <button
              onClick={onPracticeAgain}
              className="border-2 border-ink bg-accent px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-accent-fg transition hover:bg-ink hover:text-paper"
            >
              Practice again
            </button>
          )}
          <button
            onClick={onExit}
            className="border-2 border-ink px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-ink hover:text-paper"
          >
            Back
          </button>
        </div>
      </GlassCard>

      {/* Session performance (mastery delta breakdown) */}
      {masteryDeltas && masteryDeltas.length > 0 && (
        <GlassCard>
          <div className="mb-3 kicker">Session performance</div>
          <div className="flex flex-col">
            {(showAllDeltas ? masteryDeltas : masteryDeltas.slice(0, 5)).map((row, idx) => {
              const accPct =
                row.sessionTotal > 0
                  ? Math.round((row.sessionCorrect / row.sessionTotal) * 100)
                  : 0;
              const deltaColor =
                row.deltaPp > 0
                  ? "text-green"
                  : row.deltaPp < 0
                  ? "text-accent"
                  : "text-ink-3";
              const deltaSign = row.deltaPp > 0 ? "+" : "";
              const bigJump = row.deltaPp >= 10;

              const nameNode = course ? (
                <Link
                  href={`/skills/${course}/${row.taxonomyKey}`}
                  className="font-display text-base text-ink transition hover:text-accent"
                >
                  {row.skillLabel}
                </Link>
              ) : (
                <span className="font-display text-base text-ink">{row.skillLabel}</span>
              );

              return (
                <div
                  key={row.taxonomyKey}
                  className={`flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4 ${
                    idx > 0 ? "border-t-2 border-rule-hair" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    {nameNode}
                    <div className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
                      {row.sessionTotal > 0 ? (
                        <>
                          <span className="text-ink">
                            {row.sessionCorrect}/{row.sessionTotal}
                          </span>
                          <span className="ml-2">this session</span>
                        </>
                      ) : (
                        <span>All questions skipped</span>
                      )}
                    </div>
                  </div>
                  {row.sessionTotal > 0 && (
                    <div className="hidden h-1.5 w-28 bg-rule-hair sm:block">
                      <div
                        className="h-full bg-ink"
                        style={{ width: `${Math.max(accPct, 3)}%` }}
                      />
                    </div>
                  )}
                  <div className="text-right font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
                    {row.beforeTested ? (
                      <>
                        <div className="text-ink-3">
                          Mastery <span className="text-ink">{row.afterPercent}%</span>
                        </div>
                        <div className={deltaColor}>
                          {deltaSign}
                          {row.deltaPp}pp {bigJump && <span className="ml-1">↑ big jump</span>}
                        </div>
                      </>
                    ) : (
                      <div className="text-ink-3">
                        Fresh — <span className="text-ink">{row.afterPercent}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {masteryDeltas.length > 5 && (
            <button
              onClick={() => setShowAllDeltas(!showAllDeltas)}
              className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent transition hover:text-ink"
            >
              {showAllDeltas
                ? "Show fewer"
                : `+${masteryDeltas.length - 5} more skill${masteryDeltas.length - 5 === 1 ? "" : "s"}`}
            </button>
          )}
        </GlassCard>
      )}

      {/* Skill breakdown (only if multi-skill) */}
      {showBreakdown && (
        <GlassCard>
          <h3 className="mb-3 kicker">Skill Breakdown</h3>
          <div className="flex flex-col">
            {Array.from(bySkill.entries())
              .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
              .map(([sk, row], idx) => {
                const pct = row.total > 0 ? row.correct / row.total : 0;
                return (
                  <div
                    key={sk}
                    className={`flex items-center gap-3 py-2 text-xs ${
                      idx > 0 ? "border-t-2 border-rule-hair" : ""
                    }`}
                  >
                    <span className="w-40 truncate font-body text-ink" title={sk}>
                      {sk}
                    </span>
                    <div className="h-1.5 flex-1 bg-rule-hair">
                      <div
                        className="h-full bg-ink"
                        style={{ width: `${Math.max(pct * 100, 3)}%` }}
                      />
                    </div>
                    <span className="w-14 text-right font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
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
        <div className="border-2 border-amber bg-amber-soft p-4">
          <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber">
            Note
          </div>
          {fallbackNotes.map((note, i) => (
            <p key={i} className="font-body text-sm italic text-ink">
              {note}
            </p>
          ))}
        </div>
      )}

      {/* Per-question review */}
      <GlassCard>
        <h3 className="mb-4 kicker">Question Review</h3>
        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={i}
              className="border-t-2 border-rule-hair pt-5 first:border-0 first:pt-0"
            >
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
