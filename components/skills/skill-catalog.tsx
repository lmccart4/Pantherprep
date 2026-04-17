"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { SkillRow } from "./skill-row";
import {
  MATH_SKILLS,
  RW_SKILLS,
} from "@/lib/adaptive/adaptive-engine";
import {
  getProfileSkillData,
  getAggregatedSkillData,
  getSkillTierCounts,
  type AggregatedSkillData,
  type SkillTierCounts,
} from "@/lib/skill-mapping";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { ClassDoc } from "@/types/firestore";
import type { UserRole } from "@/contexts/auth-context";

type TierFilter = "all" | "weak" | "medium" | "strong";

const COURSES: { value: string; label: string }[] = [
  { value: "sat-math", label: "SAT Math" },
  { value: "sat-rw", label: "SAT R&W" },
  { value: "nmsqt-math", label: "NMSQT Math" },
  { value: "nmsqt-rw", label: "NMSQT R&W" },
  { value: "psat89-math", label: "PSAT 8/9 Math" },
  { value: "psat89-rw", label: "PSAT 8/9 R&W" },
];

const STAFF_TIER_LABELS: Record<TierFilter, string> = {
  all: "All",
  weak: "Struggling",
  medium: "Developing",
  strong: "Proficient",
};

interface SkillCatalogProps {
  course: string;
  profiles: AdaptiveProfile[];
  role: UserRole;
  classes?: (ClassDoc & { id: string })[];
  selectedClassId?: string;
  onClassChange?: (id: string) => void;
}

function tierOf(data: AggregatedSkillData): TierFilter {
  if (data.total === 0) return "weak";
  if (data.mastery >= 0.8) return "strong";
  if (data.mastery >= 0.5) return "medium";
  return "weak";
}

export function SkillCatalog({
  course,
  profiles,
  role,
  classes,
  selectedClassId,
  onClassChange,
}: SkillCatalogProps) {
  const router = useRouter();
  const isStaff = role === "teacher" || role === "admin";
  const taxonomy: Record<string, string[]> = useMemo(
    () => (course.includes("math") ? MATH_SKILLS : RW_SKILLS),
    [course]
  );
  const domains = Object.keys(taxonomy);
  const [activeDomain, setActiveDomain] = useState<string>(domains[0] ?? "");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");

  const skillsInDomain = useMemo(
    () => taxonomy[activeDomain] ?? [],
    [taxonomy, activeDomain]
  );

  const aggregated = useMemo(
    () =>
      skillsInDomain.map((key) => {
        const data = isStaff
          ? getAggregatedSkillData(profiles, key)
          : getProfileSkillData(profiles[0] ?? null, key);
        const distribution: SkillTierCounts | undefined = isStaff
          ? getSkillTierCounts(profiles, key)
          : undefined;
        return { key, data, distribution };
      }),
    [skillsInDomain, profiles, isStaff]
  );

  const filtered = useMemo(
    () =>
      aggregated.filter(({ data }) => {
        if (tierFilter === "all") return true;
        return tierOf(data) === tierFilter;
      }),
    [aggregated, tierFilter]
  );

  const courseLabel = COURSES.find((c) => c.value === course)?.label ?? course;
  const teacherHasNoClasses = role === "teacher" && (classes?.length ?? 0) === 0;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb + course switcher */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs text-text-muted">
          <Link href="/dashboard" className="hover:text-text-secondary">
            Dashboard
          </Link>
          {" / "}
          <span className="text-text-secondary">Skills</span>
          {" / "}
          <span className="text-text-primary">{courseLabel}</span>
        </div>
        <select
          value={course}
          onChange={(e) => router.push(`/skills/${e.target.value}`)}
          className=" border border-border-default bg-bg-surface px-3 py-1.5 text-xs text-text-secondary outline-none focus:border-panther-red"
        >
          {COURSES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <h1 className="mb-1 font-display text-3xl tracking-[0.02em] text-ink sm:text-[2.4rem]">
        Skill Catalog
      </h1>
      <p className="mb-6 text-sm text-text-muted">
        {isStaff
          ? `Class-wide mastery for ${courseLabel}. Click any skill to see details.`
          : `Browse every skill for ${courseLabel}. Click a skill to see details and practice.`}
      </p>

      {/* Teacher class picker */}
      {role === "teacher" && !teacherHasNoClasses && (
        <div className="mb-4 flex items-center gap-2 text-xs text-text-muted">
          <span>Class:</span>
          <select
            value={selectedClassId ?? "__all__"}
            onChange={(e) => onClassChange?.(e.target.value)}
            className=" border border-border-default bg-bg-surface px-3 py-1.5 text-text-secondary outline-none focus:border-panther-red"
          >
            <option value="__all__">All my classes (combined)</option>
            {classes!.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Empty state: teacher with no classes */}
      {teacherHasNoClasses && (
        <GlassCard className="mb-6">
          <p className="text-sm text-text-muted">
            You don’t have any classes yet. Create one from the dashboard to see class-wide skill distribution here.
          </p>
        </GlassCard>
      )}

      {/* Mastery tier filter */}
      {!teacherHasNoClasses && (
        <div className="mb-4 flex flex-wrap gap-2">
          {(["all", "weak", "medium", "strong"] as TierFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                t === tierFilter
                  ? "bg-panther-red text-ink"
                  : "border border-border-primary bg-bg-secondary text-text-muted hover:text-text-secondary"
              }`}
            >
              {isStaff ? STAFF_TIER_LABELS[t] : t}
            </button>
          ))}
        </div>
      )}

      {/* Domain tab strip */}
      {!teacherHasNoClasses && (
        <div className="mb-5 flex flex-wrap gap-2">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                d === activeDomain
                  ? "bg-panther-red text-ink"
                  : "border border-border-primary bg-bg-secondary text-text-muted hover:text-text-secondary"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Skill rows */}
      {!teacherHasNoClasses && (filtered.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-text-muted">
            No skills match the current filter.{" "}
            <button
              onClick={() => setTierFilter("all")}
              className="text-panther-red hover:underline"
            >
              Clear filters
            </button>
          </p>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(({ key, data, distribution }) => (
            <SkillRow
              key={key}
              taxonomyKey={key}
              data={data}
              course={course}
              distribution={distribution}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
