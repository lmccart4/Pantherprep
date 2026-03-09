"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { StatisticsCalculator } from "@/components/course/activities/statistics-calculator";
import {
  RatiosVisual,
  PercentsVisual,
  StatisticsVisual,
  TwoWayTableVisual,
  ScatterplotVisual,
  StudyDesignVisual,
  PSDATrapVisual,
} from "./lesson-visuals";

const RAT_EXERCISE: FillInItem[] = [
  {
    "prompt": "A recipe needs 3 cups of flour for every 2 cups of sugar. If you use 9 cups of flour, how many cups of sugar?",
    "answer": 6,
    "solution": "3/2 = $9/x$ → $3x = 18$ → $x = 6$.",
    "tier": 1
  },
  {
    "prompt": "A car travels 180 miles in 3 hours. What is its speed in miles per hour?",
    "answer": 60,
    "solution": "180 ÷ 3 = 60 mph.",
    "tier": 1
  },
  {
    "prompt": "Convert 5 hours to minutes.",
    "answer": 300,
    "solution": "5 × 60 = 300 minutes.",
    "tier": 1
  },
  {
    "prompt": "A shirt costs $40 and is 25% off. What is the sale price?",
    "answer": 30,
    "solution": "$40 × 0.75 = $30. Or: 25% of $40 = $10 off.",
    "tier": 1
  },
  {
    "prompt": "A population grows from 200 to 250. What is the percent increase?",
    "answer": 25,
    "solution": "(250−200)/200 × 100 = 25%.",
    "tier": 2
  },
  {
    "prompt": "If 40% of a number is 28, what is the number?",
    "answer": 70,
    "solution": "0.40n = 28 → $n = 70$.",
    "tier": 2
  },
  {
    "prompt": "A store raises prices 10%, then raises again by 10%. A shirt was originally $50. What is the final price?",
    "answer": 60.5,
    "solution": "$50 × 1.10 = $55. Then $55 × 1.10 = $60.50. NOT $50 × 1.20!",
    "tier": 2
  },
  {
    "prompt": "Convert 88 feet per second to miles per hour. (5280 ft = 1 mi, 3600 sec = 1 hr)",
    "answer": 60,
    "solution": "88 × 3600/5280 = 88 × 0.6818 = 60 mph.",
    "tier": 3
  }
];

const PCT_EXERCISE: MatchingItem[] = [
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
    "explanation": "Only if tests have equal weight (same number of questions/points). If Test 1 had 50 questions and Test 2 had 10, the average would be much closer to 80%."
  }
];

const PRB_EXERCISE: MatchingItem[] = [
  {
    "prompt": "What is P(prefers Math)?",
    "options": [
      "80/150",
      "45/75",
      "35/75",
      "45/150"
    ],
    "correct": 0,
    "explanation": "Total who prefer Math = 80. Total = 150. P = 80/150 ≈ 0.533."
  },
  {
    "prompt": "What is P(9th grader AND prefers Science)?",
    "options": [
      "70/150",
      "30/150",
      "30/70",
      "30/75"
    ],
    "correct": 1,
    "explanation": "9th + Science = 30. Total = 150. P = 30/150 = 1/5."
  },
  {
    "prompt": "What is P(prefers Math | 10th grader)?",
    "options": [
      "80/150",
      "35/75",
      "35/150",
      "35/80"
    ],
    "correct": 1,
    "explanation": "Restrict to 10th graders (75). Of those, 35 prefer Math. P = 35/75."
  },
  {
    "prompt": "What is P(9th grader | prefers Science)?",
    "options": [
      "30/75",
      "30/150",
      "75/150",
      "30/70"
    ],
    "correct": 3,
    "explanation": "Restrict to Science-preferrers (70). Of those, 30 are 9th grade. P = 30/70."
  },
  {
    "prompt": "Is a 10th grader more likely to prefer Science than a 9th grader?",
    "options": [
      "Yes: 40/75 > 30/75",
      "Equal likelihood",
      "No: 30/75 > 40/75",
      "Cannot determine"
    ],
    "correct": 0,
    "explanation": "10th: 40/75 ≈ 53% prefer Science. 9th: 30/75 = 40%. So yes, 10th graders prefer Science more."
  }
];

const MIS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "A news article says: \"Students who drink coffee score 15% higher on tests\" and recommends coffee before exams.",
    "options": [
      "No issue",
      "Data is fabricated",
      "Sample too small",
      "Correlation treated as causation"
    ],
    "correct": 3,
    "explanation": "Observational finding. Coffee drinkers may differ in other ways. Only an experiment could show causation."
  },
  {
    "prompt": "A survey of 50 math club members found 90% enjoy math. The paper reports: \"90% of students enjoy math.\"",
    "options": [
      "Biased (non-random) sample",
      "Wrong percentage",
      "Margin of error too small",
      "Too many participants"
    ],
    "correct": 0,
    "explanation": "Math club members aren't representative of all students. Biased sample → can't generalize."
  },
  {
    "prompt": "Average salary at a company is $95,000. A new hire expects ~$95K. But 90% earn $50K–$70K while the CEO earns $2M.",
    "options": [
      "Sample too small",
      "Median is wrong",
      "Mean pulled by outlier",
      "Data is outdated"
    ],
    "correct": 2,
    "explanation": "The CEO's salary (outlier) pulls the mean way up. Median salary would be ~$60K — much more representative."
  },
  {
    "prompt": "A study of 25 people found a supplement improved memory by 3%. Researchers call it \"a breakthrough.\"",
    "options": [
      "Sample too small for reliable conclusions",
      "Study is well-designed",
      "Should use median",
      "Effect is too large"
    ],
    "correct": 0,
    "explanation": "25 participants is too few. A 3% difference could easily be random variation. Need a much larger sample."
  }
];

const STD_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Researchers randomly assign 100 patients to a new drug or placebo, then measure blood pressure after 8 weeks.",
    "options": [
      "Observational",
      "Survey",
      "Experiment"
    ],
    "correct": 2,
    "explanation": "Random assignment → experiment → CAN establish causation."
  },
  {
    "prompt": "A university surveys 500 randomly selected alumni about career satisfaction.",
    "options": [
      "Experiment",
      "Observational",
      "Survey"
    ],
    "correct": 2,
    "explanation": "Just asking questions → survey. Random selection → results generalize to all alumni."
  },
  {
    "prompt": "Researchers track 1,000 people for 10 years, recording exercise habits and heart disease rates.",
    "options": [
      "Observational",
      "Experiment",
      "Survey"
    ],
    "correct": 0,
    "explanation": "No intervention → observational. Can show correlation but NOT causation."
  },
  {
    "prompt": "A teacher puts half the class in quiet rooms and half in noisy rooms, then compares test scores.",
    "options": [
      "Observational",
      "Survey",
      "Experiment"
    ],
    "correct": 2,
    "explanation": "Assigned conditions → experiment. Can show whether noise causes score changes."
  },
  {
    "prompt": "A newspaper finds cities with more ice cream shops have higher crime rates.",
    "options": [
      "Observational",
      "Experiment",
      "Survey"
    ],
    "correct": 0,
    "explanation": "Analyzing existing data → observational. Confounding variable: population size (or temperature)."
  }
];

export default function PSAT89MathModule4() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "ratios": <RatiosVisual />,
        "percents": <PercentsVisual />,
        "statistics": <StatisticsVisual />,
        "two-way-table": <TwoWayTableVisual />,
        "scatterplots": <ScatterplotVisual />,
        "study-design": <StudyDesignVisual />,
        "psda-traps": <PSDATrapVisual />,
      }}
      activities={{
        "exercise-rat": (goNext: () => void) => (
          <FillInExercise
            items={RAT_EXERCISE}
            title="Ratios & Percents"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-pct": (goNext: () => void) => (
          <MatchingExercise
            items={PCT_EXERCISE}
            title="Percent Traps"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-prb": (goNext: () => void) => (
          <MatchingExercise
            items={PRB_EXERCISE}
            title="Probability"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-mis": (goNext: () => void) => (
          <MatchingExercise
            items={MIS_EXERCISE}
            title="Misleading Statistics"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-std": (goNext: () => void) => (
          <MatchingExercise
            items={STD_EXERCISE}
            title="Study Design"
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

      nextModuleHref="/courses/psat89-math/5"
      nextModuleLabel="Module 5: Geometry"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "math",
  moduleNum: 4,
  title: "Problem-Solving & Data",
  subtitle:
    "~15% of the test \u2014 but built on grades 6-8 content. This is the highest-ROI domain for quick score gains.",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "lesson" },
    { id: "exercise-rat", label: "Ratios & Percents", icon: "zap" },
    { id: "exercise-pct", label: "Percent Traps", icon: "zap" },
    { id: "exercise-prb", label: "Probability", icon: "zap" },
    { id: "exercise-mis", label: "Misleading Statistics", icon: "zap" },
    { id: "exercise-std", label: "Study Design", icon: "zap" },
    { id: "calculator", label: "Calculator", icon: "chart" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "ratios-rates",
      title: "Topic 4A: Ratios, Rates & Proportions",
      subtitle: "Cross-Multiply, Unit Rates & Dimensional Analysis",
      visual: "ratios",
      body: [
        "Ratios compare two quantities. Rates are ratios with different units. Unit rates express a rate per ONE unit. These concepts from middle school form the foundation of PSDA.",
        "Proportions: cross-multiply to solve. Unit conversions: multiply by fractions where the unwanted units cancel out.",
      ],
    },
    {
      id: "percents",
      title: "Percentages: Increase, Decrease & Multi-Step",
      subtitle: "The Multiplier Shortcut & Successive Percent Traps",
      visual: "percents",
      body: [
        "Use the multiplier shortcut: 15% increase = multiply by 1.15. 20% decrease = multiply by 0.80. This is faster and avoids errors.",
        "Successive percent changes don\u2019t cancel! A 20% increase then 20% decrease does NOT return to the original. Try the simulator above to see why.",
      ],
    },
    {
      id: "statistics",
      title: "Topic 4B: Statistics \u2014 Mean, Median & Spread",
      subtitle: "Center, Spread & Shape of Data",
      visual: "statistics",
      body: [
        "Mean is pulled by outliers. Median resists them. This is the PSAT\u2019s favorite statistics question. Add an outlier in the explorer above to see the effect.",
        "Standard deviation measures spread: clustered tightly = small SD, spread far apart = large SD. Adding a constant to every value does NOT change SD.",
      ],
    },
    {
      id: "two-way-table",
      title: "Topic 4C: Two-Way Tables & Conditional Probability",
      subtitle: "Joint, Marginal & Conditional Frequencies",
      visual: "two-way-table",
      body: [
        "Marginal frequencies are the row/column totals. Joint frequencies are inside the table where row and column intersect.",
        "Conditional probability P(A|B): restrict to B\u2019s group first, then find A within it. The denominator is always the group you\u2019re restricting to.",
      ],
    },
    {
      id: "scatterplots",
      title: "Scatterplots & Lines of Best Fit",
      subtitle: "Correlation, Regression & Predictions",
      visual: "scatterplots",
      body: [
        "The slope of the line of best fit represents the rate of change in context. The y-intercept is the predicted value when $x = 0$.",
        "Interpolation (within data range) is reliable. Extrapolation (beyond data range) is unreliable \u2014 the trend may not continue.",
      ],
    },
    {
      id: "study-design",
      title: "Topic 4D: Study Design & Statistical Inference",
      subtitle: "Correlation vs. Causation, Sampling & Margin of Error",
      visual: "study-design",
      body: [
        "Only experiments with random assignment can establish cause and effect. Observational studies can only show correlation.",
        "Random sampling is needed to generalize results to a larger population. Larger sample = smaller margin of error.",
      ],
    },
    {
      id: "psda-traps",
      title: "Four Traps in Problem-Solving & Data Analysis",
      subtitle: "Dodge Easy-to-Lose Points",
      visual: "psda-traps",
      body: [
        "These traps catch students who rush through PSDA problems. Know them and you\u2019ll dodge easy-to-lose points. The Percent Spiral and Conditional Swap are the most common.",
      ],
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      source: "Module 3 — Exponents",
      stem: "Simplify: <code>x⁴ · x³</code>",
      choices: ["x¹²", "7x", "x¹", "x⁷"],
      correct: 3,
      explanation: "Product rule: add exponents. x⁴⁺³ = x⁷.",
    },
    {
      source: "Module 3 — Quadratics",
      stem: "What are the x-intercepts of <code>f(x) = (x−3)(x+5)</code>?",
      choices: ["$x = 3$ and $x = −5$", "$x = −3$ and $x = −5$", "$x = 3$ and $x = 5$", "$x = −3$ and $x = 5$"],
      correct: 0,
      explanation: "Set each factor to 0: $x−3=0$ → $x=3$, $x+5=0$ → $x=−5$.",
    },
    {
      source: "Module 3 — Vertex Form",
      stem: "The vertex of <code>f(x) = 2(x−4)² + 1</code> is:",
      choices: ["(4, −1)", "(−4, 1)", "(4, 1)", "(2, 1)"],
      correct: 2,
      explanation: "Vertex form a(x−h)²+k → vertex at (h,k) = (4,1). The sign flips!",
    },
    {
      source: "Module 3 — Discriminant",
      stem: "How many real solutions does <code>x² + 6x + 10 = 0</code> have?",
      choices: ["2", "0", "3", "1"],
      correct: 1,
      explanation: "$b²−4ac = 36−40$ = −4 < 0 → no real solutions.",
    },
    {
      source: "Module 3 — Growth/Decay",
      stem: "<code>y = 500(0.92)^t</code> represents:",
      choices: ["92% growth", "92% decay", "8% growth", "8% decay"],
      correct: 3,
      explanation: "Base 0.92 < 1 → decay. Rate = 1 − 0.92 = 0.08 = 8% per period.",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      stem: "A car travels 180 miles in 3 hours. What is its average speed?",
      choices: ["90 mph", "45 mph", "54 mph", "60 mph"],
      correct: 3,
      explanation: "180 ÷ 3 = 60 mph.",
      trapAnswer: 3,
      trapDesc: "90mph would be 180÷2 hours, not ÷3",
    },
    {
      stem: "What is 15% of 240?",
      choices: ["24", "48", "36", "60"],
      correct: 2,
      explanation: "0.15 × 240 = 36.",
      trapAnswer: 0,
      trapDesc: "24 is 10% of 240 — used wrong percentage",
    },
    {
      stem: "The median of {3, 7, 9, 12, 15} is:",
      choices: ["9.2", "12", "9", "7"],
      correct: 2,
      explanation: "5 values → middle (3rd) value = 9.",
      trapAnswer: 2,
      trapDesc: "9.2 is the mean, not the median",
    },
    {
      stem: "If boys to girls is 3:5 and there are 24 boys, how many girls?",
      choices: ["30", "45", "35", "40"],
      correct: 3,
      explanation: "3/5 = $24/g$ → $g = 40$.",
      trapAnswer: 2,
      trapDesc: "Cross-multiply correctly: 3g=5×24=120, $g=40$ is correct",
    },
    {
      stem: "A store raises prices 20% then gives 20% off. Compared to original, the final price is:",
      choices: ["4% less", "20% less", "4% more", "The same"],
      correct: 0,
      explanation: "$100 → $120 → $96. 4% less.",
      trap: "percent_spiral",
      trapAnswer: 0,
      trapDesc: "Assumed +20% then −20% cancel out — The Percent Spiral",
    },
    {
      stem: "Data set A: SD = 3.2. Data set B: SD = 8.7. Which has more spread?",
      choices: ["Cannot tell", "A", "B", "Equal"],
      correct: 2,
      explanation: "Higher SD = more spread. B is more variable.",
      trapAnswer: 0,
      trapDesc: "Picked A (lower SD) — SD means spread, higher = more spread",
    },
    {
      stem: "A negative linear association in a scatterplot means:",
      choices: ["y is always negative", "As x increases, y increases", "As x increases, y decreases", "No relationship"],
      correct: 2,
      explanation: "Negative association: x up → y down.",
      trapAnswer: 0,
      trapDesc: "Confused positive and negative association",
    },
    {
      stem: "P(plays sports | female) = 40/60 means:",
      choices: ["40% are female", "40% of all students play sports", "60 of 40 play sports", "40 of 60 females play sports"],
      correct: 3,
      explanation: "Given female (60 total), 40 play sports.",
      trap: "conditional_swap",
      trapAnswer: 3,
      trapDesc: "Misread the conditional — The Conditional Swap",
    },
    {
      stem: "A study finds countries with more doctors have lower infant mortality. Valid conclusion:",
      choices: ["No relationship", "More doctors cause lower mortality", "More doctors are associated with lower mortality", "Infant mortality causes fewer doctors"],
      correct: 2,
      explanation: "Observational → association only. Wealth may explain both.",
      trapAnswer: 0,
      trapDesc: "Claimed causation from observational data",
    },
    {
      stem: "A survey of 400 voters finds 52% support a policy (margin of error ±4%). Best interpretation:",
      choices: ["Between 48%–56% of all voters likely agree", "Exactly 52% of all voters agree", "Survey is unreliable", "52% is the exact population value"],
      correct: 0,
      explanation: "52% ± 4% → true value likely between 48% and 56%.",
      trapAnswer: 0,
      trapDesc: "Treated sample statistic as exact population parameter",
    },
  ],
  takeaways: [
    "PSDA is ~15% of the test but built on skills from middle school -- highest ROI for study time.",
    "Cross-multiply to solve proportions: $a/b = c/d$ -> ad = bc.",
    "Percent multiplier shortcut: increase = x (1 + rate), decrease = x (1 - rate).",
    "Successive percent changes don't cancel! Each change applies to the new amount.",
    "Mean is pulled by outliers. Median resists them. This is the PSAT's favorite stat question.",
    "Skewed right -> mean > median. Skewed left -> mean < median.",
    "Correlation does not equal causation. Only experiments with random assignment can show cause and effect.",
    "P(A|B): restrict to B's group first, then find A within it. Don't confuse with P(B|A).",
    "Larger sample -> smaller margin of error. Random sampling -> can generalize.",
  ],
};
