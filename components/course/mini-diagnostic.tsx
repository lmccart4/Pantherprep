"use client";

import { useState } from "react";

interface DiagQuestion {
  domain: string;
  domainColor: string;
  difficulty?: string;
  passage: string;
  stem: string;
  choices: string[];
  correct: number;
  explanation: string;
}

interface MiniDiagnosticProps {
  questions: DiagQuestion[];
  accentColor: string;
  onComplete: () => void;
}

const CONF_LABELS = ["Guessing", "Unsure", "Confident"];

export function MiniDiagnostic({ questions, accentColor, onComplete }: MiniDiagnosticProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [confidence, setConfidence] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [scored, setScored] = useState(false);

  const allAnswered = answers.every((a) => a !== null);

  function pickAnswer(qi: number, ci: number) {
    if (scored) return;
    setAnswers((prev) => { const n = [...prev]; n[qi] = ci; return n; });
  }

  function pickConf(qi: number, ci: number) {
    if (scored) return;
    setConfidence((prev) => { const n = [...prev]; n[qi] = ci; return n; });
  }

  function scoreDiag() {
    setScored(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Compute results
  const total = answers.reduce<number>((acc, a, i) => acc + (a === questions[i].correct ? 1 : 0), 0);
  const domScores: Record<string, { score: number; total: number; color: string }> = {};
  const miscal: { q: number; type: string; domain: string }[] = [];

  questions.forEach((q, i) => {
    const correct = answers[i] === q.correct;
    if (!domScores[q.domain]) domScores[q.domain] = { score: 0, total: 0, color: q.domainColor };
    domScores[q.domain].total++;
    if (correct) domScores[q.domain].score++;
    if (confidence[i] === 2 && !correct) miscal.push({ q: i + 1, type: "Overconfident", domain: q.domain });
    if (confidence[i] === 0 && correct) miscal.push({ q: i + 1, type: "Underconfident", domain: q.domain });
  });

  // Study plan
  const DOMAIN_MODULES: Record<string, string> = {
    "Craft & Structure": "Module 2-3",
    "Information & Ideas": "Module 4-5",
    "Std. English Conventions": "Module 6-7",
    "Expression of Ideas": "Module 8-9",
  };
  const weak: { domain: string; modules: string; pct: number }[] = [];
  const strong: { domain: string; pct: number }[] = [];
  Object.entries(domScores).forEach(([d, v]) => {
    const pct = v.total > 0 ? Math.round((v.score / v.total) * 100) : 100;
    if (pct < 60) weak.push({ domain: d, modules: DOMAIN_MODULES[d] || "", pct });
    else if (pct >= 80) strong.push({ domain: d, pct });
  });

  const pctTotal = Math.round((total / questions.length) * 100);
  const scoreColor = pctTotal >= 80 ? "#22c55e" : pctTotal >= 60 ? "#d4a017" : "#ef4444";

  return (
    <div className="mx-auto min-h-screen max-w-[780px] px-6 pb-16 pt-12">
      {/* Header */}
      <div
        className="mb-2.5 text-[11px] font-bold uppercase tracking-[2.5px] opacity-80"
        style={{ color: accentColor }}
      >
        Session 2: Diagnostic
      </div>
      <h2 className="mb-2.5 font-display text-[clamp(1.4rem,3.5vw,2rem)] font-bold text-text-primary">
        Mini Diagnostic Assessment
      </h2>
      <p className="mb-7 text-sm leading-[1.8] text-text-secondary">
        Answer these {questions.length} questions spanning all four R&W domains. For each question,
        first rate your confidence, then select your answer. This helps identify both skill gaps and
        calibration gaps.
      </p>

      {/* Questions */}
      {questions.map((q, i) => {
        const answered = answers[i] !== null;
        const isCorrect = answered && answers[i] === q.correct;
        return (
          <div
            key={i}
            className="mb-5 rounded-[18px] border p-6 transition-all"
            style={{
              background: "rgba(15,15,22,.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: scored && answered
                ? isCorrect
                  ? "rgba(34,197,94,.15)"
                  : "rgba(239,68,68,.1)"
                : "rgba(255,255,255,.05)",
              boxShadow: "0 4px 32px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.03)",
              opacity: scored && answered ? 0.85 : 1,
            }}
          >
            {/* Domain & difficulty tags */}
            <div className="mb-4 flex items-center gap-2.5">
              <span
                className="inline-block rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-[2px]"
                style={{ background: `${q.domainColor}15`, color: q.domainColor }}
              >
                {q.domain}
              </span>
              {q.difficulty && (
                <span
                  className="inline-block rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-[2px]"
                  style={{
                    background: q.difficulty === "easy" ? "rgba(34,197,94,.1)" : q.difficulty === "medium" ? "rgba(251,191,36,.1)" : "rgba(239,68,68,.1)",
                    color: q.difficulty === "easy" ? "#22c55e" : q.difficulty === "medium" ? "#fbbf24" : "#ef4444",
                  }}
                >
                  {q.difficulty}
                </span>
              )}
            </div>

            {/* Passage — glass card with italic serif text */}
            {q.passage && (
              <div
                className="mb-5 whitespace-pre-line rounded-[14px] border-l-[3px] px-5 py-4 font-serif text-[15px] italic leading-[1.85]"
                style={{
                  background: "rgba(8,8,12,.6)",
                  borderColor: "var(--color-border-default)",
                  color: "#a0a0b0",
                }}
              >
                {q.passage}
              </div>
            )}

            {/* Stem — bold, larger */}
            <div className="mb-4 text-[15px] font-medium leading-[1.7] text-[#d4d4de]">
              {q.stem}
            </div>

            {/* Confidence selector */}
            {!scored && (
              <div className="mb-4">
                <div className="mb-2 text-[11px] font-semibold tracking-[0.5px] text-text-muted">
                  How confident are you?
                </div>
                <div className="flex gap-2">
                  {CONF_LABELS.map((c, ci) => (
                    <button
                      key={ci}
                      onClick={() => pickConf(i, ci)}
                      className="cursor-pointer rounded-lg border px-4 py-1.5 text-[13px] transition-all"
                      style={{
                        borderColor: confidence[i] === ci ? `${accentColor}4d` : "var(--color-border-default)",
                        background: confidence[i] === ci ? `${accentColor}12` : "rgba(8,8,12,.4)",
                        color: confidence[i] === ci ? accentColor : "var(--color-text-muted)",
                        fontWeight: confidence[i] === ci ? 600 : 400,
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Answer choices — taller, more distinct buttons */}
            <div className="flex flex-col gap-2.5">
              {q.choices.map((c, ci) => {
                const letter = String.fromCharCode(65 + ci);
                const isSelected = answers[i] === ci;
                const isCorrectChoice = ci === q.correct;

                let bg = "rgba(8,8,12,.5)";
                let border = "rgba(255,255,255,.06)";
                let opacity = 1;
                let shadow = "none";

                if (scored) {
                  if (isCorrectChoice) {
                    border = "rgba(34,197,94,.25)";
                    bg = "rgba(34,197,94,.08)";
                    shadow = "0 0 16px rgba(34,197,94,.06)";
                  } else if (isSelected) {
                    border = "rgba(239,68,68,.25)";
                    bg = "rgba(239,68,68,.08)";
                  }
                  opacity = isCorrectChoice ? 1 : 0.5;
                } else if (isSelected) {
                  border = "rgba(34,197,94,.25)";
                  bg = "rgba(34,197,94,.08)";
                }

                return (
                  <button
                    key={ci}
                    onClick={() => pickAnswer(i, ci)}
                    disabled={scored}
                    className="flex w-full items-center gap-3 rounded-[12px] border px-4 py-3.5 text-left text-[15px] transition-all"
                    style={{
                      background: bg,
                      borderColor: border,
                      opacity,
                      boxShadow: shadow,
                      cursor: scored ? "default" : "pointer",
                      color: "#bcbcc8",
                    }}
                    onMouseOver={(e) => {
                      if (!scored && !isSelected) {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
                        e.currentTarget.style.background = "rgba(15,15,22,.6)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!scored && !isSelected) {
                        e.currentTarget.style.borderColor = border;
                        e.currentTarget.style.background = bg;
                      }
                    }}
                  >
                    <span
                      className="min-w-[24px] shrink-0 font-mono text-[14px] font-bold"
                      style={{
                        color: scored && isCorrectChoice
                          ? "#22c55e"
                          : scored && isSelected
                            ? "#ef4444"
                            : "var(--color-text-muted)",
                      }}
                    >
                      {letter})
                    </span>
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation (after scoring) */}
            {scored && (
              <div
                className="mt-4 rounded-[12px] border-l-[3px] px-4 py-3.5 text-[14px] leading-[1.7]"
                style={{
                  background: "rgba(8,8,12,.5)",
                  borderColor: isCorrect ? "#22c55e" : "#ef4444",
                  color: "#a0a0b0",
                }}
              >
                <span style={{ color: isCorrect ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                  {isCorrect ? "Correct! " : "Incorrect. "}
                </span>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {/* Score button */}
      {!scored && allAnswered && (
        <div className="mt-5 text-center">
          <button
            onClick={scoreDiag}
            className="cursor-pointer rounded-xl border-none px-8 py-3 text-sm font-bold text-ink transition-all hover:scale-[1.04] hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
          >
            Score My Diagnostic &rarr;
          </button>
        </div>
      )}

      {/* Results banner (shown after scoring) */}
      {scored && (
        <div
          className="mt-10 mb-10 rounded-[18px] border p-8"
          style={{
            background: "rgba(15,15,22,.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: `${accentColor}20`,
            boxShadow: `0 4px 32px rgba(0,0,0,.2), 0 0 40px ${accentColor}10`,
          }}
        >
          {/* Total score */}
          <div className="mb-8 text-center">
            <div
              className="font-mono text-[3.6rem] font-bold leading-none"
              style={{ color: scoreColor }}
            >
              {total}/{questions.length}
            </div>
            <div className="mt-2 text-[15px] text-text-secondary">{pctTotal}% correct</div>
          </div>

          {/* Domain breakdown */}
          <div className="mb-8 grid grid-cols-2 gap-3.5">
            {Object.entries(domScores).map(([d, v]) => {
              const p = Math.round((v.score / v.total) * 100);
              const clr = p >= 80 ? "#22c55e" : p >= 50 ? "#d4a017" : "#ef4444";
              return (
                <div
                  key={d}
                  className="rounded-[14px] border px-5 py-4 text-center"
                  style={{
                    background: "rgba(8,8,12,.5)",
                    borderColor: "rgba(255,255,255,.06)",
                  }}
                >
                  <div
                    className="mb-2 text-[11px] font-bold uppercase tracking-[2px]"
                    style={{ color: v.color }}
                  >
                    {d}
                  </div>
                  <div className="font-mono text-[1.6rem] font-bold" style={{ color: clr }}>
                    {v.score}/{v.total}
                  </div>
                  <div
                    className="mt-3 h-[6px] overflow-hidden rounded-full"
                    style={{ background: "rgba(255,255,255,.06)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${p}%`,
                        background: `linear-gradient(90deg, ${clr}, ${clr}cc)`,
                        boxShadow: `0 0 8px ${clr}33`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calibration flags */}
          {miscal.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-text-muted">
                Calibration Flags
              </div>
              {miscal.map((m, mi) => (
                <div key={mi} className="py-1.5 text-[15px] text-[#bcbcc8]">
                  Q{m.q}:{" "}
                  <strong style={{ color: m.type === "Overconfident" ? "#ef4444" : accentColor }}>
                    {m.type}
                  </strong>{" "}
                  ({m.domain})
                </div>
              ))}
              <div className="mt-3 text-[14px] italic leading-relaxed text-text-muted">
                Overconfident = you felt sure but got it wrong (dangerous on test day!).
                Underconfident = you guessed right (you know more than you think).
              </div>
            </div>
          )}

          {/* Next step */}
          <div className="mb-6 text-[15px] leading-[1.7] text-[#bcbcc8]">
            <strong className="text-text-primary">Next step: </strong>
            Use these results alongside your full Bluebook baseline to identify your priority domains
            for the course.
          </div>

          {/* Study plan */}
          <div
            className="rounded-[14px] border px-6 py-5"
            style={{
              background: "rgba(8,8,12,.5)",
              borderColor: `${accentColor}25`,
            }}
          >
            <div
              className="mb-3 text-[11px] font-bold uppercase tracking-[2px]"
              style={{ color: accentColor }}
            >
              Your Study Plan
            </div>
            {weak.length > 0 && (
              <div className="mb-3">
                <div className="mb-1 text-[15px] font-semibold text-[#ef4444]">Priority Review:</div>
                {weak.map((w, wi) => (
                  <div key={wi} className="py-1 text-[15px] text-[#bcbcc8]">
                    &bull; <strong>{w.domain}</strong> ({w.pct}%) &rarr; Focus on{" "}
                    <strong>{w.modules}</strong>
                  </div>
                ))}
              </div>
            )}
            {strong.length > 0 && (
              <div className="mb-3">
                <div className="mb-1 text-[15px] font-semibold text-[#22c55e]">Strong Areas:</div>
                {strong.map((s, si) => (
                  <div key={si} className="py-1 text-[15px] text-[#bcbcc8]">
                    &bull; {s.domain} ({s.pct}%) &mdash; review briefly
                  </div>
                ))}
              </div>
            )}
            {weak.length === 0 && strong.length === 0 && (
              <div className="text-[15px] text-[#bcbcc8]">
                All domains around 60-80%. Work through all modules with equal attention.
              </div>
            )}
            <div className="mt-3 text-[14px] text-text-muted">
              <em>
                For a full baseline, take the Bluebook practice test (54 questions) described in the
                worksheet section.
              </em>
            </div>
          </div>
        </div>
      )}

      {/* Continue button (after scoring) */}
      {scored && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onComplete}
            className="cursor-pointer rounded-xl border-none px-7 py-3 text-sm font-bold text-ink transition-all hover:scale-[1.03] hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
          >
            Continue to Error Classification &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
