"use client";

import { useState } from "react";

const ACCENT = "#06b6d4";

/* ── Slide 1: Sample Question Anatomy ── */
export function SampleQuestionVisual() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border-default bg-[rgba(15,15,22,.75)] backdrop-blur-xl">
        {/* Notes section */}
        <div className="border-b border-border-default p-5">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>Bulleted Notes (replaces the passage)</div>
          <div className="rounded-lg border border-border-default bg-bg-base p-4 text-[13px] leading-[1.8] text-[#bcbcc8]">
            <div className="mb-1 font-semibold text-text-primary">Notes on the Voyager space probes:</div>
            <ul className="list-disc space-y-0.5 pl-5">
              <li>Voyager 1 and 2 were launched by NASA in 1977.</li>
              <li>Their original mission was to study Jupiter and Saturn.</li>
              <li>Both probes have now entered interstellar space.</li>
              <li>Voyager 1 is the farthest human-made object from Earth, at over 15 billion miles.</li>
              <li>The probes continue to transmit scientific data back to Earth over 45 years after launch.</li>
            </ul>
          </div>
        </div>

        {/* Question section */}
        <div className="p-5">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: "#a78bfa" }}>Question Stem (contains the goal)</div>
          <div className="rounded-lg border border-[rgba(167,139,250,.2)] bg-[rgba(167,139,250,.05)] px-4 py-3 text-sm text-[#bcbcc8]">
            The student wants to <strong style={{ color: "#a78bfa" }}>emphasize the ongoing significance</strong> of the Voyager probes. Which choice most effectively uses relevant information from the notes to accomplish this goal?
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Key insight: </strong>
        Instead of &quot;What does the author mean?&quot; the question asks &quot;Which sentence effectively uses the notes to accomplish a specific goal?&quot; The <strong>goal</strong> determines the correct answer.
      </div>
    </div>
  );
}

/* ── Slide 2: Three-Step Method ── */
export function ThreeStepVisual() {
  const steps = [
    { num: "1", title: "GOAL", desc: "Read the question stem. Underline the rhetorical goal. What is the student trying to do?", icon: "\uD83C\uDFAF", color: "#ef4444" },
    { num: "2", title: "SELECT", desc: "Which bullet points are relevant to that goal? Cross out notes that don't serve the goal.", icon: "\u2702\uFE0F", color: "#fbbf24" },
    { num: "3", title: "EVALUATE", desc: "Which answer uses the RIGHT notes AND connects them to achieve the goal?", icon: "\u2705", color: "#22c55e" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {steps.map((s, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-bg-base p-4 text-center">
            <div className="mb-1 text-xl">{s.icon}</div>
            <div className="font-mono text-2xl font-bold" style={{ color: s.color }}>{s.num}</div>
            <div className="mb-1.5 text-[14px] font-bold" style={{ color: s.color }}>{s.title}</div>
            <div className="text-[12px] leading-snug text-text-muted">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(251,191,36,.2)] bg-[rgba(251,191,36,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#fbbf24" }}>Why the goal matters most: </strong>
        The same set of notes can produce DIFFERENT correct answers depending on the goal. All four answer choices use information from the notes — but only one uses the <em>right</em> information arranged to achieve the <em>specific</em> goal.
      </div>
    </div>
  );
}

/* ── Slide 3: Five Goal Types ── */
export function FiveGoalsVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const goals = [
    { name: "Summarize", cues: "\"present an overview,\" \"introduce the topic\"", strategy: "Cover the MOST important points without minor details. Broad + accurate.", color: "#22c55e" },
    { name: "Compare / Contrast", cues: "\"highlight a difference,\" \"compare the two\"", strategy: "Must mention BOTH things being compared. Show how they differ or are similar.", color: "#60a5fa" },
    { name: "Argue / Persuade", cues: "\"make an argument,\" \"support the claim\"", strategy: "Present a clear position AND the strongest supporting evidence from the notes.", color: "#ef4444" },
    { name: "Describe / Explain", cues: "\"describe the process,\" \"explain how\"", strategy: "Accurately convey the relevant information clearly. The most straightforward goal.", color: "#a78bfa" },
    { name: "Emphasize", cues: "\"emphasize the significance,\" \"stress the importance\"", strategy: "Foreground the MOST impressive detail, often placing it in the emphatic position (end of sentence).", color: "#fbbf24" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {goals.map((g, i) => (
          <button
            key={i}
            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: flipped[i] ? `${g.color}44` : "var(--color-border-default)",
              boxShadow: flipped[i] ? `0 0 20px ${g.color}11` : "none",
            }}
          >
            {!flipped[i] ? (
              <div className="text-center">
                <div className="mb-1.5 text-[14px] font-bold" style={{ color: g.color }}>{g.name}</div>
                <div className="text-[11px] text-text-muted">{g.cues}</div>
                <div className="mt-2.5 text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: g.color }}>tap for strategy</div>
              </div>
            ) : (
              <div>
                <div className="mb-1.5 text-[11px] font-bold" style={{ color: g.color }}>{g.name}</div>
                <div className="text-[12px] leading-[1.7] text-[#bcbcc8]">{g.strategy}</div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.05)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#ef4444" }}>Common trap: </strong>
        An answer choice that uses accurate information from the notes but serves the WRONG goal. Every choice may be factually correct — the question isn&apos;t &quot;which is true?&quot; but &quot;which achieves the goal?&quot;
      </div>
    </div>
  );
}
