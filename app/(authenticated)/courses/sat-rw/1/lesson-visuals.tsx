"use client";

import { useState } from "react";

const ACCENT = "#C8102E";
const ACCENT2 = "#f59e0b";

/* ── Slide 1: Stats Visual ── */
export function StatsVisual() {
  const stats = [
    { n: "~10%", label: "of SAT R&W", sub: "Boundary questions" },
    { n: "5-6", label: "questions/test", sub: "High frequency" },
    { n: "#1", label: "missed rule", sub: "Comma splices" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="min-w-[140px] rounded-[14px] border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-6 py-4 text-center"
        >
          <div className="text-[28px] font-black" style={{ color: ACCENT }}>{s.n}</div>
          <div className="text-[13px] font-semibold text-text-primary">{s.label}</div>
          <div className="text-[11px] text-text-muted">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 2: Clause Checker ── */
export function ClauseCheckVisual() {
  const items = [
    { text: "The researchers published their findings.", independent: true },
    { text: "Although the data was inconclusive.", independent: false },
    { text: "Running through the forest at dawn.", independent: false },
    { text: "She discovered a new species.", independent: true },
    { text: "Because the funding was cut.", independent: false },
    { text: "The committee voted unanimously.", independent: true },
  ];

  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const handleClick = (i: number, val: boolean) => {
    setAnswers((p) => ({ ...p, [i]: val }));
  };

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT2 }}
      >
        Quick Check: Independent or Dependent?
      </div>
      {items.map((item, i) => {
        const answered = answers[i] !== undefined;
        const correct = answers[i] === item.independent;
        return (
          <div
            key={i}
            className="mb-2 flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all"
            style={{
              background: answered
                ? correct
                  ? "rgba(200,16,46,.07)"
                  : "rgba(239,68,68,.07)"
                : "transparent",
            }}
          >
            <div className="flex-1 font-serif text-[13px] text-text-primary">
              {item.text}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleClick(i, true)}
                disabled={answered}
                className="rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-all"
                style={{
                  borderColor:
                    answered && answers[i] === true
                      ? correct
                        ? ACCENT
                        : "#ef4444"
                      : "var(--color-border-default)",
                  background: "transparent",
                  color:
                    answered && answers[i] === true
                      ? correct
                        ? ACCENT
                        : "#ef4444"
                      : "var(--color-text-muted)",
                  cursor: answered ? "default" : "pointer",
                }}
              >
                Independent
              </button>
              <button
                onClick={() => handleClick(i, false)}
                disabled={answered}
                className="rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-all"
                style={{
                  borderColor:
                    answered && answers[i] === false
                      ? correct
                        ? ACCENT
                        : "#ef4444"
                      : "var(--color-border-default)",
                  background: "transparent",
                  color:
                    answered && answers[i] === false
                      ? correct
                        ? ACCENT
                        : "#ef4444"
                      : "var(--color-text-muted)",
                  cursor: answered ? "default" : "pointer",
                }}
              >
                Dependent
              </button>
            </div>
            {answered && (
              <span className="text-sm">{correct ? "\u2705" : "\u274C"}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Slide 3: Comma Splice Demo ── */
export function CommaSpliceDemoVisual() {
  const fixes = [
    { mark: ".", text: "The experiment failed. The team started over." },
    { mark: ";", text: "The experiment failed; the team started over." },
    { mark: ", so", text: "The experiment failed, so the team started over." },
    {
      mark: "\u2014",
      text: "The experiment failed \u2014 the team started over.",
    },
  ];

  return (
    <div className="px-6 py-4">
      <div className="mb-3 rounded-xl border border-[rgba(239,68,68,.27)] bg-[rgba(239,68,68,.09)] p-4">
        <div className="mb-1.5 text-[13px] font-bold text-[#ef4444]">
          COMMA SPLICE
        </div>
        <div className="font-serif text-[15px] leading-[1.8] text-text-primary">
          The experiment failed
          <span className="px-0.5 text-[20px] font-black text-[#ef4444]">
            ,
          </span>{" "}
          the team started over.
        </div>
        <div className="mt-1 text-[12px] text-[#ef4444]">
          Two independent clauses &mdash; only a comma between them
        </div>
      </div>

      <div className="my-3 text-center text-[13px] text-text-muted">
        Fix it with any of these:
      </div>

      <div className="grid grid-cols-2 gap-2">
        {fixes.map((f, i) => (
          <div
            key={i}
            className="rounded-[10px] border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] p-3"
          >
            <div
              className="mb-1 text-[18px] font-extrabold"
              style={{ color: ACCENT }}
            >
              {f.mark}
            </div>
            <div className="text-[12px] leading-[1.5] text-text-secondary">
              {f.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 7: Semicolon Tester ── */
export function SemicolonTestVisual() {
  const tests = [
    {
      left: "The concert was sold out",
      right: "thousands of fans waited outside",
      ok: true,
      reason: "Both sides are independent clauses \u2713",
    },
    {
      left: "Although the rain continued",
      right: "the match went ahead as planned",
      ok: false,
      reason:
        "Left side is dependent (starts with 'although') \u2717",
    },
    {
      left: "The chef prepared three dishes",
      right: "a risotto, a steak, and a souffl\u00e9",
      ok: false,
      reason:
        "Right side is a list/phrase, not an independent clause \u2717 (Use a colon instead)",
    },
  ];

  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT2 }}
      >
        Semicolon Test: Can you use one here?
      </div>
      {tests.map((t, i) => (
        <div
          key={i}
          className="mb-3 cursor-pointer rounded-[10px] border border-border-default bg-bg-surface p-3.5"
          onClick={() => setRevealed((p) => ({ ...p, [i]: true }))}
        >
          <div className="font-serif text-sm text-text-primary">
            {t.left}{" "}
            <span className="font-black" style={{ color: ACCENT2 }}>
              ;
            </span>{" "}
            {t.right}
          </div>
          {revealed[i] && (
            <div
              className="mt-2 text-[12px] font-semibold"
              style={{ color: t.ok ? ACCENT : "#ef4444" }}
            >
              {t.reason}
            </div>
          )}
          {!revealed[i] && (
            <div className="mt-1 text-[11px] text-text-muted">
              Tap to check
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Slide 8: Colon Tester ── */
export function ColonTestVisual() {
  const tests = [
    {
      left: "The study reached a clear conclusion",
      right: "the drug was ineffective",
      ok: true,
      reason:
        "Left is independent; right explains the conclusion \u2713",
    },
    {
      left: "The team needed",
      right: "more funding, better equipment, and additional staff",
      ok: false,
      reason:
        '"The team needed" is NOT a complete sentence \u2717',
    },
    {
      left: "Three factors contributed to the decline",
      right: "pollution, overfishing, and climate change",
      ok: true,
      reason:
        "Left is independent; right lists the three factors \u2713",
    },
  ];

  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT2 }}
      >
        Colon Test: Is the left side independent?
      </div>
      {tests.map((t, i) => (
        <div
          key={i}
          className="mb-3 cursor-pointer rounded-[10px] border border-border-default bg-bg-surface p-3.5"
          onClick={() => setRevealed((p) => ({ ...p, [i]: true }))}
        >
          <div className="font-serif text-sm text-text-primary">
            {t.left}{" "}
            <span className="font-black" style={{ color: ACCENT2 }}>
              :
            </span>{" "}
            {t.right}
          </div>
          {revealed[i] && (
            <div
              className="mt-2 text-[12px] font-semibold"
              style={{ color: t.ok ? ACCENT : "#ef4444" }}
            >
              {t.reason}
            </div>
          )}
          {!revealed[i] && (
            <div className="mt-1 text-[11px] text-text-muted">
              Tap to check
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Slide 11: Decision Tree ── */
export function DecisionTreeVisual() {
  const steps = [
    {
      q: "Are there two independent clauses?",
      yes: "Need a boundary \u2192",
      no: "Comma or no punctuation may work",
    },
    {
      q: "Does the second part explain/list the first?",
      yes: "\u2192 Use a COLON or EM-DASH",
      no: "\u2193",
    },
    {
      q: "Is there a contrast or specific logical link?",
      yes: "\u2192 Use COMMA + FANBOYS",
      no: "\u2192 Use SEMICOLON or PERIOD",
    },
  ];

  return (
    <div className="flex flex-col gap-2 px-5 py-3">
      {steps.map((s, i) => (
        <div
          key={i}
          className="rounded-[10px] border border-border-default bg-bg-surface p-3.5"
        >
          <div className="mb-1.5 text-sm font-bold text-text-primary">
            {s.q}
          </div>
          <div className="flex gap-3">
            <div className="text-[12px]" style={{ color: ACCENT }}>
              YES: {s.yes}
            </div>
            <div className="text-[12px] text-text-muted">NO: {s.no}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
