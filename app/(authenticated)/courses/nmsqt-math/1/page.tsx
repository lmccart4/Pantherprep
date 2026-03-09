"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { RoutingSimulator } from "@/components/course/activities/routing-simulator";
import { InteractiveChecklist } from "@/components/course/activities/interactive-checklist";
import { ScoreProjector } from "@/components/course/activities/score-projector";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import {
  TestStructureVisual,
  AdaptiveVisual,
  DomainsVisual,
  SelectionIndexVisual,
  StrategyVisual,
  ErrorClassificationVisual,
  ScoreProjectorVisual,
} from "./lesson-visuals";

export default function NMSQTMathModule1() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "test-structure": <TestStructureVisual />,
        "adaptive": <AdaptiveVisual />,
        "domains": <DomainsVisual />,
        "selection-index": <SelectionIndexVisual />,
        "strategy": <StrategyVisual />,
        "error-classification": <ErrorClassificationVisual />,
        "score-projector": <ScoreProjectorVisual />,
      }}
      nextModuleHref="/courses/nmsqt-math/2"
      nextModuleLabel="Module 2: Algebra — Linear Equations & Systems"

      activities={{
        "checklist": (goNext: () => void) => (
          <InteractiveChecklist
            title="Pre-Test Setup"
            items={PRE_TEST_CHECKLIST}
            accentColor={MODULE_CONFIG.accentColor}
            requireAll
            onComplete={goNext}
          />
        ),
        "activity-routing": (goNext: () => void) => (
          <RoutingSimulator
            maxQuestions={22}
            section="math"
            testType="nmsqt"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "score-projector": (goNext: () => void) => (
          <ScoreProjector
            testType="nmsqt"
            section="math"
            maxM1={22}
            maxM2={22}
            accentColor={MODULE_CONFIG.accentColor}
            showSelectionIndex
            onComplete={goNext}
          />
        ),
        "exercise-ec-qs": (goNext: () => void) => (
          <MatchingExercise
            items={EC_QS_EXERCISE_DATA}
            title="Error Classification"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "error-worksheet": (goNext: () => void) => (
          <ErrorAnalysisWorksheet
            domains={["Algebra", "Advanced Math", "Problem-Solving & Data", "Geometry & Trig"]}
            testLabel="PSAT/NMSQT Math"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

const EC_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "A student solved 3x \u2212 7 = 14 and got $x = 3$. When checking: 3(3) \u2212 7 = 2 \u2260 14. They made an arithmetic error dividing 21 by 3.",
    "options": [
      "Careless Error",
      "Content Gap",
      "Time Pressure",
      "Misread/Trap"
    ],
    "correct": 0,
    "explanation": "This is a Careless Error. The student knows the method but made a simple calculation mistake. Fix: slow down and check by substituting back."
  },
  {
    "prompt": "A student sees \u201cwhat is the value of 3x + 2?\u201d and solves for x instead. They get $x = 4$, choose 4, and it\u2019s wrong. The answer was 3(4)+2 = 14.",
    "options": [
      "Misread/Trap",
      "Content Gap",
      "Time Pressure",
      "Careless Error"
    ],
    "correct": 0,
    "explanation": "This is a Misread/Trap. The student solved for x but the question asked for 3x + 2. This is the #1 most common PSAT math trap. Fix: circle or underline exactly what the question asks for."
  },
  {
    "prompt": "A student can\u2019t remember how to find the vertex of a quadratic in standard form. They guess by plugging in $x = 0$.",
    "options": [
      "Careless Error",
      "Time Pressure",
      "Content Gap",
      "Strategy Gap"
    ],
    "correct": 2,
    "explanation": "This is a Content Gap. The student doesn\u2019t know the vertex formula ($x =$ \u2212b/2a). Fix: study quadratic forms in Module 3."
  },
  {
    "prompt": "A student runs out of time with 4 questions left. They had spent 3+ minutes on a hard question earlier that they ended up guessing on anyway.",
    "options": [
      "Strategy Gap",
      "Time Pressure",
      "Content Gap",
      "Careless Error"
    ],
    "correct": 1,
    "explanation": "This is a Time Pressure error caused by poor time management. Fix: use the two-pass strategy \u2014 skip hard questions on the first pass, return with remaining time."
  },
  {
    "prompt": "A student multiplies both sides of \u22122x > 8 by \u22121 and gets $x >$ \u22124. The correct answer is $x <$ \u22124.",
    "options": [
      "Careless Error",
      "Time Pressure",
      "Content Gap",
      "Misread/Trap"
    ],
    "correct": 2,
    "explanation": "This is a Content Gap. The student doesn\u2019t know the rule: when dividing or multiplying by a negative, flip the inequality sign. This is a learned rule, not a careless mistake."
  },
  {
    "prompt": "A student stares at a systems problem for 45 seconds trying to set up elimination, when graphing both equations in Desmos would have given the answer in 10 seconds.",
    "options": [
      "Strategy Gap",
      "Time Pressure",
      "Content Gap",
      "Careless Error"
    ],
    "correct": 0,
    "explanation": "This is a Strategy Gap. The student knows the math but chose an inefficient method. Fix: develop the \u201cDesmos or Algebra?\u201d decision habit (Module 6)."
  }
];

const PRE_TEST_CHECKLIST = [
  "Bluebook app installed and working",
  "Quiet testing environment prepared",
  "Phone silenced and out of reach",
  "Scratch paper and pencil ready",
  "70 uninterrupted minutes available",
  "Water bottle nearby",
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "math",
  moduleNum: 1,
  title: "Welcome to the PSAT & Diagnostic",
  subtitle:
    "Understand the test, set your goal, establish your baseline, and build your personalized study plan.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "welcome" },
    { id: "lesson", label: "Lesson", icon: "lesson" },
    { id: "checklist", label: "Checklist", icon: "clipboard" },
    { id: "activity-routing", label: "Routing Simulator", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "exercise-ec-qs", label: "Error Classification", icon: "zap" },
    { id: "error-worksheet", label: "Error Analysis Worksheet", icon: "zap" },
    { id: "score-projector", label: "Score Projector", icon: "chart" },
    { id: "complete", label: "Complete", icon: "complete" },
  ],
  lessons: [
    /* ── Slide 1: Test Structure ── */
    {
      id: "test-structure",
      title: "Digital PSAT/NMSQT Math: Structure & Format",
      subtitle: "Know Your Test",
      visual: "test-structure",
      body: [
        "The PSAT/NMSQT Math section is structurally identical to the Digital SAT Math section -- same number of questions, same timing, same adaptive format, same Desmos calculator. The difference? The PSAT caps at a $760$ scaled score and excludes the hardest question types.",
      ],
    },
    /* ── Slide 2: Adaptive Module System ── */
    {
      id: "adaptive-system",
      title: "The Adaptive Module System",
      subtitle: "How It Works",
      visual: "adaptive",
      body: [
        "The PSAT uses multistage adaptive testing (MST). Your Module 1 performance determines which version of Module 2 you receive. Use the simulator above to see how routing affects your score ceiling.",
      ],
    },
    /* ── Slide 3: Four Content Domains ── */
    {
      id: "four-domains",
      title: "The Four Content Domains",
      subtitle: "Content Breakdown",
      visual: "domains",
      body: [
        "The PSAT/NMSQT Math section tests four domains. Tap each card above to see the specific topics covered and which course module addresses them.",
      ],
    },
    /* ── Slide 4: National Merit & Selection Index ── */
    {
      id: "national-merit",
      title: "National Merit & the Selection Index",
      subtitle: "Why It Matters",
      visual: "selection-index",
      body: [
        "The PSAT/NMSQT isn't just practice for the SAT -- it's the only path to National Merit Scholarships. Use the calculator above to see your Selection Index and where you stand.",
        "Semifinalist cutoffs vary by state. Competitive states like California, Massachusetts, and New Jersey typically require Selection Index scores of $224$+, while less competitive states may qualify at $209$--$215$.",
      ],
    },
    /* ── Slide 5: Strategy Toolkit ── */
    {
      id: "strategy-toolkit",
      title: "The PSAT/NMSQT Math Strategy Toolkit",
      subtitle: "Strategy Preview",
      visual: "strategy",
      body: [
        "These six strategies will be your toolkit throughout the course. Tap each card above to learn more. You'll practice all of them in depth in later modules.",
      ],
    },
    /* ── Slide 6: Error Classification ── */
    {
      id: "error-classification",
      title: "Error Classification & Analysis",
      subtitle: "Know Your Mistakes",
      visual: "error-classification",
      body: [
        "Every wrong answer falls into one of five error types. Tap each card above to see the fix. Correctly classifying your errors is the single fastest way to improve your score.",
      ],
    },
    /* ── Slide 7: Baseline Protocol & Study Plan ── */
    {
      id: "baseline-protocol",
      title: "Baseline Assessment & Study Plan",
      subtitle: "Full Baseline",
      body: [
        "After the diagnostic, take a full-length PSAT Math section using the Bluebook app. You'll use the Score Projector (coming up after your error analysis) to estimate your scaled score.",
        "Complete an Error Analysis for every missed AND uncertain question: record the question number, domain, topic, error type, and what you should have done differently.",
        "Identify your top 3 priority areas based on error analysis. These will guide which modules to focus the most attention on throughout the course.",
      ],
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "If <code>3(2x − 5) = 4x + 7</code>, what is the value of <code>x</code>?",
      choices: ["22/6", "11", "8", "9"],
      correct: 1,
      explanation: "Distribute: $6x − 15 = 4x + 7$. Subtract 4x: $2x = 22$. $x = 11$.",
      domain: "Algebra",
    },
    {
      stem: "A gym charges a $50 registration fee plus $25 per month. Which equation represents the total cost <code>C</code> after <code>m</code> months?",
      choices: ["C = 25m + 50", "C = 75m", "C = 25(m + 50)", "C = 50m + 25"],
      correct: 0,
      explanation: "Fixed fee ($50) is the constant, $25/month is the rate. C = 25m + 50.",
      domain: "Algebra",
    },
    {
      stem: "The system <code>2x + 3y = 12</code> and <code>4x + 6y = 24</code> has how many solutions?",
      choices: ["Infinitely many", "Zero", "Exactly two", "Exactly one"],
      correct: 0,
      explanation: "Second equation is 2× the first. Same line → infinitely many solutions.",
      domain: "Algebra",
    },
    {
      stem: "The line through (−1, 4) and (3, 12) has slope:",
      choices: ["1/2", "−2", "4", "2"],
      correct: 3,
      explanation: "$m =$ (12−4)/(3−(−1)) = 8/4 = 2.",
      domain: "Algebra",
    },
    {
      stem: "If <code>|2x − 5| = 9</code>, what is the sum of all solutions?",
      choices: ["5", "9", "7", "12"],
      correct: 0,
      explanation: "$2x−5=9$ → $x=7$. $2x−5=−9$ → $x=−2$. Sum = 7+(−2) = 5.",
      domain: "Algebra",
    },
    {
      stem: "What are the solutions to <code>x² − 5x + 6 = 0</code>?",
      choices: ["$x = −2$ and $x = −3$", "$x = −1$ and $x = −6$", "$x = 2$ and $x = 3$", "$x = 1$ and $x = 6$"],
      correct: 2,
      explanation: "Factor: (x−2)(x−3) = 0. $x = 2$ or $x = 3$.",
      domain: "Advanced Math",
    },
    {
      stem: "If <code>f(x) = 2x² − 3</code>, what is <code>f(−4)</code>?",
      choices: ["29", "5", "−35", "−11"],
      correct: 0,
      explanation: "f(−4) = 2(16) − 3 = 29. Remember: (−4)² = 16 (positive!).",
      domain: "Advanced Math",
    },
    {
      stem: "Which expression is equivalent to <code>(3x²)(4x³)</code>?",
      choices: ["12x⁶", "7x⁵", "7x⁶", "12x⁵"],
      correct: 3,
      explanation: "Multiply coefficients: 12. Add exponents: x⁵. Answer: 12x⁵.",
      domain: "Advanced Math",
    },
    {
      stem: "The vertex of <code>y = x² − 8x + 12</code> is at:",
      choices: ["(4, 12)", "(−4, 4)", "(4, −4)", "(8, 12)"],
      correct: 2,
      explanation: "$x = −b/2a$ = 8/2 = 4. $y = 16−32+12$ = −4. Vertex (4,−4).",
      domain: "Advanced Math",
    },
    {
      stem: "A population starts at 500 and triples every 4 years. Which models this?",
      choices: ["1500t", "500(3)^(t/4)", "500(3)^(4t)", "500 + 3t"],
      correct: 1,
      explanation: "Triples every 4 years → base 3, exponent t/4.",
      domain: "Advanced Math",
    },
    {
      stem: "A shirt costs $40 and is 30% off. Sale price?",
      choices: ["$30", "$28", "$10", "$12"],
      correct: 1,
      explanation: "30% of 40 = 12. Sale: 40−12 = $28. Or: 40×0.70 = $28.",
      domain: "Problem-Solving & Data",
    },
    {
      stem: "The mean of 5 numbers is 12. If 30 is added, the new mean is:",
      choices: ["17", "15", "21", "14"],
      correct: 1,
      explanation: "Sum = 60. New sum = 90. 90/6 = 15.",
      domain: "Problem-Solving & Data",
    },
    {
      stem: "A random sample of 200 from a university of 10,000 finds 35% prefer online classes. Best conclusion?",
      choices: ["Exactly 3,500 students prefer online", "35% of all college students prefer online", "The survey is too small", "About 35% of this university likely prefers online"],
      correct: 3,
      explanation: "Random sample supports inference about THIS university only.",
      domain: "Problem-Solving & Data",
    },
    {
      stem: "A scatterplot shows strong negative linear association. The correlation r is closest to:",
      choices: ["0.45", "−0.15", "0.85", "−0.92"],
      correct: 3,
      explanation: "Strong negative → r close to −1. −0.92.",
      domain: "Problem-Solving & Data",
    },
    {
      stem: "A price increases 20% then decreases 20%. Compared to original?",
      choices: ["4% less", "4% more", "2% less", "Same"],
      correct: 0,
      explanation: "100 → 120 → 96. Net: 4% less. Successive percents trap!",
      domain: "Problem-Solving & Data",
    },
    {
      stem: "A right triangle has legs 5 and 12. Hypotenuse?",
      choices: ["17", "15", "13", "√119"],
      correct: 2,
      explanation: "5² + 12² = 169 = 13². Classic 5-12-13 triple.",
      domain: "Geometry & Trig",
    },
    {
      stem: "A circle has area 36π. Its circumference?",
      choices: ["12π", "18π", "6π", "36π"],
      correct: 0,
      explanation: "$r²=36$ → $r=6$. C=2πr=12π.",
      domain: "Geometry & Trig",
    },
    {
      stem: "In a right triangle, sin(θ) = 3/5. What is cos(θ)?",
      choices: ["3/4", "5/3", "3/5", "4/5"],
      correct: 3,
      explanation: "Opp=3, hyp=5. Adj=4 (3-4-5). cos=adj/hyp=4/5.",
      domain: "Geometry & Trig",
    },
    {
      stem: "The circle <code>(x−3)² + (y+1)² = 25</code> has center:",
      choices: ["(−3, 1)", "(3, −1)", "(3, 1)", "(−3, −1)"],
      correct: 1,
      explanation: "(x−h)²+(y−k)²=r². $h=3$, $k=−1$. Center (3,−1).",
      domain: "Geometry & Trig",
    },
    {
      stem: "A cone has radius 3 and height 8. Volume?",
      choices: ["192π", "8π", "24π", "72π"],
      correct: 2,
      explanation: "V=⅓πr²h = ⅓π(9)(8) = 24π.",
      domain: "Geometry & Trig",
    },
  ],

  takeaways: [
    "44 questions in 70 minutes, two adaptive modules of 22.",
    "Module 1 performance determines Module 2 difficulty and score ceiling.",
    "Four domains: Algebra ~35%, Advanced Math ~35%, PSDA ~15%, Geometry & Trig ~15%.",
    "Desmos graphing calculator available on every question.",
    "No penalty for wrong answers -- never leave blank.",
    "Selection Index double-weights RW for National Merit.",
    "Error analysis is the most powerful study tool.",
  ],
};
