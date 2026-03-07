"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { BossBattle } from "@/components/course/activities/boss-battle";

const BATTLE_QUESTIONS_EXERCISE: QuizQuestion[] = [
  {
    "passage": "The museum's new wing houses artifacts from ancient Egypt ______ visitors can also explore interactive exhibits on daily life in the Nile Delta.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "Egypt,",
      "Egypt;",
      "Egypt",
      "Egypt, and"
    ],
    "correct": 1,
    "explanation": "Two independent clauses. Semicolon correctly joins them. Comma alone = splice.",
    "difficulty": "easy",
    "skill": "boundary"
  },
  {
    "passage": "The series of lectures on artificial intelligence ______ scheduled to begin next Monday at the downtown campus.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "were",
      "have been",
      "is",
      "are"
    ],
    "correct": 2,
    "explanation": "Subject is \"series\" (singular). \"Of lectures on artificial intelligence\" is a prepositional phrase. Singular = \"is.\"",
    "difficulty": "easy",
    "skill": "agreement"
  },
  {
    "passage": "Inspired by her grandmother's stories, ______ wrote her first novel at the age of nineteen.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "Elena",
      "Elena's first book",
      "the novel by Elena",
      "it was Elena who"
    ],
    "correct": 0,
    "explanation": "Who was inspired? Elena. She must be the subject after the comma.",
    "difficulty": "easy",
    "skill": "modifier"
  },
  {
    "passage": "The training program teaches participants to set goals, manage their time, and ______ .",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "they develop communication skills",
      "developing communication skills",
      "communication skills are developed",
      "develop communication skills"
    ],
    "correct": 3,
    "explanation": "\"To set, manage, and develop\" — infinitive series. All must match.",
    "difficulty": "easy",
    "skill": "parallel"
  },
  {
    "passage": "Dr. Vasquez has studied coral reef ecosystems for over twenty ______ that ocean acidification poses a greater threat than previously estimated.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "years; believes",
      "years. Believes",
      "years believes",
      "years, believes"
    ],
    "correct": 3,
    "explanation": "\"Who has studied...twenty years\" is a nonrestrictive relative clause (implied \"who\"). The comma after \"years\" closes it, returning to: \"Dr. Vasquez...believes.\" Period/semicolon would create a fragment.",
    "difficulty": "medium",
    "skill": "boundary"
  },
  {
    "passage": "By the time the investigators arrived at the scene, the witnesses ______ already provided their statements to the local police.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "have",
      "has",
      "had",
      "would have"
    ],
    "correct": 2,
    "explanation": "Past perfect: providing statements happened BEFORE investigators arrived. \"Had already provided.\"",
    "difficulty": "medium",
    "skill": "tense"
  },
  {
    "passage": "Neither the principal nor the teachers ______ able to explain the sudden drop in test scores across all grade levels.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "were",
      "is",
      "has been",
      "was"
    ],
    "correct": 0,
    "explanation": "Neither/nor: verb agrees with the closer subject. \"Teachers\" (plural) is closer = \"were.\"",
    "difficulty": "medium",
    "skill": "agreement"
  },
  {
    "passage": "The fuel efficiency of the new hybrid model is significantly better than ______ .",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "compared to the previous model",
      "what the previous model was",
      "the previous model",
      "that of the previous model"
    ],
    "correct": 3,
    "explanation": "Comparing efficiency to efficiency. \"That of\" refers back to \"fuel efficiency.\" A compares efficiency to a model (faulty).",
    "difficulty": "medium",
    "skill": "comparison"
  },
  {
    "passage": "The company announced three strategic priorities for the coming fiscal year ______ expanding into Southeast Asian markets, launching a direct-to-consumer platform, and investing $200 million in sustainable manufacturing.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "year;",
      "year:",
      "year,",
      "year —"
    ],
    "correct": 1,
    "explanation": "Colon introduces a list specifying the \"three strategic priorities.\" Left side is an independent clause.",
    "difficulty": "medium",
    "skill": "boundary"
  },
  {
    "passage": "Completed after nearly a decade of construction, ______ has become the city's most recognizable landmark.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "the bridge's completion was celebrated, and it",
      "the architects celebrated because the bridge",
      "the bridge",
      "tourists frequently photograph the bridge, which"
    ],
    "correct": 2,
    "explanation": "What was completed? The bridge. It must be the subject after the comma.",
    "difficulty": "medium",
    "skill": "modifier"
  },
  {
    "passage": "The anthology of essays, poems, and short stories that ______ compiled by Dr. Whitfield has been nominated for a National Book Award.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "have been",
      "were",
      "are",
      "was"
    ],
    "correct": 3,
    "explanation": "\"That\" refers to \"anthology\" (singular), not the items inside it. The anthology was compiled.",
    "difficulty": "hard",
    "skill": "agreement"
  },
  {
    "passage": "The candidate promised not only to lower taxes but also ______ in public education.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "increasing investment",
      "an increase of investment",
      "to increase investment",
      "she would increase investment"
    ],
    "correct": 2,
    "explanation": "\"Not only to lower...but also to increase.\" Infinitive pairs with infinitive.",
    "difficulty": "hard",
    "skill": "parallel"
  },
  {
    "passage": "If the proposed amendment ______ ratified by two-thirds of the states, it would fundamentally alter the balance of power between federal and state governments.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "were",
      "is",
      "will be",
      "was"
    ],
    "correct": 0,
    "explanation": "Subjunctive in hypothetical contrary-to-fact condition. \"If [subject] were\" regardless of number. \"Would\" in the main clause confirms this is hypothetical.",
    "difficulty": "hard",
    "skill": "tense"
  },
  {
    "passage": "The sculptor's latest installation — a towering arrangement of recycled steel beams and shattered glass ______ draws thousands of visitors to the waterfront gallery each month.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      ":",
      "—",
      ";",
      ","
    ],
    "correct": 1,
    "explanation": "An opening em-dash before \"a towering arrangement\" needs a closing em-dash to match. Dashes come in pairs when setting off an aside.",
    "difficulty": "hard",
    "skill": "boundary"
  },
  {
    "passage": "Having analyzed data from over 50,000 patient records spanning three decades, ______ challenged the prevailing assumption that the treatment was universally effective.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "the research team",
      "a new conclusion was reached that",
      "the study's findings",
      "the research team's findings"
    ],
    "correct": 0,
    "explanation": "Who analyzed data? The research team. They must be the subject. \"The study's findings\" and \"the research team's findings\" didn't analyze anything — they ARE the analysis.",
    "difficulty": "hard",
    "skill": "modifier"
  },
  {
    "passage": "Like the novels of Toni Morrison, ______ explores themes of identity, memory, and belonging through richly layered narratives.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "Chimamanda Ngozi Adichie's fiction",
      "the themes in Chimamanda Ngozi Adichie's work",
      "the fiction of Chimamanda Ngozi Adichie",
      "Chimamanda Ngozi Adichie"
    ],
    "correct": 3,
    "explanation": "\"Like the novels of Morrison\" sets up a comparison, but the verb \"explores\" needs a person or body of work as subject. \"Adichie\" (the author) explores themes. Comparing author's approach to author's approach.",
    "difficulty": "hard",
    "skill": "comparison"
  },
  {
    "passage": "Researchers found that participants who exercised regularly showed improved cognitive function; ______ those who combined exercise with meditation showed even greater gains.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "furthermore,",
      "furthermore",
      "however;",
      "however,"
    ],
    "correct": 0,
    "explanation": "After a semicolon, the conjunctive adverb + comma begins the next clause. \"Furthermore\" adds to the point (both groups improved, the second even more). \"However\" would imply contrast, which doesn't fit.",
    "difficulty": "hard",
    "skill": "boundary"
  },
  {
    "passage": "The professor, along with several graduate students and a visiting researcher from Tokyo, ______ published a comprehensive review of the literature on quantum entanglement.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "has",
      "have",
      "are",
      "were"
    ],
    "correct": 0,
    "explanation": "\"The professor\" is the subject (singular). \"Along with...\" is a parenthetical phrase, NOT a compound subject. Unlike \"and,\" phrases like \"along with,\" \"together with,\" and \"as well as\" don't make the subject plural.",
    "difficulty": "hard",
    "skill": "agreement"
  },
  {
    "passage": "Originally designed as a temporary shelter for earthquake victims, ______ has been continuously occupied for over forty years and now functions as a permanent community center.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "the building's transformation surprised city planners",
      "the prefabricated structure",
      "architects were surprised that the structure",
      "residents have transformed the building, which"
    ],
    "correct": 1,
    "explanation": "What was originally designed? The structure. It must be the subject. The building's transformation, residents, and architects weren't designed as shelters.",
    "difficulty": "hard",
    "skill": "modifier"
  },
  {
    "passage": "The report recommended that the agency increase its oversight capacity, ______ , and establish clearer guidelines for interagency communication.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "with the hiring of additional inspectors",
      "additional inspectors be hired",
      "hire additional inspectors",
      "hiring additional inspectors should be a priority"
    ],
    "correct": 2,
    "explanation": "Subjunctive series after \"recommended that\": increase, hire, establish. All base-form verbs.",
    "difficulty": "hard",
    "skill": "parallel"
  },
  {
    "passage": "The artist, whose murals ______ the walls of buildings in twelve countries, announced yesterday that she will begin a new series focused on climate migration.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "have adorned",
      "adorned",
      "adorn",
      "had adorned"
    ],
    "correct": 0,
    "explanation": "Present perfect: the murals started adorning walls in the past and still do now (they're still on the buildings). \"Have adorned\" captures this ongoing state.",
    "difficulty": "hard",
    "skill": "tense"
  },
  {
    "passage": "While the committee acknowledged the proposal's merits ______ voted to table the discussion until additional funding sources could be identified.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      ", it",
      ": it",
      "; it",
      ", they"
    ],
    "correct": 0,
    "explanation": "\"While the committee acknowledged...\" is a dependent clause. A comma + subject (\"it\" referring to committee) correctly connects it to the independent clause. Semicolon/colon after a dependent clause creates a fragment.",
    "difficulty": "hard",
    "skill": "boundary"
  },
  {
    "passage": "Among the many innovations displayed at the technology expo ______ a prototype solar panel capable of generating electricity from both direct sunlight and ambient indoor lighting.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "are",
      "was",
      "have been",
      "were"
    ],
    "correct": 1,
    "explanation": "Inverted order. Subject comes after: \"a prototype solar panel\" (singular). \"Among the innovations WAS a prototype.\"",
    "difficulty": "hard",
    "skill": "agreement"
  },
  {
    "passage": "The salaries of nurses in rural hospitals are often significantly lower than ______ in major metropolitan medical centers.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "the nurses working",
      "nurses",
      "nurses' salaries are",
      "those of nurses"
    ],
    "correct": 3,
    "explanation": "Comparing salaries to salaries. \"Those of nurses\" = the salaries of nurses. A compares salaries to nurses (faulty).",
    "difficulty": "hard",
    "skill": "comparison"
  },
  {
    "passage": "A Nobel laureate in physics and an accomplished violinist, ______ defied the assumption that scientific and artistic talents are mutually exclusive.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "it was Einstein who",
      "the achievements of Einstein",
      "Einstein",
      "Einstein's legacy"
    ],
    "correct": 2,
    "explanation": "\"A Nobel laureate...\" is an appositive renaming a person. Einstein (the person) must be the subject. \"Einstein's legacy\" and \"the achievements\" aren't a laureate or violinist.",
    "difficulty": "hard",
    "skill": "modifier"
  }
];

export default function SATRWModule4() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}

      activities={{
        "exercise-battle-questions": (goNext) => (
          <BossBattle
            questions={BATTLE_QUESTIONS_EXERCISE}
            title="Battle Questions"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/sat-rw/5"
      nextModuleLabel="Module 5: Words in Context"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 4,
  title: "Conventions Boss Battle",
  subtitle:
    "The Sentinel awakens...",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "exercise-battle-questions", label: "Battle Questions", icon: "zap" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  takeaways: [
    "Conventions cover ~26% of the SAT R&W section — mastering grammar is the fastest path to a higher score.",
    "Comma splices are the most common boundary error — a comma alone cannot join two independent clauses.",
    "Use the cross-out method to find the true subject and match the verb form.",
    "After an introductory phrase, the subject immediately after the comma must be performing the action.",
    "In lists and comparisons, every item must match in grammatical form.",
    "The harder questions combine multiple rules — a dangling modifier inside a sentence with a tense shift.",
  ],
};
