"use client";

import { useState } from "react";

const ACCENT = "#C8102E";
const AMBER = "#f59e0b";

/* ── Slide: Stats Visual ── */
export function StatsVisual() {
  const stats = [
    { n: "600", label: "vs 700+", sub: "Precision is the difference" },
    { n: "2", label: "choices left", sub: "After tone + clue elimination" },
    { n: "3", label: "distinctions", sub: "Scope, intensity, domain" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="min-w-[140px] rounded-[14px] border border-[rgba(200,16,46,.2)] bg-[rgba(200,16,46,.07)] px-6 py-4 text-center"
        >
          <div className="text-[28px] font-black" style={{ color: ACCENT }}>
            {s.n}
          </div>
          <div className="text-[13px] font-semibold text-text-primary">
            {s.label}
          </div>
          <div className="text-[11px] text-text-muted">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Distinction Demo ── */
export function DistinctionDemo() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const pairs = [
    {
      a: "skeptical",
      b: "cynical",
      shared: "Both involve doubt",
      diff: "Skeptical = doubts evidence. Cynical = distrusts motives.",
      winner: "skeptical",
      why: "A scientist questioning assumptions is skeptical, not cynical.",
    },
    {
      a: "thorough",
      b: "exhaustive",
      shared: "Both mean complete",
      diff: "Thorough = careful & complete. Exhaustive = leaves nothing out.",
      winner: "exhaustive",
      why: "\"Left no document unexamined\" = totality, not just carefulness.",
    },
    {
      a: "deliberate",
      b: "calculated",
      shared: "Both mean intentional",
      diff: "Deliberate = careful thought (neutral). Calculated = strategic (slightly negative).",
      winner: "deliberate",
      why: "A personal artistic decision is deliberate, not scheming.",
    },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px]"
        style={{ color: AMBER }}
      >
        Near-Synonym Showdown
      </div>
      {pairs.map((p, i) => (
        <button
          key={i}
          onClick={() => setRevealed((prev) => ({ ...prev, [i]: true }))}
          className="mb-2.5 block w-full cursor-pointer rounded-2xl border border-border-default bg-bg-base p-3 text-left transition-all"
        >
          <div className="mb-1 flex items-center gap-2">
            <code
              className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]"
              style={{ color: ACCENT }}
            >
              {p.a}
            </code>
            <span className="text-[13px] font-bold text-text-muted">vs.</span>
            <code
              className="rounded-md bg-[rgba(200,16,46,.1)] px-2 py-0.5 font-mono text-[13px]"
              style={{ color: ACCENT }}
            >
              {p.b}
            </code>
          </div>
          <div className="text-[11px] text-text-muted">{p.shared}</div>
          {revealed[i] ? (
            <div className="mt-1.5 space-y-0.5">
              <div className="text-[12px] text-text-secondary">{p.diff}</div>
              <div className="text-[12px] font-semibold" style={{ color: "#10b981" }}>
                Winner: <strong>{p.winner}</strong> &mdash; {p.why}
              </div>
            </div>
          ) : (
            <div className="mt-1 text-[11px] text-text-muted">Tap to reveal</div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide: Intensity Scale ── */
export function IntensityScale() {
  const scales = [
    {
      label: "Concern",
      words: ["concerned", "worried", "alarmed", "panicked"],
      colors: ["#10b981", "#f59e0b", "#f97316", "#ef4444"],
    },
    {
      label: "Dislike",
      words: ["dislike", "resent", "despise", "loathe"],
      colors: ["#10b981", "#f59e0b", "#f97316", "#ef4444"],
    },
    {
      label: "Suggest",
      words: ["suggest", "argue", "insist", "demand"],
      colors: ["#10b981", "#f59e0b", "#f97316", "#ef4444"],
    },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Intensity Scales: Mild to Extreme
      </div>
      {scales.map((s, i) => (
        <div key={i} className="mb-3">
          <div className="mb-1 text-[12px] font-bold text-text-primary">
            {s.label}
          </div>
          <div className="flex gap-1">
            {s.words.map((w, j) => (
              <div
                key={j}
                className="flex-1 rounded-md px-2 py-1.5 text-center text-[11px] font-semibold"
                style={{ background: `${s.colors[j]}15`, color: s.colors[j] }}
              >
                {w}
              </div>
            ))}
          </div>
          <div className="mt-0.5 flex justify-between text-[9px] text-text-muted">
            <span>Mild</span>
            <span>Extreme</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Secondary Meanings Quiz ── */
export function SecondaryQuiz() {
  const items = [
    { word: "Entertain", primary: "Amuse", secondary: "To consider (an idea)", color: "#3b82f6" },
    { word: "Champion", primary: "Winner", secondary: "To advocate for", color: "#a855f7" },
    { word: "Appreciate", primary: "Be grateful", secondary: "Increase in value", color: "#10b981" },
    { word: "Flag", primary: "Banner", secondary: "To decline in energy", color: "#f59e0b" },
    { word: "Coin", primary: "Money piece", secondary: "To invent (a phrase)", color: "#ef4444" },
    { word: "Temper", primary: "Anger", secondary: "To moderate / soften", color: "#ec4899" },
  ];

  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px]"
        style={{ color: AMBER }}
      >
        Tap to reveal the SAT meaning
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setFlipped((p) => ({ ...p, [i]: !p[i] }))}
            className="cursor-pointer rounded-[10px] border p-3 text-left transition-all"
            style={{
              borderColor: flipped[i] ? item.color : "var(--color-border-default)",
              background: flipped[i] ? `${item.color}08` : "transparent",
            }}
          >
            <div className="text-[14px] font-bold text-text-primary">
              {item.word}
            </div>
            {flipped[i] ? (
              <>
                <div className="mt-0.5 text-[10px] text-text-muted line-through">
                  {item.primary}
                </div>
                <div className="text-[12px] font-semibold" style={{ color: item.color }}>
                  {item.secondary}
                </div>
              </>
            ) : (
              <div className="mt-0.5 text-[11px] text-text-muted">
                Tap to flip
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Slide: Vocab Clusters ── */
export function VocabClusters() {
  const clusters = [
    {
      label: "Ideas & Arguments",
      words: ["corroborate", "substantiate", "undermine", "refute", "bolster", "nuanced", "tenuous", "cogent"],
      color: "#3b82f6",
    },
    {
      label: "People & Approaches",
      words: ["meticulous", "pragmatic", "audacious", "complacent", "reticent", "candid", "dogmatic", "judicious"],
      color: "#a855f7",
    },
    {
      label: "Change & Scale",
      words: ["pervasive", "ephemeral", "unprecedented", "incremental", "precipitous", "nascent", "entrenched", "diminish"],
      color: "#10b981",
    },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        High-Value SAT Vocabulary Clusters
      </div>
      {clusters.map((c, i) => (
        <div
          key={i}
          className="mb-2.5 rounded-lg border-l-[3px] px-3 py-2.5"
          style={{ borderColor: c.color, background: `${c.color}06` }}
        >
          <div className="mb-1 text-[12px] font-bold" style={{ color: c.color }}>
            {c.label}
          </div>
          <div className="flex flex-wrap gap-1">
            {c.words.map((w, j) => (
              <code
                key={j}
                className="rounded-md px-2 py-0.5 font-mono text-[11px]"
                style={{ background: `${c.color}11`, color: c.color }}
              >
                {w}
              </code>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Tiebreaker Framework ── */
export function TiebreakerVisual() {
  const steps = [
    { n: "1", label: "Re-read with each word", detail: "Plug both candidates into the sentence", color: "#3b82f6" },
    { n: "2", label: "Check intensity", detail: "Is the passage calm or heated? Match the register", color: "#a855f7" },
    { n: "3", label: "Check scope", detail: "Is one word too broad? Too narrow?", color: "#10b981" },
    { n: "4", label: "Check secondary meanings", detail: "Could a common word have an uncommon definition?", color: "#f59e0b" },
    { n: "\u2605", label: "When truly stuck", detail: "Choose the more SPECIFIC word", color: ACCENT },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      {steps.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-md p-1.5 pl-2.5"
          style={{
            borderLeft: `3px solid ${s.color}`,
            background: `${s.color}08`,
          }}
        >
          <div
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-black"
            style={{ background: `${s.color}22`, color: s.color }}
          >
            {s.n}
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary">
              {s.label}
            </span>
            <span className="text-[11px] text-text-muted">
              {" "}
              &mdash; {s.detail}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
