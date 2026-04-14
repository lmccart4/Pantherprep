# PantherPrep — Practice Runner (Spec B)

**Date:** 2026-04-14
**Owner:** Luke (Lachlan drafting)
**Status:** Design — awaiting approval
**Parent initiative:** Skill-based practice (decomposed into specs A, B, C, D, E)
**This spec:** B — reusable practice runner component

## Context

Spec D seeded `questionPool` with 588 categorized questions. Spec A (skill catalog UI) and Spec E (per-skill mastery feedback) need a way to actually *play* questions for students — pull N questions for a given skill, play them one at a time with immediate feedback, persist the results through the existing adaptive pipeline. That's what spec B delivers.

The existing `DiagnosticTest` (~800 lines, timed, module-based, full-length) and `PracticeTest` (~840 lines, two-section full-length mock test) components are the wrong shape for skill practice — they're built for test simulation, not for short learning sessions on a single skill. Skill practice is structurally different:

- Short (10 questions, not 44+)
- Untimed
- Single skill focus (or a weighted adaptive mix across multiple recommended skills)
- Immediate feedback after each question, not at the end
- No modules, no reading passages queue, no reference sheet timer, no results-screen reflections

The adaptive engine already has everything needed on the write side: `completeTestSession` in `lib/test-persistence.ts` unifies the write path through `performanceLog` → `adaptiveProfile` → `sessions`. Spec B reuses that entry point verbatim.

## Goals

1. Ship a focused `PracticeRunner` React component that plays a pre-sourced array of `Question` objects, tracks local state, auto-saves progress for resume, and calls `completeTestSession` at the end.
2. Provide two caller-facing helpers for sourcing questions: `getQuestionsBySkill(course, skill, count)` for single-skill practice, and `getAdaptivePracticeSet(uid, course, count)` as a thin wrapper around the existing `generatePracticeSet` for recommendation-weighted practice.
3. Wire the currently-non-functional "Launch Adaptive Practice" button in the Adaptive Dashboard's Practice tab so it actually runs a session.
4. Add the composite Firestore index that spec D deferred to this spec, enabling `questionPool` queries by `course + skill + difficulty`.
5. Handle thin skills gracefully via domain fallback: if a skill doesn't have enough questions, pad from other skills in the same domain so sessions are always ~10 questions long.

## Non-goals

- Skill catalog UI, routing, skill detail pages — spec A.
- Concept explanations, worked examples, scaffolding hints — spec A + spec C.
- Per-skill mastery delta display ("your mastery went from 42% to 56%") — spec E.
- Parker content authoring pipeline — spec C.
- Retry-wrong-only mode. "Practice again" fetches a fresh batch, not a re-run of missed questions.
- Spaced-repetition queue surfacing ("skills due for review today"). The adaptive engine tracks `nextReview` per skill but we're not surfacing it yet.
- Timed mode / test simulation. Use `DiagnosticTest` or `PracticeTest` for that.
- Modifying `DiagnosticTest` or `PracticeTest`. They stay as-is.

## Architecture

### Component

Create `components/practice/practice-runner.tsx`. Target ~300-400 lines. Single-purpose: play a pre-sourced array of questions.

**Props:**

```ts
interface PracticeRunnerProps {
  uid: string;
  email: string;
  course: string;              // e.g. "sat-math"
  skill?: string;              // taxonomy key when the session is single-skill
                               // ("linear_equations"); omitted for adaptive mode
  skillLabel?: string;         // human-readable — "Linear Equations" — shown in the landing card
  testType: string;            // "sat-math-skill-practice" | "sat-math-adaptive-practice"
  questions: Question[];       // pre-sourced by the caller
  fallbackNotes?: string[];    // e.g. ["Some questions were pulled from adjacent skills"]
  onComplete?: (result: CompleteTestResult) => void;
  onExit: () => void;          // required — runner cannot navigate itself
  onPracticeAgain?: () => void; // caller handles refetch + re-mount
}
```

The runner is dumb about routing and data sourcing. It renders, plays, persists, and then hands control back to the caller via `onExit` / `onPracticeAgain`. This keeps it reusable from any context — a dedicated `/practice` route, an inline dashboard panel, a modal, whatever the caller needs.

### Local state

```ts
type Screen = "landing" | "playing" | "results";

// inside PracticeRunner
const [screen, setScreen] = useState<Screen>("landing");
const [currentQ, setCurrentQ] = useState(0);
const [answers, setAnswers] = useState<Record<number, string>>({});
const [submitted, setSubmitted] = useState<Record<number, boolean>>({});  // "answer locked, explanation visible"
const [flagged, setFlagged] = useState<Set<number>>(new Set());
const [saveError, setSaveError] = useState(false);
const [finalResult, setFinalResult] = useState<CompleteTestResult | null>(null);
const startTimeRef = useRef<number>(0);
```

The `submitted[currentQ]` flag controls whether the `QuestionCard` shows the locked / explanation state. In skill practice mode, answering a question locks it — the student can review the explanation, then click "Next" to advance. No going back to change an answer after submission.

### Data flow

```
Caller fetches Question[] via a source helper
  ↓
<PracticeRunner questions={...} onExit={...} />
  ↓
Landing card ("Practice Linear Equations — 10 questions — Start")
  ↓ (Start click)
Playing screen → QuestionCard → student picks answer → clicks Check
  ↓
submitted[currentQ] = true → QuestionCard shows correct/incorrect + explanation
  ↓
Student clicks Next → currentQ++ → saveProgress({uid, key, state})
  ↓
(repeat for all questions)
  ↓
On final question Next → runSubmitFlow()
  ↓
runSubmitFlow():
  1. Compute timeSpent from startTimeRef
  2. Call completeTestSession({uid, email, testType, mode:"practice", course, questions, answers, timeSpent})
  3. Clear the saveProgress doc (or mark it completed)
  4. setFinalResult(result); setScreen("results")
  ↓
Results screen renders PracticeResultsCard
  ↓
Practice again → onPracticeAgain?.()
Back → onExit()
```

### Persistence and resume

Use the existing `saveProgress()` / `loadProgress()` utilities in `lib/firestore.ts` — same pattern `DiagnosticTest` uses. Key format:

```
${uid}_practice_${course}_${skill ?? "adaptive"}
```

Saved state shape:

```ts
interface PracticeProgress {
  questions: Question[];        // snapshot of the selected batch
  answers: Record<number, string>;
  submitted: Record<number, boolean>;
  flagged: number[];
  currentQ: number;
  startedAt: number;            // ms since epoch
  completedAt?: number;         // set by runSubmitFlow
}
```

On mount:

1. If `props.questions` were passed, take a snapshot.
2. Attempt `loadProgress(uid, key)`.
3. If a saved doc exists with `completedAt == null`: show a "Resume or restart?" prompt on the landing card. Resume picks up from `currentQ`. Restart deletes the doc and uses the fresh `props.questions`.
4. If a saved doc exists with `completedAt != null`: stale. Delete it and treat as fresh.
5. If no saved doc: fresh session. Write the first auto-save when the student clicks Start.

**Auto-save cadence:** on every `setAnswers`, `setSubmitted`, `setFlagged`, and `setCurrentQ` change. Debounced 500ms to avoid write thrash when students navigate rapidly.

**Resume caveat:** the `questions` array is snapshotted in the saved doc, so resume always replays the exact same questions a student started with — no shuffle drift mid-session.

### Completion write path

On the final Next click:

```ts
const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
const result = await completeTestSession({
  uid: props.uid,
  email: props.email,
  testType: props.testType,           // "sat-math-skill-practice" | "sat-math-adaptive-practice"
  mode: "practice",
  course: props.course,
  questions: props.questions,
  answers,
  timeSpent,
});
// clear or archive the progress doc
await saveProgress(uid, key, { ...currentState, completedAt: Date.now() });
setFinalResult(result);
setScreen("results");
props.onComplete?.(result);
```

Note that `completeTestSession` already calls `recomputeProfile` internally, so the student's adaptive profile updates automatically. Spec E will later read the before/after profile to show a mastery delta on the results screen, but spec B does not do that.

The `testType` string matters for Past Tests filtering:
- `"sat-math-skill-practice"` — single-skill session
- `"sat-math-adaptive-practice"` — recommendation-weighted session (dashboard Practice tab)
- Past Tests view groups on this, so students can see "SAT Math Skill Practice (45/50)" vs "SAT Math Adaptive Practice (38/50)" vs their diagnostics.

### Results card

`components/practice/practice-results-card.tsx` — split from the runner for clarity. Target ~150 lines.

Shows:

- Big score: `N/10 • 70%`
- Time spent (`4m 32s`)
- The three action buttons: "Practice again" (calls `onPracticeAgain`, returns to landing with a fresh batch), "Try harder" (calls `onPracticeAgain` with a `preferredDifficulty: "C"` hint — runner passes this back to caller via callback arg), "Back to skill" (calls `onExit`)
- Per-question review: scrollable list of each question rendered via `QuestionCard` in `locked` state showing the student's answer + correct answer + explanation. No editing.
- A domain/skill breakdown for the answered questions: "Algebra: 7/8 • Geometry: 2/2" — small text, grouped inline. Only shows if questions span more than one skill (adaptive mode); hidden for single-skill mode.
- `fallbackNotes` rendered at the bottom of the results card if the caller passed any — e.g. "Note: 3 questions were pulled from adjacent skills because [skill] doesn't have enough content yet."

### Question source helpers

Create `lib/practice-question-source.ts`:

```ts
import {
  getQuestions,
  type PoolQuestion,
} from "@/lib/adaptive/performance-service";
import { generatePracticeSet } from "@/lib/adaptive/adaptive-engine";
import { MATH_SKILLS, RW_SKILLS } from "@/lib/adaptive/adaptive-engine";
import type { Question } from "@/types/question";

export interface PracticeBatch {
  questions: Question[];
  fallbackNotes: string[];
}

/**
 * Get questions for a single skill. Falls back to sibling skills in the same
 * domain if the primary skill has fewer than `count` questions, so thin-skill
 * sessions still feel complete. Returns fresh Question[] + human-readable
 * notes about any fallbacks used.
 */
export async function getQuestionsBySkill(
  course: string,
  skill: string,
  count = 10,
  opts: {
    excludeIds?: string[];
    preferredDifficulty?: "F" | "M" | "C";
    fallbackToDomain?: boolean;  // default true
  } = {}
): Promise<PracticeBatch> {
  const notes: string[] = [];
  const excludeIds = new Set(opts.excludeIds ?? []);

  // Primary: the requested skill
  const primary = await getQuestions({
    course,
    skill,
    difficulty: opts.preferredDifficulty,
    limit: count * 3,
  });
  const primaryFiltered = primary.filter((q) => !excludeIds.has(q.sourceId));

  let pool: PoolQuestion[] = shuffle(primaryFiltered).slice(0, count);

  if (pool.length < count && opts.fallbackToDomain !== false) {
    // Look up the domain this skill belongs to, then pull from sibling skills
    const domain = findDomainForSkill(skill, course);
    if (domain) {
      const siblings = getSkillsInDomain(domain, course).filter((s) => s !== skill);
      for (const siblingSkill of siblings) {
        if (pool.length >= count) break;
        const moreQs = await getQuestions({
          course,
          skill: siblingSkill,
          limit: (count - pool.length) * 2,
        });
        const moreFiltered = moreQs.filter(
          (q) => !excludeIds.has(q.sourceId) && !pool.find((p) => p.sourceId === q.sourceId)
        );
        pool.push(...shuffle(moreFiltered).slice(0, count - pool.length));
      }
      if (pool.length > primaryFiltered.length) {
        const padCount = pool.length - primaryFiltered.length;
        notes.push(
          `${padCount} question${padCount === 1 ? "" : "s"} pulled from adjacent skills in ${domain} because this skill doesn't have enough content yet.`
        );
      }
    }
  }

  return {
    questions: pool.map(toQuestion),
    fallbackNotes: notes,
  };
}

/**
 * Recommendation-weighted practice set. Thin wrapper over the existing
 * generatePracticeSet so callers have a single import path for both modes.
 */
export async function getAdaptivePracticeSet(
  uid: string,
  course: string,
  count = 15
): Promise<PracticeBatch> {
  const set = await generatePracticeSet(uid, course, count);
  return {
    questions: set.questions.map(toQuestion),
    fallbackNotes: [],
  };
}

// --- internals ---

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function findDomainForSkill(skillKey: string, course: string): string | null {
  const taxonomy = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  for (const [domain, skills] of Object.entries(taxonomy)) {
    if (skills.includes(skillKey)) return domain;
  }
  return null;
}

function getSkillsInDomain(domain: string, course: string): string[] {
  const taxonomy = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  return taxonomy[domain] ?? [];
}

/**
 * Map a PoolQuestion (Firestore shape) back to Question (UI shape) so
 * QuestionCard can render it without any changes. The sourceSkill field
 * is used as the display label because it's more specific than the
 * taxonomy key.
 */
function toQuestion(pq: PoolQuestion): Question {
  return {
    id: pq.sourceId,
    testType: pq.testType,
    section: pq.section,
    module: pq.module,
    domain: pq.domain,
    skill: pq.sourceSkill,
    difficulty:
      pq.difficulty === "F" ? "easy" :
      pq.difficulty === "C" ? "hard" : "medium",
    type: pq.type,
    passage: pq.passage,
    stem: pq.stem,
    options: pq.choices.map((c) => c.text),
    correctAnswer: pq.correctAnswer,
    explanation: pq.explanation,
    explanations: pq.explanations,
    tags: pq.tags,
  };
}
```

The `toQuestion` adapter is the only place `PoolQuestion` → `Question` translation lives. If the two shapes diverge further in the future, this is the one file to update.

### Integration with the Adaptive Dashboard Practice tab

Modify `StudentPractice` in [app/(authenticated)/dashboard/page.tsx:424](../../../app/(authenticated)/dashboard/page.tsx#L424):

- Add local state for a "launched session": `const [session, setSession] = useState<PracticeBatch | null>(null);`
- Click "Launch Adaptive Practice" → await `getAdaptivePracticeSet(uid, course, 15)` → `setSession(batch)`.
- When `session != null`, render `<PracticeRunner questions={session.questions} ... onExit={() => setSession(null)} />` instead of the plan/recommendations display.
- `onPracticeAgain` re-calls `getAdaptivePracticeSet` with a fresh excludeIds list to avoid repeat questions.

No new routes. The tab flips between the recommendation plan and the runner inline.

### Firestore index

Add to `firestore.indexes.json`:

```json
{
  "collectionGroup": "questionPool",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "course", "order": "ASCENDING" },
    { "fieldPath": "skill", "order": "ASCENDING" },
    { "fieldPath": "difficulty", "order": "ASCENDING" }
  ]
}
```

Deploy via `firebase deploy --only firestore:indexes` as Task 1 of the plan. Index builds in the background — by the time the component code lands, the index is ready.

### `getQuestions` extension

Add an optional `excludeIds` parameter to `getQuestions()` in [lib/adaptive/performance-service.ts:282](../../../lib/adaptive/performance-service.ts#L282):

```ts
export async function getQuestions(criteria: {
  course: string;
  domain?: string;
  skill?: string;
  difficulty?: string;
  limit?: number;
  excludeIds?: string[];  // NEW — filters applied client-side after fetch
}): Promise<PoolQuestion[]> {
```

Client-side filtering is fine because question counts per skill are small (< 50 typically).

## Files

| File | Status | Purpose |
|---|---|---|
| `firestore.indexes.json` | modify | Add questionPool(course, skill, difficulty) composite index |
| `lib/adaptive/performance-service.ts` | modify | Add optional `excludeIds` parameter to `getQuestions` |
| `lib/practice-question-source.ts` | create | `getQuestionsBySkill` + `getAdaptivePracticeSet` helpers + `toQuestion` adapter |
| `components/practice/practice-runner.tsx` | create | Main component — ~300-400 lines |
| `components/practice/practice-results-card.tsx` | create | Results screen — ~150 lines |
| `app/(authenticated)/dashboard/page.tsx` | modify | Wire up the Practice tab's `StudentPractice` to launch the runner inline |

## Error handling

- **No questions available for skill.** `getQuestionsBySkill` returns `{questions: [], fallbackNotes: [...]}`. The caller shows a "no content yet" empty state, not the runner.
- **Fetch fails (Firestore error).** `getQuestionsBySkill` throws; the caller catches, shows a retry button. The runner itself never runs without an array of questions.
- **`completeTestSession` fails mid-submit.** Follow the existing `DiagnosticTest` pattern: catch the error, `setSaveError(true)`, render a banner in the results screen ("Your score couldn't be saved — please retry"). The student's local state still shows their answers; they lose the cloud persistence until the retry succeeds.
- **Resume with a mismatched `props.questions`.** If saved progress exists but the caller passes a different array of questions on mount, the saved state still wins — we resume the exact session the student started. The new `props.questions` are ignored until the student explicitly restarts.
- **Firestore index not yet built.** The first query to `questionPool` by skill fails with "failed precondition" until the composite index finishes building. Plan deploys the index as Task 1 so this never happens in practice; plan Task 7 (manual verification) is explicitly gated on the index being ready.

## Testing

Same manual-verification-only approach as spec D (no automated test framework). Verification plan:

1. **Type check passes** after each code task.
2. **Build passes** after the component is wired into the dashboard.
3. **Dry test** (single-skill mode): open the Adaptive Dashboard's Practice tab, launch Adaptive Practice, complete 5 questions, verify the session writes to `sessions` collection with `mode: "practice"`, verify 5 new docs in `performanceLog/{uid}/answers`, verify `adaptiveProfile/{uid}` shows a recomputed `lastUpdated`.
4. **Resume test**: start a session, answer 3 questions, close the tab, reopen the tab, confirm the "Resume" prompt appears and picks up at question 4.
5. **Restart test**: from the resume prompt, click Restart — confirm the progress doc is cleared and a fresh session begins.
6. **Domain fallback test**: deliberately launch a session for `sat-math / quadratic_formula` (only 1 question in pool per spec D inventory), confirm the session has ~10 questions padded from adjacent Advanced Math skills, confirm the results card shows the fallback note.
7. **Idempotency / replay test**: run "Practice again" from the results screen, confirm a new batch is fetched (different questionIds), confirm the completed session doc is separate from the new one.
8. **Past Tests integration**: navigate to the Past Tests tab (built in spec D-adaptive-wiring), confirm the practice sessions appear with the correct `testType` labels.

## Rollout

Single branch, single merge. Task order:

1. Deploy the composite index first (pure Firestore change, no code).
2. Extend `getQuestions` with `excludeIds`.
3. Write `lib/practice-question-source.ts`.
4. Write `components/practice/practice-runner.tsx` — landing + playing screen, no results screen yet.
5. Write `components/practice/practice-results-card.tsx`.
6. Wire runner into the dashboard Practice tab.
7. Manual verification: dry test (pass), resume test, restart test, domain fallback test, replay test, Past Tests integration.
8. Commit, merge, push, deploy to prod.

## Known limitations and handoffs

### For spec A (skill catalog UI)

Spec A will deep-link practice sessions from skill detail pages. It can either:
- Import `PracticeRunner` and render it inline on the skill page (simpler, scoped to one view).
- Create a new `/practice/[course]/[skill]` route that imports `PracticeRunner` (deep-linkable, bookmarkable).

Spec B takes no position on this — the runner is reusable from either. Spec A decides.

### For spec E (mastery feedback)

After `completeTestSession` runs in the runner, the `adaptiveProfile` is updated but the runner doesn't know the delta. Spec E will extend the runner's completion flow to:

- Fetch the profile *before* the session starts (store in a ref).
- Fetch the profile *after* `completeTestSession` returns.
- Compute the mastery delta for the relevant skill(s) and pass it to `PracticeResultsCard` for display.

This requires no changes to spec B's data flow — just an added prop on the results card (`masteryDelta?: {skill, before, after}[]`). Spec E implements this.

### For spec C (Parker authoring pipeline)

Spec B's domain fallback is a workaround for thin skills. When spec C ramps up and fills out the question pool, the fallback triggers less often. Eventually, the fallback should become dead code — or be preserved as a safety net.

The inventory at [docs/superpowers/specs/2026-04-14-question-pool-seed-inventory.md](../../specs/2026-04-14-question-pool-seed-inventory.md) is spec C's to-do list. Skills flagged with ⚠ (< 3 questions) are first targets.

### Not addressed here

- **Student-side rate limiting or XP rewards.** Sessions don't currently grant XP. The `profile.xp` field on `StudentProfile` is populated by an older flow (the home page gamification bar). Integrating practice sessions with XP rewards is out of scope — XP is cosmetic on the current pages.
- **Mobile-specific practice UX.** The runner should work on mobile via the standard responsive tailwind. No mobile-specific gesture work (swipe-to-advance, etc.).
- **Accessibility pass.** Keyboard navigation, screen-reader semantics, focus management — existing `QuestionCard` already has some of this; the runner should not regress. Not an explicit audit item.

## Open questions

None outstanding. Assumptions made:
- Fixed session length at 10 questions for single-skill mode, 15 for adaptive mode. No configurability in this spec.
- Single "Practice again" flow refetches a fresh batch via the caller. No "review wrong answers only" mode.
- Resume prompt uses a simple two-button UI ("Resume | Restart") — no diff of saved state vs fresh state.
- Domain fallback is enabled by default and cannot be disabled by students — it's purely a content-availability mitigation, not a student-facing option.
