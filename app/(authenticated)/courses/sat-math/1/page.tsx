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
  StrategyVisual,
  ErrorClassificationVisual,
  WhySATMattersVisual,
  ScoreProjectorVisual,
} from "./lesson-visuals";

export default function SATMathModule1() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "test-structure": <TestStructureVisual />,
        "adaptive": <AdaptiveVisual />,
        "domains": <DomainsVisual />,
        "strategy": <StrategyVisual />,
        "error-classification": <ErrorClassificationVisual />,
        "why-sat-matters": <WhySATMattersVisual />,
        "score-projector": <ScoreProjectorVisual />,
      }}
      nextModuleHref="/courses/sat-math/2"
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
            testType="sat"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "score-projector": (goNext: () => void) => (
          <ScoreProjector
            testType="sat"
            section="math"
            maxM1={22}
            maxM2={22}
            accentColor={MODULE_CONFIG.accentColor}
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
            testLabel="SAT Math"
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
    "prompt": "You missed a question asking for the slope of a line perpendicular to $y = 3x + 2$. You chose 3 instead of \u22121/3 because you forgot that perpendicular slopes are negative reciprocals.",
    "options": [
      "Misread/Trap",
      "Content Gap",
      "Careless Error",
      "Time Pressure",
      "Strategy Gap"
    ],
    "correct": 1,
    "explanation": "You didn\u2019t know the perpendicular slope rule. That\u2019s a content gap \u2014 review Module 2."
  },
  {
    "prompt": "On a system of equations question, you correctly set up the algebra but accidentally wrote 3 \u00d7 4 = 9 instead of 12.",
    "options": [
      "Content Gap",
      "Time Pressure",
      "Careless Error",
      "Misread/Trap",
      "Strategy Gap"
    ],
    "correct": 2,
    "explanation": "You knew the math but made a simple arithmetic mistake. Double-check calculations."
  },
  {
    "prompt": "You had 3 questions left with only 1 minute remaining. You guessed randomly on all three.",
    "options": [
      "Misread/Trap",
      "Strategy Gap",
      "Content Gap",
      "Time Pressure",
      "Careless Error"
    ],
    "correct": 3,
    "explanation": "Running out of time. Practice pacing: ~25 min first pass, ~8 min second pass, ~2 min final check."
  },
  {
    "prompt": "A question asked for the value of 2x, not x. You correctly solved for $x = 5$ but entered 5 instead of 10.",
    "options": [
      "Time Pressure",
      "Content Gap",
      "Strategy Gap",
      "Careless Error",
      "Misread/Trap"
    ],
    "correct": 4,
    "explanation": "Classic SAT trap! Always re-read what the question asks for BEFORE selecting your answer."
  },
  {
    "prompt": "You spent 4 minutes doing algebra on a question with variables in the answer choices. Plugging in would have taken 45 seconds.",
    "options": [
      "Time Pressure",
      "Strategy Gap",
      "Misread/Trap",
      "Content Gap",
      "Careless Error"
    ],
    "correct": 1,
    "explanation": "You knew the content but used the wrong approach. Variables in answers \u2192 Plug In is faster."
  },
  {
    "prompt": "A question asked how many solutions a system has. You tried to solve the full system instead of recognizing the equations were multiples of each other.",
    "options": [
      "Time Pressure",
      "Strategy Gap",
      "Misread/Trap",
      "Content Gap",
      "Careless Error"
    ],
    "correct": 1,
    "explanation": "Recognizing patterns (like identical lines) is a strategy skill. Faster way exists."
  },
  {
    "prompt": "You missed a quadratic question because you don\u2019t know how to complete the square.",
    "options": [
      "Misread/Trap",
      "Content Gap",
      "Careless Error",
      "Time Pressure",
      "Strategy Gap"
    ],
    "correct": 1,
    "explanation": "You don\u2019t know the technique yet \u2014 content gap. You\u2019ll learn it in Module 3."
  },
  {
    "prompt": "On a \u201cpercent increase\u201d question, you calculated the new value but forgot to subtract the original and divide.",
    "options": [
      "Misread/Trap",
      "Content Gap",
      "Careless Error",
      "Time Pressure",
      "Strategy Gap"
    ],
    "correct": 1,
    "explanation": "Not knowing percent change formula (new\u2212old)/old \u00d7 100 is a content gap. Module 5."
  },
  {
    "prompt": "You stared at a systems problem for 2 minutes trying elimination. Graphing both in Desmos would have taken 10 seconds.",
    "options": [
      "Time Pressure",
      "Strategy Gap",
      "Misread/Trap",
      "Content Gap",
      "Careless Error"
    ],
    "correct": 1,
    "explanation": "You knew the math but chose an inefficient method. Build the \u201cDesmos or Algebra?\u201d habit (Module 7)."
  },
  {
    "prompt": "A graph had the y-axis going from 50 to 100 (not from 0). You estimated a value as \u201cabout half\u201d and picked 50 instead of 75.",
    "options": [
      "Time Pressure",
      "Content Gap",
      "Strategy Gap",
      "Careless Error",
      "Misread/Trap"
    ],
    "correct": 4,
    "explanation": "Misreading graph axes is a top SAT trap. Always check axis labels and whether they start at zero."
  }
];

const PRE_TEST_CHECKLIST = [
  "Bluebook app downloaded, updated, and logged in",
  "Quiet testing environment — no distractions, door closed",
  "Timer ready (Bluebook manages timing, but keep a clock visible)",
  "Scratch paper and pencil available",
  "Phone silenced and out of reach",
  "Water and snack for break between modules",
  "Desmos practice: spent at least 5 minutes exploring the calculator",
  "Understand the plan: complete test \u2192 self-score \u2192 error analysis worksheet",
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "math",
  moduleNum: 1,
  title: "Diagnostic & Orientation",
  subtitle:
    "Establish your baseline, learn the test structure, and build your personalized study plan.",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "welcome" },
    { id: "lesson", label: "Lesson", icon: "lesson" },
    { id: "checklist", label: "Checklist", icon: "clipboard" },
    { id: "activity-routing", label: "Routing Simulator", icon: "zap" },
    { id: "exercise-ec-qs", label: "Error Classification", icon: "zap" },
    { id: "error-worksheet", label: "Error Analysis Worksheet", icon: "zap" },
    { id: "score-projector", label: "Score Projector", icon: "chart" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "complete" },
  ],
  lessons: [
    /* ── Slide 1: Test Structure ── */
    {
      id: "test-structure",
      title: "Digital SAT Math: Structure & Format",
      subtitle: "Know Your Test",
      visual: "test-structure",
      body: [
        "The SAT Math section has $44$ total questions split into two adaptive modules of $22$ questions each, with $35$ minutes per module ($70$ minutes total).",
        "That gives you roughly $95$ seconds per question on average.",
        "About $75\\%$ of questions are multiple choice (4 options) and $25\\%$ are student-produced response (grid-in). There is no penalty for wrong answers -- always answer every question.",
        "The built-in Desmos graphing calculator is available on ALL questions. CAS calculators are now banned as of 2025. Desmos offers a scientific/graphing toggle you can switch during the test.",
        "Scoring ranges from $200$ to $800$ for the Math section. A reference sheet with area/volume formulas, special right triangles, and circle properties is provided.",
      ],
    },
    /* ── Slide 2: Adaptive Module System ── */
    {
      id: "adaptive-system",
      title: "The Adaptive Module System",
      subtitle: "How It Works",
      visual: "adaptive",
      body: [
        "The SAT uses multistage adaptive testing (MST). Module 1 contains mixed-difficulty questions. Your performance on Module 1 determines which version of Module 2 you receive.",
        "If you perform well on Module 1 (estimated threshold: ~$15$ out of $22$ correct), you are routed to the harder Module 2, which unlocks scores up to $800$.",
        "If you score below the threshold, you receive the easier Module 2, which caps your maximum score at roughly $560$--$630$ -- even if you ace every question.",
        "The Module 1 Imperative: Accuracy on the first 22 questions matters more than speed. Getting routed to the harder Module 2 is the single most important factor in your score.",
      ],
    },
    /* ── Slide 3: Four Content Domains ── */
    {
      id: "four-domains",
      title: "The Four Content Domains",
      subtitle: "Content Breakdown",
      visual: "domains",
      body: [
        "Algebra (~$35\\%$, 13--15 questions): Linear equations in one variable, linear equations in two variables, systems of linear equations, linear inequalities. The single largest content area -- mastering this can be worth 60--80 points. Covered in Module 2.",
        "Advanced Math (~$35\\%$, 13--15 questions): Quadratic equations, polynomials, exponentials & radicals, rational expressions, functions & transformations. Quadratics are the most tested topic. Covered in Modules 3--4.",
        "Problem-Solving & Data Analysis (~$15\\%$, 5--7 questions): Ratios, rates, proportions, percentages, statistics, scatterplots, probability, study design. Highest proportion of word problems. Covered in Module 5.",
        "Geometry & Trigonometry (~$15\\%$, 5--7 questions): Lines, angles, triangles, circles, area/volume, SOH-CAH-TOA, radians, special right triangles. Fewest questions but formulas are provided on the reference sheet. Covered in Module 6.",
        "Key Insight: Algebra and Advanced Math together account for roughly $70\\%$ of the test. Mastering these two domains is the single highest-impact investment of your study time.",
      ],
    },
    /* ── Slide 4: Strategy Toolkit ── */
    {
      id: "strategy-toolkit",
      title: "The SAT Math Strategy Toolkit",
      subtitle: "Preview",
      visual: "strategy",
      body: [
        "Plug In (PIYON): When you see variables in the answer choices, pick easy numbers (2, 3, 5, 10, 100), solve to get a target answer, then test each choice with your numbers. Avoid 0 and 1.",
        "Backsolve (PITA): When answer choices are specific numbers, start with B or C (middle value) and plug it into the problem. If too big, try smaller; if too small, try larger.",
        "Ballpark: Before calculating, estimate the answer to eliminate clearly wrong choices. $15\\%$ of $820 \\approx 120$ -- any choice far from that is gone. Especially powerful on geometry.",
        "Desmos: About $40\\%$ of SAT math questions can be solved or verified with Desmos. Graph equations, find intersections, use sliders, run regressions. Module 7 covers this in depth.",
        "POE for Math: If the question asks for a positive value, eliminate negatives. If context requires small numbers, eliminate large ones. POE turns a $25\\%$ guess into $33\\%$ or $50\\%$.",
        "POOD + LOTD: Answer confident questions first, flag uncertain ones. On second pass, attempt flagged questions. Use Letter of the Day (always the same letter) for remaining guesses. Never leave blanks.",
      ],
    },
    /* ── Slide 5: Error Classification ── */
    {
      id: "error-classification",
      title: "Error Classification & Analysis",
      subtitle: "Session 2: Know Your Mistakes",
      visual: "error-classification",
      body: [
        "Every wrong answer falls into one of five error types. Correctly identifying your error type is the key to knowing what to study.",
        "Content Gap: You didn't know the math concept. Example: missing a perpendicular slope question because you forgot the negative reciprocal rule. Fix: review the relevant module.",
        "Careless Error: You knew the math but made a simple arithmetic or transcription mistake. Example: writing $3 \\times 4 = 9$ instead of $12$. Fix: double-check calculations.",
        "Time Pressure: You ran out of time and had to guess. Fix: practice pacing -- ~25 min first pass, ~8 min second pass, ~2 min final check.",
        "Misread/Trap: You solved correctly but answered what wasn't asked. Example: finding $x = 5$ when the question asked for $2x + 1 = 11$. Fix: always re-read what the question asks for before selecting your answer.",
        "Strategy Gap: You knew the content but used the wrong approach, spending too long. Example: doing full algebra when Desmos or Plug In would take 30 seconds. Fix: build the habit of choosing the fastest method.",
      ],
    },
    /* ── Slide 6: Baseline Protocol & Study Plan ── */
    {
      id: "baseline-protocol",
      title: "Baseline Assessment & Study Plan",
      subtitle: "Sessions 2 & 3",
      body: [
        "Take a full-length SAT Math section using an official College Board practice test in the Bluebook app (Tests 4--6; save Tests 7--10 for later). Use the built-in Desmos calculator. Simulate test conditions: no phone, no notes, timed modules.",
        "After completion, self-score BEFORE the instructor reviews results. Mark every question you were unsure about, even if you got it correct -- 'lucky correct' answers mask skill gaps.",
        "Complete the Error Analysis Worksheet for every missed AND uncertain question: record the question number, domain, topic, error type, what you should have done, and whether Desmos could have helped.",
        "After your error analysis, use the SAT Score Projector to estimate your scaled score. Enter your Module 1 and Module 2 raw scores along with your routing path (harder or easier Module 2) to see how routing dramatically affects your scaled score.",
        "Identify your top 3 priority areas based on error analysis. These will guide which modules to focus the most attention on throughout the course.",
        "Explore Desmos at desmos.com/calculator -- spend 15 minutes graphing equations, making tables, and finding intersection points.",
      ],
    },
    /* ── Slide 7: Why SAT Matters ── */
    {
      id: "why-sat-matters",
      title: "Why Your SAT Score Matters More Than Ever",
      subtitle: "Context",
      visual: "why-sat-matters",
      body: [
        "After years of test-optional policies, the trend has reversed. As of the 2025--26 admissions cycle, Harvard, Yale, Dartmouth, Brown, MIT, Caltech, Stanford, Georgetown, Cornell, and Penn all require or strongly encourage SAT scores.",
        "The good news: Most top-25 schools superscore the SAT, meaning they take your highest Math score and highest Reading & Writing score across all sittings. Every point you gain on any test date counts toward your best composite.",
        "By the numbers (2025): Mean SAT Math score was $508$ out of $800$. Only $34\\%$ of test-takers met the college-readiness benchmark of $530$. Just $9\\%$ scored $700$+. There is enormous room for improvement with targeted prep.",
      ],
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "If <code>3(2x − 5) = 4x + 7</code>, what is the value of <code>x</code>?",
      choices: ["22", "11", "8", "9"],
      correct: 1,
      explanation: "Distribute: $6x − 15 = 4x + 7$. Subtract 4x: $2x − 15 = 7$. Add 15: $2x = 22$. Divide: $x = 11$.",
      domain: "Algebra",
    },
    {
      stem: "A gym charges a $50 registration fee plus $25 per month. Which equation represents the total cost <code>C</code> after <code>m</code> months?",
      choices: ["C = 25m + 50", "C = 75m", "C = 25(m + 50)", "C = 50m + 25"],
      correct: 0,
      explanation: "The fixed fee ($50) is the constant, and $25/month is the rate. C = 25m + 50.",
      domain: "Algebra",
    },
    {
      stem: "The system <code>2x + 3y = 12</code> and <code>4x + 6y = 24</code> has how many solutions?",
      choices: ["Infinitely many", "Zero", "Exactly two", "Exactly one"],
      correct: 0,
      explanation: "The second equation is exactly 2× the first. Same line → infinitely many solutions.",
      domain: "Algebra",
    },
    {
      stem: "If <code>−3x + 7 > 22</code>, which describes the solution?",
      choices: ["x > 5", "x < 5", "x < −5", "x > −5"],
      correct: 2,
      explanation: "Subtract 7: $−3x > 15$. Divide by −3 and FLIP the sign: $x < −5$.",
      domain: "Algebra",
    },
    {
      stem: "The question asks: \"What is the value of <code>2x + 1</code>?\" You find <code>x = 4</code>. What should your answer be?",
      choices: ["9", "Cannot be determined", "8", "4"],
      correct: 0,
      explanation: "The question asks for 2x + 1, NOT x. So: 2(4) + 1 = 9. This is the #1 most common SAT trap!",
      domain: "Algebra",
    },
    {
      stem: "What are the solutions to <code>x² − 5x + 6 = 0</code>?",
      choices: ["$x = −2$ and $x = −3$", "$x = −1$ and $x = −6$", "$x = 2$ and $x = 3$", "$x = 1$ and $x = 6$"],
      correct: 2,
      explanation: "Factor: (x − 2)(x − 3) = 0. So $x = 2$ or $x = 3$.",
      domain: "Advanced Math",
    },
    {
      stem: "If <code>f(x) = 2x² − 3</code>, what is <code>f(−4)</code>?",
      choices: ["29", "5", "−35", "−11"],
      correct: 0,
      explanation: "f(−4) = 2(−4)² − 3 = 2(16) − 3 = 32 − 3 = 29. Remember: (−4)² = 16 (positive!).",
      domain: "Advanced Math",
    },
    {
      stem: "Which expression is equivalent to <code>(3x²)(4x³)</code>?",
      choices: ["12x⁶", "7x⁵", "7x⁶", "12x⁵"],
      correct: 3,
      explanation: "Multiply coefficients: 3 × 4 = 12. Add exponents: $x² · x³ =$ x⁵. Answer: 12x⁵.",
      domain: "Advanced Math",
    },
    {
      stem: "The graph of <code>y = (x − 3)² + 2</code> has its vertex at which point?",
      choices: ["(3, −2)", "(3, 2)", "(−3, 2)", "(−3, −2)"],
      correct: 1,
      explanation: "Vertex form $y =$ a(x − h)² + k gives vertex (h, k). Here $h = 3$, $k = 2$. Watch the sign!",
      domain: "Advanced Math",
    },
    {
      stem: "A bacteria population triples every 4 hours starting at 200. Which models this?",
      choices: ["200(3)^(4t)", "200 + 3t", "600t", "200(3)^(t/4)"],
      correct: 3,
      explanation: "Triples every 4 hours: base 3, exponent t/4. P(t) = 200(3)^(t/4).",
      domain: "Advanced Math",
    },
    {
      stem: "A shirt originally costs $40 and is marked 30% off. What is the sale price?",
      choices: ["$30", "$28", "$10", "$12"],
      correct: 1,
      explanation: "30% of $40 = $12 discount. Sale price = $40 − $12 = $28. Or: $40 × 0.70 = $28.",
      domain: "Problem-Solving & Data",
    },
    {
      stem: "The mean of 5 numbers is 12. If a sixth number, 30, is added, what is the new mean?",
      choices: ["17", "15", "21", "14"],
      correct: 1,
      explanation: "Sum of 5 numbers = 60. New sum = 90. New mean = 90 ÷ 6 = 15.",
      domain: "Problem-Solving & Data",
    },
    {
      stem: "A researcher surveys 200 people at a shopping mall about spending habits. What is the biggest threat to validity?",
      choices: ["Mall shoppers may not represent the general population", "Sample too small", "Should be done online", "200 is too many"],
      correct: 0,
      explanation: "This is sampling bias. Mall shoppers likely differ from the general population — it is a convenience sample.",
      domain: "Problem-Solving & Data",
    },
    {
      stem: "A scatterplot shows strong negative linear association. The correlation r is closest to:",
      choices: ["0.45", "-0.92", "0.85", "-0.15"],
      correct: 1,
      explanation: "Strong negative association means r close to -1. -0.92.",
      domain: "Problem-Solving & Data",
    },
    {
      stem: "A price increases 20% then decreases 20%. Compared to the original price, the final price is:",
      choices: ["4% less", "4% more", "2% less", "The same"],
      correct: 0,
      explanation: "$100 -> $120 -> $96. Net: 4% less. This is the successive percents trap!",
      domain: "Problem-Solving & Data",
    },
    {
      stem: "A right triangle has legs of length 5 and 12. What is the hypotenuse?",
      choices: ["√119", "17", "13", "15"],
      correct: 2,
      explanation: "5² + 12² = 25 + 144 = 169 = 13². Classic 5-12-13 right triangle.",
      domain: "Geometry & Trig",
    },
    {
      stem: "A circle has equation <code>(x − 2)² + (y + 3)² = 49</code>. What is its radius?",
      choices: ["24.5", "√49", "49", "7"],
      correct: 3,
      explanation: "$r² = 49$, so $r = 7$. Common trap: choosing 49 (that is r², not r).",
      domain: "Geometry & Trig",
    },
    {
      stem: "In a 30-60-90 triangle, the side opposite 30° is 5. What is the hypotenuse?",
      choices: ["5√2", "5√3", "10√3", "10"],
      correct: 3,
      explanation: "Sides ratio x : x√3 : 2x. Opposite 30° is $x = 5$, hypotenuse = $2x = 10$.",
      domain: "Geometry & Trig",
    },
    {
      stem: "The circle <code>(x - 3)² + (y + 1)² = 25</code> has its center at:",
      choices: ["(-3, -1)", "(3, -1)", "(3, 1)", "(-3, 1)"],
      correct: 1,
      explanation: "(x-h)² + (y-k)² = r². $h=3$, $k=-1$. Center (3,-1). Watch the sign on (y+1)!",
      domain: "Geometry & Trig",
    },
    {
      stem: "In a right triangle, sin(θ) = 5/13. What is cos(θ)?",
      choices: ["5/13", "5/12", "13/12", "12/13"],
      correct: 3,
      explanation: "Opp=5, hyp=13. Adjacent=12 (5-12-13 triple). cos = adj/hyp = 12/13.",
      domain: "Geometry & Trig",
    },
  ],
  takeaways: [
    "The Digital SAT Math section has 44 questions in 70 minutes, split into two adaptive modules.",
    "Module 1 performance determines whether you get the harder (ceiling 800) or easier (ceiling ~560\u2013630) Module 2.",
    "Four domains: Algebra ~35%, Advanced Math ~35%, PSDA ~15%, Geometry & Trig ~15%.",
    "Desmos graphing calculator available on every question \u2014 CAS calculators are banned.",
    "No penalty for wrong answers \u2014 never leave a question blank.",
    "The SAT Score Projector shows how routing dramatically affects your scaled score.",
    "Error analysis is the foundation of improvement \u2014 know your error type, know what to study.",
  ],
};
