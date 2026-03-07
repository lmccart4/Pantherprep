"use client";

import { useState } from "react";

const ACCENT = "#06b6d4";

/* ── Slide 1: Central Idea Steps ── */
export function CentralIdeaStepsVisual() {
  const steps = [
    { num: "1", title: "Identify the Topic", desc: "What is this about in 1\u20133 words?", example: "Coral reefs", color: "#60a5fa" },
    { num: "2", title: "Ask \"So What?\"", desc: "What specific POINT does the author make?", example: "Coral reefs are declining faster than predicted", color: "#a78bfa" },
    { num: "3", title: "Check Coverage", desc: "Does your central idea cover the WHOLE passage?", example: "Not just one detail or one paragraph", color: ACCENT },
    { num: "4", title: "Match & Eliminate", desc: "Find the answer that's neither too broad nor too narrow", example: "Goldilocks zone: just right", color: "#22c55e" },
  ];

  const wrongTypes = [
    { label: "Too Broad", example: "\"Discusses the importance of scientific research\"", color: "#ef4444" },
    { label: "Too Narrow", example: "Focuses on one detail instead of the full arc", color: "#fbbf24" },
    { label: "Off-Topic", example: "Mentions something related but not in the passage", color: "#a78bfa" },
    { label: "Distorted", example: "Right topic, wrong claim (says supports when it questions)", color: ACCENT },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2.5">
        {steps.map((s, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-bg-base p-3.5 text-center">
            <div className="mb-1 font-mono text-2xl font-bold" style={{ color: s.color }}>{s.num}</div>
            <div className="mb-1 text-[13px] font-bold text-text-primary">{s.title}</div>
            <div className="text-[11px] leading-snug text-text-muted">{s.desc}</div>
            <div className="mt-1.5 rounded-md bg-[rgba(6,182,212,.05)] px-2 py-1 font-mono text-[10px] text-[#bcbcc8]">{s.example}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <div className="bg-bg-surface px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#ef4444]">Four Wrong-Answer Types</div>
        <div className="grid grid-cols-2 gap-px bg-border-default">
          {wrongTypes.map((w, i) => (
            <div key={i} className="bg-bg-base px-4 py-3">
              <span className="text-[13px] font-bold" style={{ color: w.color }}>{w.label}</span>
              <div className="mt-0.5 text-[11px] leading-snug text-text-muted">{w.example}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Slide 2: Stated vs. Implied ── */
export function StatedVsImpliedVisual() {
  const rules = [
    { icon: "\uD83D\uDCCC", rule: "If the passage doesn't say it, don't choose it", note: "Even if it's true in real life", color: "#ef4444" },
    { icon: "\uD83D\uDEAB", rule: "Don't add your own knowledge", note: "The PSAT only tests what's IN the text", color: "#fbbf24" },
    { icon: "\u26A0\uFE0F", rule: "Beware of strong words", note: "\"always, never, all, none, every, completely\"", color: "#a78bfa" },
    { icon: "\uD83C\uDFAF", rule: "Point to the evidence", note: "Can you underline the supporting text?", color: "#22c55e" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.05)] p-4">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px] text-[#22c55e]">Stated (Explicit)</div>
          <div className="text-[12px] leading-[1.7] text-[#bcbcc8]">&quot;According to the passage&quot; or &quot;The text states&quot; — look for information directly written in the text.</div>
        </div>
        <div className="flex-1 rounded-xl border border-[rgba(167,139,250,.2)] bg-[rgba(167,139,250,.05)] p-4">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px] text-[#a78bfa]">Implied (Inferred)</div>
          <div className="text-[12px] leading-[1.7] text-[#bcbcc8]">&quot;Based on the passage, it can be inferred&quot; — the answer is supported by the text but not directly stated.</div>
        </div>
      </div>

      <div className="space-y-2">
        {rules.map((r, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border-l-[3px] px-3.5 py-2.5" style={{ borderColor: r.color, background: `${r.color}06` }}>
            <span className="text-lg">{r.icon}</span>
            <div>
              <span className="text-[13px] font-bold" style={{ color: r.color }}>{r.rule}</span>
              <div className="text-[11px] text-text-muted">{r.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 3: Inference Spectrum ── */
export function InferenceSpectrumVisual() {
  const levels = [
    {
      label: "Restatement",
      example: "\"The population declined by 40%.\" \u2192 The population shrank.",
      verdict: "Too obvious — not really an inference",
      color: "#22c55e",
      position: "10%",
    },
    {
      label: "Valid Inference",
      example: "\"The population declined by 40% after the dam was built.\" \u2192 The dam likely contributed.",
      verdict: "Supported by the text \u2714",
      color: ACCENT,
      position: "45%",
    },
    {
      label: "Logical Leap",
      example: "\"The population declined by 40%.\" \u2192 The species will go extinct.",
      verdict: "Too extreme — not supported",
      color: "#ef4444",
      position: "85%",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Spectrum bar */}
      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">The Inference Spectrum</div>
        <div className="relative mb-8 h-3 overflow-hidden rounded-full" style={{ background: "linear-gradient(90deg, #22c55e, #06b6d4, #ef4444)" }}>
          {levels.map((l, i) => (
            <div key={i} className="absolute -top-1 h-5 w-1 rounded-sm bg-white/80" style={{ left: l.position }} />
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-[1px]">
          <span style={{ color: "#22c55e" }}>Close to Text</span>
          <span style={{ color: "#ef4444" }}>Far from Text</span>
        </div>
      </div>

      {/* Levels */}
      <div className="space-y-2">
        {levels.map((l, i) => (
          <div key={i} className="rounded-xl border-l-[3px] bg-bg-base px-4 py-3" style={{ borderColor: l.color }}>
            <div className="mb-1 text-[13px] font-bold" style={{ color: l.color }}>{l.label}</div>
            <div className="text-[12px] italic text-[#bcbcc8]">{l.example}</div>
            <div className="mt-1 text-[11px] font-semibold" style={{ color: l.color }}>{l.verdict}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>The &quot;Closest to the Text&quot; Principle: </strong>
        When two answers both seem plausible, pick the one that requires the FEWEST assumptions beyond what the passage states.
      </div>
    </div>
  );
}
