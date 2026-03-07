"use client";

import { useState, useCallback } from "react";

interface Scenario {
  scenario: string;
  options: string[];
  correct: number;
  feedback: string;
}

interface ErrorClassificationProps {
  scenarios: Scenario[];
  accentColor?: string;
}

export function ErrorClassification({
  scenarios,
  accentColor = "#a78bfa",
}: ErrorClassificationProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const s = scenarios[current];

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
    if (selected === s.correct) {
      setCorrectCount((c) => c + 1);
    }
  }, [selected, s?.correct]);

  const handleNext = useCallback(() => {
    if (current + 1 >= scenarios.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setRevealed(false);
  }, [current, scenarios.length]);

  const handleReset = useCallback(() => {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setCorrectCount(0);
    setFinished(false);
  }, []);

  if (finished) {
    const pct = Math.round((correctCount / scenarios.length) * 100);
    const resultColor = pct >= 80 ? "#22c55e" : pct >= 50 ? "#eab308" : "#ef4444";
    return (
      <div
        className="rounded-[14px] border p-6 text-center transition-all duration-300"
        style={{
          backgroundColor: `${resultColor}08`,
          borderColor: `${resultColor}33`,
        }}
      >
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
          Final Score
        </div>
        <div
          className="mt-2 font-display text-4xl font-bold"
          style={{ color: resultColor }}
        >
          {correctCount} / {scenarios.length}
        </div>
        <div className="mt-1 text-sm text-text-muted">{pct}% accuracy</div>
        <button
          onClick={handleReset}
          className="mt-5 rounded-xl border px-6 py-2.5 text-sm font-bold transition-all duration-200 hover:opacity-80"
          style={{
            backgroundColor: `${accentColor}1a`,
            borderColor: `${accentColor}33`,
            color: accentColor,
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const letters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-text-primary">
          Scenario {current + 1} of {scenarios.length}
        </div>
        <div
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{
            backgroundColor: `${accentColor}1a`,
            color: accentColor,
          }}
        >
          {correctCount} correct
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-default">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((current + (revealed ? 1 : 0)) / scenarios.length) * 100}%`,
            backgroundColor: accentColor,
            opacity: 0.7,
          }}
        />
      </div>

      {/* Scenario card */}
      <div className="rounded-[14px] border border-border-default bg-bg-deep p-5">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
          Scenario
        </div>
        <p className="text-sm leading-[1.8] text-text-primary">{s.scenario}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {s.options.map((opt, i) => {
          let borderColor = "var(--color-border-default)";
          let bgColor = "transparent";
          if (revealed && i === s.correct) {
            borderColor = "#22c55e88";
            bgColor = "#22c55e0d";
          } else if (revealed && i === selected && i !== s.correct) {
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
              className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200"
              style={{ borderColor, backgroundColor: bgColor }}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  backgroundColor:
                    selected === i ? `${accentColor}22` : "var(--color-bg-surface)",
                  color: selected === i ? accentColor : "var(--color-text-muted)",
                }}
              >
                {letters[i]}
              </span>
              <span className="text-[#bcbcc8]">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Check / Next button */}
      {!revealed ? (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="w-full rounded-xl py-2.5 text-sm font-bold transition-all duration-200 disabled:opacity-30"
          style={{
            backgroundColor: `${accentColor}22`,
            color: accentColor,
            border: `1px solid ${accentColor}33`,
          }}
        >
          Check Answer
        </button>
      ) : (
        <>
          {/* Feedback */}
          <div
            className="rounded-xl border px-4 py-3.5 text-sm leading-[1.7] text-[#bcbcc8]"
            style={{
              backgroundColor:
                selected === s.correct ? "#22c55e0a" : "#ef44440a",
              borderColor:
                selected === s.correct ? "#22c55e33" : "#ef444433",
            }}
          >
            <strong
              style={{
                color: selected === s.correct ? "#22c55e" : "#ef4444",
              }}
            >
              {selected === s.correct ? "Correct!" : "Incorrect."}{" "}
            </strong>
            <span dangerouslySetInnerHTML={{ __html: s.feedback }} />
          </div>

          <button
            onClick={handleNext}
            className="w-full rounded-xl py-2.5 text-sm font-bold transition-all duration-200"
            style={{
              backgroundColor: `${accentColor}22`,
              color: accentColor,
              border: `1px solid ${accentColor}33`,
            }}
          >
            {current + 1 < scenarios.length ? "Next Scenario" : "See Results"}
          </button>
        </>
      )}
    </div>
  );
}
