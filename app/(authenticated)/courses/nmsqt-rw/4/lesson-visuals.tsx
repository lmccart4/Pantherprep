"use client";

import { useState } from "react";

const ACCENT = "#d4a017";

/* ── Morphology Decoder ── */
const ROOTS = [
  { root: "cred", meaning: "believe", examples: ["incredible", "credible", "credulous"], color: "#60a5fa" },
  { root: "dict", meaning: "say/speak", examples: ["contradict", "predict", "verdict"], color: "#34d399" },
  { root: "spec", meaning: "look/see", examples: ["circumspect", "inspect", "spectacle"], color: "#fbbf24" },
  { root: "voc/vok", meaning: "call/voice", examples: ["revocation", "invoke", "advocate"], color: "#f472b6" },
  { root: "duc/duct", meaning: "lead", examples: ["deduce", "conduct", "introduce"], color: "#a855f7" },
  { root: "scrib/script", meaning: "write", examples: ["transcription", "prescribe", "manuscript"], color: "#06b6d4" },
];

export function MorphologyVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Latin Root Decoder -- Tap to reveal examples
      </div>
      <div className="grid grid-cols-2 gap-3">
        {ROOTS.map((r, i) => (
          <button
            key={i}
            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: flipped[i] ? `${r.color}33` : "var(--color-border-default)",
              boxShadow: flipped[i] ? `0 0 16px ${r.color}11` : "none",
            }}
          >
            {!flipped[i] ? (
              <>
                <div className="mb-1 font-mono text-lg font-bold" style={{ color: r.color }}>{r.root}</div>
                <div className="text-[13px] text-text-muted">&quot;{r.meaning}&quot;</div>
                <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: r.color }}>tap for words &rarr;</div>
              </>
            ) : (
              <>
                <div className="mb-1.5 text-xs font-semibold" style={{ color: r.color }}>{r.root} = &quot;{r.meaning}&quot;</div>
                {r.examples.map((ex, j) => (
                  <div key={j} className="text-sm text-[#bcbcc8]">
                    <code className="rounded-md bg-[rgba(212,160,23,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{ex}</code>
                  </div>
                ))}
                <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: r.color }}>&larr; tap to flip</div>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Connotation Spectrum ── */
const SPECTRA = [
  { concept: "Careful with money", words: ["thrifty", "economical", "frugal", "cheap", "miserly"], colors: ["#22c55e", "#34d399", "#fbbf24", "#f59e0b", "#ef4444"] },
  { concept: "Thin person", words: ["slender", "lean", "skinny", "scrawny", "gaunt"], colors: ["#22c55e", "#34d399", "#fbbf24", "#f59e0b", "#ef4444"] },
  { concept: "Speaks their mind", words: ["forthright", "candid", "blunt", "tactless", "abrasive"], colors: ["#22c55e", "#34d399", "#fbbf24", "#f59e0b", "#ef4444"] },
];

export function ConnotationVisual() {
  return (
    <div className="space-y-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Connotation Spectra: Positive &rarr; Negative
      </div>
      {SPECTRA.map((s, i) => (
        <div key={i} className="rounded-xl border border-border-default bg-bg-base p-4">
          <div className="mb-2.5 text-xs font-semibold text-text-muted">{s.concept}</div>
          <div className="flex gap-1.5">
            {s.words.map((w, j) => (
              <div
                key={j}
                className="flex-1 rounded-lg py-2 text-center text-[13px] font-bold transition-transform hover:scale-105"
                style={{ background: `${s.colors[j]}15`, color: s.colors[j] }}
              >
                {w}
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-text-muted">
            <span>+ Positive</span>
            <span>Neutral</span>
            <span>Negative -</span>
          </div>
        </div>
      ))}
      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Key Insight: </strong>
        Near-synonyms carry different emotional weight. The PSAT tests whether you can pick the word with the right shade of meaning.
      </div>
    </div>
  );
}

/* ── Prediction Method Visual ── */
export function PredictionVisual() {
  const steps = [
    { step: "1", title: "Read the passage", desc: "Identify context clues: contrast signals, tone, cause-effect", icon: "📖" },
    { step: "2", title: "Cover the choices", desc: "Predict what word should fill the blank BEFORE looking at options", icon: "🫣" },
    { step: "3", title: "Match your prediction", desc: "Find the choice closest to your prediction -- that is almost always correct", icon: "🎯" },
  ];

  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-4 rounded-xl border border-border-default bg-bg-base p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl" style={{ background: "rgba(212,160,23,.1)" }}>
            {s.icon}
          </div>
          <div>
            <div className="text-sm font-bold text-text-primary">
              <span style={{ color: ACCENT }}>Step {s.step}: </span>{s.title}
            </div>
            <div className="mt-0.5 text-[13px] leading-[1.6] text-text-muted">{s.desc}</div>
          </div>
        </div>
      ))}
      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">Why this works: </strong>
        The prediction method prevents trap answers from luring you. If you look at choices first, attractive-sounding wrong answers can override your reading of the passage.
      </div>
    </div>
  );
}

/* ── Secondary Meanings Table ── */
export function SecondaryMeaningsVisual() {
  const words = [
    { word: "bear", common: "large animal", secondary: "to carry, endure, or support", example: "The report bore no mention of the scandal." },
    { word: "exercise", common: "physical activity", secondary: "to express, put into action", example: "Activists exercised concerns about air quality." },
    { word: "harbor", common: "port for ships", secondary: "to hold secretly (an emotion)", example: "He harbored deep resentment." },
    { word: "channel", common: "TV station", secondary: "to direct or guide", example: "She channeled her frustration into art." },
    { word: "strike", common: "to hit", secondary: "to reach, achieve", example: "They struck a compromise." },
  ];

  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Secondary Meanings -- The Hardest Trap
      </div>
      {words.map((w, i) => (
        <button
          key={i}
          onClick={() => setRevealed(prev => ({ ...prev, [i]: true }))}
          className="w-full cursor-pointer rounded-xl border border-border-default bg-bg-base p-4 text-left transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <code className="rounded-md bg-[rgba(212,160,23,.1)] px-3 py-1 font-mono text-base font-bold" style={{ color: ACCENT }}>{w.word}</code>
            <span className="text-sm text-text-muted">Common: {w.common}</span>
          </div>
          {revealed[i] ? (
            <div className="mt-2 space-y-1.5 rounded-lg bg-[rgba(34,197,94,.05)] px-3 py-2">
              <div className="text-sm text-[#bcbcc8]"><strong style={{ color: "#22c55e" }}>PSAT meaning:</strong> {w.secondary}</div>
              <div className="text-[13px] italic text-text-muted">&quot;{w.example}&quot;</div>
            </div>
          ) : (
            <div className="mt-1 text-[11px] text-text-muted">Tap to reveal the PSAT meaning</div>
          )}
        </button>
      ))}
    </div>
  );
}
