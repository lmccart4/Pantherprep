"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#06b6d4";

/* ── Highlight helper ── */
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]"
      style={{ color: ACCENT }}
    >
      {children}
    </code>
  );
}

/* ── Slide 1: Ratios, Rates & Proportions ── */
export function RatiosVisual() {
  const formulas = [
    { label: "Proportion", formula: "$\\frac{a}{b} = \\frac{c}{d}$ $\\to$ cross multiply $\\to$ $ad = bc$", color: "#fbbf24" },
    { label: "Unit Rate", formula: "total / number of units", color: "#60a5fa" },
    { label: "Unit Conversion", formula: "multiply by fractions where units cancel", color: "#34d399" },
    { label: "Direct Proportion", formula: "$y = kx$ ($y/x$ stays constant)", color: "#a78bfa" },
    { label: "Inverse Proportion", formula: "$y = k/x$ ($xy$ stays constant)", color: "#f87171" },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Concept</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Formula / Method</th>
            </tr>
          </thead>
          <tbody>
            {formulas.map((f, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: f.color }}>{f.label}</td>
                <td className="border-b border-border-default px-4 py-3 text-[13px] text-[#bcbcc8] last:border-b-0">{renderMath(f.formula)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[rgba(251,191,36,.2)] bg-[rgba(251,191,36,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#fbbf24" }}>Unit Conversion Example: </strong>
        <div className="mt-1 font-mono text-[13px] text-[#bcbcc8]">
          60 mph x (5280 ft/1 mi) x (1 hr/3600 sec) = 88 ft/sec
        </div>
        <div className="mt-2 text-text-muted">
          Always check what units the answer needs. The PSAT loves giving data in one unit and asking for another.
        </div>
      </div>
    </div>
  );
}

/* ── Slide 2: Percent Multiplier & Traps ── */
export function PercentsVisual() {
  const [startPrice, setStartPrice] = useState(100);
  const [increase, setIncrease] = useState(20);
  const [decrease, setDecrease] = useState(20);

  const afterIncrease = startPrice * (1 + increase / 100);
  const afterDecrease = afterIncrease * (1 - decrease / 100);
  const netChange = ((afterDecrease - startPrice) / startPrice) * 100;

  return (
    <div className="space-y-4">
      {/* Multiplier Reference */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.07)] px-3 py-3 text-center">
          <div className="text-xs font-bold text-[#22c55e]">Increase</div>
          <div className="mt-1 text-[13px] text-text-primary">{renderMath("$\\times (1 + r)$")}</div>
          <div className="text-[11px] text-text-muted">15% up = {renderMath("$\\times 1.15$")}</div>
        </div>
        <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-3 py-3 text-center">
          <div className="text-xs font-bold text-[#ef4444]">Decrease</div>
          <div className="mt-1 text-[13px] text-text-primary">{renderMath("$\\times (1 - r)$")}</div>
          <div className="text-[11px] text-text-muted">20% off = {renderMath("$\\times 0.80$")}</div>
        </div>
        <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-3 py-3 text-center">
          <div className="text-xs font-bold text-[#60a5fa]">% Change</div>
          <div className="mt-1 text-[13px] text-text-primary">{renderMath("$\\frac{\\text{new} - \\text{old}}{\\text{old}}$")}</div>
          <div className="text-[11px] text-text-muted">x 100 for %</div>
        </div>
      </div>

      {/* Successive Percent Simulator */}
      <div className="rounded-2xl border border-[rgba(251,191,36,.2)] bg-bg-base p-5 shadow-[0_0_24px_rgba(251,191,36,.08)]">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">
          Successive Percent Change Simulator
        </div>

        <div className="mb-4 grid grid-cols-3 gap-4">
          <div>
            <div className="mb-1 text-[11px] text-text-muted">Start Price</div>
            <input
              type="number"
              value={startPrice}
              onChange={(e) => setStartPrice(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-border-default bg-bg-surface p-2 text-center font-mono text-text-primary transition-all focus:border-[rgba(251,191,36,.5)] focus:shadow-[0_0_0_3px_rgba(251,191,36,.08)]"
            />
          </div>
          <div>
            <div className="mb-1 text-[11px] text-text-muted">Increase %</div>
            <input
              type="number"
              value={increase}
              onChange={(e) => setIncrease(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-border-default bg-bg-surface p-2 text-center font-mono text-text-primary transition-all focus:border-[rgba(34,197,94,.5)] focus:shadow-[0_0_0_3px_rgba(34,197,94,.08)]"
            />
          </div>
          <div>
            <div className="mb-1 text-[11px] text-text-muted">Decrease %</div>
            <input
              type="number"
              value={decrease}
              onChange={(e) => setDecrease(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-border-default bg-bg-surface p-2 text-center font-mono text-text-primary transition-all focus:border-[rgba(239,68,68,.5)] focus:shadow-[0_0_0_3px_rgba(239,68,68,.08)]"
            />
          </div>
        </div>

        {/* Flow */}
        <div className="flex items-center justify-center gap-3 text-sm">
          <div className="rounded-lg bg-bg-surface px-3 py-2 text-center">
            <div className="text-[10px] text-text-muted">Start</div>
            <div className="font-mono font-bold text-text-primary">${startPrice}</div>
          </div>
          <span className="text-[#22c55e]">+{increase}%</span>
          <span className="text-text-muted">&rarr;</span>
          <div className="rounded-lg bg-bg-surface px-3 py-2 text-center">
            <div className="text-[10px] text-text-muted">After Increase</div>
            <div className="font-mono font-bold text-[#22c55e]">${afterIncrease.toFixed(2)}</div>
          </div>
          <span className="text-[#ef4444]">-{decrease}%</span>
          <span className="text-text-muted">&rarr;</span>
          <div className="rounded-lg bg-bg-surface px-3 py-2 text-center">
            <div className="text-[10px] text-text-muted">Final</div>
            <div className="font-mono font-bold" style={{ color: netChange >= 0 ? "#22c55e" : "#ef4444" }}>
              ${afterDecrease.toFixed(2)}
            </div>
          </div>
        </div>

        <div
          className="mt-3 rounded-lg px-4 py-2 text-center text-sm font-semibold"
          style={{
            background: Math.abs(netChange) < 0.01 ? "rgba(251,191,36,.07)" : netChange > 0 ? "rgba(34,197,94,.07)" : "rgba(239,68,68,.07)",
            color: Math.abs(netChange) < 0.01 ? "#fbbf24" : netChange > 0 ? "#22c55e" : "#ef4444",
          }}
        >
          Net change: {netChange > 0 ? "+" : ""}{netChange.toFixed(2)}%
          {increase === decrease && increase > 0 && (
            <span className="ml-2 text-text-muted"> &mdash; They do NOT cancel out!</span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">Key Rule: </strong>
        Successive percent changes don&apos;t cancel! The second change applies to the NEW amount, not the original. This is one of the PSAT&apos;s favorite traps.
      </div>
    </div>
  );
}

/* ── Slide 3: Mean vs Median ── */
export function StatisticsVisual() {
  const [data, setData] = useState("10, 12, 14, 15, 16");
  const [outlier, setOutlier] = useState("");

  const parse = (s: string) =>
    s.split(",").map((x) => parseFloat(x.trim())).filter((x) => !isNaN(x));

  const baseNums = parse(data);
  const allNums = outlier ? [...baseNums, parseFloat(outlier)].filter((x) => !isNaN(x)) : baseNums;
  const sorted = [...allNums].sort((a, b) => a - b);

  const mean = sorted.length > 0 ? sorted.reduce((a, b) => a + b, 0) / sorted.length : 0;
  const median =
    sorted.length > 0
      ? sorted.length % 2 === 1
        ? sorted[Math.floor(sorted.length / 2)]
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : 0;
  const range = sorted.length > 0 ? sorted[sorted.length - 1] - sorted[0] : 0;

  const baseMean = baseNums.length > 0 ? baseNums.reduce((a, b) => a + b, 0) / baseNums.length : 0;
  const baseSorted = [...baseNums].sort((a, b) => a - b);
  const baseMedian =
    baseSorted.length > 0
      ? baseSorted.length % 2 === 1
        ? baseSorted[Math.floor(baseSorted.length / 2)]
        : (baseSorted[baseSorted.length / 2 - 1] + baseSorted[baseSorted.length / 2]) / 2
      : 0;

  const hasOutlier = outlier && !isNaN(parseFloat(outlier));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[rgba(251,191,36,.2)] bg-bg-base p-5 shadow-[0_0_24px_rgba(251,191,36,.08)]">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">
          Mean vs. Median Explorer
        </div>
        <div className="mb-3">
          <div className="mb-1 text-[11px] text-text-muted">Data (comma separated)</div>
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full rounded-lg border border-border-default bg-bg-surface p-2.5 font-mono text-sm text-text-primary transition-all focus:border-[rgba(251,191,36,.5)]"
          />
        </div>
        <div className="mb-4">
          <div className="mb-1 text-[11px] text-text-muted">Add an outlier (try 100!)</div>
          <input
            type="number"
            value={outlier}
            onChange={(e) => setOutlier(e.target.value)}
            placeholder="e.g. 100"
            className="w-[120px] rounded-lg border border-border-default bg-bg-surface p-2.5 font-mono text-sm text-text-primary transition-all focus:border-[rgba(239,68,68,.5)]"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border-default bg-bg-surface px-3 py-3 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[1px] text-text-muted">Mean</div>
            <div className="font-mono text-xl font-bold" style={{ color: "#fbbf24" }}>{mean.toFixed(1)}</div>
            {hasOutlier && (
              <div className="mt-1 text-[11px] text-text-muted">
                was {baseMean.toFixed(1)}
                <span className="ml-1" style={{ color: mean > baseMean ? "#ef4444" : "#22c55e" }}>
                  ({mean > baseMean ? "+" : ""}{(mean - baseMean).toFixed(1)})
                </span>
              </div>
            )}
          </div>
          <div className="rounded-xl border border-border-default bg-bg-surface px-3 py-3 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[1px] text-text-muted">Median</div>
            <div className="font-mono text-xl font-bold" style={{ color: "#22c55e" }}>{median.toFixed(1)}</div>
            {hasOutlier && (
              <div className="mt-1 text-[11px] text-text-muted">
                was {baseMedian.toFixed(1)}
                <span className="ml-1 text-[#22c55e]">
                  ({median > baseMedian ? "+" : ""}{(median - baseMedian).toFixed(1)})
                </span>
              </div>
            )}
          </div>
          <div className="rounded-xl border border-border-default bg-bg-surface px-3 py-3 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[1px] text-text-muted">Range</div>
            <div className="font-mono text-xl font-bold text-text-primary">{range.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>The PSAT&apos;s Favorite Question: </strong>
        &quot;A very high value is added. Which measure changes more?&quot; Answer: The <strong>mean</strong> is always more affected. The median barely moves. Try adding 100 as an outlier above to see it!
      </div>

      {/* Skewness reference */}
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Shape</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Tail Direction</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Mean vs. Median</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary">Symmetric</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Even / bell-shaped</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Mean &asymp; Median</td>
            </tr>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-[#ef4444]">Skewed Right</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Long tail to the right</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Mean &gt; Median</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-[#60a5fa]">Skewed Left</td>
              <td className="px-4 py-3 text-[#bcbcc8]">Long tail to the left</td>
              <td className="px-4 py-3 text-[#bcbcc8]">Mean &lt; Median</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Slide 4: Two-Way Table & Conditional Probability ── */
export function TwoWayTableVisual() {
  return (
    <div className="space-y-4">
      {/* Sample two-way table */}
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted"></th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: "#fbbf24" }}>Prefers Math</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: "#60a5fa" }}>Prefers Science</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary">9th Grade</td>
              <td className="border-b border-border-default px-4 py-3 text-center font-mono text-text-primary">45</td>
              <td className="border-b border-border-default px-4 py-3 text-center font-mono text-text-primary">30</td>
              <td className="border-b border-border-default px-4 py-3 text-center font-mono text-text-muted">75</td>
            </tr>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-text-secondary">10th Grade</td>
              <td className="border-b border-border-default px-4 py-3 text-center font-mono text-text-primary">35</td>
              <td className="border-b border-border-default px-4 py-3 text-center font-mono text-text-primary">40</td>
              <td className="border-b border-border-default px-4 py-3 text-center font-mono text-text-muted">75</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-text-muted">Total</td>
              <td className="px-4 py-3 text-center font-mono font-bold text-text-muted">80</td>
              <td className="px-4 py-3 text-center font-mono font-bold text-text-muted">70</td>
              <td className="px-4 py-3 text-center font-mono font-bold text-text-primary">150</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Probability types */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[rgba(251,191,36,.2)] bg-[rgba(251,191,36,.07)] px-4 py-3 text-sm">
          <strong style={{ color: "#fbbf24" }}>Marginal</strong>
          <div className="mt-1 text-[13px] text-text-muted">Row/column totals (the margins)</div>
          <div className="mt-1 font-mono text-[12px] text-[#bcbcc8]">P(Math) = 80/150</div>
        </div>
        <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-4 py-3 text-sm">
          <strong style={{ color: "#60a5fa" }}>Joint</strong>
          <div className="mt-1 text-[13px] text-text-muted">Where row and column intersect</div>
          <div className="mt-1 font-mono text-[12px] text-[#bcbcc8]">P(9th AND Science) = 30/150</div>
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-bg-base p-4">
        <div className="mb-2 text-sm font-bold" style={{ color: "#a855f7" }}>Conditional Probability</div>
        <div className="text-base text-text-primary">
          {renderMath("$P(A|B) = \\frac{\\text{count of A AND B}}{\\text{total count of B}}$")}
        </div>
        <div className="mt-2 text-[13px] text-text-muted">
          Key: Restrict to B&apos;s row/column first, then find A within it.
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
          <div className="rounded-lg bg-bg-surface px-3 py-2">
            <Code>P(Math | 10th)</Code> = 35/75
          </div>
          <div className="rounded-lg bg-bg-surface px-3 py-2">
            <Code>P(9th | Science)</Code> = 30/70
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">PSAT Trap: </strong>
        Confusing P(A|B) with P(B|A). &quot;Given they play sports, what&apos;s the probability they have a job?&quot; is NOT the same as &quot;given they have a job, what&apos;s the probability they play sports?&quot; The denominator changes!
      </div>
    </div>
  );
}

/* ── Slide 5: Study Design & Inference ── */
export function StudyDesignVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const designs = [
    {
      name: "Observational Study",
      desc: "Observe without intervening",
      conclusion: "Correlation only - cannot show causation",
      color: "#fbbf24",
      example: "Tracking 1,000 people's exercise habits and heart disease rates over 10 years",
    },
    {
      name: "Experiment",
      desc: "Randomly assign treatments",
      conclusion: "CAN establish cause and effect",
      color: "#22c55e",
      example: "Randomly assigning 100 patients to a new drug or placebo, then measuring blood pressure",
    },
    {
      name: "Survey / Sample",
      desc: "Ask questions of a sample",
      conclusion: "Generalizes to population (if random sampling)",
      color: "#60a5fa",
      example: "Surveying 500 randomly selected alumni about career satisfaction",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {designs.map((d, i) => (
          <button
            key={i}
            onClick={() => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))}
            className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: flipped[i] ? `${d.color}44` : "var(--color-border-default)",
              boxShadow: flipped[i] ? `0 0 20px ${d.color}11` : "none",
            }}
          >
            {!flipped[i] ? (
              <>
                <div className="mb-1 text-sm font-bold" style={{ color: d.color }}>{d.name}</div>
                <div className="text-[13px] text-text-muted">{d.desc}</div>
                <div className="mt-2 rounded-lg px-3 py-2 text-[13px]" style={{ background: `${d.color}08` }}>
                  <strong>Conclusion: </strong>
                  <span className="text-[#bcbcc8]">{d.conclusion}</span>
                </div>
                <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: d.color }}>
                  tap for example &rarr;
                </div>
              </>
            ) : (
              <>
                <div className="mb-1 text-sm font-bold" style={{ color: d.color }}>{d.name} - Example</div>
                <div className="text-sm leading-[1.7] text-[#bcbcc8]">{d.example}</div>
                <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: d.color }}>
                  &larr; tap to flip back
                </div>
              </>
            )}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <div className="bg-bg-surface px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
          Critical Rules
        </div>
        <div className="divide-y divide-border-default text-sm">
          <div className="px-4 py-3 text-[#bcbcc8]">
            <strong className="text-[#ef4444]">Correlation != causation</strong> - just because two things happen together doesn&apos;t mean one causes the other
          </div>
          <div className="px-4 py-3 text-[#bcbcc8]">
            <strong className="text-[#22c55e]">Only experiments with random assignment</strong> can establish cause and effect
          </div>
          <div className="px-4 py-3 text-[#bcbcc8]">
            <strong style={{ color: ACCENT }}>Larger sample</strong> = smaller margin of error (more precise estimate)
          </div>
          <div className="px-4 py-3 text-[#bcbcc8]">
            <strong style={{ color: "#fbbf24" }}>Margin of error:</strong> &quot;42% &plusmn; 3%&quot; means the true value is likely between 39% and 45%
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Slide 6: PSDA Trap Taxonomy ── */
const PSDA_TRAPS = [
  { num: 1, name: "The Percent Spiral", desc: "Applied successive percents to the original amount instead of each new amount. 20% up then 20% down != original!", example: "$100 -> +20% = $120 -> -20% of $120 = $96, NOT $100", color: "#ef4444" },
  { num: 2, name: "Wrong Target", desc: "Answered for the wrong group in conditional probability. Make sure you restricted to the right denominator!", example: "P(Math|10th) != P(10th|Math). Different denominators!", color: "#60a5fa" },
  { num: 3, name: "Scale Mirage", desc: "Misread the axis scale on a graph. Assumed each line = 1 when it actually = 5 or 10.", example: "Bar graph shows 4 gridlines. You read 4, but scale says each = 5 -> actual value is 20", color: "#f87171" },
  { num: 4, name: "Conditional Swap", desc: "Confused P(A|B) with P(B|A). The condition changes which group you restrict to.", example: "P(sports|female)=40/60 != P(female|sports)=40/80", color: "#a78bfa" },
];

export function PSDATrapVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      {PSDA_TRAPS.map((t, i) => (
        <button
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: expanded === i ? `${t.color}44` : "var(--color-border-default)",
            boxShadow: expanded === i ? `0 0 20px ${t.color}15` : "none",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold text-white"
              style={{ background: t.color }}
            >
              {t.num}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold" style={{ color: t.color }}>{t.name}</span>
                <span className="text-[11px] text-text-muted">{expanded === i ? "v" : ">"}</span>
              </div>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{t.desc}</div>
            </div>
          </div>
          {expanded === i && (
            <div
              className="mt-3 rounded-lg px-4 py-3 font-mono text-[13px] leading-[1.7]"
              style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}`, color: "#bcbcc8" }}
            >
              {t.example}
            </div>
          )}
        </button>
      ))}
      <div className="rounded-xl border border-[rgba(251,191,36,.2)] bg-[rgba(251,191,36,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#fbbf24" }}>Quick Wins Domain: </strong>
        PSDA draws heavily on grades 6-8 content. If you&apos;re solid on fundamentals, you can pick up 5-7 questions with targeted review. This is the highest-ROI domain for quick score gains.
      </div>
    </div>
  );
}

/* ── Slide 7: Scatterplots & Correlation ── */
export function ScatterplotVisual() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.07)] px-3 py-3 text-center">
          <div className="text-xs font-bold text-[#22c55e]">Positive</div>
          <div className="mt-1 text-[13px] text-text-muted">x up, y up</div>
          <div className="font-mono text-lg">&#x2197;</div>
        </div>
        <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-3 py-3 text-center">
          <div className="text-xs font-bold text-[#ef4444]">Negative</div>
          <div className="mt-1 text-[13px] text-text-muted">x up, y down</div>
          <div className="font-mono text-lg">&#x2198;</div>
        </div>
        <div className="rounded-xl border border-border-default bg-bg-surface px-3 py-3 text-center">
          <div className="text-xs font-bold text-text-muted">None</div>
          <div className="mt-1 text-[13px] text-text-muted">Random scatter</div>
          <div className="font-mono text-lg">&#x2022;&#x2022;&#x2022;</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Concept</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Definition</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Reliability</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-border-default px-4 py-3 font-semibold text-[#22c55e]">Interpolation</td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8]">Predicting WITHIN the data range</td>
              <td className="border-b border-border-default px-4 py-3 text-[#22c55e]">Reliable</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-[#ef4444]">Extrapolation</td>
              <td className="px-4 py-3 text-[#bcbcc8]">Predicting BEYOND the data range</td>
              <td className="px-4 py-3 text-[#ef4444]">Unreliable</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[rgba(96,165,250,.2)] bg-[rgba(96,165,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#60a5fa" }}>Desmos Regression: </strong>
        Enter data as a table, then type <Code>y1 ~ mx1 + b</Code> for a linear regression. Desmos finds the best-fit equation automatically.
      </div>
    </div>
  );
}
