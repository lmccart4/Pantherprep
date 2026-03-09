"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  LinearEquationsVisual,
  ThreeFormsVisual,
  SystemsVisual,
  InequalitiesVisual,
  TrapTaxonomyVisual,
  WordProblemVisual,
} from "./lesson-visuals";

const SOLVER_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve for x: <code>3x + 7 = 22</code>",
    "answer": 5,
    "solution": "$3x + 7 = 22$ → $3x = 15$ → $x = 5$",
    "tier": 1
  },
  {
    "prompt": "Solve for x: <code>2(x − 4) = 3x + 6</code>",
    "answer": -14,
    "solution": "$2x − 8 = 3x + 6$ → −8 − 6 = 3x − 2x → $x = −14$",
    "tier": 1
  },
  {
    "prompt": "Solve for x: <code>5x − 3 = 2x + 12</code>",
    "answer": 5,
    "solution": "$3x = 15$ → $x = 5$",
    "tier": 1
  },
  {
    "prompt": "Solve for x: <code>(2/3)x + 4 = 10</code>",
    "answer": 9,
    "solution": "(2/3)x = 6 → $x = 6 ×$ (3/2) = 9",
    "tier": 2
  },
  {
    "prompt": "Solve for x: <code>4(x + 1) − 2(x − 3) = 20</code>",
    "answer": 5,
    "solution": "$4x + 4 − 2x + 6 = 20$ → $2x + 10 = 20$ → $x = 5$",
    "tier": 2
  },
  {
    "prompt": "If <code>2x − 5 = 9</code>, what is the value of <code>6x − 15</code>?",
    "answer": 27,
    "solution": "Notice: $6x − 15 =$ 3(2x − 5) = 3(9) = 27. You don't need to solve for x!",
    "tier": 2
  }
];

const FORM_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: $y = 3x − 7$",
    "answer": "Slope-Intercept",
    "solution": "$y = mx + b$ format. $m = 3$, $b = −7$."
  },
  {
    "prompt": "Solve: $y − 5 =$ 2(x − 1)",
    "answer": "Point-Slope",
    "solution": "y − y₁ = m(x − x₁) format. Point (1, 5), slope 2."
  },
  {
    "prompt": "Solve: $4x + 3y = 24$",
    "answer": "Standard",
    "solution": "Ax + By = C format. A = 4, B = 3, C = 24."
  },
  {
    "prompt": "Solve: $y =$ −½x + 9",
    "answer": "Slope-Intercept",
    "solution": "$y = mx + b$ format. $m =$ −½, $b = 9$."
  },
  {
    "prompt": "Solve: $y − 3 =$ −4(x + 2)",
    "answer": "Point-Slope",
    "solution": "y − y₁ = m(x − x₁). Point (−2, 3), slope −4. Note: (x + 2) = (x − (−2))."
  },
  {
    "prompt": "Solve: $7x − 2y = 14$",
    "answer": "Standard",
    "solution": "Ax + By = C format. A = 7, B = −2, C = 14."
  }
];

const SYS_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve the system:\ny = 2x + 3\ny = 2x − 1",
    "answer": "No Solution",
    "solution": "Same slope (2) but different y-intercepts → parallel lines → no solution."
  },
  {
    "prompt": "Solve the system:\ny = 3x + 1\ny = −x + 5",
    "answer": "One Solution",
    "solution": "Different slopes (3 and −1) → lines intersect at one point."
  },
  {
    "prompt": "Solve the system:\n2x + $4y =$ 8\nx + $2y = 4$",
    "answer": "Infinite Solutions",
    "solution": "First equation ÷ 2 = second equation. They're the same line."
  },
  {
    "prompt": "Solve the system:\ny = −2x + 6\n4x + $2y = 12$",
    "answer": "Infinite Solutions",
    "solution": "Substitute: 4x + 2(−2x + 6) = $4x − 4x + 12 = 12$ ✓ Always true."
  },
  {
    "prompt": "Solve the system:\n3x + $y =$ 7\n6x + $2y = 10$",
    "answer": "No Solution",
    "solution": "Second equation ÷ 2 = $3x + y = 5$. But first says $3x + y = 7$. Same left, different right → no solution."
  },
  {
    "prompt": "Solve the system:\ny = x − 2\ny = −3x + 6",
    "answer": "One Solution",
    "solution": "Different slopes (1 and −3) → one intersection point. ($x = 2$, $y = 0$.)"
  }
];

const INEQ_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: <code>x + 5 &gt; 12</code>",
    "answer": "x > 7",
    "solution": "$x + 5 > 12$ → $x > 7$. No sign flip needed.",
    "tier": 1
  },
  {
    "prompt": "Solve: <code>3x − 9 ≤ 6</code>",
    "answer": "x ≤ 5",
    "solution": "$3x ≤ 15$ → $x ≤ 5$. Dividing by positive 3, no flip.",
    "tier": 1
  },
  {
    "prompt": "Solve: <code>−2x &gt; 10</code>",
    "answer": "x < −5",
    "solution": "Divide by −2, FLIP the sign → $x < −5$.",
    "tier": 2
  },
  {
    "prompt": "Solve: <code>−4x + 8 ≤ 20</code>",
    "answer": "x ≥ −3",
    "solution": "$−4x ≤ 12$ → divide by −4, FLIP → $x ≥ −3$.",
    "tier": 2
  },
  {
    "prompt": "Solve: <code>5 − 3x &lt; 2x + 25</code>",
    "answer": "x > −4",
    "solution": "$−5x < 20$ → divide by −5, FLIP → $x > −4$.",
    "tier": 2
  }
];

const TRAP_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "If <code>2x + 8 = 20</code>, what is the value of <code>x + 4</code>?",
    "options": [
      "No trap here",
      "Needs to flip the sign",
      "Asks for x + 4, not x",
      "Uses wrong operation"
    ],
    "correct": 2,
    "explanation": "The trap: you might solve for x (getting $x = 6$) and choose 6. But the question asks for $x + 4 = 10$. Shortcut: divide the whole equation by 2 → $x + 4 = 10$."
  },
  {
    "prompt": "Solve: <code>−3x &gt; 12</code>",
    "options": [
      "Standard solving",
      "Need to flip the inequality sign",
      "Need to distribute first",
      "Asks for expression, not x"
    ],
    "correct": 1,
    "explanation": "The trap: dividing by −3 requires flipping the inequality sign. $x < −4$, not $x > −4$."
  },
  {
    "prompt": "A store sells shirts for $15 each and pants for $25 each. If a customer buys 8 items total for $160, how many shirts did they buy?",
    "options": [
      "Asks for pants not shirts",
      "Price and quantity are swapped",
      "Only one equation needed",
      "Need two equations"
    ],
    "correct": 3,
    "explanation": "The trap: trying to solve with one equation. You need two: $s + p = 8$ (quantity) AND $15s + 25p = 160$ (cost)."
  },
  {
    "prompt": "The line <code>y = 3x − 7</code> passes through the point (2, k). What is k?",
    "options": [
      "Need point-slope form",
      "Just plug in $x = 2$",
      "Need to solve for x first",
      "Asks for slope not k"
    ],
    "correct": 1,
    "explanation": "No trap! Just plug in $x = 2$. $k =$ 3(2) − 7 = −1. Students overcomplicate it."
  },
  {
    "prompt": "Lines m and n are parallel. Line m has slope 4. Line n passes through (1, 3) and (3, k). What is k?",
    "options": [
      "Perpendicular, not parallel",
      "Undefined slope",
      "Need standard form",
      "Need to use slope formula with the parallel slope"
    ],
    "correct": 3,
    "explanation": "Since parallel, line n also has slope 4. (k − 3)/(3 − 1) = 4 → $k − 3 = 8$ → $k = 11$."
  }
];

const WPT_QS_EXERCISE: MatchingItem[] = [
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
    "prompt": "\"more than\" / \"increased by\"",
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
    "prompt": "\"less than\" / \"decreased by\"",
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
    "prompt": "\"per\" / \"each\" / \"every\"",
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
    "prompt": "\"of\" (as in \"30% of\")",
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
    "prompt": "\"quotient\" / \"ratio\"",
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
    "prompt": "\"twice\" / \"double\"",
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

export default function NMSQTMathModule2() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "linear-equations": <LinearEquationsVisual />,
        "three-forms": <ThreeFormsVisual />,
        "systems": <SystemsVisual />,
        "inequalities": <InequalitiesVisual />,
        "trap-taxonomy": <TrapTaxonomyVisual />,
        "word-problems": <WordProblemVisual />,
      }}
      activities={{
        "exercise-solver-qs": (goNext: () => void) => (
          <FillInExercise
            items={SOLVER_QS_EXERCISE}
            title="Equation Solver"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-form-qs": (goNext: () => void) => (
          <FillInExercise
            items={FORM_QS_EXERCISE}
            title="Identify the Form"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-sys-qs": (goNext: () => void) => (
          <FillInExercise
            items={SYS_QS_EXERCISE}
            title="System of Equations Classifier"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-ineq-qs": (goNext: () => void) => (
          <FillInExercise
            items={INEQ_QS_EXERCISE}
            title="Inequality Challenge"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-trap-qs": (goNext: () => void) => (
          <MatchingExercise
            items={TRAP_QS_EXERCISE}
            title="Trap Spotter"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-wpt-qs": (goNext: () => void) => (
          <MatchingExercise
            items={WPT_QS_EXERCISE}
            title="Word Problem Translator"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/nmsqt-math/3"
      nextModuleLabel="Module 3: Advanced Math"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "math",
  moduleNum: 2,
  title: "Algebra",
  subtitle:
    "The single highest-impact domain on the PSAT/NMSQT. Master this and you\u2019ve conquered ~35% of the test.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-solver-qs", label: "Equation Solver", icon: "zap" },
    { id: "exercise-form-qs", label: "Identify the Form", icon: "zap" },
    { id: "exercise-sys-qs", label: "System of Equations Classifier", icon: "zap" },
    { id: "exercise-ineq-qs", label: "Inequality Challenge", icon: "zap" },
    { id: "exercise-trap-qs", label: "Trap Spotter", icon: "zap" },
    { id: "exercise-wpt-qs", label: "Word Problem Translator", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "linear-equations",
      title: "Linear Equations in One Variable",
      subtitle: "Topic 2A",
      visual: "linear-equations",
      body: [
        "Solving one-variable equations follows a consistent process: distribute, combine, isolate, solve, check. The PSAT tests three outcome types -- one solution, no solution, and infinitely many.",
      ],
    },
    {
      id: "two-variable",
      title: "Linear Equations in Two Variables",
      subtitle: "Topic 2B",
      visual: "three-forms",
      body: [
        "The PSAT tests three forms of linear equations. Each form reveals different information -- the key skill is knowing which form to use for each question type.",
      ],
    },
    {
      id: "systems",
      title: "Systems of Linear Equations",
      subtitle: "Topic 2C",
      visual: "systems",
      body: [
        "Systems questions ask you to find the intersection of two lines. Choose your method based on the form of the equations -- or just graph both in Desmos.",
      ],
    },
    {
      id: "inequalities",
      title: "Linear Inequalities",
      subtitle: "Topic 2D",
      visual: "inequalities",
      body: [
        "Inequalities work exactly like equations with one critical exception: multiply or divide by a negative number and the sign flips. This is the #1 most tested inequality rule on the PSAT.",
      ],
    },
    {
      id: "trap-taxonomy",
      title: "Six Traps That Recur Throughout the PSAT",
      subtitle: "Trap Taxonomy",
      visual: "trap-taxonomy",
      body: [
        "Learn these traps by name. When you spot one in a problem, you'll know exactly what to watch for. Tap each trap above to see an example.",
      ],
    },
    {
      id: "word-problems",
      title: "Word Problem Translation",
      subtitle: "English to Math",
      visual: "word-problems",
      body: [
        "Translating word problems into equations is a core PSAT skill. Memorize the key phrase-to-symbol mappings above.",
      ],
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 1 — Test Structure",
      stem: "How many modules does the PSAT/NMSQT Math section have?",
      choices: ["4 modules", "2 modules (adaptive)", "1 module", "3 modules"],
      correct: 1,
      explanation: "The PSAT/NMSQT Math section has 2 adaptive modules. Module 2 difficulty adjusts based on your Module 1 performance.",
    },
    {
      source: "Module 1 — Score Ranges",
      stem: "What is the PSAT/NMSQT Math score range?",
      choices: ["200–800", "400–1520", "120–720", "160–760"],
      correct: 3,
      explanation: "PSAT/NMSQT Math scores range from 160 to 760. Combined with Reading/Writing, the total is 320–1520.",
    },
    {
      source: "Module 1 — Calculator",
      stem: "When can you use a calculator on the PSAT/NMSQT?",
      choices: ["No calculators", "The entire math section", "Only hard questions", "Only Module 2"],
      correct: 1,
      explanation: "Calculator available for the ENTIRE math section. Desmos graphing calculator is built in.",
    },
    {
      source: "Module 1 — Domains",
      stem: "Which domain makes up the largest share of PSAT/NMSQT Math?",
      choices: ["Problem-Solving & Data", "Algebra", "Advanced Math", "Geometry & Trig"],
      correct: 1,
      explanation: "Algebra is the largest domain at ~35% of questions (13–15 questions).",
    },
    {
      source: "Module 1 — Selection Index",
      stem: "The NMSQT Selection Index is used for:",
      choices: ["College admissions", "SAT prediction", "National Merit Scholarship qualification", "AP class placement"],
      correct: 2,
      explanation: "The Selection Index (48–228) determines National Merit Scholarship semifinalist cutoffs. It equals 2×(Reading+Writing) + Math.",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "If <code>4x − 8 = 2x + 6</code>, what is the value of x?",
      choices: ["5", "14", "1", "7"],
      correct: 3,
      explanation: "$4x − 8 = 2x + 6$ → $2x = 14$ → $x = 7$.",
      trapAnswer: 0,
      trapDesc: "Arithmetic error",
    },
    {
      stem: "What is the slope of the line represented by <code>y = −3x + 12</code>?",
      choices: ["3", "4", "12", "−3"],
      correct: 3,
      explanation: "In $y = mx + b$, the slope is m. Here $m = −3$.",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Confused y-intercept with slope — The Wrong Target",
    },
    {
      stem: "Which of the following represents all values of x such that <code>3x − 5 > 7</code>?",
      choices: ["x > 12", "x > 2", "x < 4", "x > 4"],
      correct: 3,
      explanation: "$3x − 5 > 7$ → $3x > 12$ → $x > 4$.",
      trapAnswer: 1,
      trapDesc: "Divided incorrectly",
    },
    {
      stem: "A line passes through (2, 5) and has a slope of −3. What is the y-intercept of this line?",
      choices: ["−11", "11", "−1", "1"],
      correct: 1,
      explanation: "Point-slope: $y − 5 =$ −3(x − 2) → $y = −3x + 6 + 5$ → $y = −3x + 11$. The y-intercept is 11.",
      trap: "distribution_ghost",
      trapAnswer: 3,
      trapDesc: "Sign error in distribution — The Distribution Ghost",
    },
    {
      stem: "If <code>2x + y = 10</code> and <code>x − y = 2</code>, what is the value of x?",
      choices: ["4", "3", "6", "2"],
      correct: 0,
      explanation: "Add the equations: $3x = 12$ → $x = 4$. (Elimination — y cancels.)",
      trapAnswer: 3,
      trapDesc: "Arithmetic error",
    },
    {
      stem: "A streaming service charges a $12 sign-up fee plus $8 per month. Which equation gives the total cost C after m months?",
      choices: ["C = 20m", "C = 8(m + 12)", "C = 8m + 12", "C = 12m + 8"],
      correct: 2,
      explanation: "\"$8 per month\" → 8m (variable cost). \"$12 sign-up fee\" → +12 (fixed cost). C = 8m + 12.",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Swapped slope and intercept — The Wrong Target",
    },
    {
      stem: "The system <code>3x + ky = 12</code> and <code>9x + 15y = 36</code> has infinitely many solutions. What is the value of k?",
      choices: ["3", "9", "5", "15"],
      correct: 2,
      explanation: "For infinite solutions, the second equation must be a multiple of the first. $9x =$ 3(3x) ✓, 36 = 3(12) ✓, so $15y =$ 3(ky) → $k = 5$.",
      trapAnswer: 0,
      trapDesc: "Confused ratio",
    },
    {
      stem: "Line p has the equation <code>y = (2/5)x − 3</code>. Line q is perpendicular to line p and passes through (4, 1). What is the equation of line q?",
      choices: ["$y =$ −(2/5)x + 11/5", "$y =$ (5/2)x − 9", "$y =$ −(5/2)x + 11", "$y =$ (2/5)x − 3/5"],
      correct: 2,
      explanation: "Perpendicular slope = negative reciprocal of 2/5 = −5/2. Point-slope with (4, 1): $y − 1 =$ −(5/2)(x − 4) → $y =$ −(5/2)x + 11.",
      trap: "imposter_subject",
      trapAnswer: 0,
      trapDesc: "Used same slope instead of perpendicular — The Imposter Subject",
    },
  ],

  takeaways: [
    "Algebra is ~35% of the PSAT -- the single largest domain. Time invested here pays off the most.",
    "Know all three forms of linear equations: slope-intercept ($y = mx + b$), point-slope ($y - y1 =$ m(x - x1)), standard (Ax + By = C).",
    "Parallel lines = same slope. Perpendicular lines = negative reciprocal slopes.",
    "Systems: substitution when a variable is isolated, elimination when coefficients align, Desmos for speed.",
    "When variables cancel in a system: true statement = infinite solutions, false statement = no solution.",
    "Inequalities: FLIP the sign when multiplying/dividing by a negative.",
    "Always re-read what the question is actually asking for before choosing your answer -- the #1 algebra trap on the PSAT.",
  ],
};
