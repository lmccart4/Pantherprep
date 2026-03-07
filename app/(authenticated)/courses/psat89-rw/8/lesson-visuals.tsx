"use client";

import { useState } from "react";

const ACCENT = "#06b6d4";

/* ── Slide 1: Three-Step Toolkit ── */
export function ToolkitVisual() {
  const steps = [
    { num: "1", title: "READ", desc: "Read the sentence BEFORE and AFTER the blank.", color: "#60a5fa", icon: "\uD83D\uDC41\uFE0F" },
    { num: "2", title: "NAME", desc: "Label the relationship: addition, contrast, cause/effect, sequence, example, or summary.", color: "#a78bfa", icon: "\uD83C\uDFF7\uFE0F" },
    { num: "3", title: "MATCH", desc: "Pick the answer choice that belongs to the category you named.", color: "#22c55e", icon: "\u2705" },
  ];

  const categories = [
    { name: "Addition", words: "furthermore, moreover, in addition, likewise, similarly", color: "#22c55e" },
    { name: "Contrast", words: "however, nevertheless, in contrast, on the other hand, conversely", color: "#ef4444" },
    { name: "Cause/Effect", words: "therefore, consequently, as a result, accordingly, thus", color: "#fbbf24" },
    { name: "Example", words: "for instance, for example, specifically, in particular", color: "#60a5fa" },
    { name: "Sequence", words: "subsequently, afterward, then, meanwhile, finally", color: "#a78bfa" },
    { name: "Summary", words: "in conclusion, overall, in summary, in short", color: ACCENT },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {steps.map((s, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-bg-base p-4 text-center">
            <div className="mb-1 text-xl">{s.icon}</div>
            <div className="font-mono text-2xl font-bold" style={{ color: s.color }}>{s.num}</div>
            <div className="mb-1 text-[14px] font-bold" style={{ color: s.color }}>{s.title}</div>
            <div className="text-[11px] leading-snug text-text-muted">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <div className="bg-bg-surface px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Six Transition Categories</div>
        <div className="grid grid-cols-3 gap-px bg-border-default">
          {categories.map((c, i) => (
            <div key={i} className="bg-bg-base px-3.5 py-3">
              <div className="mb-1 text-[12px] font-bold" style={{ color: c.color }}>{c.name}</div>
              <div className="text-[11px] leading-relaxed text-text-muted">{c.words}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Why this works: </strong>
        Answer choices almost always come from <em>different</em> categories. Name the category and you eliminate three wrong answers instantly.
      </div>
    </div>
  );
}

/* ── Slide 2: Causation Test ── */
export function CausationTestVisual() {
  const [revealed, setRevealed] = useState(false);

  const pairs = [
    {
      s1: "Dolphins are intelligent.",
      s2: "They display complex social behaviors.",
      relationship: "Addition",
      word: "Furthermore",
      why: "Idea 2 is ANOTHER point about the same argument, not caused by Idea 1.",
      color: "#22c55e",
    },
    {
      s1: "The drought destroyed crops.",
      s2: "Food prices rose sharply.",
      relationship: "Cause/Effect",
      word: "Consequently",
      why: "Idea 1 directly CAUSED Idea 2.",
      color: "#fbbf24",
    },
    {
      s1: "The medication reduced symptoms in 80% of patients.",
      s2: "The FDA approved it for widespread use.",
      relationship: "Cause/Effect",
      word: "Therefore",
      why: "Positive results LED TO approval. \"However\" would wrongly imply surprise.",
      color: "#fbbf24",
    },
    {
      s1: "The city's population has grown by 30%.",
      s2: "Neighboring suburbs have experienced similar growth.",
      relationship: "Addition",
      word: "Similarly",
      why: "The city didn't CAUSE suburb growth. Both are experiencing the same trend independently.",
      color: "#22c55e",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[rgba(251,191,36,.2)] bg-bg-base p-5">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#fbbf24]">The Causation Test</div>
        <div className="rounded-xl border border-[rgba(251,191,36,.15)] bg-[rgba(251,191,36,.05)] px-4 py-3 text-center text-sm text-[#bcbcc8]">
          Ask yourself: <strong style={{ color: "#fbbf24" }}>&quot;Did Idea 1 directly cause or lead to Idea 2?&quot;</strong>
          <br />
          If <strong style={{ color: "#22c55e" }}>no</strong> \u2192 Addition &nbsp;&nbsp;|&nbsp;&nbsp; If <strong style={{ color: "#fbbf24" }}>yes</strong> \u2192 Cause/Effect
        </div>
      </div>

      <div className="space-y-2">
        {pairs.map((p, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border-default bg-bg-base">
            <div className="px-4 py-2.5">
              <div className="font-mono text-[12px] text-[#bcbcc8]">
                &quot;{p.s1}&quot; <strong className="text-text-muted">___</strong> &quot;{p.s2}&quot;
              </div>
            </div>
            {revealed && (
              <div className="border-t border-border-default px-4 py-2.5" style={{ background: `${p.color}06` }}>
                <span className="text-[12px] font-bold" style={{ color: p.color }}>{p.relationship}: {p.word}</span>
                <span className="ml-2 text-[11px] text-text-muted">{p.why}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setRevealed(!revealed)}
        className="w-full cursor-pointer rounded-lg border border-border-default bg-bg-surface px-4 py-2.5 text-[13px] font-medium transition-all"
        style={{ color: ACCENT }}
      >
        {revealed ? "Hide answers" : "Reveal answers"}
      </button>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.05)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#ef4444" }}>Most common trap: </strong>
        &quot;However&quot; and &quot;moreover&quot; are the two most frequently chosen <em>wrong</em> answers because they sound sophisticated. They only work if the relationship actually IS contrast or addition.
      </div>
    </div>
  );
}
