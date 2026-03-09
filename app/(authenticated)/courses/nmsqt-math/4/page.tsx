"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { StatisticsCalculator } from "@/components/course/activities/statistics-calculator";
import {
  RatioFormulasVisual,
  StatisticsVisual,
  ScatterplotVisual,
  TwoWayTableVisual,
  StudyDesignVisual,
  PercentTrapsVisual,
} from "./lesson-visuals";

const RATIO_QS_EXERCISE: FillInItem[] = [
  {
    "prompt": "A store marks up a $40 item by 25%. What is the selling price?",
    "answer": 50,
    "solution": "$40 × 1.25 = $50. Or: 25% of 40 = 10, so 40 + 10 = 50."
  },
  {
    "prompt": "A shirt was $80, now $60. What is the percent decrease?",
    "answer": 25,
    "solution": "(80 − 60)/80 × 100 = 20/80 × 100 = 25%. Remember: divide by the OLD value."
  },
  {
    "prompt": "If 3 workers paint a house in 12 hours, how many hours for 4 workers? (Inverse proportion)",
    "answer": 9,
    "solution": "workers × hours = constant. 3 × 12 = 36. So 4 × $h = 36$, $h = 9$."
  },
  {
    "prompt": "A recipe for 6 servings uses 2 cups of flour. How many cups for 15 servings?",
    "answer": 5,
    "solution": "2/6 = x/15. Cross multiply: $6x = 30$, $x = 5$ cups."
  },
  {
    "prompt": "A car travels 240 miles on 8 gallons. Miles per gallon?",
    "answer": 30,
    "solution": "Unit rate: 240 ÷ 8 = 30 mpg."
  },
  {
    "prompt": "A population grows from 5,000 to 6,500. What is the percent increase?",
    "answer": 30,
    "solution": "(6500 − 5000)/5000 × 100 = 1500/5000 × 100 = 30%."
  }
];

const PCT_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "A price goes up 20%, then down 20%. Is the final price equal to the original?",
    "options": [
      "Depends on the price",
      "No, it's 4% more",
      "Yes, they cancel out",
      "No, it's 4% less"
    ],
    "correct": 3,
    "explanation": "Start $100: +20% = $120. −20% of $120 = $24 off = $96. That's 4% less. The second percent applies to the NEW amount."
  },
  {
    "prompt": "A store advertises \"50% off, then an additional 20% off.\" Is that the same as 70% off?",
    "options": [
      "No, it's only 60% off total",
      "Yes, 50+20=70",
      "No, it's 56% off total",
      "Depends on original price"
    ],
    "correct": 0,
    "explanation": "Start $100: 50% off = $50. Then 20% off $50 = $10 off = $40. Total discount = 60%, not 70%."
  },
  {
    "prompt": "\"Sales increased 200%.\" If original sales were $1,000, what are they now?",
    "options": [
      "$1,200",
      "$2,000",
      "$200,000",
      "$3,000"
    ],
    "correct": 3,
    "explanation": "200% INCREASE means the increase is $2,000. New total = $1,000 + $2,000 = $3,000. A 200% increase triples the original."
  },
  {
    "prompt": "A student got 80% on Test 1 and 90% on Test 2. Is their overall average 85%?",
    "options": [
      "Yes, always",
      "Only if Test 2 was harder",
      "Never",
      "Only if both tests have the same number of questions"
    ],
    "correct": 3,
    "explanation": "Only if tests have equal weight (same number of questions/points). If Test 1 had 50 Qs and Test 2 had 10, the average is much closer to 80%."
  },
  {
    "prompt": "A town's population drops 10% one year, then grows 10% the next. Is it back to the original?",
    "options": [
      "Yes, they cancel out",
      "No, it's 1% more",
      "No, it's 1% less",
      "Depends on the population"
    ],
    "correct": 2,
    "explanation": "Start 1000: −10% = 900. +10% of 900 = 90 = 990. That's 1% less. Successive percent changes NEVER cancel."
  }
];

const TABLE_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "What proportion of ALL students play a sport?",
    "options": [
      "45/200 = 0.225",
      "55/200 = 0.275",
      "100/200 = 0.50",
      "100/80 = 1.25"
    ],
    "correct": 2,
    "explanation": "Total who play sport = 100. Total students = 200. P = 100/200 = 0.50 (50%)."
  },
  {
    "prompt": "What is P(has a job | plays a sport)?",
    "options": [
      "45/200 = 0.225",
      "45/80 = 0.5625",
      "80/200 = 0.40",
      "45/100 = 0.45"
    ],
    "correct": 3,
    "explanation": "Given \"plays a sport\" → denominator is 100 (sport total). Of those, 45 have a job. P = 45/100 = 0.45."
  },
  {
    "prompt": "What is P(plays a sport | has a job)?",
    "options": [
      "45/100 = 0.45",
      "45/200 = 0.225",
      "45/80 = 0.5625",
      "80/100 = 0.80"
    ],
    "correct": 2,
    "explanation": "Given \"has a job\" → denominator is 80 (job total). Of those, 45 play a sport. P = 45/80 = 0.5625. Notice this is DIFFERENT from the previous question!"
  },
  {
    "prompt": "What fraction of non-sport students have a job?",
    "options": [
      "35/100 = 0.35",
      "35/80 = 0.4375",
      "35/200 = 0.175",
      "65/100 = 0.65"
    ],
    "correct": 0,
    "explanation": "Non-sport column total = 100. Of those, 35 have a job. P = 35/100 = 0.35."
  },
  {
    "prompt": "Are \"plays a sport\" and \"has a job\" independent events?",
    "options": [
      "Cannot determine",
      "No — P(job|sport) ≠ P(job)",
      "Yes — the probabilities are equal",
      "Yes — both columns total 100"
    ],
    "correct": 1,
    "explanation": "P(job) = 80/200 = 0.40. P(job|sport) = 45/100 = 0.45. Since 0.40 ≠ 0.45, NOT independent."
  }
];

const MISLEAD_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "\"Our product increased sales by 200%!\" (Sales went from 1 unit to 3 units.)",
    "options": [
      "Small sample — 200% of almost nothing",
      "No issue — the claim is valid",
      "The time period is too short",
      "The percentage is mathematically wrong"
    ],
    "correct": 0,
    "explanation": "200% increase on 1 unit = 3 units. Technically correct, but deeply misleading. A 200% increase sounds impressive but the absolute numbers are tiny."
  },
  {
    "prompt": "\"90% of dentists recommend our toothpaste.\" (Only 10 dentists were surveyed.)",
    "options": [
      "Dentists are biased",
      "Sample size too small to generalize",
      "The percentage is wrong",
      "Survey is valid"
    ],
    "correct": 1,
    "explanation": "9 out of 10 is 90%, but with only 10 dentists the margin of error is enormous. You can't generalize from such a tiny sample."
  },
  {
    "prompt": "\"Students who use our app score 50 points higher on the PSAT.\" (Students self-selected to use the app.)",
    "options": [
      "Sample size issue",
      "The 50-point difference is too small",
      "The app doesn't cover all domains",
      "No random assignment — could be self-selection bias"
    ],
    "correct": 3,
    "explanation": "Students who choose to use a study app are probably already more motivated. Without random assignment, you can't say the app <em>caused</em> the improvement."
  },
  {
    "prompt": "\"The average household income in our town is $180,000.\" (A few billionaires live there.)",
    "options": [
      "Should use median instead of mean",
      "Income data is unreliable",
      "The calculation is wrong",
      "Sample is too small"
    ],
    "correct": 0,
    "explanation": "A few extremely high incomes skew the mean dramatically upward. The median would be much more representative."
  },
  {
    "prompt": "\"Crime has doubled in the past year!\" (Went from 2 incidents to 4 in a town of 50,000.)",
    "options": [
      "Time period is wrong",
      "Crime data is unreliable",
      "The percentage is wrong",
      "Small absolute numbers make % misleading"
    ],
    "correct": 3,
    "explanation": "From 2 to 4 is technically a 100% increase, but in a town of 50,000, these are negligibly small numbers."
  }
];

const STUDY_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Researchers randomly selected 500 adults from a city and found that those who exercised regularly had lower blood pressure.",
    "options": [
      "Association — can generalize to city",
      "Causation — exercise lowers blood pressure",
      "No valid conclusion",
      "Association — cannot generalize"
    ],
    "correct": 0,
    "explanation": "Random sampling → can generalize. No random assignment → association only, not causation."
  },
  {
    "prompt": "100 volunteers were randomly assigned to drink green tea or water daily for 3 months. The tea group showed improved focus.",
    "options": [
      "Causation — can generalize to all adults",
      "Causation — but only for volunteers",
      "Association — cannot generalize",
      "Association — can generalize"
    ],
    "correct": 1,
    "explanation": "Random assignment → causation. But volunteers (not random sample) → can't generalize beyond these participants."
  },
  {
    "prompt": "A researcher surveys students at her school and finds a correlation between screen time and lower grades.",
    "options": [
      "Association — can generalize",
      "Causation — but only for this school",
      "Association — cannot generalize",
      "Causation — screens lower grades"
    ],
    "correct": 2,
    "explanation": "No random assignment → no causation. No random sampling (just one school) → can't generalize."
  },
  {
    "prompt": "A national organization randomly selects 10,000 people and randomly assigns half to take Vitamin D. After 1 year, the supplement group has fewer colds.",
    "options": [
      "Causation — can generalize",
      "Association — cannot generalize",
      "Causation — only for sample",
      "Association — can generalize"
    ],
    "correct": 0,
    "explanation": "Random sampling AND random assignment → causation AND generalizability. This is the gold standard."
  },
  {
    "prompt": "Countries with more chocolate consumption per capita have more Nobel Prize winners.",
    "options": [
      "Correlation — confounding variables likely",
      "Causation — can generalize",
      "Association — can generalize",
      "Causation — chocolate helps"
    ],
    "correct": 0,
    "explanation": "Wealth is a confounding variable — wealthier countries have both more chocolate and more Nobel winners."
  },
  {
    "prompt": "To reduce margin of error from ±5% to ±2.5%, a researcher should:",
    "options": [
      "Increase sample size",
      "Ask more questions",
      "Survey different population",
      "Use different polling method"
    ],
    "correct": 0,
    "explanation": "Larger sample → smaller margin of error. To halve margin of error, quadruple sample size."
  }
];

export default function NMSQTMathModule4() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "ratio-formulas": <RatioFormulasVisual />,
        "statistics": <StatisticsVisual />,
        "scatterplots": <ScatterplotVisual />,
        "two-way-tables": <TwoWayTableVisual />,
        "study-design": <StudyDesignVisual />,
        "percent-traps": <PercentTrapsVisual />,
      }}
      activities={{
        "exercise-ratio-qs": (goNext: () => void) => (
          <FillInExercise
            items={RATIO_QS_EXERCISE}
            title="Ratio & Percent Problems"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-pct-qs": (goNext: () => void) => (
          <MatchingExercise
            items={PCT_QS_EXERCISE}
            title="Percent Trap Spotter"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-table-qs": (goNext: () => void) => (
          <MatchingExercise
            items={TABLE_QS_EXERCISE}
            title="Two-Way Table & Probability"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-mislead-qs": (goNext: () => void) => (
          <MatchingExercise
            items={MISLEAD_QS_EXERCISE}
            title="Spot the Misleading Statistic"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-study-qs": (goNext: () => void) => (
          <MatchingExercise
            items={STUDY_QS_EXERCISE}
            title="Study Design Classifier"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "calculator": (goNext: () => void) => (
          <StatisticsCalculator
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/nmsqt-math/5"
      nextModuleLabel="Module 5: Geometry & Trigonometry"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "math",
  moduleNum: 4,
  title: "Problem-Solving & Data Analysis",
  subtitle:
    "Real-world math: ratios, percentages, statistics, probability, and experimental design. ~15% of the PSAT.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-ratio-qs", label: "Ratio & Percent Problems", icon: "zap" },
    { id: "exercise-pct-qs", label: "Percent Trap Spotter", icon: "zap" },
    { id: "exercise-table-qs", label: "Two-Way Table & Probability", icon: "zap" },
    { id: "exercise-mislead-qs", label: "Spot the Misleading Statistic", icon: "zap" },
    { id: "exercise-study-qs", label: "Study Design Classifier", icon: "zap" },
    { id: "calculator", label: "Calculator", icon: "chart" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "ratio-formulas",
      title: "Ratios, Rates & Proportions",
      subtitle: "Topic 4A",
      visual: "ratio-formulas",
      body: [
        "These are the bread-and-butter PSDA questions. Master the core formulas -- proportion, unit rate, percent change, direct and inverse proportion -- and you can answer most ratio questions in under a minute.",
      ],
    },
    {
      id: "statistics",
      title: "Statistics: Center, Spread & Shape",
      subtitle: "Topic 4B",
      visual: "statistics",
      body: [
        "The PSAT tests whether you understand mean vs. median, how outliers affect each measure, and what distribution shape tells you. Know the relationship: mean > median means right-skewed.",
      ],
    },
    {
      id: "scatterplots",
      title: "Data Interpretation & Scatterplots",
      subtitle: "Topic 4C",
      visual: "scatterplots",
      body: [
        "Scatterplot questions ask you to interpret slope, y-intercept, and correlation in real-world context. Remember: slope is the rate of change, and the y-intercept is the starting value when $x = 0$.",
      ],
    },
    {
      id: "two-way-tables",
      title: "Two-Way Tables & Conditional Probability",
      subtitle: "Topic 4D",
      visual: "two-way-tables",
      body: [
        "The PSAT's favorite probability format. The #1 trap is swapping P(A|B) with P(B|A) -- the denominator changes based on the 'given' condition.",
      ],
    },
    {
      id: "study-design",
      title: "Study Design & Conclusions",
      subtitle: "Topic 4E",
      visual: "study-design",
      body: [
        "These questions test whether a study can establish causation or only association, and whether results generalize. The answer depends entirely on two factors: random sampling and random assignment.",
      ],
    },
    {
      id: "percent-traps",
      title: "Percent Traps & Pitfalls",
      subtitle: "Topic 4F",
      visual: "percent-traps",
      body: [
        "Successive percent changes are the most common PSDA trap. A 10% increase followed by a 10% decrease does NOT return to the original. These visuals show you exactly why.",
      ],
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 3 — Quadratics",
      stem: "What are the three quadratic forms?",
      choices: ["Expanded, Simplified, Reduced", "Standard, Factored, Vertex", "Standard, Slope-Intercept, Point-Slope", "Linear, Quadratic, Cubic"],
      correct: 1,
      explanation: "The three forms are Standard ($ax^2+bx+c$), Factored ($a(x-r)(x-s)$), and Vertex ($a(x-h)^2+k$).",
    },
    {
      source: "Module 3 — Discriminant",
      stem: "If the discriminant $b^2-4ac$ is negative, how many real solutions does the quadratic have?",
      choices: ["Zero", "Cannot determine", "One", "Two"],
      correct: 0,
      explanation: "Negative discriminant means no real solutions — the parabola doesn't cross the x-axis.",
    },
    {
      source: "Module 3 — Vertex",
      stem: "For $f(x) = 2x^2 - 8x + 3$, the x-coordinate of the vertex is:",
      choices: ["x = 8", "x = −2", "x = 2", "x = 4"],
      correct: 2,
      explanation: "Vertex $x = −b/2a$ = −(−8)/2(2) = 8/4 = 2.",
    },
    {
      source: "Module 3 — Exponents",
      stem: "What is 8^(2/3)?",
      choices: ["2", "6", "16", "4"],
      correct: 3,
      explanation: "$8^{2/3} = (\\sqrt[3]{8})^2 = 2^2 = 4$. Take the cube root first, then square.",
    },
    {
      source: "Module 3 — Growth/Decay",
      stem: "A function $f(x) = 500(0.92)^x$ represents:",
      choices: ["Linear growth", "Exponential growth", "Exponential decay", "Linear decay"],
      correct: 2,
      explanation: "The base 0.92 is between 0 and 1, so this is exponential decay (losing 8% per period).",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "If 40% of 250 students passed an exam, how many students passed?",
      choices: ["80", "160", "40", "100"],
      correct: 3,
      explanation: "40% of 250 = 0.40 × 250 = 100 students.",
      trapAnswer: 0,
      trapDesc: "Confused the percent with the count",
    },
    {
      stem: "Data set: 3, 5, 7, 9, 11. What is the mean?",
      choices: ["7", "35", "5", "9"],
      correct: 0,
      explanation: "Mean = (3+5+7+9+11)/5 = 35/5 = 7.",
      trap: "wrong_target",
      trapAnswer: 3,
      trapDesc: "Gave the sum instead of the mean — The Wrong Target",
    },
    {
      stem: "A bag contains 4 red, 6 blue, and 10 green marbles. What is the probability of drawing a blue marble?",
      choices: ["6/20 = 0.30", "6/4 = 1.50", "6/10 = 0.60", "6/16 = 0.375"],
      correct: 0,
      explanation: "Total marbles = 4+6+10 = 20. P(blue) = 6/20 = 0.30.",
      trap: "wrong_target",
      trapAnswer: 3,
      trapDesc: "Used wrong total (forgot one color) — The Wrong Target",
    },
    {
      stem: "A jacket costs $120 after a 20% discount. What was the original price?",
      choices: ["$140", "$144", "$150", "$96"],
      correct: 2,
      explanation: "After 20% off, you pay 80%. So 0.80 × original = 120 → original = $150.",
      trap: "percent_spiral",
      trapAnswer: 2,
      trapDesc: "Added 20% to sale price instead of dividing — Percent Spiral",
    },
    {
      stem: "A scatterplot shows the line of best fit: <code>y = 2.5x + 15</code>, where $x = hours$ studied and $y = test$ score. What does 2.5 represent?",
      choices: ["The predicted score increase per hour", "The score when $x = 0$", "The total hours studied", "The minimum score"],
      correct: 0,
      explanation: "Slope = rate of change. Each additional hour predicts a 2.5-point score increase.",
      trapAnswer: 1,
      trapDesc: "Confused slope with y-intercept",
    },
    {
      stem: "A data set has mean 50 and median 45. The distribution is most likely:",
      choices: ["Symmetric", "Bimodal", "Skewed right", "Skewed left"],
      correct: 2,
      explanation: "Mean > Median → skewed right. High values pull the mean above the median.",
      trap: "conditional_swap",
      trapAnswer: 1,
      trapDesc: "Reversed the skew direction — Conditional Swap on mean vs median",
    },
    {
      stem: "A store raises prices 10%, then offers a 10% discount. Compared to the original, the final price is:",
      choices: ["1% less", "The same", "10% less", "1% more"],
      correct: 0,
      explanation: "Start $100 → +10% = $110 → −10% of $110 = $99. That's 1% less.",
      trap: "percent_spiral",
      trapAnswer: 0,
      trapDesc: "Assumed successive percent changes cancel — The Percent Spiral",
    },
    {
      stem: "A two-way table shows P(A|B) = 0.6 and P(A) = 0.4. Events A and B are:",
      choices: ["Mutually exclusive", "Complementary", "Not independent", "Independent"],
      correct: 2,
      explanation: "If independent, P(A|B) would equal P(A). Since 0.6 ≠ 0.4, they are NOT independent.",
      trap: "conditional_swap",
      trapAnswer: 0,
      trapDesc: "Assumed conditional equals marginal — The Conditional Swap",
    },
  ],

  takeaways: [
    "Percent change = (new - old) / old x 100. The OLD value is always the denominator.",
    "Mean is sensitive to outliers; median is resistant. The PSAT tests this constantly.",
    "On scatterplots, slope = rate of change in context. Y-intercept = starting value.",
    "Conditional probability: P(A|B) = (A and B) / (total B). The denominator changes based on the 'given.'",
    "Only experiments with random assignment can establish causation. Everything else is correlation.",
    "Larger sample size leads to smaller margin of error.",
    "A 10% increase followed by a 10% decrease does NOT return to the original -- it is 1% less.",
  ],
};
