"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  DecisionTreeVisual,
  StrategyCardsVisual,
  TimeBudgetVisual,
  SPRRulesVisual,
  CommonTrapsVisual,
  AdaptiveStrategyVisual,
} from "./lesson-visuals";

export default function PSAT89MathModule7() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/psat89-math/8"
      nextModuleLabel="Module 8: Practice Test & Final Review"
      visuals={{
        "strategy-decision-tree": <DecisionTreeVisual />,
        "plug-in-backsolve": <StrategyCardsVisual />,
        "time-management": <TimeBudgetVisual />,
        "spr-grid-in": <SPRRulesVisual />,
        "common-traps-review": <CommonTrapsVisual />,
        "adaptive-strategy": <AdaptiveStrategyVisual />,
      }}
      activities={{
        "exercise-dt": (goNext: () => void) => (
          <MatchingExercise
            items={DT_EXERCISE_DATA}
            title="Dt"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-piy": (goNext: () => void) => (
          <MatchingExercise
            items={PIY_EXERCISE_DATA}
            title="Plug In"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-bs": (goNext: () => void) => (
          <MatchingExercise
            items={BS_EXERCISE_DATA}
            title="Bs"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-bp": (goNext: () => void) => (
          <MatchingExercise
            items={BP_EXERCISE_DATA}
            title="Bp"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-trp": (goNext: () => void) => (
          <MatchingExercise
            items={TRP_EXERCISE_DATA}
            title="Misread Trap Detector"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

const DT_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Which expression is equivalent to <code>2(x+3)−x</code>?<br>A) x+6 B) x+3 C) 3x+3 D) 2x+6",
    "options": [
      "Backsolve",
      "Ballpark",
      "Plug In",
      "Desmos",
      "Direct Solve"
    ],
    "correct": 4,
    "explanation": "Distribute and simplify — straightforward algebra. $2x+6−x = x+6$."
  },
  {
    "prompt": "If <code>3x−5=22</code>, what is x?<br>A) 7 B) 9 C) 11 D) 13",
    "options": [
      "Desmos",
      "Backsolve",
      "Ballpark",
      "Plug In",
      "Direct Solve"
    ],
    "correct": 1,
    "explanation": "Number answers → try B or C. 3(9)−5=22 ✓. Or direct solve works too."
  },
  {
    "prompt": "If a is a positive integer, which expression equals <code>(a²−a)/a</code>?<br>A) a−1 B) a C) a²−1 D) a+1",
    "options": [
      "Desmos",
      "Plug In",
      "Backsolve",
      "Direct Solve",
      "Ballpark"
    ],
    "correct": 1,
    "explanation": "Variables in answers → PIYON. Try $a=3$: (9−3)/3=2. A) 2 ✓."
  },
  {
    "prompt": "Where do <code>y=x²−4</code> and <code>y=x+2</code> intersect?",
    "options": [
      "Backsolve",
      "Plug In",
      "Desmos",
      "Ballpark",
      "Direct Solve"
    ],
    "correct": 2,
    "explanation": "Two functions → graph both in Desmos and click the intersection dots."
  },
  {
    "prompt": "A rectangle has area 180 and width 12. What is the perimeter?<br>A) 30 B) 48 C) 54 D) 60",
    "options": [
      "Backsolve",
      "Ballpark",
      "Plug In",
      "Desmos",
      "Direct Solve"
    ],
    "correct": 4,
    "explanation": "Length = 180/12 = 15. Perimeter = 2(15+12) = 54. Quick arithmetic."
  },
  {
    "prompt": "A shirt originally costs $60. After a 30% discount and 8% tax, which is closest to the final price?<br>A) $38 B) $42 C) $45 D) $50",
    "options": [
      "Plug In",
      "Direct Solve",
      "Backsolve",
      "Ballpark",
      "Desmos"
    ],
    "correct": 3,
    "explanation": "Ballpark: 30% off $60 ≈ $42, then tax adds ~$3.50 ≈ $45. Or compute exactly."
  },
  {
    "prompt": "For what value of k does <code>y=kx+4</code> pass through (6, 22)?<br>A) 2 B) 3 C) 4 D) 6",
    "options": [
      "Desmos",
      "Backsolve",
      "Ballpark",
      "Plug In",
      "Direct Solve"
    ],
    "correct": 1,
    "explanation": "Number answers → try B: 3(6)+4=22 ✓. Or use a Desmos slider."
  },
  {
    "prompt": "A study finds students who sleep more get better grades. Valid conclusion?<br>A) Sleep causes better grades B) Correlation only C) No relationship D) Need more data",
    "options": [
      "Backsolve",
      "Ballpark",
      "Plug In",
      "Desmos",
      "Direct Solve"
    ],
    "correct": 4,
    "explanation": "Conceptual question — no math needed. Observational → correlation only."
  }
];

const PIY_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "If n is a positive integer, which equals <code>(n² + n) / n</code>?",
    "options": [
      "n²",
      "2n",
      "n − 1",
      "n + 1"
    ],
    "correct": 3,
    "explanation": "Plug in $n=2$: (4+2)/2 = 3. A) 2+1=3 ✓. (Or simplify: n+1.)"
  },
  {
    "prompt": "If $x = 5$, which expression has the greatest value?",
    "options": [
      "x + 7",
      "2x + 1",
      "x² / 5",
      "3(x − 1)"
    ],
    "correct": 3,
    "explanation": "$x=5$: A) 11, B) 5, C) 12, D) 12. C and D tie — but C = 3(4)=12, D = 12. Check another: $x=10$: C=27, D=17. C wins."
  },
  {
    "prompt": "A store marks up items by p percent. If an item costs $c, the selling price is:",
    "options": [
      "c(1 + p/100)",
      "c + p",
      "c + 100p",
      "cp/100"
    ],
    "correct": 0,
    "explanation": "Plug in $c=100$, $p=20$: price should be $120. B) 100(1.20) = 120 ✓."
  },
  {
    "prompt": "If a rectangle has length 2w and width w, its perimeter is:",
    "options": [
      "6w",
      "8w",
      "4w",
      "3w"
    ],
    "correct": 0,
    "explanation": "Plug in $w=5$: length=10, width=5. P = 2(10+5)=30. C) 6(5)=30 ✓."
  }
];

const BS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "If <code>2x + 7 = 19</code>, what is x?",
    "options": [
      "7",
      "6",
      "4",
      "5"
    ],
    "correct": 1,
    "explanation": "Try C: 2(6)+7 = 19 ✓. Done."
  },
  {
    "prompt": "A number tripled and then decreased by 5 equals 22. What is the number?",
    "options": [
      "9",
      "10",
      "8",
      "7"
    ],
    "correct": 0,
    "explanation": "Try C: 3(9)−5 = 22 ✓."
  },
  {
    "prompt": "If the area of a square is 144, what is the side length?",
    "options": [
      "10",
      "14",
      "12",
      "11"
    ],
    "correct": 2,
    "explanation": "Try C: 12² = 144 ✓. (Or recognize sqrt(144) = 12.)"
  },
  {
    "prompt": "If <code>x² − 5x = 14</code>, what positive value of x satisfies the equation?",
    "options": [
      "5",
      "9",
      "2",
      "7"
    ],
    "correct": 3,
    "explanation": "Try C: 49−35=14 ✓. (Negative solution $x=−2$ also works but question asks for positive.)"
  }
];

const BP_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "A car travels 287 miles in 4.5 hours. What is the average speed?",
    "options": [
      "64 mph",
      "72 mph",
      "48 mph",
      "128 mph"
    ],
    "correct": 0,
    "explanation": "Ballpark: 280/4.5 ≈ 280/5 = 56, but /4.5 is bigger → ~63. Eliminate A (too low) and D (way too high). B is closest."
  },
  {
    "prompt": "15% of 392 is approximately:",
    "options": [
      "39",
      "59",
      "20",
      "79"
    ],
    "correct": 1,
    "explanation": "10% of 392 = 39.2. 15% = 39.2 + half of 39.2 ≈ 39 + 20 = ~59. Eliminate A and D immediately."
  },
  {
    "prompt": "A circle has diameter 20. Its area is closest to:",
    "options": [
      "63",
      "126",
      "1257",
      "314"
    ],
    "correct": 3,
    "explanation": "$r=10$, A=pi(100) ≈ 314. Eliminate A (too small), D (way too big). C is exact."
  },
  {
    "prompt": "If 3/8 of a class of 200 students play sports, how many play sports?",
    "options": [
      "24",
      "125",
      "75",
      "60"
    ],
    "correct": 2,
    "explanation": "3/8 is a bit less than half. Half of 200 = 100. So answer < 100. Eliminate D. 3/8 × 200 = 75. C."
  }
];

const TRP_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Solve <code>2x + 4 = 12</code>. What is <code>3x − 1</code>?<br>A student solves $x = 4$ and picks 4. What went wrong?",
    "options": [
      "Wrong equation",
      "Arithmetic error",
      "Forgot negative",
      "Solved for x, not 3x − 1"
    ],
    "correct": 3,
    "explanation": "The question asks for 3x−1, not x. Answer: 3(4)−1 = 11."
  },
  {
    "prompt": "A graph has y-axis labeled 0, 50, 100, 150. A student reads a point at y ≈ 3 grid lines up as \"3.\" What went wrong?",
    "options": [
      "Calculator error",
      "Misread axis scale",
      "Mixed up x and y",
      "Wrong point"
    ],
    "correct": 1,
    "explanation": "Each grid line = 50, not 1. The point is at $y = 150$, not 3."
  },
  {
    "prompt": "\"Which of the following is NOT a solution?\" A student picks a correct solution. What went wrong?",
    "options": [
      "Wrong formula",
      "Forgot to simplify",
      "Calculator error",
      "Missed the word NOT"
    ],
    "correct": 3,
    "explanation": "Negation trap — the student missed NOT and picked a solution instead of a non-solution."
  },
  {
    "prompt": "A price drops 25% then gets 10% tax. A student gives the discounted price (before tax) as the answer. What went wrong?",
    "options": [
      "Wrong percent",
      "Gave intermediate answer",
      "Forgot negative",
      "Misread axis scale"
    ],
    "correct": 1,
    "explanation": "The question asks for the FINAL price (after tax), not the intermediate discounted price."
  },
  {
    "prompt": "\"At least 18 students passed.\" A student writes the inequality as $x > 18$. What went wrong?",
    "options": [
      "Arithmetic error",
      "At least means >=, not >",
      "Wrong variable",
      "Mixed up x and y"
    ],
    "correct": 1,
    "explanation": "\"At least 18\" means 18 or more → $x >= 18$, not $x > 18$."
  },
  {
    "prompt": "The answer to a problem is $x = −5$. A student enters 5 in the SPR box. What went wrong?",
    "options": [
      "Wrong equation",
      "Dropped the negative sign",
      "Gave intermediate answer",
      "Misread axis scale"
    ],
    "correct": 1,
    "explanation": "Sign errors are the #1 SPR mistake. Always double-check positive/negative."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "math",
  moduleNum: 7,
  title: "Strategy & Time Management",
  subtitle: "Test-taking tactics and pacing",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "welcome" },
    { id: "warmup", label: "Warm-Up", icon: "warmup" },
    { id: "lesson", label: "Lesson", icon: "lesson" },
    { id: "exercise-dt", label: "Dt", icon: "zap" },
    { id: "exercise-piy", label: "Plug In", icon: "zap" },
    { id: "exercise-bs", label: "Bs", icon: "zap" },
    { id: "exercise-bp", label: "Bp", icon: "zap" },
    { id: "exercise-trp", label: "Misread Trap Detector", icon: "zap" },
    { id: "quiz", label: "Practice", icon: "quiz" },
    { id: "complete", label: "Complete", icon: "complete" },
  ],
  warmup: [
    {
      source: "Module 6 -- Desmos Basics",
      stem: "What should you do to solve a system of equations in Desmos?",
      choices: [
        "Type both equations and look for the formula",
        "Use a slider for each variable",
        "Graph both and click the intersection dot",
        "Run a regression"
      ],
      correct: 2,
      explanation:
        "Graph both equations. Where they cross, a gray dot appears -- click it to see the exact $(x, y)$ solution.",
    },
    {
      source: "Module 6 -- Shortcuts",
      stem: "Which key creates an exponent in Desmos?",
      choices: ["_", "~", "^", "*"],
      correct: 2,
      explanation:
        "Type $x$^$2$ to get $x^2$. The caret (^) is your exponent key.",
    },
    {
      source: "Module 6 -- Regression",
      stem: "To find a line of best fit for data in Desmos, you type:",
      choices: [
        "$y = mx + b$",
        "$y_1 \\sim mx_1 + b$",
        "best_fit(data)",
        "regression(x, y)"
      ],
      correct: 1,
      explanation:
        "After entering data in a table, type $y_1 \\sim mx_1 + b$ (use _ for subscript, ~ for regression).",
    },
    {
      source: "Module 6 -- When to Use",
      stem: "Which problem is BEST solved with Desmos?",
      choices: [
        "Where do $y = x^2$ and $y = 2x + 3$ intersect?",
        "What is $P(A|B)$?",
        "What is $8 \\times 7$?",
        "Is correlation the same as causation?"
      ],
      correct: 0,
      explanation:
        "Systems and intersections are Desmos's sweet spot. Conceptual and probability questions don't benefit.",
    },
    {
      source: "Module 6 -- CAS Limitations",
      stem: "Can Desmos factor the expression $x^2 - 5x + 6$?",
      choices: [
        "Only with a plugin",
        "No -- Desmos is not a CAS",
        "Yes, type factor($x^2 - 5x + 6$)",
        "Yes if you use scientific mode"
      ],
      correct: 1,
      explanation:
        "Desmos cannot factor or simplify algebraically. But you CAN graph $y = x^2 - 5x + 6$ and find zeros at $x = 2$ and $x = 3$.",
    },
  ],
  lessons: [
    {
      id: "strategy-decision-tree",
      title: "The Strategy Decision Tree",
      subtitle: "Topic 7A",
      visual: "strategy-decision-tree",
      body: [
        "Before solving, follow this 5-step decision tree to pick the fastest strategy for every question.",
        "Strategy beats speed. Most points are lost from picking the wrong approach, not from slow math.",
      ],
    },
    {
      id: "plug-in-backsolve",
      title: "Plug In & Backsolve Deep Dive",
      subtitle: "Topic 7B",
      visual: "plug-in-backsolve",
      body: [
        "Tap each card to see a worked example. These three strategies cover every question where direct algebra isn't obvious.",
      ],
    },
    {
      id: "time-management",
      title: "Time Management & Pacing",
      subtitle: "Topic 7C",
      visual: "time-management",
      body: [
        "35 minutes for 22 questions. The two-pass system and per-question time targets keep you on pace.",
        "No penalty for guessing — always answer every question before time expires.",
      ],
    },
    {
      id: "spr-grid-in",
      title: "Student-Produced Response (SPR) Tips",
      subtitle: "Topic 7D",
      visual: "spr-grid-in",
      body: [
        "SPR questions make up ~25% of the test. Know the formatting rules to avoid losing easy points.",
      ],
    },
    {
      id: "common-traps-review",
      title: "Common Traps: Final Review",
      subtitle: "Topic 7E",
      visual: "common-traps-review",
      body: [
        "Tap each trap to see the fix. Recognizing these patterns prevents the most common point losses.",
      ],
    },
    {
      id: "adaptive-strategy",
      title: "Adaptive Module Strategy",
      subtitle: "Topic 7F",
      visual: "adaptive-strategy",
      body: [
        "The PSAT 8/9 is adaptive: your Module 1 performance determines Module 2 difficulty. Getting into Hard M2 is worth 40-80 points.",
      ],
    },
  ],
  quiz: [
    {
      stem: "Solve: $5x - 3 = 17$",
      choices: ["4", "3", "5", "2"],
      correct: 0,
      explanation: "$5x = 20 \\Rightarrow x = 4$. Quick direct solve.",
      difficulty: "easy",
      type: "7A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "What is the area of a triangle with base 10 and height 6?",
      choices: ["120", "30", "16", "60"],
      correct: 1,
      explanation: "$A = \\frac{1}{2}(10)(6) = 30$.",
      difficulty: "easy",
      type: "7A",
      trapAnswer: 2,
      trapDesc: "Used $bh$ instead of $\\frac{1}{2}bh$ -- forgot the half",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If $x^2 - 3x = 10$, what positive value of $x$ works?",
      choices: ["2", "4", "3", "5"],
      correct: 3,
      explanation:
        "Try D: $25 - 15 = 10$. Backsolving is fast here.",
      difficulty: "easy",
      type: "7B",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If $m$ is positive, which equals $(4m + 8)/4$?",
      choices: ["$m + 2$", "$m + 8$", "$m/2 + 2$", "$4m + 2$"],
      correct: 0,
      explanation:
        "Plug in $m = 4$: $(16 + 8)/4 = 6$. A) $4 + 2 = 6$.",
      difficulty: "medium",
      type: "7B",
      trapAnswer: 1,
      trapDesc: "$m + 8$: forgot to divide the 8 by 4 too",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "At what point do $y = 2x - 1$ and $y = -x + 8$ intersect?",
      choices: ["$(3, 6)$", "$(4, 4)$", "$(3, 5)$", "$(2, 3)$"],
      correct: 2,
      explanation:
        "Graph both in Desmos, click intersection: $(3, 5)$. Check: $2(3) - 1 = 5$, $-3 + 8 = 5$.",
      difficulty: "medium",
      type: "7C",
      trapAnswer: 0,
      trapDesc:
        "$(2, 3)$: $2(2) - 1 = 3$ works for first but $-2 + 8 = 6 \\neq 3$",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "18% of 495 is closest to:",
      choices: ["89", "99", "72", "49"],
      correct: 0,
      explanation:
        "Ballpark: 20% of 500 $= 100$. 18% is a bit less, so approximately 89.",
      difficulty: "medium",
      type: "7D",
      trapAnswer: 3,
      trapDesc: "99 is close to 20% -- used wrong percentage",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If $4x + 2 = 18$, what is $2x + 1$?",
      choices: ["9", "18", "8", "4"],
      correct: 0,
      explanation:
        "$4x + 2 = 18 \\Rightarrow 2(2x + 1) = 18 \\Rightarrow 2x + 1 = 9$.",
      difficulty: "medium",
      type: "7E",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc:
        "Solved for $x = 4$ but question asked for $2x + 1$ -- The Wrong Target",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "For all positive $n$, which is equivalent to $\\frac{n}{n+1} + \\frac{1}{n+1}$?",
      choices: ["$\\frac{2n}{n+1}$", "1", "$n$", "$\\frac{n+1}{n+2}$"],
      correct: 1,
      explanation:
        "Same denominator: $\\frac{n + 1}{n + 1} = 1$. Or plug in $n = 2$: $2/3 + 1/3 = 1$.",
      difficulty: "hard",
      type: "7B",
      trapAnswer: 1,
      trapDesc: "$n$ is not simplified -- need to combine fractions first",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "How many real solutions does $x^2 + 4x + 5 = 0$ have?",
      choices: ["2", "0", "Infinite", "1"],
      correct: 1,
      explanation:
        "Graph $y = x^2 + 4x + 5$. The parabola sits above the x-axis -- never touches it. Zero solutions.",
      difficulty: "hard",
      type: "7C",
      trapAnswer: 2,
      trapDesc: "Assumed quadratic always has 2 solutions",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "SPR: If $|x - 3| = 7$, what is one possible value of $x$?",
      choices: [
        "3",
        "Both 10 and $-4$ are correct",
        "$-4$",
        "10"
      ],
      correct: 1,
      explanation:
        "$x - 3 = 7 \\Rightarrow x = 10$. Or $x - 3 = -7 \\Rightarrow x = -4$. Both are valid SPR answers.",
      difficulty: "hard",
      type: "7E",
      trap: "one_case",
      trapAnswer: 0,
      trapDesc:
        "Only found $x = 10$, missed the negative case $x = -4$",
      domain: "Algebra",
      skill: "linear_equations",
    },
  ],
  takeaways: [
    "Module 1 accuracy > Module 2 speed. Getting into hard M2 is worth 40-80 points.",
    "Two-pass system: Pass 1 (25 min) = answer what you can. Pass 2 (10 min) = return to flagged.",
    "5-Second Decision Tree: direct solve -> plug in -> backsolve -> Desmos -> ballpark.",
    "PIYON: Variables in answers -> choose simple numbers, find target, match.",
    "Backsolve: Number answers -> start with B/C and test.",
    "Ballpark: Estimate first, eliminate clearly wrong, pick from what's left.",
    "SPR rules: fractions OK, negatives OK, no mixed numbers, always re-read what they ask for.",
    "No penalty for guessing -- never leave a question blank.",
    "Most missed points are from misreading, not math. Underline what the question asks.",
  ],
};
