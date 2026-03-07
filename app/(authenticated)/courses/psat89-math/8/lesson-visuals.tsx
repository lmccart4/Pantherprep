"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#06b6d4";

/* ── Slide 1: Pre-Test Protocol Visual ── */
export function PreTestProtocolVisual() {
  const structure = [
    { label: "Module 1", qs: "Q1\u201322", time: "35 min", desc: "Mixed difficulty \u2014 all four domains", color: ACCENT },
    { label: "Module 2", qs: "Q23\u201344", time: "35 min", desc: "Adaptive difficulty based on Module 1", color: "#a855f7" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Section</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Questions</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Time</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Content</th>
            </tr>
          </thead>
          <tbody>
            {structure.map((s, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 font-bold last:border-b-0" style={{ color: s.color }}>{s.label}</td>
                <td className="border-b border-border-default px-4 py-3 last:border-b-0">
                  <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{s.qs}</code>
                </td>
                <td className="border-b border-border-default px-4 py-3 last:border-b-0">
                  <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{s.time}</code>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{s.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Domain Breakdown Bar */}
      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Domain Distribution</div>
        <div className="flex h-10 overflow-hidden rounded-lg">
          <div className="flex items-center justify-center text-[11px] font-bold text-white" style={{ flex: 35, background: "#60a5fa" }}>Algebra ~35%</div>
          <div className="flex items-center justify-center text-[11px] font-bold text-white" style={{ flex: 35, background: "#a855f7" }}>Adv. Math ~35%</div>
          <div className="flex items-center justify-center text-[11px] font-bold text-white" style={{ flex: 15, background: "#fbbf24" }}>Data ~15%</div>
          <div className="flex items-center justify-center text-[11px] font-bold text-white" style={{ flex: 15, background: "#f87171" }}>Geo ~15%</div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Simulate real conditions: </strong>
        Find a quiet space, set a timer for 35 minutes per module, have scratch paper ready, and open Desmos. No phone, no music, no breaks during a module.
      </div>
    </div>
  );
}

/* ── Slide 2: Strategy Review Cards ── */
export function StrategyReviewVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const strategies = [
    { title: "Two-Pass System", color: "#22c55e", front: "Pass 1 (25 min): answer confident questions. Pass 2 (8 min): return to flagged. Final (2 min): review.", back: "This is the #1 time management technique. Students who use it consistently score 30-50 points higher than those who go sequentially." },
    { title: "5-Second Decision Tree", color: "#f59e0b", front: "Read \u2192 Check choices \u2192 Direct Solve? Plug In? Backsolve? Desmos? Ballpark? \u2192 Pick fastest.", back: "Most students default to algebra. Train yourself to check answer choices FIRST. Variables = Plug In. Numbers = Backsolve. System = Desmos." },
    { title: "LOTD", color: "#a855f7", front: "Pick one letter (B is popular) for ALL remaining guesses. 25% chance on every guess.", back: "Random switching between letters doesn\u2019t change the math, but a consistent letter ensures you don\u2019t accidentally skip questions." },
    { title: "SPR Rules", color: "#60a5fa", front: "No mixed numbers. Fractions OK. Negatives OK. Multiple valid answers may exist.", back: "The #1 SPR mistake: entering 3 1/2 as 31/2. Always use 3.5 or 7/2. Check for both positive and negative solutions." },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {strategies.map((s, i) => (
        <button
          key={i}
          onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
          className="cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{ borderColor: flipped[i] ? `${s.color}33` : "var(--color-border-default)" }}
        >
          {!flipped[i] ? (
            <>
              <div className="mb-2 text-[14px] font-bold" style={{ color: s.color }}>{s.title}</div>
              <div className="text-[13px] leading-[1.6] text-[#bcbcc8]">{s.front}</div>
              <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: s.color }}>tap for insight &rarr;</div>
            </>
          ) : (
            <>
              <div className="text-[13px] leading-[1.7] text-[#bcbcc8]">{s.back}</div>
              <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: s.color }}>&larr; tap to flip back</div>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide 3: Error Analysis Method ── */
export function ErrorAnalysisVisual() {
  const errorTypes = [
    { type: "Content Gap", icon: "\uD83D\uDCDA", color: "#ef4444", action: "Study the relevant module", desc: "Didn\u2019t know the concept or formula" },
    { type: "Careless / Arithmetic", icon: "\u270f\ufe0f", color: "#f59e0b", action: "Slow down, double-check", desc: "Knew it but made a simple mistake" },
    { type: "Misread / Trap", icon: "\uD83E\uDEE4", color: "#a855f7", action: "Re-read what\u2019s asked", desc: "Solved for wrong thing or missed a word" },
    { type: "Strategy Error", icon: "\uD83E\uDDED", color: "#60a5fa", action: "Practice decision tree", desc: "Wrong approach or ran out of time" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {errorTypes.map((e, i) => (
          <div key={i} className="rounded-xl border bg-bg-base p-4" style={{ borderColor: `${e.color}33` }}>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="text-xl">{e.icon}</span>
              <span className="text-[14px] font-bold" style={{ color: e.color }}>{e.type}</span>
            </div>
            <div className="mb-2 text-[13px] text-text-muted">{e.desc}</div>
            <div className="rounded-lg px-3 py-2 text-[12px] font-semibold" style={{ background: `${e.color}08`, color: "#22c55e" }}>
              Fix: {e.action}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Track by domain: </strong>
        If one domain (Algebra, Advanced Math, Data, Geometry) has many errors, review that module. If errors are spread evenly, focus on your <strong>error type</strong> instead.
      </div>
    </div>
  );
}

/* ── Slide 4: Formula Reference Sheet ── */
export function FormulaReferenceVisual() {
  const formulas = [
    { name: "Slope", eq: "$m = \\frac{y_2 - y_1}{x_2 - x_1}$", cat: "alg" },
    { name: "Slope-Intercept", eq: "$y = mx + b$", cat: "alg" },
    { name: "Quadratic Formula", eq: "$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$", cat: "adv" },
    { name: "Vertex", eq: "$x = \\frac{-b}{2a}$", cat: "adv" },
    { name: "Pythagorean", eq: "$a^2 + b^2 = c^2$", cat: "geo" },
    { name: "30-60-90", eq: "$1 : \\sqrt{3} : 2$", cat: "geo" },
    { name: "45-45-90", eq: "$1 : 1 : \\sqrt{2}$", cat: "geo" },
    { name: "Circle Eq", eq: "$(x-h)^2+(y-k)^2=r^2$", cat: "geo" },
    { name: "Area Triangle", eq: "$A = \\frac{1}{2}bh$", cat: "geo" },
    { name: "Area Circle", eq: "$A = \\pi r^2$", cat: "geo" },
    { name: "Circumference", eq: "$C = 2\\pi r$", cat: "geo" },
    { name: "Vol Cylinder", eq: "$V = \\pi r^2 h$", cat: "geo" },
    { name: "Vol Cone", eq: "$V = \\frac{1}{3}\\pi r^2 h$", cat: "geo" },
    { name: "Vol Sphere", eq: "$V = \\frac{4}{3}\\pi r^3$", cat: "geo" },
    { name: "Percent Change", eq: "$\\frac{\\text{new}-\\text{old}}{\\text{old}} \\times 100$", cat: "data" },
    { name: "Distance", eq: "$d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$", cat: "geo" },
  ];

  const catColors: Record<string, string> = { alg: "#60a5fa", adv: "#a855f7", geo: "#f87171", data: "#fbbf24" };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {formulas.map((f, i) => (
          <div key={i} className="rounded-lg border border-border-default bg-bg-base p-2.5 text-center">
            <div className="mb-0.5 text-[9px] font-bold uppercase tracking-[1.5px] text-text-muted">{f.name}</div>
            <div className="text-[12px] font-bold" style={{ color: catColors[f.cat] }}>{renderMath(f.eq)}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>These are on the reference sheet, </strong>
        but knowing them <strong>by heart</strong> saves precious seconds per question. Bookmark this section for review.
      </div>
    </div>
  );
}

/* ── Slide: Growth & Score Projection ── */
export function GrowthProjectionVisual() {
  const [diagScore, setDiagScore] = useState("");

  const ranges = [
    { raw: "40+", scaled: "650\u2013720", level: "Strong", color: "#22c55e" },
    { raw: "35\u201339", scaled: "550\u2013650", level: "On Track", color: ACCENT },
    { raw: "28\u201334", scaled: "450\u2013550", level: "Building", color: "#fbbf24" },
    { raw: "20\u201327", scaled: "350\u2013450", level: "Developing", color: "#f59e0b" },
    { raw: "Below 20", scaled: "Below 350", level: "Foundation", color: "#ef4444" },
  ];

  const modules = [
    { domain: "Algebra", module: "Module 2", color: "#60a5fa" },
    { domain: "Advanced Math", module: "Module 3", color: "#a855f7" },
    { domain: "Problem-Solving & Data", module: "Module 4", color: "#fbbf24" },
    { domain: "Geometry", module: "Module 5", color: "#f87171" },
  ];

  return (
    <div className="space-y-4">
      {/* Score Ranges Table */}
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Raw Score</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Scaled Range</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Level</th>
            </tr>
          </thead>
          <tbody>
            {ranges.map((r, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-2.5 font-mono text-[13px] font-bold text-text-secondary last:border-b-0">{r.raw}</td>
                <td className="border-b border-border-default px-4 py-2.5 last:border-b-0">
                  <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{r.scaled}</code>
                </td>
                <td className="border-b border-border-default px-4 py-2.5 font-semibold last:border-b-0" style={{ color: r.color }}>{r.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Growth Comparison */}
      <div className="rounded-2xl border border-[rgba(34,197,94,.2)] bg-bg-base p-5">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Growth Check</div>
        <div className="mb-3 text-center text-sm text-text-muted">Enter your Module 1 diagnostic raw score to track growth:</div>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="mb-1 text-[10px] font-bold uppercase text-text-muted">Diagnostic</div>
            <input
              type="number" min={0} max={44} value={diagScore} onChange={e => setDiagScore(e.target.value)}
              placeholder="/44"
              className="w-[72px] rounded-lg border border-border-default bg-bg-surface p-2 text-center font-mono text-lg text-text-primary transition-all focus:border-[rgba(6,182,212,.5)]"
            />
          </div>
          <div className="text-2xl text-text-muted">&rarr;</div>
          <div className="text-center">
            <div className="mb-1 text-[10px] font-bold uppercase text-text-muted">Practice Test</div>
            <div className="text-lg font-bold" style={{ color: ACCENT }}>See results after quiz</div>
          </div>
        </div>
        {diagScore && parseInt(diagScore) >= 0 && (
          <div className="mt-3 text-center text-sm text-[#bcbcc8]">
            Even <strong>2\u20133 more correct answers</strong> represents real growth. Every skill you built carries forward to the PSAT 10 and SAT.
          </div>
        )}
      </div>

      {/* Domain Review Map */}
      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Domain \u2192 Module Map</div>
        <div className="grid grid-cols-2 gap-2.5">
          {modules.map((m, i) => (
            <div key={i} className="rounded-lg border border-border-default bg-bg-surface p-3 text-center">
              <div className="text-[13px] font-bold" style={{ color: m.color }}>{m.domain}</div>
              <div className="text-[12px] text-text-muted">Review: {m.module}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(168,85,247,.2)] bg-[rgba(168,85,247,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#a855f7" }}>This is your starting line, not your finish line. </strong>
        The PSAT 8/9 &rarr; PSAT 10 &rarr; PSAT/NMSQT &rarr; SAT is a progression. Every point you gain now carries forward.
      </div>
    </div>
  );
}
