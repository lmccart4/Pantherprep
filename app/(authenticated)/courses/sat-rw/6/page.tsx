"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  StatsVisual,
  DistinctionDemo,
  IntensityScale,
  SecondaryQuiz,
  VocabClusters,
  TiebreakerVisual,
} from "./lesson-visuals";

const WARMUP_ITEMS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "The researcher's findings were so ______ that even her most vocal critics acknowledged the strength of her evidence.",
    "options": [
      "controversial",
      "ambiguous",
      "predictable",
      "compelling"
    ],
    "correct": 3,
    "explanation": "\"Even her critics acknowledged\" = the evidence was strong enough to convince skeptics. \"Compelling\" means powerfully convincing."
  },
  {
    "prompt": "While the novel's plot follows a fairly conventional structure, the author's prose style is anything but ______: her sentences twist and turn in unexpected ways that keep readers perpetually off-balance.",
    "options": [
      "eloquent",
      "ordinary",
      "innovative",
      "verbose"
    ],
    "correct": 1,
    "explanation": "\"Anything but ______\" + \"unexpected ways\" = her style is NOT ordinary. The blank needs the thing she is NOT. \"Ordinary\" fits the contrast."
  },
  {
    "prompt": "The city council's decision to approve the development project was not ______; rather, it followed eighteen months of public hearings, environmental reviews, and contentious debate among council members.",
    "options": [
      "transparent",
      "hasty",
      "expensive",
      "popular"
    ],
    "correct": 1,
    "explanation": "\"Not ______ ; rather, it followed 18 months of process\" = it was NOT rushed. \"Hasty\" means rushed, done too quickly."
  },
  {
    "prompt": "The documentary filmmaker chose to let her subjects speak for themselves, adopting a ______ approach that avoided narration, interviews, or any directorial commentary.",
    "options": [
      "dramatic",
      "innovative",
      "traditional",
      "hands-off"
    ],
    "correct": 3,
    "explanation": "No narration, no interviews, no commentary = the filmmaker stepped back. \"Hands-off\" means not interfering."
  },
  {
    "prompt": "Although the two species appear nearly identical to the untrained eye, a trained biologist can readily ______ them by examining the subtle differences in their wing patterns.",
    "options": [
      "distinguish",
      "conflate",
      "classify",
      "observe"
    ],
    "correct": 0,
    "explanation": "\"Appear identical\" but can be told apart = \"distinguish\" means to recognize differences between similar things."
  },
  {
    "prompt": "The committee members, who had previously been united in their support for the proposal, found their ______ fracturing as new cost estimates emerged.",
    "options": [
      "funding",
      "consensus",
      "timeline",
      "enthusiasm"
    ],
    "correct": 1,
    "explanation": "\"Previously united\" → \"fracturing\" = their agreement broke down. \"Consensus\" means general agreement."
  }
];

const SHOWDOWN_ITEMS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "The committee's ______ investigation into the financial irregularities left no document unexamined and no witness uninterviewed, spanning eighteen months and resulting in a 400-page report.\n\nA) thorough  B) exhaustive",
    "options": [
      "A — thorough",
      "B — exhaustive"
    ],
    "correct": 1,
    "explanation": "\"Exhaustive\" means comprehensive to the point of leaving nothing out. The passage emphasizes totality — exhaustive captures this completeness precisely."
  },
  {
    "prompt": "The artist's decision to destroy her early paintings was not impulsive; rather, it reflected a ______ choice to distance herself from work she considered derivative.\n\nA) deliberate  B) calculated",
    "options": [
      "B — calculated",
      "A — deliberate"
    ],
    "correct": 1,
    "explanation": "\"Deliberate\" means done consciously and intentionally after careful thought. Neutral/positive, matches \"not impulsive\" + personal artistic decision."
  },
  {
    "prompt": "Once hailed as revolutionary, the economic theory has been increasingly ______ by scholars who argue that its core assumptions are fundamentally flawed.\n\nA) questioned  B) challenged",
    "options": [
      "B — challenged",
      "A — questioned"
    ],
    "correct": 0,
    "explanation": "\"Challenged\" means to actively dispute or contest. The scholars \"argue\" assumptions are \"fundamentally flawed\" — active opposition, not mere doubt."
  },
  {
    "prompt": "The politician's speech was notably ______, avoiding any specific policy commitments while still managing to sound supportive of reform in general terms.\n\nA) vague  B) evasive",
    "options": [
      "B — evasive",
      "A — vague"
    ],
    "correct": 0,
    "explanation": "\"Evasive\" means intentionally avoiding directness. The passage shows deliberate avoidance — this is strategic, not accidental."
  },
  {
    "prompt": "The discovery of water ice on the lunar surface was not merely surprising — it was ______, overturning decades of scientific consensus about the Moon's composition.\n\nA) remarkable  B) groundbreaking",
    "options": [
      "A — remarkable",
      "B — groundbreaking"
    ],
    "correct": 1,
    "explanation": "\"Groundbreaking\" means pioneering, fundamentally new. \"Overturning decades of consensus\" shows this discovery changed the field."
  },
  {
    "prompt": "Although the novelist's prose style is often described as minimalist, a closer reading reveals layers of ______ meaning beneath the deceptively simple surface.\n\nA) hidden  B) subtle",
    "options": [
      "A — hidden",
      "B — subtle"
    ],
    "correct": 1,
    "explanation": "\"Subtle\" means delicate, not immediately obvious but present for attentive readers. \"Layers\" + \"deceptively simple\" = subtle captures this perfectly."
  },
  {
    "prompt": "The refugee crisis has ______ existing tensions between member states, with disagreements over burden-sharing threatening to fracture the alliance.\n\nA) worsened  B) exacerbated",
    "options": [
      "B — exacerbated",
      "A — worsened"
    ],
    "correct": 0,
    "explanation": "\"Exacerbated\" means to make an already-bad situation worse. The tensions are \"existing\" (already present). Exacerbated is the precise academic term."
  },
  {
    "prompt": "Rather than impose a solution, the mediator adopted a ______ approach, guiding the disputing parties toward their own resolution through carefully structured dialogue.\n\nA) patient  B) facilitative",
    "options": [
      "A — patient",
      "B — facilitative"
    ],
    "correct": 1,
    "explanation": "\"Facilitative\" means designed to make a process easier. The mediator guided rather than imposed — this describes a facilitative methodology."
  }
];

const SECONDARY_ITEMS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "The board of directors refused to ______ the CEO's proposal for expansion, arguing that the company's current resources could not support such an ambitious undertaking.",
    "options": [
      "entertain",
      "support",
      "accept",
      "enjoy"
    ],
    "correct": 0,
    "explanation": "\"Entertain\" here means to consider or give thought to (an idea). Not about amusement."
  },
  {
    "prompt": "Environmental activists have long ______ stricter regulations on industrial emissions, citing decades of research linking pollution to respiratory disease.",
    "options": [
      "organized",
      "defeated",
      "resisted",
      "championed"
    ],
    "correct": 3,
    "explanation": "\"Championed\" means to advocate for or support publicly. Not about winning a competition."
  },
  {
    "prompt": "The researcher's bold claims, initially dismissed as speculative, were ultimately ______ by a series of independent studies that replicated her findings.",
    "options": [
      "discovered",
      "vindicated",
      "explained",
      "celebrated"
    ],
    "correct": 1,
    "explanation": "\"Vindicated\" means proved right after being doubted. More precise than \"celebrated.\""
  },
  {
    "prompt": "The new evidence effectively ______ the defense's primary argument, leaving the legal team scrambling to develop an alternative strategy.",
    "options": [
      "undermined",
      "complicated",
      "questioned",
      "eliminated"
    ],
    "correct": 0,
    "explanation": "\"Undermined\" means to weaken the foundation of something."
  },
  {
    "prompt": "Property values in the neighborhood have ______ steadily over the past decade, driven by new transit connections and an influx of restaurants and retail shops.",
    "options": [
      "improved",
      "increased",
      "expanded",
      "appreciated"
    ],
    "correct": 3,
    "explanation": "\"Appreciated\" in a financial context means to increase in value. Domain-specific precision."
  },
  {
    "prompt": "The diplomat's ______ remarks about the fragile peace process threatened to derail months of careful negotiation between the two nations.",
    "options": [
      "honest",
      "passionate",
      "detailed",
      "intemperate"
    ],
    "correct": 3,
    "explanation": "\"Intemperate\" means lacking moderation or restraint."
  },
  {
    "prompt": "The author ______ the term 'digital nomad' in a 2007 blog post, though the lifestyle it describes didn't become widespread until nearly a decade later.",
    "options": [
      "introduced",
      "created",
      "invented",
      "coined"
    ],
    "correct": 3,
    "explanation": "\"Coined\" specifically means to invent a new word or phrase."
  },
  {
    "prompt": "After sixteen hours of continuous debate, the senators' energy began to ______, and several members appeared to struggle to maintain their focus during the final round of amendments.",
    "options": [
      "weaken",
      "flag",
      "collapse",
      "disappear"
    ],
    "correct": 1,
    "explanation": "\"Flag\" as a verb means to decline in energy or enthusiasm. Classic SAT secondary meaning."
  }
];

export default function SATRWModule6() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "stats": <StatsVisual />,
        "distinction-demo": <DistinctionDemo />,
        "intensity-scale": <IntensityScale />,
        "secondary-quiz": <SecondaryQuiz />,
        "vocab-clusters": <VocabClusters />,
        "tiebreaker": <TiebreakerVisual />,
      }}
      activities={{
        "exercise-warmup-items": (goNext: () => void) => (
          <MatchingExercise
            items={WARMUP_ITEMS_EXERCISE}
            title="Warmup"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-showdown-items": (goNext: () => void) => (
          <MatchingExercise
            items={SHOWDOWN_ITEMS_EXERCISE}
            title="Showdown"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-secondary-items": (goNext: () => void) => (
          <MatchingExercise
            items={SECONDARY_ITEMS_EXERCISE}
            title="Secondary"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/sat-rw/7"
      nextModuleLabel="Module 7: Text Structure, Purpose & Cross-Text"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 6,
  title: "Advanced Vocabulary & Precision",
  subtitle:
    "The difference between 600 and 700+ on vocabulary",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-warmup-items", label: "Warmup Items", icon: "zap" },
    { id: "exercise-showdown-items", label: "Showdown Items", icon: "zap" },
    { id: "exercise-secondary-items", label: "Secondary Items", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "intro",
      title: "From Good to Great",
      subtitle: "The difference between 600 and 700+ on vocabulary",
      body: ["In Module 5, you learned the foundational strategies: tone first, context clues, and basic connotation. Those skills get you to the right neighborhood. This module teaches you to find the exact house.","At the 600 level, students can usually eliminate 2 wrong answers. At the 700+ level, students consistently pick the BEST answer from the remaining two. The difference? Precision — understanding exactly how near-synonyms differ and which one the passage demands.","This module builds three advanced skills: distinguishing near-synonyms by their precise meanings, recognizing secondary definitions of familiar words, and developing a mental library of the SAT's most-tested Tier 2 vocabulary."],
      visual: "stats",
    },
    {
      id: "near-synonyms",
      title: "Near-Synonym Precision",
      subtitle: "Why 'almost right' is completely wrong",
      body: ["The SAT's hardest vocabulary questions give you two answer choices that BOTH seem to fit. The difference is precision — one is a closer match than the other.","EXAMPLE: A passage describes a scientist who questions every assumption and demands rigorous evidence before accepting any claim.\n\nA) skeptical — doubts or questions things\nB) cynical — believes people are motivated by self-interest\n\nBoth suggest doubt, but \"skeptical\" is about evidence and proof, while \"cynical\" is about distrusting human motives. The passage describes intellectual rigor, not distrust of people. Answer: skeptical.","THE KEY DISTINCTION: Near-synonyms share a general meaning but differ in:\n• Scope (broad vs. narrow)\n• Intensity (mild vs. strong)\n• Domain (where the word is typically used)\n• Implication (what the word suggests beyond its definition)"],
      visual: "distinction-demo",
    },
    {
      id: "scope",
      title: "Distinction #1: Scope",
      subtitle: "General vs. specific",
      body: ["Some words are broader, others more specific. The SAT rewards the most PRECISE choice — the one whose scope matches the passage exactly.","BROAD → NARROW examples:\n• \"change\" → \"transformation\" → \"metamorphosis\"\n• \"reduce\" → \"diminish\" → \"erode\"\n• \"disagree\" → \"object\" → \"denounce\"\n• \"help\" → \"facilitate\" → \"catalyze\"","STRATEGY: If the passage describes a gradual, slow process, \"erode\" (implies wearing away over time) is more precise than \"reduce\" (generic decrease). If the passage describes rapid, complete change, \"transformation\" beats \"change.\"","The wrong answer is often the more general word. The right answer is the one that captures the specific flavor of what the passage describes."],
    },
    {
      id: "intensity",
      title: "Distinction #2: Intensity",
      subtitle: "Mild, moderate, or extreme?",
      body: ["Near-synonyms often differ in how strong or extreme they are. The passage's context tells you what intensity level is appropriate.","MILD → EXTREME:\n• \"concerned\" → \"worried\" → \"alarmed\" → \"panicked\"\n• \"dislike\" → \"resent\" → \"despise\" → \"loathe\"\n• \"suggest\" → \"argue\" → \"insist\" → \"demand\"\n• \"good\" → \"impressive\" → \"exceptional\" → \"extraordinary\"","PASSAGE TEST: \"The committee expressed ______ about the proposal's environmental provisions, noting several areas that required further study.\"\n\n\"Reservations\" (mild concern) fits. \"Outrage\" (extreme) doesn't match \"noting several areas that required further study\" — that's calm, measured language, not fury.","RULE: Match the intensity of your answer to the intensity of the passage. Formal, measured language = mild/moderate vocabulary. Emotional, dramatic language = stronger vocabulary."],
      visual: "intensity-scale",
    },
    {
      id: "domain",
      title: "Distinction #3: Domain",
      subtitle: "Where is this word normally used?",
      body: ["Words carry associations with the contexts they're normally used in. The SAT expects you to match the word's domain to the passage's domain.","\"Lucrative\" vs. \"rewarding\" — both mean something is beneficial, but:\n• \"Lucrative\" = specifically financially profitable (business domain)\n• \"Rewarding\" = satisfying in a broader sense (could be emotional, intellectual, financial)","\"Diagnose\" vs. \"identify\" — both mean to determine what something is, but:\n• \"Diagnose\" = medical/technical context (identifying a problem or condition)\n• \"Identify\" = general (works in any context)","\"Volatile\" vs. \"unpredictable\":\n• \"Volatile\" = chemistry (explosive), finance (price swings), emotions (quick to anger)\n• \"Unpredictable\" = general, no specific domain association","STRATEGY: If a passage is about economics, a finance-domain word like \"lucrative\" or \"volatile\" may be more precise than a generic synonym."],
    },
    {
      id: "secondary-deep",
      title: "Secondary Meanings Deep Dive",
      subtitle: "The SAT's favorite vocabulary trick",
      body: ["The hardest vocabulary questions use common words in uncommon ways. You KNOW the word, which makes the trap worse — your brain defaults to the familiar meaning.","HIGH-FREQUENCY SECONDARY MEANINGS:\n• \"Entertain\" = to consider (an idea), not just to amuse\n• \"Champion\" = to advocate for, not just a winner\n• \"Appreciate\" = to increase in value, not just to be grateful\n• \"Commit\" = to dedicate/pledge, not just to do something wrong\n• \"Table\" = to postpone discussion (US) / to bring up for discussion (UK)\n• \"Tender\" = to formally offer (a resignation), not just soft/gentle\n• \"Coin\" = to invent (a word/phrase), not just money\n• \"Brook\" = to tolerate, not just a stream\n• \"Flag\" = to decline in energy/interest, not just a banner\n• \"Sound\" = thorough/reliable (\"sound reasoning\"), not just noise","STRATEGY: When you see a common word among the choices and the other options are more sophisticated, the SAT may be testing the common word's secondary meaning. Don't automatically dismiss simple words."],
      visual: "secondary-quiz",
    },
    {
      id: "vocab-bank",
      title: "High-Value SAT Vocabulary",
      subtitle: "Words that appear again and again",
      body: ["Analysis of official practice tests reveals vocabulary clusters that the SAT tests repeatedly. Learning these gives you a significant edge.","DESCRIBING IDEAS/ARGUMENTS:\nCorroborate (confirm), substantiate (provide evidence for), undermine (weaken), refute (disprove), bolster (strengthen), nuanced (subtle/complex), tenuous (weak/thin), cogent (clear and convincing)","DESCRIBING PEOPLE/APPROACHES:\nMeticulous (extremely careful), pragmatic (practical), audacious (bold/daring), complacent (self-satisfied), reticent (reluctant to speak), candid (honest/direct), dogmatic (rigidly opinionated), judicious (showing good judgment)","DESCRIBING CHANGE/SCALE:\nPervasive (everywhere), ephemeral (short-lived), unprecedented (never happened before), incremental (gradual), precipitous (sudden/steep), nascent (just beginning), entrenched (firmly established), diminish (reduce)"],
      visual: "vocab-clusters",
    },
    {
      id: "process-advanced",
      title: "The Advanced Decision Process",
      subtitle: "When you're down to two choices",
      body: ["When you've eliminated two choices and are stuck between the final two, use this tiebreaker process:","STEP 1: Re-read the EXACT sentence with each word plugged in. Don't just check if it \"works\" — check if it's PRECISE.","STEP 2: Check intensity match. Is the passage calm or heated? Academic or emotional? Match the word's intensity to the passage's register.","STEP 3: Check scope. Is one word too broad? Too narrow? The right answer fits the passage like a key in a lock.","STEP 4: Check for secondary meanings. Could one of the choices be using a less common definition that actually fits better?","STEP 5: When truly stuck, choose the more SPECIFIC word. On the SAT, precision beats generality."],
      visual: "tiebreaker",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      passage: "The architect's design, while aesthetically striking, proved ______ in practice: the building's irregular angles created persistent problems with drainage and insulation that required costly modifications.",
      stem: "Which choice completes the text?",
      choices: ["impractical", "ugly", "controversial", "ambitious"],
      correct: 0,
      explanation: "\"Aesthetically striking\" BUT problems in practice = looks good but doesn't function well. \"Impractical.\"",
      difficulty: "medium",
    },
    {
      passage: "The study's conclusions, based on data from only 23 participants over a two-week period, struck many researchers as ______, and several called for larger-scale replication before the findings could be considered reliable.",
      stem: "Which choice completes the text?",
      choices: ["fraudulent", "innovative", "premature", "definitive"],
      correct: 2,
      explanation: "Small sample + short period + need for replication = conclusions drawn too early. \"Premature.\"",
      difficulty: "medium",
    },
    {
      passage: "The playwright's dialogue captures the ______ of everyday speech — the hesitations, interruptions, and half-finished thoughts that characterize real conversation — while still maintaining dramatic purpose.",
      stem: "Which choice completes the text?",
      choices: ["awkwardness", "rhythm", "cadence", "authenticity"],
      correct: 2,
      explanation: "\"Cadence\" means the rhythmic flow of sounds/speech — captures both musicality and natural patterns.",
      difficulty: "medium",
    },
    {
      passage: "Once considered a ______ field with limited practical applications, data science has rapidly become one of the most sought-after disciplines in both academia and industry.",
      stem: "Which choice completes the text?",
      choices: ["declining", "niche", "controversial", "prominent"],
      correct: 1,
      explanation: "\"Niche\" means specialized, appealing to a small group. Contrasts with current widespread demand.",
      difficulty: "medium",
    },
    {
      passage: "The biographer resisted the temptation to ______ her subject's flaws, instead presenting a candid portrait that acknowledged both the leader's remarkable achievements and her significant personal failings.",
      stem: "Which choice completes the text?",
      choices: ["exaggerate", "overlook", "sanitize", "criticize"],
      correct: 2,
      explanation: "\"Sanitize\" means to make something seem more acceptable by removing unpleasant elements.",
      difficulty: "hard",
    },
    {
      passage: "The senator's support for the bill was ______ at best: while she voted in favor, she declined to speak on its behalf, refused to lobby undecided colleagues, and publicly expressed reservations about several key provisions.",
      stem: "Which choice completes the text?",
      choices: ["principled", "inconsistent", "enthusiastic", "lukewarm"],
      correct: 3,
      explanation: "\"Lukewarm\" means lacking enthusiasm, halfhearted.",
      difficulty: "hard",
    },
    {
      passage: "The discovery didn't merely add to existing knowledge; it ______ the entire theoretical framework, forcing researchers across multiple disciplines to fundamentally reconsider assumptions that had guided their work for decades.",
      stem: "Which choice completes the text?",
      choices: ["complicated", "influenced", "expanded", "upended"],
      correct: 3,
      explanation: "\"Upended\" means to turn upside down, to completely disrupt.",
      difficulty: "hard",
    },
    {
      passage: "Critics praised the filmmaker's ______ use of silence in the final scene, noting that the absence of dialogue or music created a tension more powerful than any soundtrack could have achieved.",
      stem: "Which choice completes the text?",
      choices: ["conspicuous", "reluctant", "deliberate", "frequent"],
      correct: 2,
      explanation: "\"Deliberate\" means done with careful intent.",
      difficulty: "hard",
    },
    {
      passage: "The historian argued that the revolution was not a sudden rupture but rather the ______ of decades of gradual economic, social, and intellectual changes that had slowly eroded the foundations of the old order.",
      stem: "Which choice completes the text?",
      choices: ["culmination", "beginning", "repetition", "result"],
      correct: 0,
      explanation: "\"Culmination\" means the highest or climactic point of a long development.",
      difficulty: "hard",
    },
    {
      passage: "The ecologist warned that the apparent recovery of the fish population was ______, driven not by genuine ecological improvement but by a temporary influx of juvenile fish from neighboring waterways that would likely migrate back within months.",
      stem: "Which choice completes the text?",
      choices: ["permanent", "unprecedented", "illusory", "gradual"],
      correct: 2,
      explanation: "\"Illusory\" means based on illusion, deceptive. The recovery is a mirage.",
      difficulty: "hard",
    },
  ],

  takeaways: [
    "When stuck between two near-synonyms, check three tiebreakers: scope (broad vs. narrow), intensity (strong vs. mild), and domain (formal vs. informal).",
    "Secondary meanings are the SAT's favorite vocabulary trap — common words with uncommon definitions (e.g., \"economy\" meaning efficiency, not finance).",
    "Build mental libraries of near-synonym clusters: Ideas/Arguments, People/Approaches, Change/Scale.",
    "The precision process: determine tone, find clue, eliminate non-matches, then go specific — the most precise word wins.",
    "Vocabulary precision questions increase in difficulty — medium questions test scope, hard questions test subtle connotation differences.",
  ],
};
