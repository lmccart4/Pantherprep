# Study Plan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Study Plan feature described in `docs/superpowers/specs/2026-04-19-study-plan-design.md` — deterministic skill-ordering algorithm + Parker weekly narrative distributed through the existing Coach Chat draft queue, with home Today card, `/study-plan` route, and practice runner integration.

**Architecture:** A pure TypeScript algorithm ranks + packs skills into weeks. Runs client-side on plan mount and after matching sessions; runs server-side during Sunday 10 PM launchd regen. A new Claude Code skill (`study-plan-narrative`) writes the weekly prose once per plan per week, piped through the existing `coachDrafts` approval queue. Students see one Today card on home and a full `/study-plan` page with a week strip + narrative + per-skill progress.

**Tech stack:** Next.js 15 + React 19 (static export), Tailwind v4 Campus Press theme, Firestore + Firebase Auth, `firebase-admin` for scripts, Mac mini launchd, Claude Code subscription for narrative. No automated tests in this project — verification uses `npm run build`, `preview_start` + screenshots, and live Firestore inspection.

---

## File Structure

### New files (pantherprep)

```
types/study-plan.ts                                  — shared types
lib/study-plan/prerequisites.ts                      — static prerequisite map
lib/study-plan/algorithm.ts                          — pure function buildPlan()
lib/study-plan/client-regen.ts                       — client helpers (read profile, run algorithm, write plan doc)
lib/study-plan/dates.ts                              — date helpers (weeksRemaining, isRestDay, toISODate)
components/home/today-card.tsx                       — home-page Today's set card
components/study-plan/week-strip.tsx                 — horizontal week cards
components/study-plan/narrative-card.tsx             — Parker's weekly prose
components/study-plan/skill-progress.tsx             — mastery bar + target line per skill
components/study-plan/onboarding-modal.tsx           — first-visit test-date picker
components/study-plan/wrap-up-view.tsx               — post-testDate summary
components/practice/plan-results-footer.tsx          — practice runner results "tomorrow:" footer
app/(authenticated)/study-plan/page.tsx              — thread route
```

### Modified files (pantherprep)

```
firestore.rules                                      — add studyPlans rules
firestore.indexes.json                               — add studyPlans composite index
components/layout/top-bar.tsx                        — add "Study Plan" nav entry
app/(authenticated)/home/page.tsx                    — mount TodayCard above CoachsNoteBlock
components/practice/practice-runner.tsx              — thread ?plan= query through to results
components/test/practice-test.tsx                    — same
components/practice/practice-results-card.tsx        — render PlanResultsFooter when planId present
lib/test-persistence.ts                              — auto-complete hook on matching session
```

### New files (Lachlan)

```
~/Lachlan/.claude/skills/study-plan-narrative/SKILL.md
~/Lachlan/scripts/study-plan-regen.cjs               — Sunday 22:00 weekly regen + narrative
~/Lachlan/scripts/study-plan-archive.cjs             — daily 01:00 archive past-date plans
~/Lachlan/scripts/study-plan-seed.cjs                — dev helper to seed a plan
~/Lachlan/ops/study-plan/com.luke.study-plan-regen.plist
~/Lachlan/ops/study-plan/com.luke.study-plan-archive.plist
~/Lachlan/ops/study-plan/install.sh
```

### Modified files (Lachlan)

```
~/Lachlan/CLAUDE.md                                   — register skill + scheduled tasks
~/Lachlan/context/team.md                             — skill ownership
```

---

## Task 1: Shared types

**Files:**
- Create: `types/study-plan.ts`

- [ ] **Step 1: Write types**

```ts
// types/study-plan.ts
import type { Timestamp } from "firebase/firestore";

export type StudyPlanStatus = "active" | "archived" | "paused";
export type StudyPlanMode = "normal" | "cramming";

export interface SkillQueueEntry {
  skill: string;
  assignedWeek: number;
  targetMastery: number;
}

export interface TodaysSet {
  skill: string;
  course: string;
  targetCount: number;
  estMinutes: number;
}

export interface StudyPlan {
  // doc id = `${uid}_${course}`
  uid: string;
  course: string;
  testDate: Timestamp;
  createdAt: Timestamp;
  status: StudyPlanStatus;
  mode: StudyPlanMode;
  skillQueue: SkillQueueEntry[];
  currentWeekIndex: number;
  currentWeekSkills: string[];
  targetSessionsThisWeek: number;
  weeklyNarrative?: string;
  pullQuote?: string;
  completedDays: Record<string, boolean>;   // ISO date → true
  skippedWeeks: number[];
  lastRegeneratedAt?: Timestamp;
  lastAlgorithmRunAt?: Timestamp;
}

export interface StudyPlanOutput {
  weeksRemaining: number;
  mode: StudyPlanMode;
  skillQueue: SkillQueueEntry[];
  currentWeekIndex: number;
  currentWeekSkills: string[];
  targetSessionsThisWeek: number;
  today: TodaysSet | null;
}
```

- [ ] **Step 2: Typecheck**

Run: `cd ~/pantherprep && npm run build 2>&1 | tail -5`
Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add types/study-plan.ts
git commit -m "feat(plan): shared types for study plans"
```

---

## Task 2: Prerequisites map

**Files:**
- Create: `lib/study-plan/prerequisites.ts`

- [ ] **Step 1: Write the map**

```ts
// lib/study-plan/prerequisites.ts
// Static map from skill → list of skills it directly depends on.
// Used by the algorithm to keep a skill from being scheduled before its
// prerequisites. Conservative — only include dependencies strong enough
// that the pedagogy genuinely breaks without them.

export const PREREQUISITES: Record<string, string[]> = {
  // Algebra
  linear_inequalities: ["linear_equations"],
  systems_of_equations: ["linear_equations"],
  linear_functions: ["linear_equations"],

  // Advanced Math
  completing_the_square: ["quadratic_equations", "equivalent_expressions"],
  quadratic_formula: ["quadratic_equations"],
  polynomial_operations: ["equivalent_expressions"],
  function_notation: ["linear_functions"],
  exponential_functions: ["equivalent_expressions"],
  radical_equations: ["quadratic_equations"],
  rational_expressions: ["equivalent_expressions"],

  // PSDA
  margin_of_error: ["statistics_spread"],
  evaluating_statistical_claims: ["margin_of_error"],
  scatterplots: ["linear_functions"],
  linear_regression: ["scatterplots"],

  // Geometry & Trig
  right_triangle_trig: ["triangles"],
  unit_circle: ["right_triangle_trig"],
  circle_equations_xy: ["circles", "completing_the_square"],
};

export function prerequisitesOf(skill: string): string[] {
  return PREREQUISITES[skill] ?? [];
}

/**
 * Return the transitive closure of prerequisites for a skill, including
 * the skill itself. Used for depth sorting.
 */
export function allPrerequisites(skill: string, visited = new Set<string>()): Set<string> {
  if (visited.has(skill)) return visited;
  visited.add(skill);
  for (const p of prerequisitesOf(skill)) {
    allPrerequisites(p, visited);
  }
  return visited;
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -3
git add lib/study-plan/prerequisites.ts
git commit -m "feat(plan): skill prerequisites map"
```

---

## Task 3: Date helpers

**Files:**
- Create: `lib/study-plan/dates.ts`

- [ ] **Step 1: Write helpers**

```ts
// lib/study-plan/dates.ts
// Small date helpers used by the algorithm + UI. All operate on local time
// in the student's timezone. ISO dates are YYYY-MM-DD.

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (24 * 3600 * 1000));
}

export function weeksRemaining(today: Date, testDate: Date): number {
  return Math.max(0, Math.floor(daysBetween(today, testDate) / 7));
}

export function isRestDay(d: Date): boolean {
  // Sunday is the rest day
  return d.getDay() === 0;
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -3
git add lib/study-plan/dates.ts
git commit -m "feat(plan): date helpers"
```

---

## Task 4: Algorithm

**Files:**
- Create: `lib/study-plan/algorithm.ts`

- [ ] **Step 1: Write the pure function**

```ts
// lib/study-plan/algorithm.ts
// Deterministic, pure function that takes a student's profile + testDate
// and produces a StudyPlanOutput. Runs on both client (fast daily path)
// and server (Sunday regen). Same input → same output.

import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { StudyPlanOutput, SkillQueueEntry } from "@/types/study-plan";
import {
  getCourseTaxonomy,
  filterSkillsForCourse,
} from "@/lib/adaptive/adaptive-engine";
import { prerequisitesOf } from "./prerequisites";
import { weeksRemaining, isRestDay, toISODate } from "./dates";

type Course = string;

interface BuildArgs {
  profile: AdaptiveProfile | null;
  testDate: Date;
  today: Date;
  course: Course;
  completedDays?: Record<string, boolean>;
}

// Domain weights per test program. Values from CB's Digital SAT Assessment
// Framework (Tables 16-18). Used to bias ordering toward high-weight skills.
const DOMAIN_WEIGHTS: Record<string, Record<string, number>> = {
  sat: {
    Algebra: 0.35,
    "Advanced Math": 0.35,
    "Problem Solving & Data": 0.15,
    "Geometry & Trig": 0.15,
    "Information & Ideas": 0.26,
    "Craft & Structure": 0.28,
    "Expression of Ideas": 0.2,
    "Standard English Conventions": 0.26,
  },
  nmsqt: {
    Algebra: 0.35,
    "Advanced Math": 0.325,
    "Problem Solving & Data": 0.2,
    "Geometry & Trig": 0.125,
    "Information & Ideas": 0.26,
    "Craft & Structure": 0.28,
    "Expression of Ideas": 0.2,
    "Standard English Conventions": 0.26,
  },
  p89: {
    Algebra: 0.425,
    "Advanced Math": 0.2,
    "Problem Solving & Data": 0.2,
    "Geometry & Trig": 0.175,
    "Information & Ideas": 0.26,
    "Craft & Structure": 0.28,
    "Expression of Ideas": 0.2,
    "Standard English Conventions": 0.26,
  },
};

function testProgramOf(course: string): "sat" | "nmsqt" | "p89" {
  if (course.startsWith("psat89")) return "p89";
  if (course.startsWith("nmsqt")) return "nmsqt";
  return "sat";
}

function domainForSkill(skill: string, course: string): string {
  const taxonomy = getCourseTaxonomy(course);
  for (const [domain, skills] of Object.entries(taxonomy)) {
    if (skills.includes(skill)) return domain;
  }
  return "Unknown";
}

export function buildPlan(args: BuildArgs): StudyPlanOutput {
  const { profile, testDate, today, course, completedDays = {} } = args;

  const weeks = weeksRemaining(today, testDate);
  const mode: "normal" | "cramming" = weeks < 2 ? "cramming" : "normal";

  // Eligible skills: in-scope for the course, one of math or rw depending on course
  const taxonomy = getCourseTaxonomy(course);
  const allSkills: string[] = [];
  for (const skills of Object.values(taxonomy)) allSkills.push(...skills);
  const eligible = filterSkillsForCourse(allSkills, course);

  const program = testProgramOf(course);
  const domainWeights = DOMAIN_WEIGHTS[program] ?? {};

  const recIndex = new Map<string, number>();
  (profile?.recommendations ?? []).forEach((r, i) => recIndex.set(r.skill, i));
  const recCount = profile?.recommendations?.length ?? 0;

  function scoreFor(skill: string): number {
    const skillData = profile?.skills?.[skill];
    const mastery = skillData?.mastery ?? 0;
    const totalAnswers = skillData?.totalAnswers ?? 0;
    const unexploredBoost = totalAnswers < 5 ? 1 : 0;
    const masteryGap = 1 - mastery;
    const domainWeight = domainWeights[domainForSkill(skill, course)] ?? 0.1;
    const recRank = recIndex.get(skill);
    const recBoost = recRank !== undefined && recCount > 0 ? 1 - recRank / recCount : 0;
    return unexploredBoost * 2 + masteryGap * 0.6 + domainWeight * 0.3 + recBoost * 0.1;
  }

  // Sort eligible skills by score descending
  const ranked = [...eligible].sort((a, b) => scoreFor(b) - scoreFor(a));

  // Trim in cramming mode
  const trimmed = mode === "cramming" ? ranked.slice(0, 5) : ranked;

  // Assign weeks respecting prerequisites.
  // Greedy pass: each week gets up to 2 skills, but a skill can't land
  // before all its prerequisites (that are also in the plan) have been placed.
  const skillsPerWeek = 2;
  const maxWeek = Math.max(0, weeks - 1);
  const assigned = new Map<string, number>();
  let weekCursor = 0;
  let inWeek = 0;

  for (const skill of trimmed) {
    const prereqs = prerequisitesOf(skill).filter((p) => trimmed.includes(p));
    let earliest = weekCursor;
    for (const p of prereqs) {
      const pWeek = assigned.get(p);
      if (pWeek !== undefined && pWeek + 1 > earliest) earliest = pWeek + 1;
    }
    // If we need a later week than weekCursor due to prereqs, move cursor
    if (earliest > weekCursor) {
      weekCursor = earliest;
      inWeek = 0;
    }
    const targetWeek = Math.min(weekCursor, maxWeek);
    assigned.set(skill, targetWeek);
    inWeek++;
    if (inWeek >= skillsPerWeek) {
      weekCursor++;
      inWeek = 0;
    }
  }

  // Build skillQueue — sorted by assignedWeek then by score rank
  const skillQueue: SkillQueueEntry[] = trimmed
    .map((skill) => ({
      skill,
      assignedWeek: assigned.get(skill) ?? maxWeek,
      targetMastery: skill in (profile?.skills ?? {}) ? 0.8 : 0.75,
    }))
    .sort((a, b) =>
      a.assignedWeek === b.assignedWeek
        ? trimmed.indexOf(a.skill) - trimmed.indexOf(b.skill)
        : a.assignedWeek - b.assignedWeek
    );

  const currentWeekIndex = 0;
  const currentWeekSkills = skillQueue
    .filter((q) => q.assignedWeek === currentWeekIndex)
    .map((q) => q.skill);

  const targetSessionsThisWeek = mode === "cramming" ? 4 : 3;

  // Today's skill
  let todayOut: StudyPlanOutput["today"] = null;
  if (!isRestDay(today)) {
    const iso = toISODate(today);
    if (!completedDays[iso]) {
      const pick = currentWeekSkills.find((skill) => {
        const m = profile?.skills?.[skill]?.mastery ?? 0;
        const target =
          skillQueue.find((q) => q.skill === skill)?.targetMastery ?? 0.8;
        return m < target;
      });
      if (pick) {
        const domain = domainForSkill(pick, course);
        const isHighWeight = (domainWeights[domain] ?? 0) >= 0.3;
        const targetCount = isHighWeight ? 15 : 10;
        todayOut = {
          skill: pick,
          course,
          targetCount,
          estMinutes: Math.round(targetCount * 1.5),
        };
      }
    }
  }

  return {
    weeksRemaining: weeks,
    mode,
    skillQueue,
    currentWeekIndex,
    currentWeekSkills,
    targetSessionsThisWeek,
    today: todayOut,
  };
}
```

- [ ] **Step 2: Typecheck**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add lib/study-plan/algorithm.ts
git commit -m "feat(plan): deterministic buildPlan algorithm"
```

---

## Task 5: Client regen helper

**Files:**
- Create: `lib/study-plan/client-regen.ts`

- [ ] **Step 1: Write**

```ts
// lib/study-plan/client-regen.ts
// Runs the algorithm on the client and writes the whitelisted fields back
// to the plan doc. Called on /study-plan mount, on test-date change, on
// skip-week, and from the post-session auto-complete hook.

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import { buildPlan } from "./algorithm";
import type { StudyPlan } from "@/types/study-plan";

export async function regenerateStudyPlan(planId: string): Promise<void> {
  const ref = doc(db, "studyPlans", planId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const plan = snap.data() as StudyPlan;
  if (plan.status !== "active") return;

  const profile = await getAdaptiveProfile(plan.uid);

  const output = buildPlan({
    profile,
    testDate: plan.testDate.toDate(),
    today: new Date(),
    course: plan.course,
    completedDays: plan.completedDays ?? {},
  });

  await updateDoc(ref, {
    skillQueue: output.skillQueue,
    currentWeekIndex: output.currentWeekIndex,
    currentWeekSkills: output.currentWeekSkills,
    targetSessionsThisWeek: output.targetSessionsThisWeek,
    mode: output.mode,
    lastAlgorithmRunAt: serverTimestamp(),
  });
}

export async function listActivePlansForUser(uid: string): Promise<StudyPlan[]> {
  const { collection, query, where, getDocs } = await import("firebase/firestore");
  const q = query(
    collection(db, "studyPlans"),
    where("uid", "==", uid),
    where("status", "==", "active")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as StudyPlan);
}

export async function markDayCompletedIfMatches(
  uid: string,
  course: string,
  skillsInSession: string[]
): Promise<void> {
  const planId = `${uid}_${course}`;
  const ref = doc(db, "studyPlans", planId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const plan = snap.data() as StudyPlan;
  if (plan.status !== "active") return;
  const overlap = skillsInSession.some((s) => plan.currentWeekSkills.includes(s));
  if (!overlap) return;
  const iso = new Date().toISOString().slice(0, 10);
  const completedDays = { ...(plan.completedDays ?? {}), [iso]: true };
  await updateDoc(ref, {
    completedDays,
  });
  await regenerateStudyPlan(planId);
}

export async function createPlan(args: {
  uid: string;
  course: string;
  testDate: Date;
}): Promise<string> {
  const planId = `${args.uid}_${args.course}`;
  const ref = doc(db, "studyPlans", planId);
  const { setDoc } = await import("firebase/firestore");
  await setDoc(ref, {
    uid: args.uid,
    course: args.course,
    testDate: Timestamp.fromDate(args.testDate),
    createdAt: serverTimestamp(),
    status: "active",
    mode: "normal",
    skillQueue: [],
    currentWeekIndex: 0,
    currentWeekSkills: [],
    targetSessionsThisWeek: 3,
    completedDays: {},
    skippedWeeks: [],
  });
  await regenerateStudyPlan(planId);
  return planId;
}

export async function skipCurrentWeek(planId: string): Promise<void> {
  const ref = doc(db, "studyPlans", planId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const plan = snap.data() as StudyPlan;
  const next = [...(plan.skippedWeeks ?? []), plan.currentWeekIndex];
  await updateDoc(ref, { skippedWeeks: next });
  await regenerateStudyPlan(planId);
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -3
git add lib/study-plan/client-regen.ts
git commit -m "feat(plan): client regen + create + skip helpers"
```

---

## Task 6: Firestore rules + index

**Files:**
- Modify: `firestore.rules`
- Modify: `firestore.indexes.json`

- [ ] **Step 1: Add rules**

Insert inside the existing `match /databases/{database}/documents` block, after the Coach Chat rules:

```
// ── STUDY PLAN COLLECTION ──
match /studyPlans/{planId} {
  allow read: if isPapsUser() && (
    resource.data.uid == request.auth.uid ||
    isStaff(request.auth.uid)
  );
  allow create: if request.auth != null
    && request.resource.data.uid == request.auth.uid;
  allow update: if request.auth != null
    && resource.data.uid == request.auth.uid
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly([
      "testDate", "skippedWeeks", "completedDays", "status",
      "currentWeekIndex", "currentWeekSkills", "targetSessionsThisWeek",
      "skillQueue", "mode", "lastAlgorithmRunAt"
    ]);
  allow delete: if false;
}
```

- [ ] **Step 2: Add index**

Append to `firestore.indexes.json` inside the `indexes` array:

```json
{
  "collectionGroup": "studyPlans",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "testDate", "order": "ASCENDING" }
  ]
},
{
  "collectionGroup": "studyPlans",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "uid", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" }
  ]
}
```

- [ ] **Step 3: Deploy**

```bash
cd ~/pantherprep && firebase deploy --only firestore:rules,firestore:indexes 2>&1 | tail -5
```

Expected: both released.

- [ ] **Step 4: Commit**

```bash
git add firestore.rules firestore.indexes.json
git commit -m "feat(plan): firestore rules + indexes for studyPlans"
```

---

## Task 7: Today card (home)

**Files:**
- Create: `components/home/today-card.tsx`
- Modify: `app/(authenticated)/home/page.tsx`

- [ ] **Step 1: Write the card**

```tsx
// components/home/today-card.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StudyPlan } from "@/types/study-plan";
import { buildPlan } from "@/lib/study-plan/algorithm";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";

interface TodayRender {
  planId: string;
  weekIndex: number;
  totalWeeks: number;
  skill: string;
  course: string;
  targetCount: number;
  estMinutes: number;
}

export function TodayCard() {
  const { user } = useAuth();
  const [render, setRender] = useState<TodayRender | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "studyPlans"),
      where("uid", "==", user.uid),
      where("status", "==", "active")
    );
    const unsub = onSnapshot(q, async (snap) => {
      if (snap.empty) {
        setRender(null);
        return;
      }
      // Sort by lastAlgorithmRunAt asc (least recent first) — show that plan's today
      const plans = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as (StudyPlan & { id: string })[];
      plans.sort((a, b) => {
        const am = a.lastAlgorithmRunAt?.toMillis?.() ?? 0;
        const bm = b.lastAlgorithmRunAt?.toMillis?.() ?? 0;
        return am - bm;
      });
      for (const plan of plans) {
        const profile = await getAdaptiveProfile(plan.uid);
        const out = buildPlan({
          profile,
          testDate: plan.testDate.toDate(),
          today: new Date(),
          course: plan.course,
          completedDays: plan.completedDays ?? {},
        });
        if (out.today) {
          const totalWeeks = Math.max(
            1,
            (plan.skillQueue?.at(-1)?.assignedWeek ?? 0) + 1
          );
          setRender({
            planId: plan.id,
            weekIndex: out.currentWeekIndex,
            totalWeeks,
            skill: out.today.skill,
            course: out.today.course,
            targetCount: out.today.targetCount,
            estMinutes: out.today.estMinutes,
          });
          return;
        }
      }
      setRender(null);
    });
    return unsub;
  }, [user?.uid]);

  if (!render) return null;

  return (
    <div className="relative border-2 border-ink bg-paper-card p-6 shadow-[5px_5px_0_var(--color-ink)]">
      <div className="absolute -top-[2px] left-0 right-0 h-1 bg-accent" />
      <div className="kicker mb-3">
        Today&rsquo;s set &middot; Week {render.weekIndex + 1} of {render.totalWeeks}
      </div>
      <h2 className="mb-2 font-display text-[clamp(32px,3.5vw,44px)] leading-[1.05] text-ink">
        {skillLabel(render.skill)}
      </h2>
      <div className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-3">
        {render.targetCount} questions &middot; ~{render.estMinutes} min
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/dashboard?tab=practice&skill=${render.skill}&count=${render.targetCount}&plan=${render.planId}`}
          className="border-2 border-ink bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink"
        >
          Start today&rsquo;s set
        </Link>
        <Link
          href="/study-plan"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3 underline decoration-dashed underline-offset-4 hover:text-accent"
        >
          See full study plan &rarr;
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount on home page**

Find where `CoachsNoteBlock` renders and insert `TodayCard` ABOVE it:

```tsx
// Near top of file, add import:
import { TodayCard } from "@/components/home/today-card";

// Replace the existing CoachsNoteBlock section:
{role === "student" && (
  <section className="mb-10 flex flex-col gap-6">
    <TodayCard />
    <CoachsNoteBlock />
  </section>
)}
```

- [ ] **Step 3: Build + commit**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5
git add components/home/today-card.tsx 'app/(authenticated)/home/page.tsx'
git commit -m "feat(plan): home Today's set card"
```

---

## Task 8: Week strip + narrative card + skill progress

**Files:**
- Create: `components/study-plan/week-strip.tsx`
- Create: `components/study-plan/narrative-card.tsx`
- Create: `components/study-plan/skill-progress.tsx`

- [ ] **Step 1: Week strip**

```tsx
// components/study-plan/week-strip.tsx
import type { StudyPlan } from "@/types/study-plan";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import { cn } from "@/lib/utils";

interface Props {
  plan: StudyPlan;
}

export function WeekStrip({ plan }: Props) {
  const totalWeeks = Math.max(1, (plan.skillQueue?.at(-1)?.assignedWeek ?? 0) + 1);
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i);
  const skillsByWeek: Record<number, string[]> = {};
  for (const entry of plan.skillQueue ?? []) {
    skillsByWeek[entry.assignedWeek] ??= [];
    skillsByWeek[entry.assignedWeek].push(entry.skill);
  }

  function statusFor(w: number): "done" | "active" | "upcoming" | "skipped" {
    if ((plan.skippedWeeks ?? []).includes(w)) return "skipped";
    if (w < plan.currentWeekIndex) return "done";
    if (w === plan.currentWeekIndex) return "active";
    return "upcoming";
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {weeks.map((w) => {
        const status = statusFor(w);
        const skills = skillsByWeek[w] ?? [];
        return (
          <div
            key={w}
            className={cn(
              "border-2 p-4",
              status === "active" && "border-ink bg-ink text-paper",
              status === "done" && "border-rule-hair bg-paper-card opacity-60",
              status === "upcoming" && "border-rule-hair bg-paper-card",
              status === "skipped" && "border-rule-hair bg-paper-card opacity-40"
            )}
          >
            <div className={cn(
              "kicker mb-2",
              status === "active" && "text-paper/70"
            )}>
              Week {w + 1}
            </div>
            <div className={cn(
              "mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]",
              status === "active" ? "text-paper" : "text-ink-3"
            )}>
              {status === "active" ? "This week" :
               status === "done" ? "Done" :
               status === "skipped" ? "Skipped" : "Upcoming"}
            </div>
            <ul className={cn(
              "flex flex-col gap-1 font-body text-[13px]",
              status === "active" ? "text-paper" : "text-ink-2"
            )}>
              {skills.length === 0 && <li className="italic opacity-60">—</li>}
              {skills.map((s) => (
                <li key={s}>{skillLabel(s)}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Narrative card**

```tsx
// components/study-plan/narrative-card.tsx
import type { StudyPlan } from "@/types/study-plan";
import { formatRelative } from "@/lib/coach-chat";

export function NarrativeCard({ plan }: { plan: StudyPlan }) {
  if (!plan.weeklyNarrative) {
    return (
      <div className="border-2 border-rule-hair p-6">
        <div className="kicker mb-2">Awaiting Parker</div>
        <p className="font-body text-[14px] italic text-ink-3">
          Your first weekly note arrives Sunday night. In the meantime, start today&rsquo;s set.
        </p>
      </div>
    );
  }

  const body = plan.weeklyNarrative;
  const quote = plan.pullQuote;
  const renderBody = () => {
    if (!quote || !body.includes(quote)) return <>{body}</>;
    const parts = body.split(quote);
    return (
      <>
        {parts.map((chunk, i) => (
          <span key={i}>
            {chunk}
            {i < parts.length - 1 && (
              <em className="text-accent" style={{ fontStyle: "italic" }}>
                {quote}
              </em>
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="border-2 border-ink bg-paper-card p-6 shadow-[5px_5px_0_var(--color-ink)]">
      <div className="kicker mb-3">From Parker &middot; This week</div>
      <p className="font-body text-[16px] leading-[1.55] text-ink">
        {renderBody()}
      </p>
      <div className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
        Updated {formatRelative(plan.lastRegeneratedAt)}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Skill progress**

```tsx
// components/study-plan/skill-progress.tsx
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { StudyPlan } from "@/types/study-plan";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";

interface Props {
  plan: StudyPlan;
  profile: AdaptiveProfile | null;
}

export function SkillProgress({ plan, profile }: Props) {
  const rows = plan.currentWeekSkills.map((skill) => {
    const data = profile?.skills?.[skill];
    const mastery = data?.mastery ?? 0;
    const target = plan.skillQueue.find((q) => q.skill === skill)?.targetMastery ?? 0.8;
    return { skill, mastery, target };
  });

  return (
    <div className="border-2 border-ink bg-paper-card">
      <div className="border-b border-rule-hair p-4">
        <div className="kicker">This week&rsquo;s skills</div>
      </div>
      <div className="divide-y divide-rule-hair">
        {rows.map(({ skill, mastery, target }) => (
          <div key={skill} className="p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-display text-[18px] text-ink">{skillLabel(skill)}</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3">
                {Math.round(mastery * 100)}% &middot; target {Math.round(target * 100)}%
              </span>
            </div>
            <div className="relative h-2 bg-rule-hair">
              <div
                className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-300"
                style={{ width: `${Math.min(100, mastery * 100)}%` }}
              />
              <div
                className="absolute inset-y-0 w-[2px] bg-accent"
                style={{ left: `${Math.min(100, target * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Build + commit**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5
git add components/study-plan/
git commit -m "feat(plan): week strip + narrative card + skill progress"
```

---

## Task 9: Onboarding modal

**Files:**
- Create: `components/study-plan/onboarding-modal.tsx`

Upcoming CB dates hard-coded for now; rotate annually. Source: satsuite.collegeboard.org

- [ ] **Step 1: Write modal**

```tsx
// components/study-plan/onboarding-modal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { createPlan } from "@/lib/study-plan/client-regen";

type TestChoice = "sat" | "nmsqt" | "psat89";

const UPCOMING: Record<TestChoice, string[]> = {
  sat: ["2026-05-03", "2026-06-07", "2026-08-23", "2026-10-04"],
  nmsqt: ["2026-10-15", "2026-10-23", "2026-10-28"],
  psat89: ["2026-10-15", "2027-04-15"],
};

const LABEL: Record<TestChoice, string> = {
  sat: "SAT",
  nmsqt: "PSAT/NMSQT",
  psat89: "PSAT 8/9",
};

export function OnboardingModal({ onDone }: { onDone: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const [test, setTest] = useState<TestChoice>("sat");
  const [sections, setSections] = useState<{ math: boolean; rw: boolean }>({
    math: true,
    rw: true,
  });
  const [date, setDate] = useState(UPCOMING.sat[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!user?.uid) return;
    if (!sections.math && !sections.rw) {
      setError("Pick at least one section.");
      return;
    }
    const chosenDate = new Date(date + "T12:00:00");
    if (isNaN(chosenDate.getTime()) || chosenDate.getTime() < Date.now()) {
      setError("Pick a future date.");
      return;
    }
    setBusy(true);
    try {
      const targets: string[] = [];
      if (sections.math) targets.push(`${test}-math`);
      if (sections.rw) targets.push(`${test}-rw`);
      for (const course of targets) {
        await createPlan({ uid: user.uid, course, testDate: chosenDate });
      }
      onDone();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4">
      <div className="w-full max-w-lg border-2 border-ink bg-paper-card p-6 shadow-[5px_5px_0_var(--color-ink)]">
        <div className="kicker mb-3">Set up your plan</div>
        <h2 className="mb-5 font-display text-[32px] leading-tight text-ink">
          When&rsquo;s your <em className="text-accent" style={{ fontStyle: "italic" }}>test</em>?
        </h2>

        <div className="mb-4">
          <div className="kicker mb-2">Which test</div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(LABEL) as TestChoice[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTest(t);
                  setDate(UPCOMING[t][0]);
                }}
                className={`border-2 border-ink px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${
                  test === t ? "bg-ink text-paper" : "bg-paper-card text-ink"
                }`}
              >
                {LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="kicker mb-2">Sections</div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
              <input
                type="checkbox"
                checked={sections.math}
                onChange={(e) => setSections({ ...sections, math: e.target.checked })}
              />
              Math
            </label>
            <label className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
              <input
                type="checkbox"
                checked={sections.rw}
                onChange={(e) => setSections({ ...sections, rw: e.target.checked })}
              />
              R&amp;W
            </label>
          </div>
        </div>

        <div className="mb-5">
          <div className="kicker mb-2">Test date</div>
          <div className="mb-2 flex flex-wrap gap-2">
            {UPCOMING[test].map((d) => (
              <button
                key={d}
                onClick={() => setDate(d)}
                className={`border border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${
                  date === d ? "bg-ink text-paper" : "bg-paper-card text-ink"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-2 border-ink bg-paper px-3 py-2 font-body text-[15px] text-ink focus:outline-none"
          />
        </div>

        {error && (
          <div className="mb-3 border border-accent bg-accent-soft p-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onDone}
            className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3 hover:text-accent"
          >
            Not now
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="border-2 border-ink bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-fg transition-colors hover:bg-ink disabled:opacity-40"
          >
            {busy ? "Building..." : "Build my plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build + commit**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5
git add components/study-plan/onboarding-modal.tsx
git commit -m "feat(plan): onboarding modal with test-date picker"
```

---

## Task 10: Wrap-up view + /study-plan route

**Files:**
- Create: `components/study-plan/wrap-up-view.tsx`
- Create: `app/(authenticated)/study-plan/page.tsx`

- [ ] **Step 1: Wrap-up view**

```tsx
// components/study-plan/wrap-up-view.tsx
import Link from "next/link";
import type { StudyPlan } from "@/types/study-plan";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";

interface Props {
  plan: StudyPlan;
  profile: AdaptiveProfile | null;
}

export function WrapUpView({ plan, profile }: Props) {
  const finalSessions = Object.keys(plan.completedDays ?? {}).length;
  const rows = plan.skillQueue.map((q) => {
    const mastery = profile?.skills?.[q.skill]?.mastery ?? 0;
    return { skill: q.skill, mastery, target: q.targetMastery };
  });

  return (
    <div className="mx-auto max-w-[720px]">
      <div className="kicker mb-2">Test day is behind you</div>
      <h2 className="mb-4 font-display text-[clamp(36px,4vw,56px)] leading-tight text-ink">
        Plan <em className="text-accent" style={{ fontStyle: "italic" }}>archived</em>.
      </h2>
      <p className="mb-6 font-body text-[15px] italic text-ink-2">
        You logged {finalSessions} session{finalSessions === 1 ? "" : "s"} against this plan.
      </p>

      <div className="mb-6 border-2 border-ink bg-paper-card">
        <div className="border-b border-rule-hair p-4">
          <div className="kicker">Where you landed</div>
        </div>
        <div className="divide-y divide-rule-hair">
          {rows.map(({ skill, mastery, target }) => (
            <div key={skill} className="grid grid-cols-[1fr_auto] gap-4 p-4">
              <span className="font-display text-[16px] text-ink">{skillLabel(skill)}</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3">
                {Math.round(mastery * 100)}% &middot; target {Math.round(target * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/coach-chat?focus=composer"
        className="inline-block border-2 border-ink bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-fg hover:bg-ink"
      >
        How&rsquo;d it go? &rarr;
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Route page**

```tsx
// app/(authenticated)/study-plan/page.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { TopBar } from "@/components/layout/top-bar";
import { WeekStrip } from "@/components/study-plan/week-strip";
import { NarrativeCard } from "@/components/study-plan/narrative-card";
import { SkillProgress } from "@/components/study-plan/skill-progress";
import { OnboardingModal } from "@/components/study-plan/onboarding-modal";
import { WrapUpView } from "@/components/study-plan/wrap-up-view";
import { regenerateStudyPlan, skipCurrentWeek } from "@/lib/study-plan/client-regen";
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { StudyPlan } from "@/types/study-plan";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";

export default function StudyPlanPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<(StudyPlan & { id: string })[]>([]);
  const [archived, setArchived] = useState<(StudyPlan & { id: string })[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profile, setProfile] = useState<AdaptiveProfile | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "studyPlans"), where("uid", "==", user.uid));
    return onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as StudyPlan & { id: string });
      setPlans(all.filter((p) => p.status === "active"));
      setArchived(all.filter((p) => p.status === "archived"));
      if (!selectedId && all.length > 0) setSelectedId(all[0].id);
    });
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    getAdaptiveProfile(user.uid).then(setProfile);
  }, [user?.uid]);

  useEffect(() => {
    if (selectedId) {
      regenerateStudyPlan(selectedId).catch(() => {});
    }
  }, [selectedId]);

  if (!user) return null;

  const showWelcome = plans.length === 0 && archived.length === 0;
  const selected =
    plans.find((p) => p.id === selectedId) ??
    archived.find((p) => p.id === selectedId) ??
    plans[0] ??
    archived[0];

  async function handleSkip() {
    if (!selected) return;
    if (!confirm("Skip this week? Your skills will redistribute into remaining weeks.")) return;
    await skipCurrentWeek(selected.id);
  }

  return (
    <div className="min-h-screen bg-paper">
      <TopBar backHref="/home" backLabel="Home" />
      <main className="mx-auto max-w-[1000px] px-6 py-10">
        <header className="mb-8 border-b-2 border-ink pb-4">
          <div className="kicker mb-2">Your study plan</div>
          {selected && (
            <h1 className="font-display text-[clamp(36px,4vw,56px)] leading-[0.95] text-ink">
              {selected.status === "archived" ? (
                <>Plan <em className="text-accent" style={{ fontStyle: "italic" }}>archived</em>.</>
              ) : (
                <>
                  {Math.max(0, Math.floor(((selected.testDate.toMillis() - Date.now()) / (1000 * 60 * 60 * 24))))} days
                  {" "}to <em className="text-accent" style={{ fontStyle: "italic" }}>
                    {selected.course.split("-")[0].toUpperCase()}
                  </em>.
                </>
              )}
            </h1>
          )}
        </header>

        {showWelcome && (
          <div className="mx-auto max-w-xl border-2 border-ink bg-paper-card p-6 text-center shadow-[5px_5px_0_var(--color-ink)]">
            <div className="kicker mb-2">Nothing scheduled</div>
            <p className="mb-4 font-body text-[15px] italic text-ink-2">
              Build a plan from today to your test date. Takes 30 seconds.
            </p>
            <button
              onClick={() => setShowOnboarding(true)}
              className="border-2 border-ink bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-fg hover:bg-ink"
            >
              Build my plan
            </button>
          </div>
        )}

        {plans.length + archived.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {[...plans, ...archived].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`border-2 border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${
                  selectedId === p.id ? "bg-ink text-paper" : "bg-paper-card text-ink"
                }`}
              >
                {p.course} {p.status === "archived" && "(archived)"}
              </button>
            ))}
          </div>
        )}

        {selected && selected.status === "archived" && (
          <WrapUpView plan={selected} profile={profile} />
        )}

        {selected && selected.status === "active" && (
          <div className="flex flex-col gap-8">
            <WeekStrip plan={selected} />
            <NarrativeCard plan={selected} />
            <SkillProgress plan={selected} profile={profile} />
            <div className="flex flex-wrap gap-3 border-t-2 border-ink pt-4">
              <button
                onClick={handleSkip}
                className="border border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3 hover:text-accent"
              >
                Skip this week
              </button>
            </div>
          </div>
        )}

        {showOnboarding && <OnboardingModal onDone={() => setShowOnboarding(false)} />}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Build + commit**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5 && ls out/study-plan/index.html 2>&1
git add components/study-plan/wrap-up-view.tsx 'app/(authenticated)/study-plan/page.tsx'
git commit -m "feat(plan): /study-plan route with wrap-up view"
```

Expected: `out/study-plan/index.html` exists after build.

---

## Task 11: Nav entry

**Files:**
- Modify: `components/layout/top-bar.tsx`

- [ ] **Step 1: Insert nav link between Skills Library and Progress**

```tsx
<NavLink href="/skills" active={skillsActive}>Skills Library</NavLink>
<NavLink href="/study-plan" active={pathname?.startsWith("/study-plan")}>
  Study Plan
</NavLink>
<NavLink href="/dashboard" active={pathname?.startsWith("/dashboard")}>Progress</NavLink>
```

- [ ] **Step 2: Build + commit**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -3
git add components/layout/top-bar.tsx
git commit -m "feat(plan): Study Plan nav entry"
```

---

## Task 12: Practice results integration

**Files:**
- Create: `components/practice/plan-results-footer.tsx`
- Modify: `components/practice/practice-results-card.tsx`

- [ ] **Step 1: Footer component**

```tsx
// components/practice/plan-results-footer.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StudyPlan } from "@/types/study-plan";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";

export function PlanResultsFooter({ planId }: { planId: string | null }) {
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    if (!planId) return;
    getDoc(doc(db, "studyPlans", planId)).then((s) =>
      setPlan(s.exists() ? (s.data() as StudyPlan) : null)
    );
  }, [planId]);

  if (!planId || !plan) return null;

  // Next skill = next in currentWeekSkills that isn't completed today, or next week's first
  const todayIso = new Date().toISOString().slice(0, 10);
  const completedToday = !!plan.completedDays?.[todayIso];
  const remainingThisWeek = plan.currentWeekSkills.slice(1);
  const next = remainingThisWeek[0];
  const nextWeekFirst = plan.skillQueue.find(
    (q) => q.assignedWeek === plan.currentWeekIndex + 1
  )?.skill;

  const msg = completedToday
    ? next
      ? `Today's set complete. Next up this week: ${skillLabel(next)}.`
      : nextWeekFirst
        ? `Week complete. Next week kicks off with ${skillLabel(nextWeekFirst)}.`
        : "Week complete. See your plan for what's next."
    : `Plan progress saved. See your full ramp.`;

  return (
    <div className="mt-6 border-2 border-ink bg-paper-card p-5">
      <div className="kicker mb-2">Study plan</div>
      <p className="font-body text-[14px] italic text-ink-2">{msg}</p>
      <Link
        href="/study-plan"
        className="mt-3 inline-block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent hover:text-ink"
      >
        See plan &rarr;
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Inject into practice-results-card**

At the end of the results card's return JSX (just before the outermost closing `</div>` / `</...>`), add:

```tsx
import { PlanResultsFooter } from "./plan-results-footer";

// At top of component, pull planId from URL (results-card is a client component):
// Actually we pass it down from the runner. Add prop:
//   planId?: string | null
// and render:
<PlanResultsFooter planId={props.planId ?? null} />
```

- [ ] **Step 3: Thread ?plan= through the runner**

In `components/practice/practice-runner.tsx`, read `useSearchParams().get("plan")` and pass to `PracticeResultsCard` as a new optional prop. Same in `components/test/practice-test.tsx` if it uses the results card directly.

Exact edit pattern (practice-runner.tsx):

```tsx
import { useSearchParams } from "next/navigation";
// inside component:
const searchParams = useSearchParams();
const planId = searchParams?.get("plan") ?? null;
// where PracticeResultsCard is rendered, pass planId:
<PracticeResultsCard ... planId={planId} />
```

Add `planId?: string | null` to `PracticeResultsCardProps`.

- [ ] **Step 4: Build + commit**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -5
git add components/practice/
git commit -m "feat(plan): practice results footer with plan context"
```

---

## Task 13: Auto-complete hook

**Files:**
- Modify: `lib/test-persistence.ts`

- [ ] **Step 1: Add the hook**

After the `coachTriggerQueue` write, add:

```ts
// 3b. Mark the study plan day complete if this session's skills overlap.
try {
  const skillsInSession = Array.from(
    new Set(questions.map((q) => q.skill).filter(Boolean))
  );
  const { markDayCompletedIfMatches } = await import("@/lib/study-plan/client-regen");
  await markDayCompletedIfMatches(uid, course, skillsInSession as string[]);
} catch (e) {
  console.warn("study plan auto-complete failed:", e);
}
```

- [ ] **Step 2: Build + commit**

```bash
cd ~/pantherprep && npm run build 2>&1 | tail -3
git add lib/test-persistence.ts
git commit -m "feat(plan): auto-complete study plan day on matching session"
```

---

## Task 14: Parker study-plan-narrative skill

**Files:**
- Create: `~/Lachlan/.claude/skills/study-plan-narrative/SKILL.md`

- [ ] **Step 1: Write the skill**

```markdown
---
name: study-plan-narrative
description: Write Parker's weekly narrative for a pantherprep student's study plan. Input: uid + course. Output: JSON with narrative + pullQuote, or skipped:true. Invoked by the Mac mini Sunday 10 PM regen script.
---

# study-plan-narrative

Write one short, direct coach note about the student's plan for the coming week. The narrative is a written-prose summary of why this week's skills matter given their data.

## Invocation

```
claude --print "Run study-plan-narrative with --uid <UID> --course <COURSE>"
```

Extract args from the prompt. Both required.

## Voice

Use the shared voice guide: `~/Lachlan/.claude/skills/coach-draft/parker-coach-voice.md`. 3–4 sentences. Specific over generic. Concrete numbers (mastery %, skill names). No cheerleading. Pull-quote is 2–6 words from the narrative, verbatim.

## Process

1. Load via firebase-admin (project `pantherprep-a5a73`, use `~/pantherlearn/node_modules/firebase-admin`):
   - `studyPlans/{uid}_{course}` — currentWeekSkills, skillQueue, testDate, weeksRemaining implied
   - `adaptiveProfile/{uid}` — current mastery + last week's (use `lastUpdated` to detect change)
   - `performanceLog/{uid}/answers` last 50 answers with `timestamp >= 7 days ago`

2. Compute week-over-week mastery deltas for this week's skills.

3. Dedupe: if `currentWeekSkills` are identical to the previous run's (check by storing a stamp on the plan) AND the student logged zero answers in the last 7 days, output:

```
{ "skipped": true, "reason": "no change" }
```

4. Otherwise draft narrative + pullQuote. Example shapes:
   - After a strong week: "Linear equations moved 12 points this week — 58% to 70%. Keep that momentum; systems of equations is where the next point-bump lives."
   - After a quiet week: "Quiet week on algebra. Plan carries over. Two sessions on linear equations this week gets you back on pace."
   - Cramming mode: "Two weeks out. Your five weakest skills are the plan. Monday's focus: linear equations, still at 58%."

5. Output JSON to stdout (nothing else):

```
{ "narrative": "...", "pullQuote": "...", "skipped": false }
```

## Constraints

- No paid API. This runs inside a Claude Code session.
- One invocation = one plan = one output. Never batch.
- Never write to Firestore yourself — return JSON only. The regen script handles writes.
```

- [ ] **Step 2: Commit (in Lachlan repo)**

```bash
cd ~/Lachlan
git add .claude/skills/study-plan-narrative/
git commit -m "feat(study-plan-narrative): skill for weekly plan prose"
```

---

## Task 15: Sunday regen script

**Files:**
- Create: `~/Lachlan/scripts/study-plan-regen.cjs`

- [ ] **Step 1: Write**

```js
// ~/Lachlan/scripts/study-plan-regen.cjs
// Sunday 22:00 launchd job. For each active plan:
//  1. Run the algorithm (pure JS port below) and write skillQueue +
//     currentWeekSkills, etc.
//  2. If material change, invoke study-plan-narrative skill.
//  3. Write narrative + pullQuote to the plan.
//  4. Invoke coach-draft with trigger=weekly_plan_update to put a coach
//     note into the approval queue (reuses the existing Coach Chat
//     pipeline for Discord ping + dashboard surface).

const path = require("path");
const os = require("os");
const fs = require("fs");
const { execFileSync } = require("child_process");

try {
  const envText = fs.readFileSync(path.join(os.homedir(), "Lachlan", ".env"), "utf8");
  for (const line of envText.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const admin = require(path.join(os.homedir(), "pantherlearn", "node_modules", "firebase-admin"));
if (!admin.apps.length) admin.initializeApp({ projectId: "pantherprep-a5a73" });
const db = admin.firestore();
const { Timestamp } = admin.firestore;

function resolveClaude() {
  const candidates = [
    path.join(os.homedir(), ".claude", "bin", "claude"),
    "/usr/local/bin/claude",
    "claude",
  ];
  for (const c of candidates) {
    try { if (c === "claude" || fs.existsSync(c)) return c; } catch {}
  }
  return "claude";
}
const CLAUDE_CLI = resolveClaude();

// --- Algorithm ported from lib/study-plan/algorithm.ts ---
// Kept in sync with that file. When changing one, change the other.
// Only the minimum needed for regen: produces skillQueue + currentWeek fields.
// (Full parity with client is nice-to-have; the server regen doesn't set today.)

const DOMAIN_WEIGHTS = {
  sat: { Algebra: 0.35, "Advanced Math": 0.35, "Problem Solving & Data": 0.15, "Geometry & Trig": 0.15 },
  nmsqt: { Algebra: 0.35, "Advanced Math": 0.325, "Problem Solving & Data": 0.2, "Geometry & Trig": 0.125 },
  p89: { Algebra: 0.425, "Advanced Math": 0.2, "Problem Solving & Data": 0.2, "Geometry & Trig": 0.175 },
};

const SCOPE = {
  radical_equations: { sat: true, nmsqt: true, p89: false },
  rational_expressions: { sat: true, nmsqt: true, p89: false },
  margin_of_error: { sat: true, nmsqt: true, p89: false },
  evaluating_statistical_claims: { sat: true, nmsqt: false, p89: false },
  right_triangle_trig: { sat: true, nmsqt: true, p89: false },
  unit_circle: { sat: true, nmsqt: false, p89: false },
  circle_equations_xy: { sat: true, nmsqt: false, p89: false },
};

const MATH_SKILLS = {
  Algebra: ["linear_equations","linear_inequalities","systems_of_equations","linear_functions","absolute_value"],
  "Advanced Math": ["quadratic_equations","quadratic_formula","polynomial_operations","equivalent_expressions","function_notation","completing_the_square","exponential_functions","radical_equations","rational_expressions"],
  "Problem Solving & Data": ["ratios_rates","percentages","unit_conversion","scatterplots","linear_regression","probability","statistics_central_tendency","statistics_spread","two_way_tables","expected_value","margin_of_error","evaluating_statistical_claims"],
  "Geometry & Trig": ["area_perimeter","volume","triangles","circles","circle_equations_xy","coordinate_geometry","right_triangle_trig","unit_circle"],
};

const RW_SKILLS = {
  "Information & Ideas": ["central_ideas","details_evidence","inferences","quantitative_evidence","text_structure"],
  "Craft & Structure": ["vocabulary_in_context","purpose_function","cross_text_connections"],
  "Expression of Ideas": ["transitions","rhetorical_synthesis"],
  "Standard English Conventions": ["subject_verb_agreement","pronoun_clarity","modifiers","parallelism","verb_tense","punctuation_boundaries","comma_usage","colon_usage","possessives"],
};

const PREREQUISITES = {
  linear_inequalities: ["linear_equations"],
  systems_of_equations: ["linear_equations"],
  linear_functions: ["linear_equations"],
  completing_the_square: ["quadratic_equations","equivalent_expressions"],
  quadratic_formula: ["quadratic_equations"],
  polynomial_operations: ["equivalent_expressions"],
  function_notation: ["linear_functions"],
  exponential_functions: ["equivalent_expressions"],
  radical_equations: ["quadratic_equations"],
  rational_expressions: ["equivalent_expressions"],
  margin_of_error: ["statistics_spread"],
  evaluating_statistical_claims: ["margin_of_error"],
  scatterplots: ["linear_functions"],
  linear_regression: ["scatterplots"],
  right_triangle_trig: ["triangles"],
  unit_circle: ["right_triangle_trig"],
  circle_equations_xy: ["circles","completing_the_square"],
};

function programOf(course) {
  if (course.startsWith("psat89")) return "p89";
  if (course.startsWith("nmsqt")) return "nmsqt";
  return "sat";
}

function inScope(skill, program) {
  const s = SCOPE[skill];
  return s ? !!s[program] : true;
}

function domainForSkill(skill, course) {
  const tax = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  for (const [domain, skills] of Object.entries(tax)) {
    if (skills.includes(skill)) return domain;
  }
  return "Unknown";
}

function buildPlan({ profile, testDate, today, course }) {
  const ms = testDate.getTime() - today.getTime();
  const weeks = Math.max(0, Math.floor(ms / (7 * 24 * 3600 * 1000)));
  const mode = weeks < 2 ? "cramming" : "normal";
  const program = programOf(course);
  const tax = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  const allSkills = [];
  for (const skills of Object.values(tax)) allSkills.push(...skills);
  const eligible = allSkills.filter((s) => inScope(s, program));
  const weights = DOMAIN_WEIGHTS[program] ?? {};

  const recIndex = new Map();
  (profile?.recommendations ?? []).forEach((r, i) => recIndex.set(r.skill, i));
  const recCount = profile?.recommendations?.length ?? 0;

  function score(skill) {
    const sd = profile?.skills?.[skill];
    const mastery = sd?.mastery ?? 0;
    const ta = sd?.totalAnswers ?? 0;
    const unexploredBoost = ta < 5 ? 1 : 0;
    const masteryGap = 1 - mastery;
    const domainWeight = weights[domainForSkill(skill, course)] ?? 0.1;
    const recRank = recIndex.get(skill);
    const recBoost = recRank !== undefined && recCount > 0 ? 1 - recRank / recCount : 0;
    return unexploredBoost * 2 + masteryGap * 0.6 + domainWeight * 0.3 + recBoost * 0.1;
  }

  const ranked = [...eligible].sort((a, b) => score(b) - score(a));
  const trimmed = mode === "cramming" ? ranked.slice(0, 5) : ranked;

  const maxWeek = Math.max(0, weeks - 1);
  const assigned = new Map();
  let weekCursor = 0;
  let inWeek = 0;

  for (const skill of trimmed) {
    const prereqs = (PREREQUISITES[skill] ?? []).filter((p) => trimmed.includes(p));
    let earliest = weekCursor;
    for (const p of prereqs) {
      const pw = assigned.get(p);
      if (pw !== undefined && pw + 1 > earliest) earliest = pw + 1;
    }
    if (earliest > weekCursor) { weekCursor = earliest; inWeek = 0; }
    const w = Math.min(weekCursor, maxWeek);
    assigned.set(skill, w);
    inWeek++;
    if (inWeek >= 2) { weekCursor++; inWeek = 0; }
  }

  const skillQueue = trimmed
    .map((skill) => ({
      skill,
      assignedWeek: assigned.get(skill) ?? maxWeek,
      targetMastery: skill in (profile?.skills ?? {}) ? 0.8 : 0.75,
    }))
    .sort((a, b) => a.assignedWeek - b.assignedWeek);

  const currentWeekIndex = 0;
  const currentWeekSkills = skillQueue.filter((q) => q.assignedWeek === currentWeekIndex).map((q) => q.skill);

  return {
    weeks,
    mode,
    skillQueue,
    currentWeekIndex,
    currentWeekSkills,
    targetSessionsThisWeek: mode === "cramming" ? 4 : 3,
  };
}

// --- Main ---

async function invokeNarrative(uid, course) {
  const prompt = `Run study-plan-narrative with --uid ${uid} --course ${course}.\nReturn a single JSON line on stdout.`;
  let out = "";
  try {
    out = execFileSync(CLAUDE_CLI, ["--print", prompt], { timeout: 180_000, encoding: "utf8" });
  } catch (e) {
    console.warn(`[narrative] failed ${uid}_${course}:`, e.message);
    return null;
  }
  const match = out.match(/\{[\s\S]*"(narrative|skipped)"[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

const DISCORD_WEBHOOK = process.env.DISCORD_COACH_CHAT_WEBHOOK || "";

async function postDraftToDiscord(draftId, uid, body) {
  if (!DISCORD_WEBHOOK) return;
  const student = await db.collection("students").doc(uid).get();
  const studentName = student.data()?.displayName ?? uid.slice(0, 8);
  const endpointBase = "http://localhost:8710";
  const dashboardUrl = `https://pantherprep.web.app/dashboard?tab=drafts&draft=${draftId}`;
  const payload = {
    embeds: [{
      title: `Weekly plan note · ${studentName}`,
      description: body.length > 800 ? body.slice(0, 800) + "..." : body,
      color: 0xbb4430,
      fields: [{
        name: "Actions",
        value: `[Approve](${endpointBase}/approve?id=${draftId}) · [Edit](${dashboardUrl}) · [Reject](${endpointBase}/reject?id=${draftId}) · [Send now](${endpointBase}/send?id=${draftId})`,
      }],
    }],
  };
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn("[discord] post failed:", e.message);
  }
}

async function writeCoachDraft(uid, narrative, pullQuote, course) {
  // Write directly to coachDrafts — we already have the body from Parker's
  // narrative invocation. No need to re-invoke the coach-draft skill.
  // The Discord ping is handled here rather than in the coach-chat trigger
  // engine since this path doesn't go through invokeCoachDraft.
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(Date.now() + 24 * 3600 * 1000);
  try {
    const ref = await db.collection("coachDrafts").add({
      threadUid: uid,
      body: narrative,
      quotedPassage: pullQuote || null,
      linkedSkill: null,
      linkedCourse: course,
      trigger: "weekly_plan_update",
      author: "parker",
      draftedAt: now,
      expiresAt,
      status: "pending",
      lukeEdited: false,
    });
    console.log(`[coach-draft] created ${ref.id} for ${uid}`);
    await postDraftToDiscord(ref.id, uid, narrative);
  } catch (e) {
    console.warn(`[coach-draft] write failed ${uid}:`, e.message);
  }
}

async function main() {
  const snap = await db.collection("studyPlans").where("status", "==", "active").get();
  console.log(`[study-plan-regen] ${snap.size} active plans`);

  for (const doc of snap.docs) {
    const plan = doc.data();
    const now = Timestamp.now();

    // Archive if testDate passed
    if (plan.testDate.toMillis() < Date.now()) {
      await doc.ref.update({ status: "archived", lastRegeneratedAt: now });
      console.log(`[archive] ${doc.id}`);
      continue;
    }

    // Regen
    const prof = await db.collection("adaptiveProfile").doc(plan.uid).get();
    const profile = prof.exists ? prof.data() : null;
    const out = buildPlan({
      profile,
      testDate: plan.testDate.toDate(),
      today: new Date(),
      course: plan.course,
    });

    const prevKey = (plan.currentWeekSkills ?? []).join(",");
    const newKey = out.currentWeekSkills.join(",");

    await doc.ref.update({
      skillQueue: out.skillQueue,
      currentWeekIndex: out.currentWeekIndex,
      currentWeekSkills: out.currentWeekSkills,
      targetSessionsThisWeek: out.targetSessionsThisWeek,
      mode: out.mode,
      lastRegeneratedAt: now,
      lastAlgorithmRunAt: now,
    });

    const changed = prevKey !== newKey;
    if (!changed) {
      console.log(`[regen] ${doc.id} unchanged`);
      continue;
    }

    const narr = await invokeNarrative(plan.uid, plan.course);
    if (!narr || narr.skipped || !narr.narrative) {
      console.log(`[regen] ${doc.id} narrative skipped:`, narr?.reason ?? "no output");
      continue;
    }

    await doc.ref.update({
      weeklyNarrative: narr.narrative,
      pullQuote: narr.pullQuote ?? null,
    });

    await writeCoachDraft(plan.uid, narr.narrative, narr.pullQuote ?? "", plan.course);
    console.log(`[regen] ${doc.id} narrative + coach-draft fired`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Syntax check + commit**

```bash
node -c ~/Lachlan/scripts/study-plan-regen.cjs && echo OK
cd ~/Lachlan
git add scripts/study-plan-regen.cjs
git commit -m "feat(study-plan): Sunday regen script + narrative trigger"
```

---

## Task 16: Archive cron (daily)

**Files:**
- Create: `~/Lachlan/scripts/study-plan-archive.cjs`

- [ ] **Step 1: Write**

```js
// ~/Lachlan/scripts/study-plan-archive.cjs
// Daily 01:00 launchd job. Flips past-date active plans to status=archived.
// Redundant with the Sunday regen's same logic, but catches single-day
// tests sooner (Wed test → archive Wed 01:00 instead of waiting for Sunday).

const path = require("path");
const os = require("os");
const admin = require(path.join(os.homedir(), "pantherlearn", "node_modules", "firebase-admin"));
if (!admin.apps.length) admin.initializeApp({ projectId: "pantherprep-a5a73" });
const db = admin.firestore();
const { Timestamp } = admin.firestore;

async function main() {
  const now = Timestamp.now();
  const snap = await db
    .collection("studyPlans")
    .where("status", "==", "active")
    .where("testDate", "<", now)
    .get();

  console.log(`[archive] ${snap.size} plans past testDate`);
  for (const d of snap.docs) {
    await d.ref.update({ status: "archived", lastRegeneratedAt: now });
    console.log(`  archived ${d.id}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Syntax + commit**

```bash
node -c ~/Lachlan/scripts/study-plan-archive.cjs && echo OK
cd ~/Lachlan
git add scripts/study-plan-archive.cjs
git commit -m "feat(study-plan): daily archive cron"
```

---

## Task 17: Seed script (dev helper)

**Files:**
- Create: `~/Lachlan/scripts/study-plan-seed.cjs`

- [ ] **Step 1: Write**

```js
// ~/Lachlan/scripts/study-plan-seed.cjs
// Usage: node ~/Lachlan/scripts/study-plan-seed.cjs <studentUid> [course=sat-math] [testDateISO]
// Seeds an active plan with a placeholder narrative for UI work.

const path = require("path");
const os = require("os");
const admin = require(path.join(os.homedir(), "pantherlearn", "node_modules", "firebase-admin"));
if (!admin.apps.length) admin.initializeApp({ projectId: "pantherprep-a5a73" });
const db = admin.firestore();
const { Timestamp } = admin.firestore;

const uid = process.argv[2];
const course = process.argv[3] ?? "sat-math";
const testIso = process.argv[4] ?? "2026-06-07";

if (!uid) {
  console.error("Usage: node study-plan-seed.cjs <uid> [course=sat-math] [testDateISO]");
  process.exit(1);
}

async function main() {
  const now = Timestamp.now();
  const testDate = Timestamp.fromDate(new Date(testIso + "T12:00:00"));
  const planId = `${uid}_${course}`;

  const skillQueue = [
    { skill: "linear_equations", assignedWeek: 0, targetMastery: 0.8 },
    { skill: "systems_of_equations", assignedWeek: 0, targetMastery: 0.8 },
    { skill: "quadratic_equations", assignedWeek: 1, targetMastery: 0.8 },
    { skill: "equivalent_expressions", assignedWeek: 1, targetMastery: 0.8 },
    { skill: "completing_the_square", assignedWeek: 2, targetMastery: 0.75 },
    { skill: "function_notation", assignedWeek: 2, targetMastery: 0.75 },
  ];

  await db.collection("studyPlans").doc(planId).set({
    uid,
    course,
    testDate,
    createdAt: now,
    status: "active",
    mode: "normal",
    skillQueue,
    currentWeekIndex: 0,
    currentWeekSkills: ["linear_equations", "systems_of_equations"],
    targetSessionsThisWeek: 3,
    weeklyNarrative: "Algebra holds you back — linear equations at 58%, systems at 51%. This week is just those two, three sessions each. Quadratics land next week once these feel automatic.",
    pullQuote: "just those two",
    completedDays: {},
    skippedWeeks: [],
    lastRegeneratedAt: now,
    lastAlgorithmRunAt: now,
  }, { merge: true });

  console.log(`seeded: ${planId}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Run + commit**

```bash
node ~/Lachlan/scripts/study-plan-seed.cjs 3EamxTbwkUNYTIUrXuje6q2lc6C3
# Expected: "seeded: 3EamxTbwkUNYTIUrXuje6q2lc6C3_sat-math"

cd ~/Lachlan
git add scripts/study-plan-seed.cjs
git commit -m "feat(study-plan): dev seed script"
```

---

## Task 18: launchd plists

**Files:**
- Create: `~/Lachlan/ops/study-plan/com.luke.study-plan-regen.plist`
- Create: `~/Lachlan/ops/study-plan/com.luke.study-plan-archive.plist`
- Create: `~/Lachlan/ops/study-plan/install.sh`

- [ ] **Step 1: Regen plist (Sunday 22:00)**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.luke.study-plan-regen</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/node</string>
        <string>/Users/lukemccarthy/Lachlan/scripts/study-plan-regen.cjs</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Weekday</key><integer>0</integer>
        <key>Hour</key><integer>22</integer>
        <key>Minute</key><integer>0</integer>
    </dict>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
    </dict>
    <key>StandardOutPath</key><string>/tmp/study-plan-regen.log</string>
    <key>StandardErrorPath</key><string>/tmp/study-plan-regen.err</string>
</dict>
</plist>
```

- [ ] **Step 2: Archive plist (daily 01:00)**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.luke.study-plan-archive</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/node</string>
        <string>/Users/lukemccarthy/Lachlan/scripts/study-plan-archive.cjs</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key><integer>1</integer>
        <key>Minute</key><integer>0</integer>
    </dict>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
    </dict>
    <key>StandardOutPath</key><string>/tmp/study-plan-archive.log</string>
    <key>StandardErrorPath</key><string>/tmp/study-plan-archive.err</string>
</dict>
</plist>
```

- [ ] **Step 3: Installer**

```bash
#!/bin/bash
set -e
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DST="$HOME/Library/LaunchAgents"
mkdir -p "$DST"
for f in com.luke.study-plan-regen.plist com.luke.study-plan-archive.plist; do
  cp "$SRC/$f" "$DST/$f"
  launchctl unload "$DST/$f" 2>/dev/null || true
  launchctl load "$DST/$f"
  echo "loaded $f"
done
echo "Installed."
```

- [ ] **Step 4: chmod + commit**

```bash
chmod +x ~/Lachlan/ops/study-plan/install.sh
cd ~/Lachlan
git add ops/study-plan/
git commit -m "feat(study-plan): launchd plists + installer"
```

---

## Task 19: Skill registration

**Files:**
- Modify: `~/Lachlan/CLAUDE.md`
- Modify: `~/Lachlan/context/team.md`

- [ ] **Step 1: Add to CLAUDE.md Active Skills**

After the `coach-draft` entry, add:

```
- `study-plan-narrative` — Writes Parker's weekly study-plan narrative for a pantherprep student. Invoked Sunday 22:00 by `~/Lachlan/scripts/study-plan-regen.cjs`. Output routes through the Coach Chat draft queue (trigger=weekly_plan_update) so Luke approves before the note ships.
```

- [ ] **Step 2: Add to Scheduled Tasks table**

```
| Study Plan Regen | Sun 10:00 PM | coach-chat | Red |
| Study Plan Archive | daily 1:00 AM | n/a | n/a |
```

- [ ] **Step 3: Add to team.md Skill Ownership**

```
| `study-plan-narrative` | Parker (voice) + Kit (regen script, plists) |
```

- [ ] **Step 4: Commit**

```bash
cd ~/Lachlan
git add CLAUDE.md context/team.md
git commit -m "docs(study-plan): register skill + scheduled tasks"
```

---

## Task 20: End-to-end smoke test (manual, with Luke)

- [ ] **Step 1: Deploy pantherprep**

```bash
cd ~/pantherprep && firebase deploy --only hosting
```

- [ ] **Step 2: Log in as test student, verify onboarding**

- Visit `/study-plan` with no plan — modal appears
- Pick SAT, Math only, upcoming date → "Build my plan"
- Verify plan doc created in Firestore, week strip + narrative card + skill progress all render
- Return to `/home` → Today card shows today's skill

- [ ] **Step 3: Verify practice integration**

- Click "Start today's set" → lands in practice runner with `?plan=<id>&skill=<x>&count=10`
- Complete a short session → results screen shows "Today's set complete. Next up: …"
- Verify `completedDays[today]` set in Firestore
- Return to home → Today card hides (day complete) OR shows next skill if week has more

- [ ] **Step 4: Skip week**

- On `/study-plan`, click "Skip this week"
- Verify `skippedWeeks` updated, week strip shows "Skipped", Today card hides

- [ ] **Step 5: Sunday regen smoke test**

- Run manually: `node ~/Lachlan/scripts/study-plan-regen.cjs`
- Verify `weeklyNarrative` + `pullQuote` populate on the seeded plan
- Verify a new pending draft appears in `coachDrafts` with `trigger: "weekly_plan_update"`
- Approve it in the dashboard Drafts tab
- Verify it appears as a coach note in `/coach-chat`

- [ ] **Step 6: Archive edge case**

- Manually edit a plan's `testDate` to yesterday in Firestore console
- Run: `node ~/Lachlan/scripts/study-plan-archive.cjs`
- Verify status flipped to `archived`
- Visit `/study-plan` → wrap-up view renders

- [ ] **Step 7: Final commit**

```bash
cd ~/pantherprep
echo -e "\n## 2026-04-19\n- Study Plan v1 shipped: deterministic algorithm, Today card, /study-plan route, Parker weekly narrative via Coach Chat queue.\n" >> CHANGELOG.md 2>/dev/null || true
git add CHANGELOG.md 2>/dev/null && git commit -m "docs: Study Plan v1 shipped" 2>/dev/null || true
```

---

## Self-review notes

- Every spec section has a task. §4 algorithm → T4. §5 narrative → T14+T15. §6 data model → T1+T6. §7 UI → T7-T12. §8 client regen → T5. §9 Mac mini → T15+T16+T18+T19. §10 lifecycle → T15 (archive in regen) + T16 (daily archive) + onboarding validation in T9.
- No placeholders. The one deliberate simplification: the server-side algorithm port in T15 doesn't compute `today` (server doesn't need it — the client does that on demand). Called out in the comment block.
- Type consistency: `buildPlan` signature is identical in T4 (TS) and T15 (JS port, modulo TS syntax). `StudyPlan` type matches the doc fields in T1 + T6 + T15 writes.
- Coach Chat integration: T15's `writeCoachDraft` writes directly to the `coachDrafts` collection rather than invoking the coach-draft skill. This is intentional — we already have the narrative body from the `study-plan-narrative` skill; no need to round-trip through a second Claude Code session. The same Discord embed + dashboard queue semantics apply.
