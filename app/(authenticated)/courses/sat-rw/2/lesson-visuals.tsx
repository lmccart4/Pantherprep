"use client";

import { useState } from "react";

const ACCENT = "#C8102E";
const AMBER = "#f59e0b";

/* ── Slide: Stats Visual ── */
export function StatsVisual() {
  const stats = [
    { n: "~14%", label: "of SAT R&W", sub: "Agreement questions" },
    { n: "7-8", label: "questions/test", sub: "Form, Structure & Sense" },
    { n: "#2", label: "most common", sub: "After boundaries" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="min-w-[140px] rounded-[14px] border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-6 py-4 text-center"
        >
          <div className="text-[28px] font-black" style={{ color: ACCENT }}>
            {s.n}
          </div>
          <div className="text-[13px] font-semibold text-text-primary">
            {s.label}
          </div>
          <div className="text-[11px] text-text-muted">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Cross-Out Demo ── */
export function CrossOutDemo() {
  const [step, setStep] = useState(0);

  const stages = [
    {
      before: (
        <span className="font-serif text-[15px] leading-[2] text-text-primary">
          The collection{" "}
          <span className="rounded bg-[rgba(239,68,68,.1)] px-1.5 py-0.5 font-bold text-red-500">
            of rare manuscripts
          </span>{" "}
          <span className="rounded bg-[rgba(200,16,46,.1)] px-1.5 py-0.5 font-bold" style={{ color: ACCENT }}>
            were
          </span>{" "}
          donated to the university.
        </span>
      ),
      label: "Your ear hears \"manuscripts\" (plural) near the verb...",
      ok: false,
    },
    {
      before: (
        <span className="font-serif text-[15px] leading-[2] text-text-primary">
          The{" "}
          <span className="rounded bg-[rgba(16,185,129,.1)] px-1.5 py-0.5 font-bold text-emerald-500">
            collection
          </span>{" "}
          <span className="text-text-muted line-through opacity-50">
            of rare manuscripts
          </span>{" "}
          <span className="rounded bg-[rgba(16,185,129,.1)] px-1.5 py-0.5 font-bold text-emerald-500">
            was
          </span>{" "}
          donated to the university.
        </span>
      ),
      label: "Cross out the prepositional phrase. Subject = \"collection\" (singular).",
      ok: true,
    },
  ];
  const s = stages[step];

  return (
    <div className="px-5 py-4">
      <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px] text-amber-500">
        Interactive: Cross-Out Method
      </div>
      <div className="mb-3 rounded-2xl border border-border-default bg-bg-base p-5">
        {s.before}
      </div>
      <div
        className="mb-3 text-[13px] font-semibold"
        style={{ color: s.ok ? "#10b981" : "#ef4444" }}
      >
        {s.label} {s.ok ? "\u2705" : "\u274C"}
      </div>
      <div className="flex gap-2">
        {stages.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className="cursor-pointer rounded-md border px-3.5 py-1.5 text-[12px] font-semibold transition-all"
            style={{
              borderColor: i === step ? ACCENT : "var(--color-border-default)",
              background: i === step ? `${ACCENT}22` : "transparent",
              color: i === step ? ACCENT : "var(--color-text-muted)",
            }}
          >
            {i === 0 ? "Before" : "After Cross-Out"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Slide: Special Cases Quiz ── */
export function SpecialCasesQuiz() {
  const items = [
    { text: "The team of scientists HAS published...", ok: true, why: "\"Team\" = singular collective noun" },
    { text: "Neither the students nor the professor WAS available.", ok: true, why: "Verb matches closer noun (\"professor\" = singular)" },
    { text: "Every student and teacher HAVE been notified.", ok: false, why: "\"Every\" makes it singular: HAS been notified" },
    { text: "Each of the experiments HAS yielded results.", ok: true, why: "\"Each\" = always singular" },
    { text: "The data collected from surveys REVEALS a shift.", ok: false, why: "\"Data\" is plural: REVEAL a shift" },
  ];

  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px]"
        style={{ color: AMBER }}
      >
        Quick Check: Correct or Incorrect?
      </div>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => setRevealed((p) => ({ ...p, [i]: true }))}
          className="mb-2 block w-full cursor-pointer rounded-2xl border border-border-default bg-bg-base p-3 text-left transition-all"
        >
          <div className="font-serif text-[13px] text-text-primary">
            {item.text}
          </div>
          {revealed[i] ? (
            <div
              className="mt-1 text-[12px] font-semibold"
              style={{ color: item.ok ? "#10b981" : "#ef4444" }}
            >
              {item.ok ? "\u2705 Correct!" : "\u274C Incorrect."} {item.why}
            </div>
          ) : (
            <div className="mt-1 text-[11px] text-text-muted">
              Tap to check
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide: Tense Timeline ── */
export function TimelineVisual() {
  const tenses = [
    { label: "Past Perfect", example: "had studied", time: "Before another past event", color: "#a855f7", pos: 10 },
    { label: "Simple Past", example: "studied", time: "Completed action", color: "#3b82f6", pos: 30 },
    { label: "Present Perfect", example: "have studied", time: "Past to now", color: "#10b981", pos: 50 },
    { label: "Simple Present", example: "study / studies", time: "Habitual / general truth", color: "#f59e0b", pos: 65 },
    { label: "Future", example: "will study", time: "Not yet happened", color: "#ef4444", pos: 82 },
    { label: "Conditional", example: "would study", time: "Hypothetical", color: "#ec4899", pos: 95 },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        The Six Tenses on the SAT
      </div>
      {/* Timeline bar */}
      <div className="relative mb-4 h-2 overflow-hidden rounded-full bg-border-default">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(to right, #a855f7, #3b82f6, #10b981, #f59e0b, #ef4444, #ec4899)`,
            width: "100%",
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tenses.map((t, i) => (
          <div
            key={i}
            className="rounded-lg border-l-[3px] px-3 py-2"
            style={{ borderColor: t.color, background: `${t.color}08` }}
          >
            <div className="text-[12px] font-bold" style={{ color: t.color }}>
              {t.label}
            </div>
            <code
              className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[11px]"
              style={{ color: ACCENT }}
            >
              {t.example}
            </code>
            <div className="mt-0.5 text-[10px] text-text-muted">{t.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide: Framework Visual ── */
export function FrameworkVisual() {
  const steps = [
    { n: "1", label: "Find the verb", detail: "What's in the blank or underlined?", color: "#3b82f6" },
    { n: "2", label: "Find the TRUE subject", detail: "Cross out prepositional phrases, appositives, clauses", color: "#a855f7" },
    { n: "3", label: "Singular or plural?", detail: "Neither/nor = match closer; Each/Every = singular", color: "#10b981" },
    { n: "4", label: "Check tense", detail: "Time markers? Consistency? Past perfect?", color: "#f59e0b" },
    { n: "5", label: "Match number + tense", detail: "Pick the answer that fits both", color: ACCENT },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      {steps.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-md p-1.5 pl-2.5"
          style={{
            borderLeft: `3px solid ${s.color}`,
            background: `${s.color}08`,
          }}
        >
          <div
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-black"
            style={{ background: `${s.color}22`, color: s.color }}
          >
            {s.n}
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary">
              {s.label}
            </span>
            <span className="text-[11px] text-text-muted">
              {" "}
              &mdash; {s.detail}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
