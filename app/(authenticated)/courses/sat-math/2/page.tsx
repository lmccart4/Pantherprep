"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  ThreeFormsVisual,
  SlopeVisual,
  SystemsVisual,
  InequalityVisual,
  TrapTaxonomyVisual,
  WordProblemVisual,
} from "./lesson-visuals";

const SOLVER_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve for x: <code>3x + 7 = 22</code>",
    "answer": 5,
    "solution": "3x + 7 = 22 → 3x = 15 → x = 5",
    "tier": 1
  },
  {
    "prompt": "Solve for x: <code>2(x − 4) = 3x + 6</code>",
    "answer": -14,
    "solution": "2x − 8 = 3x + 6 → −8 − 6 = 3x − 2x → x = −14",
    "tier": 1
  },
  {
    "prompt": "Solve for x: <code>5x − 3 = 2x + 12</code>",
    "answer": 5,
    "solution": "5x − 2x = 12 + 3 → 3x = 15 → x = 5",
    "tier": 1
  },
  {
    "prompt": "Solve for x: <code>(2/3)x + 4 = 10</code>",
    "answer": 9,
    "solution": "(2/3)x = 6 → x = 6 × (3/2) = 9",
    "tier": 2
  },
  {
    "prompt": "Solve for x: <code>4(x + 1) − 2(x − 3) = 20</code>",
    "answer": 5,
    "solution": "4x + 4 − 2x + 6 = 20 → 2x + 10 = 20 → 2x = 10 → x = 5",
    "tier": 2
  },
  {
    "prompt": "A phone plan charges $30/month plus $0.10 per text. If the total cost is $52.50, how many texts were sent?",
    "answer": 225,
    "solution": "30 + 0.10t = 52.50 → 0.10t = 22.50 → t = 225",
    "tier": 2
  }
];

const FORM_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: y = 3x − 7",
    "answer": "Slope-Intercept",
    "solution": "y = mx + b format. m = 3, b = −7."
  },
  {
    "prompt": "Solve: y − 5 = 2(x − 1)",
    "answer": "Point-Slope",
    "solution": "$y - y_1 = m(x - x_1)$ format. Point (1, 5), slope 2."
  },
  {
    "prompt": "Solve: 4x + 3y = 24",
    "answer": "Standard",
    "solution": "Ax + By = C format. A = 4, B = 3, C = 24."
  },
  {
    "prompt": "Solve: y = −½x + 9",
    "answer": "Slope-Intercept",
    "solution": "y = mx + b format. m = −½, b = 9."
  },
  {
    "prompt": "Solve: y − 3 = −4(x + 2)",
    "answer": "Point-Slope",
    "solution": "$y - y_1 = m(x - x_1)$. Point (-2, 3), slope -4. Note: $(x + 2) = (x - (-2))$."
  },
  {
    "prompt": "Solve: 7x − 2y = 14",
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
    "prompt": "Solve the system:\n2x + 4y = 8\nx + 2y = 4",
    "answer": "Infinite Solutions",
    "solution": "First equation ÷ 2 = second equation. They're the same line."
  },
  {
    "prompt": "Solve the system:\ny = −2x + 6\n4x + 2y = 12",
    "answer": "Infinite Solutions",
    "solution": "Substitute: 4x + 2(−2x + 6) = 4x − 4x + 12 = 12 ✓ Always true."
  },
  {
    "prompt": "Solve the system:\n3x + y = 7\n6x + 2y = 10",
    "answer": "No Solution",
    "solution": "Second equation ÷ 2 = 3x + y = 5. But first says 3x + y = 7. Same left, different right → no solution."
  },
  {
    "prompt": "Solve the system:\ny = x − 2\ny = −3x + 6",
    "answer": "One Solution",
    "solution": "Different slopes (1 and −3) → one intersection point. (x = 2, y = 0.)"
  }
];

const INEQ_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "Solve: <code>x + 5 &gt; 12</code>",
    "answer": "x > 7",
    "solution": "x + 5 > 12 → x > 7. No sign flip needed.",
    "tier": 1
  },
  {
    "prompt": "Solve: <code>3x − 9 ≤ 6</code>",
    "answer": "x ≤ 5",
    "solution": "3x ≤ 15 → x ≤ 5. Dividing by positive 3, no flip.",
    "tier": 1
  },
  {
    "prompt": "Solve: <code>−2x &gt; 10</code>",
    "answer": "x < −5",
    "solution": "Divide by −2, FLIP the sign → x < −5.",
    "tier": 2
  },
  {
    "prompt": "Solve: <code>−4x + 8 ≤ 20</code>",
    "answer": "x ≥ −3",
    "solution": "−4x ≤ 12 → divide by −4, FLIP → x ≥ −3.",
    "tier": 2
  },
  {
    "prompt": "Solve: <code>5 − 3x &lt; 2x + 25</code>",
    "answer": "x > −4",
    "solution": "5 − 3x < 2x + 25 → −5x < 20 → divide by −5, FLIP → x > −4.",
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
    "explanation": "The trap: you might solve for x (getting 6) and choose 6. But the question asks for x + 4 = 10. Shortcut: divide the whole equation by 2 → x + 4 = 10."
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
    "explanation": "Dividing by −3 requires flipping the inequality sign. Answer: x < −4, not x > −4."
  },
  {
    "prompt": "A store sells shirts for $15 each and pants for $25 each. A customer buys 8 items total for $160. How many shirts did they buy?",
    "options": [
      "Need two equations (trap: using only one)",
      "Only one equation needed",
      "Price and quantity are swapped",
      "Asks for pants not shirts"
    ],
    "correct": 0,
    "explanation": "You need two equations: s + p = 8 (quantity) AND 15s + 25p = 160 (cost). Using only one equation is the trap."
  },
  {
    "prompt": "The line <code>y = 3x − 7</code> passes through (2, k). What is k?",
    "options": [
      "Need point-slope form",
      "Just plug in x = 2",
      "Need to solve for x first",
      "Asks for slope not k"
    ],
    "correct": 1,
    "explanation": "No real trap — just plug in x = 2: k = 3(2) − 7 = −1. The trap is overthinking it by trying point-slope."
  },
  {
    "prompt": "Lines m and n are parallel. Line m has slope 4. Line n passes through (1, 3) and (3, k). What is k?",
    "options": [
      "Need standard form",
      "Perpendicular, not parallel",
      "Use slope formula with the parallel slope",
      "Slope is undefined"
    ],
    "correct": 2,
    "explanation": "Parallel → same slope of 4. Use slope formula: (k − 3)/(3 − 1) = 4 → k − 3 = 8 → k = 11. Trap: confusing parallel (same slope) with perpendicular."
  },
  {
    "prompt": "If <code>3(x − 2) = 3x − 6</code>, what is x?",
    "options": [
      "x = 0",
      "x = 2",
      "No solution",
      "Infinitely many solutions — identity, not an equation to solve"
    ],
    "correct": 3,
    "explanation": "Distributing: 3x − 6 = 3x − 6. This is always true (identity). The trap: thinking there must be one specific answer."
  },
  {
    "prompt": "A taxi charges $3.50 plus $2.25 per mile. Which represents the cost for m miles: <code>C = 3.50m + 2.25</code> or <code>C = 2.25m + 3.50</code>?",
    "options": [
      "Need more information",
      "They are the same",
      "First one — $3.50 is per mile",
      "Second one — $3.50 is the flat fee"
    ],
    "correct": 3,
    "explanation": "$3.50 is the flat fee (constant), $2.25 is per mile (rate). C = 2.25m + 3.50. Trap: swapping which number is the rate vs. the constant."
  },
  {
    "prompt": "The question asks for <code>2x − 3y</code>. You solve the system and find x = 5 and y = 2. What is your answer?",
    "options": [
      "4",
      "The answer is 2(5) − 3(2) = 4",
      "2",
      "5"
    ],
    "correct": 1,
    "explanation": "The question asks for the expression 2x − 3y, not x or y. Answer: 2(5) − 3(2) = 10 − 6 = 4. Biggest SAT trap: answering with x or y when they ask for an expression."
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

export default function SATMathModule2() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "three-forms": <ThreeFormsVisual />,
        "slope": <SlopeVisual />,
        "systems": <SystemsVisual />,
        "inequalities": <InequalityVisual />,
        "traps": <TrapTaxonomyVisual />,
        "word-problems": <WordProblemVisual />,
      }}
      activities={{
        "exercise-solver-qs": (goNext: () => void) => (
          <FillInExercise
            items={SOLVER_QS_EXERCISE}
            title="Solver"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-form-qs": (goNext: () => void) => (
          <FillInExercise
            items={FORM_QS_EXERCISE}
            title="Form"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-sys-qs": (goNext: () => void) => (
          <FillInExercise
            items={SYS_QS_EXERCISE}
            title="Systems of Equations"
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
            title="Trap"
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

      nextModuleHref="/courses/sat-math/3"
      nextModuleLabel="Module 3: Advanced Math"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "math",
  moduleNum: 2,
  title: "Algebra",
  subtitle:
    "The single highest-impact domain on the SAT. Master this and you\u2019ve conquered ~35% of the test.",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-solver-qs", label: "Solver Qs", icon: "zap" },
    { id: "exercise-form-qs", label: "Form Qs", icon: "zap" },
    { id: "exercise-sys-qs", label: "Systems of Equations", icon: "zap" },
    { id: "exercise-ineq-qs", label: "Inequality Challenge", icon: "zap" },
    { id: "exercise-trap-qs", label: "Trap Qs", icon: "zap" },
    { id: "exercise-wpt-qs", label: "Word Problem Translator", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 1 — Test Structure",
      stem: "How many modules does each SAT Math section have?",
      choices: ["1 module", "3 modules", "4 modules", "2 modules (22 questions each)"],
      correct: 3,
      explanation: "Each SAT Math section has 2 adaptive modules with 22 questions each. Your Module 1 performance determines whether you get a harder or easier Module 2.",
    },
    {
      source: "Module 1 — Adaptivity",
      stem: "What determines whether you get a harder or easier Module 2?",
      choices: ["Your registration preferences", "The test proctor", "Random assignment", "Module 1 performance"],
      correct: 3,
      explanation: "The SAT is adaptive at the module level. A strong Module 1 performance routes you to a harder Module 2 with a higher scoring ceiling.",
    },
    {
      source: "Module 1 — Domains",
      stem: "Which of these is NOT one of the four SAT Math domains?",
      choices: ["Statistics & Modeling", "Problem-Solving & Data Analysis", "Algebra", "Advanced Math"],
      correct: 0,
      explanation: "The four SAT Math domains are: Algebra, Advanced Math, Problem-Solving & Data Analysis, and Geometry & Trigonometry. \"Statistics & Modeling\" is not a separate domain.",
    },
    {
      source: "Module 1 — Strategy",
      stem: "The SAT has no penalty for wrong answers. What is the best strategy for unanswered questions?",
      choices: ["Only guess if you can eliminate one choice", "Always guess", "Leave them blank", "Skip and come back later"],
      correct: 1,
      explanation: "With no penalty for wrong answers, you should always guess on any question you cannot answer. A blank answer has a 0% chance; a random guess has a 25% chance.",
    },
    {
      source: "Module 1 — Error Types",
      stem: "Classifying an error as \"solving correctly but answering what wasn't asked\" is which error type?",
      choices: ["Time management", "Computation error", "Misread/Trap", "Content gap"],
      correct: 2,
      explanation: "When you solve correctly but answer the wrong question (e.g., finding x when they asked for 2x + 1), that is a Misread/Trap error — the most preventable kind.",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "topic-2a",
      title: "Topic 2A \u2014 Linear Equations in One Variable",
      subtitle: "Solving, creating from word problems, number of solutions",
      body: [
        "Isolate the variable using inverse operations. Whatever you do to one side, do to the other.",
        "Number of solutions: One solution (normal), no solution (contradiction like 3 = 5), infinitely many (identity like 2x = 2x).",
        "Absolute value: |ax + b| = c produces TWO cases: ax + b = c AND ax + b = \u2212c.",
      ],
    },
    {
      id: "topic-2b",
      title: "Topic 2B \u2014 Linear Equations in Two Variables",
      subtitle: "Three forms, slope, parallel & perpendicular lines",
      visual: "three-forms",
      body: [
        "The SAT tests all three forms of linear equations. Tap each form above to learn when to use it.",
      ],
    },
    {
      id: "slope-relationships",
      title: "Slope Types & Special Relationships",
      subtitle: "Positive, negative, zero, undefined, parallel, perpendicular",
      visual: "slope",
      body: [
        "Parallel lines have the same slope. Perpendicular lines have slopes that are negative reciprocals (their product is \u22121).",
      ],
    },
    {
      id: "topic-2c",
      title: "Topic 2C \u2014 Systems of Linear Equations",
      subtitle: "Substitution, elimination, Desmos",
      visual: "systems",
      body: [
        "Three methods for solving systems. Choose the one that fits the problem structure best.",
      ],
    },
    {
      id: "topic-2d",
      title: "Topic 2D \u2014 Linear Inequalities",
      subtitle: "Solving, graphing, systems of inequalities",
      visual: "inequalities",
      body: [
        "Inequalities work exactly like equations with one critical exception: flipping the sign when multiplying or dividing by a negative.",
      ],
    },
    {
      id: "trap-taxonomy",
      title: "Six Traps That Recur Throughout the SAT",
      subtitle: "Math Trap Taxonomy",
      visual: "traps",
      body: [
        "Learn these by name. When you spot one in a problem, you will know exactly what to watch for.",
      ],
    },
    {
      id: "word-problem-translation",
      title: "Word Problem Translation Guide",
      subtitle: "English to Math",
      visual: "word-problems",
      body: [
        "Translating word problems into equations is an essential skill for SAT algebra. Memorize these common translations.",
      ],
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "If <code>4x \u2212 8 = 2x + 6</code>, what is the value of x?",
      choices: ["5", "14", "1", "7"],
      correct: 3,
      explanation: "4x − 8 = 2x + 6 → 2x = 14 → x = 7.",
      trapAnswer: 0,
      trapDesc: "Arithmetic error",
    },
    {
      stem: "What is the slope of the line <code>y = −3x + 12</code>?",
      choices: ["3", "−12", "12", "−3"],
      correct: 3,
      explanation: "In y = mx + b, the slope is m. Here m = −3.",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Confused y-intercept with slope — The Wrong Target",
    },
    {
      stem: "Which represents all values of x such that <code>3x − 5 > 7</code>?",
      choices: ["x > 12", "x > 2", "x < 4", "x > 4"],
      correct: 3,
      explanation: "3x − 5 > 7 → 3x > 12 → x > 4.",
      trapAnswer: 1,
      trapDesc: "Divided incorrectly",
    },
    {
      stem: "A line passes through (2, 5) and has slope −3. What is the y-intercept?",
      choices: ["−11", "11", "−1", "1"],
      correct: 1,
      explanation: "y − 5 = −3(x − 2) → y = −3x + 6 + 5 → y = −3x + 11. Y-intercept = 11.",
      trap: "distribution_ghost",
      trapAnswer: 3,
      trapDesc: "Sign error in distribution — The Distribution Ghost",
    },
    {
      stem: "If <code>2x + y = 10</code> and <code>x − y = 2</code>, what is the value of x?",
      choices: ["4", "3", "6", "2"],
      correct: 0,
      explanation: "Add the equations: 3x = 12 → x = 4.",
      trapAnswer: 3,
      trapDesc: "Arithmetic error",
    },
    {
      stem: "A gym costs $75 initiation plus $40/month. Which gives total cost C after m months?",
      choices: ["C = 40m + 75", "C = 75m + 40", "C = 115m", "C = 40m − 75"],
      correct: 0,
      explanation: "$40/month → 40m. $75 initiation → +75. C = 40m + 75.",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc: "Swapped slope and intercept — The Wrong Target",
    },
    {
      stem: "The system <code>3x + ky = 12</code> and <code>9x + 15y = 36</code> has infinitely many solutions. What is k?",
      choices: ["3", "9", "5", "15"],
      correct: 2,
      explanation: "For infinite solutions, equations must be proportional. 9x = 3(3x), 36 = 3(12), so 15y = 3(ky) → k = 5.",
      trapAnswer: 0,
      trapDesc: "Confused ratio",
    },
    {
      stem: "Line m has equation <code>y = (2/5)x − 3</code>. Line n is perpendicular to m and passes through (4, 1). What is the equation of line n?",
      choices: ["y = −(2/5)x + 11/5", "y = (5/2)x − 9", "y = −(5/2)x + 11", "y = (2/5)x − 3/5"],
      correct: 2,
      explanation: "Perpendicular slope = −5/2. Using (4,1): y − 1 = −(5/2)(x − 4) → y = −(5/2)x + 10 + 1 → y = −(5/2)x + 11.",
      trap: "imposter_subject",
      trapAnswer: 0,
      trapDesc: "Used same slope instead of perpendicular — The Imposter Subject",
    },
    {
      stem: "For what value of a does <code>3(2x − a) = 6x − 12</code> have infinitely many solutions?",
      choices: ["6", "4", "12", "2"],
      correct: 1,
      explanation: "Distribute: 6x − 3a = 6x − 12. For identity: −3a = −12 → a = 4. Any x works.",
      trap: "sign_flip",
      trapAnswer: 0,
      trapDesc: "Sign error when distributing — The Sign Flip",
    },
    {
      stem: "At a bakery, 3 muffins and 2 cookies cost $11.50. 1 muffin and 4 cookies cost $10.50. What is the cost of one cookie?",
      choices: ["$2.25", "$2.00", "$1.75", "$2.50"],
      correct: 1,
      explanation: "System: 3m + 2c = 11.50 and m + 4c = 10.50. From second: m = 10.50 − 4c. Substitute: 3(10.50 − 4c) + 2c = 11.50 → 31.50 − 12c + 2c = 11.50 → −10c = −20 → c = 2.00.",
      trap: "imposter_subject",
      trapAnswer: 3,
      trapDesc: "Solved for muffin cost instead of cookie — The Imposter Subject",
    },
  ],
  takeaways: [
    "Algebra is ~35% of the SAT \u2014 the single largest domain. Time invested here pays off the most.",
    "Know all three forms of linear equations: slope-intercept ($y = mx + b$), point-slope ($y - y_1 = m(x - x_1)$), standard ($Ax + By = C$).",
    "Parallel lines = same slope. Perpendicular lines = negative reciprocal slopes.",
    "Systems: substitution when a variable is isolated, elimination when coefficients align, Desmos for speed.",
    "When variables cancel in a system: true statement = infinite solutions, false statement = no solution.",
    "Inequalities: FLIP the sign when multiplying/dividing by a negative.",
    "Always re-read what the question is actually asking for before choosing your answer \u2014 the #1 algebra trap on the SAT.",
  ],
};
