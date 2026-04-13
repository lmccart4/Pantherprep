# PantherPrep Adaptive Wiring + Test History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire diagnostic + practice tests through the adaptive engine, build a student/teacher Past-Tests review view, and backfill existing session data so historical tests become visible.

**Architecture:** Introduce a shared `lib/test-persistence.ts` module with a single `completeTestSession()` entry point used by both React test components and the backfill script. All answer writes go through `performanceLog/{uid}/answers` with full question snapshots. Session summaries in `sessions` become lightweight. Past-Tests UI reads from `performanceLog` grouped by `testSessionId`.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.7, Firebase 10 (client SDK + admin SDK for backfill), Tailwind 4, KaTeX for math rendering.

**Spec:** [docs/superpowers/specs/2026-04-12-pantherprep-adaptive-wiring-design.md](../specs/2026-04-12-pantherprep-adaptive-wiring-design.md)

**Testing convention:** This repo has no automated test framework. Each task uses manual verification plus `npm run lint` and, where warranted, `npm run build`. Do NOT add a test framework as part of this work — it is a separate initiative.

---

## Task 1: Extend `AnswerData` + `logAnswerBatch` for snapshots and timestamp override

**Files:**
- Modify: `lib/adaptive/performance-service.ts`

- [ ] **Step 1: Extend the `AnswerData` interface**

Open `lib/adaptive/performance-service.ts`. Replace the `AnswerData` interface (currently at lines 25-39) with:

```ts
export interface AnswerData {
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

  // Snapshot fields — let us render this answer later without the original question registry
  stem: string;
  choices: { key: string; text: string }[];
  explanation: string;
  testSessionId: string;
}
```

- [ ] **Step 2: Extend `StoredAnswer`**

Replace the `StoredAnswer` interface (around line 106):

```ts
export interface StoredAnswer extends AnswerData {
  id: string;
  uid: string;
  timestamp: Timestamp;
}
```

(No structural change — it already extends `AnswerData`, so the new fields come along automatically. Leave the definition as-is but verify it reads this way.)

- [ ] **Step 3: Extend `logAnswerBatch` to accept a timestamp override**

Replace the existing `logAnswerBatch` function body (lines 69-104) with:

```ts
export async function logAnswerBatch(
  uid: string,
  answers: AnswerData[],
  opts: { overrideTimestamp?: Timestamp } = {}
): Promise<number> {
  if (!uid || !answers.length) return 0;
  try {
    const batch = writeBatch(db);
    const colRef = collection(db, "performanceLog", uid, "answers");
    const ts = opts.overrideTimestamp ?? Timestamp.now();
    let count = 0;

    for (const answer of answers) {
      const docRef = doc(colRef);
      batch.set(docRef, {
        uid,
        questionId: answer.questionId,
        moduleId: answer.moduleId,
        course: answer.course,
        domain: answer.domain,
        skill: answer.skill,
        difficulty: answer.difficulty || "M",
        correct: answer.correct,
        selectedAnswer: answer.selectedAnswer || "",
        correctAnswer: answer.correctAnswer || "",
        errorCode: answer.errorCode || null,
        errorCategory: answer.errorCategory || null,
        timeSpent: answer.timeSpent || 0,
        timestamp: ts,
        sessionId: answer.sessionId || "",
        stem: answer.stem || "",
        choices: answer.choices || [],
        explanation: answer.explanation || "",
        testSessionId: answer.testSessionId || "",
      });
      count++;
    }

    await batch.commit();
    return count;
  } catch (e) {
    console.warn("logAnswerBatch error:", e);
    return 0;
  }
}
```

- [ ] **Step 4: Update `logAnswer` (single-answer path) with the same new fields**

Replace lines 41-67 (the `logAnswer` function) with:

```ts
export async function logAnswer(uid: string, answer: AnswerData): Promise<string | null> {
  if (!uid) return null;
  try {
    const ref = collection(db, "performanceLog", uid, "answers");
    const docRef = await addDoc(ref, {
      uid,
      questionId: answer.questionId,
      moduleId: answer.moduleId,
      course: answer.course,
      domain: answer.domain,
      skill: answer.skill,
      difficulty: answer.difficulty || "M",
      correct: answer.correct,
      selectedAnswer: answer.selectedAnswer || "",
      correctAnswer: answer.correctAnswer || "",
      errorCode: answer.errorCode || null,
      errorCategory: answer.errorCategory || null,
      timeSpent: answer.timeSpent || 0,
      timestamp: serverTimestamp(),
      sessionId: answer.sessionId || "",
      stem: answer.stem || "",
      choices: answer.choices || [],
      explanation: answer.explanation || "",
      testSessionId: answer.testSessionId || "",
    });
    return docRef.id;
  } catch (e) {
    console.warn("logAnswer error:", e);
    return null;
  }
}
```

- [ ] **Step 5: Verify the file compiles**

Run: `cd ~/pantherprep && npx tsc --noEmit lib/adaptive/performance-service.ts 2>&1 | head -30`

Expected: no errors on this file. (Ignore errors from files it imports — those are unrelated.)

- [ ] **Step 6: Commit**

```bash
cd ~/pantherprep
git add lib/adaptive/performance-service.ts
git commit -m "Extend AnswerData with question snapshot + timestamp override for batch"
```

---

## Task 2: Extend `Session` type + `saveSession` to accept an existing id

**Files:**
- Modify: `types/firestore.ts:17-37`
- Modify: `lib/firestore.ts:42-46`

- [ ] **Step 1: Update the `Session` type**

Open `types/firestore.ts`. Replace the `Session` and `SessionAnswer` interfaces (lines 17-37) with:

```ts
export interface Session {
  uid: string;
  email: string;
  testType: string;
  domain?: string;
  mode: string;
  score: number;
  total: number;
  percentage: number;
  scaledScore?: number;
  timeSpent: number;
  testSessionId?: string; // NEW — joins to performanceLog answers
  createdAt: Timestamp;
  // Legacy: older session docs include `answers: SessionAnswer[]`.
  // New writes do not populate this field. Readers ignore it.
  answers?: SessionAnswer[];
}

export interface SessionAnswer {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  timeSpent?: number;
}
```

- [ ] **Step 2: Extend `saveSession` to accept an existing id for backfill**

Open `lib/firestore.ts`. Replace the `saveSession` function (lines 42-46) with:

```ts
export async function saveSession(
  data: Omit<Session, "createdAt">,
  opts: { existingSessionId?: string; existingCreatedAt?: import("firebase/firestore").Timestamp } = {}
): Promise<string> {
  if (opts.existingSessionId) {
    const ref = doc(db, "sessions", opts.existingSessionId);
    await setDoc(ref, {
      ...data,
      createdAt: opts.existingCreatedAt ?? serverTimestamp(),
    });
    return opts.existingSessionId;
  }
  const ref = doc(collection(db, "sessions"));
  await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}
```

- [ ] **Step 3: Lint check**

Run: `cd ~/pantherprep && npm run lint 2>&1 | tail -20`

Expected: no new errors in `types/firestore.ts` or `lib/firestore.ts`. Existing warnings elsewhere are fine.

- [ ] **Step 4: Commit**

```bash
cd ~/pantherprep
git add types/firestore.ts lib/firestore.ts
git commit -m "Session type: add testSessionId, mark answers legacy; saveSession accepts existing id"
```

---

## Task 3: Create `lib/question-utils.ts` with pure helpers

**Files:**
- Create: `lib/question-utils.ts`

This file contains pure, dependency-free helpers shared by `lib/test-persistence.ts` (client SDK path) AND the backfill script (admin SDK path). No Firebase imports — keeping it Firebase-free is what lets both call sites import it safely.

- [ ] **Step 1: Create the file**

Create `lib/question-utils.ts` with:

```ts
// Pure helpers for turning a Question + student answer into an AnswerData row.
// No Firebase imports — safe to consume from both client and admin contexts.

import type { Question } from "@/types/question";

/**
 * Map the page-level Question.difficulty ("easy"|"medium"|"hard")
 * to the adaptive engine difficulty code ("F"|"M"|"C").
 */
export function mapDifficulty(d: Question["difficulty"]): "F" | "M" | "C" {
  if (d === "easy") return "F";
  if (d === "hard") return "C";
  return "M";
}

/**
 * Convert options: string[] into the {key, text}[] shape the adaptive engine
 * stores. Uses letter keys A, B, C, D... For student-produced-response (SPR)
 * questions the options array is typically empty or ["","","",""] — we return
 * an empty array so the review UI knows it was a free-response.
 */
export function normalizeChoices(q: Question): { key: string; text: string }[] {
  if (q.type === "spr") return [];
  if (!q.options) return [];
  const keys = ["A", "B", "C", "D", "E", "F"];
  return q.options
    .map((text, i) => ({ key: keys[i] ?? String(i), text }))
    .filter((c) => c.text !== "");
}

/**
 * Check whether a given answer matches the correct answer for the question.
 * Kept in sync with isCorrect() in diagnostic-test.tsx so both paths agree.
 */
export function isCorrect(q: Question, answer: string | undefined): boolean {
  if (answer == null || answer === "") return false;
  const ca = q.correctAnswer.trim();
  const ua = answer.trim();
  if (q.type === "spr") {
    // Numeric-ish comparison for grid-in responses
    const an = parseFloat(ua);
    const cn = parseFloat(ca);
    if (!isNaN(an) && !isNaN(cn)) return Math.abs(an - cn) < 1e-9;
    return ua.toLowerCase() === ca.toLowerCase();
  }
  return ua.toUpperCase() === ca.toUpperCase();
}
```

- [ ] **Step 2: Type-check**

Run: `cd ~/pantherprep && npx tsc --noEmit 2>&1 | grep "question-utils" | head -10`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd ~/pantherprep
git add lib/question-utils.ts
git commit -m "Add lib/question-utils.ts: pure difficulty/choices/correctness helpers"
```

---

## Task 3b: Create `lib/test-persistence.ts` with `completeTestSession`

**Files:**
- Create: `lib/test-persistence.ts`

- [ ] **Step 1: Create the file**

Create `lib/test-persistence.ts` with this full content:

```ts
// Unified persistence for test completion. Called by diagnostic-test.tsx
// and practice-test.tsx. The backfill script (admin SDK) does not call this
// directly — it imports the same helpers from lib/question-utils.ts and runs
// its own admin-SDK write path.
//
// Writes:
//   performanceLog/{uid}/answers/*  — one doc per question, full snapshot
//   adaptiveProfile/{uid}           — recomputed from performanceLog
//   sessions/{id}                    — lightweight summary

import { Timestamp } from "firebase/firestore";
import type { Question } from "@/types/question";
import {
  logAnswerBatch,
  type AnswerData,
} from "@/lib/adaptive/performance-service";
import { recomputeProfile } from "@/lib/adaptive/adaptive-engine";
import { saveSession } from "@/lib/firestore";
import { mapDifficulty, normalizeChoices, isCorrect } from "@/lib/question-utils";

export interface CompleteTestArgs {
  uid: string;
  email: string;
  testType: string;  // e.g. "sat-math-diagnostic"
  mode: "diagnostic" | "practice";
  course: string;    // e.g. "sat-math"
  questions: Question[];
  answers: Record<number, string>;  // question index → user's selected answer
  timeSpent: number;
  scaledScore?: number;
  // Backfill path — when set, writes use these values for id and timestamp
  // instead of generating new ones.
  existingSessionId?: string;
  existingTimestamp?: Timestamp;
}

export interface CompleteTestResult {
  testSessionId: string;
  score: number;
  total: number;
}

export async function completeTestSession(
  args: CompleteTestArgs
): Promise<CompleteTestResult> {
  const {
    uid,
    email,
    testType,
    mode,
    course,
    questions,
    answers,
    timeSpent,
    scaledScore,
    existingSessionId,
    existingTimestamp,
  } = args;

  const testSessionId =
    existingSessionId ??
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `ts-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

  // Build one AnswerData row per question (including skipped ones).
  const answerRows: AnswerData[] = questions.map((q, i) => {
    const selected = answers[i] ?? "";
    return {
      questionId: q.id,
      moduleId: q.module != null ? String(q.module) : "",
      course,
      domain: q.domain,
      skill: q.skill,
      difficulty: mapDifficulty(q.difficulty),
      correct: isCorrect(q, selected),
      selectedAnswer: selected,
      correctAnswer: q.correctAnswer,
      errorCode: null,
      errorCategory: null,
      timeSpent: 0, // per-question time not tracked in current harness
      sessionId: testSessionId, // keep legacy field populated for the adaptive engine
      stem: q.stem,
      choices: normalizeChoices(q),
      explanation: q.explanation,
      testSessionId,
    };
  });

  const score = answerRows.filter((a) => a.correct).length;
  const total = questions.length;

  // 1. Write all answers to performanceLog
  await logAnswerBatch(uid, answerRows, {
    overrideTimestamp: existingTimestamp,
  });

  // 2. Recompute the adaptive profile so the dashboard reflects the new data
  await recomputeProfile(uid);

  // 3. Write the lightweight session summary
  await saveSession(
    {
      uid,
      email,
      testType,
      mode,
      score,
      total,
      percentage: total > 0 ? Math.round((score / total) * 100) : 0,
      scaledScore,
      timeSpent,
      testSessionId,
    },
    {
      existingSessionId,
      existingCreatedAt: existingTimestamp,
    }
  );

  return { testSessionId, score, total };
}
```

- [ ] **Step 2: Type-check the new file**

Run: `cd ~/pantherprep && npx tsc --noEmit 2>&1 | grep "test-persistence" | head -10`

Expected: no errors in `lib/test-persistence.ts`.

- [ ] **Step 3: Commit**

```bash
cd ~/pantherprep
git add lib/test-persistence.ts
git commit -m "Add lib/test-persistence.ts: unified completeTestSession entry point"
```

---

## Task 4: Wire `diagnostic-test.tsx` to `completeTestSession`

**Files:**
- Modify: `components/test/diagnostic-test.tsx:228-257`

- [ ] **Step 1: Replace the `handleFinish` body**

Open `components/test/diagnostic-test.tsx`. Replace the existing `handleFinish` callback (lines 228-257) with:

```ts
  // Finish test
  const handleFinish = useCallback(() => {
    setScreen("results");
    if (!user || questions.length === 0) return;

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const correct = questions.filter((q, i) => isCorrect(q, answers[i])).length;
    const scaled = computeScaledScore(testType, correct, questions.length);

    // Derive course id from testType + section (e.g. "sat" + "math" → "sat-math")
    const course = `${testType}-${section}`;

    completeTestSession({
      uid: user.uid,
      email: user.email ?? "",
      testType: `${testType}-${section}-diagnostic`,
      mode: "diagnostic",
      course,
      questions,
      answers,
      timeSpent,
      scaledScore: scaled,
    }).catch((err) => {
      console.error("completeTestSession failed:", err);
      setSaveError(true);
    });
  }, [user, questions, answers, testType, section]);
```

- [ ] **Step 2: Add the import**

Near the top of the file with the other imports, add:

```ts
import { completeTestSession } from "@/lib/test-persistence";
```

- [ ] **Step 3: Remove the now-unused `saveSession` import**

Search the file for `saveSession` — if the only remaining reference is the import line, remove it from the import. If it's used elsewhere (it shouldn't be), leave the import.

- [ ] **Step 4: Lint + build**

Run: `cd ~/pantherprep && npm run lint 2>&1 | tail -15`

Expected: no errors in `diagnostic-test.tsx`.

Then: `cd ~/pantherprep && npm run build 2>&1 | tail -30`

Expected: build succeeds. If TypeScript complains about an unused import, remove it. If it complains about a missing property, cross-check against Task 3 Step 1.

- [ ] **Step 5: Commit**

```bash
cd ~/pantherprep
git add components/test/diagnostic-test.tsx
git commit -m "Wire diagnostic-test handleFinish through completeTestSession"
```

---

## Task 5: Manual end-to-end verification — diagnostic write path

**Files:** none — verification only.

- [ ] **Step 1: Start the dev server**

```bash
cd ~/pantherprep && npm run dev
```

Leave running. Open `http://localhost:3000` in a browser.

- [ ] **Step 2: Take a short diagnostic as a test account**

Log in with a paps.net account that is not your coworker. Navigate to any of the diagnostic pages (e.g. `/diagnostics/sat-math`). Answer a handful of questions (5-10 is enough — you do not need to complete all 44). Click through to module 2 quickly and hit Finish when the results screen is reachable.

- [ ] **Step 3: Open the Firebase console and verify three writes**

Open `https://console.firebase.google.com/project/<your-project>/firestore/data`.

Verify:
1. `sessions/*` — a new doc for your uid with `testSessionId` set, `testType: "sat-math-diagnostic"`, no `answers` array.
2. `performanceLog/{uid}/answers` — several new docs, each with `stem`, `choices`, `explanation`, and the same `testSessionId` as the session.
3. `adaptiveProfile/{uid}` — doc exists (or was updated), has a `domains` map with real numbers.

- [ ] **Step 4: Load the adaptive dashboard**

In the browser, navigate to `/dashboard`. Select "SAT Math" as the course. Verify:
- The Overview tab shows domain mastery bars with real percentages (not zeros).
- The Skills tab has data.

- [ ] **Step 5: If anything is wrong, STOP and debug before proceeding**

Common failure modes:
- Build failed: fix types from Task 1-3.
- Session doc exists but performanceLog is empty: the `logAnswerBatch` call is silently failing — check browser console for the `logAnswerBatch error:` warning.
- performanceLog populated but adaptiveProfile empty: `recomputeProfile` is failing — check the browser console.

Do not mark this task complete until all three verifications in Step 3 pass.

---

## Task 6: Wire `practice-test.tsx` to `completeTestSession`

**Files:**
- Modify: `components/test/practice-test.tsx`

- [ ] **Step 1: Locate the finish handler**

Run: `grep -n "saveSession\|handleFinish\|completeTest" ~/pantherprep/components/test/practice-test.tsx | head -15`

Note the line range around the `saveSession` call (around line 249 based on earlier exploration). Read 30 lines around that point to understand what's being assembled.

- [ ] **Step 2: Replace the finish body**

Inside the finish handler, replace the `saveSession({...}).catch(...)` block with:

```ts
    const allQuestions = sections.flatMap((s: any) => s.questions ?? s);
    const answersByIndex: Record<number, string> = {};
    allQuestions.forEach((q: any, i: number) => {
      answersByIndex[i] = answers[qid(q)] ?? "";
    });
    const course = `${testType}-combined`;

    completeTestSession({
      uid: user.uid,
      email: user.email ?? "",
      testType: `${testType}-practice`,
      mode: "practice",
      course,
      questions: allQuestions,
      answers: answersByIndex,
      timeSpent,
      scaledScore: typeof scaled === "number" ? scaled : undefined,
    }).catch((err) => {
      console.error("completeTestSession failed:", err);
      setSaveError(true);
    });
```

NOTE: the exact variable names (`sections`, `scaled`, `timeSpent`) are taken from earlier lines in the same handler. If the local variables differ, adapt the call — the important contract is: pass the flat list of questions the student saw and a Record keyed by flat-index → selected answer string.

- [ ] **Step 3: Add the import**

```ts
import { completeTestSession } from "@/lib/test-persistence";
```

Remove `saveSession` from the import if no other usage remains.

- [ ] **Step 4: Lint + build**

Run: `cd ~/pantherprep && npm run lint 2>&1 | tail -15 && npm run build 2>&1 | tail -20`

Expected: success. Investigate any errors involving `practice-test.tsx`.

- [ ] **Step 5: Manual verification (short)**

Start dev server (if not running), log in, take a practice test, answer a few questions, finish. Open Firestore, verify a new `sessions` doc + corresponding `performanceLog` answers + updated `adaptiveProfile`.

- [ ] **Step 6: Commit**

```bash
cd ~/pantherprep
git add components/test/practice-test.tsx
git commit -m "Wire practice-test handleFinish through completeTestSession"
```

---

## Task 7: Create `lib/session-history.ts` readers

**Files:**
- Create: `lib/session-history.ts`

- [ ] **Step 1: Create the file**

Create `lib/session-history.ts` with:

```ts
// Read-only helpers for the Past Tests UI.
// getTestHistory → list of session summaries for a user
// getTestSessionDetail → reconstruct one test's question-by-question answers

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Session } from "@/types/firestore";
import type { StoredAnswer } from "@/lib/adaptive/performance-service";

export interface SessionSummary extends Session {
  id: string;
}

export async function getTestHistory(
  uid: string,
  maxResults = 100
): Promise<SessionSummary[]> {
  if (!uid) return [];
  const q = query(
    collection(db, "sessions"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Session) }));
}

export async function getTestSessionDetail(
  uid: string,
  testSessionId: string
): Promise<{
  session: SessionSummary | null;
  answers: StoredAnswer[];
}> {
  if (!uid || !testSessionId) return { session: null, answers: [] };

  // Fetch the summary. We search by testSessionId rather than Firestore doc id
  // because backfilled sessions preserve their original doc id but we prefer a
  // stable, self-describing join key.
  const sessionsQuery = query(
    collection(db, "sessions"),
    where("uid", "==", uid),
    where("testSessionId", "==", testSessionId),
    limit(1)
  );
  const sessionSnap = await getDocs(sessionsQuery);
  const session = sessionSnap.empty
    ? null
    : ({
        id: sessionSnap.docs[0].id,
        ...(sessionSnap.docs[0].data() as Session),
      } as SessionSummary);

  // Fetch all answers for this session
  const answersQuery = query(
    collection(db, "performanceLog", uid, "answers"),
    where("testSessionId", "==", testSessionId),
    orderBy("timestamp", "asc")
  );
  const answersSnap = await getDocs(answersQuery);
  const answers: StoredAnswer[] = answersSnap.docs.map(
    (d) => ({ id: d.id, ...d.data() } as StoredAnswer)
  );

  return { session, answers };
}
```

- [ ] **Step 2: Type-check**

Run: `cd ~/pantherprep && npx tsc --noEmit 2>&1 | grep "session-history" | head -10`

Expected: no errors in this file.

- [ ] **Step 3: Commit**

```bash
cd ~/pantherprep
git add lib/session-history.ts
git commit -m "Add lib/session-history.ts: getTestHistory + getTestSessionDetail"
```

---

## Task 8: Add the Firestore composite index for Past-Tests detail queries

**Files:**
- Modify: `firestore.indexes.json`

- [ ] **Step 1: Add the new index**

Open `firestore.indexes.json`. Inside the `indexes` array, add (alongside the existing `answers` index):

```json
    {
      "collectionGroup": "answers",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "testSessionId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "sessions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "uid", "order": "ASCENDING" },
        { "fieldPath": "testSessionId", "order": "ASCENDING" }
      ]
    }
```

Insert before the closing `]` of the `indexes` array. Make sure JSON commas are correct — the new entries should be separated by commas from adjacent entries.

- [ ] **Step 2: Validate JSON**

Run: `cd ~/pantherprep && node -e "JSON.parse(require('fs').readFileSync('firestore.indexes.json', 'utf8')); console.log('ok')"`

Expected: `ok`.

- [ ] **Step 3: Deploy the indexes**

```bash
cd ~/pantherprep && firebase deploy --only firestore:indexes
```

Expected: "Deploy complete" with no errors. Index creation happens asynchronously on the Firestore side — new queries may return "failed precondition" for up to a few minutes while the index builds. The Firebase console has an "Indexes" tab showing build status.

- [ ] **Step 4: Commit**

```bash
cd ~/pantherprep
git add firestore.indexes.json
git commit -m "Add composite indexes for Past Tests detail queries"
```

---

## Task 9: Create `PastTestsView` component — list mode

**Files:**
- Create: `components/dashboard/past-tests-view.tsx`

- [ ] **Step 1: Create the file**

Create `components/dashboard/past-tests-view.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  getTestHistory,
  getTestSessionDetail,
  type SessionSummary,
} from "@/lib/session-history";
import type { StoredAnswer } from "@/lib/adaptive/performance-service";

interface Props {
  uid: string;
}

type ViewMode =
  | { kind: "list" }
  | { kind: "detail"; testSessionId: string };

function formatDate(ts: any): string {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTestType(tt: string): string {
  return tt
    .split("-")
    .map((p) => (p.length <= 3 ? p.toUpperCase() : p[0].toUpperCase() + p.slice(1)))
    .join(" ");
}

export function PastTestsView({ uid }: Props) {
  const [mode, setMode] = useState<ViewMode>({ kind: "list" });
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getTestHistory(uid)
      .then((s) => {
        if (!cancelled) setSessions(s);
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (loading) {
    return (
      <GlassCard>
        <p className="text-sm text-text-muted">Loading past tests…</p>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard>
        <p className="text-sm text-red-400">Failed to load past tests: {error}</p>
      </GlassCard>
    );
  }

  if (mode.kind === "detail") {
    return (
      <PastTestDetail
        uid={uid}
        testSessionId={mode.testSessionId}
        onBack={() => setMode({ kind: "list" })}
      />
    );
  }

  if (sessions.length === 0) {
    return (
      <GlassCard>
        <p className="text-sm text-text-muted">No tests taken yet.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <h3 className="mb-4 text-base font-bold">Past Tests</h3>
      <div className="flex flex-col gap-1.5">
        {sessions.map((s) => {
          const pct = s.percentage ?? 0;
          return (
            <div
              key={s.id}
              onClick={() => {
                if (s.testSessionId) {
                  setMode({ kind: "detail", testSessionId: s.testSessionId });
                }
              }}
              className={`grid grid-cols-5 items-center gap-2 rounded-lg border border-border-primary bg-bg-secondary p-3 text-sm transition ${
                s.testSessionId ? "cursor-pointer hover:border-panther-red/30" : "opacity-60"
              }`}
            >
              <span className="col-span-2 font-semibold">{formatTestType(s.testType)}</span>
              <span className="text-text-muted">{formatDate(s.createdAt)}</span>
              <span className="text-text-muted">
                {s.score}/{s.total} ({pct}%)
              </span>
              <span className="text-right text-panther-red">
                {s.testSessionId ? "Review →" : "Legacy"}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

// Detail view is defined below in Task 10.
function PastTestDetail(_props: {
  uid: string;
  testSessionId: string;
  onBack: () => void;
}) {
  return (
    <GlassCard>
      <p className="text-sm text-text-muted">Detail view coming in next task.</p>
    </GlassCard>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `cd ~/pantherprep && npx tsc --noEmit 2>&1 | grep "past-tests-view" | head -10`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd ~/pantherprep
git add components/dashboard/past-tests-view.tsx
git commit -m "PastTestsView component: list mode"
```

---

## Task 10: Extend `PastTestsView` with detail mode

**Files:**
- Modify: `components/dashboard/past-tests-view.tsx`

- [ ] **Step 1: Replace the `PastTestDetail` stub**

At the bottom of `components/dashboard/past-tests-view.tsx`, replace the `PastTestDetail` stub function with:

```tsx
import { KatexRender } from "@/lib/katex-render";

type DetailFilter = "all" | "wrong" | "skipped";

function PastTestDetail({
  uid,
  testSessionId,
  onBack,
}: {
  uid: string;
  testSessionId: string;
  onBack: () => void;
}) {
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<DetailFilter>("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getTestSessionDetail(uid, testSessionId)
      .then(({ session, answers }) => {
        if (!cancelled) {
          setSummary(session);
          setAnswers(answers);
        }
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid, testSessionId]);

  if (loading) {
    return (
      <GlassCard>
        <p className="text-sm text-text-muted">Loading test…</p>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard>
        <p className="text-sm text-red-400">Failed to load test: {error}</p>
        <button
          onClick={onBack}
          className="mt-3 rounded-full bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-muted"
        >
          ← Back
        </button>
      </GlassCard>
    );
  }

  const filtered = answers.filter((a) => {
    if (filter === "wrong") return !a.correct && a.selectedAnswer !== "";
    if (filter === "skipped") return a.selectedAnswer === "";
    return true;
  });

  const wrongCount = answers.filter((a) => !a.correct && a.selectedAnswer !== "").length;
  const skippedCount = answers.filter((a) => a.selectedAnswer === "").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-full bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-muted hover:text-text-primary"
        >
          ← Back to Past Tests
        </button>
      </div>

      {summary && (
        <GlassCard>
          <div className="mb-1 text-xs uppercase tracking-wide text-text-muted">
            {formatTestType(summary.testType)}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-2xl font-bold">
              {summary.score}/{summary.total}
            </div>
            <div className="text-sm text-text-muted">
              {summary.percentage ?? 0}% &middot; {formatDate(summary.createdAt)}
              {summary.scaledScore != null && ` · Scaled ${summary.scaledScore}`}
            </div>
          </div>
        </GlassCard>
      )}

      <div className="flex flex-wrap gap-2">
        {(["all", "wrong", "skipped"] as DetailFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
              f === filter
                ? "bg-panther-red text-white"
                : "border border-border-primary bg-bg-secondary text-text-muted"
            }`}
          >
            {f} (
            {f === "all"
              ? answers.length
              : f === "wrong"
              ? wrongCount
              : skippedCount}
            )
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((a, i) => {
          const originalIdx = answers.indexOf(a);
          const skipped = a.selectedAnswer === "";
          const borderColor = skipped
            ? "border-l-slate-500"
            : a.correct
            ? "border-l-emerald-400"
            : "border-l-red-400";
          return (
            <GlassCard
              key={a.id}
              className={`border-l-[3px] ${borderColor}`}
            >
              <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
                <span>
                  Question {originalIdx + 1} / {answers.length}
                </span>
                <span>
                  {a.domain} · {a.skill}
                </span>
              </div>

              <div className="mb-3 text-sm">
                <KatexRender source={a.stem} />
              </div>

              {a.choices.length > 0 && (
                <div className="mb-3 flex flex-col gap-1">
                  {a.choices.map((c) => {
                    const isUser = c.key === a.selectedAnswer;
                    const isCorrectChoice = c.key === a.correctAnswer;
                    let cls = "bg-bg-secondary text-text-muted";
                    if (isCorrectChoice) cls = "bg-emerald-400/15 text-emerald-300";
                    else if (isUser) cls = "bg-red-400/15 text-red-300";
                    return (
                      <div
                        key={c.key}
                        className={`flex gap-2 rounded-md px-3 py-1.5 text-sm ${cls}`}
                      >
                        <span className="font-bold">{c.key}.</span>
                        <span className="flex-1">
                          <KatexRender source={c.text} />
                        </span>
                        {isUser && <span className="text-xs">your answer</span>}
                        {isCorrectChoice && !isUser && (
                          <span className="text-xs">correct</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {a.choices.length === 0 && (
                <div className="mb-3 flex flex-col gap-1 text-sm">
                  <div className="rounded-md bg-bg-secondary px-3 py-1.5">
                    <span className="text-text-muted">Your answer: </span>
                    <span className={skipped ? "text-slate-500" : a.correct ? "text-emerald-300" : "text-red-300"}>
                      {skipped ? "(skipped)" : a.selectedAnswer}
                    </span>
                  </div>
                  <div className="rounded-md bg-bg-secondary px-3 py-1.5">
                    <span className="text-text-muted">Correct answer: </span>
                    <span className="text-emerald-300">{a.correctAnswer}</span>
                  </div>
                </div>
              )}

              {a.explanation && (
                <details open={!a.correct}>
                  <summary className="cursor-pointer text-xs font-semibold text-text-muted">
                    Explanation
                  </summary>
                  <div className="mt-2 text-sm text-text-secondary">
                    <KatexRender source={a.explanation} />
                  </div>
                </details>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
```

NOTE: `KatexRender` is imported from `@/lib/katex-render`. If the actual export name differs, adjust (check `lib/katex-render.tsx` — it's imported elsewhere in the codebase, use the same import pattern).

- [ ] **Step 2: Verify import path for KatexRender**

Run: `grep -n "katex-render" ~/pantherprep/app/\(authenticated\)/diagnostics/sat-math/page.tsx ~/pantherprep/components/test/diagnostic-test.tsx 2>&1 | head`

Use whichever import path is already in use in the codebase and adjust the new file's import to match.

- [ ] **Step 3: Type-check**

Run: `cd ~/pantherprep && npx tsc --noEmit 2>&1 | grep "past-tests-view" | head -10`

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd ~/pantherprep
git add components/dashboard/past-tests-view.tsx
git commit -m "PastTestsView: per-question detail view with filters"
```

---

## Task 11: Mount `PastTestsView` on the student dashboard + remove the legacy History tab

**Files:**
- Modify: `app/(authenticated)/dashboard/page.tsx`

- [ ] **Step 1: Update the Tab type**

Find the line:

```ts
type Tab = "overview" | "skills" | "history" | "practice";
```

Replace with:

```ts
type Tab = "overview" | "skills" | "past-tests" | "practice";
```

- [ ] **Step 2: Update the tab strip definition**

Find the `tabs` array (around line 150, where `{ key: "history", label: "History" }` lives). Replace the history entry with:

```ts
    { key: "past-tests", label: "Past Tests" },
```

- [ ] **Step 3: Update the tab rendering block**

Find:

```tsx
      {tab === "history" && <StudentHistory answers={recentAnswers} />}
```

Replace with:

```tsx
      {tab === "past-tests" && <PastTestsView uid={uid} />}
```

- [ ] **Step 4: Remove the now-unused `StudentHistory` function**

Find `function StudentHistory(` (around line 413) and delete the entire function body (approximately lines 413-460). Also delete `useRecentAnswers` from the imports and the call site at line 107 if `recentAnswers` is no longer referenced.

Before deleting, double-check nothing else references `StudentHistory` or `recentAnswers` — search the file for both names.

- [ ] **Step 5: Add the import**

```ts
import { PastTestsView } from "@/components/dashboard/past-tests-view";
```

- [ ] **Step 6: Lint + build**

Run: `cd ~/pantherprep && npm run lint 2>&1 | tail -15 && npm run build 2>&1 | tail -20`

Expected: success. Common issues: unused variables from the removed `StudentHistory` — delete them.

- [ ] **Step 7: Manual verification**

Start dev server if not running. Log in, go to `/dashboard`. Verify:
- The student tab strip shows "Past Tests" where "History" used to be.
- Clicking it loads the new component.
- If you took a test in Task 5, it appears here. Click it, verify the detail view renders with questions and KaTeX math.

- [ ] **Step 8: Commit**

```bash
cd ~/pantherprep
git add app/\(authenticated\)/dashboard/page.tsx
git commit -m "Dashboard: Past Tests tab replaces legacy History tab"
```

---

## Task 12: Mount `PastTestsView` on the teacher student drill-down

**Files:**
- Modify: `app/(authenticated)/dashboard/page.tsx`

- [ ] **Step 1: Locate TeacherStudentDrillDown**

Run: `grep -n "function TeacherStudentDrillDown\|TeacherStudentDrillDown(" ~/pantherprep/app/\(authenticated\)/dashboard/page.tsx`

Open the file and read that function to understand its current sub-tab structure (if any).

- [ ] **Step 2: Add a Past Tests sub-tab**

Inside `TeacherStudentDrillDown`, add a sub-tab for "Past Tests" next to whatever drill-down sections already exist. If the drill-down uses a local tab string, add `"past-tests"` as a value; if it uses a list of sections, add one. Render:

```tsx
<PastTestsView uid={profile.uid} />
```

under the new section. The component takes only `uid`, so the teacher view passes the selected student's uid and relies on Firestore rules for access control (already permissive for teachers).

If `TeacherStudentDrillDown` does not have a tab structure yet and only renders one thing, add a simple two-tab selector: "Mastery" (existing content) and "Past Tests" (new).

- [ ] **Step 3: Lint + build**

Run: `cd ~/pantherprep && npm run lint 2>&1 | tail -15 && npm run build 2>&1 | tail -20`

Expected: success.

- [ ] **Step 4: Manual verification**

Log in as a teacher account. Go to `/dashboard`, Students tab, click a student. Verify the new Past Tests sub-tab appears and loads data for that specific student.

- [ ] **Step 5: Commit**

```bash
cd ~/pantherprep
git add app/\(authenticated\)/dashboard/page.tsx
git commit -m "Teacher drill-down: Past Tests sub-tab with per-student history"
```

---

## Task 13: Create `scripts/backfill-performance-log.mjs`

**Files:**
- Create: `scripts/backfill-performance-log.mjs`

- [ ] **Step 1: Locate the service account key**

The Firebase admin SDK needs credentials. Check for existing usage patterns:

```bash
grep -rln "firebase-admin\|admin.initializeApp" ~/pantherprep/scripts/ 2>&1 | head -5
```

If there's an existing admin script, copy its auth pattern. If not, the script expects a service account JSON at a known path — document that in the script header.

- [ ] **Step 2: Map test types to question source files**

The backfill needs to re-import hardcoded questions. The source files are:

- `sat-math-diagnostic` → `app/(authenticated)/diagnostics/sat-math/page.tsx` (export the QUESTIONS array — may need a one-line refactor to make it importable from `.mjs`)
- `sat-rw-diagnostic` → `app/(authenticated)/diagnostics/sat-rw/page.tsx`
- `nmsqt-math-diagnostic`, `nmsqt-rw-diagnostic`, `psat89-math-diagnostic`, `psat89-rw-diagnostic` — analogous

Because Next.js page files are TSX with JSX, importing them from a plain `.mjs` script is awkward. Pragmatic approach: before this task, refactor each diagnostic page's `QUESTIONS` constant into a sibling file `questions.ts` (plain TS, no JSX), re-exported by the page. Then the script can use `tsx` (`npx tsx scripts/backfill-performance-log.mjs`) to import them directly.

Run: `which tsx || npm ls tsx 2>&1` — if tsx is not installed, `npx tsx` fetches it ephemerally.

- [ ] **Step 3: Do the page refactor**

For each of the 6 diagnostics, extract the `QUESTIONS` array. Example for `sat-math`:

Create `app/(authenticated)/diagnostics/sat-math/questions.ts` containing only:

```ts
import type { Question } from "@/types/question";

export const QUESTIONS: Question[] = [
  // ...paste the exact array from page.tsx here, unchanged...
];
```

Modify `app/(authenticated)/diagnostics/sat-math/page.tsx` to import from it:

```ts
import { QUESTIONS } from "./questions";
```

Remove the inline array. Leave the `SATMathDiagnostic` default export unchanged except it now uses the imported `QUESTIONS`.

Repeat for the other 5 diagnostic pages. Verify `npm run build` still succeeds after all 6 refactors.

- [ ] **Step 4: Commit the refactor separately**

```bash
cd ~/pantherprep
git add app/\(authenticated\)/diagnostics/*/page.tsx app/\(authenticated\)/diagnostics/*/questions.ts
git commit -m "Extract diagnostic QUESTIONS arrays to questions.ts for importability"
```

- [ ] **Step 5: Create the backfill script**

Create `scripts/backfill-performance-log.mjs` with:

```js
#!/usr/bin/env node
// Backfill script: reads existing sessions, re-writes them through the adaptive
// pipeline so performanceLog + adaptiveProfile populate for historical tests.
//
// Usage:
//   node scripts/backfill-performance-log.mjs --dry-run
//   node scripts/backfill-performance-log.mjs --uid=<firebaseUid>
//   node scripts/backfill-performance-log.mjs        (live, all users)

import admin from "firebase-admin";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Parse flags ---
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const UID_ARG = args.find((a) => a.startsWith("--uid="))?.split("=")[1];

// --- Admin SDK init ---
// Expects GOOGLE_APPLICATION_CREDENTIALS env var to point to a service account JSON.
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// --- Import question banks ---
// We import the extracted questions.ts modules through tsx. Since this script
// runs under `npx tsx`, TypeScript imports work directly.
const { QUESTIONS: SAT_MATH } = await import("../app/(authenticated)/diagnostics/sat-math/questions.ts");
const { QUESTIONS: SAT_RW } = await import("../app/(authenticated)/diagnostics/sat-rw/questions.ts");
const { QUESTIONS: NMSQT_MATH } = await import("../app/(authenticated)/diagnostics/nmsqt-math/questions.ts");
const { QUESTIONS: NMSQT_RW } = await import("../app/(authenticated)/diagnostics/nmsqt-rw/questions.ts");
const { QUESTIONS: PSAT89_MATH } = await import("../app/(authenticated)/diagnostics/psat89-math/questions.ts");
const { QUESTIONS: PSAT89_RW } = await import("../app/(authenticated)/diagnostics/psat89-rw/questions.ts");

const QUESTION_BANKS = {
  "sat-math-diagnostic": SAT_MATH,
  "sat-rw-diagnostic": SAT_RW,
  "nmsqt-math-diagnostic": NMSQT_MATH,
  "nmsqt-rw-diagnostic": NMSQT_RW,
  "psat89-math-diagnostic": PSAT89_MATH,
  "psat89-rw-diagnostic": PSAT89_RW,
};

// Pure helpers — imported from the same source as the client path so the
// two stay in sync. lib/question-utils.ts has no Firebase imports, so it is
// safe to load here under tsx.
const { mapDifficulty, normalizeChoices, isCorrect } = await import(
  "../lib/question-utils.ts"
);

// --- Main ---
async function main() {
  console.log(`Backfill starting. DRY_RUN=${DRY_RUN} UID=${UID_ARG ?? "(all)"}`);

  let sessionsQuery = db.collection("sessions");
  if (UID_ARG) sessionsQuery = sessionsQuery.where("uid", "==", UID_ARG);

  const snap = await sessionsQuery.get();
  console.log(`Found ${snap.size} session(s) to process.`);

  let ok = 0;
  let skipped = 0;
  const affectedUids = new Set();

  for (const sessionDoc of snap.docs) {
    const session = sessionDoc.data();
    const { uid, testType, answers: legacyAnswers, email, timeSpent, createdAt } = session;

    // Skip if already backfilled (has testSessionId)
    if (session.testSessionId) {
      skipped++;
      continue;
    }

    const bank = QUESTION_BANKS[testType];
    if (!bank) {
      console.warn(`skip ${sessionDoc.id} uid=${uid} reason=unknown-testType (${testType})`);
      skipped++;
      continue;
    }

    if (!Array.isArray(legacyAnswers) || legacyAnswers.length === 0) {
      console.warn(`skip ${sessionDoc.id} uid=${uid} reason=no-legacy-answers`);
      skipped++;
      continue;
    }

    // Map legacy answers (by questionId) → index in bank
    const qIdToIdx = new Map(bank.map((q, i) => [q.id, i]));
    const answersByIdx = {};
    let unresolved = 0;
    for (const la of legacyAnswers) {
      const idx = qIdToIdx.get(la.questionId);
      if (idx == null) {
        unresolved++;
        continue;
      }
      answersByIdx[idx] = la.userAnswer ?? "";
    }
    if (unresolved > 0) {
      console.warn(
        `partial ${sessionDoc.id} uid=${uid}: ${unresolved}/${legacyAnswers.length} legacy answers could not be matched`
      );
    }

    // Build performanceLog rows
    const testSessionId = sessionDoc.id; // reuse session doc id as join key
    const course = testType.replace(/-diagnostic$/, "");
    const rows = bank.map((q, i) => {
      const selected = answersByIdx[i] ?? "";
      return {
        uid,
        questionId: q.id,
        moduleId: q.module != null ? String(q.module) : "",
        course,
        domain: q.domain,
        skill: q.skill,
        difficulty: mapDifficulty(q.difficulty),
        correct: isCorrect(q, selected),
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        errorCode: null,
        errorCategory: null,
        timeSpent: 0,
        timestamp: createdAt,
        sessionId: testSessionId,
        stem: q.stem,
        choices: normalizeChoices(q),
        explanation: q.explanation,
        testSessionId,
      };
    });
    const score = rows.filter((r) => r.correct).length;

    if (DRY_RUN) {
      console.log(
        `DRY ok ${sessionDoc.id} uid=${uid} testType=${testType} score=${score}/${rows.length}`
      );
    } else {
      // Write performanceLog batch
      const batch = db.batch();
      const colRef = db.collection("performanceLog").doc(uid).collection("answers");
      for (const row of rows) {
        batch.set(colRef.doc(), row);
      }
      // Update session doc with testSessionId (in place) and drop nested answers
      batch.set(
        db.collection("sessions").doc(sessionDoc.id),
        {
          ...session,
          testSessionId,
          answers: admin.firestore.FieldValue.delete(),
        },
        { merge: true }
      );
      await batch.commit();
      console.log(
        `ok ${sessionDoc.id} uid=${uid} testType=${testType} score=${score}/${rows.length}`
      );
    }

    ok++;
    affectedUids.add(uid);
  }

  // Note: adaptiveProfile recompute is skipped in this script because
  // recomputeProfile is a client-SDK function. Instead, the next time each
  // affected student (or teacher viewing them) loads the dashboard, the
  // `refresh` button on the profile will recompute. To force recompute
  // server-side, add a Cloud Function trigger on performanceLog writes —
  // deferred to a follow-up.

  console.log(
    `\nBackfill complete. ok=${ok} skipped=${skipped} affected_uids=${affectedUids.size}`
  );
  if (affectedUids.size > 0) {
    console.log(
      `\nAffected users will see up-to-date mastery after they or a teacher clicks Refresh on their dashboard, OR after the first new answer is logged.`
    );
  }
}

main().catch((e) => {
  console.error("Backfill failed:", e);
  process.exit(1);
});
```

- [ ] **Step 6: Add the npm script**

Open `package.json`. In the `scripts` object, add:

```json
    "backfill:perflog": "tsx scripts/backfill-performance-log.mjs"
```

(After an existing entry, with proper JSON commas.)

- [ ] **Step 7: Install tsx as a devDep**

```bash
cd ~/pantherprep && npm install --save-dev tsx
```

Expected: `tsx` shows up in `devDependencies`.

- [ ] **Step 8: Commit**

```bash
cd ~/pantherprep
git add scripts/backfill-performance-log.mjs package.json package-lock.json
git commit -m "Add backfill-performance-log script + tsx devDep"
```

---

## Task 14: Dry-run the backfill against the coworker's uid

**Files:** none — verification only.

- [ ] **Step 1: Get the coworker's uid**

Ask Luke for the email or uid. If only the email is known, look her up in the Firebase auth console or in the `students/{uid}` collection.

- [ ] **Step 2: Set admin credentials**

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

- [ ] **Step 3: Run a dry-run**

```bash
cd ~/pantherprep
npm run backfill:perflog -- --dry-run --uid=<coworker-uid>
```

Expected output:
```
Backfill starting. DRY_RUN=true UID=<uid>
Found 1 session(s) to process.
DRY ok <sessionId> uid=<uid> testType=sat-math-diagnostic score=X/44

Backfill complete. ok=1 skipped=0 affected_uids=1
```

If `Found 0`, her data is somewhere else — investigate before the live run.

---

## Task 15: Live backfill for the coworker and visual confirmation

**Files:** none — verification + ops.

- [ ] **Step 1: Run live backfill (one user only)**

```bash
cd ~/pantherprep
npm run backfill:perflog -- --uid=<coworker-uid>
```

Expected: one `ok` line, `skipped=0`.

- [ ] **Step 2: Verify Firestore**

Open the Firebase console. Check:
- `performanceLog/<coworker-uid>/answers` — ~44 new docs with `stem`, `choices`, `explanation`, matching `testSessionId`.
- `sessions/<sessionId>` — the doc has a `testSessionId` field now, and `answers` array is gone.

- [ ] **Step 3: Verify the UI**

Log in as a teacher account. Navigate to `/dashboard`, Students tab, find the coworker, click her row. On her drill-down, click the Past Tests sub-tab. Verify the diagnostic appears. Click it → verify per-question review renders correctly with KaTeX math, correct/incorrect coloring, and explanations.

- [ ] **Step 4: Verify adaptive dashboard populates**

Still on her drill-down, check that the Overview/Skills tabs now show real mastery numbers (not zeros). If they show zero, click the Refresh button on the adaptive profile component (it calls `recomputeProfile`). After one refresh, mastery numbers should populate.

- [ ] **Step 5: Notify Luke**

Tell Luke the coworker's dashboard is live so he can show her.

---

## Task 16: Full backfill + final deploy

**Files:** none — ops.

- [ ] **Step 1: Dry-run against all users**

```bash
cd ~/pantherprep
npm run backfill:perflog -- --dry-run
```

Expected: a list of every session, broken down as `DRY ok` or `skip`. Note the counts.

- [ ] **Step 2: Review skip reasons**

Any `skip` reason other than `already backfilled` or `unknown testType` (practice tests) is worth investigating before proceeding. Paste the output to Luke for a gut check.

- [ ] **Step 3: Live full backfill**

```bash
cd ~/pantherprep
npm run backfill:perflog
```

Watch the output. Expected: counts that approximately match the dry run. If any unexpected errors, STOP and investigate — do not re-run until the root cause is understood.

- [ ] **Step 4: Deploy the app**

```bash
cd ~/pantherprep
npm run build
firebase deploy --only hosting,firestore:indexes
```

(Rules unchanged. Indexes already deployed in Task 8 but redundant deploys are a no-op.)

- [ ] **Step 5: Smoke-test production**

Open `https://pantherprep.web.app`. Log in, check the adaptive dashboard populates, check a past test detail renders correctly.

- [ ] **Step 6: Announce to Luke**

Report the final counts: sessions backfilled, users affected, any skipped docs. Suggest the follow-up improvements (automated watchdog, practice tests being non-reviewable for legacy data, etc.).

---

## Out-of-scope follow-ups (do not implement)

- Wiring practice tests' legacy `sessions` data into reviewable Past-Tests detail. (Their question banks are not extracted; backfilling them would require more refactors. Legacy practice sessions will appear in the list view as "Legacy" entries without a Review button.)
- Moving the hardcoded questions into Firestore `questionPool`. (The spec explicitly defers this.)
- Cloud Function trigger on `performanceLog` writes to recompute profiles server-side. (Noted in the script; can be added later if client recompute proves insufficient.)
- Adding a test framework. (Separate initiative.)
