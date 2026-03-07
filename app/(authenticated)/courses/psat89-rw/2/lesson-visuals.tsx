"use client";

import { useState } from "react";

const ACCENT = "#06b6d4";

/* ── Slide 1: Predict Before You Peek Method ── */
export function PredictMethodVisual() {
  const steps = [
    { num: "1", title: "Read the full passage", desc: "Don't skip to the blank. Absorb the tone, context, and key details.", color: "#60a5fa" },
    { num: "2", title: "Cover the choices", desc: "Predict your own word for the blank based on context clues.", color: "#a78bfa" },
    { num: "3", title: "Uncover & match", desc: "Find the choice closest to your prediction.", color: ACCENT },
    { num: "4", title: "Plug it back in", desc: "Does it fit the meaning AND the tone of the passage?", color: "#22c55e" },
  ];

  const traps = [
    { icon: "\u26A0\uFE0F", label: "Sounds Right", desc: "Familiar word that doesn't match the specific meaning", color: "#ef4444" },
    { icon: "\uD83C\uDFAF", label: "Close But Not Precise", desc: "Two choices seem similar — one is more exact", color: "#fbbf24" },
    { icon: "\uD83D\uDD04", label: "Secondary Meaning", desc: "Common word used in an uncommon way (e.g., \"arrest\" = stop)", color: "#a78bfa" },
    { icon: "\uD83C\uDFAD", label: "Tone Mismatch", desc: "Right meaning but wrong register (too casual or too formal)", color: ACCENT },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2.5">
        {steps.map((s, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-bg-base p-3.5 text-center">
            <div className="mb-1.5 font-mono text-2xl font-bold" style={{ color: s.color }}>{s.num}</div>
            <div className="mb-1 text-[13px] font-bold text-text-primary">{s.title}</div>
            <div className="text-[11px] leading-snug text-text-muted">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.05)] px-5 py-4">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#ef4444]">Four Common Traps</div>
        <div className="grid grid-cols-2 gap-2.5">
          {traps.map((t, i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-lg border border-border-default bg-bg-base px-3 py-2.5">
              <span className="text-lg">{t.icon}</span>
              <div>
                <span className="text-[13px] font-bold" style={{ color: t.color }}>{t.label}</span>
                <div className="text-[11px] leading-snug text-text-muted">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Slide 2: Context Clue Types ── */
export function ClueTypesVisual() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const clues = [
    { type: "Definition / Restatement", signal: "\"or,\" \"that is,\" dashes, commas", example: "The methodology was innovative — that is, it introduced techniques never before used.", color: "#22c55e" },
    { type: "Contrast / Antonym", signal: "\"but,\" \"however,\" \"unlike,\" \"rather than\"", example: "Unlike her reserved sister, Maya was outgoing and eager to meet people.", color: "#ef4444" },
    { type: "Example", signal: "\"such as,\" \"for instance,\" \"including\"", example: "The garden featured indigenous plants, including wild bergamot and coneflower.", color: "#60a5fa" },
    { type: "Cause / Effect", signal: "\"because,\" \"since,\" \"therefore\"", example: "Because the evidence was compelling, even skeptical members approved.", color: "#fbbf24" },
    { type: "Inference", signal: "No direct signal — infer from overall tone", example: "The once-thriving downtown had become desolate, with boarded-up storefronts.", color: "#a78bfa" },
  ];

  return (
    <div className="space-y-2 px-1">
      {clues.map((c, i) => (
        <button
          key={i}
          onClick={() => setActiveIdx(activeIdx === i ? null : i)}
          className="w-full cursor-pointer rounded-xl border bg-bg-base px-4 py-3 text-left transition-all"
          style={{
            borderColor: activeIdx === i ? `${c.color}55` : "var(--color-border-default)",
            boxShadow: activeIdx === i ? `0 0 16px ${c.color}15` : "none",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold" style={{ color: c.color }}>{c.type}</span>
            <span className="text-[11px] text-text-muted">{activeIdx === i ? "tap to close" : "tap to expand"}</span>
          </div>
          {activeIdx === i && (
            <div className="mt-2 space-y-1.5">
              <div className="text-[12px] text-text-muted">
                <strong>Signals:</strong> {c.signal}
              </div>
              <div className="rounded-lg border-l-[3px] px-3 py-2 text-[12px] italic text-[#bcbcc8]" style={{ borderColor: c.color, background: `${c.color}08` }}>
                {c.example}
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide 3: Vocabulary Clusters ── */
export function VocabClustersVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const clusters = [
    { name: "Support / Strengthen", words: "bolster, corroborate, substantiate, reinforce, validate, buttress", color: "#22c55e" },
    { name: "Weaken / Challenge", words: "undermine, refute, contradict, discredit, subvert, erode", color: "#ef4444" },
    { name: "Careful / Cautious", words: "prudent, circumspect, judicious, measured, deliberate, tentative", color: "#60a5fa" },
    { name: "Enthusiastic / Positive", words: "fervent, ardent, zealous, exuberant, unreserved, wholehearted", color: "#fbbf24" },
    { name: "Complex / Nuanced", words: "multifaceted, intricate, nuanced, elaborate, sophisticated", color: "#a78bfa" },
    { name: "Clear / Direct", words: "explicit, unambiguous, forthright, candid, transparent, overt", color: ACCENT },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {clusters.map((c, i) => (
          <button
            key={i}
            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: flipped[i] ? `${c.color}44` : "var(--color-border-default)",
              boxShadow: flipped[i] ? `0 0 20px ${c.color}11` : "none",
            }}
          >
            {!flipped[i] ? (
              <>
                <div className="mb-1 text-[13px] font-bold" style={{ color: c.color }}>{c.name}</div>
                <div className="text-[11px] text-text-muted">Tap to see words in this cluster</div>
              </>
            ) : (
              <>
                <div className="mb-1 text-[11px] font-bold uppercase tracking-[1px]" style={{ color: c.color }}>{c.name}</div>
                <div className="text-[12px] leading-[1.7] text-[#bcbcc8]">{c.words}</div>
                <div className="mt-1.5 text-right text-[10px] font-medium opacity-60" style={{ color: c.color }}>tap to flip back</div>
              </>
            )}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Pro tip: </strong>
        Learning words in clusters is faster than memorizing random lists. When you know that &quot;bolster&quot; and &quot;corroborate&quot; both mean <em>support</em>, you can match them instantly on test day.
      </div>
    </div>
  );
}

/* ── Slide 4: Morphology Table ── */
export function MorphTableVisual() {
  const prefixes = [
    { part: "un-, in-, im-, dis-", meaning: "not, opposite", example: "unprecedented, ineffective" },
    { part: "re-", meaning: "again, back", example: "reconsider, revitalize" },
    { part: "pre-", meaning: "before", example: "predominant, preclude" },
    { part: "mis-", meaning: "wrongly", example: "misconception, misconstrue" },
    { part: "over- / under-", meaning: "excessive / too little", example: "overstate, undermine" },
  ];

  const roots = [
    { part: "cred", meaning: "believe", example: "credible, incredible, discredit" },
    { part: "dict", meaning: "say, speak", example: "contradict, predict" },
    { part: "spec / spect", meaning: "look, see", example: "perspective, retrospect" },
    { part: "vert / vers", meaning: "turn", example: "controversial, divert" },
    { part: "voc / vok", meaning: "call, voice", example: "advocate, provoke" },
    { part: "bene / mal", meaning: "good / bad", example: "benevolent, malicious" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: "#a78bfa" }}>Key Prefixes</div>
        <div className="overflow-hidden rounded-xl border border-border-default">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-border-default bg-bg-surface px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Prefix</th>
                <th className="border-b border-border-default bg-bg-surface px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Meaning</th>
                <th className="border-b border-border-default bg-bg-surface px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Examples</th>
              </tr>
            </thead>
            <tbody>
              {prefixes.map((p, i) => (
                <tr key={i}>
                  <td className="border-b border-border-default px-4 py-2.5 font-mono text-[13px] font-semibold text-text-secondary last:border-b-0">{p.part}</td>
                  <td className="border-b border-border-default px-4 py-2.5 text-[#bcbcc8] last:border-b-0">{p.meaning}</td>
                  <td className="border-b border-border-default px-4 py-2.5 last:border-b-0">
                    <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{p.example}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>Key Roots</div>
        <div className="overflow-hidden rounded-xl border border-border-default">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-border-default bg-bg-surface px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Root</th>
                <th className="border-b border-border-default bg-bg-surface px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Meaning</th>
                <th className="border-b border-border-default bg-bg-surface px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Examples</th>
              </tr>
            </thead>
            <tbody>
              {roots.map((r, i) => (
                <tr key={i}>
                  <td className="border-b border-border-default px-4 py-2.5 font-mono text-[13px] font-semibold text-text-secondary last:border-b-0">{r.part}</td>
                  <td className="border-b border-border-default px-4 py-2.5 text-[#bcbcc8] last:border-b-0">{r.meaning}</td>
                  <td className="border-b border-border-default px-4 py-2.5 last:border-b-0">
                    <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{r.example}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Combine strategies: </strong>
        Use context clues AND word parts together. If the context suggests something negative and the word starts with &quot;mis-&quot; or &quot;dis-,&quot; you can be doubly confident.
      </div>
    </div>
  );
}
