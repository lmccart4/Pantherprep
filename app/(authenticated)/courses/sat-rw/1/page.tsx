"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  StatsVisual,
  ClauseCheckVisual,
  CommaSpliceDemoVisual,
  SemicolonTestVisual,
  ColonTestVisual,
  DecisionTreeVisual,
} from "./lesson-visuals";

const COURTROOM_CASES_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "The comet was visible for three nights, astronomers from around the world gathered to observe it.",
    "correct": "Comma Splice",
    "explanation": "guilty. Two independent clauses joined by only a comma. Fix: \"The comet was visible for three nights; astronomers from around the world gathered to observe it.\""
  },
  {
    "prompt": "Although the museum had recently renovated its west wing, attendance figures remained disappointingly low.",
    "correct": "Correct",
    "explanation": "innocent. \"Although...wing\" is a dependent clause, so the comma correctly attaches it to the independent clause."
  },
  {
    "prompt": "The city council approved the new budget; however, several members expressed reservations about the timeline.",
    "correct": "Correct",
    "explanation": "innocent. Semicolon correctly joins two independent clauses. \"However\" is a conjunctive adverb, not a FANBOYS conjunction, so it needs a semicolon (not just a comma)."
  },
  {
    "prompt": "The novelist spent years researching the historical period she wanted her characters to feel authentic.",
    "correct": "Run-On",
    "explanation": "guilty. Two independent clauses with no punctuation between them. Fix: \"The novelist spent years researching the historical period; she wanted her characters to feel authentic.\""
  },
  {
    "prompt": "Having studied the effects of sleep deprivation on cognitive performance for over a decade.",
    "correct": "Fragment",
    "explanation": "guilty. This is a participial phrase with no independent clause. It has no main subject performing a main action. Fix: \"Having studied the effects of sleep deprivation on cognitive performance for over a decade, Dr. Reyes published her comprehensive findings.\""
  },
  {
    "prompt": "The orchestra performed Beethoven's Fifth Symphony, and the audience responded with a standing ovation.",
    "correct": "Correct",
    "explanation": "innocent. Comma + \"and\" (FANBOYS) correctly joins two independent clauses."
  },
  {
    "prompt": "The archaeological dig revealed artifacts from three distinct periods: Bronze Age tools, Roman pottery, and Medieval coins.",
    "correct": "Correct",
    "explanation": "innocent. Colon correctly introduces a list that specifies \"three distinct periods.\" The left side is an independent clause."
  },
  {
    "prompt": "Dr. Okafor's research challenged decades of assumptions, it demonstrated that the prevailing theory was fundamentally flawed.",
    "correct": "Comma Splice",
    "explanation": "guilty. Two independent clauses joined by only a comma. A colon works here because the second clause explains the first. Fix: \"Dr. Okafor's research challenged decades of assumptions: it demonstrated that the prevailing theory was fundamentally flawed.\""
  },
  {
    "prompt": "The medication showed promise in early trials, but the side effects — which ranged from mild headaches to severe nausea — concerned the review board.",
    "correct": "Correct",
    "explanation": "innocent. Comma + \"but\" joins the two independent clauses. The em-dashes correctly set off the parenthetical aside, and they match as a pair."
  },
  {
    "prompt": "The team collected samples from the riverbed, they analyzed them in the university's new laboratory.",
    "correct": "Comma Splice",
    "explanation": "guilty. Two independent clauses joined only by a comma. One fix: combine into one clause with \"and\" (no comma needed since \"analyzed\" shares the subject \"team\"). Fix: \"The team collected samples from the riverbed and analyzed them in the university's new laboratory.\""
  },
  {
    "prompt": "While the northern regions experienced record rainfall this season.",
    "correct": "Fragment",
    "explanation": "guilty. \"While\" makes this a dependent clause. It cannot stand alone. Fix: \"While the northern regions experienced record rainfall this season, the southern plains remained in drought.\""
  },
  {
    "prompt": "The professor's lecture covered three major topics — the causes of the revolution, its key figures, and its lasting impact on constitutional law.",
    "correct": "Correct",
    "explanation": "innocent. The em-dash introduces a list (functioning like a colon). The left side is an independent clause."
  }
];

const BUILDER_ITEMS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Join: \"The researchers published their findings\" ___ \"the scientific community responded with skepticism\"",
    "options": [
      "\". \"",
      "\": \"",
      "\", \"",
      "\"; \""
    ],
    "correct": 3,
    "explanation": "Both sides are independent clauses. A semicolon joins them (they're closely related). A period also works. A comma alone would be a splice. A colon doesn't fit because the second clause doesn't explain the first."
  },
  {
    "prompt": "Join: \"The study identified one critical flaw\" ___ \"the sample size was far too small to draw meaningful conclusions\"",
    "options": [
      "\"; \"",
      "\", \"",
      "\": \"",
      "\" — \""
    ],
    "correct": 2,
    "explanation": "The second clause explains/specifies the \"critical flaw\" mentioned in the first. A colon is ideal here. An em-dash also works (it can replace a colon). A comma would be a splice."
  },
  {
    "prompt": "Join: \"The coral reef ecosystem had been deteriorating for decades\" ___ \"conservation efforts finally began to show results\"",
    "options": [
      "\", \"",
      "\". \"",
      "\"; \"",
      "\", but \""
    ],
    "correct": 3,
    "explanation": "The second clause contrasts with the first (deterioration → results). \"Comma + but\" signals this contrast perfectly. Semicolon and period are grammatically correct but miss the contrast. Comma alone = splice."
  },
  {
    "prompt": "Join: \"Although the evidence was compelling\" ___ \"the jury remained unconvinced\"",
    "options": [
      "\". \"",
      "\", \"",
      "\": \"",
      "\"; \""
    ],
    "correct": 1,
    "explanation": "\"Although the evidence was compelling\" is a DEPENDENT clause. It cannot stand alone. Only a comma works here — a semicolon, colon, or period would all create a fragment on the left side."
  },
  {
    "prompt": "Join: \"The company announced three major initiatives\" ___ \"expanding into Asian markets, launching a sustainability program, and restructuring the executive team\"",
    "options": [
      "\"; \"",
      "\", \"",
      "\": \"",
      "\" — \""
    ],
    "correct": 2,
    "explanation": "The second part is a list that specifies the \"three major initiatives.\" A colon is the standard choice for introducing a specifying list. An em-dash also works."
  },
  {
    "prompt": "Join: \"The ancient manuscript — which had been presumed lost for centuries\" ___ \"was discovered in a private collection in Istanbul\"",
    "options": [
      "\" — \"",
      "\": \"",
      "\"; \"",
      "\", \""
    ],
    "correct": 0,
    "explanation": "There's already an opening em-dash before \"which,\" so you need a closing em-dash to complete the pair. Dashes must match! Using a comma, semicolon, or colon here would be mismatched punctuation."
  },
  {
    "prompt": "Join: \"The musician practiced for eight hours every day\" ___ \"she won the international competition at age seventeen\"",
    "options": [
      "\". \"",
      "\"; \"",
      "\", and \"",
      "\", \""
    ],
    "correct": 1,
    "explanation": "Both are independent clauses. Semicolon, period, and comma+and all work grammatically. Comma alone = splice."
  },
  {
    "prompt": "Join: \"The senator voted against the bill\" ___ \"citing concerns about its potential impact on small businesses\"",
    "options": [
      "\". \"",
      "\", \"",
      "\": \"",
      "\"; \""
    ],
    "correct": 1,
    "explanation": "\"Citing concerns...\" is a participial phrase (not an independent clause). It CANNOT stand alone. Only a comma works — semicolon, colon, and period would all create a fragment on the right side."
  }
];

export default function SATRWModule1() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "stats": <StatsVisual />,
        "clause-check": <ClauseCheckVisual />,
        "comma-splice-demo": <CommaSpliceDemoVisual />,
        "semicolon-test": <SemicolonTestVisual />,
        "colon-test": <ColonTestVisual />,
        "decision-tree": <DecisionTreeVisual />,
      }}
      activities={{
        "exercise-courtroom-cases": (goNext: () => void) => (
          <ClassificationExercise
            items={COURTROOM_CASES_EXERCISE}
            categories={["Comma Splice","Correct","Run-On","Fragment"]}
            title="Courtroom Cases"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-builder-items": (goNext: () => void) => (
          <MatchingExercise
            items={BUILDER_ITEMS_EXERCISE}
            title="Builder"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/sat-rw/2"
      nextModuleLabel="Module 2: Agreement & Verb Tense"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 1,
  title: "Module 1",
  subtitle:
    "The #1 grammar skill on the SAT",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-courtroom-cases", label: "Courtroom Cases", icon: "zap" },
    { id: "exercise-builder-items", label: "Builder Items", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "intro",
      title: "Why Boundaries Matter",
      subtitle: "The #1 grammar skill on the SAT",
      body: ["Sentence boundary questions make up roughly 10% of the entire SAT R&W section — about 5-6 questions per test. They're also the grammar rule students miss most often, because comma splices \"sound natural\" in everyday speech.","The core concept is simple: every sentence must have clear boundaries. A sentence starts with a capital letter and ends with a period, question mark, or exclamation point. Between sentences, you need proper punctuation — not just a comma.","This module teaches you the four boundary tools the SAT tests, how to spot the three boundary crimes, and gives you practice until the rules feel automatic."],
      visual: "stats",
    },
    {
      id: "independent",
      title: "Independent Clauses: The Building Blocks",
      subtitle: "What makes a complete sentence",
      body: ["An independent clause has a subject and a verb and expresses a complete thought. It can stand alone as a sentence.","\"The researchers published their findings.\" ← This is an independent clause. It has a subject (researchers), a verb (published), and expresses a complete thought.","\"Although the researchers published their findings\" ← This is NOT independent. The word \"although\" makes it dependent — it needs more information to be complete."],
      visual: "clause-check",
    },
    {
      id: "comma-splice",
      title: "Crime #1: The Comma Splice",
      subtitle: "The most common boundary error on the SAT",
      body: ["A comma splice occurs when two independent clauses are joined with just a comma — no conjunction, no stronger punctuation.","WRONG: \"The experiment failed, the team started over.\"","This is wrong because both halves are independent clauses. A comma alone can't hold them together. Think of it this way: a comma is like a speed bump, but two independent clauses need a stop sign.","This is the SAT's favorite trick because comma splices sound perfectly natural when you read them aloud. Your ear won't catch this — you need to know the rule."],
      visual: "comma-splice-demo",
    },
    {
      id: "run-on",
      title: "Crime #2: The Run-On (Fused Sentence)",
      subtitle: "Two sentences crammed together with nothing between them",
      body: ["A run-on sentence (or fused sentence) joins two independent clauses with no punctuation at all.","WRONG: \"The experiment failed the team started over.\"","Run-ons are less common on the SAT than comma splices because they're easier to spot. But they still appear, especially in longer sentences where the boundary gets buried in complex phrasing."],
    },
    {
      id: "fragment",
      title: "Crime #3: The Fragment",
      subtitle: "An incomplete thought pretending to be a sentence",
      body: ["A fragment is a group of words that lacks a subject, a verb, or a complete thought — but is punctuated as if it were a sentence.","WRONG: \"Although the experiment produced promising results.\" ← The word \"although\" makes this dependent. It needs a main clause to complete the thought.","WRONG: \"The team of researchers from three different universities.\" ← No verb. We know who, but not what they did.","On the SAT, fragments often appear as answer choices that use a period or semicolon to separate a dependent clause from the independent clause it belongs to."],
    },
    {
      id: "fix-period",
      title: "Fix #1: The Period",
      subtitle: "The simplest boundary — make two sentences",
      body: ["The most straightforward fix is to use a period to create two separate sentences.","\"The experiment failed. The team started over.\"","This always works when both halves are independent clauses. On the SAT, if you see a period separating two independent clauses, it's grammatically correct — though the question may test whether it's the BEST choice given the context."],
    },
    {
      id: "fix-semicolon",
      title: "Fix #2: The Semicolon",
      subtitle: "Joining related independent clauses",
      body: ["A semicolon joins two independent clauses that are closely related in meaning. Think of it as a \"soft period\" — it creates a boundary but signals continuation.","\"The experiment failed; the team started over.\"","KEY RULE: Both sides of a semicolon must be independent clauses. You cannot use a semicolon between an independent clause and a dependent clause or a phrase.","WRONG: \"Although the experiment failed; the team started over.\" ← The left side is dependent.","The SAT loves testing this. If you see a semicolon in an answer choice, check both sides — each must be able to stand alone as a sentence."],
      visual: "semicolon-test",
    },
    {
      id: "fix-colon",
      title: "Fix #3: The Colon",
      subtitle: "Introducing what comes next",
      body: ["A colon introduces an explanation, example, or list that elaborates on the preceding clause.","\"The experiment revealed one clear finding: the treatment was ineffective.\"","KEY RULE: The part BEFORE the colon must be an independent clause. What comes after can be a clause, phrase, or list — it doesn't have to be independent.","\"The team needed three things: funding, equipment, and volunteers.\" ← List after colon = fine.","WRONG: \"The team needed: funding, equipment, and volunteers.\" ← \"The team needed\" is not a complete thought on its own."],
      visual: "colon-test",
    },
    {
      id: "fix-dash",
      title: "Fix #4: The Em-Dash",
      subtitle: "The flexible boundary tool",
      body: ["An em-dash (—) is the most flexible punctuation mark. It can replace a comma, colon, or parentheses. On the SAT, em-dashes most commonly:","1. Set off an interruption or aside: \"The lead researcher — who had been skeptical from the start — agreed to publish the results.\"","2. Introduce an explanation (like a colon): \"The team reached a conclusion — the treatment was ineffective.\"","CRITICAL RULE: Dashes come in pairs when they set off a mid-sentence element. If there's a dash before an interruption, there must be a dash after it (not a comma, not a parenthesis). The SAT frequently tests this matching rule."],
    },
    {
      id: "fix-comma-conjunction",
      title: "Fix #5: Comma + FANBOYS",
      subtitle: "The conjunction junction",
      body: ["A comma followed by a coordinating conjunction (FANBOYS: For, And, Nor, But, Or, Yet, So) can join two independent clauses.","\"The experiment failed, so the team started over.\"","\"The data was promising, but the sample size was too small.\"","KEY RULE: You need BOTH the comma AND the conjunction. A conjunction alone (no comma) is technically a run-on with longer sentences, and a comma alone (no conjunction) is a comma splice.","NOTE: You do NOT use a comma before FANBOYS when what follows is not an independent clause: \"The team collected data and published their findings.\" ← No comma needed because \"published their findings\" has no subject — it's not independent."],
    },
    {
      id: "decision",
      title: "The Boundary Decision Framework",
      subtitle: "How to approach every boundary question",
      body: ["When you see a boundary question on the SAT, follow this process:","STEP 1: Read the full sentence. Identify how many independent clauses are present.","STEP 2: Find the boundary point — where does one clause end and the next begin?","STEP 3: Check each answer choice against the rules:\n  • Period/Semicolon → both sides must be independent clauses\n  • Colon → left side must be independent; right side explains/lists\n  • Comma + FANBOYS → both sides independent, correct conjunction for meaning\n  • Comma alone → ONLY legal if one side is dependent\n  • Dash → can replace comma, colon, or parentheses; dashes must match in pairs","STEP 4: Eliminate any choice that creates a comma splice, run-on, or fragment."],
      visual: "decision-tree",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      passage: "The volcano had been dormant for over two centuries ______ geologists warned that recent seismic activity suggested an eruption was possible within the next decade.",
      stem: "Which choice completes the text so that it conforms to Standard English?",
      choices: ["centuries but", "centuries", "centuries,", "centuries, but"],
      correct: 3,
      explanation: "Two independent clauses with a contrast relationship. \"Comma + but\" (FANBOYS) correctly joins them. Comma alone = splice. \"But\" alone (no comma) is technically a run-on. No punctuation = fused sentence.",
      difficulty: "easy",
    },
    {
      passage: "Marine biologist Dr. Tanaka spent three years studying whale migration patterns ______ her research has since been cited in over forty peer-reviewed journals.",
      stem: "Which choice completes the text so that it conforms to Standard English?",
      choices: ["patterns", "patterns,", "patterns:", "patterns;"],
      correct: 3,
      explanation: "Two independent clauses. Semicolon correctly joins them. Comma alone = splice. Colon doesn't fit (second clause doesn't explain the first). No punctuation = run-on.",
      difficulty: "easy",
    },
    {
      passage: "The architect's design incorporated several sustainable features ______ solar panels on the roof, rainwater collection systems, and walls made from recycled materials.",
      stem: "Which choice completes the text so that it conforms to Standard English?",
      choices: ["features", "features:", "features;", "features,"],
      correct: 1,
      explanation: "The second part is a list specifying the \"sustainable features.\" Colon correctly introduces a list after an independent clause. Semicolon would require an independent clause on the right. Comma = splice.",
      difficulty: "medium",
    },
    {
      passage: "While the northern hemisphere experiences summer ______ the southern hemisphere experiences winter due to the tilt of Earth's axis relative to the sun.",
      stem: "Which choice completes the text so that it conforms to Standard English?",
      choices: ["summer:", "summer.", "summer,", "summer;"],
      correct: 2,
      explanation: "\"While the northern hemisphere experiences summer\" is a DEPENDENT clause (starts with \"while\"). Only a comma works. Semicolon, colon, and period would each create a fragment on the left.",
      difficulty: "medium",
    },
    {
      passage: "The playwright's early works were largely ignored by critics ______ her later plays — which explored themes of identity and displacement — earned widespread acclaim.",
      stem: "Which choice completes the text so that it conforms to Standard English?",
      choices: ["critics,", "critics —", "critics;", "critics, but"],
      correct: 3,
      explanation: "Two independent clauses with contrast. \"Comma + but\" is correct. Note the em-dashes in the second clause correctly match as a pair around the aside. Comma alone = splice.",
      difficulty: "medium",
    },
    {
      passage: "Dr. Okonkwo's analysis revealed a striking pattern ______ regions that had invested heavily in early childhood education consistently outperformed those that had not, regardless of other socioeconomic factors.",
      stem: "Which choice completes the text so that it conforms to Standard English?",
      choices: ["pattern:", "pattern,", "pattern;", "pattern —"],
      correct: 0,
      explanation: "The second part explains/specifies the \"striking pattern.\" A colon introduces this explanation. An em-dash would also work (though it's not among the best choices here). Comma = splice. Semicolon is grammatically fine but misses the explanatory relationship.",
      difficulty: "hard",
    },
    {
      passage: "The expedition team, which had been preparing for the ascent for over two ______ that weather conditions at the summit had deteriorated beyond what their equipment could safely handle.",
      stem: "Which choice completes the text so that it conforms to Standard English?",
      choices: ["years discovered", "years; discovered", "years. Discovered", "years, discovered"],
      correct: 3,
      explanation: "\"Which had been preparing...two years\" is a nonrestrictive clause set off by commas. The comma after \"years\" closes this clause, returning to the main sentence: \"The expedition team...discovered.\" Semicolon and period would fragment the sentence. No comma would fuse the modifier into the verb.",
      difficulty: "hard",
    },
    {
      passage: "The senator argued that the proposed legislation would not merely address the immediate crisis ______ it would establish a framework for preventing similar situations in the future.",
      stem: "Which choice completes the text so that it conforms to Standard English?",
      choices: ["crisis:", "crisis,", "crisis;", "crisis, rather,"],
      correct: 2,
      explanation: "Two independent clauses. The semicolon correctly joins them. Comma alone = splice. Colon is possible but less conventional here since the second clause extends rather than explains. \"Rather\" between commas creates a comma splice with extra interruption.",
      difficulty: "hard",
    },
    {
      passage: "The muralist — whose large-scale works depicting scenes of community resilience have earned her international ______ recently announced a new public art initiative in three underserved neighborhoods.",
      stem: "Which choice completes the text so that it conforms to Standard English?",
      choices: ["recognition,", "recognition —", "recognition:", "recognition;"],
      correct: 1,
      explanation: "There's an opening em-dash before \"whose,\" so we need a closing em-dash after the aside to match. This returns us to the main clause: \"The muralist...recently announced.\" Dashes must come in pairs!",
      difficulty: "hard",
    },
    {
      passage: "Researchers found that participants who received the experimental treatment showed significant improvement; ______ those in the control group showed no change over the same period.",
      stem: "Which choice completes the text so that it conforms to Standard English?",
      choices: ["however", "however;", "however,", ", however,"],
      correct: 2,
      explanation: "After a semicolon, \"however,\" (with a comma) correctly begins the second independent clause. The semicolon already provides the boundary. \"However;\" would create a double boundary. No comma after \"however\" violates the convention for conjunctive adverbs.",
      difficulty: "hard",
    },
  ],

  takeaways: [
    "A comma alone cannot join two independent clauses — that is a comma splice.",
    "Both sides of a semicolon must be independent clauses.",
    "The left side of a colon must be an independent clause; the right side explains or lists.",
    "Em-dashes must come in matched pairs when setting off a mid-sentence aside.",
    "Comma + FANBOYS (for, and, nor, but, or, yet, so) correctly joins two independent clauses.",
    "Fragments lack a subject, verb, or complete thought — watch for dependent clause starters like although, while, because.",
  ],
};
