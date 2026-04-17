# Teacher/Admin Class Skill Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On `/skills/[course]`, make the tier filter reflect class-wide mastery for teachers (with class picker) and platform-wide mastery for admins, instead of the logged-in user's own mastery.

**Architecture:** Add a pure aggregator that combines multiple `AdaptiveProfile`s into the existing `AggregatedSkillData` shape per taxonomy key. Branch the `/skills` page's data fetch on `role`: students load their own profile (unchanged), teachers load their classes + selected class's students, admins load up to 200 platform-wide profiles. UI gets a class picker (teachers only) and a distribution-bar variant on each skill row for staff.

**Tech Stack:** Next.js 15 / React 19, Firebase Web SDK, Tailwind. No test framework installed — use `tsx` + `node:assert` for unit checks. Manual QA via `qa-student` + a second seeded teacher-owned class for integration verification.

**Spec:** `docs/superpowers/specs/2026-04-17-teacher-class-skill-distribution-design.md`

---

## File structure

- **Create**
  - `scripts/tests/skill-aggregation.test.mjs` — pure-function tests for `getAggregatedSkillData`
- **Modify**
  - `lib/skill-mapping.ts` — add `getAggregatedSkillData(profiles, key)` alongside existing `getProfileSkillData`
  - `components/skills/skill-catalog-page.tsx` — role-aware fetch (`profiles: AdaptiveProfile[]` + optional `classes`/`selectedClassId`)
  - `components/skills/skill-catalog.tsx` — accept `profiles[]` + role, render class picker for teachers, use aggregated data path for staff, relabel tier buttons for staff
  - `components/skills/skill-row.tsx` — add optional `distribution` prop rendering a 4-segment bar (weak/medium/strong/untouched) when present; existing student rendering untouched otherwise
  - `components/home/skills-card.tsx` — staff subtitle copy
- **No changes needed**
  - `firestore.rules` — `isStaff()` already grants read on `adaptiveProfile/{uid}`
  - `lib/adaptive/performance-service.ts` — `getAllAdaptiveProfiles(uids?)` already exists

Each file has one responsibility: pure aggregation in `skill-mapping.ts`, role-aware fetching in `skill-catalog-page.tsx`, role-aware rendering in `skill-catalog.tsx` and `skill-row.tsx`.

---

## Task 1: Aggregation helper + tests

**Files:**
- Modify: `lib/skill-mapping.ts` (add export below `getProfileSkillData`, around line 302)
- Create: `scripts/tests/skill-aggregation.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `scripts/tests/skill-aggregation.test.mjs`:

```js
// Run: npx tsx scripts/tests/skill-aggregation.test.mjs
// Exits non-zero on assertion failure.
import assert from "node:assert/strict";
import { getAggregatedSkillData } from "../../lib/skill-mapping.ts";

// Synthetic profile builder — only fills what the aggregator reads.
function profile(skillMap) {
  return {
    uid: "test",
    skills: Object.fromEntries(
      Object.entries(skillMap).map(([label, [correct, total]]) => [
        label,
        { correct, total, ease: 2.5, interval: 0, nextReview: "", errorPatterns: {}, lastSeen: null },
      ])
    ),
    domains: {},
    recommendations: [],
    weeklyStats: {},
  };
}

// Taxonomy key "linear_equations" has source labels including
// "Linear equations in 1 variable", "Linear equations", etc.
const KEY = "linear_equations";

// Case 1: empty profiles array → total 0, mastery 0
{
  const agg = getAggregatedSkillData([], KEY);
  assert.equal(agg.total, 0);
  assert.equal(agg.correct, 0);
  assert.equal(agg.mastery, 0);
}

// Case 2: single profile with attempts → same result as single-profile path
{
  const p = profile({ "Linear equations in 1 variable": [4, 5] });
  const agg = getAggregatedSkillData([p], KEY);
  assert.equal(agg.total, 5);
  assert.equal(agg.correct, 4);
  assert.equal(agg.mastery, 0.8);
}

// Case 3: multi-profile across different source labels that collapse to the same key
{
  const p1 = profile({ "Linear equations in 1 variable": [3, 4] });   // 3/4
  const p2 = profile({ "Linear equations":                [7, 10] }); // 7/10
  const p3 = profile({ "Multi-step equations":            [5, 6] });  // 5/6
  const agg = getAggregatedSkillData([p1, p2, p3], KEY);
  assert.equal(agg.total, 20);
  assert.equal(agg.correct, 15);
  assert.equal(agg.mastery, 0.75);
}

// Case 4: profiles missing the skill entirely don't blow up
{
  const p1 = profile({ "Linear equations": [2, 2] });
  const p2 = profile({ "Percentages":      [0, 3] }); // unrelated taxonomy key
  const agg = getAggregatedSkillData([p1, p2], KEY);
  assert.equal(agg.total, 2);
  assert.equal(agg.correct, 2);
  assert.equal(agg.mastery, 1);
}

// Case 5: unknown taxonomy key → empty aggregate, no throw
{
  const p = profile({ "Linear equations": [1, 1] });
  const agg = getAggregatedSkillData([p], "nonexistent_key");
  assert.equal(agg.total, 0);
}

console.log("skill-aggregation.test.mjs OK");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ~/pantherprep && npx tsx scripts/tests/skill-aggregation.test.mjs`
Expected: FAIL — `getAggregatedSkillData is not a function` (or similar, since the export does not yet exist).

- [ ] **Step 3: Implement `getAggregatedSkillData`**

Add this export to `lib/skill-mapping.ts` immediately after `getProfileSkillData` (near line 302, before `sourceToTaxonomyKey`):

```ts
/**
 * Aggregate a taxonomy skill across multiple profiles. Used by the staff
 * (teacher/admin) view of /skills to compute class-wide mastery. Sums correct
 * and total across every source label that maps to the taxonomy key, across
 * every profile passed in. Returns the same AggregatedSkillData shape that
 * getProfileSkillData returns, so downstream rendering code (tierOf, SkillRow)
 * works unchanged.
 *
 * Unlike getProfileSkillData, this helper does not attempt to aggregate
 * ease/interval/nextReview/lastSeen/errorPatterns across students — those
 * are per-student spaced-repetition fields with no meaningful class aggregate.
 * They are returned as empty defaults.
 */
export function getAggregatedSkillData(
  profiles: AdaptiveProfile[],
  taxonomyKey: string
): AggregatedSkillData {
  const sourceLabels = TAXONOMY_TO_SOURCES[taxonomyKey] ?? [];
  const empty: AggregatedSkillData = {
    correct: 0,
    total: 0,
    mastery: 0,
    ease: 2.5,
    interval: 0,
    nextReview: "",
    errorPatterns: {},
    lastSeen: null,
    sourceLabels,
  };
  if (sourceLabels.length === 0 || profiles.length === 0) return empty;

  let correct = 0;
  let total = 0;
  for (const profile of profiles) {
    if (!profile?.skills) continue;
    for (const label of sourceLabels) {
      const entry = profile.skills[label];
      if (!entry) continue;
      correct += entry.correct ?? 0;
      total += entry.total ?? 0;
    }
  }

  if (total === 0) return empty;
  return {
    ...empty,
    correct,
    total,
    mastery: correct / total,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ~/pantherprep && npx tsx scripts/tests/skill-aggregation.test.mjs`
Expected: PASS — prints `skill-aggregation.test.mjs OK` and exits 0.

- [ ] **Step 5: Commit**

```bash
cd ~/pantherprep
git add lib/skill-mapping.ts scripts/tests/skill-aggregation.test.mjs
git commit -m "feat(skills): add multi-profile aggregation helper

getAggregatedSkillData sums correct/total across multiple AdaptiveProfiles
for a given taxonomy key, returning the same shape as getProfileSkillData
so downstream rendering works unchanged. Used by teacher/admin class
distribution view.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Per-tier counts helper

**Files:**
- Modify: `lib/skill-mapping.ts` (add export below `getAggregatedSkillData`)
- Modify: `scripts/tests/skill-aggregation.test.mjs` (append tier-counts cases)

- [ ] **Step 1: Add failing test cases**

Append to `scripts/tests/skill-aggregation.test.mjs` just before the final `console.log`:

```js
// ---- getSkillTierCounts ----
import { getSkillTierCounts } from "../../lib/skill-mapping.ts";

// Case 6: mixed class — 1 strong (>=0.8), 1 medium (>=0.5 && <0.8), 1 weak (<0.5, but has attempts), 1 untouched
{
  const strong   = profile({ "Linear equations": [9, 10] });  // 0.9
  const medium   = profile({ "Linear equations": [6, 10] });  // 0.6
  const weak     = profile({ "Linear equations": [2, 10] });  // 0.2
  const untouched = profile({ "Percentages":     [5, 5] });    // no data on this key
  const counts = getSkillTierCounts([strong, medium, weak, untouched], KEY);
  assert.deepEqual(counts, { strong: 1, medium: 1, weak: 1, untouched: 1 });
}

// Case 7: boundary values. mastery === 0.8 → strong. mastery === 0.5 → medium. mastery === 0.499 → weak.
{
  const at08  = profile({ "Linear equations": [8, 10] });  // 0.8 exactly
  const at05  = profile({ "Linear equations": [5, 10] });  // 0.5 exactly
  const below = profile({ "Linear equations": [499, 1000] }); // 0.499
  const counts = getSkillTierCounts([at08, at05, below], KEY);
  assert.deepEqual(counts, { strong: 1, medium: 1, weak: 1, untouched: 0 });
}

// Case 8: empty array
{
  const counts = getSkillTierCounts([], KEY);
  assert.deepEqual(counts, { strong: 0, medium: 0, weak: 0, untouched: 0 });
}
```

- [ ] **Step 2: Run to verify failure**

Run: `cd ~/pantherprep && npx tsx scripts/tests/skill-aggregation.test.mjs`
Expected: FAIL — `getSkillTierCounts is not a function`.

- [ ] **Step 3: Implement `getSkillTierCounts`**

Add to `lib/skill-mapping.ts` immediately after `getAggregatedSkillData`:

```ts
export interface SkillTierCounts {
  strong: number;    // mastery >= 0.8
  medium: number;    // 0.5 <= mastery < 0.8
  weak: number;      // total > 0 && mastery < 0.5
  untouched: number; // total === 0 (no attempts on any source label for this key)
}

/**
 * Per-profile tier classification for a single taxonomy key. Thresholds match
 * the existing student-side tierOf() in skill-catalog.tsx (0.5 / 0.8).
 * Untouched = profile has no attempts on any source label mapping to the key.
 */
export function getSkillTierCounts(
  profiles: AdaptiveProfile[],
  taxonomyKey: string
): SkillTierCounts {
  const counts: SkillTierCounts = { strong: 0, medium: 0, weak: 0, untouched: 0 };
  const sourceLabels = TAXONOMY_TO_SOURCES[taxonomyKey] ?? [];
  if (sourceLabels.length === 0) return counts;

  for (const profile of profiles) {
    let correct = 0;
    let total = 0;
    if (profile?.skills) {
      for (const label of sourceLabels) {
        const entry = profile.skills[label];
        if (!entry) continue;
        correct += entry.correct ?? 0;
        total += entry.total ?? 0;
      }
    }
    if (total === 0) {
      counts.untouched += 1;
      continue;
    }
    const mastery = correct / total;
    if (mastery >= 0.8) counts.strong += 1;
    else if (mastery >= 0.5) counts.medium += 1;
    else counts.weak += 1;
  }
  return counts;
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `cd ~/pantherprep && npx tsx scripts/tests/skill-aggregation.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd ~/pantherprep
git add lib/skill-mapping.ts scripts/tests/skill-aggregation.test.mjs
git commit -m "feat(skills): add per-profile tier classifier for distribution bar

getSkillTierCounts buckets profiles into strong/medium/weak/untouched for
one taxonomy key. Drives the distribution bar on the staff-side SkillRow.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Role-aware data fetch in `SkillCatalogPageClient`

**Files:**
- Modify: `components/skills/skill-catalog-page.tsx`

Rewrites the fetch to branch on role and pass a `profiles: AdaptiveProfile[]` array (plus optional classes + selectedClassId for teachers) down to `SkillCatalog`. Student path unchanged semantically (just wraps the single profile in a one-element array).

- [ ] **Step 1: Replace the file contents**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { SkillCatalog } from "@/components/skills/skill-catalog";
import { useAuth } from "@/contexts/auth-context";
import {
  getAdaptiveProfile,
  getAllAdaptiveProfiles,
  type AdaptiveProfile,
} from "@/lib/adaptive/performance-service";
import { getTeacherClasses } from "@/lib/firestore";
import type { ClassDoc } from "@/types/firestore";

interface SkillCatalogPageClientProps {
  course: string;
}

const CLASS_ID_STORAGE_KEY = "pp.skills.classId";

export function SkillCatalogPageClient({ course }: SkillCatalogPageClientProps) {
  const { user, role } = useAuth();
  const [profiles, setProfiles] = useState<AdaptiveProfile[]>([]);
  const [classes, setClasses] = useState<(ClassDoc & { id: string })[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("__all__");
  const [loading, setLoading] = useState(true);

  // On mount for teachers: read persisted class selection.
  useEffect(() => {
    if (role !== "teacher") return;
    try {
      const stored = localStorage.getItem(CLASS_ID_STORAGE_KEY);
      if (stored) setSelectedClassId(stored);
    } catch {
      // localStorage unavailable — fine, keep default.
    }
  }, [role]);

  // Persist teacher class selection.
  useEffect(() => {
    if (role !== "teacher") return;
    try {
      localStorage.setItem(CLASS_ID_STORAGE_KEY, selectedClassId);
    } catch {
      // ignore
    }
  }, [role, selectedClassId]);

  // Load classes for teachers.
  useEffect(() => {
    if (role !== "teacher" || !user?.uid) return;
    getTeacherClasses(user.uid)
      .then(setClasses)
      .catch(() => setClasses([]));
  }, [role, user?.uid]);

  // Compute the uid list to fetch profiles for.
  const targetUids = useMemo<string[] | null>(() => {
    if (role === "student") return user?.uid ? [user.uid] : [];
    if (role === "teacher") {
      if (classes.length === 0) return [];
      if (selectedClassId === "__all__") {
        const set = new Set<string>();
        for (const c of classes) for (const uid of c.students ?? []) set.add(uid);
        return Array.from(set);
      }
      const chosen = classes.find((c) => c.id === selectedClassId);
      return chosen?.students ?? [];
    }
    // admin → null signals "fetch all platform-wide (bounded)"
    if (role === "admin") return null;
    return [];
  }, [role, user?.uid, classes, selectedClassId]);

  // Fetch profiles whenever targetUids changes.
  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);

    // Student: use the single-profile fetch to avoid a fan-out Promise.all of size 1.
    if (role === "student") {
      getAdaptiveProfile(user.uid)
        .then((p) => setProfiles(p ? [p] : []))
        .finally(() => setLoading(false));
      return;
    }

    // Teacher with no classes loaded yet, or empty target set.
    if (Array.isArray(targetUids)) {
      if (targetUids.length === 0) {
        setProfiles([]);
        setLoading(false);
        return;
      }
      getAllAdaptiveProfiles(targetUids)
        .then(setProfiles)
        .finally(() => setLoading(false));
      return;
    }

    // Admin (targetUids === null): platform-wide.
    getAllAdaptiveProfiles()
      .then((all) => {
        if (all.length >= 200) {
          // eslint-disable-next-line no-console
          console.warn(
            "[skills] Admin view hit the 200-profile cap; some students are not included."
          );
        }
        setProfiles(all);
      })
      .finally(() => setLoading(false));
  }, [role, user?.uid, targetUids]);

  return (
    <div className="min-h-screen">
      <TopBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <p className="text-sm text-text-muted">Loading catalog…</p>
        ) : (
          <SkillCatalog
            course={course}
            profiles={profiles}
            role={role}
            classes={role === "teacher" ? classes : undefined}
            selectedClassId={role === "teacher" ? selectedClassId : undefined}
            onClassChange={role === "teacher" ? setSelectedClassId : undefined}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify types compile**

Run: `cd ~/pantherprep && npx tsc --noEmit`
Expected: errors only from `SkillCatalog` (props changed) and `SkillRow` (distribution prop not yet added). No errors from `skill-catalog-page.tsx` itself. These downstream errors are resolved in Tasks 4–5.

- [ ] **Step 3: Do NOT commit yet** — the page will not render until Tasks 4–5 land. Move directly to Task 4.

---

## Task 4: `SkillCatalog` — props, class picker, staff aggregation path

**Files:**
- Modify: `components/skills/skill-catalog.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
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

  const skillsInDomain = taxonomy[activeDomain] ?? [];

  // For students: data is their own profile (profiles[0]).
  // For staff: data is the aggregate across profiles; distribution is per-profile tier counts.
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
            className="rounded-radius-sm border border-border-default bg-bg-surface px-3 py-1.5 text-text-secondary outline-none focus:border-panther-red"
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
                  ? "bg-panther-red text-white"
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
                  ? "bg-panther-red text-white"
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
```

- [ ] **Step 2: Export `UserRole` from the auth context if not already exported**

Check `contexts/auth-context.tsx` — if `UserRole` is not exported, add `export` in front of its declaration. Grep first:

```bash
cd ~/pantherprep && grep -n "UserRole" contexts/auth-context.tsx
```

If the match shows `type UserRole` without `export`, edit to make it `export type UserRole`. If it's already exported, skip this step.

- [ ] **Step 3: Type-check**

Run: `cd ~/pantherprep && npx tsc --noEmit`
Expected: remaining errors only in `skill-row.tsx` (new `distribution` prop). Task 5 resolves them.

- [ ] **Step 4: Do NOT commit yet** — wait for Task 5.

---

## Task 5: `SkillRow` — distribution bar variant

**Files:**
- Modify: `components/skills/skill-row.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
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

function DistributionBar({ counts }: { counts: SkillTierCounts }) {
  const total = counts.strong + counts.medium + counts.weak + counts.untouched;
  if (total === 0) {
    return <div className="text-xs text-text-muted">No student data yet</div>;
  }
  const pct = (n: number) => `${(n / total) * 100}%`;
  const tooltip =
    `${counts.weak} struggling · ${counts.medium} developing · ` +
    `${counts.strong} proficient · ${counts.untouched} untouched`;
  return (
    <div
      className="flex h-2 w-28 overflow-hidden rounded-full bg-bg-surface"
      title={tooltip}
      aria-label={tooltip}
    >
      {counts.weak > 0      && <div className="bg-red-400"     style={{ width: pct(counts.weak) }} />}
      {counts.medium > 0    && <div className="bg-amber-400"   style={{ width: pct(counts.medium) }} />}
      {counts.strong > 0    && <div className="bg-emerald-400" style={{ width: pct(counts.strong) }} />}
      {counts.untouched > 0 && <div className="bg-slate-500"   style={{ width: pct(counts.untouched) }} />}
    </div>
  );
}

export function SkillRow({ taxonomyKey, data, course, distribution }: SkillRowProps) {
  const href = `/skills/${course}/${taxonomyKey}`;
  const label = skillLabel(taxonomyKey);
  const hasData = data.total > 0;
  const percent = hasData ? Math.round(data.mastery * 100) : null;

  const isStaffView = !!distribution;
  const totalStudents = distribution
    ? distribution.strong + distribution.medium + distribution.weak + distribution.untouched
    : 0;

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
          {isStaffView
            ? `${totalStudents} student${totalStudents === 1 ? "" : "s"}`
            : hasData
              ? `${data.correct}/${data.total} correct`
              : "No data yet"}
        </div>
      </div>
      {isStaffView ? (
        <DistributionBar counts={distribution!} />
      ) : (
        <div className={`w-14 text-right font-mono ${tierTextColor(data.mastery, data.total)}`}>
          {percent != null ? `${percent}%` : "—"}
        </div>
      )}
      <span className="text-text-muted">›</span>
    </Link>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `cd ~/pantherprep && npx tsc --noEmit`
Expected: PASS (zero errors).

- [ ] **Step 3: Lint**

Run: `cd ~/pantherprep && npm run lint`
Expected: PASS.

- [ ] **Step 4: Commit Tasks 3–5 together**

```bash
cd ~/pantherprep
git add components/skills/skill-catalog-page.tsx components/skills/skill-catalog.tsx components/skills/skill-row.tsx contexts/auth-context.tsx
git commit -m "feat(skills): class-wide distribution on /skills for teachers and admins

- SkillCatalogPageClient branches fetch on role: student (own profile),
  teacher (selected class's students, persisted to localStorage), admin
  (platform-wide up to 200).
- SkillCatalog adds a class picker for teachers, relabels tier buttons
  (Struggling / Developing / Proficient) for staff, and feeds aggregated
  data + per-profile tier counts to SkillRow.
- SkillRow gains an optional distribution prop rendering a 4-segment
  bar (weak/medium/strong/untouched) with hover tooltip.
- Empty state when a teacher has no classes.

Fixes the long-standing issue where teachers saw every skill as Weak
because the filter used their own (empty) practice profile.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Home page subtitle copy for staff

**Files:**
- Modify: `components/home/skills-card.tsx` (the `pickSubtitle` function at line 15)

- [ ] **Step 1: Replace `pickSubtitle`**

Replace the entire `pickSubtitle` function with:

```ts
function pickSubtitle(
  role: SkillsCardProps["role"],
  profile: AdaptiveProfile | null,
  loaded: boolean
): string {
  if (role === "admin") {
    return "Platform-wide skill distribution across all students.";
  }
  if (role === "teacher") {
    return "See how your class is doing on every skill. Click any skill for a breakdown.";
  }
  if (!loaded || !profile) {
    return "49 skills across SAT, PSAT/NMSQT, and PSAT 8/9. Start a topic without taking a full test.";
  }
  const recs = profile.recommendations ?? [];
  if (recs.length === 0) {
    return "Every skill you've practiced is looking strong. Browse the full library to explore new areas.";
  }
  const named = recs
    .slice(0, 2)
    .map((r) => (r.skill ? skillLabel(r.skill) : ""))
    .filter(Boolean);
  if (named.length === 0) {
    return `You have ${recs.length} skills that could use work. Start with your weakest areas.`;
  }
  const tail = recs.length > named.length ? ", and more" : "";
  return `You have ${recs.length} skills that could use work — ${named.join(", ")}${tail}.`;
}
```

- [ ] **Step 2: Type-check + lint**

Run: `cd ~/pantherprep && npx tsc --noEmit && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
cd ~/pantherprep
git add components/home/skills-card.tsx
git commit -m "feat(skills): staff-specific home page subtitle for skills card

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Manual QA and deploy

**Files:** none — runtime verification.

- [ ] **Step 1: Run unit tests one more time**

Run: `cd ~/pantherprep && npx tsx scripts/tests/skill-aggregation.test.mjs`
Expected: `skill-aggregation.test.mjs OK`.

- [ ] **Step 2: Dev server smoke — student path unchanged**

Run: `cd ~/pantherprep && npm run dev` (background).
In a browser, log in as `qa-student@lachlan.internal`, go to `/skills/sat-math`. Verify:
- Tier buttons show lowercase `weak / medium / strong / all`
- Rows render with single `%` readout on the right
- Distribution bar is NOT visible
- Clicking Medium (if qa-student has ≥0.5 mastery on anything) shows non-empty results

- [ ] **Step 3: Dev server smoke — teacher path**

Log out, log in as Luke (`lucamccarthy@paps.net`), go to `/skills/sat-math`. Verify:
- Tier buttons show `All / Struggling / Developing / Proficient`
- Class picker appears above tier buttons
- If Luke has at least one class with qa-student in it, rows show a 4-segment bar on the right and a "N students" subtitle
- Tooltip on the bar matches `"X struggling · Y developing · Z proficient · W untouched"`
- Switching class in the picker reloads profile data and persists across page refresh
- With "All my classes (combined)" selected, counts reflect the union of students across Luke's classes

- [ ] **Step 4: Dev server smoke — empty-state**

Log in as a teacher account with zero classes (create a throwaway teacher in Firestore if needed, or temporarily remove Luke from all classes in a local test). Verify the empty-state card appears with the CTA copy and no tier filter/domain tabs are rendered.

- [ ] **Step 5: Admin path (if admin account available)**

If no admin account exists, skip and note in the commit. Otherwise verify:
- No class picker
- Subtitle says `"Platform-wide skill distribution across all students."`
- Distribution bars reflect counts across all adaptiveProfile docs (up to 200)
- Console warning fires in DevTools if the 200 cap is hit

- [ ] **Step 6: Deploy via `/deploy-verify`**

Per project rule — always build before deploying:

```bash
cd ~/pantherprep && npm run build && firebase deploy --only hosting
```

Then run `/deploy-verify pantherprep "Teacher class-wide skill distribution on /skills"` to trigger the Link + Pixel verification chain.

- [ ] **Step 7: Log activity + mark task done**

```bash
node ~/Lachlan/projects/mission-control/log-activity.cjs kit "Shipped teacher/admin class-wide skill distribution on pantherprep /skills" 2>/dev/null || true
```

No Kanban task tracked for this work, so skip `complete-task.cjs`.

---

## Self-review

- **Spec coverage:**
  - Class picker → Task 4
  - Role-aware fetch (student / teacher / admin) → Task 3
  - Aggregated tier thresholds (0.5 / 0.8) → Task 4 (`tierOf` unchanged) + Task 2 tests at boundaries
  - Distribution bar + tooltip → Task 5
  - Staff tier relabeling → Task 4
  - Subtitle copy update → Task 6
  - Empty state (teacher, no classes) → Task 4
  - Admin 200 cap warning → Task 3
  - No rule changes needed → confirmed in spec + omitted from plan
  - Manual QA → Task 7
  - Out-of-scope items (student drill-down, Cloud Function pre-aggregation, admin pagination, time-windowed distributions) → intentionally absent
- **Placeholder scan:** no TBDs or "handle edge cases" hand-waves; every code step has full code.
- **Type consistency:** `SkillTierCounts` used identically in Tasks 2, 4, 5. `getAggregatedSkillData(profiles, key)` signature matches between Task 1 definition and Task 4 call site. `distribution?: SkillTierCounts` prop on `SkillRow` matches between Tasks 4 and 5.
