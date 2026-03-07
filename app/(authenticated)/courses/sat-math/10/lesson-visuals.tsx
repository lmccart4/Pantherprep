"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#C8102E";

/* ── Slide: Domain Review Flip Cards ── */
const DOMAINS = [
  { name: "Algebra", pct: "~35%", color: "#60a5fa", front: "Linear equations, systems, inequalities, functions", back: "Slope-intercept $y = mx + b$. Systems: substitution, elimination, or Desmos intersect. Inequalities: flip sign when multiplying/dividing by negative. Parallel = same slope. Perpendicular = negative reciprocal. No solution: same slope, different intercept." },
  { name: "Advanced Math", pct: "~35%", color: "#a855f7", front: "Quadratics, polynomials, exponents, functions", back: "Three quadratic forms: Standard (y-intercept), Factored (zeros), Vertex (min/max). Vertex: $x = \\frac{-b}{2a}$. Discriminant: $b^2-4ac$. Transformations: $f(x-h)$ shifts RIGHT. Exponent rules: $a^m \\cdot a^n = a^{m+n}$. Growth: $a(1+r)^x$, Decay: $a(1-r)^x$." },
  { name: "Problem-Solving & Data", pct: "~15%", color: "#fbbf24", front: "Ratios, percentages, statistics, probability", back: "% change = (new-old)/old \u00d7 100 -- OLD is always the denominator. Mean is sensitive to outliers; median is resistant. $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$. Study design: random assignment -> causation, random sample -> generalize." },
  { name: "Geometry & Trig", pct: "~15%", color: "#f87171", front: "Circles, triangles, trig ratios", back: "Circle: $(x-h)^2+(y-k)^2=r^2$. Remember $r^2$, not r! Special triangles: 30-60-90 ($x, x\\sqrt{3}, 2x$) and 45-45-90 ($x, x, x\\sqrt{2}$). SOH-CAH-TOA plus $\\sin(x) = \\cos(90°-x)$. Arc length: $s = r\\theta$ (radians)." },
];

export function DomainReviewVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="grid grid-cols-2 gap-3.5">
      {DOMAINS.map((d, i) => (
        <button
          key={i}
          onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
          className="cursor-pointer rounded-xl border bg-bg-base p-[18px] text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{ borderColor: flipped[i] ? `${d.color}33` : "var(--color-border-default)", boxShadow: flipped[i] ? `0 0 20px ${d.color}11` : "none" }}
        >
          {!flipped[i] ? (
            <>
              <div className="mb-2.5 flex items-center gap-2.5">
                <span className="font-mono text-xl font-bold" style={{ color: d.color }}>{d.pct}</span>
                <span className="text-[15px] font-bold text-text-primary">{d.name}</span>
              </div>
              <div className="text-[13px] leading-[1.6] text-text-muted">{d.front}</div>
              <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: d.color }}>tap to review &rarr;</div>
            </>
          ) : (
            <>
              <div className="mb-1 text-xs font-bold" style={{ color: d.color }}>{d.name}</div>
              <div className="text-[13px] leading-[1.7] text-[#bcbcc8]">{renderMath(d.back)}</div>
              <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: d.color }}>&larr; tap to flip back</div>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide: Decision Tree Visual ── */
export function DecisionTreeVisual() {
  return (
    <div className="rounded-2xl border border-[rgba(43,196,169,.25)] bg-bg-base p-5 shadow-[0_0_24px_rgba(43,196,169,.06)]">
      {[
        { q: "Do I know how to start?", yes: "Continue below", no: "Flag it, use LOTD, move on", color: "#22c55e" },
        { q: "Variables in the answer choices?", yes: "Plug In (PIYON)", no: "Continue below", color: "#60a5fa" },
        { q: "Numbers in the answer choices?", yes: "Try Backsolve (PITA)", no: "Continue below", color: "#a855f7" },
        { q: "Can I graph this in Desmos in < 5 seconds?", yes: "Graph it in Desmos", no: "Solve algebraically", color: "#2bc4a9" },
      ].map((s, i) => (
        <div key={i}>
          <div className="rounded-xl border border-border-default bg-bg-surface p-4 text-center">
            <div className="mb-2 text-sm font-bold text-text-primary">{s.q}</div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-lg border border-[rgba(34,197,94,.3)] bg-[rgba(34,197,94,.07)] px-3 py-2 text-[13px] font-semibold text-[#22c55e]">YES &rarr; {s.yes}</div>
              <div className="rounded-lg border border-[rgba(239,68,68,.3)] bg-[rgba(239,68,68,.07)] px-3 py-2 text-[13px] font-semibold text-[#ef4444]">NO &rarr; {s.no}</div>
            </div>
          </div>
          {i < 3 && <div className="py-1.5 text-center text-lg text-text-muted">&#9660;</div>}
        </div>
      ))}
      <div className="mt-3 rounded-xl border-2 border-[#2bc4a9] bg-[rgba(43,196,169,.07)] px-4 py-3 text-center text-sm font-semibold text-[#2bc4a9]">
        After solving: Re-read the question. Did I answer what they actually asked?
      </div>
    </div>
  );
}

/* ── Slide: Must-Know Formula Grid ── */
export function FormulaGridVisual() {
  const sections = [
    {
      domain: "Algebra", color: "#60a5fa",
      formulas: [
        { name: "Slope", eq: "$m = \\frac{y_2-y_1}{x_2-x_1}$" },
        { name: "Slope-Intercept", eq: "$y = mx + b$" },
        { name: "Point-Slope", eq: "$y - y_1 = m(x - x_1)$" },
        { name: "Quadratic Formula", eq: "$x = \\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$" },
      ],
    },
    {
      domain: "Advanced Math", color: "#a855f7",
      formulas: [
        { name: "Vertex", eq: "$x = \\frac{-b}{2a}$" },
        { name: "Discriminant", eq: "$b^2 - 4ac$" },
        { name: "Diff. of Squares", eq: "$a^2-b^2 = (a+b)(a-b)$" },
        { name: "Exponent", eq: "$a^{m/n} = (\\sqrt[n]{a})^m$" },
      ],
    },
    {
      domain: "Data & Stats", color: "#fbbf24",
      formulas: [
        { name: "% Change", eq: "(new-old)/old \u00d7 100" },
        { name: "Growth", eq: "$f(x) = a(1+r)^x$" },
        { name: "Decay", eq: "$f(x) = a(1-r)^x$" },
        { name: "Conditional", eq: "$P(A|B) = \\frac{P(A \\cap B)}{P(B)}$" },
      ],
    },
    {
      domain: "Geometry & Trig", color: "#f87171",
      formulas: [
        { name: "Circle", eq: "$(x-h)^2+(y-k)^2=r^2$" },
        { name: "30-60-90", eq: "$x : x\\sqrt{3} : 2x$" },
        { name: "45-45-90", eq: "$x : x : x\\sqrt{2}$" },
        { name: "Arc Length", eq: "$s = r\\theta$" },
      ],
    },
  ];

  return (
    <div className="space-y-3">
      {sections.map((s) => (
        <div key={s.domain}>
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[2px]" style={{ color: s.color }}>{s.domain}</div>
          <div className="grid grid-cols-4 gap-2">
            {s.formulas.map((f) => (
              <div key={f.name} className="rounded-lg border border-border-default bg-bg-base p-2.5 text-center">
                <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[1px] text-text-muted">{f.name}</div>
                <div className="font-mono text-[12px] font-bold text-text-primary">{renderMath(f.eq)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Note:</strong> The SAT reference sheet provides area/volume formulas. Focus your memorization on the formulas above -- they are NOT on the reference sheet but appear constantly.
      </div>
    </div>
  );
}

/* ── Slide: Test Day Timeline ── */
export function TimelineVisual() {
  const events = [
    { time: "Night Before", desc: "Light review only (flip through formula cards). Lay out everything. Set two alarms. No new material after 8 PM.", color: "#a855f7" },
    { time: "Morning - 2 Hours Before", desc: "Eat a real breakfast (protein + carbs). Review the Decision Tree. Do 3-5 easy warm-up problems.", color: "#60a5fa" },
    { time: "Arrive - 30 Min Before", desc: "Arrive early. Bathroom. Find seat. 10 deep breaths. You're ready.", color: "#2bc4a9" },
    { time: "Module 1 (35 min)", desc: "First pass: confident questions (~25 min). Second pass: flagged questions (~8 min). LOTD last 2 min.", color: ACCENT },
    { time: "Module 2 (35 min)", desc: "Same pacing. Harder module = good sign. Easier module = maximize accuracy.", color: "#f97316" },
    { time: "After the Test", desc: "Don't re-analyze from memory. Celebrate the effort. Scores in ~2 weeks.", color: "#22c55e" },
  ];

  return (
    <div className="relative space-y-0 pl-8">
      <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border-default" />
      {events.map((e, i) => (
        <div key={i} className="relative pb-4">
          <div className="absolute left-[-32px] top-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: e.color }}>
            {i + 1}
          </div>
          <div className="text-xs font-bold" style={{ color: e.color }}>{e.time}</div>
          <div className="text-[13px] leading-[1.6] text-[#bcbcc8]">{e.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Mental Game Cards ── */
export function MentalGameVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const cards = [
    { front: "Hit a wall mid-test?", back: "Close your eyes. 3 slow breaths. 'I've prepared for this.' Skip it, come back later. 30 seconds of calm > 30 seconds of panic.", color: "#60a5fa" },
    { front: "Realized you made a mistake?", back: "Fix it if you notice in time. If not, let it go. One wrong answer doesn't determine your score. Stay focused on the NEXT question.", color: "#fbbf24" },
    { front: "Module 2 feels harder?", back: "That's a GOOD sign. It means you did well on Module 1. Harder questions have a higher scoring ceiling. Lean into the challenge.", color: "#22c55e" },
    { front: "Not sure about a question?", back: "You don't have to answer every question to get a great score. Do YOUR best questions first. Flag and return. LOTD for the rest. Never leave blanks.", color: "#a855f7" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c, i) => (
        <button
          key={i}
          onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
          className="cursor-pointer rounded-xl border bg-bg-base p-5 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{ borderColor: flipped[i] ? `${c.color}33` : "var(--color-border-default)" }}
        >
          {!flipped[i] ? (
            <div className="text-center">
              <div className="mb-2 text-[15px] font-bold" style={{ color: c.color }}>{c.front}</div>
              <div className="text-[11px] font-medium opacity-70" style={{ color: c.color }}>tap for advice</div>
            </div>
          ) : (
            <div className="text-[13px] leading-[1.7] text-[#bcbcc8]">{c.back}</div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide: Final Message ── */
export function FinalMessageVisual() {
  return (
    <div className="rounded-2xl border border-[rgba(200,16,46,.3)] bg-[linear-gradient(135deg,rgba(200,16,46,.08),rgba(167,139,250,.08))] px-7 py-8 text-center">
      <div className="mb-4 text-3xl font-bold text-text-primary">You&apos;re Ready.</div>
      <div className="mx-auto max-w-md text-sm leading-[1.8] text-[#bcbcc8]">
        You&apos;ve built content knowledge across all four domains. You&apos;ve practiced with Desmos, mastered the Decision Tree, and learned to classify your errors. You know your strengths and your priorities.
      </div>
      <div className="mt-4 text-lg font-bold" style={{ color: ACCENT }}>
        Trust the preparation. Execute the strategies. Stay calm.
      </div>
    </div>
  );
}
