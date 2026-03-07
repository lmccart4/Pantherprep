"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

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

/* ── Slide 1: Practice Test Overview ── */
export function PracticeTestOverviewVisual() {
  const domains = [
    { name: "Algebra", pct: "~35%", qs: "15 Qs", color: "#34d399" },
    { name: "Advanced Math", pct: "~35%", qs: "15 Qs", color: "#a78bfa" },
    { name: "Data Analysis", pct: "~15%", qs: "7 Qs", color: "#fbbf24" },
    { name: "Geometry & Trig", pct: "~15%", qs: "7 Qs", color: "#f87171" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">
          44 Questions &middot; 70 Minutes Total
        </div>

        {/* Two-module bar */}
        <div className="mb-3 flex h-11 overflow-hidden rounded-lg">
          <div
            className="flex flex-1 items-center justify-center text-[12px] font-bold text-white"
            style={{ background: ACCENT }}
          >
            Module 1: Q1&ndash;22 (35 min)
          </div>
          <div className="flex flex-1 items-center justify-center text-[12px] font-bold text-white" style={{ background: "#a78bfa" }}>
            Module 2: Q23&ndash;44 (35 min)
          </div>
        </div>

        {/* Domain breakdown */}
        <div className="mb-3 flex h-7 overflow-hidden rounded-lg">
          {domains.map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-[10px] font-bold text-black"
              style={{
                width: d.pct.includes("35") ? "35%" : "15%",
                background: d.color,
              }}
            >
              {d.name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {domains.map((d, i) => (
            <div key={i} className="text-center">
              <div className="font-mono text-lg font-bold" style={{ color: d.color }}>
                {d.pct}
              </div>
              <div className="text-[11px] text-text-muted">{d.qs}</div>
            </div>
          ))}
        </div>
      </div>

      <Callout>
        <strong style={{ color: ACCENT }}>Strategy Reminders: </strong>
        Use the 5-second decision tree on every question. Plug In for variables,
        Backsolve for numbers, Desmos for graphs/systems. <Code>LOTD</Code> for
        remaining guesses. Never leave blanks.
      </Callout>
    </div>
  );
}

/* ── Slide 2: Score Projector ── */
export function ScoreProjectorVisual() {
  const [mathRaw, setMathRaw] = useState("");
  const [rwRaw, setRwRaw] = useState("");
  const [mod2, setMod2] = useState("");

  const m = parseInt(mathRaw);
  const r = parseInt(rwRaw);

  let mathScaled: number | null = null;
  let rwScaled: number | null = null;
  let si: number | null = null;

  if (!isNaN(m) && m >= 0 && m <= 44) {
    const base = 160 + (m / 44) * 600;
    const adj = mod2 === "hard" ? Math.min(base * 1.08, 760) : mod2 === "easy" ? Math.min(base * 0.92, 640) : base;
    mathScaled = Math.round(Math.min(Math.max(adj, 160), 760));
  }
  if (!isNaN(r) && r >= 0 && r <= 54) {
    rwScaled = Math.round(160 + (r / 54) * 600);
  }
  if (mathScaled !== null && rwScaled !== null) {
    si = Math.round((2 * rwScaled + mathScaled) / 10);
  }

  const mathPct = mathScaled ? ((mathScaled - 160) / 600) * 100 : 0;
  let siColor = "#bcbcc8";
  let siLabel = "";
  if (si !== null) {
    if (si >= 218) { siColor = "#22c55e"; siLabel = "Likely Semifinalist range!"; }
    else if (si >= 210) { siColor = ACCENT; siLabel = "Commended Scholar range"; }
    else if (si >= 200) { siColor = "#fbbf24"; siLabel = "Competitive \u2014 keep pushing!"; }
    else { siColor = "#ef4444"; siLabel = "Focus on your weakest domains"; }
  }

  return (
    <div className="rounded-2xl border border-[rgba(212,160,23,.2)] bg-bg-base p-6 shadow-[0_0_24px_rgba(212,160,23,.06)]">
      <div className="mb-5 grid grid-cols-3 gap-4">
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">
            Math Raw Score
          </div>
          <input
            type="number"
            placeholder="/44"
            min={0}
            max={44}
            value={mathRaw}
            onChange={(e) => setMathRaw(e.target.value)}
            className="w-[88px] rounded-lg border border-border-default bg-bg-surface p-2.5 text-center font-mono text-xl text-text-primary transition-all focus:border-[rgba(212,160,23,.5)] focus:shadow-[0_0_0_3px_rgba(212,160,23,.08)]"
          />
        </div>
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">
            RW Raw (optional)
          </div>
          <input
            type="number"
            placeholder="/54"
            min={0}
            max={54}
            value={rwRaw}
            onChange={(e) => setRwRaw(e.target.value)}
            className="w-[88px] rounded-lg border border-border-default bg-bg-surface p-2.5 text-center font-mono text-xl text-text-primary transition-all focus:border-[rgba(212,160,23,.5)] focus:shadow-[0_0_0_3px_rgba(212,160,23,.08)]"
          />
        </div>
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">
            Module 2 Type
          </div>
          <select
            value={mod2}
            onChange={(e) => setMod2(e.target.value)}
            className="w-full rounded-lg border border-border-default bg-bg-surface p-2.5 text-center font-mono text-sm text-text-primary"
          >
            <option value="">Select&hellip;</option>
            <option value="hard">Harder</option>
            <option value="easy">Easier</option>
          </select>
        </div>
      </div>

      {mathScaled !== null ? (
        <div className="text-center">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-bg-surface p-3">
              <div className="font-mono text-2xl font-bold" style={{ color: ACCENT }}>
                {mathScaled}
              </div>
              <div className="mt-1 text-[11px] text-text-muted">Math (160&ndash;760)</div>
            </div>
            <div className="rounded-xl bg-bg-surface p-3">
              <div className="font-mono text-2xl font-bold" style={{ color: rwScaled ? "#60a5fa" : "#bcbcc8" }}>
                {rwScaled ?? "\u2014"}
              </div>
              <div className="mt-1 text-[11px] text-text-muted">RW (160&ndash;760)</div>
            </div>
            <div className="rounded-xl bg-bg-surface p-3">
              <div className="font-mono text-2xl font-bold" style={{ color: si ? siColor : "#bcbcc8" }}>
                {si ?? "\u2014"}
              </div>
              <div className="mt-1 text-[11px] text-text-muted">Selection Index</div>
            </div>
          </div>

          <div className="relative my-4 h-2.5 overflow-hidden rounded-full bg-border-default">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${mathPct}%`,
                background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}cc)`,
                boxShadow: `0 0 12px ${ACCENT}33`,
              }}
            />
          </div>

          {si !== null && (
            <div className="mt-2 text-sm" style={{ color: siColor }}>
              {siLabel}
            </div>
          )}
        </div>
      ) : (
        <div className="py-5 text-center text-sm text-text-muted">
          Enter your Math raw score to see estimated scaled scores.
        </div>
      )}
    </div>
  );
}

/* ── Slide 3: Error Classification Reference ── */
const ERROR_TYPES = [
  { type: "Concept Gap", icon: "\uD83D\uDCDA", color: "#ef4444", desc: "Didn't know the math concept or formula.", fix: "Review the relevant module." },
  { type: "Careless/Arithmetic", icon: "\u270F\uFE0F", color: "#f59e0b", desc: "Knew the math but made a calculation mistake.", fix: "Slow down and double-check." },
  { type: "Time Pressure", icon: "\u23F1\uFE0F", color: "#6b7280", desc: "Ran out of time, had to rush or guess.", fix: "Use the two-pass system." },
  { type: "Misread Problem", icon: "\uD83E\uDEE4", color: "#a855f7", desc: "Solved correctly but answered the wrong thing.", fix: "Re-read what the question asks." },
  { type: "Strategy Gap", icon: "\uD83E\uDDED", color: "#3b82f6", desc: "Knew content but used the wrong approach.", fix: "Practice the 5-second decision tree." },
];

export function ErrorClassificationVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {ERROR_TYPES.map((e, i) => (
        <button
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: expanded === i ? `${e.color}44` : "var(--color-border-default)",
            boxShadow: expanded === i ? `0 0 20px ${e.color}15` : "none",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
              style={{ background: `${e.color}15` }}
            >
              {e.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[15px] font-bold" style={{ color: e.color }}>
                  {e.type}
                </span>
                <span className="text-[11px] text-text-muted">
                  {expanded === i ? "\u25B2" : "\u25BC"}
                </span>
              </div>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">
                {e.desc}
              </div>
            </div>
          </div>
          {expanded === i && (
            <div
              className="mt-3 rounded-lg px-4 py-3 text-sm leading-[1.7]"
              style={{ background: `${e.color}08`, borderLeft: `3px solid ${e.color}` }}
            >
              <strong style={{ color: e.color }}>Fix: </strong>
              <span className="text-[#bcbcc8]">{e.fix}</span>
            </div>
          )}
        </button>
      ))}

      <Callout>
        <strong style={{ color: ACCENT }}>Pro Tip: </strong>
        Most students assume their errors are Concept Gaps &mdash; but
        research shows <strong>Careless Errors</strong> and{" "}
        <strong>Misread/Trap</strong> errors are far more common. Honest
        classification is the fastest path to improvement.
      </Callout>
    </div>
  );
}

/* ── Slide 4: Formula Reference Card ── */
export function FormulaReferenceVisual() {
  const formulas = [
    { name: "Slope", eq: "$m = \\frac{y_2-y_1}{x_2-x_1}$" },
    { name: "Slope-Intercept", eq: "$y = mx + b$" },
    { name: "Quadratic Formula", eq: "$x = \\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$" },
    { name: "Discriminant", eq: "$b^2-4ac$" },
    { name: "Vertex", eq: "$x = \\frac{-b}{2a}$" },
    { name: "Pythagorean", eq: "$a^2 + b^2 = c^2$" },
    { name: "30-60-90", eq: "$1 : \\sqrt{3} : 2$" },
    { name: "45-45-90", eq: "$1 : 1 : \\sqrt{2}$" },
    { name: "SOH-CAH-TOA", eq: "$\\sin=\\frac{O}{H}\\;\\cos=\\frac{A}{H}\\;\\tan=\\frac{O}{A}$" },
    { name: "Circle Eq", eq: "$(x-h)^2+(y-k)^2=r^2$" },
    { name: "Area Triangle", eq: "$A = \\frac{1}{2}bh$" },
    { name: "Area Circle", eq: "$A = \\pi r^2$" },
    { name: "Vol Cylinder", eq: "$V = \\pi r^2 h$" },
    { name: "Vol Cone", eq: "$V = \\frac{1}{3}\\pi r^2 h$" },
    { name: "Vol Sphere", eq: "$V = \\frac{4}{3}\\pi r^3$" },
    { name: "Arc Length", eq: "$\\frac{\\theta}{360} \\times 2\\pi r$" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-2">
        {formulas.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border border-border-default bg-bg-base p-2.5 text-center"
          >
            <div className="text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
              {f.name}
            </div>
            <div className="mt-0.5 text-[13px] font-bold" style={{ color: "#60a5fa" }}>
              {renderMath(f.eq)}
            </div>
          </div>
        ))}
      </div>
      <Callout>
        <strong style={{ color: ACCENT }}>These are on the reference sheet. </strong>
        Knowing them cold saves <Code>30+ seconds</Code> per question. At 5&ndash;7
        geometry questions per test, that is 3&ndash;4 extra minutes.
      </Callout>
    </div>
  );
}

/* ── Slide 5: Test-Day Timeline ── */
export function TestDayTimelineVisual() {
  const items = [
    { time: "Night Before", tasks: ["Charge device", "Sleep 8+ hours", "Light review only \u2014 flip formula cards", "Lay out everything you need", "Set two alarms"], color: "#a78bfa" },
    { time: "Morning Of", tasks: ["Eat a real breakfast", "Bring a snack", "Bring device + pencils + backup calculator", "Bluebook app installed & updated", "3\u20135 easy warm-up problems"], color: "#60a5fa" },
    { time: "Module 1", tasks: ["Two-pass system \u2014 flag hard questions", "Accuracy over speed", "Use Desmos aggressively", "Time check: Q8+ at 15 min mark"], color: ACCENT },
    { time: "Between Modules", tasks: ["Breathe", "Stay confident", "Reset mentally"], color: "#22c55e" },
    { time: "Module 2", tasks: ["Same two-pass strategy", "Last 2 min: answer ALL remaining", "LOTD for remaining guesses", "Never leave blanks"], color: "#f97316" },
  ];

  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300"
          style={{
            borderColor: expanded[i] ? `${item.color}33` : "var(--color-border-default)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ background: item.color }}
            >
              {i + 1}
            </span>
            <span className="text-sm font-bold" style={{ color: item.color }}>
              {item.time}
            </span>
            <span className="ml-auto text-[11px] text-text-muted">
              {expanded[i] ? "\u25B2" : "\u25BC"}
            </span>
          </div>
          {expanded[i] && (
            <ul className="mt-2.5 space-y-1 pl-11 text-[13px] leading-[1.6] text-[#bcbcc8]">
              {item.tasks.map((t, j) => (
                <li key={j} className="list-disc">{t}</li>
              ))}
            </ul>
          )}
        </button>
      ))}
    </div>
  );
}
