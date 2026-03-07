"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";
import {
  SVAgreementVisual,
  ModifierVisual,
  ParallelismVisual,
  TenseSignalsVisual,
} from "./lesson-visuals";

const SV_DATA_EXERCISE: MatchingItem[] = [
  {
    "prompt": "The *analysis* of the experimental results from three independent laboratories ___",
    "options": [
      "suggests",
      "suggest"
    ],
    "correct": 0,
    "explanation": "Subject = \"analysis\" (singular). \"Results\" and \"laboratories\" are inside prepositional phrases."
  },
  {
    "prompt": "The *paintings* hanging in the west gallery of the modern art museum ___",
    "options": [
      "were restored",
      "was restored"
    ],
    "correct": 0,
    "explanation": "Subject = \"paintings\" (plural). \"Gallery\" and \"museum\" are distractors inside prepositional phrases."
  },
  {
    "prompt": "Each *student* in the advanced placement classes offered by the district ___",
    "options": [
      "is required",
      "are required"
    ],
    "correct": 0,
    "explanation": "\"Each\" is always singular. \"Students,\" \"classes,\" and \"district\" are all distractors."
  },
  {
    "prompt": "The *collection* of ancient coins, manuscripts, and ceramic artifacts discovered during the excavation ___",
    "options": [
      "have attracted",
      "has attracted"
    ],
    "correct": 1,
    "explanation": "Subject = \"collection\" (singular). The list \"coins, manuscripts, and ceramic artifacts\" is inside the prepositional phrase."
  },
  {
    "prompt": "Neither the *director* nor the *producers* of the critically acclaimed documentary ___",
    "options": [
      "was available",
      "were available"
    ],
    "correct": 1,
    "explanation": "With \"neither\u2026nor,\" the verb agrees with the nearer subject: \"producers\" (plural) \u2192 \"were.\""
  },
  {
    "prompt": "The *series* of lectures on quantum mechanics that Professor Walsh delivered last semester ___",
    "options": [
      "was recorded",
      "were recorded"
    ],
    "correct": 0,
    "explanation": "\"Series\" is singular (even though it ends in -s). \"Lectures\" is inside a prepositional phrase."
  },
  {
    "prompt": "The *data* collected from the three-year longitudinal study of urban bird populations ___",
    "options": [
      "indicates",
      "indicate"
    ],
    "correct": 1,
    "explanation": "In formal/academic English, \"data\" is plural (singular: \"datum\"). The PSAT follows this convention."
  },
  {
    "prompt": "Every one of the proposals submitted by the engineering firms competing for the contract ___",
    "options": [
      "meets the requirements",
      "meet the requirements"
    ],
    "correct": 0,
    "explanation": "\"Every one\" is singular. \"Proposals,\" \"firms,\" and \"contract\" are all prepositional phrase distractors."
  },
  {
    "prompt": "The *committee* responsible for reviewing applications from prospective members across all regional chapters ___",
    "options": [
      "have announced",
      "has announced"
    ],
    "correct": 1,
    "explanation": "Collective nouns like \"committee\" are singular when acting as a unit (which is almost always on the PSAT)."
  },
  {
    "prompt": "A number of recent studies conducted at universities in Europe and Asia ___",
    "options": [
      "has shown",
      "have shown"
    ],
    "correct": 1,
    "explanation": "\"A number of\" = plural (it means \"several/many\"). Contrast with \"the number of\" = singular."
  }
];

const BUILDER_EXERCISE: MatchingItem[] = [
  {
    "prompt": "The collection of ancient Roman coins ___ to a private museum in Geneva.",
    "options": [
      "was donated",
      "have been donated",
      "were donated",
      "has been donated"
    ],
    "correct": 0,
    "explanation": "\"Collection\" (singular) is the subject. \"Coins\" is inside the prep phrase. \"Was donated\" and \"has been donated\" both work; simple past is cleanest."
  },
  {
    "prompt": "After analyzing the soil samples from three continents, ___ that the mineral composition varied significantly by region.",
    "options": [
      "determining by the geologists",
      "determination was made by the geologists",
      "the geologists determined",
      "it was determined by the geologists"
    ],
    "correct": 2,
    "explanation": "The geologists analyzed the samples, so \"the geologists\" must immediately follow the modifier. All other options create dangling modifiers."
  },
  {
    "prompt": "The funding for the new laboratories ___ until the board reviews the budget proposal next quarter.",
    "options": [
      "is not approving",
      "were not approved",
      "are not approved",
      "will not be approved"
    ],
    "correct": 3,
    "explanation": "\"Until\u2026next quarter\" signals future time. \"Will not be approved\" is the correct future tense form."
  },
  {
    "prompt": "Neither the principal nor the teachers ___ with the proposed schedule changes for the fall semester.",
    "options": [
      "is agreeing",
      "agrees",
      "agree",
      "has agreed"
    ],
    "correct": 2,
    "explanation": "With \"neither\u2026nor,\" the verb matches the nearer subject: \"teachers\" (plural) \u2192 \"agree.\""
  },
  {
    "prompt": "The researchers aimed to collect data efficiently, analyze it thoroughly, ___",
    "options": [
      "and to present findings clearly.",
      "and present findings clearly.",
      "and clear presentation of findings.",
      "and presenting findings clearly."
    ],
    "correct": 1,
    "explanation": "The series uses bare infinitives after \"to\": \"collect\u2026, analyze\u2026, and present\u2026\" Option C maintains the parallel pattern."
  },
  {
    "prompt": "By the time the documentary aired, ___ every interview featured in the film.",
    "options": [
      "the production team will have already edited",
      "the production team has already edited",
      "the production team already edits",
      "the production team had already edited"
    ],
    "correct": 3,
    "explanation": "\"By the time X aired\" (past) signals past perfect for the earlier action \u2192 \"had already edited.\""
  },
  {
    "prompt": `The symphony orchestra \u2014 along with two guest soloists and a choir of forty voices \u2014 ___ a stunning performance of Beethoven's Ninth.`,
    "options": [
      "have delivered",
      "were delivering",
      "delivered",
      "deliver"
    ],
    "correct": 2,
    "explanation": "\"The symphony orchestra\" is the subject (singular). \"Along with\u2026\" is a parenthetical aside \u2014 it doesn't change the subject number."
  },
  {
    "prompt": "The new policy requires employees to submit timesheets on Friday, report expenses monthly, ___",
    "options": [
      "and that they attend quarterly reviews.",
      "and attending quarterly reviews.",
      "and attend quarterly reviews.",
      "and attendance at quarterly reviews."
    ],
    "correct": 2,
    "explanation": "The series uses bare infinitives: \"submit\u2026, report\u2026, and attend\u2026\" Nouns, gerunds, and clauses break the pattern."
  }
];

const MOD_DATA_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Which is correct?\n\nA) Covered in frost, the scientist examined the specimens carefully.\nB) The scientist examined the specimens, which were covered in frost.",
    "options": [
      "Covered in frost, the scientist examined the specimens carefully.",
      "The scientist examined the specimens, which were covered in frost."
    ],
    "correct": 1,
    "explanation": "\"Covered in frost\" describes specimens, not the scientist."
  },
  {
    "prompt": "Which is correct?\n\nA) After reviewing the evidence, the verdict was announced by the judge.\nB) After reviewing the evidence, the judge announced the verdict.",
    "options": [
      "After reviewing the evidence, the judge announced the verdict.",
      "After reviewing the evidence, the verdict was announced by the judge."
    ],
    "correct": 0,
    "explanation": "The judge reviewed the evidence, so \"the judge\" must follow the modifying phrase."
  },
  {
    "prompt": "Which is correct?\n\nA) Flying over the canyon, the landscape amazed the passengers.\nB) Flying over the canyon, the passengers were amazed by the landscape.",
    "options": [
      "Flying over the canyon, the landscape amazed the passengers.",
      "Flying over the canyon, the passengers were amazed by the landscape."
    ],
    "correct": 1,
    "explanation": "The passengers are flying, not the landscape."
  },
  {
    "prompt": "Which is correct?\n\nA) Exhausted from the long hike, the campsite was a welcome sight for the climbers.\nB) Exhausted from the long hike, the climbers found the campsite a welcome sight.",
    "options": [
      "Exhausted from the long hike, the campsite was a welcome sight for the climbers.",
      "Exhausted from the long hike, the climbers found the campsite a welcome sight."
    ],
    "correct": 1,
    "explanation": "The climbers are exhausted, not the campsite."
  },
  {
    "prompt": "Which is correct?\n\nA) Using advanced imaging technology, the tumor was detected by the radiologist.\nB) Using advanced imaging technology, the radiologist detected the tumor.",
    "options": [
      "Using advanced imaging technology, the tumor was detected by the radiologist.",
      "Using advanced imaging technology, the radiologist detected the tumor."
    ],
    "correct": 1,
    "explanation": "The radiologist is using the technology, not the tumor."
  },
  {
    "prompt": "Which is correct?\n\nA) Praised by critics worldwide, audiences flocked to see the director's new film.\nB) Praised by critics worldwide, the director's new film attracted large audiences.",
    "options": [
      "Praised by critics worldwide, audiences flocked to see the director's new film.",
      "Praised by critics worldwide, the director's new film attracted large audiences."
    ],
    "correct": 1,
    "explanation": "The film was praised, not the audiences."
  }
];

const PAR_DATA_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "The study examined how pollution affects air quality, water purity, and soil composition.",
    "correct": "Parallel",
    "explanation": "Three noun phrases: air quality, water purity, soil composition."
  },
  {
    "prompt": "The new policy encourages recycling, reducing waste, and to conserve energy.",
    "correct": "Not Parallel",
    "explanation": "\"recycling\" (gerund), \"reducing\" (gerund), \"to conserve\" (infinitive) — the third item breaks the pattern."
  },
  {
    "prompt": "The architect designed buildings that were innovative, sustainable, and that attracted international attention.",
    "correct": "Not Parallel",
    "explanation": "\"innovative\" (adjective), \"sustainable\" (adjective), \"that attracted…\" (clause) — the third item breaks the adjective pattern."
  },
  {
    "prompt": "She succeeded not only by working hard but also by seeking mentorship from experienced colleagues.",
    "correct": "Parallel",
    "explanation": "\"by working hard\" and \"by seeking mentorship\" — both \"by + gerund\" phrases."
  },
  {
    "prompt": "The candidate promised to lower taxes, increase funding for education, and that she would reform healthcare.",
    "correct": "Not Parallel",
    "explanation": "\"to lower\" (infinitive), \"increase\" (implied infinitive), \"that she would reform\" (clause) — the third breaks the pattern."
  },
  {
    "prompt": "The program teaches students to think critically, to write persuasively, and to collaborate effectively.",
    "correct": "Parallel",
    "explanation": "Three parallel infinitive phrases: \"to + verb + adverb.\""
  },
  {
    "prompt": "The report was thorough, well-organized, and presented the findings clearly.",
    "correct": "Not Parallel",
    "explanation": "\"thorough\" (adjective), \"well-organized\" (adjective), \"presented…\" (verb phrase) — break in the adjective series."
  },
  {
    "prompt": "Residents complained about the noise, the traffic congestion, and the lack of parking.",
    "correct": "Parallel",
    "explanation": "Three parallel noun phrases, each starting with \"the.\""
  }
];

export default function NMSQTRWModule3() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "sv-agreement": <SVAgreementVisual />,
        "modifiers": <ModifierVisual />,
        "parallelism": <ParallelismVisual />,
        "tense-signals": <TenseSignalsVisual />,
      }}
      activities={{
        "exercise-sv-data": (goNext: () => void) => (
          <MatchingExercise
            items={SV_DATA_EXERCISE}
            title="Subject-Verb Agreement"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-builder": (goNext: () => void) => (
          <MatchingExercise
            items={BUILDER_EXERCISE}
            title="Builder"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-mod-data": (goNext: () => void) => (
          <MatchingExercise
            items={MOD_DATA_EXERCISE}
            title="Mod"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-par-data": (goNext: () => void) => (
          <ClassificationExercise
            items={PAR_DATA_EXERCISE}
            categories={["Parallel","Not Parallel"]}
            title="Parallelism Classifier"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/nmsqt-rw/4"
      nextModuleLabel="Module 4: Words Are Weapons"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "rw",
  moduleNum: 3,
  title: "The Grammar Playbook, Part II",
  subtitle:
    "Form, Structure & Sense \u2014 Subject-Verb Agreement, Tense, Modifiers, and Parallelism",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-sv-data", label: "Subject-Verb Agreement", icon: "zap" },
    { id: "exercise-builder", label: "Builder", icon: "zap" },
    { id: "exercise-mod-data", label: "Mod Data", icon: "zap" },
    { id: "exercise-par-data", label: "Parallelism Classifier", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "star" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      stem: "The renovation of the city's oldest theater took three years longer than _______ the final result was widely praised as a masterful blend of preservation and modernization.",
      choices: ["expected; the", "expected and, the", "expected, the", "expected the"],
      correct: 0,
      explanation: "Two ICs. A semicolon correctly joins them. (A) comma splice. (C) run-on. (D) misplaced comma.",
    },
    {
      stem: "Although the new solar panel design was significantly more efficient than previous _______ the high manufacturing costs prevented it from being adopted widely.",
      choices: ["models the", "models; the", "models, the", "models. The"],
      correct: 2,
      explanation: "\"Although…models\" is a dependent clause. A comma separates it from the following IC. Period (A) creates a fragment. Semicolons (B) need ICs on both sides.",
    },
    {
      stem: "Dr. Singh developed a groundbreaking technique for detecting early-stage cancer using a simple blood _______ her method can identify tumors months before they would appear on traditional imaging scans.",
      choices: ["test, however, her", "test, her", "test her", "test: her"],
      correct: 3,
      explanation: "The second IC explains what makes the technique \"groundbreaking.\" A colon signals this. (A) comma splice. (C) comma splice with conjunctive adverb. (D) run-on.",
    },
    {
      stem: "Because the river had been contaminated by decades of industrial _______ the local government allocated $50 million to a comprehensive cleanup effort.",
      choices: ["waste the", "waste, the", "waste; the", "waste. The"],
      correct: 1,
      explanation: "\"Because…waste\" is a dependent clause. Comma correctly separates it from the IC. (A) semicolons need ICs both sides. (B) period creates a fragment.",
    },
    {
      stem: "The quantum computer solved in four minutes a problem that would have taken a classical computer 10,000 _______ skeptics noted that the comparison involved a problem specifically designed to favor quantum approaches.",
      choices: ["years, skeptics", "years, but, skeptics", "years skeptics", "years; skeptics"],
      correct: 3,
      explanation: "Two ICs. (A) comma splice. (B) semicolon works. (C) run-on. (D) unnecessary comma after \"but.\"",
    },
    {
      stem: "In the 1960s, marine biologist Rachel Carson warned that widespread pesticide use was devastating bird populations. Her book Silent Spring sparked a national _______ leading directly to the creation of the Environmental Protection Agency.",
      choices: ["debate leading", "debate. Leading", "debate; leading", "debate, leading"],
      correct: 3,
      explanation: "\"Leading…\" is a participial phrase, not an IC. A comma attaches it. (B) creates a fragment. (C) semicolons need ICs on both sides.",
    },
  ],

  lessons: [
    {
      id: "sv-agreement",
      title: "Subject-Verb Agreement",
      subtitle: "Find the true subject, ignore the noise",
      visual: "sv-agreement",
      body: [
        "The #1 trick the PSAT uses: burying the subject inside prepositional phrases. Cross out every prepositional phrase (of, in, from, by, with, for...) to find the true subject.",
        "Collective nouns (committee, team, jury) are singular. 'Each' and 'every' are always singular. With 'neither...nor,' the verb matches the nearer subject.",
      ],
    },
    {
      id: "modifiers",
      title: "Dangling Modifiers",
      subtitle: "Who is doing the action?",
      visual: "modifiers",
      body: [
        "A modifying phrase at the beginning of a sentence must be immediately followed by the person or thing it describes. If the wrong noun follows, you have a dangling modifier.",
      ],
    },
    {
      id: "parallelism",
      title: "Parallelism",
      subtitle: "Items in a series must match in form",
      visual: "parallelism",
      body: [
        "When a sentence lists items in a series, all items must be in the same grammatical form: all gerunds, all infinitives, all noun phrases, or all adjectives.",
      ],
    },
    {
      id: "tense-signals",
      title: "Verb Tense & Time Signals",
      subtitle: "Match the verb to the timeline",
      visual: "tense-signals",
      body: [
        "The PSAT tests whether you can match verb tense to time signals in the passage. Look for keywords that indicate when an action happened relative to other events.",
      ],
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      passage: "The diversity of marine species found in coral reef ecosystems _______ scientists, who continue to discover new organisms each year.",
      stem: "Which choice completes the text?",
      choices: ["astonish", "are astonishing", "have astonished", "astonishes"],
      correct: 3,
      explanation: "\"Diversity\" (singular) is the subject. \"Species\" and \"ecosystems\" are inside prepositional phrases. Singular subject → \"astonishes.\"",
      difficulty: "easy",
    },
    {
      passage: "The architect envisioned a building that would blend seamlessly with the surrounding _______ her design incorporated living walls covered in native plants and a rooftop garden visible from the street below.",
      stem: "Which choice completes the text?",
      choices: ["landscape her", "landscape, her", "landscape, and, her", "landscape; her"],
      correct: 3,
      explanation: "Two ICs. (A) comma splice. (B) semicolon correct. (C) run-on. (D) unnecessary comma after \"and.\"",
      difficulty: "easy",
    },
    {
      passage: "When the archaeologists first arrived at the site in 2018, they _______ that the structure was far older than initial surveys had suggested.",
      stem: "Which choice completes the text?",
      choices: ["had discovered", "discover", "discovered", "have discovered"],
      correct: 2,
      explanation: "The passage is in past tense (\"arrived,\" \"was,\" \"had suggested\"). The discovery happened at the time of arrival → simple past \"discovered.\"",
      difficulty: "medium",
    },
    {
      passage: "_______ the research team identified several compounds that could potentially slow the progression of the disease.",
      stem: "Which choice completes the text?",
      choices: ["After analyzing, thousands of molecular structures by", "Analyzing thousands of molecular structures,", "Thousands of molecular structures being analyzed,", "Having been analyzed for thousands of molecular structures,"],
      correct: 1,
      explanation: "The research team is doing the analyzing. (A) correctly places \"the research team\" right after the modifying phrase.",
      difficulty: "medium",
    },
    {
      passage: "Although the initial trials were _______ the pharmaceutical company decided to invest an additional $200 million in the drug's development.",
      stem: "Which choice completes the text?",
      choices: ["disappointing. The", "disappointing the", "disappointing, the", "disappointing; the"],
      correct: 2,
      explanation: "\"Although the initial trials were disappointing\" is a DC. A comma separates it from the IC. (A) semicolons need ICs on both sides. (B) period makes the DC a fragment.",
      difficulty: "easy",
    },
    {
      passage: "The new curriculum emphasizes not only analytical thinking and collaborative problem-solving but also _______ across multiple media platforms.",
      stem: "Which choice completes the text?",
      choices: ["that students should communicate effectively", "students communicating effectively", "to communicate effectively", "effective communication"],
      correct: 3,
      explanation: "\"Not only X but also Y\" — X = \"analytical thinking and collaborative problem-solving\" (noun phrases). Y must match: \"effective communication\" (noun phrase).",
      difficulty: "medium",
    },
    {
      passage: "The committee, along with several advisory board members and two external _______ unanimously approved the new policy on data privacy.",
      stem: "Which choice completes the text?",
      choices: ["consultants, have", "consultants; has", "consultants have", "consultants, has"],
      correct: 3,
      explanation: "\"The committee\" is the subject (singular). \"Along with…consultants\" is a parenthetical. Singular → \"has.\"",
      difficulty: "hard",
    },
    {
      passage: "The festival attracted visitors from twelve _______ local businesses reported a 40% increase in revenue during the three-day event.",
      stem: "Which choice completes the text?",
      choices: ["countries, local", "countries: local", "countries; local", "countries local"],
      correct: 2,
      explanation: "Two ICs. (A) comma splice. (B) semicolon correct. (C) run-on.",
      difficulty: "easy",
    },
    {
      passage: "By the time the rescue team arrived at the remote mountain village, the floodwaters _______ most of the bridges connecting the settlement to the main road.",
      stem: "Which choice completes the text?",
      choices: ["will have destroyed", "had already destroyed", "have destroyed", "destroyed"],
      correct: 1,
      explanation: "The destruction happened BEFORE the arrival. Past perfect (\"had destroyed\") indicates an action completed before another past action.",
      difficulty: "medium",
    },
    {
      passage: "Originally bred to herd sheep across rugged Scottish _______ border collies are now among the most popular companion animals in urban households worldwide.",
      stem: "Which choice completes the text?",
      choices: ["terrain, border", "terrain border", "terrain. Border", "terrain; border"],
      correct: 0,
      explanation: "\"Originally bred…terrain\" is a participial phrase modifying \"border collies.\" A comma connects the modifier to the subject.",
      difficulty: "easy",
    },
    {
      passage: "Neither the lead researcher nor her two graduate _______ able to replicate the results of the original experiment.",
      stem: "Which choice completes the text?",
      choices: ["assistants was", "assistants were", "assistant were", "assistants is"],
      correct: 1,
      explanation: "With \"neither…nor,\" the verb agrees with the nearer subject: \"assistants\" (plural) → \"were.\"",
      difficulty: "medium",
    },
    {
      passage: "The poet's use of iambic pentameter gives the sonnet its characteristic _______ each line contains exactly ten syllables alternating between unstressed and stressed beats.",
      stem: "Which choice completes the text?",
      choices: ["rhythm and each", "rhythm, each", "rhythm each", "rhythm; each"],
      correct: 3,
      explanation: "Two ICs. (A) comma splice. (B) semicolon correct — second IC elaborates the first. (C) run-on.",
      difficulty: "medium",
    },
    {
      passage: "The company's sustainability report highlighted three key achievements: reducing carbon emissions by 30%, _______ and eliminating single-use plastics from all offices.",
      stem: "Which choice completes the text?",
      choices: ["the implementation of renewable energy sources,", "to implement renewable energy sources,", "renewable energy sources were implemented,", "implementing renewable energy sources,"],
      correct: 3,
      explanation: "The series uses gerund phrases: \"reducing…,\" \"[verb]-ing…,\" \"eliminating…\" → \"implementing\" maintains the pattern.",
      difficulty: "hard",
    },
    {
      passage: "The migration patterns of Arctic terns _______ ornithologists for decades; these birds travel roughly 44,000 miles each year between their Arctic breeding grounds and Antarctic feeding areas.",
      stem: "Which choice completes the text?",
      choices: ["have fascinated", "fascinated", "fascinate", "will fascinate"],
      correct: 0,
      explanation: "\"For decades\" signals a duration that started in the past and continues to the present → present perfect \"have fascinated.\"",
      difficulty: "hard",
    },
  ],

  /* ──────── CHALLENGE ──────── */
  challenge: [
    {
      passage: "The playwright, _______ the committee had unanimously selected to receive the lifetime achievement award, delivered a speech that moved the audience to tears.",
      stem: "Which choice completes the text?",
      choices: ["who", "which", "whose", "whom"],
      correct: 3,
      explanation: "\"The committee selected [whom]\" — the pronoun receives the action of \"selected.\" Object case = \"whom.\"",
      difficulty: "hard",
    },
    {
      passage: "It was unclear _______ the funding would come from, since both the federal and state governments had recently imposed strict budget freezes.",
      stem: "Which choice completes the text?",
      choices: ["where", "whom", "from where", "which"],
      correct: 0,
      explanation: "\"Where the funding would come from\" — \"where\" functions as a relative adverb indicating source. \"From where\" is redundant with \"from\" at the end.",
      difficulty: "hard",
    },
    {
      passage: "The researchers could not determine whether the decline in pollinator populations was caused by pesticide exposure, habitat loss, or a combination of both, _______ made it difficult to recommend a single policy intervention.",
      stem: "Which choice completes the text?",
      choices: ["which", "this", "that", "it"],
      correct: 0,
      explanation: "\"Which\" refers to the entire preceding situation (the inability to determine the cause). Non-restrictive clauses use \"which,\" not \"that.\"",
      difficulty: "hard",
    },
    {
      passage: "The study compared the test scores of students _______ had completed the preparatory course with those of students who had not.",
      stem: "Which choice completes the text?",
      choices: ["whom", "whose", "which", "who"],
      correct: 3,
      explanation: "The students performed the action of completing → subject case = \"who.\" \"Whom\" would be incorrect here.",
      difficulty: "hard",
    },
    {
      passage: "Between the two researchers, Dr. Okafor has published more frequently than _______ though Dr. Lin's papers tend to receive more citations.",
      stem: "Which choice completes the text?",
      choices: ["her,", "her;", "she,", "she;"],
      correct: 2,
      explanation: "\"Than she [has published]\" — the implied verb makes \"she\" the subject. Comma needed for the following contrasting clause.",
      difficulty: "hard",
    },
    {
      passage: "In the valley below, where the river _______ its course through ancient limestone, the village had survived unchanged for centuries.",
      stem: "Which choice completes the text?",
      choices: ["winds", "wound", "has wound", "winding"],
      correct: 0,
      explanation: "The river's course through limestone is an ongoing geographical fact → present tense \"winds.\" The village \"had survived\" is past perfect for the historical statement.",
      difficulty: "hard",
    },
    {
      passage: "So profound _______ the impact of the new legislation that even its most vocal opponents acknowledged it had fundamentally altered the political landscape.",
      stem: "Which choice completes the text?",
      choices: ["were", "was", "had been", "is"],
      correct: 1,
      explanation: "Normal order: \"The impact was so profound that…\" Inverted: \"So profound was the impact.\" Subject = \"impact\" (singular), past tense → \"was.\"",
      difficulty: "hard",
    },
    {
      passage: "The artifacts — each of _______ had been meticulously cataloged by the museum staff — were moved to a climate-controlled storage facility.",
      stem: "Which choice completes the text?",
      choices: ["whom", "which", "who", "that"],
      correct: 1,
      explanation: "\"Artifacts\" are non-human → \"which.\" \"Who/whom\" are for people. \"That\" doesn't work after a preposition.",
      difficulty: "hard",
    },
    {
      passage: "Having been denied funding for the third consecutive year, _______ to abandon the research project entirely.",
      stem: "Which choice completes the text?",
      choices: ["the decision was made by the scientists", "it was decided by the scientists", "a decision was reached by the team to", "the scientists decided"],
      correct: 3,
      explanation: "\"Having been denied funding\" describes the scientists. Only (C) places \"the scientists\" immediately after the modifier.",
      difficulty: "hard",
    },
    {
      passage: "The cellist performed the concerto with a technical precision and an emotional depth that _______ even the most discerning critics in the audience.",
      stem: "Which choice completes the text?",
      choices: ["impressing", "have impressed", "impressed", "impresses"],
      correct: 2,
      explanation: "The performance happened in the past → \"impressed.\" The relative \"that\" refers to the compound \"precision and depth.\"",
      difficulty: "hard",
    },
    {
      passage: "It was _______ whom the director ultimately entrusted with the most demanding role in the production, despite the protests of more senior cast members.",
      stem: "Which choice completes the text?",
      choices: ["she", "them", "her", "they"],
      correct: 2,
      explanation: "\"Her\" is correct as the object of \"entrusted.\" The dominant grammatical relationship is \"entrusted [her] with.\"",
      difficulty: "hard",
    },
  ],

  takeaways: [
    "Find the true subject by crossing out prepositional phrases and parenthetical asides -- the verb must agree with what remains.",
    "Collective nouns (committee, team, jury) are singular on the PSAT. 'Each' and 'every' are always singular.",
    "With 'neither...nor,' the verb agrees with the nearer subject.",
    "Dangling modifiers: the person or thing doing the action must appear immediately after the modifying phrase.",
    "Parallelism: items in a series must match in grammatical form -- all gerunds, all infinitives, or all noun phrases.",
    "Verb tense must be consistent with time signals: 'by the time X happened' signals past perfect; 'for decades' signals present perfect.",
  ],
};
