"use client";

import Link from "next/link";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import type { AggregatedSkillData, SkillTierCounts } from "@/lib/skill-mapping";

interface SkillRowProps {
  taxonomyKey: string;
  data: AggregatedSkillData;
  course: string;
  /**
   * When provided, renders a 4-segment distribution bar (weak/medium/strong/untouched)
   * instead of the single mastery % readout. Used by the teacher/admin view.
   */
  distribution?: SkillTierCounts;
}

function tierMeta(mastery: number, total: number): { bar: string; text: string; label: string } {
  if (total === 0) return { bar: "bg-ink-4", text: "text-ink-3", label: "Untested" };
  if (mastery >= 0.8) return { bar: "bg-green", text: "text-green", label: "Mastered" };
  if (mastery >= 0.5) return { bar: "bg-amber", text: "text-amber", label: "On track" };
  return { bar: "bg-accent", text: "text-accent", label: "Needs work" };
}

function DistributionBar({ counts }: { counts: SkillTierCounts }) {
  const total = counts.strong + counts.medium + counts.weak + counts.untouched;
  if (total === 0) {
    return (
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
        No student data yet
      </div>
    );
  }
  const pct = (n: number) => `${(n / total) * 100}%`;
  const tooltip =
    `${counts.weak} struggling · ${counts.medium} developing · ` +
    `${counts.strong} proficient · ${counts.untouched} untouched`;
  return (
    <div
      className="flex h-[6px] w-full border border-ink"
      title={tooltip}
      aria-label={tooltip}
    >
      {counts.weak > 0 && <div className="bg-accent" style={{ width: pct(counts.weak) }} />}
      {counts.medium > 0 && <div className="bg-amber" style={{ width: pct(counts.medium) }} />}
      {counts.strong > 0 && <div className="bg-green" style={{ width: pct(counts.strong) }} />}
      {counts.untouched > 0 && <div className="bg-ink-4" style={{ width: pct(counts.untouched) }} />}
    </div>
  );
}

export function SkillRow({ taxonomyKey, data, course, distribution }: SkillRowProps) {
  const href = `/skills/${course}/${taxonomyKey}`;
  const label = skillLabel(taxonomyKey);
  const hasData = data.total > 0;
  const percent = hasData ? Math.round(data.mastery * 100) : null;
  const meta = tierMeta(data.mastery, data.total);

  const isStaffView = !!distribution;
  const totalStudents = distribution
    ? distribution.strong + distribution.medium + distribution.weak + distribution.untouched
    : 0;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 border-2 border-ink bg-paper-card p-4 transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-ink)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[18px] leading-tight text-ink">{label}</h3>
        {isStaffView ? null : (
          <div className={`font-display text-[22px] leading-none ${meta.text}`}>
            {percent != null ? `${percent}%` : "—"}
          </div>
        )}
      </div>

      {isStaffView ? (
        <div className="flex flex-col gap-2">
          <DistributionBar counts={distribution!} />
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
            {totalStudents} student{totalStudents === 1 ? "" : "s"}
          </div>
        </div>
      ) : (
        <>
          <div className="h-[5px] w-full border border-ink bg-paper">
            <div
              className={`h-full ${meta.bar}`}
              style={{ width: hasData ? `${Math.max(4, Math.round(data.mastery * 100))}%` : "0%" }}
            />
          </div>
          <div className="flex items-baseline justify-between border-t border-dashed border-rule-hair pt-2">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
              {hasData ? `${data.total} attempts` : "No data yet"}
            </div>
            <div className={`font-body text-[12px] italic ${meta.text}`}>
              {meta.label}
            </div>
          </div>
        </>
      )}
    </Link>
  );
}
