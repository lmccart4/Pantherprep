"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { DiscriminantCalculator } from "@/components/course/activities/discriminant-calculator";
import {
  QuadraticFormsVisual,
  DiscriminantVisual,
  FactoringVisual,
  ExponentRulesVisual,
  GrowthDecayVisual,
  TransformationsVisual,
} from "./lesson-visuals";

const FORM_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: f(x) = 2(x − 3)(x + 1)",
    "answer": "Factored",
    "solution": "x-intercepts at x = 3 and x = −1"
  },
  {
    "prompt": "Solve: $f(x) = x^2 - 6x + 8$",
    "answer": "Standard",
    "solution": "y-intercept at (0, 8), opens upward (a = 1 > 0)"
  },
  {
    "prompt": "Solve: $f(x) = -3(x + 2)^2 + 7$",
    "answer": "Vertex",
    "solution": "Vertex at (−2, 7), opens downward, so 7 is the maximum"
  },
  {
    "prompt": "Solve: g(x) = (x − 5)(x − 5)",
    "answer": "Factored",
    "solution": "Double root at $x = 5$ — parabola touches x-axis once. Also vertex form: $(x-5)^2$"
  },
  {
    "prompt": "Solve: $h(x) = 4x^2 + 12x - 7$",
    "answer": "Standard",
    "solution": "y-intercept at (0, −7), opens upward (a = 4 > 0)"
  },
  {
    "prompt": "Solve: $y = -(x - 1)^2 - 4$",
    "answer": "Vertex",
    "solution": "Vertex at (1, −4), opens downward, −4 is the maximum"
  },
  {
    "prompt": "Solve: $p(x) = \\frac{1}{2}(x + 6)(x - 2)$",
    "answer": "Factored",
    "solution": "x-intercepts at x = −6 and x = 2"
  },
  {
    "prompt": "Solve: $f(x) = 5(x - 4)^2 + 0$",
    "answer": "Vertex",
    "solution": "Vertex at (4, 0) — the vertex IS on the x-axis. Min value is 0."
  }
];

const WF_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "The question asks: \"What is the y-intercept of the parabola?\"",
    "answer": "Standard",
    "solution": "Standard form $f(x) = ax^2 + bx + c$ gives you the y-intercept directly: it's $c$."
  },
  {
    "prompt": "The question asks: \"What is the maximum value of the function?\"",
    "answer": "Vertex",
    "solution": "Vertex form $f(x) = a(x-h)^2 + k$ gives you the max/min directly: it's $k$ (when $a < 0$, $k$ is the max)."
  },
  {
    "prompt": "The question asks: \"What are the zeros of the function?\"",
    "answer": "Factored",
    "solution": "Factored form f(x) = a(x−r)(x−s) gives you the zeros directly: x = r and x = s."
  },
  {
    "prompt": "The question asks: \"At what x-value does the function reach its minimum?\"",
    "answer": "Vertex",
    "solution": "Vertex form gives you the vertex (h, k). The min occurs at x = h. Or from standard: x = −b/2a."
  },
  {
    "prompt": "The question asks: \"Does the graph cross the x-axis?\"",
    "answer": "Standard",
    "solution": "Use the discriminant from standard form: $b^2-4ac > 0$ means yes (two crossings), $= 0$ means touches once, $< 0$ means no."
  },
  {
    "prompt": "The question asks: \"For what values of x is f(x) = 0?\"",
    "answer": "Factored",
    "solution": "This is asking for zeros/roots. Factored form gives these directly. Set each factor = 0."
  },
  {
    "prompt": "The question gives you: \"f(x) has a vertex at (3, −5)\" and asks you to write the equation.",
    "answer": "Vertex",
    "solution": "You know $h = 3$ and $k = -5$, so start with vertex form: $f(x) = a(x - 3)^2 - 5$. Then use another point to find $a$."
  },
  {
    "prompt": "The question asks: \"What is the value of f(0)?\"",
    "answer": "Standard",
    "solution": "$f(0)$ IS the y-intercept. In standard form, $f(0) = a(0)^2 + b(0) + c = c$. Just read it off."
  }
];

const FACTOR_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Factor: $x^2 - 25$",
    "answer": "(x+5)(x-5)",
    "solution": "$x^2 - 25 = (x + 5)(x - 5)$ (Difference of Squares)"
  },
  {
    "prompt": "Factor: $x^2 + 7x + 12$",
    "answer": "(x+3)(x+4)",
    "solution": "Find numbers that multiply to 12 and add to 7: 3 and 4 → (x + 3)(x + 4) (Standard Trinomial)"
  },
  {
    "prompt": "Factor: $3x^2 + 6x$",
    "answer": "3x(x+2)",
    "solution": "GCF = 3x → 3x(x + 2) (GCF)"
  },
  {
    "prompt": "Factor: $x^2 - 10x + 25$",
    "answer": "(x-5)^2",
    "solution": "$x^2 - 10x + 25 = (x - 5)^2$ [perfect square: $(-5)^2 = 25$, $2(-5) = -10$] (Perfect Square)"
  },
  {
    "prompt": "Factor: $2x^2 - 8$",
    "answer": "2(x+2)(x-2)",
    "solution": "GCF first: $2(x^2 - 4)$, then difference of squares: $2(x + 2)(x - 2)$ (GCF + Difference of Squares)"
  },
  {
    "prompt": "Factor: $x^2 + 3x - 10$",
    "answer": "(x+5)(x-2)",
    "solution": "Numbers that multiply to −10 and add to 3: 5 and −2 → (x + 5)(x − 2) (Standard Trinomial)"
  }
];

const EXPS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "$x^8$",
    "options": [
      "$x^2$",
      "$x^{15}$",
      "$8x$",
      "$x^8$"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "$x^8$",
    "options": [
      "$x^2$",
      "$x^8$",
      "$4x^2$",
      "$x^6$"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "$x^4$",
    "options": [
      "$x^4$",
      "$x^{10}$",
      "$x^{21}$",
      "$x^3$"
    ],
    "correct": 0,
    "explanation": ""
  },
  {
    "prompt": "$1$",
    "options": [
      "undefined",
      "$1$",
      "$0$",
      "$5$"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "$1/x^3$",
    "options": [
      "$-x^3$",
      "$1/x^3$",
      "$-3x$",
      "$x^3$"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "$2$",
    "options": [
      "$2.67$",
      "$8/3$",
      "$2$",
      "$4$"
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "$9$",
    "options": [
      "$3$",
      "$81$",
      "$9$",
      "$18$"
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "$4x^6$",
    "options": [
      "$2x^5$",
      "$2x^6$",
      "$4x^6$",
      "$4x^5$"
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "$1$",
    "options": [
      "$x^0$",
      "$0$",
      "$x^8$",
      "$1$"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "$x^8 y^{12}$",
    "options": [
      "$x^2 y^{12}$",
      "$x^8 y^7$",
      "$x^8 y^{12}$",
      "$x^6 y^7$"
    ],
    "correct": 2,
    "explanation": ""
  }
];

const GROWTH_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "A population doubles every 5 years.",
    "answer": "Exponential Growth",
    "solution": "Doubling = multiplying by 2 each period. That's exponential growth."
  },
  {
    "prompt": "A car loses $2,000 in value each year.",
    "answer": "Linear Decay",
    "solution": "Constant dollar amount decrease = linear (not exponential). The graph is a straight line going down."
  },
  {
    "prompt": "$f(x) = 500(0.85)^x$",
    "answer": "Exponential Decay",
    "solution": "The base 0.85 is between 0 and 1, so this is exponential decay (losing 15% each period)."
  },
  {
    "prompt": "A bank account earns 3% interest compounded annually.",
    "answer": "Exponential Growth",
    "solution": "Compound interest = exponential growth. Amount × 1.03 each year."
  },
  {
    "prompt": "f(x) = 200 + 15x",
    "answer": "Linear Growth",
    "solution": "Adding a constant (15) each time = linear growth. Slope = 15."
  },
  {
    "prompt": "A radioactive sample has a half-life of 10 years.",
    "answer": "Exponential Decay",
    "solution": "Half-life = multiplying by 0.5 each period. Exponential decay."
  },
  {
    "prompt": "A taxi charges $3 base fee plus $2.50 per mile.",
    "answer": "Linear Growth",
    "solution": "Fixed fee + constant rate per mile = linear. C = 2.50m + 3."
  },
  {
    "prompt": "$f(x) = 1000(1.08)^x$",
    "answer": "Exponential Growth",
    "solution": "Base 1.08 > 1, so this is exponential growth (8% increase each period)."
  }
];

export default function NMSQTMathModule3() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "quadratic-forms": <QuadraticFormsVisual />,
        "discriminant": <DiscriminantVisual />,
        "factoring": <FactoringVisual />,
        "exponent-rules": <ExponentRulesVisual />,
        "growth-decay": <GrowthDecayVisual />,
        "transformations": <TransformationsVisual />,
      }}
      activities={{
        "exercise-form-qs": (goNext: () => void) => (
          <FillInExercise
            items={FORM_QS_EXERCISE}
            title="Quadratic Form Identifier"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-wf-qs": (goNext: () => void) => (
          <FillInExercise
            items={WF_QS_EXERCISE}
            title="Which Form Do I Need?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-factor-qs": (goNext: () => void) => (
          <FillInExercise
            items={FACTOR_QS_EXERCISE}
            title="Factoring Workshop"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-exps": (goNext: () => void) => (
          <MatchingExercise
            items={EXPS_EXERCISE}
            title="Exponent Rules Drill"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-growth-qs": (goNext: () => void) => (
          <FillInExercise
            items={GROWTH_QS_EXERCISE}
            title="Linear, Growth, or Decay?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "calculator": (goNext: () => void) => (
          <DiscriminantCalculator
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/nmsqt-math/4"
      nextModuleLabel="Module 4: Problem-Solving & Data Analysis"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "math",
  moduleNum: 3,
  title: "Advanced Math",
  subtitle:
    "The backbone of Advanced Math \u2014 master these and you control ~35% of the test.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-form-qs", label: "Quadratic Form Identifier", icon: "zap" },
    { id: "exercise-wf-qs", label: "Which Form Do I Need?", icon: "zap" },
    { id: "exercise-factor-qs", label: "Factoring Workshop", icon: "zap" },
    { id: "exercise-exps", label: "Exponent Rules Drill", icon: "zap" },
    { id: "exercise-growth-qs", label: "Linear, Growth, or Decay?", icon: "zap" },
    { id: "calculator", label: "Calculator", icon: "chart" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "quadratic-forms",
      title: "Quadratic Equations -- The Three Forms",
      subtitle: "Topic 3A",
      visual: "quadratic-forms",
      body: [
        "The PSAT loves quadratics because they can be expressed in three different forms -- and each form reveals different information. The key skill is knowing which form to use for each question.",
      ],
    },
    {
      id: "discriminant",
      title: "The Discriminant: How Many Solutions?",
      subtitle: "Topic 3A (continued)",
      visual: "discriminant",
      body: [
        "The discriminant $b^2 - 4ac$ tells you how many real solutions a quadratic has. The PSAT frequently asks: 'How many solutions?' or 'For what value of k does the equation have no real solutions?'",
      ],
    },
    {
      id: "factoring",
      title: "Factoring Techniques",
      subtitle: "Topic 3B",
      visual: "factoring",
      body: [
        "Master all five factoring techniques. The PSAT expects you to factor quickly -- always start by checking for a GCF, then apply the appropriate pattern.",
      ],
    },
    {
      id: "exponent-rules",
      title: "Exponent Rules",
      subtitle: "Topic 3C",
      visual: "exponent-rules",
      body: [
        "Exponent rules show up in nearly every Advanced Math question. These rules must be memorized cold -- there's no time to derive them during the test.",
      ],
    },
    {
      id: "growth-decay",
      title: "Exponential Growth & Decay",
      subtitle: "Topic 3C (continued)",
      visual: "growth-decay",
      body: [
        "The PSAT tests whether you can distinguish linear from exponential models. Tap each card above to see examples.",
      ],
    },
    {
      id: "transformations",
      title: "Function Transformations",
      subtitle: "Topic 3D",
      visual: "transformations",
      body: [
        "Transformations change a function's graph. The most common PSAT trap is getting the horizontal direction wrong -- remember that f(x - 3) shifts RIGHT, not left.",
      ],
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 2 — Slope",
      stem: "What is the slope of the line y = −3x + 7?",
      choices: ["3", "−7", "7", "−3"],
      correct: 3,
      explanation: "In y = mx + b, the slope is m. Here m = −3. The 7 is the y-intercept.",
    },
    {
      source: "Module 2 — Systems",
      stem: "If two lines have the same slope but different y-intercepts, how many solutions does the system have?",
      choices: ["Infinite solutions", "Cannot determine", "No solution", "One solution"],
      correct: 2,
      explanation: "Same slope + different y-intercepts = parallel lines = no solution. They never intersect.",
    },
    {
      source: "Module 2 — Inequalities",
      stem: "When solving −5x > 20, what happens to the inequality sign?",
      choices: ["It disappears", "It becomes an equals sign", "It flips direction", "It stays the same"],
      correct: 2,
      explanation: "When you divide (or multiply) by a negative number, you must FLIP the inequality sign. −5x > 20 → x < −4.",
    },
    {
      source: "Module 2 — Sign Flip Trap",
      stem: "Which trap involves forgetting to flip the inequality sign?",
      choices: ["The Imposter Subject", "The Sign Flip", "The Distribution Ghost", "The Wrong Target"],
      correct: 1,
      explanation: "The Sign Flip trap: forgetting to flip the inequality when multiplying or dividing by a negative number.",
    },
    {
      source: "Module 2 — Word Problems",
      stem: "In the equation C = 8m + 12, the \"8\" represents:",
      choices: ["The number of months", "The slope (rate per month)", "The y-intercept (starting value)", "The total cost"],
      correct: 1,
      explanation: "In C = 8m + 12, the 8 is the coefficient of m (slope) — the rate per month. The 12 is the fixed starting cost (y-intercept).",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "What are the solutions of $x^2 - 5x + 6 = 0$?",
      choices: ["x = −2 and x = −3", "x = −1 and x = −6", "x = 2 and x = 3", "x = 1 and x = 6"],
      correct: 2,
      explanation: "Factor: (x − 2)(x − 3) = 0, so x = 2 or x = 3.",
      trapAnswer: 1,
      trapDesc: "Sign error on factors",
    },
    {
      stem: "What is the y-intercept of $f(x) = 3x^2 - 7x + 4$?",
      choices: ["(0, −7)", "(0, 4)", "(0, 0)", "(0, 3)"],
      correct: 1,
      explanation: "In standard form, the y-intercept is c. Here c = 4, so the y-intercept is (0, 4).",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Confused leading coefficient with y-intercept — The Wrong Target",
    },
    {
      stem: "Simplify: $x^5 \\cdot x^3 / x^2$",
      choices: ["$x^8$", "$x^6$", "$x^{10}$", "$x^4$"],
      correct: 1,
      explanation: "$x^5 \\cdot x^3 = x^8$, then $x^8 / x^2 = x^6$.",
      trapAnswer: 1,
      trapDesc: "Forgot to subtract quotient exponent",
    },
    {
      stem: "The function $f(x) = -2(x - 4)^2 + 18$ models the height of a ball. What is the maximum height?",
      choices: ["18", "20", "−2", "4"],
      correct: 0,
      explanation: "Vertex form: vertex is (4, 18). Since a = −2 < 0, the parabola opens downward, so 18 is the maximum.",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Picked the x-coordinate instead of the y-coordinate — The Wrong Target",
    },
    {
      stem: "For what value of $k$ does $2x^2 + kx + 8 = 0$ have exactly one real solution?",
      choices: ["k = 16", "k = ±8", "k = 8", "k = 4"],
      correct: 1,
      explanation: "One solution means discriminant $= 0$. $k^2 - 4(2)(8) = k^2 - 64 = 0 \\Rightarrow k^2 = 64 \\Rightarrow k = \\pm 8$.",
      trap: "one_case",
      trapAnswer: 1,
      trapDesc: "Only found the positive value — The One-Case Trap",
    },
    {
      stem: "Which expression is equivalent to $(x^2 - 9)/(x + 3)$?",
      choices: ["$x + 3$", "$(x - 3)/(x + 3)$", "$x - 3$", "$x^2 - 3$"],
      correct: 2,
      explanation: "Factor numerator: $x^2 - 9 = (x + 3)(x - 3)$. Cancel $(x + 3)$: result is $(x - 3)$.",
      trapAnswer: 2,
      trapDesc: "Failed to factor before simplifying",
    },
    {
      stem: "If $f(x) = ax^2 + bx + c$ has roots at $x = -1$ and $x = 5$, and passes through $(0, -10)$, what is the value of $a$?",
      choices: ["a = 1", "a = 2", "a = −2", "a = −10"],
      correct: 1,
      explanation: "Factored form: f(x) = a(x + 1)(x − 5). Plug in (0, −10): −10 = a(1)(−5) = −5a → a = 2.",
      trap: "distribution_ghost",
      trapAnswer: 1,
      trapDesc: "Sign error when plugging in — The Distribution Ghost",
    },
    {
      stem: "A population of 2,000 bacteria triples every 4 hours. Which function models the population P after t hours?",
      choices: ["P = 2000 + 3t", "P = 2000(3)^(4t)", "P = 2000(3)^(t/4)", "P = 6000t"],
      correct: 2,
      explanation: "Triples = multiply by 3. Every 4 hours means the exponent is t/4 (so when t=4, one full tripling). P = 2000(3)^(t/4).",
      trap: "form_mismatch",
      trapAnswer: 1,
      trapDesc: "Used linear model for exponential situation — Form Mismatch",
    },
  ],

  takeaways: [
    "Know the three quadratic forms and what each reveals: standard (y-intercept), factored (zeros), vertex (min/max).",
    "The discriminant (b^2 - 4ac) tells you how many solutions -- positive = 2, zero = 1, negative = 0.",
    "Vertex x-coordinate shortcut: x = -b/2a. The y-coordinate is always the min or max value.",
    "Master all five factoring techniques -- GCF, difference of squares, perfect square, trinomial, grouping.",
    "Memorize the exponent rules cold. They show up in nearly every Advanced Math question.",
    "Linear = constant amount of change. Exponential = constant percent change.",
    "f(x - 3) shifts RIGHT (not left). 'Minus goes right.'",
    "On rational equations, ALWAYS check for extraneous solutions.",
  ],
};
