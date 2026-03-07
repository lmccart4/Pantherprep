"use client";

import { useState } from "react";

const ACCENT = "#C8102E";

/* ── Slide: Stats Visual ── */
export function StatsVisual() {
  const stats = [
    { n: "3", label: "error types", sub: "Modifiers, parallelism, comparison" },
    { n: "2-4", label: "Qs per test", sub: "Within Form/Structure/Sense" },
    { n: "#1", label: "trap", sub: "Dangling modifiers" },
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

/* ── Slide: Dangling Modifier Demo ── */
export function DanglingDemo() {
  const [step, setStep] = useState(0);
  const stages = [
    {
      modifier: "Walking through the museum,",
      subject: "the paintings",
      rest: "caught her attention.",
      ok: false,
      label: "Who is walking? The paintings?",
    },
    {
      modifier: "Walking through the museum,",
      subject: "she",
      rest: "noticed the paintings.",
      ok: true,
      label: "Who is walking? She!",
    },
  ];
  const s = stages[step];

  return (
    <div className="px-5 py-4">
      <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px] text-amber-500">
        Interactive: Dangling Modifier
      </div>
      <div className="mb-3 rounded-2xl border border-border-default bg-bg-base p-5 font-serif text-[17px] leading-[1.8]">
        <span className="text-purple-400">{s.modifier} </span>
        <span
          className={`font-extrabold ${s.ok ? "text-emerald-500" : "text-red-500 underline decoration-wavy decoration-red-500 underline-offset-4"}`}
        >
          {s.subject}{" "}
        </span>
        <span className="text-text-primary">{s.rest}</span>
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
            {i === 0 ? "Wrong" : "Fixed"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Slide: Parallel Demo ── */
export function ParallelDemo() {
  const [fixed, setFixed] = useState(false);

  return (
    <div className="px-5 py-4">
      <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px] text-amber-500">
        Interactive: Parallelism
      </div>
      <div className="mb-3 rounded-2xl border border-border-default bg-bg-base p-5 font-serif text-[15px] leading-[2]">
        The program focuses on{" "}
        {!fixed ? (
          <>
            <span className="rounded bg-[rgba(16,185,129,.1)] px-1.5 py-0.5 font-bold text-emerald-500">
              teaching
            </span>{" "}
            critical thinking,{" "}
            <span className="rounded bg-[rgba(239,68,68,.1)] px-1.5 py-0.5 font-bold text-red-500">
              to develop
            </span>{" "}
            leadership skills, and{" "}
            <span className="rounded bg-[rgba(168,85,247,.1)] px-1.5 py-0.5 font-bold text-purple-400">
              communication
            </span>
            .
          </>
        ) : (
          <>
            <span className="rounded bg-[rgba(16,185,129,.1)] px-1.5 py-0.5 font-bold text-emerald-500">
              teaching
            </span>{" "}
            critical thinking,{" "}
            <span className="rounded bg-[rgba(16,185,129,.1)] px-1.5 py-0.5 font-bold text-emerald-500">
              developing
            </span>{" "}
            leadership skills, and{" "}
            <span className="rounded bg-[rgba(16,185,129,.1)] px-1.5 py-0.5 font-bold text-emerald-500">
              improving
            </span>{" "}
            communication.
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFixed(!fixed)}
          className="cursor-pointer rounded-md border px-3.5 py-1.5 text-[12px] font-semibold transition-all"
          style={{
            borderColor: ACCENT,
            background: fixed ? `${ACCENT}22` : "transparent",
            color: ACCENT,
          }}
        >
          {fixed ? "Show Broken" : "Fix It"}
        </button>
        <span className="text-[12px] text-text-muted">
          {fixed
            ? "All gerunds \u2014 balanced! \u2705"
            : "Gerund, infinitive, noun \u2014 mismatched! \u274C"}
        </span>
      </div>
    </div>
  );
}

/* ── Slide: Correlative Check ── */
export function CorrelativeCheck() {
  const items = [
    {
      text: "not only challenged theories | but also inspired research",
      ok: true,
      why: "Verb + verb \u2705",
    },
    {
      text: "not only challenged theories | but also was inspiring research",
      ok: false,
      why: "Past tense vs. past progressive \u274C",
    },
    {
      text: "either accept the offer | or reject it outright",
      ok: true,
      why: "Verb + verb \u2705",
    },
    {
      text: "both innovative in design | and it was durable",
      ok: false,
      why: "Adjective phrase vs. clause \u274C",
    },
  ];
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div className="px-5 py-3">
      <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px] text-amber-500">
        Quick Check: Are these parallel?
      </div>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => setRevealed((p) => ({ ...p, [i]: true }))}
          className="mb-2 block w-full cursor-pointer rounded-2xl border border-border-default bg-bg-base p-3 text-left transition-all"
        >
          <div className="font-serif text-[13px] text-text-primary">
            {item.text.split("|").map((part, pi) => (
              <span key={pi}>
                {pi > 0 && (
                  <span className="font-extrabold text-amber-500"> | </span>
                )}
                {part}
              </span>
            ))}
          </div>
          {revealed[i] ? (
            <div
              className="mt-1 text-[12px] font-semibold"
              style={{ color: item.ok ? "#10b981" : "#ef4444" }}
            >
              {item.why}
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

/* ── Slide: Apostrophe Quiz ── */
export function ApostropheQuiz() {
  const items = [
    {
      text: 'The ______ findings were published last month.',
      a: "researchers'",
      b: "researchers",
      correct: "a" as const,
      why: "Possessive: findings belonging to the researchers",
    },
    {
      text: "______ been raining all morning.",
      a: "Its",
      b: "It's",
      correct: "b" as const,
      why: '"It\'s" = "It has" \u2014 contraction, not possession',
    },
    {
      text: "The dog chased ______ tail in circles.",
      a: "its",
      b: "it's",
      correct: "a" as const,
      why: "Possessive pronoun: the tail belonging to the dog. No apostrophe.",
    },
    {
      text: "The three ______ voted unanimously.",
      a: "committee's",
      b: "committees",
      correct: "b" as const,
      why: "Plural: more than one committee. No possession indicated.",
    },
  ];
  const [answers, setAnswers] = useState<Record<number, "a" | "b">>({});

  return (
    <div className="px-5 py-3">
      <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px] text-amber-500">
        Quick Check: Apostrophe or not?
      </div>
      {items.map((item, i) => {
        const ans = answers[i];
        const isRight = ans === item.correct;
        return (
          <div
            key={i}
            className="mb-2.5 rounded-lg p-2 px-3"
            style={{
              background: ans
                ? isRight
                  ? "rgba(16,185,129,.07)"
                  : "rgba(239,68,68,.07)"
                : "transparent",
            }}
          >
            <div className="mb-1.5 text-[13px] text-text-primary">
              {item.text}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() =>
                  setAnswers((p) => ({ ...p, [i]: "a" }))
                }
                disabled={!!ans}
                className="cursor-pointer rounded-md border px-3 py-1 text-[13px] font-bold transition-all disabled:cursor-default"
                style={{
                  borderColor:
                    ans === "a"
                      ? isRight
                        ? "#10b981"
                        : "#ef4444"
                      : "var(--color-border-default)",
                  color:
                    ans === "a"
                      ? isRight
                        ? "#10b981"
                        : "#ef4444"
                      : "var(--color-text-muted)",
                  background: "transparent",
                }}
              >
                {item.a}
              </button>
              <button
                onClick={() =>
                  setAnswers((p) => ({ ...p, [i]: "b" }))
                }
                disabled={!!ans}
                className="cursor-pointer rounded-md border px-3 py-1 text-[13px] font-bold transition-all disabled:cursor-default"
                style={{
                  borderColor:
                    ans === "b"
                      ? isRight
                        ? "#10b981"
                        : "#ef4444"
                      : "var(--color-border-default)",
                  color:
                    ans === "b"
                      ? isRight
                        ? "#10b981"
                        : "#ef4444"
                      : "var(--color-text-muted)",
                  background: "transparent",
                }}
              >
                {item.b}
              </button>
            </div>
            {ans && (
              <div
                className="mt-1 text-[11px]"
                style={{ color: isRight ? "#10b981" : "#ef4444" }}
              >
                {isRight ? "Correct! " : "Incorrect. "}
                {item.why}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Slide: Framework Visual ── */
export function FrameworkVisual() {
  const steps = [
    {
      n: "1",
      label: "Introductory phrase?",
      detail: "Subject after comma must do the action",
      color: "#a855f7",
    },
    {
      n: "2",
      label: "List with and/or?",
      detail: "All items same form: noun/verb/gerund/etc.",
      color: "#10b981",
    },
    {
      n: "3",
      label: "Correlative pair?",
      detail: "Match forms after each half",
      color: "#f59e0b",
    },
    {
      n: "4",
      label: "Comparison with than/like/as?",
      detail: "Same type of thing on both sides",
      color: "#3b82f6",
    },
    {
      n: "5",
      label: "Appositive in commas?",
      detail: "Must rename the adjacent noun",
      color: "#ef4444",
    },
    {
      n: "6",
      label: "Apostrophe present?",
      detail: "Possession vs. plurality vs. contraction",
      color: "#ec4899",
    },
  ];

  return (
    <div className="px-5 py-3">
      {steps.map((s, i) => (
        <div
          key={i}
          className="mb-2 flex items-center gap-3 rounded-r-lg border-l-[3px] px-3 py-2"
          style={{
            borderColor: s.color,
            background: `${s.color}08`,
          }}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] font-black"
            style={{
              background: `${s.color}22`,
              color: s.color,
            }}
          >
            {s.n}
          </div>
          <div>
            <div className="text-[13px] font-bold text-text-primary">
              {s.label}
            </div>
            <div className="text-[11px] text-text-muted">{s.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
