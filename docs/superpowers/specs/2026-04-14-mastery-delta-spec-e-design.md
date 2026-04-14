# PantherPrep — Per-skill Mastery Delta Display (Spec E)

**Date:** 2026-04-14
**Owner:** Luke (Lachlan drafting)
**Status:** Design — awaiting approval
**Parent initiative:** Skill-based practice (decomposed into specs A, B, C, D, E)
**This spec:** E — feedback polish layer

## Context

Specs D + B + A are all live: students can browse a skill catalog, click into a detail page, and practice any skill. What's still missing: when a session finishes, the student sees a raw score and returns to the previous view with no sense of how the practice actually moved their mastery. The adaptive engine is updating mastery silently behind the scenes; students never see the feedback.

Spec E closes the loop. After every practice session, the results card shows session accuracy as the hero number and a per-skill breakdown with before → after mastery delta. On the skill detail page, the mastery circle refreshes automatically when the student exits the runner so the new mastery is visible without a manual refresh.

## Goals

1. **Surface mastery change.** After practice, show each skill's mastery before the session, after the session, and the delta in percentage points. Make learning progress visible.
2. **Show session accuracy alongside mastery delta.** Raw session accuracy is the most immediately meaningful number (8/10 on this session); mastery delta is secondary context.
3. **Refresh in place on exit.** When a student exits the runner from the skill detail page or the dashboard Practice tab, the surrounding view re-fetches the profile so the new mastery numbers are visible immediately.
4. **Celebrate big jumps.** Any delta ≥ +10pp gets a small "big jump" badge. No other animation or gamification.

## Non-goals

- **No animated counters, no confetti, no sound effects.** Static display with color only.
- **No mastery history chart beyond what spec A already shows.** The 14-day trendline on the detail page is the history view. Spec E does not add a longer history or a time-series comparison.
- **No delta persistence.** Deltas are computed live from before/after profile snapshots at results-card render time. Not stored in Firestore.
- **No XP, streaks, levels, leaderboards, or social comparison.** Those are separate gamification initiatives.
- **No predictive modeling** of where mastery will land after future practice.
- **No teacher-side display** of per-student mastery deltas. The teacher dashboard keeps its current view.
- **No adaptive engine changes.** The mastery formula, ease, interval, and `recomputeProfile` all stay as-is. Spec E only reads from the outputs.

## Architecture

### Data flow

```
Caller (skill detail page OR dashboard Practice tab)
  ↓ fetches adaptive profile for the student (already happens for UI display)
  ↓ passes `beforeProfile` as a new prop to <PracticeRunner>
  ↓
PracticeRunner mounts
  ↓ stashes beforeProfile in a ref (also falls back to fetching on mount if the prop is omitted)
  ↓ session runs
  ↓ student clicks Finish on the last question
  ↓
finishSession():
  1. call completeTestSession({...})   // writes performanceLog + recomputes profile + writes session summary
  2. call getAdaptiveProfile(uid)      // fresh after-session profile
  3. call computeMasteryDeltas(questions, answers, beforeProfile, afterProfile)
  4. setScreen("results") with finalResult + deltas
  ↓
PracticeResultsCard renders
  ↓ existing hero (N/total + percent + time spent)
  ↓ NEW: "Session performance" card with per-skill breakdown rows
  ↓ existing skill-aggregate + per-question review unchanged
  ↓ existing Practice again / Back buttons unchanged

On exit (runner.onExit or runner.onComplete), the caller refetches the profile
so the UI behind the runner updates naturally.
```

### Before-profile capture

`PracticeRunner` gains a new optional prop:

```ts
beforeProfile?: AdaptiveProfile | null;
```

Capture pattern inside the runner:

```ts
const beforeProfileRef = useRef<AdaptiveProfile | null>(props.beforeProfile ?? null);

useEffect(() => {
  if (!beforeProfileRef.current && props.uid) {
    getAdaptiveProfile(props.uid).then((p) => {
      beforeProfileRef.current = p;
    });
  }
}, [props.uid]);
```

If the caller passed `beforeProfile`, we use that directly — no extra Firestore read. If the caller omitted it, runner falls back to fetching on mount. This is the fast path for the skill detail page and the dashboard Practice tab (both already fetch the profile for their own display) while still working for any future caller that launches the runner without a profile in hand.

### After-profile capture

Runner's `finishSession()` gains an extra step right after `completeTestSession()` returns:

```ts
const result = await completeTestSession({...});
// NEW: fetch the freshly-recomputed profile
const afterProfile = await getAdaptiveProfile(uid);
const masteryDeltas = computeMasteryDeltas(
  questions,
  answers,
  beforeProfileRef.current,
  afterProfile
);
setFinalResult(result);
setMasteryDeltas(masteryDeltas);
setScreen("results");
```

One extra Firestore read per practice session. Cheap.

### Delta computation helper

New file `lib/mastery-delta.ts`:

```ts
import {
  getProfileSkillData,
  sourceToTaxonomyKey,
  TAXONOMY_TO_SOURCES,
} from "@/lib/skill-mapping";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { Question } from "@/types/question";

export interface MasteryDeltaRow {
  taxonomyKey: string;
  skillLabel: string;
  sessionCorrect: number;
  sessionTotal: number;
  beforePercent: number;    // 0-100, or 0 if untested
  afterPercent: number;     // 0-100
  deltaPp: number;          // signed; positive = improvement
  beforeTotal: number;      // answer count before the session
  afterTotal: number;       // answer count after
  beforeTested: boolean;    // was there any data before this session
}

export function computeMasteryDeltas(
  questions: Question[],
  answers: Record<number, string>,
  beforeProfile: AdaptiveProfile | null,
  afterProfile: AdaptiveProfile | null
): MasteryDeltaRow[] {
  // Group questions by taxonomy key
  const byTaxonomy = new Map<
    string,
    { questions: number[]; sourceSkill: string }
  >();
  questions.forEach((q, idx) => {
    const taxonomyKey = sourceToTaxonomyKey(q.skill) ?? q.skill;
    if (!byTaxonomy.has(taxonomyKey)) {
      byTaxonomy.set(taxonomyKey, { questions: [], sourceSkill: q.skill });
    }
    byTaxonomy.get(taxonomyKey)!.questions.push(idx);
  });

  const rows: MasteryDeltaRow[] = [];
  for (const [taxonomyKey, { questions: qIdxs }] of byTaxonomy) {
    // Tally session performance
    let sessionCorrect = 0;
    let sessionTotal = 0;
    for (const i of qIdxs) {
      const q = questions[i];
      const a = answers[i] ?? "";
      if (a === "") continue;  // skipped questions don't count toward session accuracy
      sessionTotal += 1;
      if (isCorrect(q, a)) sessionCorrect += 1;
    }
    // Compute before/after from profile
    const before = getProfileSkillData(beforeProfile, taxonomyKey);
    const after = getProfileSkillData(afterProfile, taxonomyKey);
    const beforePercent = before.total > 0 ? Math.round(before.mastery * 100) : 0;
    const afterPercent = after.total > 0 ? Math.round(after.mastery * 100) : 0;
    const deltaPp = afterPercent - beforePercent;
    rows.push({
      taxonomyKey,
      skillLabel: skillLabel(taxonomyKey),
      sessionCorrect,
      sessionTotal,
      beforePercent,
      afterPercent,
      deltaPp,
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
```

The `isCorrect` helper duplicates logic from `lib/question-utils.ts` — fine for now, can consolidate later if it drifts.

Handles a few edge cases:
- Source label not in `SKILL_MAP` → falls back to using the raw skill string as the taxonomy key so the row still renders (labeled with the raw string).
- All questions in a skill were skipped → `sessionTotal === 0`, row still shown but session accuracy displayed as "skipped".
- Student had no prior data on this skill → `beforeTested: false`, display shows "Starting fresh" instead of a delta.

### Results card UI extension

`PracticeResultsCard` gains a new optional prop:

```ts
masteryDeltas?: MasteryDeltaRow[];
```

Renders a new "Session performance" card between the hero summary and the existing per-question review. Layout:

- Card header: "Session performance"
- One row per `MasteryDeltaRow`, up to 5 rows visible, extras collapsed into "+N more skills" expandable
- Each row:
  - Left: clickable skill name (routes to `/skills/[course]/[taxonomyKey]` — `course` needs to be passed from the runner)
  - Middle: session accuracy display, e.g. `8/10` + small colored bar (width = accuracy percent)
  - Right: mastery line
    - If `beforeTested`: "74% now (+2pp from 72%)" with delta colored green for positive, red for negative, gray for zero
    - If not `beforeTested`: "Starting fresh — 62% after this session"
  - If `deltaPp >= 10`: small "↑ big jump" badge inline with the mastery line
- Rows sorted by session accuracy descending (strongest performance first)

If `masteryDeltas` is empty or undefined, the new card doesn't render — backward compatible with any caller that doesn't opt in.

**Layout sketch (vertical list of rows, one row per skill):**

```
┌──────────────────────────────────────────────────────────┐
│  SESSION PERFORMANCE                                     │
│  ─────────────────────────────────────────────────────── │
│  Linear Equations          8/10 [████████░░]             │
│                            Mastery now 74% (+2pp)        │
│  ─────────────────────────────────────────────────────── │
│  Quadratic Equations       2/3  [██████░░░░]             │
│                            Starting fresh — 67%          │
│  ─────────────────────────────────────────────────────── │
│  Probability               0/2  [░░░░░░░░░░]             │
│                            Mastery now 38% (-4pp)        │
└──────────────────────────────────────────────────────────┘
```

### Course prop on the runner

The results card needs `course` to build the skill detail URL when the student clicks a skill name in the breakdown. `PracticeRunner` already accepts `course` as a prop (from spec B). Pass it through to `PracticeResultsCard` as a new prop so the delta rows can be links.

### Refetch on exit — skill detail page

The skill detail page's `<SkillDetail>` component currently holds `profile` in state from an on-mount fetch. When the runner exits, the detail page returns to detail mode with stale profile data. Fix:

```ts
// in components/skills/skill-detail.tsx

const handleExit = () => {
  // Refetch the profile so the mastery circle + recent activity update
  if (uid) {
    getAdaptiveProfile(uid).then((p) => setProfile(p));
    // Also refetch recent answers for the trendline
    getRecentAnswersForTaxonomyKey(uid, taxonomyKey, 100).then(setRecentAnswers);
  }
  setSession(null);
};
```

Wire the handler into `<PracticeRunner onExit={handleExit} />`.

**Note:** `profile` is currently a prop passed down from the route wrapper (`skill-detail-page.tsx`). To enable refetch in place, we need to lift profile state into `SkillDetail` OR pass a refetch callback from the parent. Cleanest: add a `refetchProfile` callback prop on `SkillDetail` that the wrapper provides. The wrapper owns the profile state and provides the refetch handler.

Alternative: have `SkillDetail` hold its own local profile state initialized from the prop, and refetch independently. This duplicates state but avoids parent-child coupling. **Recommended** — simpler, no prop drilling.

### Refetch on exit — dashboard Practice tab

Same pattern. `StudentPractice` in `dashboard/page.tsx` holds `profile` as a prop from `StudentView`. On runner exit, it needs to refetch so the Skills tab preview and Overview recommendations update.

Since `StudentView` uses `useAdaptiveProfile` (which returns `{profile, refresh}`), the cleanest fix is to pass `refresh` down through `StudentPractice` as a callback and call it in `handleExit`:

```ts
// StudentView
const { profile, refresh: refetchProfile } = useAdaptiveProfile(uid);
// ...
<StudentPractice profile={profile} uid={uid} email={email} course={course} onRefetch={refetchProfile} />
```

```ts
// StudentPractice
const handleExit = () => {
  props.onRefetch?.();
  setSession(null);
};
```

This gives all sibling tabs (Overview, Skills, Past Tests) the new profile too, not just the Practice tab, since they all read from `useAdaptiveProfile`'s return value.

## File structure

| File | Status | Purpose |
|---|---|---|
| `lib/mastery-delta.ts` | create | `MasteryDeltaRow` type + `computeMasteryDeltas` helper |
| `components/practice/practice-runner.tsx` | modify | Add `beforeProfile` prop, post-session profile refetch, deltas computation |
| `components/practice/practice-results-card.tsx` | modify | New `masteryDeltas` + `course` props, render per-skill breakdown card |
| `components/skills/skill-detail.tsx` | modify | Pass `beforeProfile` to runner, refetch profile + recent answers on exit |
| `app/(authenticated)/dashboard/page.tsx` | modify | Pass `beforeProfile` to runner in `StudentPractice`, use `refresh` callback on exit |

Five edits. One new tiny lib file. No new routes, no new Firestore indexes, no schema changes.

## Error handling

- **`getAdaptiveProfile(uid)` fails after session completion.** The runner already has `saveError` state from spec B. On afterProfile fetch failure, set `masteryDeltas = []` and still render the results card. The per-skill breakdown card just doesn't render. Non-blocking.
- **`beforeProfile` is null (brand new student).** `computeMasteryDeltas` handles this — `getProfileSkillData(null, ...)` returns an empty aggregate, so `beforeTested: false` on every row. UI renders "Starting fresh" for each.
- **`afterProfile` lags behind actual writes.** `recomputeProfile` in the existing adaptive engine runs synchronously as part of `completeTestSession`. By the time `completeTestSession` resolves, the profile doc is updated. Fetching it right after is safe. If Firestore consistency causes a stale read, the UI shows slightly-lower deltas on first render but self-corrects on the next natural profile fetch.
- **Question has a skill not in `SKILL_MAP`.** Fallback to raw skill string as taxonomy key. The skill label will be less polished but the row still renders.

## Testing

No automated test framework (same as prior specs). Verification:

1. **Type check + build** after each task.
2. **Single-skill session test:** Practice a skill with prior data, confirm the results card shows one breakdown row with correct session accuracy, before/after percents, and delta color.
3. **Single-skill first-time test:** Practice a skill you've never touched. Confirm the row shows "Starting fresh" instead of a delta.
4. **Adaptive session test:** Launch adaptive practice from the dashboard. Answer 15 questions across multiple skills. Confirm the breakdown card shows up to 5 rows, sorted by session accuracy descending. Rows for skills with ≥ 10pp gain show the "big jump" badge.
5. **Clickable skill names test:** Click a skill name in a breakdown row. Confirm routing to `/skills/[course]/[taxonomyKey]`.
6. **Detail page refresh test:** Practice a skill from its detail page. Click Back from the results card. Confirm the mastery circle and recent activity squares show the post-practice data immediately (no manual refresh).
7. **Dashboard Practice tab refresh test:** Practice from the dashboard. Exit. Confirm the Skills tab preview and Overview recommendations reflect the new mastery on next click.

## Rollout

Single branch, six tasks:

1. Create `lib/mastery-delta.ts` with `MasteryDeltaRow` + `computeMasteryDeltas`
2. Extend `PracticeRunner` with `beforeProfile` prop, post-session profile refetch, delta computation. Pass `masteryDeltas` + `course` to `PracticeResultsCard`.
3. Extend `PracticeResultsCard` with the new breakdown card UI
4. Wire skill detail page: pass profile, refetch on exit
5. Wire dashboard Practice tab: pass profile, use `refresh` callback on exit
6. Manual verification, merge, push, deploy

## Open questions

None outstanding. Assumptions made:

- "Big jump" threshold is 10pp. No slider or configuration.
- Top 5 rows visible by default; extras collapse. Student can expand.
- Sort is session accuracy descending (student sees wins first).
- Refetch-on-exit in the dashboard uses the existing `useAdaptiveProfile`'s `refresh` function rather than a direct `getAdaptiveProfile` call, so all sibling dashboard tabs benefit.
- The skill detail page owns its own profile state (duplicate from the wrapper) to enable refetch without parent-child coupling.
