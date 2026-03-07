"use client";

import { useState } from "react";

const ACCENT = "#d4a017";
const ACCENT_CODE_BG = "rgba(212,160,23,.1)";

/* ---- helpers ---- */
const Code = ({ children }: { children: React.ReactNode }) => (
  <code
    className="rounded-md px-2 py-0.5 font-mono text-[13px]"
    style={{ background: ACCENT_CODE_BG, color: ACCENT }}
  >
    {children}
  </code>
);

const Callout = ({
  children,
  color = ACCENT,
  bg,
  border,
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  border?: string;
}) => (
  <div
    className="rounded-xl px-5 py-4 text-sm leading-[1.7]"
    style={{
      background: bg ?? `${color}12`,
      border: `1px solid ${border ?? `${color}33`}`,
    }}
  >
    {children}
  </div>
);

/* ── Slide 1: Adaptive Format Strategy ── */
export function AdaptiveStrategyVisual() {
  return (
    <div className="space-y-4">
      {/* Flow diagram */}
      <div className="flex flex-col items-center gap-2.5">
        <div
          className="min-w-[220px] rounded-xl px-6 py-3.5 text-center text-sm font-semibold"
          style={{
            border: "1px solid rgba(212,160,23,.25)",
            background: "rgba(212,160,23,.07)",
            boxShadow: "0 0 24px rgba(212,160,23,.15)",
          }}
        >
          Module 1: Mixed Difficulty
          <br />
          <span className="text-xs font-normal text-text-muted">
            22 questions &middot; 35 minutes
          </span>
        </div>
        <div className="text-text-muted">&darr; Your performance determines&hellip;</div>
        <div className="flex w-full gap-4">
          <div
            className="flex-1 rounded-xl px-5 py-3.5 text-center text-sm font-semibold"
            style={{
              border: "1px solid rgba(34,197,94,.25)",
              background: "rgba(34,197,94,.07)",
            }}
          >
            <strong style={{ color: "#22c55e" }}>Harder</strong> Module 2
            <br />
            <span className="text-xs font-normal text-text-muted">
              Unlocks scores up to 760
            </span>
          </div>
          <div
            className="flex-1 rounded-xl px-5 py-3.5 text-center text-sm font-semibold"
            style={{
              border: "1px solid rgba(239,68,68,.2)",
              background: "rgba(239,68,68,.07)",
            }}
          >
            <strong style={{ color: "#ef4444" }}>Easier</strong> Module 2
            <br />
            <span className="text-xs font-normal text-text-muted">
              Score ceiling ~620&ndash;640
            </span>
          </div>
        </div>
      </div>

      <Callout color="#22c55e" bg="rgba(34,197,94,.07)" border="rgba(34,197,94,.2)">
        <strong style={{ color: "#22c55e" }}>Strategic Implication: </strong>
        Module 1 accuracy is MORE important than Module 2 accuracy. Getting routed
        to the harder Module 2 is how you reach National Merit territory.
      </Callout>

      <Callout color="#f97316" bg="rgba(249,115,22,.07)" border="rgba(249,115,22,.2)">
        <strong style={{ color: "#f97316" }}>National Merit Math Target: </strong>
        To reach a Selection Index of ~218+ (typical Semifinalist cutoff), you
        need a Math score of roughly <Code>700+</Code>. That requires routing to
        the hard Module 2 AND scoring well on it.
      </Callout>
    </div>
  );
}

/* ── Slide 2: 5-Second Decision Tree ── */
const DT_STEPS = [
  {
    num: 1,
    color: "#f97316",
    bg: "rgba(249,115,22,.07)",
    question: "Do I immediately see how to solve this?",
    yes: "Solve directly.",
    no: "Step 2",
  },
  {
    num: 2,
    color: "#a78bfa",
    bg: "rgba(167,139,250,.07)",
    question: "Variables in the answer choices?",
    yes: "Use Plug In (PIYON).",
    no: "Step 3",
  },
  {
    num: 3,
    color: "#34d399",
    bg: "rgba(52,211,153,.07)",
    question: "Answer choices are specific numbers?",
    yes: "Use Backsolve (PITA).",
    no: "Step 4",
  },
  {
    num: 4,
    color: "#2bc4a9",
    bg: "rgba(43,196,169,.07)",
    question: "Involves a function, graph, or system?",
    yes: "Use Desmos.",
    no: "Step 5",
  },
  {
    num: 5,
    color: "#fbbf24",
    bg: "rgba(251,191,36,.07)",
    question: "Can I eliminate clearly wrong answers?",
    yes: "Ballpark + POE, then guess.",
    no: "Flag and move on.",
  },
];

export function DecisionTreeVisual() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        {DT_STEPS.map((s) => (
          <div key={s.num} className="flex items-stretch gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black"
              style={{ background: s.color }}
            >
              {s.num}
            </div>
            <div
              className="flex-1 rounded-lg px-4 py-2.5 text-sm leading-[1.6]"
              style={{ background: s.bg }}
            >
              {s.question}
              <br />
              <span className="font-bold text-[#22c55e]">YES &rarr; {s.yes}</span>{" "}
              <span className="text-text-muted italic">NO &rarr; {s.no}</span>
            </div>
          </div>
        ))}
      </div>
      <Callout>
        <strong style={{ color: ACCENT }}>Use this on EVERY question. </strong>
        Within 5 seconds of reading, decide your approach. Indecision wastes more
        time than choosing the wrong method.
      </Callout>
    </div>
  );
}

/* ── Slide 3: Plug In Strategy (Flippable) ── */
export function PlugInVisual() {
  const [showExample, setShowExample] = useState(false);

  const steps = [
    "Choose simple numbers: 2, 3, 5, 10, or 100 (for percents)",
    "Work the problem with your numbers to get a TARGET",
    "Plug the SAME numbers into each answer choice",
    "The choice matching your target is correct",
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px]" style={{ color: "#f97316" }}>
          How It Works
        </div>
        <ol className="space-y-2 pl-5 text-sm leading-[1.7] text-[#bcbcc8]">
          {steps.map((s, i) => (
            <li key={i} className="list-decimal">
              <strong className="text-text-primary">{s.split(":")[0]}:</strong>
              {s.includes(":") ? s.slice(s.indexOf(":") + 1) : ""}
              {!s.includes(":") && s}
            </li>
          ))}
        </ol>
      </div>

      <button
        onClick={() => setShowExample(!showExample)}
        className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300"
        style={{
          borderColor: showExample ? "rgba(249,115,22,.3)" : "var(--color-border-default)",
          borderLeft: "3px solid #f97316",
        }}
      >
        <div className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px]" style={{ color: "#f97316" }}>
          Worked Example {showExample ? "(tap to collapse)" : "(tap to expand)"}
        </div>
        <div className="text-sm text-[#bcbcc8]">
          If x is positive, which is equivalent to <Code>(x\u00B2 + 2x) / x</Code>?
        </div>
        {showExample && (
          <div className="mt-3 space-y-1 text-[13px] text-[#bcbcc8]">
            <div>Choices: A) x + 2 &nbsp; B) x\u00B2 + 2 &nbsp; C) 2x &nbsp; D) x</div>
            <div className="mt-2">
              <strong style={{ color: ACCENT }}>Plug In x = 3:</strong> (9 + 6) / 3 = 15/3 = <strong>5</strong> &larr; target
            </div>
            <div>A) 3 + 2 = 5 &check; &nbsp; B) 11 &cross; &nbsp; C) 6 &cross; &nbsp; D) 3 &cross;</div>
            <div className="mt-1 font-bold text-[#22c55e]">Answer: A</div>
          </div>
        )}
      </button>

      <Callout color="#ef4444" bg="rgba(239,68,68,.07)" border="rgba(239,68,68,.2)">
        <strong style={{ color: "#ef4444" }}>Avoid 0 and 1 </strong>
        &mdash; they have special properties that make multiple answers look
        correct. If two answers match, try different numbers.
      </Callout>
    </div>
  );
}

/* ── Slide 4: Backsolve & Ballpark (Flippable Cards) ── */
const STRATS = [
  {
    title: "Backsolve (PITA)",
    when: "Answer choices are numbers",
    color: "#34d399",
    steps: [
      "Start with choice B or C (middle value)",
      "Plug it into the problem and check",
      "If wrong, go larger or smaller \u2192 eliminates 2\u20133 choices at once",
    ],
    example: "3x + 7 = 2x + 12. Try B) x=5: 3(5)+7=22, 2(5)+12=22. Equal!",
  },
  {
    title: "Ballpark + POE",
    when: "Estimation can eliminate choices",
    color: "#fbbf24",
    steps: [
      "Before calculating: \u201CShould this be big or small? Positive or negative?\u201D",
      "Estimate: 18% of 412 \u2248 20% of 400 = 80",
      "Eliminate anything far from 80",
    ],
    example: "Choices: 42, 74, 80, 412. Eliminate 42 (too low) and 412 (absurd). Down to 2!",
  },
];

export function BacksolveBallparkVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="grid grid-cols-2 gap-3.5">
      {STRATS.map((s, i) => (
        <button
          key={i}
          onClick={() => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))}
          className="cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-250 hover:-translate-y-0.5"
          style={{
            borderColor: flipped[i] ? `${s.color}33` : "var(--color-border-default)",
            boxShadow: flipped[i] ? `0 0 20px ${s.color}15` : "none",
          }}
        >
          {!flipped[i] ? (
            <>
              <div className="mb-1 text-[15px] font-bold" style={{ color: s.color }}>
                {s.title}
              </div>
              <div className="mb-2 text-[13px] text-text-muted">{s.when}</div>
              <ol className="space-y-1 pl-4 text-[13px] leading-[1.5] text-[#bcbcc8]">
                {s.steps.map((step, j) => (
                  <li key={j} className="list-decimal">{step}</li>
                ))}
              </ol>
              <div className="mt-2.5 text-right text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: s.color }}>
                tap for example
              </div>
            </>
          ) : (
            <>
              <div className="mb-1 text-sm font-bold" style={{ color: s.color }}>
                Example
              </div>
              <div className="text-sm leading-[1.7] text-[#bcbcc8]">{s.example}</div>
              <div className="mt-2.5 text-right text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: s.color }}>
                tap to flip back
              </div>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide 5: Time Budget ── */
export function TimeBudgetVisual() {
  const segments = [
    { label: "First Pass (~25 min)", pct: 71, color: "#22c55e", desc: "Easy/medium questions. Skip hard ones." },
    { label: "Review (~8 min)", pct: 23, color: "#fbbf24", desc: "Return to flagged questions." },
    { label: "LOTD (~2 min)", pct: 6, color: "#ef4444", desc: "Answer ALL remaining. Never leave blanks." },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">
          35-Minute Module Time Budget
        </div>
        <div className="mb-2 flex h-10 overflow-hidden rounded-lg">
          {segments.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-[11px] font-bold text-black"
              style={{ width: `${s.pct}%`, background: s.color }}
            >
              {s.label}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-[13px]">
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-sm"
                style={{ background: s.color }}
              />
              <span className="font-semibold text-text-secondary">{s.label}</span>
              <span className="text-text-muted">&mdash; {s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <Callout>
        <strong style={{ color: ACCENT }}>Pace Check: </strong>
        After <Code>15 minutes</Code>, you should be on question <Code>8+</Code>.
        If you&apos;re behind, skip the current hard question and move forward.
      </Callout>
    </div>
  );
}

/* ── Slide 6: Grid-In Rules ── */
export function GridInRulesVisual() {
  const rules = [
    { icon: "\u2705", rule: "Fractions accepted as-is (3/7 works)" },
    { icon: "\u2705", rule: "Decimals can be truncated or rounded" },
    { icon: "\u274C", rule: "No coordinate pairs \u2014 just the number" },
    { icon: "\u274C", rule: "No negative signs in improper format" },
    { icon: "\u26A0\uFE0F", rule: "Re-read: asked for 2x, not x!" },
    { icon: "\u26A0\uFE0F", rule: "Multiple solutions? Any correct one works" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2.5">
        {rules.map((r, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-border-default bg-bg-base p-3.5"
          >
            <span className="shrink-0 text-lg">{r.icon}</span>
            <span className="text-[13px] leading-[1.6] text-[#bcbcc8]">{r.rule}</span>
          </div>
        ))}
      </div>

      <Callout color="#ef4444" bg="rgba(239,68,68,.07)" border="rgba(239,68,68,.2)">
        <strong style={{ color: "#ef4444" }}>The #1 Grid-In Trap: </strong>
        Solving for x when they asked for <Code>2x + 1</Code>. Always underline
        exactly what the question asks you to find.
      </Callout>
    </div>
  );
}

/* ── Slide 7: Trap Catalog ── */
const TRAPS = [
  { name: "Wrong Target", desc: "Solving for x when they asked for 2x+1.", color: "#ef4444" },
  { name: "Intermediate Answer", desc: "Stopping at a middle step instead of finishing.", color: "#f97316" },
  { name: "Sign Flip", desc: "Forgetting to flip inequality when multiplying by negative.", color: "#fbbf24" },
  { name: "Wrong Denominator", desc: "Dividing by the wrong value (new vs old for percent change).", color: "#a855f7" },
  { name: "Negation Miss", desc: "Distributing a negative incorrectly: \u2212(x\u22123) = \u2212x+3, not \u2212x\u22123.", color: "#3b82f6" },
  { name: "f(x) vs x", desc: "Answering the minimum VALUE when they asked for the x-VALUE.", color: "#2bc4a9" },
  { name: "Axis Scale", desc: "Misreading graph scales (each gridline = 2, not 1).", color: "#f87171" },
  { name: "At Least vs More Than", desc: "\u2265 vs > and \u2264 vs <. One word changes the answer.", color: "#34d399" },
];

export function TrapCatalogVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {TRAPS.map((t, i) => (
        <button
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="cursor-pointer rounded-xl border bg-bg-base p-3.5 text-left transition-all duration-250 hover:-translate-y-0.5"
          style={{
            borderColor: expanded === i ? `${t.color}33` : "var(--color-border-default)",
            boxShadow: expanded === i ? `0 0 16px ${t.color}10` : "none",
          }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
              style={{ background: t.color }}
            >
              {i + 1}
            </span>
            <span className="text-[13px] font-bold" style={{ color: t.color }}>
              {t.name}
            </span>
          </div>
          {expanded === i && (
            <div className="mt-2 text-[13px] leading-[1.6] text-text-muted">{t.desc}</div>
          )}
        </button>
      ))}
    </div>
  );
}
