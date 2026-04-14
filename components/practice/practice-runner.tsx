"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { QuestionCard } from "@/components/test/question-card";
import { PracticeResultsCard } from "./practice-results-card";
import { saveProgress, loadProgress } from "@/lib/firestore";
import { completeTestSession, type CompleteTestResult } from "@/lib/test-persistence";
import { getAdaptiveProfile, type AdaptiveProfile } from "@/lib/adaptive/performance-service";
import { computeMasteryDeltas, type MasteryDeltaRow } from "@/lib/mastery-delta";
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
  beforeProfile?: AdaptiveProfile | null;
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
    beforeProfile: beforeProfileProp,
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
  const [resumable, setResumable] = useState<PracticeProgress | null>(null);
  const [masteryDeltas, setMasteryDeltas] = useState<MasteryDeltaRow[]>([]);
  const startTimeRef = useRef<number>(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const beforeProfileRef = useRef<AdaptiveProfile | null>(beforeProfileProp ?? null);

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

  // --- On-mount: stash the before-profile if caller didn't provide one ---
  useEffect(() => {
    if (beforeProfileRef.current || !uid) return;
    getAdaptiveProfile(uid).then((p) => {
      beforeProfileRef.current = p;
    });
  }, [uid]);

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

      // Compute per-skill mastery deltas from a fresh profile fetch.
      // Non-fatal — if this fails, render results without the delta card.
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

  // --- Derive per-render values ---
  const q = questions[currentQ];
  const isLocked = !!submitted[currentQ];
  const hasAnswer = answers[currentQ] != null && answers[currentQ] !== "";

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
  // RESULTS SCREEN
  // ============================================================
  if (screen === "results") {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AnyResultsCard = PracticeResultsCard as any;
    return (
      <AnyResultsCard
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

  // Fallback
  return null;
}
