"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { TopBar } from "@/components/layout/top-bar";
import { WelcomeScreen } from "./welcome-screen";
import { WarmupQuiz } from "./warmup-quiz";
import { LessonViewer } from "./lesson-viewer";
import { QuizEngine } from "./quiz-engine";
import { CompleteScreen, type PracticeSkillLink } from "./complete-screen";
import { useAuth } from "@/hooks/use-auth";
import adaptiveBridge from "@/lib/adaptive/adaptive-bridge";
import { computeWeakSkills, type SkillResult } from "@/lib/weak-skills";

interface ModuleShellProps {
  config: ModuleConfig;
  activities?: Record<string, React.ReactNode | ((goNext: () => void) => React.ReactNode)>;
  visuals?: Record<string, React.ReactNode>;
  nextModuleHref?: string;
  nextModuleLabel?: string;
  /** Custom label for the last lesson slide button (e.g. "Start Diagnostic") */
  lessonLastLabel?: string;
}

interface Scores {
  warmup?: { score: number; total: number };
  quiz?: { score: number; total: number };
  challenge?: { score: number; total: number };
}

// Map testType+section to course ID used by the adaptive engine
function courseId(testType: string, section: string): string {
  const prefix = testType === "psat89" ? "psat89" : testType === "nmsqt" ? "psat_nmsqt" : "sat";
  return `${prefix}_${section}`;
}

function moduleIdStr(testType: string, section: string, moduleNum: number): string {
  const prefix = testType === "psat89" ? "psat89" : testType === "nmsqt" ? "psat_nmsqt" : "sat";
  return `${prefix}_${section}_${moduleNum}`;
}

// Map quiz difficulty labels to adaptive difficulty codes
function mapDifficulty(d?: string): "F" | "M" | "C" {
  if (d === "easy") return "F";
  if (d === "hard") return "C";
  return "M";
}

export function ModuleShell({ config, activities, visuals, nextModuleHref, nextModuleLabel, lessonLastLabel }: ModuleShellProps) {
  const [screenIdx, setScreenIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [scores, setScores] = useState<Scores>({});
  const [skillResults, setSkillResults] = useState<SkillResult[]>([]);
  const bridgeInitRef = useRef(false);

  const { user } = useAuth();

  const currentScreenId = config.screens[screenIdx]?.id ?? "welcome";
  const courseHref = `/courses/${config.testType === "psat89" ? "psat89" : config.testType}-${config.section}`;

  // Initialize adaptive bridge when user is authenticated
  useEffect(() => {
    if (user?.uid && !bridgeInitRef.current) {
      adaptiveBridge.init(
        user.uid,
        courseId(config.testType, config.section),
        moduleIdStr(config.testType, config.section, config.moduleNum)
      );
      bridgeInitRef.current = true;
    }
  }, [user?.uid, config.testType, config.section, config.moduleNum]);

  // Flush adaptive data on unmount
  useEffect(() => {
    return () => {
      if (bridgeInitRef.current && adaptiveBridge.initialized) {
        adaptiveBridge.finishSession();
        bridgeInitRef.current = false;
      }
    };
  }, []);

  const goNext = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setScreenIdx((i) => Math.min(i + 1, config.screens.length - 1));
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 350);
  }, [config.screens.length]);

  // Adaptive tracking callback for quiz questions
  const handleQuizAnswer = useCallback((question: QuizQuestion, selectedIndex: number, correct: boolean) => {
    if (question.skill) {
      setSkillResults((prev) => [...prev, { skill: question.skill as string, correct }]);
    }
    if (!adaptiveBridge.initialized) return;
    adaptiveBridge.startQuestion();
    adaptiveBridge.recordAnswer({
      questionId: `${moduleIdStr(config.testType, config.section, config.moduleNum)}_q${selectedIndex}`,
      domain: question.domain || "Unknown",
      skill: question.skill || "unknown",
      difficulty: mapDifficulty(question.difficulty),
      correct,
      selectedAnswer: String.fromCharCode(65 + selectedIndex),
      correctAnswer: String.fromCharCode(65 + question.correct),
    });
  }, [config.testType, config.section, config.moduleNum]);

  // Finish session when reaching the complete screen
  const handleComplete = useCallback(async () => {
    if (adaptiveBridge.initialized) {
      await adaptiveBridge.finishSession();
      bridgeInitRef.current = false;
    }
  }, []);

  function renderScreen() {
    const sid = currentScreenId;

    // Check for custom activity
    if (activities?.[sid]) {
      const activity = activities[sid];
      return typeof activity === "function" ? activity(goNext) : activity;
    }

    switch (sid) {
      case "welcome":
        return (
          <WelcomeScreen
            moduleNum={config.moduleNum}
            title={config.title}
            subtitle={config.subtitle}
            accentColor={config.accentColor}
            screens={config.screens}
            onStart={goNext}
          />
        );
      case "warmup":
        return config.warmup ? (
          <WarmupQuiz
            questions={config.warmup}
            accentColor={config.accentColor}
            onComplete={(score, total) => {
              setScores((s) => ({ ...s, warmup: { score, total } }));
              goNext();
            }}
          />
        ) : null;
      case "lesson":
        return config.lessons && config.lessons.length > 0 ? (
          <LessonViewer
            slides={config.lessons}
            accentColor={config.accentColor}
            visuals={visuals}
            onComplete={goNext}
            lastSlideLabel={lessonLastLabel}
          />
        ) : null;
      case "quiz":
        return config.quiz ? (
          <QuizEngine
            questions={config.quiz}
            title="Practice Quiz"
            accentColor={config.accentColor}
            onAnswer={handleQuizAnswer}
            onComplete={(score, total, answers) => {
              setScores((s) => ({ ...s, quiz: { score, total } }));
              void answers;
              goNext();
            }}
          />
        ) : null;
      case "challenge":
        return config.challenge ? (
          <QuizEngine
            questions={config.challenge}
            title="Challenge Mode"
            accentColor={config.accentColor}
            showTraps={config.section === "math"}
            onAnswer={handleQuizAnswer}
            onComplete={(score, total, answers) => {
              setScores((s) => ({ ...s, challenge: { score, total } }));
              void answers;
              goNext();
            }}
          />
        ) : null;
      case "complete": {
        // Trigger adaptive session flush
        handleComplete();
        const stats = [];
        if (scores.warmup)
          stats.push({ label: "Warm-Up", value: `${scores.warmup.score}/${scores.warmup.total}` });
        if (scores.quiz)
          stats.push({
            label: "Quiz",
            value: `${scores.quiz.score}/${scores.quiz.total}`,
            color: scores.quiz.score / scores.quiz.total >= 0.8 ? "var(--color-accent-green)" : undefined,
          });
        if (scores.challenge)
          stats.push({
            label: "Challenge",
            value: `${scores.challenge.score}/${scores.challenge.total}`,
            color: scores.challenge.score / scores.challenge.total >= 0.8 ? "var(--color-accent-green)" : undefined,
          });

        const routeCourse = `${config.testType}-${config.section}`;
        const practiceSkills: PracticeSkillLink[] = computeWeakSkills(skillResults, {
          minAttempts: 2,
          threshold: 0.75,
          limit: 3,
        }).map((s) => ({
          course: routeCourse,
          taxonomyKey: s.taxonomyKey,
          blurb: `${s.correct}/${s.total} correct · ${Math.round(s.pct * 100)}%`,
        }));

        return (
          <CompleteScreen
            title={config.title}
            accentColor={config.accentColor}
            description={config.completionDescription}
            stats={stats}
            takeaways={config.takeaways}
            practiceSkills={practiceSkills}
            courseHref={courseHref}
            nextHref={nextModuleHref}
            nextLabel={nextModuleLabel}
          />
        );
      }
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen">
      <TopBar backHref={courseHref} backLabel="Back to Course" />

      {/* Progress dots */}
      <div className="fixed left-1/2 top-3 z-50 flex -translate-x-1/2 gap-2 rounded-full border border-border-default bg-[rgba(18,18,18,.85)] px-3.5 py-1.5 backdrop-blur-lg">
        {config.screens.map((s, i) => (
          <div
            key={s.id}
            title={s.label}
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i < screenIdx
                  ? config.accentColor
                  : i === screenIdx
                    ? config.accentColor
                    : "var(--color-border-default)",
              transform: i === screenIdx ? "scale(1.25)" : "scale(1)",
              boxShadow: i === screenIdx ? `0 0 8px ${config.accentColor}80` : "none",
            }}
          />
        ))}
      </div>

      {/* Screen content */}
      <div
        className="transition-all duration-350"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(-12px)" : "translateY(0)",
        }}
      >
        {renderScreen()}
      </div>
    </div>
  );
}
