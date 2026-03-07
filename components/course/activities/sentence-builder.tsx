"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";
import { AnimatedCheck, AnimatedX } from "@/components/icons";

export interface SentenceItem {
  clauses: [string, string];
  options: string[];
  correct: number;
  explanation: string;
}

interface SentenceBuilderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  items: SentenceItem[];
  accentColor: string;
  onComplete: (score: number, total: number) => void;
}

export function SentenceBuilder({
  title,
  subtitle,
  icon,
  items,
  accentColor,
  onComplete,
}: SentenceBuilderProps) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = items[idx];

  function handleSelect(ci: number) {
    if (confirmed) return;
    setSelected(ci);
    setConfirmed(true);
    if (ci === item.correct) setScore((s) => s + 1);
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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10 text-center">
        <div className="mb-4 text-5xl">{icon || "🔧"}</div>
        <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">{title} — Complete</h2>
        <div className="mb-2 font-mono text-[3rem] font-bold" style={{ color: accentColor }}>
          {score}/{items.length}
        </div>
        <button
          onClick={() => onComplete(score, items.length)}
          className="cursor-pointer rounded-lg border-none px-8 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
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

      <div className="mb-6 flex flex-wrap gap-1.5">
        {items.map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < idx ? accentColor : i === idx ? accentColor : "var(--color-border-default)",
              transform: i === idx ? "scale(1.25)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Clauses */}
      <div className="mb-6 rounded-xl border border-border-default bg-bg-surface p-5">
        <div className="mb-2 text-[.72rem] font-bold uppercase tracking-wider text-text-muted">Combine these clauses:</div>
        <div className="space-y-2">
          <div className="rounded-lg bg-bg-deep px-4 py-2.5 text-[.93rem] text-[#ddd]">
            {renderMath(item.clauses[0])}
          </div>
          <div className="text-center text-text-muted">+</div>
          <div className="rounded-lg bg-bg-deep px-4 py-2.5 text-[.93rem] text-[#ddd]">
            {renderMath(item.clauses[1])}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="mb-6 flex flex-col gap-1.5">
        {item.options.map((opt, ci) => {
          let cls = "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-[.88rem] transition-all";
          if (confirmed) {
            if (ci === item.correct) cls += " border-accent-green bg-[rgba(34,197,94,.07)]";
            else if (ci === selected && ci !== item.correct) cls += " border-accent-red bg-[rgba(239,68,68,.07)]";
            else cls += " pointer-events-none border-border-default opacity-70";
          } else {
            cls += " border-border-default bg-bg-deep hover:border-[var(--color-accent-blue)] hover:bg-[rgba(96,165,250,.07)]";
          }
          return (
            <button key={ci} onClick={() => handleSelect(ci)} className={cls} disabled={confirmed}>
              <span className="min-w-[20px] font-bold text-text-muted">{String.fromCharCode(65 + ci)}</span>
              <span>{renderMath(opt)}</span>
            </button>
          );
        })}
      </div>

      {confirmed && (
        <div
          className="mb-6 rounded-lg border-l-[3px] bg-bg-deep p-3 text-[.85rem] leading-relaxed text-text-muted"
          style={{ borderLeftColor: selected === item.correct ? "var(--color-accent-green)" : "var(--color-accent-red)" }}
        >
          <span className="mr-1 inline-flex align-middle">{selected === item.correct ? <AnimatedCheck size={16} /> : <AnimatedX size={16} />}</span>
          {selected === item.correct ? "Correct! " : "Incorrect. "}
          {renderMath(item.explanation)}
        </div>
      )}

      {confirmed && (
        <div className="flex justify-center">
          <button
            onClick={next}
            className="cursor-pointer rounded-lg border-none px-6 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
          >
            {idx < items.length - 1 ? "Next →" : "See Results →"}
          </button>
        </div>
      )}
    </div>
  );
}
