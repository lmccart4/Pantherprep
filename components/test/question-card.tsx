"use client";

import { useState } from "react";
import { renderMath } from "@/lib/katex-render";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/question";

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
  showExplanation: boolean;
  locked: boolean;
  questionNumber: number;
}

export function QuestionCard({
  question,
  selectedAnswer,
  onAnswer,
  showExplanation,
  locked,
  questionNumber,
}: QuestionCardProps) {
  const [sprInput, setSprInput] = useState("");
  const [passageExpanded, setPassageExpanded] = useState(true);

  const isCorrect =
    selectedAnswer != null &&
    (question.type === "mc"
      ? selectedAnswer === question.correctAnswer
      : checkSPRMatch(selectedAnswer, question.correctAnswer));

  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="flex flex-col gap-5">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge>{question.domain}</Badge>
        <Badge variant={question.difficulty}>{question.difficulty}</Badge>
        <Badge>{question.type === "mc" ? "Multiple Choice" : "Student Response"}</Badge>
      </div>

      {/* Passage */}
      {question.passage && (
        <div className="rounded-radius-md border border-border-default bg-bg-surface p-5">
          <button
            onClick={() => setPassageExpanded(!passageExpanded)}
            className="mb-2 flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            <span>Passage</span>
            <span>{passageExpanded ? "−" : "+"}</span>
          </button>
          {passageExpanded && (
            <div className="text-[0.92rem] leading-relaxed text-text-secondary">
              {renderMath(question.passage)}
            </div>
          )}
        </div>
      )}

      {/* Question stem */}
      <div className="text-[1.05rem] leading-relaxed text-text-primary">
        <span className="mr-2 font-mono text-sm text-text-muted">{questionNumber}.</span>
        {renderMath(question.stem)}
      </div>

      {/* MC Options */}
      {question.type === "mc" && question.options && (
        <div className="flex flex-col gap-2.5">
          {question.options.map((opt, i) => {
            const letter = optionLetters[i];
            const isSelected = selectedAnswer === letter;
            const isCorrectOption = letter === question.correctAnswer;
            const showResult = showExplanation && locked;

            return (
              <button
                key={letter}
                onClick={() => !locked && onAnswer(letter)}
                disabled={locked}
                className={cn(
                  "flex items-center gap-3 rounded-radius-md border px-4 py-3 text-left transition-all duration-200",
                  !showResult && !isSelected && "border-border-default bg-bg-card hover:border-border-light hover:bg-bg-card-hover",
                  !showResult && isSelected && "border-panther-red bg-panther-red-soft text-white",
                  showResult && isCorrectOption && "border-accent-green bg-accent-green-soft text-accent-green",
                  showResult && isSelected && !isCorrectOption && "border-accent-red bg-accent-red-soft text-accent-red",
                  showResult && !isSelected && !isCorrectOption && "border-border-default bg-bg-card opacity-50",
                  locked && "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    !showResult && !isSelected && "border-border-light text-text-muted",
                    !showResult && isSelected && "border-panther-red bg-panther-red text-white",
                    showResult && isCorrectOption && "border-accent-green bg-accent-green text-white",
                    showResult && isSelected && !isCorrectOption && "border-accent-red bg-accent-red text-white"
                  )}
                >
                  {letter}
                </span>
                <span className="text-[0.95rem]">{renderMath(opt)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* SPR Input */}
      {question.type === "spr" && (
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={locked ? (selectedAnswer ?? "") : sprInput}
            onChange={(e) => {
              if (!locked) {
                setSprInput(e.target.value);
                onAnswer(e.target.value);
              }
            }}
            disabled={locked}
            placeholder="Enter your answer"
            className={cn(
              "w-48 rounded-radius-md border bg-bg-card px-4 py-2.5 font-mono text-base text-text-primary outline-none transition-colors",
              !locked && "border-border-default focus:border-panther-red",
              locked && isCorrect && "border-accent-green bg-accent-green-soft",
              locked && !isCorrect && "border-accent-red bg-accent-red-soft"
            )}
          />
          {showExplanation && locked && (
            <span className="text-sm text-text-muted">
              Correct answer: <span className="font-mono text-accent-green">{question.correctAnswer}</span>
            </span>
          )}
        </div>
      )}

      {/* Explanation */}
      {showExplanation && (
        <div
          className={cn(
            "rounded-radius-md border p-5",
            isCorrect
              ? "border-accent-green/30 bg-accent-green-soft"
              : "border-accent-red/30 bg-accent-red-soft"
          )}
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <span className={isCorrect ? "text-accent-green" : "text-accent-red"}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </span>
          </div>
          <div className="text-sm leading-relaxed text-text-secondary">
            {question.explanations && selectedAnswer && question.explanations[selectedAnswer]
              ? renderMath(question.explanations[selectedAnswer])
              : renderMath(question.explanation)}
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider",
        variant === "easy" && "bg-accent-green-soft text-accent-green",
        variant === "medium" && "bg-accent-amber-soft text-accent-amber",
        variant === "hard" && "bg-accent-red-soft text-accent-red",
        !variant && "bg-white/5 text-text-muted"
      )}
    >
      {children}
    </span>
  );
}

function checkSPRMatch(userAnswer: string, correct: string): boolean {
  if (!userAnswer) return false;
  const a = parseFloat(userAnswer.trim());
  const c = parseFloat(correct.trim());
  if (isNaN(a) || isNaN(c)) {
    return userAnswer.trim().toLowerCase() === correct.trim().toLowerCase();
  }
  return Math.abs(a - c) < 0.01;
}
