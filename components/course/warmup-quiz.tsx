"use client";

import { useState } from "react";
import type { WarmupQuestion } from "@/types/module";
import { renderMath } from "@/lib/katex-render";
import { AnimatedCheck, AnimatedX } from "@/components/icons";

interface WarmupQuizProps {
  questions: WarmupQuestion[];
  accentColor: string;
  onComplete: (score: number, total: number) => void;
}

export function WarmupQuiz({ questions, accentColor, onComplete }: WarmupQuizProps) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const done = idx >= questions.length;
  const q = !done ? questions[idx] : null;
  const score = results.filter(Boolean).length;

  function handleSelect(ci: number) {
    if (confirmed) return;
    setSelected(ci);
    setConfirmed(true);
    setResults((r) => [...r, ci === q!.correct]);
  }

  function next() {
    setSelected(null);
    setConfirmed(false);
    setIdx((i) => i + 1);
  }

  if (done) {
    const msg =
      score === questions.length
        ? "Perfect recall! Previous knowledge is locked in."
        : score >= questions.length * 0.6
          ? "Good recall! A couple of topics to revisit."
          : "Some gaps — consider a quick review.";
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10 text-center">
        <span
          className="mb-4 inline-block rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-[2px] text-white"
          style={{ backgroundColor: accentColor }}
        >
          Warm-Up Complete
        </span>
        <div className="mb-2 font-mono text-[3rem] font-bold" style={{ color: accentColor }}>
          {score} / {questions.length}
        </div>
        <p className="mb-6 text-[.9rem] text-text-muted">{msg}</p>
        <button
          onClick={() => onComplete(score, questions.length)}
          className="cursor-pointer rounded-lg border-none px-8 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
          style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
        >
          Continue to Lesson →
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[700px] px-5 pb-16 pt-14">
      {/* Progress dots */}
      <div className="mb-8 flex justify-center gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i < results.length
                  ? results[i]
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

      {/* Source tag */}
      {q!.source && (
        <div className="mb-4 text-[.78rem] font-bold uppercase tracking-wider text-text-muted">
          From {q!.source}
        </div>
      )}

      {/* Question */}
      <div className="mb-6 text-[.93rem] leading-[1.7] text-[#ddd]">{renderMath(q!.stem)}</div>

      {/* Choices */}
      <div className="mb-6 flex flex-col gap-1.5">
        {q!.choices.map((ch, ci) => {
          let cls = "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-[.88rem] transition-all";
          if (confirmed) {
            if (ci === q!.correct) cls += " border-accent-green bg-[rgba(34,197,94,.07)]";
            else if (ci === selected && ci !== q!.correct) cls += " border-accent-red bg-[rgba(239,68,68,.07)]";
            else cls += " pointer-events-none border-border-default opacity-70";
          } else {
            cls += " border-border-default bg-bg-deep hover:border-[var(--color-accent-blue)] hover:bg-[rgba(96,165,250,.07)]";
          }
          return (
            <button key={ci} onClick={() => handleSelect(ci)} className={cls} disabled={confirmed}>
              <span className="min-w-[20px] font-bold text-text-muted">
                {String.fromCharCode(65 + ci)}
              </span>
              <span>{renderMath(ch)}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {confirmed && (
        <div className="mb-6 rounded-lg border-l-[3px] border-l-accent-green bg-bg-deep p-3 text-[.85rem] leading-relaxed text-text-muted">
          <span className="mr-1 inline-flex align-middle">{selected === q!.correct ? <AnimatedCheck size={16} /> : <AnimatedX size={16} />}</span>
          {renderMath(q!.explanation)}
        </div>
      )}

      {/* Next button */}
      {confirmed && (
        <div className="flex justify-center">
          <button
            onClick={next}
            className="cursor-pointer rounded-lg border-none px-6 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
          >
            {idx < questions.length - 1 ? "Next Question →" : "See Results →"}
          </button>
        </div>
      )}
    </div>
  );
}
