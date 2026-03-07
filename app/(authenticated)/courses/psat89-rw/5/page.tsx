"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  LitmusTestVisual,
  GraphicTypesVisual,
  IntegrationPatternsVisual,
} from "./lesson-visuals";

const TEV_EXERCISE: MatchingItem[] = [
  {
    prompt: `The author suggests that urban gardens provide significant mental health benefits to city residents.\n\nWhich quote from the passage best supports this claim?`,
    options: [
      `\u201CUrban gardens have become increasingly common in cities across the United States, with over 29,000 community gardens now operating nationwide.\u201D`,
      `\u201CParticipants who gardened for at least 30 minutes per week reported 40% lower stress levels and significantly fewer symptoms of depression compared to non-gardeners.\u201D`,
      `\u201CMany urban gardens grow vegetables and herbs that are donated to local food banks.\u201D`,
      `\u201CThe city allocated $2.5 million for new garden spaces in underserved neighborhoods.\u201D`
    ],
    correct: 1,
    explanation: "Quote B directly proves the mental health claim with specific data (40% lower stress, fewer depression symptoms). A is about prevalence, not benefits. C is about food access. D is about funding."
  },
  {
    prompt: `Dr. Nakamura\u2019s research demonstrates that sleep deprivation impairs academic performance in adolescents.\n\nWhich quote from the passage best supports this claim?`,
    options: [
      `\u201CAdolescents require 8\u201310 hours of sleep per night, according to the American Academy of Pediatrics.\u201D`,
      `\u201CDr. Nakamura has studied adolescent sleep patterns for over fifteen years at Stanford University.\u201D`,
      `\u201CIn Nakamura\u2019s longitudinal study, students averaging fewer than 6 hours of sleep per night earned GPAs 0.7 points lower than well-rested peers, even after controlling for prior achievement.\u201D`,
      `\u201CSleep deprivation has been linked to increased rates of automobile accidents among teenage drivers.\u201D`
    ],
    correct: 2,
    explanation: `Quote C directly links sleep deprivation to lower GPAs (academic performance) with specific data from Nakamura\u2019s actual research. A states a recommendation, not a finding. B is background, not evidence. D is about accidents, not academics.`
  },
  {
    prompt: "The passage indicates that traditional farming methods are more environmentally sustainable than industrial agriculture.\n\nWhich quote from the passage best supports this claim?",
    options: [
      `\u201CTraditional farms typically occupy smaller land areas and produce lower crop yields per acre.\u201D`,
      `\u201CIndustrial agriculture accounts for approximately 70% of global freshwater withdrawals and contributes an estimated 14% of global greenhouse gas emissions, whereas traditional polyculture farms use 80% less water and produce negligible emissions.\u201D`,
      `\u201CMany consumers prefer the taste of organically grown produce.\u201D`,
      `\u201CTraditional farming has been practiced for thousands of years across diverse cultures.\u201D`
    ],
    correct: 1,
    explanation: "Quote B directly compares environmental impact: industrial uses more water (70%) and produces more emissions (14%) vs. traditional (80% less water, negligible emissions). This PROVES the sustainability claim. A mentions yield but not sustainability. C is about taste. D is about history."
  }
];

const TBQ_EXERCISE: MatchingItem[] = [
  {
    prompt: "Which country has the highest percentage of renewable energy?",
    options: [
      "Germany",
      "Norway",
      "China",
      "India"
    ],
    correct: 1,
    explanation: "Norway has 98% renewable energy, the highest in the table. This is largely due to hydroelectric power."
  },
  {
    prompt: `A researcher claims that large populations necessarily lead to high per-capita CO<sub>2</sub> emissions. Does the table support this claim?`,
    options: [
      `Yes \u2014 China and India have the largest populations and highest emissions.`,
      `No \u2014 India has a massive population but the lowest per-capita emissions in the table.`,
      "Yes \u2014 the United States has the highest emissions and largest population.",
      "The table does not contain relevant data."
    ],
    correct: 1,
    explanation: `India has 1,408 million people but only 1.9 tons per capita \u2014 the lowest in the table. This directly contradicts the claim that large populations necessarily mean high per-capita emissions.`
  },
  {
    prompt: "Based on the table, which statement is best supported?",
    options: [
      "Norway has eliminated fossil fuel use entirely.",
      `The United States produces more total CO<sub>2</sub> than any other country listed.`,
      `Countries with higher renewable energy percentages tend to have lower per-capita CO<sub>2</sub> emissions in this sample.`,
      `India\u2019s low emissions prove it is the most environmentally responsible country.`
    ],
    correct: 2,
    explanation: `Norway (98% renewable, 7.5 tons) vs. US (21% renewable, 14.7 tons) supports this trend. A is wrong (98% \u2260 100%). B conflates per-capita with total. D says \u201Cprove\u201D and \u201Cmost responsible\u201D \u2014 the data doesn\u2019t show that.`
  }
];

const GRQ_EXERCISE: MatchingItem[] = [
  {
    prompt: "Which claim about the data is best supported by the graph?",
    options: [
      `Adults ages 25\u201334 have the lowest screen time of any group.`,
      `Teenagers ages 13\u201317 average more daily screen time than any adult age group shown.`,
      "Screen time decreases steadily with age.",
      `Children ages 8\u201312 spend more time on screens than adults ages 35\u201344.`
    ],
    correct: 1,
    explanation: ""
  },
  {
    prompt: "Which finding from the graph would most directly support an argument for increased funding for after-school programs?",
    options: [
      "Sports is the most popular after-school activity.",
      "28% of students participate in no after-school activity, suggesting unmet demand for accessible programs.",
      "Academic clubs have the lowest participation rate among structured activities.",
      "More students participate in sports than in music and drama combined."
    ],
    correct: 1,
    explanation: `B connects the 28% non-participation rate to the FUNDING argument: if over a quarter of students aren\u2019t in any program, more funding could create programs to reach them. A, C, and D are accurate readings of the data but don\u2019t support the specific claim about needing MORE funding.`
  }
];

const TRAPS_EXERCISE: MatchingItem[] = [
  {
    prompt: "The author argues that electric vehicles (EVs) are becoming more affordable for average consumers.",
    options: [
      `\u201CThe average price of an electric vehicle dropped from $56,000 in 2022 to $43,000 in 2024, bringing EVs within reach of middle-income households for the first time.\u201D`,
      `\u201CElectric vehicle sales have increased by 60% over the past three years, making EVs one of the fastest-growing segments of the automobile market.\u201D`
    ],
    correct: 0,
    explanation: `Trap: Same topic, different claim. The wrong quote proves EVs are POPULAR (sales up 60%), not that they\u2019re AFFORDABLE. Popularity and affordability are related but different claims. The correct quote directly addresses price and affordability.`
  },
  {
    prompt: `Research suggests that music education improves students\u2019 mathematical reasoning abilities.`,
    options: [
      `\u201CIn a controlled study, students who received two years of music instruction scored 23% higher on spatial-temporal reasoning tests \u2014 a skill directly linked to mathematical problem-solving.\u201D`,
      `\u201CStudents enrolled in music programs reported higher levels of overall school satisfaction and were 20% more likely to describe themselves as \u2018engaged learners.\u2019\u201D`
    ],
    correct: 0,
    explanation: "Trap: Partial support (related benefit, wrong benefit). The wrong quote shows music helps with ENGAGEMENT and SATISFACTION, not MATH. These are different outcomes. The correct quote specifically links music to spatial-temporal reasoning, which connects to mathematical ability."
  },
  {
    prompt: "The data in the table indicates that Country X has reduced its carbon emissions more than any other nation in the study.",
    options: [
      `\u201CCountry X\u2019s per-capita emissions fell from 9.8 tons in 2010 to 3.2 tons in 2024 \u2014 a 67% reduction, the largest percentage decrease of any nation in the study.\u201D`,
      `\u201CCountry X currently produces 3.2 tons of CO<sub>2</sub> per capita, the lowest figure among all nations surveyed.\u201D`
    ],
    correct: 0,
    explanation: `Trap: Current state vs. change over time. The wrong quote shows Country X has the LOWEST current emissions, not the LARGEST reduction. Having low emissions now doesn\u2019t prove you reduced them the most \u2014 they could have always been low. The correct quote shows the actual decrease (67%).`
  }
];

export default function PSAT89RWModule5() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "litmus-test": <LitmusTestVisual />,
        "graphic-types": <GraphicTypesVisual />,
        "integration-patterns": <IntegrationPatternsVisual />,
      }}
      activities={{
        "exercise-tev": (goNext: () => void) => (
          <MatchingExercise
            items={TEV_EXERCISE}
            title="Tev"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-tbq": (goNext: () => void) => (
          <MatchingExercise
            items={TBQ_EXERCISE}
            title="Tbq"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-grq": (goNext: () => void) => (
          <MatchingExercise
            items={GRQ_EXERCISE}
            title="Grq"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-traps": (goNext: () => void) => (
          <MatchingExercise
            items={TRAPS_EXERCISE}
            title="Traps"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/psat89-rw/6"
      nextModuleLabel="Module 6: Sentence Boundaries & Punctuation"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "rw",
  moduleNum: 5,
  title: "Command of Evidence",
  subtitle:
    "Topic 5A \u2014 The claim-evidence connection",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-tev", label: "Tev", icon: "zap" },
    { id: "exercise-tbq", label: "Tbq", icon: "zap" },
    { id: "exercise-grq", label: "Grq", icon: "zap" },
    { id: "exercise-traps", label: "Traps", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "5a",
      title: "Selecting the Best Textual Evidence",
      subtitle: "Topic 5A \u2014 The claim-evidence connection",
      body: [
        `These questions give you a claim and ask: \u201CWhich quote from the passage best supports this claim?\u201D The claim is always stated in the question \u2014 your job is to find the evidence.`,
        `Step 1: Read the claim carefully. Underline key words.\nStep 2: For each quote, ask: \u201CDoes this PROVE the claim, or just relate to the same topic?\u201D\nStep 3: The best evidence makes the claim feel inevitable. If the quote is true, the claim MUST be true.\nStep 4: Eliminate quotes that are about the topic but don\u2019t actually support the specific claim.`,
        `Common Traps:\n\u2022 \u201CSame topic\u201D trap: A quote mentions the same subject but doesn\u2019t actually support the claim. (Claim: \u201Cbees are declining.\u201D Trap quote: \u201CBees are essential pollinators.\u201D \u2014 true, but doesn\u2019t support the decline claim.)\n\u2022 \u201CInteresting but irrelevant\u201D trap: A quote that\u2019s the most vivid or memorable but doesn\u2019t address the specific claim.\n\u2022 \u201CPartial support\u201D trap: A quote supports part of the claim but misses the key element.`,
        `The Litmus Test: After selecting your answer, re-read the claim and your chosen quote back-to-back. Does the quote make you say \u201CYes, that proves it\u201D? If not, try another option.`
      ],
      visual: "litmus-test",
    },
    {
      id: "5b",
      title: "Reading Tables, Bar Graphs & Line Graphs",
      subtitle: "Topic 5B \u2014 Three graphic types and how to read them",
      body: [
        "These questions pair a passage with a table, bar graph, or line graph. You need to read the data AND connect it to the passage. This is the only place data graphics appear on the R&W section.",
        `Three Steps for Quantitative Evidence:\nStep 1: Read the graphic first. Title, labels, units, scale. What does each row/column/bar/line represent?\nStep 2: Read the passage. What claim does the author make? Does the data support, weaken, or extend it?\nStep 3: Match data to claim. Find the specific number(s) in the graphic that directly support or contradict the claim in question.`,
        `What to Look For in Each Graphic Type:\n\u2022 Tables: Compare specific values across rows/columns. Look for highest, lowest, differences, and trends.\n\u2022 Bar graphs: Compare categories. Taller bar = larger value. Look for which category is biggest/smallest and relative differences.\n\u2022 Line graphs: Show change over time. Look for increases, decreases, peaks, valleys, and overall trend direction.`,
        `Critical distinction: The question may ask \u201CWhich choice is supported by the data?\u201D or \u201CWhich choice effectively uses data from the graphic?\u201D These are asking you to find the claim that the numbers actually prove \u2014 not just a claim about the same topic.`,
        `Common Quantitative Traps:\n\u2022 Misreading the scale: A bar that looks twice as tall might only represent a 10% difference if the axis doesn\u2019t start at zero.\n\u2022 Confusing correlation with causation: The data shows two things changed together, but doesn\u2019t prove one caused the other.\n\u2022 Going beyond the data: The answer predicts a future trend the data doesn\u2019t support.\n\u2022 Wrong row/column: Reading the number from the wrong category in a table.`
      ],
      visual: "graphic-types",
    },
    {
      id: "5c",
      title: "Synthesizing Passage + Data",
      subtitle: "Topic 5C \u2014 When you need both the text AND the numbers",
      body: [
        "The hardest quantitative questions ask you to combine information from BOTH the passage and the graphic. Neither source alone gives you the answer.",
        `Integration Patterns:\n\u2022 Data supports the passage: The passage makes a claim and the table/graph provides the numbers that prove it.\n\u2022 Data complicates the passage: The passage makes a claim but the data shows an exception or limitation.\n\u2022 Data extends the passage: The passage discusses a concept and the data adds specific numbers or examples.\n\u2022 Passage provides context for data: The raw numbers don\u2019t mean much without the passage explaining what they represent.`,
        `Key Question: \u201CDoes the data in the graphic support, weaken, or have no bearing on the claim in the passage?\u201D\nStrategy: Identify the passage\u2019s specific claim. Find the specific data point(s) that address that claim. Check if the numbers confirm or contradict.`,
        `Remember: On the PSAT 8/9, you never need to calculate anything complex from the data. The questions test whether you can READ the graphic accurately and CONNECT it to the passage logically. If you\u2019re doing complicated math, you\u2019re probably overthinking it.`
      ],
      visual: "integration-patterns",
    },
  ],

  /* -------- PRACTICE QUIZ -------- */
  quiz: [
    {
      stem: "Which quote from Dr. Reyes\u2019s research would best support the claim that microplastics harm fish reproduction?",
      choices: [
        `\u201CDr. Reyes\u2019s laboratory at the University of Miami is one of the leading centers for marine pollution research.\u201D`,
        `\u201CMicroplastics have been found in every ocean basin surveyed, from the Arctic to the Antarctic.\u201D`,
        `\u201CCoastal communities that depend on fishing have expressed concern about declining fish stocks.\u201D`,
        `\u201CFish exposed to microplastic concentrations above 50 particles per liter produced 35% fewer viable eggs and exhibited a 28% decline in larval survival rates.\u201D`
      ],
      correct: 3,
      explanation: "B provides specific data (35% fewer eggs, 28% lower survival) directly linking microplastics to reproductive decline. A is about distribution, not harm. C is background. D is about community concern, not scientific evidence.",
    },
    {
      stem: "Which finding would best support the claim that economic interests were the primary motivation?",
      choices: [
        `\u201CThousands of Chinese and Irish immigrants provided the labor that made construction possible.\u201D`,
        `\u201CThe transcontinental railroad was completed on May 10, 1869, at Promontory Summit, Utah.\u201D`,
        `\u201CThe railroad connected the east and west coasts for the first time, symbolizing a united nation.\u201D`,
        `\u201CCongressional debates from 1862 reveal that 78% of arguments in favor of the railroad cited specific economic projections, while only 15% invoked national unity.\u201D`
      ],
      correct: 3,
      explanation: `B provides direct evidence from primary sources (Congressional debates) showing economic arguments vastly outnumbered unity arguments (78% vs 15%). This directly supports the \u201Cprimarily economic\u201D claim.`,
    },
    {
      stem: "Based on the table, which statement is best supported?",
      choices: [
        "Coffee is the unhealthiest beverage because it has the most caffeine.",
        "Green tea offers caffeine with no sugar or calories, making it a lower-impact alternative to coffee.",
        "Energy drinks are healthier than orange juice because they have fewer calories.",
        "Cola contains more sugar and calories than any other beverage listed."
      ],
      correct: 1,
      explanation: `Green tea: 28mg caffeine, 0g sugar, 0 calories. This is factually supported by the table and relevant to the nutritionist\u2019s concern about sugar. A conflates caffeine with \u201Cunhealthiest.\u201D B is wrong (cola has the most sugar at 39g, not OJ which has the least at 21g). D ignores sugar content.`,
    },
    {
      stem: `Which quote would best support Dr. Osei\u2019s specific claim about collaborative learning and complex problem-solving?`,
      choices: [
        `\u201CStudents generally report preferring group work to individual assignments.\u201D`,
        `\u201CStudents who studied vocabulary individually outperformed those in groups on a next-day recall test.\u201D`,
        `\u201CCollaborative learning has been practiced in educational settings since the early twentieth century.\u201D`,
        `\u201CIn a controlled experiment, groups of three solved multi-step logic puzzles 40% faster and with 25% greater accuracy than individuals working alone.\u201D`
      ],
      correct: 3,
      explanation: `B provides experimental evidence specifically about complex tasks (multi-step logic puzzles) showing groups outperformed individuals. A is about preference, not outcomes. C is history. D actually supports the INDIVIDUAL study caveat, not the collaborative claim.`,
    },
    {
      stem: "Which claim about the data is best supported by the graph?",
      choices: [
        "Yosemite has the fewest visitors because it is the least scenic park.",
        "Visitor numbers have been declining at all national parks.",
        `Grand Canyon receives the most visitors of the parks shown, which may intensify the overcrowding concerns described in the passage.`,
        "All national parks receive more than 5 million visitors annually."
      ],
      correct: 2,
      explanation: `Grand Canyon = 6.4 million, the highest bar. Combined with the passage\u2019s overcrowding concerns, B makes a supported connection. A is false (Yosemite = 3.9M). C makes an unsupported causal claim. D discusses trends not shown in the graph.`,
    },
    {
      stem: "Which finding would most effectively illustrate the durability claim made in the passage?",
      choices: [
        `\u201CModern highway construction costs approximately $2\u20134 million per mile.\u201D`,
        `\u201CA section of the Appian Way, constructed in 312 BCE, still bears vehicle traffic today with no structural reinforcement in over two millennia.\u201D`,
        `\u201CThe Roman road network eventually extended over 250,000 miles across the empire.\u201D`,
        `\u201CRoman engineers used slave labor to construct most major roads.\u201D`
      ],
      correct: 1,
      explanation: `B provides a concrete, specific example of a Roman road still functioning after 2,300+ years \u2014 directly illustrating the \u201Cremarkable durability\u201D claim. A is about extent, not durability. C is about labor. D is about modern costs.`,
    },
    {
      stem: "Which statement is best supported by both the passage and the table?",
      choices: [
        "Students should always use spaced repetition because it produces the highest scores.",
        "Study time is the most important factor in test performance.",
        "Practice testing and spaced repetition, both active recall strategies, produce higher test scores and better retention than passive methods like re-reading and highlighting.",
        "Highlighting is the most efficient study method because it requires the least time."
      ],
      correct: 2,
      explanation: `The passage advocates for active recall. The table shows practice testing (85%, 67% retention) and spaced repetition (88%, 74%) outperform re-reading (72%, 38%) and highlighting (70%, 35%). B correctly synthesizes BOTH sources. A ignores scores. C uses \u201Calways.\u201D D is contradicted (highlighting takes least time but scores lowest).`,
    },
    {
      stem: `Which evidence would most directly challenge the \u201Cconfusion\u201D misconception mentioned in the passage?`,
      choices: [
        `\u201CAnalysis of 500 recorded code-switching instances revealed that 97% followed the grammatical rules of both languages simultaneously, with switches occurring only at syntactically permissible points.\u201D`,
        `\u201CMany bilingual parents encourage their children to use one language at home and another at school.\u201D`,
        `\u201CCode-switching is more common in informal settings than in formal ones.\u201D`,
        `\u201CCode-switching is observed in bilingual communities worldwide.\u201D`
      ],
      correct: 0,
      explanation: `B directly disproves \u201Cconfusion\u201D: if 97% of switches follow BOTH languages\u2019 grammar rules at syntactically permissible points, this is precision, not confusion. The data proves sophisticated competence. A, C, and D are related but don\u2019t address the confusion claim.`,
    },
    {
      stem: `A student claims: \u201CThe graph proves that getting a college degree causes you to earn more money.\u201D Based on both the passage and the graph, which response best evaluates this claim?`,
      choices: [
        `The claim is fully supported \u2014 the graph clearly shows higher education leads to higher income.`,
        "The claim accurately describes the data pattern but overstates what can be concluded, since the passage notes that correlation does not prove causation.",
        `The claim is completely wrong \u2014 education has no relationship to income.`,
        `The graph contradicts the passage\u2019s argument.`
      ],
      correct: 1,
      explanation: `The graph DOES show higher income at higher education levels (the pattern is real). But the passage warns that correlation \u2260 causation. B captures both: the data pattern is accurate, but \u201Cproves\u201D and \u201Ccauses\u201D go beyond what the data can show. This is the most nuanced, accurate reading.`,
    },
    {
      stem: `Which textual evidence would best support the researchers\u2019 emphasis on integrated multi-modal networks?`,
      choices: [
        `\u201CMany cities have faced political opposition to public transit funding from suburban constituents.\u201D`,
        `\u201CPublic transit reduces greenhouse gas emissions by an estimated 37 million metric tons annually in the United States.\u201D`,
        `\u201CCities with extensive subway systems transported an average of 2.5 million passengers daily.\u201D`,
        `\u201CPortland, Oregon, which combined light rail expansion with 350 miles of bike lanes and pedestrian-priority zones, saw a 42% reduction in single-occupancy vehicle commuting \u2014 nearly double the reduction achieved by cities that invested in transit alone.\u201D`
      ],
      correct: 3,
      explanation: `B provides a specific example of an integrated approach with comparative data showing it outperformed transit-only investment. This directly supports the integrated multi-modal emphasis. A is about subway ridership. C is about emissions. D is about politics.`,
    },
  ],
  takeaways: [
    "Textual evidence: The best quote PROVES the claim, not just relates to the same topic.",
    `Use the litmus test: read the claim and your chosen quote back-to-back. Does the quote make the claim feel inevitable?`,
    `Quantitative evidence: Always read the graphic first \u2014 title, labels, units, scale \u2014 before reading the passage.`,
    "For tables: compare specific values. For bar graphs: compare heights. For line graphs: look for trends over time.",
    "Match SPECIFIC data points to SPECIFIC claims. Vague connections are usually wrong.",
    `Don\u2019t go beyond the data: if the graphic doesn\u2019t show it, the answer shouldn\u2019t claim it.`,
    `Integration questions need BOTH the passage and the data \u2014 neither alone gives you the answer.`,
    `No complex math needed \u2014 just accurate reading and logical connection.`,
  ],
};
