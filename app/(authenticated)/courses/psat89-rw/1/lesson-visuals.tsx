"use client";

import { useState } from "react";

const ACCENT = "#06b6d4";
const RW = "#a78bfa";

/* ── Slide 1: Test Structure ── */
export function TestStructureVisual() {
  const rows = [
    ["Total Questions", <>54 (27 per module)</>],
    ["Total Time", <>64 minutes (32 per module)</>],
    ["Time per Question", <>~71 seconds average</>],
    ["Adaptive Format", "Module 2 difficulty adjusts based on Module 1 performance"],
    ["Question Types", "100% multiple choice (4 options), each with its own short passage"],
    ["Passages", <><strong>25–150 words</strong> each · Literature, History, Humanities, Science</>],
    ["Scoring", <>120–720 R&W section score (no penalty for wrong answers)</>],
    ["Digital Tools", "Highlighting, annotation, answer eliminator, Mark for Review"],
  ] as const;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Feature</th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, value], i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">{label}</td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-[rgba(167,139,250,.2)] bg-[rgba(167,139,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: RW }}>One passage, one question. </strong>
        Every question comes with its own short passage of 25–150 words. You&apos;ll never face a long 5-page reading passage. This means you need to read fast, extract meaning quickly, and move on. It&apos;s a sprint, not a marathon.
      </div>
      <div className="rounded-xl border border-[rgba(6,182,212,.2)] bg-[rgba(6,182,212,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>No wrong-answer penalty </strong>
        means you should <strong>answer every single question</strong> — even if you have to guess. A random guess gives you a 25% chance. Never leave anything blank.
      </div>
    </div>
  );
}

/* ── Slide 2: Anatomy Interactive ── */
const ANAT_TABS = [
  {
    tab: "Vocabulary", domain: "Craft & Structure",
    passage: "The researcher's findings were met with considerable ________ from the scientific community, as her methodology challenged long-held assumptions about climate patterns in the Southern Hemisphere.",
    highlights: [
      { text: "________", note: "This is the target word. Your job is to figure out what fits here based on context clues — the rest of the passage tells you the answer." },
      { text: "challenged long-held assumptions", note: "This is your key context clue! 'Challenged long-held assumptions' suggests controversy or doubt — not praise. Use this to predict a word meaning 'doubt' or 'suspicion' before looking at the choices." },
    ],
    stem: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: ["skepticism", "funding", "celebration", "confusion"], correct: 0,
    explain: "The passage says the methodology \"challenged long-held assumptions\" — this signals doubt or questioning. \"Skepticism\" fits perfectly.",
  },
  {
    tab: "Evidence", domain: "Information & Ideas",
    passage: "A 2023 study of urban tree canopy coverage found that neighborhoods with at least 30% tree coverage experienced average summer temperatures 4.2\u00b0F lower than neighborhoods with less than 10% coverage. The researchers noted that tree-lined streets also showed 23% higher pedestrian traffic during peak heat hours.",
    highlights: [
      { text: "neighborhoods with at least 30% tree coverage experienced average summer temperatures 4.2\u00b0F lower", note: "Key data: neighborhoods with MORE trees had LOWER temperatures." },
      { text: "tree-lined streets also showed 23% higher pedestrian traffic", note: "This additional detail strengthens the finding but the question asks specifically about temperature." },
    ],
    stem: "Which finding, if true, would most directly support the researchers' conclusion about tree coverage and temperature?",
    choices: ["Cities with more parks have higher property values.", "Satellite thermal imaging confirmed lower surface temperatures in high-canopy zones.", "Residents in tree-covered areas reported greater life satisfaction.", "Tree planting programs have expanded in 45 U.S. cities since 2020."], correct: 1,
    explain: "Choice B directly supports the temperature claim with independent thermal data. A, C, and D don't address temperature.",
  },
  {
    tab: "Grammar", domain: "Std. English Conventions",
    passage: "The museum's newest exhibit, which features interactive displays from twelve countries and spans three entire floors of the building, ________ more than 10,000 visitors since its opening last month.",
    highlights: [
      { text: "exhibit", note: "This is the TRUE subject — singular. Everything between the commas is extra info that doesn't change the subject." },
      { text: "which features interactive displays from twelve countries and spans three entire floors of the building", note: "This entire clause is non-essential — a trap! Cross it out mentally and you get: 'The exhibit ________ more than 10,000 visitors.'" },
    ],
    stem: "Which choice conforms to the conventions of Standard English?",
    choices: ["have attracted", "has attracted", "are attracting", "attract"], correct: 1,
    explain: "Subject is 'exhibit' (singular). Ignore the clause between commas — 'exhibit...has attracted.'",
  },
  {
    tab: "Transitions", domain: "Expression of Ideas",
    passage: "Arctic fox populations have declined by nearly 90% in Scandinavia over the past century due to overhunting and habitat loss. ________ recent conservation programs, including captive breeding and habitat restoration, have helped populations in Norway and Sweden begin to recover.",
    highlights: [
      { text: "declined by nearly 90%", note: "Negative trend — populations went down dramatically." },
      { text: "have helped populations...begin to recover", note: "Positive development — things are getting better. This CONTRASTS with the decline." },
    ],
    stem: "Which choice completes the text with the most logical transition?",
    choices: ["Furthermore,", "Similarly,", "However,", "Specifically,"], correct: 2,
    explain: "The passage shifts from negative (decline) to positive (recovery). 'However' signals this contrast.",
  },
];

export function AnatomyVisual() {
  const [tabIdx, setTabIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [annotation, setAnnotation] = useState<string | null>(null);
  const q = ANAT_TABS[tabIdx];
  const answered = answers[tabIdx] !== undefined;
  const isCorrect = answered && answers[tabIdx] === q.correct;

  function renderPassage() {
    let remaining = q.passage;
    const parts: { type: "text" | "highlight"; content: string; note?: string }[] = [];
    for (const h of q.highlights) {
      const pos = remaining.indexOf(h.text);
      if (pos >= 0) {
        if (pos > 0) parts.push({ type: "text", content: remaining.substring(0, pos) });
        parts.push({ type: "highlight", content: h.text, note: h.note });
        remaining = remaining.substring(pos + h.text.length);
      }
    }
    if (remaining) parts.push({ type: "text", content: remaining });

    return parts.map((p, i) =>
      p.type === "text" ? (
        <span key={i}>{p.content}</span>
      ) : (
        <span
          key={i}
          onClick={() => setAnnotation(p.note ?? null)}
          className="cursor-pointer rounded-sm border-b-2 transition-all hover:bg-[rgba(167,139,250,.22)]"
          style={{ background: "rgba(167,139,250,.12)", borderColor: RW, padding: "1px 3px" }}
        >
          {p.content}
        </span>
      )
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-default bg-[rgba(15,15,22,.75)] shadow-lg backdrop-blur-xl">
      {/* Tabs */}
      <div className="flex border-b border-border-default px-2">
        {ANAT_TABS.map((aq, i) => (
          <button
            key={i}
            onClick={() => { setTabIdx(i); setAnnotation(null); }}
            className="-mb-px cursor-pointer border-b-2 px-5 py-3 text-[13px] font-medium transition-all"
            style={{
              color: i === tabIdx ? RW : "var(--color-text-muted)",
              borderColor: i === tabIdx ? RW : "transparent",
              fontWeight: i === tabIdx ? 700 : 500,
            }}
          >
            {aq.tab}
          </button>
        ))}
      </div>

      {/* Content: passage + question */}
      <div className="grid min-h-[220px] grid-cols-2">
        <div className="border-r border-border-default p-6">
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-[2px] opacity-80" style={{ color: RW }}>Passage</span>
          <div className="text-sm leading-[1.85] text-[#bcbcc8]">{renderPassage()}</div>
        </div>
        <div className="p-6">
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-[2px] opacity-80" style={{ color: ACCENT }}>Question</span>
          <div className="mb-4 text-sm font-semibold leading-[1.65] text-[#d4d4de]">{q.stem}</div>
          <div className="flex flex-col gap-2">
            {q.choices.map((c, ci) => {
              const letter = String.fromCharCode(65 + ci);
              const isSelected = answers[tabIdx] === ci;
              let borderColor = "var(--color-border-default)";
              let bg = "var(--color-bg-base)";
              let opacity = 1;
              if (answered) {
                opacity = 0.5;
                if (ci === q.correct) { borderColor = "#22c55e"; bg = "rgba(34,197,94,.07)"; opacity = 1; }
                else if (isSelected) { borderColor = "#ef4444"; bg = "rgba(239,68,68,.07)"; opacity = 0.8; }
              }
              return (
                <button
                  key={ci}
                  onClick={() => { if (!answered) setAnswers(prev => ({ ...prev, [tabIdx]: ci })); }}
                  className="flex w-full items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-all"
                  style={{ borderColor, background: bg, opacity, cursor: answered ? "default" : "pointer" }}
                >
                  <span className="font-mono text-[13px] font-bold" style={{ color: answered && ci === q.correct ? "#22c55e" : answered && isSelected ? "#ef4444" : "var(--color-text-muted)", minWidth: 20 }}>{letter})</span>
                  <span>{c}</span>
                </button>
              );
            })}
          </div>
          {answered && (
            <div className="mt-3 rounded-lg border-l-[3px] border-l-[#22c55e] bg-[var(--color-bg-base)] p-3.5 text-[13px] leading-[1.7] text-text-secondary">
              {isCorrect ? "Correct! " : "Incorrect. "}{q.explain}
            </div>
          )}
        </div>
      </div>

      {/* Annotation bar */}
      <div className="min-h-[44px] border-t border-border-default bg-[rgba(0,0,0,.15)] px-6 py-3.5 text-[13px] leading-[1.65] text-text-muted">
        {annotation ? (
          <span><span className="font-semibold" style={{ color: RW }}>Annotation: </span>{annotation}</span>
        ) : answered ? (
          <span><span style={{ color: RW }}>&#10003; {q.domain}</span> — {tabIdx < ANAT_TABS.length - 1 ? "Try the next tab →" : "You've completed the walkthrough!"}</span>
        ) : (
          "Click a highlighted phrase in the passage to see why it matters, then answer the question."
        )}
      </div>
    </div>
  );
}

/* ── Slide 3: Adaptive Module System ── */
export function AdaptiveVisual() {
  const [simVal, setSimVal] = useState(14);

  function getSimData(v: number) {
    const pct = v / 27;
    if (pct >= 0.63) return { route: "Harder Module 2", color: "#22c55e", floor: 350, ceil: 720, bg: "rgba(34,197,94,.07)" };
    if (pct >= 0.48) return { route: "Borderline — Could go either way", color: "#fbbf24", floor: 300, ceil: 580, bg: "rgba(251,191,36,.1)" };
    return { route: "Easier Module 2", color: "#ef4444", floor: 120, ceil: Math.min(480 + v * 6, 560), bg: "rgba(239,68,68,.07)" };
  }

  const sim = getSimData(simVal);
  const meterPct = ((sim.ceil - 120) / 600) * 100;

  return (
    <div className="space-y-5">
      {/* Flow diagram */}
      <div className="flex flex-col items-center gap-2.5">
        <div className="min-w-[220px] rounded-xl border border-[rgba(6,182,212,.25)] bg-[rgba(6,182,212,.07)] px-6 py-3.5 text-center text-sm font-semibold shadow-[0_0_24px_rgba(6,182,212,.15)]">
          Module 1: Mixed Difficulty<br />
          <span className="text-xs font-normal text-text-muted">27 questions · 32 minutes · Easy → Hard within each skill group</span>
        </div>
        <div className="text-text-muted">↓ Your performance determines…</div>
        <div className="flex w-full gap-4">
          <div className="flex-1 rounded-xl border border-[rgba(34,197,94,.25)] bg-[rgba(34,197,94,.07)] px-5 py-3.5 text-center text-sm font-semibold shadow-[0_0_20px_rgba(34,197,94,.08)]">
            Module 2: <strong>Harder</strong><br />
            <span className="text-xs font-normal text-text-muted">Unlocks scores up to 720</span>
          </div>
          <div className="flex-1 rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-3.5 text-center text-sm font-semibold">
            Module 2: <strong>Easier</strong><br />
            <span className="text-xs font-normal text-text-muted">Score ceiling ~480–560</span>
          </div>
        </div>
      </div>

      {/* Simulator */}
      <div className="rounded-2xl border border-[rgba(6,182,212,.2)] bg-bg-base p-6 shadow-[0_0_32px_rgba(6,182,212,.15)]">
        <div className="mb-3.5 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Module 1 Routing Simulator</div>
        <div className="mb-4 flex items-center gap-4">
          <span className="font-mono text-xs text-text-muted">0</span>
          <input
            type="range" min={0} max={27} value={simVal}
            onChange={e => setSimVal(parseInt(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
            style={{ background: `linear-gradient(90deg, #ef4444 0%, #fbbf24 50%, #22c55e 100%)` }}
          />
          <span className="font-mono text-xs text-text-muted">27</span>
          <div className="min-w-[56px] text-center font-mono text-2xl font-bold text-text-primary">{simVal}</div>
        </div>
        <div className="rounded-xl p-4 text-center transition-all duration-300" style={{ background: sim.bg }}>
          <div className="mb-1.5 text-base font-bold" style={{ color: sim.color }}>
            {simVal}/27 correct → {sim.route}
          </div>
          <div className="text-sm text-text-secondary">Estimated score range: {sim.floor}–{sim.ceil}</div>
        </div>
        <div className="mt-3.5">
          <div className="mb-1.5 flex justify-between text-[11px] font-medium text-text-muted">
            <span>Score Floor</span>
            <span className="font-mono">{sim.floor}–{sim.ceil}</span>
            <span>Score Ceiling</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-border-default">
            <div
              className="h-full rounded-full transition-all duration-400"
              style={{ width: `${meterPct}%`, background: `linear-gradient(90deg, ${sim.color}, ${sim.color}cc)`, boxShadow: `0 0 12px ${sim.color}44` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#ef4444]">Module 1 is make-or-break. </strong>
        Missing just 2–3 extra questions can drop you from the harder Module 2 to the easier one — and cap your maximum score by 150+ points. Accuracy in Module 1 matters more than speed.
      </div>
    </div>
  );
}

/* ── Slide 4: Four Domains ── */
const DOMAINS = [
  { name: "Craft & Structure", pct: "~28%", qs: "13–15 questions", color: "#f472b6", front: "Words in context, text structure & purpose, cross-text connections", back: "Sub-skills: Words in Context (~10–11 Qs — the biggest single type!) · Text Structure & Purpose (~2 Qs) · Cross-Text Connections (~1–2 Qs). Tests vocabulary, author's purpose, and comparing paired passages." },
  { name: "Information & Ideas", pct: "~26%", qs: "12–14 questions", color: "#60a5fa", front: "Central ideas, textual evidence, quantitative evidence, inferences", back: "Sub-skills: Central Ideas & Details (~4–5 Qs) · Command of Evidence — Textual (~4 Qs) · Command of Evidence — Quantitative (~3–4 Qs, with graphs/tables) · Inferences (~3–4 Qs)" },
  { name: "Std. English Conventions", pct: "~26%", qs: "11–15 questions", color: "#34d399", front: "Sentence boundaries, punctuation, agreement, verb form, modifiers", back: "Sub-skills: Boundaries (~5–6 Qs — run-ons, comma splices, fragments, semicolons, colons) · Form, Structure & Sense (~7–8 Qs — subject-verb agreement, pronoun agreement, verb tense, parallel structure, modifiers)" },
  { name: "Expression of Ideas", pct: "~20%", qs: "8–12 questions", color: "#fbbf24", front: "Transitions, rhetorical synthesis", back: "Sub-skills: Transitions (~5–6 Qs — selecting logical connecting words) · Rhetorical Synthesis (~5–6 Qs — unique format: bulleted notes → construct an effective sentence). The only questions without traditional prose passages." },
];

export function DomainsVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        {DOMAINS.map((d, i) => (
          <button
            key={i}
            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            className="cursor-pointer rounded-xl border bg-bg-base p-[18px] text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: flipped[i] ? `${d.color}33` : "var(--color-border-default)", boxShadow: flipped[i] ? `0 0 20px ${d.color}11` : "none" }}
          >
            {!flipped[i] ? (
              <>
                <div className="mb-2.5 flex items-center gap-2.5">
                  <span className="font-mono text-xl font-bold" style={{ color: d.color }}>{d.pct}</span>
                  <span className="text-[15px] font-bold text-text-primary">{d.name}</span>
                </div>
                <div className="text-[13px] font-medium text-text-muted">{d.qs}</div>
                <div className="mt-1.5 text-[13px] leading-[1.6] text-text-muted">{d.front}</div>
                <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: d.color }}>tap to see sub-skills →</div>
              </>
            ) : (
              <>
                <div className="text-sm leading-[1.7] text-[#bcbcc8]">{d.back}</div>
                <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: d.color }}>← tap to flip back</div>
              </>
            )}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-[rgba(167,139,250,.2)] bg-[rgba(167,139,250,.07)] px-5 py-4 text-sm leading-[1.7]">
        <strong style={{ color: RW }}>Key Insight: </strong>
        Craft & Structure and Standard English Conventions together make up roughly <strong>54%</strong> of the test. Vocabulary-in-context alone is ~20% — the single most common question type. If you&apos;re short on study time, these areas give you the biggest return.
      </div>
    </div>
  );
}

/* ── Slide 5: Strategy Toolkit ── */
const STRATS = [
  { icon: "\uD83D\uDD2E", title: "Predict Before You Peek", hint: "Cover choices. Generate your own answer first.", back: "For vocabulary questions, read the passage, cover the answer choices, and predict what word fits. Then look for a match. This prevents trap answers from hijacking your thinking." },
  { icon: "\uD83C\uDFAF", title: "Read the Question First", hint: "Know what you're looking for before you read.", back: "Since each passage has only ONE question, reading the question stem first tells you exactly what to look for. This makes your reading faster and more focused." },
  { icon: "\uD83D\uDCCC", title: "Evidence Hunting", hint: "Point to the proof before you pick.", back: "Every correct answer is supported by specific words in the passage. Before selecting, mentally (or physically) point to the exact words that prove your answer. If you can't point to evidence, you're guessing." },
  { icon: "\u274C", title: "Process of Elimination", hint: "Use Bluebook's built-in answer eliminator.", back: "Cross out wrong answers using the digital tool. Extreme words (\"always,\" \"never,\" \"completely\") are almost always wrong. Eliminating even one choice improves your odds from 25% to 33%." },
  { icon: "\u23F1\uFE0F", title: "Two-Pass System", hint: "Confident answers first. Flagged questions second.", back: "First pass: answer all confident questions, flag uncertain ones with Mark for Review. Second pass: return to flagged items. Never spend more than 90 seconds on any single question in the first pass." },
  { icon: "\uD83D\uDD17", title: "Transition Signals", hint: "Learn the function categories of connecting words.", back: "Transitions fall into categories: addition (moreover), contrast (however), cause/effect (therefore), sequence (subsequently), example (for instance). Knowing these categories makes transition questions nearly automatic." },
];

export function StrategyVisual() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
      {STRATS.map((s, i) => (
        <button
          key={i}
          onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
          className="cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-250 hover:-translate-y-0.5"
          style={{ borderColor: flipped[i] ? `${ACCENT}33` : "var(--color-border-default)", boxShadow: flipped[i] ? `0 0 20px rgba(6,182,212,.15)` : "none" }}
        >
          {!flipped[i] ? (
            <div className="text-center">
              <div className="mb-2 text-[2.2rem] drop-shadow-lg">{s.icon}</div>
              <div className="mb-1.5 text-sm font-bold tracking-[0.01em] text-text-primary">{s.title}</div>
              <div className="text-xs leading-[1.5] text-text-muted">{s.hint}</div>
              <div className="mt-2.5 text-[10px] font-semibold uppercase tracking-[1.5px] opacity-70" style={{ color: ACCENT }}>tap to flip</div>
            </div>
          ) : (
            <div className="text-sm leading-[1.7] text-[#bcbcc8]">{s.back}</div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Slide 6: Growth Trajectory ── */
export function GrowthVisual() {
  const tests = [
    { name: "PSAT 8/9", range: "120–720", diff: "Grade-level vocabulary, accessible passages", color: ACCENT, flex: 1 },
    { name: "PSAT 10", range: "160–760", diff: "More complex inference, harder vocabulary", color: "#6366f1", flex: 1 },
    { name: "PSAT/NMSQT", range: "160–760", diff: "Same as PSAT 10 + National Merit eligibility", color: "#8b5cf6", flex: 1 },
    { name: "SAT", range: "200–800", diff: "College-level texts, sophisticated analysis", color: RW, flex: 1.3 },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[rgba(6,214,160,.2)] bg-bg-base p-6 shadow-[0_0_24px_rgba(6,214,160,.06)]">
        {/* Progress bar */}
        <div className="my-3.5 flex h-11 items-center overflow-hidden rounded-lg shadow-md">
          {tests.map((t, i) => (
            <div key={i} className="flex h-full items-center justify-center text-[11px] font-bold tracking-[0.5px] text-white" style={{ flex: t.flex, background: t.color }}>{t.name}</div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] font-medium text-text-muted">
          <span>8th–9th Grade</span><span>10th Grade</span><span>11th Grade</span><span>11th–12th Grade</span>
        </div>
        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-border-default">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Test</th>
                <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">R&W Score Range</th>
                <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Key Difference</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t, i) => (
                <tr key={i}>
                  <td className="border-b border-border-default px-4 py-3 font-bold last:border-b-0" style={{ color: t.color }}>{t.name}</td>
                  <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">
                    <code className="rounded-md bg-[rgba(167,139,250,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: RW }}>{t.range}</code>
                  </td>
                  <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{t.diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center text-sm text-[#bcbcc8]">
          <strong className="text-[#06d6a0]">College Readiness Benchmark (R&W): 480</strong><br />
          <span className="text-[13px] text-text-muted">For 8th graders, the on-track benchmark is 390. For 9th graders, it&apos;s 410. These are your first targets.</span>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(6,214,160,.2)] bg-[rgba(6,214,160,.06)] px-5 py-4 text-sm leading-[1.7]">
        <strong className="text-[#06d6a0]">Why this matters: </strong>
        Every skill you build now transfers directly to harder tests ahead. The vocabulary, grammar rules, and reading strategies you master for the PSAT 8/9 are the same skills tested on the SAT — just at an easier starting level.
      </div>
    </div>
  );
}

/* ── Slide 7: Score Projector ── */
export function ScoreProjectorVisual() {
  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");

  const m1v = parseInt(m1), m2v = parseInt(m2);
  let result: { total: number; capped: number; lvl: string; color: string; advice: string; bench9Pct: number; scorePct: number } | null = null;

  if (!isNaN(m1v) && !isNaN(m2v) && m1v >= 0 && m1v <= 27 && m2v >= 0 && m2v <= 27) {
    const total = m1v + m2v;
    const scaled = Math.round(120 + (total / 54) * 600);
    const capped = Math.min(Math.max(scaled, 120), 720);
    let lvl: string, color: string, advice: string;
    if (capped >= 550) { lvl = "Strong"; color = "#22c55e"; advice = "Focus on strategy refinement and the trickiest question types (cross-text, rhetorical synthesis) to push higher."; }
    else if (capped >= 410) { lvl = "On Track"; color = ACCENT; advice = "You're at or above the 9th-grade benchmark! Focus on your weakest domain to keep growing."; }
    else if (capped >= 350) { lvl = "Building"; color = "#fbbf24"; advice = "Complete all modules with extra attention on Vocabulary (Module 2) and Conventions (Modules 6–7)."; }
    else { lvl = "Developing"; color = "#ef4444"; advice = "Start with vocabulary building and basic grammar rules. Modules 2, 6, and 7 are your priority."; }
    result = { total, capped, lvl, color, advice, bench9Pct: ((410 - 120) / 600) * 100, scorePct: ((capped - 120) / 600) * 100 };
  }

  return (
    <div className="rounded-2xl border border-[rgba(6,214,160,.2)] bg-bg-base p-6 shadow-[0_0_24px_rgba(6,214,160,.06)]">
      <div className="mb-5 grid grid-cols-2 gap-5">
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Module 1 Raw Score</div>
          <input
            type="number" placeholder="/27" min={0} max={27} value={m1}
            onChange={e => setM1(e.target.value)}
            className="w-[88px] rounded-lg border border-border-default bg-bg-surface p-2.5 text-center font-mono text-xl text-text-primary transition-all focus:border-[rgba(6,182,212,.5)] focus:shadow-[0_0_0_3px_rgba(6,182,212,.08)]"
          />
        </div>
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-text-muted">Module 2 Raw Score</div>
          <input
            type="number" placeholder="/27" min={0} max={27} value={m2}
            onChange={e => setM2(e.target.value)}
            className="w-[88px] rounded-lg border border-border-default bg-bg-surface p-2.5 text-center font-mono text-xl text-text-primary transition-all focus:border-[rgba(6,182,212,.5)] focus:shadow-[0_0_0_3px_rgba(6,182,212,.08)]"
          />
        </div>
      </div>
      {result ? (
        <div className="text-center">
          <div className="font-mono text-[2.4rem] font-bold" style={{ color: result.color, textShadow: `0 0 30px ${result.color}44` }}>{result.capped}</div>
          <div className="mt-1 text-[13px] text-text-secondary">{result.total}/54 raw · {result.lvl}</div>
          <div className="relative my-4 h-2.5 overflow-hidden rounded-full bg-border-default">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${result.scorePct}%`, background: `linear-gradient(90deg, ${result.color}, ${result.color}cc)`, boxShadow: `0 0 12px ${result.color}33` }} />
            <div className="absolute top-[-8px] h-[26px] w-0.5 rounded-sm bg-[#06d6a0]" style={{ left: `${result.bench9Pct}%` }} title="410 Benchmark (9th)" />
          </div>
          <div className="flex justify-between font-mono text-[11px] text-text-muted">
            <span>120</span>
            <span className="font-sans font-semibold text-[#06d6a0]">410 (9th grade) ↑</span>
            <span>720</span>
          </div>
          <div className="mt-4 text-sm leading-[1.7] text-[#bcbcc8]">{result.advice}</div>
        </div>
      ) : (
        <div className="py-5 text-center text-sm text-text-muted">Enter both scores to see your estimated scaled score.</div>
      )}
    </div>
  );
}
