"use client";

import Link from "next/link";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import { computeWeakSkills, type SkillResult } from "@/lib/weak-skills";

interface WeakSkillsCalloutProps {
  course: string;
  results: SkillResult[];
  accentColor: string;
  title?: string;
  limit?: number;
  minAttempts?: number;
  threshold?: number;
}

export function WeakSkillsCallout({
  course,
  results,
  // accentColor kept in signature for compatibility — no longer used visually
  accentColor: _accentColor,
  title = "Practice your weak areas",
  limit = 3,
  minAttempts = 2,
  threshold = 0.7,
}: WeakSkillsCalloutProps) {
  void _accentColor;
  const weak = computeWeakSkills(results, { minAttempts, threshold, limit });

  if (weak.length === 0) return null;

  return (
    <div className="mb-8 border-2 border-ink bg-paper-card p-6 shadow-[5px_5px_0_var(--color-ink)]">
      <div className="mb-2 kicker">● {title}</div>
      <h3 className="mb-4 font-display text-[26px] leading-tight text-ink">
        Where the engine wants you{" "}
        <em className="text-accent" style={{ fontStyle: "italic" }}>
          next
        </em>
        .
      </h3>
      <p className="mb-5 font-body text-[14px] italic leading-[1.55] text-ink-2">
        Adaptive practice on the skills that tripped you up the most. Each session pulls from the
        question pool keyed to your weakest spots.
      </p>
      <div className="flex flex-col">
        {weak.map((s, i) => (
          <Link
            key={s.taxonomyKey}
            href={`/skills/${course}/${s.taxonomyKey}`}
            className={`group flex items-center justify-between gap-4 border-b border-dashed border-rule-hair py-3 transition-colors hover:bg-paper-2 ${
              i === weak.length - 1 ? "border-b-0" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="font-display text-[17px] leading-tight text-ink">
                {skillLabel(s.taxonomyKey)}
              </div>
              <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
                {s.correct}/{s.total} correct
              </div>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-[22px] leading-none text-accent">
                {Math.round(s.pct * 100)}%
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent transition-transform group-hover:translate-x-0.5">
                Drill →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
