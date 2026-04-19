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

  // 3. Queue a Coach Chat trigger for Parker. Fire-and-forget; failure here
  //    should never block the session write (that would cost the student
  //    their score). The drain-queue cron picks it up within 5 min.
  try {
    const { db } = await import("@/lib/firebase");
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
    await addDoc(collection(db, "coachTriggerQueue"), {
      uid,
      trigger: "post_session",
      sessionId: testSessionId,
      queuedAt: serverTimestamp(),
      processed: false,
    });
  } catch (e) {
    console.warn("coachTriggerQueue (post_session) write failed:", e);
  }

  // 4. Write the lightweight session summary
  await saveSession(
    {
      uid,
      email,
      testType,
      mode,
      score,
      total,
      percentage: total > 0 ? Math.round((score / total) * 100) : 0,
      ...(typeof scaledScore === "number" ? { scaledScore } : {}),
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
