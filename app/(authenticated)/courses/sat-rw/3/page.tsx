"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  StatsVisual,
  DanglingDemo,
  ParallelDemo,
  CorrelativeCheck,
  ApostropheQuiz,
  FrameworkVisual,
} from "./lesson-visuals";

export default function SATRWModule3() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "stats": <StatsVisual />,
        "dangling-demo": <DanglingDemo />,
        "parallel-demo": <ParallelDemo />,
        "correlative-check": <CorrelativeCheck />,
        "apostrophe-quiz": <ApostropheQuiz />,
        "framework": <FrameworkVisual />,
      }}
      nextModuleHref="/courses/sat-rw/4"
      nextModuleLabel="Module 4: Conventions Boss Battle"
      activities={{
        "exercise-modifier-items": (goNext: () => void) => (
          <MatchingExercise
            items={MODIFIER_ITEMS_EXERCISE_DATA}
            title="Modifier"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-parallel-items": (goNext: () => void) => (
          <MatchingExercise
            items={PARALLEL_ITEMS_EXERCISE_DATA}
            title="Parallel"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-spotter-items": (goNext: () => void) => (
          <MatchingExercise
            items={SPOTTER_ITEMS_EXERCISE_DATA}
            title="Spotter"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
 * MODULE 3 — Modifiers, Parallelism & Structure
 * Dangling modifiers, parallel structure, faulty comparisons
 * ═══════════════════════════════════════════════════════ */

const MODIFIER_ITEMS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Running late for the interview,",
    "options": [
      "Sarah's anxiety grew with every red light.",
      "Sarah urged the taxi driver to hurry.",
      "the roads were congested with morning traffic.",
      "the taxi seemed impossibly slow to Sarah."
    ],
    "correct": 1,
    "explanation": "Who is running late? Sarah. She must be the subject right after the comma. Only C puts Sarah as the subject doing the running."
  },
  {
    "prompt": "Discovered in a remote cave in 2019,",
    "options": [
      "it was determined that the fossils were millions of years old.",
      "researchers were amazed by the ancient fossils.",
      "the cave's significance became immediately apparent to the research team.",
      "the ancient fossils challenged existing theories about early migration."
    ],
    "correct": 3,
    "explanation": "What was discovered? The fossils. The fossils must be the subject after the comma. Researchers weren't discovered, and neither was \"it\" or \"the cave's significance.\""
  },
  {
    "prompt": "To understand the full impact of climate change,",
    "options": [
      "scientists must collect data over decades.",
      "decades of data have been considered necessary.",
      "the data must be collected over decades.",
      "long-term data collection is essential for scientists."
    ],
    "correct": 0,
    "explanation": "Who needs to understand? Scientists. They must be the subject. Data doesn't \"understand\" climate change."
  },
  {
    "prompt": "Written in the 17th century,",
    "options": [
      "the manuscript's authorship remains a subject of debate.",
      "debate about the manuscript has persisted for centuries.",
      "the manuscript continues to generate scholarly debate.",
      "scholars continue to debate the authorship of the manuscript."
    ],
    "correct": 2,
    "explanation": "What was written? The manuscript. It must be the subject. Scholars, the manuscript's authorship, and debate were not written."
  },
  {
    "prompt": "Having analyzed data from over 10,000 patients,",
    "options": [
      "the study's conclusions were presented at the conference.",
      "the research team proposed new treatment guidelines.",
      "new treatment guidelines were developed by the research team.",
      "significant patterns emerged from the clinical trials."
    ],
    "correct": 1,
    "explanation": "Who analyzed data? The research team. They must be the subject. Conclusions, guidelines, and patterns didn't analyze anything."
  },
  {
    "prompt": "Praised for its innovative design,",
    "options": [
      "the building attracted visitors from around the world.",
      "the architect received numerous awards for the building.",
      "awards were presented to the architect for the building's design.",
      "critics noted the building's unique blend of materials."
    ],
    "correct": 0,
    "explanation": "What was praised? The building. It must be the subject. The architect was not praised for innovative design (the building was); critics and awards weren't praised either."
  },
  {
    "prompt": "Exhausted after the 12-hour surgery,",
    "options": [
      "the hospital's break room provided a welcome retreat.",
      "relief was felt throughout the surgical team.",
      "Dr. Patel collapsed into a chair in the break room.",
      "the patient's family was informed of the successful outcome."
    ],
    "correct": 2,
    "explanation": "Who was exhausted? Dr. Patel (the surgeon). She must be the subject. The family, break room, and relief weren't exhausted from surgery."
  },
  {
    "prompt": "Originally published as a series of newspaper columns,",
    "options": [
      "a bestselling book emerged from the collection of essays.",
      "publication as a book brought the essays to a wider audience.",
      "readers were surprised when the essays were collected into a bestselling book.",
      "the essays were later collected into a bestselling book."
    ],
    "correct": 3,
    "explanation": "What was originally published as columns? The essays. They must be the subject."
  }
];

const PARALLEL_ITEMS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Fix: \"The new policy aims to reduce emissions, promoting renewable energy, and the creation of green jobs.\"",
    "options": [
      "a reduction in emissions, promoting renewable energy, and creating green jobs.",
      "reducing emissions, the promotion of renewable energy, and green job creation.",
      "reducing emissions, promoting renewable energy, and creating green jobs.",
      "to reduce emissions, to promote renewable energy, and to create green jobs."
    ],
    "correct": 3,
    "explanation": "\"Aims to\" sets up an infinitive series. All three must be infinitives: to reduce, to promote, to create. Option A (gerunds) would also work if the lead-in were different, but \"aims to\" requires infinitives."
  },
  {
    "prompt": "Fix: \"The study was notable for its rigorous methodology, innovative approach, and because it included participants from 30 countries.\"",
    "options": [
      "its rigorous methodology, innovative approach, and it included international participants.",
      "its rigorous methodology, its innovative approach, and its inclusion of participants from 30 countries.",
      "its rigorous methodology, innovative approach, and international scope.",
      "having rigorous methodology, an innovative approach, and because it was international."
    ],
    "correct": 1,
    "explanation": "\"Notable for\" sets up a noun phrase series. All items need the same form. D uses \"its + noun\" three times. A also works as a simpler noun series."
  },
  {
    "prompt": "Fix: \"The athlete not only broke the world record but also she was winning the gold medal.\"",
    "options": [
      "not only broke the world record but she also won the gold medal.",
      "was not only breaking the record but also she won the gold.",
      "not only broke the world record but also won the gold medal.",
      "not only breaking the world record but also won the gold medal."
    ],
    "correct": 2,
    "explanation": "\"Not only...but also\" requires matching forms. \"Broke\" pairs with \"won\" — both simple past. The subject goes BEFORE \"not only,\" not between the halves."
  },
  {
    "prompt": "Fix: \"The architect designed buildings that were both aesthetically pleasing and which had structural innovation.\"",
    "options": [
      "both aesthetically pleasing and they were structurally innovative.",
      "that were both aesthetically pleasing and which had structural innovation.",
      "both aesthetically pleasing and structurally innovative.",
      "both for aesthetic pleasure and structural innovation."
    ],
    "correct": 2,
    "explanation": "\"Both...and\" needs matching forms. A: adjective phrase + adjective phrase. Clean and parallel."
  },
  {
    "prompt": "Fix: \"The manager asked employees to arrive on time, that they complete their reports, and maintaining a professional demeanor.\"",
    "options": [
      "to arrive on time, to complete their reports, and to maintain a professional demeanor.",
      "that they arrive on time, that they complete reports, and that they maintain demeanor.",
      "arriving on time, completing their reports, and maintaining a professional demeanor.",
      "to arrive on time, complete their reports, and maintain a professional demeanor."
    ],
    "correct": 3,
    "explanation": "\"Asked employees to\" sets up infinitives. After the first \"to,\" the remaining items can share it: to arrive, [to] complete, [to] maintain. C is also correct (repeating \"to\"), but A is more concise."
  },
  {
    "prompt": "Fix: \"The research compared the effects of meditation with exercising regularly.\"",
    "options": [
      "the effects of meditation with exercising regularly.",
      "meditation's effects with regular exercise effects.",
      "how meditation affects people with how exercise does.",
      "the effects of meditation with those of regular exercise."
    ],
    "correct": 3,
    "explanation": "Faulty comparison: comparing \"effects\" to \"exercising\" (a noun to a gerund). A fixes it: effects compared to effects (\"those of\" = effects of). Apples to apples."
  }
];

const SPOTTER_ITEMS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Concerned about the rising costs, the budget was revised by the committee.",
    "options": [
      "No error",
      "Misplaced modifier",
      "Squinting modifier",
      "Dangling modifier"
    ],
    "correct": 3,
    "explanation": "Who was concerned? The committee. But \"the budget\" follows the comma. Fix: make \"the committee\" the subject. Corrected: \"Concerned about the rising costs, the committee revised the budget.\""
  },
  {
    "prompt": "The recipe calls for chopping onions, diced tomatoes, and to mince garlic.",
    "options": [
      "Dangling modifier",
      "Squinting modifier",
      "Misplaced modifier",
      "No error"
    ],
    "correct": -1,
    "explanation": "Three items in a list with mixed forms: gerund, past participle, infinitive. Fix: all gerunds. Corrected: \"The recipe calls for chopping onions, dicing tomatoes, and mincing garlic.\""
  },
  {
    "prompt": "The salary of a software engineer in San Francisco is higher than New York.",
    "options": [
      "Dangling modifier",
      "Squinting modifier",
      "Misplaced modifier",
      "No error"
    ],
    "correct": -1,
    "explanation": "Compares salary to a city. Fix with \"that in\" to compare salary to salary. Corrected: \"The salary of a software engineer in San Francisco is higher than that in New York.\""
  },
  {
    "prompt": "A renowned physicist, the lecture by Dr. Chen was fascinating.",
    "options": [
      "No error",
      "Misplaced modifier",
      "Squinting modifier",
      "Dangling modifier"
    ],
    "correct": 3,
    "explanation": "\"A renowned physicist\" is an appositive — it must be next to the person it describes (Dr. Chen), not \"the lecture.\" Corrected: \"A renowned physicist, Dr. Chen delivered a fascinating lecture.\""
  },
  {
    "prompt": "The company aims to increase revenue, reduce costs, and their customer service should be improved.",
    "options": [
      "Dangling modifier",
      "Squinting modifier",
      "Misplaced modifier",
      "No error"
    ],
    "correct": -1,
    "explanation": "\"Aims to\" sets up infinitives. The third item breaks form with a full clause. Fix: infinitive \"improve.\" Corrected: \"The company aims to increase revenue, reduce costs, and improve customer service.\""
  },
  {
    "prompt": "Unlike a traditional classroom, online learning platforms offer flexible scheduling.",
    "options": [
      "Dangling modifier",
      "Squinting modifier",
      "Misplaced modifier",
      "No error"
    ],
    "correct": -1,
    "explanation": "Compares a classroom (singular place) to platforms (plural things). Fix: compare classroom to platform, or classrooms to platforms. Corrected: \"Unlike a traditional classroom, an online learning platform offers flexible scheduling.\""
  },
  {
    "prompt": "The dog wagged it's tail when the owner returned.",
    "options": [
      "Dangling modifier",
      "Squinting modifier",
      "Misplaced modifier",
      "No error"
    ],
    "correct": -1,
    "explanation": "\"It's\" = \"it is.\" The possessive form is \"its\" (no apostrophe). Possessive pronouns never take apostrophes. Corrected: \"The dog wagged its tail when the owner returned.\""
  },
  {
    "prompt": "Hoping to finish the project by Friday, the deadline was extended by the manager.",
    "options": [
      "No error",
      "Misplaced modifier",
      "Squinting modifier",
      "Dangling modifier"
    ],
    "correct": 3,
    "explanation": "Who was hoping? The manager. But \"the deadline\" follows the comma. Fix: make \"the manager\" the subject. Corrected: \"Hoping to finish the project by Friday, the manager extended the deadline.\""
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 3,
  title: "Modifiers, Parallelism & Structure",
  subtitle:
    "Dangling modifiers, broken parallelism, and faulty comparisons \u2014 the SAT's favorite \"sounds right but isn't\" traps. Learn to spot them instantly.",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-modifier-items", label: "Modifier Match", icon: "zap" },
    { id: "exercise-parallel-items", label: "Parallel Match", icon: "zap" },
    { id: "exercise-spotter-items", label: "Spotter Match", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "star" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARMUP (Modules 1-2 Retrieval) ──────── */
  warmup: [
    {
      source: "Module 1 \u2014 Boundaries",
      stem: "The archaeologist carefully documented each artifact _______ she also photographed the surrounding soil layers for context.",
      choices: ["found,", "found;", "found", "found:"],
      correct: 1,
      explanation:
        "Two independent clauses. A semicolon correctly joins them. A comma (A) creates a comma splice. No punctuation (C) creates a run-on. A colon (D) would need the second clause to explain the first.",
    },
    {
      source: "Module 1 \u2014 Boundaries",
      stem: "The new regulations require all food manufacturers to list potential allergens on their _______ failure to comply can result in fines of up to $50,000.",
      choices: [
        "labels; failure",
        "labels. Failure",
        "labels failure",
        "labels, failure"
      ],
      correct: 0,
      explanation:
        "Two ICs need a boundary. Semicolon (B) or period (D) both work, but (D) creates a fragment-style break that misses the logical connection. (A) is a comma splice. (C) is a run-on.",
    },
    {
      source: "Module 1 \u2014 Boundaries",
      stem: "Dr. Okafor _______ a leading researcher in marine biology, has published over forty peer-reviewed studies on coral reef ecosystems.",
      choices: [
        ", a leading researcher in marine biology,",
        "a leading researcher in marine biology",
        "\u2014a leading researcher in marine biology\u2014",
        "(a leading researcher in marine biology)"
      ],
      correct: 0,
      explanation:
        "The appositive \"a leading researcher in marine biology\" renames Dr. Okafor and must be set off. Commas (B) are the standard punctuation. Dashes (A) also work but the question asks for standard conventions.",
    },
    {
      source: "Module 1 \u2014 Boundaries",
      stem: "The committee will review applications from students who have maintained a GPA of 3.5 or _______ and who have completed at least 20 hours of community service.",
      choices: ["higher;", "higher", "higher,", "higher\u2014"],
      correct: 1,
      explanation:
        "\"Who have maintained\u2026or higher\" and \"who have completed\u2026\" are parallel elements in a restrictive clause joined by \"and.\" No punctuation needed before \"and\" connecting two \"who\" clauses.",
    },
    {
      source: "Module 2 \u2014 Agreement",
      stem: "Neither the director nor the actors _______ willing to compromise on the final scene of the production.",
      choices: ["were", "is", "has been", "was"],
      correct: 0,
      explanation:
        "With \"neither\u2026nor,\" the verb agrees with the nearer subject: \"actors\" (plural) \u2192 \"were.\" Present tense options (C, D) don't match the past-tense context.",
    },
    {
      source: "Module 2 \u2014 Agreement",
      stem: "The collection of rare manuscripts, along with several first-edition _______ been donated to the university library.",
      choices: [
        "novels, has",
        "novels has",
        "novels, have",
        "novels have"
      ],
      correct: 0,
      explanation:
        "\"Collection\" (singular) is the subject. \"Along with\u2026novels\" is a parenthetical \u2014 it doesn't change the subject number. Singular subject \u2192 \"has.\" Comma after \"novels\" closes the parenthetical.",
    },
    {
      source: "Module 2 \u2014 Agreement",
      stem: "Every student in the advanced placement courses _______ required to complete a research project before graduation.",
      choices: ["is", "have been", "were", "are"],
      correct: 0,
      explanation:
        "\"Every student\" is singular. \"Is\" matches. \"Are\" (A) and \"have been\" (D) are plural. \"Were\" (B) shifts tense.",
    },
    {
      source: "Module 2 \u2014 Agreement",
      stem: "The data from the climate study _______ that rising ocean temperatures are accelerating the rate of polar ice melt.",
      choices: ["are suggesting", "suggest", "suggests", "have suggested"],
      correct: 2,
      explanation:
        "On the SAT, \"data\" is accepted as either singular or plural \u2014 both \"data suggests\" and \"data suggest\" can be correct. Here, \"suggests\" (B) best fits the singular reading of \"data\" as a collective noun (the dataset).",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "intro",
      title: "The Structure Rules",
      subtitle: "Making sentences clear, balanced, and logical",
      body: [
        "This module covers the remaining \"Form, Structure & Sense\" question types: modifiers, parallelism, and sentence structure. Together with boundaries (Module 1) and agreement (Module 2), these complete the Standard English Conventions domain.",
        "These questions test whether sentences are CLEAR (modifiers point to the right thing), BALANCED (parallel elements match in form), and LOGICAL (comparisons compare equivalent things).",
        "The good news: these rules are mechanical. Once you learn the patterns, they become automatic.",
      ],
      visual: "stats",
    },
    {
      id: "dangling",
      title: "Dangling Modifiers",
      subtitle: "The SAT's sneakiest grammar trap",
      body: [
        "A dangling modifier is an introductory phrase that doesn't logically modify the subject that follows it.",
        "WRONG: \"Walking through the museum, the paintings caught her attention.\"",
        "This says the PAINTINGS were walking through the museum. The introductory phrase \"Walking through the museum\" must be followed by whoever is walking.",
        "RIGHT: \"Walking through the museum, she noticed the paintings.\"",
        "THE RULE: When a sentence begins with a modifying phrase (especially one starting with a verb form like -ing, -ed, To + verb), the subject immediately after the comma MUST be the person or thing performing that action.",
        "This is one of the most frequently tested grammar concepts on the SAT. The test loves to place the wrong noun right after the comma.",
      ],
      visual: "dangling-demo",
    },
    {
      id: "misplaced",
      title: "Misplaced Modifiers",
      subtitle: "Modifiers should be next to what they modify",
      body: [
        "A misplaced modifier is in the wrong position, making the sentence confusing or unintentionally funny.",
        "CONFUSING: \"The researcher presented findings to the committee that were groundbreaking.\"",
        "Was the committee groundbreaking, or were the findings? The modifier \"that were groundbreaking\" is next to \"committee\" but should modify \"findings.\"",
        "CLEAR: \"The researcher presented groundbreaking findings to the committee.\"",
        "RULE: Place modifiers as close as possible to the word they describe. On the SAT, look for relative clauses (that/which/who) and make sure they're adjacent to the correct noun.",
      ],
    },
    {
      id: "only-almost",
      title: "Tricky Modifiers: Only, Nearly, Almost, Just",
      subtitle: "Position changes meaning",
      body: [
        "Words like \"only,\" \"nearly,\" \"almost,\" and \"just\" change the meaning of a sentence based on their position:",
        "\"She only EATS vegetables.\" = She eats them (doesn't grow, cook, or sell them).\n\"She eats ONLY vegetables.\" = She eats nothing but vegetables.",
        "\"The study ALMOST cost $2 million.\" = It didn't quite cost that much.\n\"The study cost ALMOST $2 million.\" = Same meaning, but more natural.\n\"ALMOST the entire study cost $2 million.\" = Nearly all of it cost that.",
        "On the SAT, the correct answer places these modifiers immediately before the word they're meant to limit. When in doubt, ask: \"What specifically is being limited or modified?\"",
      ],
    },
    {
      id: "parallel-intro",
      title: "Parallel Structure: The Balance Rule",
      subtitle: "Matching forms in lists and pairs",
      body: [
        "When items appear in a list or are joined by a conjunction, they must all share the same grammatical form.",
        "WRONG: \"The program focuses on teaching critical thinking, to develop leadership skills, and communication.\"\n\nThis mixes three forms: gerund (teaching), infinitive (to develop), and plain noun (communication).",
        "RIGHT: \"The program focuses on teaching critical thinking, developing leadership skills, and improving communication.\"\n\nNow all three are gerunds. Balanced. Clean.",
        "RULE: In any list connected by \"and,\" \"or,\" or \"but,\" every item must match. Noun with noun, verb with verb, phrase with phrase, clause with clause.",
      ],
      visual: "parallel-demo",
    },
    {
      id: "parallel-pairs",
      title: "Parallel Pairs & Correlatives",
      subtitle: "Not only...but also, either...or, both...and",
      body: [
        "Correlative conjunctions come in pairs, and what follows each half must be parallel:",
        "WRONG: \"The discovery not only challenged existing theories but also was inspiring new research.\"\nRIGHT: \"The discovery not only challenged existing theories but also inspired new research.\"",
        "Both sides must match: \"challenged\" pairs with \"inspired\" (both past tense verbs).",
        "Common correlative pairs:\n  \u2022 not only...but also\n  \u2022 either...or\n  \u2022 neither...nor\n  \u2022 both...and\n  \u2022 whether...or\n  \u2022 as...as\n  \u2022 more/less...than",
        "STRATEGY: Find the word right after the first half of the pair. Then check that the word right after the second half matches it in form.",
      ],
      visual: "correlative-check",
    },
    {
      id: "comparisons",
      title: "Faulty Comparisons",
      subtitle: "Compare apples to apples",
      body: [
        "Comparisons must be between logically equivalent things.",
        "WRONG: \"The population of Tokyo is larger than London.\"\nThis compares a POPULATION to a CITY. You can't compare those.",
        "RIGHT: \"The population of Tokyo is larger than that of London.\"\nOR: \"The population of Tokyo is larger than London's.\"\n\"That of\" and the possessive form both fix the comparison to be population-to-population.",
        "WRONG: \"Like a marathon runner, the stamina of a cyclist must be carefully developed.\"\nThis compares a RUNNER to STAMINA. Not equivalent.",
        "RIGHT: \"Like a marathon runner, a cyclist must carefully develop stamina.\"\nNow it's runner compared to cyclist. Person to person.",
        "The SAT tests this by making the illogical comparison sound natural. Always check: am I comparing the same TYPE of thing on both sides?",
      ],
    },
    {
      id: "appositives",
      title: "Appositives & Noun Phrases",
      subtitle: "Renaming elements must match",
      body: [
        "An appositive is a noun phrase that renames or identifies the noun right next to it.",
        "\"Dr. Okafor, A LEADING NEUROSCIENTIST, published her findings.\"",
        "The appositive \"a leading neuroscientist\" renames \"Dr. Okafor.\" It must be set off by commas (or dashes) and must logically describe the adjacent noun.",
        "WRONG: \"A leading neuroscientist, the findings of Dr. Okafor challenged existing theories.\"",
        "This says \"the findings\" are \"a leading neuroscientist.\" The appositive must be next to the noun it renames.",
        "RIGHT: \"A leading neuroscientist, Dr. Okafor published findings that challenged existing theories.\"",
        "This pattern is closely related to dangling modifiers \u2014 the SAT often disguises appositive errors as modifier questions.",
      ],
    },
    {
      id: "possessives",
      title: "Possessive vs. Plural Confusion",
      subtitle: "Apostrophes matter",
      body: [
        "The SAT tests whether you know when a word needs an apostrophe (possessive) vs. when it's just a plural.",
        "PLURAL (no apostrophe): \"The researchers published their studies.\" \u2014 More than one researcher, more than one study.",
        "POSSESSIVE (apostrophe): \"The researcher's study was published.\" \u2014 The study belonging to the researcher.",
        "PLURAL POSSESSIVE: \"The researchers' studies were published.\" \u2014 Studies belonging to multiple researchers.",
        "ITS vs. IT'S:\n  \u2022 \"its\" = possessive (\"The dog wagged its tail.\")\n  \u2022 \"it's\" = it is / it has (\"It's been raining.\")\n\nThis is counter-intuitive because we normally use apostrophes for possession, but possessive pronouns (its, his, her, their, whose) never take apostrophes.",
      ],
      visual: "apostrophe-quiz",
    },
    {
      id: "decision",
      title: "The Structure Decision Framework",
      subtitle: "How to approach every structure question",
      body: [
        "STEP 1: Check for an introductory phrase. If the sentence starts with a phrase before a comma, make sure the subject right after the comma is the one doing the action in that phrase. If not, it's a dangling modifier.",
        "STEP 2: Check for lists. If you see items connected by and/or/but, make sure every item is in the same grammatical form (all nouns, all gerunds, all clauses, etc.).",
        "STEP 3: Check correlative pairs. If you see \"not only,\" look for \"but also.\" Make sure what follows each half matches in form.",
        "STEP 4: Check comparisons. If you see \"than,\" \"as...as,\" or \"like,\" make sure both sides compare the same type of thing.",
        "STEP 5: Check appositives. If a noun phrase in commas/dashes sits next to a noun, make sure it logically renames that noun.",
        "STEP 6: Check possessives. If you see an apostrophe (or its absence), confirm whether possession or plurality is intended.",
      ],
      visual: "framework",
    },
  ],

  /* ──────── PRACTICE QUIZ (10 questions) ──────── */
  quiz: [
    {
      passage:
        "Determined to finish the marathon despite the pain, ______ pushed through the final three miles.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "the runner",
        "her legs aching, the runner",
        "the runner's determination",
        "running was difficult, but she"
      ],
      correct: 0,
      explanation:
        "\"Determined to finish\" is a participial phrase. The subject after the comma must be the one who is determined = the runner.",
      difficulty: "easy",
      type: "dangling",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "The new curriculum emphasizes reading comprehension, critical thinking, and ______ .",
      stem: "Which choice maintains parallel structure?",
      choices: [
        "that students write effectively",
        "students must write effectively",
        "effective writing",
        "to write effectively"
      ],
      correct: 2,
      explanation:
        "The list contains noun phrases: \"reading comprehension\" and \"critical thinking.\" The third item must be a noun phrase too: \"effective writing.\"",
      difficulty: "easy",
      type: "parallel",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "The researchers found that children who read for pleasure scored higher on standardized tests than ______ .",
      stem: "Which choice produces a logical comparison?",
      choices: [
        "children who primarily watched television",
        "those that watched television",
        "television watching",
        "children's television watching habits"
      ],
      correct: 0,
      explanation:
        "Comparing children to children. A compares children to \"television watching\" (faulty). D uses \"those that\" which is awkward for people. B: children to children.",
      difficulty: "medium",
      type: "comparison",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "The documentary explores the artist's early influences, ______ , and lasting impact on contemporary art.",
      stem: "Which choice maintains parallel structure?",
      choices: [
        "she evolved her technique",
        "the evolution of her technique",
        "how her technique evolved",
        "her technique evolved over time"
      ],
      correct: 1,
      explanation:
        "The list: \"early influences\" (noun phrase), [blank], \"lasting impact\" (noun phrase). B \"the evolution of her technique\" matches as a noun phrase.",
      difficulty: "medium",
      type: "parallel",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "Funded by a grant from the National Science Foundation, ______ spanned three continents and involved over 200 researchers.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "the study's scope was impressive because it",
        "it was determined that the study",
        "researchers conducted a study that",
        "the ambitious five-year study"
      ],
      correct: 3,
      explanation:
        "What was funded? The study. The study must be the subject. A has \"it\" (not funded), B has \"scope\" (not funded), D has \"researchers\" (they received the funding but the phrase modifies the study itself).",
      difficulty: "medium",
      type: "dangling",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "The company's new policy requires employees not only to complete mandatory training ______ .",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "but also to pass a certification exam",
        "but they must also pass a certification exam",
        "and also they pass a certification exam",
        "but also passing a certification exam"
      ],
      correct: 0,
      explanation:
        "\"Not only to complete...but also to pass.\" Infinitive pairs with infinitive. The correlative structure demands matching forms.",
      difficulty: "medium",
      type: "parallel",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "Unlike the delicate brushwork of the Impressionists, ______ favored bold geometric shapes and sharp lines.",
      stem: "Which choice produces a logical comparison?",
      choices: [
        "the Cubists",
        "paintings by the Cubists",
        "Cubist art",
        "the Cubists' paintings"
      ],
      correct: 0,
      explanation:
        "\"Unlike the brushwork\" begins a comparison. But the subject must be who \"favored\" (a person/group, not a painting). \"The Cubists\" favored bold shapes. We're comparing approaches: the Impressionists' approach vs. the Cubists' approach, with the Cubists as agents.",
      difficulty: "hard",
      type: "comparison",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "Published anonymously in 1818, ______ surprised both readers and critics with its sophisticated exploration of ambition and moral responsibility.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "Frankenstein, written by Mary Shelley,",
        "it was Mary Shelley who wrote Frankenstein, which",
        "Mary Shelley's Frankenstein",
        "the novel Frankenstein by Mary Shelley"
      ],
      correct: 2,
      explanation:
        "What was published? The novel. \"Mary Shelley's Frankenstein\" is the novel (possessive identifies the author). It functions as the subject that \"surprised.\" C breaks sentence flow. D creates a fragment issue with the extra clause.",
      difficulty: "hard",
      type: "dangling",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "The orchestra's conductor is known for ______ innovative interpretations of classical works, ability to inspire musicians, and willingness to take artistic risks.",
      stem: "Which choice maintains parallel structure with the rest of the list?",
      choices: ["her", "having", "the", "she has"],
      correct: 0,
      explanation:
        "The three items need matching possessive structure: \"her innovative interpretations,\" \"[her] ability,\" \"[her] willingness.\" The possessive pronoun \"her\" carries through the list implicitly.",
      difficulty: "hard",
      type: "parallel",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "Researchers observed that the drug reduced inflammation as effectively in older patients as ______ .",
      stem: "Which choice produces a logical comparison?",
      choices: [
        "in younger patients",
        "it had in younger patients",
        "treating younger patients",
        "younger patients"
      ],
      correct: 0,
      explanation:
        "\"As effectively in older patients as in younger patients.\" The comparison needs the same preposition: \"in\" older patients / \"in\" younger patients. A drops the preposition. C adds unnecessary verb. D shifts to a gerund.",
      difficulty: "hard",
      type: "comparison",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
  ],

  /* ──────── CHALLENGE (6 hard questions) ──────── */
  challenge: [
    {
      passage:
        "Renowned for their intricate beadwork and vibrant textiles, ______ have attracted scholars from institutions worldwide seeking to study the cultural significance of the patterns.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "Maasai community artisans' work",
        "it is the Maasai artisans who",
        "the artisans of the Maasai community",
        "the crafts produced by Maasai artisans"
      ],
      correct: 2,
      explanation:
        "\"Renowned for their beadwork\" \u2014 who is renowned? The artisans. They must be the subject. (B) puts \"work\" as subject. (C) puts \"crafts\" as subject. (D) \"it\" can't be renowned.",
      difficulty: "hard",
      type: "dangling",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "The museum's new exhibit not only showcases artifacts from ancient Mesopotamia ______ provides interactive digital reconstructions of the cities where they were originally used.",
      stem: "Which choice conforms to Standard English?",
      choices: ["but it also", "but also it", "but also", "and it also"],
      correct: 2,
      explanation:
        "\"Not only showcases...but also provides.\" The subject \"exhibit\" carries through both halves. Inserting \"it\" (A, C, D) breaks the parallel structure by adding a redundant pronoun. Clean correlative: not only [verb] but also [verb].",
      difficulty: "hard",
      type: "parallel",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "The processing speed of the new quantum computer is significantly faster than ______ .",
      stem: "Which choice produces a logical comparison?",
      choices: [
        "traditional supercomputers",
        "that of traditional supercomputers",
        "the speed of traditional supercomputer",
        "traditional supercomputers' speed"
      ],
      correct: 1,
      explanation:
        "Comparing \"processing speed\" to what? Must compare speed to speed. (A) compares speed to computers (faulty). (B) apostrophe placement is awkward. (C) \"that of\" = the processing speed of. (D) singular \"supercomputer\" doesn't match plural context.",
      difficulty: "hard",
      type: "comparison",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "A pioneer in computational linguistics, ______ developed algorithms that could parse natural language with unprecedented accuracy and that revolutionized the field of machine translation.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "Dr. Yamamoto",
        "Dr. Yamamoto's career was defined by having",
        "the algorithms of Dr. Yamamoto",
        "it was Dr. Yamamoto who"
      ],
      correct: 0,
      explanation:
        "\"A pioneer\" is an appositive \u2014 it must rename the person. (D) \"Dr. Yamamoto\" is the pioneer and the subject who \"developed.\" (A) \"algorithms\" aren't a pioneer. (B) \"career\" isn't a pioneer. (C) \"it\" can't be a pioneer.",
      difficulty: "hard",
      type: "dangling",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "The grant proposal emphasized the project's potential to advance theoretical understanding, ______ , and attract partnerships with leading technology firms.",
      stem: "Which choice maintains parallel structure?",
      choices: [
        "the generation of practical applications",
        "generating practical applications while",
        "generate practical applications",
        "practical applications would be generated"
      ],
      correct: 2,
      explanation:
        "The list follows \"potential to\": to advance, [to] _____, [to] attract. All infinitives (sharing \"to\"). (C) \"generate\" matches. (A) full clause breaks form. (B) noun phrase doesn't match infinitive. (D) gerund + \"while\" breaks form.",
      difficulty: "hard",
      type: "parallel",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
    {
      passage:
        "Like the novels of Toni Morrison, which often explore the intersection of personal identity and collective history, ______ frequently examines how individuals navigate cultural displacement.",
      stem: "Which choice produces a logical comparison?",
      choices: [
        "Jhumpa Lahiri",
        "Jhumpa Lahiri has fiction that",
        "Jhumpa Lahiri's fiction",
        "the stories written by Jhumpa Lahiri"
      ],
      correct: 2,
      explanation:
        "\"Like the novels of Toni Morrison\" \u2014 comparing novels to what? Must compare novels to novels. (A) \"Jhumpa Lahiri's fiction\" = fiction compared to novels (equivalent creative works). (B) \"stories written by\" is wordy but could work, except \"examines\" needs a singular subject matching \"fiction.\" (C) compares a person to novels. (D) structural mess.",
      difficulty: "hard",
      type: "comparison",
      domain: "Standard English Conventions",
      skill: "modifiers",
    },
  ],

  takeaways: [
    "After any introductory phrase, the subject immediately after the comma MUST be the person or thing performing that action. This is the #1 tested grammar concept.",
    "In any list connected by and/or/but, every item must match in grammatical form. Noun with noun, verb with verb, phrase with phrase.",
    "Correlative pairs (not only...but also, either...or, both...and) require matching forms after each half.",
    "Comparisons must be between logically equivalent things. \"The population of Tokyo is larger than London\" compares a population to a city — use \"that of\" or possessives to fix.",
    "Appositives must rename the adjacent noun. If \"a renowned physicist\" sits next to \"the lecture,\" the sentence says the lecture is a physicist.",
    "Possessive pronouns (its, his, her, their, whose) never take apostrophes. \"It's\" always means \"it is\" or \"it has.\"",
  ],
};
