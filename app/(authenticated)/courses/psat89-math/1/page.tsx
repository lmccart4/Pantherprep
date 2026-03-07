"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import { MiniDiagnostic } from "@/components/course/mini-diagnostic";
import { CompleteScreen } from "@/components/course/complete-screen";
import { WorksheetScreen } from "./worksheet-screen";
import {
  TestStructureVisual,
  AdaptiveVisual,
  DomainsVisual,
  StrategyVisual,
  ErrorClassificationVisual,
  GrowthVisual,
  ScoreProjectorVisual,
} from "./lesson-visuals";

const EC_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    prompt: "A student solved 3x \u2212 7 = 14 and got x = 3. When checking: 3(3) \u2212 7 = 2 \u2260 14. They divided 21 by 3 incorrectly in their head.",
    options: ["Content Gap", "Careless Error", "Time Pressure", "Misread/Trap"],
    correct: 1,
    explanation: "This is a Careless Error. The student knows the method but made a simple calculation mistake. Fix: slow down and check by substituting back.",
  },
  {
    prompt: `A student sees \u201cwhat is the value of 3x + 2?\u201d and solves for x instead. They get x = 4, choose 4, and it\u2019s wrong. The answer was 3(4)+2 = 14.`,
    options: ["Content Gap", "Careless Error", "Time Pressure", "Misread/Trap"],
    correct: 3,
    explanation: "This is a Misread/Trap. The student solved for x but the question asked for 3x + 2. This is the #1 most common PSAT math trap. Fix: underline exactly what the question asks for.",
  },
  {
    prompt: "A student can\u2019t remember how to find the vertex of a quadratic in standard form. They guess by plugging in x = 0.",
    options: ["Content Gap", "Careless Error", "Time Pressure", "Strategy Gap"],
    correct: 0,
    explanation: "This is a Content Gap. The student doesn\u2019t know the vertex formula (x = \u2212b/2a). Fix: study quadratic forms in Module 3.",
  },
  {
    prompt: "A student runs out of time with 4 questions left. They had spent 3+ minutes on a hard question earlier that they ended up guessing on anyway.",
    options: ["Content Gap", "Careless Error", "Time Pressure", "Strategy Gap"],
    correct: 2,
    explanation: "This is a Time Pressure error caused by poor time management. Fix: use the two-pass strategy \u2014 skip hard questions on the first pass, return with remaining time.",
  },
  {
    prompt: "A student multiplied both sides of \u22122x > 8 by \u22121 and got x > \u22124. The correct answer is x < \u22124.",
    options: ["Content Gap", "Careless Error", "Time Pressure", "Misread/Trap"],
    correct: 0,
    explanation: "This is a Content Gap. The student doesn\u2019t know the rule: when dividing or multiplying by a negative, flip the inequality sign.",
  },
  {
    prompt: "A student stares at a systems problem for 45 seconds trying to set up elimination, when graphing both lines in Desmos would give the answer in 10 seconds.",
    options: ["Content Gap", "Careless Error", "Time Pressure", "Strategy Gap"],
    correct: 3,
    explanation: "This is a Strategy Gap. The student knows the math but chose an inefficient method. Fix: develop the \u201cDesmos or Algebra?\u201d decision habit (Module 6).",
  },
];

const DIAG_QUESTIONS = [
  { domain: "Algebra", domainColor: "#60a5fa", difficulty: "easy", passage: "", stem: "If 3(2x \u2212 5) = 4x + 7, what is the value of x?", choices: ["22/6", "11", "8", "9"], correct: 1, explanation: "Distribute: 6x \u2212 15 = 4x + 7. Subtract 4x: 2x \u2212 15 = 7. Add 15: 2x = 22. Divide: x = 11." },
  { domain: "Algebra", domainColor: "#60a5fa", difficulty: "easy", passage: "", stem: "A gym charges a $50 registration fee plus $25 per month. Which equation represents the total cost C after m months?", choices: ["C = 25m + 50", "C = 75m", "C = 25(m + 50)", "C = 50m + 25"], correct: 0, explanation: "The fixed fee ($50) is the y-intercept, and $25/month is the slope. C = 25m + 50." },
  { domain: "Algebra", domainColor: "#60a5fa", difficulty: "medium", passage: "", stem: "The system 2x + 3y = 12 and 4x + 6y = 24 has how many solutions?", choices: ["Infinitely many", "Zero", "Exactly two", "Exactly one"], correct: 0, explanation: "The second equation is exactly 2\u00d7 the first. They're the same line \u2192 infinitely many solutions." },
  { domain: "Algebra", domainColor: "#60a5fa", difficulty: "medium", passage: "", stem: "If \u22123x + 7 > 22, which describes the solution?", choices: ["x > \u22125", "x < \u22125", "x > 5", "x < 5"], correct: 1, explanation: "Subtract 7: \u22123x > 15. Divide by \u22123 and FLIP the sign: x < \u22125." },
  { domain: "Algebra", domainColor: "#60a5fa", difficulty: "hard", passage: "", stem: `The question asks: "What is the value of 2x + 1?" You find x = 4. What should your answer be?`, choices: ["9", "Cannot be determined", "8", "4"], correct: 0, explanation: "The question asks for 2x + 1, NOT x. So: 2(4) + 1 = 9. This is the #1 most common SAT trap!" },
  { domain: "Advanced Math", domainColor: "#a855f7", difficulty: "easy", passage: "", stem: "What are the solutions to x\u00b2 \u2212 5x + 6 = 0?", choices: ["x = \u22122 and x = \u22123", "x = \u22121 and x = \u22126", "x = 2 and x = 3", "x = 1 and x = 6"], correct: 2, explanation: "Factor: (x \u2212 2)(x \u2212 3) = 0 \u2192 x = 2 or x = 3." },
  { domain: "Advanced Math", domainColor: "#a855f7", difficulty: "easy", passage: "", stem: "If f(x) = 2x\u00b2 \u2212 3, what is f(\u22124)?", choices: ["29", "5", "\u221235", "\u221211"], correct: 0, explanation: "f(\u22124) = 2(\u22124)\u00b2 \u2212 3 = 2(16) \u2212 3 = 32 \u2212 3 = 29. Remember: (\u22124)\u00b2 = 16 (positive!)." },
  { domain: "Advanced Math", domainColor: "#a855f7", difficulty: "easy", passage: "", stem: "Which expression is equivalent to (3x\u00b2)(4x\u00b3)?", choices: ["12x\u2075", "7x\u2076", "12x\u2076", "7x\u2075"], correct: 0, explanation: "Multiply coefficients: 3 \u00d7 4 = 12. Add exponents: x\u00b2 \u00b7 x\u00b3 = x\u2075. Answer: 12x\u2075." },
  { domain: "Advanced Math", domainColor: "#a855f7", difficulty: "medium", passage: "", stem: "The graph of y = (x \u2212 3)\u00b2 + 2 has its vertex at which point?", choices: ["(3, \u22122)", "(3, 2)", "(\u22123, 2)", "(\u22123, \u22122)"], correct: 1, explanation: "Vertex form y = a(x \u2212 h)\u00b2 + k gives vertex (h, k). Here h = 3, k = 2. Watch the sign!" },
  { domain: "Advanced Math", domainColor: "#a855f7", difficulty: "medium", passage: "", stem: "A bacteria population triples every 4 hours starting at 200. Which models this?", choices: ["200(3)^(4t)", "200 + 3t", "600t", "200(3)^(t/4)"], correct: 3, explanation: "Triples every 4 hours: base 3, exponent t/4. P(t) = 200(3)^(t/4)." },
  { domain: "Problem-Solving & Data", domainColor: "#fbbf24", difficulty: "easy", passage: "", stem: "A shirt originally costs $40 and is marked 30% off. What is the sale price?", choices: ["$30", "$28", "$10", "$12"], correct: 1, explanation: "30% of $40 = $12 discount. Sale price = $40 \u2212 $12 = $28. Or: $40 \u00d7 0.70 = $28." },
  { domain: "Problem-Solving & Data", domainColor: "#fbbf24", difficulty: "medium", passage: "", stem: "The mean of 5 numbers is 12. If a sixth number, 30, is added, what is the new mean?", choices: ["17", "15", "21", "14"], correct: 1, explanation: "Sum of 5 numbers = 60. New sum = 90. New mean = 90 \u00f7 6 = 15." },
  { domain: "Problem-Solving & Data", domainColor: "#fbbf24", difficulty: "medium", passage: "", stem: "A researcher surveys 200 people at a shopping mall about spending habits. What is the biggest threat to validity?", choices: ["Mall shoppers may not represent the general population", "Sample too small", "Should be done online", "200 is too many"], correct: 0, explanation: "This is sampling bias. Mall shoppers likely differ from the general population \u2014 it is a convenience sample." },
  { domain: "Problem-Solving & Data", domainColor: "#fbbf24", difficulty: "easy", passage: "", stem: "A scatterplot shows strong negative linear association. The correlation r is closest to:", choices: ["0.45", "\u22120.92", "\u22120.15", "0.85"], correct: 1, explanation: "Strong negative association means r close to \u22121. \u22120.92." },
  { domain: "Problem-Solving & Data", domainColor: "#fbbf24", difficulty: "hard", passage: "", stem: "A price increases 20% then decreases 20%. Compared to the original price, the final price is:", choices: ["4% less", "4% more", "2% less", "The same"], correct: 0, explanation: "$100 \u2192 $120 \u2192 $96. Net: 4% less. This is the successive percents trap!" },
  { domain: "Geometry", domainColor: "#34d399", difficulty: "easy", passage: "", stem: "A right triangle has legs of length 5 and 12. What is the hypotenuse?", choices: ["\u221a119", "17", "13", "15"], correct: 2, explanation: "5\u00b2 + 12\u00b2 = 25 + 144 = 169 = 13\u00b2. Classic 5-12-13 right triangle." },
  { domain: "Geometry", domainColor: "#34d399", difficulty: "medium", passage: "", stem: "A circle has equation (x \u2212 2)\u00b2 + (y + 3)\u00b2 = 49. What is its radius?", choices: ["24.5", "\u221a49", "49", "7"], correct: 3, explanation: "r\u00b2 = 49, so r = 7. Common trap: choosing 49 (that is r\u00b2, not r)." },
  { domain: "Geometry", domainColor: "#34d399", difficulty: "medium", passage: "", stem: "In a 30-60-90 triangle, the side opposite 30\u00b0 is 5. What is the hypotenuse?", choices: ["5\u221a2", "5\u221a3", "10\u221a3", "10"], correct: 3, explanation: "Sides ratio x : x\u221a3 : 2x. Opposite 30\u00b0 is x = 5, hypotenuse = 2x = 10." },
  { domain: "Geometry", domainColor: "#34d399", difficulty: "medium", passage: "", stem: "The circle (x \u2212 3)\u00b2 + (y + 1)\u00b2 = 25 has its center at:", choices: ["(\u22123, \u22121)", "(3, 1)", "(\u22123, 1)", "(3, \u22121)"], correct: 3, explanation: "(x\u2212h)\u00b2 + (y\u2212k)\u00b2 = r\u00b2. h=3, k=\u22121. Center (3,\u22121). Watch the sign on (y+1)!" },
  { domain: "Geometry", domainColor: "#34d399", difficulty: "easy", passage: "", stem: "A rectangle has area 48 and width 6. What is the perimeter?", choices: ["28", "22", "16", "54"], correct: 0, explanation: "Length = 48/6 = 8. Perimeter = 2(8+6) = 28." },
];

export default function PSAT89MathModule1() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "test-structure": <TestStructureVisual />,
        "adaptive": <AdaptiveVisual />,
        "domains": <DomainsVisual />,
        "strategy": <StrategyVisual />,
        "error-classification": <ErrorClassificationVisual />,
        "growth": <GrowthVisual />,
        "score-projector": <ScoreProjectorVisual />,
      }}
      activities={{
        "diagnostic": (goNext: () => void) => (
          <MiniDiagnostic
            questions={DIAG_QUESTIONS}
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
            domains={["Algebra", "Advanced Math", "Problem-Solving & Data", "Geometry"]}
            testLabel="PSAT 8/9 Math"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "worksheet": (goNext: () => void) => (
          <WorksheetScreen onComplete={goNext} />
        ),
        "complete": () => (
          <CompleteScreen
            title="Module 1 Complete!"
            description="You've learned the PSAT 8/9 Math structure, explored all four content domains, completed your diagnostic assessment, and built your personalized study plan."
            accentColor="#06b6d4"
            courseHref="/courses/psat89-math"
            courseLabel="← Course Home"
            nextHref="/courses/psat89-math/2"
            nextLabel="Module 2: Algebra →"
            takeaways={[
              "The PSAT 8/9 Math section has 44 questions in 70 minutes, split into two adaptive modules of 22 questions each.",
              "Module 1 performance determines your Module 2 difficulty \u2014 and your score ceiling. Accuracy in Module 1 matters most.",
              "The four domains are Algebra (~35%), Advanced Math (~35%), Problem-Solving & Data Analysis (~15%), and Geometry (~15%). No trig.",
              "A Desmos graphing calculator is available on every question. With CAS calculators now banned, mastering Desmos is essential.",
              "There's no penalty for wrong answers \u2014 never leave a question blank.",
              "Your PSAT 8/9 score uses the same scale as the SAT \u2014 every point of growth carries forward.",
              "Error analysis is the most powerful study tool: identify why you missed a question, not just what you missed.",
              "The college readiness benchmark is 450. That's your first target.",
            ]}
          />
        ),
      }}
      lessonLastLabel="Start Diagnostic"
      nextModuleHref="/courses/psat89-math/2"
      nextModuleLabel="Module 2: Algebra — Linear Equations & Systems"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "math",
  moduleNum: 1,
  title: "Diagnostic & Orientation",
  subtitle:
    "Understand the test, see how questions actually work, establish your baseline, and build your study plan.",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "diagnostic", label: "Mini Diagnostic", icon: "clipboard" },
    { id: "exercise-ec-qs", label: "Error Classification", icon: "zap" },
    { id: "error-worksheet", label: "Error Analysis Worksheet", icon: "zap" },
    { id: "worksheet", label: "Worksheet", icon: "clipboard" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],
  lessons: [
    {
      id: "test-structure",
      title: "Digital PSAT 8/9 Math: Structure & Format",
      subtitle: "Know Your Test",
      visual: "test-structure",
      body: [
        "The PSAT 8/9 is the first test in the SAT Suite \u2014 the same adaptive format and question style as the PSAT 10 and SAT, but calibrated for 8th and 9th graders. No trigonometry. No complex numbers. Everything you need to know is either already in your toolkit from middle school or covered in this course.",
      ],
    },
    {
      id: "adaptive-system",
      title: "The Adaptive Module System",
      subtitle: "How It Works",
      visual: "adaptive",
      body: [
        "The PSAT 8/9 uses multistage adaptive testing (MST). Module 1 contains mixed-difficulty questions. Your performance on Module 1 determines which version of Module 2 you receive.",
        "The Module 1 Imperative: Accuracy on the first 22 questions matters more than speed. Getting routed to the harder Module 2 is the single most important factor in your score.",
      ],
    },
    {
      id: "four-domains",
      title: "The Four Content Domains",
      subtitle: "Content Breakdown",
      visual: "domains",
      body: [
        "The PSAT 8/9 Math section tests four domains. Tap each card above to see the specific topics covered and which course module addresses them.",
      ],
    },
    {
      id: "strategy-toolkit",
      title: "The PSAT 8/9 Math Strategy Toolkit",
      subtitle: "Preview",
      visual: "strategy",
      body: [
        "These six strategies will be your toolkit throughout the course. Tap each card above to learn more. You'll practice all of them in depth in later modules.",
      ],
    },
    {
      id: "error-classification",
      title: "Error Classification & Analysis",
      subtitle: "Know Your Mistakes",
      visual: "error-classification",
      body: [
        "Every wrong answer falls into one of five error types. Tap each card to see the fix. Correctly classifying your errors is the single fastest way to improve your score.",
      ],
    },
    {
      id: "growth-trajectory",
      title: "Your Growth Trajectory",
      subtitle: "The Big Picture",
      visual: "growth",
      body: [
        "The PSAT 8/9 is your starting line, not your finish line. Every test in the SAT Suite shares the same scale \u2014 so a 500 here means the same thing as a 500 on the SAT.",
        "Every skill you build now transfers directly to the harder tests ahead. There is no wasted effort.",
      ],
    },
    {
      id: "baseline-protocol",
      title: "Baseline Assessment & Study Plan",
      subtitle: "Next Steps",
      visual: "score-projector",
      body: [
        "After the mini diagnostic, you'll take a full-length PSAT 8/9 Math section using the Bluebook app. Enter your raw scores in the projector above to estimate your scaled score.",
        "Complete an Error Analysis for every missed AND uncertain question: record the question number, domain, topic, error type, and what you should have done differently.",
        "Identify your top 3 priority areas based on error analysis. These will guide which modules to focus the most attention on throughout the course.",
      ],
    },
  ],
  quiz: [],
  takeaways: [
    "The PSAT 8/9 Math section has 44 questions in 70 minutes, split into two adaptive modules of 22 questions each.",
    "Module 1 performance determines your Module 2 difficulty \u2014 and your score ceiling. Accuracy in Module 1 matters most.",
    "The four domains are Algebra (~35%), Advanced Math (~35%), Problem-Solving & Data (~15%), and Geometry (~15%). No trig.",
    "A Desmos graphing calculator is available on every question. With CAS calculators now banned, mastering Desmos is essential.",
    "There's no penalty for wrong answers \u2014 never leave a question blank.",
    "Your PSAT 8/9 score uses the same scale as the SAT \u2014 every point of growth carries forward.",
    "Error analysis is the most powerful study tool: identify why you missed a question, not just what you missed.",
    "The college readiness benchmark is 450. That's your first target.",
  ],
};
