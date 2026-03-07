"use client";

import { useState } from "react";

const ACCENT = "#06b6d4";

/* ── Slide 1: Six Text Structures ── */
export function SixStructuresVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const structures = [
    { name: "Cause / Effect", signal: "because, therefore, as a result, consequently", icon: "\u2192", color: "#ef4444" },
    { name: "Compare / Contrast", signal: "similarly, in contrast, whereas, unlike", icon: "\u2194", color: "#60a5fa" },
    { name: "Problem / Solution", signal: "the challenge, to address this, one approach", icon: "\uD83D\uDD27", color: "#22c55e" },
    { name: "Chronological", signal: "first, then, subsequently, in 1923", icon: "\u23F1\uFE0F", color: "#fbbf24" },
    { name: "Claim / Evidence", signal: "argues, evidence suggests, studies show", icon: "\uD83D\uDCCA", color: "#a78bfa" },
    { name: "Description", signal: "is characterized by, includes, types of", icon: "\uD83D\uDD0D", color: ACCENT },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2.5">
        {structures.map((s, i) => (
          <button
            key={i}
            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-3.5 text-center transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: flipped[i] ? `${s.color}44` : "var(--color-border-default)",
              boxShadow: flipped[i] ? `0 0 20px ${s.color}11` : "none",
            }}
          >
            {!flipped[i] ? (
              <>
                <div className="mb-1.5 text-xl">{s.icon}</div>
                <div className="text-[13px] font-bold" style={{ color: s.color }}>{s.name}</div>
                <div className="mt-2 text-[10px] font-medium opacity-60" style={{ color: s.color }}>tap for signals</div>
              </>
            ) : (
              <>
                <div className="mb-1 text-[11px] font-bold" style={{ color: s.color }}>{s.name}</div>
                <div className="text-[11px] leading-snug text-[#bcbcc8]">{s.signal}</div>
                <div className="mt-2 text-[10px] font-medium opacity-60" style={{ color: s.color }}>tap to flip back</div>
              </>
            )}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Strategy: </strong>
        When you see a text structure question, ask: &quot;What is the <em>relationship</em> between the sentences?&quot; Don&apos;t summarize the content — identify the organizational pattern.
      </div>
    </div>
  );
}

/* ── Slide 2: Purpose vs. Topic ── */
export function PurposeVsTopicVisual() {
  const purposes = [
    { verb: "Argue", desc: "Convince the reader of a position", color: "#ef4444" },
    { verb: "Explain", desc: "Teach the reader about a topic", color: "#60a5fa" },
    { verb: "Challenge", desc: "Push back against a common belief", color: "#fbbf24" },
    { verb: "Qualify", desc: "Add nuance or limitations to a claim", color: "#a78bfa" },
    { verb: "Illustrate", desc: "Provide a concrete example of an abstract idea", color: "#22c55e" },
    { verb: "Describe", desc: "Paint a picture using details", color: ACCENT },
    { verb: "Compare", desc: "Show similarities and differences", color: "#f472b6" },
    { verb: "Contextualize", desc: "Provide background information", color: "#34d399" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.05)] p-4 text-center">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#ef4444]">Topic</div>
          <div className="text-sm text-[#bcbcc8]">What the passage is about</div>
          <div className="mt-2 font-mono text-[13px] text-text-muted">&quot;Coral reefs&quot;</div>
        </div>
        <div className="flex items-center text-2xl text-text-muted">\u2260</div>
        <div className="flex-1 rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.05)] p-4 text-center">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#22c55e]">Purpose</div>
          <div className="text-sm text-[#bcbcc8]">Why the author wrote it</div>
          <div className="mt-2 font-mono text-[13px] text-text-muted">&quot;To argue for stronger protections&quot;</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <div className="bg-bg-surface px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Eight Common Purpose Verbs</div>
        <div className="grid grid-cols-4 gap-px bg-border-default">
          {purposes.map((p, i) => (
            <div key={i} className="bg-bg-base px-3 py-2.5 text-center">
              <div className="text-[13px] font-bold" style={{ color: p.color }}>{p.verb}</div>
              <div className="mt-0.5 text-[10px] leading-snug text-text-muted">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(167,139,250,.2)] bg-[rgba(167,139,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#a78bfa" }}>Key distinction: </strong>
        Wrong answers on purpose questions often describe the <em>topic</em> correctly but the <em>purpose</em> incorrectly. Always look for a <strong>purpose verb</strong> in the answer choice.
      </div>
    </div>
  );
}

/* ── Slide 3: Five Cross-Text Relationships ── */
export function FiveRelationshipsVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const rels = [
    { name: "Agree", desc: "Both authors support the same claim", signal: "both argue, similarly contends", color: "#22c55e", icon: "\u2705" },
    { name: "Disagree", desc: "Authors take opposing positions", signal: "rejects, disputes, counters", color: "#ef4444", icon: "\u274C" },
    { name: "Extend", desc: "Text 2 builds on Text 1 with new info", signal: "building on, furthermore", color: "#60a5fa", icon: "\u27A1\uFE0F" },
    { name: "Qualify", desc: "Text 2 adds limitations to Text 1's claim", signal: "acknowledges but notes, however", color: "#fbbf24", icon: "\u26A0\uFE0F" },
    { name: "Apply", desc: "Text 2 applies Text 1's principle to a new case", signal: "applies, uses the same framework", color: "#a78bfa", icon: "\uD83D\uDD04" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2">
        {rels.map((r, i) => (
          <button
            key={i}
            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-3 text-center transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: flipped[i] ? `${r.color}44` : "var(--color-border-default)",
              boxShadow: flipped[i] ? `0 0 16px ${r.color}11` : "none",
            }}
          >
            {!flipped[i] ? (
              <>
                <div className="mb-1 text-lg">{r.icon}</div>
                <div className="text-[13px] font-bold" style={{ color: r.color }}>{r.name}</div>
                <div className="mt-0.5 text-[10px] leading-snug text-text-muted">{r.desc}</div>
              </>
            ) : (
              <>
                <div className="mb-1 text-[11px] font-bold" style={{ color: r.color }}>Signals</div>
                <div className="text-[11px] leading-snug text-[#bcbcc8]">{r.signal}</div>
              </>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Strategy: </strong>
        Step 1: Summarize Text 1 in one sentence. Step 2: Summarize Text 2 in one sentence. Step 3: Ask &quot;Does Text 2 agree, disagree, extend, qualify, or apply Text 1?&quot;
      </div>
    </div>
  );
}
