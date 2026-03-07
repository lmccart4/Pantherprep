"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import {
  ClassificationExercise,
  type ClassificationItem,
} from "@/components/course/activities/classification-exercise";
import { InteractiveChecklist } from "@/components/course/activities/interactive-checklist";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import { GrowthTracker } from "@/components/course/activities/growth-tracker";
import {
  PracticeTestOverviewVisual,
  ScoreProjectorVisual,
  ErrorClassificationVisual,
  FormulaReferenceVisual,
  TestDayTimelineVisual,
} from "./lesson-visuals";

export default function NMSQTMathModule8() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "practice-test-overview": <PracticeTestOverviewVisual />,
        "score-projector": <ScoreProjectorVisual />,
        "error-classification": <ErrorClassificationVisual />,
        "formula-reference": <FormulaReferenceVisual />,
        "test-day-timeline": <TestDayTimelineVisual />,
      }}
      activities={{
        "checklist-pre": (goNext: () => void) => (
          <InteractiveChecklist
            title="Pre-Test Checklist"
            items={PRE_TEST_CHECKLIST}
            accentColor="#d4a017"
            requireAll
            onComplete={goNext}
          />
        ),
        "ec-exercise": (goNext: () => void) => (
          <ClassificationExercise
            title="Error Classification Practice"
            subtitle="Practice classifying these common error scenarios before analyzing your own test."
            icon="analysis"
            items={EC_ITEMS}
            categories={[
              "Concept Gap",
              "Careless/Arithmetic",
              "Time Pressure",
              "Misread Problem",
              "Strategy Gap",
            ]}
            accentColor="#d4a017"
            onComplete={goNext}
          />
        ),
        "checklist-td": (goNext: () => void) => (
          <InteractiveChecklist
            title="Test Day Checklist"
            items={TEST_DAY_CHECKLIST}
            accentColor="#d4a017"
            onComplete={goNext}
          />
        ),
        "error-analysis": (goNext: () => void) => (
          <ErrorAnalysisWorksheet
            domains={["Algebra", "Advanced Math", "Problem-Solving & Data", "Geometry & Trig"]}
            testLabel="PSAT/NMSQT Math"
            accentColor="#d4a017"
            onComplete={goNext}
          />
        ),
        "growth-tracker": (goNext: () => void) => (
          <GrowthTracker
            testType="nmsqt"
            section="math"
            totalQuestions={44}
            accentColor="#d4a017"
            domainModules={{"Algebra": "Module 2", "Advanced Math": "Module 3", "Problem-Solving & Data": "Module 4", "Geometry & Trig": "Module 5"}}
            onComplete={goNext}
          />
        ),
      }}
    />
  );
}

const PRE_TEST_CHECKLIST = [
  "Find a quiet space with 70+ minutes uninterrupted.",
  "Open desmos.com/calculator in another tab.",
  "Have scratch paper and pencils ready.",
  "Turn off phone, close other tabs.",
  "Remember: accuracy over speed in Module 1.",
  "Desmos shortcuts memorized: ^ _ ~ | sqrt pi",
];

const TEST_DAY_CHECKLIST = [
  "Night before: Charge your device. Sleep 8+ hours.",
  "Morning: Eat a real breakfast. Bring a snack.",
  "Bring: Charged device, pencils, approved calculator (backup).",
  "Bluebook app must be installed and updated.",
  "Module 1: Two-pass system. Flag hard questions. Accuracy first.",
  "Desmos: Use aggressively for systems, quadratics, statistics.",
  "Time check: After 15 min, be on question 8+.",
  "Last 2 min: Answer ALL remaining questions — no penalty for guessing.",
  "Between modules: Breathe. Stay confident.",
  "For National Merit: Every Selection Index point matters. Maximize both Math and RW.",
];

/* ── WARMUP (Module 7 Review) ── */
const WARMUP: ModuleConfig["warmup"] = [
  {
    source: "Module 7 -- Decision Tree",
    stem: "According to the decision tree, what's the FIRST question to ask about any PSAT math problem?",
    choices: [
      '"Should I plug in numbers?"',
      '"Is this algebra or geometry?"',
      '"Do I immediately see how to solve this?"',
      '"How much time do I have left?"'
    ],
    correct: 2,
    explanation:
      'The decision tree starts with "Do I immediately see how to solve this?" If yes, solve directly. If not, move to the next decision point to pick the best strategy.',
  },
  {
    source: "Module 7 -- Plug In Numbers",
    stem: "Variables appear in ALL four answer choices. The fastest strategy is:",
    choices: [
      "Estimate and eliminate",
      "Plug In Numbers (PIYON)",
      "Solve algebraically",
      "Graph it in Desmos"
    ],
    correct: 1,
    explanation:
      "Variables in all choices = classic Plug In signal. Pick a number, substitute into the problem AND each answer choice. One will match.",
  },
  {
    source: "Module 7 -- Two-Pass System",
    stem: "You have 35 minutes for 22 questions. How much time should you spend on hard questions during your first pass?",
    choices: [
      "About 2 minutes each",
      "As long as needed",
      "About 3 minutes each",
      "Skip them -- come back on second pass"
    ],
    correct: 3,
    explanation:
      "Two-pass system: First pass for easy/medium questions (build your score). Skip and flag hard questions. Come back on the second pass with remaining time.",
  },
  {
    source: "Module 7 -- Grid-In Rules",
    stem: "What format does the grid-in accept for the fraction 3/7?",
    choices: [
      "3/7 (fractions accepted as-is)",
      "Must convert to percent",
      "Only 0.4286",
      "Only .428"
    ],
    correct: 0,
    explanation:
      "The digital SAT/PSAT accepts fractions directly in student-produced response questions. No need to convert to decimals.",
  },
  {
    source: "Module 7 -- Common Traps",
    stem: 'You\'re confident you got a question right, but the answer seems "too easy." What should you check?',
    choices: [
      "Move on -- trust your instincts",
      "Try a different method",
      "Check your arithmetic twice",
      "Re-read what the question is actually asking for"
    ],
    correct: 3,
    explanation:
      "The #1 trap on the PSAT: solving for x when they asked for 2x+1, or finding the slope when they wanted the y-intercept. Always re-read the question.",
  },
];

/* ── EXERCISE DATA ── */

const EC_ITEMS: ClassificationItem[] = [
  {
    prompt:
      "You identified center $(3,-2)$ from $(x-3)^2+(y+2)^2=16$, but chose radius$=16$ instead of $4$.",
    correct: 0,
    explanation:
      "$r^2=16$ means $r=4$. Review circles.",
  },
  {
    prompt:
      "You solved a system correctly but wrote (3,5) when they asked for x+y. Answer was 8.",
    correct: 3,
    explanation:
      "Classic trap -- re-read what they ask for.",
  },
  {
    prompt:
      "Variables in all choices. Spent 3 min on algebra. Plugging in x=2 would take 30 sec.",
    correct: 4,
    explanation:
      "Variables in choices = Plug In. Review Decision Tree.",
  },
  {
    prompt: "Ran out of time with 5 questions left unanswered.",
    correct: 2,
    explanation:
      "Pacing issue. Use the two-pass system.",
  },
  {
    prompt:
      "Solved 3(x+4)=27 but expanded as 3x+4 instead of 3x+12.",
    correct: 1,
    explanation:
      "You know distribution -- just did it wrong. Slow down.",
  },
  {
    prompt:
      "Exponential question: picked decay when it was growth. Confused (1+r) with (1\u2212r).",
    correct: 0,
    explanation:
      "Growth=(1+r), Decay=(1\u2212r). Review exponentials.",
  },
];

/* ── QUIZ (44 Practice Test Questions) ── */
const QUIZ: ModuleConfig["quiz"] = [
  {
    stem: "If 3(2x \u2212 4) = 18, what is x?",
    choices: ["3", "5", "4", "6"],
    correct: 1,
    explanation: "6x\u221212=18. 6x=30. x=5.",
    difficulty: "easy" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Direct solve",
    },
  {
    stem: "The mean of 5 numbers is 24. If four are 20, 22, 26, 28, what is the fifth?",
    choices: ["20", "22", "26", "24"],
    correct: 3,
    explanation: "Sum must be 120. 20+22+26+28=96. Fifth=24.",
    difficulty: "easy" as const,
    type: "Data Analysis",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Mean calculation",
    },
  {
    stem: "In a 30-60-90 triangle, the hypotenuse is 16. What is the shorter leg?",
    choices: ["$8\\sqrt{3}$", "$4$", "$8$", "$8\\sqrt{2}$"],
    correct: 2,
    explanation: "Short leg = hyp/2 = 16/2 = 8.",
    difficulty: "easy" as const,
    type: "Geometry",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Special triangle ratios",
    },
  {
    stem: "Line passes through $(-1, 3)$ and $(3, 11)$. What is the equation in slope-intercept form?",
    choices: ["$y = 2x + 3$", "$y = 2x + 5$", "$y = 4x + 7$", "$y = -2x + 1$"],
    correct: 1,
    explanation:
      "$m=(11-3)/(3-(-1))=8/4=2$. $b$: $3=2(-1)+b \\Rightarrow b=5$. $y=2x+5$.",
    difficulty: "easy" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Slope-intercept form",
    },
  {
    stem: "Simplify: $\\frac{x^3 y^2}{x^1 y^4}$",
    choices: ["$x^2 y^2$", "$xy^2$", "$x^4 y^6$", "$x^2/y^2$"],
    correct: 3,
    explanation: "$x^{3-1}/y^{4-2} = x^2/y^2$.",
    difficulty: "easy" as const,
    type: "Advanced Math",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Exponent rules",
    },
  {
    stem: "A population of 2000 decreases by 5% per year. Which models this?",
    choices: ["$2000(0.95)^t$", "$2000(1.05)^t$", "$2000(0.05)^t$", "$2000 - 0.05t$"],
    correct: 0,
    explanation: "Decay: multiply by (1\u22120.05)=0.95 each year.",
    difficulty: "easy" as const,
    type: "Data Analysis",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Exponential decay",
    },
  {
    stem: "The system y = 3x \u2212 1 and y = kx \u2212 1 has infinitely many solutions when k = ?",
    choices: ["3", "1", "\u22123", "\u22121"],
    correct: 0,
    explanation: "Same line \u2192 same slope AND intercept. k=3.",
    difficulty: "medium" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "System of equations",
    },
  {
    stem: "A circle has equation $x^2 + y^2 - 6x + 4y - 12 = 0$. What is the radius?",
    choices: ["3", "12", "5", "25"],
    correct: 2,
    explanation: "Complete the square: $(x-3)^2+(y+2)^2=25$. $r=\\sqrt{25}=5$.",
    difficulty: "medium" as const,
    type: "Geometry",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Circle equation",
    },
  {
    stem: "A bag has 4 red, 6 blue, 5 green marbles. P(blue | not green)?",
    choices: ["6/15", "6/9", "2/5", "6/10"],
    correct: 3,
    explanation: "Not green = 4+6 = 10. P(blue|not green) = 6/10.",
    difficulty: "medium" as const,
    type: "Data Analysis",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Conditional probability",
    },
  {
    stem: "Factor completely: $3x^2 - 12x - 15$",
    choices: ["$3(x-5)(x+1)$", "$3(x+5)(x-1)$", "$(3x-15)(x+1)$", "$(3x-5)(x+3)$"],
    correct: 0,
    explanation: "Factor out 3: $3(x^2-4x-5) = 3(x-5)(x+1)$.",
    difficulty: "medium" as const,
    type: "Advanced Math",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Factoring with GCF",
    },
  {
    stem: 'Which represents "the cost is at least $50 but no more than $120"?',
    choices: ["50 \u2264 c \u2264 120", "c > 50 or c < 120", "50 < c < 120", "c \u2265 50 and c > 120"],
    correct: 0,
    explanation: '"At least" = \u2265, "no more than" = \u2264. 50 \u2264 c \u2264 120.',
    difficulty: "easy" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Compound inequality",
  },
  {
    stem: "In a right triangle, sin(A) = 5/13. What is cos(A)?",
    choices: ["5/13", "5/12", "13/12", "12/13"],
    correct: 3,
    explanation:
      "If sin=5/13, opposite=5, hyp=13. Adjacent=12 (5-12-13 triple). cos=12/13.",
    difficulty: "medium" as const,
    type: "Geometry",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Pythagorean triple",
    },
  {
    stem: "A scatter plot shows a strong negative linear association. The slope of the line of best fit is most likely:",
    choices: ["\u22120.85", "0.85", "0.15", "\u22120.02"],
    correct: 0,
    explanation:
      "Negative association \u2192 negative slope. Strong \u2192 steep \u2192 \u22120.85.",
    difficulty: "medium" as const,
    type: "Data Analysis",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Correlation and slope",
    },
  {
    stem: "If $f(x) = 2x^2 - 8x + 6$, what is the minimum value of $f$?",
    choices: ["$6$", "$0$", "$2$", "$-2$"],
    correct: 3,
    explanation: "Vertex: $x=8/4=2$. $f(2)=8-16+6=-2$. Minimum is $-2$.",
    difficulty: "medium" as const,
    type: "Advanced Math",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Vertex form minimum",
    },
  {
    stem: "The graph of y = |x \u2212 3| + 2 has its vertex at:",
    choices: ["(3, \u22122)", "(3, 2)", "(\u22123, 2)", "(2, 3)"],
    correct: 1,
    explanation: "|x\u2212h|+k \u2192 vertex at (h,k) = (3,2).",
    difficulty: "easy" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Absolute value vertex",
    },
  {
    stem: "A cone has radius 6 and height 10. Volume?",
    choices: ["$40\\pi$", "$360\\pi$", "$60\\pi$", "$120\\pi$"],
    correct: 3,
    explanation: "$V=\\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi(36)(10) = 120\\pi$.",
    difficulty: "medium" as const,
    type: "Geometry",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Cone volume",
    },
  {
    stem: "Margin of error for a survey of 400: \u00B15%. For 1600: \u00B12.5%. What happened?",
    choices: [
      "No relationship",
      "Sample doubled, MOE halved",
      "Sample doubled, MOE doubled",
      "Sample quadrupled, MOE halved"
    ],
    correct: 3,
    explanation: "$4\\times$ sample $\\Rightarrow \\frac{1}{2}$ margin of error (MOE $\\propto 1/\\sqrt{n}$).",
    difficulty: "hard" as const,
    type: "Data Analysis",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Margin of error and sample size",
    },
  {
    stem: "If g(x) = 3\u02E3, what is g(x+2) in terms of g(x)?",
    choices: ["$g(x) + 2$", "$2 \\cdot g(x)$", "$g(x)^2$", "$9 \\cdot g(x)$"],
    correct: 3,
    explanation: "$g(x+2) = 3^{x+2} = 3^x \\cdot 3^2 = 9 \\cdot g(x)$.",
    difficulty: "hard" as const,
    type: "Advanced Math",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Exponential function translation",
    },
  {
    stem: "For what value of a does ax + 3 = 2x + 3a have no solution?",
    choices: ["3", "6", "2", "1"],
    correct: 2,
    explanation:
      "ax\u22122x=3a\u22123. x(a\u22122)=3(a\u22121). If a=2: 0=3. No solution (contradiction).",
    difficulty: "hard" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "No solution condition",
    },
  {
    stem: "A sector with central angle 120\u00B0 in a circle of radius 9. Arc length?",
    choices: ["$3\\pi$", "$6\\pi$", "$12\\pi$", "$9\\pi$"],
    correct: 1,
    explanation: "$(120/360) \\times 2\\pi(9) = \\frac{1}{3} \\times 18\\pi = 6\\pi$.",
    difficulty: "medium" as const,
    type: "Geometry",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Arc length formula",
    },
  {
    stem: "Data set: {2, 5, 5, 7, 8, 9, 12, 42}. Which is true?",
    choices: ["Mean < Median", "Mean = Median", "Mean > Median", "Cannot determine"],
    correct: 2,
    explanation:
      "Outlier 42 pulls mean up. Mean=11.25, Median=7.5. Mean > Median (skewed right).",
    difficulty: "medium" as const,
    type: "Data Analysis",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Mean vs. median with outlier",
    },
  {
    stem: "The function $f(x) = -2(x - 1)^2 + 8$ has a maximum at:",
    choices: ["(1, \u22128)", "(2, 8)", "(\u22121, 8)", "(1, 8)"],
    correct: 3,
    explanation: "Vertex form: (h,k)=(1,8). Negative a \u2192 opens down \u2192 maximum.",
    difficulty: "easy" as const,
    type: "Advanced Math",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Vertex form maximum",
    },
  {
    stem: "Solve the system: 2x + 3y = 1 and 4x \u2212 y = 9. What is x?",
    choices: ["3", "4", "2", "1"],
    correct: 2,
    explanation:
      "From eq2: y=4x\u22129. Sub: 2x+3(4x\u22129)=1 \u2192 14x\u221227=1 \u2192 x=2.",
    difficulty: "medium" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "System substitution",
    },
  {
    stem: "If $x^2 - 10x + k = 0$ has exactly one solution, what is $k$?",
    choices: ["10", "5", "25", "20"],
    correct: 2,
    explanation: "Discriminant $= 0$: $100-4k=0 \\Rightarrow k=25$.",
    difficulty: "medium" as const,
    type: "Advanced Math",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Discriminant condition",
    },
  {
    stem: "In a two-way table: P(A|B)=0.4, P(A|not B)=0.7. What can we conclude?",
    choices: [
      "A and B are independent",
      "No relationship",
      "A is less likely given B",
      "A is more likely given B"
    ],
    correct: 2,
    explanation:
      "P(A|B)=0.4 < P(A|not B)=0.7. A is less likely when B occurs.",
    difficulty: "medium" as const,
    type: "Data Analysis",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Conditional probability comparison",
    },
  {
    stem: "In triangle ABC, angle C = 90\u00B0, AB = 10, BC = 6. What is tan(A)?",
    choices: ["4/3", "3/4", "3/5", "4/5"],
    correct: 1,
    explanation:
      "$AC=\\sqrt{100-36}=8$. $\\tan(A)=\\text{opposite}/\\text{adjacent}=BC/AC=6/8=3/4$.",
    difficulty: "medium" as const,
    type: "Geometry",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Trigonometric ratio",
    },
  {
    stem: "The function f(x) = 3x + 7. If f(a) = 22, what is f(2a)?",
    choices: ["47", "37", "52", "44"],
    correct: 1,
    explanation: "3a+7=22 \u2192 a=5. f(10)=30+7=37.",
    difficulty: "medium" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Function composition",
    },
  {
    stem: "Which is equivalent to $(2x+3)(x^2-x+4)$?",
    choices: [
      "$2x^3+x^2+5x+7$",
      "$2x^3-x^2+8x+12$",
      "$2x^3-2x^2+11x+12$",
      "$2x^3+x^2+5x+12$"
    ],
    correct: 3,
    explanation:
      "$2x^3-2x^2+8x+3x^2-3x+12 = 2x^3+x^2+5x+12$.",
    difficulty: "medium" as const,
    type: "Advanced Math",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Polynomial multiplication",
    },
  {
    stem: "A researcher wants to study exercise habits of college students. Which gives the most generalizable results?",
    choices: [
      "Interview the football team",
      "Random sample from student directory",
      "Survey gym members",
      "Ask volunteers online"
    ],
    correct: 1,
    explanation: "Random sample from full population \u2192 most generalizable.",
    difficulty: "easy" as const,
    type: "Data Analysis",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Study design",
    },
  {
    stem: "Two concentric circles, radii 5 and 12. A point is random in the larger circle. P(inside the smaller)?",
    choices: ["25/169", "5/17", "5/12", "25/144"],
    correct: 3,
    explanation: "$P=\\pi(25)/\\pi(144) = 25/144$.",
    difficulty: "medium" as const,
    type: "Geometry",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Geometric probability",
    },
  {
    stem: "The line $y = -\\frac{1}{2}x + 4$ is perpendicular to a line with slope:",
    choices: ["$2$", "$-2$", "$-\\frac{1}{2}$", "$\\frac{1}{2}$"],
    correct: 0,
    explanation: "Perpendicular slopes are negative reciprocals. $-\\frac{1}{2} \\Rightarrow 2$.",
    difficulty: "easy" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Perpendicular slopes",
    },
  {
    stem: "If $f(x) = x^2 + 1$ and $g(x) = 2x - 3$, what is $f(g(2))$?",
    choices: ["5", "10", "4", "2"],
    correct: 3,
    explanation: "g(2)=1. f(1)=1+1=2.",
    difficulty: "medium" as const,
    type: "Advanced Math",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Composition of functions",
    },
  {
    stem: "A value increases 25% then the result decreases 20%. Net change?",
    choices: ["\u22125%", "5%", "0%", "\u22121%"],
    correct: 2,
    explanation: "$100 \\rightarrow 125 \\rightarrow 100$. Net: 0%. ($1.25 \\times 0.80 = 1.00$.)",
    difficulty: "medium" as const,
    type: "Data Analysis",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Sequential percent change",
    },
  {
    stem: "sin(30\u00B0) =",
    choices: ["$1$", "$\\frac{\\sqrt{2}}{2}$", "$\\frac{\\sqrt{3}}{2}$", "$\\frac{1}{2}$"],
    correct: 3,
    explanation: "30-60-90: sin(30\u00B0)=opposite/hyp=1/2.",
    difficulty: "easy" as const,
    type: "Geometry",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Special angle value",
    },
  {
    stem: "If |2x + 5| \u2264 9, what is the solution set?",
    choices: ["x \u2264 2", "\u22122 \u2264 x \u2264 7", "x \u2264 \u22127 or x \u2265 2", "\u22127 \u2264 x \u2264 2"],
    correct: 3,
    explanation:
      "\u22129 \u2264 2x+5 \u2264 9 \u2192 \u221214 \u2264 2x \u2264 4 \u2192 \u22127 \u2264 x \u2264 2.",
    difficulty: "medium" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Absolute value inequality",
    },
  {
    stem: "A bacteria population doubles every 3 hours. Starting at 500, the population after t hours is:",
    choices: ["500(2)^(3t)", "500(2)^(t/3)", "500 + 2t/3", "1000t"],
    correct: 1,
    explanation: "Doubles every 3 hrs \u2192 base 2, exponent t/3.",
    difficulty: "medium" as const,
    type: "Advanced Math",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Exponential growth model",
    },
  {
    stem: "A 95% confidence interval for the mean is (42, 58). What is the margin of error?",
    choices: ["8", "4", "16", "50"],
    correct: 0,
    explanation: "MOE = (58\u221242)/2 = 8.",
    difficulty: "easy" as const,
    type: "Data Analysis",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Margin of error from CI",
    },
  {
    stem: "A square has vertices at (0,0), (4,0), (4,4), (0,4). What is the length of its diagonal?",
    choices: ["$8$", "$16$", "$4$", "$4\\sqrt{2}$"],
    correct: 3,
    explanation: "$d=\\sqrt{16+16}=\\sqrt{32}=4\\sqrt{2}$. (45-45-90: leg $\\times \\sqrt{2}$.)",
    difficulty: "easy" as const,
    type: "Geometry",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Diagonal of a square",
    },
  {
    stem: "If f(x) = 2x + 3, for what value of x does f(3x) = f(x) + 10?",
    choices: ["1", "2", "5", "2.5"],
    correct: 3,
    explanation:
      "f(3x)=6x+3. f(x)+10=2x+13. 6x+3=2x+13 \u2192 4x=10 \u2192 x=2.5.",
    difficulty: "hard" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Function equation",
    },
  {
    stem: "Which function has a horizontal asymptote at y = 3?",
    choices: [
      "f(x) = (3x+1)/(x+1)",
      "f(x) = 3x/(x+1)",
      "f(x) = x + 3",
      "f(x) = 3/x"
    ],
    correct: 0,
    explanation:
      "$(3x+1)/(x+1)$: as $x \\to \\infty$, approaches $3x/x=3$. Horizontal asymptote $y=3$.",
    difficulty: "hard" as const,
    type: "Advanced Math",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Horizontal asymptote",
    },
  {
    stem: "Convert: 72 km/hr to m/s.",
    choices: ["12", "720", "20", "72"],
    correct: 2,
    explanation: "$72 \\times 1000/3600 = 72000/3600 = 20$ m/s.",
    difficulty: "medium" as const,
    type: "Data Analysis",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Unit conversion",
    },
  {
    stem: "An inscribed angle intercepts a semicircle. The angle measures:",
    choices: ["$90°$", "$360°$", "$180°$", "$45°$"],
    correct: 0,
    explanation: "Semicircle $= 180°$ arc. Inscribed angle $= \\frac{1}{2}$ arc $= 90°$.",
    difficulty: "easy" as const,
    type: "Geometry",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Inscribed angle theorem",
    },
  {
    stem: "If the graph of $y = ax^2 + bx + c$ opens downward and has vertex $(2, 7)$, which must be true?",
    choices: [
      "a > 0 and c = 7",
      "a > 0 and max value is 7",
      "a < 0 and min value is 7",
      "a < 0 and max value is 7"
    ],
    correct: 3,
    explanation:
      "Opens down \u2192 a < 0. Vertex is maximum when a < 0. Max value = 7.",
    difficulty: "medium" as const,
    type: "Algebra",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Parabola properties",
    },
  {
    stem: "If $\\log_2(x) = 5$, what is $x$?",
    choices: ["$25$", "$16$", "$32$", "$10$"],
    correct: 2,
    explanation: "$2^5 = 32$.",
    difficulty: "easy" as const,
    type: "Advanced Math",
    trap: null,
    trapAnswer: 0,
    trapDesc: "Logarithm definition",
    },
];

/* ── MODULE CONFIG ── */
const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "math",
  moduleNum: 8,
  title: "Practice Test, Error Analysis & Test-Day Prep",
  subtitle:
    "Take a full 44-question practice test under timed conditions, analyze your mistakes, and project your score.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "welcome" },
    { id: "warmup", label: "Warm-Up", icon: "warmup" },
    { id: "checklist-pre", label: "Pre-Test Checklist", icon: "clipboard" },
    { id: "lesson", label: "Lesson", icon: "lesson" },
    { id: "ec-exercise", label: "Error Classification", icon: "zap" },
    { id: "checklist-td", label: "Test Day Checklist", icon: "clipboard" },
    { id: "quiz", label: "Practice Quiz", icon: "quiz" },
    { id: "error-analysis", label: "Error Analysis", icon: "clipboard" },
    { id: "growth-tracker", label: "Growth Tracker", icon: "chart" },
    { id: "complete", label: "Complete", icon: "complete" },
  ],
  warmup: WARMUP,
  quiz: QUIZ,
  lessons: [
    /* ── Slide 1: Pre-Test Checklist ── */
    {
      id: "pre-test-checklist",
      title: "Pre-Test Checklist",
      subtitle: "Before the Test",
      body: [
        "Before starting the practice test, make sure you have: (1) A quiet space with $70$+ minutes uninterrupted. (2) Desmos open in another tab at desmos.com/calculator. (3) Scratch paper and pencils ready. (4) Phone turned off and other tabs closed.",
        "Remember: accuracy over speed in Module 1. Module 1 performance determines whether you get the harder Module 2 (which unlocks the highest scores). Desmos shortcuts you should have memorized: $\\hat{}$ (exponents), $\\_$ (subscripts), $\\sim$ (regression), $|$ (absolute value), sqrt, pi.",
        "The practice test has $44$ questions: Module 1 (Questions $1$--$22$, $35$ minutes) and Module 2 (Questions $23$--$44$, $35$ minutes). Use the two-pass system on each module.",
      ],
    },
    /* ── Slide 2: Practice Test Overview ── */
    {
      id: "practice-test",
      title: "44-Question Practice Test",
      subtitle: "Practice Test",
      visual: "practice-test-overview",
      body: [
        "This practice test covers all four PSAT Math domains: Algebra ($\\sim 35\\%$), Advanced Math ($\\sim 35\\%$), Problem-Solving and Data Analysis ($\\sim 15\\%$), and Geometry and Trigonometry ($\\sim 15\\%$).",
        "Module 1 questions ($1$--$22$) mix all domains at varying difficulty. Module 2 questions ($23$--$44$) also mix all domains. On the real PSAT, Module 2 difficulty adapts based on Module 1 performance.",
        "Strategy reminders: Use the $5$-second decision tree on every question. Plug In when you see variables in choices. Backsolve when choices are numbers. Use Desmos for systems, quadratics, and regression. Ballpark and POE on every question before calculating.",
      ],
    },
    /* ── Slide 3: Score Projection & Error Analysis ── */
    {
      id: "score-analysis",
      title: "Score Projection & Error Analysis",
      subtitle: "Results",
      visual: "score-projector",
      body: [
        "After completing the practice test, your raw score converts to an estimated scaled score ($160$--$760$). For National Merit, the Selection Index = $(2 \\times \\text{RW Score} + \\text{Math Score}) / 10$. Typical Semifinalist cutoffs range from $215$--$222$ depending on state.",
        "Error classification: For each missed question, identify the error type -- Concept Gap (didn't know the math), Careless/Arithmetic (knew it but made a mistake), Misread Problem (answered the wrong question), Ran Out of Time (pacing issue), or Strategy Gap (used the wrong approach).",
        "Priority review: Any domain below $70\\%$ accuracy needs targeted review. Go back to the corresponding module (Algebra = Module 2, Advanced Math = Module 3, Data Analysis = Module 4, Geometry = Module 5). Redo exercises and practice questions -- don't just re-read.",
      ],
    },
    /* ── Slide 4: Formula Reference ── */
    {
      id: "formula-reference",
      title: "Must-Memorize Formula Card",
      subtitle: "Reference",
      visual: "formula-reference",
      body: [
        "Linear: Slope $m = \\frac{y_2 - y_1}{x_2 - x_1}$. Slope-intercept: $y = mx + b$. Point-slope: $y - y_1 = m(x - x_1)$. Parallel lines have equal slopes. Perpendicular slopes are negative reciprocals.",
        "Quadratic: Standard form $ax^2 + bx + c$. Vertex: $x = \\frac{-b}{2a}$. Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. Discriminant: $b^2 - 4ac$ ($> 0$: two solutions, $= 0$: one solution, $< 0$: no real solutions).",
        "Geometry: Pythagorean theorem $a^2 + b^2 = c^2$. Special triangles: $30$-$60$-$90$ ($1 : \\sqrt{3} : 2$), $45$-$45$-$90$ ($1 : 1 : \\sqrt{2}$). SOH-CAH-TOA. Circle: $(x-h)^2 + (y-k)^2 = r^2$. Area of circle: $\\pi r^2$. Volume of cylinder: $\\pi r^2 h$. Cone: $\\frac{1}{3}\\pi r^2 h$. Sphere: $\\frac{4}{3}\\pi r^3$. Arc length: $\\frac{\\theta}{360} \\times 2\\pi r$.",
      ],
    },
    /* ── Slide 5: Test-Day Prep ── */
    {
      id: "test-day-prep",
      title: "Test-Day Checklist & Action Plan",
      subtitle: "Test Day",
      visual: "test-day-timeline",
      body: [
        "Night before: Charge your device. Sleep $8$+ hours. Light review only -- flip through formula cards. No new material after $8$ PM. Lay out everything you need. Set two alarms.",
        "Morning of: Eat a real breakfast. Bring a snack. Bring charged device, pencils, approved calculator (backup). The Bluebook app must be installed and updated. Do $3$--$5$ easy warm-up problems before the test starts.",
        "During the test: Module 1 -- two-pass system, flag hard questions, accuracy first. Use Desmos aggressively for systems, quadratics, and statistics. Time check: after $15$ min, be on question $8$+. Last $2$ minutes: answer ALL remaining questions -- no penalty for guessing. Between modules: breathe, stay confident. For National Merit: every Selection Index point matters -- maximize both Math and RW.",
      ],
    },
  ],

  takeaways: [
    "Error analysis shows exactly where to focus your remaining study time.",
    "For National Merit, every Selection Index point matters -- maximize both Math and RW.",
    "Use the two-pass system on every module -- accuracy in Module 1 determines your ceiling.",
    "Desmos is your competitive advantage -- use aggressively for systems, quadratics, and verification.",
    "No penalty for wrong answers -- answer every single question, never leave blanks.",
    "Trust your preparation, execute your strategies, and stay confident.",
  ],
};
