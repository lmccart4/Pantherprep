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
  accentColor,
  title = "Practice Your Weak Areas",
  limit = 3,
  minAttempts = 2,
  threshold = 0.7,
}: WeakSkillsCalloutProps) {
  const weak = computeWeakSkills(results, { minAttempts, threshold, limit });

  if (weak.length === 0) return null;

  return (
    <div
      className="mb-8 rounded-[18px] border p-6"
      style={{
        background: "rgba(15,15,22,.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: `${accentColor}30`,
        boxShadow: `0 4px 32px rgba(0,0,0,.2), 0 0 40px ${accentColor}10`,
      }}
    >
      <div
        className="mb-2 text-[11px] font-bold uppercase tracking-[2px]"
        style={{ color: accentColor }}
      >
        {title}
      </div>
      <p className="mb-5 text-sm text-text-secondary">
        Jump into adaptive practice on the skills that tripped you up the most. Each
        session pulls from the question pool keyed to your weakest spots.
      </p>
      <div className="flex flex-col gap-3">
        {weak.map((s) => (
          <Link
            key={s.taxonomyKey}
            href={`/skills/${course}/${s.taxonomyKey}`}
            className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[rgba(8,8,12,.5)] px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-[rgba(15,15,22,.7)]"
          >
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold text-white">
                {skillLabel(s.taxonomyKey)}
              </div>
              <div className="mt-0.5 text-[13px] text-text-muted">
                {s.correct}/{s.total} correct &middot; {Math.round(s.pct * 100)}%
              </div>
            </div>
            <span
              className="shrink-0 text-sm font-semibold transition-transform group-hover:translate-x-0.5"
              style={{ color: accentColor }}
            >
              Practice &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
