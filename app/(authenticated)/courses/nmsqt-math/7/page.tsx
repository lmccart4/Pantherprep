"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  AdaptiveStrategyVisual,
  DecisionTreeVisual,
  PlugInVisual,
  BacksolveBallparkVisual,
  TimeBudgetVisual,
  GridInRulesVisual,
  TrapCatalogVisual,
} from "./lesson-visuals";

const DT_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "If a is a positive integer, which expression equals <code>(a² − 4)/(a − 2)</code>?",
    "options": [
      "Desmos",
      "Plug In",
      "Backsolve",
      "Solve Directly"
    ],
    "correct": 1,
    "explanation": "Variables in answer choices → Plug In. Try $a=3$: (9−4)/1=5. Check: $a+2=5$ ✓."
  },
  {
    "prompt": "What is x if $5x − 3 = 2x + 9$? Choices: 2, 3, 4, 5",
    "options": [
      "Desmos",
      "Plug In",
      "Solve Directly",
      "Backsolve"
    ],
    "correct": 3,
    "explanation": "Number answers → Backsolve. Try 4: 5(4)−3=17, 2(4)+9=17. ✓"
  },
  {
    "prompt": "At what point do $y = x² − 1$ and $y = 2x + 1$ intersect?",
    "options": [
      "Desmos",
      "Solve Directly",
      "Backsolve",
      "Plug In"
    ],
    "correct": 0,
    "explanation": "System with quadratic → Graph both in Desmos, click intersections."
  },
  {
    "prompt": "What is 7 × 13?",
    "options": [
      "Solve Directly",
      "Backsolve",
      "Desmos",
      "Plug In"
    ],
    "correct": 0,
    "explanation": "Simple arithmetic = solve directly. 91."
  },
  {
    "prompt": "A car goes ~55 mph for 3.75 hours. Distance? Choices: 105, 165, 206, 412",
    "options": [
      "Solve Directly",
      "Desmos",
      "Plug In",
      "Ballpark + POE"
    ],
    "correct": 3,
    "explanation": "~55×4=220. Closest is 206. Exact: 55×3.75=206.25."
  },
  {
    "prompt": "Which graph represents $y =$ −(x + 2)² + 3?",
    "options": [
      "Desmos",
      "Solve Directly",
      "Backsolve",
      "Plug In"
    ],
    "correct": 0,
    "explanation": "Graph it in Desmos and match. Vertex (−2, 3), opens down."
  },
  {
    "prompt": "For all x, which equals 2(3x − 1) + 4(x + 5)? Choices have variables.",
    "options": [
      "Desmos",
      "Plug In",
      "Backsolve",
      "Solve Directly"
    ],
    "correct": 1,
    "explanation": "Variables in choices → Plug In. Try $x=2$: 2(5)+4(7)=38. Test each."
  },
  {
    "prompt": "Rectangle area = 40, length = width + 3. Width? Choices: 3, 4, 5, 6",
    "options": [
      "Desmos",
      "Plug In",
      "Solve Directly",
      "Backsolve"
    ],
    "correct": 3,
    "explanation": "Number answers → Backsolve. Try 5: 5×8=40. ✓ Width = 5."
  },
  {
    "prompt": "If f(x) = 3x + 2, what is f(f(1))?",
    "options": [
      "Solve Directly",
      "Backsolve",
      "Desmos",
      "Plug In"
    ],
    "correct": 0,
    "explanation": "f(1)=5, f(5)=17. Direct solve is fastest."
  },
  {
    "prompt": "Find the line of best fit for 10 data points.",
    "options": [
      "Desmos",
      "Solve Directly",
      "Backsolve",
      "Plug In"
    ],
    "correct": 0,
    "explanation": "Regression → Desmos table + y₁ ~ mx₁ + b. Only option."
  }
];

const PI_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "If n is positive, which equals <code>(n² + n) / n</code>?",
    "options": [
      "n²",
      "2n",
      "n − 1",
      "n + 1"
    ],
    "correct": 3,
    "explanation": "Plug In $n=3$: (9+3)/3=4. $n+1=4$ ✓, $n²=9$ ✗, $n−1=2$ ✗, $2n=6$ ✗."
  },
  {
    "prompt": "Store reduces prices by p%. Item costs d dollars. Sale price?",
    "options": [
      "d − pd",
      "d − p",
      "d(1 − p/100)",
      "dp/100"
    ],
    "correct": 2,
    "explanation": "Plug In $d=100$, $p=20$: price=$80. d(1−p/100)=100(0.8)=80 ✓."
  },
  {
    "prompt": "If $x > 0$, which equals <code>√(4x²)</code>?",
    "options": [
      "4x",
      "4x²",
      "2x²",
      "2x"
    ],
    "correct": 3,
    "explanation": "Plug In $x=3$: √(36)=6. $2x=6$ ✓, $4x=12$ ✗."
  },
  {
    "prompt": "Which equals <code>(a + b)² − (a − b)²</code>?",
    "options": [
      "2b²",
      "0",
      "2a²",
      "4ab"
    ],
    "correct": 3,
    "explanation": "Plug In $a=2$, $b=3$: 25−1=24. 4ab=24 ✓."
  }
];

const BS_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "If $2x + 5 = 17$, what is x?",
    "options": [
      "7",
      "6",
      "4",
      "5"
    ],
    "correct": 1,
    "explanation": "Try 6: 2(6)+5=17 ✓."
  },
  {
    "prompt": "A number doubled and increased by 3 equals 19.",
    "options": [
      "7",
      "6",
      "8",
      "9"
    ],
    "correct": 2,
    "explanation": "Try 8: 2(8)+3=19 ✓."
  },
  {
    "prompt": "If $x² − 5x = 14$, what is a positive value of x?",
    "options": [
      "5",
      "14",
      "2",
      "7"
    ],
    "correct": 3,
    "explanation": "Try 7: 49−35=14 ✓."
  },
  {
    "prompt": "Sum of 3 consecutive integers is 33. What is the smallest?",
    "options": [
      "9",
      "10",
      "12",
      "11"
    ],
    "correct": 1,
    "explanation": "Try 10: 10+11+12=33 ✓."
  }
];

const BP_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "18% of 412 is approximately? Which is WRONG?",
    "options": [
      "80",
      "412",
      "74",
      "70"
    ],
    "correct": 1,
    "explanation": "~20% of 400=80. 412 is absurd — that's the whole number, not 18% of it."
  },
  {
    "prompt": "Population triples every decade from 200. After 3 decades? WRONG answer:",
    "options": [
      "2,700",
      "18,000",
      "5,400",
      "600"
    ],
    "correct": 3,
    "explanation": "200→600→1,800→5,400. 600 is only one tripling."
  },
  {
    "prompt": "Square with area 50. Side length? WRONG answer:",
    "options": [
      "7.07",
      "5",
      "25",
      "8"
    ],
    "correct": 2,
    "explanation": "√50≈7.07. 25 would give area 625."
  },
  {
    "prompt": "300 miles on 12 gallons. MPG? WRONG answer:",
    "options": [
      "25",
      "20",
      "3,600",
      "36"
    ],
    "correct": 2,
    "explanation": "300÷12=25. 3,600 is miles × gallons (wrong operation)."
  },
  {
    "prompt": "30% discount on $89. Sale price? WRONG answer:",
    "options": [
      "$65",
      "$62.30",
      "$59.30",
      "$26.70"
    ],
    "correct": 3,
    "explanation": "Pay 70% of $89≈$62. $26.70 is 30% of 89 (the discount amount, not the price)."
  }
];

const GI_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "\"Find 2x if $3x = 15$.\" Student entered: 5",
    "options": [
      "Correct",
      "Trap!"
    ],
    "correct": 1,
    "explanation": "$x=5$, but asked for $2x=10$. Student answered x, not 2x!"
  },
  {
    "prompt": "\"What is 3/7 as a decimal?\" Student entered: 0.428",
    "options": [
      "Trap!",
      "Correct"
    ],
    "correct": 1,
    "explanation": "3/7=0.42857… Truncated to 0.428 is accepted. Could also enter 3/7."
  },
  {
    "prompt": "\"How many solutions does $x²+4=0$ have?\" Student entered: 2",
    "options": [
      "Correct",
      "Trap!"
    ],
    "correct": 1,
    "explanation": "$x²=−4$ has NO real solutions. Answer: 0."
  },
  {
    "prompt": "\"What is the y-intercept?\" Student entered: (0, 5)",
    "options": [
      "Correct",
      "Trap!"
    ],
    "correct": 1,
    "explanation": "Grid-in only accepts numbers, not coordinate pairs. Answer should be just 5."
  },
  {
    "prompt": "\"Solve |x−3|=7.\" Student entered: 10",
    "options": [
      "Trap!",
      "Correct"
    ],
    "correct": 1,
    "explanation": "$x=10$ or $x=−4$. Grid-in accepts any correct value. 10 works."
  },
  {
    "prompt": "\"Positive difference between roots of $x²−5x+6=0$.\" Student entered: 3",
    "options": [
      "Correct",
      "Trap!"
    ],
    "correct": 1,
    "explanation": "Roots are 2 and 3. Difference=|3−2|=1, not 3. Student entered a root, not the difference."
  }
];

const MIX_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "If k is a positive integer, which equals <code>(k³ − k) / k</code>?",
    "options": [
      "k² − 1",
      "k³ − 1",
      "k² − k",
      "k − 1"
    ],
    "correct": 0,
    "explanation": "Plug In $k=2$: (8−2)/2=3. $k²−1=3$ ✓. Or simplify: k(k²−1)/k=k²−1."
  },
  {
    "prompt": "If $4x − 3 = 2x + 7$, what is x?",
    "options": [
      "2",
      "4",
      "3",
      "5"
    ],
    "correct": 3,
    "explanation": "Backsolve D) $x=5$: 4(5)−3=17, 2(5)+7=17. ✓"
  },
  {
    "prompt": "A circle has radius 8. Which is closest to its area?",
    "options": [
      "200.96",
      "25.13",
      "804.25",
      "50.27"
    ],
    "correct": 0,
    "explanation": "Ballpark: πr²≈3.14×64≈200. Only C is close."
  },
  {
    "prompt": "For what value of x does 2^x = 10?",
    "options": [
      "10",
      "3.32",
      "3",
      "5"
    ],
    "correct": 1,
    "explanation": "Desmos: Graph y=2^x and $y=10$. Intersection at x≈3.32."
  }
];

export default function NMSQTMathModule7() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "adaptive-strategy": <AdaptiveStrategyVisual />,
        "decision-tree": <DecisionTreeVisual />,
        "plug-in": <PlugInVisual />,
        "backsolve-ballpark": <BacksolveBallparkVisual />,
        "time-budget": <TimeBudgetVisual />,
        "grid-in-rules": <GridInRulesVisual />,
        "trap-catalog": <TrapCatalogVisual />,
      }}
      activities={{
        "exercise-dt-qs": (goNext: () => void) => (
          <MatchingExercise
            items={DT_QS_EXERCISE}
            title="Decision Tree"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-pi-qs": (goNext: () => void) => (
          <MatchingExercise
            items={PI_QS_EXERCISE}
            title="Plug In"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-bs-qs": (goNext: () => void) => (
          <MatchingExercise
            items={BS_QS_EXERCISE}
            title="Backsolve"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-bp-qs": (goNext: () => void) => (
          <MatchingExercise
            items={BP_QS_EXERCISE}
            title="Ballpark"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-gi-qs": (goNext: () => void) => (
          <MatchingExercise
            items={GI_QS_EXERCISE}
            title="Grid-In Traps"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-mix-qs": (goNext: () => void) => (
          <MatchingExercise
            items={MIX_QS_EXERCISE}
            title="Mixed Strategy"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/nmsqt-math/8"
      nextModuleLabel="Module 8: Practice Test, Error Analysis & Test-Day Prep"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "math",
  moduleNum: 7,
  title: "Strategy Toolkit & Time Management",
  subtitle:
    "You know the content. Now learn the strategies that turn knowledge into points \u2014 fast.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-dt-qs", label: "Decision Tree", icon: "zap" },
    { id: "exercise-pi-qs", label: "Plug In", icon: "zap" },
    { id: "exercise-bs-qs", label: "Backsolve", icon: "zap" },
    { id: "exercise-bp-qs", label: "Ballpark", icon: "zap" },
    { id: "exercise-gi-qs", label: "Grid-In Traps", icon: "zap" },
    { id: "exercise-mix-qs", label: "Mixed Strategy", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "adaptive-strategy",
      title: "Understanding the Adaptive Format",
      subtitle: "PSAT-Specific",
      visual: "adaptive-strategy",
      body: [
        "The PSAT Math section has 44 questions across two 35-minute modules. Module 1 performance determines Module 2 difficulty \u2014 and your score ceiling. Getting routed to the harder Module 2 is the single most important factor in reaching National Merit territory.",
      ],
    },
    {
      id: "decision-tree",
      title: "The 5-Second Decision Tree",
      subtitle: "Core Framework",
      visual: "decision-tree",
      body: [
        "When you read a question, use this decision tree within 5 seconds to choose the fastest approach. Indecision wastes more time than choosing the wrong method.",
      ],
    },
    {
      id: "plug-in",
      title: "Plug In Your Own Numbers (PIYON)",
      subtitle: "Strategy 1",
      visual: "plug-in",
      body: [
        "When you see variables in answer choices, pick easy numbers (2, 3, 5, 10, 100), solve to get a target answer, then test each choice with your numbers.",
      ],
    },
    {
      id: "backsolve-ballpark",
      title: "Backsolve & Ballpark",
      subtitle: "Strategies 2 & 3",
      visual: "backsolve-ballpark",
      body: [
        "Two complementary strategies: Backsolve when answer choices are numbers, Ballpark when estimation can eliminate choices. Together they cover most PSAT question types.",
      ],
    },
    {
      id: "time-budget",
      title: "Time Budget & Two-Pass System",
      subtitle: "Time Management",
      visual: "time-budget",
      body: [
        "The two-pass system is your time management framework. First pass: answer confident questions. Second pass: return to flagged questions. Last 2 minutes: LOTD for all remaining.",
      ],
    },
    {
      id: "grid-in-rules",
      title: "Grid-In (Student-Produced Response) Rules",
      subtitle: "Format Rules",
      visual: "grid-in-rules",
      body: [
        "About 25% of PSAT math questions are student-produced responses (grid-ins). The format is more forgiving than you think \u2014 but the traps are real.",
      ],
    },
    {
      id: "trap-catalog",
      title: "The 8 Named Traps",
      subtitle: "Trap Catalog",
      visual: "trap-catalog",
      body: [
        "These 8 traps cost students points on every test. Recognizing them by name helps you catch them in real time. Tap each card to see the description.",
      ],
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 6 — Intersections",
      stem: "How do you find where two equations intersect in Desmos?",
      choices: ["Type \"solve\" and enter both equations", "Use the slider tool on both lines", "Graph both and click the intersection dot", "Enter a table with both equations’ values"],
      correct: 2,
      explanation: "Graph both equations in Desmos. A gray dot appears at the intersection — click it to see the exact coordinates.",
    },
    {
      source: "Module 6 — Regression",
      stem: "You need to find the line of best fit for data points. In Desmos, after entering a table, what do you type?",
      choices: ["bestfit(x,y)", "linreg(table1)", "regression(y,x)", "y₁ ~ mx₁ + b"],
      correct: 3,
      explanation: "After entering data in a table, type y₁ ~ mx₁ + b on a new line. Use _ for subscript and ~ for the regression operator.",
    },
    {
      source: "Module 6 — Solutions",
      stem: "How many real solutions does $x² − 4x + 5 = 0$ have? (Use Desmos approach)",
      choices: ["1 — parabola touches x-axis once", "2 — parabola crosses x-axis twice", "0 — graph it, parabola stays above x-axis", "Cannot determine with Desmos"],
      correct: 2,
      explanation: "Graph $y = x² − 4x + 5$ in Desmos. The parabola sits entirely above the x-axis — no x-intercepts, so 0 real solutions. Discriminant: 16−20 = −4 < 0.",
    },
    {
      source: "Module 6 — Shortcuts",
      stem: "What keyboard shortcut creates an exponent (like x²) in Desmos?",
      choices: ["Ctrl+E", "^ (caret)", "** (double asterisk)", "exp()"],
      correct: 1,
      explanation: "The caret key (^) creates exponents in Desmos. Type x^2 to get x². This is one of the must-memorize shortcuts.",
    },
    {
      source: "Module 6 — Calculator Discipline",
      stem: "The 5-second rule for Desmos means:",
      choices: ["Spend exactly 5 seconds on each calculation", "Graph for 5 seconds then switch to scientific mode", "If you can’t set it up in 5 seconds, switch to algebra", "Always wait 5 seconds before clicking an answer"],
      correct: 2,
      explanation: "If you can’t figure out how to enter a problem into Desmos within 5 seconds, switch to algebra. Desmos is a tool, not a crutch.",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "If a is a positive integer, which expression equals <code>(a² − 4)/(a − 2)</code>?",
      choices: ["a² − 2", "a − 2", "2a", "a + 2"],
      correct: 3,
      explanation: "<strong>Plug In $a=3$:</strong> (9−4)/(3−2) = 5/1 = 5. $a+2 = 5$ ✓. Or factor: (a−2)(a+2)/(a−2) = a+2.",
      trap: "wrong_variable",
      trapAnswer: 1,
      trapDesc: "Picked a−2 instead of a+2 — solved for the wrong part of the factoring",
    },
    {
      stem: "If $4x − 3 = 2x + 7$, what is x?",
      choices: ["2", "4", "3", "5"],
      correct: 3,
      explanation: "<strong>Backsolve D) $x=5$:</strong> 4(5)−3=17, 2(5)+7=17. ✓ Equal!",
      trap: "intermediate_answer",
      trapAnswer: 2,
      trapDesc: "Stopped at an intermediate step instead of finishing the calculation",
    },
    {
      stem: "A circle has radius 8. Its area is closest to:",
      choices: ["200.96", "25.13", "804.25", "50.27"],
      correct: 0,
      explanation: "<strong>Ballpark:</strong> πr² ≈ 3.14 × 64 ≈ 200. Only C is close.",
      trap: "wrong_denominator",
      trapAnswer: 1,
      trapDesc: "Used diameter formula instead of radius — mixed up 2πr and πr²",
    },
    {
      stem: "For what value of x does 2<sup>x</sup> = 10?",
      choices: ["10", "3.32", "3", "5"],
      correct: 1,
      explanation: "<strong>Desmos:</strong> Graph y=2^x and $y=10$. Intersection at x≈3.32.",
      trap: "negation_miss",
      trapAnswer: 0,
      trapDesc: "Rounded too aggressively — 3 is close but not precise enough",
    },
    {
      stem: "Worker earns d dollars/hr, works h hrs/week. Monthly (4-week) earnings?",
      choices: ["d + 4h", "4d + h", "dh/4", "4dh"],
      correct: 3,
      explanation: "<strong>Plug In $d=10$, $h=20$:</strong> Weekly=$200, Monthly=$800. 4dh=800 ✓.",
      trap: "axis_scale",
      trapAnswer: 1,
      trapDesc: "Divided instead of multiplied — confused weekly-to-monthly direction",
    },
    {
      stem: "Sum of two consecutive even integers is 54. The smaller integer is:",
      choices: ["30", "28", "26", "24"],
      correct: 2,
      explanation: "<strong>Backsolve B) 26:</strong> 26+28=54 ✓.",
      trap: "sign_context",
      trapAnswer: 2,
      trapDesc: "Picked the larger of the two consecutive evens instead of the smaller",
    },
    {
      stem: "Store sells 847 items at $12.99 each. Total revenue closest to:",
      choices: ["$1,100", "$8,500", "$110,000", "$11,000"],
      correct: 3,
      explanation: "<strong>Ballpark:</strong> ~850×$13≈$11,050. Only C is close.",
      trap: "fx_vs_x",
      trapAnswer: 1,
      trapDesc: "Estimated too low by dropping a digit — $8,500 is roughly 850×10",
    },
    {
      stem: "If f(x) = x² − 6x + 5, for what value of x is f(x) at its minimum?",
      choices: ["−4", "5", "1", "3"],
      correct: 3,
      explanation: "<strong>Desmos:</strong> Graph it, click vertex → (3, −4). The x-value is 3. <strong>Algebra:</strong> $x =$ −(−6)/(2·1) = 3.",
      trap: "at_least_vs_more",
      trapAnswer: 3,
      trapDesc: "Entered the minimum VALUE of f(x) instead of the x-value where the minimum occurs",
    },
  ],

  takeaways: [
    "Use the 5-Second Decision Tree on EVERY question: direct, Plug In, Backsolve, Desmos, Ballpark/POE.",
    "Variables in choices = Plug In. Number choices = Backsolve. Functions/graphs = Desmos.",
    "Ballpark BEFORE calculating -- eliminate 1-2 obviously wrong choices on almost any question.",
    "Module 1 accuracy matters most -- getting routed to hard Module 2 unlocks the highest scores.",
    "Time budget: First pass ~25 min, Review ~8 min, LOTD ~2 min. Check pace at Q11.",
    "Grid-ins: Always re-read what the question asks for. The #1 trap is answering x when they asked for 2x.",
    "LOTD (Letter of the Day): Pick one letter for ALL remaining guesses. Never leave blanks.",
  ],
};
