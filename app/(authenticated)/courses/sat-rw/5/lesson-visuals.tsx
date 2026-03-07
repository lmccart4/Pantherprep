"use client";

import { useState } from "react";

const ACCENT = "#C8102E";
const AMBER = "#f59e0b";

/* ── Slide: Stats Visual ── */
export function StatsVisual() {
  const stats = [
    { n: "10-11", label: "Qs per test", sub: "Most frequent type" },
    { n: "~20%", label: "of SAT R&W", sub: "Words in Context" },
    { n: "4", label: "answer choices", sub: "Context clues narrow them" },
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

/* ── Slide: Tone Sorter ── */
export function ToneSorter() {
  const indicators = [
    {
      tone: "Positive",
      color: "#10b981",
      words: ["impressive", "effective", "skillfully", "praised", "innovative", "remarkable"],
    },
    {
      tone: "Negative",
      color: "#ef4444",
      words: ["despite", "unfortunately", "flawed", "criticized", "reckless", "undermined"],
    },
    {
      tone: "Neutral",
      color: "#6b7280",
      words: ["noted", "observed", "reported", "indicated", "described", "found"],
    },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Tone Indicators
      </div>
      <div className="space-y-2">
        {indicators.map((group, i) => (
          <div
            key={i}
            className="rounded-lg border-l-[3px] px-3 py-2.5"
            style={{ borderColor: group.color, background: `${group.color}08` }}
          >
            <div
              className="mb-1 text-[12px] font-bold"
              style={{ color: group.color }}
            >
              {group.tone}
            </div>
            <div className="flex flex-wrap gap-1">
              {group.words.map((w, j) => (
                <code
                  key={j}
                  className="rounded-md px-2 py-0.5 font-mono text-[11px]"
                  style={{
                    background: `${group.color}11`,
                    color: group.color,
                  }}
                >
                  {w}
                </code>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide: Clue Identifier ── */
export function ClueIdentifier() {
  const clues = [
    {
      type: "Definition",
      signal: "Dashes, commas, or \"meaning\" restated nearby",
      example: "her oeuvre \u2014 her complete body of work \u2014",
      color: "#3b82f6",
    },
    {
      type: "Contrast",
      signal: "but, however, unlike, rather than, although",
      example: "Unlike her cautious predecessor, the new director pursued a ______ strategy.",
      color: "#a855f7",
    },
    {
      type: "Example",
      signal: "Specific instances that reveal meaning",
      example: "______ behavior \u2014 refusing to compromise, insulting opponents...",
      color: "#10b981",
    },
    {
      type: "Logic",
      signal: "Cause-and-effect or sequential reasoning",
      example: "Because the data was ______, researchers could not draw conclusions.",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Four Context Clue Types
      </div>
      {clues.map((c, i) => (
        <div
          key={i}
          className="mb-2 rounded-[10px] border border-border-default bg-bg-surface p-3"
        >
          <div className="mb-1 flex items-center gap-2">
            <span
              className="rounded-md px-2 py-0.5 text-[11px] font-bold"
              style={{ background: `${c.color}22`, color: c.color }}
            >
              {c.type}
            </span>
            <span className="text-[11px] text-text-muted">{c.signal}</span>
          </div>
          <div className="font-serif text-[12px] italic text-text-secondary">
            {c.example}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Connotation Demo ── */
export function ConnotationDemo() {
  const [selected, setSelected] = useState<number | null>(null);

  const words = [
    { word: "thrifty", tone: "positive", feel: "Smart with money", color: "#10b981" },
    { word: "frugal", tone: "neutral", feel: "Disciplined spending", color: "#6b7280" },
    { word: "cheap", tone: "negative", feel: "Unwilling to spend", color: "#f59e0b" },
    { word: "stingy", tone: "very negative", feel: "Meanly unwilling to share", color: "#ef4444" },
  ];

  return (
    <div className="px-5 py-4">
      <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[1px] text-amber-500">
        Interactive: Same Meaning, Different Feel
      </div>
      <div className="mb-2 text-[13px] text-text-secondary">
        All describe someone who doesn&apos;t spend much. Tap each to see the connotation:
      </div>
      <div className="grid grid-cols-2 gap-2">
        {words.map((w, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="cursor-pointer rounded-[10px] border p-3 text-left transition-all"
            style={{
              borderColor:
                selected === i ? w.color : "var(--color-border-default)",
              background: selected === i ? `${w.color}11` : "transparent",
            }}
          >
            <div
              className="text-[16px] font-bold"
              style={{ color: selected === i ? w.color : "var(--color-text-primary)" }}
            >
              {w.word}
            </div>
            {selected === i && (
              <>
                <div
                  className="mt-1 text-[11px] font-semibold"
                  style={{ color: w.color }}
                >
                  {w.tone}
                </div>
                <div className="text-[11px] text-text-muted">{w.feel}</div>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Slide: Tier Visual ── */
export function TierVisual() {
  const tiers = [
    {
      label: "Tier 1 \u2014 Everyday",
      examples: "happy, run, big, said",
      note: "Not tested",
      color: "#6b7280",
      bar: 20,
    },
    {
      label: "Tier 2 \u2014 Academic",
      examples: "substantiate, ambivalent, pervasive, ephemeral",
      note: "SAT sweet spot",
      color: ACCENT,
      bar: 90,
    },
    {
      label: "Tier 3 \u2014 Domain-Specific",
      examples: "defenestration, syzygy, phenotype",
      note: "Not tested",
      color: "#6b7280",
      bar: 10,
    },
  ];

  return (
    <div className="space-y-2 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Vocabulary Tiers
      </div>
      {tiers.map((t, i) => (
        <div key={i}>
          <div className="mb-0.5 flex items-center justify-between">
            <span
              className="text-[12px] font-bold"
              style={{ color: t.color }}
            >
              {t.label}
            </span>
            <span className="text-[10px] text-text-muted">{t.note}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-sm bg-border-default">
            <div
              className="h-full rounded-sm"
              style={{ width: `${t.bar}%`, background: t.color }}
            />
          </div>
          <div className="mt-0.5 font-serif text-[11px] italic text-text-muted">
            {t.examples}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Process Framework ── */
export function ProcessFramework() {
  const steps = [
    { n: "1", label: "Read the passage", detail: "Predict the blank's tone & meaning", color: "#3b82f6" },
    { n: "2", label: "Find context clues", detail: "Definition, contrast, example, or logic clue", color: "#a855f7" },
    { n: "3", label: "Scan & eliminate", detail: "Cut wrong tone or mismatched meaning", color: "#10b981" },
    { n: "4", label: "Choose precision", detail: "Pick the most SPECIFIC match", color: ACCENT },
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
