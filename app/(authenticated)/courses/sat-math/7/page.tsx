"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import {
  DesmosSkillsVisual,
  ShortcutsVisual,
  DoDontVisual,
  DesmosTrapsVisual,
  FiveSecondRuleVisual,
} from "./lesson-visuals";

const SKILL_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Find the solutions of <code>2x² − 5x − 3 = 0</code>.",
    "options": [
      "Run a regression",
      "Use a slider",
      "Calculate statistics",
      "Graph the function"
    ],
    "correct": 3,
    "explanation": "Graph y = 2x² − 5x − 3 and click the x-intercepts. Desmos gives exact solutions."
  },
  {
    "prompt": "A data table shows 8 points. Find the best-fit line equation.",
    "options": [
      "Graph an inequality",
      "Graph the function",
      "Enter table + regression",
      "Use a slider"
    ],
    "correct": 2,
    "explanation": "Click + → Table, enter data, then type y₁ ~ mx₁ + b. Or use Autoregression for auto-fit."
  },
  {
    "prompt": "For what value of k does <code>kx + 2 = x²</code> have exactly one solution?",
    "options": [
      "Graph the function",
      "Calculate statistics",
      "Run a regression",
      "Use a slider"
    ],
    "correct": 3,
    "explanation": "Graph y = x² and y = kx + 2 with a slider for k. Adjust until the line is tangent to the parabola."
  },
  {
    "prompt": "Graph the solution region for <code>y &lt; 3x − 1</code> AND <code>y ≥ −x + 4</code>.",
    "options": [
      "Run a regression",
      "Use a slider",
      "Find intersections",
      "Graph inequalities"
    ],
    "correct": 3,
    "explanation": "Type both inequalities. Desmos shades each region. The overlap is the solution."
  },
  {
    "prompt": "Find the center and radius of <code>(x + 3)² + (y − 1)² = 36</code>.",
    "options": [
      "Calculate statistics",
      "Graph the circle",
      "Use a slider",
      "Run a regression"
    ],
    "correct": 1,
    "explanation": "Type the equation directly. Desmos draws the circle. Center (−3, 1), radius 6."
  },
  {
    "prompt": "Where do <code>y = 2x + 1</code> and <code>y = x² − 3</code> intersect?",
    "options": [
      "Find intersections",
      "Graph inequalities",
      "Use a slider",
      "Calculate statistics"
    ],
    "correct": 0,
    "explanation": "Graph both equations. Click the intersection dots for exact coordinates."
  },
  {
    "prompt": "Find the mean and median of: 12, 15, 18, 22, 95.",
    "options": [
      "Find intersections",
      "Enter table + regression",
      "Calculate statistics",
      "Graph the function"
    ],
    "correct": 2,
    "explanation": "Type mean(12,15,18,22,95) and median(12,15,18,22,95). Or define L=[12,15,18,22,95] then mean(L). Instant results."
  },
  {
    "prompt": "What is 15% of 840?",
    "options": [
      "Use the % key",
      "Run a regression",
      "Graph the function",
      "Use a slider"
    ],
    "correct": 0,
    "explanation": "Type \"15% of 840\" directly into Desmos. It computes 126 instantly."
  },
  {
    "prompt": "How many x-intercepts does <code>f(x) = x³ − 4x² + x + 6</code> have?",
    "options": [
      "Use a slider",
      "Calculate statistics",
      "Run a regression",
      "Graph the function"
    ],
    "correct": 3,
    "explanation": "Graph it and count x-axis crossings. Click each intercept for exact values."
  },
  {
    "prompt": "Verify that x = 7 is a solution to <code>3(x − 2) + 4 = 2x + 3</code>.",
    "options": [
      "Find intersections",
      "Use a slider",
      "Calculate statistics",
      "Graph the function"
    ],
    "correct": 3,
    "explanation": "Graph both sides as separate equations. Check if they intersect at x = 7."
  }
];

const DD_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "What is 8 × 7?",
    "answer": "Algebra",
    "solution": "Mental math: 56. Opening Desmos is slower."
  },
  {
    "prompt": "Find the vertex of f(x) = 3x² − 12x + 7.",
    "answer": "Desmos",
    "solution": "Graph it → Desmos labels the vertex. Faster than computing −b/2a and plugging in."
  },
  {
    "prompt": "Solve the system: y = 2x − 1, y = −x + 5.",
    "answer": "Desmos",
    "solution": "Graph both, click intersection. 3 seconds."
  },
  {
    "prompt": "What is 25% of 400?",
    "answer": "Algebra",
    "solution": "25% = ¼. 400/4 = 100. Instant mental math."
  },
  {
    "prompt": "How many solutions does x² + 4x + 5 = 0 have?",
    "answer": "Desmos",
    "solution": "Graph it. Parabola above x-axis → 0 solutions. Faster than discriminant."
  },
  {
    "prompt": "Find the best-fit line for 6 data points.",
    "answer": "Desmos",
    "solution": "Table + regression. No human can do this by hand during a test."
  },
  {
    "prompt": "Simplify 3x² + 5x − 2x² + x.",
    "answer": "Algebra",
    "solution": "Combine like terms: x² + 6x. No calculator needed."
  },
  {
    "prompt": "Where do y = |x − 3| and y = 2 intersect?",
    "answer": "Desmos",
    "solution": "Absolute value intersections are messy. Graph both and click."
  },
  {
    "prompt": "If f(x) = x + 3, find f(7).",
    "answer": "Algebra",
    "solution": "7 + 3 = 10. Don't even open the calculator."
  },
  {
    "prompt": "For what value of a does y = ax² pass through (3, 18)?",
    "answer": "Desmos",
    "solution": "Type y = ax² with slider. Adjust until curve hits (3, 18). Or algebra: 18 = 9a → a = 2."
  }
];

export default function SATMathModule7() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}

      visuals={{
        "desmos-skills": <DesmosSkillsVisual />,
        "shortcuts": <ShortcutsVisual />,
        "do-dont": <DoDontVisual />,
        "desmos-traps": <DesmosTrapsVisual />,
        "five-second-rule": <FiveSecondRuleVisual />,
      }}

      activities={{
        "exercise-skill-qs": (goNext: () => void) => (
          <MatchingExercise
            items={SKILL_QS_EXERCISE}
            title="Which Desmos Skill?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-dd-qs": (goNext: () => void) => (
          <FillInExercise
            items={DD_QS_EXERCISE}
            title="Desmos or Algebra?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/sat-math/8"
      nextModuleLabel="Module 8: Strategy & Time Management &#8212; SAT Math &#8212; PantherPrep"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "math",
  moduleNum: 7,
  title: "Desmos Mastery",
  subtitle:
    "~1/3 of SAT math questions can be solved or verified with Desmos. This is not optional.",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-skill-qs", label: "Which Desmos Skill?", icon: "zap" },
    { id: "exercise-dd-qs", label: "Desmos or Algebra?", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 6 — Special Triangles",
      stem: "In a 30-60-90 triangle, what is the ratio of sides?",
      choices: ["1 : 1 : √2", "1 : √3 : 2", "√3 : √3 : 2", "1 : √2 : 2"],
      correct: 1,
      explanation: "The 30-60-90 ratio is always 1 : √3 : 2. The short leg is opposite 30°, the long leg opposite 60° (×√3), and the hypotenuse is double the short leg.",
    },
    {
      source: "Module 6 — Circles",
      stem: "The equation (x−3)² + (y+1)² = 25 has center at?",
      choices: ["(3, 1)", "(−3, 1)", "(3, −1)", "(−3, −1)"],
      correct: 2,
      explanation: "Standard form: (x−h)² + (y−k)² = r². Here h=3, k=−1. Center is (3, −1). The signs flip inside the parentheses!",
    },
    {
      source: "Module 6 — Volume",
      stem: "Volume of a cone with radius r and height h?",
      choices: ["V = 2πr²h", "V = ½πr²h", "V = πr²h", "V = ⅓πr²h"],
      correct: 3,
      explanation: "Cone volume = ⅓πr²h. A cone is always one-third the volume of the cylinder with the same base and height.",
    },
    {
      source: "Module 6 — Trigonometry",
      stem: "sin(30°) = ?",
      choices: ["√2/2", "√3/2", "1", "½"],
      correct: 3,
      explanation: "sin(30°) = ½. From the 30-60-90 triangle: opposite/hypotenuse = 1/2. This is a must-memorize value.",
    },
    {
      source: "Module 6 — Complementary Angles",
      stem: "If two angles are complementary and one is 35°, the other is?",
      choices: ["35°", "145°", "55°", "65°"],
      correct: 2,
      explanation: "Complementary angles sum to 90°. So 90° − 35° = 55°. Don't confuse with supplementary (sum to 180°).",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "desmos-skills",
      title: "10 Essential Desmos Skills",
      subtitle: "The skills that cover ~95% of SAT Desmos usage",
      visual: "desmos-skills",
      body: [
        "Master these 10 skills and you can handle nearly every Desmos-eligible SAT question. Each skill maps to a specific question type you'll encounter on test day.",
      ],
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      subtitle: "Type faster, solve faster",
      visual: "shortcuts",
      body: [
        "Memorize these shortcuts so you never waste time hunting for symbols. Speed in Desmos comes from muscle memory, not from menus.",
      ],
    },
    {
      id: "do-dont",
      title: "When to Use Desmos vs. Algebra",
      subtitle: "Calculator discipline is a strategy",
      visual: "do-dont",
      body: [
        "Desmos is powerful but not always the fastest path. Knowing WHEN to use it is just as important as knowing HOW.",
      ],
    },
    {
      id: "desmos-traps",
      title: "Common Desmos Traps",
      subtitle: "Mistakes that cost points even when you use the right tool",
      visual: "desmos-traps",
      body: [
        "These four traps catch students who rely on Desmos without thinking critically about the output.",
      ],
    },
    {
      id: "five-second-rule",
      title: "The 5-Second Rule",
      subtitle: "Your decision threshold for Desmos vs. algebra",
      visual: "five-second-rule",
      body: [
        "If you can set up the problem in Desmos within 5 seconds, graph it. If setup takes longer, switch to algebra. This simple rule prevents wasted time.",
      ],
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "What are the solutions of <code>x² − 3x − 10 = 0</code>?",
      choices: ["x = −2 and x = 5", "x = 2 and x = 5", "x = 2 and x = −5", "x = −2 and x = −5"],
      correct: 0,
      explanation: "<strong>Desmos:</strong> Graph y = x² − 3x − 10, click x-intercepts → (−2, 0) and (5, 0). <strong>Algebra:</strong> Factor (x−5)(x+2) = 0.",
      trap: "intersection_misread",
      trapAnswer: 3,
      trapDesc: "Misread the signs of the x-intercepts — Intersection Misread",
    },
    {
      stem: "At what point do <code>y = 3x − 2</code> and <code>y = −x + 6</code> intersect?",
      choices: ["(1, 1)", "(3, 7)", "(4, 2)", "(2, 4)"],
      correct: 3,
      explanation: "<strong>Desmos:</strong> Graph both, click intersection → (2, 4). <strong>Algebra:</strong> 3x−2 = −x+6 → 4x = 8 → x=2, y=4.",
      trapAnswer: 0,
      trapDesc: "Graphing both lines finds the intersection instantly",
    },
    {
      stem: "What is the vertex of <code>f(x) = −2x² + 8x − 3</code>?",
      choices: ["(2, −3)", "(−2, −27)", "(4, −3)", "(2, 5)"],
      correct: 3,
      explanation: "<strong>Desmos:</strong> Graph it, click vertex → (2, 5). <strong>Algebra:</strong> x = −8/(2·−2) = 2, f(2) = −8+16−3 = 5.",
      trap: "setup_trap",
      trapAnswer: 3,
      trapDesc: "Tried algebra and made a sign error — Setup Trap: Desmos was faster here",
    },
    {
      stem: "How many real solutions does <code>2x² − 4x + 5 = 0</code> have?",
      choices: ["2", "0", "Cannot determine", "1"],
      correct: 1,
      explanation: "<strong>Desmos:</strong> Graph y = 2x² − 4x + 5. Parabola stays above x-axis → 0 solutions. <strong>Algebra:</strong> Discriminant = 16 − 40 = −24 < 0.",
      trap: "mental_math",
      trapAnswer: 2,
      trapDesc: "Assumed 2 solutions without checking — Mental Math Trap",
    },
    {
      stem: "The data points (1,3), (2,5), (3,8), (4,10), (5,13) are best modeled by:",
      choices: ["y = x² + 2", "y = 3x − 1", "y = 2x + 1", "y = 2.5x + 0.5"],
      correct: 3,
      explanation: "<strong>Desmos:</strong> Enter as table, run y₁ ~ mx₁ + b → m ≈ 2.5, b ≈ 0.5. Always use regression for best-fit. Or use Autoregression.",
      trap: "cas_illusion",
      trapAnswer: 0,
      trapDesc: "Tried to eyeball the slope instead of using regression — CAS Illusion",
    },
    {
      stem: "What is the center of <code>x² + y² − 6x + 4y − 12 = 0</code>?",
      choices: ["(6, −4)", "(−6, 4)", "(−3, 2)", "(3, −2)"],
      correct: 3,
      explanation: "<strong>Desmos:</strong> Type the equation, Desmos draws the circle. Click center → (3, −2). <strong>Algebra:</strong> Complete square → (x−3)²+(y+2)²=25.",
      trap: "intersection_misread",
      trapAnswer: 1,
      trapDesc: "Misread the sign from the completed square — Intersection Misread",
    },
    {
      stem: "What is <code>mean(4, 8, 15, 16, 23, 42)</code>?",
      choices: ["15.5", "14", "16", "18"],
      correct: 3,
      explanation: "<strong>Desmos:</strong> Type mean(4,8,15,16,23,42) → 18. <strong>Algebra:</strong> Sum = 108, count = 6, 108/6 = 18.",
      trap: "mental_math",
      trapAnswer: 2,
      trapDesc: "Guessed 16 (the median-ish value) without calculating — Mental Math Trap",
    },
    {
      stem: "If <code>f(x) = x³ − 6x² + 11x − 6</code>, how many positive x-intercepts?",
      choices: ["3", "2", "0", "1"],
      correct: 0,
      explanation: "<strong>Desmos:</strong> Graph it. Three crossings at x = 1, 2, 3. All positive. <strong>Algebra:</strong> Factor (x−1)(x−2)(x−3) = 0.",
      trap: "intersection_misread",
      trapAnswer: 1,
      trapDesc: "Only zoomed in enough to see one crossing — Intersection Misread",
    },
    {
      stem: "For what value of b does <code>y = 2x + b</code> pass through (3, 11)?",
      choices: ["b = 17", "b = 6", "b = −5", "b = 5"],
      correct: 3,
      explanation: "<strong>Desmos:</strong> Slider for b, or type y = 2x + b and point (3, 11). Adjust until line hits point. <strong>Algebra:</strong> 11 = 6 + b → b = 5.",
      trap: "setup_trap",
      trapAnswer: 2,
      trapDesc: "Forgot to subtract and added 2(3)+11 = 17 — Setup Trap",
    },
    {
      stem: "Data: (0,100), (1,80), (2,64), (3,51.2). Which model fits best?",
      choices: ["None of the above", "Exponential: y = 100(0.8)ˣ", "Linear: y = −16x + 100", "Quadratic: y = x² − 16x + 100"],
      correct: 1,
      explanation: "<strong>Desmos:</strong> Use Autoregression — enter table, compare R² values. Exponential decay (×0.8 each step) fits perfectly: 100 → 80 → 64 → 51.2.",
      trap: "cas_illusion",
      trapAnswer: 0,
      trapDesc: "Assumed linear because the first drop is −20 — CAS Illusion: the drop rate changes",
    },
  ],
  takeaways: [
    "~1/3 of SAT math can be solved or verified with Desmos. With CAS calculators banned, Desmos fluency is now essential.",
    "Master the 10 essential skills \u2014 graphing, intersections, sliders, tables, regression, inequalities, stats, %, circles, shortcuts.",
    "Calculator discipline: use Desmos when it's faster (systems, quadratics, regression), skip it when it's slower (arithmetic, single-step, conceptual).",
    "The 5-second rule: if setup takes more than 5 seconds, switch to algebra.",
    "Memorize keyboard shortcuts: ^ _ ~ | sqrt pi",
    "Always verify your answer when time allows \u2014 graph your equation and check it makes sense.",
  ],
};
