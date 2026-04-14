# PantherPrep Practice Runner Implementation Plan (Spec B)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a focused, reusable `PracticeRunner` React component that plays N skill-based questions with immediate feedback, auto-save resume, and unified write-through to the existing adaptive pipeline. Wire it into the Adaptive Dashboard's Practice tab as the first real consumer.

**Architecture:** `PracticeRunner` is a dumb player — it takes a pre-sourced `Question[]` array + session metadata as props, handles local state and UX, and calls `completeTestSession` on finish. Callers source questions via two helpers (`getQuestionsBySkill` for single-skill, `getAdaptivePracticeSet` for recommendation-weighted) in a new `lib/practice-question-source.ts` module. Rendering reuses the existing `QuestionCard` component verbatim — no changes to it.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.7, Firebase 10 (client SDK only), Tailwind 4, existing `completeTestSession` / `saveProgress` / `loadProgress` / `QuestionCard` / `GlassCard` utilities.

**Spec:** [docs/superpowers/specs/2026-04-14-practice-runner-spec-b-design.md](../specs/2026-04-14-practice-runner-spec-b-design.md)

**Testing convention:** This repo has no automated test framework. Each task uses `npx tsc --noEmit` + `npm run lint` + `npm run build` + manual verification via the Adaptive Dashboard Practice tab. Do NOT add a test framework.

---

## File map

| File | Status | Purpose |
|---|---|---|
| `firestore.indexes.json` | modify | Add `questionPool(course, skill, difficulty)` composite index |
| `lib/adaptive/performance-service.ts` | modify | Add optional `excludeIds` parameter to `getQuestions()` |
| `lib/practice-question-source.ts` | create | `getQuestionsBySkill` + `getAdaptivePracticeSet` + `toQuestion` adapter |
| `components/practice/practice-runner.tsx` | create | Main component — landing + playing + results screens (~350 lines) |
| `components/practice/practice-results-card.tsx` | create | Results screen extracted from the runner (~150 lines) |
| `app/(authenticated)/dashboard/page.tsx` | modify | Wire `StudentPractice` tab to launch the runner inline on button click |

---

## Task 1: Deploy composite index for `questionPool(course, skill, difficulty)`

**Files:**
- Modify: `firestore.indexes.json`

**Why this is Task 1:** Firestore indexes build asynchronously in the background. Deploying the index before any code that queries it means by the time the practice runner starts running queries, the index is ready. If we deployed code first, the first query would fail with `failed-precondition` until the index finished building.

- [ ] **Step 1: Add the composite index**

Open `firestore.indexes.json`. Find the `indexes` array (the top-level `{"indexes": [...]}` structure). Add this new entry:

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

Place it alongside other `questionPool` index entries (there should already be a few from earlier work — e.g. `course+domain+skill+difficulty`). Make sure JSON commas are correct — the preceding entry must have a trailing comma, and the new entry must have a trailing comma if there's more after it.

- [ ] **Step 2: Validate JSON**

Run:
```
cd /Users/lukemccarthy/pantherprep && node -e "JSON.parse(require('fs').readFileSync('firestore.indexes.json','utf8')); console.log('ok')"
```
Expected: `ok`.

- [ ] **Step 3: Deploy the indexes**

```
cd /Users/lukemccarthy/pantherprep && firebase deploy --only firestore:indexes 2>&1 | tail -15
```
Expected: "Deploy complete!" with no errors. The index will start building in the background; Firebase console's Indexes tab shows build status. For ~600 docs in `questionPool`, it should build within a minute.

- [ ] **Step 4: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add firestore.indexes.json
git commit -m "Add composite index for questionPool by course+skill+difficulty"
```

---

## Task 2: Extend `getQuestions()` with `excludeIds` parameter

**Files:**
- Modify: `lib/adaptive/performance-service.ts` (the `getQuestions` function, around line 316)

- [ ] **Step 1: Read the current function**

Run:
```
cd /Users/lukemccarthy/pantherprep && sed -n '316,345p' lib/adaptive/performance-service.ts
```

You'll see a `getQuestions` function that takes `{course, domain?, skill?, difficulty?, limit?}` and returns `Promise<PoolQuestion[]>`. Confirm the current shape before editing.

- [ ] **Step 2: Replace the function**

Replace the entire `getQuestions` function (lines 316-345 in the current file, may vary slightly) with:

```ts
export async function getQuestions(criteria: {
  course: string;
  domain?: string;
  skill?: string;
  difficulty?: string;
  limit?: number;
  excludeIds?: string[];  // filtered client-side after fetch
}): Promise<PoolQuestion[]> {
  try {
    const constraints = [where("course", "==", criteria.course)];
    if (criteria.domain) constraints.push(where("domain", "==", criteria.domain));
    if (criteria.skill) constraints.push(where("skill", "==", criteria.skill));
    if (criteria.difficulty) constraints.push(where("difficulty", "==", criteria.difficulty));

    const q = query(
      collection(db, "questionPool"),
      ...constraints,
      limit(criteria.limit || 50)
    );
    const snap = await getDocs(q);
    let results = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() } as unknown as PoolQuestion)
    );

    if (criteria.excludeIds && criteria.excludeIds.length > 0) {
      const excludeSet = new Set(criteria.excludeIds);
      results = results.filter((q) => !excludeSet.has(q.sourceId));
    }

    return results;
  } catch (e) {
    console.warn("getQuestions error:", e);
    return [];
  }
}
```

Note: the `as unknown as PoolQuestion` cast is the same pattern Task 2 of spec D established — the new `PoolQuestion` shape doesn't have an `id` field but the spread adds one, so TypeScript needs the intermediate `unknown`.

- [ ] **Step 3: Type-check**

Run:
```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "performance-service" | head
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add lib/adaptive/performance-service.ts
git commit -m "getQuestions: add optional excludeIds parameter for practice-runner"
```

---

## Task 3: Create `lib/practice-question-source.ts`

**Files:**
- Create: `lib/practice-question-source.ts`

- [ ] **Step 1: Create the file**

Create `lib/practice-question-source.ts` with this exact content:

```ts
// Caller-facing helpers for sourcing questions for the practice runner.
// Two modes:
//   - getQuestionsBySkill(course, skill, count)  → single-skill practice
//   - getAdaptivePracticeSet(uid, course, count) → recommendation-weighted
//
// Both return a uniform PracticeBatch shape that PracticeRunner accepts.
// The single-skill path falls back to adjacent skills in the same domain
// when the primary skill has fewer than `count` questions, and records
// any fallbacks used as human-readable notes for the results card.

import {
  getQuestions,
  type PoolQuestion,
} from "@/lib/adaptive/performance-service";
import {
  generatePracticeSet,
  MATH_SKILLS,
  RW_SKILLS,
} from "@/lib/adaptive/adaptive-engine";
import type { Question } from "@/types/question";

export interface PracticeBatch {
  questions: Question[];
  fallbackNotes: string[];
}

interface SkillOpts {
  excludeIds?: string[];
  preferredDifficulty?: "F" | "M" | "C";
  fallbackToDomain?: boolean;  // default true
}

export async function getQuestionsBySkill(
  course: string,
  skill: string,
  count: number = 10,
  opts: SkillOpts = {}
): Promise<PracticeBatch> {
  const notes: string[] = [];
  const excludeSet = new Set(opts.excludeIds ?? []);
  const fallbackOn = opts.fallbackToDomain !== false;

  // Primary query: the requested skill
  const primaryPool = await getQuestions({
    course,
    skill,
    difficulty: opts.preferredDifficulty,
    limit: count * 3,
    excludeIds: opts.excludeIds,
  });

  let selected: PoolQuestion[] = shuffle(primaryPool).slice(0, count);
  const primaryCount = selected.length;

  if (selected.length < count && fallbackOn) {
    const domain = findDomainForSkill(skill, course);
    if (domain) {
      const siblings = getSkillsInDomain(domain, course).filter(
        (s) => s !== skill
      );
      for (const siblingSkill of siblings) {
        if (selected.length >= count) break;
        const more = await getQuestions({
          course,
          skill: siblingSkill,
          limit: (count - selected.length) * 2,
        });
        const moreFiltered = more.filter(
          (q) =>
            !excludeSet.has(q.sourceId) &&
            !selected.find((p) => p.sourceId === q.sourceId)
        );
        const shuffled = shuffle(moreFiltered);
        selected.push(...shuffled.slice(0, count - selected.length));
      }
      const padCount = selected.length - primaryCount;
      if (padCount > 0) {
        notes.push(
          `${padCount} question${padCount === 1 ? "" : "s"} pulled from adjacent skills in ${domain} because this skill doesn't have enough content yet.`
        );
      }
    }
  }

  return {
    questions: selected.map(toQuestion),
    fallbackNotes: notes,
  };
}

export async function getAdaptivePracticeSet(
  uid: string,
  course: string,
  count: number = 15
): Promise<PracticeBatch> {
  const set = await generatePracticeSet(uid, course, count);
  return {
    questions: (set.questions ?? []).map(toQuestion),
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
    if ((skills as string[]).includes(skillKey)) return domain;
  }
  return null;
}

function getSkillsInDomain(domain: string, course: string): string[] {
  const taxonomy = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  return (taxonomy as Record<string, string[]>)[domain] ?? [];
}

/**
 * Map a PoolQuestion (Firestore shape) back to Question (UI shape) so
 * QuestionCard can render it without any changes. The sourceSkill label
 * is used for display and for storage in the answer row, keeping skill
 * identifiers consistent with how the existing diagnostic harness tags
 * answers. The taxonomy key (pq.skill) is only used for the routing /
 * query path and is dropped here.
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
      pq.difficulty === "F"
        ? "easy"
        : pq.difficulty === "C"
        ? "hard"
        : "medium",
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

- [ ] **Step 2: Type-check**

```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "practice-question-source" | head
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add lib/practice-question-source.ts
git commit -m "Add lib/practice-question-source: getQuestionsBySkill + getAdaptivePracticeSet"
```

---

## Task 4: Create `components/practice/practice-runner.tsx` — landing + playing screens

**Files:**
- Create: `components/practice/practice-runner.tsx`

This task creates the runner with just the landing and playing screens. The results screen is a stub that just shows score + a Back button — Task 5 replaces that stub with the real `PracticeResultsCard`.

- [ ] **Step 1: Create the file**

Create `components/practice/practice-runner.tsx` with:

```tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { QuestionCard } from "@/components/test/question-card";
import { saveProgress, loadProgress } from "@/lib/firestore";
import { completeTestSession, type CompleteTestResult } from "@/lib/test-persistence";
import type { Question } from "@/types/question";

export interface PracticeRunnerProps {
  uid: string;
  email: string;
  course: string;
  skill?: string;
  skillLabel?: string;
  testType: string;
  questions: Question[];
  fallbackNotes?: string[];
  onComplete?: (result: CompleteTestResult) => void;
  onExit: () => void;
  onPracticeAgain?: () => void;
}

type Screen = "landing" | "playing" | "results";

interface PracticeProgress {
  questions: Question[];
  answers: Record<number, string>;
  submitted: Record<number, boolean>;
  flagged: number[];
  currentQ: number;
  startedAt: number;
  completedAt?: number;
}

function isCorrect(q: Question, ans: string | undefined): boolean {
  if (ans == null || ans === "") return false;
  const ca = q.correctAnswer.trim();
  const ua = ans.trim();
  if (q.type === "spr") {
    const an = parseFloat(ua);
    const cn = parseFloat(ca);
    if (!isNaN(an) && !isNaN(cn)) return Math.abs(an - cn) < 1e-9;
    return ua.toLowerCase() === ca.toLowerCase();
  }
  return ua.toUpperCase() === ca.toUpperCase();
}

export function PracticeRunner(props: PracticeRunnerProps) {
  const {
    uid,
    email,
    course,
    skill,
    skillLabel,
    testType,
    questions: propQuestions,
    fallbackNotes,
    onComplete,
    onExit,
    onPracticeAgain,
  } = props;

  const progressKey = `practice_${course}_${skill ?? "adaptive"}`;

  const [screen, setScreen] = useState<Screen>("landing");
  const [questions, setQuestions] = useState<Question[]>(propQuestions);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [saveError, setSaveError] = useState(false);
  const [finalResult, setFinalResult] = useState<CompleteTestResult | null>(null);
  const [resumable, setResumable] = useState<PracticeProgress | null>(null);
  const startTimeRef = useRef<number>(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- On-mount: check for resumable progress ---
  useEffect(() => {
    let cancelled = false;
    loadProgress(uid, progressKey).then((doc) => {
      if (cancelled) return;
      if (!doc) return;
      const state = doc.state as unknown as PracticeProgress;
      if (state?.completedAt) {
        // Stale completed session — ignore, treat as fresh.
        return;
      }
      if (state?.questions && state.questions.length > 0) {
        setResumable(state);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [uid, progressKey]);

  // --- Auto-save (debounced) ---
  const scheduleAutoSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const state: PracticeProgress = {
        questions,
        answers,
        submitted,
        flagged: Array.from(flagged),
        currentQ,
        startedAt: startTimeRef.current,
      };
      saveProgress(uid, progressKey, state as unknown as Record<string, unknown>).catch(
        (e) => console.warn("practice auto-save failed:", e)
      );
    }, 500);
  }, [uid, progressKey, questions, answers, submitted, flagged, currentQ]);

  useEffect(() => {
    if (screen === "playing") scheduleAutoSave();
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [screen, scheduleAutoSave]);

  // --- Start a fresh session ---
  const handleStartFresh = () => {
    setQuestions(propQuestions);
    setCurrentQ(0);
    setAnswers({});
    setSubmitted({});
    setFlagged(new Set());
    setResumable(null);
    startTimeRef.current = Date.now();
    setScreen("playing");
  };

  // --- Resume a saved session ---
  const handleResume = () => {
    if (!resumable) return;
    setQuestions(resumable.questions);
    setCurrentQ(resumable.currentQ);
    setAnswers(resumable.answers);
    setSubmitted(resumable.submitted);
    setFlagged(new Set(resumable.flagged));
    startTimeRef.current = resumable.startedAt;
    setResumable(null);
    setScreen("playing");
  };

  // --- Answer handler ---
  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: answer }));
  };

  // --- Check (submit) current question to reveal explanation ---
  const handleCheck = () => {
    setSubmitted((prev) => ({ ...prev, [currentQ]: true }));
  };

  // --- Advance or finish ---
  const handleNext = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      return;
    }
    // Final question — complete the session
    await finishSession();
  };

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
      setFinalResult(result);
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

  // --- Derive per-render values ---
  const q = questions[currentQ];
  const isLocked = !!submitted[currentQ];
  const hasAnswer = answers[currentQ] != null && answers[currentQ] !== "";

  const correctCount = questions.filter((qq, i) => isCorrect(qq, answers[i])).length;
  const total = questions.length;

  // ============================================================
  // LANDING SCREEN
  // ============================================================
  if (screen === "landing") {
    return (
      <GlassCard className="mx-auto max-w-xl">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Practice
        </div>
        <h2 className="mb-2 font-display text-3xl tracking-[0.02em] text-white">
          {skillLabel ?? "Adaptive Practice"}
        </h2>
        <p className="mb-6 text-sm text-text-secondary">
          {questions.length} questions &middot; untimed &middot; immediate feedback after each question
        </p>

        {fallbackNotes && fallbackNotes.length > 0 && (
          <div className="mb-5 rounded-radius-md border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
            {fallbackNotes.map((note, i) => (
              <p key={i}>{note}</p>
            ))}
          </div>
        )}

        {resumable ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-text-secondary">
              You have an in-progress session on question {resumable.currentQ + 1} of{" "}
              {resumable.questions.length}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResume}
                className="flex-1 rounded-radius-md bg-panther-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-panther-red/90"
              >
                Resume
              </button>
              <button
                onClick={handleStartFresh}
                className="flex-1 rounded-radius-md border border-border-default px-5 py-3 text-sm text-text-secondary transition hover:border-border-light"
              >
                Start over
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleStartFresh}
              disabled={questions.length === 0}
              className="flex-1 rounded-radius-md bg-panther-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-panther-red/90 disabled:opacity-40"
            >
              Start Practice
            </button>
            <button
              onClick={onExit}
              className="rounded-radius-md border border-border-default px-5 py-3 text-sm text-text-muted transition hover:text-text-secondary"
            >
              Back
            </button>
          </div>
        )}
      </GlassCard>
    );
  }

  // ============================================================
  // PLAYING SCREEN
  // ============================================================
  if (screen === "playing" && q) {
    return (
      <div className="mx-auto max-w-2xl">
        {/* Progress bar */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Question {currentQ + 1} / {questions.length}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-bg-secondary">
            <div
              className="h-full bg-panther-red transition-[width] duration-300"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
          <button
            onClick={onExit}
            className="text-xs text-text-muted transition hover:text-text-secondary"
          >
            Exit
          </button>
        </div>

        <GlassCard>
          <QuestionCard
            question={q}
            selectedAnswer={answers[currentQ]}
            onAnswer={handleAnswer}
            showExplanation={isLocked}
            locked={isLocked}
            questionNumber={currentQ + 1}
          />

          <div className="mt-6 flex gap-3">
            {!isLocked ? (
              <button
                onClick={handleCheck}
                disabled={!hasAnswer}
                className="rounded-radius-md bg-panther-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-panther-red/90 disabled:opacity-40"
              >
                Check
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="rounded-radius-md bg-panther-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-panther-red/90"
              >
                {currentQ < questions.length - 1 ? "Next question" : "Finish session"}
              </button>
            )}
          </div>
        </GlassCard>
      </div>
    );
  }

  // ============================================================
  // RESULTS SCREEN (stub — replaced by Task 6)
  // ============================================================
  if (screen === "results") {
    return (
      <GlassCard className="mx-auto max-w-xl text-center">
        <h2 className="mb-2 font-display text-3xl text-white">
          {correctCount}/{total}
        </h2>
        <p className="mb-5 text-sm text-text-muted">
          {total > 0 ? Math.round((correctCount / total) * 100) : 0}% correct
        </p>
        {saveError && (
          <p className="mb-4 text-xs text-red-400">
            Your score couldn&apos;t be saved. Please try again later.
          </p>
        )}
        <div className="flex justify-center gap-3">
          {onPracticeAgain && (
            <button
              onClick={onPracticeAgain}
              className="rounded-radius-md bg-panther-red px-5 py-2.5 text-sm font-semibold text-white"
            >
              Practice again
            </button>
          )}
          <button
            onClick={onExit}
            className="rounded-radius-md border border-border-default px-5 py-2.5 text-sm text-text-secondary"
          >
            Back
          </button>
        </div>
      </GlassCard>
    );
  }

  // Fallback
  return null;
}
```

- [ ] **Step 2: Type-check**

```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "practice-runner\|practice/practice" | head
```
Expected: no errors.

- [ ] **Step 3: Build**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -15
```
Expected: build succeeds. If you see an error about a missing `GlassCard` or `QuestionCard` import, double-check the import paths match how the rest of the codebase imports them (`@/components/ui/glass-card` and `@/components/test/question-card`).

- [ ] **Step 4: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add components/practice/practice-runner.tsx
git commit -m "PracticeRunner component: landing + playing screens + stub results"
```

---

## Task 5: Create `components/practice/practice-results-card.tsx`

**Files:**
- Create: `components/practice/practice-results-card.tsx`

- [ ] **Step 1: Create the file**

Create `components/practice/practice-results-card.tsx` with:

```tsx
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { QuestionCard } from "@/components/test/question-card";
import type { Question } from "@/types/question";

interface PracticeResultsCardProps {
  questions: Question[];
  answers: Record<number, string>;
  timeSpent: number;  // seconds
  saveError: boolean;
  fallbackNotes?: string[];
  onPracticeAgain?: () => void;
  onExit: () => void;
}

function isCorrect(q: Question, ans: string | undefined): boolean {
  if (ans == null || ans === "") return false;
  const ca = q.correctAnswer.trim();
  const ua = ans.trim();
  if (q.type === "spr") {
    const an = parseFloat(ua);
    const cn = parseFloat(ca);
    if (!isNaN(an) && !isNaN(cn)) return Math.abs(an - cn) < 1e-9;
    return ua.toLowerCase() === ca.toLowerCase();
  }
  return ua.toUpperCase() === ca.toUpperCase();
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function PracticeResultsCard({
  questions,
  answers,
  timeSpent,
  saveError,
  fallbackNotes,
  onPracticeAgain,
  onExit,
}: PracticeResultsCardProps) {
  const correctCount = questions.filter((q, i) => isCorrect(q, answers[i])).length;
  const total = questions.length;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Per-skill breakdown — only shows if more than one skill is represented
  const bySkill = new Map<string, { correct: number; total: number }>();
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const key = q.skill;
    const row = bySkill.get(key) ?? { correct: 0, total: 0 };
    row.total += 1;
    if (isCorrect(q, answers[i])) row.correct += 1;
    bySkill.set(key, row);
  }
  const showBreakdown = bySkill.size > 1;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      {/* Summary */}
      <GlassCard className="text-center">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Practice Results
        </div>
        <h2 className="mb-2 font-display text-[3rem] leading-none text-white">
          {correctCount}/{total}
        </h2>
        <p className="text-sm text-text-muted">
          {percent}% &middot; {formatDuration(timeSpent)}
        </p>

        {saveError && (
          <p className="mt-4 rounded-radius-sm border border-accent-red/20 bg-accent-red-soft px-4 py-2 text-xs text-accent-red">
            Your score couldn&apos;t be saved. Please refresh and try again.
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {onPracticeAgain && (
            <button
              onClick={onPracticeAgain}
              className="rounded-radius-md bg-panther-red px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-panther-red/90"
            >
              Practice again
            </button>
          )}
          <button
            onClick={onExit}
            className="rounded-radius-md border border-border-default px-5 py-2.5 text-sm text-text-secondary transition hover:border-border-light"
          >
            Back
          </button>
        </div>
      </GlassCard>

      {/* Skill breakdown (only if multi-skill) */}
      {showBreakdown && (
        <GlassCard>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Skill Breakdown
          </h3>
          <div className="flex flex-col gap-2">
            {Array.from(bySkill.entries())
              .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
              .map(([sk, row]) => {
                const pct = row.total > 0 ? row.correct / row.total : 0;
                const bar =
                  pct >= 0.8
                    ? "bg-emerald-400"
                    : pct >= 0.6
                    ? "bg-lime-400"
                    : pct >= 0.4
                    ? "bg-amber-400"
                    : "bg-red-400";
                return (
                  <div key={sk} className="flex items-center gap-3 text-xs">
                    <span className="w-40 truncate text-text-secondary" title={sk}>
                      {sk}
                    </span>
                    <div className="flex-1 overflow-hidden rounded-full bg-bg-secondary">
                      <div
                        className={`h-1.5 ${bar}`}
                        style={{ width: `${Math.max(pct * 100, 3)}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-text-muted">
                      {row.correct}/{row.total}
                    </span>
                  </div>
                );
              })}
          </div>
        </GlassCard>
      )}

      {/* Fallback notes */}
      {fallbackNotes && fallbackNotes.length > 0 && (
        <GlassCard>
          <p className="text-xs text-amber-300">
            {fallbackNotes.map((note, i) => (
              <span key={i} className="block">
                {note}
              </span>
            ))}
          </p>
        </GlassCard>
      )}

      {/* Per-question review */}
      <GlassCard>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Question Review
        </h3>
        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div key={i} className="border-b border-border-default pb-5 last:border-0 last:pb-0">
              <QuestionCard
                question={q}
                selectedAnswer={answers[i]}
                onAnswer={() => {}}
                showExplanation={true}
                locked={true}
                questionNumber={i + 1}
              />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "practice-results" | head
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add components/practice/practice-results-card.tsx
git commit -m "PracticeResultsCard: score, skill breakdown, per-question review"
```

---

## Task 6: Replace the stub results screen in the runner with `PracticeResultsCard`

**Files:**
- Modify: `components/practice/practice-runner.tsx` (the results screen section)

- [ ] **Step 1: Add the import**

At the top of `components/practice/practice-runner.tsx`, add this import (next to the existing imports):

```ts
import { PracticeResultsCard } from "./practice-results-card";
```

- [ ] **Step 2: Replace the results screen block**

Find the `// RESULTS SCREEN (stub — replaced by Task 6)` section in `practice-runner.tsx`. Replace the entire `if (screen === "results") { ... }` block with:

```tsx
  // ============================================================
  // RESULTS SCREEN
  // ============================================================
  if (screen === "results") {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    return (
      <PracticeResultsCard
        questions={questions}
        answers={answers}
        timeSpent={timeSpent}
        saveError={saveError}
        fallbackNotes={fallbackNotes}
        onPracticeAgain={onPracticeAgain}
        onExit={onExit}
      />
    );
  }
```

Also remove the no-longer-used `finalResult` state if it's only referenced by the stub: search for `finalResult` in the file — if it only appears in the stub you're deleting, remove the `useState` for it and the `setFinalResult` calls. If it's referenced elsewhere, leave it alone. (A quick `grep` on the file after the edit will tell you.)

- [ ] **Step 3: Type-check + build**

```
cd /Users/lukemccarthy/pantherprep && npx tsc --noEmit 2>&1 | grep "practice" | head
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -15
```
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add components/practice/practice-runner.tsx
git commit -m "PracticeRunner: wire results screen to PracticeResultsCard"
```

---

## Task 7: Wire the Dashboard Practice tab to launch `PracticeRunner`

**Files:**
- Modify: `app/(authenticated)/dashboard/page.tsx` (the `StudentPractice` function around line 424)

- [ ] **Step 1: Read the current StudentPractice function**

Run:
```
cd /Users/lukemccarthy/pantherprep && sed -n '420,462p' app/\(authenticated\)/dashboard/page.tsx
```

Note what's there: a component that takes `profile: AdaptiveProfile`, renders recommendations as a list, and has a "Launch Adaptive Practice" button that's currently non-functional.

- [ ] **Step 2: Add the required imports to the top of the file**

Near the top of `app/(authenticated)/dashboard/page.tsx` (with the other imports), add:

```ts
import { useState } from "react";  // may already be imported
import { PracticeRunner } from "@/components/practice/practice-runner";
import { getAdaptivePracticeSet, type PracticeBatch } from "@/lib/practice-question-source";
```

`useState` is almost certainly already imported; just confirm.

- [ ] **Step 3: Pass `course` and `uid` + `email` to `StudentPractice`**

The existing `StudentPractice` signature is `function StudentPractice({ profile }: { profile: AdaptiveProfile })`. The component needs access to `course`, `uid`, and `email` to launch the runner.

Find the place in `StudentView` that renders `<StudentPractice profile={profile} />` and update it to pass the additional props:

```tsx
{tab === "practice" && (
  <StudentPractice
    profile={profile}
    uid={user?.uid ?? ""}
    email={user?.email ?? ""}
    course={course}
  />
)}
```

Where `user` and `course` come from the enclosing `StudentView` scope (they should already be destructured from `useAuth()` and the course state higher up — confirm by reading the file).

- [ ] **Step 4: Replace the `StudentPractice` function body**

Replace the entire `StudentPractice` function (approximately lines 424-462) with:

```tsx
function StudentPractice({
  profile,
  uid,
  email,
  course,
}: {
  profile: AdaptiveProfile;
  uid: string;
  email: string;
  course: Course;
}) {
  const recs = profile?.recommendations || [];
  const [launching, setLaunching] = useState(false);
  const [session, setSession] = useState<PracticeBatch | null>(null);
  const [excludeIds, setExcludeIds] = useState<string[]>([]);

  const launchAdaptive = async () => {
    setLaunching(true);
    try {
      const batch = await getAdaptivePracticeSet(uid, course, 15);
      if (batch.questions.length === 0) {
        setLaunching(false);
        return;
      }
      setSession(batch);
    } finally {
      setLaunching(false);
    }
  };

  const handlePracticeAgain = async () => {
    const newExclude = session
      ? [...excludeIds, ...session.questions.map((q) => q.id)]
      : excludeIds;
    setExcludeIds(newExclude);
    setLaunching(true);
    try {
      const batch = await getAdaptivePracticeSet(uid, course, 15);
      setSession(batch);
    } finally {
      setLaunching(false);
    }
  };

  const handleExit = () => {
    setSession(null);
  };

  // If a session is active, render the runner in place of the plan
  if (session) {
    return (
      <PracticeRunner
        uid={uid}
        email={email}
        course={course}
        testType={`${course}-adaptive-practice`}
        questions={session.questions}
        fallbackNotes={session.fallbackNotes}
        onExit={handleExit}
        onPracticeAgain={handlePracticeAgain}
      />
    );
  }

  return (
    <GlassCard>
      <h3 className="mb-2 text-base font-bold">Your Adaptive Practice Plan</h3>
      <p className="mb-4 text-sm text-text-muted">
        Based on your performance data, here&apos;s what to focus on next.
      </p>

      {recs.length > 0 ? (
        <div className="flex flex-col gap-2">
          {recs.map((rec: Recommendation, i: number) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border-primary bg-bg-primary p-3"
            >
              <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  i < 3 ? "bg-panther-red text-white" : "bg-bg-secondary text-text-muted"
                }`}
              >
                {rec.priority}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{skillLabel(rec.skill)}</div>
                <div className="text-xs text-text-muted">
                  {rec.domain} &middot; {rec.reason}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted">
          Complete some modules to generate recommendations.
        </p>
      )}

      <button
        onClick={launchAdaptive}
        disabled={recs.length === 0 || launching}
        className="mt-5 w-full rounded-lg bg-panther-red py-3.5 text-sm font-bold text-white transition hover:bg-panther-red/90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {launching
          ? "Loading..."
          : `Launch Adaptive Practice (${recs.reduce(
              (s: number, r: Recommendation) => s + (r.questionCount || 0),
              0
            )} questions)`}
      </button>
    </GlassCard>
  );
}
```

Note the `Recommendation` type — it should already be imported from `@/lib/adaptive/performance-service` since the existing code references `recs` fields. If it's not imported, add it to the top-of-file imports:

```ts
import type { AdaptiveProfile, Recommendation } from "@/lib/adaptive/performance-service";
```

- [ ] **Step 5: Build**

```
cd /Users/lukemccarthy/pantherprep && npm run build 2>&1 | tail -20
```
Expected: build succeeds. Common issues:
- `Recommendation` type not imported — add it.
- `Course` type not in scope — it's defined locally in `dashboard/page.tsx` as a type alias; should work.
- `user.uid` might be `undefined` when `user` is null — the `?? ""` fallback handles this, the button is also gated on `recs.length === 0` which implies an authenticated user.

- [ ] **Step 6: Commit**

```bash
cd /Users/lukemccarthy/pantherprep
git add 'app/(authenticated)/dashboard/page.tsx'
git commit -m "Dashboard: launch PracticeRunner from the Practice tab button"
```

---

## Task 8: Manual verification

**Files:** none — ops only.

- [ ] **Step 1: Deploy the app to prod**

```
cd /Users/lukemccarthy/pantherprep && npm run build && firebase deploy --only hosting 2>&1 | tail -10
```
Expected: "Deploy complete!" Take note of the hosting URL.

Alternative: run `npm run dev` and test locally against the deployed Firestore. Both work since Firestore is the live project either way.

- [ ] **Step 2: Launch an adaptive practice session**

1. Open the app, sign in with a paps.net account that has at least one completed diagnostic (so `profile.recommendations` isn't empty).
2. Go to `/dashboard`, select any course (e.g., SAT Math).
3. Click the **Practice** tab.
4. Click **Launch Adaptive Practice**.
5. Expect: the runner's landing card appears — "Adaptive Practice • 15 questions • untimed • immediate feedback" and a Start button. (Or a "Practice" header with whatever skill label was generated.)
6. Click **Start Practice**. The first question renders.

- [ ] **Step 3: Answer 3 questions**

For each of the first 3 questions:
1. Select an answer by clicking a choice.
2. Click **Check**. The explanation appears, the correct choice highlights green, wrong choices dim.
3. Click **Next question**. The next question renders, progress bar advances.

- [ ] **Step 4: Test resume**

1. With the session paused on question 4 (not yet answered), close the browser tab.
2. Reopen the app. Go back to the Practice tab.
3. Click Launch Adaptive Practice again.
4. Expect: instead of starting a fresh session, the landing card says "You have an in-progress session on question 4 of 15" with **Resume** and **Start over** buttons.
5. Click **Resume**. You should land on question 4 with questions 1-3's answers already locked in.

- [ ] **Step 5: Test restart**

1. With the session still on question 4 (the resumed one), click **Exit** at the top of the playing screen.
2. Click Launch Adaptive Practice again from the Practice tab.
3. The resume prompt appears again.
4. Click **Start over**. A fresh landing card renders; click Start Practice.
5. Expect: question 1 renders, no answers locked in.

- [ ] **Step 6: Complete a full session**

1. From a fresh session, answer all 15 questions (actually clicking Check + Next on each).
2. On question 15, click Check, then click **Finish session**.
3. Expect: the Results screen renders with:
   - Big `N/15` score
   - Percent + time spent
   - Skill breakdown (multi-skill, since adaptive mode sources across recommendations)
   - Per-question review (all 15 questions, locked, explanations visible)
   - **Practice again** and **Back** buttons
4. Take note of the score — remember it for Step 8.

- [ ] **Step 7: Verify Firestore writes**

Open the Firebase console at `https://console.firebase.google.com/project/pantherprep-a5a73/firestore/data`. Confirm:

- `sessions/{newDocId}` — a new doc exists with your uid, `testType: "sat-math-adaptive-practice"` (or whatever course), `mode: "practice"`, `score`, `total`, `percentage`, `testSessionId`, `createdAt`.
- `performanceLog/{uid}/answers/*` — 15 new answer docs with the correct `testSessionId` linking back to the session.
- `adaptiveProfile/{uid}` — `lastUpdated` is recent.

- [ ] **Step 8: Test Practice again**

1. From the Results screen, click **Practice again**.
2. Expect: the landing card returns, now with a fresh batch of questions (the `excludeIds` from the previous session prevent repeat questions as much as possible).
3. Click Start Practice and answer the first 1-2 questions to confirm they're different from the first session.
4. Click Exit.

- [ ] **Step 9: Test Past Tests integration**

1. Navigate to `/dashboard` (your own view, not a teacher view).
2. Click the **Past Tests** tab (the one we built in the adaptive-wiring session).
3. Expect: at least two new rows appear at the top of the list — the two practice sessions you just completed, with `testType: "sat-math-adaptive-practice"` and the correct scores.
4. Click one of them to open the detail view — confirm the per-question review renders correctly (reuses `PastTestsView` from the earlier spec).

- [ ] **Step 10: Test the domain fallback (single-skill mode)**

Spec B's single-skill path isn't wired into the dashboard yet (spec A will wire it to skill detail pages). To test it now, open a browser console on the dashboard page and run:

```js
const { getQuestionsBySkill } = await import("/_next/static/chunks/lib/practice-question-source.ts");
// (replace the path with the actual resolved module path if needed)
```

Or easier: add a temporary dev-only test call in a scratch file or the dashboard page and check the result. If the temporary test call is too invasive, skip this step — Task 8 can be tested properly once spec A's skill detail page lands.

Alternative verification: from the Firestore console, inspect `questionPool` filtering by a thin skill (e.g., `where skill == quadratic_formula AND course == sat-math`). Confirm the count matches the inventory: 1 question. If spec A were wired in, launching practice for that skill would trigger the domain fallback. For now, note that the code path is implemented and will be exercised by spec A.

- [ ] **Step 11: Report results**

Tell Luke:
- Did the dry test pass end-to-end?
- Did resume/restart work correctly?
- Did Firestore writes land as expected?
- Did Past Tests pick up the new sessions?
- Any UI glitches, console errors, or surprises?

If anything failed, STOP. Do not merge. Diagnose and fix before proceeding to Task 9.

---

## Task 9: Merge to main + push + deploy

**Files:** none — ops.

- [ ] **Step 1: Confirm working tree**

```
cd /Users/lukemccarthy/pantherprep && git status --porcelain | grep -v "tsconfig.tsbuildinfo\|AUDIT_REPORT\|^?? data/\|^?? pantherprep-adaptive\|^?? scripts/fix-\|^?? docs/superpowers/plans/2026-04-13-admin\|^?? docs/superpowers/specs/2026-04-13-admin"
```
Expected: empty output (no unexpected dirty files). The filtered-out items are the admin-users session's in-flight work we leave alone.

- [ ] **Step 2: Verify branch state**

```
cd /Users/lukemccarthy/pantherprep && git log --oneline -10
```
Expected: the last 7-8 commits should be the ones from Tasks 1-7 of this plan.

- [ ] **Step 3: Push to origin**

```
cd /Users/lukemccarthy/pantherprep && git push origin main 2>&1 | tail -3
```
Expected: successful push, no force needed.

- [ ] **Step 4: Deploy hosting**

If you didn't already deploy in Task 8 Step 1, run:
```
cd /Users/lukemccarthy/pantherprep && firebase deploy --only hosting 2>&1 | tail -10
```
Expected: deploy complete.

- [ ] **Step 5: Smoke-test production**

Open `https://pantherprep.web.app`, sign in, go to `/dashboard` → Practice tab → Launch Adaptive Practice. Confirm the runner loads on prod. Don't need to complete a full session — just verify the first question renders.

- [ ] **Step 6: Report to Luke**

Summary: spec B shipped, PracticeRunner is live on production, dashboard Practice tab launches real sessions. Spec A (skill catalog UI) is next in the decomposition and can now import `PracticeRunner` from `@/components/practice/practice-runner` plus `getQuestionsBySkill` from `@/lib/practice-question-source`.

---

## Out-of-scope follow-ups (do not implement here)

- **Per-skill mastery delta display** on the results card — spec E.
- **Retry-wrong-only mode** on Practice Again — deferred.
- **Skill detail page + `/skills/[course]/[skill]` route** — spec A.
- **Spaced-repetition "due for review today" surface** — a distant follow-up.
- **Rate limiting / XP rewards / gamification hooks** — out of scope.
- **Refactoring `DiagnosticTest` or `PracticeTest`** to share a common player primitive — possible future cleanup; not in spec B.
- **Parker authoring pipeline** to fill thin skills — spec C.

## Known caveats

- The `deleteProgress` pattern isn't a real delete — we mark `completedAt` on the existing doc and treat it as stale on next mount. If you want a clean delete, `lib/firestore.ts` would need a new `deleteProgress` helper. Not worth adding for this spec.
- Auto-save is debounced 500ms, so a student who power-loops through answers might have a window where the latest state hasn't been written yet. If they close the tab in that window, they lose ~500ms of state. Acceptable tradeoff.
- `handlePracticeAgain`'s `excludeIds` grows unbounded across sessions. After ~5 practice-again clicks on the same course, the exclude list might be large enough to filter out everything. Not a near-term problem (need 50-75 excluded ids before `questionPool`'s pool runs out), but worth revisiting for spec A's skill-scoped practice where the pool per skill is smaller.
