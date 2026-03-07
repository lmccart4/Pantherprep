"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#C8102E";

/* ── Slide: Test Overview Structure ── */
export function TestOverviewVisual() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex w-full gap-4">
          <div className="flex-1 rounded-xl border border-[rgba(200,16,46,.25)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-center shadow-[0_0_20px_rgba(200,16,46,.1)]">
            <div className="text-sm font-bold" style={{ color: ACCENT }}>Module 1</div>
            <div className="font-mono text-2xl font-bold text-text-primary">22 Qs</div>
            <div className="text-xs text-text-muted">35 minutes</div>
          </div>
          <div className="flex items-center text-text-muted">&rarr;</div>
          <div className="flex-1 rounded-xl border border-[rgba(200,16,46,.25)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-center shadow-[0_0_20px_rgba(200,16,46,.1)]">
            <div className="text-sm font-bold" style={{ color: ACCENT }}>Module 2</div>
            <div className="font-mono text-2xl font-bold text-text-primary">22 Qs</div>
            <div className="text-xs text-text-muted">35 minutes</div>
          </div>
        </div>
        <div className="w-full rounded-xl border border-border-default bg-bg-base px-5 py-3 text-center">
          <span className="font-mono text-xl font-bold text-text-primary">44</span>
          <span className="ml-2 text-sm text-text-muted">total questions &middot; 70 minutes &middot; Desmos available</span>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Simulate real conditions:</strong> Quiet space. No phone. Set a timer. Have scratch paper. Use Desmos at desmos.com/calculator in another tab.
      </div>
    </div>
  );
}

/* ── Slide: Error Analysis Framework ── */
const ERROR_TYPES = [
  { type: "Content Gap", color: "#ef4444", icon: "📚", desc: "You didn't know the concept or formula.", fix: "Review the relevant module." },
  { type: "Careless/Arithmetic", color: "#f59e0b", icon: "✏️", desc: "You knew the concept but made a computation error.", fix: "Slow down, double-check calculations." },
  { type: "Misread the Question", color: "#a855f7", icon: "🪤", desc: "Solved correctly but answered the wrong thing.", fix: "Underline what the question asks for." },
  { type: "Strategy Error", color: "#3b82f6", icon: "🧭", desc: "Used an inefficient approach and ran out of time.", fix: "Practice the 5-Second Decision Tree." },
];

export function ErrorAnalysisVisual() {
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
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Key insight:</strong> Most students find that 30-40% of their errors are preventable misreads, not knowledge gaps. Honest classification is the fastest path to improvement.
      </div>
    </div>
  );
}

/* ── Slide: Score Projection Table ── */
export function ScoreProjectionVisual() {
  const [raw, setRaw] = useState("");
  const rawV = parseInt(raw);
  let result: { scaled: number; level: string; color: string } | null = null;

  if (!isNaN(rawV) && rawV >= 0 && rawV <= 44) {
    let scaled: number, level: string, color: string;
    if (rawV >= 40) { scaled = 750 + Math.round((rawV - 40) / 4 * 50); level = "Excellent"; color = "#22c55e"; }
    else if (rawV >= 35) { scaled = 650 + Math.round((rawV - 35) / 5 * 100); level = "Strong"; color = "#22c55e"; }
    else if (rawV >= 30) { scaled = 570 + Math.round((rawV - 30) / 5 * 80); level = "Good"; color = "#60a5fa"; }
    else if (rawV >= 25) { scaled = 500 + Math.round((rawV - 25) / 5 * 70); level = "Building"; color = "#fbbf24"; }
    else { scaled = 200 + Math.round(rawV / 25 * 300); level = "Developing"; color = "#ef4444"; }
    scaled = Math.min(scaled, 800);
    result = { scaled, level, color };
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Raw Score</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Approx. Scaled</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Level</th>
            </tr>
          </thead>
          <tbody>
            {[
              { range: "40-44", scaled: "750-800", level: "Excellent", color: "#22c55e" },
              { range: "35-39", scaled: "650-750", level: "Strong", color: "#22c55e" },
              { range: "30-34", scaled: "570-650", level: "Good", color: "#60a5fa" },
              { range: "25-29", scaled: "500-570", level: "Building", color: "#fbbf24" },
              { range: "Below 25", scaled: "Below 500", level: "Developing", color: "#ef4444" },
            ].map((r, i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-2.5 font-mono text-text-secondary last:border-b-0">{r.range}</td>
                <td className="border-b border-border-default px-4 py-2.5 last:border-b-0">
                  <code className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{r.scaled}</code>
                </td>
                <td className="border-b border-border-default px-4 py-2.5 last:border-b-0" style={{ color: r.color }}>{r.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-2xl border border-[rgba(200,16,46,.2)] bg-bg-base p-5 shadow-[0_0_24px_rgba(200,16,46,.06)]">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Quick Score Estimator</div>
        <div className="flex items-center gap-4">
          <div>
            <div className="mb-1 text-xs text-text-muted">Raw Score (/44)</div>
            <input
              type="number" min={0} max={44} placeholder="/44" value={raw}
              onChange={e => setRaw(e.target.value)}
              className="w-[80px] rounded-lg border border-border-default bg-bg-surface p-2.5 text-center font-mono text-xl text-text-primary transition-all focus:border-[rgba(200,16,46,.5)] focus:shadow-[0_0_0_3px_rgba(200,16,46,.08)]"
            />
          </div>
          {result && (
            <div className="flex-1 text-center">
              <div className="font-mono text-3xl font-bold" style={{ color: result.color }}>{result.scaled}</div>
              <div className="text-sm text-text-muted">{result.level}</div>
            </div>
          )}
          {!result && (
            <div className="flex-1 text-center text-sm text-text-muted">Enter your raw score to estimate.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Slide: Must-Memorize Formula Card ── */
export function FormulaCardVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const domains = [
    { name: "Algebra", color: "#60a5fa", pct: "~35%", front: "Slope, intercept, systems, inequalities", back: "Slope $m = \\frac{y_2-y_1}{x_2-x_1}$. Slope-intercept: $y = mx + b$. Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$. Parallel: same slope. Perpendicular: negative reciprocal." },
    { name: "Advanced Math", color: "#a855f7", pct: "~35%", front: "Quadratics, exponents, functions", back: "Vertex $x = \\frac{-b}{2a}$. Discriminant: $b^2-4ac$ (>0: 2, =0: 1, <0: 0). Difference of squares: $a^2-b^2 = (a+b)(a-b)$. Growth: $a(1+r)^x$. Decay: $a(1-r)^x$." },
    { name: "Problem-Solving & Data", color: "#fbbf24", pct: "~15%", front: "Percents, stats, probability", back: "% change = (new-old)/old \u00d7 100. Mean = sum/count. Conditional: $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$. Median resists outliers. Random assignment \u2192 causation." },
    { name: "Geometry & Trig", color: "#f87171", pct: "~15%", front: "Circles, triangles, trig ratios", back: "Circle: $(x-h)^2+(y-k)^2=r^2$. 30-60-90: $x, x\\sqrt{3}, 2x$. 45-45-90: $x, x, x\\sqrt{2}$. SOH-CAH-TOA. $\\sin^2\\theta + \\cos^2\\theta = 1$. $\\sin(x) = \\cos(90°-x)$." },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5">
      {domains.map((d, i) => (
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
              <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: d.color }}>tap to see formulas &rarr;</div>
            </>
          ) : (
            <>
              <div className="text-[13px] leading-[1.7] text-[#bcbcc8]">{renderMath(d.back)}</div>
              <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: d.color }}>&larr; tap to flip back</div>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide: Next Steps After Practice Test ── */
export function NextStepsVisual() {
  return (
    <div className="space-y-2">
      {[
        { step: 1, title: "Score your test", desc: "Calculate your raw score out of 44.", color: ACCENT },
        { step: 2, title: "Classify every error", desc: "Content Gap, Careless, Misread, or Strategy.", color: "#f97316" },
        { step: 3, title: "Identify weakest domain", desc: "Revisit that module for targeted review.", color: "#fbbf24" },
        { step: 4, title: "Compare to diagnostic", desc: "Any improvement shows your study is working.", color: "#22c55e" },
        { step: 5, title: "Move to Module 10", desc: "Final review and test-day preparation.", color: "#60a5fa" },
      ].map((s) => (
        <div key={s.step} className="flex items-center gap-3 rounded-xl border border-border-default bg-bg-base px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: s.color }}>{s.step}</span>
          <div>
            <div className="text-sm font-bold text-text-primary">{s.title}</div>
            <div className="text-xs text-text-muted">{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
