"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  AlgebraOverviewVisual,
  LinearEquationsVisual,
  ThreeFormsVisual,
  SystemsVisual,
  InequalitiesVisual,
  TrapTaxonomyVisual,
} from "./lesson-visuals";

const PREREQ_EXERCISE: FillInItem[] = [
  {
    "prompt": "Compute: <code>−3 × (−7)</code>",
    "answer": 21,
    "solution": "Negative × negative = positive. −3 × −7 = 21."
  },
  {
    "prompt": "Compute: <code>−8 + 15 − 3</code>",
    "answer": 4,
    "solution": "−8 + 15 = 7, then 7 − 3 = 4."
  },
  {
    "prompt": "Evaluate: <code>3 × 4² − 2 × 5</code>",
    "answer": 38,
    "solution": "4² = 16. 3×16 = 48, 2×5 = 10. 48 − 10 = 38."
  },
  {
    "prompt": "If <code>x = −2</code>, what is <code>x²</code>?",
    "answer": 4,
    "solution": "(−2)² = (−2)(−2) = 4. Squaring makes it positive."
  },
  {
    "prompt": "Solve: <code>x/4 = 3</code>",
    "answer": 12,
    "solution": "Multiply both sides by 4: x = 12."
  },
  {
    "prompt": "Compute: <code>2/3 + 1/4</code> (enter as fraction like 11/12)",
    "answer": "11/12",
    "solution": "LCD = 12. 8/12 + 3/12 = 11/12."
  }
];

const SOLV_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: <code>3x + 7 = 22</code>",
    "answer": 5,
    "solution": "3x = 15 → x = 5.",
    "tier": 1
  },
  {
    "prompt": "Solve: <code>2(x − 4) = 14</code>",
    "answer": 11,
    "solution": "2x − 8 = 14 → 2x = 22 → x = 11.",
    "tier": 1
  },
  {
    "prompt": "Solve: <code>5x − 3 = 2x + 12</code>",
    "answer": 5,
    "solution": "3x = 15 → x = 5.",
    "tier": 1
  },
  {
    "prompt": "Solve: <code>−4x + 10 = 2</code>",
    "answer": 2,
    "solution": "−4x = −8 → x = 2.",
    "tier": 1
  },
  {
    "prompt": "Solve: <code>3(2x + 1) − 4 = 5x + 6</code>",
    "answer": 7,
    "solution": "6x + 3 − 4 = 5x + 6 → x = 7.",
    "tier": 2
  },
  {
    "prompt": "If <code>2x + 8 = 20</code>, what is <code>x + 4</code>?<br><span style=\"font-size:.78rem;color:var(--psda)\">🎯 Watch out — The Wrong Target!</span>",
    "answer": 10,
    "solution": "Shortcut: divide whole equation by 2 → x + 4 = 10. Don't solve for x first!",
    "tier": 2
  }
];

const FORMS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: y = 4x − 7",
    "answer": "Slope-Intercept",
    "solution": "y = mx + b pattern."
  },
  {
    "prompt": "Solve: y − 3 = 2(x − 5)",
    "answer": "Point-Slope",
    "solution": "y − y₁ = m(x − x₁) pattern."
  },
  {
    "prompt": "Solve: 3x + 2y = 12",
    "answer": "Standard",
    "solution": "Ax + By = C pattern."
  },
  {
    "prompt": "Solve: y = −½x + 9",
    "answer": "Slope-Intercept",
    "solution": "y = mx + b. The ½ is the slope."
  },
  {
    "prompt": "Solve: x − 4y = 8",
    "answer": "Standard",
    "solution": "Ax + By = C."
  },
  {
    "prompt": "Solve: y − 1 = −3(x + 2)",
    "answer": "Point-Slope",
    "solution": "y − y₁ = m(x − x₁). Note: x + 2 = x − (−2), so the point is (−2, 1)."
  }
];

const SYS_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "System:\ny = 3x + 1\ny = −x + 5",
    "correct": "One Solution",
    "explanation": "Different slopes → one intersection."
  },
  {
    "prompt": "System:\ny = 2x + 3\ny = 2x − 1",
    "correct": "No Solution",
    "explanation": "Same slope (2), different intercepts → parallel lines."
  },
  {
    "prompt": "System:\n2x + 4y = 8\nx + 2y = 4",
    "correct": "Infinitely Many",
    "explanation": "Second equation × 2 = first. Same line."
  },
  {
    "prompt": "System:\ny = x − 2\ny = −3x + 6",
    "correct": "One Solution",
    "explanation": "Different slopes → one intersection."
  },
  {
    "prompt": "System:\n3x − y = 6\n6x − 2y = 10",
    "correct": "No Solution",
    "explanation": "First × 2 = 6x − 2y = 12 ≠ 10. Parallel."
  }
];

const INQ_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: <code>2x + 3 > 11</code>",
    "answer": "x > 4",
    "solution": "2x > 8 → x > 4.",
    "tier": 1
  },
  {
    "prompt": "Solve: <code>−x ≤ 5</code>",
    "answer": "x ≥ −5",
    "solution": "Multiply by −1 and FLIP: x ≥ −5. 🎯 <strong>Sign Flip</strong> trap!",
    "tier": 1
  },
  {
    "prompt": "Solve: <code>4x − 7 < 2x + 9</code>",
    "answer": "x < 8",
    "solution": "2x < 16 → x < 8.",
    "tier": 1
  },
  {
    "prompt": "Solve: <code>−2x + 6 ≥ 10</code>",
    "answer": "x ≤ −2",
    "solution": "−2x ≥ 4 → FLIP → x ≤ −2. 🎯 <strong>Sign Flip</strong> trap!",
    "tier": 2
  },
  {
    "prompt": "Solve: <code>5 − 3x &lt; 2x + 25</code>",
    "answer": "x > −4",
    "solution": "−5x < 20 → FLIP → x > −4.",
    "tier": 2
  }
];

const TRP_EXERCISE: MatchingItem[] = [
  {
    "prompt": "If <code>2x + 8 = 20</code>, what is <code>x + 4</code>?",
    "options": [
      "🔄 Sign Flip",
      "👻 Distribution Ghost",
      "No trap",
      "🎯 Wrong Target"
    ],
    "correct": 3,
    "explanation": "<strong>Wrong Target.</strong> You might solve for x=6 and pick 6. But question asks for x+4=10. Shortcut: divide whole equation by 2."
  },
  {
    "prompt": "Solve: <code>−3x &gt; 12</code>",
    "options": [
      "👻 Distribution Ghost",
      "🎭 Imposter Subject",
      "🔄 Sign Flip",
      "🎯 Wrong Target"
    ],
    "correct": 2,
    "explanation": "<strong>Sign Flip.</strong> Dividing by −3 requires flipping the sign. x < −4, not x > −4."
  },
  {
    "prompt": "A store sells shirts for $15 and pants for $25. A customer buys 8 items for $160. How many shirts?",
    "options": [
      "🔀 One-Case Trap",
      "🎯 Wrong Target",
      "🎭 Imposter Subject",
      "Two equations needed"
    ],
    "correct": 3,
    "explanation": "Two unknowns need two equations: s + p = 8 AND 15s + 25p = 160. Not a named trap, but a setup recognition."
  },
  {
    "prompt": "Line <code>y = 3x − 7</code> passes through (2, k). What is k?",
    "options": [
      "Just plug in x=2",
      "🎯 Wrong Target",
      "🎭 Imposter Subject",
      "🔄 Sign Flip"
    ],
    "correct": 0,
    "explanation": "Just substitute: k = 3(2) − 7 = −1. Don't overcomplicate it."
  },
  {
    "prompt": "Lines m and n are parallel. Line m has slope 4. Line n goes through (1,3) and (3,k). Find k.",
    "options": [
      "🔀 One-Case Trap",
      "🎭 Imposter Subject (perpendicular not parallel)",
      "👻 Distribution Ghost",
      "Use slope formula with parallel slope"
    ],
    "correct": 3,
    "explanation": "Parallel → same slope 4. (k−3)/(3−1) = 4 → k = 11. The <strong>Imposter Subject</strong> trap would be confusing parallel with perpendicular."
  }
];

const WPT_EXERCISE: MatchingItem[] = [
  {
    "prompt": "\"is\"",
    "options": [
      "÷",
      "×",
      "=",
      "+"
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "\"more than\"",
    "options": [
      "×",
      "−",
      "+",
      "="
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "\"less than\"",
    "options": [
      "×",
      "−",
      "÷",
      "+"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "\"per\" / \"each\"",
    "options": [
      "+",
      "×",
      "÷",
      "−"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "\"of\" (as in 30% of)",
    "options": [
      "=",
      "×",
      "÷",
      "+"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "\"total\" / \"sum\"",
    "options": [
      "×",
      "−",
      "+",
      "="
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "\"difference\"",
    "options": [
      "×",
      "−",
      "÷",
      "+"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "\"quotient\"",
    "options": [
      "÷",
      "×",
      "−",
      "+"
    ],
    "correct": 0,
    "explanation": ""
  },
  {
    "prompt": "\"twice\"",
    "options": [
      "²",
      "+2",
      "2x",
      "×2"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "\"half of\"",
    "options": [
      "÷2",
      "×½",
      "½+",
      "−2"
    ],
    "correct": 0,
    "explanation": ""
  }
];

export default function PSAT89MathModule2() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "algebra-overview": <AlgebraOverviewVisual />,
        "linear-equations": <LinearEquationsVisual />,
        "three-forms": <ThreeFormsVisual />,
        "systems": <SystemsVisual />,
        "inequalities": <InequalitiesVisual />,
        "trap-taxonomy": <TrapTaxonomyVisual />,
      }}
      activities={{
        "exercise-prereq": (goNext: () => void) => (
          <FillInExercise
            items={PREREQ_EXERCISE}
            title="Prereq"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-solv": (goNext: () => void) => (
          <FillInExercise
            items={SOLV_EXERCISE}
            title="Equation Solver"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-forms": (goNext: () => void) => (
          <FillInExercise
            items={FORMS_EXERCISE}
            title="Forms"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-sys": (goNext: () => void) => (
          <ClassificationExercise
            items={SYS_EXERCISE}
            categories={["One Solution","No Solution","Infinitely Many"]}
            title="Sys"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-inq": (goNext: () => void) => (
          <FillInExercise
            items={INQ_EXERCISE}
            title="Inequality Challenge"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-trp": (goNext: () => void) => (
          <MatchingExercise
            items={TRP_EXERCISE}
            title="Trap Spotter"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-wpt": (goNext: () => void) => (
          <MatchingExercise
            items={WPT_EXERCISE}
            title="Word Problem Translator"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/psat89-math/3"
      nextModuleLabel="Module 3: Advanced Math"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "math",
  moduleNum: 2,
  title: "Algebra",
  subtitle:
    "The single highest-impact domain on the PSAT 8/9. Master this and you\u2019ve conquered ~35% of the test.",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "lesson" },
    { id: "exercise-prereq", label: "Prereq", icon: "zap" },
    { id: "exercise-solv", label: "Equation Solver", icon: "zap" },
    { id: "exercise-forms", label: "Forms", icon: "zap" },
    { id: "exercise-sys", label: "Sys", icon: "zap" },
    { id: "exercise-inq", label: "Inequality Challenge", icon: "zap" },
    { id: "exercise-trp", label: "Trap Spotter", icon: "zap" },
    { id: "exercise-wpt", label: "Word Problem Translator", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "algebra-overview",
      title: "Algebra: The Highest-Impact Domain",
      subtitle: "Why This Module Matters",
      visual: "algebra-overview",
      body: [
        "Algebra accounts for roughly 35% of the PSAT 8/9 Math section \u2014 13 to 15 questions. Mastering linear equations and systems alone can be worth 60-80 points on your score.",
        "This module covers four core topics: one-variable equations, two-variable equations (the three forms), systems of equations, and inequalities.",
      ],
    },
    {
      id: "linear-equations",
      title: "Topic 2A: Linear Equations in One Variable",
      subtitle: "Solving, Word Problems & Number of Solutions",
      visual: "linear-equations",
      body: [
        "Isolate the variable using inverse operations. Whatever you do to one side, do to the other. Distribute first, then combine like terms.",
        "Number of solutions: one solution (normal), no solution (contradiction like 3 = 5), infinitely many (identity like 2x = 2x).",
        "For absolute value: $|ax + b| = c$ produces TWO cases: $ax + b = c$ AND $ax + b = -c$.",
      ],
    },
    {
      id: "two-variable",
      title: "Topic 2B: Linear Equations in Two Variables",
      subtitle: "Three Forms, Slope & Special Relationships",
      visual: "three-forms",
      body: [
        "Every linear equation on the PSAT can be written in three forms. Each reveals different information. Know when to use which.",
        "Slope formula: $m = \\frac{y_2 - y_1}{x_2 - x_1}$. Parallel lines have the same slope. Perpendicular lines have negative reciprocal slopes.",
      ],
    },
    {
      id: "systems",
      title: "Topic 2C: Systems of Linear Equations",
      subtitle: "Substitution, Elimination & Desmos",
      visual: "systems",
      body: [
        "Three methods for solving systems: substitution, elimination, and graphing with Desmos. On the PSAT, Desmos is often the fastest method.",
        "The number of solutions depends on the relationship between the lines. Different slopes mean one solution. Same slope with different intercepts means no solution. Same line means infinitely many.",
      ],
    },
    {
      id: "inequalities",
      title: "Topic 2D: Linear Inequalities",
      subtitle: "Solving, Flipping the Sign & Graphing",
      visual: "inequalities",
      body: [
        "Inequalities work like equations with one critical exception: when you multiply or divide by a negative number, you FLIP the inequality sign. This is the #1 most-tested inequality rule.",
        "For graphing: dashed line for strict inequalities (< or >), solid line for inclusive (\u2264 or \u2265). Shade the solution side.",
      ],
    },
    {
      id: "trap-taxonomy",
      title: "The Algebra Trap Taxonomy",
      subtitle: "Six Traps That Recur Throughout the PSAT",
      visual: "trap-taxonomy",
      body: [
        "Learn these traps by name. When you spot one in a problem, you\u2019ll know exactly what to watch for. We\u2019ll reference these traps by name in exercises and practice questions from now on.",
      ],
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 1 — Test Structure",
      stem: "How many modules does the PSAT 8/9 Math section have?",
      choices: ["4 modules", "2 modules (adaptive)", "1 module", "3 modules"],
      correct: 1,
      explanation: "The PSAT 8/9 Math section has 2 modules. Module 2 adapts based on your Module 1 performance — harder questions if you did well, standard if not.",
    },
    {
      source: "Module 1 — Score Ranges",
      stem: "What is the PSAT 8/9 Math score range?",
      choices: ["120–720", "100–500", "400–1600", "200–800"],
      correct: 0,
      explanation: "PSAT 8/9 Math scores range from 120 to 720. Combined with Evidence-Based Reading and Writing, the total is 240–1440.",
    },
    {
      source: "Module 1 — Calculator Policy",
      stem: "Can you use a calculator on the PSAT 8/9 Math section?",
      choices: ["Yes, on the entire section", "No calculators allowed", "Only on Module 2", "Only on hard questions"],
      correct: 0,
      explanation: "You can use a calculator on the ENTIRE math section. A built-in Desmos graphing calculator is provided, or you can bring your own approved calculator.",
    },
    {
      source: "Module 1 — Four Domains",
      stem: "Which domain makes up the largest share of PSAT 8/9 Math questions?",
      choices: ["Problem-Solving & Data Analysis", "Algebra", "Advanced Math", "Geometry"],
      correct: 1,
      explanation: "Algebra is the largest domain at about 35% of questions (13–15 questions). That's exactly what this module covers!",
    },
    {
      source: "Module 1 — Strategy",
      stem: "What should you do FIRST when you see a word problem?",
      choices: ["Plug in numbers", "Underline what the question asks for", "Eliminate answer choices", "Start solving immediately"],
      correct: 1,
      explanation: "Always underline what the question is asking for FIRST. Over 50% of word problem errors happen because students solve for the wrong thing.",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "If <code>4x − 8 = 2x + 6</code>, what is x?",
      choices: ["5", "14", "1", "7"],
      correct: 3,
      explanation: "2x = 14 → x = 7.",
      trapAnswer: 0,
      trapDesc: "Arithmetic error",
    },
    {
      stem: "What is the slope of <code>y = −3x + 12</code>?",
      choices: ["3", "4", "12", "−3"],
      correct: 3,
      explanation: "In y = mx + b, slope = m = −3.",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Confused y-intercept with slope",
    },
    {
      stem: "Which represents all x where <code>3x − 5 > 7</code>?",
      choices: ["x > 12", "x > 2", "x < 4", "x > 4"],
      correct: 3,
      explanation: "3x > 12 → x > 4.",
      trapAnswer: 1,
      trapDesc: "Divided incorrectly",
    },
    {
      stem: "A streaming service charges $12 sign-up plus $8/month. Which gives cost C after m months?",
      choices: ["C = 20m", "C = 8(m+12)", "C = 8m + 12", "C = 12m + 8"],
      correct: 2,
      explanation: "$8/month = 8m. $12 fixed = +12. C = 8m + 12.",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Swapped slope and intercept — The Wrong Target",
    },
    {
      stem: "A line through (2, 5) with slope −3 has what y-intercept?",
      choices: ["−11", "11", "−1", "1"],
      correct: 1,
      explanation: "y − 5 = −3(x − 2) → y = −3x + 11. Intercept = 11.",
      trap: "distribution_ghost",
      trapAnswer: 3,
      trapDesc: "Sign error in distribution — The Distribution Ghost",
    },
    {
      stem: "If <code>2x + y = 10</code> and <code>x − y = 2</code>, what is x?",
      choices: ["4", "3", "6", "2"],
      correct: 0,
      explanation: "Add equations: 3x = 12 → x = 4.",
      trapAnswer: 3,
      trapDesc: "Arithmetic error",
    },
    {
      stem: "If <code>3(x − 2) = 2(x + 4)</code>, what is x?",
      choices: ["6", "2", "10", "14"],
      correct: 3,
      explanation: "3x − 6 = 2x + 8 → x = 14.",
      trap: "distribution_ghost",
      trapAnswer: 0,
      trapDesc: "Forgot to distribute to second term — The Distribution Ghost",
    },
    {
      stem: "Which graph shows <code>y ≤ 2x + 1</code>?",
      choices: ["Dashed line, shaded below", "Solid line, shaded above", "Dashed line, shaded above", "Solid line, shaded below"],
      correct: 3,
      explanation: "≤ means solid line and shaded below the line (where y is less).",
      trapAnswer: 2,
      trapDesc: "Confused solid vs dashed",
    },
    {
      stem: "<code>3x + ky = 12</code> and <code>9x + 15y = 36</code> have infinitely many solutions. What is k?",
      choices: ["3", "9", "5", "15"],
      correct: 2,
      explanation: "Second = 3 × first. 15 = 3k → k = 5.",
      trapAnswer: 0,
      trapDesc: "Confused ratio",
    },
    {
      stem: "Line p: <code>y = (2/5)x − 3</code>. Line q is perpendicular to p and goes through (4, 1). What is line q?",
      choices: ["y = −(2/5)x + 11/5", "y = (5/2)x − 9", "y = −(5/2)x + 11", "y = (2/5)x − 3/5"],
      correct: 2,
      explanation: "Perpendicular slope = −5/2. y − 1 = −(5/2)(x − 4) → y = −(5/2)x + 11.",
      trap: "imposter_subject",
      trapAnswer: 0,
      trapDesc: "Used same slope instead of perpendicular — The Imposter Subject",
    },
  ],
  takeaways: [
    "Algebra is ~35% of the PSAT 8/9 -- the single largest domain.",
    "Know all three forms: slope-intercept, point-slope, standard.",
    "Parallel = same slope. Perpendicular = negative reciprocal slopes.",
    "Systems: substitution, elimination, or Desmos for speed.",
    "Variables cancel -- true = infinite solutions, false = no solution.",
    "Inequalities: FLIP the sign when multiplying/dividing by a negative.",
    "50%+ of word problem errors happen at translation.",
    "Always re-read what the question asks for before choosing your answer.",
  ],
};
