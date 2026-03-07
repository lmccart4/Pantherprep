"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";

const ACCENT = "#C8102E";

/* ── Formula Grid ── */
export function FormulaGridVisual() {
  const formulas = [
    { name: "Proportion", formula: "$\\frac{a}{b} = \\frac{c}{d} \\Rightarrow ad = bc$", color: "#60a5fa" },
    { name: "Unit Rate", formula: "\"per\" $= \\div$", color: "#a855f7" },
    { name: "Percent", formula: "$\\frac{\\text{part}}{\\text{whole}} \\times 100$", color: "#34d399" },
    { name: "Percent Change", formula: "$\\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100$", color: "#fbbf24" },
    { name: "Percent Increase", formula: "$\\text{new} = \\text{old} \\times (1 + r)$", color: "#22c55e" },
    { name: "Percent Decrease", formula: "$\\text{new} = \\text{old} \\times (1 - r)$", color: "#ef4444" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {formulas.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border bg-bg-base p-4"
            style={{ borderColor: `${f.color}33` }}
          >
            <div className="mb-1 text-[13px] font-bold" style={{ color: f.color }}>{f.name}</div>
            <div className="text-[15px] font-bold text-text-primary">{renderMath(f.formula)}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Critical: </strong>
        Percent change always divides by the <strong>OLD</strong> value. $80 &rarr; $100 = (20/80) &times; 100 = 25%, not 20%.
      </div>
    </div>
  );
}

/* ── Mean vs Median ── */
export function StatisticsVisual() {
  const [showOutlier, setShowOutlier] = useState(false);

  const baseData = [10, 12, 14, 15, 16];
  const outlierData = [10, 12, 14, 15, 100];
  const data = showOutlier ? outlierData : baseData;

  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const sorted = [...data].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowOutlier(!showOutlier)}
          className="cursor-pointer rounded-lg px-4 py-2 text-sm font-bold transition-all"
          style={{
            background: showOutlier ? "rgba(239,68,68,.15)" : "rgba(34,197,94,.15)",
            color: showOutlier ? "#ef4444" : "#22c55e",
            border: `1px solid ${showOutlier ? "rgba(239,68,68,.3)" : "rgba(34,197,94,.3)"}`,
          }}
        >
          {showOutlier ? "Remove Outlier" : "Add Outlier (100)"}
        </button>
      </div>

      <div className="flex items-center gap-2 font-mono text-lg">
        {data.map((v, i) => (
          <span key={i}>
            <span className={v === 100 ? "font-bold text-[#ef4444]" : "text-text-primary"}>{v}</span>
            {i < data.length - 1 && <span className="text-text-muted">, </span>}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[rgba(96,165,250,.25)] bg-[rgba(96,165,250,.07)] p-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#60a5fa]">Mean</div>
          <div className="mt-1 font-mono text-2xl font-bold text-[#60a5fa]">{mean.toFixed(1)}</div>
          <div className="mt-1 text-[12px] text-text-muted">Sensitive to outliers</div>
        </div>
        <div className="rounded-xl border border-[rgba(168,85,247,.25)] bg-[rgba(168,85,247,.07)] p-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#a855f7]">Median</div>
          <div className="mt-1 font-mono text-2xl font-bold text-[#a855f7]">{median}</div>
          <div className="mt-1 text-[12px] text-text-muted">Resistant to outliers</div>
        </div>
      </div>

      {showOutlier && (
        <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
          <strong style={{ color: "#ef4444" }}>Notice: </strong>
          The mean jumped from 13.4 to {mean.toFixed(1)}, but the median barely changed (14 &rarr; {median}). This is the SAT&apos;s favorite statistics question.
        </div>
      )}
    </div>
  );
}

/* ── Two-Way Table ── */
export function TwoWayTableVisual() {
  const [highlight, setHighlight] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-r border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted"></th>
              <th className="border-b border-r border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Plays Sport</th>
              <th className="border-b border-r border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">No Sport</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-r border-border-default px-4 py-3 font-semibold text-text-secondary">Has Job</td>
              <td
                className="cursor-pointer border-b border-r border-border-default px-4 py-3 text-center font-mono transition-all"
                style={{ background: highlight === "joint" ? "rgba(200,16,46,.12)" : "transparent", color: highlight === "joint" ? ACCENT : "inherit" }}
                onClick={() => setHighlight(highlight === "joint" ? null : "joint")}
              >45</td>
              <td className="border-b border-r border-border-default px-4 py-3 text-center font-mono">35</td>
              <td
                className="cursor-pointer border-b border-border-default px-4 py-3 text-center font-mono font-bold transition-all"
                style={{ background: highlight === "marginal" ? "rgba(200,16,46,.12)" : "transparent", color: highlight === "marginal" ? ACCENT : "inherit" }}
                onClick={() => setHighlight(highlight === "marginal" ? null : "marginal")}
              >80</td>
            </tr>
            <tr>
              <td className="border-b border-r border-border-default px-4 py-3 font-semibold text-text-secondary">No Job</td>
              <td className="border-b border-r border-border-default px-4 py-3 text-center font-mono">55</td>
              <td className="border-b border-r border-border-default px-4 py-3 text-center font-mono">65</td>
              <td className="border-b border-border-default px-4 py-3 text-center font-mono font-bold">120</td>
            </tr>
            <tr>
              <td className="border-r border-border-default px-4 py-3 font-bold" style={{ color: ACCENT }}>Total</td>
              <td
                className="cursor-pointer border-r border-border-default px-4 py-3 text-center font-mono font-bold transition-all"
                style={{ background: highlight === "conditional" ? "rgba(200,16,46,.12)" : "transparent", color: highlight === "conditional" ? ACCENT : "inherit" }}
                onClick={() => setHighlight(highlight === "conditional" ? null : "conditional")}
              >100</td>
              <td className="border-r border-border-default px-4 py-3 text-center font-mono font-bold">100</td>
              <td className="px-4 py-3 text-center font-mono font-bold" style={{ color: ACCENT }}>200</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setHighlight(highlight === "joint" ? null : "joint")}
          className="cursor-pointer rounded-lg border px-3 py-2 text-center text-[13px] transition-all"
          style={{
            borderColor: highlight === "joint" ? `${ACCENT}66` : "var(--color-border-default)",
            background: highlight === "joint" ? "rgba(200,16,46,.08)" : "transparent",
            color: highlight === "joint" ? ACCENT : "inherit",
          }}
        >
          <div className="font-bold">Joint</div>
          <div className="text-[11px] text-text-muted">45 = sport + job</div>
        </button>
        <button
          onClick={() => setHighlight(highlight === "marginal" ? null : "marginal")}
          className="cursor-pointer rounded-lg border px-3 py-2 text-center text-[13px] transition-all"
          style={{
            borderColor: highlight === "marginal" ? `${ACCENT}66` : "var(--color-border-default)",
            background: highlight === "marginal" ? "rgba(200,16,46,.08)" : "transparent",
            color: highlight === "marginal" ? ACCENT : "inherit",
          }}
        >
          <div className="font-bold">Marginal</div>
          <div className="text-[11px] text-text-muted">80 = total with job</div>
        </button>
        <button
          onClick={() => setHighlight(highlight === "conditional" ? null : "conditional")}
          className="cursor-pointer rounded-lg border px-3 py-2 text-center text-[13px] transition-all"
          style={{
            borderColor: highlight === "conditional" ? `${ACCENT}66` : "var(--color-border-default)",
            background: highlight === "conditional" ? "rgba(200,16,46,.08)" : "transparent",
            color: highlight === "conditional" ? ACCENT : "inherit",
          }}
        >
          <div className="font-bold">Conditional</div>
          <div className="text-[11px] text-text-muted">P(job|sport) = 45/100</div>
        </button>
      </div>

      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>P(A|B) &ne; P(B|A)! </strong>
        P(job | sport) = 45/100 = 0.45, but P(sport | job) = 45/80 = 0.5625. The denominator changes depending on the &ldquo;given&rdquo; condition.
      </div>
    </div>
  );
}

/* ── Study Design Grid ── */
export function StudyDesignVisual() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-r border-border-default bg-bg-surface px-4 py-3"></th>
              <th className="border-b border-r border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-[#22c55e]">Random Assignment</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[1.5px] text-[#ef4444]">No Random Assignment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-r border-border-default px-4 py-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#60a5fa]">Random Sampling</td>
              <td className="border-b border-r border-border-default px-4 py-3 text-center">
                <div className="font-bold text-[#22c55e]">Causation + Generalize</div>
                <div className="mt-1 text-[12px] text-text-muted">Gold standard (experiment)</div>
              </td>
              <td className="border-b border-border-default px-4 py-3 text-center">
                <div className="font-bold text-[#fbbf24]">Association + Generalize</div>
                <div className="mt-1 text-[12px] text-text-muted">Observational study</div>
              </td>
            </tr>
            <tr>
              <td className="border-r border-border-default px-4 py-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#a855f7]">No Random Sampling</td>
              <td className="border-r border-border-default px-4 py-3 text-center">
                <div className="font-bold text-[#fbbf24]">Causation Only</div>
                <div className="mt-1 text-[12px] text-text-muted">Can&apos;t generalize beyond sample</div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="font-bold text-[#ef4444]">Neither</div>
                <div className="mt-1 text-[12px] text-text-muted">No causation, no generalization</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>The SAT&apos;s favorite trick: </strong>
        &ldquo;Based on this study, what conclusion can be drawn?&rdquo; Check for random sampling (generalize?) and random assignment (causation?). Most wrong answers claim causation from observational data.
      </div>
    </div>
  );
}

/* ── Trap Taxonomy ── */
export function TrapTaxonomyVisual() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const traps = [
    { name: "The Percent Spiral", color: "#ef4444", desc: "Successive percent changes don't cancel", example: "$100 \u2192 +10% = $110 \u2192 \u221210% = $99 (not $100). You lose 1%.", fix: "Multiply the factors: 1.10 \u00D7 0.90 = 0.99. The result tells you the net effect." },
    { name: "The Wrong Target", color: "#fbbf24", desc: "Used the wrong denominator in a percentage", example: "$80 \u2192 $100: change = 20/80 = 25% (not 20/100 = 20%). Divide by OLD.", fix: "Percent change always uses the ORIGINAL value as the denominator." },
    { name: "The Scale Mirage", color: "#a855f7", desc: "Misreading graph axes \u2014 truncated y-axis exaggerates differences", example: "Revenue from $995M to $1.01B looks massive when y-axis starts at $990M.", fix: "Always check where the axes start. A truncated axis can make 1.5% growth look like 100%." },
    { name: "The Conditional Swap", color: "#06b6d4", desc: "Confusing P(A|B) with P(B|A)", example: "P(job | sport) = 45/100 = 0.45 but P(sport | job) = 45/80 = 0.5625.", fix: "The denominator is always the total of the GIVEN condition \u2014 the group after the \"|\" symbol." },
  ];

  return (
    <div className="space-y-2.5">
      {traps.map((t, i) => (
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: t.color }}>{i + 1}</div>
            <div className="flex-1">
              <span className="text-[15px] font-bold" style={{ color: t.color }}>{t.name}</span>
              <span className="ml-2 text-[11px] text-text-muted">{expanded === i ? "\u25B2" : "\u25BC"}</span>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-text-muted">{t.desc}</div>
            </div>
          </div>
          {expanded === i && (
            <div className="mt-3 space-y-2">
              <div className="rounded-lg px-4 py-3 text-sm leading-[1.7]" style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}` }}>
                <strong style={{ color: t.color }}>Example: </strong>
                <span className="text-[#bcbcc8]">{t.example}</span>
              </div>
              <div className="rounded-lg bg-[rgba(34,197,94,.08)] px-4 py-3 text-sm leading-[1.7]" style={{ borderLeft: "3px solid #22c55e" }}>
                <strong className="text-[#22c55e]">Fix: </strong>
                <span className="text-[#bcbcc8]">{t.fix}</span>
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
