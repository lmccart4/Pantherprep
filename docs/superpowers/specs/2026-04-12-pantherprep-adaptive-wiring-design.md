# PantherPrep — Adaptive Wiring + Test History

**Date:** 2026-04-12
**Owner:** Luke (Lachlan drafting)
**Status:** Design — awaiting approval

## Background

A coworker created an account, took a diagnostic test, and saw nothing on the adaptive dashboard. Investigation revealed the adaptive pipeline was built but never connected to any test surface:

- `diagnostic-test.tsx` and `practice-test.tsx` call `saveSession()` → `sessions` collection.
- The adaptive dashboard reads `adaptiveProfile/{uid}` and `performanceLog/{uid}/answers`.
- **No page, component, or script calls `logAnswer` / `logAnswerBatch` / `recomputeProfile`.** Grep confirms zero call sites outside the library itself.
- Consequence: `adaptiveProfile` and `performanceLog` are effectively empty for every user. The "History" tab on the dashboard reads from `performanceLog` and shows nothing for the same reason.

The existing `sessions` docs contain only `{questionId, correct, userAnswer, timeSpent}` per answer — no question stem, choices, or explanation — so they are not sufficient to power a per-question review UI.

## Goals

1. Wire every scored test surface (diagnostic + practice-test) through the adaptive pipeline so `adaptiveProfile` populates on test completion.
2. Build a "Past Tests" view for students and teachers that lists every test ever taken and lets them review each question, the student's answer, the correct answer, and the explanation.
3. Backfill existing `sessions` data so users who tested before the fix (including the coworker who triggered this work) see retroactive results.

## Non-goals

- Migrating hardcoded question arrays into Firestore `questionPool` (B from the brainstorm — deferred).
- Changing lesson-module activities in `courses/*` — those are not scored tests and stay as-is.
- Reworking the existing `sessions` collection's other consumers (there are none besides result-screen display).
- Wiring *every* answer surface on day one — only the two `components/test/*.tsx` harnesses and the backfill script.

## Architecture

### Data model

Extend `AnswerData` / `StoredAnswer` in [lib/adaptive/performance-service.ts](../../../lib/adaptive/performance-service.ts):

```ts
interface AnswerData {
  // existing
  questionId: string;
  moduleId: string;
  course: string;
  domain: string;
  skill: string;
  difficulty?: "F" | "M" | "C";
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  errorCode?: string | null;
  errorCategory?: string | null;
  timeSpent?: number;
  sessionId?: string;

  // NEW — snapshot fields to make answers reviewable
  stem: string;
  choices: { key: string; text: string }[];
  explanation: string;
  testSessionId: string;  // groups all answers from a single test run
}
```

`sessions` stays, shrinks to a lightweight summary used by the Past-Tests list view:

```ts
interface Session {
  uid: string;
  email: string;
  testType: string;       // "sat-math-diagnostic" etc.
  mode: string;           // "diagnostic" | "practice"
  score: number;
  total: number;
  percentage: number;
  scaledScore?: number;
  timeSpent: number;
  testSessionId: string;  // NEW — matches the id stamped on performanceLog answers
  createdAt: Timestamp;
  // answers: SessionAnswer[]  <-- REMOVED; lives in performanceLog
}
```

The `answers` field on the existing `Session` type is removed. Backfill reads it one last time to populate performanceLog, then future writes skip it.

### New library: `lib/test-persistence.ts`

Single entry point both React components (and the backfill script) call:

```ts
interface CompleteTestArgs {
  uid: string;
  email: string;
  testType: string;          // e.g. "sat-math-diagnostic"
  mode: "diagnostic" | "practice";
  course: string;            // e.g. "sat-math"
  questions: RawQuestion[];  // full question objects from the page-level arrays
  answers: Record<number, string>;  // index → user's selected answer
  timeSpent: number;
  scaledScore?: number;
  existingSessionId?: string;   // backfill path sets this to preserve doc id
  existingTimestamp?: Timestamp; // backfill path sets this
}

async function completeTestSession(args: CompleteTestArgs): Promise<{
  testSessionId: string;
  score: number;
  total: number;
}>
```

Responsibilities:
1. Generate `testSessionId` (uuid v4) or reuse `existingSessionId` for backfill.
2. For each question, build an `AnswerData` row with stem/choices/correct/explanation/skill/domain snapshotted from the question object and `selectedAnswer` from `answers[i]`. Questions the user skipped still get rows (`correct: false`, `selectedAnswer: ""`) so recency counts stay accurate. The hardcoded question arrays use `options: string[]` for choices — the enrichment layer normalizes these to `{key, text}[]` using letter keys A/B/C/D so the stored shape matches the existing `questionPool` type.
3. Call `logAnswerBatch(uid, answerRows)`. When `existingTimestamp` is set (backfill path), the batch write uses that timestamp instead of `Timestamp.now()` so historical order is preserved. `logAnswerBatch` gains an optional second parameter `{overrideTimestamp?: Timestamp}` to support this — the live path never sets it.
4. Call `recomputeProfile(uid)`.
5. Call `saveSession(summary)` with the lightweight summary (no nested answers array). When `existingSessionId` is set, the write uses `setDoc` on that id instead of `addDoc`, so backfilled sessions overwrite their originals in place.
6. Return `{testSessionId, score, total}` for the caller's results screen.

All four operations execute sequentially. If step 3 throws, we do not call 4 or 5 — the caller catches and surfaces a "save error" banner (this pattern already exists in `diagnostic-test.tsx` via `setSaveError`).

### Component changes

`components/test/diagnostic-test.tsx` — replace the body of `handleFinish` (lines 228-257) with a call to `completeTestSession()` passing `questions`, `answers`, `timeSpent`, computed `scaledScore`. ~25 lines of enrichment/persistence code delete; ~8 lines of call-site code replace them.

`components/test/practice-test.tsx` — same surgery in its `handleFinish` (call site identified at line 249).

Neither component touches `performanceLog`, `recomputeProfile`, or the session summary schema directly. All four write paths flow through the library.

### New library: `lib/session-history.ts`

Two read functions backing the Past-Tests UI:

```ts
// List view — session summaries for the given student
async function getTestHistory(uid: string): Promise<Session[]>

// Detail view — reconstructs one test's questions + answers
async function getTestSessionDetail(
  uid: string,
  testSessionId: string
): Promise<{
  session: Session;
  answers: StoredAnswer[];  // ordered by timestamp ascending
}>
```

`getTestHistory` is a thin wrapper over the existing `getSessions(uid)`. `getTestSessionDetail` does a single Firestore query on `performanceLog/{uid}/answers where testSessionId == x orderBy timestamp asc` plus a `getDoc` on the summary. Requires one composite index (`testSessionId` asc + `timestamp` asc) added to `firestore.indexes.json`.

### Past-Tests UI

New component `components/dashboard/past-tests-view.tsx`. Prop: `{uid: string}`. Used in two places — both consume it the same way (read-only review of whichever uid is passed in):

- **Student view:** new "Past Tests" tab in the student tab strip at [dashboard/page.tsx:150](../../../app/(authenticated)/dashboard/page.tsx#L150). Opens `<PastTestsView uid={user.uid} />`.
- **Teacher view:** new "Past Tests" sub-tab inside `TeacherStudentDrillDown`. Opens `<PastTestsView uid={selectedStudent.uid} />`. Firestore rules gate whether the current user is allowed to read that uid's data, so there is no UI-level role check.

Two internal modes:

1. **List mode (default).** Fetches `getTestHistory(uid)`. Renders a table: date, test name, course tag, score (27/44), percentage, scaled score (if present), "Review →" button. Sorted newest first. Empty state: "No tests taken yet."

2. **Detail mode.** Fetches `getTestSessionDetail(uid, testSessionId)`. Top: summary card (test name, date, score, time spent, scaled score). Below: one card per question, in order. Each card shows:
   - Question number (1/44, 2/44 …)
   - Stem (KaTeX-rendered via existing `katex-render.tsx`)
   - All choices, with the student's choice ringed and the correct choice check-marked
   - "Your answer: X" / "Correct answer: Y" row
   - Explanation (auto-expanded when wrong, collapsed when right)
   - Domain + skill tags at the bottom
   - Filter toggle at top of list: all / wrong only / skipped only

Same visual language as the existing dashboard glass cards — no new design system work.

### Backfill script: `scripts/backfill-performance-log.mjs`

Runs once after deploy. Steps:

1. Load every doc from `sessions`.
2. For each session, derive the originating question set by `testType`:
   - `sat-math-diagnostic` → import from `app/(authenticated)/diagnostics/sat-math/page.tsx`
   - ditto for the other 5 diagnostics
   - `sat-practice`, `nmsqt-practice`, `psat89-practice` → import from their respective question files under practice-test
3. Build an `answers` record by matching `session.answers[].questionId` → question index.
4. Call `completeTestSession({...args, existingSessionId: session.id, existingTimestamp: session.createdAt})` with the reconstructed inputs.
5. On success: log `ok uid=... testType=... score=.../...`.
6. On unresolved questionIds: log `skip uid=... reason=missing-questions count=N` and continue.
7. At the end: summary totals — processed, skipped, adaptiveProfiles recomputed.

Flags: `--dry-run` (log only, no writes), `--uid=...` (single user, for testing with the coworker's account first).

The script reuses `completeTestSession` so there is exactly one write path — any bug gets fixed once.

### Firestore rules

`firestore.rules` needs two additions:

1. `performanceLog/{uid}/answers/{id}` — already permits owner read/write. Add: teachers can read if `{uid}` is in any of the teacher's classes. Copy the existing teacher-read rule pattern from `adaptiveProfile/{uid}`.
2. `sessions/{id}` — same teacher-read expansion so the list view works on the teacher side.

### Firestore indexes

Add to `firestore.indexes.json`:

```json
{
  "collectionGroup": "answers",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "testSessionId", "order": "ASCENDING" },
    { "fieldPath": "timestamp", "order": "ASCENDING" }
  ]
}
```

## Data flow

```
Student finishes test
  ↓
diagnostic-test.tsx / practice-test.tsx handleFinish()
  ↓
completeTestSession({uid, questions, answers, ...})
  ↓
  ├─→ logAnswerBatch(uid, answerRows[])       → performanceLog/{uid}/answers/*
  ├─→ recomputeProfile(uid)                    → adaptiveProfile/{uid}
  └─→ saveSession(summary)                     → sessions/{id}
  ↓
Results screen shows score; dashboard auto-populates on next visit.

Past Tests list:   getTestHistory(uid)           → sessions where uid==x
Past Tests detail: getTestSessionDetail(uid, id) → performanceLog/{uid}/answers where testSessionId==id
```

## Error handling

- Persistence errors during `completeTestSession` — the React caller catches and sets a visible save-error banner; the student can retry via a button that re-runs the call. This matches the existing `setSaveError` UX in `diagnostic-test.tsx`.
- Backfill script errors — logged per session; script continues. A final summary flags any users whose adaptiveProfile recompute failed so they can be re-run manually.
- Firestore rule denials on the history read path — rendered as "You don't have access to this student's history" rather than a blank page.

## Testing

Unit:
- `completeTestSession` — a test that builds a fake question set + fake answers, stubs the Firestore writers, asserts the exact shape written to each of the three destinations.
- `getTestSessionDetail` — stubs performanceLog + session reads, asserts ordering and shape.

Integration:
- Run one end-to-end diagnostic on a test account, verify:
  - `performanceLog/{uid}/answers/*` has 44 rows with stem/choices/explanation
  - `adaptiveProfile/{uid}` exists and has domain mastery numbers
  - `sessions/{id}` has the summary without a nested answers array
  - The Past-Tests list and detail views render correctly on both student and teacher sides

Backfill:
- Run `--dry-run --uid=<coworker>` first.
- Verify the dry-run report shows expected row counts.
- Run without `--dry-run` on the one account.
- Log into the app as the coworker, confirm adaptive dashboard now has data and Past-Tests shows her diagnostic.
- Then run full backfill.

## Rollout

1. Land the library + component wiring + tests + rules/indexes in one PR. Deploy.
2. Verify a fresh diagnostic on a test account writes all three destinations.
3. Run backfill dry-run against the coworker's uid.
4. Run backfill live against the coworker's uid only.
5. Show the coworker her dashboard and Past-Tests view; confirm it works.
6. Run full backfill.
7. Announce availability.

## Open questions

None outstanding. Assumptions made:
- Questions the user skipped are persisted as `correct:false, selectedAnswer:""` (preserves activity-count accuracy).
- The Past-Tests tab on the student side replaces the current "History" tab (which shows granular answers but no test grouping — now strictly worse than Past Tests). "History" tab is removed.
- Teacher read access to `sessions` and `performanceLog` uses the same class-roster pattern the existing `adaptiveProfile` rule uses.
