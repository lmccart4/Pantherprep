"use client";

import { useState } from "react";

const ACCENT = "#d4a017";

/* ── Subject-Verb Agreement Rules Table ── */
export function SVAgreementVisual() {
  const rules = [
    { rule: "Singular subjects", example: "The analysis suggests...", tip: "Cross out prepositional phrases to find the true subject", color: "#60a5fa" },
    { rule: "\"Each\" / \"Every\"", example: "Each student is required...", tip: "Always singular, no exceptions", color: "#34d399" },
    { rule: "Collective nouns", example: "The committee has announced...", tip: "Singular on the PSAT (committee, team, jury)", color: "#fbbf24" },
    { rule: "Neither...nor", example: "Neither the director nor the producers were...", tip: "Verb matches the NEARER subject", color: "#f472b6" },
    { rule: "\"A number of\" vs \"The number of\"", example: "A number of studies have shown...", tip: "\"A number of\" = plural; \"The number of\" = singular", color: "#a855f7" },
    { rule: "\"Data\" (formal)", example: "The data indicate...", tip: "Plural in academic English (PSAT convention)", color: "#06b6d4" },
  ];

  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Subject-Verb Agreement Quick Reference
      </div>
      {rules.map((r, i) => (
        <button
          key={i}
          onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
          className="w-full cursor-pointer rounded-xl border bg-bg-base p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: flipped[i] ? `${r.color}33` : "var(--color-border-default)",
            boxShadow: flipped[i] ? `0 0 16px ${r.color}11` : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: r.color }} />
            <span className="text-sm font-bold text-text-primary">{r.rule}</span>
          </div>
          {flipped[i] ? (
            <div className="mt-2 space-y-1.5 pl-5">
              <div className="text-sm text-[#bcbcc8]">
                <code className="rounded-md bg-[rgba(212,160,23,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{r.example}</code>
              </div>
              <div className="text-[13px] text-text-muted">{r.tip}</div>
              <div className="text-right text-[11px] font-medium opacity-70" style={{ color: r.color }}>&larr; tap to collapse</div>
            </div>
          ) : (
            <div className="mt-1 pl-5 text-right text-[11px] font-medium opacity-70" style={{ color: r.color }}>tap for example &rarr;</div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Dangling Modifier Visual ── */
export function ModifierVisual() {
  const examples = [
    { wrong: "Covered in frost, the scientist examined the specimens.", right: "The scientist examined the specimens, which were covered in frost.", who: "specimens", wrongWho: "scientist" },
    { wrong: "Flying over the canyon, the landscape amazed the passengers.", right: "Flying over the canyon, the passengers were amazed by the landscape.", who: "passengers", wrongWho: "landscape" },
    { wrong: "Using advanced imaging technology, the tumor was detected.", right: "Using advanced imaging technology, the radiologist detected the tumor.", who: "radiologist", wrongWho: "tumor" },
  ];

  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Dangling Modifier Detector
      </div>
      <div className="rounded-xl border border-[rgba(212,160,23,.2)] bg-[rgba(212,160,23,.07)] px-5 py-3 text-sm leading-[1.7]">
        <strong style={{ color: ACCENT }}>Rule: </strong>
        The person or thing doing the action must appear <strong>immediately after</strong> the modifying phrase.
      </div>
      {examples.map((ex, i) => (
        <button
          key={i}
          onClick={() => setRevealed(prev => ({ ...prev, [i]: true }))}
          className="w-full cursor-pointer rounded-xl border border-border-default bg-bg-base p-4 text-left transition-all duration-300"
        >
          <div className="mb-2 text-sm leading-relaxed text-[#bcbcc8]">
            <span className="font-semibold text-[#ef4444]">Wrong: </span>{ex.wrong}
          </div>
          {revealed[i] ? (
            <>
              <div className="mb-2 text-sm leading-relaxed text-[#bcbcc8]">
                <span className="font-semibold text-[#22c55e]">Right: </span>{ex.right}
              </div>
              <div className="rounded-lg bg-[rgba(34,197,94,.07)] px-3 py-2 text-xs text-text-muted">
                <strong style={{ color: "#22c55e" }}>{ex.who}</strong> is doing the action, not <span className="line-through">{ex.wrongWho}</span>
              </div>
            </>
          ) : (
            <div className="text-[11px] text-text-muted">Tap to see the fix</div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Parallelism Checker ── */
export function ParallelismVisual() {
  const items = [
    { text: "reducing, implementing, eliminating", parallel: true, form: "All gerunds" },
    { text: "to think, to write, to collaborate", parallel: true, form: "All infinitives" },
    { text: "recycling, reducing, to conserve", parallel: false, form: "Gerund, gerund, infinitive -- breaks pattern" },
    { text: "innovative, sustainable, that attracted...", parallel: false, form: "Adj, adj, clause -- breaks pattern" },
  ];

  const [answers, setAnswers] = useState<Record<number, boolean | undefined>>({});

  return (
    <div className="space-y-3">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: ACCENT }}>
        Parallelism Quick Check
      </div>
      {items.map((item, i) => {
        const answered = answers[i] !== undefined;
        const correct = answered && answers[i] === item.parallel;
        return (
          <div
            key={i}
            className="rounded-xl border bg-bg-base p-4 transition-all"
            style={{
              borderColor: answered ? (correct ? "rgba(34,197,94,.3)" : "rgba(239,68,68,.3)") : "var(--color-border-default)",
              background: answered ? (correct ? "rgba(34,197,94,.05)" : "rgba(239,68,68,.05)") : undefined,
            }}
          >
            <div className="mb-2 text-sm text-[#bcbcc8]">
              <code className="rounded-md bg-[rgba(212,160,23,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{item.text}</code>
            </div>
            {!answered ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setAnswers(prev => ({ ...prev, [i]: true }))}
                  className="rounded-md border border-border-default px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:border-[rgba(34,197,94,.4)] hover:text-[#22c55e]"
                >
                  Parallel
                </button>
                <button
                  onClick={() => setAnswers(prev => ({ ...prev, [i]: false }))}
                  className="rounded-md border border-border-default px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:border-[rgba(239,68,68,.4)] hover:text-[#ef4444]"
                >
                  Not Parallel
                </button>
              </div>
            ) : (
              <div className="text-xs" style={{ color: correct ? "#22c55e" : "#ef4444" }}>
                {correct ? "Correct!" : "Not quite."} {item.form}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Tense Signals Table ── */
export function TenseSignalsVisual() {
  const signals = [
    { signal: "By the time X happened...", tense: "Past Perfect", example: "had already edited", color: "#60a5fa" },
    { signal: "For decades / since 1990...", tense: "Present Perfect", example: "have fascinated", color: "#34d399" },
    { signal: "Until next quarter...", tense: "Future", example: "will not be approved", color: "#fbbf24" },
    { signal: "Last year / In 2019...", tense: "Simple Past", example: "discovered", color: "#f472b6" },
    { signal: "Currently / Every day...", tense: "Simple Present", example: "winds", color: "#a855f7" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border-default">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Time Signal</th>
            <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Tense</th>
            <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">Example</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((s, i) => (
            <tr key={i}>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">{s.signal}</td>
              <td className="border-b border-border-default px-4 py-3 font-semibold last:border-b-0" style={{ color: s.color }}>{s.tense}</td>
              <td className="border-b border-border-default px-4 py-3 last:border-b-0">
                <code className="rounded-md bg-[rgba(212,160,23,.1)] px-2 py-0.5 font-mono text-[13px]" style={{ color: ACCENT }}>{s.example}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
