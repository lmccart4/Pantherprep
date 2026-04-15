# PantherPrep Skill Catalog Discoverability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three entry points (top-bar link, home card, `/skills` root picker) so students can reach the skill catalog without needing to finish a test first.

**Architecture:** Pure additive UI on top of existing skill catalog routes. One shared type-map extraction (`lib/test-types.ts`), one small helper in `lib/skill-mapping.ts`, three new components, two edits to existing files. No Firestore schema changes, no new indexes, no migrations.

**Tech Stack:** Next.js 15 (app router), React 18, TypeScript, Tailwind CSS, Firebase Auth + Firestore (existing hooks, no new deps).

**Spec:** `docs/superpowers/specs/2026-04-15-pantherprep-skill-catalog-discoverability-design.md` (commit `01044b8`).

---

## Verification stack

Pantherprep has **no test framework installed** (verified: no vitest/jest/playwright config, no test files). Verification is:
1. `npx tsc --noEmit` after each task (type-check)
2. `npm run build` once before deploy (catches static-generation issues)
3. `/deploy-verify pantherprep "..."` after deploy (Link integration + Pixel visual, the same chain used throughout this session)

Unit tests are explicitly out of scope per the spec — do not add them.

## Deviation from spec — noted upfront

Spec §3 "Data source" says `/home` already loads `adaptiveProfile` for the logged-in user. That is **not true**. `getAdaptiveProfile` is imported in `app/(authenticated)/home/page.tsx` at line 15 but only called at line 191 inside a teacher-flow helper that inspects individual students — never for the authenticated user's own profile. To keep the scope of this task tight and avoid touching `/home`'s main useEffect chain, **`<SkillsCard />` fetches its own adaptive profile** via the same `useAuth() + useEffect → getAdaptiveProfile(uid)` pattern used by `components/skills/skill-detail-page.tsx`. Consequence: a ~300ms flicker from neutral-fallback copy to personalized copy on first render of `/home`, acceptable. The same applies to `<SkillRootPicker />`.

## File inventory

**New:**
- `lib/test-types.ts` — shared `TESTS` color map + `COURSE_ROUTES` + new `TEST_COURSES` array
- `components/skills/skill-root-picker.tsx` — 6-tile picker client component
- `app/(authenticated)/skills/page.tsx` — new `/skills` root route (thin server wrapper)
- `components/home/skills-card.tsx` — home-page SkillsCard with copy variants

**Modified:**
- `lib/skill-mapping.ts` — append `getSkillCountForCourse` helper
- `components/layout/top-bar.tsx` — add Skills link + `usePathname` active state
- `app/(authenticated)/home/page.tsx` — switch `TESTS`/`COURSE_ROUTES` to import, insert `<SkillsCard />` between test-family cards and past tests

---

## Task 1 — Extract `lib/test-types.ts`

Goal: a single source of truth for test-family metadata that both `/home` and the new picker import from.

**Files:**
- Create: `lib/test-types.ts`
- Modify: `app/(authenticated)/home/page.tsx` (replace inline `TESTS` + `COURSE_ROUTES` with imports)

- [ ] **Step 1:** Create `lib/test-types.ts`:

```ts
// Shared test-type + course metadata. Single source of truth consumed by
// /home (test-family cards) and /skills (root picker tiles).

import type { TestType } from "@/types/question";

export const TESTS: Record<TestType, { name: string; desc: string; color: string }> = {
  sat: { name: "SAT", desc: "College readiness", color: "#C8102E" },
  nmsqt: { name: "PSAT/NMSQT", desc: "National Merit", color: "#d4a017" },
  psat89: { name: "PSAT 8/9", desc: "Grades 8–9", color: "#06b6d4" },
};

export const COURSE_ROUTES: Record<TestType, { rw: string; math: string }> = {
  sat: { rw: "/courses/sat-rw", math: "/courses/sat-math" },
  nmsqt: { rw: "/courses/nmsqt-rw", math: "/courses/nmsqt-math" },
  psat89: { rw: "/courses/psat89-rw", math: "/courses/psat89-math" },
};

// All 6 (testType, section, course-slug) tuples in the order the skill
// root picker renders them. Each row is directly bindable to a tile.
export const TEST_COURSES: Array<{
  testType: TestType;
  section: "math" | "rw";
  course: string; // canonical slug used in Firestore + /skills/[course] URLs
  title: string;
  subtitle: string;
  color: string;
}> = [
  { testType: "sat",    section: "math", course: "sat-math",    title: "SAT Math",                     subtitle: "Algebra, advanced math, geometry", color: TESTS.sat.color },
  { testType: "sat",    section: "rw",   course: "sat-rw",      title: "SAT Reading & Writing",        subtitle: "Craft, expression, conventions",   color: TESTS.sat.color },
  { testType: "nmsqt",  section: "math", course: "nmsqt-math",  title: "PSAT/NMSQT Math",              subtitle: "Same curriculum, NMSQT scoring",   color: TESTS.nmsqt.color },
  { testType: "nmsqt",  section: "rw",   course: "nmsqt-rw",    title: "PSAT/NMSQT Reading & Writing", subtitle: "Same curriculum, NMSQT scoring",   color: TESTS.nmsqt.color },
  { testType: "psat89", section: "math", course: "psat89-math", title: "PSAT 8/9 Math",                subtitle: "Grades 8–9 baseline",              color: TESTS.psat89.color },
  { testType: "psat89", section: "rw",   course: "psat89-rw",   title: "PSAT 8/9 Reading & Writing",   subtitle: "Grades 8–9 baseline",              color: TESTS.psat89.color },
];
```

- [ ] **Step 2:** In `app/(authenticated)/home/page.tsx`, delete the inline `TESTS` declaration (currently lines 62–66) and the `COURSE_ROUTES` declaration (currently lines 68–72). Add this import near the other `@/lib/*` imports at the top:

```ts
import { TESTS, COURSE_ROUTES } from "@/lib/test-types";
```

- [ ] **Step 3:** Type-check:

```bash
cd ~/pantherprep && npx tsc --noEmit 2>&1 | tail -20
```

Expected: zero errors. If `TestType` is imported from a different path in the new file, adjust the import in `lib/test-types.ts` to match whatever `home/page.tsx` was using.

- [ ] **Step 4:** Commit:

```bash
cd ~/pantherprep && git add lib/test-types.ts "app/(authenticated)/home/page.tsx" && git commit -m "Extract shared TESTS + COURSE_ROUTES to lib/test-types.ts"
```

---

## Task 2 — Add `getSkillCountForCourse` helper

Goal: a build-time helper the `/skills` root picker uses to render "N skills" per tile without hitting Firestore.

**Files:**
- Modify: `lib/skill-mapping.ts`

- [ ] **Step 1:** Open `lib/skill-mapping.ts`. Check the existing imports at the top of the file — if it already imports from `@/lib/adaptive/adaptive-engine`, merge the named imports; otherwise add a new import line:

```ts
import { MATH_SKILLS, RW_SKILLS } from "@/lib/adaptive/adaptive-engine";
```

- [ ] **Step 2:** Append this function to the end of `lib/skill-mapping.ts`:

```ts
// Count of taxonomy skills available for a given course slug. Used by
// the /skills root picker to render "N skills" on each tile. Static at
// build time — derived from MATH_SKILLS / RW_SKILLS in adaptive-engine.ts.
export function getSkillCountForCourse(course: string): number {
  const taxonomy = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  return Object.values(taxonomy).reduce((sum, skills) => sum + skills.length, 0);
}
```

Expected values at taxonomy snapshot 2026-04-15: any `*-math` course → 28, any `*-rw` course → 21.

- [ ] **Step 3:** Type-check:

```bash
cd ~/pantherprep && npx tsc --noEmit 2>&1 | tail -20
```

Expected: zero new errors.

- [ ] **Step 4:** Commit:

```bash
cd ~/pantherprep && git add lib/skill-mapping.ts && git commit -m "Add getSkillCountForCourse helper for the skills root picker"
```

---

## Task 3 — Inspect AdaptiveProfile.Recommendation shape

Goal: verify the exact field names on `AdaptiveProfile.recommendations[i]` before writing the two components that read from it. This prevents a round of type-check failures in Tasks 4 and 6.

**Files:**
- Read-only: `lib/adaptive/performance-service.ts`

- [ ] **Step 1:** Open `lib/adaptive/performance-service.ts`. Find the `Recommendation` type (or `AdaptiveProfile.recommendations` type). Record the exact field names:
  - Which field is the skill key? (likely `taxonomyKey`, possibly `skillKey` or `skill`)
  - Which field is the course slug? (possibly `course`, possibly a composite of `testType` + `section`, possibly absent entirely)

- [ ] **Step 2:** If **no course-discriminator field exists** on `Recommendation`, per-tile adaptive-stat chips in Task 4 cannot be rendered by direct lookup. Two fallbacks:
  - Fallback A: show a single aggregate chip ("{N} recommended across all tests") on a header above the grid instead of per-tile. Simpler.
  - Fallback B: derive course from the taxonomy key — but since the same skill appears in all 3 math courses (or all 3 rw courses), the mapping is 1-to-many, so this doesn't work cleanly. Skip this fallback.

  Go with Fallback A if no course field exists. Update the plan at Task 4 step 1 accordingly before writing that component.

- [ ] **Step 3:** Record findings inline in this plan document (edit this task with the actual field names before moving on) or just note them in your working memory for Task 4/6.

No commit — this is an inspection task.

---

## Task 4 — Create `<SkillRootPicker />`

Goal: the 6-tile client component that renders at `/skills`.

**Files:**
- Create: `components/skills/skill-root-picker.tsx`

- [ ] **Step 1:** Create `components/skills/skill-root-picker.tsx`. The code below assumes `Recommendation.taxonomyKey` exists (standard name in the codebase). If Task 3 turned up a different shape or no per-course field, replace the `recsByCourse` accumulator with the Fallback A pattern from Task 3 step 2.

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import { getSkillCountForCourse } from "@/lib/skill-mapping";
import { TEST_COURSES } from "@/lib/test-types";

export function SkillRootPicker() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdaptiveProfile | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    getAdaptiveProfile(user.uid)
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [user?.uid]);

  // Per-course recommendation count. If the Recommendation type doesn't
  // carry a course field, replace this with a single aggregate count
  // rendered above the grid (Fallback A in Task 3).
  const recsByCourse: Record<string, number> = {};
  if (profile?.recommendations) {
    for (const rec of profile.recommendations) {
      const course = (rec as { course?: string }).course;
      if (course) {
        recsByCourse[course] = (recsByCourse[course] ?? 0) + 1;
      }
    }
  }

  return (
    <div className="min-h-screen">
      <TopBar backHref="/home" backLabel="Home" />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="mb-2 font-display text-3xl tracking-[0.02em] text-white sm:text-4xl">
          Skill Library
        </h1>
        <p className="mb-8 max-w-2xl text-sm text-text-muted sm:text-base">
          Browse concept explanations and practice questions by topic, independent of any test.
          Start with your weakest areas or explore anything that looks interesting.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TEST_COURSES.map((tile) => {
            const count = getSkillCountForCourse(tile.course);
            const recs = recsByCourse[tile.course] ?? 0;
            return (
              <Link key={tile.course} href={`/skills/${tile.course}`} className="group block">
                <GlassCard
                  className="h-full p-6 transition-all hover:-translate-y-0.5"
                  style={{
                    borderColor: `${tile.color}40`,
                    boxShadow: `0 0 24px ${tile.color}15`,
                  }}
                >
                  <div
                    className="mb-1 text-xs font-bold uppercase tracking-[2px]"
                    style={{ color: tile.color }}
                  >
                    {tile.title}
                  </div>
                  <div className="text-sm text-text-muted">{tile.subtitle}</div>
                  <div className="mt-4 flex items-center gap-3 text-xs">
                    <span className="text-text-secondary">{count} skills</span>
                    {recs > 0 && (
                      <span
                        className="rounded-full px-2 py-0.5"
                        style={{
                          backgroundColor: `${tile.color}20`,
                          color: tile.color,
                        }}
                      >
                        {recs} recommended to review
                      </span>
                    )}
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2:** Type-check:

```bash
cd ~/pantherprep && npx tsc --noEmit 2>&1 | tail -20
```

Expected: zero errors. The `(rec as { course?: string }).course` cast intentionally avoids a type error if the real `Recommendation` type has no `course` field — the runtime simply returns undefined, the accumulator skips, and no chips render. If Task 3 confirmed the actual field name, replace the cast with the real type.

- [ ] **Step 3:** Commit:

```bash
cd ~/pantherprep && git add components/skills/skill-root-picker.tsx && git commit -m "Add SkillRootPicker: 6-tile catalog picker with adaptive chips"
```

---

## Task 5 — Create `/skills` root route

**Files:**
- Create: `app/(authenticated)/skills/page.tsx`

- [ ] **Step 1:** Create `app/(authenticated)/skills/page.tsx`:

```tsx
import { SkillRootPicker } from "@/components/skills/skill-root-picker";

export default function SkillsRootPage() {
  return <SkillRootPicker />;
}
```

This is a server component that imports a client component. No `"use client"` directive needed — Next.js handles the boundary at the SkillRootPicker import.

- [ ] **Step 2:** Run the build to confirm both `/skills` and `/skills/[course]` static routes coexist:

```bash
cd ~/pantherprep && npm run build 2>&1 | grep -E "^\\s*[○●]\\s*/skills" | head
```

Expected: output shows `/skills` as a new static route alongside `/skills/[course]` (SSG with 6 paths) and `/skills/[course]/[skill]` (SSG with ~144 paths). No conflict, no build error.

- [ ] **Step 3:** Commit:

```bash
cd ~/pantherprep && git add "app/(authenticated)/skills/page.tsx" && git commit -m "Add /skills root route rendering SkillRootPicker"
```

---

## Task 6 — Top-bar Skills link

**Files:**
- Modify: `components/layout/top-bar.tsx`

- [ ] **Step 1:** In `top-bar.tsx`, add the `usePathname` import near the other `next/navigation` or `@/hooks/*` imports. If no `next/navigation` import exists yet, add:

```ts
import { usePathname } from "next/navigation";
```

- [ ] **Step 2:** Inside the `TopBar` function body, before the `return`, add:

```tsx
const pathname = usePathname();
const skillsActive = pathname?.startsWith("/skills") ?? false;
```

- [ ] **Step 3:** Inside the left-group `<div className="flex min-w-0 items-center gap-3 sm:gap-4">`, immediately after the wordmark `<a href="/home">` closing tag, insert:

```tsx
<span className="hidden h-4 w-px bg-white/15 sm:inline-block" aria-hidden />
<a
  href="/skills"
  className={cn(
    "hidden shrink-0 text-sm font-medium transition-colors sm:inline-block",
    skillsActive
      ? "text-white"
      : "text-text-muted hover:text-text-secondary"
  )}
>
  Skills
</a>
```

The `cn` utility is already imported at the top of the file (`import { cn } from "@/lib/utils";`) — no new import needed.

- [ ] **Step 4:** Type-check:

```bash
cd ~/pantherprep && npx tsc --noEmit 2>&1 | tail -20
```

Expected: zero errors.

- [ ] **Step 5:** Commit:

```bash
cd ~/pantherprep && git add components/layout/top-bar.tsx && git commit -m "TopBar: add Skills link with pathname-based active state"
```

---

## Task 7 — Create `<SkillsCard />`

Goal: the home-page card with 4 copy variants driven by `role` + `adaptiveProfile`.

**Files:**
- Create: `components/home/skills-card.tsx`

- [ ] **Step 1:** Create `components/home/skills-card.tsx`. Same caveat as Task 4 re: the `Recommendation` field name — the code below assumes `r.taxonomyKey`. If Task 3 turned up a different name, replace it.

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";

interface SkillsCardProps {
  role: "student" | "teacher" | "admin" | null;
}

function pickSubtitle(
  role: SkillsCardProps["role"],
  profile: AdaptiveProfile | null,
  loaded: boolean
): string {
  if (role === "teacher" || role === "admin") {
    return "Browse the student skill library — preview the concept bundles and practice pools students see.";
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
    .map((r) => {
      const key = (r as { taxonomyKey?: string }).taxonomyKey;
      return key ? skillLabel(key) : "";
    })
    .filter(Boolean);
  if (named.length === 0) {
    return `You have ${recs.length} skills that could use work. Start with your weakest areas.`;
  }
  const tail = recs.length > named.length ? ", and more" : "";
  return `You have ${recs.length} skills that could use work — ${named.join(", ")}${tail}.`;
}

export function SkillsCard({ role }: SkillsCardProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdaptiveProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setLoaded(true);
      return;
    }
    getAdaptiveProfile(user.uid)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoaded(true));
  }, [user?.uid]);

  const subtitle = pickSubtitle(role, profile, loaded);

  return (
    <GlassCard className="mb-8 p-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs font-bold uppercase tracking-[2px] text-panther-red">
            Review by topic
          </div>
          <p className="text-sm text-text-secondary sm:text-base">{subtitle}</p>
        </div>
        <Link
          href="/skills"
          className="w-full shrink-0 rounded-lg bg-panther-red px-5 py-3 text-center text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-panther-red/90 sm:w-auto"
        >
          Open skill library →
        </Link>
      </div>
    </GlassCard>
  );
}
```

Class-name assumption to verify during the first build: `bg-panther-red` and `text-panther-red` must exist in the Tailwind theme (they're used throughout the existing codebase — low risk). If they don't resolve, grep for `panther-red` in other component files and use whatever variant is working there.

- [ ] **Step 2:** Type-check:

```bash
cd ~/pantherprep && npx tsc --noEmit 2>&1 | tail -20
```

Expected: zero errors.

- [ ] **Step 3:** Commit:

```bash
cd ~/pantherprep && git add components/home/skills-card.tsx && git commit -m "Add SkillsCard with adaptive-aware copy variants"
```

---

## Task 8 — Insert `<SkillsCard />` in `/home`

**Files:**
- Modify: `app/(authenticated)/home/page.tsx`

- [ ] **Step 1:** Add the import at the top of `home/page.tsx` near the other `@/components/*` imports:

```ts
import { SkillsCard } from "@/components/home/skills-card";
```

- [ ] **Step 2:** Find the home-view render branch (the JSX returned when `view === "home"`). Locate the section that renders the 3 test-family cards in a grid, using `TESTS` from `@/lib/test-types`. Immediately **after** the closing tag of that grid and **before** the past-tests section, insert:

```tsx
<SkillsCard role={role as "student" | "teacher" | "admin" | null} />
```

The `role` variable is destructured from `useAuth()` at the top of the component and is already typed as one of those values (or null when unauthenticated).

- [ ] **Step 3:** Type-check + build:

```bash
cd ~/pantherprep && npx tsc --noEmit 2>&1 | tail -10 && npm run build 2>&1 | tail -20
```

Expected: zero type errors, build succeeds, static generation completes for `/skills`, `/skills/[course]` (6 paths), `/skills/[course]/[skill]` (~144 paths), `/home`, and all other pre-existing routes with no regressions.

- [ ] **Step 4:** Commit:

```bash
cd ~/pantherprep && git add "app/(authenticated)/home/page.tsx" && git commit -m "Home: insert SkillsCard between test-family cards and past tests"
```

---

## Task 9 — Deploy + deploy-verify

- [ ] **Step 1:** Deploy:

```bash
cd ~/pantherprep && firebase deploy --only hosting 2>&1 | tail -15
```

Expected: `Deploy complete!` with no errors. Note the upload count (should be ~5 changed files + prior baseline).

- [ ] **Step 2:** Run `/deploy-verify`:

```
/deploy-verify pantherprep "skill catalog discoverability — new /skills root picker + top-bar Skills link with active state + home-page SkillsCard with adaptive-aware copy variants"
```

Expected outputs:
- **Link:** PASS. Verifies (a) `/skills` root route responds HTTP 200 and SSR-renders, (b) existing `/skills/[course]` and `/skills/[course]/[skill]` routes still respond (no regression), (c) home page data loading unchanged, (d) top-bar active state fires correctly when the URL matches `/skills*`.
- **Pixel:** PASS. Captures at 375/768/1280: `/home` with SkillsCard visible in correct position with correct copy for qa-student's adaptive state; `/skills` root showing 6 tiles with correct accent colors, mobile 1-column stack; top-bar Skills link visible on ≥sm, hidden below; active-state white color on `/skills*` routes.

- [ ] **Step 3:** If any 🔴 blockers, fix inline, rebuild, redeploy, re-run `/deploy-verify`. If PASS with notes, evaluate each 🟡 item — fix if trivial, otherwise file as follow-up and move on.

---

## Spec coverage checklist

Mapping each spec requirement to the task that implements it:

| Spec section | Requirement | Task |
|---|---|---|
| §1 | `/skills` root route (client wrapper) | Task 5 |
| §1 | `<SkillRootPicker />` component | Task 4 |
| §1 | 6-tile grid with correct routes + accents | Task 4 |
| §1 | Static skill count per tile | Task 2 + Task 4 |
| §1 | Optional adaptive stat chip per tile | Task 4 |
| §1 | `TESTS` map extraction to `lib/test-types.ts` | Task 1 |
| §2 | Top-bar Skills link in left group | Task 6 |
| §2 | `usePathname` active state | Task 6 |
| §2 | `hidden sm:inline-block` mobile behavior | Task 6 |
| §2 | Thin vertical separator between wordmark and link | Task 6 |
| §2 | No role gating (universal) | Task 6 (implicit — no role check) |
| §3 | `<SkillsCard />` component | Task 7 |
| §3 | 4 copy variants (teacher/admin, student-recs, student-strong, student-fresh) | Task 7 |
| §3 | Full-width card, CTA button, mobile stack | Task 7 |
| §3 | Insert between test-family cards and past tests | Task 8 |
| §3 | Consume `adaptiveProfile` (amended: fetches its own) | Task 7 (deviation noted) |
| §4 | Type-check + build + deploy-verify | Task 8 step 3, Task 9 |
| §4 | Rollback via single revert | All tasks use small focused commits |

All spec requirements covered. No placeholders. No TODOs.

---

## Execution notes

Tasks 1–8 are ~5–15 minutes each; Task 9 depends on deploy speed and agent re-run time. Estimated total implementation time: 45–90 minutes in a session, longer if subagent-driven with between-task reviews.

The tasks have a strict ordering dependency for Tasks 1 → 2 → 3 → 4 → 5 (each builds on the previous). Tasks 6, 7, 8 have only soft dependencies and could technically reorder, but following the plan order keeps each commit tight and single-concern.
