"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  StatsVisual,
  StrengthScaleVisual,
  DataReadingVisual,
  SampleTableVisual,
  FrameworkVisual,
} from "./lesson-visuals";

/* ═══════════════════════════════════════════════════════
 * MODULE 10 — Inferences & Evidence
 * Drawing conclusions from textual evidence
 * ═══════════════════════════════════════════════════════ */

export default function SATRWModule10() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "stats": <StatsVisual />,
        "strength-scale": <StrengthScaleVisual />,
        "data-reading": <DataReadingVisual />,
        "sample-table": <SampleTableVisual />,
        "framework-visual": <FrameworkVisual />,
      }}
      nextModuleHref="/courses/sat-rw/11"
      nextModuleLabel="Module 11: Command of Quantitative Evidence"
      activities={{
        "exercise-textual-items": (goNext: () => void) => (
          <MatchingExercise
            items={TEXTUAL_ITEMS_EXERCISE_DATA}
            title="Textual"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-data-items": (goNext: () => void) => (
          <MatchingExercise
            items={DATA_ITEMS_EXERCISE_DATA}
            title="Data"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

const TEXTUAL_ITEMS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Psychologist Dr. Ahn conducted a controlled experiment in which participants were randomly assigned to spend 90 minutes walking in either a natural setting (a tree-lined park) or an urban setting (a busy commercial street). Before and after the walk, all participants completed standardized tests of working memory and attention.",
    "options": [
      "Dr. Ahn has published extensively on the relationship between environment and psychology.",
      "The study was conducted in Portland, Oregon, during the summer months.",
      "Previous research has suggested that natural environments may reduce stress levels.",
      "Participants who walked in the natural setting showed a 20% improvement in working memory scores and a 15% improvement in sustained attention, while urban walkers showed no significant change."
    ],
    "correct": 0,
    "explanation": "The claim is about \"measurable cognitive benefits.\" B provides SPECIFIC measurements (20% working memory, 15% attention) directly demonstrating cognitive benefits. A is about the researcher's credentials, C is location/timing, D is about stress (not cognition). B is the only choice that MEASURES cognitive benefits."
  },
  {
    "prompt": "Elena Ferrante's Neapolitan Quartet, while classified as literary fiction, incorporates elements drawn from soap opera, domestic melodrama, and coming-of-age narratives. The tetralogy follows two women from childhood in 1950s Naples through old age, embedding their personal drama within a panoramic portrayal of Italian political and social upheaval.",
    "options": [
      "The Neapolitan Quartet consists of four novels published between 2011 and 2014.",
      "By blending elements traditionally associated with popular entertainment — soap opera dynamics, melodramatic plot turns — into a work of serious literary ambition, Ferrante dismantles the boundary between 'high' and 'low' fiction.",
      "The novels have been translated into more than 40 languages and adapted into an HBO television series.",
      "Elena Ferrante is a pseudonym; the author's true identity has been the subject of extensive speculation."
    ],
    "correct": 0,
    "explanation": "The claim is about \"challenging conventional expectations.\" B explicitly describes HOW Ferrante challenges genre boundaries — blending popular entertainment with literary ambition, dismantling high/low distinctions. A is publication info, C is about identity, D is about commercial success."
  },
  {
    "prompt": "A comprehensive study of 750 manufacturing firms that adopted robotic automation between 2010 and 2020 yielded unexpected findings. While overall employment at these firms decreased by an average of 12%, the composition of the workforce shifted dramatically.",
    "options": [
      "The firms in the study ranged in size from 50 to 10,000 employees.",
      "Several labor unions have opposed the adoption of automation in manufacturing.",
      "The study found that while low-skill production roles declined by 35%, firms simultaneously created new positions in robot maintenance, data analysis, and process optimization — roles that paid an average of 47% more than the displaced positions.",
      "Automation technologies have become significantly cheaper over the past decade."
    ],
    "correct": 3,
    "explanation": "The claim is about COMPLEXITY — not simple job loss. B shows that complexity: jobs were lost (35% decline in low-skill) BUT new, higher-paying jobs were created. This demonstrates the two-sided effect the claim describes. A, C, D don't address the complexity argument."
  },
  {
    "prompt": "When the city undertook the restoration of the 18th-century Merchant's Hall, the architectural team faced repeated decisions about whether to maintain original features or adapt the building for contemporary use.",
    "options": [
      "The Merchant's Hall was originally built in 1742 by a prominent local family.",
      "The team chose to retain the building's original hand-blown window glass — which distorts light and provides no insulation — rather than replace it with modern energy-efficient alternatives, despite projected annual heating costs of $40,000 above what insulated windows would require.",
      "Several other historic buildings in the city have been restored in recent years.",
      "The restoration took three years and cost $12 million."
    ],
    "correct": 3,
    "explanation": "The claim is about prioritizing accuracy OVER convenience. B provides a concrete example: keeping original glass DESPITE $40,000/year in extra heating costs. This directly shows choosing historical authenticity at the expense of modern efficiency. Highly specific and directly supports the claim."
  },
  {
    "prompt": "Developmental psychologist Dr. Kim designed a study comparing cognitive performance in 200 bilingual and 200 monolingual children aged 6-10. All participants were matched for socioeconomic status, parental education, and school quality to control for confounding variables.",
    "options": [
      "Several previous studies had produced conflicting results on the relationship between bilingualism and cognition.",
      "Executive function refers to a set of cognitive processes including working memory, cognitive flexibility, and inhibitory control.",
      "Dr. Kim's study was funded by the National Science Foundation and published in the journal Developmental Psychology.",
      "Bilingual children in the study scored an average of 23% higher on tasks requiring cognitive flexibility and 18% higher on inhibitory control tasks, differences that remained statistically significant after controlling for all matched variables."
    ],
    "correct": 2,
    "explanation": "The claim is about bilingual children having STRONGER executive function. C provides specific data — 23% higher on flexibility, 18% higher on inhibitory control, statistically significant after controls. This is the most direct, specific, measurable support. A is funding info, B is a definition, D is about prior research."
  }
];

const DATA_ITEMS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Annual Revenue by Department (in millions)\n\n| Department | 2020 | 2021 | 2022 | 2023 |\n|---|---|---|---|\n| Software | 45 | 52 | 61 | 73 |\n| Hardware | 38 | 36 | 33 | 29 |\n| Services | 22 | 28 | 35 | 42 |\n| Total | 105 | 116 | 129 | 144 |\n\nWhich claim is best supported by the data in the table?",
    "options": [
      "The hardware department has been the company's largest revenue source since 2020",
      "Services revenue will surpass software revenue by 2025",
      "The company's total revenue has remained stable over the four-year period",
      "The company's revenue growth has been driven primarily by software and services, while hardware revenue has steadily declined"
    ],
    "correct": 3,
    "explanation": "Software: 45\u219273 million (growing). Services: 22\u219242 million (growing). Hardware: 38\u219229 million (declining). Total is growing. C accurately describes the pattern. A is wrong (revenue grew). B is wrong (software was largest). D predicts the future \u2014 the table only shows through 2023."
  },
  {
    "prompt": "Average Test Scores by Study Method\n\n| Study Method | Pre-Test | Post-Test | Improvement |\n|---|---|---|---|\n| Traditional lecture | 62 | 71 | +9 |\n| Active recall | 61 | 84 | +23 |\n| Spaced repetition | 63 | 86 | +23 |\n| Mixed (recall + spacing) | 62 | 91 | +29 |\n\nNote: Scores out of 100. Groups of 50 students each, matched for prior achievement.\n\nWhich claim is best supported by the data in the table?",
    "options": [
      "Active recall is more effective than spaced repetition",
      "Combining active recall with spaced repetition produced greater improvement than either technique alone",
      "Students using spaced repetition scored higher on the pre-test than all other groups",
      "Traditional lecture is an ineffective teaching method that should be abandoned"
    ],
    "correct": 1,
    "explanation": "Mixed method improved by 29, while active recall alone (+23) and spaced repetition alone (+23) improved less. B accurately describes this pattern. A overstates (lecture showed some improvement). C is wrong (pre-test scores were nearly identical). D is wrong (both improved by +23)."
  },
  {
    "prompt": "Coral Reef Health Index by Region (2015 vs. 2023)\n\n| Region | 2015 Index | 2023 Index | Change |\n|---|---|---|---|\n| Caribbean | 72 | 58 | -14 |\n| Indo-Pacific | 81 | 74 | -7 |\n| Red Sea | 85 | 83 | -2 |\n| Great Barrier Reef | 76 | 61 | -15 |\n| Global Average | 78.5 | 69 | -9.5 |\n\nNote: Health Index scored 0-100, where 100 = pristine condition.\n\nWhich claim is best supported by the data in the table?",
    "options": [
      "Coral reef decline is caused primarily by ocean acidification",
      "The Great Barrier Reef will be completely destroyed within the next decade",
      "While all regions experienced decline, the rate of decline varied significantly, with the Red Sea showing the greatest resilience",
      "The Red Sea has the healthiest coral reefs because it has the warmest water temperatures"
    ],
    "correct": 2,
    "explanation": "All regions declined (universal trend) but Red Sea declined only -2 vs. Great Barrier Reef at -15. B accurately captures both the universal decline AND the variation. A introduces temperature (not in data). C claims causation (not in data). D predicts future destruction (not supported)."
  },
  {
    "prompt": "Startup Survival Rates by Founding Team Size\n\n| Team Size | Year 1 | Year 3 | Year 5 |\n|---|---|---|---|\n| Solo founder | 78% | 42% | 19% |\n| 2 founders | 85% | 58% | 34% |\n| 3 founders | 82% | 55% | 31% |\n| 4+ founders | 80% | 48% | 24% |\n\nNote: Percentage of startups still operating. Sample: 5,000 startups founded 2015-2018.\n\nWhich claim is best supported by the data in the table?",
    "options": [
      "Solo-founded startups are doomed to fail because they lack diverse perspectives",
      "Most startups fail regardless of team size, but Year 1 survival rates vary little across team sizes",
      "Adding more founders always improves a startup's chances of survival",
      "Two-founder teams consistently showed the highest survival rates across all measured time periods"
    ],
    "correct": 3,
    "explanation": "Two founders had the highest rate at Year 1 (85%), Year 3 (58%), and Year 5 (34%) \u2014 consistently highest. B captures this. A overstates (\"doomed\"). C is wrong (4+ did worse than 2-3). D \u2014 while most fail long-term is true, the claim about Year 1 varying little is also true (78-85%), but B is MORE directly supported."
  },
  {
    "prompt": "Public Library Usage by Age Group (2018 vs. 2023)\n\n| Age Group | 2018 Visits/Year | 2023 Visits/Year | 2018 Digital | 2023 Digital |\n|---|---|---|---|---|\n| 18-29 | 4.2 | 2.1 | 12% | 58% |\n| 30-44 | 6.8 | 5.5 | 8% | 41% |\n| 45-59 | 7.1 | 6.9 | 5% | 22% |\n| 60+ | 9.4 | 8.8 | 3% | 11% |\n\nNote: Visits = average annual in-person visits. Digital = % using library\u2019s digital services.\n\nWhich claim is best supported by the data in the table?",
    "options": [
      "The 60+ age group visits the library more because they have more free time",
      "In-person library visits declined across all age groups while digital service usage increased substantially, with younger users showing the most dramatic shift toward digital",
      "Digital services are of higher quality than in-person library services",
      "Young adults have abandoned libraries entirely in favor of digital alternatives"
    ],
    "correct": 1,
    "explanation": "Every age group shows declining in-person visits AND increasing digital usage. The 18-29 group shows the most dramatic shift (visits halved, digital went from 12%\u219258%). B accurately captures all three trends. A overstates (\"entirely\" \u2014 they still visit 2.1 times). C and D introduce reasons not in the data."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 10,
  title: "Inferences & Evidence",
  subtitle:
    "Drawing conclusions from textual evidence",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },    { id: "quiz", label: "Quiz", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "flame" },    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "intro",
      title: "Evidence Is Everything",
      subtitle: "The SAT's most analytical question types",
      body: [
        "Command of Evidence questions test your ability to evaluate HOW well evidence supports a claim. This isn't about reading comprehension \u2014 it's about logical reasoning applied to text and data.",
        "Two main subtypes appear on the SAT:\n\u2022 Textual Evidence (~2-3 per test): Which quote/detail best supports a given claim?\n\u2022 Quantitative Evidence (~2 per test): What does the data in a table, graph, or chart support?",
        "Together these represent about 7-8% of the section. They're among the most analytical questions on the test and reward careful, logical thinking over reading speed.",
      ],
      visual: "stats",
    },
    {
      id: "textual-evidence",
      title: "Textual Evidence Questions",
      subtitle: "Which detail BEST supports the claim?",
      body: [
        "These questions give you a passage, a claim about the passage, and ask which piece of textual evidence best supports that claim. The format is typically: \"Which quotation from the text most effectively illustrates [claim]?\"",
        "STRATEGY: Don't just find evidence that RELATES to the claim \u2014 find evidence that SUPPORTS it. There's a crucial difference:\n\u2022 Related evidence: Discusses the same topic as the claim.\n\u2022 Supporting evidence: Actually demonstrates, proves, or illustrates the claim.",
        "EXAMPLE CLAIM: \"The author suggests that the traditional approach had significant limitations.\"\n\u2022 Related but weak: \"The traditional approach was developed in the 1950s.\" (Discusses the approach but doesn't mention limitations)\n\u2022 Strong support: \"Despite decades of use, the method consistently failed to account for environmental variables.\" (Directly shows a limitation)",
        "TRAP: Answer choices that mention the right topic but don't actually support the specific claim. Always ask: \"Does this evidence PROVE the claim, or just touch on the same subject?\"",
      ],
    },
    {
      id: "evidence-strength",
      title: "Evaluating Evidence Strength",
      subtitle: "Not all evidence is created equal",
      body: [
        "The SAT expects you to distinguish between strong and weak evidence. Here's the hierarchy:",
        "STRONGEST:\n\u2022 Direct examples that demonstrate the claim\n\u2022 Specific data, statistics, or research findings\n\u2022 Expert testimony directly addressing the claim\n\u2022 Logical reasoning with explicit connection to the claim",
        "WEAKEST:\n\u2022 Vague or general statements on the topic\n\u2022 Anecdotal evidence without clear connection\n\u2022 Tangentially related information\n\u2022 Evidence that merely restates the claim without supporting it",
        "KEY INSIGHT: Specificity matters. \"The program reduced dropout rates by 34%\" is stronger evidence than \"The program showed positive results.\" Both support the claim that the program worked, but the first is far more compelling.",
      ],
      visual: "strength-scale",
    },
    {
      id: "data-intro",
      title: "Quantitative Evidence: Tables & Graphs",
      subtitle: "Reading data the SAT way",
      body: [
        "About 2 questions per test include a table, graph, or chart. You'll need to read the data accurately and determine what claims it does (and doesn't) support.",
        "STEP 1: Read the title, axis labels, and units FIRST. Before looking at any data points, understand what's being measured and how.",
        "STEP 2: Identify trends. Is the data increasing, decreasing, or stable? Are there exceptions or outliers?",
        "STEP 3: Match the data to the claim. The question will present a claim and ask whether the data supports, contradicts, or is irrelevant to it.",
        "CRITICAL SKILL: The SAT tests whether you can distinguish between what the data SHOWS and what it SUGGESTS. Data showing a correlation (X and Y increase together) does NOT prove causation (X causes Y).",
      ],
      visual: "data-reading",
    },
    {
      id: "table-skills",
      title: "Reading Tables",
      subtitle: "Rows, columns, and comparisons",
      body: [
        "Tables are the most common data format on the SAT. Here's how to read them efficiently:",
        "ROWS represent individual items, groups, or time periods.\nCOLUMNS represent different measurements or categories.\nThe INTERSECTION of a row and column gives you a specific data point.",
        "COMPARISON QUESTIONS ask you to identify patterns:\n\u2022 Which group had the highest/lowest value?\n\u2022 How did values change over time?\n\u2022 What's the relationship between two columns?",
        "WATCH FOR:\n\u2022 Units (percentages vs. raw numbers \u2014 a 50% increase from 10 is just 5 more)\n\u2022 Missing data or footnotes\n\u2022 Whether the table shows ALL groups or just a selection\n\u2022 Whether numbers are approximate or exact",
      ],
      visual: "sample-table",
    },
    {
      id: "graph-skills",
      title: "Reading Graphs",
      subtitle: "Bars, lines, and scatter plots",
      body: [
        "BAR GRAPHS: Compare quantities across categories. Look for which bars are tallest/shortest and by how much.",
        "LINE GRAPHS: Show change over time. Look for overall trend (up/down/flat), rate of change (steep vs. gradual), and turning points.",
        "SCATTER PLOTS: Show relationship between two variables. Look for positive correlation (both increase), negative correlation (one increases, other decreases), or no correlation (random pattern).",
        "SAT TRAP: Graphs that show correlation between variables \u2014 the SAT will often include an answer choice that claims causation. Remember: correlation does NOT prove causation. Two things can increase together without one causing the other.",
      ],
    },
    {
      id: "data-claims",
      title: "Connecting Data to Claims",
      subtitle: "Support, weaken, or irrelevant?",
      body: [
        "The most common quantitative evidence question format: \"Which claim is best supported by the data in the table?\"",
        "SUPPORTS: The data directly demonstrates the claim. If the claim says \"X increased,\" the data should show X increasing.",
        "WEAKENS: The data contradicts the claim. If the claim says \"X increased,\" but the data shows X decreased or remained stable.",
        "IRRELEVANT: The data doesn't address the claim at all. This is a common trap \u2014 an answer choice about topic Y when the table only measures topics X and Z.",
        "STRATEGY: For each answer choice, ask:\n1. Does the table contain data relevant to this claim?\n2. Does the data point in the direction the claim requires?\n3. Is the match specific (exact numbers/trends) or vague (just same topic)?",
      ],
    },
    {
      id: "framework",
      title: "The Evidence Framework",
      subtitle: "Your approach for every evidence question",
      body: [
        "FOR TEXTUAL EVIDENCE:\n1. Read the claim carefully. What EXACTLY does it say?\n2. For each answer choice, ask: Does this evidence SUPPORT the claim, or just RELATE to the same topic?\n3. Choose the evidence that most DIRECTLY demonstrates the claim.\n4. Specificity wins \u2014 concrete examples beat vague statements.",
        "FOR QUANTITATIVE EVIDENCE:\n1. Read table/graph title, labels, and units.\n2. Read the claim or question.\n3. Find the relevant data points.\n4. Check: Does the data match the claim's direction and magnitude?\n5. Watch for correlation vs. causation traps.",
        "GOLDEN RULES:\n\u2022 The best evidence is the most SPECIFIC and DIRECT.\n\u2022 Data can SUPPORT or WEAKEN \u2014 it doesn't have to do either.\n\u2022 Never assume causation from correlation.\n\u2022 Read every answer choice \u2014 the best evidence may not be the first one you find.",
      ],
      visual: "framework-visual",
    },
  ],

  /* ──────── QUIZ ──────── */
  quiz: [
    {
      passage:
        "Ecologist Dr. Patel's long-term study of urban wildlife corridors has documented how green spaces connected by tree-lined pathways function as migration routes for birds, insects, and small mammals in otherwise fragmented urban environments.\n\nClaim: Dr. Patel's research demonstrates that connected green spaces support urban biodiversity more effectively than isolated parks.",
      stem: "Which finding, if true, would most effectively support the claim above?",
      choices: [
        "Connected corridor networks hosted 3.5 times more bird species and 2.8 times more pollinator species than equivalently sized isolated parks in the same metropolitan areas",
        "Dr. Patel's study lasted fifteen years and covered twelve cities",
        "Urban green spaces have become increasingly popular with city residents for recreational purposes",
        "Several cities have recently announced plans to expand their park systems"
      ],
      correct: 0,
      explanation:
        "The claim is about connected spaces being MORE effective than isolated parks for biodiversity. B provides direct comparative data \u2014 3.5x more bird species, 2.8x more pollinators in connected vs. isolated. Specific, comparative, and directly on-claim.",
      type: "textual",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "Historian Dr. Okafor argues that the Library of Alexandria's significance in the ancient world has been substantially overstated by modern scholars. While acknowledging its importance as a center of learning, Okafor notes that multiple rival institutions \u2014 including libraries at Pergamon, Antioch, and Athens \u2014 held comparable collections and attracted scholars of equal distinction.\n\nClaim: Dr. Okafor argues that the Library of Alexandria's historical reputation exceeds its actual uniqueness among ancient institutions.",
      stem: "Which quotation from the text most effectively illustrates this claim?",
      choices: [
        "Multiple rival institutions \u2014 including libraries at Pergamon, Antioch, and Athens \u2014 held comparable collections and attracted scholars of equal distinction.",
        "Modern scholars have written extensively about the Library of Alexandria's destruction.",
        "Dr. Okafor has studied ancient libraries for over two decades.",
        "The Library of Alexandria was an important center of learning in the ancient world."
      ],
      correct: 0,
      explanation:
        "The claim is about reputation EXCEEDING uniqueness \u2014 Alexandria wasn't as unique as people think. C directly shows why: other libraries had \"comparable collections\" and \"equal distinction\" scholars. This evidence demonstrates Alexandria wasn't the singular institution its reputation suggests.",
      type: "textual",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "A research team studying the effectiveness of different conservation strategies tracked populations of an endangered bird species across four protected areas using different management approaches over a ten-year period.\n\n| Strategy | 2013 Pop. | 2023 Pop. | Change |\n|---|---|---|---|\n| Habitat restoration | 120 | 310 | +158% |\n| Predator control | 135 | 195 | +44% |\n| Captive breeding | 90 | 180 | +100% |\n| No intervention (control) | 140 | 115 | -18% |",
      stem: "Which claim is best supported by the data in the table?",
      choices: [
        "The endangered bird population will be fully recovered within five more years",
        "Captive breeding is the most cost-effective conservation approach",
        "Predator control is an ineffective conservation strategy that should be discontinued",
        "All active conservation strategies produced population increases, with habitat restoration yielding the largest gains"
      ],
      correct: 3,
      explanation:
        "All three active strategies showed population growth (habitat +158%, captive +100%, predator +44%), while the control declined (-18%). Habitat restoration produced the largest increase. B accurately captures this. A overstates (predator control DID increase pop). C introduces cost (not in data). D predicts future (unsupported).",
      type: "data",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "Neuroscientist Dr. Yamamoto has proposed that the human brain's default mode network \u2014 the neural system active during daydreaming and mind-wandering \u2014 is not, as previously assumed, merely a passive resting state but rather an active process essential for creative problem-solving and future planning.\n\nClaim: Dr. Yamamoto's research challenges the prevailing view that mind-wandering represents unproductive brain activity.",
      stem: "Which finding would most directly support Dr. Yamamoto's challenge to the prevailing view?",
      choices: [
        "Many successful artists and scientists report that their best ideas come during periods of relaxation",
        "Brain imaging technology has become significantly more precise over the past decade",
        "The default mode network was first identified through brain imaging studies in the early 2000s",
        "Participants whose mind-wandering was experimentally suppressed scored 40% lower on subsequent creative problem-solving tasks than those allowed to daydream freely, despite showing no difference on routine analytical tasks"
      ],
      correct: 3,
      explanation:
        "The claim is that mind-wandering ISN'T unproductive \u2014 it helps creativity. B provides an experiment directly testing this: suppressing mind-wandering hurt creative performance but not analytical performance. This is specific, controlled, and directly demonstrates the productive role of daydreaming.",
      type: "textual",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "A longitudinal study examined the relationship between early childhood reading exposure and academic outcomes at age 15.\n\n| Reading exposure (ages 0-5) | Avg. reading score (age 15) | Avg. math score (age 15) | College enrollment rate |\n|---|---|---|---|\n| Daily (30+ min) | 92 | 84 | 78% |\n| Regular (3-5x/week) | 85 | 81 | 65% |\n| Occasional (1-2x/week) | 76 | 79 | 52% |\n| Rare (<1x/week) | 68 | 77 | 41% |\n\nScores normalized to 100-point scale. Sample: 8,000 children, controlled for family income.",
      stem: "Which claim is best supported by the data in the table?",
      choices: [
        "Reading to children directly causes them to score higher on reading tests",
        "Early reading exposure has a strong association with later reading achievement and college enrollment, but a much weaker association with math achievement",
        "Family income is the primary determinant of academic success",
        "Children who are not read to daily will not succeed academically"
      ],
      correct: 1,
      explanation:
        "Reading scores range widely (68-92, a 24-point spread) and college enrollment varies greatly (41-78%). But math scores barely change (77-84, only 7 points). A accurately captures this pattern: strong reading/enrollment association, weak math association. B overstates. C claims causation (the study shows correlation). D \u2014 income was controlled for, so it's held constant.",
      type: "data",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "The African elephant's complex social structure, led by a matriarch whose decades of accumulated knowledge guides the herd's decisions about migration routes, water sources, and threat responses, has been described by primatologist Dr. Moss as 'a living database of ecological intelligence.'\n\nClaim: The passage suggests that elephant herds benefit from the accumulated experience of their oldest members.",
      stem: "Which detail from the text most directly supports this claim?",
      choices: [
        "African elephants are social animals that live in herds",
        "Elephants have complex social structures",
        "The matriarch's decades of accumulated knowledge guides the herd's decisions about migration routes, water sources, and threat responses",
        "Dr. Moss is a primatologist who studies elephant behavior"
      ],
      correct: 2,
      explanation:
        "The claim is about benefiting from the OLDEST member's experience. B specifically names the matriarch's \"decades of accumulated knowledge\" and lists concrete ways it helps: migration, water, threats. Direct and specific. A, C, D are related but don't demonstrate the benefit.",
      type: "textual",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "Researchers measured air quality improvements after three cities implemented different traffic reduction policies.\n\n| City | Policy | PM2.5 before | PM2.5 after | Change | Cost (annual) |\n|---|---|---|---|---|---|\n| Oslo | Congestion pricing | 18.2 | 12.4 | -32% | $45M |\n| Bogot\u00e1 | Car-free days (weekly) | 31.5 | 26.1 | -17% | $8M |\n| Singapore | Electronic road pricing | 14.1 | 9.8 | -31% | $120M |\n\nPM2.5 measured in \u00b5g/m\u00b3. Lower = better air quality.",
      stem: "Which claim is best supported by the data in the table?",
      choices: [
        "Car-free days are more effective than congestion pricing at reducing air pollution",
        "While congestion pricing and electronic road pricing achieved similar percentage reductions in PM2.5 levels, Bogot\u00e1's lower-cost car-free day approach achieved a meaningful improvement at a fraction of the cost",
        "Oslo's congestion pricing achieved the greatest air quality improvement of any policy tested",
        "Singapore has the best air quality because it spends the most on traffic management"
      ],
      correct: 1,
      explanation:
        "Oslo (-32%) and Singapore (-31%) had similar reductions. Bogot\u00e1 achieved -17% at only $8M vs. Oslo's $45M and Singapore's $120M. B accurately describes all three comparisons. A is technically true (32% vs 31%) but only barely. C confuses spending with quality. D is contradicted by the data (-17% < -32%).",
      type: "data",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "Linguist Dr. Everett's controversial study of the Pirah\u00e3 people of the Amazon documented a language that appears to lack several features previously considered universal in human language, including number words beyond 'one' and 'many,' color terms, and recursive clause embedding \u2014 the ability to nest one sentence inside another.\n\nClaim: Dr. Everett's findings, if confirmed, would challenge fundamental assumptions in linguistics about the universal properties of human language.",
      stem: "Which aspect of the research most directly supports this claim?",
      choices: [
        "The Pirah\u00e3 language has a relatively small number of phonemes",
        "The absence of recursive embedding directly contradicts Noam Chomsky's influential theory that recursion is the one feature shared by all human languages",
        "The Pirah\u00e3 people live in a remote region of the Amazon",
        "Dr. Everett's study was considered controversial by other linguists"
      ],
      correct: 1,
      explanation:
        "The claim is about challenging UNIVERSAL assumptions. C identifies the most fundamental challenge: Chomsky's theory says recursion is universal, but Pirah\u00e3 may lack it. This directly contradicts a core claim about language universals. A is geography, B is reception, D is about phonemes (not presented as a universal feature).",
      type: "textual",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "A school district compared standardized test scores across schools that adopted different technology integration approaches.\n\n| Approach | Schools | Avg. score before | Avg. score after | Teacher satisfaction |\n|---|---|---|---|---|\n| 1:1 laptops | 12 | 72.3 | 74.1 | 61% |\n| Blended learning | 8 | 71.8 | 78.5 | 82% |\n| Flipped classroom | 6 | 73.1 | 77.2 | 74% |\n| No technology | 10 | 72.0 | 72.8 | 68% |\n\nScores are district standardized assessment averages. Implementation period: 2 years.",
      stem: "A district administrator claims that providing every student with a laptop is the most effective way to improve academic outcomes. Does the data support this claim?",
      choices: [
        "Yes, because the 1:1 laptop schools showed improvement in test scores",
        "Yes, because 1:1 laptop schools had the most schools participating in the study",
        "No, because while 1:1 laptops produced some improvement (+1.8 points), blended learning (+6.7) and flipped classrooms (+4.1) produced substantially larger gains, suggesting that HOW technology is used matters more than simply providing devices",
        "No, because technology has no effect on learning"
      ],
      correct: 2,
      explanation:
        "1:1 laptops improved by only 1.8 points. Blended learning gained 6.7 and flipped classroom gained 4.1 \u2014 both far more. Teacher satisfaction was also lowest for 1:1 laptops (61%). B accurately identifies that 1:1 laptops were the LEAST effective technology approach, not the most. A is technically true but misses the comparison.",
      type: "data",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "Marine biologist Dr. Sala's Project Pristine studied remote coral reefs that had never been exposed to human activity. Surprisingly, these pristine reefs were dominated by large predators \u2014 sharks, groupers, and jacks \u2014 which comprised up to 85% of the total fish biomass. This inverted the 'biomass pyramid' observed in human-impacted reefs, where small fish vastly outnumber predators.\n\nClaim: Dr. Sala's findings suggest that many existing models of marine ecosystems are based on degraded baselines rather than natural conditions.",
      stem: "Which aspect of the research most effectively supports this claim?",
      choices: [
        "Dr. Sala studied coral reefs in remote locations around the world",
        "Climate change threatens coral reefs worldwide",
        "The pristine reefs had an inverted biomass pyramid \u2014 dominated by predators rather than prey \u2014 which contradicts the pyramid structure that marine ecologists had long considered normal, indicating that the 'normal' model was based on ecosystems already altered by human activity",
        "Large predatory fish are important for maintaining reef health"
      ],
      correct: 2,
      explanation:
        "The claim is about models being based on degraded baselines. B provides the specific evidence: pristine reefs look fundamentally DIFFERENT from what was considered normal, implying that \"normal\" was actually \"degraded.\" The inverted pyramid directly demonstrates that existing models reflect human-impacted, not natural, conditions.",
      type: "textual",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "inferences",
    },
  ],

  /* ──────── CHALLENGE (Textual Evidence + Data items) ──────── */
  challenge: [
    {
      passage:
        "Psychologist Dr. Ahn conducted a controlled experiment in which participants were randomly assigned to spend 90 minutes walking in either a natural setting (a tree-lined park) or an urban setting (a busy commercial street). Before and after the walk, all participants completed standardized tests of working memory and attention.\n\nClaim: The study suggests that exposure to nature has measurable cognitive benefits.",
      stem: "Which finding would most effectively support this claim?",
      choices: [
        "Previous research has suggested that natural environments may reduce stress levels.",
        "Dr. Ahn has published extensively on the relationship between environment and psychology.",
        "The study was conducted in Portland, Oregon, during the summer months.",
        "Participants who walked in the natural setting showed a 20% improvement in working memory scores and a 15% improvement in sustained attention, while urban walkers showed no significant change."
      ],
      correct: 3,
      explanation:
        "The claim is about \"measurable cognitive benefits.\" B provides SPECIFIC measurements (20% working memory, 15% attention) directly demonstrating cognitive benefits. A is about the researcher's credentials, C is location/timing, D is about stress (not cognition). B is the only choice that MEASURES cognitive benefits.",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "Elena Ferrante's Neapolitan Quartet, while classified as literary fiction, incorporates elements drawn from soap opera, domestic melodrama, and coming-of-age narratives. The tetralogy follows two women from childhood in 1950s Naples through old age, embedding their personal drama within a panoramic portrayal of Italian political and social upheaval.\n\nClaim: The novelist's work challenges conventional expectations of the genre.",
      stem: "Which finding would most effectively support this claim?",
      choices: [
        "Elena Ferrante is a pseudonym; the author's true identity has been the subject of extensive speculation.",
        "The novels have been translated into more than 40 languages and adapted into an HBO television series.",
        "By blending elements traditionally associated with popular entertainment \u2014 soap opera dynamics, melodramatic plot turns \u2014 into a work of serious literary ambition, Ferrante dismantles the boundary between 'high' and 'low' fiction.",
        "The Neapolitan Quartet consists of four novels published between 2011 and 2014."
      ],
      correct: 2,
      explanation:
        "The claim is about \"challenging conventional expectations.\" B explicitly describes HOW Ferrante challenges genre boundaries \u2014 blending popular entertainment with literary ambition, dismantling high/low distinctions. A is publication info, C is about identity, D is about commercial success.",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "A comprehensive study of 750 manufacturing firms that adopted robotic automation between 2010 and 2020 yielded unexpected findings. While overall employment at these firms decreased by an average of 12%, the composition of the workforce shifted dramatically.\n\nClaim: The data indicate that the economic effects of automation are more complex than simple job displacement.",
      stem: "Which finding would most effectively support this claim?",
      choices: [
        "The study found that while low-skill production roles declined by 35%, firms simultaneously created new positions in robot maintenance, data analysis, and process optimization \u2014 roles that paid an average of 47% more than the displaced positions.",
        "Automation technologies have become significantly cheaper over the past decade.",
        "Several labor unions have opposed the adoption of automation in manufacturing.",
        "The firms in the study ranged in size from 50 to 10,000 employees."
      ],
      correct: 0,
      explanation:
        "The claim is about COMPLEXITY \u2014 not simple job loss. B shows that complexity: jobs were lost (35% decline in low-skill) BUT new, higher-paying jobs were created. This demonstrates the two-sided effect the claim describes. A, C, D don't address the complexity argument.",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "When the city undertook the restoration of the 18th-century Merchant's Hall, the architectural team faced repeated decisions about whether to maintain original features or adapt the building for contemporary use.\n\nClaim: The restoration project prioritized historical accuracy over modern convenience.",
      stem: "Which finding would most effectively support this claim?",
      choices: [
        "The Merchant's Hall was originally built in 1742 by a prominent local family.",
        "The restoration took three years and cost $12 million.",
        "The team chose to retain the building's original hand-blown window glass \u2014 which distorts light and provides no insulation \u2014 rather than replace it with modern energy-efficient alternatives, despite projected annual heating costs of $40,000 above what insulated windows would require.",
        "Several other historic buildings in the city have been restored in recent years."
      ],
      correct: 2,
      explanation:
        "The claim is about prioritizing accuracy OVER convenience. B provides a concrete example: keeping original glass DESPITE $40,000/year in extra heating costs. This directly shows choosing historical authenticity at the expense of modern efficiency. Highly specific and directly supports the claim.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "inferences",
    },
    {
      passage:
        "Developmental psychologist Dr. Kim designed a study comparing cognitive performance in 200 bilingual and 200 monolingual children aged 6-10. All participants were matched for socioeconomic status, parental education, and school quality to control for confounding variables.\n\nClaim: Dr. Kim's research suggests that bilingual children develop stronger executive function skills than monolingual peers.",
      stem: "Which finding would most effectively support this claim?",
      choices: [
        "Executive function refers to a set of cognitive processes including working memory, cognitive flexibility, and inhibitory control.",
        "Several previous studies had produced conflicting results on the relationship between bilingualism and cognition.",
        "Bilingual children in the study scored an average of 23% higher on tasks requiring cognitive flexibility and 18% higher on inhibitory control tasks, differences that remained statistically significant after controlling for all matched variables.",
        "Dr. Kim's study was funded by the National Science Foundation and published in the journal Developmental Psychology."
      ],
      correct: 2,
      explanation:
        "The claim is about bilingual children having STRONGER executive function. C provides specific data \u2014 23% higher on flexibility, 18% higher on inhibitory control, statistically significant after controls. This is the most direct, specific, measurable support. A is funding info, B is a definition, D is about prior research.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "inferences",
    },
  ],

  takeaways: [
    "Evidence must SUPPORT the specific claim, not just discuss the same topic — SUPPORTS is not the same as RELATES TO.",
    "For textual evidence: find the quotation that most directly and specifically confirms the stated claim.",
    "For data questions, follow the 3-step process: read labels first, identify trends, then match to the claim.",
    "Watch for correlation vs. causation traps — data showing two things happen together does not prove one causes the other.",
    "Always read axis labels, units, and footnotes before interpreting charts or tables.",
  ],
};
