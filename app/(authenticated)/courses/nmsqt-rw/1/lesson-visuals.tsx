"use client";

import { useState } from "react";

const ACCENT = "#d4a017";

/* ── Slide 1: Test Structure Table ── */
export function TestStructureVisual() {
  const rows = [
    ["Total Questions", <><code className="rounded-md bg-[rgba(212,160,23,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>54</code> (27 per module)</>],
    ["Total Time", <><code className="rounded-md bg-[rgba(212,160,23,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>64 minutes</code> (32 per module)</>],
    ["Time per Question", <>~ <code className="rounded-md bg-[rgba(212,160,23,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>71 seconds</code> average</>],
    ["Adaptive Format", "Module 2 difficulty adjusts based on Module 1 performance"],
    ["Question Types", "All multiple choice (4 options: A/B/C/D)"],
    ["Passage Format", "One short passage (25-150 words) paired with one question"],
    ["Scoring", <><code className="rounded-md bg-[rgba(212,160,23,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>160-760</code> R&W section score (no penalty for wrong answers)</>],
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
      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>One passage, one question. </strong>
        No more 10-question-per-passage marathons. Each question is a fresh, self-contained reading task.
      </div>
      <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#22c55e" }}>No wrong-answer penalty </strong>
        means you should <strong>answer every single question</strong> -- even if you have to guess. Never leave anything blank.
      </div>
    </div>
  );
}

/* ── Slide 2: Four Domains Cards ── */
const DOMAINS = [
  { name: "Craft & Structure", pct: "~28%", qs: "13-15 questions", color: "#60a5fa", front: "Words in Context, Text Structure & Purpose, Cross-Text Connections", back: "The first questions you see in each module -- and the easiest. Words in Context (vocabulary), Text Structure (purpose of a sentence or paragraph), and Cross-Text (comparing two short passages). Covered in Modules 4, 7." },
  { name: "Information & Ideas", pct: "~26%", qs: "12-14 questions", color: "#34d399", front: "Central Ideas & Details, Command of Evidence, Inferences", back: "Central Ideas (main point of a passage), Evidence (textual and quantitative), Inferences (conclusions supported by the text). Covered in Modules 5, 6." },
  { name: "Standard English Conventions", pct: "~26%", qs: "11-15 questions", color: "#fbbf24", front: "Boundaries, Subject-Verb Agreement, Tense, Modifiers, Parallelism", back: "All use the same prompt: 'Which choice conforms to Standard English?' A finite set of learnable rules -- the fastest path to score gains. Covered in Modules 2, 3." },
  { name: "Expression of Ideas", pct: "~20%", qs: "8-12 questions", color: "#f472b6", front: "Transitions and Rhetorical Synthesis", back: "The hardest questions on the test appear here. Transitions test logical connections; Synthesis tests combining research notes for a specific rhetorical goal. Covered in Modules 8, 9." },
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
                <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: d.color }}>tap to see details &rarr;</div>
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
      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Domain Order: </strong>
        Questions always appear in order: Craft &amp; Structure &rarr; Information &amp; Ideas &rarr; Conventions &rarr; Expression of Ideas, easy to hard within each domain.
      </div>
    </div>
  );
}

/* ── Slide 3: Adaptive Module System ── */
export function AdaptiveVisual() {
  const [simVal, setSimVal] = useState(14);

  function getSimData(v: number) {
    const pct = v / 27;
    if (pct >= 0.63) return { route: "Harder Module 2", color: "#22c55e", floor: 400, ceil: 760, bg: "rgba(34,197,94,.07)" };
    if (pct >= 0.48) return { route: "Borderline -- Could go either way", color: "#fbbf24", floor: 350, ceil: 630, bg: "rgba(251,191,36,.1)" };
    return { route: "Easier Module 2", color: "#ef4444", floor: 160, ceil: Math.min(550 + v * 6, 630), bg: "rgba(239,68,68,.07)" };
  }

  const sim = getSimData(simVal);
  const meterPct = ((sim.ceil - 160) / 600) * 100;

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-2.5">
        <div className="min-w-[220px] rounded-xl border border-[rgba(212,160,23,.25)] bg-[rgba(212,160,23,.07)] px-6 py-3.5 text-center text-sm font-semibold shadow-[0_0_24px_rgba(212,160,23,.15)]">
          Module 1: Mixed Difficulty<br />
          <span className="text-xs font-normal text-text-muted">27 questions &middot; 32 minutes &middot; All 4 domains</span>
        </div>
        <div className="text-text-muted">&darr; Your performance determines&hellip;</div>
        <div className="flex w-full gap-4">
          <div className="flex-1 rounded-xl border border-[rgba(34,197,94,.25)] bg-[rgba(34,197,94,.07)] px-5 py-3.5 text-center text-sm font-semibold shadow-[0_0_20px_rgba(34,197,94,.08)]">
            Module 2: <strong>Harder</strong><br />
            <span className="text-xs font-normal text-text-muted">Unlocks scores up to 760</span>
          </div>
          <div className="flex-1 rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-3.5 text-center text-sm font-semibold">
            Module 2: <strong>Easier</strong><br />
            <span className="text-xs font-normal text-text-muted">Score ceiling ~600-630</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(212,160,23,.2)] bg-bg-base p-6 shadow-[0_0_32px_rgba(212,160,23,.15)]">
        <div className="mb-3.5 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Module 1 Routing Simulator</div>
        <div className="mb-4 flex items-center gap-4">
          <span className="font-mono text-xs text-text-muted">0</span>
          <input
            type="range" min={0} max={27} value={simVal}
            onChange={e => setSimVal(parseInt(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
            style={{ background: `linear-gradient(90deg, #ef4444 0%, #fbbf24 50%, #22c55e 100%)` }}
          />
          <span className="font-mono text-xs text-text-muted">27</span>
          <div className="min-w-[56px] text-center font-mono text-2xl font-bold text-text-primary">{simVal}</div>
        </div>
        <div className="rounded-xl p-4 text-center transition-all duration-300" style={{ background: sim.bg }}>
          <div className="mb-1.5 text-base font-bold" style={{ color: sim.color }}>
            {simVal}/27 correct &rarr; {sim.route}
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
        Accuracy on the first 27 questions matters more than speed. Getting routed to the harder Module 2 is the single most important factor in your score.
      </div>
    </div>
  );
}

/* ── Slide 4: Selection Index Calculator ── */
export function SelectionIndexVisual() {
  const [rw, setRw] = useState("");
  const [math, setMath] = useState("");

  const rwV = parseInt(rw), mathV = parseInt(math);
  let result: { index: number; level: string; color: string; advice: string } | null = null;

  if (!isNaN(rwV) && !isNaN(mathV) && rwV >= 160 && rwV <= 760 && mathV >= 160 && mathV <= 760) {
    const index = Math.round((2 * rwV + mathV) / 10);
    let level: string, color: string, advice: string;
    if (index >= 223) { level = "NJ Semifinalist Range"; color = "#a855f7"; advice = "You are in the top tier. Focus on eliminating careless errors to lock in your score."; }
    else if (index >= 210) { level = "Commended Student Range"; color = "#22c55e"; advice = "Strong position! A 10-point R&W gain adds +2 to your index -- focus on R&W for maximum impact."; }
    else if (index >= 190) { level = "Competitive Range"; color = ACCENT; advice = "Keep pushing! Focus on your weakest R&W domain for the biggest gains."; }
    else { level = "Building"; color = "#fbbf24"; advice = "Every point of growth matters. Complete all course modules with focus on Conventions and Words in Context."; }
    result = { index, level, color, advice };
  }

  return (
    <div className="rounded-2xl border border-[rgba(167,139,250,.2)] bg-bg-base p-6 shadow-[0_0_24px_rgba(167,139,250,.06)]">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-text-muted">Selection Index Calculator</div>
      <div className="mb-1 text-sm text-text-muted">Selection Index = (2 &times; R&W + Math) &divide; 10</div>
      <div className="mb-5 grid grid-cols-2 gap-5 pt-3">
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">R&W Score</div>
          <input
            type="number" placeholder="160-760" min={160} max={760} value={rw}
            onChange={e => setRw(e.target.value)}
            className="w-[100px] rounded-lg border border-border-default bg-bg-surface p-2.5 text-center font-mono text-xl text-text-primary transition-all focus:border-[rgba(212,160,23,.5)] focus:shadow-[0_0_0_3px_rgba(212,160,23,.08)]"
          />
        </div>
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Math Score</div>
          <input
            type="number" placeholder="160-760" min={160} max={760} value={math}
            onChange={e => setMath(e.target.value)}
            className="w-[100px] rounded-lg border border-border-default bg-bg-surface p-2.5 text-center font-mono text-xl text-text-primary transition-all focus:border-[rgba(212,160,23,.5)] focus:shadow-[0_0_0_3px_rgba(212,160,23,.08)]"
          />
        </div>
      </div>
      {result ? (
        <div className="text-center">
          <div className="font-mono text-[2.4rem] font-bold" style={{ color: result.color, textShadow: `0 0 30px ${result.color}44` }}>{result.index}</div>
          <div className="mt-1 text-[13px] text-text-secondary">{result.level}</div>
          <div className="mt-3 text-sm leading-[1.7] text-[#bcbcc8]">{result.advice}</div>
          <div className="mt-3 rounded-xl border border-[rgba(167,139,250,.2)] bg-[rgba(167,139,250,.07)] px-4 py-3 text-sm">
            <strong style={{ color: "#a855f7" }}>R&W is worth 2x Math.</strong> A 10-point R&W gain adds +2 to your index vs. only +1 for Math.
          </div>
        </div>
      ) : (
        <div className="py-5 text-center text-sm text-text-muted">Enter both scores to calculate your Selection Index.</div>
      )}
    </div>
  );
}

/* ── Slide 5: Error Classification Cards ── */
const ERROR_TYPES = [
  { type: "Content Gap", icon: "📚", color: "#ef4444", fix: "Review the relevant module.", desc: "You didn't know the rule, word, or concept needed to solve the problem." },
  { type: "Trap Answer", icon: "🪤", color: "#a855f7", fix: "Learn the common trap patterns for each question type.", desc: "You fell for a distractor that was designed to look correct." },
  { type: "Misread", icon: "👁️", color: "#3b82f6", fix: "Always re-read what the question asks before selecting your answer.", desc: "You went too fast and missed a key word or detail in the passage or question." },
  { type: "Time Pressure", icon: "⏱️", color: "#6b7280", fix: "Practice pacing -- use the two-pass method.", desc: "You ran out of time and had to rush or guess on this question." },
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
                <span className="text-[11px] text-text-muted">{expanded === i ? "▲" : "▼"}</span>
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
    </div>
  );
}

/* ── Slide 6: Growth Trajectory ── */
export function GrowthVisual() {
  const tests = [
    { name: "PSAT 8/9", range: "120-720", diff: "Simpler passages, more common vocabulary", color: "#06b6d4", flex: 1 },
    { name: "PSAT/NMSQT", range: "160-760", diff: "National Merit eligibility (11th grade)", color: ACCENT, flex: 1 },
    { name: "SAT", range: "200-800", diff: "Hardest passages, most nuanced vocabulary", color: "#C8102E", flex: 1.3 },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[rgba(6,214,160,.2)] bg-bg-base p-6 shadow-[0_0_24px_rgba(6,214,160,.06)]">
        <div className="my-3.5 flex h-11 items-center overflow-hidden rounded-lg shadow-md">
          {tests.map((t, i) => (
            <div key={i} className="flex h-full items-center justify-center text-[11px] font-bold tracking-[0.5px] text-white" style={{ flex: t.flex, background: t.color }}>{t.name}</div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] font-medium text-text-muted">
          <span>8th-9th Grade</span><span>10th-11th Grade</span><span>11th-12th Grade</span>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-border-default">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Test</th>
                <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">R&W Score Range</th>
                <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Key Difference</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t, i) => (
                <tr key={i}>
                  <td className="border-b border-border-default px-4 py-3 font-bold last:border-b-0" style={{ color: t.color }}>{t.name}</td>
                  <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">
                    <code className="rounded-md bg-[rgba(212,160,23,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{t.range}</code>
                  </td>
                  <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{t.diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center text-sm text-[#bcbcc8]">
          <strong className="text-[#06d6a0]">College Readiness Benchmark (R&W): 460</strong><br />
          <span className="text-[13px] text-text-muted">That&apos;s your first target. Every point of growth carries forward to the SAT.</span>
        </div>
      </div>
    </div>
  );
}
