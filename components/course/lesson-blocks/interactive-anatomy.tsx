"use client";

import { useState, useCallback } from "react";

interface Highlight {
  text: string;
  note: string;
}

interface AnatomyQuestion {
  tab: string;
  domain: string;
  passage: string;
  highlights: Highlight[];
  stem: string;
  choices: string[];
  correct: number;
  explain: string;
}

interface InteractiveAnatomyProps {
  questions: AnatomyQuestion[];
  accentColor?: string;
}

export function InteractiveAnatomy({
  questions,
  accentColor = "#a78bfa",
}: InteractiveAnatomyProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const q = questions[activeTab];

  const handleTabChange = useCallback((i: number) => {
    setActiveTab(i);
    setSelected(null);
    setRevealed(false);
    setActiveNote(null);
  }, []);

  const handleSelect = useCallback(
    (i: number) => {
      if (revealed) return;
      setSelected(i);
    },
    [revealed]
  );

  const handleCheck = useCallback(() => {
    if (selected === null) return;
    setRevealed(true);
  }, [selected]);

  // Build passage with highlighted spans
  function renderPassage(passage: string, highlights: Highlight[]) {
    if (!highlights.length) return <span>{passage}</span>;

    const parts: React.ReactNode[] = [];
    let remaining = passage;
    let keyIdx = 0;

    for (const hl of highlights) {
      const idx = remaining.indexOf(hl.text);
      if (idx === -1) continue;

      if (idx > 0) {
        parts.push(<span key={`t-${keyIdx++}`}>{remaining.slice(0, idx)}</span>);
      }
      parts.push(
        <button
          key={`h-${keyIdx++}`}
          onClick={() => setActiveNote(hl.note)}
          className="cursor-pointer rounded px-0.5 transition-colors duration-200 hover:opacity-80"
          style={{
            backgroundColor: `${accentColor}22`,
            borderBottom: `2px solid ${accentColor}88`,
            color: "inherit",
          }}
        >
          {hl.text}
        </button>
      );
      remaining = remaining.slice(idx + hl.text.length);
    }
    if (remaining) {
      parts.push(<span key={`t-${keyIdx}`}>{remaining}</span>);
    }
    return <>{parts}</>;
  }

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto rounded-xl border border-border-default bg-bg-deep p-1.5">
        {questions.map((item, i) => (
          <button
            key={i}
            onClick={() => handleTabChange(i)}
            className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
            style={
              i === activeTab
                ? {
                    backgroundColor: `${accentColor}1a`,
                    color: accentColor,
                    boxShadow: `0 0 12px ${accentColor}15`,
                  }
                : { color: "var(--color-text-muted)" }
            }
          >
            {item.tab}
          </button>
        ))}
      </div>

      {/* Domain badge */}
      <div
        className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
        style={{
          backgroundColor: `${accentColor}15`,
          color: accentColor,
        }}
      >
        {q.domain}
      </div>

      {/* Two-panel layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Passage panel */}
        <div className="rounded-[14px] border border-border-default bg-bg-deep p-5">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
            Passage
          </div>
          <div className="text-sm leading-[1.85] text-[#bcbcc8]">
            {renderPassage(q.passage, q.highlights)}
          </div>
        </div>

        {/* Question panel */}
        <div className="rounded-[14px] border border-border-default bg-bg-deep p-5">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
            Question
          </div>
          <p className="mb-4 text-sm font-medium leading-relaxed text-text-primary">
            {q.stem}
          </p>
          <div className="space-y-2">
            {q.choices.map((choice, i) => {
              let borderColor = "var(--color-border-default)";
              let bgColor = "transparent";
              if (revealed && i === q.correct) {
                borderColor = "#22c55e88";
                bgColor = "#22c55e0d";
              } else if (revealed && i === selected && i !== q.correct) {
                borderColor = "#ef444488";
                bgColor = "#ef44440d";
              } else if (selected === i) {
                borderColor = `${accentColor}66`;
                bgColor = `${accentColor}0d`;
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200"
                  style={{ borderColor, backgroundColor: bgColor }}
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      backgroundColor:
                        selected === i ? `${accentColor}22` : "var(--color-bg-surface)",
                      color: selected === i ? accentColor : "var(--color-text-muted)",
                    }}
                  >
                    {letters[i]}
                  </span>
                  <span className="text-[#bcbcc8]">{choice}</span>
                </button>
              );
            })}
          </div>

          {!revealed && (
            <button
              onClick={handleCheck}
              disabled={selected === null}
              className="mt-4 w-full rounded-xl py-2.5 text-sm font-bold transition-all duration-200 disabled:opacity-30"
              style={{
                backgroundColor: `${accentColor}22`,
                color: accentColor,
                border: `1px solid ${accentColor}33`,
              }}
            >
              Check Answer
            </button>
          )}

          {revealed && (
            <div
              className="mt-4 rounded-xl border px-4 py-3.5 text-sm leading-[1.7] text-[#bcbcc8]"
              style={{
                backgroundColor:
                  selected === q.correct ? "#22c55e0a" : "#ef44440a",
                borderColor:
                  selected === q.correct ? "#22c55e33" : "#ef444433",
              }}
            >
              <strong
                style={{
                  color: selected === q.correct ? "#22c55e" : "#ef4444",
                }}
              >
                {selected === q.correct ? "Correct!" : "Incorrect."}{" "}
              </strong>
              {q.explain}
            </div>
          )}
        </div>
      </div>

      {/* Annotation bar */}
      {activeNote && (
        <div
          className="rounded-xl border px-5 py-3.5 text-sm leading-relaxed text-[#bcbcc8] transition-all duration-300"
          style={{
            backgroundColor: `${accentColor}0a`,
            borderColor: `${accentColor}33`,
          }}
        >
          <strong className="text-xs uppercase tracking-wider" style={{ color: accentColor }}>
            Annotation:{" "}
          </strong>
          {activeNote}
        </div>
      )}
    </div>
  );
}
