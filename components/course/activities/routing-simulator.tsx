"use client";

import { useState, useCallback, useMemo } from "react";

export interface RoutingSimulatorProps {
  maxQuestions: number; // 22 for math, 27 for R&W
  section: "math" | "rw";
  testType: string;
  accentColor: string;
  onComplete?: () => void;
}

interface RouteInfo {
  route: string;
  color: string;
  bg: string;
  floor: number;
  ceil: number;
}

function getScoreCeilings(testType: string): { hard: number; easy: number } {
  switch (testType) {
    case "sat":
      return { hard: 800, easy: 630 };
    case "nmsqt":
      return { hard: 760, easy: 650 };
    case "psat89":
      return { hard: 720, easy: 560 };
    default:
      return { hard: 800, easy: 630 };
  }
}

function getScoreFloor(testType: string): number {
  switch (testType) {
    case "sat":
      return 200;
    case "nmsqt":
      return 160;
    case "psat89":
      return 120;
    default:
      return 200;
  }
}

function computeRoute(
  value: number,
  maxQuestions: number,
  testType: string,
): RouteInfo {
  const pct = value / maxQuestions;
  const threshold = Math.round(maxQuestions * 0.68);
  const borderline = Math.round(maxQuestions * 0.55);
  const ceilings = getScoreCeilings(testType);
  const scoreFloor = getScoreFloor(testType);
  const scoreRange = ceilings.hard - scoreFloor;

  if (value >= threshold) {
    const floor = Math.max(
      scoreFloor,
      scoreFloor + Math.round(pct * scoreRange * 0.5),
    );
    const ceil = Math.min(
      scoreFloor + Math.round(pct * scoreRange * 0.75 + scoreRange * 0.25),
      ceilings.hard,
    );
    return {
      route: "Harder Module 2",
      color: "#22c55e",
      bg: "rgba(34,197,94,.1)",
      floor,
      ceil,
    };
  } else if (value >= borderline) {
    const floor = Math.max(
      scoreFloor,
      scoreFloor + Math.round(pct * scoreRange * 0.35),
    );
    const ceil = Math.min(
      scoreFloor + Math.round(pct * scoreRange * 0.6 + scoreRange * 0.1),
      ceilings.easy + 70,
    );
    return {
      route: "Borderline -- Could go either way",
      color: "#f59e0b",
      bg: "rgba(251,191,36,.1)",
      floor,
      ceil,
    };
  } else {
    const floor = scoreFloor;
    const ceil = Math.min(
      scoreFloor + Math.round(value * (scoreRange / maxQuestions) * 0.8 + scoreRange * 0.2),
      ceilings.easy,
    );
    return {
      route: "Easier Module 2",
      color: "#ef4444",
      bg: "rgba(239,68,68,.1)",
      floor,
      ceil,
    };
  }
}

function getTestLabel(testType: string): string {
  switch (testType) {
    case "sat":
      return "SAT";
    case "nmsqt":
      return "PSAT/NMSQT";
    case "psat89":
      return "PSAT 8/9";
    default:
      return "SAT";
  }
}

export function RoutingSimulator({
  maxQuestions,
  section,
  testType,
  accentColor,
  onComplete,
}: RoutingSimulatorProps) {
  const threshold = Math.round(maxQuestions * 0.68);
  const [value, setValue] = useState(threshold);
  const [acknowledged, setAcknowledged] = useState(false);

  const sectionLabel = section === "math" ? "Math" : "Reading & Writing";
  const testLabel = getTestLabel(testType);
  const ceilings = useMemo(() => getScoreCeilings(testType), [testType]);
  const scoreFloor = useMemo(() => getScoreFloor(testType), [testType]);
  const scoreRange = ceilings.hard - scoreFloor;

  const info = useMemo(
    () => computeRoute(value, maxQuestions, testType),
    [value, maxQuestions, testType],
  );

  const meterPct = ((info.ceil - scoreFloor) / scoreRange) * 100;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(parseInt(e.target.value, 10));
    },
    [],
  );

  const handleComplete = useCallback(() => {
    setAcknowledged(true);
    onComplete?.();
  }, [onComplete]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div
        className="rounded-2xl border border-ink/20 p-6 sm:p-8"
        style={{
          background: "rgba(15,15,22,.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <div
            className="mb-2 text-xs font-semibold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            Interactive
          </div>
          <h2 className="mb-2 text-xl font-bold text-ink sm:text-2xl">
            Routing Simulator
          </h2>
          <p className="text-sm leading-relaxed text-ink/60">
            Slide to see how your Module 1 performance affects your{" "}
            {testLabel} {sectionLabel} scoring potential. Notice how the score
            ceiling changes dramatically around the routing threshold.
          </p>
        </div>

        {/* Explanation callout */}
        <div
          className="mb-6 rounded-xl border-l-3 p-4 text-sm leading-relaxed"
          style={{
            borderColor: accentColor,
            background: "rgba(255,255,255,.04)",
            color: "rgba(255,255,255,.75)",
          }}
        >
          <strong className="text-ink">How adaptive routing works:</strong>{" "}
          The {testLabel} {sectionLabel} section has two modules of{" "}
          {maxQuestions} questions each. Module 1 is the same difficulty for
          everyone. Your score on Module 1 determines whether you get the{" "}
          <em>harder</em> or <em>easier</em> version of Module 2. Getting routed
          to the harder Module 2 unlocks scores up to{" "}
          <strong style={{ color: "#22c55e" }}>{ceilings.hard}</strong>, while
          the easier Module 2 caps your score at roughly{" "}
          <strong style={{ color: "#ef4444" }}>{ceilings.easy}</strong> -- even
          if you ace every question.
        </div>

        {/* Slider area */}
        <div className="mb-6">
          <div className="mb-2 text-center text-xs text-ink/40">
            Module 1 Correct Answers
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-ink/40">0</span>
            <input
              type="range"
              min={0}
              max={maxQuestions}
              value={value}
              onChange={handleChange}
              className="routing-slider flex-1"
              style={
                {
                  "--accent": accentColor,
                  "--slider-pct": `${(value / maxQuestions) * 100}%`,
                } as React.CSSProperties
              }
            />
            <span className="text-xs text-ink/40">{maxQuestions}</span>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-ink"
              style={{ background: "rgba(255,255,255,.08)" }}
            >
              {value}
            </div>
          </div>

          {/* Threshold marker */}
          <div className="mt-1 flex items-center gap-1 text-xs text-ink/30">
            <span>Threshold: ~{threshold} correct (~60%)</span>
          </div>
        </div>

        {/* Route result */}
        <div
          className="mb-4 rounded-xl p-4 transition-all duration-300"
          style={{ background: info.bg }}
        >
          <div className="mb-1 text-base font-bold" style={{ color: info.color }}>
            {value}/{maxQuestions} correct &rarr; {info.route}
          </div>
          <div className="text-sm text-ink/50">
            Estimated score range: {info.floor}&ndash;{info.ceil}
          </div>
        </div>

        {/* Score meter */}
        <div className="mb-6">
          <div className="mb-1 flex justify-between text-xs text-ink/30">
            <span>Score Floor</span>
            <span>
              {info.floor}&ndash;{info.ceil}
            </span>
            <span>Score Ceiling</span>
          </div>
          <div
            className="h-3 w-full overflow-hidden rounded-full"
            style={{ background: "rgba(255,255,255,.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(meterPct, 100)}%`,
                background: info.color,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-ink/20">
            <span>{scoreFloor}</span>
            <span>{ceilings.hard}</span>
          </div>
        </div>

        {/* Key takeaway */}
        <div
          className="mb-6 rounded-xl p-4 text-sm leading-relaxed"
          style={{
            background: "rgba(255,255,255,.04)",
            color: "rgba(255,255,255,.7)",
          }}
        >
          <strong className="text-ink">The Module 1 Imperative:</strong>{" "}
          Accuracy on the first {maxQuestions} questions matters more than speed.
          Getting routed to the harder Module 2 is the single most important
          factor in your {sectionLabel} score.
        </div>

        {/* Continue button */}
        <div className="text-center">
          <button
            onClick={handleComplete}
            disabled={acknowledged}
            className="rounded-xl px-8 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:brightness-110 disabled:opacity-50"
            style={{
              background: acknowledged
                ? "rgba(255,255,255,.1)"
                : accentColor,
            }}
          >
            {acknowledged ? "Got it!" : "Got it -- Continue"}
          </button>
        </div>
      </div>

      {/* Slider custom styles */}
      <style jsx>{`
        .routing-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(
            90deg,
            #ef4444 0%,
            #f59e0b 50%,
            #22c55e 100%
          );
          outline: none;
          cursor: pointer;
        }
        .routing-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-paper-card);
          border: 3px solid var(--accent);
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
        }
        .routing-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-paper-card);
          border: 3px solid var(--accent);
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
}
