"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { SkillRow } from "./skill-row";
import {
  MATH_SKILLS,
  RW_SKILLS,
  filterSkillsForCourse,
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
  const taxonomy: Record<string, string[]> = useMemo(() => {
    const base = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
    return Object.fromEntries(
      Object.entries(base).map(([domain, skills]) => [
        domain,
        filterSkillsForCourse(skills, course),
      ])
    );
  }, [course]);
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

  const totalSkills = aggregated.length;
  const totalDomains = domains.length;

  return (
    <div className="mx-auto max-w-[1240px]">
      {/* Breadcrumb */}
      <div className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
        <Link href="/dashboard" className="hover:text-accent">Dashboard</Link>
        <span className="mx-2 text-ink-4">/</span>
        <span>Skills</span>
        <span className="mx-2 text-ink-4">/</span>
        <span className="text-ink">{courseLabel}</span>
      </div>

      {/* Masthead */}
      <header className="mb-8 border-b-2 border-ink pb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-baseline gap-3">
              <span className="bg-accent px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent-fg">
                Skills Library
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
                {totalSkills} skills · {totalDomains} domains · {courseLabel}
              </span>
            </div>
            <h1 className="font-display text-[clamp(44px,5vw,72px)] leading-[0.95] text-ink">
              The full{" "}
              <em className="text-accent" style={{ fontStyle: "italic" }}>
                index
              </em>
              .
            </h1>
            <p className="mt-4 max-w-xl font-body text-[15px] italic leading-[1.55] text-ink-2">
              {isStaff
                ? `Class-wide mastery for ${courseLabel}. Click any tile to open the skill article and drill set.`
                : `Every skill ${courseLabel} tests, grouped by domain and ranked by your mastery. Click any tile to open its article and drill set.`}
            </p>
          </div>
          <select
            value={course}
            onChange={(e) => router.push(`/skills/${e.target.value}`)}
            className="border-2 border-ink bg-paper-card px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink outline-none"
          >
            {COURSES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Teacher class picker */}
      {role === "teacher" && !teacherHasNoClasses && (
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
            Class
          </span>
          <select
            value={selectedClassId ?? "__all__"}
            onChange={(e) => onClassChange?.(e.target.value)}
            className="border-2 border-ink bg-paper-card px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink outline-none"
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
        <div className="card-paper mb-6 p-6">
          <p className="font-body text-[15px] italic text-ink-2">
            You don&rsquo;t have any classes yet. Create one from the dashboard to see class-wide skill distribution here.
          </p>
        </div>
      )}

      {/* Mastery tier filter */}
      {!teacherHasNoClasses && (
        <div className="mb-5 flex flex-wrap gap-2">
          {(["all", "weak", "medium", "strong"] as TierFilter[]).map((t) => {
            const active = t === tierFilter;
            const label = isStaff ? STAFF_TIER_LABELS[t] : t;
            return (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`border-2 border-ink px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "bg-ink text-paper"
                    : "bg-paper-card text-ink hover:bg-ink hover:text-paper"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Domain tab strip */}
      {!teacherHasNoClasses && (
        <div className="mb-6 flex flex-wrap gap-2 border-b border-rule-hair pb-4">
          {domains.map((d) => {
            const active = d === activeDomain;
            return (
              <button
                key={d}
                onClick={() => setActiveDomain(d)}
                className={`border-2 border-ink px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "bg-accent text-accent-fg"
                    : "bg-paper-card text-ink hover:bg-ink hover:text-paper"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      )}

      {/* Domain section heading */}
      {!teacherHasNoClasses && activeDomain && (
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-[clamp(26px,3vw,40px)] leading-tight text-ink">
            {activeDomain}{" "}
            <em className="text-accent" style={{ fontStyle: "italic" }}>
              · {filtered.length} {filtered.length === 1 ? "skill" : "skills"}
            </em>
          </h2>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
            {tierFilter === "all" ? "All tiers" : `Filter · ${isStaff ? STAFF_TIER_LABELS[tierFilter] : tierFilter}`}
          </div>
        </div>
      )}

      {/* Skill rows */}
      {!teacherHasNoClasses && (filtered.length === 0 ? (
        <div className="card-paper p-6">
          <p className="font-body text-[15px] italic text-ink-2">
            No skills match the current filter.{" "}
            <button
              onClick={() => setTierFilter("all")}
              className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent hover:underline"
            >
              Clear filters →
            </button>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
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
