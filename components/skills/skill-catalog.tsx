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
  type AggregatedSkillData,
} from "@/lib/skill-mapping";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";

type TierFilter = "all" | "weak" | "medium" | "strong";

const COURSES: { value: string; label: string }[] = [
  { value: "sat-math", label: "SAT Math" },
  { value: "sat-rw", label: "SAT R&W" },
  { value: "nmsqt-math", label: "NMSQT Math" },
  { value: "nmsqt-rw", label: "NMSQT R&W" },
  { value: "psat89-math", label: "PSAT 8/9 Math" },
  { value: "psat89-rw", label: "PSAT 8/9 R&W" },
];

interface SkillCatalogProps {
  course: string;
  profile: AdaptiveProfile | null;
}

function tierOf(data: AggregatedSkillData): TierFilter {
  if (data.total === 0) return "weak";
  if (data.mastery >= 0.8) return "strong";
  if (data.mastery >= 0.5) return "medium";
  return "weak";
}

export function SkillCatalog({ course, profile }: SkillCatalogProps) {
  const router = useRouter();
  const taxonomy: Record<string, string[]> = useMemo(
    () => (course.includes("math") ? MATH_SKILLS : RW_SKILLS),
    [course]
  );
  const domains = Object.keys(taxonomy);
  const [activeDomain, setActiveDomain] = useState<string>(domains[0] ?? "");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");

  const skillsInDomain = taxonomy[activeDomain] ?? [];
  const aggregated = useMemo(
    () =>
      skillsInDomain.map((key) => ({
        key,
        data: getProfileSkillData(profile, key),
      })),
    [skillsInDomain, profile]
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
          className="rounded-radius-sm border border-border-default bg-bg-surface px-3 py-1.5 text-xs text-text-secondary outline-none focus:border-panther-red"
        >
          {COURSES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <h1 className="mb-1 font-display text-3xl tracking-[0.02em] text-white sm:text-[2.4rem]">
        Skill Catalog
      </h1>
      <p className="mb-6 text-sm text-text-muted">
        Browse every skill for {courseLabel}. Click a skill to see details and practice.
      </p>

      {/* Mastery tier filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "weak", "medium", "strong"] as TierFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => setTierFilter(t)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
              t === tierFilter
                ? "bg-panther-red text-white"
                : "border border-border-primary bg-bg-secondary text-text-muted hover:text-text-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Domain tab strip */}
      <div className="mb-5 flex flex-wrap gap-2">
        {domains.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDomain(d)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              d === activeDomain
                ? "bg-panther-red text-white"
                : "border border-border-primary bg-bg-secondary text-text-muted hover:text-text-secondary"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Skill rows */}
      {filtered.length === 0 ? (
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
          {filtered.map(({ key, data }) => (
            <SkillRow key={key} taxonomyKey={key} data={data} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
