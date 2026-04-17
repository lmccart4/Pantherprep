"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  GoalFirstVisual,
  NoteTaggingVisual,
  DualGoalVisual,
  InfoVsPurposeVisual,
} from "./lesson-visuals";

export default function NMSQTRWModule9() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/nmsqt-rw/10"
      nextModuleLabel="Module 10: Timed Practice Simulation"
      visuals={{
        "goal-first": <GoalFirstVisual />,
        "note-tagging": <NoteTaggingVisual />,
        "dual-goal": <DualGoalVisual />,
        "info-vs-purpose": <InfoVsPurposeVisual />,
      }}
      activities={{
        "exercise-ivp": (goNext: () => void) => (
          <MatchingExercise
            items={IVP_EXERCISE_DATA}
            title="Info vs. Purpose"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

const IVP_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Notes:\n\u2022 The monarch butterfly migrates up to 4,800 km annually between Canada and central Mexico.\n\u2022 Monarch populations have declined by approximately 80% since the 1990s.\n\u2022 The primary cause of decline is the loss of milkweed, the only plant on which monarchs lay their eggs.\n\u2022 Several U.S. states have launched milkweed restoration programs along migration corridors.\n\nGoal: The student wants to emphasize the severity of the monarch population decline. Which choice most effectively accomplishes this goal?",
    "options": [
      "Monarch butterflies undertake one of nature\u2019s most remarkable journeys, traveling up to 4,800 km between Canada and Mexico each year.",
      "Monarch butterfly populations have plummeted by approximately 80% since the 1990s, driven primarily by the widespread loss of milkweed \u2014 the sole plant species on which monarchs depend for reproduction.",
      "The destruction of milkweed habitats has forced conservation groups to develop restoration programs across the monarch\u2019s migratory corridor.",
      "Several U.S. states have launched milkweed restoration programs to support declining monarch populations along their migration routes."
    ],
    "correct": 1,
    "explanation": "Goal: emphasize SEVERITY. (C) includes 80% stat AND cause with \"sole\" emphasizing vulnerability."
  },
  {
    "prompt": "Notes:\n\u2022 3D-printed houses can be constructed in as little as 24 hours.\n\u2022 The first 3D-printed house was completed in Russia in 2017.\n\u2022 Construction costs for 3D-printed houses are 30\u201350% lower than traditional building methods.\n\u2022 Current 3D printing technology limits houses to single-story structures under 60 square meters.\n\nGoal: The student wants to present 3D-printed housing as a promising solution to housing affordability. Which choice most effectively accomplishes this goal?",
    "options": [
      "3D-printed homes, which can be built in as little as 24 hours at 30\u201350% lower cost than traditional construction, offer a compelling pathway toward more affordable housing.",
      "The first 3D-printed house was completed in Russia in 2017, marking the beginning of a new era in construction technology.",
      "3D printing technology currently restricts houses to single stories of less than 60 square meters, limiting their practical applications.",
      "While current technology limits 3D-printed houses to single-story structures under 60 square meters, the approach could expand as the technology matures."
    ],
    "correct": 0,
    "explanation": "Goal: promising for AFFORDABILITY. (C) highlights speed (24 hrs) and cost savings (30-50% less)."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "rw",
  moduleNum: 9,
  title: "Expression of Ideas",
  subtitle:
    "Effective language use and revision -- the Expression of Ideas domain.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-ivp", label: "Info vs. Purpose", icon: "zap" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  warmup: [
    {
      source: "Module 4 -- Words in Context",
      stem: "The sculptor's work was defined by its _______ -- massive stone forms reduced to their simplest geometric shapes, with no ornament or surface detail.\n\nWhich word best completes the text?",
      choices: ["austerity", "complexity", "flamboyance", "fragility"],
      correct: 0,
      explanation:
        '"Simplest geometric shapes, no ornament" = stripped down. "Austerity" = severe simplicity.',
    },
    {
      source: "Module 8 -- Transitions",
      stem: "The coral reef had been severely damaged by bleaching. _______ marine biologists were surprised to find 60% had regenerated by 2024.\n\nWhich transition best completes the text?",
      choices: ["Similarly,", "For instance,", "Nevertheless,", "Therefore,"],
      correct: 2,
      explanation:
        'Severe damage then surprising recovery. "Nevertheless" = despite that.',
    },
    {
      source: "Module 3 -- Boundaries",
      stem: "The committee voted to approve the proposal, which included new safety standards for all commercial _______ after two years of public consultation.\n\nWhich choice conforms to Standard English?",
      choices: [
        "buildings after",
        "buildings. After",
        "buildings; after",
        "buildings, after"
      ],
      correct: 3,
      explanation:
        'The "which" clause ends at "buildings." Comma + "after" begins a participial phrase.',
    },
    {
      source: "Module 7 -- Cross-Text",
      stem: 'Text 1: Biologist Tanaka argues that octopus intelligence is fundamentally different from mammalian intelligence because it is decentralized.\n\nText 2: Biologist Reyes extends this by proposing that decentralized intelligence may actually be more adaptable in unpredictable environments.\n\nHow does Reyes relate to Tanaka?',
      choices: [
        "Disagreement.",
        "Extension -- builds on decentralization by adding an adaptive advantage.",
        "Qualification.",
        "Unrelated."
      ],
      correct: 1,
      explanation:
        "Reyes accepts decentralization AND adds adaptability. Extension.",
    },
    {
      source: "Module 4 -- Words in Context",
      stem: "The historian argues that the treaty's failure was caused not by diplomatic incompetence but by irreconcilable _______ between the nations' economic interests.\n\nWhich word best completes the text?",
      choices: ["agreements", "similarities", "conflicts", "partnerships"],
      correct: 2,
      explanation:
        '"Failure" + "irreconcilable" = unresolvable opposition. "Conflicts" fits.',
    },
    {
      source: "Module 3 -- Agreement",
      stem: "Neither the original plan nor the revised _______ approved by the review board.\n\nWhich choice conforms to Standard English?",
      choices: [
        "version; were",
        "version was",
        "version were",
        "version, was"
      ],
      correct: 1,
      explanation:
        '"Neither...nor" -- verb agrees with nearer subject "version" (singular) = "was."',
    },
  ],

  lessons: [
    {
      id: "synthesis-deep",
      title: "Rhetorical Synthesis: Goal-First Method",
      subtitle: "Read the goal before the notes",
      visual: "goal-first",
      body: [
        "Synthesis questions give you bulleted research notes and ask you to select the answer that accomplishes a specific rhetorical goal. The key: read the GOAL first, then find the answer that uses the notes to accomplish that specific goal.",
        "Strategy: (1) Read the goal carefully -- underline key words like 'introduce,' 'emphasize,' 'contrast,' or 'explain.' (2) Identify which notes are relevant to that goal. (3) Find the answer that combines the relevant notes in a way that achieves the goal. Ignore notes that don't serve the goal.",
        "Common goals: 'introduce a topic to a general audience,' 'emphasize a contrast,' 'present a finding and its implication,' 'use a specific example to illustrate,' 'acknowledge both benefits and drawbacks.'",
      ],
    },
    {
      id: "note-tagging",
      title: "Note Tagging: Classify Before You Choose",
      subtitle: "Tag each note by type",
      visual: "note-tagging",
      body: [
        "Before looking at the choices, tag each note: Definition, Statistic + Source, Comparison, Date, Discovery/Finding, Drawback, Example. This makes it easy to match notes to goals.",
        "Example: 'Vertical farms use 95% less water than traditional farming' = Statistic + Source + Comparison. 'Energy costs can be 8-10 times higher' = Comparison + Drawback.",
        "The correct answer almost always combines 2-3 notes that directly serve the stated goal. Answers that use only one note or use irrelevant notes are traps.",
      ],
    },
    {
      id: "dual-goals",
      title: "Dual-Goal Synthesis",
      subtitle: "The hardest synthesis questions",
      visual: "dual-goal",
      body: [
        "The hardest synthesis questions have dual goals: 'present X AND acknowledge Y' or 'introduce X while explaining Y.' Both parts of the goal must be met.",
        "Strategy: Eliminate any answer that satisfies only ONE part of the goal. The correct answer always addresses both parts, even if one part gets more space than the other.",
        "Example goal: 'present a balanced view acknowledging both benefits and drawbacks.' An answer that mentions only benefits or only drawbacks fails the dual-goal test, no matter how well-written it is.",
      ],
    },
    {
      id: "info-vs-purpose",
      title: "Information vs. Purpose",
      subtitle: "Don't confuse what the notes SAY with what they DO",
      visual: "info-vs-purpose",
      body: [
        "A common trap in synthesis questions: an answer accurately states information from the notes but doesn't accomplish the specific rhetorical goal.",
        "Example: If the goal is 'emphasize the potential for natural adaptation,' an answer that describes the severity of the problem (accurate information) fails because it doesn't match the PURPOSE.",
        "Always ask: 'Does this answer accomplish the GOAL?' not 'Is this answer accurate?' Accuracy is necessary but not sufficient.",
      ],
    },
  ],

  quiz: [
    {
      passage:
        "Coral bleaching occurs when water temperatures rise, causing corals to expel symbiotic algae. The Great Barrier Reef experienced its worst bleaching event in 2022, with 91% of reefs affected. Dr. Terry Hughes of James Cook University has led surveys of bleaching events for over two decades. Some coral species, including Porites lobata, have shown natural heat resistance due to hosting different algae strains. Global coral cover has declined by approximately 50% since 1950.",
      stem: "Which choice effectively introduces the topic of coral bleaching to a general audience?",
      choices: [
        "Dr. Terry Hughes has surveyed coral bleaching events for over twenty years as part of his research at James Cook University.",
        "Certain coral species like Porites lobata host heat-resistant algae strains that may help them survive warming oceans.",
        "The Great Barrier Reef experienced severe bleaching in 2022, with 91% of reefs affected.",
        "Coral bleaching -- a process in which rising water temperatures cause corals to expel the symbiotic algae they depend on for survival -- has contributed to a 50% decline in global coral cover since 1950."
      ],
      correct: 3,
      explanation:
        "Goal: introduce + general audience. (B) defines bleaching AND gives scope (50% decline).",
      type: "Synthesis",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "Coral bleaching occurs when water temperatures rise, causing corals to expel symbiotic algae. The Great Barrier Reef experienced its worst bleaching event in 2022, with 91% of reefs affected. Some coral species, including Porites lobata, have shown natural heat resistance due to hosting different algae strains. Global coral cover has declined by approximately 50% since 1950.",
      stem: "Which choice emphasizes the potential for natural adaptation in coral reefs?",
      choices: [
        "The 2022 bleaching of the Great Barrier Reef was the worst on record, with 91% of reefs affected.",
        "While most corals are vulnerable to rising temperatures, species like Porites lobata have demonstrated natural heat resistance by hosting algae strains that can tolerate warmer water.",
        "Dr. Terry Hughes has documented coral bleaching for over two decades.",
        "Global coral cover has declined by approximately 50% since 1950, suggesting a crisis in marine ecosystems."
      ],
      correct: 1,
      explanation:
        "Goal: emphasize natural adaptation. (C) highlights a specific species with heat resistance AND explains the mechanism.",
      type: "Synthesis",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "Electric vehicles (EVs) produce zero direct emissions during operation. As of 2024, EVs represent approximately 18% of new car sales globally. The average EV range has increased from 150 km in 2015 to 400 km in 2024. EV battery production relies on lithium mining, which can cause significant environmental damage. Norway leads EV adoption, with over 80% of new car sales being electric.",
      stem: "Which choice presents a balanced view of EVs by acknowledging both benefits and drawbacks?",
      choices: [
        "EV sales now represent 18% of the global new car market, reflecting rapid adoption across multiple countries.",
        "The average range of electric vehicles has increased from 150 km in 2015 to 400 km in 2024.",
        "Norway leads global EV adoption, with electric vehicles accounting for over 80% of new car sales.",
        "While electric vehicles produce zero direct emissions and have seen their range nearly triple since 2015, their battery production depends on lithium mining, which can cause significant environmental damage."
      ],
      correct: 3,
      explanation:
        "Goal: balanced (benefits AND drawbacks). (B) includes zero emissions + range improvement AND lithium mining damage.",
      type: "Synthesis",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The monarch butterfly migrates up to 4,800 km annually between Canada and central Mexico. Monarch populations have declined by approximately 80% since the 1990s. The primary cause of decline is the loss of milkweed, the only plant on which monarchs lay their eggs. Several U.S. states have launched milkweed restoration programs along migration corridors.",
      stem: "The student wants to emphasize the severity of the monarch population decline. Which choice most effectively accomplishes this goal?",
      choices: [
        "The destruction of milkweed habitats has forced conservation groups to develop restoration programs across the monarch's migratory corridor.",
        "Several U.S. states have launched milkweed restoration programs to support declining monarch populations along their migration routes.",
        "Monarch butterfly populations have plummeted by approximately 80% since the 1990s, driven primarily by the widespread loss of milkweed -- the sole plant species on which monarchs depend for reproduction.",
        "Monarch butterflies undertake one of nature's most remarkable journeys, traveling up to 4,800 km between Canada and Mexico each year."
      ],
      correct: 2,
      explanation:
        'Goal: emphasize SEVERITY. (C) includes 80% stat AND cause with "sole" emphasizing vulnerability.',
      type: "Synthesis",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The researcher's findings were _______ by three independent laboratories, each of which confirmed the original results using different methodologies.",
      stem: "Which word best completes the text?",
      choices: ["replicated", "undermined", "contradicted", "questioned"],
      correct: 0,
      explanation:
        '"Confirmed the original results" = successfully repeated. "Replicated."',
      type: "WIC",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "vocabulary_in_context",
    },
    {
      passage:
        "The renowned architect emphasized that sustainable design was not merely a trend but a fundamental _______ in how buildings interact with their environments.",
      stem: "Which word best completes the text?",
      choices: ["shift", "imitation", "repetition", "regression"],
      correct: 0,
      explanation:
        '"Not merely a trend but fundamental ___" = deep change. "Shift."',
      type: "WIC",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "vocabulary_in_context",
    },
    {
      passage:
        "Bioluminescence is the production of light by living organisms through chemical reactions. Approximately 76% of deep-sea creatures produce bioluminescent light. Uses include attracting prey, evading predators, and communication. Researchers at UC San Diego have engineered bioluminescent plants that glow continuously without electricity. The global bioluminescence research market is projected to reach $568 million by 2028.",
      stem: "Which choice emphasizes a practical application of bioluminescence research?",
      choices: [
        "Scientists at UC San Diego have harnessed bioluminescence to create plants that glow continuously, potentially offering a sustainable alternative to electric lighting.",
        "Bioluminescence, the chemical production of light by organisms, is found in approximately 76% of deep-sea creatures.",
        "Deep-sea organisms use bioluminescence for prey attraction, predator evasion, and communication.",
        "The bioluminescence research market is projected to be worth $568 million by 2028."
      ],
      correct: 0,
      explanation:
        "Goal: practical application. (C) describes engineered glowing plants.",
      type: "Synthesis",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The study found that children raised bilingually scored higher on cognitive flexibility tasks. _______ children who spoke three or more languages showed even greater advantages.",
      stem: "Which transition best completes the text?",
      choices: [
        "In other words,",
        "However,",
        "In contrast,",
        "Furthermore,"
      ],
      correct: 3,
      explanation:
        'Same direction, adding more. "Furthermore."',
      type: "Transitions",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "Although the artist _______ primarily in oil paints throughout her early career, her later works incorporated digital media and interactive installations.",
      stem: "Which choice conforms to Standard English?",
      choices: ["would work", "worked", "has worked", "is working"],
      correct: 1,
      explanation:
        '"Throughout her early career" = completed past period. Simple past "worked."',
      type: "Conventions",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "punctuation_boundaries",
    },
    {
      passage:
        "The paleontologist's discovery of feathered dinosaur fossils in northeastern China _______ the long-debated hypothesis that modern birds evolved directly from theropod dinosaurs.",
      stem: "Which word best completes the text?",
      choices: ["challenged", "contradicted", "dismissed", "corroborated"],
      correct: 3,
      explanation:
        'Feathered dinosaurs support bird-from-dinosaur theory. "Corroborated" = confirmed.',
      type: "WIC",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "vocabulary_in_context",
    },
    {
      passage:
        "The conductor insisted that the musicians maintain absolute _______ during the pianissimo passage, as even the slightest disturbance would undermine the movement's emotional impact.",
      stem: "Which word best completes the text?",
      choices: ["silence", "volume", "discord", "animation"],
      correct: 0,
      explanation:
        'Pianissimo = very soft. "Absolute silence" for the soft passage.',
      type: "WIC",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "vocabulary_in_context",
    },
    {
      passage:
        "The Dead Sea -- the lowest point on Earth, situated 430 meters below sea level between Jordan and Israel -- has been shrinking by about one meter per year since the 1960s. Its salinity is approximately 34%, nearly 10 times that of the ocean. Water diversion from the Jordan River for agriculture is the primary cause of shrinkage. A proposed Red Sea-Dead Sea canal could stabilize levels but faces environmental and political opposition.",
      stem: "Which choice effectively introduces the Dead Sea's environmental crisis to a general audience?",
      choices: [
        "The Dead Sea's salinity of 34% makes it nearly ten times saltier than the ocean.",
        "The Dead Sea -- the lowest point on Earth, situated 430 meters below sea level between Jordan and Israel -- has been shrinking by about one meter per year since the 1960s, primarily because water from its main tributary has been diverted for agriculture.",
        "A proposed canal connecting the Red Sea to the Dead Sea has faced both environmental and political opposition.",
        "Water diversion from the Jordan River for agricultural purposes has been identified as the primary driver of the Dead Sea's decline."
      ],
      correct: 1,
      explanation:
        "Goal: introduce + general audience + crisis. (B) orients the reader then states the crisis.",
      type: "Synthesis",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
  ],

  challenge: [
    {
      passage:
        "Traditional paper books produce approximately 7.5 kg of CO<sub>2</sub> per unit during manufacturing. E-readers produce approximately 30 kg of CO<sub>2</sub> during manufacturing but require no additional resources per book downloaded. The average American reads 12 books per year. E-readers consume 0.015 kWh per hour of reading. A 2023 survey found that 65% of readers prefer physical books for 'deep reading' experiences.",
      stem: "Which choice effectively compares the environmental impact of books vs. e-readers AND introduces a complicating factor?",
      choices: [
        "A 2023 survey revealed that 65% of readers prefer physical books for deep reading experiences despite the environmental advantages of digital alternatives.",
        "The average American reads 12 books per year, which translates to 90 kg of CO<sub>2</sub> from paper book production.",
        "While a single paper book generates 7.5 kg of CO<sub>2</sub> and an e-reader produces 30 kg during manufacturing, an e-reader becomes the greener option after roughly four books -- yet 65% of readers still prefer physical books for deep reading, suggesting environmental calculations alone won't determine the market.",
        "E-readers produce 30 kg of CO<sub>2</sub> during manufacturing -- four times the carbon footprint of a single paper book."
      ],
      correct: 2,
      explanation:
        "Dual goal: compare environmental impact + introduce complication. (B) does both.",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "CRISPR-Cas9 gene editing was adapted for use in human cells in 2013 by researchers at the Broad Institute. In 2020, the first CRISPR-based therapy was used to treat sickle cell disease in a clinical trial. CRISPR can potentially correct over 6,000 known genetic diseases. Ethical concerns include the possibility of creating 'designer babies' through germline editing. China reported the first CRISPR-edited human births in 2018, which was widely condemned by the scientific community.",
      stem: "Which choice highlights CRISPR's medical promise AND acknowledges the ethical debate?",
      choices: [
        "CRISPR was first adapted for human cells in 2013 at the Broad Institute, launching a revolution in genetic medicine.",
        "CRISPR technology could potentially correct over 6,000 known genetic diseases, making it one of the most significant medical advances in decades.",
        "Since its first successful use in a sickle cell disease trial in 2020, CRISPR has shown potential to correct over 6,000 genetic diseases -- but the technology has also sparked serious ethical debate, particularly after China's widely condemned 2018 report of the first gene-edited human births.",
        "The 2018 report of CRISPR-edited human births in China was condemned internationally, raising concerns about the ethics of germline editing."
      ],
      correct: 2,
      explanation:
        "Dual goal: medical promise + ethical debate. (B) includes both.",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "Iceland generates 100% of its electricity from renewable sources (70% geothermal, 30% hydroelectric). Iceland's unique geology -- sitting atop the Mid-Atlantic Ridge -- provides abundant geothermal energy. The country's population is only 370,000, compared to the UK's 67 million. Iceland has attracted energy-intensive industries like aluminum smelting due to cheap, clean electricity. Critics argue Iceland's model cannot be replicated in countries without similar geological advantages.",
      stem: "Which choice presents Iceland as a renewable energy success story AND explains why its model may not be universally applicable?",
      choices: [
        "Iceland has achieved 100% renewable electricity generation by leveraging its position atop the Mid-Atlantic Ridge for geothermal power -- but with a population of just 370,000 and unique geological advantages, critics argue its model offers limited guidance for larger nations without similar natural resources.",
        "Aluminum smelting companies have relocated to Iceland to take advantage of its abundant, inexpensive clean energy.",
        "The country's geothermal energy comes from its location on the Mid-Atlantic Ridge, which provides heat from tectonic activity.",
        "Iceland generates all of its electricity from renewable sources, split between geothermal and hydroelectric power."
      ],
      correct: 0,
      explanation:
        "Dual goal: success story + limited applicability. (C) presents both.",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
  ],

  takeaways: [
    "Read the GOAL first, not the notes.",
    "All four answers use correct information. The differentiator is always purpose.",
    "Tag notes mentally: definition, statistic, comparison, date, source.",
    "If the goal has two requirements, the answer must satisfy BOTH.",
  ],
};
