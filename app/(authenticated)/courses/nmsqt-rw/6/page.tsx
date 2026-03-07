"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  StrengthVisual,
  FrameworkVisual,
  ScopeVisual,
} from "./lesson-visuals";

export default function NMSQTRWModule6() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "strength": <StrengthVisual />,
        "framework": <FrameworkVisual />,
        "scope": <ScopeVisual />,
      }}
      nextModuleHref="/courses/nmsqt-rw/7"
      nextModuleLabel="Module 7: Text Structure & Purpose"
      activities={{
        "exercise-dl": (goNext: () => void) => (
          <MatchingExercise
            items={DL_EXERCISE_DATA}
            title="Data Literacy Lab"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-traps": (goNext: () => void) => (
          <MatchingExercise
            items={TRAPS_EXERCISE_DATA}
            title="Traps"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-ch": (goNext: () => void) => (
          <MatchingExercise
            items={CH_EXERCISE_DATA}
            title="Challenge Mode"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

const DL_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "A researcher compiled data on renewable energy adoption in five industrialized nations.",
    "options": [
      "The UK had the largest absolute increase at 22 pp.",
      "All five countries increased their renewable share between 2015 and 2023.",
      "The three European countries each increased by at least 12 pp, while the US and Japan increased by 10 and 7 pp respectively.",
      "Germany increased from 31% to 52% while Japan increased from 15% to 22%."
    ],
    "correct": 2,
    "explanation": "(C) compares ALL European countries to BOTH non-European countries — the most comprehensive support."
  },
  {
    "prompt": "Researchers measured cognitive performance across four sleep-duration groups.",
    "options": [
      "The 7–8 hour group scored 88, higher than any other group including the 9+ hour group (82).",
      "Self-reported alertness decreased as sleep duration decreased.",
      "Reaction times were fastest for the 7–8 hour group (210ms) and slowest for under 5 hours (380ms).",
      "The under-5-hour group had the lowest scores at 61."
    ],
    "correct": 0,
    "explanation": "(A) shows the group outperformed even 9+ hours — establishing the inverted-U."
  },
  {
    "prompt": "An agricultural economist compared conventional and organic farming.",
    "options": [
      "Tomatoes have the highest yield per acre in both methods.",
      "Organic wheat yields are 25% lower than conventional.",
      "Organic prices are higher than conventional for all four crops.",
      "For soybeans, organic yields are only 14% lower but organic prices are 37% higher ($520 versus $380), suggesting comparable revenue per acre."
    ],
    "correct": 3,
    "explanation": "(C) shows BOTH the yield gap AND the price premium for one crop, directly demonstrating the offset."
  }
];

const TRAPS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "A statistics instructor compiled data on two variables that move together.",
    "options": [
      "Eating ice cream causes drowning.",
      "Drowning deaths have increased every year since 2019.",
      "Ice cream sales and drowning deaths tend to rise and fall together, likely due to a shared factor such as warm weather.",
      "Ice cream sales have no relationship to drowning deaths."
    ],
    "correct": 2,
    "explanation": "(B) correctly identifies correlation with a plausible shared cause. (A) = causation from correlation. (C) cherry-picks — deaths dropped in 2020."
  }
];

const CH_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "An education policy researcher compiled data across four U.S. regions.",
    "options": [
      "The West has the second-highest teacher salary ($63,100) but the second-highest student-teacher ratio (21:1) and only the third-highest graduation rate (84%), suggesting salary alone does not predict graduation rates as well as class size.",
      "The South has the lowest teacher salary and lowest graduation rate.",
      "Graduation rates range from 82% to 89% across all four regions.",
      "The Northeast has both the highest teacher salary ($68,400) and the highest graduation rate (89%)."
    ],
    "correct": 0,
    "explanation": "(B) identifies the West as a critical case: high salary but HIGH ratio and lower-than-expected graduation rate — showing ratio matters more."
  },
  {
    "prompt": "Psychologist Dr. Reyes claims that early childhood music education improves mathematical reasoning ability through the development of pattern recognition skills.",
    "options": [
      "Schools with music programs tend to have higher overall test scores than schools without them.",
      "Children who took piano lessons for two years scored 15% higher on standardized math tests than children who did not.",
      "A survey found that 85% of professional mathematicians played a musical instrument as children.",
      "Children who received 18 months of rhythm-focused music instruction showed significant improvements on both musical pattern completion tasks AND non-musical pattern recognition tests, with the gains in pattern recognition correlating strongly ($r = 0.72$) with their math score improvements."
    ],
    "correct": 3,
    "explanation": "(B) shows the full chain: music → pattern recognition improvement → correlated with math gains."
  },
  {
    "prompt": "Public health officials compared four vaccines for a tropical disease.",
    "options": [
      "VaxC has the lowest side-effect rate among the top three most effective vaccines.",
      "VaxC has the highest severe-disease efficacy at 97% and the longest duration of protection at 18 months, making it strongest on both metrics that the claim prioritizes.",
      "VaxD is the most affordable option at $12 per dose.",
      "VaxB has the highest mild-disease efficacy at 85%."
    ],
    "correct": 1,
    "explanation": "(B) shows VaxC is #1 on BOTH specific metrics the claim prioritizes."
  },
  {
    "prompt": "Archaeologist Dr. Wei argues that the decline of the Maya civilization was driven primarily by prolonged drought rather than warfare, as stalagmite oxygen-isotope records from cave systems across the Yucatan Peninsula show dramatic decreases in rainfall coinciding precisely with periods of urban abandonment.",
    "options": [
      "Maya cities were heavily fortified with defensive walls and watchtowers.",
      "Skeletal remains from the period show no increase in trauma injuries consistent with combat, while pollen records from lake sediments confirm a 40% decline in maize agriculture — consistent with crop failure rather than military disruption.",
      "Maya ceramic styles changed significantly during the period of decline.",
      "Other Mesoamerican civilizations also experienced periods of decline."
    ],
    "correct": 1,
    "explanation": "(B) does both: no combat injuries (weakens warfare) + crop failure evidence (supports drought)."
  },
  {
    "prompt": "Engineers evaluated materials for sustainable building construction.",
    "options": [
      "Carbon fiber is the strongest material at 1,600 MPa but has the highest CO$_2$ footprint.",
      "Steel has high recyclability and moderate cost.",
      "Bamboo composite produces only 200 kg CO$_2$/ton — less than $\\frac{1}{9}$ of steel, $\\frac{1}{40}$ of aluminum, and $\\frac{1}{110}$ of carbon fiber — while being the lightest material (800 kg/m$^3$) and costing only $400/ton.",
      "Bamboo composite has the lowest cost at $400/ton."
    ],
    "correct": 2,
    "explanation": "(C) addresses the environmental claim by comparing CO$_2$ across ALL materials with specific ratios."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "rw",
  moduleNum: 6,
  title: "Command of Evidence",
  subtitle:
    "Textual and quantitative evidence skills -- match claims to proof.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-dl", label: "Data Literacy Lab", icon: "zap" },
    { id: "exercise-traps", label: "Traps", icon: "zap" },
    { id: "exercise-ch", label: "Challenge Mode", icon: "zap" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "star" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  warmup: [
    {
      source: "Module 4 -- Words in Context",
      stem: "The city's decision to convert abandoned railway lines into elevated parks _______ both its commitment to green space and its creative approach to urban renewal.\n\nWhich word best completes the text?",
      choices: ["exemplified", "questioned", "obscured", "undermined"],
      correct: 0,
      explanation: 'Converting railways into parks shows commitment and creativity. "Exemplified."',
    },
    {
      source: "Module 3 -- Agreement",
      stem: "The orchestra performed the symphony with technical precision _______ the emotional depth of the interpretation left many audience members visibly moved.\n\nWhich choice conforms to Standard English?",
      choices: ["and; the", "and, the", "and the", ", and the"],
      correct: 3,
      explanation: 'Two ICs joined by comma + "and" (FANBOYS). The comma goes before "and."',
    },
    {
      source: "Module 5 -- Inferences",
      stem: "Rooftop gardens reduced energy use by 25%, but installation costs remain prohibitive, suggesting that _______\n\nWhich choice most logically completes the text?",
      choices: ["all buildings should be required to install them.", "rooftop gardens have no environmental benefits.", "adoption will require financial incentives to offset initial costs.", "energy consumption is unrelated to building design."],
      correct: 2,
      explanation: "Benefits + cost barrier = need subsidies.",
    },
    {
      source: "Module 3 -- Parallelism",
      stem: "The report highlighted three achievements: reducing emissions by 30%, _______ and eliminating single-use plastics.\n\nWhich choice conforms to Standard English?",
      choices: ["the implementation of renewable energy,", "implementing renewable energy,", "to implement renewable energy,", "renewable energy was implemented,"],
      correct: 1,
      explanation: "Parallel gerunds: reducing, implementing, eliminating.",
    },
    {
      source: "Module 4 -- Words in Context",
      stem: "The historian argues that the conventional narrative _______ their actual positions, as private letters reveal deep reservations.\n\nWhich word best completes the text?",
      choices: ["captures", "validates", "oversimplifies", "strengthens"],
      correct: 2,
      explanation: '"Deep reservations" contradicts "unified champions" -- oversimplifies.',
    },
    {
      source: "Module 5 -- Evidence",
      stem: "A study found that free-ranging cats kill 1.3--4 billion birds annually in the U.S., making them the largest source of anthropogenic bird mortality.\n\nHow does this finding relate to the claim that outdoor cats harm bird populations?",
      choices: ["It raises an unrelated comparison.", "It provides a counterexample.", "It qualifies the claim.", "It offers direct quantitative support."],
      correct: 3,
      explanation: 'Specific kill numbers = direct quantitative support for "harm."',
    },
  ],

  lessons: [
    {
      id: "intro",
      title: "Two Types of Evidence, One Skill",
      subtitle: "Why this matters",
      body: [
        "Command of Evidence questions come in two flavors: Textual (~4 questions) and Quantitative (~4 questions), totaling about 8 of your 54 questions.",
        "Textual evidence asks \"Which quotation best supports this claim?\" Quantitative evidence gives you a table or graph and asks you to complete a statement using the data.",
        "The core skill is the same: match the evidence precisely to the claim. The #1 trap is evidence that's related to the topic but doesn't actually support the specific claim.",
      ],
      visual: "strength",
    },
    {
      id: "textual",
      title: "The 'Related but Not Supporting' Trap",
      subtitle: "Evidence matching strategy",
      body: [
        "All four quotations will be related to the topic. But only one directly supports the specific claim. The others may describe the topic, provide background, or even subtly contradict.",
        "Ask yourself: \"Does this quotation PROVE the claim, or just MENTION the topic?\"",
        "STRATEGY: 1) Underline the specific assertion in the claim. 2) For each quotation: \"If I only had this quote, would I believe the claim?\" 3) Eliminate: background (context), related (same topic, different point), contradictory (weakens claim). 4) The correct answer has a direct logical link.",
      ],
      visual: "framework",
    },
    {
      id: "quantitative",
      title: "Reading Tables and Graphs",
      subtitle: "Data literacy strategy",
      body: [
        "Step 1: Read intro text for context. Step 2: Read the statement \u2014 what specific data does it need? Step 3: Find that exact cell/point in the data. Step 4: Match to the most accurate answer.",
        "The correct choice addresses ALL parts of the claim, not just one data point.",
      ],
      visual: "scope",
    },
    {
      id: "traps",
      title: "Three Ways Data Questions Trick You",
      subtitle: "Common quantitative traps",
      body: [
        "TRAP #1 \u2014 Misreading the Scale: A bar that looks twice as tall might represent a 20% increase, not 100%. Always read axis labels and values.",
        "TRAP #2 \u2014 Correlation \u2260 Causation: Data showing two things happen together warrants \"is associated with\" \u2014 not \"causes.\" Wrong answers say \"causes\" unless the passage establishes causation.",
        "TRAP #3 \u2014 Cherry-Picking: An answer might cite one data point accurately but ignore the overall trend. Check if it reflects the FULL picture.",
      ],
    },
  ],

  quiz: [
    {
      passage: "Linguist Dr. Patel argues that endangered languages contain irreplaceable knowledge about local ecosystems that is lost when the language dies.",
      stem: "Which finding would most directly support Patel's claim?",
      choices: ["Most endangered languages are spoken by fewer than 1,000 people.", "The number of endangered languages has doubled since 1950.", "The Tuyuca language of the Amazon has 52 distinct terms for types of rainfall that correspond to specific ecological conditions Western science has no vocabulary for.", "Language preservation programs have been implemented in 30 countries."],
      correct: 2,
      explanation: "The claim is about IRREPLACEABLE ecosystem knowledge. (B) shows specific ecological terms with no Western equivalent.",
      type: "Textual Evidence",
      domain: "Information & Ideas",
      skill: "details_evidence",
    },
    {
      passage: "Economist Dr. Torres argues that automation will disproportionately impact workers without college degrees.",
      stem: "Which finding would most directly support Torres's claim?",
      choices: ["Several technology companies have eliminated degree requirements for software engineering positions.", "Automation has increased manufacturing productivity by 30%.", "College enrollment has declined by 15% over the past decade.", "A Bureau of Labor Statistics analysis found that 85% of jobs at high risk of automation require no formal education beyond high school."],
      correct: 3,
      explanation: "The claim is about DISPROPORTIONATE impact on non-college workers. (B) shows 85% of high-risk jobs need no degree.",
      type: "Textual Evidence",
      domain: "Information & Ideas",
      skill: "details_evidence",
    },
    {
      passage: "Archaeologist Dr. Yolanda Rivera has spent a decade excavating a pre-Columbian settlement. Her team discovered raised garden beds 200 years older than any previously documented example.",
      stem: "Which choice best states the main idea of the text?",
      choices: ["The Aztecs invented raised garden beds.", "Agricultural practices in pre-Columbian Mexico were advanced.", "Rivera has spent ten years at a site in central Mexico.", "Rivera's discovery suggests the raised garden technique originated earlier and in a different location than scholars previously believed."],
      correct: 3,
      explanation: "(A) captures the discovery's significance. (B) Too Narrow. (C) Contradicts. (D) Too Broad.",
      type: "Central Ideas",
      domain: "Information & Ideas",
      skill: "details_evidence",
    },
    {
      passage: "A study found that students who took practice tests retained 50% more information one week later than students who spent the same amount of time re-reading material. The benefit held even without feedback -- simply the act of retrieving information strengthened the memory itself. The researchers concluded that _______",
      stem: "Which choice most logically completes the text?",
      choices: ["all students should replace all studying with practice tests.", "practice tests are only useful when followed by immediate feedback.", "the cognitive act of retrieval, not the correction of errors, is the primary mechanism by which practice testing improves long-term retention.", "re-reading is a completely worthless study strategy."],
      correct: 2,
      explanation: "Benefit held WITHOUT feedback = retrieval itself (not error correction) drives the effect.",
      type: "Inferences",
      domain: "Information & Ideas",
      skill: "details_evidence",
    },
    {
      passage: "Marine archaeologist Dr. Al-Hassan uses satellite imagery to locate ancient shipwrecks by identifying distinctive discoloration patterns in sediment. In three years, she has identified 47 potential wreck sites -- 12 confirmed through underwater excavation.",
      stem: "Which choice best states the main idea of the text?",
      choices: ["The Mediterranean contains more shipwrecks than any other body of water.", "Satellite-based detection of sediment patterns offers a productive new method for locating ancient shipwrecks.", "Dr. Al-Hassan has found 47 potential shipwreck sites.", "Underwater excavation is the only reliable way to confirm shipwreck locations."],
      correct: 1,
      explanation: "(A) captures the method and its success. (B) Too Narrow. (C) Off-Topic. (D) Unsupported.",
      type: "Central Ideas",
      domain: "Information & Ideas",
      skill: "details_evidence",
    },
    {
      passage: "Urban planners compiled data showing Singapore has 47 km$^2$ of park area with 8,200 trees per km$^2$ and air quality index of 52, while Phoenix has 15 km$^2$ of park area with 950 trees per km$^2$ and air quality index of 78.",
      stem: "Which choice supports the claim that higher tree density is associated with better air quality?",
      choices: ["Singapore has the largest park area at 47 km$^2$.", "Singapore has the highest tree density (8,200/km$^2$) and better air quality (52) than Phoenix, which has the lowest tree density (950/km$^2$) and worst air quality (78).", "Singapore has the highest tree density and the highest average temperature.", "London's average temperature is 11.9\u00B0C, the lowest among the four cities."],
      correct: 1,
      explanation: "The claim links tree density to air quality. (B) compares high-tree/good-AQI with low-tree/bad-AQI.",
      type: "Quantitative Evidence",
      domain: "Information & Ideas",
      skill: "details_evidence",
    },
  ],

  challenge: [
    {
      passage: "Geologists analyzing ice cores from Antarctica discovered that atmospheric CO$_2$ levels and global temperatures have risen and fallen in close synchronization over the past 800,000 years. However, detailed analysis reveals that temperature increases consistently precede CO$_2$ increases by approximately 200 to 800 years. Climate scientists note that this lag does not undermine the role of CO$_2$ in climate change because _______",
      stem: "Which choice most logically completes the text?",
      choices: ["temperature always causes CO$_2$ changes, never the reverse.", "the ice core data is unreliable and should be disregarded.", "CO$_2$ has no effect on global temperature.", "the initial temperature rise from orbital changes triggers CO$_2$ release, which then amplifies warming in a feedback cycle."],
      correct: 3,
      explanation: "Scientists say the lag doesn't undermine CO$_2$'s role -- orbital warming triggers CO$_2$ release which causes MORE warming (feedback).",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "details_evidence",
    },
    {
      passage: "Urban planners in Singapore implemented a congestion pricing system that charges drivers variable fees. Peak-hour traffic volume decreased by 22% and public transit ridership increased by 18%. However, the reduction in driving was concentrated almost entirely among lower- and middle-income commuters, while high-income drivers continued using roads at pre-implementation rates. Critics argue that _______",
      stem: "Which choice most logically completes the text?",
      choices: ["public transit is inherently inferior to private car transportation.", "congestion pricing effectively functions as a regressive tax that prices lower-income drivers off the road while leaving wealthy drivers' behavior unchanged.", "Singapore should eliminate all road fees to promote equity.", "congestion pricing has no effect on traffic volume."],
      correct: 1,
      explanation: "Traffic reduction only from lower/middle income + wealthy unchanged = system disproportionately affects less wealthy.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "details_evidence",
    },
    {
      passage: "Geneticist Dr. Elena Vasquez studies epigenetic changes in children of parents who experienced severe famine. Her research found that these children show distinct metabolic patterns, including heightened fat storage and altered insulin sensitivity, even when raised with adequate nutrition. Vasquez proposes that _______",
      stem: "Which choice most logically completes the text?",
      choices: ["epigenetic changes are always harmful to offspring.", "parental experiences of famine can trigger epigenetic changes that affect offspring metabolism independently of the offspring's own nutritional environment.", "all children of famine survivors will develop metabolic disorders.", "DNA mutations caused by famine are passed to the next generation."],
      correct: 1,
      explanation: 'Parents\' famine -> children\'s metabolism changed despite adequate nutrition = experience transmitted epigenetically. (B) Contradicts -- "don\'t alter the DNA sequence."',
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "details_evidence",
    },
  ],

  takeaways: [
    "Command of Evidence questions come in two flavors: Textual (~4 questions) and Quantitative (~4 questions), totaling about 8 of your 54 questions.",
    "All four answer choices will be related to the topic. Only one directly supports the specific claim -- ask 'Does this PROVE the claim, or just MENTION the topic?'",
    "For quantitative evidence, read the claim first, then find the exact data that addresses ALL parts of it -- not just one data point.",
    "Three common data traps: misreading the scale, assuming correlation equals causation, and cherry-picking one data point while ignoring the overall trend.",
    "The correct choice addresses ALL parts of the claim, not just one component. Partial matches are trap answers.",
  ],
};
