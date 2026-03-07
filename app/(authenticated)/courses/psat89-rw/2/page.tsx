"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  PredictMethodVisual,
  ClueTypesVisual,
  VocabClustersVisual,
  MorphTableVisual,
} from "./lesson-visuals";

export default function PSAT89RWModule2() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/psat89-rw/3"
      nextModuleLabel="Module 3: Text Structure & Cross-Text"
      visuals={{
        "predict-method": <PredictMethodVisual />,
        "clue-types": <ClueTypesVisual />,
        "vocab-clusters": <VocabClustersVisual />,
        "morph-table": <MorphTableVisual />,
      }}
      activities={{
        "exercise-prereq": (goNext: () => void) => (
          <MatchingExercise
            items={PREREQ_EXERCISE_DATA}
            title="Prereq Check"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-clue": (goNext: () => void) => (
          <MatchingExercise
            items={CLUE_EXERCISE_DATA}
            title="Context Clue Types"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-pred": (goNext: () => void) => (
          <MatchingExercise
            items={PRED_EXERCISE_DATA}
            title="Predict Before You Peek"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-morph": (goNext: () => void) => (
          <MatchingExercise
            items={MORPH_EXERCISE_DATA}
            title="Word Parts Decoder"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-tone": (goNext: () => void) => (
          <MatchingExercise
            items={TONE_EXERCISE_DATA}
            title="Tone Classifier"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-traps": (goNext: () => void) => (
          <MatchingExercise
            items={TRAPS_EXERCISE_DATA}
            title="Trap Spotter"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

const PREREQ_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "substantial",
    "options": [
      "quick",
      "colorful",
      "small",
      "large/significant"
    ],
    "correct": 3,
    "explanation": "\"Substantial\" means large in size, value, or importance. Think: \"sub-STANT-ial\" relates to having substance."
  },
  {
    "prompt": "preliminary",
    "options": [
      "unrelated",
      "introductory/early",
      "final",
      "confusing"
    ],
    "correct": 1,
    "explanation": "\"Preliminary\" means coming before the main event. Think: \"pre-\" = before. Preliminary results come before final ones."
  },
  {
    "prompt": "advocate",
    "options": [
      "investigate",
      "avoid",
      "publicly support",
      "secretly oppose"
    ],
    "correct": 2,
    "explanation": "\"Advocate\" means to publicly support or recommend. An advocate is someone who speaks up for a cause."
  },
  {
    "prompt": "diminish",
    "options": [
      "increase",
      "destroy",
      "brighten",
      "make smaller/less"
    ],
    "correct": 3,
    "explanation": "\"Diminish\" means to make or become less. Think: \"mini\" is inside the word — something getting smaller."
  },
  {
    "prompt": "ambiguous",
    "options": [
      "having multiple meanings",
      "temporary",
      "clear",
      "beautiful"
    ],
    "correct": 0,
    "explanation": "\"Ambiguous\" means open to more than one interpretation. \"Ambi-\" means both/two ways."
  },
  {
    "prompt": "undermine",
    "options": [
      "dig tunnels",
      "weaken gradually",
      "discover",
      "strengthen"
    ],
    "correct": 1,
    "explanation": "\"Undermine\" means to weaken or damage gradually. Think: mining UNDER a foundation makes it collapse."
  }
];

const CLUE_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "The researcher’s methodology was innovative — that is, it introduced techniques never before used in the field. [Clue: Definition/Restatement]",
    "options": [
      "Example",
      "Definition/Restatement",
      "Cause/Effect",
      "Contrast"
    ],
    "correct": 1,
    "explanation": "The phrase \"that is\" directly restates the meaning: introduced techniques never before used = innovative."
  },
  {
    "prompt": "Unlike her reserved older sister, Maya was outgoing and eager to meet new people at every social event. [Clue: Contrast]",
    "options": [
      "Example",
      "Tone/Mood",
      "Contrast",
      "Definition/Restatement"
    ],
    "correct": 2,
    "explanation": "\"Unlike\" signals contrast. Maya is outgoing, so \"reserved\" means the opposite: quiet, holding back."
  },
  {
    "prompt": "The garden featured several indigenous plants, including wild bergamot, purple coneflower, and black-eyed Susans, all native to the Midwest. [Clue: Example]",
    "options": [
      "Cause/Effect",
      "Definition/Restatement",
      "Contrast",
      "Example"
    ],
    "correct": 3,
    "explanation": "\"Including\" introduces examples of specific native plants, revealing that \"indigenous\" means native to the region."
  },
  {
    "prompt": "Because the evidence was so compelling, even the most skeptical committee members voted to approve the proposal. [Clue: Cause/Effect]",
    "options": [
      "Cause/Effect",
      "Contrast",
      "Definition/Restatement",
      "Example"
    ],
    "correct": 0,
    "explanation": "\"Because...even the most skeptical\" — the evidence caused doubters to agree. Cause/effect reveals \"compelling\" = powerfully convincing."
  },
  {
    "prompt": "The diplomat’s speech struck a conciliatory tone, expressing willingness to compromise and find common ground after months of tense negotiations. [Clue: Definition/Restatement]",
    "options": [
      "Example",
      "Definition/Restatement",
      "Tone/Mood",
      "Contrast"
    ],
    "correct": 1,
    "explanation": "The phrase \"expressing willingness to compromise and find common ground\" directly defines what \"conciliatory\" means."
  },
  {
    "prompt": "The once-thriving downtown had become desolate, with boarded-up storefronts and empty sidewalks stretching for blocks. [Clue: Tone/Mood]",
    "options": [
      "Example",
      "Contrast",
      "Tone/Mood",
      "Definition/Restatement"
    ],
    "correct": 2,
    "explanation": "The imagery (boarded-up, empty) creates a mood of abandonment, revealing that \"desolate\" means deserted and gloomy."
  }
];

const PRED_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "The architect’s design was praised for its ________, combining clean lines with unexpected curves in a way that felt both modern and timeless.",
    "options": [
      "enormity",
      "simplicity",
      "elegance",
      "affordability"
    ],
    "correct": 2,
    "explanation": "The passage describes \"clean lines with unexpected curves\" that feel \"modern and timeless\" — this describes grace and beauty in design. \"Elegance\" captures this perfectly. \"Simplicity\" is close but misses the \"unexpected curves\" element."
  },
  {
    "prompt": "Despite the company’s attempts to ________ the scandal, leaked emails revealed the full extent of executive misconduct.",
    "options": [
      "publicize",
      "exaggerate",
      "investigate",
      "conceal"
    ],
    "correct": 3,
    "explanation": "\"Despite\" signals contrast: the company tried to do X, BUT emails revealed the truth. So X = hide/cover up. \"Conceal\" matches. Your prediction might have been \"hide,\" \"cover up,\" or \"suppress.\""
  },
  {
    "prompt": "The documentary offered a ________ look at factory farming, presenting interviews with workers, environmental scientists, and industry executives to show multiple perspectives.",
    "options": [
      "comprehensive",
      "hostile",
      "brief",
      "biased"
    ],
    "correct": 0,
    "explanation": "Multiple perspectives (workers, scientists, executives) suggest a thorough, wide-ranging examination. \"Comprehensive\" fits. \"Biased\" contradicts \"multiple perspectives.\""
  },
  {
    "prompt": "What began as a minor disagreement between neighbors ________ into a full-scale legal battle that lasted three years and cost both parties their savings.",
    "options": [
      "resolved",
      "fluctuated",
      "escalated",
      "collapsed"
    ],
    "correct": 2,
    "explanation": "Growth from small (minor disagreement) to large (full-scale legal battle). \"Escalated\" means intensified/grew worse. Your prediction might have been \"grew,\" \"expanded,\" or \"spiraled.\""
  },
  {
    "prompt": "The author’s tone throughout the essay is notably ________, avoiding strong claims and instead presenting each argument with qualifications like \"possibly\" and \"to some extent.\"",
    "options": [
      "passionate",
      "dismissive",
      "tentative",
      "assertive"
    ],
    "correct": 2,
    "explanation": "Qualifications like \"possibly\" and \"to some extent\" show cautious, non-committal language. \"Tentative\" means hesitant/uncertain. \"Assertive\" is the opposite."
  },
  {
    "prompt": "The new policy was designed to ________ economic growth in rural communities by offering tax incentives to businesses that opened locations outside major cities.",
    "options": [
      "redistribute",
      "monitor",
      "stimulate",
      "hinder"
    ],
    "correct": 2,
    "explanation": "Tax incentives are meant to encourage/promote growth. \"Stimulate\" means to encourage activity. \"Hinder\" is the opposite. \"Monitor\" means watch, not encourage."
  }
];

const MORPH_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "unprecedented (un- (not) + pre- (before) + -cedent (go))",
    "options": [
      "Extremely important",
      "Happened too quickly",
      "Poorly planned",
      "Never happened before"
    ],
    "correct": 3,
    "explanation": "un- (not) + pre- (before) + cedent (going) = not gone before = never happened before."
  },
  {
    "prompt": "misconception (mis- (wrongly) + concept (idea) + -ion (noun))",
    "options": [
      "A new discovery",
      "A hidden plan",
      "A wrong belief",
      "A brilliant idea"
    ],
    "correct": 2,
    "explanation": "mis- (wrongly) + conception (idea/belief) = a wrongly held belief."
  },
  {
    "prompt": "circumspect (circum- (around) + spect (look))",
    "options": [
      "Looking backwards",
      "Careful and cautious",
      "Moving in circles",
      "Watching from above"
    ],
    "correct": 1,
    "explanation": "circum- (around) + spect (look) = looking around carefully = cautious, considering all angles."
  },
  {
    "prompt": "benevolent (bene- (good/well) + vol (wish) + -ent (adjective))",
    "options": [
      "Well-meaning and kind",
      "Violently opposed",
      "Extremely powerful",
      "Highly intelligent"
    ],
    "correct": 0,
    "explanation": "bene- (good) + volent (wishing) = good-wishing = kindly, generous."
  },
  {
    "prompt": "incredulous (in- (not) + cred (believe) + -ulous (adjective))",
    "options": [
      "Incredibly smart",
      "Secretly doubtful",
      "Unable to believe",
      "Very believable"
    ],
    "correct": 2,
    "explanation": "in- (not) + credulous (believing) = not believing = disbelieving, skeptical."
  },
  {
    "prompt": "retrospective (retro- (back) + spect (look) + -ive (adjective))",
    "options": [
      "Repeated many times",
      "Looking forward",
      "Looking back on the past",
      "Seen from far away"
    ],
    "correct": 2,
    "explanation": "retro- (backward) + spective (looking) = looking backward = reviewing the past."
  }
];

const TONE_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "fervent",
    "options": [
      "Negative",
      "Strongly Positive",
      "Mildly Positive",
      "Neutral"
    ],
    "correct": 1,
    "explanation": "Fervent = intensely passionate or enthusiastic. Very strong positive energy."
  },
  {
    "prompt": "dismissive",
    "options": [
      "Negative",
      "Strongly Positive",
      "Mildly Positive",
      "Neutral"
    ],
    "correct": 0,
    "explanation": "Dismissive = treating something as unworthy of consideration. Negative."
  },
  {
    "prompt": "pragmatic",
    "options": [
      "Strongly Positive",
      "Negative",
      "Mildly Positive",
      "Neutral"
    ],
    "correct": 3,
    "explanation": "Pragmatic = practical, realistic. Neither praise nor criticism — just a style of thinking."
  },
  {
    "prompt": "meticulous",
    "options": [
      "Negative",
      "Strongly Positive",
      "Mildly Positive",
      "Neutral"
    ],
    "correct": 2,
    "explanation": "Meticulous = very careful and precise. Slightly positive — implies thoroughness."
  },
  {
    "prompt": "negligible",
    "options": [
      "Strongly Positive",
      "Negative",
      "Mildly Positive",
      "Neutral"
    ],
    "correct": 3,
    "explanation": "Negligible = so small as to not be worth considering. Neutral — describes size, not quality."
  },
  {
    "prompt": "complacent",
    "options": [
      "Negative",
      "Strongly Positive",
      "Mildly Positive",
      "Neutral"
    ],
    "correct": 0,
    "explanation": "Complacent = smugly satisfied without effort to improve. Negative — implies laziness."
  },
  {
    "prompt": "eloquent",
    "options": [
      "Negative",
      "Strongly Positive",
      "Mildly Positive",
      "Neutral"
    ],
    "correct": 1,
    "explanation": "Eloquent = fluent, persuasive, beautiful in speech or writing. Strong praise."
  },
  {
    "prompt": "ambivalent",
    "options": [
      "Strongly Positive",
      "Negative",
      "Mildly Positive",
      "Neutral"
    ],
    "correct": 3,
    "explanation": "Ambivalent = having mixed feelings. Neutral — describes uncertainty, not a judgment."
  }
];

const TRAPS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "The author's writing style is notably ________, with sentences that stretch across half a page, dense with subordinate clauses and literary allusions.",
    "options": [
      "Tone Mismatch",
      "Secondary Meaning",
      "Sounds Right (wrong meaning)",
      "Close But Not Precise"
    ],
    "correct": 2,
    "explanation": "\"Eloquent\" means beautifully expressed, but the passage describes LENGTH and COMPLEXITY, not beauty. \"Elaborate\" (detailed, intricate) matches the description of long, dense sentences."
  },
  {
    "prompt": "The committee's report was criticized for being ________, presenting only data that supported the proposed policy while ignoring contradictory evidence.",
    "options": [
      "Secondary Meaning",
      "Close But Not Precise",
      "Sounds Right (wrong meaning)",
      "Tone Mismatch"
    ],
    "correct": 1,
    "explanation": "A student might think \"thorough\" because the report presents data. But the passage says it ONLY shows supporting data and IGNORES contradictions. That's not thorough — it's \"selective.\""
  },
  {
    "prompt": "The discovery of a new species in the deep ocean ________ the scientific community, sparking dozens of new research expeditions.",
    "options": [
      "Secondary Meaning",
      "Tone Mismatch",
      "Close But Not Precise",
      "Sounds Right (wrong meaning)"
    ],
    "correct": 0,
    "explanation": "\"Arrested\" can mean \"stopped\" (its secondary meaning) which is the opposite of what happened. The community was ENERGIZED. \"Galvanized\" (shocked into action) fits."
  },
  {
    "prompt": "In her peer-reviewed analysis of migration patterns, Dr. Chen ________ that climate change has become the primary driver of population movement in Southeast Asia.",
    "options": [
      "Secondary Meaning",
      "Sounds Right (wrong meaning)",
      "Tone Mismatch",
      "Close But Not Precise"
    ],
    "correct": 2,
    "explanation": "\"Feels\" conveys the right general idea but is far too informal for a peer-reviewed scientific analysis. Academic writing uses words like \"contends,\" \"asserts,\" or \"argues.\""
  },
  {
    "prompt": "The new regulation was intended to ________ harmful emissions, but critics argued it contained too many loopholes to be effective.",
    "options": [
      "Secondary Meaning",
      "Close But Not Precise",
      "Sounds Right (wrong meaning)",
      "Tone Mismatch"
    ],
    "correct": 1,
    "explanation": "\"Eliminate\" means completely remove. But if the regulation has \"loopholes,\" it was never meant to COMPLETELY stop emissions — just reduce them. \"Curtail\" (to reduce or limit) is more precise."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "rw",
  moduleNum: 2,
  title: "Words in Context",
  subtitle: "Vocabulary in context, context clues, word parts, and tone",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },    { id: "quiz", label: "Practice", icon: "target" },    { id: "complete", label: "Complete", icon: "trophy" },
  ],
  lessons: [
    {
      id: "2a",
      title: "How Words-in-Context Questions Work",
      subtitle:
        "Topic 2A \u2014 Question anatomy, the \u201cPredict Before You Peek\u201d method, and common traps",
      body: [
        "Every Words in Context question follows the same pattern: a short passage (25\u2013100 words) with one word or phrase replaced by a blank. Four answer choices offer vocabulary words. Your job is to find the one that fits the meaning AND tone of the passage.",
        "Step 1: Read the full passage carefully \u2014 don\u2019t skip to the blank.\nStep 2: Cover the answer choices. Predict your own word for the blank.\nStep 3: Uncover the choices. Match your prediction to the closest option.\nStep 4: Plug your choice back in. Does it fit the meaning AND the tone?",
        "Why \u201cPredict Before You Peek\u201d works: If you look at the answer choices first, trap answers can hijack your thinking. A word that sounds smart or looks familiar can pull you away from the actual meaning of the passage. Predicting first keeps you anchored to the text.",
        "Common Traps:\n\u2022 The \u201csounds right\u201d trap: A word that feels familiar but doesn\u2019t match the specific meaning.\n\u2022 The \u201cclose but not precise\u201d trap: Two choices may be similar, but one is more precise.\n\u2022 The secondary meaning trap: Common words used in uncommon ways. \u201cArrest\u201d can mean \u201cstop\u201d (not just \u201cdetain\u201d).\n\u2022 The tone mismatch trap: The right meaning but wrong register.",
      ],
      visual: "predict-method",
    },
    {
      id: "2b",
      title: "Context Clue Types",
      subtitle:
        "Topic 2B \u2014 Definition, contrast, example, cause/effect, and inference clues",
      body: [
        "Passages always contain clues that point to the answer. Learning to spot these clue types makes you faster and more accurate.",
        "Definition/Restatement: The passage directly defines the word. Signal: \u201cor,\u201d \u201cthat is,\u201d dashes, commas.\nContrast/Antonym: The passage gives the opposite. Signal: \u201cbut,\u201d \u201chowever,\u201d \u201cunlike,\u201d \u201crather than.\u201d\nExample: Specific instances illustrate the word. Signal: \u201csuch as,\u201d \u201cfor instance,\u201d \u201cincluding.\u201d\nCause/Effect: The result or reason reveals the meaning. Signal: \u201cbecause,\u201d \u201csince,\u201d \u201ctherefore.\u201d\nInference: No direct signal \u2014 you infer from the overall passage meaning and tone.",
        "Each clue type gives you a different angle into the word\u2019s meaning. On test day, quickly identifying the clue type tells you exactly where to look in the passage for your answer.",
      ],
      visual: "clue-types",
    },
    {
      id: "2c",
      title: "Tier 2 Academic Vocabulary",
      subtitle:
        "Topic 2C \u2014 The high-utility words that appear across subjects and on the test",
      body: [
        "What Are Tier 2 Words?\n\u2022 Tier 1: Basic everyday words (run, happy, big) \u2014 you already know these.\n\u2022 Tier 2: Academic words used across subjects (analyze, significant, undermine, advocate) \u2014 these are what the PSAT tests.\n\u2022 Tier 3: Domain-specific technical words (photosynthesis, isosceles) \u2014 rarely tested in vocabulary questions.",
        "Research shows you need 12\u201314 encounters with a word in varied contexts before you truly own it. That\u2019s why simply memorizing definitions doesn\u2019t work \u2014 you need to see words in action.",
        "Strategy: Keep a vocabulary journal. For each new word, write: the word, its definition, the sentence you found it in, and your own example sentence. Review weekly.",
        "High-Frequency PSAT Vocabulary Clusters:\n\u2022 Support/Strengthen: bolster, corroborate, substantiate, reinforce, validate, buttress\n\u2022 Weaken/Challenge: undermine, refute, contradict, discredit, subvert, erode\n\u2022 Careful/Cautious: prudent, circumspect, judicious, measured, deliberate, tentative\n\u2022 Enthusiastic/Positive: fervent, ardent, zealous, exuberant, unreserved, wholehearted\n\u2022 Complex/Nuanced: multifaceted, intricate, nuanced, elaborate, sophisticated\n\u2022 Clear/Direct: explicit, unambiguous, forthright, candid, transparent, overt",
      ],
      visual: "vocab-clusters",
    },
    {
      id: "2d",
      title: "Word Parts: Roots, Prefixes & Suffixes",
      subtitle:
        "Topic 2D \u2014 Decode unfamiliar words by breaking them into known pieces",
      body: [
        "When you encounter an unfamiliar word, you can often figure out its meaning by analyzing its parts. This is your backup strategy when context clues alone aren\u2019t enough.",
        "Key Prefixes:\n\u2022 un-, in-, im-, dis- = not, opposite (unprecedented, ineffective, impractical, disregard)\n\u2022 re- = again, back (reconsider, reaffirm, revitalize)\n\u2022 pre- = before (predominant, preclude, preeminent)\n\u2022 mis- = wrongly (misconception, misattribute, misconstrue)\n\u2022 over- = excessive (overstate, oversimplify, overestimate)\n\u2022 under- = beneath, too little (undermine, underestimate, underrepresented)",
        "Key Roots:\n\u2022 cred = believe (credible, incredible, discredit)\n\u2022 dict = say, speak (contradict, predict, dictate)\n\u2022 spec/spect = look, see (perspective, retrospect, spectacle)\n\u2022 vert/vers = turn (controversial, divert, reverse)\n\u2022 voc/vok = call, voice (advocate, provoke, evocative)\n\u2022 bene/mal = good/bad (benevolent, malicious, malfunction)",
        "Combining clues: Use context clues AND word parts together. If the context suggests something negative and the word starts with \u201cmis-\u201d or \u201cdis-,\u201d you can be doubly confident in your interpretation.",
      ],
      visual: "morph-table",
    },
  ],
  quiz: [
    {
      passage:
        "The chef\u2019s new restaurant was an immediate success, with food critics praising the ________ flavors that combined traditional Japanese techniques with bold Latin American ingredients.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["subtle", "innovative", "familiar", "conventional"],
      correct: 1,
      explanation:
        'Combining two different culinary traditions (Japanese + Latin American) describes something NEW and creative. "Innovative" means introducing new ideas. "Conventional" and "familiar" are the opposite. "Subtle" contradicts "bold."',
      domain: "Standard English Conventions",
      skill: "punctuation_boundaries",
    },
    {
      passage:
        "The historical records from this period are remarkably ________, providing detailed accounts of daily life, trade agreements, and even weather patterns.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["comprehensive", "controversial", "biased", "sparse"],
      correct: 0,
      explanation:
        '"Detailed accounts" of multiple topics (daily life, trade, weather) = thorough and wide-ranging. "Comprehensive" means covering all aspects. "Sparse" means scarce (opposite).',
      domain: "Standard English Conventions",
      skill: "punctuation_boundaries",
    },
    {
      passage:
        "Although the two candidates held sharply different positions on economic policy, they found ________ ground on environmental issues, agreeing to support the new conservation bill.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["contentious", "disputed", "common", "unfamiliar"],
      correct: 2,
      explanation:
        '"Although...sharply different" sets up contrast with "agreeing to support." They found SHARED agreement. "Common ground" = shared beliefs.',
      domain: "Standard English Conventions",
      skill: "punctuation_boundaries",
    },
    {
      passage:
        "The novelist\u2019s latest work has been praised for its ________ portrayal of immigrant experiences, drawing on interviews with over two hundred families to ensure authenticity.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["fictional", "exaggerated", "nuanced", "superficial"],
      correct: 2,
      explanation:
        '200+ family interviews to "ensure authenticity" suggest a detailed, careful, multi-perspective portrayal. "Nuanced" means showing subtle distinctions and complexity.',
      difficulty: "medium",
      domain: "Standard English Conventions",
      skill: "punctuation_boundaries",
    },
    {
      passage:
        "The researcher\u2019s hypothesis, once considered ________ by the broader scientific community, has gained support as new experimental evidence has accumulated over the past decade.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["established", "dubious", "groundbreaking", "irrelevant"],
      correct: 1,
      explanation:
        '"Once considered X...has gained support" = it was previously viewed negatively but is now accepted. "Dubious" (doubtful, questionable) fits.',
      difficulty: "medium",
      domain: "Standard English Conventions",
      skill: "punctuation_boundaries",
    },
    {
      passage:
        "The city\u2019s decision to invest in public transportation was motivated by a desire to ________ traffic congestion, which had increased commute times by an average of 40% over five years.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["document", "exacerbate", "perpetuate", "alleviate"],
      correct: 3,
      explanation:
        'The city wants to FIX the congestion problem. "Alleviate" means to make less severe. "Perpetuate" and "exacerbate" are the opposite goal.',
      difficulty: "medium",
      domain: "Standard English Conventions",
      skill: "punctuation_boundaries",
    },
    {
      passage:
        "While some critics dismissed the painter\u2019s abstract style as chaotic, others argued that her compositions demonstrated remarkable ________, with every brushstroke serving a deliberate purpose.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["intentionality", "simplicity", "randomness", "spontaneity"],
      correct: 0,
      explanation:
        '"Every brushstroke serving a deliberate purpose" = nothing is accidental. "Intentionality" means purposeful design. "Randomness" matches the critics\' negative view.',
      difficulty: "medium",
      domain: "Standard English Conventions",
      skill: "punctuation_boundaries",
    },
    {
      passage:
        "The anthropologist cautioned against interpreting ancient burial practices through a modern lens, arguing that such ________ analysis risks projecting contemporary values onto cultures with fundamentally different belief systems.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["comprehensive", "indigenous", "anachronistic", "empirical"],
      correct: 2,
      explanation:
        '"Modern lens" applied to "ancient" practices = time-period mismatch. "Anachronistic" means belonging to a different time period.',
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "punctuation_boundaries",
    },
    {
      passage:
        "The diplomat\u2019s reputation for ________ negotiations \u2014 finding acceptable compromises even between parties with deeply entrenched positions \u2014 made her the natural choice to mediate the territorial dispute.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["protracted", "perfunctory", "adroit", "contentious"],
      correct: 2,
      explanation:
        '"Finding acceptable compromises" between difficult parties = skilled, clever negotiation. "Adroit" means clever and skillful.',
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "punctuation_boundaries",
    },
    {
      passage:
        "The study\u2019s authors acknowledged that their findings, while suggestive, remained ________, noting that a larger sample size and longer observation period would be needed to draw definitive conclusions.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["redundant", "conclusive", "preliminary", "comprehensive"],
      correct: 2,
      explanation:
        '"While suggestive" + needing "larger sample" and "longer observation" for "definitive conclusions" = the findings are early/initial. "Preliminary" means early-stage, not yet final.',
      difficulty: "hard",
      domain: "Standard English Conventions",
      skill: "punctuation_boundaries",
    },
  ],
  takeaways: [
    "Words in Context is ~20% of the PSAT 8/9 R&W \u2014 the single most common question type.",
    "\"Predict Before You Peek\" is the #1 strategy: read the passage, cover choices, predict your own word, then match.",
    "Look for five context clue types: definition, contrast, example, cause/effect, and inference.",
    "The PSAT tests Tier 2 academic vocabulary \u2014 words used across subjects, not technical jargon.",
    "Learn words in concept clusters (strengthen, weaken, cautious, enthusiastic) so you can quickly match answers to meaning.",
    "Use word parts (roots, prefixes, suffixes) as a backup when context clues aren\u2019t enough.",
    "Watch for traps: \u201csounds right\u201d but wrong meaning, close-but-not-precise, secondary meanings, tone mismatches.",
    "You need 12\u201314 encounters with a word before you own it. Keep a vocabulary journal and review weekly.",
  ],
};
