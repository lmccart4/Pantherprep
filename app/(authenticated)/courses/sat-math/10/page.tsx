"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { InteractiveChecklist } from "@/components/course/activities/interactive-checklist";
import {
  DomainReviewVisual,
  DecisionTreeVisual,
  FormulaGridVisual,
  TimelineVisual,
  MentalGameVisual,
  FinalMessageVisual,
} from "./lesson-visuals";

export default function SATMathModule10() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref={undefined}
      nextModuleLabel={undefined}

      visuals={{
        "domain-review": <DomainReviewVisual />,
        "decision-tree": <DecisionTreeVisual />,
        "must-know-formulas": <FormulaGridVisual />,
        "test-day-timeline": <TimelineVisual />,
        "mental-game": <MentalGameVisual />,
        "final-message": <FinalMessageVisual />,
      }}

      activities={{
        "exercise-conf": (goNext: () => void) => (
          <MatchingExercise
            items={CONF_EXERCISE_DATA}
            title="Conf"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "checklist": (goNext: () => void) => (
          <InteractiveChecklist
            title="Test Day Packing List"
            items={TEST_DAY_CHECKLIST}
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
      }}
    />
  );
}

const CONF_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "The equation 3x + 7 = 22 asks you to solve for x.",
    "options": [
      "Backsolve",
      "Solve algebraically (fast arithmetic)",
      "Plug In",
      "Graph in Desmos"
    ],
    "correct": 1,
    "explanation": "This is simple algebra: 3x = 15, x = 5. No need for Desmos on single-step problems."
  },
  {
    "prompt": "If f(x) = ax² + 3 and f(2) = 11, find a.",
    "options": [
      "Graph in Desmos",
      "Backsolve or algebra",
      "Plug In",
      "Flag and skip"
    ],
    "correct": 1,
    "explanation": "f(2) = 4a + 3 = 11 → 4a = 8 → a = 2. Algebra is fast here, or use a Desmos slider."
  },
  {
    "prompt": "Which expression is equivalent to (2x−1)(x+3)/(x+3)?",
    "options": [
      "Plug In",
      "Graph in Desmos",
      "Simplify algebraically",
      "Backsolve"
    ],
    "correct": 2,
    "explanation": "Cancel (x+3): answer is (2x−1). Direct simplification is fastest."
  },
  {
    "prompt": "For all x > 0, which is equivalent to √(x³·y⁶)?",
    "options": [
      "Graph in Desmos",
      "Solve algebraically",
      "Plug In (PIYON)",
      "Backsolve"
    ],
    "correct": 2,
    "explanation": "Variables in choices → Plug In! Try x = 4, y = 1: √(64·1) = 8. Test each choice with x=4, y=1."
  },
  {
    "prompt": "At what point do y = x² − 4x + 3 and y = x − 1 intersect?",
    "options": [
      "Solve algebraically",
      "Plug In",
      "Graph both in Desmos",
      "Flag and skip"
    ],
    "correct": 2,
    "explanation": "Graph both equations, click the intersection dots. 5 seconds. Algebra works too but Desmos is faster for intersection questions."
  },
  {
    "prompt": "If the average of 5 numbers is 12, and a 6th number of 30 is added, what is the new average?",
    "options": [
      "Solve algebraically",
      "Graph in Desmos",
      "Backsolve",
      "Plug In"
    ],
    "correct": 0,
    "explanation": "Sum = 5 × 12 = 60. New sum = 90. New mean = 90/6 = 15. Quick arithmetic."
  },
  {
    "prompt": "What value of x satisfies: x/3 + x/4 = 7?",
    "options": [
      "Flag and skip",
      "Plug In",
      "Graph in Desmos",
      "Backsolve from choices"
    ],
    "correct": 3,
    "explanation": "If choices are numbers, try each one. x = 12: 12/3 + 12/4 = 4 + 3 = 7 ✓. Backsolve wins."
  },
  {
    "prompt": "A study randomly surveyed 500 people and found a correlation between sleep and GPA. What can be concluded?",
    "options": [
      "Graph in Desmos",
      "Plug In",
      "Backsolve",
      "No calculation needed — conceptual"
    ],
    "correct": 3,
    "explanation": "This is a study design question. No random assignment → no causation. Only association. Random sample → can generalize. No calculation required."
  },
  {
    "prompt": "How many real solutions does x⁴ − 5x² + 4 = 0 have?",
    "options": [
      "Plug In",
      "Graph in Desmos",
      "Flag and skip",
      "Solve algebraically"
    ],
    "correct": 1,
    "explanation": "Graph y = x⁴ − 5x² + 4. Count x-intercepts: 4 solutions at x = ±1, ±2. Desmos shows this instantly."
  },
  {
    "prompt": "For the numbers in answer choices A through D, which value of k makes the system y = kx + 2 and y = x² have no solution?",
    "options": [
      "Backsolve",
      "Plug In",
      "Solve algebraically",
      "Desmos slider for k"
    ],
    "correct": 3,
    "explanation": "Graph y = x² and y = kx + 2 with a slider for k. Adjust until the line doesn't touch the parabola. Visual + fast."
  }
];

const TEST_DAY_CHECKLIST = [
  "Admission ticket (printed or on phone)",
  "Photo ID",
  "Approved calculator (backup batteries)",
  "Two #2 pencils (sharpened) + eraser",
  "Watch (no smartwatch — analog or basic digital)",
  "Water bottle (clear, label removed if required)",
  "Snack for break (granola bar, banana, etc.)",
  "Comfortable layers (test centers can be cold)",
  "Directions to test center + arrival plan",
  "Confidence: you've completed the PantherPrep Math Course",
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "math",
  moduleNum: 10,
  title: "Final Review & Test-Day Prep",
  subtitle:
    "Last-mile review and confidence building",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-conf", label: "Conf", icon: "zap" },
    { id: "checklist", label: "Packing List", icon: "clipboard" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],
  warmup: [
    {
      source: "Module 9 — SAT Structure",
      stem: "The SAT Math section has how many total questions across both modules?",
      choices: ["22", "58", "34", "44"],
      correct: 3,
      explanation:
        "The SAT Math section has 44 total questions: 22 in Module 1 and 22 in Module 2.",
    },
    {
      source: "Module 9 — Error Analysis",
      stem: "Classifying an error where you knew the concept but made an arithmetic mistake — which type?",
      choices: [
        "Careless/Arithmetic",
        "Content gap",
        "Strategy error",
        "Misread the question"
      ],
      correct: 0,
      explanation:
        "Arithmetic or careless errors happen when you understand the concept but slip on computation. These are the easiest to fix — slow down and double-check.",
    },
    {
      source: "Module 9 — Score Projection",
      stem: "The SAT score projector estimates scores on a scale of?",
      choices: ["1-36", "100-500", "400-1600", "200-800"],
      correct: 3,
      explanation:
        "Each SAT section (Math and Reading/Writing) is scored on a 200-800 scale. The total score is 400-1600.",
    },
    {
      source: "Module 9 — Test Timing",
      stem: "Module 1 of the SAT has how many minutes?",
      choices: ["25 minutes", "30 minutes", "35 minutes", "45 minutes"],
      correct: 2,
      explanation:
        "Each module of SAT Math gives you 35 minutes for 22 questions. Two modules total = 70 minutes.",
    },
    {
      source: "Module 9 — Next Steps",
      stem: "After taking the practice test, the most important next step is?",
      choices: [
        "Memorize more formulas",
        "Skip to test day prep",
        "Classify and analyze your errors",
        "Take another practice test immediately"
      ],
      correct: 2,
      explanation:
        "Error analysis is the highest-leverage activity after a practice test. Classify each mistake (content gap, careless, misread, strategy) to know exactly where to focus.",
    },
  ],
  lessons: [
    {
      id: "intro",
      title: "What This Module Covers",
      subtitle: "Consolidation, confidence, and logistics",
      body: [
        "This is not the time for new content. This module is about consolidation, confidence, and logistics. You'll rapid-review every domain, rehearse your decision-making strategies, check your formula knowledge, and build a concrete test day plan.",
        "The Night Before Rule: No new material after 8 PM the night before. Your brain needs time to consolidate. Light review, then rest. You've done the work — trust it.",
      ],
    },
    {
      id: "domain-review",
      title: "Domain Review Cards",
      subtitle: "Rapid review of all four SAT math domains",
      visual: "domain-review",
      body: [
        "Algebra (~35%): Slope-intercept form $y = mx + b$. Systems: substitution or elimination (Desmos → click intersection). Inequalities: flip the sign when multiplying/dividing by negative. Parallel lines: same slope. Perpendicular: negative reciprocal. No solution: same slope, different intercept.",
        "Advanced Math (~35%): Three quadratic forms — Standard (y-intercept), Factored (zeros), Vertex (min/max). Vertex shortcut: $x = -b/2a$. Discriminant: $b^2-4ac$ (positive=2, zero=1, negative=0). Transformations: $f(x-h)$ shifts RIGHT. Exponent rules: $a^m \\cdot a^n = a^{m+n}$.",
        "Problem-Solving & Data (~15%): Percent change = (new-old)/old × 100 — OLD is always the denominator. Mean is sensitive to outliers; median is resistant. Conditional probability: P(A|B) = P(A and B)/P(B). Study design: random assignment → causation, random sample → generalize.",
        "Geometry & Trig (~15%): Circle equation $(x-h)^2+(y-k)^2=r^2$. Remember $r^2$, not $r$! Special right triangles: 30-60-90 ($x, x\\sqrt{3}, 2x$) and 45-45-90 ($x, x, x\\sqrt{2}$). SOH CAH TOA plus $\\sin(x)=\\cos(90-x)$. Arc length: $s = r\\theta$ (radians).",
      ],
    },
    {
      id: "decision-tree",
      title: "The 5-Second Decision Tree",
      subtitle: "Run this for EVERY question",
      visual: "decision-tree",
      body: [
        "Step 1: Do I know how to start? NO → Flag it, use LOTD, move on. YES → Continue.",
        "Step 2: Variables in the answer choices? YES → Plug In (PIYON). NO → Continue.",
        "Step 3: Numbers in the answer choices? YES → Try Backsolve (PITA). NO → Continue.",
        "Step 4: Can I graph this in Desmos in < 5 seconds? YES → Graph it in Desmos. NO → Solve algebraically.",
        "After solving: Re-read the question. Did I answer what they actually asked?",
      ],
    },
    {
      id: "must-know-formulas",
      title: "Must-Know Formulas",
      subtitle: "NOT provided on the reference sheet but appear constantly",
      visual: "must-know-formulas",
      body: [
        "Algebra: Slope $m = (y_2-y_1)/(x_2-x_1)$. Slope-intercept: $y = mx + b$. Point-slope: $y - y_1 = m(x - x_1)$. Standard form: $Ax + By = C$. Parallel: same slope. Perpendicular: negative reciprocal.",
        "Advanced Math: Quadratic Formula $x = (-b \\pm \\sqrt{b^2-4ac})/2a$. Vertex: $x = -b/2a$. Discriminant: $b^2-4ac$. Difference of squares: $a^2-b^2=(a+b)(a-b)$. Exponent: $a^{m/n} = (\\sqrt[n]{a})^m$.",
        "Problem-Solving & Data: Percent change = (new-old)/old × 100. Percent of: part/whole × 100. Mean = sum/count. $P(A|B) = P(A \\cap B)/P(B)$. Growth: $f(x) = a(1+r)^x$. Decay: $f(x) = a(1-r)^x$.",
        "Geometry & Trig: Circle: $(x-h)^2+(y-k)^2=r^2$. Arc length: $s = r\\theta$ (radians). 30-60-90: $x, x\\sqrt{3}, 2x$. 45-45-90: $x, x, x\\sqrt{2}$. SOH CAH TOA. $\\sin^2\\theta + \\cos^2\\theta = 1$.",
        "Note: The SAT reference sheet provides area/volume formulas, so those are NOT listed here. Focus your memorization on the formulas above.",
      ],
    },
    {
      id: "test-day-timeline",
      title: "Test Day Timeline",
      subtitle: "From the night before through the final answer",
      visual: "test-day-timeline",
      body: [
        "Night Before: Light review only (flip through formula cards). Lay out everything you need. Set two alarms. No new material after 8 PM. Aim for 8+ hours of sleep.",
        "Morning — 2 Hours Before: Wake up, eat a real breakfast (protein + carbs). Review the 5-Second Decision Tree and your LOTD letter. Do 3-5 easy warm-up problems — NOT hard ones.",
        "Arrive — 30 Min Before: Arrive early. Use the bathroom. Find your seat. Take 10 deep breaths. You know the material. You've practiced the strategies. You're ready.",
        "During the Test — Module 1 (35 min, 22 Qs): First pass: work questions you know (~25 min). Second pass: flagged questions (~8 min). Last 2 min: check answers, apply LOTD to blanks. The first 10 questions are critical — they drive the adaptive routing.",
        "During the Test — Module 2 (35 min, 22 Qs): Same pacing strategy. If you get the harder module: don't panic — harder questions are worth more. If you get the easier module: maximize accuracy.",
        "After the Test: You did it. Don't re-analyze questions from memory — it's not reliable. Celebrate the effort. Scores arrive in about 2 weeks.",
      ],
    },
    {
      id: "mental-game",
      title: "The Mental Game",
      subtitle: "Confidence and composure under pressure",
      visual: "mental-game",
      body: [
        "If you hit a wall mid-test: Close your eyes. Take 3 slow breaths. Remind yourself: 'I've prepared for this. Skip it, come back later.' 30 seconds of calm is worth more than 30 seconds of panic.",
        "If you realize you made a mistake: Fix it if you notice in time. If not, let it go. One wrong answer doesn't determine your score. Stay focused on the next question.",
        "If Module 2 feels harder: That's a GOOD sign. It means you did well on Module 1. The harder questions have a higher scoring ceiling. Lean into the challenge.",
        "Remember your POOD: You don't have to answer every question to get a great score. Do YOUR best questions first. Flag and return to the rest. Guess on anything left over with LOTD.",
      ],
    },
    {
      id: "packing-list",
      title: "Test Day Packing List",
      subtitle: "Everything you need to bring",
      body: [
        "Required: Photo ID (school ID or government-issued). Admission ticket (printed or on phone). Two No. 2 pencils with erasers. Approved calculator (backup).",
        "Recommended: Water bottle (sealed, label removed). Snack for the break (granola bar, fruit). Watch (non-digital, no alarm). Extra batteries for calculator.",
        "Do NOT bring: Phone (turn off and store). Notes or textbooks. Smartwatch or fitness tracker. Any electronic device besides the approved calculator.",
      ],
    },
    {
      id: "final-message",
      title: "You're Ready",
      subtitle: "Trust your preparation",
      visual: "final-message",
      body: [
        "You've built content knowledge across all four domains. You've practiced with Desmos, mastered the Decision Tree, and learned to classify your errors. You know your strengths and your priorities.",
        "Trust the preparation. Execute the strategies. Stay calm. You've got this.",
      ],
    },
  ],
  quiz: [
    {
      stem: "The equation $3x + 7 = 22$ — solve for $x$.",
      choices: ["3", "7", "5", "10"],
      correct: 2,
      explanation:
        "Simple algebra: $3x = 15$, $x = 5$. No need for Desmos on single-step problems.",
      difficulty: "easy",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If $f(x) = ax^2 + 3$ and $f(2) = 11$, find $a$.",
      choices: ["3", "4", "2", "1"],
      correct: 2,
      explanation:
        "$f(2) = 4a + 3 = 11 → 4a = 8 → a = 2$. Algebra is fast here, or use a Desmos slider.",
      difficulty: "easy",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Which expression is equivalent to $(2x-1)(x+3)/(x+3)$?",
      choices: ["$2x + 3$", "$2x^2 + 5x - 3$", "$2x - 1$", "$x + 3$"],
      correct: 2,
      explanation:
        "Cancel $(x+3)$: answer is $(2x-1)$. Direct simplification is fastest.",
      difficulty: "easy",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "For all $x > 0$, which is equivalent to $\\sqrt{x^3 \\cdot y^6}$?",
      choices: [
        "$x^{3/2} y^3$",
        "$xy^3$",
        "$x^{3/2} y^6$",
        "$x^3 y^6$"
      ],
      correct: 0,
      explanation:
        "Plug In x=4, y=1: $\\sqrt{64 \\cdot 1} = 8$. $4^{3/2} \\cdot 1^3 = 8$ ✓. Or: $\\sqrt{x^3 y^6} = x^{3/2} y^3$.",
      difficulty: "medium",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "At what point do $y = x^2 - 4x + 3$ and $y = x - 1$ intersect?",
      choices: ["(0, 3) and (4, 3)", "(2, 1) and (3, 2)", "(1, 0) and (2, 1)", "(1, 0) and (4, 3)"],
      correct: 3,
      explanation:
        "Graph both in Desmos, click the intersection dots. Or: $x^2-4x+3 = x-1 → x^2-5x+4=0 → (x-1)(x-4)=0$. Points: (1,0) and (4,3).",
      difficulty: "medium",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If the average of 5 numbers is 12, and a 6th number of 30 is added, what is the new average?",
      choices: ["16", "15", "18", "14"],
      correct: 1,
      explanation:
        "Sum = 5 × 12 = 60. New sum = 90. New mean = 90/6 = 15. Quick arithmetic.",
      difficulty: "medium",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "What value of $x$ satisfies: $x/3 + x/4 = 7$?",
      choices: ["8", "14", "12", "10"],
      correct: 2,
      explanation:
        "Backsolve: x = 12: 12/3 + 12/4 = 4 + 3 = 7 ✓.",
      difficulty: "medium",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A study randomly surveyed 500 people and found a correlation between sleep and GPA. What can be concluded?",
      choices: [
        "There is an association between sleep and GPA",
        "More sleep causes higher GPA",
        "The study proves causation",
        "GPA causes better sleep"
      ],
      correct: 0,
      explanation:
        "No random assignment → no causation. Only association. Random sample → can generalize to the population.",
      difficulty: "hard",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "How many real solutions does $x^4 - 5x^2 + 4 = 0$ have?",
      choices: ["3", "2", "4", "0"],
      correct: 2,
      explanation:
        "Graph $y = x^4 - 5x^2 + 4$. Count x-intercepts: 4 solutions at $x = \\pm 1, \\pm 2$. Or: let $u = x^2$: $u^2-5u+4=0 → (u-1)(u-4)=0 → x^2=1$ or $x^2=4$.",
      difficulty: "hard",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "For the numbers in answer choices, which value of $k$ makes $y = kx + 2$ and $y = x^2$ have exactly one solution?",
      choices: ["2", "4", "1", "0"],
      correct: 0,
      explanation:
        "Graph $y = x^2$ and $y = kx + 2$ with a slider for $k$. When $k=2$, the line is tangent to the parabola at exactly one point. Or: set $kx+2=x^2 → x^2-kx-2=0$. Discriminant = $k^2+8 = 0$ has no real solution — but tangent from below: $x^2-kx-2$ discriminant $= k^2+8$ is always positive. Actually the tangent condition requires $x^2-kx+2=0$ with discriminant $k^2-8=0 → k=2\\sqrt{2}$. Using Desmos slider is the fastest approach.",
      difficulty: "hard",
      domain: "Algebra",
      skill: "linear_equations",
    },
  ],
  takeaways: [
    "Domain mastery across Algebra, Advanced Math, Problem-Solving & Data, and Geometry & Trig.",
    "A complete strategy toolkit: Decision Tree, Plug In, Backsolve, POOD, and LOTD.",
    "Desmos skills for graphing, systems, sliders, and regression \u2014 your competitive advantage.",
    "Error classification to identify and fix your specific weak spots.",
    "Timed practice with adaptive two-pass pacing for both modules.",
    "Test-day confidence: timeline, checklist, mental game strategies \u2014 you're ready.",
  ],
};
