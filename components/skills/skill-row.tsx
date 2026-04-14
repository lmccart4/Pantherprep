"use client";

import Link from "next/link";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import type { AggregatedSkillData } from "@/lib/skill-mapping";

interface SkillRowProps {
  taxonomyKey: string;
  data: AggregatedSkillData;
  course: string;
}

function tierColor(mastery: number, total: number): string {
  if (total === 0) return "border-l-slate-500";
  if (mastery >= 0.8) return "border-l-emerald-400";
  if (mastery >= 0.6) return "border-l-lime-400";
  if (mastery >= 0.4) return "border-l-amber-400";
  if (mastery >= 0.2) return "border-l-orange-400";
  return "border-l-red-400";
}

function tierTextColor(mastery: number, total: number): string {
  if (total === 0) return "text-text-muted";
  if (mastery >= 0.8) return "text-emerald-400";
  if (mastery >= 0.6) return "text-lime-400";
  if (mastery >= 0.4) return "text-amber-400";
  if (mastery >= 0.2) return "text-orange-400";
  return "text-red-400";
}

export function SkillRow({ taxonomyKey, data, course }: SkillRowProps) {
  const href = `/skills/${course}/${taxonomyKey}`;
  const label = skillLabel(taxonomyKey);
  const hasData = data.total > 0;
  const percent = hasData ? Math.round(data.mastery * 100) : null;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg border border-border-primary bg-bg-secondary border-l-[3px] ${tierColor(
        data.mastery,
        data.total
      )} px-4 py-3 text-sm transition hover:border-panther-red/30`}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-text-primary">{label}</div>
        <div className="truncate text-xs text-text-muted">
          {hasData ? `${data.correct}/${data.total} correct` : "No data yet"}
        </div>
      </div>
      <div className={`w-14 text-right font-mono ${tierTextColor(data.mastery, data.total)}`}>
        {percent != null ? `${percent}%` : "—"}
      </div>
      <span className="text-text-muted">›</span>
    </Link>
  );
}
