"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import {
  DesmosSkillsVisual,
  ShortcutsVisual,
  DesmosDecisionVisual,
  FirstStepsVisual,
  DesmosLimitationsVisual,
} from "./lesson-visuals";

const SKL_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Find where <code>y = 3x − 2</code> and <code>y = −x + 6</code> cross.",
    "options": [
      "Use a slider",
      "Calculate statistics",
      "Graph & find intersection",
      "Run a regression"
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "A quadratic <code>f(x) = x² − 8x + 12</code>. What are the zeros?",
    "options": [
      "Use percent",
      "Graph a function",
      "Graph inequalities",
      "Enter a table"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "The line <code>y = kx + 5</code> passes through (3, 14). Find k.",
    "options": [
      "Graph & find intersection",
      "Calculate statistics",
      "Run a regression",
      "Use a slider"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "Given data points (1,4), (2,7), (3,11), (4,14). Find the best-fit line.",
    "options": [
      "Graph a function",
      "Graph inequalities",
      "Use a slider",
      "Run a regression"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "Which region satisfies <code>y ≤ x + 3</code> and <code>y > −2x + 8</code>?",
    "options": [
      "Graph circles",
      "Graph inequalities",
      "Graph & find intersection",
      "Use a slider"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "Find the mean of 15, 22, 18, 31, 24, 19.",
    "options": [
      "Calculate statistics",
      "Run a regression",
      "Use percent",
      "Enter a table"
    ],
    "correct": 0,
    "explanation": ""
  },
  {
    "prompt": "What is 15% of 280?",
    "options": [
      "Calculate statistics",
      "Graph a function",
      "Use percent",
      "Use a slider"
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "The circle <code>(x+3)² + (y−1)² = 49</code> intersects <code>y = 4</code> at what points?",
    "options": [
      "Graph inequalities",
      "Graph circles",
      "Graph & find intersection",
      "Run a regression"
    ],
    "correct": 1,
    "explanation": ""
  }
];

const SPD_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: <code>x + 5 = 12</code>",
    "answer": "Algebra",
    "solution": "One-step — just subtract 5 mentally. $x = 7$. Desmos is overkill."
  },
  {
    "prompt": "Solve the system: <code>3x − 2y = 7</code> and <code>5x + y = 19</code>",
    "answer": "Desmos",
    "solution": "Graph both and click the intersection. Faster than elimination with these coefficients."
  },
  {
    "prompt": "What is 8 × 7?",
    "answer": "Algebra",
    "solution": "56. You don't need a calculator for basic multiplication."
  },
  {
    "prompt": "Find the vertex of <code>y = 2x² − 12x + 22</code>",
    "answer": "Desmos",
    "solution": "Graph it and click the vertex point. Instant. Algebra would require $−b/2a$ then substitution."
  },
  {
    "prompt": "A study finds a correlation between exercise and grades. Can we conclude exercise causes better grades?",
    "answer": "Algebra",
    "solution": "Conceptual question — Desmos can't help. Answer: No, correlation ≠ causation."
  },
  {
    "prompt": "Find x: <code>|2x − 6| = 10</code>",
    "answer": "Desmos",
    "solution": "Graph $y =$ |2x − 6| and $y = 10$, click both intersections. Avoids the two-case algebra."
  },
  {
    "prompt": "If f(x) = x² + 3x − 10, what is f(−2)?",
    "answer": "Algebra",
    "solution": "Just plug in: 4 − 6 − 10 = −12. Quick mental math. Desmos works but isn't faster."
  },
  {
    "prompt": "Where do <code>y = x² − 1</code> and <code>y = 2x + 2</code> intersect?",
    "answer": "Desmos",
    "solution": "Graph both, click dots. The algebraic method ($x² − 2x − 3 = 0$ → factor) works too, but Desmos is faster."
  },
  {
    "prompt": "In a two-way table, what is P(Math | 9th grade)?",
    "answer": "Algebra",
    "solution": "Read from the table: count in both / count in row. Desmos can't read tables for you."
  },
  {
    "prompt": "Solve: <code>2(x+3) = 4x − 8</code>",
    "answer": "Algebra",
    "solution": "Distribute, combine: $2x + 6 = 4x − 8$ → 14 = 2x → $x = 7$. Quick enough algebraically."
  }
];

const SHC_EXERCISE: MatchingItem[] = [
  {
    "prompt": "How do you type an exponent like x²?",
    "options": [
      "~",
      "sqrt",
      "_",
      "^"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "How do you type a subscript like y₁?",
    "options": [
      "~",
      "/",
      "^",
      "_"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "How do you start a regression?",
    "options": [
      "~",
      "|",
      "_",
      "^"
    ],
    "correct": 0,
    "explanation": ""
  },
  {
    "prompt": "How do you type a square root?",
    "options": [
      "sq",
      "sqrt",
      "√",
      "root"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "How do you type an absolute value like |x|?",
    "options": [
      "[]",
      "||",
      "Shift + pipe",
      "abs()"
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "How do you type pi (the number)?",
    "options": [
      "pie",
      "pi",
      "3.14",
      "math"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "How do you type a fraction like 3/7?",
    "options": [
      "/",
      ":",
      "-",
      "bkslash"
    ],
    "correct": 0,
    "explanation": ""
  }
];

export default function PSAT89MathModule6() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "first-steps": <FirstStepsVisual />,
        "desmos-skills": <DesmosSkillsVisual />,
        "shortcuts": <ShortcutsVisual />,
        "desmos-decision": <DesmosDecisionVisual />,
        "desmos-limitations": <DesmosLimitationsVisual />,
      }}
      activities={{
        "exercise-skl": (goNext: () => void) => (
          <MatchingExercise
            items={SKL_EXERCISE}
            title="Which Desmos Skill?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-spd": (goNext: () => void) => (
          <FillInExercise
            items={SPD_EXERCISE}
            title="Desmos or Algebra?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-shc": (goNext: () => void) => (
          <MatchingExercise
            items={SHC_EXERCISE}
            title="Shortcut Quiz"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/psat89-math/7"
      nextModuleLabel="Module 7: Strategy & Time Management"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "math",
  moduleNum: 6,
  title: "Desmos Mastery",
  subtitle:
    "Every student gets the same Desmos calculator on every SAT Suite test. Learning it well is like getting a free cheat code.",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "lesson" },
    { id: "exercise-skl", label: "Which Desmos Skill?", icon: "zap" },
    { id: "exercise-spd", label: "Desmos or Algebra?", icon: "zap" },
    { id: "exercise-shc", label: "Shortcut Quiz", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 5 — Pythagorean Theorem",
      stem: "A right triangle has legs 6 and 8. What is the hypotenuse?",
      choices: ["10", "12", "48", "14"],
      correct: 0,
      explanation: "6-8-10 is a 3-4-5 triple multiplied by 2. Or: √(36+64) = √100 = 10.",
    },
    {
      source: "Module 5 — Angles",
      stem: "Two angles are supplementary. One is 115°. What is the other?",
      choices: ["65°", "85°", "75°", "55°"],
      correct: 0,
      explanation: "Supplementary angles add to 180°. 180 − 115 = 65°.",
    },
    {
      source: "Module 5 — Area",
      stem: "What is the area of a circle with radius 4?",
      choices: ["32π", "16π", "4π", "8π"],
      correct: 1,
      explanation: "A = πr² = π(16) = 16π.",
    },
    {
      source: "Module 5 — Circle Equations",
      stem: "The equation <code>(x−2)²+(y+3)²=25</code> has center:",
      choices: ["(2, 3)", "(−2, 3)", "(2, −3)", "(−2, −3)"],
      correct: 2,
      explanation: "(x−2) → $h=2$. (y+3) = (y−(−3)) → $k=−3$. Center: (2, −3).",
    },
    {
      source: "Module 5 — Special Triangles",
      stem: "In a 45-45-90 triangle, each leg is 7. What is the hypotenuse?",
      choices: ["7", "14", "7√2", "7√3"],
      correct: 2,
      explanation: "45-45-90 ratio: leg : leg : leg√2. Hyp = 7√2 ≈ 9.90.",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "first-steps",
      title: "Desmos First Steps",
      subtitle: "Getting Started",
      visual: "first-steps",
      body: [
        "If you've never used a graphing calculator before, these 5 steps take 5 minutes to learn and unlock everything else.",
      ],
    },
    {
      id: "desmos-skills",
      title: "The 10 Essential Desmos Skills",
      subtitle: "Core Skills",
      visual: "desmos-skills",
      body: [
        "Master these 10 skills above and you can Desmos-solve the majority of PSAT 8/9 math questions.",
      ],
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      subtitle: "Reference",
      visual: "shortcuts",
      body: [
        "Memorize these before test day. They save 2-3 seconds per entry -- that adds up over 44 questions.",
      ],
    },
    {
      id: "desmos-decision",
      title: "When to Use Desmos -- and When NOT To",
      subtitle: "Calculator Discipline",
      visual: "desmos-decision",
      body: [
        "The key is knowing when Desmos saves time and when it doesn't. Study the comparison above.",
      ],
    },
    {
      id: "desmos-limitations",
      title: "Graphing vs. Scientific Mode & CAS Limitations",
      subtitle: "Know Your Tools",
      visual: "desmos-limitations",
      body: [
        "Understanding what Desmos can and cannot do prevents wasted time on test day.",
      ],
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "What is the solution to the system <code>y = x + 3</code> and <code>y = −2x + 9</code>?",
      choices: ["(4, 1)", "(3, 6)", "(1, 4)", "(2, 5)"],
      correct: 3,
      explanation: "Graph both, click intersection → (2, 5). Check: 2+3=5 ✓, −2(2)+9=5 ✓.",
      trapAnswer: 2,
      trapDesc: "(1,4) — misread intersection coordinates",
    },
    {
      stem: "What is the y-intercept of <code>y = 3x − 7</code>?",
      choices: ["7", "−3", "3", "−7"],
      correct: 3,
      explanation: "Graph it. The line crosses the y-axis at (0, −7). Or: plug in $x=0$ → $y = −7$.",
      trapAnswer: 0,
      trapDesc: "3 is the slope, not the y-intercept",
    },
    {
      stem: "What is the mean of 10, 14, 18, 22, 26?",
      choices: ["18", "22", "20", "14"],
      correct: 0,
      explanation: "Type mean(10,14,18,22,26) → 18. Or: sum = 90, 90/5 = 18.",
      trapAnswer: 0,
      trapDesc: "14 is the median, not the mean",
    },
    {
      stem: "The quadratic <code>y = x² − 4x − 5</code> has zeros at:",
      choices: ["$x = 1$ and $x = −5$", "$x = 1$ and $x = 5$", "$x = −1$ and $x = −5$", "$x = −1$ and $x = 5$"],
      correct: 3,
      explanation: "Graph it. The parabola crosses x-axis at (−1, 0) and (5, 0).",
      trapAnswer: 0,
      trapDesc: "Got the signs wrong when factoring",
    },
    {
      stem: "What is the vertex of <code>y = −x² + 6x − 5</code>?",
      choices: ["(6, −5)", "(3, −4)", "(−3, 4)", "(3, 4)"],
      correct: 3,
      explanation: "Graph and click the peak → (3, 4). Maximum because $a < 0$.",
      trapAnswer: 1,
      trapDesc: "(−3,4) — flipped the sign of h in vertex form",
    },
    {
      stem: "The line <code>y = mx + 2</code> passes through (4, 10). What is m?",
      choices: ["4", "8", "3", "2"],
      correct: 3,
      explanation: "Slider: set $y = mx + 2$, slide m until it passes through (4,10). Or: 10 = 4m + 2 → $m = 2$.",
      trapAnswer: 2,
      trapDesc: "Plugged in wrong: 10=4m+2, $m=2$ not 4",
    },
    {
      stem: "Which value of x satisfies <code>|2x − 8| = 6</code>? Select all.",
      choices: ["x = 1", "$x = 1$ and $x = 7$", "x = 7", "$x = −1$ and $x = 7$"],
      correct: 1,
      explanation: "Graph $y =$ |2x−8| and $y = 6$. Intersections at $x = 1$ and $x = 7$.",
      trapAnswer: 0,
      trapDesc: "Only found one solution, missed the second",
    },
    {
      stem: "The inequality <code>y > −x + 5</code> is satisfied by which point?",
      choices: ["(1, 2)", "(0, 5)", "(2, 5)", "(0, 3)"],
      correct: 2,
      explanation: "Graph $y > −x + 5$. Shading is above the line. (2,5): 5 > −2+5 = 3 ✓.",
      trapAnswer: 1,
      trapDesc: "(0,5) is ON the boundary, not above it (strict inequality)",
    },
    {
      stem: "For what value of k does the system <code>y = 2x + k</code> and <code>y = 2x − 3</code> have no solution?",
      choices: ["k = 3", "k = 0", "Any $k ≠ −3$", "k = −3"],
      correct: 2,
      explanation: "Same slope (2) → parallel. No solution unless same line. Any $k ≠ −3$ → parallel (no solution).",
      trapAnswer: 0,
      trapDesc: "$k=−3$ would make them the same line (infinite solutions, not zero)",
    },
    {
      stem: "Data: (1,2), (2,5), (3,7), (4,10), (5,13). The regression line y₁~mx₁+b gives approximately:",
      choices: ["$y = 3x − 1$", "$y = 2$.5x + 0.5", "$y = 2$.7x − 0.7", "$y = 2x + 1$"],
      correct: 2,
      explanation: "Enter table, run regression. m ≈ 2.7, b ≈ −0.7. Close to but not exactly $y = 3x − 1$.",
      trapAnswer: 1,
      trapDesc: "$y=3x−1$ is too steep — regression gives m≈2.7, not 3",
    },
  ],
  takeaways: [
    "Desmos can solve 60-70% of PSAT 8/9 questions faster than algebra.",
    "Start with the basics: type an equation, find intersections, zoom in/out.",
    "10 essential skills: graph, intersect, slider, table, regression, inequalities, stats, %, circles, shortcuts.",
    "The 5-Second Rule: if you can't set it up in Desmos quickly, switch to algebra.",
    "Memorize keyboard shortcuts: ^ (exponent), _ (subscript), ~ (regression), sqrt, pi.",
    "Desmos is NOT CAS -- it can't factor or simplify. It graphs and evaluates numerically.",
    "Systems: graph both and click the intersection. Fastest method for 90% of system problems.",
    "Always verify your algebraic answer by graphing -- it catches careless errors.",
    "Practice at desmos.com/calculator before test day.",
  ],
};
