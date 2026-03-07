"use client";

import { useState } from "react";

const ACCENT = "#d4a017";
const PSDA = "#fbbf24";

/* ── Slide 1: Ratios, Rates & Proportions Formula Grid ── */
export function RatioFormulasVisual() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { name: "Proportion", eq: "a/b = c/d \u2192 ad = bc", color: PSDA },
          { name: "Unit Rate", eq: '"per" = \u00F7', color: "#60a5fa" },
          { name: "Percent", eq: "part/whole \u00D7 100", color: "#34d399" },
          { name: "Percent Change", eq: "(new \u2212 old)/old \u00D7 100", color: "#ef4444" },
          { name: "Percent Increase", eq: "new = old \u00D7 (1 + r)", color: "#22c55e" },
          { name: "Percent Decrease", eq: "new = old \u00D7 (1 \u2212 r)", color: "#f87171" },
        ].map((f, i) => (
          <div key={i} className="rounded-xl border bg-bg-base p-3.5 text-center" style={{ borderColor: `${f.color}33` }}>
            <div className="text-xs font-bold" style={{ color: f.color }}>{f.name}</div>
            <code className="mt-1.5 inline-block font-mono text-[13px] text-text-primary">{f.eq}</code>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[rgba(52,211,153,.2)] bg-[rgba(52,211,153,.07)] p-4">
          <div className="text-sm font-bold text-[#34d399]">Direct Proportion</div>
          <div className="mt-1 text-xs text-text-muted">y = kx &mdash; as x increases, y increases</div>
          <div className="mt-1 text-xs text-text-muted">y/x is constant. Doubling x doubles y.</div>
        </div>
        <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] p-4">
          <div className="text-sm font-bold text-[#60a5fa]">Inverse Proportion</div>
          <div className="mt-1 text-xs text-text-muted">y = k/x &mdash; as x increases, y decreases</div>
          <div className="mt-1 text-xs text-text-muted">xy is constant. Doubling x halves y.</div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Unit Conversion Tip: </strong>
        Multiply by conversion factors so unwanted units cancel. Example: 60 mph &times; 5280 ft/mile &times; 1 hr/3600 sec = 88 ft/sec. Always check the units in the question!
      </div>
    </div>
  );
}

/* ── Slide 2: Statistics — Center, Spread & Shape ── */
export function StatisticsVisual() {
  const [data, setData] = useState("12, 15, 18, 20, 22, 25, 28");

  const nums = data.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  let stats: { mean: number; median: number; range: number; count: number; skew: string } | null = null;

  if (nums.length > 0) {
    const sorted = [...nums].sort((a, b) => a - b);
    const mean = nums.reduce((s, n) => s + n, 0) / nums.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const range = sorted[sorted.length - 1] - sorted[0];
    const skew = Math.abs(mean - median) < 0.5 ? "Approximately symmetric" : mean > median ? "Skewed right (positive)" : "Skewed left (negative)";
    stats = { mean: Math.round(mean * 100) / 100, median, range, count: nums.length, skew };
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Measure</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Definition</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Outlier Effect</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Mean", "sum \u00F7 count", "Sensitive — pulled toward outliers"],
              ["Median", "middle value (sorted)", "Resistant — barely changes"],
              ["Range", "max \u2212 min", "Sensitive — one extreme value changes it"],
              ["Std Dev", "spread from the mean", "Adding a constant: no change; multiplying: scales"],
            ].map(([measure, def, effect], i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">
                  <span style={{ color: PSDA }}>{measure}</span>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{def}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive stats explorer */}
      <div className="rounded-2xl border border-[rgba(251,191,36,.2)] bg-bg-base p-5 shadow-[0_0_24px_rgba(251,191,36,.06)]">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Statistics Explorer</div>
        <input
          type="text" value={data} onChange={e => setData(e.target.value)}
          placeholder="Enter numbers separated by commas..."
          className="mb-4 w-full rounded-lg border border-border-default bg-bg-surface p-2.5 font-mono text-sm text-text-primary focus:border-[rgba(251,191,36,.5)]"
        />
        {stats && (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Mean", value: stats.mean, color: PSDA },
              { label: "Median", value: stats.median, color: "#34d399" },
              { label: "Range", value: stats.range, color: "#60a5fa" },
              { label: "Count", value: stats.count, color: "#a78bfa" },
            ].map((s, i) => (
              <div key={i} className="rounded-lg bg-bg-surface p-3 text-center">
                <div className="font-mono text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[1.5px] text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        )}
        {stats && (
          <div className="mt-3 text-center text-xs text-text-muted">
            Distribution: <strong style={{ color: PSDA }}>{stats.skew}</strong>
            {stats.mean > stats.median && " (Mean > Median \u2192 high outliers pull mean up)"}
            {stats.mean < stats.median && " (Mean < Median \u2192 low outliers pull mean down)"}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Skewed Right", desc: "Tail right, Mean > Median", color: "#f87171" },
          { label: "Symmetric", desc: "Mean \u2248 Median", color: "#22c55e" },
          { label: "Skewed Left", desc: "Tail left, Mean < Median", color: "#60a5fa" },
        ].map((item, i) => (
          <div key={i} className="rounded-xl border bg-bg-base p-3.5 text-center" style={{ borderColor: `${item.color}33` }}>
            <div className="text-sm font-bold" style={{ color: item.color }}>{item.label}</div>
            <div className="mt-1 text-[11px] text-text-muted">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 3: Data Interpretation & Scatterplots ── */
export function ScatterplotVisual() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Concept</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Slope of best-fit line", "Rate of change in context (e.g., score increase per hour studied)"],
              ["Y-intercept", "Predicted value when x = 0 (starting value)"],
              ["r close to +1", "Strong positive association (both variables increase)"],
              ["r close to -1", "Strong negative association (one up, other down)"],
              ["r close to 0", "Weak or no linear association"],
              ["Interpolation", "Predicting WITHIN the data range (reliable)"],
              ["Extrapolation", "Predicting BEYOND the data range (unreliable)"],
              ["Residual", "actual \u2212 predicted (good model: residuals random around 0)"],
            ].map(([concept, meaning], i) => (
              <tr key={i}>
                <td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">
                  <code className="rounded-md bg-[rgba(251,191,36,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: PSDA }}>{concept}</code>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#60a5fa]">Desmos Regression: </strong>
        Enter data as a table, then type <code className="rounded-md bg-[rgba(96,165,250,.1)] px-2 py-0.5 font-mono text-[13px] text-[#60a5fa]">y&#8321; ~ mx&#8321; + b</code> for linear or <code className="rounded-md bg-[rgba(96,165,250,.1)] px-2 py-0.5 font-mono text-[13px] text-[#60a5fa]">y&#8321; ~ ax&#8321;&sup2; + bx&#8321; + c</code> for quadratic. Desmos finds the best-fit equation automatically.
      </div>
    </div>
  );
}

/* ── Slide 3b: Two-Way Table ── */
export function TwoWayTableVisual() {
  return (
    <div className="space-y-4">
      {/* Sample table */}
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted"></th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Plays Sport</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">No Sport</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: PSDA }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary">Has a Job</td>
              <td className="border-b border-border-default px-4 py-3 text-center text-[#bcbcc8]">45</td>
              <td className="border-b border-border-default px-4 py-3 text-center text-[#bcbcc8]">35</td>
              <td className="border-b border-border-default px-4 py-3 text-center font-bold" style={{ color: PSDA, background: "rgba(251,191,36,.07)" }}>80</td>
            </tr>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary">No Job</td>
              <td className="border-b border-border-default px-4 py-3 text-center text-[#bcbcc8]">55</td>
              <td className="border-b border-border-default px-4 py-3 text-center text-[#bcbcc8]">65</td>
              <td className="border-b border-border-default px-4 py-3 text-center font-bold" style={{ color: PSDA, background: "rgba(251,191,36,.07)" }}>120</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-text-secondary">Total</td>
              <td className="px-4 py-3 text-center font-bold" style={{ color: PSDA, background: "rgba(251,191,36,.07)" }}>100</td>
              <td className="px-4 py-3 text-center font-bold" style={{ color: PSDA, background: "rgba(251,191,36,.07)" }}>100</td>
              <td className="px-4 py-3 text-center font-bold" style={{ color: PSDA, background: "rgba(251,191,36,.12)" }}>200</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[rgba(251,191,36,.2)] bg-[rgba(251,191,36,.07)] p-4">
          <div className="text-sm font-bold" style={{ color: PSDA }}>P(job | sport)</div>
          <div className="mt-1 font-mono text-base text-text-primary">45/100 = 0.45</div>
          <div className="mt-1 text-xs text-text-muted">Given sport, probability of job. Denominator = sport total.</div>
        </div>
        <div className="rounded-xl border border-[rgba(249,115,22,.2)] bg-[rgba(249,115,22,.07)] p-4">
          <div className="text-sm font-bold text-[#f97316]">P(sport | job)</div>
          <div className="mt-1 font-mono text-base text-text-primary">45/80 = 0.5625</div>
          <div className="mt-1 text-xs text-text-muted">Given job, probability of sport. Denominator = job total.</div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#C8102E]">PSAT Trap: </strong>
        Confusing P(A|B) with P(B|A). &quot;Given they play sports, probability of having a job&quot; is NOT the same as &quot;given they have a job, probability of playing sports.&quot; The <strong>denominator changes</strong>!
      </div>
    </div>
  );
}

/* ── Slide 4: Study Design ── */
export function StudyDesignVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const designs = [
    {
      label: "Random Sample + Random Assignment",
      result: "Causation + Generalize",
      color: "#22c55e",
      desc: "The gold standard. Can claim causation AND generalize to the population.",
      example: "10,000 randomly selected people randomly assigned to take Vitamin D vs. placebo.",
    },
    {
      label: "Random Sample, No Assignment",
      result: "Association + Generalize",
      color: "#60a5fa",
      desc: "Can generalize to the population, but can only claim association (not causation).",
      example: "500 randomly selected adults surveyed about exercise and blood pressure.",
    },
    {
      label: "No Random Sample, Random Assignment",
      result: "Causation, No Generalize",
      color: "#fbbf24",
      desc: "Can claim causation for the sample, but cannot generalize beyond participants.",
      example: "100 volunteers randomly assigned to drink green tea vs. water.",
    },
    {
      label: "No Random Sample, No Assignment",
      result: "Association Only",
      color: "#ef4444",
      desc: "No causation, no generalization. Only an association for this specific group.",
      example: "A teacher surveys her own students about screen time and grades.",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted"></th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-[#22c55e]">Random Assignment</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-[#ef4444]">No Random Assignment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-bold text-[#22c55e]">Random Sample</td>
              <td className="border-b border-border-default px-4 py-3 text-center text-[#bcbcc8]">
                <strong className="text-[#22c55e]">Causation</strong> + Generalize
              </td>
              <td className="border-b border-border-default px-4 py-3 text-center text-[#bcbcc8]">
                <strong className="text-[#60a5fa]">Association</strong> + Generalize
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-[#ef4444]">No Random Sample</td>
              <td className="px-4 py-3 text-center text-[#bcbcc8]">
                <strong className="text-[#fbbf24]">Causation</strong> only for sample
              </td>
              <td className="px-4 py-3 text-center text-[#bcbcc8]">
                <strong className="text-[#ef4444]">Association</strong> only
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {designs.map((d, i) => (
          <button
            key={i}
            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: flipped[i] ? `${d.color}44` : "var(--color-border-default)" }}
          >
            {!flipped[i] ? (
              <>
                <div className="mb-1.5 text-sm font-bold" style={{ color: d.color }}>{d.result}</div>
                <div className="text-xs leading-[1.5] text-text-muted">{d.desc}</div>
                <div className="mt-2 text-right text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: d.color }}>tap for example</div>
              </>
            ) : (
              <>
                <div className="text-xs font-bold uppercase tracking-[1px] text-text-muted">{d.label}</div>
                <div className="mt-1.5 text-sm leading-[1.7] text-[#bcbcc8]">{d.example}</div>
                <div className="mt-2 text-right text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: d.color }}>tap to flip back</div>
              </>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Key Rule: </strong>
        Random <strong>sampling</strong> = can generalize. Random <strong>assignment</strong> = can claim causation. You need BOTH for the strongest conclusion.
      </div>
    </div>
  );
}

/* ── Percent Traps ── */
export function PercentTrapsVisual() {
  const [reveal, setReveal] = useState<Record<number, boolean>>({});

  const traps = [
    { scenario: "A price goes up 20%, then down 20%.", trap: "They DON'T cancel!", result: "$100 \u2192 $120 \u2192 $96 = 4% LESS", color: "#ef4444" },
    { scenario: "50% off, then additional 20% off.", trap: "NOT 70% off!", result: "$100 \u2192 $50 \u2192 $40 = 60% off", color: "#f97316" },
    { scenario: "Sales increased 200%.", trap: "200% increase = 3x original", result: "$1,000 + $2,000 = $3,000", color: "#a855f7" },
    { scenario: "+10%, then -10%.", trap: "Not back to original!", result: "$100 \u2192 $110 \u2192 $99 = 1% LESS", color: "#fbbf24" },
  ];

  return (
    <div className="space-y-3">
      {traps.map((t, i) => (
        <button
          key={i}
          onClick={() => setReveal(prev => ({ ...prev, [i]: !prev[i] }))}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300"
          style={{ borderColor: reveal[i] ? `${t.color}44` : "var(--color-border-default)" }}
        >
          <div className="text-sm text-text-primary">{t.scenario}</div>
          {reveal[i] ? (
            <div className="mt-2">
              <div className="text-sm font-bold" style={{ color: t.color }}>{t.trap}</div>
              <code className="mt-1 inline-block rounded-md bg-bg-surface px-2 py-1 font-mono text-[13px]" style={{ color: t.color }}>{t.result}</code>
            </div>
          ) : (
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: t.color }}>tap to reveal</div>
          )}
        </button>
      ))}

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">The Percent Spiral: </strong>
        Successive percent changes NEVER cancel. The second percentage applies to the <strong>new</strong> value, not the original. This is one of the most common traps on the PSAT.
      </div>
    </div>
  );
}
