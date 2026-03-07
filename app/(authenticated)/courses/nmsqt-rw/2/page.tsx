"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  ClauseCheckVisual,
  JoinsTestVisual,
  SemiTestVisual,
  ColonTestVisual,
  DecisionTreeVisual,
} from "./lesson-visuals";

const SEMI_TESTS_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "\"The concert was sold out ; thousands of fans waited outside\"",
    "correct": "Correct",
    "explanation": "Both sides are independent clauses ✓"
  },
  {
    "prompt": "\"Although the rain continued ; the match went ahead as planned\"",
    "correct": "Incorrect",
    "explanation": "Left side is dependent (starts with \"although\") ✗"
  },
  {
    "prompt": "\"The chef prepared three dishes ; a risotto, a steak, and a soufflé\"",
    "correct": "Incorrect",
    "explanation": "Right side is a list/phrase, not an IC ✗ (Use a colon)"
  }
];

const COLON_TESTS_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "\"The study reached a clear conclusion ; the drug was ineffective\"",
    "correct": "Correct",
    "explanation": "Left is independent; right explains the conclusion ✓"
  },
  {
    "prompt": "\"The team needed ; more funding, better equipment, and additional staff\"",
    "correct": "Incorrect",
    "explanation": "\"The team needed\" is NOT a complete sentence ✗"
  },
  {
    "prompt": "\"Three factors contributed to the decline ; pollution, overfishing, and climate change\"",
    "correct": "Correct",
    "explanation": "Left is independent; right lists the three factors ✓"
  }
];

const CLAUSE_ITEMS_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "The researchers published their findings.",
    "correct": "Independent Clause",
    "explanation": ""
  },
  {
    "prompt": "Although the data was inconclusive.",
    "correct": "Dependent Clause",
    "explanation": ""
  },
  {
    "prompt": "Running through the forest at dawn.",
    "correct": "Dependent Clause",
    "explanation": ""
  },
  {
    "prompt": "She discovered a new species.",
    "correct": "Independent Clause",
    "explanation": ""
  },
  {
    "prompt": "Because the funding was cut.",
    "correct": "Dependent Clause",
    "explanation": ""
  },
  {
    "prompt": "The committee voted unanimously.",
    "correct": "Independent Clause",
    "explanation": ""
  }
];

const COURTROOM_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "The comet was visible for three nights, astronomers from around the world gathered to observe it.",
    "correct": "Comma Splice",
    "explanation": "guilty. Two ICs joined by only a comma. Fix: \"The comet was visible for three nights; astronomers from around the world gathered to observe it.\""
  },
  {
    "prompt": "Although the museum had recently renovated its west wing, attendance figures remained disappointingly low.",
    "correct": "Correct",
    "explanation": "innocent. \"Although...wing\" is a DC, so the comma correctly attaches it to the IC."
  },
  {
    "prompt": "The city council approved the new budget; however, several members expressed reservations about the timeline.",
    "correct": "Correct",
    "explanation": "innocent. Semicolon correctly joins two ICs. \"However\" needs a semicolon, not just a comma."
  },
  {
    "prompt": "The novelist spent years researching the historical period she wanted her characters to feel authentic.",
    "correct": "Run-On",
    "explanation": "guilty. Two ICs with no punctuation between them. Fix: \"The novelist spent years researching the historical period; she wanted her characters to feel authentic.\""
  },
  {
    "prompt": "Having studied the effects of sleep deprivation on cognitive performance for over a decade.",
    "correct": "Fragment",
    "explanation": "guilty. Participial phrase with no independent clause. Fix: \"Having studied the effects of sleep deprivation for over a decade, Dr. Reyes published her findings.\""
  },
  {
    "prompt": "The orchestra performed Beethoven’s Fifth Symphony, and the audience responded with a standing ovation.",
    "correct": "Correct",
    "explanation": "innocent. Comma + \"and\" (FANBOYS) correctly joins two ICs."
  },
  {
    "prompt": "The archaeological dig revealed artifacts from three distinct periods: Bronze Age tools, Roman pottery, and Medieval coins.",
    "correct": "Correct",
    "explanation": "innocent. Colon correctly introduces a list. Left side is an IC."
  },
  {
    "prompt": "Dr. Okafor’s research challenged decades of assumptions, it demonstrated that the prevailing theory was fundamentally flawed.",
    "correct": "Comma Splice",
    "explanation": "guilty. Two ICs joined by only a comma. Fix: \"Dr. Okafor’s research challenged decades of assumptions: it demonstrated that the prevailing theory was fundamentally flawed.\""
  },
  {
    "prompt": "The medication showed promise in early trials, but the side effects — which ranged from mild headaches to severe nausea — concerned the review board.",
    "correct": "Correct",
    "explanation": "innocent. Comma + \"but\" joins two ICs. Em-dashes correctly pair around the aside."
  },
  {
    "prompt": "While the northern regions experienced record rainfall this season.",
    "correct": "Fragment",
    "explanation": "guilty. \"While\" makes this a DC. It cannot stand alone. Fix: \"While the northern regions experienced record rainfall this season, the southern plains remained in drought.\""
  }
];

const BUILDER_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Sentence 1: The researchers published their findings\nSentence 2: the scientific community responded with skepticism\n\nHow should these sentences be joined?",
    "options": [
      "; ",
      ", ",
      ": ",
      ". "
    ],
    "correct": 0,
    "explanation": "Both sides are ICs. Semicolon or period work. Comma = splice. Colon doesn’t fit."
  },
  {
    "prompt": "Sentence 1: The study identified one critical flaw\nSentence 2: the sample size was far too small\n\nHow should these sentences be joined?",
    "options": [
      ": ",
      "; ",
      " — ",
      ", "
    ],
    "correct": 0,
    "explanation": "Second clause explains the \"flaw.\" Colon ideal. Em-dash also works."
  },
  {
    "prompt": "Sentence 1: The coral reef had been deteriorating for decades\nSentence 2: conservation efforts finally began to show results\n\nHow should these sentences be joined?",
    "options": [
      ", but ",
      "; ",
      ", ",
      ". "
    ],
    "correct": 0,
    "explanation": "Contrast relationship. \"Comma + but\" perfect. Comma alone = splice."
  },
  {
    "prompt": "Sentence 1: Although the evidence was compelling\nSentence 2: the jury remained unconvinced\n\nHow should these sentences be joined?",
    "options": [
      ": ",
      ". ",
      ", ",
      "; "
    ],
    "correct": 2,
    "explanation": "\"Although...\" is DEPENDENT. Only a comma works."
  },
  {
    "prompt": "Sentence 1: The company announced three major initiatives\nSentence 2: expanding into Asian markets, launching a sustainability program, and restructuring\n\nHow should these sentences be joined?",
    "options": [
      ": ",
      "; ",
      " — ",
      ", "
    ],
    "correct": 0,
    "explanation": "List specifying \"three initiatives.\" Colon standard."
  },
  {
    "prompt": "Sentence 1: The ancient manuscript \u2014 which had been presumed lost for centuries\nSentence 2: was discovered in a private collection\n\nHow should these sentences be joined?",
    "options": [
      ": ",
      "; ",
      " — ",
      ", "
    ],
    "correct": 2,
    "explanation": "Opening dash needs closing dash. Dashes must match!"
  },
  {
    "prompt": "Sentence 1: The senator voted against the bill\nSentence 2: citing concerns about its potential impact on small businesses\n\nHow should these sentences be joined?",
    "options": [
      ": ",
      ". ",
      ", ",
      "; "
    ],
    "correct": 2,
    "explanation": "\"Citing concerns...\" is a participial phrase. Only a comma works."
  }
];

export default function NMSQTRWModule2() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "clause-check": <ClauseCheckVisual />,
        "joins-test": <JoinsTestVisual />,
        "semi-test": <SemiTestVisual />,
        "colon-test": <ColonTestVisual />,
        "decision-tree": <DecisionTreeVisual />,
      }}
      activities={{
        "exercise-semi-tests": (goNext: () => void) => (
          <ClassificationExercise
            items={SEMI_TESTS_EXERCISE}
            categories={["Correct","Incorrect"]}
            title="Semicolon Test"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-colon-tests": (goNext: () => void) => (
          <ClassificationExercise
            items={COLON_TESTS_EXERCISE}
            categories={["Correct","Incorrect"]}
            title="Colon Test"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-clause-items": (goNext: () => void) => (
          <ClassificationExercise
            items={CLAUSE_ITEMS_EXERCISE}
            categories={["Independent Clause","Dependent Clause"]}
            title="Clause Identifier"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-courtroom": (goNext: () => void) => (
          <ClassificationExercise
            items={COURTROOM_EXERCISE}
            categories={["Comma Splice","Correct","Run-On","Fragment"]}
            title="Comma Splice Courtroom"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-builder": (goNext: () => void) => (
          <MatchingExercise
            items={BUILDER_EXERCISE}
            title="Sentence Builder"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/nmsqt-rw/3"
      nextModuleLabel="Module 3: The Grammar Playbook, Part II"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "rw",
  moduleNum: 2,
  title: "The Grammar Playbook, Part I",
  subtitle:
    "Sentence Boundaries \u2014 Fragments, Run-Ons, Comma Splices, and the Four Legal Joins",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-semi-tests", label: "Semicolon Test", icon: "zap" },
    { id: "exercise-colon-tests", label: "Colon Test", icon: "zap" },
    { id: "exercise-clause-items", label: "Clause Identifier", icon: "zap" },
    { id: "exercise-courtroom", label: "Comma Splice Courtroom", icon: "zap" },
    { id: "exercise-builder", label: "Sentence Builder", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "star" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "clauses",
      title: "Independent vs. Dependent Clauses",
      subtitle: "The building blocks of every Boundaries question",
      body: ["Every Boundaries question comes down to one skill: can you tell whether a group of words is an independent clause or not?","An INDEPENDENT CLAUSE (IC) has a subject + verb and expresses a complete thought.\n\u2713 \"The researchers published their findings.\"","A DEPENDENT CLAUSE (DC) has a subject + verb but starts with a subordinator (because, although, when, while, if, since, that, which, who\u2026).\n\u2717 \"Because the researchers published their findings\"","A PHRASE lacks a subject-verb pair entirely.\n\u2717 \"After the publication of the findings\""],
      visual: "clause-check",
    },
    {
      id: "joins",
      title: "The Four Legal Joins",
      subtitle: "The only ways to connect independent clauses",
      body: ["When you have two ICs, there are exactly four legal ways to join them:","1. PERIOD: IC. IC\n2. SEMICOLON: IC; IC\n3. COMMA + FANBOYS: IC, and IC\n4. COLON: IC: explanation/list","FANBOYS = For, And, Nor, But, Or, Yet, So. \"However,\" \"therefore,\" \"moreover\" are NOT FANBOYS.","The Three Illegal Moves:\n\u274c Comma splice: IC, IC\n\u274c Run-on: IC IC\n\u274c Comma + non-FANBOYS: IC, however, IC"],
      visual: "joins-test",
    },
    {
      id: "semicolon",
      title: "Semicolon Deep Dive",
      subtitle: "Both sides must be independent",
      body: ["A semicolon joins two closely related independent clauses.","Its the \"soft period.\"\n\u2713 \"The experiment failed; the team started over.\"","KEY RULE: Both sides must be ICs.","If either side is dependent or a phrase, a semicolon is WRONG.\n\u2717 \"Although the experiment failed; the team started over.\""],
      visual: "semi-test",
    },
    {
      id: "colon",
      title: "Colon Deep Dive",
      subtitle: "The left side must be independent",
      body: ["A colon introduces an explanation, example, or list.","The part BEFORE the colon must be an independent clause.\n\u2713 \"The experiment revealed one finding: the treatment was ineffective.\"","What comes after can be a clause, phrase, or list.","Watch out: \"The team needed: funding, equipment, and volunteers.\" is WRONG. \"The team needed\" is not a complete sentence."],
      visual: "colon-test",
    },
    {
      id: "dash",
      title: "The Em-Dash",
      subtitle: "The flexible boundary tool",
      body: ["An em-dash can replace a comma, colon, or parentheses. It adds emphasis or dramatic pause.","Set off an interruption: \"The lead researcher \u2014 who had been skeptical \u2014 agreed to publish.\"","Introduce an explanation: \"The team reached a conclusion \u2014 the treatment was ineffective.\"","CRITICAL: Dashes come in pairs for mid-sentence elements. Opening dash MUST have a closing dash."],
    },
    {
      id: "decision",
      title: "The Boundary Decision Framework",
      subtitle: "How to approach every question",
      body: ["Step 1: Read the full sentence. Identify clause boundaries.","Step 2: Count ICs. IC + IC? IC + DC? IC + phrase?","Step 3: If IC + IC \u2192 which of the four legal joins does each answer choice use?","Step 4: Eliminate illegal joins.","Step 5: Among remaining choices, pick the best logical relationship."],
      visual: "decision-tree",
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      stem: "Marine biologists studying coral reefs have found that certain species of parrotfish play a crucial role in reef health. By feeding on algae that would otherwise _______ coral, parrotfish help maintain the delicate balance of reef ecosystems. Which choice completes the text with the most logical and precise word?",
      choices: ["decorate", "illuminate", "approach", "smother"],
      correct: 3,
      explanation: "\"Smother\" means to suffocate — precisely what unchecked algae does to coral.",
    },
    {
      stem: "The James Webb Space Telescope, launched in December 2021, has provided astronomers with unprecedented views of the early _______ its infrared instruments can detect light from galaxies that formed just 300 million years after the Big Bang. Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["universe, its", "universe. Its", "universe; and its", "universe its"],
      correct: 1,
      explanation: "Two ICs need proper separation. Period works. (A) comma splice. (C) run-on.",
    },
    {
      stem: "Traditional beekeeping relies on stationary hives that draw from nearby flower sources. _______ migratory beekeeping involves transporting hives across hundreds of miles to follow seasonal blooms. Which choice completes the text with the most logical transition?",
      choices: ["For instance,", "Similarly,", "In contrast,", "Therefore,"],
      correct: 2,
      explanation: "\"Stationary\" vs. \"transporting\" — opposite approaches. \"In contrast\" signals opposition.",
    },
    {
      stem: "The museum’s new collection of Renaissance paintings, donated by several private collectors from across Europe, _______ a significant expansion of the institution’s holdings in Italian art. Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["represents", "represent", "were representing", "have been representing"],
      correct: 0,
      explanation: "Subject is \"collection\" (singular). Phrases between commas are distractors. → \"represents.\"",
    },
    {
      stem: "Archaeologist Sarah Parcak has pioneered the use of satellite imagery to locate ancient sites buried beneath modern landscapes. Her work demonstrates that even the most thoroughly studied regions may still harbor significant undiscovered structures. Which choice best states the main idea of the text?",
      choices: ["Parcak is the most important archaeologist of the 21st century.", "Infrared technology is superior to traditional methods.", "Satellite-based archaeology can reveal hidden sites even in well-studied areas.", "Egypt contains more pyramids than previously believed."],
      correct: 2,
      explanation: "Choice C captures the main idea. A too extreme, B too narrow, D unsupported.",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      passage: "Mycologist Paul Stamets has argued that fungi networks beneath forest floors function as a kind of natural internet, allowing trees to share nutrients and chemical _______ recent experiments have largely supported this theory.",
      stem: "Which choice completes the text?",
      choices: ["signals. Recent", "signals, and, recent", "signals, recent", "signals recent"],
      correct: 0,
      explanation: "Two ICs. Period separates them. (A) splice. (C) run-on.",
      difficulty: "easy",
    },
    {
      passage: "The renovation of the city’s oldest theater took three years longer than _______ the final result was widely praised as a masterful blend of preservation and modernization.",
      stem: "Which choice completes the text?",
      choices: ["expected; the", "expected and, the", "expected, the", "expected the"],
      correct: 0,
      explanation: "Two ICs. Semicolon joins them. (A) splice. (C) run-on.",
      difficulty: "easy",
    },
    {
      passage: "In the 1960s, marine biologist Rachel Carson warned that widespread pesticide use was devastating bird populations. Her book Silent Spring sparked a national _______ leading directly to the creation of the Environmental Protection Agency.",
      stem: "Which choice completes the text?",
      choices: ["debate leading", "debate. Leading", "debate; leading", "debate, leading"],
      correct: 3,
      explanation: "\"Leading...\" is a participial phrase. Comma attaches it. (B) fragment.",
      difficulty: "medium",
    },
    {
      passage: "The archaeological site in southern Turkey, known as Göbekli Tepe, predates Stonehenge by approximately 6,000 _______ its discovery in the 1990s forced historians to fundamentally reconsider the timeline of human civilization.",
      stem: "Which choice completes the text?",
      choices: ["years, and, its", "years; its", "years its", "years, its"],
      correct: 1,
      explanation: "Two ICs. (A) splice. (C) run-on.",
      difficulty: "easy",
    },
    {
      passage: "Although the new solar panel design was significantly more efficient than previous _______ the high manufacturing costs prevented it from being adopted widely.",
      stem: "Which choice completes the text?",
      choices: ["models the", "models; the", "models, the", "models. The"],
      correct: 2,
      explanation: "\"Although...\" is a DC. Comma separates from IC.",
      difficulty: "medium",
    },
    {
      passage: "The musicians rehearsed for six hours every day in preparation for the _______ they understood that only flawless execution could earn them a spot at the international competition.",
      stem: "Which choice completes the text?",
      choices: ["performance they", "performance, they", "performance; they", "performance, and, they"],
      correct: 2,
      explanation: "Two ICs. Semicolon correct. (A) splice.",
      difficulty: "easy",
    },
    {
      passage: "Dr. Amara Singh developed a groundbreaking technique for detecting early-stage cancer using a simple blood _______ her method can identify tumors months before they would appear on traditional imaging scans.",
      stem: "Which choice completes the text?",
      choices: ["test, however, her", "test, her", "test her", "test: her"],
      correct: 3,
      explanation: "Second IC explains what’s \"groundbreaking.\" Colon signals elaboration.",
      difficulty: "hard",
    },
    {
      passage: "The documentary filmmaker spent two years living among the indigenous _______ during that time, she gained their trust and was granted unprecedented access to sacred ceremonies.",
      stem: "Which choice completes the text?",
      choices: ["community; during", "community, during", "community. During, that", "community during"],
      correct: 0,
      explanation: "Two ICs. Semicolon separates them. (A) splice.",
      difficulty: "medium",
    },
    {
      passage: "The quantum computer solved in four minutes a problem that would have taken a classical computer 10,000 _______ skeptics noted that the comparison involved a problem specifically designed to favor quantum approaches.",
      stem: "Which choice completes the text?",
      choices: ["years, skeptics", "years, but, skeptics", "years skeptics", "years; skeptics"],
      correct: 3,
      explanation: "Two contrasting ICs. Semicolon works. (A) splice.",
      difficulty: "medium",
    },
    {
      passage: "The poet’s early work reflected the optimism of the postwar _______ her later poems, written during a period of personal loss, adopted a markedly darker tone.",
      stem: "Which choice completes the text?",
      choices: ["era, her", "era, and her", "era; her", "era her"],
      correct: 2,
      explanation: "Two contrasting ICs. Semicolon correct. (A) splice.",
      difficulty: "medium",
    },
    {
      passage: "Because the river had been contaminated by decades of industrial _______ the local government allocated $50 million to a comprehensive cleanup effort.",
      stem: "Which choice completes the text?",
      choices: ["waste the", "waste, the", "waste; the", "waste. The"],
      correct: 1,
      explanation: "\"Because...\" is a DC. Comma separates from IC.",
      difficulty: "medium",
    },
    {
      passage: "The architect envisioned a building that would generate more energy than it _______ solar panels on the roof, geothermal heating, and a rainwater collection system would all contribute to the structure’s net-positive energy footprint.",
      stem: "Which choice completes the text?",
      choices: ["consumed, solar", "consumed; solar", "consumed solar", "consumed: solar"],
      correct: 3,
      explanation: "List fulfills the \"promise\" of the first IC. Colon signals elaboration.",
      difficulty: "hard",
    },
  ],

  /* ──────── CHALLENGE ──────── */
  challenge: [
    {
      passage: "The historian’s controversial thesis — that the empire’s collapse was caused not by external invasion but by internal economic _______ challenged decades of established scholarship.",
      stem: "Which choice completes the text?",
      choices: ["mismanagement —,", "mismanagement —", "mismanagement,", "mismanagement;"],
      correct: 1,
      explanation: "Opening dash needs closing dash. (B) comma can’t close a dash.",
      difficulty: "hard",
    },
    {
      passage: "The composer’s final symphony was unlike anything she had written _______ where her earlier works had been restrained and classical, this piece was wild and improvisational.",
      stem: "Which choice completes the text?",
      choices: ["before, where", "before: where", "before. Where,", "before; where"],
      correct: 1,
      explanation: "Colon explains HOW it was \"unlike anything.\" (A) splice.",
      difficulty: "hard",
    },
    {
      passage: "Three factors contributed to the vaccine’s rapid _______ unprecedented government funding, a global network of volunteer trial participants, and years of prior research.",
      stem: "Which choice completes the text?",
      choices: ["development; unprecedented", "development: unprecedented", "development unprecedented", "development, unprecedented"],
      correct: 1,
      explanation: "First IC promises \"three factors.\" Colon delivers.",
      difficulty: "hard",
    },
    {
      passage: "The playwright’s dialogue sounds naturalistic — characters interrupt each other, trail off mid-sentence, and repeat _______ however, every seeming imperfection is meticulously scripted.",
      stem: "Which choice completes the text?",
      choices: ["themselves; however,", "themselves. However", "themselves, however,", "themselves — however,"],
      correct: 0,
      explanation: "\"However\" needs semicolon before, comma after. (A) splice.",
      difficulty: "hard",
    },
    {
      passage: "The chemist identified a compound that could dissolve microplastics without harming marine _______ a discovery that, if scalable, could transform ocean cleanup efforts worldwide.",
      stem: "Which choice completes the text?",
      choices: ["life; a", "life, a", "life: a", "life — a"],
      correct: 3,
      explanation: "Appositive phrase (not IC). Dash adds emphasis.",
      difficulty: "hard",
    },
    {
      passage: "Although quantum computing promises to revolutionize fields from cryptography to drug _______ the technology remains decades away from practical, everyday applications.",
      stem: "Which choice completes the text?",
      choices: ["discovery; the", "discovery: the", "discovery, the", "discovery. The"],
      correct: 2,
      explanation: "\"Although...\" is DC. Comma separates from IC.",
      difficulty: "medium",
    },
    {
      passage: "The building’s architect employed a controversial _______ rather than hiding the steel support beams behind decorative facades, she left them exposed.",
      stem: "Which choice completes the text?",
      choices: ["strategy: rather", "strategy. Rather", "strategy; rather", "strategy, rather"],
      correct: 0,
      explanation: "Colon explains what the \"strategy\" was.",
      difficulty: "hard",
    },
    {
      passage: "The study’s participants were divided into three groups: those who exercised daily, those who exercised weekly, and those who did not exercise at _______ the researchers then tracked their cognitive performance over six months.",
      stem: "Which choice completes the text?",
      choices: ["all: the", "all, the", "all; the", "all. The"],
      correct: 2,
      explanation: "Two ICs. (A) splice. (D) second colon confusing.",
      difficulty: "hard",
    },
  ],

  takeaways: [
    "Every Boundaries question comes down to one skill: identifying whether a group of words is an independent clause (IC) or not.",
    "There are exactly four legal ways to join two ICs: period, semicolon, comma + FANBOYS, or colon.",
    "The three illegal moves are comma splice (IC, IC), run-on (IC IC), and comma + non-FANBOYS (IC, however, IC).",
    "A semicolon requires ICs on both sides. A colon requires an IC on the left side.",
    "Em-dashes come in pairs for mid-sentence elements -- an opening dash must have a closing dash.",
    "For every Boundaries question: read the full sentence, count ICs, identify the join, and eliminate illegal options.",
  ],
};
