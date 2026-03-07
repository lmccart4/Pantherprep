"use client";

import { useState, useCallback } from "react";
import type { QuizQuestion } from "@/types/module";
import { renderMath } from "@/lib/katex-render";
import { AnimatedTrophy, AnimatedSkull, AnimatedSwords, AnimatedFire, AnimatedShield, AnimatedCheck, AnimatedX } from "@/components/icons";

interface BossBattleProps {
  questions: QuizQuestion[];
  title: string;
  accentColor: string;
  onComplete: (score: number, total: number) => void;
}

export function BossBattle({ questions, title, accentColor, onComplete }: BossBattleProps) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [playerHP, setPlayerHP] = useState(100);
  const [bossHP, setBossHP] = useState(100);
  const [combo, setCombo] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const dmgPerQ = 100 / questions.length;
  const q = questions[idx];

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
  }, []);

  function handleSelect(ci: number) {
    if (confirmed) return;
    setSelected(ci);
    setConfirmed(true);
    const isCorrect = ci === q.correct;
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const dmg = dmgPerQ * (1 + newCombo * 0.1);
      setBossHP((hp) => Math.max(0, hp - dmg));
      setScore((s) => s + 1);
      triggerShake();
    } else {
      setCombo(0);
      setPlayerHP((hp) => Math.max(0, hp - dmgPerQ * 0.5));
    }
  }

  function next() {
    if (idx >= questions.length - 1 || bossHP <= 0 || playerHP <= 0) {
      setDone(true);
    } else {
      setSelected(null);
      setConfirmed(false);
      setIdx((i) => i + 1);
    }
  }

  if (done) {
    const won = bossHP <= 0 || score >= questions.length * 0.7;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10 text-center">
        <div className="mb-4">{won ? <AnimatedTrophy size={64} /> : <AnimatedSkull size={64} />}</div>
        <h1 className="mb-2 font-display text-[2rem] font-bold text-text-primary">
          {won ? "Boss Defeated!" : "Defeated!"}
        </h1>
        <div className="mb-2 font-mono text-[3rem] font-bold" style={{ color: accentColor }}>
          {score}/{questions.length}
        </div>
        <p className="mb-1 text-sm text-text-muted">Max Combo: {combo}x</p>
        <p className="mb-6 text-sm text-text-muted">
          {won ? "Outstanding performance!" : "Review the lessons and try again!"}
        </p>
        <button
          onClick={() => onComplete(score, questions.length)}
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
      {/* Battle header */}
      <div className="mb-6 text-center">
        <h2 className="mb-1 flex items-center justify-center gap-2 font-display text-xl font-bold text-text-primary"><AnimatedSwords size={24} /> {title}</h2>
        <div className="text-[.82rem] text-text-muted">
          Question {idx + 1} of {questions.length}
          {combo > 1 && (
            <span className="ml-2 inline-flex items-center gap-1 font-bold" style={{ color: accentColor }}>
              <AnimatedFire size={16} /> {combo}x Combo!
            </span>
          )}
        </div>
      </div>

      {/* HP Bars */}
      <div className="mb-8 space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-[.78rem] font-bold">
            <span className="inline-flex items-center gap-1 text-accent-green"><AnimatedShield size={16} /> You</span>
            <span className="text-text-muted">{Math.round(playerHP)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-border-default">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${playerHP}%`, backgroundColor: playerHP > 30 ? "var(--color-accent-green)" : "var(--color-accent-red)" }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[.78rem] font-bold">
            <span style={{ color: accentColor }}>👹 Boss</span>
            <span className="text-text-muted">{Math.round(bossHP)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-border-default">
            <div
              className={`h-full rounded-full transition-all duration-500 ${shaking ? "animate-[shake_0.4s_ease]" : ""}`}
              style={{ width: `${bossHP}%`, backgroundColor: accentColor }}
            />
          </div>
        </div>
      </div>

      {/* Passage */}
      {q.passage && (
        <div className="mb-6 rounded-xl border border-border-default bg-bg-surface p-4 text-[.9rem] leading-[1.7] text-[#ccc]">
          {renderMath(q.passage)}
        </div>
      )}

      {/* Stem */}
      <div className="mb-6 text-[.93rem] leading-[1.7] text-[#ddd]">{renderMath(q.stem)}</div>

      {/* Choices */}
      <div className="mb-6 flex flex-col gap-1.5">
        {q.choices.map((ch, ci) => {
          let cls = "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-[.88rem] transition-all";
          if (confirmed) {
            if (ci === q.correct) cls += " border-accent-green bg-[rgba(34,197,94,.07)]";
            else if (ci === selected && ci !== q.correct) cls += " border-accent-red bg-[rgba(239,68,68,.07)]";
            else cls += " pointer-events-none border-border-default opacity-70";
          } else {
            cls += " border-border-default bg-bg-deep hover:border-[var(--color-accent-blue)] hover:bg-[rgba(96,165,250,.07)]";
          }
          return (
            <button key={ci} onClick={() => handleSelect(ci)} className={cls} disabled={confirmed}>
              <span className="min-w-[20px] font-bold text-text-muted">{String.fromCharCode(65 + ci)}</span>
              <span>{renderMath(ch)}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {confirmed && (
        <div
          className="mb-6 rounded-lg border-l-[3px] bg-bg-deep p-3 text-[.85rem] leading-relaxed text-text-muted"
          style={{ borderLeftColor: selected === q.correct ? "var(--color-accent-green)" : "var(--color-accent-red)" }}
        >
          <span className="mr-1 inline-flex align-middle">{selected === q.correct ? <AnimatedCheck size={16} /> : <AnimatedX size={16} />}</span>
          {selected === q.correct ? "Critical Hit! " : "Boss strikes back! "}
          {renderMath(q.explanation)}
        </div>
      )}

      {confirmed && (
        <div className="flex justify-center">
          <button
            onClick={next}
            className="cursor-pointer rounded-lg border-none px-6 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
          >
            {idx < questions.length - 1 ? "Next Attack →" : "Finish Battle →"}
          </button>
        </div>
      )}
    </div>
  );
}
