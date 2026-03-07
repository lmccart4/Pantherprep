"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";
import { InteractiveChecklist } from "@/components/course/activities/interactive-checklist";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import { GrowthTracker } from "@/components/course/activities/growth-tracker";
import {
  TestOverviewVisual,
  ErrorAnalysisVisual,
  ScoreProjectionVisual,
  FormulaCardVisual,
  NextStepsVisual,
} from "./lesson-visuals";

export default function SATMathModule9() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/sat-math/10"
      nextModuleLabel="Module 10: Final Review & Test-Day Prep"

      visuals={{
        "test-overview": <TestOverviewVisual />,
        "error-analysis": <ErrorAnalysisVisual />,
        "score-projection": <ScoreProjectionVisual />,
        "formula-reference": <FormulaCardVisual />,
        "next-steps": <NextStepsVisual />,
      }}

      activities={{
        "checklist-pre": (goNext: () => void) => (
          <InteractiveChecklist
            title="Pre-Test Checklist"
            items={PRE_TEST_CHECKLIST}
            accentColor={MODULE_CONFIG.accentColor}
            requireAll
            onComplete={goNext}
          />
        ),
        "exercise-ec": (goNext: () => void) => (
          <ClassificationExercise
            items={EC_EXERCISE}
            categories={["Concept Gap","Misread Problem","Strategy Gap","Time Pressure","Careless/Arithmetic"]}
            title="Error Classification"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "checklist-td": (goNext: () => void) => (
          <InteractiveChecklist
            title="Test Day Checklist"
            items={TEST_DAY_CHECKLIST}
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "error-analysis": (goNext: () => void) => (
          <ErrorAnalysisWorksheet
            domains={["Algebra", "Advanced Math", "Problem-Solving & Data", "Geometry & Trig"]}
            testLabel="SAT Math"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "growth-tracker": (goNext: () => void) => (
          <GrowthTracker
            testType="sat"
            section="math"
            totalQuestions={44}
            accentColor={MODULE_CONFIG.accentColor}
            domainModules={{"Algebra": "Module 2", "Advanced Math": "Modules 3-4", "Problem-Solving & Data": "Module 5", "Geometry & Trig": "Module 6"}}
            onComplete={goNext}
          />
        ),
      }}
    />
  );
}

const EC_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "You identified center (3,−2) from (x−3)²+(y+2)²=16, but chose radius=16 instead of 4.",
    "correct": "Concept Gap",
    "explanation": "r²=16 means r=4. Review circles."
  },
  {
    "prompt": "You solved a system correctly but wrote (3,5) when they asked for x+y. Answer was 8.",
    "correct": "Misread Problem",
    "explanation": "Classic trap — re-read what they ask for."
  },
  {
    "prompt": "Variables in all choices. Spent 3 min on algebra. Plugging in x=2 would take 30 sec.",
    "correct": "Strategy Gap",
    "explanation": "Variables in choices = Plug In. Review Decision Tree."
  },
  {
    "prompt": "Ran out of time with 5 questions left unanswered.",
    "correct": "Time Pressure",
    "explanation": "Pacing issue. Use the two-pass system."
  },
  {
    "prompt": "Solved 3(x+4)=27 but expanded as 3x+4 instead of 3x+12.",
    "correct": "Careless/Arithmetic",
    "explanation": "You know distribution — just did it wrong. Slow down."
  },
  {
    "prompt": "Exponential question: picked decay when it was growth. Confused (1+r) with (1−r).",
    "correct": "Concept Gap",
    "explanation": "Growth=(1+r), Decay=(1−r). Review exponentials."
  }
];

const PRE_TEST_CHECKLIST = [
  "Find a quiet space with 70+ minutes uninterrupted.",
  "Open desmos.com/calculator in another tab.",
  "Have scratch paper and pencils ready.",
  "Turn off phone, close other tabs.",
  "Remember: accuracy over speed in Module 1.",
  "Desmos shortcuts memorized: ^ _ ~ | sqrt pi",
];

const TEST_DAY_CHECKLIST = [
  "Night before: Charge your device. Sleep 8+ hours.",
  "Morning: Eat a real breakfast. Bring a snack.",
  "Bring: Charged device, pencils, approved calculator (backup).",
  "Bluebook app must be installed and updated.",
  "Module 1: Two-pass system. Flag hard questions. Accuracy first.",
  "Desmos: Use aggressively for systems, quadratics, statistics.",
  "Time check: After 15 min, be on question 8+.",
  "Last 2 min: Answer ALL remaining questions — no penalty for guessing.",
  "Between modules: Breathe. Stay confident.",
  "Scores matter: Colleges see your Math and RW scores. Every point counts.",
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "math",
  moduleNum: 9,
  title: "Full Practice Test & Error Analysis",
  subtitle:
    "Complete math section with deep review",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "checklist-pre", label: "Pre-Test Checklist", icon: "clipboard" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-ec", label: "Error Classification", icon: "zap" },
    { id: "checklist-td", label: "Test Day Checklist", icon: "clipboard" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "error-analysis", label: "Error Analysis", icon: "clipboard" },
    { id: "growth-tracker", label: "Growth Tracker", icon: "chart" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],
  warmup: [
    {
      source: "Module 8 — Decision Tree",
      stem: "The 5-Second Decision Tree: what is the FIRST question to ask yourself for every problem?",
      choices: [
        '"How much time do I have left?"',
        '"Is this algebra or geometry?"',
        '"Do I know how to start?"',
        '"Should I plug in numbers?"'
      ],
      correct: 2,
      explanation:
        'The decision tree starts with "Do I know how to start?" If yes, solve directly. If not, look for a strategy (Plug In, Backsolve, Desmos). This prevents freezing on hard questions.',
    },
    {
      source: "Module 8 — Plug In Numbers",
      stem: "Variables appear in ALL four answer choices. The fastest strategy is:",
      choices: [
        "Plug In (PIYON)",
        "Solve algebraically",
        "Graph it in Desmos",
        "Estimate and eliminate"
      ],
      correct: 0,
      explanation:
        "Variables in all choices = classic Plug In signal. Pick a number, substitute into the problem AND each answer choice. One will match.",
    },
    {
      source: "Module 8 — Pacing",
      stem: "If you have 35 minutes for 22 questions, roughly how much time per question?",
      choices: [
        "About 2.5 minutes",
        "About 1 minute",
        "About 2 minutes",
        "About 1.5 minutes"
      ],
      correct: 3,
      explanation:
        "35 min / 22 questions ≈ 1.6 minutes per question. Budget about 1.5 minutes each, saving a few minutes for review and flagged questions.",
    },
    {
      source: "Module 8 — Grid-In Rules",
      stem: "Grid-in answers must be between ___?",
      choices: [
        "1 and 999",
        "0 and 9999 (no negative answers)",
        "-9999 and 9999",
        "-999 and 999"
      ],
      correct: 1,
      explanation:
        "Student-produced responses on the digital SAT accept values from 0 to 9999. There are no negative answers in the grid-in format.",
    },
    {
      source: "Module 8 — Common Traps",
      stem: "You solved for x correctly, but the question asked for 2x. This error type is:",
      choices: [
        "Careless/Arithmetic",
        "Strategy Gap",
        "Wrong Target / Misread",
        "Concept Gap"
      ],
      correct: 2,
      explanation:
        'Classic "Wrong Target" trap — you solved the math correctly but answered the wrong question. Always re-read what they are actually asking for before selecting your answer.',
    },
  ],
  lessons: [
    {
      id: "test-overview",
      title: "Practice Test Overview",
      subtitle: "Full 44-question SAT Math simulation",
      visual: "test-overview",
      body: [
        "This module is a capstone: take a full 44-question practice test under timed conditions, analyze your mistakes, and project your score.",
        "Module 1: Questions 1-22 (35 minutes). Module 2: Questions 23-44 (35 minutes). Total: ~90 minutes including analysis.",
        "Use Desmos at desmos.com/calculator in another tab to simulate the real test experience.",
        "Before starting: Find a quiet space. Set a timer. Have scratch paper ready. No phone. Simulate real test conditions as closely as possible.",
      ],
    },
    {
      id: "pre-test-checklist",
      title: "Pre-Test Checklist",
      subtitle: "Set yourself up for accurate results",
      body: [
        "Find a quiet space with no distractions — this simulates real test conditions.",
        "Open Desmos (desmos.com/calculator) in another browser tab — this is your calculator.",
        "Have scratch paper and pencil ready for working out problems.",
        "Set a timer for 35 minutes for each module. Take a 5-minute break between modules.",
        "Do NOT use your phone, notes, or any other resources during the test.",
      ],
    },
    {
      id: "error-analysis",
      title: "Error Analysis Framework",
      subtitle: "The highest-leverage activity after any practice test",
      visual: "error-analysis",
      body: [
        "For every question you missed, classify the error into one of four categories:",
        "Content Gap: You didn't know the concept or formula. Fix: Review the relevant module.",
        "Careless/Arithmetic: You knew the concept but made a computation error. Fix: Slow down, double-check calculations.",
        "Misread the Question: You solved correctly but answered the wrong thing (e.g., found x when they asked for 2x). Fix: Underline what the question asks for.",
        "Strategy Error: You used an inefficient approach and ran out of time. Fix: Practice the 5-Second Decision Tree.",
        "Error analysis reveals WHERE to focus study time. Most students find that 30-40% of their errors are preventable misreads, not knowledge gaps.",
      ],
    },
    {
      id: "score-projection",
      title: "SAT Score Projection",
      subtitle: "Estimate your scaled score",
      visual: "score-projection",
      body: [
        "Each SAT section (Math and Reading/Writing) is scored on a 200-800 scale. The total score is 400-1600.",
        "Raw score (number correct out of 44) converts to a scaled score. The exact conversion varies by test form.",
        "Approximate conversion: 40-44 correct → 750-800. 35-39 → 650-750. 30-34 → 570-650. 25-29 → 500-570. Below 25 → below 500.",
        "Module 2 difficulty matters: if you got the harder Module 2, your ceiling is higher. If you got the easier Module 2, your ceiling is approximately 560-630.",
      ],
    },
    {
      id: "formula-reference",
      title: "Must-Memorize Formula Card",
      subtitle: "These appear constantly on the SAT",
      visual: "formula-reference",
      body: [
        "Algebra: Slope $m = (y_2-y_1)/(x_2-x_1)$. Slope-intercept: $y = mx + b$. Quadratic formula: $x = (-b \\pm \\sqrt{b^2-4ac})/2a$.",
        "Advanced Math: Vertex $x = -b/2a$. Discriminant: $b^2-4ac$ (>0: 2 solutions, =0: 1, <0: 0). Difference of squares: $a^2-b^2=(a+b)(a-b)$.",
        "Problem-Solving & Data: Percent change = (new-old)/old × 100. Mean = sum/count. Growth: $f(x) = a(1+r)^x$. Decay: $f(x) = a(1-r)^x$.",
        "Geometry & Trig: Circle: $(x-h)^2+(y-k)^2=r^2$. 30-60-90: $x, x\\sqrt{3}, 2x$. 45-45-90: $x, x, x\\sqrt{2}$. SOH CAH TOA. $\\sin^2\\theta + \\cos^2\\theta = 1$.",
      ],
    },
    {
      id: "next-steps",
      title: "After the Practice Test",
      subtitle: "Your priority action plan",
      visual: "next-steps",
      body: [
        "Step 1: Score your test and calculate your raw score out of 44.",
        "Step 2: Classify every error using the four-category framework (Content Gap, Careless, Misread, Strategy).",
        "Step 3: Identify your weakest domain — revisit that module for targeted review.",
        "Step 4: Compare to your diagnostic score to measure growth. Any improvement shows your study is working.",
        "Step 5: Move to Module 10 for final review and test-day preparation.",
      ],
    },
  ],
  quiz: [
    {
      stem: "If $3(2x - 4) = 18$, what is $x$?",
      choices: ["3", "5", "4", "6"],
      correct: 1,
      explanation: "$6x-12=18$. $6x=30$. $x=5$.",
      difficulty: "easy",
      type: "Algebra",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "The mean of 5 numbers is 24. If four are 20, 22, 26, 28, what is the fifth?",
      choices: ["20", "22", "26", "24"],
      correct: 3,
      explanation: "Sum must be 120. 20+22+26+28=96. Fifth=24.",
      difficulty: "easy",
      type: "PSDA",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "In a 30-60-90 triangle, the hypotenuse is 16. What is the shorter leg?",
      choices: ["8", "4", "$8\\sqrt{2}$", "$8\\sqrt{3}$"],
      correct: 0,
      explanation: "Short leg = hyp/2 = 16/2 = 8.",
      difficulty: "easy",
      type: "Geometry",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Line passes through $(-1, 3)$ and $(3, 11)$. What is the equation in slope-intercept form?",
      choices: [
        "$y = 2x + 3$",
        "$y = 2x + 5$",
        "$y = 4x + 7$",
        "$y = -2x + 1$"
      ],
      correct: 1,
      explanation:
        "$m=(11-3)/(3-(-1))=8/4=2$. $b: 3=2(-1)+b → b=5$. $y=2x+5$.",
      difficulty: "easy",
      type: "Algebra",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Simplify: $(x^3 y^2)/(x^1 y^4)$",
      choices: ["$x^2 y^2$", "$xy^2$", "$x^4 y^6$", "$x^2/y^2$"],
      correct: 3,
      explanation: "$x^{3-1}/y^{4-2} = x^2/y^2$.",
      difficulty: "medium",
      type: "Advanced Math",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A population of 2000 decreases by 5% per year. Which models this?",
      choices: [
        "$2000(0.95)^t$",
        "$2000(1.05)^t$",
        "$2000(0.05)^t$",
        "$2000 - 0.05t$"
      ],
      correct: 0,
      explanation: "Decay: multiply by $(1-0.05)=0.95$ each year.",
      difficulty: "medium",
      type: "Advanced Math",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "The system $y = 3x - 1$ and $y = kx - 1$ has infinitely many solutions when $k = ?$",
      choices: ["3", "1", "-3", "-1"],
      correct: 0,
      explanation: "Same line → same slope AND intercept. $k=3$.",
      difficulty: "medium",
      type: "Algebra",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A circle has equation $x^2 + y^2 - 6x + 4y - 12 = 0$. What is the radius?",
      choices: ["3", "12", "5", "25"],
      correct: 2,
      explanation:
        "Complete the square: $(x-3)^2+(y+2)^2=25$. $r=\\sqrt{25}=5$.",
      difficulty: "medium",
      type: "Geometry",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Factor completely: $3x^2 - 12x - 15$",
      choices: [
        "$3(x-5)(x+1)$",
        "$3(x+5)(x-1)$",
        "$(3x-15)(x+1)$",
        "$(3x-5)(x+3)$"
      ],
      correct: 0,
      explanation:
        "Factor out 3: $3(x^2-4x-5) = 3(x-5)(x+1)$.",
      difficulty: "hard",
      type: "Advanced Math",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If $f(x) = 2x^2 - 8x + 6$, what is the minimum value of $f$?",
      choices: ["2", "-2", "0", "6"],
      correct: 1,
      explanation:
        "Vertex: $x=8/4=2$. $f(2)=8-16+6=-2$. Minimum is $-2$.",
      difficulty: "hard",
      type: "Advanced Math",
      domain: "Algebra",
      skill: "linear_equations",
    },
  ],
  takeaways: [
    "Error analysis shows exactly where to focus your remaining study time.",
    "Your domain breakdown reveals which modules to revisit before test day.",
    "Use the two-pass system on every module \u2014 accuracy in Module 1 determines your ceiling.",
    "Desmos is your competitive advantage \u2014 use aggressively for systems, quadratics, and verification.",
    "No penalty for wrong answers \u2014 answer every single question, never leave blanks.",
    "Trust your preparation, execute your strategies, and stay confident.",
  ],
};
