"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import {
  ExponentRulesVisual,
  QuadraticFormsVisual,
  FactoringVisual,
  TransformationsVisual,
  GrowthDecayVisual,
  AdvancedTrapsVisual,
} from "./lesson-visuals";

const EXP_EXERCISE: FillInItem[] = [
  {
    "prompt": "Simplify: <code>x³ · x⁴</code>",
    "answer": "x^7",
    "solution": "Product rule: add exponents. $x^{3+4} = x^7$"
  },
  {
    "prompt": "Simplify: <code>x⁸ ÷ x³</code>",
    "answer": "x^5",
    "solution": "Quotient rule: subtract exponents. $x^{8-3} = x^5$"
  },
  {
    "prompt": "Simplify: <code>(x²)⁵</code>",
    "answer": "x^10",
    "solution": "Power rule: multiply exponents. $x^{2 \\times 5} = x^{10}$"
  },
  {
    "prompt": "Evaluate: <code>5⁰</code>",
    "answer": "1",
    "solution": "Anything to the power of 0 equals 1."
  },
  {
    "prompt": "Simplify: <code>2⁻³</code> (as a fraction)",
    "answer": "1/8",
    "solution": "$2^{-3} = 1/2^3 = 1/8$."
  },
  {
    "prompt": "Simplify: <code>(3x²)(4x³)</code>",
    "answer": "12x^5",
    "solution": "$3 \\times 4 = 12$, $x^{2+3} = x^5$. Answer: $12x^5$"
  }
];

const QF_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: f(x) = 2x² + 3x − 5",
    "answer": "Standard",
    "solution": "$ax^2 + bx + c$ form. $a=2, b=3, c=-5$."
  },
  {
    "prompt": "Solve: f(x) = 3(x − 2)² + 7",
    "answer": "Vertex",
    "solution": "$a(x-h)^2+k$ form. Vertex at $(2, 7)$."
  },
  {
    "prompt": "Solve: f(x) = −(x + 1)(x − 5)",
    "answer": "Factored",
    "solution": "$a(x-r_1)(x-r_2)$ form. Zeros at $x=-1$ and $x=5$."
  },
  {
    "prompt": "Solve: f(x) = x² − 9",
    "answer": "Standard",
    "solution": "$ax^2 + bx + c$ with $a=1, b=0, c=-9$. (Also a difference of squares!)"
  },
  {
    "prompt": "Solve: f(x) = −2(x + 4)² − 1",
    "answer": "Vertex",
    "solution": "Vertex at $(-4, -1)$. Opens down ($a=-2$)."
  },
  {
    "prompt": "Solve: f(x) = (x − 3)(x − 7)",
    "answer": "Factored",
    "solution": "Zeros at x=3 and x=7."
  }
];

const WF_EXERCISE: FillInItem[] = [
  {
    "prompt": "Find the <strong>y-intercept</strong> of a quadratic.",
    "answer": "Standard",
    "solution": "Standard form: $f(x) = ax^2 + bx + c$. The y-intercept is $c$."
  },
  {
    "prompt": "Find the <strong>vertex (maximum or minimum)</strong>.",
    "answer": "Vertex",
    "solution": "Vertex form: $f(x) = a(x-h)^2 + k$. Vertex is $(h, k)$."
  },
  {
    "prompt": "Find the <strong>x-intercepts (zeros/roots)</strong>.",
    "answer": "Factored",
    "solution": "Factored form: $f(x) = a(x-r_1)(x-r_2)$. Set each factor to 0."
  },
  {
    "prompt": "Determine if the parabola opens <strong>up or down</strong>.",
    "answer": "Standard",
    "solution": "Any form works, but standard makes it easy: if a > 0, opens up; a < 0, opens down."
  },
  {
    "prompt": "Find the <strong>axis of symmetry</strong>.",
    "answer": "Vertex",
    "solution": "Vertex form: axis of symmetry is $x = h$."
  },
  {
    "prompt": "Find the <strong>number of real solutions</strong>.",
    "answer": "Standard",
    "solution": "Use standard form to calculate the discriminant: $b^2 - 4ac$."
  }
];

const FAC_EXERCISE: FillInItem[] = [
  {
    "prompt": "Factor: <code>x² + 7x + 12</code>",
    "answer": "(x+3)(x+4)",
    "solution": "Find two numbers that multiply to 12 and add to 7: 3 and 4. → (x+3)(x+4)"
  },
  {
    "prompt": "Factor: <code>x² − 9</code>",
    "answer": "(x+3)(x-3)",
    "solution": "Difference of squares: $x^2 - 3^2 = (x+3)(x-3)$"
  },
  {
    "prompt": "Factor: <code>2x² + 6x</code>",
    "answer": "2x(x+3)",
    "solution": "GCF = 2x. Factor out: 2x(x + 3)"
  },
  {
    "prompt": "Factor: <code>x² − 5x + 6</code>",
    "answer": "(x-2)(x-3)",
    "solution": "Numbers that multiply to $6$ and add to $-5$: $-2$ and $-3$. $\\rightarrow (x-2)(x-3)$"
  },
  {
    "prompt": "Factor: <code>x² − 16</code>",
    "answer": "(x+4)(x-4)",
    "solution": "Difference of squares: $x^2 - 4^2 = (x+4)(x-4)$"
  },
  {
    "prompt": "Factor: <code>3x² − 12</code>",
    "answer": "3(x+2)(x-2)",
    "solution": "GCF first: $3(x^2 - 4)$. Then difference of squares: $3(x+2)(x-2)$"
  }
];

const CLS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: f(x) = 3x + 5",
    "answer": "Linear",
    "solution": "Rate of change is constant (3). Linear."
  },
  {
    "prompt": "Solve: f(x) = 100(1.05)^x",
    "answer": "Growth",
    "solution": "Base = 1.05 > 1 → exponential growth (5% increase)."
  },
  {
    "prompt": "Solve: f(x) = 500(0.8)^x",
    "answer": "Decay",
    "solution": "Base = 0.8, between 0 and 1 → exponential decay (20% decrease)."
  },
  {
    "prompt": "Solve: f(x) = −2x + 100",
    "answer": "Linear",
    "solution": "Constant rate of change (−2). Linear, even though it's decreasing."
  },
  {
    "prompt": "Solve: f(x) = 1000(2)^x",
    "answer": "Growth",
    "solution": "Base = 2 > 1 → exponential growth (doubles each time)."
  },
  {
    "prompt": "Solve: f(x) = 50(0.5)^x",
    "answer": "Decay",
    "solution": "Base = 0.5 → halves each time → exponential decay."
  }
];

export default function PSAT89MathModule3() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "exponent-rules": <ExponentRulesVisual />,
        "quadratic-forms": <QuadraticFormsVisual />,
        "factoring": <FactoringVisual />,
        "transformations": <TransformationsVisual />,
        "growth-decay": <GrowthDecayVisual />,
        "advanced-traps": <AdvancedTrapsVisual />,
      }}
      activities={{
        "exercise-exp": (goNext: () => void) => (
          <FillInExercise
            items={EXP_EXERCISE}
            title="Exponent Rules"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-qf": (goNext: () => void) => (
          <FillInExercise
            items={QF_EXERCISE}
            title="Quadratic Form Identifier"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-wf": (goNext: () => void) => (
          <FillInExercise
            items={WF_EXERCISE}
            title="Which Form?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-fac": (goNext: () => void) => (
          <FillInExercise
            items={FAC_EXERCISE}
            title="Factoring Workshop"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-cls": (goNext: () => void) => (
          <FillInExercise
            items={CLS_EXERCISE}
            title="Linear, Growth, or Decay?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/psat89-math/4"
      nextModuleLabel="Module 4: Problem-Solving & Data"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "math",
  moduleNum: 3,
  title: "Advanced Math",
  subtitle:
    "~35% of the PSAT 8/9 \u2014 but calibrated to introductory levels. Most problems need just 1\u20132 steps.",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "lesson" },
    { id: "exercise-exp", label: "Exponent Rules", icon: "zap" },
    { id: "exercise-qf", label: "Quadratic Form Identifier", icon: "zap" },
    { id: "exercise-wf", label: "Which Form?", icon: "zap" },
    { id: "exercise-fac", label: "Factoring Workshop", icon: "zap" },
    { id: "exercise-cls", label: "Linear, Growth, or Decay?", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "exponent-rules",
      title: "Topic 3A: The Six Exponent Rules",
      subtitle: "Memorize These and Handle a Third of Advanced Math",
      visual: "exponent-rules",
      body: [
        "These six rules show up constantly on the PSAT 8/9. Memorize them and you\u2019ll handle about a third of all Advanced Math questions automatically.",
        "The most common mistakes involve confusing when to add vs. multiply exponents, and treating negative exponents as negative numbers.",
      ],
    },
    {
      id: "quadratic-forms",
      title: "Topic 3B: Quadratic Equations \u2014 The Three Forms",
      subtitle: "Standard, Vertex & Factored",
      visual: "quadratic-forms",
      body: [
        "Every quadratic on the PSAT 8/9 can be expressed in three forms. Each form reveals different information. The key is matching the form to what the question asks.",
        "Solving methods: factoring (fastest when it works), square root method (for vertex form), and the quadratic formula (works on everything, use as backup).",
      ],
    },
    {
      id: "factoring",
      title: "Topic 3C: Polynomials & Factoring",
      subtitle: "GCF, Trinomial & Difference of Squares",
      visual: "factoring",
      body: [
        "Three factoring techniques cover every polynomial you\u2019ll see on the PSAT 8/9. Always factor GCF first \u2014 it makes everything else easier.",
        "FOIL for multiplying binomials: $(2x+3)(x-4) = 2x^2 - 8x + 3x - 12 = 2x^2 - 5x - 12$. No long division on the PSAT 8/9.",
      ],
    },
    {
      id: "transformations",
      title: "Topic 3D: Functions & Transformations",
      subtitle: "Function Notation, Shifts & Reflections",
      visual: "transformations",
      body: [
        "Function notation: f(x) just means \u201cplug in x.\u201d f(5) = replace x with 5. If f(a) = 0, then a is a zero (or root) of the function.",
        "Know the five basic transformations. Horizontal shifts feel backwards \u2014 this trips up students more than any other transformation concept.",
      ],
    },
    {
      id: "growth-decay",
      title: "Exponential Growth & Decay",
      subtitle: "Modeling Real-World Scenarios",
      visual: "growth-decay",
      body: [
        "Exponential growth: $y = a(1 + r)^t$ with multiplier $> 1$. Exponential decay: $y = a(1 - r)^t$ with multiplier between $0$ and $1$.",
        "Common scenarios: population doubling, radioactive decay, depreciation, compound interest. The PSAT tests your ability to identify the initial value, rate, and time period.",
      ],
    },
    {
      id: "advanced-traps",
      title: "Four Traps in Advanced Math",
      subtitle: "Spot Them Before They Spot You",
      visual: "advanced-traps",
      body: [
        "These traps from Module 2 show up again here \u2014 plus one new one specific to quadratics. Learning to recognize them is the fastest path to avoiding careless errors.",
      ],
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 2 — Slope",
      stem: "What is the slope of the line <code>y = −3x + 12</code>?",
      choices: ["3", "4", "12", "−3"],
      correct: 3,
      explanation: "In y = mx + b, slope = m = −3. The 12 is the y-intercept, not the slope.",
    },
    {
      source: "Module 2 — Systems",
      stem: "Two lines have the same slope but different y-intercepts. How many solutions does this system have?",
      choices: ["No solution", "Cannot determine", "Infinitely many", "One solution"],
      correct: 0,
      explanation: "Same slope + different intercepts = parallel lines = no intersection = no solution.",
    },
    {
      source: "Module 2 — Inequalities",
      stem: "When solving <code>−2x > 8</code>, what happens to the inequality sign?",
      choices: ["You drop the sign", "It becomes an equals sign", "It flips direction", "Nothing changes"],
      correct: 2,
      explanation: "Dividing by a negative number FLIPS the inequality sign. −2x > 8 → x < −4. This is The Sign Flip trap!",
    },
    {
      source: "Module 2 — Trap Taxonomy",
      stem: "If 2x + 8 = 20, what is x + 4?",
      choices: ["6", "10", "20", "14"],
      correct: 1,
      explanation: "Divide the whole equation by 2: x + 4 = 10. Don't solve for x first — that's The Wrong Target trap!",
    },
    {
      source: "Module 2 — Word Problems",
      stem: "The word \"per\" in a word problem usually translates to which math operation?",
      choices: ["Multiplication (×)", "Subtraction (−)", "Addition (+)", "Division (÷)"],
      correct: 0,
      explanation: "\"Per\" means multiplication (as a rate). \"$8 per month\" = 8 × months = 8m.",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "Which expression is equivalent to $x^4 \\cdot x^3$?",
      choices: ["$x^{12}$", "$x^7$", "$x^1$", "$7x$"],
      correct: 1,
      explanation: "Product rule: $x^{4+3} = x^7$.",
      trapAnswer: 0,
      trapDesc: "Multiplied exponents instead of adding — confused product and power rules",
    },
    {
      stem: "What are the solutions to <code>x² − x − 12 = 0</code>?",
      choices: ["x = −3 and x = −4", "x = −3 and x = 4", "x = 3 and x = 4", "x = 3 and x = −4"],
      correct: 1,
      explanation: "Factor: (x−4)(x+3) = 0 → x = 4 or x = −3.",
      trap: "one_case",
      trapAnswer: 0,
      trapDesc: "Got the factor numbers but missed the signs — The One-Case Trap",
    },
    {
      stem: "If <code>f(x) = 3x − 7</code>, what is <code>f(4)</code>?",
      choices: ["5", "−1", "12", "19"],
      correct: 0,
      explanation: "f(4) = 3(4) − 7 = 12 − 7 = 5.",
      trap: "wrong_target",
      trapAnswer: 1,
      trapDesc: "Computed 3×4 = 12 but forgot to subtract 7 — The Wrong Target",
    },
    {
      stem: "Simplify: $(2x^3)^2$",
      choices: ["$2x^5$", "$2x^6$", "$4x^6$", "$4x^5$"],
      correct: 2,
      explanation: "$(2x^3)^2 = 2^2 \\cdot (x^3)^2 = 4x^6$.",
      trap: "distribution_ghost",
      trapAnswer: 0,
      trapDesc: "Forgot to square the coefficient 2 — The Distribution Ghost",
    },
    {
      stem: "The quadratic <code>f(x) = −2(x − 3)² + 8</code> has its vertex at:",
      choices: ["(3, −8)", "(−3, −8)", "(−3, 8)", "(3, 8)"],
      correct: 3,
      explanation: "Vertex form: $a(x-h)^2+k$. Vertex is $(h, k) = (3, 8)$.",
      trap: "form_mismatch",
      trapAnswer: 1,
      trapDesc: "Flipped the sign of h — in (x−3), h=3 not −3 — The Form Mismatch",
    },
    {
      stem: "A car purchased for $20,000 loses 15% of its value each year. Which models its value after t years?",
      choices: ["V = 20000(1.15)^t", "V = 20000(0.85)^t", "V = 20000 − 0.15t", "V = 20000(0.15)^t"],
      correct: 1,
      explanation: "Loses 15% → keeps 85% → multiplier is 0.85. V = 20000(0.85)^t.",
      trapAnswer: 0,
      trapDesc: "Used growth formula instead of decay",
    },
    {
      stem: "Factor completely: <code>3x² − 27</code>",
      choices: ["$3(x^2 - 9)$", "$(3x+9)(x-3)$", "$3(x+3)(x-3)$", "$3(x-3)^2$"],
      correct: 2,
      explanation: "GCF first: $3(x^2-9)$. Then difference of squares: $3(x+3)(x-3)$.",
      trapAnswer: 0,
      trapDesc: "Factored GCF but stopped — didn't factor completely",
    },
    {
      stem: "How many real solutions does <code>x² + 4x + 7 = 0</code> have?",
      choices: ["2", "0", "4", "1"],
      correct: 1,
      explanation: "Discriminant: $4^2 - 4(1)(7) = 16 - 28 = -12 < 0$ $\\Rightarrow$ no real solutions.",
      trapAnswer: 2,
      trapDesc: "Guessed \"2\" because quadratics usually have 2 solutions",
    },
    {
      stem: "The graph of <code>g(x) = f(x − 2) + 3</code> is the graph of f shifted:",
      choices: ["Right 2, up 3", "Left 2, down 3", "Left 2, up 3", "Right 2, down 3"],
      correct: 0,
      explanation: "f(x−2) = right 2. +3 = up 3.",
      trap: "form_mismatch",
      trapAnswer: 0,
      trapDesc: "Horizontal shifts feel backwards — f(x−2) shifts RIGHT, not left — The Form Mismatch",
    },
    {
      stem: "If one x-intercept of <code>f(x) = x² + bx − 12</code> is x = 3, what is b?",
      choices: ["4", "−1", "1", "−4"],
      correct: 2,
      explanation: "If x=3 is a root: 9 + 3b − 12 = 0 → 3b − 3 = 0 → b = 1. Check: factors as (x+4)(x−3), so other root is −4.",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Got 3b = 3 but then picked −1 instead of 1 — sign error",
    },
  ],
  takeaways: [
    "Advanced Math is ~35% of the PSAT 8/9 -- tied with Algebra as the largest domain.",
    "Know all six exponent rules cold. They're tested directly and inside larger problems.",
    "Three quadratic forms: standard (y-intercept), vertex (max/min), factored (zeros).",
    "Factor GCF first, then try trinomial factoring or difference of squares.",
    "Function notation: f(x) just means \"plug in x.\" f(3) = replace x with 3.",
    "Horizontal shifts feel backwards: f(x - 3) shifts RIGHT.",
    "Exponential: base > 1 = growth, base between 0 and 1 = decay.",
    "The PSAT 8/9 tests these at introductory level -- usually 1-2 steps.",
  ],
};
