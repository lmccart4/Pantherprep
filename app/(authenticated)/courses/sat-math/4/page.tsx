"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import {
  DomainRangeVisual,
  TransformationsVisual,
  CompositionVisual,
  NonlinearSystemsVisual,
  TrapTaxonomyVisual,
} from "./lesson-visuals";

export default function SATMathModule4() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/sat-math/5"
      nextModuleLabel="Module 5: Problem-Solving & Data Analysis"

      visuals={{
        "domain-range": <DomainRangeVisual />,
        "transformations": <TransformationsVisual />,
        "composition": <CompositionVisual />,
        "nonlinear-systems": <NonlinearSystemsVisual />,
        "traps": <TrapTaxonomyVisual />,
      }}

      activities={{
        "exercise-evals": (goNext: () => void) => (
          <FillInExercise
            items={EVALS_EXERCISE_DATA}
            title="Function Evaluator"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-dr-qs": (goNext: () => void) => (
          <MatchingExercise
            items={DR_QS_EXERCISE_DATA}
            title="Domain & Range"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-tfs": (goNext: () => void) => (
          <MatchingExercise
            items={TFS_EXERCISE_DATA}
            title="Transformations"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-comps": (goNext: () => void) => (
          <FillInExercise
            items={COMPS_EXERCISE_DATA}
            title="Composition"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-beh-qs": (goNext: () => void) => (
          <MatchingExercise
            items={BEH_QS_EXERCISE_DATA}
            title="Function Behavior"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
 * MODULE 4 — Advanced Math: Functions & Properties
 * ═══════════════════════════════════════════════════════ */

const EVALS_EXERCISE_DATA: FillInItem[] = [
  {
    "prompt": "f(x) = 3x − 7. Find f(4).",
    "answer": 5,
    "solution": "3(4) − 7 = 12 − 7 = 5"
  },
  {
    "prompt": "g(x) = x² + 1. Find g(−3).",
    "answer": 10,
    "solution": "(−3)² + 1 = 9 + 1 = 10"
  },
  {
    "prompt": "h(x) = 2x² − x. Find h(5).",
    "answer": 45,
    "solution": "2(5²) − 5 = 50 − 5 = 45"
  },
  {
    "prompt": "f(x) = x³ − 2x. Find f(−2).",
    "answer": -4,
    "solution": "(−2)³ − 2(−2) = −8 + 4 = −4"
  },
  {
    "prompt": "p(x) = 4x + 10. Find p(0).",
    "answer": 10,
    "solution": "4(0) + 10 = 10. This is the y-intercept!"
  },
  {
    "prompt": "f(x) = (x + 1)(x − 3). Find f(3).",
    "answer": 0,
    "solution": "(3+1)(3−3) = (4)(0) = 0. $x = 3$ is a zero of f!"
  },
  {
    "prompt": "g(x) = |2x − 8|. Find g(1).",
    "answer": 6,
    "solution": "|2(1) − 8| = |−6| = 6"
  },
  {
    "prompt": "f(x) = 100(0.5)ˣ. Find f(3).",
    "answer": 12.5,
    "solution": "100(0.5)³ = 100(0.125) = 12.5. Exponential decay!"
  }
];

const DR_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "f(x) = 1/(x − 3). What is the domain?",
    "options": [
      "All real numbers except $x = 3$",
      "x > 0",
      "x ≥ 3",
      "All real numbers"
    ],
    "correct": 0,
    "explanation": "Denominator can't be 0. $x − 3 = 0$ when $x = 3$, so exclude $x = 3$."
  },
  {
    "prompt": "f(x) = √(x − 5). What is the domain?",
    "options": [
      "x ≥ 5",
      "All real numbers",
      "x > 5",
      "x ≥ 0"
    ],
    "correct": 0,
    "explanation": "Expression under square root must be ≥ 0. $x − 5 ≥ 0$ → $x ≥ 5$."
  },
  {
    "prompt": "f(x) = x² + 1. What is the range?",
    "options": [
      "y ≥ 0",
      "All real numbers",
      "y > 1",
      "y ≥ 1"
    ],
    "correct": 3,
    "explanation": "x² is always ≥ 0, so $x² + 1 ≥ 1$. Minimum output is 1 (when $x = 0$)."
  },
  {
    "prompt": "f(x) = −(x − 2)² + 9. What is the range?",
    "options": [
      "y ≤ 9",
      "y ≥ −9",
      "All real numbers",
      "y ≥ 9"
    ],
    "correct": 0,
    "explanation": "Vertex at (2, 9), opens downward ($a = −1$). Maximum output is 9."
  },
  {
    "prompt": "A function models the height of a ball: h(t) = −16t² + 64t. What is a reasonable domain?",
    "options": [
      "t > 0",
      "t ≥ 0",
      "0 ≤ t ≤ 4",
      "All real numbers"
    ],
    "correct": 1,
    "explanation": "In context, time can't be negative. The ball hits the ground at $t = 4$, so 0 ≤ $t ≤ 4$ is the most precise domain (but $t ≥ 0$ is the contextual minimum)."
  },
  {
    "prompt": "f(x) = |x|. What is the range?",
    "options": [
      "y > 0",
      "y ≥ 0",
      "All real numbers",
      "y ≥ 1"
    ],
    "correct": 1,
    "explanation": "Absolute value is always non-negative. |x| ≥ 0 for all x. Range is $y ≥ 0$."
  }
];

const TFS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Original: f(x)\nTransformed: f(x) + 5",
    "options": [
      "Shift DOWN 5",
      "Shift RIGHT 5",
      "Shift UP 5",
      "Vertical stretch by 5"
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "Original: f(x)\nTransformed: f(x \u2212 4)",
    "options": [
      "Shift UP 4",
      "Shift DOWN 4",
      "Shift RIGHT 4",
      "Shift LEFT 4"
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "Original: f(x)\nTransformed: \u2212f(x)",
    "options": [
      "Reflect over y-axis",
      "Reflect over x-axis",
      "Vertical compress",
      "Shift DOWN 1"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "Original: f(x)\nTransformed: f(x + 2) \u2212 3",
    "options": [
      "Shift LEFT 2, UP 3",
      "Shift RIGHT 2, UP 3",
      "Shift RIGHT 2, DOWN 3",
      "Shift LEFT 2, DOWN 3"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "Original: f(x)\nTransformed: 3f(x)",
    "options": [
      "Vertical stretch by 3",
      "Horizontal stretch by 3",
      "Shift UP 3",
      "Shift RIGHT 3"
    ],
    "correct": 0,
    "explanation": ""
  },
  {
    "prompt": "Original: f(x)\nTransformed: f(\u2212x)",
    "options": [
      "Reflect over y-axis",
      "Shift LEFT",
      "Reflect over x-axis",
      "No change"
    ],
    "correct": 0,
    "explanation": ""
  },
  {
    "prompt": "Original: f(x) = x\u00b2\nTransformed: g(x) = (x \u2212 1)\u00b2 + 6",
    "options": [
      "Shift LEFT 1, UP 6",
      "Shift RIGHT 1, DOWN 6",
      "Shift LEFT 1, DOWN 6",
      "Shift RIGHT 1, UP 6"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "Original: f(x) = x\u00b2\nTransformed: g(x) = \u00bdx\u00b2",
    "options": [
      "Shift DOWN ½",
      "Vertical stretch (steeper)",
      "Vertical compression (flatter)",
      "Horizontal stretch"
    ],
    "correct": 2,
    "explanation": ""
  }
];

const COMPS_EXERCISE_DATA: FillInItem[] = [
  {
    "prompt": "Find f(g(5)).",
    "answer": 5,
    "solution": "g(5) = 5 − 3 = 2. Then f(2) = 2(2) + 1 = 5."
  },
  {
    "prompt": "Find f(g(1)).",
    "answer": 25,
    "solution": "g(1) = 1 + 4 = 5. Then f(5) = 5² = 25."
  },
  {
    "prompt": "Find g(f(1)).",
    "answer": 5,
    "solution": "f(1) = 1² = 1. Then g(1) = 1 + 4 = 5. Note: g(f(1)) ≠ f(g(1))!"
  },
  {
    "prompt": "Find f(g(3)).",
    "answer": 24,
    "solution": "g(3) = 9 − 1 = 8. Then f(8) = 3(8) = 24."
  },
  {
    "prompt": "Find g(f(−4)).",
    "answer": 6,
    "solution": "f(−4) = −4 + 7 = 3. Then g(3) = 2(3) = 6."
  },
  {
    "prompt": "Find f(g(3)).",
    "answer": 7,
    "solution": "g(3) = 3 − 10 = −7. Then f(−7) = |−7| = 7. Absolute value makes it positive!"
  },
  {
    "prompt": "Find f(g(2)).",
    "answer": 8,
    "solution": "g(2) = |2 − 5| = |−3| = 3. Then f(3) = 9 − 1 = 8. Nested with absolute value!"
  },
  {
    "prompt": "Find f(f(3)). (Composing f with itself!)",
    "answer": 15,
    "solution": "f(3) = 2(3) + 1 = 7. Then f(7) = 2(7) + 1 = 15. Self-composition!"
  }
];

const BEH_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "f(x) = 3x + 5. As x increases, f(x)…",
    "options": [
      "Always increases (positive slope)",
      "Stays constant",
      "Always decreases",
      "Increases then decreases"
    ],
    "correct": 0,
    "explanation": "Linear with positive slope ($m = 3$). Always increasing."
  },
  {
    "prompt": "f(x) = −x² + 4. On the interval $x > 0$, f(x)…",
    "options": [
      "Decreases",
      "Increases then decreases",
      "Stays constant",
      "Increases"
    ],
    "correct": 0,
    "explanation": "This is a downward parabola with vertex at (0, 4). For $x > 0$, we're on the right side of the vertex → decreasing."
  },
  {
    "prompt": "f(x) = 2ˣ. As x → −∞, f(x) approaches…",
    "options": [
      "−∞",
      "1",
      "0 (but never reaches it)",
      "2"
    ],
    "correct": 2,
    "explanation": "Exponential growth: as x gets very negative, 2ˣ gets tiny (0.5, 0.25, 0.125…) → approaches 0. The x-axis is a horizontal asymptote."
  },
  {
    "prompt": "f(x) = $1/x$. The graph has…",
    "options": [
      "A horizontal asymptote at $y = 1$",
      "No asymptotes",
      "A hole at $x = 0$",
      "A vertical asymptote at $x = 0$"
    ],
    "correct": 3,
    "explanation": "Can't divide by 0, so $x = 0$ is a vertical asymptote. The graph approaches but never touches the y-axis."
  },
  {
    "prompt": "f(x) = |x − 3|. The minimum value of f(x) is…",
    "options": [
      "−3, occurring at $x = 0$",
      "0, occurring at $x = 3$",
      "3, occurring at $x = 0$",
      "No minimum"
    ],
    "correct": 1,
    "explanation": "|x − 3| ≥ 0 always. It equals 0 when $x = 3$. The vertex of the V-shape is at (3, 0)."
  },
  {
    "prompt": "f(x) = x³. The end behavior is…",
    "options": [
      "As x → −∞, f → −∞; as x → +∞, f → +∞",
      "As x → −∞, f → +∞; as x → +∞, f → −∞",
      "Both ends go up",
      "Both ends go down"
    ],
    "correct": 0,
    "explanation": "Odd degree, positive leading coefficient → left goes down, right goes up."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "math",
  moduleNum: 4,
  title: "Advanced Math — Functions & Properties",
  subtitle:
    "Function notation, transformations, and composition",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-evals", label: "Function Evaluator", icon: "zap" },
    { id: "exercise-dr-qs", label: "Domain & Range", icon: "zap" },
    { id: "exercise-tfs", label: "Transformations", icon: "zap" },
    { id: "exercise-comps", label: "Composition", icon: "zap" },
    { id: "exercise-beh-qs", label: "Function Behavior", icon: "zap" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARM-UP (Module 3 Retrieval) ──────── */
  warmup: [
    {
      source: "Module 3 — Quadratic Forms",
      stem: "The three forms of a quadratic are standard, vertex, and ___?",
      choices: ["Expanded", "Linear", "Factored", "Simplified"],
      correct: 2,
      explanation:
        "The three forms are standard ($ax^2 + bx + c$), vertex ($a(x - h)^2 + k$), and factored ($a(x - r)(x - s)$). Each reveals different information.",
    },
    {
      source: "Module 3 — Discriminant",
      stem: "The discriminant $b^2 - 4ac = 0$ means the equation has how many solutions?",
      choices: [
        "0 solutions",
        "2 solutions",
        "Infinite solutions",
        "1 solution"
      ],
      correct: 3,
      explanation:
        "When the discriminant equals zero, the quadratic has exactly one real solution (a double root). The parabola touches the x-axis at its vertex.",
    },
    {
      source: "Module 3 — Vertex",
      stem: "The x-coordinate of the vertex of $y = ax^2 + bx + c$ is given by?",
      choices: [
        "$x = -c/b$",
        "$x = 2a/b$",
        "$x = -b/(2a)$",
        "$x = b/2a$"
      ],
      correct: 2,
      explanation:
        "The vertex x-coordinate is $x = -b/(2a)$. Plug this back into the equation to find the y-coordinate (the min or max value).",
    },
    {
      source: "Module 3 — Exponents",
      stem: "Simplify: $x^5 \\cdot x^3$",
      choices: ["$x^{15}$", "$x^8$", "$8x$", "$x^2$"],
      correct: 1,
      explanation:
        "Product rule: when multiplying same bases, ADD the exponents. $x^5 \\cdot x^3 = x^{5+3} = x^8$.",
    },
    {
      source: "Module 3 — Growth/Decay",
      stem: "A population that doubles every year follows which type of function?",
      choices: [
        "Linear decay",
        "Exponential decay",
        "Linear growth",
        "Exponential growth"
      ],
      correct: 3,
      explanation:
        "Doubling = multiplying by 2 each period. Constant multiplier = exponential growth. Linear would be adding a fixed amount each time.",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    /* ── Big Picture ── */
    {
      id: "big-picture",
      title: "Why Functions Matter",
      subtitle: "The language of Advanced Math",
      body: [
        "A function is a machine: you put in an input (x), it runs a rule, and you get an output f(x).",
        "**Domain** = all allowed inputs. **Range** = all possible outputs.",
        "Almost every Advanced Math question involves functions in some form. The SAT tests whether you can evaluate them, transform them, compose them, and find where they intersect.",
      ],
    },

    /* ── Topic 4A: Function Notation & Evaluation ── */
    {
      id: "topic-4a-notation",
      title: "Topic 4A — Function Notation & Evaluation",
      subtitle: "Substitution, evaluation from equations, tables, and graphs",
      body: [
        "`f(x) = 2x + 3` is NOT f times x. It means \"the function f, applied to input x.\"",
        "**f(5)** means: substitute 5 for x \u2192 2(5) + 3 = 13.",
        "**f(a + 1)** means: substitute (a + 1) for every x \u2192 2(a + 1) + 3 = 2a + 5.",
        "**f(x) = 0** means: find which x values make the output zero (the zeros/roots).",
        "You can evaluate functions from equations, tables, or graphs. On a graph, f(3) means \"go to $x = 3$ and read the y-value.\"",
      ],
    },
    {
      id: "topic-4a-domain-range",
      title: "Domain & Range",
      subtitle: "Restrictions, contextual domains, identifying range",
      visual: "domain-range",
      body: [
        "**Domain:** All x-values for which the function is defined.",
        "**Range:** All y-values the function actually outputs.",
        "Common domain restrictions on the SAT:",
        "\u2022 **Fractions:** Denominator \u2260 0",
        "\u2022 **Square roots:** Expression under radical \u2265 0",
        "\u2022 **Context:** If x represents time or quantity, x \u2265 0",
        "For range, think about what y-values are possible. A parabola opening up with vertex at (2, \u22123) has range y \u2265 \u22123.",
      ],
    },
    {
      id: "topic-4a-context",
      title: "Interpreting Function Values in Context",
      subtitle: "Initial values, rates, and what constants represent",
      body: [
        "The SAT loves word problems where functions model real situations. Key translations:",
        "\u2022 **f(0)** = the initial/starting value",
        "\u2022 **The slope (or rate of change)** = the \"per\" value (per hour, per item, etc.)",
        "\u2022 **f(x) = 0** = when does the quantity reach zero?",
        "\u2022 \"What does the 12 represent in f(t) = 12 + 3t?\" \u2192 The initial value of 12 (the y-intercept)",
        "\u2022 \"What does the 3 represent?\" \u2192 The rate of change: it increases by 3 per unit of t",
      ],
    },

    /* ── Topic 4B: Transformations ── */
    {
      id: "topic-4b",
      title: "Topic 4B — Function Transformations",
      subtitle: "Predicting how a graph changes when the equation changes",
      visual: "transformations",
      body: [
        "The SAT tests whether you can predict how a graph changes when the equation changes. Memorize these transformations:",
        "\u2022 **f(x) + k** \u2192 Shift UP k units",
        "\u2022 **f(x) \u2212 k** \u2192 Shift DOWN k units",
        "\u2022 **f(x \u2212 h)** \u2192 Shift RIGHT h units",
        "\u2022 **f(x + h)** \u2192 Shift LEFT h units",
        "\u2022 **a\u00B7f(x)**, $a > 1$ \u2192 Vertical stretch (steeper/taller)",
        "\u2022 **a\u00B7f(x)**, 0 < $a < 1$ \u2192 Vertical compression (flatter/shorter)",
        "\u2022 **\u2212f(x)** \u2192 Reflect over x-axis",
        "\u2022 **f(\u2212x)** \u2192 Reflect over y-axis",
        "**The #1 Trap:** Horizontal transformations work *backward*. `f(x \u2212 3)` shifts **RIGHT** 3, not left. The input needs to be 3 bigger to get the same output, so the graph moves right.",
        "**Desmos Tip:** Graph `f(x) = x\u00B2` on line 1, then type `(x \u2212 3)\u00B2` on line 2. Watch the parabola shift right.",
      ],
    },

    /* ── Topic 4C: Composition ── */
    {
      id: "topic-4c",
      title: "Topic 4C — Composition of Functions",
      subtitle: "f(g(x)) \u2014 The Inside-Out Rule",
      visual: "composition",
      body: [
        "**f(g(x))** means: apply g first, then apply f to the result.",
        "Think of it as two machines in sequence: x goes into g, the output goes into f.",
        "**Example:** If f(x) = x\u00B2 and g(x) = x + 3:",
        "f(g(2)) \u2192 g(2) = 2 + 3 = 5 \u2192 f(5) = 5\u00B2 = **25**",
        "g(f(2)) \u2192 f(2) = 2\u00B2 = 4 \u2192 g(4) = 4 + 3 = **7**",
        "Notice: f(g(x)) \u2260 g(f(x)) in general! Order matters.",
        "**To find f(g(x)) algebraically:** Replace every x in f's formula with the entire expression for g(x).",
        "f(g(x)) = f(x + 3) = (x + 3)\u00B2 = x\u00B2 + 6x + 9",
        "**SAT Pattern:** Composition questions usually give you two simple functions and ask for f(g(specific number)). Work inside-out: evaluate g first, then plug the result into f.",
      ],
    },

    /* ── Topic 4D: Nonlinear Systems ── */
    {
      id: "topic-4d",
      title: "Topic 4D — Nonlinear Systems",
      subtitle: "Intersections of lines and curves",
      visual: "nonlinear-systems",
      body: [
        "When the SAT gives you a system where one equation is linear and one is quadratic (or both nonlinear), you can solve by substitution \u2014 or graph both in Desmos.",
        "A line-parabola system can have **2 intersections** (line crosses parabola), **1 intersection** (line is tangent), or **0 intersections** (no contact).",
        "**Method 1: Substitution** \u2014 Set the two equations equal. Rearrange to standard form. Solve the resulting equation. Plug solutions back in to find y-values.",
        "**Method 2: Desmos** \u2014 Graph both equations and click the intersection points.",
        "**Key insight:** The discriminant of the resulting equation tells you how many intersection points exist.",
      ],
    },
    {
      id: "topic-4d-parameter",
      title: "Systems with a Parameter",
      subtitle: "Finding k for one solution, tangent lines",
      body: [
        "A harder SAT question type: \"For what value of k does the system have exactly one solution?\"",
        "**Strategy:** Set the equations equal, rearrange to standard form, then set the discriminant = 0.",
        "**Desmos Power Move:** Use a slider for k and watch the line move until it's tangent to the parabola.",
      ],
    },

    /* ── Trap Taxonomy ── */
    {
      id: "traps",
      title: "Four Traps in Function Questions",
      subtitle: "Learn them by name to spot them instantly",
      visual: "traps",
      body: [
        "**Trap 1: Horizontal Flip** \u2014 Confused the direction of a horizontal transformation. f(x \u2212 3) shifts RIGHT, not left. The sign is opposite to what most students expect.",
        "**Trap 2: Wrong Target** \u2014 Solved for x when they asked for f(x), or found f(x) when they asked for x. Always underline exactly what the question asks for.",
        "**Trap 3: Imposter Domain** \u2014 Forgot a domain restriction. Especially dangerous with fractions (denominator \u2260 0) and square roots (radicand \u2265 0).",
        "**Trap 4: Composition Swap** \u2014 Evaluated f(g(x)) as g(f(x)) \u2014 or the reverse. Order matters in composition. Always work inside-out.",
      ],
    },
  ],

  /* ──────── QUIZ (Timed Practice) ──────── */
  quiz: [
    {
      stem: "If f(x) = 4x \u2212 9, what is the value of f(3)?",
      choices: ["21", "\u22129", "3", "12"],
      correct: 2,
      explanation: "f(3) = 4(3) \u2212 9 = 12 \u2212 9 = 3.",
      difficulty: "easy",
      type: "4A",
      trap: undefined,
      trapAnswer: 1,
      trapDesc: "Evaluated 4(3) but forgot to subtract 9",
      domain: "Advanced Math",
      skill: "exponential_functions",
    },
    {
      stem: "The graph of g(x) = x\u00B2 is shifted 5 units to the right. Which equation represents the new graph?",
      choices: [
        "g(x) = x\u00B2 \u2212 5",
        "g(x) = (x \u2212 5)\u00B2",
        "g(x) = (x + 5)\u00B2",
        "g(x) = x\u00B2 + 5"
      ],
      correct: 1,
      explanation:
        "Shifting right h units: f(x \u2212 h). So (x \u2212 5)\u00B2. Horizontal shifts work backward!",
      difficulty: "easy",
      type: "4B",
      trap: "horizontal_flip",
      trapAnswer: 1,
      trapDesc: "Confused direction of horizontal shift \u2014 Horizontal Flip",
      domain: "Advanced Math",
      skill: "exponential_functions",
    },
    {
      stem: "If f(x) = x + 2 and g(x) = 3x, what is g(f(4))?",
      choices: ["18", "6", "10", "14"],
      correct: 0,
      explanation: "f(4) = 4 + 2 = 6. Then g(6) = 3(6) = 18.",
      difficulty: "easy",
      type: "4C",
      trap: "composition_swap",
      trapAnswer: 0,
      trapDesc:
        "Evaluated f(g(4)) instead of g(f(4)) \u2014 Composition Swap",
      domain: "Advanced Math",
      skill: "exponential_functions",
    },
    {
      stem: "The function f(x) = \u22122(x + 3)\u00B2 + 8 has a vertex at:",
      choices: ["(\u22123, 8)", "(3, \u22128)", "(\u22123, \u22128)", "(3, 8)"],
      correct: 0,
      explanation:
        "f(x) = \u22122(x \u2212 (\u22123))\u00B2 + 8. Vertex: (\u22123, 8).",
      difficulty: "medium",
      type: "4B",
      trap: "horizontal_flip",
      trapAnswer: 0,
      trapDesc: "Took the sign of h at face value \u2014 Horizontal Flip",
      domain: "Advanced Math",
      skill: "exponential_functions",
    },
    {
      stem: "If f(x) = x\u00B2 \u2212 4 and the domain is restricted to x \u2265 0, what is the range?",
      choices: [
        "y \u2265 4",
        "y \u2265 \u22124",
        "y \u2265 0",
        "All real numbers"
      ],
      correct: 1,
      explanation:
        "When $x = 0$, f(0) = \u22124 (minimum). As x increases, f(x) increases. Range: y \u2265 \u22124.",
      difficulty: "medium",
      type: "4A",
      trap: "imposter_domain",
      trapAnswer: 1,
      trapDesc:
        "Ignored that f(0) = \u22124 because x \u2265 0 includes 0 \u2014 Imposter Domain",
      domain: "Advanced Math",
      skill: "exponential_functions",
    },
    {
      stem: "$y =$ f(x) is reflected over the x-axis and shifted up 3. The result is:",
      choices: [
        "$y =$ \u2212f(x + 3)",
        "$y =$ f(\u2212x + 3)",
        "$y =$ f(\u2212x) + 3",
        "$y =$ \u2212f(x) + 3"
      ],
      correct: 3,
      explanation:
        "Reflect over x-axis: \u2212f(x). Then shift up 3: \u2212f(x) + 3.",
      difficulty: "medium",
      type: "4B",
      trap: "horizontal_flip",
      trapAnswer: 1,
      trapDesc:
        "Used f(\u2212x) instead of \u2212f(x) for x-axis reflection \u2014 Horizontal Flip",
      domain: "Advanced Math",
      skill: "exponential_functions",
    },
    {
      stem: "f(x) = \u221A(2x \u2212 6). What is the domain?",
      choices: [
        "x \u2265 6",
        "x \u2265 0",
        "All real numbers",
        "x \u2265 3"
      ],
      correct: 3,
      explanation:
        "Need 2x \u2212 6 \u2265 0 \u2192 2x \u2265 6 \u2192 x \u2265 3.",
      difficulty: "medium",
      type: "4A",
      trap: "imposter_domain",
      trapAnswer: 2,
      trapDesc:
        "Set 2x \u2212 6 = 6 instead of 2x \u2212 6 \u2265 0 \u2014 Imposter Domain",
      domain: "Advanced Math",
      skill: "exponential_functions",
    },
    {
      stem: "The system $y =$ x\u00B2 + 2 and $y = 4x$ \u2212 1 has how many real solutions?",
      choices: ["2", "Infinitely many", "1", "0"],
      correct: 0,
      explanation:
        "Set equal: x\u00B2 + 2 = 4x \u2212 1 \u2192 x\u00B2 \u2212 $4x + 3 = 0$ \u2192 (x\u22121)(x\u22123) = 0. Two solutions.",
      difficulty: "hard",
      type: "4D",
      domain: "Advanced Math",
      skill: "exponential_functions",
    },
    {
      stem: "If f(x) = 2x + 3, what is f(f(2))?",
      choices: ["37", "14", "7", "17"],
      correct: 3,
      explanation: "f(2) = 2(2) + 3 = 7. Then f(7) = 2(7) + 3 = 17.",
      difficulty: "hard",
      type: "4C",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc:
        "Stopped after computing f(2) instead of f(f(2)) \u2014 Wrong Target",
      domain: "Advanced Math",
      skill: "exponential_functions",
    },
    {
      stem: "The graph of $y =$ f(x) passes through (2, 5). After the transformation $y =$ 3f(x \u2212 1) + 2, what point must be on the new graph?",
      choices: ["(3, 17)", "(2, 17)", "(3, 15)", "(1, 17)"],
      correct: 0,
      explanation:
        "x \u2212 1 = 2 \u2192 $x = 3$. $y =$ 3\u00B7f(2) + 2 = 3(5) + 2 = 17. The point (3, 17) is on the new graph.",
      difficulty: "hard",
      type: "4B",
      trap: "horizontal_flip",
      trapAnswer: 1,
      trapDesc:
        "Subtracted 1 from x instead of adding \u2014 Horizontal Flip",
      domain: "Advanced Math",
      skill: "exponential_functions",
    },
  ],
  takeaways: [
    "f(x) means \"apply function f to input x\" \u2014 substitute x everywhere in the formula.",
    "Domain = allowed inputs, Range = possible outputs. Watch for division by zero and negative square roots.",
    "Horizontal transformations work backward: f(x \u2212 3) shifts RIGHT, f(x + 3) shifts LEFT.",
    "Composition f(g(x)): work inside-out. Evaluate g first, then plug into f.",
    "Increasing functions go up as x increases; decreasing functions go down. The SAT tests this conceptually.",
    "For nonlinear systems: set equations equal, rearrange, and use the discriminant to count solutions.",
    "In context questions, identify what the constants and coefficients REPRESENT.",
  ],
};
