"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import {
  SkillsTableVisual,
  ShortcutsVisual,
  DoDontVisual,
  WorkedExamplesVisual,
  DesmosTrapVisual,
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
    "explanation": "Click + → Table, enter data, then type y₁ ~ mx₁ + b. Desmos returns slope and y-intercept."
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
    "prompt": "Graph the solution region for <code>y < 3x − 1</code> AND <code>y ≥ −x + 4</code>.",
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
    "explanation": "Type mean(12,15,18,22,95) and median(12,15,18,22,95). Instant results."
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

export default function NMSQTMathModule6() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "skills-table": <SkillsTableVisual />,
        "shortcuts": <ShortcutsVisual />,
        "do-dont": <DoDontVisual />,
        "worked-examples": <WorkedExamplesVisual />,
        "desmos-traps": <DesmosTrapVisual />,
      }}
      activities={{
        "exercise-skill-qs": (goNext: () => void) => (
          <MatchingExercise
            items={SKILL_QS_EXERCISE}
            title="Skill"
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

      nextModuleHref="/courses/nmsqt-math/7"
      nextModuleLabel="Module 7: Strategy Toolkit & Time Management"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "math",
  moduleNum: 6,
  title: "Desmos Mastery",
  subtitle:
    "Desmos is available on ALL 44 questions. Fluency here is a massive competitive advantage.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-skill-qs", label: "Skill Qs", icon: "zap" },
    { id: "exercise-dd-qs", label: "Desmos or Algebra?", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "skills-table",
      title: "The 10 Essential Desmos Skills",
      subtitle: "Core Content",
      visual: "skills-table",
      body: [
        "Desmos is not just a calculator \u2014 it is a graphing, regression, and equation-solving engine built into the test. But knowing it exists is not enough. You need to be fast, deliberate, and know exactly when to use it versus when algebra is faster.",
      ],
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      subtitle: "Reference",
      visual: "shortcuts",
      body: [
        "Speed on Desmos comes from muscle memory with these shortcuts. Practice at desmos.com/practice for the exact interface you will see on test day.",
      ],
    },
    {
      id: "do-dont",
      title: "When to Use Desmos \u2014 and When Not To",
      subtitle: "Calculator Discipline",
      visual: "do-dont",
      body: [
        "The key insight: Desmos is a power tool for about one-third of questions, but a time-waster on the rest. Knowing which category a question falls into is as important as knowing how to use the tool.",
      ],
    },
    {
      id: "worked-examples",
      title: "Desmos in Action \u2014 5 Common Scenarios",
      subtitle: "Worked Examples",
      visual: "worked-examples",
      body: [
        "These step-by-step walkthroughs show exactly what to type and click. Practice each one in Desmos before moving to the exercises. Tap each card for the detailed steps.",
      ],
    },
    {
      id: "desmos-traps",
      title: "Desmos Trap Taxonomy",
      subtitle: "Common Mistakes",
      visual: "desmos-traps",
      body: [
        "Even experienced Desmos users fall into these traps under time pressure. Knowing them in advance is the best defense.",
      ],
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 5 — Special Triangles",
      stem: "In a 30-60-90 triangle, the side opposite the 30° angle is 5. What is the hypotenuse?",
      choices: ["5√2", "5√3", "15", "10"],
      correct: 3,
      explanation: "Ratio 1:√3:2. Short leg = 5, hypotenuse = 5 × 2 = 10. The hypotenuse is always double the short leg in a 30-60-90.",
    },
    {
      source: "Module 5 — Circles",
      stem: "The equation (x+2)² + (y−3)² = 16 represents a circle. What is the center?",
      choices: ["(2, −3)", "(−2, −3)", "(−2, 3)", "(2, 3)"],
      correct: 2,
      explanation: "Standard form: (x−h)²+(y−k)²=r². Here h=−2, k=3. Center is (−2, 3). The signs flip inside the parentheses!",
    },
    {
      source: "Module 5 — Volume",
      stem: "A cone has the same base and height as a cylinder with volume 60π. What is the cone's volume?",
      choices: ["30π", "20π", "60π", "180π"],
      correct: 1,
      explanation: "Cone volume = ⅓ × cylinder volume = ⅓ × 60π = 20π. Cones are always one-third of their corresponding cylinder.",
    },
    {
      source: "Module 5 — Trigonometry",
      stem: "What is sin(30°)?",
      choices: ["√2/2", "√3/2", "1", "½"],
      correct: 3,
      explanation: "sin(30°) = ½. From the 30-60-90 triangle: opposite/hypotenuse = 1/2. This is a must-memorize value.",
    },
    {
      source: "Module 5 — Complementary Angles",
      stem: "If sin(x) = cos(55°), what is x?",
      choices: ["125°", "55°", "45°", "35°"],
      correct: 3,
      explanation: "sin(x) = cos(90°−x). So if sin(x) = cos(55°), then x = 90° − 55° = 35°. Complementary angles!",
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
      explanation: "<strong>Desmos:</strong> Graph y = 2x² − 4x + 5. Parabola stays above x-axis → 0 solutions. <strong>Algebra:</strong> Disc = 16 − 40 = −24 < 0.",
      trap: "mental_math",
      trapAnswer: 2,
      trapDesc: "Assumed 2 solutions without checking — Mental Math Trap",
    },
    {
      stem: "The data points (1,3), (2,5), (3,8), (4,10), (5,13) are best modeled by:",
      choices: ["y = x² + 2", "y = 3x − 1", "y = 2x + 1", "y = 2.5x + 0.5"],
      correct: 3,
      explanation: "<strong>Desmos:</strong> Enter as table, run y₁ ~ mx₁ + b → m ≈ 2.5, b ≈ 0.5. Always use regression for best-fit.",
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
      stem: "If <code>f(x) = x³ − 6x² + 11x − 6</code>, how many positive x-intercepts?",
      choices: ["3", "2", "0", "1"],
      correct: 0,
      explanation: "<strong>Desmos:</strong> Graph it. Three crossings at x=1, 2, 3. All positive. <strong>Algebra:</strong> Factor (x−1)(x−2)(x−3)=0.",
      trap: "intersection_misread",
      trapAnswer: 1,
      trapDesc: "Only zoomed in enough to see one crossing — Intersection Misread",
    },
    {
      stem: "Where does <code>y = |x − 4| + 1</code> intersect <code>y = 5</code>?",
      choices: ["x = 0 only", "x = 0 and x = 8", "x = −1 and x = 9", "x = 4 only"],
      correct: 1,
      explanation: "<strong>Desmos:</strong> Graph both, click intersections. <strong>Algebra:</strong> |x−4|+1=5 → |x−4|=4 → x−4=±4 → x=0 or x=8.",
      trap: "setup_trap",
      trapAnswer: 1,
      trapDesc: "Forgot the absolute value creates two solutions — Setup Trap",
    },
  ],

  takeaways: [
    "About one-third of PSAT math can be solved or verified with Desmos. Fluency is a massive advantage.",
    "Master the 10 essential skills -- graphing, intersections, sliders, tables, regression, inequalities, stats, percentages, circles, shortcuts.",
    "Calculator discipline: use Desmos when it is faster (systems, quadratics, regression), skip when it is slower (arithmetic, conceptual).",
    "The 5-second rule: if setup takes more than 5 seconds, switch to algebra.",
    "Memorize keyboard shortcuts: ^ _ ~ | sqrt pi.",
    "Always verify your answer when time allows -- graph your equation and check it makes sense.",
  ],
};
