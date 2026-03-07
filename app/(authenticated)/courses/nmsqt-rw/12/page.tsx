"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import { GrowthTracker } from "@/components/course/activities/growth-tracker";
import {
  TestDayVisual,
  SelectionIndexVisual,
  DomainReviewVisual,
  GrowthMindsetVisual,
} from "./lesson-visuals";

export default function NMSQTRWModule12() {
  return <ModuleShell config={MODULE_CONFIG}
      visuals={{
        "test-day": <TestDayVisual />,
        "selection-index": <SelectionIndexVisual />,
        "domain-review": <DomainReviewVisual />,
        "growth-mindset": <GrowthMindsetVisual />,
      }}
      activities={{
        "exercise-cap": (goNext: () => void) => (
          <MatchingExercise
            items={CAP_EXERCISE_DATA}
            title="Cap"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "error-analysis": (goNext: () => void) => (
          <ErrorAnalysisWorksheet
            domains={["Craft & Structure", "Information & Ideas", "Standard English Conventions", "Expression of Ideas"]}
            testLabel="PSAT/NMSQT Reading & Writing"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "growth-tracker": (goNext: () => void) => (
          <GrowthTracker
            testType="nmsqt"
            section="rw"
            totalQuestions={54}
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
      }}
    />;
}

const CAP_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "The historian's account was notably _______ , presenting events from multiple perspectives without advocating for any single interpretation.",
    "options": [
      "incomplete",
      "inflammatory",
      "impartial",
      "biased"
    ],
    "correct": 2,
    "explanation": "\"Multiple perspectives, no advocacy\" = balanced/neutral. \"Impartial.\""
  },
  {
    "prompt": "The glacier's retreat was not gradual but _______ — satellite imagery showed it had lost 30% of its mass in a single decade.",
    "options": [
      "precipitous",
      "steady",
      "imperceptible",
      "negligible"
    ],
    "correct": 0,
    "explanation": "\"Not gradual\" + 30% in one decade = steep/sudden. \"Precipitous.\""
  },
  {
    "prompt": "Despite receiving widespread acclaim for her debut novel, the author remained _______ about her literary talents, attributing her success to fortunate timing and a generous editor.",
    "options": [
      "indifferent",
      "arrogant",
      "diffident",
      "enthusiastic"
    ],
    "correct": 2,
    "explanation": "\"Remained modest, attributed to timing/editor\" = shy about self-assessment. \"Diffident\" = modest, lacking self-confidence."
  },
  {
    "prompt": "The photographer's images of abandoned factories were simultaneously beautiful and _______ — the aesthetic appeal of the compositions contrasted sharply with the economic devastation they documented.",
    "options": [
      "mundane",
      "unsettling",
      "cheerful",
      "predictable"
    ],
    "correct": 1,
    "explanation": "\"Beautiful AND\" something contrasting + \"economic devastation.\" \"Unsettling\" captures the disturbing contrast."
  },
  {
    "prompt": "The editorial argues that standardized testing narrows curricula. <u>It cites a 2023 survey in which 78% of teachers reported reducing time spent on art, music, and physical education to prepare students for state assessments.</u> The editorial then proposes portfolio-based alternatives.",
    "options": [
      "Introduces a counterargument.",
      "Provides statistical evidence supporting the claim that testing narrows curricula.",
      "Describes the history of standardized testing.",
      "Proposes a solution to the problem."
    ],
    "correct": 1,
    "explanation": "Claim: testing narrows curricula. Underlined sentence: 78% of teachers reduced arts/PE. Direct evidence supporting the claim."
  },
  {
    "prompt": "A literary critic reviews a novel: \"The author structures each chapter as a different character's courtroom testimony. What emerges is not a single truth but a constellation of partial truths, each shaped by self-interest, memory failure, and the desire to be believed.\"",
    "options": [
      "Compares the novel to other courtroom dramas.",
      "Summarizes the novel's plot.",
      "Analyzes how the structural choice (testimonies) creates thematic meaning about the nature of truth.",
      "Criticizes the author for a confusing narrative."
    ],
    "correct": 2,
    "explanation": "The critic shows how FORM (testimony chapters) creates MEANING (no single truth). Structure → theme analysis."
  },
  {
    "prompt": "<strong>Text 1:</strong> Marine biologist Rivera argues that marine protected areas (MPAs) are the most effective tool for preserving ocean biodiversity, citing a meta-analysis showing 21% higher species richness inside MPAs than outside.<br><br><strong>Text 2:</strong> Marine biologist Okafor agrees MPAs work locally but argues they displace fishing pressure to unprotected areas, sometimes causing greater overall damage — a phenomenon called \"leakage.\"",
    "options": [
      "Accepts local effectiveness but qualifies by identifying a systemic consequence (leakage).",
      "Total rejection of MPAs.",
      "Extends the argument to freshwater ecosystems.",
      "Agrees completely."
    ],
    "correct": 0,
    "explanation": "Agrees MPAs work (locally) but adds that displaced fishing causes broader damage. Qualification."
  },
  {
    "prompt": "<strong>Text 1:</strong> Psychologist Park argues that social media causes loneliness by replacing in-person interaction with superficial digital exchanges.<br><br><strong>Text 2:</strong> Psychologist Alvarez contends the causal direction is reversed: lonely individuals seek out social media as a coping mechanism, meaning loneliness drives social media use rather than the other way around.",
    "options": [
      "The direction of the causal relationship between social media use and loneliness.",
      "Whether loneliness is a real problem.",
      "Whether psychology is a science.",
      "Whether social media exists."
    ],
    "correct": 0,
    "explanation": "Park: social media → loneliness. Alvarez: loneliness → social media. They disagree on causal direction."
  },
  {
    "prompt": "<strong>Text 1:</strong> Architect Chen argues that glass skyscrapers are responsible for hundreds of millions of bird deaths annually through collisions and should be regulated.<br><br><strong>Text 2:</strong> Architect Brennan accepts the collision data but argues that banning glass facades would be counterproductive because glass buildings reduce energy consumption through natural lighting, lowering the carbon emissions that threaten far more birds through habitat loss.",
    "options": [
      "Agrees with the regulation proposal.",
      "Denies birds collide with glass.",
      "Suggests painting all glass buildings.",
      "Accepts the collision problem but argues the energy/climate benefits of glass prevent greater bird deaths from habitat loss."
    ],
    "correct": 3,
    "explanation": "Brennan accepts collisions but argues the NET effect of glass is positive for birds (fewer climate deaths > collision deaths). Qualification with cost-benefit framing."
  },
  {
    "prompt": "Researchers studying \"decision fatigue\" found that judges granted parole in 65% of morning cases but only 20% of cases heard just before lunch. After a food break, the rate jumped back to 65%. The pattern held regardless of the severity of the crime or the prisoner's history.",
    "options": [
      "Judges are intentionally unfair.",
      "Decision quality degrades with mental fatigue but can be restored by breaks, suggesting judicial outcomes are influenced by biological factors beyond the merits of the case.",
      "All prisoners should receive parole.",
      "Food improves intelligence."
    ],
    "correct": 1,
    "explanation": "65% → 20% → 65% after break + pattern held regardless of case merits = biological fatigue affects supposedly rational decisions."
  },
  {
    "prompt": "When researchers asked people to estimate their own driving ability, 93% rated themselves as \"above average\" — a statistical impossibility. Interestingly, the most overconfident group was drivers aged 18–25, who have the highest accident rates.",
    "options": [
      "Self-assessment of skill is unreliable and may be inversely related to actual competence in some groups.",
      "Older drivers are the safest.",
      "Most people are excellent drivers.",
      "Driving tests should be easier."
    ],
    "correct": 0,
    "explanation": "93% above average = unreliable self-assessment. Most overconfident group = worst actual record. Self-assessment may inversely correlate with competence."
  },
  {
    "prompt": "A study compared two villages: one where women had access to microloans and one where they didn't. After five years, the microloan village showed 30% higher school enrollment for girls, 25% lower child mortality, and a 15% increase in household income. However, 40% of loan recipients reported increased stress from repayment obligations.",
    "options": [
      "All women should receive microloans.",
      "The study was poorly designed.",
      "Microloans produced significant community benefits but also created repayment-related stress for recipients.",
      "Microloans are harmful to women."
    ],
    "correct": 2,
    "explanation": "Benefits (enrollment, mortality, income) + cost (stress). Main idea captures both."
  },
  {
    "prompt": "Ocean acidification caused by CO<sub>2</sub> absorption has reduced the concentration of carbonate ions that shellfish need to build shells. Scientists found that oyster larvae in acidified water had 25% thinner shells and 40% lower survival rates. However, a small percentage of oysters showed natural resistance — their shells remained normal thickness even in acidified conditions.",
    "options": [
      "Scientists should stop studying oysters.",
      "Genetic variation within the oyster population may provide a pathway for natural adaptation to acidification.",
      "Ocean acidification is not a serious problem.",
      "All oysters will go extinct."
    ],
    "correct": 1,
    "explanation": "Most affected + \"small percentage showed resistance\" = genetic variation enables some to survive, potentially enabling natural selection."
  },
  {
    "prompt": "Urban planner Dr. Torres argues that converting highway lanes to bus-only rapid transit would move more people per hour than private cars while reducing emissions.",
    "options": [
      "Highway expansion projects cost billions.",
      "Data from Bogota's TransMilenio shows that dedicated bus lanes move 45,000 passengers per hour per direction — compared to 2,500 for a car lane — while producing 80% fewer emissions per passenger-mile.",
      "Many cities have traffic congestion.",
      "Public transit is popular in Europe."
    ],
    "correct": 1,
    "explanation": "Claim: bus lanes move more people + lower emissions. (B) provides both numbers: 45K vs. 2,500 (throughput) + 80% fewer emissions."
  },
  {
    "prompt": "| Country | Renewable % | Nuclear % | Fossil % | CO<sub>2</sub>/capita (tons) |\n|---|---|---|---|---|\n| France | 25% | 67% | 8% | 4.6 |\n| Germany | 46% | 0% | 54% | 8.1 |\n| Sweden | 60% | 30% | 10% | 3.5 |\n| Poland | 17% | 0% | 83% | 7.9 |\n\nSupport the claim that nuclear power helps reduce carbon emissions?",
    "options": [
      "Poland has the highest fossil fuel dependence at 83%.",
      "France and Sweden, which generate 67% and 30% of electricity from nuclear respectively, produce far less CO<sub>2</sub> per capita (4.6 and 3.5 tons) than Germany and Poland (8.1 and 7.9 tons), which rely heavily on fossil fuels and use no nuclear power.",
      "Sweden generates 60% of its electricity from renewables.",
      "Germany has the highest renewable percentage at 46%."
    ],
    "correct": 1,
    "explanation": "Claim: nuclear \u2192 lower CO<sub>2</sub>. (B) contrasts nuclear countries (low CO<sub>2</sub>) with non-nuclear (high CO<sub>2</sub>). Direct comparison."
  },
  {
    "prompt": "Ecologist Dr. Kim argues that reintroducing wolves to Yellowstone created a \"trophic cascade\" that restored the entire ecosystem.",
    "options": [
      "Wolf populations have grown since reintroduction.",
      "After wolves returned in 1995, elk stopped overgrazing riverbanks, willow and aspen recovered, beaver populations tripled, and streams narrowed and deepened — demonstrating a chain reaction from one species across multiple trophic levels.",
      "Yellowstone attracts millions of visitors annually.",
      "Wolves are apex predators."
    ],
    "correct": 1,
    "explanation": "Claim: wolves created trophic cascade. (B) shows the chain: wolves → elk behavior → vegetation → beavers → stream morphology."
  },
  {
    "prompt": "| Teaching Method | Retention (1 day) | Retention (30 days) | Transfer Score |\n|---|---|---|---|\n| Lecture only | 72% | 28% | 31 |\n| Lecture + practice problems | 78% | 52% | 55 |\n| Interleaved retrieval | 65% | 71% | 73 |\n| Spaced retrieval + feedback | 68% | 78% | 81 |\n\nSupport the claim that methods with lower initial performance can produce better long-term outcomes?",
    "options": [
      "Lecture + practice produces 55 on transfer.",
      "Interleaved retrieval and spaced retrieval start with lower 1-day retention (65% and 68%) than lecture (72%) but dramatically outperform it at 30 days (71% and 78% vs. 28%) and on transfer tasks (73 and 81 vs. 31).",
      "Spaced retrieval has the highest 30-day retention.",
      "Lecture achieves 72% retention at 1 day."
    ],
    "correct": 1,
    "explanation": "Claim: lower initial \u2192 better long-term. (B) shows the crossover: retrieval methods start lower at day 1 but dominate at day 30 and transfer."
  },
  {
    "prompt": "The orchestra, which performs in a restored 19th-century theater and has won three Grammy awards, _______ its 50th anniversary season next month.",
    "options": [
      "are beginning",
      "have begun",
      "begins",
      "begin"
    ],
    "correct": 2,
    "explanation": "\"Orchestra\" (singular). The \"which\" clause is nonessential. \"Begins.\""
  },
  {
    "prompt": "Inspired by her grandmother's stories of rural _______ the journalist spent two years documenting vanishing agricultural traditions across Appalachia.",
    "options": [
      "life. The",
      "life; the",
      "life, the",
      "life the"
    ],
    "correct": 2,
    "explanation": "\"Inspired by…life\" = participial phrase. Comma separates it from the main clause."
  },
  {
    "prompt": "The report found that air pollution affects not only respiratory health _______ cognitive development in children under five.",
    "options": [
      "but",
      "but also",
      "and also",
      "as well as"
    ],
    "correct": 1,
    "explanation": "\"Not only…but also.\" Standard correlative pair."
  },
  {
    "prompt": "The researchers surveyed 3,000 participants, analyzed the results using three statistical _______ and published their findings in a peer-reviewed journal.",
    "options": [
      "methods and",
      "methods; and",
      "methods, and",
      "methods. And"
    ],
    "correct": 2,
    "explanation": "Three-item series: surveyed, analyzed, and published. Comma before \"and\" in the final item."
  },
  {
    "prompt": "The museum _______ the artifact for decades before a visiting scholar identified it as a rare 12th-century Byzantine reliquary.",
    "options": [
      "displays",
      "has displayed",
      "was displaying",
      "had displayed"
    ],
    "correct": 3,
    "explanation": "Display happened BEFORE the identification (past). Past perfect: \"had displayed\" → then \"identified\" (simple past)."
  },
  {
    "prompt": "The volcano had shown no signs of activity for 500 years. _______ in March 2023, seismographs detected thousands of small earthquakes beneath its surface.",
    "options": [
      "Therefore,",
      "Similarly,",
      "For instance,",
      "Then,"
    ],
    "correct": 3,
    "explanation": "500 years quiet → earthquakes started in 2023. Time sequence. \"Then.\""
  },
  {
    "prompt": "The study demonstrated that green spaces reduce urban heat. _______ a park in Phoenix measured 5°C cooler than surrounding pavement during peak summer temperatures.",
    "options": [
      "For instance,",
      "However,",
      "Nevertheless,",
      "Therefore,"
    ],
    "correct": 0,
    "explanation": "General claim → specific park example. \"For instance.\""
  },
  {
    "prompt": "Autonomous vehicles promise safer roads by eliminating human error. _______ they introduce new risks, including software vulnerabilities and ethical dilemmas in unavoidable crash scenarios.",
    "options": [
      "Moreover,",
      "However,",
      "Similarly,",
      "For example,"
    ],
    "correct": 1,
    "explanation": "Benefit (safer) → drawback (new risks). Contrast. \"However.\""
  },
  {
    "prompt": "Notes:\n\u2022 The human gut contains approximately 100 trillion microorganisms \u2014 more than 10x the number of human cells.\n\u2022 The gut microbiome influences digestion, immune function, and even mood through the gut-brain axis.\n\u2022 A 2024 meta-analysis linked low microbial diversity to higher rates of depression, obesity, and autoimmune disease.\n\u2022 Factors that reduce diversity include antibiotic overuse, processed food diets, and limited exposure to natural environments.\n\u2022 Fecal microbiota transplantation (FMT) has shown a 90% success rate for treating recurrent C. difficile infections.\n\nGoal: Which choice effectively presents the gut microbiome as a critical but underappreciated factor in overall health?",
    "options": [
      "Fecal transplants successfully treat 90% of recurrent C. difficile infections.",
      "Factors reducing gut diversity include antibiotics and processed food.",
      "The gut-brain axis connects intestinal microbes to neurological function.",
      "The human gut houses roughly 100 trillion microorganisms that influence far more than digestion: emerging research links microbial diversity to immune function, mood regulation, and resistance to conditions ranging from depression to autoimmune disease \u2014 yet common modern habits like antibiotic overuse and processed diets are steadily depleting this hidden ecosystem."
    ],
    "correct": 3,
    "explanation": "Goal: critical + underappreciated. (B) establishes scope (100T organisms, broad health impact), the \"hidden\" framing, AND the modern threat \u2014 making it both important and neglected."
  },
  {
    "prompt": "Notes:\n\u2022 The Library of Alexandria, founded ~300 BCE, was the ancient world\u2019s largest repository of knowledge.\n\u2022 It may have held 400,000\u2013700,000 scrolls at its peak.\n\u2022 The library was destroyed gradually over centuries, not in a single fire as commonly believed.\n\u2022 Julius Caesar\u2019s siege in 48 BCE likely damaged a warehouse of scrolls near the harbor, not the library itself.\n\u2022 The Serapeum, a \u201Cdaughter library,\u201D survived until 391 CE when it was destroyed during anti-pagan riots.\n\nGoal: Which choice corrects a common misconception about the Library of Alexandria while conveying its significance?",
    "options": [
      "The Serapeum survived until 391 CE when anti-pagan riots led to its destruction.",
      "Contrary to popular belief, the Library of Alexandria was not destroyed in a single dramatic fire — rather, the ancient world's greatest repository of knowledge, which may have held 700,000 scrolls, declined gradually over centuries through neglect, political upheaval, and episodic violence.",
      "The Library of Alexandria was founded around 300 BCE and held up to 700,000 scrolls.",
      "Julius Caesar's siege in 48 BCE likely damaged a scroll warehouse rather than the library itself."
    ],
    "correct": 1,
    "explanation": "Dual goal: correct misconception (not one fire → gradual) AND convey significance (greatest repository, 700K scrolls). (C) does both."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "rw",
  moduleNum: 12,
  title: "Final Review & Strategies",
  subtitle:
    "Last-mile prep and test-day tips -- capstone assessment across all domains.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-cap", label: "Cap", icon: "zap" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "error-analysis", label: "Error Analysis", icon: "clipboard" },
    { id: "growth-tracker", label: "Growth Tracker", icon: "chart" },
    { id: "challenge", label: "Challenge", icon: "flame" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  warmup: [
    {
      source: "Module 4 -- Words in Context",
      stem: "The historian's account was notably _______ , presenting events from multiple perspectives without advocating for any single interpretation.\n\nWhich word best completes the text?",
      choices: ["incomplete", "inflammatory", "impartial", "biased"],
      correct: 2,
      explanation:
        '"Multiple perspectives, no advocacy" = balanced/neutral. "Impartial."',
    },
    {
      source: "Module 4 -- Words in Context",
      stem: "The glacier's retreat was not gradual but _______ -- satellite imagery showed it had lost 30% of its mass in a single decade.\n\nWhich word best completes the text?",
      choices: ["precipitous", "steady", "imperceptible", "negligible"],
      correct: 0,
      explanation:
        '"Not gradual" + 30% in one decade = steep/sudden. "Precipitous."',
    },
    {
      source: "Module 4 -- Words in Context",
      stem: "Despite receiving widespread acclaim for her debut novel, the author remained _______ about her literary talents, attributing her success to fortunate timing and a generous editor.\n\nWhich word best completes the text?",
      choices: ["indifferent", "arrogant", "diffident", "enthusiastic"],
      correct: 2,
      explanation:
        '"Remained modest, attributed to timing/editor" = shy about self-assessment. "Diffident" = modest, lacking self-confidence.',
    },
    {
      source: "Module 7 -- Structure",
      stem: "The editorial argues that standardized testing narrows curricula. It cites a 2023 survey in which 78% of teachers reported reducing time spent on art, music, and physical education. The editorial then proposes portfolio-based alternatives.\n\nWhich choice best describes the function of the second sentence?",
      choices: [
        "Introduces a counterargument.",
        "Provides statistical evidence supporting the claim that testing narrows curricula.",
        "Describes the history of standardized testing.",
        "Proposes a solution to the problem."
      ],
      correct: 1,
      explanation:
        "Claim: testing narrows curricula. Second sentence: 78% of teachers reduced arts/PE. Direct evidence supporting the claim.",
    },
  ],

  lessons: [
    {
      id: "test-day",
      title: "Test-Day Strategy",
      subtitle: "Your final battle plan",
      visual: "test-day",
      body: [
        "The night before: review your error journal, not new material. Sleep is more valuable than last-minute cramming. Your brain consolidates learning during sleep.",
        "Test morning: eat protein, not just carbs. Bring a watch (phones aren't allowed). Arrive early to reduce stress. Trust your preparation.",
        "During the test: Use the two-pass method. Don't spend more than 90 seconds on any question in Pass 1. Flag and move. Never leave blanks -- no penalty for guessing on the Digital PSAT.",
      ],
    },
    {
      id: "selection-index",
      title: "National Merit Selection Index",
      subtitle: "How your score translates",
      visual: "selection-index",
      body: [
        "Selection Index = (R&W + Math) x 2 / 10. Range: 48-228. Your PSAT/NMSQT score in R&W and Math each range from 160-760.",
        "State cutoffs vary from ~209 (Wyoming) to ~223 (DC/New Jersey). Check your state's recent cutoffs to set a realistic target.",
        "Key dates: PSAT in October. Scores released in December. Semifinalists announced the following September. Finalists notified in February.",
      ],
    },
    {
      id: "domain-review",
      title: "Domain Quick Review",
      subtitle: "One-sentence reminders for each domain",
      visual: "domain-review",
      body: [
        "Craft & Structure: Words in Context -- predict before you peek. Structure -- ask 'what does this sentence DO?' not 'what does it SAY?' Cross-Text -- map the relationship (agree, disagree, qualify, extend) before looking at choices.",
        "Information & Ideas: Central Ideas -- right scope (not too broad, not too narrow). Inferences -- most conservative conclusion. Evidence -- match the SPECIFIC claim, not just the topic.",
        "Conventions: Find the subject, ignore the noise, match the verb. Semicolons join two complete sentences. Commas separate dependent from independent clauses. Expression of Ideas: Transitions -- identify the relationship first. Synthesis -- read the goal first.",
      ],
    },
    {
      id: "growth-mindset",
      title: "Beyond the Test",
      subtitle: "What you've actually learned",
      visual: "growth-mindset",
      body: [
        "This course taught you more than test tricks. You learned to read actively for structure and purpose. You learned to evaluate evidence critically. You learned to identify logical relationships between ideas.",
        "These skills transfer directly to college reading, academic writing, and professional communication. The PSAT is a starting point, not an endpoint.",
        "Whatever your score, you now have a systematic approach to reading and reasoning that will serve you for years. Trust the process you've built.",
      ],
    },
  ],

  quiz: [
    {
      passage:
        "The photographer's images of abandoned factories were simultaneously beautiful and _______ -- the aesthetic appeal of the compositions contrasted sharply with the economic devastation they documented.",
      stem: "Which word best completes the text?",
      choices: ["mundane", "unsettling", "cheerful", "predictable"],
      correct: 1,
      explanation:
        '"Beautiful AND" something contrasting + "economic devastation." "Unsettling" captures the disturbing contrast.',
      type: "WIC",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        'A literary critic reviews a novel: "The author structures each chapter as a different character\'s courtroom testimony. What emerges is not a single truth but a constellation of partial truths, each shaped by self-interest, memory failure, and the desire to be believed."',
      stem: "What does the critic's description accomplish?",
      choices: [
        "Compares the novel to other courtroom dramas.",
        "Summarizes the novel's plot.",
        "Analyzes how the structural choice (testimonies) creates thematic meaning about the nature of truth.",
        "Criticizes the author for a confusing narrative."
      ],
      correct: 2,
      explanation:
        "The critic shows how FORM (testimony chapters) creates MEANING (no single truth). Structure -> theme analysis.",
      type: "Structure",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Text 1: Marine biologist Rivera argues that marine protected areas (MPAs) are the most effective tool for preserving ocean biodiversity, citing a meta-analysis showing 21% higher species richness inside MPAs.\n\nText 2: Marine biologist Okafor agrees MPAs work locally but argues they displace fishing pressure to unprotected areas, sometimes causing greater overall damage -- a phenomenon called 'leakage.'",
      stem: "How does Okafor respond to Rivera?",
      choices: [
        "Accepts local effectiveness but qualifies by identifying a systemic consequence (leakage).",
        "Total rejection of MPAs.",
        "Extends the argument to freshwater ecosystems.",
        "Agrees completely."
      ],
      correct: 0,
      explanation:
        "Agrees MPAs work (locally) but adds that displaced fishing causes broader damage. Qualification.",
      type: "Cross-Text",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Text 1: Psychologist Park argues that social media causes loneliness by replacing in-person interaction with superficial digital exchanges.\n\nText 2: Psychologist Alvarez contends the causal direction is reversed: lonely individuals seek out social media as a coping mechanism, meaning loneliness drives social media use rather than the other way around.",
      stem: "What is the core disagreement?",
      choices: [
        "The direction of the causal relationship between social media use and loneliness.",
        "Whether loneliness is a real problem.",
        "Whether psychology is a science.",
        "Whether social media exists."
      ],
      correct: 0,
      explanation:
        "Park: social media -> loneliness. Alvarez: loneliness -> social media. They disagree on causal direction.",
      type: "Cross-Text",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Text 1: Architect Chen argues that glass skyscrapers are responsible for hundreds of millions of bird deaths annually through collisions and should be regulated.\n\nText 2: Architect Brennan accepts the collision data but argues that banning glass facades would be counterproductive because glass buildings reduce energy consumption through natural lighting, lowering the carbon emissions that threaten far more birds through habitat loss.",
      stem: "How does Brennan respond?",
      choices: [
        "Agrees with the regulation proposal.",
        "Denies birds collide with glass.",
        "Suggests painting all glass buildings.",
        "Accepts the collision problem but argues the energy/climate benefits of glass prevent greater bird deaths from habitat loss."
      ],
      correct: 3,
      explanation:
        "Brennan accepts collisions but argues the NET effect of glass is positive for birds (fewer climate deaths > collision deaths). Qualification with cost-benefit framing.",
      type: "Cross-Text",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Researchers studying 'decision fatigue' found that judges granted parole in 65% of morning cases but only 20% of cases heard just before lunch. After a food break, the rate jumped back to 65%. The pattern held regardless of the severity of the crime or the prisoner's history.",
      stem: "Which choice best states the main idea?",
      choices: [
        "Judges are intentionally unfair.",
        "Decision quality degrades with mental fatigue but can be restored by breaks, suggesting judicial outcomes are influenced by biological factors beyond the merits of the case.",
        "All prisoners should receive parole.",
        "Food improves intelligence."
      ],
      correct: 1,
      explanation:
        "65% -> 20% -> 65% after break + pattern held regardless of case merits = biological fatigue affects supposedly rational decisions.",
      type: "Central Ideas",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "When researchers asked people to estimate their own driving ability, 93% rated themselves as 'above average' -- a statistical impossibility. Interestingly, the most overconfident group was drivers aged 18-25, who have the highest accident rates.",
      stem: "Which inference is best supported?",
      choices: [
        "Self-assessment of skill is unreliable and may be inversely related to actual competence in some groups.",
        "Older drivers are the safest.",
        "Most people are excellent drivers.",
        "Driving tests should be easier."
      ],
      correct: 0,
      explanation:
        "93% above average = unreliable self-assessment. Most overconfident group = worst actual record. Self-assessment may inversely correlate with competence.",
      type: "Inferences",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A study compared two villages: one where women had access to microloans and one where they didn't. After five years, the microloan village showed 30% higher school enrollment for girls, 25% lower child mortality, and a 15% increase in household income. However, 40% of loan recipients reported increased stress from repayment obligations.",
      stem: "Which choice best states the main idea?",
      choices: [
        "All women should receive microloans.",
        "The study was poorly designed.",
        "Microloans produced significant community benefits but also created repayment-related stress for recipients.",
        "Microloans are harmful to women."
      ],
      correct: 2,
      explanation:
        "Benefits (enrollment, mortality, income) + cost (stress). Main idea captures both.",
      type: "Central Ideas",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Ocean acidification caused by CO<sub>2</sub> absorption has reduced the concentration of carbonate ions that shellfish need to build shells. Scientists found that oyster larvae in acidified water had 25% thinner shells and 40% lower survival rates. However, a small percentage of oysters showed natural resistance -- their shells remained normal thickness even in acidified conditions.",
      stem: "Which inference is best supported?",
      choices: [
        "Scientists should stop studying oysters.",
        "Genetic variation within the oyster population may provide a pathway for natural adaptation to acidification.",
        "Ocean acidification is not a serious problem.",
        "All oysters will go extinct."
      ],
      correct: 1,
      explanation:
        'Most affected + "small percentage showed resistance" = genetic variation enables some to survive, potentially enabling natural selection.',
      type: "Inferences",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Urban planner Dr. Torres argues that converting highway lanes to bus-only rapid transit would move more people per hour than private cars while reducing emissions.",
      stem: "Which finding would most directly support Torres's claim?",
      choices: [
        "Public transit is popular in Europe.",
        "Data from Bogota's TransMilenio shows that dedicated bus lanes move 45,000 passengers per hour per direction -- compared to 2,500 for a car lane -- while producing 80% fewer emissions per passenger-mile.",
        "Many cities have traffic congestion.",
        "Highway expansion projects cost billions."
      ],
      correct: 1,
      explanation:
        "Claim: bus lanes move more people + lower emissions. (B) provides both numbers: 45K vs. 2,500 (throughput) + 80% fewer emissions.",
      type: "Textual Evidence",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Energy data: France generates 25% renewable, 67% nuclear, 8% fossil with 4.6 tons CO<sub>2</sub>/capita. Germany generates 46% renewable, 0% nuclear, 54% fossil with 8.1 tons. Sweden generates 60% renewable, 30% nuclear, 10% fossil with 3.5 tons. Poland generates 17% renewable, 0% nuclear, 83% fossil with 7.9 tons.",
      stem: "Which choice supports the claim that nuclear power helps reduce carbon emissions?",
      choices: [
        "Poland has the highest fossil fuel dependence at 83%.",
        "Germany has the highest renewable percentage at 46%.",
        "France and Sweden, which generate 67% and 30% of electricity from nuclear respectively, produce far less CO<sub>2</sub> per capita (4.6 and 3.5 tons) than Germany and Poland (8.1 and 7.9 tons), which use no nuclear power.",
        "Sweden generates 60% of its electricity from renewables."
      ],
      correct: 2,
      explanation:
        "Claim: nuclear -> lower CO<sub>2</sub>. (B) contrasts nuclear countries (low CO<sub>2</sub>) with non-nuclear (high CO<sub>2</sub>). Direct comparison.",
      type: "Quantitative Evidence",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Teaching method data: Lecture only achieves 72% retention at 1 day, 28% at 30 days, 31 transfer score. Lecture + practice achieves 78%, 52%, 55. Interleaved retrieval achieves 65%, 71%, 73. Spaced retrieval + feedback achieves 68%, 78%, 81.",
      stem: "Which choice supports the claim that methods with lower initial performance can produce better long-term outcomes?",
      choices: [
        "Lecture + practice produces 55 on transfer.",
        "Interleaved retrieval and spaced retrieval start with lower 1-day retention (65% and 68%) than lecture (72%) but dramatically outperform it at 30 days (71% and 78% vs. 28%) and on transfer tasks (73 and 81 vs. 31).",
        "Spaced retrieval has the highest 30-day retention.",
        "Lecture achieves 72% retention at 1 day."
      ],
      correct: 1,
      explanation:
        "Claim: lower initial -> better long-term. (B) shows the crossover: retrieval methods start lower at day 1 but dominate at day 30 and transfer.",
      type: "Quantitative Evidence",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The orchestra, which performs in a restored 19th-century theater and has won three Grammy awards, _______ its 50th anniversary season next month.",
      stem: "Which choice conforms to Standard English?",
      choices: ["are beginning", "have begun", "begins", "begin"],
      correct: 2,
      explanation:
        '"Orchestra" (singular). The "which" clause is nonessential. "Begins."',
      type: "Conventions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Inspired by her grandmother's stories of rural _______ the journalist spent two years documenting vanishing agricultural traditions across Appalachia.",
      stem: "Which choice conforms to Standard English?",
      choices: ["life. The", "life; the", "life, the", "life the"],
      correct: 2,
      explanation:
        '"Inspired by...life" = participial phrase. Comma separates it from the main clause.',
      type: "Conventions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The report found that air pollution affects not only respiratory health _______ cognitive development in children under five.",
      stem: "Which choice conforms to Standard English?",
      choices: ["but", "but also", "and also", "as well as"],
      correct: 1,
      explanation: '"Not only...but also." Standard correlative pair.',
      type: "Conventions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The researchers surveyed 3,000 participants, analyzed the results using three statistical _______ and published their findings in a peer-reviewed journal.",
      stem: "Which choice conforms to Standard English?",
      choices: ["methods and", "methods; and", "methods, and", "methods. And"],
      correct: 2,
      explanation:
        'Three-item series: surveyed, analyzed, and published. Comma before "and" in the final item.',
      type: "Conventions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The museum _______ the artifact for decades before a visiting scholar identified it as a rare 12th-century Byzantine reliquary.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "displays",
        "has displayed",
        "was displaying",
        "had displayed"
      ],
      correct: 3,
      explanation:
        'Display happened BEFORE the identification (past). Past perfect: "had displayed" -> then "identified" (simple past).',
      type: "Conventions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The volcano had shown no signs of activity for 500 years. _______ in March 2023, seismographs detected thousands of small earthquakes beneath its surface.",
      stem: "Which transition best completes the text?",
      choices: ["Therefore,", "Similarly,", "For instance,", "Then,"],
      correct: 3,
      explanation:
        '500 years quiet -> earthquakes started in 2023. Time sequence. "Then."',
      type: "Transitions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The study demonstrated that green spaces reduce urban heat. _______ a park in Phoenix measured 5\u00B0C cooler than surrounding pavement during peak summer temperatures.",
      stem: "Which transition best completes the text?",
      choices: ["For instance,", "However,", "Nevertheless,", "Therefore,"],
      correct: 0,
      explanation:
        'General claim -> specific park example. "For instance."',
      type: "Transitions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Autonomous vehicles promise safer roads by eliminating human error. _______ they introduce new risks, including software vulnerabilities and ethical dilemmas in unavoidable crash scenarios.",
      stem: "Which transition best completes the text?",
      choices: ["Moreover,", "However,", "Similarly,", "For example,"],
      correct: 1,
      explanation:
        'Benefit (safer) -> drawback (new risks). Contrast. "However."',
      type: "Transitions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The human gut contains approximately 100 trillion microorganisms -- more than 10x the number of human cells. The gut microbiome influences digestion, immune function, and even mood through the gut-brain axis. A 2024 meta-analysis linked low microbial diversity to higher rates of depression, obesity, and autoimmune disease. Factors that reduce diversity include antibiotic overuse, processed food diets, and limited exposure to natural environments. Fecal microbiota transplantation has shown a 90% success rate for treating recurrent C. difficile infections.",
      stem: "Which choice effectively presents the gut microbiome as a critical but underappreciated factor in overall health?",
      choices: [
        "The gut-brain axis connects intestinal microbes to neurological function.",
        "The human gut houses roughly 100 trillion microorganisms that influence far more than digestion: emerging research links microbial diversity to immune function, mood regulation, and resistance to conditions ranging from depression to autoimmune disease -- yet common modern habits like antibiotic overuse and processed diets are steadily depleting this hidden ecosystem.",
        "Factors reducing gut diversity include antibiotics and processed food.",
        "Fecal transplants successfully treat 90% of recurrent C. difficile infections."
      ],
      correct: 1,
      explanation:
        'Goal: critical + underappreciated. (B) establishes scope (100T organisms, broad health impact), the "hidden" framing, AND the modern threat.',
      type: "Synthesis",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The Library of Alexandria, founded ~300 BCE, was the ancient world's largest repository of knowledge. It may have held 400,000-700,000 scrolls at its peak. The library was destroyed gradually over centuries, not in a single fire as commonly believed. Julius Caesar's siege in 48 BCE likely damaged a warehouse of scrolls near the harbor, not the library itself. The Serapeum, a 'daughter library,' survived until 391 CE when it was destroyed during anti-pagan riots.",
      stem: "Which choice corrects a common misconception about the Library of Alexandria while conveying its significance?",
      choices: [
        "The Library of Alexandria was founded around 300 BCE and held up to 700,000 scrolls.",
        "Julius Caesar's siege in 48 BCE likely damaged a scroll warehouse rather than the library itself.",
        "Contrary to popular belief, the Library of Alexandria was not destroyed in a single dramatic fire -- rather, the ancient world's greatest repository of knowledge, which may have held 700,000 scrolls, declined gradually over centuries through neglect, political upheaval, and episodic violence.",
        "The Serapeum survived until 391 CE when anti-pagan riots led to its destruction."
      ],
      correct: 2,
      explanation:
        "Dual goal: correct misconception (not one fire -> gradual) AND convey significance (greatest repository, 700K scrolls). (C) does both.",
      type: "Synthesis",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  challenge: [
    {
      passage:
        "Ecologist Dr. Kim argues that reintroducing wolves to Yellowstone created a 'trophic cascade' that restored the entire ecosystem.",
      stem: "Which finding would most directly support Kim's claim?",
      choices: [
        "After wolves returned in 1995, elk stopped overgrazing riverbanks, willow and aspen recovered, beaver populations tripled, and streams narrowed and deepened -- demonstrating a chain reaction from one species across multiple trophic levels.",
        "Yellowstone attracts millions of visitors annually.",
        "Wolves are apex predators.",
        "Wolf populations have grown since reintroduction."
      ],
      correct: 0,
      explanation:
        "Claim: wolves created trophic cascade. (B) shows the chain: wolves -> elk behavior -> vegetation -> beavers -> stream morphology.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The playwright's revision history reveals that the final monologue -- now considered the play's emotional climax -- was originally a stage direction reading simply 'Character exits.' The 200-word speech was added during the last week of rehearsals.",
      stem: "What can be inferred?",
      choices: [
        "The playwright was an inexperienced writer.",
        "Significant creative breakthroughs can occur late in the production process, fundamentally transforming a work.",
        "Actors should write their own monologues.",
        "The original stage direction was superior to the monologue."
      ],
      correct: 1,
      explanation:
        "The most important moment was created at the last minute -> late additions can be transformative.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Dr. Park argues bilinguals show delayed dementia onset.",
      stem: "Which finding would most directly support Park's claim?",
      choices: [
        "Second language is easiest to learn before age 12.",
        "Bilingual programs exist in 30 states.",
        "Bilinguals use different brain regions.",
        "Study of 648 patients: bilinguals developed symptoms 4.5 years later than monolinguals with similar profiles."
      ],
      correct: 3,
      explanation:
        "4.5-year delay with controlled variables = direct support.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Having been exposed to extreme heat for several _______ the satellite's solar panels began to show signs of degradation.",
      stem: "Which choice conforms to Standard English?",
      choices: ["hours, the", "hours; the", "hours the", "hours. The"],
      correct: 0,
      explanation:
        '"Having been exposed" is a participial phrase. Comma separates it from the main clause.',
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The data showed improvement in patient outcomes. _______ the researchers emphasized that the sample size was too small to draw definitive conclusions.",
      stem: "Which transition best completes the text?",
      choices: ["Nonetheless,", "For example,", "Furthermore,", "Consequently,"],
      correct: 0,
      explanation:
        'Improvement -> but can\'t conclude yet. "Nonetheless" = despite that.',
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "CRISPR can correct 6,000+ genetic diseases. The first therapy for sickle cell disease was used in a 2020 clinical trial. Ethical concerns include the possibility of creating 'designer babies' through germline editing. China reported the first CRISPR-edited births in 2018 (widely condemned). CRISPR was adapted for human cells in 2013 at the Broad Institute.",
      stem: "Which choice presents CRISPR's medical potential while acknowledging risks?",
      choices: [
        "CRISPR could correct 6,000 genetic diseases.",
        "CRISPR was adapted for human cells in 2013.",
        "Since treating sickle cell disease in 2020, CRISPR has shown potential to address 6,000+ genetic diseases -- but its power has also raised serious ethical concerns, underscored by the condemned 2018 report of gene-edited human births in China.",
        "The 2018 gene-edited births were condemned internationally."
      ],
      correct: 2,
      explanation:
        "Dual goal: potential + risks. (B) includes sickle cell success + 6,000 diseases AND ethical concerns + condemned births.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  takeaways: [
    "Error analysis shows exactly where to focus your remaining study time -- classify every miss by type.",
    "Your personal battle plan targets the specific question subtypes costing you the most points.",
    "The Selection Index double-weights RW: a 10-point RW improvement adds +2 to your index vs. +1 for Math.",
    "Use the recommended weekly schedule: domain drills, mixed timed practice, error review, and full Bluebook tests.",
    "Trust your preparation, execute your strategies, and never leave a question blank.",
  ],
};
