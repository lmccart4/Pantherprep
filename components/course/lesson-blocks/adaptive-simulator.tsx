"use client";

import { useState, useMemo } from "react";

interface AdaptiveSimulatorProps {
  totalQuestions?: number;
  accentColor?: string;
}

export function AdaptiveSimulator({
  totalQuestions = 27,
  accentColor = "#a78bfa",
}: AdaptiveSimulatorProps) {
  const [score, setScore] = useState(Math.round(totalQuestions * 0.6));

  const result = useMemo(() => {
    const pct = score / totalQuestions;
    if (pct >= 0.7) {
      return {
        label: "Harder Module 2",
        description: "You demonstrated strong mastery. Module 2 will contain harder questions, but getting them right unlocks the top score range.",
        color: "#22c55e",
        ceiling: "Full score range (e.g., 600-800)",
        ceilingPct: 100,
      };
    }
    if (pct >= 0.45) {
      return {
        label: "Borderline / Mixed Module 2",
        description: "Your performance is in the middle range. Module 2 will contain a mix of medium and hard questions. Your ceiling is capped in the mid-range.",
        color: "#eab308",
        ceiling: "Mid-range (e.g., 450-620)",
        ceilingPct: 70,
      };
    }
    return {
      label: "Easier Module 2",
      description: "Module 2 will contain easier questions to confirm your ability level. The maximum possible score is significantly capped.",
      color: "#ef4444",
      ceiling: "Lower range (e.g., 200-480)",
      ceilingPct: 40,
    };
  }, [score, totalQuestions]);

  return (
    <div className="space-y-5">
      {/* Slider section */}
      <div className="rounded-[14px] border border-border-default bg-bg-deep p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-text-primary">
            Module 1 Correct Answers
          </span>
          <span
            className="rounded-full px-3 py-1 text-sm font-bold"
            style={{
              backgroundColor: `${accentColor}1a`,
              color: accentColor,
            }}
          >
            {score} / {totalQuestions}
          </span>
        </div>

        {/* Range slider */}
        <div className="relative">
          <input
            type="range"
            min={0}
            max={totalQuestions}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full cursor-pointer appearance-none rounded-full bg-border-default h-2 outline-none"
            style={{
              background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${(score / totalQuestions) * 100}%, var(--color-border-default) ${(score / totalQuestions) * 100}%, var(--color-border-default) 100%)`,
            }}
          />
          {/* Tick marks */}
          <div className="mt-2 flex justify-between text-[10px] text-text-muted">
            <span>0</span>
            <span>{Math.round(totalQuestions * 0.25)}</span>
            <span>{Math.round(totalQuestions * 0.5)}</span>
            <span>{Math.round(totalQuestions * 0.75)}</span>
            <span>{totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* Result card */}
      <div
        className="rounded-[14px] border p-5 transition-all duration-300"
        style={{
          backgroundColor: `${result.color}08`,
          borderColor: `${result.color}33`,
        }}
      >
        <div className="mb-2 flex items-center gap-2.5">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: result.color }}
          />
          <span className="text-[15px] font-bold" style={{ color: result.color }}>
            {result.label}
          </span>
        </div>
        <p className="mb-4 text-sm leading-[1.7] text-[#bcbcc8]">
          {result.description}
        </p>

        {/* Score ceiling bar */}
        <div>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
            Score Ceiling
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-border-default">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${result.ceilingPct}%`,
                backgroundColor: result.color,
                opacity: 0.6,
              }}
            />
          </div>
          <div className="mt-1.5 text-xs text-text-muted">{result.ceiling}</div>
        </div>
      </div>

      {/* Threshold markers */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {[
          { label: "Easier Path", range: `0-${Math.round(totalQuestions * 0.44)}`, color: "#ef4444" },
          { label: "Borderline", range: `${Math.round(totalQuestions * 0.45)}-${Math.round(totalQuestions * 0.69)}`, color: "#eab308" },
          { label: "Harder Path", range: `${Math.round(totalQuestions * 0.7)}-${totalQuestions}`, color: "#22c55e" },
        ].map((t) => (
          <div
            key={t.label}
            className="rounded-lg border border-border-default bg-bg-deep px-3 py-2.5"
          >
            <div className="font-bold" style={{ color: t.color }}>
              {t.label}
            </div>
            <div className="mt-0.5 text-text-muted">{t.range} correct</div>
          </div>
        ))}
      </div>
    </div>
  );
}
