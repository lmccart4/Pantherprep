"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  AdaptiveModuleVisual,
  DecisionTreeVisual,
  PlugInVisual,
  TimeBudgetVisual,
  GridInRulesVisual,
  PreventableMistakesVisual,
} from "./lesson-visuals";

export default function SATMathModule8() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/sat-math/9"
      nextModuleLabel="Module 9: Full Practice Test & Error Analysis"

      visuals={{
        "adaptive-modules": <AdaptiveModuleVisual />,
        "decision-tree": <DecisionTreeVisual />,
        "plug-in": <PlugInVisual />,
        "time-budget": <TimeBudgetVisual />,
        "grid-in-tips": <GridInRulesVisual />,
        "common-traps": <PreventableMistakesVisual />,
      }}

      activities={{
        "exercise-dt-qs": (goNext: () => void) => (
          <MatchingExercise
            items={DT_QS_EXERCISE_DATA}
            title="Decision Tree"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-pi-qs": (goNext: () => void) => (
          <MatchingExercise
            items={PI_QS_EXERCISE_DATA}
            title="Plug In"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-bs-qs": (goNext: () => void) => (
          <MatchingExercise
            items={BS_QS_EXERCISE_DATA}
            title="Backsolve"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-bp-qs": (goNext: () => void) => (
          <MatchingExercise
            items={BP_QS_EXERCISE_DATA}
            title="Ballpark"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-gi-qs": (goNext: () => void) => (
          <MatchingExercise
            items={GI_QS_EXERCISE_DATA}
            title="Grid-In Traps"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-pm-qs": (goNext: () => void) => (
          <MatchingExercise
            items={PM_QS_EXERCISE_DATA}
            title="Preventable Mistakes"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

const DT_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "If a is a positive integer, which expression equals <code>(a² − 4)/(a − 2)</code>?",
    "options": [
      "Desmos",
      "Plug In",
      "Backsolve",
      "Solve Directly"
    ],
    "correct": 1,
    "explanation": "Variables in answer choices → Plug In. Try a=3: (9−4)/1=5. Check: a+2=5 ✓."
  },
  {
    "prompt": "5x − 3 = 2x + 9. Choices: 2, 3, 4, 5.",
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
    "prompt": "Where do y = x² − 1 and y = 2x + 1 intersect?",
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
    "prompt": "Car at 55 mph for 3.75 hours. Distance? A) 105 B) 165 C) 206 D) 412",
    "options": [
      "Solve Directly",
      "Desmos",
      "Plug In",
      "Ballpark + POE"
    ],
    "correct": 3,
    "explanation": "~55×4=220. Closest is C) 206. Exact: 55×3.75=206.25."
  },
  {
    "prompt": "Which graph represents y = −(x + 2)² + 3?",
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
    "explanation": "Variables in choices → Plug In. Try x=2: 2(5)+4(7)=38. Test each."
  },
  {
    "prompt": "Rectangle area = 48, length = width + 3. Width? Choices: 3, 4, 5, 6",
    "options": [
      "Desmos",
      "Plug In",
      "Solve Directly",
      "Backsolve"
    ],
    "correct": 3,
    "explanation": "Number answers → Backsolve. Try 5: 5×8=40 (too small). Try 6: 6×9=54 (too big)."
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

const PI_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "If n is positive, which equals <code>(n² + n) / n</code>?",
    "options": [
      "n²",
      "2n",
      "n − 1",
      "n + 1"
    ],
    "correct": 3,
    "explanation": "Plug In n=3: (9+3)/3=4. n+1=4 ✓, n²=9 ✗, n−1=2 ✗, 2n=6 ✗."
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
    "explanation": "Plug In d=100, p=20: price=$80. d(1−p/100)=100(0.8)=80 ✓."
  },
  {
    "prompt": "If x > 0, which equals <code>√(4x²)</code>?",
    "options": [
      "4x",
      "4x²",
      "2x²",
      "2x"
    ],
    "correct": 3,
    "explanation": "Plug In x=3: √(36)=6. 2x=6 ✓, 4x=12 ✗."
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
    "explanation": "Plug In a=2, b=3: 25−1=24. 4ab=24 ✓."
  }
];

const BS_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "If 2x + 5 = 17, what is x?",
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
    "prompt": "If x² − 5x + 6 = 0, what is a solution?",
    "options": [
      "4",
      "6",
      "2",
      "1"
    ],
    "correct": 2,
    "explanation": "Try 2: 4−10+6=0 ✓."
  },
  {
    "prompt": "Three consecutive integers sum to 42. The smallest is:",
    "options": [
      "14",
      "13",
      "12",
      "15"
    ],
    "correct": 1,
    "explanation": "Try 13: 13+14+15=42 ✓."
  }
];

const BP_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "18% of 412 is approximately? Which is WRONG?",
    "options": [
      "74",
      "80",
      "7,416",
      "70"
    ],
    "correct": 2,
    "explanation": "~20% of 400=80. 7,416 is absurd — that’s 18 × 412, not 18%."
  },
  {
    "prompt": "Right triangle legs 5 and 12. Hypotenuse? WRONG answer:",
    "options": [
      "13",
      "60",
      "7",
      "17"
    ],
    "correct": 2,
    "explanation": "Must be >12 but <17. 7 is impossible (less than one leg). Only 13 fits."
  },
  {
    "prompt": "Population triples every decade from 200. After 3 decades? WRONG:",
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
      "12.5"
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

const GI_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "\"Find 2x if 3x = 15.\" Student entered: 5",
    "options": [
      "Correct",
      "Trap!"
    ],
    "correct": 1,
    "explanation": "x=5, but asked for 2x=10. Student answered x, not 2x!"
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
    "prompt": "\"How many solutions does x² + 4 = 0 have?\" Student entered: 2",
    "options": [
      "Correct",
      "Trap!"
    ],
    "correct": 1,
    "explanation": "x²=−4 has NO real solutions. Answer: 0."
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
    "prompt": "\"Solve |x − 3| = 7.\" Student entered: 10",
    "options": [
      "Trap!",
      "Correct"
    ],
    "correct": 1,
    "explanation": "x=10 or x=−4. Grid-in accepts any correct value. 10 works."
  },
  {
    "prompt": "\"Positive difference between roots of x² − 5x + 6 = 0.\" Student entered: 3",
    "options": [
      "Correct",
      "Trap!"
    ],
    "correct": 1,
    "explanation": "Roots are 2 and 3. Difference=|3−2|=1, not 3. Student entered a root, not the difference."
  }
];

const PM_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "\"If 3x − 7 = 20, what is the value of 6x − 14?\" Student solved for x, got x = 9, entered 9.",
    "options": [
      "Correct answer",
      "Misread — asked for 6x−14"
    ],
    "correct": 1,
    "explanation": "6x−14 = 2(3x−7) = 2(20) = 40. No need to solve for x! The question asked for 6x−14, not x."
  },
  {
    "prompt": "Graph shows y-axis in thousands. Student reads a point as y = 45 instead of y = 45,000.",
    "options": [
      "Axis scale misread",
      "Correct reading"
    ],
    "correct": 0,
    "explanation": "Always check axis labels and units. \"In thousands\" means multiply the value you read by 1,000."
  },
  {
    "prompt": "\"At least 5 students\" — student interpreted as \"more than 5\" (≥6).",
    "options": [
      "Same meaning",
      "At least = ≥, not >"
    ],
    "correct": 1,
    "explanation": "\"At least 5\" means 5 or more (≥5). \"More than 5\" means >5. This one-word difference changes the answer."
  },
  {
    "prompt": "Question says \"which CANNOT be true.\" Student picked an answer that CAN be true.",
    "options": [
      "Missed the negation",
      "Correct approach"
    ],
    "correct": 0,
    "explanation": "Circle/underline \"CANNOT\" or \"NOT\" or \"EXCEPT\" when you see them. These negation words flip the entire question."
  },
  {
    "prompt": "Price decreases from $80 to $60. Student calculates percent change using 60 as denominator.",
    "options": [
      "Wrong denominator for % change",
      "Correct calculation"
    ],
    "correct": 0,
    "explanation": "Percent change = (new−old)/OLD. Denominator is always the ORIGINAL value: (60−80)/80 = −25%."
  },
  {
    "prompt": "Question asks for x + y. Student solved for x correctly (x = 3) and entered 3.",
    "options": [
      "Complete answer",
      "Answered x, not x + y"
    ],
    "correct": 1,
    "explanation": "The most common SAT trap: answering an intermediate step instead of what was actually asked. Always re-read the question."
  },
  {
    "prompt": "\"f(x) = x² − 4x + 3. For what value of x is f(x) at its minimum?\" Student entered f(2) = −1.",
    "options": [
      "Asked for x, gave f(x)",
      "Correct — gave the minimum"
    ],
    "correct": 0,
    "explanation": "Question asks for the x-VALUE where minimum occurs (x=2), not the minimum VALUE itself (−1). Read carefully!"
  },
  {
    "prompt": "Temperature drops 3°F per hour for 5 hours from 68°F. Student gets 83°F.",
    "options": [
      "Correct calculation",
      "Added instead of subtracted"
    ],
    "correct": 1,
    "explanation": "\"Drops\" = subtract. 68 − 15 = 53°F. Getting 83°F means you added. Watch for direction words: drops, decreases, loses."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "math",
  moduleNum: 8,
  title: "Strategy Application & Time Management",
  subtitle:
    "Test-taking tactics and pacing drills",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-dt-qs", label: "Decision Tree", icon: "zap" },
    { id: "exercise-pi-qs", label: "Plug In", icon: "zap" },
    { id: "exercise-bs-qs", label: "Backsolve", icon: "zap" },
    { id: "exercise-bp-qs", label: "Ballpark", icon: "zap" },
    { id: "exercise-gi-qs", label: "Grid-In Traps", icon: "zap" },
    { id: "exercise-pm-qs", label: "Preventable Mistakes", icon: "zap" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],
  warmup: [
    {
      source: "Module 7 — Intersections",
      stem: "To find where two equations intersect in Desmos, you graph both and then?",
      choices: [
        'Type "solve" and enter both equations',
        "Enter a table with both equations' values",
        "Click the intersection point",
        "Use the slider tool on both lines"
      ],
      correct: 2,
      explanation:
        "Graph both equations in Desmos. A gray dot appears at the intersection — click it to see the exact coordinates.",
    },
    {
      source: "Module 7 — Regression",
      stem: "To fit a linear regression in Desmos, you enter data in a table and type?",
      choices: [
        "bestfit(x,y)",
        "regression(y,x)",
        "$y_1 \\sim mx_1 + b$",
        "linreg(table1)"
      ],
      correct: 2,
      explanation:
        "After entering data in a table, type $y_1 \\sim mx_1 + b$ on a new line. Use _ for subscript and ~ for the regression operator.",
    },
    {
      source: "Module 7 — Solutions",
      stem: "Graphing the discriminant: if the parabola doesn't cross the x-axis, how many real solutions?",
      choices: ["2", "0", "Cannot determine with Desmos", "1"],
      correct: 1,
      explanation:
        "If the parabola sits entirely above (or below) the x-axis with no x-intercepts, there are 0 real solutions. The discriminant is negative.",
    },
    {
      source: "Module 7 — Shortcuts",
      stem: "In Desmos, the caret symbol (^) is used for?",
      choices: ["Subscripts", "Multiplication", "Square roots", "Exponents"],
      correct: 3,
      explanation:
        "The caret key (^) creates exponents in Desmos. Type x^2 to get x². This is one of the must-memorize shortcuts.",
    },
    {
      source: "Module 7 — Calculator Discipline",
      stem: "If a question can be graphed in under 5 seconds, what should you do?",
      choices: [
        "Switch to algebra — it's more reliable",
        "Graph it in Desmos",
        "Use ballpark estimation instead",
        "Skip it and come back later"
      ],
      correct: 1,
      explanation:
        "The 5-second rule: if you can set it up in Desmos within 5 seconds, graph it. Desmos is a powerful tool when used efficiently.",
    },
  ],
  lessons: [
    {
      id: "adaptive-modules",
      title: "Understanding Adaptive Modules",
      subtitle: "How the Digital SAT routing works",
      visual: "adaptive-modules",
      body: [
        "The SAT Math section has 44 questions across two 35-minute modules. Here's the critical strategic insight:",
        "Module 1 determines Module 2 difficulty. Score well on Module 1 → Hard Module 2 (higher score ceiling). Score poorly → Easy Module 2 (ceiling approximately 560-630).",
        "Strategic implication: Module 1 accuracy is MORE important than Module 2 speed. Take your time, avoid careless errors, and secure the hard path.",
        "Even if you ace Easy Module 2, your math score is capped around 560-630. This routing decision is the single biggest factor in your score ceiling.",
      ],
    },
    {
      id: "decision-tree",
      title: "The 5-Second Decision Tree",
      subtitle: "Choose the fastest approach for every question",
      visual: "decision-tree",
      body: [
        "Step 1: Do I immediately see how to solve this? YES → Solve directly. NO → Step 2.",
        "Step 2: Variables in the answer choices? YES → Use Plug In (PIYON). NO → Step 3.",
        "Step 3: Answer choices are specific numbers? YES → Use Backsolve (PITA). NO → Step 4.",
        "Step 4: Involves a function, graph, or system? YES → Use Desmos. NO → Step 5.",
        "Step 5: Can I eliminate clearly wrong answers? YES → Ballpark + POE, then guess. NO → Flag and move on.",
      ],
    },
    {
      id: "plug-in",
      title: "Plug In Your Own Numbers (PIYON)",
      subtitle: "Variables in answer choices = your cue",
      visual: "plug-in",
      body: [
        "When to use: Variables in answer choices. 'Which expression is equivalent to...' Questions with no specific values.",
        "Step 1: Choose simple numbers. Best picks: 2, 3, 5, 10, or 100 (for percents).",
        "Step 2: Work the problem with your numbers to get a TARGET answer.",
        "Step 3: Plug the SAME numbers into each answer choice.",
        "Step 4: The choice that matches your target is correct.",
        "Avoid 0 and 1 — they have special properties that make multiple answers look correct. If two answers match, try different numbers.",
        "Worked Example: If x is positive, which is equivalent to $(x^2 + 2x) / x$? Plug In x = 3: (9 + 6) / 3 = 5 ← target. A) 3 + 2 = 5 ✓. Answer: A) x + 2.",
      ],
    },
    {
      id: "backsolve",
      title: "Backsolve (Plug In The Answers / PITA)",
      subtitle: "Number choices = your cue",
      body: [
        "When to use: Answer choices are numbers. 'What is the value of...' Systems where algebra feels messy.",
        "Step 1: Start with choice B or C (the middle value).",
        "Step 2: Plug that value into the problem and check if it works.",
        "Step 3: If wrong, determine if you need larger or smaller → eliminates 2-3 choices at once!",
        "Worked Example: If $3x + 7 = 2x + 12$, what is x? Try B) x = 5: 3(5) + 7 = 22, 2(5) + 12 = 22. ✓ Equal! Answer: B.",
      ],
    },
    {
      id: "ballpark",
      title: "Ballpark & POE (Process of Elimination)",
      subtitle: "Estimate before you calculate",
      body: [
        "When to use: ANY question where estimation eliminates choices. Geometry with figures. Late-module questions when time is short.",
        "Before calculating: 'Should this be big or small? Positive or negative? Close to what?'",
        "18% of 412 ≈ 20% of 400 = 80. Eliminate anything far from 80.",
        "Triangle with sides 5 and 12? Hypotenuse is between 12 and 17. Eliminate 8 and 25.",
        "POE shortcuts: Question asks for positive → eliminate negatives. Context requires small → eliminate large.",
      ],
    },
    {
      id: "time-budget",
      title: "SAT Time Budget Per Module",
      subtitle: "35 minutes · 22 questions · ~1.6 min/question",
      visual: "time-budget",
      body: [
        "First Pass (~25 min): Answer every confident question. Flag uncertain ones. ~1.5 min/question avg.",
        "Second Pass (~8 min): Return to flagged questions. Use Plug In, Backsolve, or Desmos.",
        "Final Check (~2 min): Verify grid-ins. LOTD for unanswered. Never leave blanks.",
        "Pace Check: At question 11 (halfway), you should have ~17 minutes left. If behind, speed up on easy questions and flag hard ones immediately.",
      ],
    },
    {
      id: "grid-in-tips",
      title: "Student-Produced Response Tips",
      subtitle: "Grid-in rules and traps",
      visual: "grid-in-tips",
      body: [
        "Fractions accepted: 3/7 and 0.4286 are both correct.",
        "Long decimals: Truncate or round. Don't leave blank.",
        "Negatives allowed: Digital SAT accepts negative grid-in answers.",
        "Multiple correct: If several answers work, any correct value is accepted.",
        "#1 Trap: Asks for 2x, not x. ALWAYS re-read what they want.",
        "Reasonableness: Does your answer make sense in context?",
      ],
    },
    {
      id: "common-traps",
      title: "The Top 8 Preventable Mistakes",
      subtitle: "Fixing these alone can be worth 3-5 questions per test",
      visual: "common-traps",
      body: [
        "1. Solving for the Wrong Variable — The question asks for 6x − 14, not x. Fix: Underline exactly what the question asks for BEFORE solving.",
        "2. Intermediate vs. Final Answer — A shirt is 20% off, then taxed 8%. You find the discount but the question asks for the final price. Fix: Make sure your answer addresses the FINAL part of the question.",
        "3. 'At Least' vs. 'More Than' — 'At least 5' means ≥ 5 (includes 5). 'More than 5' means > 5 (does NOT include 5).",
        "4. Negation Words (NOT, CANNOT, EXCEPT) — Your brain skips the NOT and you pick a valid answer. Fix: Circle negative words.",
        "5. Axis Scale / Units — A graph's y-axis is labeled 'in thousands.' Fix: Always read axis labels AND the scale before reading any data.",
        "6. Positive vs. Negative in Context — You solve correctly and get x = −3, but enter 3. Fix: Double-check the sign for grid-ins.",
        "7. Wrong Denominator for Percent Change — Price goes from $50 to $60. Use 10/50 = 20%, not 10/60 = 16.7%. Denominator = ORIGINAL value.",
        "8. f(x) Value vs. x Value — 'Value of x' means the input. 'Value of f(x)' means the output. Read which one.",
      ],
    },
  ],
  quiz: [
    {
      stem: "If k is positive, $(k^3 - k) / k$ equals?",
      choices: ["$k^2 - k$", "$k^2 - 1$", "$k^3 - 1$", "$k - 1$"],
      correct: 1,
      explanation:
        "Plug In k=2: (8−2)/2=3. $k^2−1=3$ ✓. Or simplify: $k(k^2−1)/k=k^2−1$.",
      difficulty: "easy",
      trap: "wrong_variable",
      trapAnswer: 1,
      trapDesc: "Picked $k^2-k$ instead of $k^2-1$ — forgot to cancel the k properly",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "$4x - 3 = 2x + 7$. $x = ?$",
      choices: ["2", "4", "3", "5"],
      correct: 3,
      explanation:
        "Backsolve D) x=5: 4(5)−3=17, 2(5)+7=17. ✓ Equal!",
      difficulty: "easy",
      trap: "intermediate_answer",
      trapAnswer: 2,
      trapDesc: "Stopped at an intermediate step instead of finishing the calculation",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Circle radius 8. Area is closest to:",
      choices: ["200.96", "25.13", "804.25", "50.27"],
      correct: 0,
      explanation:
        "Ballpark: $\\pi r^2 \\approx 3.14 \\times 64 \\approx 200$. Only C is close.",
      difficulty: "easy",
      trap: "wrong_denominator",
      trapAnswer: 1,
      trapDesc: "Used diameter formula instead of radius — mixed up 2πr and πr²",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "For what value of x does $2^x = 10$?",
      choices: ["10", "3.32", "3", "5"],
      correct: 1,
      explanation:
        "Desmos: Graph $y=2^x$ and $y=10$. Intersection at $x \\approx 3.32$.",
      difficulty: "easy",
      trap: "negation_miss",
      trapAnswer: 0,
      trapDesc: "Rounded too aggressively — 3 is close but not precise enough",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Worker earns $d$ dollars/hr, works $h$ hrs/week. Monthly (4-week) earnings?",
      choices: ["$d + 4h$", "$4dh$", "$dh/4$", "$4d + h$"],
      correct: 1,
      explanation:
        "Plug In d=10, h=20: Weekly=$200, Monthly=$800. 4dh=800 ✓.",
      difficulty: "medium",
      trap: "axis_scale",
      trapAnswer: 1,
      trapDesc: "Divided instead of multiplied — confused weekly-to-monthly direction",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Two consecutive even integers sum to 54. The smaller integer is:",
      choices: ["30", "28", "26", "24"],
      correct: 2,
      explanation: "Backsolve B) 26: 26+28=54 ✓.",
      difficulty: "medium",
      trap: "sign_context",
      trapAnswer: 2,
      trapDesc: "Picked the larger of the two consecutive evens instead of the smaller",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "$\\sin(x) = 0.5$ crossings in $[0, 2\\pi]$?",
      choices: ["2", "4", "1", "0"],
      correct: 0,
      explanation:
        "Desmos: Graph $y=\\sin(x)$ and $y=0.5$. Two intersections in $[0, 2\\pi]$.",
      difficulty: "medium",
      trap: "at_least_vs_more",
      trapAnswer: 1,
      trapDesc: "Only found one crossing (π/6) and missed the second (π−π/6)",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "847 items × $12.99. Revenue closest to:",
      choices: ["$1,100", "$8,500", "$110,000", "$11,000"],
      correct: 3,
      explanation:
        "Ballpark: ~850×$13≈$11,050. Only C is close.",
      difficulty: "hard",
      trap: "fx_vs_x",
      trapAnswer: 1,
      trapDesc: "Estimated too low by dropping a digit — $8,500 is roughly 850×10",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If $2x + 1 = 9$, what is $4x + 2$?",
      choices: ["8", "18", "16", "4"],
      correct: 1,
      explanation:
        "Notice: $4x+2 = 2(2x+1) = 2(9) = 18$. Don't solve for x first!",
      difficulty: "hard",
      trap: "wrong_variable",
      trapAnswer: 0,
      trapDesc: "Solved for x=4 and entered x instead of 4x+2",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Price goes from $50 to $60. Percent increase?",
      choices: ["83.3%", "10%", "16.7%", "20%"],
      correct: 3,
      explanation:
        "% change = (new−old)/old × 100: (60−50)/50×100 = 20%. Trap: 10/60=16.7% uses wrong denominator.",
      difficulty: "hard",
      trap: "wrong_denominator",
      trapAnswer: 1,
      trapDesc: "Used 60 (new value) as denominator instead of 50 (original)",
      domain: "Algebra",
      skill: "linear_equations",
    },
  ],
  takeaways: [
    "Use the 5-Second Decision Tree on EVERY question: direct \u2192 Plug In \u2192 Backsolve \u2192 Desmos \u2192 Ballpark/POE.",
    "Variables in choices = Plug In. Number choices = Backsolve. Functions/graphs = Desmos.",
    "Ballpark BEFORE calculating \u2014 eliminate 1\u20132 obviously wrong choices on almost any question.",
    "Module 1 accuracy matters most \u2014 it determines your routing and score ceiling.",
    "Time budget: First pass ~25 min, Review ~8 min, LOTD ~2 min. Check pace at Q11.",
    "Grid-ins: Always re-read what the question asks for. The #1 trap is answering x when they asked for 2x.",
    "LOTD (Letter of the Day): Pick one letter for ALL remaining guesses. Never leave blanks.",
  ],
};
