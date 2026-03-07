"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { InteractiveChecklist } from "@/components/course/activities/interactive-checklist";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import { GrowthTracker } from "@/components/course/activities/growth-tracker";
import {
  PreTestProtocolVisual,
  StrategyReviewVisual,
  ErrorAnalysisVisual,
  FormulaReferenceVisual,
  GrowthProjectionVisual,
} from "./lesson-visuals";

export default function PSAT89MathModule8() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref={undefined}
      nextModuleLabel={undefined}
      visuals={{
        "pre-test-protocol": <PreTestProtocolVisual />,
        "test-taking-strategy": <StrategyReviewVisual />,
        "error-analysis-method": <ErrorAnalysisVisual />,
        "formula-reference": <FormulaReferenceVisual />,
        "growth-and-next-steps": <GrowthProjectionVisual />,
      }}
      activities={{
        "checklist-pre": (goNext: () => void) => (
          <InteractiveChecklist
            title="Pre-Test Checklist"
            items={PRE_TEST_CHECKLIST}
            accentColor={MODULE_CONFIG.accentColor}
            requireAll
            onComplete={goNext}
          />
        ),
        "checklist-td": (goNext: () => void) => (
          <InteractiveChecklist
            title="PSAT 8/9 Test-Day Checklist"
            items={TEST_DAY_CHECKLIST}
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "error-analysis": (goNext: () => void) => (
          <ErrorAnalysisWorksheet
            domains={["Algebra", "Advanced Math", "Problem-Solving & Data", "Geometry"]}
            testLabel="PSAT 8/9 Math"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "growth-tracker": (goNext: () => void) => (
          <GrowthTracker
            testType="psat89"
            section="math"
            totalQuestions={44}
            accentColor={MODULE_CONFIG.accentColor}
            domainModules={{"Algebra": "Module 2", "Advanced Math": "Module 3", "Problem-Solving & Data": "Module 4", "Geometry": "Module 5"}}
            onComplete={goNext}
          />
        ),
      }}
    />
  );
}

const PRE_TEST_CHECKLIST = [
  "Find a quiet space with 70+ minutes of uninterrupted time.",
  "Have scratch paper and pencils ready.",
  "Open desmos.com/calculator in another tab (to simulate the test calculator).",
  "Turn off your phone and close other tabs.",
  "Set a timer for 35 minutes for Module 1.",
  "Remember: accuracy over speed in Module 1. Double-check everything.",
];

const TEST_DAY_CHECKLIST = [
  "Night before: Charge your school Chromebook/laptop. Get 8+ hours of sleep.",
  "Morning: Eat a real breakfast. Bring a snack for the break.",
  "Bring: Charged device, pencils (for scratch work), approved calculator (backup only).",
  "The Bluebook app must be installed and updated before test day.",
  "Module 1 strategy: Two-pass system. Flag hard questions. Prioritize accuracy.",
  "Desmos: Use it aggressively for systems, quadratics, and statistics.",
  "Time check: After 15 minutes, you should be on question 8+. Adjust pace if needed.",
  "Last 2 minutes: Answer ALL remaining questions. No penalty for guessing.",
  "Between modules: Take a breath. Module 2 difficulty depends on Module 1 — stay confident either way.",
  "After the test: Scores come in 2\u20134 weeks. Use your score report to plan PSAT 10 prep.",
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "math",
  moduleNum: 8,
  title: "Practice Test & Final Review",
  subtitle: "Full math section with error analysis",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "welcome" },
    { id: "warmup", label: "Warm-Up", icon: "warmup" },
    { id: "checklist-pre", label: "Pre-Test Checklist", icon: "clipboard" },
    { id: "lesson", label: "Lesson", icon: "lesson" },
    { id: "checklist-td", label: "Test Day Checklist", icon: "clipboard" },
    { id: "quiz", label: "Practice", icon: "quiz" },
    { id: "error-analysis", label: "Error Analysis", icon: "clipboard" },
    { id: "growth-tracker", label: "Growth Tracker", icon: "chart" },
    { id: "complete", label: "Complete", icon: "complete" },
  ],
  warmup: [
    {
      source: "Module 7 — Decision Tree",
      stem: "Variables appear in all 4 answer choices. What strategy should you use?",
      choices: ["Plug In (PIYON)", "Direct Solve", "Backsolve", "Desmos"],
      correct: 0,
      explanation:
        "Variables in answer choices → Plug In Your Own Numbers. Choose simple values, find a target, then test each choice.",
    },
    {
      source: "Module 7 — Backsolve",
      stem: "Answer choices are 4 specific numbers. You should start testing which choice?",
      choices: [
        "A (smallest)",
        "Random",
        "D (largest)",
        "B or C (middle)"
      ],
      correct: 3,
      explanation:
        "Start with B or C — middle values let you adjust up or down. If B works, you're done. If too big, try A. If too small, try D.",
    },
    {
      source: "Module 7 — Time Management",
      stem: "You've spent 2 minutes on a question and aren't close to an answer. What should you do?",
      choices: [
        "Flag it and move on",
        "Skip it permanently",
        "Keep trying — you're close",
        "Ask the proctor"
      ],
      correct: 0,
      explanation:
        "The 2-minute rule: if you're stuck, flag it and come back in Pass 2. Don't waste time when other easier questions await.",
    },
    {
      source: "Module 7 — Grid-In",
      stem: "For a student-produced response (SPR), how should you enter $3\\frac{1}{2}$?",
      choices: ["$3\\ 1/2$", "$3½$", "$3.5$ or $7/2$", "$3 + 1/2$"],
      correct: 2,
      explanation:
        "No mixed numbers allowed in SPR. Enter as $3.5$ or $7/2$. Never type $3\\ 1/2$ — it will be read as $31/2$.",
    },
    {
      source: "Module 7 — Misread Traps",
      stem: "A question asks \"What is $3x + 2$?\" and you solve for $x = 4$. What trap did you fall into?",
      choices: [
        "Solved for wrong variable",
        "Arithmetic error",
        "Used wrong formula",
        "Misread the graph"
      ],
      correct: 0,
      explanation:
        "The #1 trap: solving for $x$ when the question asks for an expression involving $x$. Always re-read what they're asking for BEFORE solving.",
    },
  ],
  lessons: [
    {
      id: "pre-test-protocol",
      title: "Pre-Test Protocol",
      subtitle: "Topic 8A",
      visual: "pre-test-protocol",
      body: [
        "Take the practice test under timed conditions. This is your benchmark — compare it to your Module 1 diagnostic to measure growth.",
      ],
    },
    {
      id: "test-taking-strategy",
      title: "Test-Taking Strategy Review",
      subtitle: "Topic 8B",
      visual: "test-taking-strategy",
      body: [
        "Tap each card to review the strategy details. These are the four pillars of your test-day toolkit.",
      ],
    },
    {
      id: "error-analysis-method",
      title: "Error Analysis Method",
      subtitle: "Topic 8C",
      visual: "error-analysis-method",
      body: [
        "Classify every wrong answer into one of four error types. Each type has a different fix.",
      ],
    },
    {
      id: "formula-reference",
      title: "Must-Know Formula Reference",
      subtitle: "Topic 8D",
      visual: "formula-reference",
      body: [
        "These 16 formulas cover every geometry and algebra formula you need. Review any you don't have memorized.",
      ],
    },
    {
      id: "growth-and-next-steps",
      title: "Growth Plan & Next Steps",
      subtitle: "Topic 8E",
      visual: "growth-and-next-steps",
      body: [
        "Compare your practice test score to your diagnostic. Every point you gain now carries forward to PSAT 10 and SAT.",
      ],
    },
  ],
  quiz: [
    // MODULE 1 (Questions 1–22)
    {
      stem: "Solve: $3x + 7 = 22$",
      choices: ["3", "5", "4", "6"],
      correct: 1,
      explanation: "$3x = 15$, $x = 5$.",
      difficulty: "easy",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "What is the mean of 8, 12, 15, 19, 26?",
      choices: ["16", "15", "12", "19"],
      correct: 0,
      explanation: "Sum $= 80$, $80/5 = 16$.",
      difficulty: "easy",
      type: "P",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A right triangle has legs 9 and 12. What is the hypotenuse?",
      choices: ["18", "15", "21", "13"],
      correct: 1,
      explanation:
        "$9^2 + 12^2 = 81 + 144 = 225$, $\\sqrt{225} = 15$. (3-4-5 triple $\\times 3$.)",
      difficulty: "easy",
      type: "G",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "What is the slope of $y = -3x + 8$?",
      choices: ["$-3$", "3", "$-8$", "8"],
      correct: 0,
      explanation: "$y = mx + b$ form. Slope $m = -3$.",
      difficulty: "easy",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "What is $x^0$ when $x = 7$?",
      choices: ["7", "0", "1", "49"],
      correct: 2,
      explanation: "Any nonzero number to the 0 power $= 1$.",
      difficulty: "easy",
      type: "AM",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A shirt costs \\$40 and is 25% off. Sale price?",
      choices: ["\\$30", "\\$15", "\\$10", "\\$35"],
      correct: 0,
      explanation: "25% of 40 $= 10$. Sale: $40 - 10 =$ \\$30.",
      difficulty: "easy",
      type: "P",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Which is the solution to $2(x - 3) = 4x + 2$?",
      choices: ["$-2$", "4", "2", "$-4$"],
      correct: 3,
      explanation: "$2x - 6 = 4x + 2$. $-8 = 2x$. $x = -4$.",
      difficulty: "medium",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Area of a circle with radius 6?",
      choices: ["$12\\pi$", "$24\\pi$", "$36\\pi$", "$72\\pi$"],
      correct: 2,
      explanation: "$A = \\pi r^2 = 36\\pi$.",
      difficulty: "easy",
      type: "G",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "In a class of 30, the ratio of boys to girls is 2:3. How many girls?",
      choices: ["15", "20", "18", "12"],
      correct: 2,
      explanation:
        "$2 + 3 = 5$ parts. Girls $= 3/5 \\times 30 = 18$.",
      difficulty: "medium",
      type: "P",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Factor: $x^2 - 9$",
      choices: [
        "$(x - 9)(x + 1)$",
        "$(x - 3)^2$",
        "$(x - 3)(x + 3)$",
        "$x(x - 9)$"
      ],
      correct: 2,
      explanation:
        "Difference of squares: $a^2 - b^2 = (a - b)(a + b)$.",
      difficulty: "medium",
      type: "AM",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "The line $y = 2x + 5$ passes through which point?",
      choices: ["$(0, 2)$", "$(2, 8)$", "$(1, 6)$", "$(1, 7)$"],
      correct: 3,
      explanation: "$x = 1$: $y = 2(1) + 5 = 7$. Point $(1, 7)$.",
      difficulty: "easy",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A triangle has angles $55°$ and $75°$. Third angle?",
      choices: ["$55°$", "$60°$", "$50°$", "$40°$"],
      correct: 2,
      explanation: "$180° - 55° - 75° = 50°$.",
      difficulty: "easy",
      type: "G",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A survey of 200 finds 52% support a new rule. Margin of error $\\pm 4$%. Best interpretation?",
      choices: [
        "Exactly 52% of all support it",
        "Between 48% and 56% likely support it",
        "The survey is unreliable",
        "More than half definitely support it"
      ],
      correct: 1,
      explanation: "$52 \\pm 4$ → 48% to 56%.",
      difficulty: "medium",
      type: "P",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If $f(x) = x^2 - 4x + 3$, what is $f(1)$?",
      choices: ["1", "$-2$", "8", "0"],
      correct: 3,
      explanation: "$1 - 4 + 3 = 0$.",
      difficulty: "medium",
      type: "AM",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Which system has no solution?<br/>I: $y = 2x + 1$, $y = 2x + 5$<br/>II: $y = 2x + 1$, $y = -x + 4$",
      choices: ["Neither", "Both", "II only", "I only"],
      correct: 3,
      explanation:
        "Same slope, different intercepts $=$ parallel $=$ no solution. System I.",
      difficulty: "medium",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Volume of a cylinder with radius 4 and height 10?",
      choices: ["$40\\pi$", "$80\\pi$", "$320\\pi$", "$160\\pi$"],
      correct: 3,
      explanation: "$V = \\pi r^2 h = \\pi(16)(10) = 160\\pi$.",
      difficulty: "medium",
      type: "G",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Students who eat breakfast scored higher on tests. Valid conclusion?",
      choices: [
        "Students should skip lunch",
        "No relationship exists",
        "Breakfast causes higher scores",
        "Breakfast is associated with higher scores"
      ],
      correct: 3,
      explanation:
        "Observational → association only, not causation.",
      difficulty: "medium",
      type: "P",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Simplify: $x^3 \\cdot x^2$",
      choices: ["$x^5$", "$2x^5$", "$x^9$", "$x^6$"],
      correct: 0,
      explanation: "Product rule: add exponents. $3 + 2 = 5$.",
      difficulty: "easy",
      type: "AM",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Solve for $x$: $|x - 5| = 3$. How many solutions?",
      choices: ["2", "3", "1", "0"],
      correct: 0,
      explanation:
        "$x - 5 = 3 \\Rightarrow x = 8$ or $x - 5 = -3 \\Rightarrow x = 2$. Two solutions.",
      difficulty: "medium",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "In a 45-45-90 triangle, each leg is 8. Hypotenuse?",
      choices: ["16", "8", "$16\\sqrt{2}$", "$8\\sqrt{2}$"],
      correct: 3,
      explanation:
        "45-45-90: hyp $=$ leg $\\times \\sqrt{2} = 8\\sqrt{2}$.",
      difficulty: "medium",
      type: "G",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A population grows from 500 to 650. Percent increase?",
      choices: ["15%", "23%", "30%", "65%"],
      correct: 2,
      explanation: "$(650 - 500)/500 \\times 100 = 30$%.",
      difficulty: "medium",
      type: "P",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "The vertex of $y = x^2 - 6x + 5$ is at $x = $?",
      choices: ["5", "3", "$-3$", "$-1$"],
      correct: 1,
      explanation: "$x = -b/2a = 6/2 = 3$.",
      difficulty: "medium",
      type: "AM",
      domain: "Algebra",
      skill: "linear_equations",
    },
    // MODULE 2 (Questions 23–44)
    {
      stem: "If $4x + 3y = 24$ and $x = 3$, what is $y$?",
      choices: ["4", "3", "5", "2"],
      correct: 0,
      explanation: "$12 + 3y = 24$, $3y = 12$, $y = 4$.",
      difficulty: "medium",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Which equation has exactly one real solution?<br/>$ax^2 + bx + c = 0$ when:",
      choices: [
        "$b^2 - 4ac < 0$",
        "$a = 0$",
        "$b^2 - 4ac > 0$",
        "$b^2 - 4ac = 0$"
      ],
      correct: 3,
      explanation: "Discriminant $= 0$ → one repeated root.",
      difficulty: "medium",
      type: "AM",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Data: 5, 8, 10, 12, 65. Which measure is MOST affected by the outlier?",
      choices: ["Mode", "Mean", "Range is unchanged", "Median"],
      correct: 1,
      explanation:
        "Mean is pulled up by 65. Median barely changes.",
      difficulty: "medium",
      type: "P",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "The equation $(x + 2)^2 + (y - 3)^2 = 49$. Center and radius?",
      choices: [
        "$(-2, 3)$, $r = 7$",
        "$(2, -3)$, $r = 7$",
        "$(2, 3)$, $r = 7$",
        "$(-2, 3)$, $r = 49$"
      ],
      correct: 0,
      explanation:
        "$(x - (-2)) \\Rightarrow h = -2$, $(y - 3) \\Rightarrow k = 3$. $r = \\sqrt{49} = 7$.",
      difficulty: "medium",
      type: "G",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A line passes through $(2, 5)$ and $(6, 13)$. What is the slope?",
      choices: ["4", "8", "2", "$1/2$"],
      correct: 2,
      explanation: "$m = (13 - 5)/(6 - 2) = 8/4 = 2$.",
      difficulty: "medium",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Factor: $2x^2 + 5x - 3$",
      choices: [
        "$(2x + 1)(x - 3)$",
        "$(2x + 3)(x - 1)$",
        "$(2x - 3)(x + 1)$",
        "$(2x - 1)(x + 3)$"
      ],
      correct: 3,
      explanation:
        "$(2x - 1)(x + 3) = 2x^2 + 6x - x - 3 = 2x^2 + 5x - 3$.",
      difficulty: "hard",
      type: "AM",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "$P(\\text{Math} | \\text{10th grade})$ using: 10th + Math $= 35$, 10th total $= 75$.",
      choices: ["$35/75$", "$35/150$", "$75/150$", "$35/80$"],
      correct: 0,
      explanation:
        "Restrict to 10th (75). Of those, 35 prefer Math. $P = 35/75$.",
      difficulty: "hard",
      type: "P",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A $90°$ sector of a circle with radius 10. Sector area?",
      choices: ["$10\\pi$", "$50\\pi$", "$25\\pi$", "$100\\pi$"],
      correct: 2,
      explanation:
        "$(90/360) \\times \\pi(100) = \\frac{1}{4}(100\\pi) = 25\\pi$.",
      difficulty: "medium",
      type: "G",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If $3x - 2y = 12$ and $x + 2y = 8$, what is $x$?",
      choices: ["3", "5", "4", "6"],
      correct: 1,
      explanation: "Add equations: $4x = 20$, $x = 5$.",
      difficulty: "medium",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If $f(x) = 3(2)^x$, what is $f(3)$?",
      choices: ["12", "18", "27", "24"],
      correct: 3,
      explanation: "$f(3) = 3(2^3) = 3(8) = 24$.",
      difficulty: "medium",
      type: "AM",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A price increases 10% then decreases 10%. Compared to original:",
      choices: ["1% less", "Same price", "1% more", "2% less"],
      correct: 0,
      explanation:
        "\\$100 → \\$110 → \\$99. 1% less. Successive percents trap.",
      difficulty: "hard",
      type: "P",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Distance from $(1, 2)$ to $(4, 6)$?",
      choices: ["4", "7", "5", "$\\sqrt{7}$"],
      correct: 2,
      explanation:
        "$\\sqrt{9 + 16} = \\sqrt{25} = 5$. (3-4-5 triple!)",
      difficulty: "medium",
      type: "G",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Which inequality: \"No more than 50 students can attend\"?",
      choices: ["$s \\geq 50$", "$s < 50$", "$s \\leq 50$", "$s > 50$"],
      correct: 2,
      explanation: "\"No more than\" $=$ at most $= \\leq$.",
      difficulty: "medium",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "The graph of $y = (x - 2)^2 + 3$ is the graph of $y = x^2$ shifted:",
      choices: [
        "Right 2, up 3",
        "Left 2, down 3",
        "Left 2, up 3",
        "Right 2, down 3"
      ],
      correct: 0,
      explanation:
        "$(x - h)$ → right $h$, $+k$ → up $k$. Right 2, up 3.",
      difficulty: "medium",
      type: "AM",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "An experiment randomly assigns 100 patients to drug or placebo. Can it show causation?",
      choices: [
        "No, only correlation",
        "Only if double-blind",
        "Only with 1000+ participants",
        "Yes, random assignment allows causal claims"
      ],
      correct: 3,
      explanation:
        "Random assignment → experiment → CAN establish cause.",
      difficulty: "hard",
      type: "P",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "A square with diagonal 10. Area?",
      choices: ["50", "25", "$25\\sqrt{2}$", "100"],
      correct: 0,
      explanation:
        "$A = \\frac{1}{2}d^2 = \\frac{1}{2}(100) = 50$.",
      difficulty: "hard",
      type: "G",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If $4(x + 2) = 2(3x - 1) + 6$, what is $x$?",
      choices: ["3", "4", "2", "1"],
      correct: 2,
      explanation:
        "$4x + 8 = 6x - 2 + 6 = 6x + 4$. So $-2x = -4$, $x = 2$.",
      difficulty: "medium",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Which function shows exponential DECAY?",
      choices: [
        "$f(x) = 3(0.8)^x$",
        "$f(x) = 3x + 2$",
        "$f(x) = 3x^2$",
        "$f(x) = 3(1.2)^x$"
      ],
      correct: 0,
      explanation:
        "Base $0.8 < 1$ → decay. Base $> 1$ → growth. Linear and quadratic are not exponential.",
      difficulty: "medium",
      type: "AM",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Convert: 90 km/hr to m/min.",
      choices: ["54000", "1500", "5400", "900"],
      correct: 1,
      explanation:
        "$90$ km/hr $\\times 1000$ m/km $\\times 1$ hr/$60$ min $= 1500$ m/min.",
      difficulty: "hard",
      type: "P",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "Inscribed angle intercepts a $120°$ arc. Angle measure?",
      choices: ["$240°$", "$60°$", "$30°$", "$120°$"],
      correct: 1,
      explanation:
        "Inscribed angle $=$ half the arc $= 60°$.",
      difficulty: "medium",
      type: "G",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "$f(x) = 2x + 3$ and $g(x) = x - 1$. What is $f(g(2))$?",
      choices: ["3", "7", "5", "9"],
      correct: 2,
      explanation: "$g(2) = 1$. $f(1) = 2(1) + 3 = 5$.",
      difficulty: "hard",
      type: "A",
      domain: "Algebra",
      skill: "linear_equations",
    },
    {
      stem: "If $x^2 + bx + 12 = 0$ has solutions $x = 3$ and $x = 4$, what is $b$?",
      choices: ["$-7$", "1", "$-12$", "7"],
      correct: 0,
      explanation:
        "$(x - 3)(x - 4) = x^2 - 7x + 12$. So $b = -7$.",
      difficulty: "hard",
      type: "AM",
      domain: "Algebra",
      skill: "linear_equations",
    },
  ],
  takeaways: [
    "You completed all 8 modules covering every PSAT 8/9 math domain.",
    "Algebra, Advanced Math, Data Analysis, and Geometry -- all covered.",
    "You learned 5 key strategies: Direct Solve, PIYON, Backsolve, Desmos, Ballpark.",
    "Named traps help you avoid the most common mistakes.",
    "Confidence tracking shows you where to focus your review.",
    "The two-pass system and 5-second decision tree maximize your score.",
    "Every point you gain now carries forward to PSAT 10 and SAT.",
  ],
};
