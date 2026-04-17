"use client";

import { useState, useEffect, useCallback } from "react";
import type { QuizQuestion } from "@/types/module";
import { renderMath } from "@/lib/katex-render";
import { AnimatedCheck, AnimatedX } from "@/components/icons";

interface QuizEngineProps {
  questions: QuizQuestion[];
  title: string;
  accentColor: string;
  timed?: boolean;
  timerSeconds?: number;
  showTraps?: boolean;
  onComplete: (score: number, total: number, answers: (number | null)[]) => void;
  /** Optional: called after each answer for adaptive tracking */
  onAnswer?: (question: QuizQuestion, selectedIndex: number, correct: boolean) => void;
}

export function QuizEngine({
  questions,
  title,
  accentColor,
  timed,
  timerSeconds = 600,
  showTraps,
  onComplete,
  onAnswer,
}: QuizEngineProps) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);

  const done = idx >= questions.length;
  const q = !done ? questions[idx] : null;
  const score = answers.filter((a, i) => a === questions[i]?.correct).length;

  const finish = useCallback(() => {
    const finalAnswers = [...answers];
    while (finalAnswers.length < questions.length) finalAnswers.push(null);
    const finalScore = finalAnswers.filter((a, i) => a === questions[i]?.correct).length;
    onComplete(finalScore, questions.length, finalAnswers);
  }, [answers, questions, onComplete]);

  // Timer
  useEffect(() => {
    if (!timed || done) return;
    if (timeLeft <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timed, timeLeft, done, finish]);

  function handleSelect(ci: number) {
    if (confirmed) return;
    setSelected(ci);
    setConfirmed(true);
    setAnswers((a) => [...a, ci]);
    if (onAnswer && q) {
      onAnswer(q, ci, ci === q.correct);
    }
  }

  function next() {
    if (idx >= questions.length - 1) {
      const finalAnswers = [...answers];
      if (finalAnswers.length < questions.length) finalAnswers.push(selected);
      const finalScore = finalAnswers.filter((a, i) => a === questions[i]?.correct).length;
      onComplete(finalScore, questions.length, finalAnswers);
    } else {
      setSelected(null);
      setConfirmed(false);
      setIdx((i) => i + 1);
    }
  }

  if (done) return null;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerColor = timeLeft <= 30 ? "var(--color-accent-red)" : timeLeft <= 120 ? "var(--color-accent-amber)" : "var(--color-accent-green)";

  return (
    <div className="mx-auto min-h-screen max-w-[700px] px-5 pb-16 pt-14">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary">{title}</h2>
          <div className="text-[.82rem] text-text-muted">
            Question {idx + 1} of {questions.length}
            {q!.difficulty && (
              <span className="ml-2 rounded bg-bg-surface px-2 py-0.5 text-[.75rem] font-bold uppercase">
                {q!.difficulty}
              </span>
            )}
            {q!.type && (
              <span className="ml-2 rounded bg-bg-surface px-2 py-0.5 text-[.75rem] text-text-muted">
                {q!.type}
              </span>
            )}
          </div>
        </div>
        {timed && (
          <div className="font-mono text-lg font-bold" style={{ color: timerColor }}>
            {mins}:{secs.toString().padStart(2, "0")}
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i < answers.length
                  ? answers[i] === questions[i].correct
                    ? "var(--color-accent-green)"
                    : "var(--color-accent-red)"
                  : i === idx
                    ? accentColor
                    : "var(--color-border-default)",
              transform: i === idx ? "scale(1.25)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Passage */}
      {q!.passage && (
        <div className="mb-6 rounded-xl border border-border-default bg-bg-surface p-4 text-[.9rem] leading-[1.7] text-[#ccc]">
          {renderMath(q!.passage)}
        </div>
      )}

      {/* Stem */}
      <div className="mb-6 text-[.93rem] leading-[1.7] text-[#ddd]">{renderMath(q!.stem)}</div>

      {/* Choices */}
      <div className="mb-6 flex flex-col gap-1.5">
        {q!.choices.map((ch, ci) => {
          const isCorrect = ci === q!.correct;
          const isSelected = ci === selected;
          const isTrap = showTraps && confirmed && q!.trapAnswer === ci;
          let cls = "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-[.88rem] transition-all";
          if (confirmed) {
            if (isCorrect) cls += " border-accent-green bg-[rgba(34,197,94,.07)]";
            else if (isSelected && !isCorrect) cls += " border-accent-red bg-[rgba(239,68,68,.07)]";
            else cls += " pointer-events-none border-border-default opacity-70";
          } else {
            cls += " border-border-default bg-bg-deep hover:border-[var(--color-accent-blue)] hover:bg-[rgba(96,165,250,.07)]";
          }
          return (
            <button key={ci} onClick={() => handleSelect(ci)} className={cls} disabled={confirmed}>
              <span className="min-w-[20px] font-bold text-text-muted">
                {String.fromCharCode(65 + ci)}
              </span>
              <span className="flex-1">{renderMath(ch)}</span>
              {isTrap && q!.trap && (
                <span className="rounded bg-[rgba(249,115,22,.15)] px-2 py-0.5 text-[.72rem] font-bold text-[var(--color-accent)]">
                  TRAP: {q!.trap}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {confirmed && (
        <div
          className="mb-6 rounded-lg border-l-[3px] bg-bg-deep p-3 text-[.85rem] leading-relaxed text-text-muted"
          style={{ borderLeftColor: selected === q!.correct ? "var(--color-accent-green)" : "var(--color-accent-red)" }}
        >
          <span className="mr-1 inline-flex align-middle">{selected === q!.correct ? <AnimatedCheck size={16} /> : <AnimatedX size={16} />}</span>
          {selected === q!.correct ? "Correct! " : "Incorrect. "}
          {renderMath(q!.explanation)}
          {showTraps && confirmed && q!.trapDesc && selected === q!.trapAnswer && (
            <div className="mt-2 rounded bg-[rgba(249,115,22,.08)] p-2 text-[.82rem] text-[var(--color-accent)]">
              🪤 Trap: {q!.trapDesc}
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      {confirmed && (
        <div className="flex justify-center">
          <button
            onClick={next}
            className="cursor-pointer rounded-lg border-none px-6 py-2.5 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
          >
            {idx < questions.length - 1 ? "Next Question →" : "See Results →"}
          </button>
        </div>
      )}
    </div>
  );
}
