"use client";

import { useState } from "react";

const ACCENT = "#06b6d4";

/* ── Slide 1: Cross Out the Noise ── */
export function CrossOutVisual() {
  const [showCrossed, setShowCrossed] = useState(false);

  const patterns = [
    { name: "Intervening Phrase", example: "The collection of rare stamps ___ valuable.", subject: "collection", verb: "is", note: "\"Of rare stamps\" is a prepositional phrase — cross it out.", color: "#ef4444" },
    { name: "Inverted Order", example: "Among the ruins were several ancient artifacts.", subject: "artifacts", verb: "were", note: "Subject comes AFTER the verb in inverted sentences.", color: "#60a5fa" },
    { name: "Neither...nor", example: "Neither the teacher nor the students ___ prepared.", subject: "students (closer)", verb: "were", note: "Verb matches the CLOSER subject.", color: "#fbbf24" },
    { name: "Compound with \"and\"", example: "The coach and the captain ___ meeting.", subject: "coach + captain", verb: "are", note: "Two subjects joined by \"and\" = plural.", color: "#22c55e" },
    { name: "Each / Every / One of", example: "Each of the experiments ___ repeated.", subject: "each", verb: "was", note: "\"Each\" is ALWAYS singular.", color: "#a78bfa" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Strategy: Cross Out the Noise</div>
          <button
            onClick={() => setShowCrossed(!showCrossed)}
            className="cursor-pointer rounded-lg border border-border-default bg-bg-surface px-3 py-1.5 text-[12px] font-medium transition-all"
            style={{ color: ACCENT }}
          >
            {showCrossed ? "Show full sentences" : "Cross out noise"}
          </button>
        </div>
        <div className="space-y-3">
          {patterns.map((p, i) => (
            <div key={i} className="rounded-lg border-l-[3px] px-3.5 py-2.5" style={{ borderColor: p.color, background: `${p.color}06` }}>
              <div className="mb-1 text-[12px] font-bold" style={{ color: p.color }}>{p.name}</div>
              <div className="font-mono text-[13px] text-[#bcbcc8]">
                {showCrossed ? (
                  <span>{p.example.replace("___", "")} <strong style={{ color: p.color }}>{p.subject} \u2192 {p.verb}</strong></span>
                ) : (
                  p.example
                )}
              </div>
              {showCrossed && <div className="mt-1 text-[11px] text-text-muted">{p.note}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <div className="bg-bg-surface px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Indefinite Pronoun Cheat Sheet</div>
        <div className="grid grid-cols-3 gap-px bg-border-default">
          <div className="bg-bg-base px-3 py-2.5">
            <div className="mb-1 text-[11px] font-bold text-[#22c55e]">Always Singular</div>
            <div className="text-[11px] leading-relaxed text-text-muted">each, every, everyone, everybody, anyone, anybody, no one, nobody, either, neither</div>
          </div>
          <div className="bg-bg-base px-3 py-2.5">
            <div className="mb-1 text-[11px] font-bold text-[#60a5fa]">Always Plural</div>
            <div className="text-[11px] leading-relaxed text-text-muted">both, few, many, several</div>
          </div>
          <div className="bg-bg-base px-3 py-2.5">
            <div className="mb-1 text-[11px] font-bold text-[#fbbf24]">Variable</div>
            <div className="text-[11px] leading-relaxed text-text-muted">some, any, all, none, most (depends on &quot;of&quot; phrase)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Slide 2: Pronoun Agreement Cards ── */
export function PronounCardsVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const cards = [
    { front: "Number Agreement", rule: "Singular antecedent \u2192 singular pronoun", example: "\u2713 The student submitted her project.\n\u2717 The student submitted their project.", color: "#22c55e" },
    { front: "Compound Antecedent", rule: "\"And\" \u2192 plural pronoun", example: "\u2713 Maya and James presented their research.\n\u2717 Maya and James presented his research.", color: "#60a5fa" },
    { front: "Ambiguous Reference", rule: "Pronoun must refer to ONE clear noun", example: "\u2717 Dr. Lee told Dr. Patel that she should revise.\n\u2713 Dr. Lee told Dr. Patel that Dr. Patel should revise.", color: "#ef4444" },
    { front: "Person Consistency", rule: "Don't shift between you / one / they", example: "\u2717 If a person studies hard, you will succeed.\n\u2713 If a person studies hard, he or she will succeed.", color: "#fbbf24" },
    { front: "Possessive Trap", rule: "Possessive nouns can't be antecedents", example: "\u2717 The scientist's research...; she published it.\n\u2713 The scientist conducted research; she published it.", color: "#a78bfa" },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
      {cards.map((c, i) => (
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
            <div className="text-center">
              <div className="mb-2 text-[14px] font-bold" style={{ color: c.color }}>{c.front}</div>
              <div className="text-[12px] text-text-muted">{c.rule}</div>
              <div className="mt-2.5 text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: c.color }}>tap for example</div>
            </div>
          ) : (
            <div>
              <div className="mb-1.5 text-[11px] font-bold" style={{ color: c.color }}>{c.front}</div>
              <div className="whitespace-pre-line font-mono text-[11px] leading-[1.7] text-[#bcbcc8]">{c.example}</div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide 3: Tense Timeline ── */
export function TenseTimelineVisual() {
  const tenses = [
    { name: "Past Perfect", form: "had + past participle", use: "Action completed BEFORE another past event", example: "By the time they arrived, the flood had destroyed the bridge.", color: "#a78bfa", position: "15%" },
    { name: "Simple Past", form: "verb + -ed", use: "Completed action in the past", example: "The team analyzed the data.", color: "#60a5fa", position: "40%" },
    { name: "Present", form: "base form / -s", use: "Ongoing truth or general fact", example: "Galileo demonstrated that the Earth revolves around the Sun.", color: "#22c55e", position: "65%" },
    { name: "Present Perfect", form: "has/have + past participle", use: "Past action with present relevance", example: "Researchers have found that exercise improves memory.", color: ACCENT, position: "85%" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Verb Tense Timeline</div>
        {/* Timeline bar */}
        <div className="relative mb-6 h-2 rounded-full" style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa, #22c55e, #06b6d4)" }}>
          {tenses.map((t, i) => (
            <div key={i} className="absolute -top-0.5 h-3 w-0.5 rounded-sm bg-white/70" style={{ left: t.position }} />
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-[1px] text-text-muted">
          <span>Earlier Past</span>
          <span>Past</span>
          <span>Present</span>
          <span>Ongoing</span>
        </div>
      </div>

      <div className="space-y-2">
        {tenses.map((t, i) => (
          <div key={i} className="rounded-lg border-l-[3px] bg-bg-base px-4 py-2.5" style={{ borderColor: t.color }}>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold" style={{ color: t.color }}>{t.name}</span>
              <code className="rounded-md bg-[rgba(6,182,212,.1)] px-2 py-0.5 font-mono text-[11px]" style={{ color: ACCENT }}>{t.form}</code>
            </div>
            <div className="mt-0.5 text-[11px] text-text-muted">{t.use}</div>
            <div className="mt-1 text-[11px] italic text-[#bcbcc8]">{t.example}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Key exception: </strong>
        Use present tense for permanent facts, even within past-tense passages: &quot;Einstein demonstrated that light <em>travels</em> at a constant speed.&quot;
      </div>
    </div>
  );
}

/* ── Slide 4: Dangling Modifier Fix ── */
export function DanglingFixVisual() {
  const examples = [
    {
      wrong: "Running through the park, the sunset was beautiful.",
      why: "The sunset isn't running!",
      right: "Running through the park, she noticed the beautiful sunset.",
      color: "#ef4444",
    },
    {
      wrong: "Soaring above the canyon, the tourists watched the eagle.",
      why: "The tourists aren't soaring!",
      right: "Soaring above the canyon, the eagle was watched by the tourists.",
      color: "#fbbf24",
    },
    {
      wrong: "Known for her innovative techniques, the gallery displayed the artist's paintings.",
      why: "The gallery isn't known for techniques!",
      right: "Known for her innovative techniques, the artist had her paintings displayed in the gallery.",
      color: "#a78bfa",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-default bg-bg-base p-5">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">The Modifier Rule</div>
        <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-4 py-3 text-center text-sm">
          <code className="font-mono" style={{ color: ACCENT }}>[Modifier], [SUBJECT it describes] + verb...</code>
        </div>
        <div className="mt-2 text-center text-[12px] text-text-muted">
          The introductory phrase MUST be followed by the noun it modifies.
        </div>
      </div>

      <div className="space-y-2.5">
        {examples.map((e, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border-default">
            <div className="flex items-center gap-2 border-b border-border-default bg-[rgba(239,68,68,.05)] px-4 py-2">
              <span className="text-[#ef4444]">\u2717</span>
              <span className="font-mono text-[12px] text-[#bcbcc8]">{e.wrong}</span>
              <span className="ml-auto text-[11px] italic text-[#ef4444]">{e.why}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-[#22c55e]">\u2713</span>
              <span className="font-mono text-[12px] text-[#bcbcc8]">{e.right}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: "#22c55e" }}>Parallel Structure: </strong>
        Items in a list must share the same form. All gerunds: &quot;writing, analyzing, <em>and</em> reporting.&quot; All infinitives: &quot;to write, to analyze, <em>and</em> to report.&quot;
      </div>
    </div>
  );
}
