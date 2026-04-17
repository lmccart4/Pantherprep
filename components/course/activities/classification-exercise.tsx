"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";
import { AnimatedTarget, AnimatedCheck, AnimatedX } from "@/components/icons";

export interface ClassificationItem {
  prompt: string;
  correct: string | number;
  explanation: string;
}

interface ClassificationExerciseProps {
  title: string;
  subtitle?: string;
  icon?: string;
  items: ClassificationItem[];
  categories: string[];
  accentColor: string;
  onComplete: (score: number, total: number) => void;
}

export function ClassificationExercise({
  title,
  subtitle,
  icon,
  items,
  categories,
  accentColor,
  onComplete,
}: ClassificationExerciseProps) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = items[idx];
  const correctAnswer = typeof item.correct === "number" ? categories[item.correct] : item.correct;

  function handleSelect(cat: string) {
    if (confirmed) return;
    setSelected(cat);
    setConfirmed(true);
    if (cat === correctAnswer) setScore((s) => s + 1);
  }

  function next() {
    if (idx < items.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setDone(true);
    }
  }

  if (done) {
    const finalScore = score + (selected === items[items.length - 1]?.correct ? 0 : 0);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10 text-center">
        <div className="mb-4">{icon ? <span className="text-5xl">{icon}</span> : <AnimatedTarget size={48} />}</div>
        <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">{title} — Complete</h2>
        <div className="mb-2 font-mono text-[3rem] font-bold" style={{ color: accentColor }}>
          {finalScore}/{items.length}
        </div>
        <p className="mb-6 text-sm text-text-muted">
          {finalScore === items.length ? "Perfect!" : finalScore >= items.length * 0.7 ? "Good work!" : "Keep practicing!"}
        </p>
        <button
          onClick={() => onComplete(finalScore, items.length)}
          className="cursor-pointer rounded-lg border-none px-8 py-3 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:brightness-110"
          style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
        >
          Continue →
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[700px] px-5 pb-16 pt-14">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-text-primary">{icon} {title}</h2>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
        <div className="mt-2 text-[.82rem] text-text-muted">
          {idx + 1} of {items.length} · Score: {score}
        </div>
      </div>

      {/* Progress dots */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {items.map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i < idx ? accentColor : i === idx ? accentColor : "var(--color-border-default)",
              transform: i === idx ? "scale(1.25)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Item prompt */}
      <div className="mb-6 rounded-xl border border-border-default bg-bg-surface p-5 text-[.93rem] leading-[1.7] text-[#ddd]">
        {renderMath(item.prompt)}
      </div>

      {/* Category options */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {categories.map((cat) => {
          let cls = "cursor-pointer rounded-lg border px-3.5 py-2 text-[.82rem] font-medium transition-all";
          if (confirmed) {
            if (cat === correctAnswer) cls += " border-accent-green bg-[rgba(34,197,94,.07)] text-accent-green";
            else if (cat === selected && cat !== item.correct)
              cls += " border-accent-red bg-[rgba(239,68,68,.07)] text-accent-red";
            else cls += " pointer-events-none border-border-default opacity-60 text-text-muted";
          } else {
            cls += " border-border-default text-text-secondary hover:border-[var(--color-accent-blue)] hover:bg-[rgba(96,165,250,.07)]";
          }
          return (
            <button key={cat} onClick={() => handleSelect(cat)} className={cls} disabled={confirmed}>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {confirmed && (
        <div
          className="mb-6 rounded-lg border-l-[3px] bg-bg-deep p-3 text-[.85rem] leading-relaxed text-text-muted"
          style={{ borderLeftColor: selected === correctAnswer ? "var(--color-accent-green)" : "var(--color-accent-red)" }}
        >
          <span className="mr-1 inline-flex align-middle">{selected === correctAnswer ? <AnimatedCheck size={16} /> : <AnimatedX size={16} />}</span>
          {selected === correctAnswer ? "Correct! " : "Incorrect. "}
          {renderMath(item.explanation)}
        </div>
      )}

      {confirmed && (
        <div className="flex justify-center">
          <button
            onClick={next}
            className="cursor-pointer rounded-lg border-none px-6 py-2.5 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
          >
            {idx < items.length - 1 ? "Next →" : "See Results →"}
          </button>
        </div>
      )}
    </div>
  );
}
