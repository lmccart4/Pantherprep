# PantherPrep Mastery Delta Implementation Plan (Spec E)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After a practice session finishes, show a "Session performance" breakdown card with session accuracy + before/after mastery delta per skill. Refresh the skill detail page and dashboard tabs when the student exits the runner so mastery numbers update in place.

**Architecture:** A small pure helper (`lib/mastery-delta.ts`) computes per-skill delta rows from two profile snapshots + the session's questions/answers. `PracticeRunner` accepts a `beforeProfile` prop from the caller, stashes it in a ref, refetches profile post-session, computes deltas, and passes them to `PracticeResultsCard`. The results card renders a new breakdown section above the existing per-question review. Skill detail page and dashboard Practice tab refetch profile on runner exit.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.7, Firebase 10 (client SDK), existing `PracticeRunner` / `PracticeResultsCard` / `getProfileSkillData` / `sourceToTaxonomyKey` / `useAdaptiveProfile` utilities.

**Spec:** [docs/superpowers/specs/2026-04-14-mastery-delta-spec-e-design.md](../specs/2026-04-14-mastery-delta-spec-e-design.md)

**Testing convention:** No automated test framework. Each task uses `npx tsc --noEmit` + `npm run build` + manual verification. Do NOT add a test framework.

---

## File map

| File | Status | Purpose |
|---|---|---|
| `lib/mastery-delta.ts` | create | `MasteryDeltaRow` type + `computeMasteryDeltas` helper |
| `components/practice/practice-runner.tsx` | modify | Accept `beforeProfile` prop, post-session profile refetch, compute deltas, pass to results card |
| `components/practice/practice-results-card.tsx` | modify | Accept `masteryDeltas` + `course` props, render breakdown card |
| `components/skills/skill-detail.tsx` | modify | Lift profile to local state, pass `beforeProfile` to runner, refetch on exit |
| `app/(authenticated)/dashboard/page.tsx` | modify | `StudentView` passes `refresh` callback down; `StudentPractice` passes `beforeProfile` to runner + calls refresh on exit |

---

## Task 1: Create `lib/mastery-delta.ts`

**Files:**
- Create: `lib/mastery-delta.ts`

- [ ] **Step 1: Create the file with this exact content**

```ts
// Pure helper for computing per-skill mastery deltas from before/after
// profile snapshots plus the practiced questions and answers. Consumed by
// PracticeRunner after session completion and rendered by
// PracticeResultsCard.

import {
  getProfileSkillData,
  sourceToTaxonomyKey,
} from "@/lib/skill-mapping";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { Question } from "@/types/question";

export interface MasteryDeltaRow {
  taxonomyKey: string;
  skillLabel: string;
  sessionCorrect: number;
  sessionTotal: number;
  beforePercent: number;    // 0-100, 0 if untested
  afterPercent: number;     // 0-100
  deltaPp: number;          // signed; positive = improvement
  beforeTotal: number;      // answer count before the session
  afterTotal: number;       // answer count after
  beforeTested: boolean;    // was there any data before this session
}

function isCorrect(q: Question, answer: string): boolean {
  if (!answer) return false;
  const ca = q.correctAnswer.trim();
  const ua = answer.trim();
  if (q.type === "spr") {
    const an = parseFloat(ua);
    const cn = parseFloat(ca);
    if (!isNaN(an) && !isNaN(cn)) return Math.abs(an - cn) < 1e-9;
    return ua.toLowerCase() === ca.toLowerCase();
  }
  return ua.toUpperCase() === ca.toUpperCase();
}

export function computeMasteryDeltas(
  questions: Question[],
  answers: Record<number, string>,
  beforeProfile: AdaptiveProfile | null,
  afterProfile: AdaptiveProfile | null
): MasteryDeltaRow[] {
  // Group question indices by taxonomy key (fallback to raw skill string
  // if the source label isn't in SKILL_MAP).
  const byTaxonomy = new Map<string, { questionIdxs: number[] }>();
  questions.forEach((q, idx) => {
    const taxonomyKey = sourceToTaxonomyKey(q.skill) ?? q.skill;
    if (!byTaxonomy.has(taxonomyKey)) {
      byTaxonomy.set(taxonomyKey, { questionIdxs: [] });
    }
    byTaxonomy.get(taxonomyKey)!.questionIdxs.push(idx);
  });

  const rows: MasteryDeltaRow[] = [];
  for (const [taxonomyKey, { questionIdxs }] of byTaxonomy) {
    let sessionCorrect = 0;
    let sessionTotal = 0;
    for (const i of questionIdxs) {
      const q = questions[i];
      const a = answers[i] ?? "";
      if (a === "") continue; // skipped questions don't count toward session accuracy
      sessionTotal += 1;
      if (isCorrect(q, a)) sessionCorrect += 1;
    }

    const before = getProfileSkillData(beforeProfile, taxonomyKey);
    const after = getProfileSkillData(afterProfile, taxonomyKey);
    const beforePercent = before.total > 0 ? Math.round(before.mastery * 100) : 0;
    const afterPercent = after.total > 0 ? Math.round(after.mastery * 100) : 0;

    rows.push({
      taxonomyKey,
      skillLabel: skillLabel(taxonomyKey),
      sessionCorrect,
      sessionTotal,
      beforePercent,
      afterPercent,
      deltaPp: afterPercent - beforePercent,
      beforeTotal: before.total,
      afterTotal: after.total,
      beforeTested: before.total > 0,
    });
  }

  // Sort by session accuracy descending — student sees wins first
  rows.sort((a, b) => {
    const aAcc = a.sessionTotal > 0 ? a.sessionCorrect / a.sessionTotal : 0;
    const bAcc = b.sessionTotal > 0 ? b.sessionCorrect / b.sessionTotal : 0;
    return bAcc - aAcc;
  });

  return rows;
}
```

- [ ] **Step 2: Type-check**

```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "mastery-delta" | head
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add lib/mastery-delta.ts
git commit -m "Add lib/mastery-delta: computeMasteryDeltas helper"
```

---

## Task 2: Extend `PracticeRunner` — accept beforeProfile, refetch after, compute deltas

**Files:**
- Modify: `components/practice/practice-runner.tsx`

- [ ] **Step 1: Read the current file structure**

```
cd /Users/lukemccarthy/pantherprep && sed -n '1,50p' components/practice/practice-runner.tsx
```

You'll see the imports, the `PracticeRunnerProps` interface, the `PracticeProgress` interface, and `isCorrect`. Familiarize yourself with the existing `finishSession` function around line 195 and the results-screen branch around line 325.

- [ ] **Step 2: Add imports**

At the top of `components/practice/practice-runner.tsx`, alongside the existing imports, add:

```ts
import { getAdaptiveProfile } from "@/lib/adaptive/performance-service";
import { computeMasteryDeltas, type MasteryDeltaRow } from "@/lib/mastery-delta";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
```

If `AdaptiveProfile` is already imported (it might be in the same import line as other performance-service types), don't duplicate.

- [ ] **Step 3: Extend `PracticeRunnerProps`**

Find the `PracticeRunnerProps` interface near the top of the file. Add one new field:

```ts
export interface PracticeRunnerProps {
  uid: string;
  email: string;
  course: string;
  skill?: string;
  skillLabel?: string;
  testType: string;
  questions: Question[];
  fallbackNotes?: string[];
  beforeProfile?: AdaptiveProfile | null;  // NEW — caller-provided, avoids an extra read
  onComplete?: (result: CompleteTestResult) => void;
  onExit: () => void;
  onPracticeAgain?: () => void;
}
```

- [ ] **Step 4: Add state + ref for before/after profiles and deltas**

Find the local-state block inside `PracticeRunner(props)` (the `useState` calls near the top). Destructure the new prop from props and add state:

```ts
const {
  uid,
  email,
  course,
  skill,
  skillLabel,
  testType,
  questions: propQuestions,
  fallbackNotes,
  beforeProfile: beforeProfileProp,
  onComplete,
  onExit,
  onPracticeAgain,
} = props;
```

And add near the other `useState` declarations (just below `finalResult`):

```ts
const [masteryDeltas, setMasteryDeltas] = useState<MasteryDeltaRow[]>([]);
const beforeProfileRef = useRef<AdaptiveProfile | null>(beforeProfileProp ?? null);
```

- [ ] **Step 5: Fallback fetch for `beforeProfile`**

Add a new `useEffect` after the existing "check for resumable progress" effect. It fetches the adaptive profile only when the caller didn't pass one:

```ts
useEffect(() => {
  if (beforeProfileRef.current || !uid) return;
  getAdaptiveProfile(uid).then((p) => {
    beforeProfileRef.current = p;
  });
}, [uid]);
```

The ref deliberately does not trigger a re-render — it's just a stash for `finishSession` to read.

- [ ] **Step 6: Replace `finishSession` to compute deltas after `completeTestSession`**

Find the existing `finishSession` function inside `PracticeRunner`. Replace it with:

```ts
const finishSession = async () => {
  const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
  try {
    const result = await completeTestSession({
      uid,
      email,
      testType,
      mode: "practice",
      course,
      questions,
      answers,
      timeSpent,
    });

    // Compute per-skill mastery deltas from a fresh profile fetch.
    let deltas: MasteryDeltaRow[] = [];
    try {
      const afterProfile = await getAdaptiveProfile(uid);
      deltas = computeMasteryDeltas(
        questions,
        answers,
        beforeProfileRef.current,
        afterProfile
      );
    } catch (e) {
      console.warn("mastery delta fetch failed:", e);
      // Non-fatal — render results without the delta card
    }
    setMasteryDeltas(deltas);

    // Mark progress doc completed so the next mount treats it as stale
    const finalState: PracticeProgress = {
      questions,
      answers,
      submitted,
      flagged: Array.from(flagged),
      currentQ: questions.length - 1,
      startedAt: startTimeRef.current,
      completedAt: Date.now(),
    };
    saveProgress(uid, progressKey, finalState as unknown as Record<string, unknown>).catch(
      () => {}
    );
    onComplete?.(result);
    setScreen("results");
  } catch (e) {
    console.error("completeTestSession failed:", e);
    setSaveError(true);
    setScreen("results");
  }
};
```

The delta fetch is wrapped in its own try/catch so a failure there doesn't block the results screen from rendering.

- [ ] **Step 7: Pass `masteryDeltas` + `course` to `PracticeResultsCard`**

Find the results screen branch (around line 325, where `screen === "results"` renders `<PracticeResultsCard ...>`). Add the new props:

```tsx
if (screen === "results") {
  const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
  return (
    <PracticeResultsCard
      questions={questions}
      answers={answers}
      timeSpent={timeSpent}
      saveError={saveError}
      fallbackNotes={fallbackNotes}
      masteryDeltas={masteryDeltas}
      course={course}
      onPracticeAgain={onPracticeAgain}
      onExit={onExit}
    />
  );
}
```

- [ ] **Step 8: Build**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -15
```

Expected: build succeeds (Task 3 will make `PracticeResultsCard` accept the new props — until then, TypeScript may warn about unknown props on PracticeResultsCard). If it fails with "unknown prop masteryDeltas", that's expected — continue to Task 3 before building again. Alternatively, temporarily suppress with `// @ts-expect-error` and remove after Task 3. **Preferred:** commit this task and do Task 3 in the same session so the two tasks are inseparable in the git history.

- [ ] **Step 9: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add components/practice/practice-runner.tsx
git commit -m "PracticeRunner: accept beforeProfile, refetch profile after finish, compute deltas"
```

---

## Task 3: Extend `PracticeResultsCard` — render the breakdown card

**Files:**
- Modify: `components/practice/practice-results-card.tsx`

- [ ] **Step 1: Read the current file**

```
cd /Users/lukemccarthy/pantherprep && wc -l components/practice/practice-results-card.tsx
cd /Users/lukemccarthy/pantherprep && sed -n '1,30p' components/practice/practice-results-card.tsx
```

Note the existing import block, `PracticeResultsCardProps` interface, and the component body.

- [ ] **Step 2: Add imports**

Alongside the existing imports at the top of `components/practice/practice-results-card.tsx`:

```ts
import Link from "next/link";
import type { MasteryDeltaRow } from "@/lib/mastery-delta";
```

- [ ] **Step 3: Extend `PracticeResultsCardProps`**

Find the existing `PracticeResultsCardProps` interface. Add two new optional fields:

```ts
interface PracticeResultsCardProps {
  questions: Question[];
  answers: Record<number, string>;
  timeSpent: number;
  saveError: boolean;
  fallbackNotes?: string[];
  masteryDeltas?: MasteryDeltaRow[];  // NEW
  course?: string;                    // NEW — for deep-linking skill names in the breakdown
  onPracticeAgain?: () => void;
  onExit: () => void;
}
```

- [ ] **Step 4: Destructure the new props**

Near the top of the component body, where props are destructured, add `masteryDeltas` and `course`:

```tsx
export function PracticeResultsCard({
  questions,
  answers,
  timeSpent,
  saveError,
  fallbackNotes,
  masteryDeltas,
  course,
  onPracticeAgain,
  onExit,
}: PracticeResultsCardProps) {
```

- [ ] **Step 5: Add local state for row expansion**

Near the top of the component body (after other variable declarations, before the return):

```tsx
const [showAllDeltas, setShowAllDeltas] = useState(false);
```

You'll need to import `useState` from react if it isn't already imported. Check the top of the file and add if missing.

- [ ] **Step 6: Render the new breakdown card**

Find the JSX return statement. Locate the summary card (the one with the big N/total score). Directly after that summary GlassCard closes, but BEFORE the existing skill breakdown / question review sections, insert the new breakdown card:

```tsx
{masteryDeltas && masteryDeltas.length > 0 && (
  <GlassCard>
    <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
      Session performance
    </div>
    <div className="flex flex-col divide-y divide-border-primary">
      {(showAllDeltas ? masteryDeltas : masteryDeltas.slice(0, 5)).map((row) => {
        const accPct =
          row.sessionTotal > 0
            ? Math.round((row.sessionCorrect / row.sessionTotal) * 100)
            : 0;
        const accBar =
          accPct >= 80
            ? "bg-emerald-400"
            : accPct >= 60
            ? "bg-lime-400"
            : accPct >= 40
            ? "bg-amber-400"
            : accPct >= 20
            ? "bg-orange-400"
            : "bg-red-400";
        const deltaColor =
          row.deltaPp > 0
            ? "text-emerald-400"
            : row.deltaPp < 0
            ? "text-red-400"
            : "text-text-muted";
        const deltaSign = row.deltaPp > 0 ? "+" : "";
        const bigJump = row.deltaPp >= 10;

        const nameNode = course ? (
          <Link
            href={`/skills/${course}/${row.taxonomyKey}`}
            className="text-sm font-semibold text-text-primary transition hover:text-panther-red"
          >
            {row.skillLabel}
          </Link>
        ) : (
          <span className="text-sm font-semibold text-text-primary">
            {row.skillLabel}
          </span>
        );

        return (
          <div key={row.taxonomyKey} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1">
              {nameNode}
              <div className="mt-0.5 text-xs text-text-muted">
                {row.sessionTotal > 0 ? (
                  <>
                    <span className="font-mono">{row.sessionCorrect}/{row.sessionTotal}</span>
                    <span className="ml-2">this session</span>
                  </>
                ) : (
                  <span>All questions skipped</span>
                )}
              </div>
            </div>
            {row.sessionTotal > 0 && (
              <div className="hidden w-28 overflow-hidden rounded-full bg-bg-secondary sm:block">
                <div className={`h-1.5 ${accBar}`} style={{ width: `${Math.max(accPct, 3)}%` }} />
              </div>
            )}
            <div className="text-right text-xs">
              {row.beforeTested ? (
                <>
                  <div className="text-text-secondary">
                    Mastery now <span className="font-semibold">{row.afterPercent}%</span>
                  </div>
                  <div className={deltaColor}>
                    {deltaSign}
                    {row.deltaPp}pp {bigJump && <span className="ml-1">↑ big jump</span>}
                  </div>
                </>
              ) : (
                <div className="text-text-secondary">
                  Starting fresh — <span className="font-semibold">{row.afterPercent}%</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {masteryDeltas.length > 5 && (
      <button
        onClick={() => setShowAllDeltas(!showAllDeltas)}
        className="mt-3 text-xs text-panther-red transition hover:text-panther-red/80"
      >
        {showAllDeltas
          ? "Show fewer"
          : `+${masteryDeltas.length - 5} more skill${masteryDeltas.length - 5 === 1 ? "" : "s"}`}
      </button>
    )}
  </GlassCard>
)}
```

**Important placement:** this block goes IMMEDIATELY after the summary GlassCard (the one with `text-3xl leading-none text-white` hero score) and BEFORE the existing "Skill Breakdown" card (if it exists) or the question-review card. If you're unsure, read the existing return block and insert right after the summary card, before any other card.

- [ ] **Step 7: Build**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -20
```

Expected: build succeeds. This also validates that Task 2's runner changes compile correctly now that the results card accepts the new props.

- [ ] **Step 8: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add components/practice/practice-results-card.tsx
git commit -m "PracticeResultsCard: render per-skill mastery delta breakdown card"
```

---

## Task 4: Wire the skill detail page — lift profile to local state, refetch on exit

**Files:**
- Modify: `components/skills/skill-detail.tsx`

The skill detail page currently receives `profile` as a prop from its wrapper and holds no local copy. To refetch on runner exit, lift it to local state inside `SkillDetail` so the component owns its own copy.

- [ ] **Step 1: Read the current component**

```
cd /Users/lukemccarthy/pantherprep && sed -n '60,120p' components/skills/skill-detail.tsx
```

Note where `profile` is destructured from props and where it's used (primarily in `getProfileSkillData(profile, taxonomyKey)` and in the related-skills render).

- [ ] **Step 2: Add a local profile state initialized from the prop**

Inside `SkillDetail({ uid, email, course, taxonomyKey, profile: propProfile })` (rename the prop to avoid shadowing), add a local state:

```ts
export function SkillDetail({
  uid,
  email,
  course,
  taxonomyKey,
  profile: propProfile,
}: SkillDetailProps) {
  const [profile, setProfile] = useState<AdaptiveProfile | null>(propProfile);
  // ... rest of the existing component body unchanged
}
```

The rest of the component already reads `profile` as a local identifier, so keeping that name after destructuring means no other edits are needed for the reads. The existing `useMemo(() => getProfileSkillData(profile, taxonomyKey), [profile, taxonomyKey])` keeps working.

- [ ] **Step 3: Sync local state when the prop changes**

Add a `useEffect` that syncs when the parent passes a new profile (e.g., if the user navigates to a different skill and the wrapper refetches):

```ts
useEffect(() => {
  setProfile(propProfile);
}, [propProfile]);
```

- [ ] **Step 4: Pass `profile` (the local state) to the runner as `beforeProfile`**

Find the `<PracticeRunner>` JSX block inside the `if (session)` branch of the component. Add the new prop:

```tsx
return (
  <PracticeRunner
    uid={uid}
    email={email}
    course={course}
    skill={taxonomyKey}
    skillLabel={label}
    testType={`${course}-skill-practice`}
    questions={session.questions}
    fallbackNotes={session.fallbackNotes}
    beforeProfile={profile}
    onExit={handleExit}
    onPracticeAgain={handlePracticeAgain}
  />
);
```

- [ ] **Step 5: Create a real `handleExit` that refetches profile + recent answers**

The existing `onExit` is an inline `() => setSession(null)` — extract it into a named handler that also refetches:

```ts
const handleExit = async () => {
  setSession(null);
  // Refetch profile + recent answers so the detail view shows post-practice data
  try {
    const [newProfile, newAnswers] = await Promise.all([
      getAdaptiveProfile(uid),
      getRecentAnswersForTaxonomyKey(uid, taxonomyKey, 100),
    ]);
    setProfile(newProfile);
    setRecentAnswers(newAnswers);
  } catch (e) {
    console.warn("post-practice refetch failed:", e);
  }
};
```

Place this next to the existing `handlePractice` / `handlePracticeAgain` handlers. The other declarations are already set up.

- [ ] **Step 6: Make sure `getAdaptiveProfile` is imported**

The component already imports `getRecentAnswersForTaxonomyKey` from `@/lib/skill-mapping`. Check the top of the file for `getAdaptiveProfile` from `@/lib/adaptive/performance-service`. If missing, add it to the existing import:

```ts
import {
  getAdaptiveProfile,
  // ... other existing imports
} from "@/lib/adaptive/performance-service";
```

Or create a new import line. Either works.

Also confirm `useState` and `useEffect` are already imported from `react` — they should be; the component already uses both.

- [ ] **Step 7: Build**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -15
```

Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add components/skills/skill-detail.tsx
git commit -m "SkillDetail: refetch profile + recent on runner exit; pass beforeProfile"
```

---

## Task 5: Wire the dashboard Practice tab — pass profile, refetch on exit

**Files:**
- Modify: `app/(authenticated)/dashboard/page.tsx`

The dashboard's `StudentView` uses `useAdaptiveProfile(uid)` which already returns `{profile, loading, error, refresh}`. `StudentPractice` receives `profile` as a prop but not the `refresh` callback — Task 5 plumbs `refresh` down and wires it into the exit handler.

- [ ] **Step 1: Locate the call site**

```
cd /Users/lukemccarthy/pantherprep && grep -n "StudentPractice\|refresh" app/\(authenticated\)/dashboard/page.tsx | head
```

You'll see `StudentView` destructuring `{ profile, loading, error, refresh }` on line ~111 and rendering `<StudentPractice profile={profile} uid={uid} email={email} course={course} />` somewhere below.

- [ ] **Step 2: Pass `refresh` to `StudentPractice`**

Find the `<StudentPractice>` JSX. Add an `onRefetch` prop that passes `refresh`:

```tsx
<StudentPractice
  profile={profile}
  uid={uid}
  email={email}
  course={course}
  onRefetch={refresh}
/>
```

- [ ] **Step 3: Update `StudentPractice`'s props**

Find the `function StudentPractice(...)` definition (around line 379). Add `onRefetch?: () => void` to its props type and destructure it:

```tsx
function StudentPractice({
  profile,
  uid,
  email,
  course,
  onRefetch,
}: {
  profile: AdaptiveProfile;
  uid: string;
  email: string;
  course: Course;
  onRefetch?: () => void;
}) {
```

- [ ] **Step 4: Update `handleExit` to call `onRefetch`**

Find the existing `handleExit` inside `StudentPractice`:

```ts
const handleExit = () => {
  setSession(null);
};
```

Replace with:

```ts
const handleExit = () => {
  setSession(null);
  onRefetch?.();
};
```

- [ ] **Step 5: Pass `beforeProfile` to the `PracticeRunner` inside `StudentPractice`**

Find the `<PracticeRunner>` JSX block inside `StudentPractice` (it's in the `if (session)` branch). Add the `beforeProfile` prop:

```tsx
if (session) {
  return (
    <PracticeRunner
      uid={uid}
      email={email}
      course={course}
      testType={`${course}-adaptive-practice`}
      questions={session.questions}
      fallbackNotes={session.fallbackNotes}
      beforeProfile={profile}
      onExit={handleExit}
      onPracticeAgain={handlePracticeAgain}
    />
  );
}
```

- [ ] **Step 6: Build**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -15
```

Expected: build succeeds.

- [ ] **Step 7: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add 'app/(authenticated)/dashboard/page.tsx'
git commit -m "Dashboard: pass beforeProfile + refetch callback to StudentPractice"
```

---

## Task 6: Manual verification, merge, push, deploy

**Files:** none — ops only.

- [ ] **Step 1: Deploy to prod for testing**

```
cd /Users/lukemccarthy/pantherprep && firebase deploy --only hosting 2>&1 | tail -10
```

- [ ] **Step 2: Single-skill session test**

1. Sign in as a test student that already has at least 5 answers logged on `sat-math / linear_equations` (or whatever skill you pick).
2. Navigate to `/skills/sat-math/linear_equations`. Note the current mastery percent.
3. Click **Practice this skill**. Answer all 10 questions honestly.
4. On the results screen, confirm:
   - The hero `N/10` score renders as before
   - A new "Session performance" card appears below the hero
   - One row showing `Linear Equations`, session accuracy, and "Mastery now X% (+Ypp from Z%)" with a colored delta
   - If delta ≥ +10pp, a small "↑ big jump" badge appears
5. Click the skill name in the breakdown — confirm it routes to `/skills/sat-math/linear_equations`.

- [ ] **Step 3: First-time session test**

1. Pick a skill you have never practiced (e.g., `/skills/sat-math/quadratic_formula` if it has questions).
2. Click Practice, answer through. Confirm the breakdown row shows "Starting fresh — X%" instead of a delta.

- [ ] **Step 4: Adaptive session test**

1. Go to `/dashboard` → Practice tab → **Launch Adaptive Practice**.
2. Answer 15 questions through to completion.
3. Confirm the results screen shows the "Session performance" card with multiple rows, one per unique skill in the batch.
4. Confirm sorting: highest session accuracy first.
5. If more than 5 skills are represented, confirm the "+N more skills" toggle works.
6. Confirm each skill name is a clickable Link that routes to the detail page.

- [ ] **Step 5: Detail page refresh test**

1. From `/skills/sat-math/linear_equations`, click Practice. Finish a session.
2. Click **Back** (onExit) from the results card.
3. Confirm that you return to the detail view AND that the mastery circle + recent activity squares + trendline show the post-practice data immediately — no manual page refresh needed.

- [ ] **Step 6: Dashboard refresh test**

1. From the dashboard, Practice tab, launch adaptive practice. Finish a session.
2. Click **Back** from the results card.
3. Click the Skills tab. Confirm the 6-item preview reflects the new mastery values.
4. Click the Overview tab. Confirm the recommendations list reflects any changes.

- [ ] **Step 7: Error-path test (optional but recommended)**

Open DevTools → Application → Network → set throttling to Offline → start a practice session → answer questions → try to finish. Confirm the results screen still renders with the save-error banner and the breakdown card is empty (no deltas because the afterProfile fetch fails). Restore network.

- [ ] **Step 8: Report results**

Tell Luke:
- Did all 6 verification tests pass?
- Any surprises in the breakdown UI (layout bugs, delta color wrong, sort order wrong)?
- Any Firestore errors in the browser console?

Do NOT merge until all tests pass.

- [ ] **Step 9: Merge**

```
cd /Users/lukemccarthy/pantherprep && git checkout main
cd /Users/lukemccarthy/pantherprep && git merge --ff-only feat/mastery-delta
cd /Users/lukemccarthy/pantherprep && git push origin main 2>&1 | tail -3
cd /Users/lukemccarthy/pantherprep && git branch -d feat/mastery-delta
```

- [ ] **Step 10: Report to Luke**

Spec E shipped. All five specs of the skill-based practice initiative are now complete (D → B → A → E). Spec C (Parker authoring pipeline) remains as the content-authoring initiative.

---

## Out-of-scope follow-ups (do not implement here)

- **Parker content authoring pipeline** — spec C.
- **Animated counter on the delta number** — out of scope per the non-goals.
- **XP, streaks, levels tied to mastery gains** — separate gamification initiative.
- **Time-series mastery chart** — the 14-day trendline from spec A is the history view.
- **Teacher-side display of student mastery deltas** — out of scope.
- **Consolidating `isCorrect` logic** across `mastery-delta.ts`, `practice-runner.tsx`, `practice-results-card.tsx`, and `lib/question-utils.ts` — there are now four copies of this helper. Worth a DRY pass later but not in spec E.

## Known caveats

- The `afterProfile` fetch adds one extra Firestore read per practice session completion. For a student doing 10 sessions a day, that's 10 extra reads — negligible.
- If `recomputeProfile` is ever made asynchronous (e.g., moved to a Cloud Function trigger), the `getAdaptiveProfile` call in `finishSession` may read stale data. Currently synchronous, so this isn't an issue.
- The "big jump" threshold is hardcoded at 10pp. If students find it too easy or too hard to trigger, we can adjust — but the threshold stays in `practice-results-card.tsx` as a hardcoded constant, not a config.
- The breakdown card's "+N more skills" toggle expands inline but doesn't persist across remounts. Acceptable for a transient results screen.
