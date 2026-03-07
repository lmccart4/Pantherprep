"use client";

import { useState } from "react";

const ACCENT = "#C8102E";

/* ── Slide 1: Test Structure Table ── */
export function TestStructureVisual() {
  const rows = [
    ["Total Questions", <><code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>44</code> (22 per module)</>],
    ["Total Time", <><code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>70 minutes</code> (35 per module)</>],
    ["Time per Question", <>~ <code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>95 seconds</code> average</>],
    ["Adaptive Format", "Module 2 difficulty adjusts based on Module 1 performance"],
    ["Question Types", <>~75% multiple choice (4 options) &amp; ~25% student-produced response</>],
    ["Calculator", <>Built-in <strong>Desmos</strong> with graphing/scientific toggle on ALL questions</>],
    ["Scoring", <><code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>200--800</code> Math section score (no penalty for wrong answers)</>],
    ["Reference Sheet", "Area/volume formulas, special right triangles, circle properties"],
  ] as const;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Feature</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, value], i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">{label}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>CAS Calculator Update (2025): </strong>
        CAS calculators are now <strong>banned</strong> on the SAT. You may only use the built-in Desmos or an approved non-CAS calculator. Desmos now offers a scientific/graphing toggle.
      </div>
      <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#22c55e" }}>No wrong-answer penalty </strong>
        means you should <strong>answer every single question</strong> -- even if you have to guess. A random guess gives you a 25% chance on multiple choice. Never leave anything blank.
      </div>
    </div>
  );
}

/* ── Slide 2: Adaptive Module System ── */
export function AdaptiveVisual() {
  const [simVal, setSimVal] = useState(15);

  function getSimData(v: number) {
    const pct = v / 22;
    if (pct >= 0.68) return { route: "Harder Module 2", color: "#22c55e", floor: 400, ceil: 800, bg: "rgba(34,197,94,.07)" };
    if (pct >= 0.55) return { route: "Borderline -- Could go either way", color: "#fbbf24", floor: 350, ceil: 650, bg: "rgba(251,191,36,.1)" };
    return { route: "Easier Module 2", color: "#ef4444", floor: 200, ceil: Math.min(560 + v * 5, 630), bg: "rgba(239,68,68,.07)" };
  }

  const sim = getSimData(simVal);
  const meterPct = ((sim.ceil - 200) / 600) * 100;

  return (
    <div className="space-y-5">
      {/* Flow diagram */}
      <div className="flex flex-col items-center gap-2.5">
        <div className="min-w-[220px] rounded-xl border border-[rgba(200,16,46,.25)] bg-[rgba(200,16,46,.07)] px-6 py-3.5 text-center text-sm font-semibold shadow-[0_0_24px_rgba(200,16,46,.15)]">
          Module 1: Mixed Difficulty<br />
          <span className="text-xs font-normal text-text-muted">22 questions &middot; 35 minutes &middot; Easy &rarr; Hard</span>
        </div>
        <div className="text-text-muted">&darr; Your performance determines&hellip;</div>
        <div className="flex w-full gap-4">
          <div className="flex-1 rounded-xl border border-[rgba(34,197,94,.25)] bg-[rgba(34,197,94,.07)] px-5 py-3.5 text-center text-sm font-semibold shadow-[0_0_20px_rgba(34,197,94,.08)]">
            Module 2: <strong>Harder</strong><br />
            <span className="text-xs font-normal text-text-muted">Unlocks scores up to 800</span>
          </div>
          <div className="flex-1 rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-3.5 text-center text-sm font-semibold">
            Module 2: <strong>Easier</strong><br />
            <span className="text-xs font-normal text-text-muted">Score ceiling ~560--630</span>
          </div>
        </div>
      </div>

      {/* Simulator */}
      <div className="rounded-2xl border border-[rgba(200,16,46,.2)] bg-bg-base p-6 shadow-[0_0_32px_rgba(200,16,46,.15)]">
        <div className="mb-3.5 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Module 1 Routing Simulator</div>
        <div className="mb-4 flex items-center gap-4">
          <span className="font-mono text-xs text-text-muted">0</span>
          <input
            type="range" min={0} max={22} value={simVal}
            onChange={e => setSimVal(parseInt(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
            style={{ background: `linear-gradient(90deg, #ef4444 0%, #fbbf24 50%, #22c55e 100%)` }}
          />
          <span className="font-mono text-xs text-text-muted">22</span>
          <div className="min-w-[56px] text-center font-mono text-2xl font-bold text-text-primary">{simVal}</div>
        </div>
        <div className="rounded-xl p-4 text-center transition-all duration-300" style={{ background: sim.bg }}>
          <div className="mb-1.5 text-base font-bold" style={{ color: sim.color }}>
            {simVal}/22 correct &rarr; {sim.route}
          </div>
          <div className="text-sm text-text-secondary">Estimated score range: {sim.floor}&ndash;{sim.ceil}</div>
        </div>
        <div className="mt-3.5">
          <div className="mb-1.5 flex justify-between text-[11px] font-medium text-text-muted">
            <span>Score Floor</span>
            <span className="font-mono">{sim.floor}&ndash;{sim.ceil}</span>
            <span>Score Ceiling</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-border-default">
            <div
              className="h-full rounded-full transition-all duration-400"
              style={{ width: `${meterPct}%`, background: `linear-gradient(90deg, ${sim.color}, ${sim.color}cc)`, boxShadow: `0 0 12px ${sim.color}44` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">Module 1 is make-or-break. </strong>
        Missing just 2&ndash;3 extra questions can drop you from the harder Module 2 to the easier one -- and cap your maximum score by 150+ points. Accuracy in Module 1 matters more than speed.
      </div>
    </div>
  );
}

/* ── Slide 3: Four Domains ── */
const DOMAINS = [
  { name: "Algebra", pct: "~35%", qs: "13--15 questions", color: "#34d399", front: "Linear equations, systems, inequalities, functions", back: "Topics: One-variable linear equations, slope & rate of change, slope-intercept/point-slope/standard form, systems by substitution & elimination, linear inequalities & compound inequalities, word problem translation. The single largest content area. Covered in Module 2." },
  { name: "Advanced Math", pct: "~35%", qs: "13--15 questions", color: "#a855f7", front: "Quadratics, polynomials, exponents, functions & transformations", back: "Topics: Exponent rules, polynomial operations, factoring (GCF, trinomial, difference of squares), quadratic equations & three forms, discriminant, function notation, exponential growth/decay, transformations, composition, rational expressions. Covered in Modules 3--4." },
  { name: "Problem-Solving & Data", pct: "~15%", qs: "5--7 questions", color: "#fbbf24", front: "Ratios, percentages, statistics, probability", back: "Topics: Ratios & rates, percentages & percent change, mean/median/range/standard deviation (conceptual), scatterplots & lines of best fit, probability & two-way tables, study design (correlation vs. causation). Covered in Module 5." },
  { name: "Geometry & Trig", pct: "~15%", qs: "5--7 questions", color: "#f87171", front: "Lines, angles, triangles, circles, SOH-CAH-TOA", back: "Topics: Area & volume, lines/angles/transversals, triangles & Pythagorean theorem, special right triangles (30-60-90, 45-45-90), circles (arc, sector, central/inscribed angles, equations), basic trigonometry (SOH-CAH-TOA), radians. Covered in Module 6." },
];

export function DomainsVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-4">
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
                <div className="text-[13px] font-medium text-text-muted">{d.qs}</div>
                <div className="mt-1.5 text-[13px] leading-[1.6] text-text-muted">{d.front}</div>
                <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: d.color }}>tap to see topics &rarr;</div>
              </>
            ) : (
              <>
                <div className="text-sm leading-[1.7] text-[#bcbcc8]">{d.back}</div>
                <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: d.color }}>&larr; tap to flip back</div>
              </>
            )}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Key Insight: </strong>
        Algebra and Advanced Math together account for roughly <strong>70%</strong> of the test. Mastering these two domains is the single highest-impact investment of your study time.
      </div>
    </div>
  );
}

/* ── Slide 4: Strategy Toolkit ── */
const STRATS = [
  { icon: "\uD83D\uDD0C", title: "Plug In (PIYON)", hint: "Variables in answer choices? Choose numbers.", back: "When you see variables in the answer choices, pick easy numbers (2, 3, 5, 10, 100), solve to get a target answer, then test each choice with your numbers. Avoid 0 and 1." },
  { icon: "\uD83D\uDD04", title: "Backsolve (PITA)", hint: "Number answers? Plug them back in.", back: "When answer choices are specific numbers, start with B or C (middle value) and plug it into the problem. If too big, try smaller; if too small, try larger." },
  { icon: "\uD83D\uDCCF", title: "Ballpark", hint: "Estimate first, eliminate the impossible.", back: "Before calculating, estimate the answer to eliminate clearly wrong choices. 15% of 820 \u2248 120 -- any choice far from that is gone. Especially powerful on geometry." },
  { icon: "\uD83D\uDCCA", title: "Desmos", hint: "Your built-in graphing superpower.", back: "~40% of SAT math questions can be solved or verified with Desmos. Graph equations, find intersections, use sliders, run regressions. Module 7 covers this in depth." },
  { icon: "\u274C", title: "POE for Math", hint: "Wrong answers reveal themselves.", back: "If the question asks for a positive value, eliminate negatives. If context requires small numbers, eliminate large ones. POE turns a 25% guess into 33% or 50%." },
  { icon: "\u23F1\uFE0F", title: "POOD + LOTD", hint: "Your order, your pace, your backup letter.", back: "Answer confident questions first, flag uncertain ones. On second pass, attempt flagged questions. Use Letter of the Day (always the same letter) for remaining guesses. Never leave blanks." },
];

export function StrategyVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
      {STRATS.map((s, i) => (
        <button
          key={i}
          onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
          className="cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-250 hover:-translate-y-0.5"
          style={{ borderColor: flipped[i] ? `${ACCENT}33` : "var(--color-border-default)", boxShadow: flipped[i] ? `0 0 20px rgba(200,16,46,.15)` : "none" }}
        >
          {!flipped[i] ? (
            <div className="text-center">
              <div className="mb-2 text-[2.2rem] drop-shadow-lg">{s.icon}</div>
              <div className="mb-1.5 text-sm font-bold tracking-[0.01em] text-text-primary">{s.title}</div>
              <div className="text-xs leading-[1.5] text-text-muted">{s.hint}</div>
              <div className="mt-2.5 text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: ACCENT }}>tap to flip</div>
            </div>
          ) : (
            <div className="text-sm leading-[1.7] text-[#bcbcc8]">{s.back}</div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide 5: Error Classification ── */
const ERROR_TYPES = [
  { type: "Content Gap", icon: "\uD83D\uDCDA", color: "#ef4444", fix: "Review the relevant module.", desc: "You didn't know the math concept or formula needed to solve the problem." },
  { type: "Careless Error", icon: "\u270F\uFE0F", color: "#f59e0b", fix: "Double-check calculations and re-read your work.", desc: "You knew the math but made a simple arithmetic or transcription mistake." },
  { type: "Time Pressure", icon: "\u23F1\uFE0F", color: "#6b7280", fix: "Practice pacing: ~25 min first pass, ~8 min second pass, ~2 min final check.", desc: "You ran out of time and had to rush or guess on this question." },
  { type: "Misread / Trap", icon: "\uD83E\uDE64", color: "#a855f7", fix: "Always re-read what the question actually asks for before selecting.", desc: "You solved correctly but answered the wrong thing, or fell for a trap answer." },
  { type: "Strategy Gap", icon: "\uD83E\uDDED", color: "#3b82f6", fix: "Build the habit of choosing the fastest method (Module 7).", desc: "You knew the content but used the wrong approach (e.g., algebra when Desmos was faster)." },
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl" style={{ background: `${e.color}15` }}>
              {e.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[15px] font-bold" style={{ color: e.color }}>{e.type}</span>
                <span className="text-[11px] text-text-muted">{expanded === i ? "\u25B2" : "\u25BC"}</span>
              </div>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{e.desc}</div>
            </div>
          </div>
          {expanded === i && (
            <div className="mt-3 rounded-lg px-4 py-3 text-sm leading-[1.7]" style={{ background: `${e.color}08`, borderLeft: `3px solid ${e.color}` }}>
              <strong style={{ color: e.color }}>Fix: </strong>
              <span className="text-[#bcbcc8]">{e.fix}</span>
            </div>
          )}
        </button>
      ))}
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Pro Tip: </strong>
        Most students assume their errors are Content Gaps -- but research shows <strong>Careless Errors</strong> and <strong>Misread/Trap</strong> errors are far more common. Honest classification is the fastest path to improvement.
      </div>
    </div>
  );
}

/* ── Slide 7: Why SAT Matters ── */
export function WhySATMattersVisual() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-bg-base p-5">
        <div className="mb-3 text-sm font-bold text-text-primary">Schools Requiring/Encouraging SAT (2025--26)</div>
        <div className="flex flex-wrap gap-2">
          {["Harvard", "Yale", "Dartmouth", "Brown", "MIT", "Caltech", "Stanford", "Georgetown", "Cornell", "Penn"].map(s => (
            <span key={s} className="rounded-lg border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.05)] px-3 py-1.5 text-[13px] font-medium text-text-secondary">{s}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border-default bg-bg-base p-4 text-center">
          <div className="font-mono text-2xl font-bold" style={{ color: ACCENT }}>508</div>
          <div className="mt-1 text-[11px] text-text-muted">Mean SAT Math (2025)</div>
        </div>
        <div className="rounded-xl border border-border-default bg-bg-base p-4 text-center">
          <div className="font-mono text-2xl font-bold" style={{ color: "#fbbf24" }}>34%</div>
          <div className="mt-1 text-[11px] text-text-muted">Met 530 Benchmark</div>
        </div>
        <div className="rounded-xl border border-border-default bg-bg-base p-4 text-center">
          <div className="font-mono text-2xl font-bold" style={{ color: "#22c55e" }}>9%</div>
          <div className="mt-1 text-[11px] text-text-muted">Scored 700+</div>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#22c55e" }}>Superscore Advantage: </strong>
        Most top-25 schools <strong>superscore</strong> the SAT -- they take your highest Math score and highest R&W score across all sittings. Every point you gain on any test date counts toward your best composite.
      </div>
    </div>
  );
}

/* ── Slide 6: Score Projector ── */
export function ScoreProjectorVisual() {
  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");
  const [path, setPath] = useState("");

  const m1v = parseInt(m1), m2v = parseInt(m2);
  let result: { total: number; capped: number; lvl: string; color: string; advice: string; benchPct: number; scorePct: number } | null = null;

  if (!isNaN(m1v) && !isNaN(m2v) && m1v >= 0 && m1v <= 22 && m2v >= 0 && m2v <= 22 && path) {
    const total = m1v + m2v;
    const baseScaled = Math.round(200 + (total / 44) * 600);
    const capped = path === "hard" ? Math.min(Math.max(baseScaled, 200), 800) : Math.min(Math.max(baseScaled, 200), 630);
    let lvl: string, color: string, advice: string;
    if (capped >= 650) { lvl = "Strong"; color = "#22c55e"; advice = "Focus on strategy (Modules 7--8) and advanced topics to push even higher."; }
    else if (capped >= 530) { lvl = "On Track"; color = ACCENT; advice = "You're at or above the college readiness benchmark! Focus on your weakest domain to keep growing."; }
    else if (capped >= 400) { lvl = "Building"; color = "#fbbf24"; advice = "Complete all modules with extra attention on Algebra (Module 2) and Advanced Math (Modules 3--4)."; }
    else { lvl = "Developing"; color = "#ef4444"; advice = "Start with foundational skills in Modules 2 and 5. Build your base first."; }
    result = { total, capped, lvl, color, advice, benchPct: ((530 - 200) / 600) * 100, scorePct: ((capped - 200) / 600) * 100 };
  }

  return (
    <div className="rounded-2xl border border-[rgba(200,16,46,.2)] bg-bg-base p-6 shadow-[0_0_24px_rgba(200,16,46,.06)]">
      <div className="mb-5 grid grid-cols-3 gap-5">
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Module 1 Raw</div>
          <input
            type="number" placeholder="/22" min={0} max={22} value={m1}
            onChange={e => setM1(e.target.value)}
            className="w-[88px] rounded-lg border border-border-default bg-bg-surface p-2.5 text-center font-mono text-xl text-text-primary transition-all focus:border-[rgba(200,16,46,.5)] focus:shadow-[0_0_0_3px_rgba(200,16,46,.08)]"
          />
        </div>
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Module 2 Raw</div>
          <input
            type="number" placeholder="/22" min={0} max={22} value={m2}
            onChange={e => setM2(e.target.value)}
            className="w-[88px] rounded-lg border border-border-default bg-bg-surface p-2.5 text-center font-mono text-xl text-text-primary transition-all focus:border-[rgba(200,16,46,.5)] focus:shadow-[0_0_0_3px_rgba(200,16,46,.08)]"
          />
        </div>
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Module 2 Path</div>
          <select
            value={path}
            onChange={e => setPath(e.target.value)}
            className="rounded-lg border border-border-default bg-bg-surface px-3 py-2.5 text-sm text-text-primary transition-all focus:border-[rgba(200,16,46,.5)]"
          >
            <option value="">Select...</option>
            <option value="hard">Harder (high ceiling)</option>
            <option value="easy">Easier (capped)</option>
          </select>
        </div>
      </div>
      {result ? (
        <div className="text-center">
          <div className="font-mono text-[2.4rem] font-bold" style={{ color: result.color, textShadow: `0 0 30px ${result.color}44` }}>{result.capped}</div>
          <div className="mt-1 text-[13px] text-text-secondary">{result.total}/44 raw &middot; {result.lvl}</div>
          <div className="relative my-4 h-2.5 overflow-hidden rounded-full bg-border-default">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${result.scorePct}%`, background: `linear-gradient(90deg, ${result.color}, ${result.color}cc)`, boxShadow: `0 0 12px ${result.color}33` }} />
            <div className="absolute top-[-8px] h-[26px] w-0.5 rounded-sm bg-[#06d6a0]" style={{ left: `${result.benchPct}%` }} title="530 Benchmark" />
          </div>
          <div className="flex justify-between font-mono text-[11px] text-text-muted">
            <span>200</span>
            <span className="font-sans font-semibold text-[#06d6a0]">530 Benchmark &uarr;</span>
            <span>800</span>
          </div>
          <div className="mt-4 text-sm leading-[1.7] text-[#bcbcc8]">{result.advice}</div>
        </div>
      ) : (
        <div className="py-5 text-center text-sm text-text-muted">Enter both scores and routing path to see your estimated scaled score.</div>
      )}
    </div>
  );
}
