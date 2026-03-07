"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  StatsVisual,
  CrossOutDemo,
  SpecialCasesQuiz,
  TimelineVisual,
  FrameworkVisual,
} from "./lesson-visuals";

export default function SATRWModule2() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "stats": <StatsVisual />,
        "cross-out-demo": <CrossOutDemo />,
        "special-cases-quiz": <SpecialCasesQuiz />,
        "timeline": <TimelineVisual />,
        "framework": <FrameworkVisual />,
      }}
      nextModuleHref="/courses/sat-rw/3"
      nextModuleLabel="Module 3: Modifiers, Parallelism & Structure"
      activities={{
        "exercise-hunt-items": (goNext: () => void) => (
          <MatchingExercise
            items={HUNT_ITEMS_EXERCISE}
            title="Hunt"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
 * MODULE 2 — Agreement & Verb Tense
 * Subject-verb agreement, pronoun agreement, tense rules
 * ═══════════════════════════════════════════════════════ */

const HUNT_ITEMS_EXERCISE: MatchingItem[] = [
  {
    prompt: "The team of scientists from three universities [VERB] published a groundbreaking study.",
    options: ["has", "have", "are", "had"],
    correct: 0,
    explanation: "\"Team\" (singular) is the subject. \"Of scientists from three universities\" is a prepositional phrase \u2014 cross it out. Singular subject = \"has.\""
  },
  {
    prompt: "Neither the lead author nor her co-researchers [VERB] able to attend the conference.",
    options: ["was", "were", "is", "has been"],
    correct: 1,
    explanation: "With neither/nor, the verb agrees with the CLOSER subject. \"Co-researchers\" (plural) is closer, so \"were\" is correct."
  },
  {
    prompt: "The discovery of ancient tools, along with pottery fragments, [VERB] the timeline of human settlement.",
    options: ["challenge", "challenges", "are challenging", "have challenged"],
    correct: 1,
    explanation: "\"Discovery\" (singular) is the subject. \"Along with\" does NOT make a compound subject (unlike \"and\")."
  },
  {
    prompt: "Each of the experiments conducted over the past decade [VERB] yielded consistent results.",
    options: ["have", "has", "are", "were"],
    correct: 1,
    explanation: "\"Each\" is ALWAYS singular. \"Each...has yielded.\""
  },
  {
    prompt: "The professor who mentored the doctoral students [VERB] now retired.",
    options: ["are", "is", "were", "have"],
    correct: 1,
    explanation: "Main clause subject is \"professor\" (singular). \"Who mentored the doctoral students\" is a relative clause. \"Professor...is now retired.\""
  },
  {
    prompt: "Among the factors contributing to the decline [VERB] a lack of funding and poor infrastructure.",
    options: ["is", "are", "was", "were"],
    correct: 3,
    explanation: "Inverted order! The subject comes after the verb: \"a lack of funding AND poor infrastructure\" \u2014 compound subject (plural). Past tense context = \"were.\""
  },
  {
    prompt: "The committee, despite objections from several members, [VERB] voted to approve the proposal.",
    options: ["have", "has", "are", "were"],
    correct: 1,
    explanation: "\"Committee\" is a collective noun \u2014 singular in American English. \"Committee...has voted.\""
  },
  {
    prompt: "The data collected from the survey of 2,000 participants [VERB] a significant shift in public opinion.",
    options: ["reveals", "reveal", "revealing", "are revealing"],
    correct: 1,
    explanation: "\"Data\" is technically plural (singular: datum), and the SAT treats it as plural. \"Data...reveal.\""
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 2,
  title: "Agreement & Verb Tense",
  subtitle:
    "Tricky subjects, intervening phrases, pronoun agreement, and the six tenses the SAT tests — the second most common grammar concept on the SAT.",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "star" },
    { id: "exercise-hunt-items", label: "Hunt", icon: "zap" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARMUP (Module 1 Retrieval) ──────── */
  warmup: [
    {
      source: "Module 1 — Boundaries",
      stem: "The marine biologist noted that the coral reefs, which had been damaged by decades of rising ocean temperatures _______ were beginning to show signs of recovery thanks to new conservation efforts.",
      choices: [
        "and, pollution",
        "and pollution;",
        "and pollution",
        "and pollution,"
      ],
      correct: 3,
      explanation:
        "The nonrestrictive clause \"which had been damaged by\u2026\" must close with a comma. \"And pollution\" is part of the clause, so the comma goes after \"pollution,\" to close the clause before \"were.\"",
    },
    {
      source: "Module 1 — Boundaries",
      stem: "The architect's most ambitious project \u2014 a floating concert hall designed to rise and fall with the _______ required engineering solutions that had never been attempted before.",
      choices: ["tides,", "tides;", "tides", "tides \u2014"],
      correct: 3,
      explanation:
        "The em-dash opens a nonrestrictive element. It must close with a matching em-dash before \"required.\"",
    },
    {
      source: "Module 1 — Boundaries",
      stem: "Several historians have challenged the traditional narrative of the Industrial _______ they argue that the economic transformation was far more gradual than textbooks suggest.",
      choices: [
        "Revolution: they,",
        "Revolution; they",
        "Revolution they",
        "Revolution, they"
      ],
      correct: 1,
      explanation:
        "Two independent clauses. A semicolon correctly joins them. (A) = comma splice. (C) = run-on.",
    },
    {
      source: "Module 1 — Boundaries",
      stem: "The photographer spent three years documenting the lives of migrant workers in California's Central _______ her images captured both the hardship and the resilience of the communities she visited.",
      choices: [
        "Valley her",
        "Valley; her",
        "Valley. Her,",
        "Valley, her"
      ],
      correct: 1,
      explanation:
        "Two ICs joined by semicolon. (A) = comma splice. (C) = fused sentence.",
    },
    {
      source: "Module 1 — Boundaries",
      stem: "Though the novel received mixed reviews from literary _______ it went on to become one of the best-selling books of the decade.",
      choices: [
        "critics. It",
        "critics it",
        "critics, it",
        "critics; it"
      ],
      correct: 2,
      explanation:
        "Dependent clause (\"Though\u2026critics\") + independent clause \u2192 comma separates them. A period/semicolon would strand the DC as a fragment.",
    },
    {
      source: "Module 1 — Boundaries",
      stem: "The museum's newest exhibit features artifacts from ancient _______ including pottery, tools, and jewelry dating back more than 3,000 years.",
      choices: [
        "Mesopotamia: including",
        "Mesopotamia, including",
        "Mesopotamia including",
        "Mesopotamia; including"
      ],
      correct: 1,
      explanation:
        "\"Including\u2026\" is a nonrestrictive participial phrase modifying \"artifacts.\" A comma sets it off. A semicolon would require an IC after it; a colon would also work grammatically but the comma is standard here.",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "intro",
      title: "The Agreement Principle",
      subtitle: "Subjects and verbs must match \u2014 always",
      body: [
        "Agreement questions make up about 14% of the SAT R&W section \u2014 roughly 7-8 questions per test under \"Form, Structure & Sense.\" They're the second most common grammar question type after boundary questions.",
        "The core rule is simple: a singular subject takes a singular verb, and a plural subject takes a plural verb. \"The dog runs\" (singular). \"The dogs run\" (plural).",
        "If that sounds easy, it's because the SAT never tests it that simply. The test buries the real subject under layers of intervening phrases, prepositional clauses, and inverted sentence structures designed to trick your ear.",
      ],
      visual: "stats",
    },
    {
      id: "intervening",
      title: "Trap #1: The Intervening Phrase",
      subtitle: "The SAT's favorite agreement trick",
      body: [
        "The most common SAT agreement trap places words between the subject and verb that make you forget what the real subject is.",
        "\"The collection of rare manuscripts WAS donated...\"",
        "Your ear hears \"manuscripts\" (plural) right before the verb and wants to say \"were.\" But the subject is \"collection\" (singular). The phrase \"of rare manuscripts\" is a prepositional phrase modifying \"collection\" \u2014 it's not the subject.",
        "RULE: The subject of a sentence is NEVER inside a prepositional phrase (of, in, at, by, with, among, between, etc.).",
        "This is tested on virtually every SAT. Cross out the prepositional phrase mentally and the correct verb becomes obvious: \"The collection...WAS donated.\"",
      ],
      visual: "cross-out-demo",
    },
    {
      id: "relative",
      title: "Trap #2: Relative Clauses",
      subtitle: "Who/which/that \u2014 what do they refer to?",
      body: [
        "When a verb appears inside a relative clause (starting with who, which, or that), the verb must agree with whatever the relative pronoun refers to \u2014 not the nearest noun.",
        "\"The artist, whose murals depicting community resilience HAVE earned her acclaim...\"",
        "The verb \"have earned\" is inside a clause starting with \"whose.\" What earned acclaim? The murals (plural), not the artist. So \"have earned\" is correct.",
        "\"She is one of the researchers who HAVE published on this topic.\"",
        "Who published? The researchers (plural). So \"have\" is correct. This construction with \"one of the [plural noun] who\" is a classic SAT question.",
      ],
    },
    {
      id: "inverted",
      title: "Trap #3: Inverted Sentence Order",
      subtitle: "When the subject comes after the verb",
      body: [
        "Sometimes the SAT flips the normal subject-verb order. The verb comes first, and you have to look ahead to find the subject.",
        "\"Among the artifacts discovered at the site WERE a bronze shield and two ceramic vessels.\"",
        "The subject is \"a bronze shield and two ceramic vessels\" (compound/plural), which comes after the verb. So \"were\" is correct.",
        "\"There IS a growing concern among educators about screen time.\"",
        "\"There\" is never the subject. The real subject is \"concern\" (singular), so \"is\" is correct.",
        "STRATEGY: When a sentence starts with \"there,\" \"here,\" or a prepositional phrase, look PAST the verb to find the real subject.",
      ],
    },
    {
      id: "compound",
      title: "Compound Subjects & Special Cases",
      subtitle: "Neither/nor, either/or, and other tricky pairs",
      body: [
        "COMPOUND SUBJECTS with \"and\" are almost always plural: \"The director and the producer WERE nominated.\"",
        "NEITHER/NOR and EITHER/OR: The verb agrees with the subject CLOSER to it.\n\"Neither the professor nor her students WERE available.\" (students = closer, plural)\n\"Neither the students nor the professor WAS available.\" (professor = closer, singular)",
        "EACH/EVERY: Always singular, even with compound subjects.\n\"Every student and teacher HAS been notified.\"\n\"Each of the experiments WAS repeated three times.\"",
        "COLLECTIVE NOUNS (team, group, committee, audience, family): Usually singular in American English.\n\"The committee HAS reached a decision.\"\n\"The team IS preparing for the tournament.\"",
      ],
      visual: "special-cases-quiz",
    },
    {
      id: "pronoun-agreement",
      title: "Pronoun-Antecedent Agreement",
      subtitle: "Pronouns must match what they replace",
      body: [
        "A pronoun must agree in number with its antecedent (the noun it replaces).",
        "WRONG: \"Each student must submit their application by Friday.\" \u2190 \"Each\" is singular, but \"their\" is plural.",
        "RIGHT: \"Each student must submit his or her application by Friday.\" or restructure: \"Students must submit their applications by Friday.\"",
        "The SAT also tests pronoun CLARITY. If a pronoun could refer to more than one noun, it's ambiguous.",
        "AMBIGUOUS: \"When Dr. Lee met with Dr. Patel, she presented new findings.\" \u2190 Who is \"she\"?",
        "On the SAT, the correct answer will always make the reference unambiguous \u2014 often by replacing the pronoun with the specific noun.",
      ],
    },
    {
      id: "tense-basics",
      title: "Verb Tense: The Timeline",
      subtitle: "Past, present, and future \u2014 with complications",
      body: [
        "The SAT tests six tenses. The key is consistency within a passage and using the right tense for the time relationship:",
        "SIMPLE PRESENT: \"The researchers study...\" (habitual, general truths)\nSIMPLE PAST: \"The researchers studied...\" (completed action)\nPRESENT PERFECT: \"The researchers have studied...\" (started in past, continues or has relevance now)\nPAST PERFECT: \"The researchers had studied...\" (completed before another past event)\nFUTURE: \"The researchers will study...\"\nCONDITIONAL: \"The researchers would study...\" (hypothetical)",
        "The most commonly tested: PAST PERFECT (had + past participle). Use it when one past event happened BEFORE another past event. \"By the time the results were published, the team had already moved on to a new project.\"",
      ],
      visual: "timeline",
    },
    {
      id: "tense-consistency",
      title: "Tense Consistency & Shifts",
      subtitle: "Don't change tense without a reason",
      body: [
        "Within a passage, verb tense should remain consistent unless there's a clear reason to shift (a change in time frame).",
        "WRONG: \"The archaeologists excavated the site for three months. They discover several artifacts.\" \u2190 Shifts from past to present for no reason.",
        "RIGHT: \"The archaeologists excavated the site for three months. They discovered several artifacts.\"",
        "JUSTIFIED SHIFT: \"The archaeologists excavated the site in 2019. Today, the artifacts they discovered ARE on display at the national museum.\" \u2190 The shift to present is justified by \"today.\"",
        "STRATEGY: Look for time markers in the passage (\"in 1952,\" \"currently,\" \"before the study began,\" \"by the time\"). These tell you which tense is required.",
      ],
    },
    {
      id: "subjunctive",
      title: "Subjunctive Mood (Rare but Tested)",
      subtitle: "Wishes, demands, and hypotheticals",
      body: [
        "The subjunctive mood appears occasionally on the SAT \u2014 usually 0-1 times per test. It uses the base form of the verb after verbs of demand, suggestion, or necessity.",
        "\"The committee recommended that the proposal BE revised.\" (not \"is revised\" or \"was revised\")",
        "\"It is essential that every student SUBMIT the form on time.\" (not \"submits\")",
        "Trigger words: recommend, suggest, demand, insist, require, essential, important, necessary, crucial.",
        "For hypothetical conditions contrary to fact, use \"were\" regardless of subject:\n\"If the study WERE replicated...\" (not \"was\")\n\"She spoke as though she WERE an expert.\" (not \"was\")",
      ],
    },
    {
      id: "decision",
      title: "The Agreement Decision Framework",
      subtitle: "Your step-by-step approach",
      body: [
        "STEP 1: Find the verb being tested (it's in the blank or underlined).",
        "STEP 2: Find the TRUE subject.\n  \u2022 Cross out prepositional phrases (of, in, at, by, with...)\n  \u2022 Cross out nonrestrictive clauses (between commas)\n  \u2022 Cross out appositives\n  \u2022 Look past \"there is/are\" to the real subject\n  \u2022 For relative clauses, identify what who/which/that refers to",
        "STEP 3: Determine if the subject is singular or plural.\n  \u2022 Neither/nor, either/or \u2192 match the closer subject\n  \u2022 Each, every, anyone \u2192 always singular\n  \u2022 Collective nouns \u2192 usually singular",
        "STEP 4: Check tense.\n  \u2022 Look for time markers in the passage\n  \u2022 Check for tense consistency with surrounding verbs\n  \u2022 \"Had + past participle\" = before another past event\n  \u2022 Subjunctive after demand/suggest/require verbs",
        "STEP 5: Pick the answer that matches in both NUMBER and TENSE.",
      ],
      visual: "framework",
    },
  ],

  /* ──────── PRACTICE QUIZ (10 questions) ──────── */
  quiz: [
    {
      passage:
        "The collection of vintage photographs, which ______ donated to the museum in 1985, remains one of the most popular exhibits.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["are", "were", "have been", "was"],
      correct: 3,
      explanation:
        "Subject is \"collection\" (singular). \"Of vintage photographs\" is a prepositional phrase. Singular = \"was.\"",
      difficulty: "easy",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "Every one of the candidates ______ required to submit a written statement before the interview.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["were", "have been", "is", "are"],
      correct: 2,
      explanation:
        "\"Every one\" is singular. \"Of the candidates\" is prepositional. Singular = \"is.\"",
      difficulty: "easy",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "Neither the original hypothesis nor the revised models ______ able to account for the anomalies observed in the data.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["were", "is", "has been", "was"],
      correct: 0,
      explanation:
        "Neither/nor: verb matches the closer subject. \"Models\" (plural) is closer = \"were.\"",
      difficulty: "medium",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "The anthology of poems, essays, and short stories that ______ recently published has already received critical acclaim.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["are", "were", "have been", "was"],
      correct: 3,
      explanation:
        "\"That\" refers to \"anthology\" (singular). Don't be tricked by the plural list inside the prepositional phrase.",
      difficulty: "medium",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "By the time the rescue team arrived at the remote village, the floodwaters ______ already receded, leaving behind a landscape of mud and debris.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["have", "has", "had", "would have"],
      correct: 2,
      explanation:
        "Past perfect: the receding happened BEFORE the team arrived. \"Had already receded.\"",
      difficulty: "medium",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "The professor insisted that every student ______ the reading before the next seminar, as the discussion would build directly on the assigned texts.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["has completed", "completed", "complete", "completes"],
      correct: 2,
      explanation:
        "Subjunctive mood after \"insisted that\": use the base form \"complete.\"",
      difficulty: "medium",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "The research team, whose groundbreaking experiments on neuroplasticity ______ them international recognition, announced a new partnership with three major universities.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["earns", "earning", "has earned", "have earned"],
      correct: 3,
      explanation:
        "\"Whose\" refers to \"team,\" but the subject of the relative clause is \"experiments\" (plural). \"Have earned.\"",
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "A series of earthquakes that ______ the region over the past decade has prompted officials to reevaluate building codes and emergency response protocols.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["struck", "striking", "has struck", "have struck"],
      correct: 3,
      explanation:
        "\"That\" refers to \"earthquakes\" (plural). \"Have struck.\" Present perfect: \"over the past decade\" indicates ongoing relevance.",
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "Among the many challenges facing the conservation effort ______ the difficulty of coordinating between government agencies, private landowners, and indigenous communities.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["were", "have been", "is", "are"],
      correct: 2,
      explanation:
        "Inverted order. The subject comes after: \"the difficulty\" (singular). Among the challenges IS the difficulty.",
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "If the proposed regulation ______ implemented as written, it would fundamentally alter the relationship between federal agencies and state governments.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["were", "is", "will be", "was"],
      correct: 0,
      explanation:
        "Subjunctive in a hypothetical contrary-to-fact condition. \"If [subject] were\" regardless of singular/plural.",
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
  ],

  /* ──────── CHALLENGE (6 hard questions) ──────── */
  challenge: [
    {
      passage:
        "The team of astronomers, each of whom ______ spent years studying the phenomenon independently, convened for the first time to share findings at the international symposium.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["have", "has", "had", "having"],
      correct: 2,
      explanation:
        "\"Each of whom\" = singular (each is always singular). But tense matters: they spent years studying BEFORE the symposium (past perfect for the earlier of two past events). \"Had spent\" \u2014 tests both agreement AND tense simultaneously.",
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "It is the archaeological sites in the northern highlands, not the widely publicized excavation near the capital, that ______ yielded the most significant artifacts from the Bronze Age.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["had", "having", "have", "has"],
      correct: 2,
      explanation:
        "\"It is X, not Y, that [verb]\" \u2014 the verb agrees with X. X = \"the archaeological sites\" (plural) = \"have yielded.\" The singular \"excavation\" is a red herring between the subject and verb.",
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "The council required that the environmental impact report not only ______ the potential risks to local wildlife but also propose specific mitigation strategies for each identified threat.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["addresses", "addressed", "has addressed", "address"],
      correct: 3,
      explanation:
        "Subjunctive after \"required that\" \u2014 use the base form regardless of subject. \"Not only\u2026but also\" is a correlative conjunction (parallelism), but the key here is the subjunctive mood triggered by \"required.\" Base form = \"address.\"",
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "Neither the lead researcher nor the graduate students who ______ assisting her were available to comment on the preliminary results when journalists contacted the laboratory.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["were", "is", "has been", "was"],
      correct: 0,
      explanation:
        "Two agreement decisions: (1) The main verb \"were available\" agrees with \"students\" (closer in neither/nor = plural). (2) Inside the relative clause, \"who\" refers to \"students\" (plural), so \"were assisting\" is correct. Both verbs must be plural.",
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "A comprehensive analysis of the exposed geological strata, together with radiocarbon dating of organic materials found at the site, ______ that human habitation of the valley began at least 2,000 years earlier than previously estimated.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["have suggested", "suggest", "suggests", "are suggesting"],
      correct: 2,
      explanation:
        "\"Together with\" (like \"along with,\" \"in addition to,\" \"as well as\") does NOT create a compound subject. The true subject is \"analysis\" (singular). Cross out the phrases: \"A comprehensive analysis\u2026suggests.\" This is one of the SAT's most deceptive trap constructions.",
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
    {
      passage:
        "The novelist, whose depictions of rural poverty and systemic inequality in her early trilogy ______ her comparisons to Steinbeck, has since shifted her focus to science fiction exploring post-climate-change societies.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["earning", "have earned", "earned", "has earned"],
      correct: 1,
      explanation:
        "Inside the \"whose\" clause, the subject is \"depictions\" (plural), not \"novelist.\" The depictions earned comparisons. Present perfect \"have earned\" indicates the comparisons remain relevant (she's still compared to Steinbeck). Triple trap: wrong subject (novelist), wrong number (singular verb), wrong tense (simple past).",
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "subject_verb_agreement",
    },
  ],

  takeaways: [
    "Use the cross-out method: mentally delete prepositional phrases and relative clauses to reveal the true subject.",
    "The verb must agree with its subject, not with the nearest noun — intervening phrases are the SAT's favorite trap.",
    "Past perfect (had + past participle) shows an action completed before another past event.",
    "Maintain consistent tense unless there is a justified reason to shift (e.g., a time-marker change).",
    "Collective nouns (team, committee, collection) are singular and take singular verbs.",
    "Track recurring error patterns in an Error Pattern Journal to identify your blind spots.",
  ],
};
