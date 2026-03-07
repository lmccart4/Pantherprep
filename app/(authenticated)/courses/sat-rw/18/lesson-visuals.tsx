"use client";

const ACCENT = "#C8102E";

/* ── Slide: Conventions Review ── */
export function ConventionsReview() {
  const rules = [
    { rule: "Subject-Verb Agreement", tip: "Find TRUE subject, ignore parentheticals", color: "#10b981" },
    { rule: "Comma Rules", tip: "FANBOYS after comma, semicolons between ICs", color: "#3b82f6" },
    { rule: "Restrictive vs. Non", tip: "\"that\" = essential, \"which\" = extra (commas)", color: "#a855f7" },
    { rule: "Pronoun Clarity", tip: "Each pronoun needs ONE clear antecedent", color: "#f59e0b" },
    { rule: "Modifier Placement", tip: "Modifier must be next to what it modifies", color: "#ef4444" },
    { rule: "Apostrophes", tip: "Possession vs. plural vs. it's/its", color: "#ec4899" },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Conventions Quick Reference
      </div>
      <div className="grid grid-cols-2 gap-2">
        {rules.map((r, i) => (
          <div
            key={i}
            className="rounded-[10px] border-l-[3px] px-3 py-2"
            style={{ borderColor: r.color, background: `${r.color}08` }}
          >
            <div className="text-[11px] font-bold" style={{ color: r.color }}>
              {r.rule}
            </div>
            <div className="text-[10px] text-text-muted">{r.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide: Vocabulary Review ── */
export function VocabReview() {
  const strategies = [
    { label: "Tone First", detail: "Positive, negative, or neutral?", color: "#3b82f6" },
    { label: "Context Clues", detail: "Definition, contrast, example, logic", color: "#a855f7" },
    { label: "Precision Check", detail: "Scope, intensity, domain match", color: "#10b981" },
    { label: "Secondary Meanings", detail: "Common words with uncommon uses", color: "#f59e0b" },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Vocabulary Strategies
      </div>
      {strategies.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-md p-1.5 pl-2.5"
          style={{
            borderLeft: `3px solid ${s.color}`,
            background: `${s.color}08`,
          }}
        >
          <div
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-black"
            style={{ background: `${s.color}22`, color: s.color }}
          >
            {i + 1}
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary">
              {s.label}
            </span>
            <span className="text-[11px] text-text-muted">
              {" "}
              &mdash; {s.detail}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Info & Ideas Review ── */
export function InfoReview() {
  const skills = [
    { label: "Central Idea", tip: "Summarize in one sentence first", color: "#3b82f6" },
    { label: "Detail", tip: "Go back and find the EXACT sentence", color: "#a855f7" },
    { label: "Inference", tip: "Smallest logical leap from evidence", color: "#10b981" },
    { label: "Evidence", tip: "Must SUPPORT the claim, not just relate", color: "#f59e0b" },
    { label: "Data", tip: "Read labels, identify trends, match to claim", color: "#ef4444" },
    { label: "Strengthen/Weaken", tip: "Find the hidden assumption", color: "#ec4899" },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Information & Ideas Toolkit
      </div>
      <div className="grid grid-cols-2 gap-2">
        {skills.map((s, i) => (
          <div
            key={i}
            className="rounded-[10px] border-l-[3px] px-3 py-2"
            style={{ borderColor: s.color, background: `${s.color}08` }}
          >
            <div className="text-[11px] font-bold" style={{ color: s.color }}>
              {s.label}
            </div>
            <div className="text-[10px] text-text-muted">{s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide: Expression Review ── */
export function ExpressionReview() {
  const tips = [
    { label: "Synthesis", tip: "Read the GOAL first, match relevant notes", color: "#3b82f6" },
    { label: "Transitions", tip: "Cover the word, identify the relationship", color: "#a855f7" },
    { label: "Expression", tip: "Match revision to the EXACT objective", color: "#10b981" },
    { label: "Concision", tip: "Shortest version preserving all info", color: "#f59e0b" },
  ];

  return (
    <div className="space-y-1.5 px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Expression & Strategy
      </div>
      {tips.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-r-md p-1.5 pl-2.5"
          style={{
            borderLeft: `3px solid ${s.color}`,
            background: `${s.color}08`,
          }}
        >
          <div
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-black"
            style={{ background: `${s.color}22`, color: s.color }}
          >
            {i + 1}
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary">
              {s.label}
            </span>
            <span className="text-[11px] text-text-muted">
              {" "}
              &mdash; {s.tip}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide: Test Day Checklist ── */
export function TestDayChecklist() {
  const items = [
    { text: "8+ hours of sleep the night before", color: "#10b981" },
    { text: "Accuracy over speed in Module 1", color: "#3b82f6" },
    { text: "~71 seconds per question budget", color: "#a855f7" },
    { text: "Flag and move after 90 seconds", color: "#f59e0b" },
    { text: "Answer EVERY question (no penalty)", color: "#ef4444" },
    { text: "Hard Module 2 = good sign", color: ACCENT },
  ];

  return (
    <div className="px-5 py-3">
      <div
        className="mb-2.5 text-xs font-bold uppercase tracking-[1px]"
        style={{ color: ACCENT }}
      >
        Test Day Strategy
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-lg border px-3 py-2"
            style={{
              borderColor: `${item.color}33`,
              background: `${item.color}08`,
            }}
          >
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black"
              style={{ background: `${item.color}22`, color: item.color }}
            >
              {i + 1}
            </div>
            <span className="text-[13px] text-text-primary">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
