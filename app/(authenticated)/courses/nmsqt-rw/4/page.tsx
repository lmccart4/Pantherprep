"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { SorterExercise, type SorterItem } from "@/components/course/activities/sorter-exercise";
import {
  MorphologyVisual,
  ConnotationVisual,
  PredictionVisual,
  SecondaryMeaningsVisual,
} from "./lesson-visuals";

const MORPH_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Word parts: prefix: in-, root: cred, suffix: -ible\nMeaning: impossible to believe",
    "options": [
      "-tion",
      "dict",
      "incredible",
      "un-"
    ],
    "correct": 2,
    "explanation": "The target word is \"incredible\" (prefix: in-, root: cred, suffix: -ible → impossible to believe)"
  },
  {
    "prompt": "Word parts: prefix: mal-, root: vol, suffix: -ent\nMeaning: wishing evil or harm to others",
    "options": [
      "-ous",
      "malevolent",
      "bene-",
      "spec"
    ],
    "correct": 1,
    "explanation": "The target word is \"malevolent\" (prefix: mal-, root: vol, suffix: -ent → wishing evil or harm to others)"
  },
  {
    "prompt": "Word parts: prefix: contra-, root: dict\nMeaning: to speak against; to deny the truth of",
    "options": [
      "contradict",
      "pre-",
      "scrib",
      "-ment"
    ],
    "correct": 0,
    "explanation": "The target word is \"contradict\" (prefix: contra-, root: dict → to speak against; to deny the truth of)"
  },
  {
    "prompt": "Word parts: prefix: circum-, root: spec, suffix: -t\nMeaning: careful to consider all circumstances; cautious",
    "options": [
      "intro-",
      "circumspect",
      "-ive",
      "duc"
    ],
    "correct": 1,
    "explanation": "The target word is \"circumspect\" (prefix: circum-, root: spec, suffix: -t → careful to consider all circumstances; cautious)"
  },
  {
    "prompt": "Word parts: prefix: re-, root: voc, suffix: -ation\nMeaning: the act of calling back or canceling",
    "options": [
      "de-",
      "-ment",
      "revocation",
      "mit"
    ],
    "correct": 2,
    "explanation": "The target word is \"revocation\" (prefix: re-, root: voc, suffix: -ation → the act of calling back or canceling)"
  },
  {
    "prompt": "Word parts: prefix: trans-, root: script, suffix: -ion\nMeaning: the process of writing across/copying",
    "options": [
      "sub-",
      "vert",
      "transcription",
      "-ible"
    ],
    "correct": 2,
    "explanation": "The target word is \"transcription\" (prefix: trans-, root: script, suffix: -ion → the process of writing across/copying)"
  }
];

const SPECTRA_EXERCISE: SorterItem[] = [
  {
    "text": "thrifty",
    "correct": "Describing someone careful with money"
  },
  {
    "text": "economical",
    "correct": "Describing someone careful with money"
  },
  {
    "text": "frugal",
    "correct": "Describing someone careful with money"
  },
  {
    "text": "cheap",
    "correct": "Describing someone careful with money"
  },
  {
    "text": "miserly",
    "correct": "Describing someone careful with money"
  },
  {
    "text": "slender",
    "correct": "Describing a thin person"
  },
  {
    "text": "lean",
    "correct": "Describing a thin person"
  },
  {
    "text": "skinny",
    "correct": "Describing a thin person"
  },
  {
    "text": "scrawny",
    "correct": "Describing a thin person"
  },
  {
    "text": "gaunt",
    "correct": "Describing a thin person"
  },
  {
    "text": "forthright",
    "correct": "Describing someone who speaks their mind"
  },
  {
    "text": "candid",
    "correct": "Describing someone who speaks their mind"
  },
  {
    "text": "blunt",
    "correct": "Describing someone who speaks their mind"
  },
  {
    "text": "tactless",
    "correct": "Describing someone who speaks their mind"
  },
  {
    "text": "abrasive",
    "correct": "Describing someone who speaks their mind"
  },
  {
    "text": "vintage",
    "correct": "Describing an old object"
  },
  {
    "text": "classic",
    "correct": "Describing an old object"
  },
  {
    "text": "dated",
    "correct": "Describing an old object"
  },
  {
    "text": "antiquated",
    "correct": "Describing an old object"
  },
  {
    "text": "obsolete",
    "correct": "Describing an old object"
  }
];

const PREDICT_EXERCISE: MatchingItem[] = [
  {
    "prompt": "The architect's design for the new library was anything but conventional. Where most public buildings favor symmetry and uniformity, her plan _______ traditional layouts in favor of irregular, organic forms inspired by natural landscapes.",
    "options": [
      "modified",
      "accepted",
      "celebrated",
      "rejected"
    ],
    "correct": 3,
    "explanation": ""
  },
  {
    "prompt": "Despite decades of research, the origins of the mysterious Nazca Lines in Peru remain _______ . No single theory has been universally accepted by archaeologists.",
    "options": [
      "obvious",
      "controversial",
      "elusive",
      "irrelevant"
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "The new evidence did not merely support the researcher's hypothesis — it _______ the case for her theory, leaving even her harshest critics unable to find flaws in her reasoning.",
    "options": [
      "undermined",
      "reiterated",
      "bolstered",
      "complicated"
    ],
    "correct": 0,
    "explanation": ""
  },
  {
    "prompt": "While the CEO publicly praised the merger, internal documents revealed that she had privately _______ concerns about the deal's long-term financial viability.",
    "options": [
      "dismissed",
      "echoed",
      "voiced",
      "concealed"
    ],
    "correct": 0,
    "explanation": ""
  },
  {
    "prompt": "The novelist's prose style, once celebrated for its _______ and clarity, had grown increasingly dense and self-indulgent in her later works.",
    "options": [
      "complexity",
      "verbosity",
      "elegance",
      "ambiguity"
    ],
    "correct": 2,
    "explanation": ""
  },
  {
    "prompt": "Conservationists warn that the proposed dam would _______ the river ecosystem, disrupting spawning routes for salmon and flooding habitats that support dozens of endangered species.",
    "options": [
      "devastate",
      "monitor",
      "relocate",
      "preserve"
    ],
    "correct": 0,
    "explanation": ""
  }
];

export default function NMSQTRWModule4() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "morphology": <MorphologyVisual />,
        "connotation": <ConnotationVisual />,
        "prediction": <PredictionVisual />,
        "secondary-meanings": <SecondaryMeaningsVisual />,
      }}
      activities={{
        "exercise-morph": (goNext: () => void) => (
          <MatchingExercise
            items={MORPH_EXERCISE}
            title="Morph"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-spectra": (goNext: () => void) => (
          <SorterExercise
            items={SPECTRA_EXERCISE}
            buckets={["Describing someone careful with money","Describing a thin person","Describing someone who speaks their mind","Describing an old object"]}
            title="Spectra"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-predict": (goNext: () => void) => (
          <MatchingExercise
            items={PREDICT_EXERCISE}
            title="Predict"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/nmsqt-rw/5"
      nextModuleLabel="Module 5: What's the Point?"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "rw",
  moduleNum: 4,
  title: "Words Are Weapons",
  subtitle:
    "Words in Context \u2014 Vocabulary Through Morphology and Precision",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-morph", label: "Morph", icon: "zap" },
    { id: "exercise-spectra", label: "Spectra", icon: "zap" },
    { id: "exercise-predict", label: "Predict", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "star" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      stem: "The diversity of marine species found in coral reef ecosystems _______ scientists, who continue to discover new organisms each year.",
      choices: ["astonish", "are astonishing", "have astonished", "astonishes"],
      correct: 3,
      explanation: "Subject = \"diversity\" (singular). \"Species\" and \"ecosystems\" are in prepositional phrases — cross them out.",
    },
    {
      stem: "The poet's early work reflected the optimism of the postwar _______ her later poems adopted a markedly darker tone.",
      choices: ["era, her", "era, and her", "era; her", "era her"],
      correct: 2,
      explanation: "Two independent clauses — semicolon correctly joins them. (A) = comma splice. (C) = run-on.",
    },
    {
      stem: "_______ the research team identified several compounds that could potentially slow the progression of the disease.",
      choices: ["Analyzing, thousands of molecular structures by", "Analyzing thousands of molecular structures,", "Thousands of molecular structures analyzed,", "Having been analyzed for molecular structures,"],
      correct: 1,
      explanation: "The research team is doing the analyzing — the modifier must touch \"the research team.\"",
    },
    {
      stem: "By the time the rescue team arrived at the remote village, the floodwaters _______ most of the bridges connecting the settlement to the main road.",
      choices: ["will have destroyed", "had already destroyed", "have destroyed", "destroyed"],
      correct: 1,
      explanation: "Destruction happened BEFORE arrival — past perfect \"had destroyed\" for the earlier of two past events.",
    },
    {
      stem: "The company's sustainability report highlighted three key achievements: reducing carbon emissions by 30%, _______ and eliminating single-use plastics from all offices.",
      choices: ["the implementation of renewable energy sources,", "to implement renewable energy sources,", "renewable energy sources were implemented,", "implementing renewable energy sources,"],
      correct: 3,
      explanation: "Gerund series: \"reducing…, implementing…, eliminating…\" All must match.",
    },
    {
      stem: "Although the initial trials were _______ the pharmaceutical company decided to invest an additional $200 million in the drug's development.",
      choices: ["disappointing. The", "disappointing the", "disappointing, the", "disappointing; the"],
      correct: 2,
      explanation: "DC (\"Although…disappointing\") + IC → comma separates them. Semicolons/periods create fragments from the DC.",
    },
  ],

  lessons: [
    {
      id: "morphology",
      title: "Morphology: Decode Unknown Words",
      subtitle: "Roots, prefixes, and suffixes",
      visual: "morphology",
      body: [
        "Latin and Greek roots let you decode unfamiliar words. Learn the most common roots (cred = believe, dict = say, spec = look, duc = lead) and you can break down words you have never seen before.",
      ],
    },
    {
      id: "connotation",
      title: "Connotation: Shades of Meaning",
      subtitle: "Near-synonyms carry different weight",
      visual: "connotation",
      body: [
        "Words that mean nearly the same thing carry different emotional weight. 'Thrifty' is positive; 'cheap' is negative. The PSAT tests whether you can pick the word with the right shade of meaning for the context.",
      ],
    },
    {
      id: "prediction",
      title: "The Prediction Method",
      subtitle: "Cover the choices, predict first",
      visual: "prediction",
      body: [
        "Before looking at answer choices: read the passage, identify context clues (contrast signals, tone, cause-effect), and predict what word should fill the blank. Then find the closest match.",
      ],
    },
    {
      id: "secondary-meanings",
      title: "Secondary Meanings",
      subtitle: "The hardest vocabulary trap",
      visual: "secondary-meanings",
      body: [
        "The hardest Words in Context questions test secondary meanings -- common words used in uncommon ways. 'Bear' meaning 'carried,' 'exercise' meaning 'expressed,' 'harbor' meaning 'held secretly.'",
      ],
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      passage: "The documentary filmmaker spent years earning the trust of the reclusive community. Her patient approach ultimately _______ the residents' willingness to share their stories on camera.",
      stem: "Which choice completes the text?",
      choices: ["ignored", "prevented", "secured", "demanded"],
      correct: 2,
      explanation: "\"Patient approach\" + \"trust\" + \"willingness to share\" = positive outcome. \"Secured\" means successfully obtained.",
      difficulty: "easy",
    },
    {
      passage: "Although the critic's review of the novel was largely _______ she acknowledged that the author's prose style had improved significantly since his first book.",
      stem: "Which choice completes the text?",
      choices: ["unfavorable", "comprehensive", "favorable", "ambiguous"],
      correct: 0,
      explanation: "\"Although…[blank], she acknowledged [positive thing]\" — \"although\" signals contrast. The review was mostly negative, BUT she noted improvement.",
      difficulty: "easy",
    },
    {
      passage: "The botanist's discovery of a high-altitude plant species that _______ in temperatures below negative 40 degrees challenged existing assumptions about the limits of photosynthesis.",
      stem: "Which choice completes the text?",
      choices: ["appeared", "fluctuated", "thrived", "perished"],
      correct: 2,
      explanation: "The discovery \"challenged assumptions about limits\" — the plant succeeds where it shouldn't. \"Thrived\" = flourished.",
      difficulty: "easy",
    },
    {
      passage: "The senator's speech was designed to _______ concerns about the new trade agreement. Rather than dismissing critics outright, she addressed each objection with specific data and projections.",
      stem: "Which choice completes the text?",
      choices: ["ignore", "fabricate", "amplify", "alleviate"],
      correct: 3,
      explanation: "She \"addressed each objection\" with data — she's reducing worry. \"Alleviate\" = relieve or lessen.",
      difficulty: "easy",
    },
    {
      passage: "The invasive vine species spread with alarming speed through the forest, _______ native plants of the sunlight and nutrients they needed to survive.",
      stem: "Which choice completes the text?",
      choices: ["providing", "reminding", "depriving", "accusing"],
      correct: 2,
      explanation: "The vine blocks sunlight and nutrients — it takes away what they need. \"Depriving\" = taking away from.",
      difficulty: "medium",
    },
    {
      passage: "Literary scholars note that the author's early novels were markedly _______ , featuring simple plots, familiar settings, and predictable character arcs that appealed to a broad readership.",
      stem: "Which choice completes the text?",
      choices: ["accessible", "controversial", "unconventional", "obscure"],
      correct: 0,
      explanation: "\"Simple plots, familiar settings, broad readership\" signal ease of understanding. \"Accessible\" = easy to understand.",
      difficulty: "medium",
    },
    {
      passage: "The negotiations between the two nations had reached an _______ with neither side willing to compromise on the territorial dispute that had sparked the conflict.",
      stem: "Which choice completes the text?",
      choices: ["acceleration", "evolution", "impasse", "agreement"],
      correct: 2,
      explanation: "\"Neither side willing to compromise\" = deadlock. \"Impasse\" = a situation with no progress possible.",
      difficulty: "medium",
    },
    {
      passage: "The choreographer's new piece _______ elements of traditional ballet with contemporary street dance, creating a hybrid form that surprised audiences and critics alike.",
      stem: "Which choice completes the text?",
      choices: ["showcased", "fused", "separated", "eliminated"],
      correct: 1,
      explanation: "\"Hybrid form\" combining \"traditional ballet with contemporary street dance\" = blending. \"Fused\" = joined together.",
      difficulty: "medium",
    },
    {
      passage: "The researcher's findings were so _______ that several established journals initially refused to publish them, fearing the conclusions would prove difficult to replicate.",
      stem: "Which choice completes the text?",
      choices: ["mundane", "provocative", "predictable", "conventional"],
      correct: 1,
      explanation: "Journals \"refused to publish\" because conclusions \"would prove difficult to replicate\" — startling. \"Provocative\" = stimulating controversy.",
      difficulty: "medium",
    },
    {
      passage: "The sculptor's work reveals a deep _______ for the natural world; every piece incorporates organic forms drawn from her observations of local wildlife.",
      stem: "Which choice completes the text?",
      choices: ["indifference", "reverence", "disdain", "curiosity"],
      correct: 1,
      explanation: "\"Every piece incorporates organic forms from observations of wildlife\" — deep admiration. \"Reverence\" = deep respect.",
      difficulty: "hard",
    },
    {
      passage: "The app's early success was _______ — within six months, user engagement had dropped by 70%, and the company was forced to redesign its entire interface.",
      stem: "Which choice completes the text?",
      choices: ["enduring", "remarkable", "sustained", "fleeting"],
      correct: 3,
      explanation: "Success followed by 70% drop within six months = short-lived. \"Fleeting\" = lasting only a short time.",
      difficulty: "hard",
    },
    {
      passage: "The historian argues that the treaty, far from establishing lasting peace, merely _______ the underlying tensions that would eventually erupt into a full-scale conflict.",
      stem: "Which choice completes the text?",
      choices: ["exacerbated", "celebrated", "masked", "resolved"],
      correct: 2,
      explanation: "\"Far from establishing peace\" + tensions \"would eventually erupt\" = the treaty hid but didn't fix the problems. \"Masked\" = concealed.",
      difficulty: "hard",
    },
    {
      passage: "The committee's decision to _______ funding for the arts program was met with immediate protest from educators, who argued that creative disciplines are essential to well-rounded education.",
      stem: "Which choice completes the text?",
      choices: ["revoke", "publicize", "increase", "maintain"],
      correct: 0,
      explanation: "Educators \"protested\" and argued arts are \"essential\" — funding was taken away. \"Revoke\" = officially cancel or withdraw.",
      difficulty: "hard",
    },
    {
      passage: "The geologist described the canyon formation as a testament to the _______ power of water, noting that a small stream had carved through 200 meters of solid limestone over millions of years.",
      stem: "Which choice completes the text?",
      choices: ["diminished", "negligible", "persistent", "instantaneous"],
      correct: 2,
      explanation: "A small stream carving 200m over millions of years = steady, ongoing force. \"Persistent\" = continuing firmly over a long period.",
      difficulty: "hard",
    },
  ],

  /* ──────── CHALLENGE ──────── */
  challenge: [
    {
      passage: "The scientist's research _______ a wide range of disciplines, from molecular biology to behavioral psychology, making her uniquely qualified to lead the interdisciplinary initiative.",
      stem: "Which choice completes the text?",
      choices: ["entertained", "commanded", "spanned", "observed"],
      correct: 2,
      explanation: "\"Wide range of disciplines\" = her research covered/extended across many fields. \"Spanned\" = extended across.",
    },
    {
      passage: "Critics argued that the new regulation would _______ innovation by imposing burdensome reporting requirements on small technology startups.",
      stem: "Which choice completes the text?",
      choices: ["stifle", "harbor", "strike", "channel"],
      correct: 0,
      explanation: "\"Burdensome requirements\" on startups = suppressing innovation. \"Stifle\" = suppress or restrain.",
    },
    {
      passage: "The CEO's resignation letter _______ no mention of the accounting scandal that had dominated headlines for weeks, focusing instead on her personal desire to spend more time with family.",
      stem: "Which choice completes the text?",
      choices: ["bore", "made", "struck", "took"],
      correct: 0,
      explanation: "\"Bore no mention\" = contained/carried no mention. \"Bore\" (past of \"bear\") = carried/contained — a secondary meaning.",
    },
    {
      passage: "The young diplomat showed a remarkable ability to _______ the competing interests of the five nations at the negotiating table.",
      stem: "Which choice completes the text?",
      choices: ["harbor", "reconcile", "channel", "strike"],
      correct: 1,
      explanation: "\"Competing interests\" at negotiations = bringing opposing sides into agreement. \"Reconcile\" = make compatible.",
    },
    {
      passage: "The museum's new exhibition _______ the evolution of photography from daguerreotypes to digital imaging, spanning nearly two centuries of technological change.",
      stem: "Which choice completes the text?",
      choices: ["exercised", "commanded", "arrested", "charted"],
      correct: 3,
      explanation: "\"Evolution…spanning two centuries\" = mapped out the progression. \"Charted\" = mapped or documented systematically.",
    },
    {
      passage: "Local activists have long _______ concerns about the factory's impact on air quality, but state regulators have consistently dismissed their complaints as unfounded.",
      stem: "Which choice completes the text?",
      choices: ["harbored", "channeled", "exercised", "struck"],
      correct: 2,
      explanation: "\"Exercised\" in the sense of \"exercised their right to raise concerns\" = expressed or put into action. \"Harbored\" = secretly held (contradicts their vocal activism).",
    },
    {
      passage: "The attorney's cross-examination was designed to _______ the credibility of the prosecution's key witness by revealing inconsistencies in her previous statements.",
      stem: "Which choice completes the text?",
      choices: ["undermine", "command", "harbor", "channel"],
      correct: 0,
      explanation: "\"Revealing inconsistencies\" to damage credibility. \"Undermine\" = weaken or damage from beneath.",
    },
    {
      passage: "The novel's protagonist _______ a deep resentment toward the aristocratic class, a bitterness that drives much of the plot's central conflict.",
      stem: "Which choice completes the text?",
      choices: ["charted", "channeled", "harbored", "struck"],
      correct: 2,
      explanation: "\"Deep resentment\" held internally. \"Harbored\" = kept/held (an emotion) inside — secondary meaning of \"harbor.\"",
    },
    {
      passage: "The researcher's tone throughout the paper was deliberately _______ , presenting findings without any indication of personal opinion or emotional investment.",
      stem: "Which choice completes the text?",
      choices: ["objective", "impartial", "detached", "dispassionate"],
      correct: 3,
      explanation: "\"Dispassionate\" specifically emphasizes ABSENCE OF EMOTION (\"without emotional investment\"). \"Objective\" = fact-based. \"Impartial\" = fair/unbiased. \"Detached\" = removed (could suggest disinterest, slightly negative).",
    },
    {
      passage: "The ancient temple's walls bore _______ carvings that depicted scenes from the empire's founding mythology, each figure rendered in extraordinary detail.",
      stem: "Which choice completes the text?",
      choices: ["intricate", "elaborate", "complex", "ornate"],
      correct: 0,
      explanation: "\"Intricate\" specifically means having many fine, carefully arranged details — matching \"extraordinary detail.\" \"Elaborate\" = detailed and complicated (broader). \"Ornate\" = highly decorated. \"Complex\" = structural.",
    },
    {
      passage: "The candidate's speech was carefully _______ to avoid alienating either progressive or conservative members of her party while still communicating a clear policy agenda.",
      stem: "Which choice completes the text?",
      choices: ["composed", "crafted", "calibrated", "constructed"],
      correct: 2,
      explanation: "\"Calibrated\" implies careful ADJUSTMENT to achieve specific balance — matching the need to balance two factions. \"Crafted\" = skillfully made (general).",
    },
    {
      passage: "The playwright's dialogue captures the _______ rhythms of everyday speech — the half-finished sentences, the interruptions, the pauses that convey more than words ever could.",
      stem: "Which choice completes the text?",
      choices: ["natural", "genuine", "organic", "authentic"],
      correct: 1,
      explanation: "\"Genuine\" captures sincerity and unaffected quality of real speech patterns — emphasizes truthfulness to human experience rather than just accuracy.",
    },
  ],

  takeaways: [
    "Always predict a word before looking at answer choices -- the prediction method prevents trap answers from luring you.",
    "Context clues are your best weapon: contrast signals (although, however), positive/negative tone, and cause-effect relationships narrow the field.",
    "Morphology (roots, prefixes, suffixes) lets you decode unfamiliar words -- learn the most common Latin and Greek roots.",
    "Connotation matters: near-synonyms carry different emotional weight. The PSAT tests whether you can pick the word with the right shade of meaning.",
    "Secondary meanings are the hardest trap -- common words used in uncommon ways (e.g., 'bore' meaning 'carried,' 'exercised' meaning 'expressed').",
    "Add every missed word to a vocabulary journal with context, morphology, and connotation notes.",
  ],
};
