"use client";

import { useState } from "react";

const ACCENT = "#06b6d4";

/* ── Slide 1: Litmus Test ── */
export function LitmusTestVisual() {
  const steps = [
    { num: "1", title: "Read the claim", desc: "Underline the key words in the claim.", color: "#60a5fa" },
    { num: "2", title: "Test each quote", desc: "Does this PROVE the claim, or just relate to the topic?", color: "#a78bfa" },
    { num: "3", title: "Litmus test", desc: "Read claim + quote back-to-back. Does it feel inevitable?", color: ACCENT },
    { num: "4", title: "Eliminate traps", desc: "Same topic but wrong claim? Interesting but irrelevant?", color: "#22c55e" },
  ];

  const traps = [
    { label: "Same Topic", desc: "Mentions the subject but doesn't support the specific claim", icon: "\uD83C\uDFAF", color: "#ef4444" },
    { label: "Interesting but Irrelevant", desc: "Most vivid quote, but doesn't address the claim", icon: "\u2728", color: "#fbbf24" },
    { label: "Partial Support", desc: "Supports part of the claim but misses the key element", icon: "\u00BD", color: "#a78bfa" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2.5">
        {steps.map((s, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-bg-base p-3.5 text-center">
            <div className="mb-1 font-mono text-2xl font-bold" style={{ color: s.color }}>{s.num}</div>
            <div className="mb-1 text-[13px] font-bold text-text-primary">{s.title}</div>
            <div className="text-[11px] leading-snug text-text-muted">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-[rgba(239,68,68,.15)]">
        <div className="bg-[rgba(239,68,68,.05)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#ef4444]">Common Evidence Traps</div>
        {traps.map((t, i) => (
          <div key={i} className="flex items-center gap-3 border-t border-border-default px-4 py-3">
            <span className="text-lg">{t.icon}</span>
            <div>
              <span className="text-[13px] font-bold" style={{ color: t.color }}>{t.label}</span>
              <div className="text-[11px] text-text-muted">{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 2: Graphic Types ── */
export function GraphicTypesVisual() {
  const [activeTab, setActiveTab] = useState(0);

  const types = [
    {
      name: "Tables",
      look: "Rows & columns of specific values",
      strategy: "Compare specific values across rows/columns. Look for highest, lowest, differences.",
      color: "#60a5fa",
    },
    {
      name: "Bar Graphs",
      look: "Vertical or horizontal bars comparing categories",
      strategy: "Taller bar = larger value. Compare which category is biggest/smallest and relative differences.",
      color: "#22c55e",
    },
    {
      name: "Line Graphs",
      look: "Lines showing change over time",
      strategy: "Look for increases, decreases, peaks, valleys, and overall trend direction.",
      color: "#a78bfa",
    },
  ];

  const qSteps = [
    "Read the graphic FIRST: title, labels, units, scale",
    "Read the passage: what claim does the author make?",
    "Match specific data to the specific claim",
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="overflow-hidden rounded-2xl border border-border-default bg-[rgba(15,15,22,.75)] backdrop-blur-xl">
        <div className="flex border-b border-border-default px-2">
          {types.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className="-mb-px cursor-pointer border-b-2 px-5 py-3 text-[13px] font-medium transition-all"
              style={{
                color: i === activeTab ? t.color : "var(--color-text-muted)",
                borderColor: i === activeTab ? t.color : "transparent",
                fontWeight: i === activeTab ? 700 : 500,
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
        <div className="p-5">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[1px]" style={{ color: types[activeTab].color }}>
            {types[activeTab].name}
          </div>
          <div className="mb-2 text-sm text-[#bcbcc8]">
            <strong>What it looks like:</strong> {types[activeTab].look}
          </div>
          <div className="text-sm text-[#bcbcc8]">
            <strong>Strategy:</strong> {types[activeTab].strategy}
          </div>
        </div>
      </div>

      {/* Three steps */}
      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>Three Steps for Quantitative Evidence</div>
        {qSteps.map((s, i) => (
          <div key={i} className="flex items-start gap-2 py-1 text-sm text-[#bcbcc8]">
            <span className="font-mono font-bold" style={{ color: ACCENT }}>{i + 1}.</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 3: Integration Patterns ── */
export function IntegrationPatternsVisual() {
  const patterns = [
    { name: "Data Supports", desc: "The passage makes a claim and the graph provides confirming numbers.", icon: "\u2705", color: "#22c55e" },
    { name: "Data Complicates", desc: "The passage makes a claim but the data shows an exception or limitation.", icon: "\u26A0\uFE0F", color: "#fbbf24" },
    { name: "Data Extends", desc: "The passage discusses a concept and the data adds specific numbers.", icon: "\u2795", color: "#60a5fa" },
    { name: "Passage Provides Context", desc: "Raw numbers don't mean much without the passage explaining them.", icon: "\uD83D\uDD0D", color: "#a78bfa" },
  ];

  const traps = [
    { label: "Misreading the scale", desc: "Axis doesn't start at zero — bar looks twice as tall but difference is small" },
    { label: "Correlation \u2260 Causation", desc: "Two things changed together, but one didn't necessarily cause the other" },
    { label: "Going beyond the data", desc: "Predicting a future trend the data doesn't support" },
    { label: "Wrong row / column", desc: "Reading from the wrong category in a table" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        {patterns.map((p, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-bg-base px-4 py-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-base">{p.icon}</span>
              <span className="text-[13px] font-bold" style={{ color: p.color }}>{p.name}</span>
            </div>
            <div className="text-[11px] leading-snug text-text-muted">{p.desc}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <div className="bg-bg-surface px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#ef4444]">Quantitative Traps</div>
        <div className="divide-y divide-border-default">
          {traps.map((t, i) => (
            <div key={i} className="px-4 py-2.5">
              <span className="text-[13px] font-bold text-[#ef4444]">{t.label}: </span>
              <span className="text-[12px] text-text-muted">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Remember: </strong>
        No complex math needed. The questions test whether you can READ the graphic accurately and CONNECT it to the passage logically.
      </div>
    </div>
  );
}
