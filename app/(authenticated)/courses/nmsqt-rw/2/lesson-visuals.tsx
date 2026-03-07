"use client";

import { useState } from "react";

const ACCENT = "#d4a017";

/* ── Slide 1: Clause Checker ── */
const CLAUSE_ITEMS = [
  { text: "The researchers published their findings.", ic: true },
  { text: "Although the data was inconclusive.", ic: false },
  { text: "Running through the forest at dawn.", ic: false },
  { text: "She discovered a new species.", ic: true },
  { text: "Because the funding was cut.", ic: false },
  { text: "The committee voted unanimously.", ic: true },
];

export function ClauseCheckVisual() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  function handlePick(idx: number, pick: boolean) {
    if (answers[idx] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [idx]: pick }));
  }

  return (
    <div className="space-y-3">
      <div
        className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px]"
        style={{ color: ACCENT }}
      >
        Quick Check: Independent or Dependent?
      </div>
      {CLAUSE_ITEMS.map((item, i) => {
        const done = answers[i] !== undefined;
        const correct = done && answers[i] === item.ic;
        return (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg p-2 transition-colors"
            style={{
              background: done
                ? correct
                  ? "rgba(34,197,94,.08)"
                  : "rgba(239,68,68,.07)"
                : "transparent",
            }}
          >
            <span className="flex-1 text-sm text-[#bcbcc8]">{item.text}</span>
            <button
              onClick={() => handlePick(i, true)}
              disabled={done}
              className="rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors"
              style={{
                borderColor:
                  done && answers[i] === true
                    ? correct
                      ? "#22c55e"
                      : "#ef4444"
                    : "var(--color-border-default)",
                color:
                  done && answers[i] === true
                    ? correct
                      ? "#22c55e"
                      : "#ef4444"
                    : "var(--color-text-muted)",
                cursor: done ? "default" : "pointer",
              }}
            >
              Independent
            </button>
            <button
              onClick={() => handlePick(i, false)}
              disabled={done}
              className="rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors"
              style={{
                borderColor:
                  done && answers[i] === false
                    ? correct
                      ? "#22c55e"
                      : "#ef4444"
                    : "var(--color-border-default)",
                color:
                  done && answers[i] === false
                    ? correct
                      ? "#22c55e"
                      : "#ef4444"
                    : "var(--color-text-muted)",
                cursor: done ? "default" : "pointer",
              }}
            >
              Dependent
            </button>
            {done && <span className="text-base">{correct ? "✅" : "❌"}</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ── Shared InlineTester ── */
interface InlineItem {
  left: string;
  right: string;
  ok: boolean;
  reason: string;
}

function InlineTester({
  items,
  mark,
  label,
}: {
  items: InlineItem[];
  mark: string;
  label: string;
}) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div className="mt-2.5 border-t border-border-default pt-2.5">
      <div
        className="mb-2 text-[11px] font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        {label}
      </div>
      {items.map((t, i) => (
        <button
          key={i}
          onClick={() => setRevealed((p) => ({ ...p, [i]: true }))}
          className="mb-1.5 w-full cursor-pointer rounded-lg border border-border-default bg-bg-base p-3 text-left"
        >
          <div className="text-sm leading-relaxed text-[#bcbcc8]">
            {t.left}{" "}
            <span className="text-lg font-black" style={{ color: ACCENT }}>
              {mark}
            </span>{" "}
            {t.right}
          </div>
          {revealed[i] ? (
            <div
              className="mt-1.5 rounded px-2 py-1 text-xs font-semibold"
              style={{
                background: t.ok
                  ? "rgba(34,197,94,.07)"
                  : "rgba(239,68,68,.07)",
                color: t.ok ? "#22c55e" : "#ef4444",
              }}
            >
              {t.reason}
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

/* ── Slide 2: Joins Test (semicolon + colon) ── */
const SEMI_TESTS: InlineItem[] = [
  {
    left: "The concert was sold out",
    right: "thousands of fans waited outside",
    ok: true,
    reason: "Both sides are independent clauses ✓",
  },
  {
    left: "Although the rain continued",
    right: "the match went ahead as planned",
    ok: false,
    reason: 'Left side is dependent (starts with "although") ✗',
  },
  {
    left: "The chef prepared three dishes",
    right: "a risotto, a steak, and a souffle",
    ok: false,
    reason: "Right side is a list/phrase, not an IC ✗ (Use a colon)",
  },
];

const COLON_TESTS: InlineItem[] = [
  {
    left: "The study reached a clear conclusion",
    right: "the drug was ineffective",
    ok: true,
    reason: "Left is independent; right explains the conclusion ✓",
  },
  {
    left: "The team needed",
    right: "more funding, better equipment, and additional staff",
    ok: false,
    reason: '"The team needed" is NOT a complete sentence ✗',
  },
  {
    left: "Three factors contributed to the decline",
    right: "pollution, overfishing, and climate change",
    ok: true,
    reason: "Left is independent; right lists the three factors ✓",
  },
];

export function JoinsTestVisual() {
  return (
    <div>
      <InlineTester
        items={SEMI_TESTS}
        mark=";"
        label="Semicolon test"
      />
      <InlineTester
        items={COLON_TESTS}
        mark=":"
        label="Colon test"
      />
    </div>
  );
}

/* ── Slide 3: Semi Test ── */
export function SemiTestVisual() {
  return (
    <InlineTester
      items={SEMI_TESTS}
      mark=";"
      label="Can you use a semicolon here?"
    />
  );
}

/* ── Slide 4: Colon Test ── */
export function ColonTestVisual() {
  return (
    <InlineTester
      items={COLON_TESTS}
      mark=":"
      label="Is the left side independent?"
    />
  );
}

/* ── Slide 6: Decision Tree ── */
const TREE_STEPS = [
  {
    q: "Are there two independent clauses?",
    y: "Need a boundary \u2192",
    n: "Comma or nothing may work",
  },
  {
    q: "Does the second part explain/list the first?",
    y: "\u2192 COLON or EM-DASH",
    n: "\u2193",
  },
  {
    q: "Contrast or specific logical link?",
    y: "\u2192 COMMA + FANBOYS",
    n: "\u2192 SEMICOLON or PERIOD",
  },
];

export function DecisionTreeVisual() {
  return (
    <div className="space-y-2">
      {TREE_STEPS.map((s, i) => (
        <div
          key={i}
          className="rounded-xl border border-border-default bg-bg-base p-3.5"
        >
          <div className="mb-1.5 text-sm font-bold text-text-primary">
            {s.q}
          </div>
          <div className="flex gap-3 text-xs">
            <span className="text-[#22c55e]">YES: {s.y}</span>
            <span className="text-text-muted">NO: {s.n}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
