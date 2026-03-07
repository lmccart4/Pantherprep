"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  ClauseExamplesVisual,
  ErrorTypesVisual,
  PuncGridVisual,
} from "./lesson-visuals";

const CLC_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "The researchers published their findings in a peer-reviewed journal.",
    "correct": "0",
    "explanation": "Has a subject (researchers), a verb (published), and expresses a complete thought. Independent."
  },
  {
    "prompt": "Although the researchers published their findings in a peer-reviewed journal",
    "correct": "1",
    "explanation": "\"Although\" makes this dependent — it leaves you hanging. Although they published... what happened?"
  },
  {
    "prompt": "When the temperature dropped below freezing",
    "correct": "1",
    "explanation": "\"When\" signals a dependent clause. When the temperature dropped... then what?"
  },
  {
    "prompt": "The temperature dropped below freezing overnight.",
    "correct": "0",
    "explanation": "Subject (temperature), verb (dropped), complete thought. Independent."
  },
  {
    "prompt": "Which was the largest study of its kind",
    "correct": "1",
    "explanation": "\"Which\" makes this a relative clause — dependent. It describes something but can’t stand alone."
  },
  {
    "prompt": "The experiment failed because of contaminated samples.",
    "correct": "0",
    "explanation": "This IS independent. \"Because of contaminated samples\" is a prepositional phrase (not a clause), modifying why it failed. The main clause is complete."
  },
  {
    "prompt": "Because the experiment failed",
    "correct": "1",
    "explanation": "\"Because\" makes this dependent. Because it failed... what happened next?"
  },
  {
    "prompt": "However, the results were inconclusive.",
    "correct": "0",
    "explanation": "\"However\" is a transitional adverb, NOT a subordinating conjunction. The clause \"the results were inconclusive\" is independent. The \"however\" just adds contrast."
  }
];

const ERR_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "The volcano erupted without warning thousands of residents were evacuated within hours.",
    "correct": "0",
    "explanation": "Two independent clauses with NO punctuation between \"warning\" and \"thousands.\" This is a run-on (fused sentence)."
  },
  {
    "prompt": "The volcano erupted without warning, thousands of residents were evacuated within hours.",
    "correct": "1",
    "explanation": "Two independent clauses joined by ONLY a comma. This is a comma splice. Needs a period, semicolon, or comma + conjunction."
  },
  {
    "prompt": "Because the volcano erupted without warning.",
    "correct": "2",
    "explanation": "\"Because\" makes this dependent. It can’t stand alone as a sentence. This is a fragment."
  },
  {
    "prompt": "The volcano erupted without warning; thousands of residents were evacuated within hours.",
    "correct": "3",
    "explanation": "Semicolon correctly joins two closely related independent clauses. This is correct."
  },
  {
    "prompt": "Marine biologists study coral reefs, they are concerned about rising ocean temperatures.",
    "correct": "1",
    "explanation": "Two independent clauses joined by only a comma after \"reefs.\" Comma splice. Fix: \"reefs; they\" or \"reefs, and they.\""
  },
  {
    "prompt": "Marine biologists study coral reefs. They are concerned about rising ocean temperatures.",
    "correct": "3",
    "explanation": "Period correctly separates two independent clauses. Each sentence is complete. Correct."
  },
  {
    "prompt": "The artist completed the mural, however the city council refused to pay for it.",
    "correct": "1",
    "explanation": "\"However\" is NOT a FANBOYS conjunction. A comma before \"however\" between two independent clauses creates a comma splice. Needs: \"mural; however, the city...\""
  },
  {
    "prompt": "Although the experiment was controversial, the results were widely cited.",
    "correct": "3",
    "explanation": "Dependent clause (\"Although...controversial\") followed by a comma and independent clause (\"the results...cited\"). This is the correct structure for a dependent + independent clause combination."
  }
];

const PNC_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Left: The city invested heavily in public transportation\nRight: ridership increased by 40% within two years.\n\nWhat punctuation should join these?",
    "options": [
      "Comma + and: , and",
      "No punctuation (run together)",
      "Comma only: ,",
      "Semicolon: ;"
    ],
    "correct": 3,
    "explanation": "Both sides are independent clauses. A semicolon correctly joins them. A comma alone would be a splice; no punctuation is a run-on."
  },
  {
    "prompt": "Left: The scientists had one primary goal\nRight: to determine whether the new treatment was safe for human trials.\n\nWhat punctuation should join these?",
    "options": [
      "Semicolon: ;",
      "Comma only: ,",
      "Period: .",
      "Colon: :"
    ],
    "correct": 3,
    "explanation": "The second part explains/elaborates on \"one primary goal.\" A colon is perfect here: independent clause + explanation. The part after the colon doesn’t need to be independent."
  },
  {
    "prompt": "Left: The hurricane damaged over 500 homes\nRight: but emergency responders arrived within hours to begin rescue operations.\n\nWhat punctuation should join these?",
    "options": [
      "Period: .",
      "Comma + but: , but",
      "Comma only: ,",
      "Semicolon: ;"
    ],
    "correct": 1,
    "explanation": "\"But\" is a FANBOYS conjunction showing contrast. Comma + but correctly joins two independent clauses. A semicolon before \"but\" would be incorrect."
  },
  {
    "prompt": "Left: The museum\u2019s newest exhibit\nRight: a collection of ancient Egyptian artifacts\u2014opened to record crowds on Saturday.\n\nWhat punctuation should join these?",
    "options": [
      "Colon: :",
      "Semicolon: ;",
      "Period: .",
      "Em dashes around the aside: \u2014 ... \u2014"
    ],
    "correct": 3,
    "explanation": "The phrase \"a collection of ancient Egyptian artifacts\" is a parenthetical aside interrupting the main clause. Em dashes correctly set off this interruption."
  },
  {
    "prompt": "Left: The author wrote over twenty novels\nRight: she never achieved widespread recognition during her lifetime.\n\nWhat punctuation should join these?",
    "options": [
      "Semicolon: ;",
      "Comma + yet: , yet",
      "Both B and C work",
      "Comma only: ,"
    ],
    "correct": 2,
    "explanation": "Both work! A semicolon joins two related independent clauses. \"Comma + yet\" uses a FANBOYS conjunction to show contrast. Either is grammatically correct."
  },
  {
    "prompt": "Left: Although the evidence was compelling\nRight: the jury deliberated for three days before reaching a verdict.\n\nWhat punctuation should join these?",
    "options": [
      "Period: .",
      "Comma: ,",
      "Semicolon: ;",
      "No punctuation needed"
    ],
    "correct": 1,
    "explanation": "The first part is a DEPENDENT clause (\"Although...\"). A comma correctly separates a leading dependent clause from the independent clause that follows. A semicolon is wrong here \u2014 semicolons join two INDEPENDENT clauses."
  }
];

const CMB_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "Sentence 1: \"The discovery was unexpected.\"\nSentence 2: \"It transformed our understanding of the disease.\"",
    "correct": "1",
    "explanation": "B uses a semicolon — legal join #2. A is a comma splice. C is a run-on. D uses \"however\" with only a comma, creating another comma splice."
  },
  {
    "prompt": "Sentence 1: \"The architect designed the building.\"\nSentence 2: \"The building won an international award.\"",
    "correct": "0",
    "explanation": "A uses comma + \"and\" (FANBOYS) — legal join #3. B is a comma splice. C is a run-on. D is awkwardly restructured and creates a fragment."
  },
  {
    "prompt": "Sentence 1: \"The team had a clear objective.\"\nSentence 2: \"They wanted to finish the prototype before the deadline.\"",
    "correct": "3",
    "explanation": "Both work! The semicolon (B) joins two related independent clauses. The colon (C) also works because the second clause EXPLAINS what the objective was. A is a comma splice."
  },
  {
    "prompt": "Sentence 1: \"The temperature dropped rapidly overnight.\"\nSentence 2: \"The pipes in the building froze.\"",
    "correct": "0",
    "explanation": "A uses comma + \"so\" (FANBOYS) to show cause/effect — correct. B is a comma splice. C is a run-on. D uses \"therefore\" (NOT a FANBOYS) with only a comma — comma splice."
  }
];

const FAN_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "and",
    "correct": "0",
    "explanation": "\"And\" is a FANBOYS conjunction. Comma + and legally joins two independent clauses."
  },
  {
    "prompt": "however",
    "correct": "1",
    "explanation": "\"However\" is a transitional adverb, NOT a conjunction. It CANNOT follow a comma to join two independent clauses. Use: semicolon + however + comma."
  },
  {
    "prompt": "but",
    "correct": "0",
    "explanation": "\"But\" is a FANBOYS conjunction. Comma + but legally joins two independent clauses."
  },
  {
    "prompt": "therefore",
    "correct": "1",
    "explanation": "\"Therefore\" is a transitional adverb. \"Clause, therefore clause\" is a comma splice. Correct: \"Clause; therefore, clause.\""
  },
  {
    "prompt": "so",
    "correct": "0",
    "explanation": "\"So\" is the S in FANBOYS. Comma + so correctly joins two independent clauses showing cause/effect."
  },
  {
    "prompt": "moreover",
    "correct": "1",
    "explanation": "\"Moreover\" is a transitional adverb. \"Clause, moreover clause\" is a comma splice. Needs a semicolon."
  },
  {
    "prompt": "yet",
    "correct": "0",
    "explanation": "\"Yet\" is the Y in FANBOYS. Comma + yet correctly joins two independent clauses showing contrast."
  },
  {
    "prompt": "consequently",
    "correct": "1",
    "explanation": "\"Consequently\" is a transitional adverb. Cannot join clauses with just a comma. Use a semicolon."
  },
  {
    "prompt": "for",
    "correct": "0",
    "explanation": "\"For\" (meaning \"because\") is the F in FANBOYS. Comma + for correctly joins two independent clauses."
  },
  {
    "prompt": "furthermore",
    "correct": "1",
    "explanation": "\"Furthermore\" is a transitional adverb. Not a conjunction. Comma + furthermore = comma splice."
  }
];

export default function PSAT89RWModule6() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "clause-examples": <ClauseExamplesVisual />,
        "error-types": <ErrorTypesVisual />,
        "punc-grid": <PuncGridVisual />,
      }}
      activities={{
        "exercise-clc": (goNext: () => void) => (
          <ClassificationExercise
            items={CLC_EXERCISE}
            categories={["0","1"]}
            title="Clause Classifier"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-err": (goNext: () => void) => (
          <ClassificationExercise
            items={ERR_EXERCISE}
            categories={["0","1","2","3"]}
            title="Error Spotter"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-pnc": (goNext: () => void) => (
          <MatchingExercise
            items={PNC_EXERCISE}
            title="Pick the Punctuation"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-cmb": (goNext: () => void) => (
          <ClassificationExercise
            items={CMB_EXERCISE}
            categories={["1","0","3"]}
            title="Sentence Combiner"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-fan": (goNext: () => void) => (
          <ClassificationExercise
            items={FAN_EXERCISE}
            categories={["0","1"]}
            title="FANBOYS or Not?"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/psat89-rw/7"
      nextModuleLabel="Module 7: Agreement, Verb Form & Modifiers"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "rw",
  moduleNum: 6,
  title: "Sentence Boundaries & Punctuation",
  subtitle:
    "Topic 6A — Clause Types & the Independence Test",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-clc", label: "Clause Classifier", icon: "zap" },
    { id: "exercise-err", label: "Error Spotter", icon: "zap" },
    { id: "exercise-pnc", label: "Pick the Punctuation", icon: "zap" },
    { id: "exercise-cmb", label: "Sentence Combiner", icon: "zap" },
    { id: "exercise-fan", label: "FANBOYS or Not?", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "6a",
      title: "Independent vs. Dependent Clauses",
      subtitle: "Topic 6A — Clause Types & the Independence Test",
      body: ["Before you can fix sentence boundaries, you need to tell the difference between clauses that can stand alone and clauses that can't.","An independent clause has a subject, a verb, and expresses a complete thought. It could be its own sentence. A dependent clause starts with a subordinating word and cannot stand alone.","Common Subordinating Words (Make Clauses Dependent):\n• Time: after, before, when, while, until, since, as\n• Cause/condition: because, since, if, unless, although, even though, whereas\n• Relative: who, which, that, where, whose","Quick test: Read the clause out loud. If it sounds complete — like something you'd text a friend — it's independent. If it sounds like someone stopped mid-sentence, it's dependent."],
      visual: "clause-examples",
    },
    {
      id: "6b",
      title: "The Three Errors: Run-ons, Comma Splices & Fragments",
      subtitle: "Topic 6B — Recognizing Boundary Errors",
      body: ["These are the three sentence boundary errors the PSAT tests. Learn to spot them and you're halfway to the right answer.","Run-on (fused sentence): Two independent clauses with NO punctuation between them.\n✗ The study was groundbreaking it changed the field forever.","Comma splice: Two independent clauses joined by ONLY a comma (no conjunction).\n✗ The study was groundbreaking, it changed the field forever.","Fragment: A dependent clause or phrase punctuated as a complete sentence.\n✗ Because the study was groundbreaking.","The PSAT's Favorite: Comma Splices — Comma splices are the #1 tested error. The PSAT loves to put a comma between two independent clauses and see if you'll accept it. Remember: a comma alone CANNOT join two independent clauses.","Tricky case — transitional words: Words like however, therefore, moreover, consequently, furthermore are NOT conjunctions. They cannot join clauses with just a comma. \"The results were clear, however the team wanted more data\" is a comma splice. You need a semicolon: \"The results were clear; however, the team wanted more data.\""],
      visual: "error-types",
    },
    {
      id: "6c",
      title: "The Five Legal Joins",
      subtitle: "Topic 6C — Five Ways to Join Independent Clauses",
      body: ["There are exactly five correct ways to join two independent clauses. Memorize these and you can solve every sentence boundary question.","1. Period: The study was groundbreaking. It changed the field forever.\n2. Semicolon: The study was groundbreaking; it changed the field forever.\n3. Comma + FANBOYS: The study was groundbreaking, and it changed the field forever.\n4. Colon: The study had one clear result: it changed the field forever.\n5. Em dash: The study was groundbreaking—it changed the field forever.","When to Use Each:\n• Period: Default choice. Always correct between two independent clauses.\n• Semicolon: When the ideas are closely related and you want to show the connection.\n• Comma + FANBOYS: When you want to show a specific relationship (contrast with \"but,\" addition with \"and,\" cause with \"so\").\n• Colon: When the second clause explains, illustrates, or elaborates on the first. The first clause MUST be independent.\n• Em dash: For dramatic emphasis or an abrupt addition. Creates a stronger pause than a comma.","FANBOYS Memory Aid: For · And · Nor · But · Or · Yet · So\n\nOnly these seven words are coordinating conjunctions. Only these can follow a comma to join two independent clauses. Words like \"however,\" \"therefore,\" and \"moreover\" are NOT FANBOYS and cannot be used with just a comma.","The colon rule: What comes BEFORE a colon must be an independent clause. What comes AFTER can be anything: a clause, a list, a phrase, even a single word. If the part before the colon isn't a complete sentence, the colon is wrong."],
      visual: "punc-grid",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      passage: "The Great Wall of China stretches over 13,000 miles ___ it was built over several centuries by multiple dynasties.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["across China, it", "across China, and, it", "across China. It", "across China it"],
      correct: 2,
      explanation: "Two independent clauses need a legal join. A period (B) correctly separates them. A is a comma splice. C is a run-on. D has an extra comma after \"and.\"",
    },
    {
      passage: "The musician practiced for hours every day ___ dedication eventually earned her a spot in the national orchestra.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["; her", "her", ", her", ", and her"],
      correct: 0,
      explanation: "Two independent clauses. A semicolon (B) correctly joins them. A is a comma splice. C is a run-on. D works too, but B is the best match for the blank structure shown.",
    },
    {
      passage: "Because the river flooded the surrounding farmland ___",
      stem: "Which choice correctly completes the sentence?",
      choices: [", the crops were destroyed.", "the crops were destroyed.", ", and the crops were destroyed.", "which was unusual for the season."],
      correct: 0,
      explanation: "\"Because the river flooded...\" is a dependent clause. When a dependent clause starts the sentence, follow it with a comma, then the independent clause. C is correct: comma + independent clause.",
    },
    {
      passage: "Dr. Patel’s research has focused on one persistent question ___ whether early childhood nutrition affects cognitive development decades later.",
      stem: "Which choice correctly completes the sentence?",
      choices: [": whether", ", which is", ". Whether", "; whether"],
      correct: 0,
      explanation: "The second part explains/elaborates on \"one persistent question.\" A colon (B) is perfect after an independent clause to introduce an explanation. D creates a fragment (\"Whether...\" can’t stand alone).",
    },
    {
      passage: "The archaeological team discovered pottery fragments ___ however, they were unable to determine the artifacts’ exact age.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["; however", ". However", "; however,", ", however,"],
      correct: 2,
      explanation: "\"However\" is NOT a FANBOYS conjunction. Between two independent clauses, use a semicolon before \"however\" and a comma after. B is correct. A is a comma splice.",
    },
    {
      passage: "Monarch butterflies migrate thousands of miles each year ___ a journey that takes multiple generations to complete.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["; a journey", "—a journey", ". A journey", ", a journey"],
      correct: 1,
      explanation: "The phrase \"a journey that takes...\" is an appositive renaming/explaining the migration. An em dash (B) dramatically introduces this elaboration. D creates a fragment. A works grammatically but B is stronger for the PSAT’s preferred style.",
    },
    {
      passage: "The chef sources all ingredients locally ___ supporting nearby farms and reducing the restaurant’s carbon footprint.",
      stem: "Which choice correctly completes the sentence?",
      choices: [", and supporting", "; supporting", ". Supporting", ", supporting"],
      correct: 3,
      explanation: "\"Supporting...\" is a participial phrase (NOT an independent clause). A comma correctly attaches it to the main clause. B is wrong because a semicolon requires an independent clause on both sides. C creates a fragment.",
    },
    {
      passage: "The study’s findings were significant, ___ they suggested that sleep quality, not just sleep duration, was the critical factor in cognitive performance.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["they", "for, they", "for they", "so, they"],
      correct: 2,
      explanation: "\"For\" (meaning \"because\") is a FANBOYS conjunction. Comma + for correctly joins two independent clauses. B has an extra comma. C creates a comma splice (no conjunction). D has an unnecessary comma after \"so.\"",
    },
    {
      passage: "Although wind power has become increasingly cost-effective ___ some communities resist the installation of wind turbines due to aesthetic concerns and potential effects on local wildlife.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["some", ". Some", ", some", "; some"],
      correct: 2,
      explanation: "\"Although...\" is a dependent clause. When it opens the sentence, follow it with a comma + independent clause. B is correct. A is wrong (semicolons join two INDEPENDENT clauses). C has no punctuation. D would make \"Although...\" a fragment.",
    },
    {
      passage: "The novelist completed her manuscript in just three months ___ a pace that astonished her editor ___ who had expected the project to take at least a year.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["—a pace that astonished her editor, who", "—a pace that astonished her editor—who", "; a pace that astonished her editor, who", ", a pace that astonished her editor; who"],
      correct: 0,
      explanation: "An em dash introduces the dramatic aside \"a pace that astonished her editor.\" Then \"who had expected...\" is a relative clause modifying \"editor\" — attached with a comma. A correctly uses em dash + comma.",
    },
  ],
  takeaways: [
    "Independent clause = subject + verb + complete thought. Can stand alone as a sentence.",
    "Dependent clause = starts with a subordinating word (because, although, when, etc.). Cannot stand alone.",
    "Three errors: Run-on (no punctuation), comma splice (comma only), fragment (incomplete sentence).",
    "Comma splices are the #1 tested error. A comma alone CANNOT join two independent clauses.",
    "Five legal joins: period, semicolon, comma + FANBOYS, colon, em dash.",
    "FANBOYS only: for, and, nor, but, or, yet, so. Words like \"however\" and \"therefore\" are NOT conjunctions.",
    "Colon rule: What comes BEFORE a colon must be an independent clause.",
    "When in doubt, a period is always a safe choice between two independent clauses.",
  ],
};
