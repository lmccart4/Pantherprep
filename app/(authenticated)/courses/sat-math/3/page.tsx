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
} from "./lesson-visuals";

const FORM_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: f(x) = 2(x − 3)(x + 1)",
    "answer": "Factored",
    "solution": "x-intercepts at x = 3 and x = −1"
  },
  {
    "prompt": "Solve: f(x) = x² − 6x + 8",
    "answer": "Standard",
    "solution": "y-intercept at (0, 8), opens upward (a = 1 > 0)"
  },
  {
    "prompt": "Solve: f(x) = −3(x + 2)² + 7",
    "answer": "Vertex",
    "solution": "Vertex at (−2, 7), opens downward, so 7 is the maximum"
  },
  {
    "prompt": "Solve: g(x) = (x − 5)(x − 5)",
    "answer": "Factored",
    "solution": "Double root at x = 5 — parabola touches x-axis once. Also vertex form: (x−5)²"
  },
  {
    "prompt": "Solve: h(x) = 4x² + 12x − 7",
    "answer": "Standard",
    "solution": "y-intercept at (0, −7), opens upward (a = 4 > 0)"
  },
  {
    "prompt": "Solve: y = −(x − 1)² − 4",
    "answer": "Vertex",
    "solution": "Vertex at (1, −4), opens downward, −4 is the maximum"
  },
  {
    "prompt": "Solve: p(x) = ½(x + 6)(x − 2)",
    "answer": "Factored",
    "solution": "x-intercepts at x = −6 and x = 2"
  },
  {
    "prompt": "Solve: f(x) = 5(x − 4)² + 0",
    "answer": "Vertex",
    "solution": "Vertex at (4, 0) — the vertex IS on the x-axis. Min value is 0."
  }
];

const WF_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "The question asks: \"What is the maximum height the ball reaches?\"",
    "answer": "Vertex",
    "solution": "Maximum/minimum → you need the vertex → Vertex Form f(x) = a(x − h)² + k. The max/min is k."
  },
  {
    "prompt": "The question asks: \"At what times does the ball hit the ground?\"",
    "answer": "Factored",
    "solution": "Hitting the ground = height of 0 = x-intercepts → Factored Form f(x) = a(x − r)(x − s). Set f(x) = 0."
  },
  {
    "prompt": "The question asks: \"What is the initial height of the projectile?\"",
    "answer": "Standard",
    "solution": "Initial height = value when x = 0 = y-intercept → Standard Form f(x) = ax² + bx + c. The y-intercept is c."
  },
  {
    "prompt": "The question asks: \"Does the parabola open upward or downward?\"",
    "answer": "Standard",
    "solution": "Direction is determined by the sign of a. While all three forms show a, Standard Form makes it most immediately visible."
  },
  {
    "prompt": "The question gives: \"f(x) = 0 when x = −3 and x = 7\" and asks for the equation.",
    "answer": "Factored",
    "solution": "Given the zeros/roots → build Factored Form: f(x) = a(x + 3)(x − 7). If they give another point, solve for a."
  },
  {
    "prompt": "The question asks: \"How many real solutions does 2x² − 5x + 4 = 0 have?\"",
    "answer": "Standard",
    "solution": "Number of solutions → Discriminant → needs a, b, c from Standard Form. b² − 4ac = 25 − 32 = −7 < 0 → no real solutions."
  },
  {
    "prompt": "The question gives a graph with vertex at (3, −2) and asks for the equation.",
    "answer": "Vertex",
    "solution": "Given the vertex → Vertex Form: f(x) = a(x − 3)² + (−2). Use another point to find a."
  },
  {
    "prompt": "The question asks: \"What value of x gives the minimum value of f(x) = x² − 8x + 12?\"",
    "answer": "Vertex",
    "solution": "Minimum value → vertex x-coordinate → use x = −b/2a = −(−8)/2(1) = 4. Or convert to vertex form."
  }
];

const FACTOR_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Factor: x² + 7x + 12",
    "answer": "(x+3)(x+4)",
    "solution": "Find numbers that multiply to 12 and add to 7: 3 and 4 → (x + 3)(x + 4) (Standard Trinomial)"
  },
  {
    "prompt": "Factor: x² − 16",
    "answer": "(x+4)(x-4)",
    "solution": "x² − 16 = (x + 4)(x − 4) (Difference of Squares)"
  },
  {
    "prompt": "Factor: 2x² + 6x",
    "answer": "2x(x+3)",
    "solution": "GCF = 2x → 2x(x + 3) (GCF)"
  },
  {
    "prompt": "Factor: x² − 5x − 6",
    "answer": "(x-6)(x+1)",
    "solution": "Numbers that multiply to −6 and add to −5: −6 and 1 → (x − 6)(x + 1) (Standard Trinomial)"
  },
  {
    "prompt": "Factor: x² + 10x + 25",
    "answer": "(x+5)^2",
    "solution": "x² + 10x + 25 = (x + 5)² [perfect square: 5² = 25, 2(5) = 10] (Perfect Square)"
  },
  {
    "prompt": "Factor: 4x² − 9",
    "answer": "(2x+3)(2x-3)",
    "solution": "(2x)² − 3² = (2x + 3)(2x − 3) (Difference of Squares)"
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
      "$x^8$",
      "$x^6$",
      "$4x^2$",
      "$x^2$"
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
    "prompt": "1",
    "options": [
      "5",
      "0",
      "undefined",
      "1"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "$\\frac{1}{x^3}$",
    "options": [
      "$x^3$",
      "$\\frac{1}{x^3}$",
      "$-x^3$",
      "$-3x$"
    ],
    "correct": 1,
    "explanation": ""
  },
  {
    "prompt": "2",
    "options": [
      "2.67",
      "8/3",
      "4",
      "2"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "9",
    "options": [
      "3",
      "81",
      "18",
      "9"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "$4x^6$",
    "options": [
      "$2x^6$",
      "$4x^6$",
      "$2x^5$",
      "$4x^5$"
    ],
    "correct": 0,
    "explanation": ""
  },
  {
    "prompt": "1",
    "options": [
      "1",
      "0",
      "$x^0$",
      "$x^8$"
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

const GD_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "$f(t) = 500(1.08)^t$",
    "options": [
      "Growth — 8%",
      "Decay — 8%",
      "Decay — 92%",
      "Growth — 1.08%"
    ],
    "correct": 0,
    "explanation": "Base is 1.08 > 1 → growth. Rate = 1.08 − 1 = 0.08 = 8%."
  },
  {
    "prompt": "$f(t) = 1200(0.95)^t$",
    "options": [
      "Decay — 5%",
      "Decay — 95%",
      "Growth — 95%",
      "Growth — 5%"
    ],
    "correct": 0,
    "explanation": "Base is 0.95 < 1 → decay. Rate = 1 − 0.95 = 0.05 = 5%."
  },
  {
    "prompt": "$f(t) = 80(1.005)^t$",
    "options": [
      "Growth — 0.5%",
      "Decay — 0.5%",
      "Growth — 5%",
      "Growth — 1.005%"
    ],
    "correct": 0,
    "explanation": "Base is 1.005 > 1 → growth. Rate = 0.005 = 0.5%. Small rate, but it compounds!"
  },
  {
    "prompt": "$f(t) = 10000(0.7)^t$",
    "options": [
      "Decay — 30%",
      "Growth — 70%",
      "Decay — 7%",
      "Decay — 70%"
    ],
    "correct": 0,
    "explanation": "Base is 0.7 < 1 → decay. Rate = 1 − 0.7 = 0.30 = 30%. Common trap: confusing 70% remaining with 30% lost."
  },
  {
    "prompt": "$P = 250(2)^t$",
    "options": [
      "Growth — 200%",
      "Decay — 50%",
      "Growth — 2%",
      "Growth — 100%"
    ],
    "correct": 3,
    "explanation": "Base is 2 > 1 → growth. Rate = 2 − 1 = 1 = 100% (doubling each period). Not 200%!"
  },
  {
    "prompt": "$A = 5000(1 - 0.12)^t$",
    "options": [
      "Decay — 88%",
      "Growth — 88%",
      "Decay — 12%",
      "Growth — 12%"
    ],
    "correct": 2,
    "explanation": "Written as (1 − 0.12) = 0.88 → base < 1 → decay at 12% per period."
  },
  {
    "prompt": "The table shows: Year 0: 400, Year 1: 440, Year 2: 484, Year 3: 532.4",
    "options": [
      "Linear — adds 40",
      "Growth — 10%",
      "Growth — 40%",
      "Decay — 10%"
    ],
    "correct": 1,
    "explanation": "440/400 = 1.1, 484/440 = 1.1, 532.4/484 = 1.1. Constant multiplier → exponential growth at 10%."
  },
  {
    "prompt": "The table shows: Year 0: 200, Year 1: 250, Year 2: 300, Year 3: 350",
    "options": [
      "Decay — 25%",
      "Linear — not exponential",
      "Growth — 25%",
      "Growth — 50"
    ],
    "correct": 1,
    "explanation": "250 − 200 = 50, 300 − 250 = 50, 350 − 300 = 50. Constant addend → LINEAR, not exponential. Trap: seeing growth and assuming exponential."
  }
];

export default function SATMathModule3() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}

      visuals={{
        "quadratic-forms": <QuadraticFormsVisual />,
        "discriminant": <DiscriminantVisual />,
        "factoring": <FactoringVisual />,
        "exponent-rules": <ExponentRulesVisual />,
        "growth-decay": <GrowthDecayVisual />,
      }}

      activities={{
        "exercise-form-qs": (goNext: () => void) => (
          <FillInExercise
            items={FORM_QS_EXERCISE}
            title="Form"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-wf-qs": (goNext: () => void) => (
          <FillInExercise
            items={WF_QS_EXERCISE}
            title="Which Form?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-factor-qs": (goNext: () => void) => (
          <FillInExercise
            items={FACTOR_QS_EXERCISE}
            title="Factor"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-exps": (goNext: () => void) => (
          <MatchingExercise
            items={EXPS_EXERCISE}
            title="Exponent Rules"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-gd-qs": (goNext: () => void) => (
          <MatchingExercise
            items={GD_QS_EXERCISE}
            title="Growth or Decay?"
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

      nextModuleHref="/courses/sat-math/4"
      nextModuleLabel="Module 4: Functions & Properties"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "math",
  moduleNum: 3,
  title: "Advanced Math",
  subtitle:
    "The backbone of Advanced Math \u2014 master these and you control ~35% of the test.",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-form-qs", label: "Form Qs", icon: "zap" },
    { id: "exercise-wf-qs", label: "Which Form?", icon: "zap" },
    { id: "exercise-factor-qs", label: "Factor Qs", icon: "zap" },
    { id: "exercise-exps", label: "Exponent Rules", icon: "zap" },
    { id: "exercise-gd-qs", label: "Growth or Decay?", icon: "zap" },
    { id: "calculator", label: "Calculator", icon: "chart" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "topic-3a",
      title: "Quadratic Equations \u2014 The Three Forms",
      body: [
        "The SAT loves quadratics because they can be expressed in three different forms \u2014 and each form reveals different information.",
        "The key skill is knowing **which form to use** for each question. This single decision can be worth 40\u201360 points.",
      ],
      visual: "quadratic-forms",
    },
    {
      id: "discriminant",
      title: "The Discriminant: How Many Solutions?",
      body: [
        "The expression under the square root in the Quadratic Formula \u2014 **$b^2 - 4ac$** \u2014 is called the discriminant.",
        "It tells you how many real solutions the equation has. The SAT frequently asks: \u201cHow many solutions?\u201d or \u201cFor what value of k does the equation have no real solutions?\u201d",
      ],
      visual: "discriminant",
    },
    {
      id: "topic-3b",
      title: "Polynomials & Factoring",
      body: [
        "Factoring is the single most important mechanical skill for Advanced Math.",
        "Every technique has a pattern \u2014 learn to recognize which one applies, and factoring becomes fast and automatic.",
      ],
      visual: "factoring",
    },
    {
      id: "topic-3c",
      title: "Exponent Rules & Exponential Functions",
      body: [
        "Exponent rules are tested constantly on the SAT. Memorize each rule, recognize the pattern, and simplify with confidence.",
        "These seven rules cover every exponent question you'll see.",
      ],
      visual: "exponent-rules",
    },
    {
      id: "growth-decay",
      title: "Exponential Growth vs. Decay",
      body: [
        "Growth and decay questions test whether you can identify the base and interpret the rate.",
        "If the base is greater than 1, it's growth. If it's between 0 and 1, it's decay. The rate is always |base \u2212 1|.",
      ],
      visual: "growth-decay",
    },
    {
      id: "topic-3d",
      title: "Rational Expressions & Equations",
      body: [
        "A rational expression is a fraction with polynomials. To simplify: (1) factor both numerator and denominator completely, (2) cancel common factors.",
        "To solve rational equations: find the LCD, multiply through to clear fractions, solve, then **CHECK for extraneous solutions** \u2014 any value that makes a denominator zero must be rejected.",
      ],
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 2 — Slope",
      stem: "What is the slope of the line y = 3x − 7?",
      choices: ["−7", "−3", "7", "3"],
      correct: 3,
      explanation: "In y = mx + b, the slope is m. Here m = 3. The −7 is the y-intercept.",
    },
    {
      source: "Module 2 — Systems",
      stem: "A system with the same slope but different y-intercepts has how many solutions?",
      choices: ["Infinite solutions", "One solution", "0 (no solution)", "Cannot determine"],
      correct: 2,
      explanation: "Same slope + different y-intercepts = parallel lines = no solution. They never intersect.",
    },
    {
      source: "Module 2 — Inequalities",
      stem: "When solving an inequality and dividing by a negative number, what must you do?",
      choices: ["Change it to an equation", "Flip the inequality sign", "Add the number instead", "Multiply both sides by −1"],
      correct: 1,
      explanation: "When you divide (or multiply) by a negative number, you must FLIP the inequality sign.",
    },
    {
      source: "Module 2 — Traps",
      stem: "When the SAT says \"solve for x\" but the answer choices show y, this is which trap?",
      choices: ["One-Case Trap", "Percent Spiral", "Wrong Target", "Distribution Ghost"],
      correct: 2,
      explanation: "The Wrong Target trap: you solved for the right variable but the question asked for a different expression.",
    },
    {
      source: "Module 2 — Traps",
      stem: "Setting up part/whole × 100 when they asked for the whole, not the part. This is which trap?",
      choices: ["Percent Spiral", "Imposter Subject", "Wrong Target", "Sign Flip"],
      correct: 0,
      explanation: "The Percent Spiral: confusing which value is the part and which is the whole in percent problems.",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "What are the solutions of <code>x² − 5x + 6 = 0</code>?",
      choices: ["x = −2 and x = −3", "x = −1 and x = −6", "x = 2 and x = 3", "x = 1 and x = 6"],
      correct: 2,
      explanation: "Factor: (x − 2)(x − 3) = 0, so x = 2 or x = 3.",
      trapAnswer: 1,
      trapDesc: "Sign error on factors",
    },
    {
      stem: "What is the y-intercept of <code>f(x) = 3x² − 7x + 4</code>?",
      choices: ["(0, −7)", "(0, 4)", "(0, 0)", "(0, 3)"],
      correct: 1,
      explanation: "In standard form, the y-intercept is c. Here c = 4, so the y-intercept is (0, 4).",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Confused leading coefficient with y-intercept — The Wrong Target",
    },
    {
      stem: "Simplify: <code>x⁵ · x³ / x²</code>",
      choices: ["$x^8$", "$x^6$", "$x^{10}$", "$x^4$"],
      correct: 1,
      explanation: "$x^5 \\cdot x^3 = x^8$, then $x^8 / x^2 = x^6$.",
      trapAnswer: 1,
      trapDesc: "Forgot to subtract quotient exponent",
    },
    {
      stem: "The function <code>f(x) = −2(x − 4)² + 18</code> models the height of a ball. What is the maximum height?",
      choices: ["18", "20", "−2", "4"],
      correct: 0,
      explanation: "Vertex form: vertex is (4, 18). Since a = −2 < 0, the parabola opens downward, so 18 is the maximum.",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Picked the x-coordinate instead of the y-coordinate — The Wrong Target",
    },
    {
      stem: "For what value of k does <code>2x² + kx + 8 = 0</code> have exactly one real solution?",
      choices: ["k = 16", "k = ±8", "k = 8", "k = 4"],
      correct: 1,
      explanation: "One solution means discriminant = 0. $k^2 - 4(2)(8) = k^2 - 64 = 0 \\to k^2 = 64 \\to k = \\pm 8$.",
      trap: "one_case",
      trapAnswer: 1,
      trapDesc: "Only found the positive value — The One-Case Trap",
    },
    {
      stem: "Which expression is equivalent to <code>(x² − 9)/(x + 3)</code>?",
      choices: ["x² − 3", "x − 3", "(x − 3)/(x + 3)", "x + 3"],
      correct: 1,
      explanation: "Factor numerator: $x^2 - 9 = (x + 3)(x - 3)$. Cancel $(x + 3)$: result is $(x - 3)$.",
      trapAnswer: 2,
      trapDesc: "Failed to factor before simplifying",
    },
    {
      stem: "A population of 800 bacteria doubles every 3 hours. Which function models the population after t hours?",
      choices: ["P(t) = 1600^t", "P(t) = 800 + 2t", "P(t) = 800(2)^(3t)", "P(t) = 800(2)^(t/3)"],
      correct: 3,
      explanation: "Doubles → multiply by 2. Every 3 hours → exponent is t/3. P(t) = 800(2)^(t/3).",
      trap: "form_mismatch",
      trapAnswer: 2,
      trapDesc: "Used linear model for exponential situation — Form Mismatch",
    },
    {
      stem: "If <code>f(x) = ax² + bx + c</code> has roots at x = −1 and x = 5, and passes through (0, −10), what is a?",
      choices: ["a = 1", "a = 2", "a = −2", "a = −10"],
      correct: 1,
      explanation: "Factored form: f(x) = a(x + 1)(x − 5). Plug in (0, −10): −10 = a(1)(−5) = −5a → a = 2.",
      trap: "distribution_ghost",
      trapAnswer: 1,
      trapDesc: "Sign error when plugging in — The Distribution Ghost",
    },
    {
      stem: "If x² + bx + 7 = 0 has roots r and s, what is the value of r² + s²?",
      choices: ["$b^2 - 14$", "$b^2 + 14$", "$b^2 - 7$", "Cannot be determined"],
      correct: 0,
      explanation: "By Vieta's: $r + s = -b$ and $rs = 7$. Then $r^2 + s^2 = (r + s)^2 - 2rs = b^2 - 14$.",
      trapAnswer: 1,
      trapDesc: "Forgot to subtract 2rs from the squared sum",
    },
    {
      stem: "A projectile's height is <code>h(t) = −16t² + 96t + 5</code>. At what time does it reach maximum height, and what is that height?",
      choices: ["t = 3, h = 144", "t = 3, h = 149", "t = 6, h = 5", "t = 96, h = 5"],
      correct: 1,
      explanation: "Vertex x = −b/2a = −96/(2·−16) = 3. h(3) = −16(9) + 96(3) + 5 = −144 + 288 + 5 = 149. Max height is 149 at t = 3.",
      trap: "wrong_target",
      trapAnswer: 2,
      trapDesc: "Forgot the +5 constant — The Wrong Target",
    },
  ],
  takeaways: [
    "Know the three quadratic forms and what each reveals: standard (y-intercept), factored (zeros), vertex (min/max).",
    "Choose the right form for each question \u2014 this is the #1 Advanced Math skill on the SAT.",
    "The discriminant ($b^2 - 4ac$) tells you how many solutions \u2014 positive = 2, zero = 1, negative = 0.",
    "Vertex x-coordinate shortcut: $x = -b/2a$. The y-coordinate is always the min or max value.",
    "Master all five factoring techniques \u2014 GCF, difference of squares, perfect square, trinomial, grouping.",
    "Memorize the exponent rules cold. They show up in almost every Advanced Math question.",
    "Growth vs. decay: base > 1 = growth, 0 < base < 1 = decay. Watch for (1 + r) vs. (1 \u2212 r).",
    "On rational equations, ALWAYS check for extraneous solutions.",
  ],
};
