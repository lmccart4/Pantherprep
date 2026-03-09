"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import { StatisticsCalculator } from "@/components/course/activities/statistics-calculator";
import {
  FormulaGridVisual,
  StatisticsVisual,
  TwoWayTableVisual,
  StudyDesignVisual,
  TrapTaxonomyVisual,
} from "./lesson-visuals";

export default function SATMathModule5() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/sat-math/6"
      nextModuleLabel="Module 6: Geometry & Trigonometry"

      visuals={{
        "formula-grid": <FormulaGridVisual />,
        "statistics": <StatisticsVisual />,
        "two-way-table": <TwoWayTableVisual />,
        "study-design": <StudyDesignVisual />,
        "traps": <TrapTaxonomyVisual />,
      }}

      activities={{
        "exercise-ratio-qs": (goNext: () => void) => (
          <FillInExercise
            items={RATIO_QS_EXERCISE_DATA}
            title="Ratio"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-chains": (goNext: () => void) => (
          <MatchingExercise
            items={CHAINS_EXERCISE_DATA}
            title="Chains"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-table-qs": (goNext: () => void) => (
          <MatchingExercise
            items={TABLE_QS_EXERCISE_DATA}
            title="Table"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-study-qs": (goNext: () => void) => (
          <MatchingExercise
            items={STUDY_QS_EXERCISE_DATA}
            title="Study"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-mislead-qs": (goNext: () => void) => (
          <MatchingExercise
            items={MISLEAD_QS_EXERCISE_DATA}
            title="Mislead"
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
    />
  );
}

/* ═══════════════════════════════════════════════════════
 * MODULE 5 — Problem-Solving & Data Analysis
 * ═══════════════════════════════════════════════════════ */

const RATIO_QS_EXERCISE_DATA: FillInItem[] = [
  {
    "prompt": "A store marks up a $40 item by 25%. What is the selling price?",
    "answer": 50,
    "solution": "$40 × 1.25 = $50."
  },
  {
    "prompt": "A shirt was $80, now $60. What is the percent decrease?",
    "answer": 25,
    "solution": "(80 − 60)/80 × 100 = 25%. Divide by the OLD value."
  },
  {
    "prompt": "If 3 workers paint a house in 12 hours, how many hours for 4 workers?",
    "answer": 9,
    "solution": "Inverse proportion: 3 × 12 = 36. So 4 × $h = 36$, $h = 9$."
  },
  {
    "prompt": "A recipe for 6 servings uses 2 cups of flour. How many cups for 15 servings?",
    "answer": 5,
    "solution": "2/6 = x/15. Cross multiply: $6x = 30$, $x = 5$ cups."
  },
  {
    "prompt": "A car travels 240 miles on 8 gallons. Miles per gallon?",
    "answer": 30,
    "solution": "240 ÷ 8 = 30 mpg."
  },
  {
    "prompt": "A population grows from 5,000 to 6,500. Percent increase?",
    "answer": 30,
    "solution": "(6500 − 5000)/5000 × 100 = 30%."
  }
];

const CHAINS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Start: $100. Increase 20%, then decrease 20%. Final price?",
    "options": [
      "$96",
      "$99",
      "$100",
      "$104"
    ],
    "correct": 0,
    "explanation": "$100 × 1.20 = $120. Then $120 × 0.80 = $96. The 20% decrease is taken from the LARGER number, so you lose $4 not $0."
  },
  {
    "prompt": "Start: $200. Decrease 10%, then increase 10%. Final price?",
    "options": [
      "$198",
      "$202",
      "$180",
      "$200"
    ],
    "correct": 0,
    "explanation": "$200 × 0.90 = $180. Then $180 × 1.10 = $198. You lose $2 — the changes never cancel!"
  },
  {
    "prompt": "A stock increases 50% then decreases 50%. What percent of the original value remains?",
    "options": [
      "0%",
      "75%",
      "100%",
      "50%"
    ],
    "correct": 1,
    "explanation": "Start: 100. After +50%: 150. After −50%: 75. You lost 25% of your original investment."
  },
  {
    "prompt": "An item is marked up 25% then discounted 20%. The final price compared to original is:",
    "options": [
      "2% more",
      "5% less",
      "5% more",
      "Same price"
    ],
    "correct": 3,
    "explanation": "$100 × 1.25 = $125. Then $125 × 0.80 = $100. These specific percentages DO cancel — but only because 1.25 × 0.80 = 1.00 exactly."
  },
  {
    "prompt": "A population doubles (100% increase) then halves (50% decrease). Result?",
    "options": [
      "25% less",
      "Back to original",
      "50% more",
      "50% less"
    ],
    "correct": 1,
    "explanation": "100 × 2.00 = 200. Then 200 × 0.50 = 100. Doubling then halving returns to original."
  },
  {
    "prompt": "Three consecutive 10% increases. Total percent increase?",
    "options": [
      "31%",
      "30%",
      "33.1%",
      "40%"
    ],
    "correct": 2,
    "explanation": "1.10 × 1.10 × 1.10 = 1.331. Total increase = 33.1%, NOT 30%. Compounding makes it more than 3 × 10%."
  }
];

const TABLE_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "What proportion of ALL students play a sport?",
    "options": [
      "45/200 = 0.225",
      "55/200 = 0.275",
      "100/200 = 0.50",
      "100/80 = 1.25"
    ],
    "correct": 2,
    "explanation": "Total who play sport = 100. Total students = 200. P = 100/200 = 0.50."
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
    "explanation": "Given: plays sport (100 total). Of those, 45 have a job. P = 45/100 = 0.45."
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
    "explanation": "Given: has a job (80 total). Of those, 45 play sport. P = 45/80 = 0.5625. Notice: this is DIFFERENT from the previous answer! P(A|B) ≠ P(B|A)."
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
    "explanation": "Non-sport column = 100. Of those, 35 have a job. P = 35/100 = 0.35."
  },
  {
    "prompt": "Are \"plays a sport\" and \"has a job\" independent?",
    "options": [
      "Yes — both columns total 100",
      "No — P(job|sport) ≠ P(job)",
      "Cannot be determined",
      "Yes — probabilities are equal"
    ],
    "correct": 1,
    "explanation": "P(job) = 80/200 = 0.40. P(job|sport) = 45/100 = 0.45. Since 0.40 ≠ 0.45, NOT independent."
  },
  {
    "prompt": "If 50 more sport+job students are added, what is new P(job|sport)?",
    "options": [
      "95/130 ≈ 0.731",
      "95/150 ≈ 0.633",
      "95/250 = 0.38",
      "45/150 = 0.30"
    ],
    "correct": 1,
    "explanation": "New sport+job = 95. New total sport = 150. P = 95/150 ≈ 0.633."
  }
];

const STUDY_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Researchers randomly selected 500 adults from a city and found that those who exercised regularly had lower blood pressure.",
    "options": [
      "Association only — can generalize to city",
      "Association only — cannot generalize",
      "No valid conclusion",
      "Causation — exercise lowers BP"
    ],
    "correct": 0,
    "explanation": "Random sampling → generalize. No random assignment → only association."
  },
  {
    "prompt": "100 volunteers were randomly assigned to drink green tea or water daily for 3 months. Green tea group showed improved focus.",
    "options": [
      "Causation — generalize to all adults",
      "Causation — but only for volunteers",
      "Association only — cannot generalize",
      "Association only — generalize"
    ],
    "correct": 1,
    "explanation": "Random assignment → causation. But volunteers → can't generalize to everyone."
  },
  {
    "prompt": "A researcher surveys students at her own school and finds correlation between screen time and lower grades.",
    "options": [
      "Association — generalize to all students",
      "Association only — cannot generalize",
      "Causation — for this school only",
      "Causation — screens lower grades"
    ],
    "correct": 1,
    "explanation": "No random assignment → no causation. No random sampling → can't generalize."
  },
  {
    "prompt": "A national org randomly selects 10,000 people and randomly assigns half to Vitamin D supplements. Supplement group has fewer colds after 1 year.",
    "options": [
      "Causation — can generalize to population",
      "Causation — only for sample",
      "Association only — generalize",
      "Association only — cannot generalize"
    ],
    "correct": 0,
    "explanation": "Random sampling AND random assignment → both causation and generalizability. Gold standard."
  },
  {
    "prompt": "Countries with more chocolate consumption per capita have more Nobel Prize winners.",
    "options": [
      "Association — generalize to all countries",
      "Causation — generalize globally",
      "Correlation only — confounding variables",
      "Causation — chocolate helps"
    ],
    "correct": 2,
    "explanation": "Wealth is a confounding variable — wealthier countries have both more chocolate AND more Nobel winners."
  },
  {
    "prompt": "To reduce margin of error from \u00b15% to \u00b12.5%, a researcher should:",
    "options": [
      "Increase sample size",
      "Ask more questions",
      "Survey a different population",
      "Use a different method"
    ],
    "correct": 0,
    "explanation": "Larger sample → smaller margin of error. To halve the margin, quadruple the sample size."
  }
];

const MISLEAD_QS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "\u201c9 out of 10 dentists recommend our toothpaste!\u201d The company surveyed 10 dentists who were paid consultants.",
    "options": [
      "Biased sample",
      "Correlation \u2260 causation",
      "Cherry-picked data",
      "Too small sample"
    ],
    "correct": 0,
    "explanation": "Paid consultants are not representative of all dentists. The sample is biased — they have financial incentive to recommend it."
  },
  {
    "prompt": "\u201cPeople who eat organic food live 3 years longer!\u201d Based on observational data from health-conscious consumers.",
    "options": [
      "Biased sample",
      "Misleading graph",
      "Confounding variables",
      "Too small sample"
    ],
    "correct": 2,
    "explanation": "People who eat organic may also exercise more, earn more, and have better healthcare. These confounding variables — not organic food itself — could explain the difference."
  },
  {
    "prompt": "A graph shows company revenue from $995M to $1.01B, but the y-axis starts at $990M, making the growth look dramatic.",
    "options": [
      "Correlation \u2260 causation",
      "Cherry-picked data",
      "Misleading graph axis",
      "Biased sample"
    ],
    "correct": 2,
    "explanation": "Starting the y-axis above zero exaggerates small changes. The actual growth is about 1.5%, but the graph makes it look like a massive increase."
  },
  {
    "prompt": "\u201cOur SAT prep course works! Students scored 50 points higher after taking it.\u201d But there was no control group.",
    "options": [
      "Cherry-picked data",
      "Biased sample",
      "No control group for comparison",
      "Confounding variables"
    ],
    "correct": 2,
    "explanation": "Without a control group, we don't know if students would have improved just from practice, maturity, or retaking the test."
  },
  {
    "prompt": "A politician says \u201cCrime dropped 15% under my leadership!\u201d but only shows data from the 2 best months out of 24.",
    "options": [
      "Confounding variables",
      "Misleading graph axis",
      "Biased sample",
      "Cherry-picked data"
    ],
    "correct": 3,
    "explanation": "Selecting only the data that supports your conclusion is cherry-picking. The overall trend for all 24 months might show no change or even an increase."
  },
  {
    "prompt": "\u201cStates that spend more on education have higher test scores.\u201d Conclusion: spending more money improves education.",
    "options": [
      "Biased sample",
      "Misleading graph axis",
      "Cherry-picked data",
      "Correlation \u2260 causation"
    ],
    "correct": 3,
    "explanation": "This is observational data. Wealthier states both spend more AND have other advantages (family income, resources). Correlation does not imply causation."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "math",
  moduleNum: 5,
  title: "Problem-Solving & Data Analysis",
  subtitle:
    "Ratios, percentages, probability, and statistics",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-ratio-qs", label: "Ratio Qs", icon: "zap" },
    { id: "exercise-chains", label: "Chains", icon: "zap" },
    { id: "exercise-table-qs", label: "Table Qs", icon: "zap" },
    { id: "exercise-study-qs", label: "Study Qs", icon: "zap" },
    { id: "exercise-mislead-qs", label: "Mislead Qs", icon: "zap" },
    { id: "calculator", label: "Calculator", icon: "chart" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARM-UP (Module 4 Retrieval) ──────── */
  warmup: [
    {
      source: "Module 4 \u2014 Functions",
      stem: "What is f(3) if f(x) = 2x\u00B2 \u2212 1?",
      choices: ["15", "19", "17", "11"],
      correct: 2,
      explanation:
        "f(3) = 2(3)\u00B2 \u2212 1 = 2(9) \u2212 1 = 18 \u2212 1 = 17.",
    },
    {
      source: "Module 4 \u2014 Transformations",
      stem: "The transformation f(x \u2212 3) shifts the graph in which direction?",
      choices: ["Right 3", "Up 3", "Left 3", "Down 3"],
      correct: 0,
      explanation:
        "f(x \u2212 h) shifts RIGHT by h units. The sign is opposite to what it looks like inside the parentheses.",
    },
    {
      source: "Module 4 \u2014 Composition",
      stem: "If f(x) = x + 1 and g(x) = 2x, what is f(g(3))?",
      choices: ["7", "5", "8", "9"],
      correct: 0,
      explanation:
        "g(3) = 2(3) = 6. Then f(6) = 6 + 1 = 7. Work inside out.",
    },
    {
      source: "Module 4 \u2014 End Behavior",
      stem: "A function with the highest-power term having a negative coefficient has what end behavior?",
      choices: [
        "Falls left, rises right",
        "Rises on both ends",
        "Cannot determine",
        "Falls on both ends (even) or falls right (odd)"
      ],
      correct: 3,
      explanation:
        "Negative leading coefficient: even degree falls both ends, odd degree rises left and falls right.",
    },
    {
      source: "Module 4 \u2014 Domain",
      stem: "The domain of f(x) = \u221A(x \u2212 4) requires x to be?",
      choices: ["\u2265 4", "> 4", "< 4", "\u2264 4"],
      correct: 0,
      explanation:
        "The expression under the square root must be \u2265 0: x \u2212 4 \u2265 0, so x \u2265 4.",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    /* ── Intro ── */
    {
      id: "intro",
      title: "Why This Domain Matters",
      subtitle: "The most word-problem-heavy domain on the SAT",
      body: [
        "These questions are often the most \"readable\" on the test \u2014 word problems grounded in real-world scenarios.",
        "Students who struggle with abstract algebra sometimes *thrive* here. Accuracy in this domain is very achievable.",
      ],
    },

    /* ── Topic 5A: Ratios, Rates & Proportions ── */
    {
      id: "topic-5a",
      title: "Topic 5A \u2014 Ratios, Rates & Proportions",
      subtitle: "Proportions, unit rates, percent change",
      visual: "formula-grid",
      body: [
        "Key formulas:",
        "\u2022 **Proportion:** $a/b = c/d$ \u2192 ad = bc",
        "\u2022 **Unit Rate:** \"per\" = \u00F7",
        "\u2022 **Percent:** part/whole \u00D7 100",
        "\u2022 **Percent Change:** (new \u2212 old)/old \u00D7 100",
        "\u2022 **Percent Increase:** new = old \u00D7 (1 + r)",
        "\u2022 **Percent Decrease:** new = old \u00D7 (1 \u2212 r)",
      ],
    },
    {
      id: "topic-5a-units",
      title: "Unit Conversion & Dimensional Analysis",
      subtitle: "Multiply by conversion factors so unwanted units cancel",
      body: [
        "**Example:** Convert 60 mph to feet per second:",
        "`60 miles/hr \u00D7 5280 ft/mile \u00D7 1 hr/3600 sec = 88 ft/sec`",
        "Set up fractions so miles cancel with miles, hours cancel with hours.",
        "**SAT Trap:** The question gives data in minutes but asks for hours, or gives miles but asks for feet. Always check the units!",
      ],
    },
    {
      id: "topic-5a-proportion-types",
      title: "Direct vs. Inverse Proportion",
      subtitle: "Recognizing the relationship pattern",
      body: [
        "**Direct proportion:** $y = kx$. As x increases, y increases. Doubling x doubles y.",
        "**Inverse proportion:** $y = k/x$. As x increases, y decreases. Doubling x halves y.",
        "To identify: if the product xy is constant \u2192 inverse. If the ratio $y/x$ is constant \u2192 direct.",
      ],
    },

    /* ── Topic 5B: Statistics ── */
    {
      id: "topic-5b-center",
      title: "Topic 5B \u2014 Statistics: Center, Spread & Shape",
      subtitle: "Mean vs. Median \u2014 When It Matters",
      visual: "statistics",
      body: [
        "**Mean** = sum \u00F7 count. Sensitive to outliers.",
        "**Median** = middle value (sorted). Resistant to outliers.",
        "**SAT's favorite question:** \"A very high value is added. Which measure is more affected?\" \u2192 The mean.",
        "**Example:** Data: 10, 12, 14, 15, 16. Mean = 13.4, Median = 14.",
        "Add outlier (100): Mean = 27.8 (jumped!), Median = 14.5 (barely changed).",
      ],
    },
    {
      id: "topic-5b-spread",
      title: "Standard Deviation & Spread",
      subtitle: "Range and standard deviation concepts",
      body: [
        "**Range** = max \u2212 min.",
        "**Standard deviation** = how spread out values are from the mean. You don't need to calculate it on the SAT:",
        "\u2022 Data clustered tightly \u2192 SMALL standard deviation",
        "\u2022 Data spread far \u2192 LARGE standard deviation",
        "\u2022 Adding/subtracting a constant to every value does NOT change the standard deviation",
        "\u2022 Multiplying every value by a constant DOES change the standard deviation (by that factor)",
      ],
    },
    {
      id: "topic-5b-shape",
      title: "Distribution Shape",
      subtitle: "Symmetric, skewed right, skewed left",
      body: [
        "**Symmetric:** Mean \u2248 Median. Bell-shaped or uniform.",
        "**Skewed right:** Tail extends right. Mean > Median.",
        "**Skewed left:** Tail extends left. Mean < Median.",
      ],
    },

    /* ── Topic 5C: Data Interpretation ── */
    {
      id: "topic-5c-scatter",
      title: "Topic 5C \u2014 Scatterplots & Line of Best Fit",
      subtitle: "Correlation, prediction, and residuals",
      body: [
        "**Correlation:** Positive (both increase), Negative (one up, other down), None.",
        "**Line of best fit:** Slope = rate of change. Y-intercept = starting value.",
        "**Interpolation** = predicting WITHIN data range (reliable). **Extrapolation** = BEYOND (less reliable).",
        "**Residuals** = actual \u2212 predicted. Random scatter = good model. Pattern = bad fit.",
        "**Desmos Regression:** Enter data as a table, then type `y\u2081 ~ mx\u2081 + b` for linear or `y\u2081 ~ ax\u2081\u00B2 + bx\u2081 + c` for quadratic.",
      ],
    },
    {
      id: "topic-5c-twoway",
      title: "Two-Way Frequency Tables",
      subtitle: "Marginal, joint, and conditional frequencies",
      visual: "two-way-table",
      body: [
        "Two-way tables organize data by two categorical variables.",
        "**Marginal frequencies:** The row/column totals.",
        "**Joint frequencies:** The values inside the table.",
        "**Conditional probability:** P(A|B) = (count of A AND B) / (total count of B).",
        "**SAT Trap:** P(A|B) \u2260 P(B|A)! \"Probability of having a job given you play a sport\" is NOT the same as \"probability of playing a sport given you have a job.\" The denominator changes!",
      ],
    },

    /* ── Topic 5D: Probability & Study Design ── */
    {
      id: "topic-5d-prob",
      title: "Topic 5D \u2014 Probability Basics",
      subtitle: "Probability fundamentals for the SAT",
      body: [
        "**P(event) = favorable / total**",
        "Probability is always between 0 (impossible) and 1 (certain).",
        "**Complement:** P(not A) = 1 \u2212 P(A).",
        "**\"At least one\"** = 1 \u2212 P(none).",
      ],
    },
    {
      id: "topic-5d-study",
      title: "Study Design \u2014 The SAT's Favorite Trick",
      subtitle: "Random sampling vs. random assignment",
      visual: "study-design",
      body: [
        "**1. Random sampling** \u2192 results can be generalized to the population. Not random (e.g., volunteers) \u2192 can NOT generalize.",
        "**2. Random assignment to groups** \u2192 causation can be established. This makes it an EXPERIMENT.",
        "**3. No random assignment** \u2192 only association, NOT causation.",
        "**Confounding variables:** Other factors that could explain the result.",
        "**Margin of error:** Larger sample \u2192 smaller margin of error. To halve the margin, quadruple the sample (proportional to 1/\u221An).",
      ],
    },

    /* ── Trap Taxonomy ── */
    {
      id: "traps",
      title: "Four Traps in PSDA Problems",
      subtitle: "Learn them by name to spot them instantly",
      visual: "traps",
      body: [
        "**Trap 1: The Percent Spiral** \u2014 Successive percent changes don't cancel. A 10% increase then 10% decrease leaves you 1% below the original. $100 \u2192 +10% = $110 \u2192 \u221210% = $99 (not $100).",
        "**Trap 2: The Wrong Target** \u2014 Used the wrong denominator in a percentage. Percent change divides by OLD value. $80 \u2192 $100: change = 20/80 = 25% (not 20/100 = 20%).",
        "**Trap 3: The Scale Mirage** \u2014 Misreading graph axes \u2014 a bar chart with a truncated y-axis makes small differences look huge.",
        "**Trap 4: The Conditional Swap** \u2014 Confusing P(A|B) with P(B|A). The denominator changes depending on which condition you're \"given.\"",
      ],
    },
  ],

  /* ──────── QUIZ (Timed Practice) ──────── */
  quiz: [
    {
      stem: "If 40% of 250 students passed an exam, how many passed?",
      choices: ["80", "160", "40", "100"],
      correct: 3,
      explanation: "0.40 \u00D7 250 = 100.",
      difficulty: "easy",
      type: "5A",
      domain: "Problem Solving & Data",
      skill: "ratios_rates",
    },
    {
      stem: "Data set: 3, 5, 7, 9, 11. What is the mean?",
      choices: ["7", "35", "5", "9"],
      correct: 0,
      explanation: "(3+5+7+9+11)/5 = 35/5 = 7.",
      difficulty: "easy",
      type: "5B",
      trap: "wrong_target",
      trapAnswer: 3,
      trapDesc: "Gave the sum instead of the mean \u2014 The Wrong Target",
      domain: "Problem Solving & Data",
      skill: "ratios_rates",
    },
    {
      stem: "A jacket costs $120 after a 20% discount. What was the original price?",
      choices: ["$140", "$144", "$150", "$96"],
      correct: 2,
      explanation:
        "You pay 80% of original: 0.80 \u00D7 original = 120 \u2192 original = $150. Trap: $144 is 120 \u00D7 1.20 \u2014 working backwards wrong.",
      difficulty: "easy",
      type: "5A",
      trap: "percent_spiral",
      trapAnswer: 2,
      trapDesc:
        "Added 20% to sale price instead of dividing \u2014 Percent Spiral",
      domain: "Problem Solving & Data",
      skill: "ratios_rates",
    },
    {
      stem: "A scatterplot line of best fit: $y = 2$.5x + 15 ($x = hours$ studied, $y = score$). What does 2.5 mean?",
      choices: [
        "Score when $x = 0$",
        "Total hours studied",
        "Predicted increase per hour studied",
        "Minimum score"
      ],
      correct: 2,
      explanation:
        "Slope = rate of change: each additional hour \u2192 2.5 more points.",
      difficulty: "medium",
      type: "5C",
      domain: "Problem Solving & Data",
      skill: "ratios_rates",
    },
    {
      stem: "Mean = 50, median = 45. The distribution is most likely:",
      choices: [
        "Symmetric",
        "Uniform",
        "Skewed right",
        "Skewed left"
      ],
      correct: 2,
      explanation:
        "Mean > Median \u2192 skewed right. High values pull the mean up.",
      difficulty: "medium",
      type: "5B",
      trap: "conditional_swap",
      trapAnswer: 1,
      trapDesc:
        "Reversed the skew direction \u2014 Conditional Swap on mean vs median",
      domain: "Problem Solving & Data",
      skill: "ratios_rates",
    },
    {
      stem: "300 voters surveyed, margin \u00B14%. To reduce to \u00B12%, the researcher should:",
      choices: [
        "Survey 1,200",
        "Ask more questions",
        "Different method",
        "Survey 600"
      ],
      correct: 0,
      explanation:
        "To halve the margin, quadruple the sample: 300 \u00D7 4 = 1,200. (Margin \u221D 1/\u221An.)",
      difficulty: "medium",
      type: "5D",
      trap: "wrong_target",
      trapAnswer: 0,
      trapDesc:
        "Doubled instead of quadrupled the sample \u2014 The Wrong Target",
      domain: "Problem Solving & Data",
      skill: "ratios_rates",
    },
    {
      stem: "A store increases prices 10%, then offers 10% off. Compared to original:",
      choices: ["1% less", "Same", "10% less", "1% more"],
      correct: 0,
      explanation:
        "$100 \u00D7 1.10 = $110 \u00D7 0.90 = $99. That's 1% less.",
      difficulty: "medium",
      type: "5A",
      trap: "percent_spiral",
      trapAnswer: 0,
      trapDesc:
        "Assumed successive percent changes cancel \u2014 The Percent Spiral",
      domain: "Problem Solving & Data",
      skill: "ratios_rates",
    },
    {
      stem: "P(A|B) = 0.6 and P(A) = 0.4. What can you conclude?",
      choices: [
        "P(A and B) = 0.24",
        "A and B are independent",
        "A and B are not independent",
        "P(B|A) = 0.6"
      ],
      correct: 2,
      explanation:
        "If independent, P(A|B) = P(A). Since 0.6 \u2260 0.4, they are NOT independent.",
      difficulty: "hard",
      type: "5C",
      trap: "conditional_swap",
      trapAnswer: 0,
      trapDesc:
        "Assumed conditional equals marginal \u2014 The Conditional Swap",
      domain: "Problem Solving & Data",
      skill: "ratios_rates",
    },
    {
      stem: "Adding a constant k to every value in a data set. Which changes?",
      choices: [
        "Mean changes, SD stays same",
        "Mean changes, SD changes",
        "Mean stays same, SD changes",
        "Neither changes"
      ],
      correct: 0,
      explanation:
        "Adding a constant shifts all values equally: mean increases by k, but spread doesn't change, so SD stays the same.",
      difficulty: "hard",
      type: "5B",
      domain: "Problem Solving & Data",
      skill: "ratios_rates",
    },
    {
      stem: "A sample of 400 has 52% supporting a policy, margin \u00B15%. Which conclusion is valid?",
      choices: [
        "Exactly 52% of population supports it",
        "Majority definitely supports it",
        "Between 47% and 57% likely support it",
        "The poll is too small to conclude anything"
      ],
      correct: 2,
      explanation:
        "52% \u00B1 5% gives a confidence interval of 47% to 57%. Since the interval includes values below 50%, we can't be certain a majority supports it.",
      difficulty: "hard",
      type: "5D",
      trap: "scale_mirage",
      trapAnswer: 0,
      trapDesc:
        "Ignored the margin of error \u2014 The Scale Mirage",
      domain: "Problem Solving & Data",
      skill: "ratios_rates",
    },
  ],
  takeaways: [
    "Percent change = (new \u2212 old) / old \u00d7 100. The OLD value is always the denominator.",
    "Chained percent changes DON'T cancel: 20% up then 20% down \u2260 original. Multiply the factors.",
    "Mean is sensitive to outliers; median is resistant. The SAT tests this constantly.",
    "On scatterplots, slope = rate of change in context. Y-intercept = starting value.",
    "P(A|B) \u2260 P(B|A)! Always check which group is the denominator.",
    "Only EXPERIMENTS with random assignment can establish causation. Everything else is correlation.",
    "Larger sample \u2192 smaller margin of error. Quadruple the sample to halve the margin.",
  ],
};
