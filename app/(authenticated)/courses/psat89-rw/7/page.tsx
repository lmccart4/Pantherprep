"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  CrossOutVisual,
  PronounCardsVisual,
  TenseTimelineVisual,
  DanglingFixVisual,
} from "./lesson-visuals";

const PRO_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "The committee announced that they would release their findings next month.",
    "correct": "0",
    "explanation": "\"Committee\" is singular (it’s one group). Should be: \"it would release its findings.\" Collective nouns are singular on the PSAT."
  },
  {
    "prompt": "When a student finishes the exam early, you should review your answers.",
    "correct": "1",
    "explanation": "Shifts from third person (\"a student\") to second person (\"you\"). Fix: \"he or she should review his or her answers\" or \"students...they.\""
  },
  {
    "prompt": "Dr. Rivera told Dr. Chen that she should reconsider her methodology.",
    "correct": "2",
    "explanation": "\"She\" and \"her\" could refer to either Dr. Rivera or Dr. Chen. Fix: use the specific name instead of the pronoun."
  },
  {
    "prompt": "The hikers packed their gear, checked their maps, and made sure they had enough water.",
    "correct": "3",
    "explanation": "All pronouns clearly refer to \"hikers\" (plural), and the person is consistent throughout. No error!"
  },
  {
    "prompt": "If one wants to succeed in college, they need to develop strong study habits.",
    "correct": "1",
    "explanation": "\"One\" (third person singular) shifts to \"they\" (third person plural). Fix: \"one needs to develop\" or rewrite with \"students...they.\""
  },
  {
    "prompt": "The scientist’s research was groundbreaking; she published it in three major journals.",
    "correct": "4",
    "explanation": "\"Scientist’s\" is possessive (modifies \"research\"), so it can’t serve as the antecedent for \"she.\" Fix: \"The scientist conducted groundbreaking research; she published it...\""
  }
];

const TNS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "The biologist observed the bird colony for six months. During that time, she ___ over 40 distinct behaviors.",
    "options": [
      "documents (present)",
      "had documented (past perfect)",
      "has documented (present perfect)",
      "documented (past)"
    ],
    "correct": 3,
    "explanation": "The passage is in past tense (\"observed\"). The action happened during the same past time period. \"Documented\" (simple past) keeps the tense consistent."
  },
  {
    "prompt": "By the time the firefighters arrived at the scene, the fire ___ most of the warehouse.",
    "options": [
      "had destroyed (past perfect)",
      "has destroyed (present perfect)",
      "was destroying (past progressive)",
      "destroyed (past)"
    ],
    "correct": 0,
    "explanation": "The fire finished destroying the warehouse BEFORE the firefighters arrived. Use past perfect (\"had destroyed\") for an action completed before another past event."
  },
  {
    "prompt": "In his 1905 paper, Einstein demonstrated that light ___ at a constant speed regardless of the observer\u2019s motion.",
    "options": [
      "travels (present)",
      "would travel (conditional)",
      "had traveled (past perfect)",
      "traveled (past)"
    ],
    "correct": 0,
    "explanation": "Light traveling at a constant speed is a permanent scientific truth. Even within a past-tense narrative, use present tense for facts that are still true: \"light travels.\""
  },
  {
    "prompt": "The orchestra rehearsed every afternoon last week. By Friday, the musicians ___ the difficult third movement.",
    "options": [
      "perfected (past)",
      "perfect (present)",
      "have perfected (present perfect)",
      "had perfected (past perfect)"
    ],
    "correct": 3,
    "explanation": "Both the rehearsing and the perfecting happened in the same past time frame (last week). Past perfect (\"had perfected\") would work if we then described a LATER past event, but here simple past is the best fit for the parallel timeline."
  },
  {
    "prompt": "Researchers at the university are studying how prolonged screen time ___ children\u2019s sleep patterns.",
    "options": [
      "has affected (present perfect)",
      "affected (past)",
      "affects (present)",
      "will affect (future)"
    ],
    "correct": 2,
    "explanation": "The researchers ARE studying (present progressive) how something currently happens. The ongoing relationship between screen time and sleep calls for present tense: \"affects.\""
  }
];

const MOD_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "Soaring above the canyon, the tourists watched the eagle with binoculars.",
    "correct": "3",
    "explanation": "As written, \"soaring above the canyon\" modifies \"the tourists\" — implying the tourists are soaring. D correctly places the eagle right after the modifier and clarifies who has binoculars."
  },
  {
    "prompt": "The internship requires writing reports, analyzing data, and to present findings to the board.",
    "correct": "3",
    "explanation": "The list mixes gerunds (\"writing,\" \"analyzing\") with an infinitive (\"to present\"). Both B (all gerunds) and C (all infinitives) fix the parallel structure error."
  },
  {
    "prompt": "Known for her innovative techniques, the gallery displayed the artist’s paintings in a special exhibit.",
    "correct": "2",
    "explanation": "\"Known for her innovative techniques\" must modify the ARTIST, not \"the gallery.\" C places \"the artist\" right after the modifier. B puts \"paintings\" after the modifier, which is also wrong."
  },
  {
    "prompt": "The program aims to improve literacy, to reduce dropout rates, and strengthening community engagement.",
    "correct": "3",
    "explanation": "The list mixes infinitives (\"to improve,\" \"to reduce\") with a gerund (\"strengthening\"). Both B (all infinitives) and C (all gerunds) create proper parallel structure."
  }
];

const SRT_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "The team of engineers are designing a new bridge.",
    "correct": "0",
    "explanation": "Subject = \"team\" (singular). \"Of engineers\" is a prepositional phrase. Should be \"is designing.\" Subject-verb agreement error."
  },
  {
    "prompt": "Walking through the museum, the paintings impressed the visitors.",
    "correct": "3",
    "explanation": "\"Walking through the museum\" modifies \"the paintings\" — paintings can’t walk. Dangling modifier."
  },
  {
    "prompt": "The researcher published her findings, and her colleague reviewed it carefully.",
    "correct": "1",
    "explanation": "\"Findings\" is plural, but \"it\" is singular. Should be \"them.\" Pronoun agreement error."
  },
  {
    "prompt": "The chef prepared the appetizers, grills the steaks, and plated the desserts.",
    "correct": "2",
    "explanation": "\"Prepared\" (past) → \"grills\" (present) → \"plated\" (past). Should be \"grilled.\" Verb tense error."
  },
  {
    "prompt": "The company plans to hire new employees, to expand its offices, and launching a new product.",
    "correct": "4",
    "explanation": "Two infinitives (\"to hire,\" \"to expand\") then a gerund (\"launching\"). Should be \"to launch.\" Parallel structure error."
  },
  {
    "prompt": "Each of the volunteers were given a certificate of appreciation.",
    "correct": "0",
    "explanation": "\"Each\" is always singular. Should be \"was given.\" Subject-verb agreement error."
  },
  {
    "prompt": "Having completed the experiment, the data was analyzed by the team.",
    "correct": "3",
    "explanation": "\"Having completed the experiment\" modifies \"the data\" — data can’t complete experiments. Should be: \"Having completed the experiment, the team analyzed the data.\""
  },
  {
    "prompt": "The study was published in 2020, and it shows that biodiversity was declining rapidly.",
    "correct": "2",
    "explanation": "\"Was published\" (past) is fine, but \"shows\" (present) and \"was declining\" (past progressive) create an awkward tense shift. Either \"showed...was declining\" or \"shows...is declining.\""
  }
];

export default function PSAT89RWModule7() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "cross-out": <CrossOutVisual />,
        "pronoun-cards": <PronounCardsVisual />,
        "tense-timeline": <TenseTimelineVisual />,
        "dangling-fix": <DanglingFixVisual />,
      }}
      activities={{
        "exercise-pro": (goNext: () => void) => (
          <ClassificationExercise
            items={PRO_EXERCISE}
            categories={["0","1","2","3","4"]}
            title="Pronoun Fix-Up"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-tns": (goNext: () => void) => (
          <MatchingExercise
            items={TNS_EXERCISE}
            title="Tense Patrol"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-mod": (goNext: () => void) => (
          <ClassificationExercise
            items={MOD_EXERCISE}
            categories={["3","2"]}
            title="Modifier & Parallel Structure"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-srt": (goNext: () => void) => (
          <ClassificationExercise
            items={SRT_EXERCISE}
            categories={["0","3","1","2","4"]}
            title="Error Type Sorter"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/psat89-rw/8"
      nextModuleLabel="Module 8: Transitions"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "rw",
  moduleNum: 7,
  title: "Agreement, Verb Form & Modifiers",
  subtitle:
    "Topic 7A \\u2014 Subject-Verb Agreement",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-pro", label: "Pronoun Fix-Up", icon: "zap" },
    { id: "exercise-tns", label: "Tense Patrol", icon: "zap" },
    { id: "exercise-mod", label: "Modifier & Parallel Structure", icon: "zap" },
    { id: "exercise-srt", label: "Error Type Sorter", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "7a",
      title: "Finding the True Subject",
      subtitle: "Topic 7A — Subject-Verb Agreement",
      body: ["The PSAT’s favorite trick: bury the subject under prepositional phrases, appositives, or relative clauses so you lose track of whether it’s singular or plural.","The Core Rule: A singular subject takes a singular verb. A plural subject takes a plural verb. The challenge is finding the TRUE subject.","Strategy: Cross Out the Noise\nStep 1: Find the verb.\nStep 2: Ask “WHO or WHAT does this verb?” — that’s the subject.\nStep 3: Cross out everything between the subject and verb (prepositional phrases, appositives, relative clauses). These are noise.\nStep 4: Check: does the subject match the verb in number?","Five Tricky Patterns:\n• Intervening phrase: \"The collection of rare stamps is valuable.\" (Subject = collection, singular.)\n• Inverted order: \"Among the ruins were several ancient artifacts.\" (Subject = artifacts, plural — it comes AFTER the verb.)\n• Compound with \"or/nor\": \"Neither the teacher nor the students were prepared.\" (Verb matches the closer subject — students = plural.)\n• Compound with \"and\": \"The coach and the captain are meeting.\" (Two subjects = plural.)\n• Each/every/one of: \"Each of the experiments was repeated.\" (Each = always singular, even though \"experiments\" is plural.)","Indefinite pronoun cheat sheet: Always singular: each, every, everyone, everybody, everything, anyone, anybody, anything, no one, nobody, nothing, either, neither. Always plural: both, few, many, several. Variable: some, any, all, none, most (depends on what follows \"of\")."],
      visual: "cross-out",
    },
    {
      id: "7b",
      title: "Pronoun-Antecedent Agreement & Ambiguity",
      subtitle: "Topic 7B — Pronoun Agreement & Clarity",
      body: ["Every pronoun must clearly match ONE specific antecedent in number (singular/plural) and person (first/second/third).","Agreement Rules:\n• Singular antecedent → singular pronoun: \"The student submitted her project.\"\n• Plural antecedent → plural pronoun: \"The students submitted their projects.\"\n• Compound antecedent (and) → plural: \"Maya and James presented their research.\"\n• Each/every + noun → singular: \"Every player must bring his or her own equipment.\"","Ambiguous Reference: If a pronoun could refer to more than one noun, it’s ambiguous — and wrong on the PSAT.\n✗ \"Dr. Lee told Dr. Patel that she should revise the study.\" (Who is \"she\"?)\n✓ \"Dr. Lee told Dr. Patel that Dr. Patel should revise the study.\"","Consistency of Person: Don’t shift between \"you,\" \"one,\" \"they,\" or \"we\" within the same passage unless the meaning requires it.\n✗ \"If a person studies hard, you will succeed.\"\n✓ \"If a person studies hard, he or she will succeed.\"","Possessive nouns vs. pronouns: On the PSAT, a possessive noun like \"the scientist’s\" CANNOT be an antecedent for a pronoun. \"The scientist’s research was groundbreaking; she published it in Nature\" is wrong because \"scientist’s\" is a possessive modifier, not a subject. Fix: \"The scientist conducted groundbreaking research; she published it in Nature.\""],
      visual: "pronoun-cards",
    },
    {
      id: "7c",
      title: "Tense Consistency & Correct Verb Forms",
      subtitle: "Topic 7C — Verb Tense & Form",
      body: ["Tense questions test whether you can keep verb tenses consistent within a passage and select the correct form for the context.","The Consistency Rule: Within a single passage, don’t switch tenses unless the timeline requires it. If a passage is written in past tense, keep it in past tense.\n✗ \"The team analyzed the data and discovers an anomaly.\" (past → present shift)\n✓ \"The team analyzed the data and discovered an anomaly.\" (consistent past)","When Tense Shifts ARE Correct:\n• Something that happened BEFORE another past event: \"By the time the rescue team arrived, the flood had already destroyed the bridge.\" (past perfect for the earlier event)\n• A general truth within a past narrative: \"Galileo demonstrated that the Earth revolves around the Sun.\" (present tense for a permanent fact)\n• A present-tense result of past research: \"A 2020 study found that exercise improves memory.\" (present for ongoing truth)","Common Verb Form Errors:\n• Would have + past participle: \"If she had studied, she would have passed.\" (NOT \"would of passed\")\n• Irregular past participles: begun (not began), written (not wrote), chosen (not chose), spoken (not spoke), driven (not drove)\n• Subjunctive \"were\": \"If the hypothesis were correct, the results would differ.\" (NOT \"was\")"],
      visual: "tense-timeline",
    },
    {
      id: "7d",
      title: "Dangling Modifiers & Parallel Structure",
      subtitle: "Topic 7D — Modifiers & Parallel Structure",
      body: ["A modifier must be placed next to the word it modifies. Parallel structure means items in a list or comparison must have the same grammatical form.","Dangling Modifiers: An introductory modifying phrase MUST be followed immediately by the noun it modifies.\n✗ \"Running through the park, the sunset was beautiful.\" (The sunset isn’t running.)\n✓ \"Running through the park, she noticed the beautiful sunset.\" (She is running.)\n\nTest: Read the modifier, then ask: WHO is doing this? The answer must be the very next noun.\nPattern: \"[Modifier], [SUBJECT the modifier describes] + verb...\"","Parallel Structure: Items in a list, comparison, or paired construction must share the same grammatical form.\n✗ \"The study required collecting data, analyzing results, and to write a report.\"\n✓ \"The study required collecting data, analyzing results, and writing a report.\"","Parallel structure details:\n• Verbs match verbs: to run, to swim, and to bike (all infinitives) OR running, swimming, and biking (all gerunds)\n• Nouns match nouns: the clarity, precision, and accuracy of the work\n• Clauses match clauses: what they discovered and how they applied it","PSAT formatting clue: When you see a list of three or more items with an underlined portion, check parallel structure first. The underlined item almost always needs to match the form of the other items in the list."],
      visual: "dangling-fix",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      passage: "The group of students who volunteered at the food bank last Saturday ___ planning another visit next month.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["were", "have been", "is", "are"],
      correct: 2,
      explanation: "Subject = \"group\" (singular). \"Of students who volunteered at the food bank last Saturday\" is all noise. The group IS planning.",
    },
    {
      passage: "Neither the principal nor the teachers ___ received the updated schedule.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["is", "was", "have", "has"],
      correct: 2,
      explanation: "With \"neither...nor,\" the verb agrees with the closer subject. \"Teachers\" (plural) is closer, so \"have\" received.",
    },
    {
      passage: "Covered in frost, the gardener carefully wrapped the delicate rose bushes in burlap to protect them from the cold.",
      stem: "Which choice best corrects the sentence?",
      choices: ["Both B and C fix the error.", "No change needed.", "The gardener carefully wrapped the frost-covered rose bushes in burlap to protect them from the cold.", "Covered in frost, the delicate rose bushes were carefully wrapped in burlap by the gardener."],
      correct: 0,
      explanation: "\"Covered in frost\" modifies \"the gardener\" — but the rose bushes are frosted, not the gardener. Both B (bushes after modifier) and C (restructured to eliminate the modifier) fix this.",
    },
    {
      passage: "The archaeological team discovered ancient pottery, bronze tools, and ___ at the dig site.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["they found several gold coins", "to find several gold coins", "were finding several gold coins", "several gold coins"],
      correct: 3,
      explanation: "The list needs parallel nouns: \"pottery, bronze tools, and several gold coins.\" C matches the noun structure. A and B introduce verbs that break parallelism. D uses an infinitive.",
    },
    {
      passage: "The novelist, whose early works ___ largely unnoticed, received international acclaim for her latest book.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["goes", "had gone", "has gone", "have gone"],
      correct: 1,
      explanation: "The early works going unnoticed happened BEFORE the acclaim (a past event). Past perfect (\"had gone\") shows the earlier action. \"Works\" is plural but \"had gone\" works for both singular and plural subjects.",
    },
    {
      passage: "When a researcher submits a paper for peer review, ___ must be prepared for rigorous criticism.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["one", "they", "you", "the researcher"],
      correct: 3,
      explanation: "The sentence starts with \"a researcher\" (third person singular). \"You\" shifts to second person. \"They\" shifts to plural. \"One\" is possible but formal. \"The researcher\" (D) is the clearest and avoids any shift.",
    },
    {
      passage: "The results of the decade-long study, which included participants from twelve countries, ___ published in the New England Journal of Medicine.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["were", "has been", "is being", "was"],
      correct: 0,
      explanation: "Subject = \"results\" (plural). \"Of the decade-long study\" and \"which included participants from twelve countries\" are both intervening phrases. The results WERE published.",
    },
    {
      passage: "In her 2019 paper, Dr. Yamamoto argues that urban green spaces ___ air quality, ___ stress levels in nearby residents, and contribute to higher property values.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["improving ... reducing", "improve ... reduce", "improved ... reduced", "improves ... reduces"],
      correct: 1,
      explanation: "The sentence is in present tense (\"argues\"). The three verbs in the list must be parallel AND match: \"improve, reduce, and contribute\" (all base form after \"spaces\"). A maintains both tense consistency and parallel structure.",
    },
    {
      passage: "Hoping to attract younger audiences, the museum’s new exhibit features interactive displays, virtual reality stations, and ___ visitors to create their own digital art.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["it allows", "allows", "allowing", "a space that allows"],
      correct: 1,
      explanation: "The subject is \"the museum’s new exhibit.\" The verb pattern is \"features X, Y, and ___.\" We need a parallel verb: \"features displays, features stations, and allows visitors.\" C maintains the parallel verb structure with \"allows.\"",
    },
    {
      passage: "The city council voted to increase funding for public libraries, which ___ by budget cuts over the past five years; the decision ___ widespread support from local educators.",
      stem: "Which choice correctly completes the sentence?",
      choices: ["has been weakened ... has received", "was weakened ... had received", "had been weakened ... received", "were weakened ... receives"],
      correct: 2,
      explanation: "The weakening happened OVER the past five years (before the vote) → past perfect \"had been weakened.\" The decision receiving support is a straightforward past event → simple past \"received.\" A correctly sequences both.",
    },
  ],
  takeaways: [
    "Subject-verb agreement: Cross out prepositional phrases and appositives to find the true subject. Then match the verb.",
    "Watch for inverted sentences (\"Among the ruins were artifacts\") \u2014 the subject comes after the verb.",
    "Pronoun agreement: Every pronoun needs a clear, singular or plural antecedent. If a pronoun could refer to two nouns, it\u2019s wrong.",
    "Don\u2019t shift person: if you start with \"a person,\" don\u2019t switch to \"you.\"",
    "Tense consistency: Keep tenses consistent unless the timeline requires a shift (past perfect for earlier events, present for ongoing truths).",
    "Modifiers: An introductory phrase MUST be followed by the noun it modifies. If it\u2019s not, it\u2019s a dangling modifier.",
    "Parallel structure: Items in a list must share the same grammatical form (all gerunds, all infinitives, all nouns, etc.).",
    "\"Each,\" \"every,\" \"everyone,\" \"nobody\" are always singular \u2014 even when they feel plural.",
  ],
};
