"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  StatsVisual,
  PurposeTypesVisual,
  SentenceRolesVisual,
  CrossTextVisual,
} from "./lesson-visuals";

/* ═══════════════════════════════════════════════════════
 * MODULE 7 — Text Structure, Purpose & Cross-Text
 * Analyzing author's purpose, sentence function, and
 * paired-passage relationships
 * ═══════════════════════════════════════════════════════ */

export default function SATRWModule7() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "stats": <StatsVisual />,
        "purpose-types": <PurposeTypesVisual />,
        "sentence-roles": <SentenceRolesVisual />,
        "cross-text": <CrossTextVisual />,
      }}
      nextModuleHref="/courses/sat-rw/8"
      nextModuleLabel="Module 8: Craft & Structure Boss Battle"
      activities={{
        "exercise-warmup-items": (goNext: () => void) => (
          <MatchingExercise
            items={WARMUP_ITEMS_EXERCISE_DATA}
            title="Warmup"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-purpose-items": (goNext: () => void) => (
          <MatchingExercise
            items={PURPOSE_ITEMS_EXERCISE_DATA}
            title="Purpose"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-crosstext-items": (goNext: () => void) => (
          <MatchingExercise
            items={CROSSTEXT_ITEMS_EXERCISE_DATA}
            title="Crosstext"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-challenge-items": (goNext: () => void) => (
          <MatchingExercise
            items={CHALLENGE_ITEMS_EXERCISE_DATA}
            title="Challenge"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
      }}
    />
  );
}

const WARMUP_ITEMS_EXERCISE_DATA: MatchingItem[] = [
  {
    prompt: "The researcher's tone throughout the article was notably _______ , presenting each finding with careful qualifications and acknowledging the limitations of the study at every turn.",
    options: [
      "dismissive",
      "circumspect",
      "effusive",
      "indifferent"
    ],
    correct: 0,
    explanation: `\u201CCareful qualifications\u201D and \u201Cacknowledging limitations\u201D = cautious and thoughtful. \u201CCircumspect\u201D = wary, careful.`
  },
  {
    prompt: "The volcanic eruption devastated the island's agriculture. _______ the local fishing industry, which depended on clear coastal waters, was equally affected by the ash runoff.",
    options: [
      "Nevertheless,",
      "Moreover,",
      "In contrast,",
      "For example,"
    ],
    correct: 0,
    explanation: `Agriculture devastated + fishing also affected = adding another negative effect. \u201CMoreover\u201D = in addition.`
  },
  {
    prompt: "The council decided that neither the proposed highway expansion nor the alternative transit _______ sufficient to address the region's growing transportation needs.",
    options: [
      "plan were",
      "plan was",
      "plan, were",
      "plan; was"
    ],
    correct: 0,
    explanation: `\u201CNeither\u2026nor\u201D \u2014 verb agrees with nearer subject \u201Cplan\u201D (singular) = \u201Cwas.\u201D`
  },
  {
    prompt: "The architect's latest building was widely praised for its _______ \u2014 a seamless integration of glass, steel, and reclaimed wood that felt simultaneously modern and organic.",
    options: [
      "uniformity",
      "austerity",
      "eclecticism",
      "coherence"
    ],
    correct: 0,
    explanation: `\u201CSeamless integration\u201D of different materials that feels unified = \u201Ccoherence\u201D (logical, consistent whole).`
  },
  {
    prompt: "Dr. Patel's initial hypothesis predicted that increased screen time would correlate with decreased attention spans. Her longitudinal data, _______ revealed a more complex relationship that depended heavily on the type of content consumed.",
    options: [
      "however,",
      "however",
      "however;",
      "however."
    ],
    correct: 0,
    explanation: `Interrupting transition needs commas on both sides: \u201Cdata, however, revealed.\u201D (A) provides the comma after \u201Chowever.\u201D`
  }
];

const PURPOSE_ITEMS_EXERCISE_DATA: MatchingItem[] = [
  {
    prompt: "The axolotl, a salamander native to lakes near Mexico City, possesses a remarkable ability that has captivated biologists for decades: it can regenerate entire limbs, portions of its heart and brain, and even sections of its spinal cord. Unlike most vertebrates, which form scar tissue at wound sites, the axolotl initiates a complex cellular process that reconstructs the missing tissue with near-perfect fidelity.",
    options: [
      "To argue that axolotls are more scientifically important than other salamanders",
      "To describe a distinctive biological capability and how it differs from typical vertebrate healing",
      "To explain the step-by-step process of limb regeneration in axolotls",
      "To advocate for increased conservation efforts to protect the axolotl's habitat"
    ],
    correct: 0,
    explanation: "The passage DESCRIBES the axolotl's regeneration ability and CONTRASTS it with typical vertebrate healing. It doesn't argue for importance (A), explain steps (C), or advocate conservation (D)."
  },
  {
    prompt: "While conventional wisdom holds that the printing press democratized knowledge by making books affordable, historian Elizabeth Eisenstein has argued that its more significant impact was standardization. Before printing, hand-copied manuscripts contained numerous errors and variations; the press ensured that every copy of a text was identical, enabling scholars across Europe to reference the same passages and build on each other's work with unprecedented precision.",
    options: [
      "To challenge a common assumption by presenting an alternative interpretation",
      "To describe the technical process of early printing",
      "To compare the costs of printed books versus handwritten manuscripts",
      "To trace the history of European scholarship from medieval to modern periods"
    ],
    correct: 0,
    explanation: `\u201CWhile conventional wisdom holds X... [historian] has argued Y\u201D = challenges the common view with an alternative. Classic qualify/complicate structure.`
  },
  {
    prompt: "A growing body of evidence suggests that the relationship between sleep and memory consolidation is more nuanced than previously understood. While REM sleep has traditionally been considered the primary phase for memory processing, recent studies indicate that non-REM deep sleep plays an equally critical role, particularly for declarative memories \u2014 facts and events that can be consciously recalled.",
    options: [
      "To disprove the importance of REM sleep for memory",
      "To qualify an existing understanding by presenting new evidence that adds complexity",
      "To describe the differences between REM and non-REM sleep stages",
      "To argue that deep sleep is more important than REM sleep"
    ],
    correct: 0,
    explanation: `\u201CMore nuanced than previously understood\u201D + \u201CWhile X traditionally... recent studies indicate Y also\u201D = adding complexity, not disproving.`
  },
  {
    prompt: "In 2018, marine biologist Dr. Ayana Johnson launched the Urban Ocean Lab, a think tank focused on coastal cities. Her work begins from the premise that ocean conservation cannot succeed without addressing the needs of the communities that depend on marine resources. By integrating environmental policy with social justice frameworks, Johnson argues, conservation efforts become not only more equitable but also more effective.",
    options: [
      "It provides biographical information about Dr. Johnson",
      "It describes a specific research finding from Urban Ocean Lab",
      "It presents the central argument that frames Dr. Johnson's approach",
      "It acknowledges a criticism of traditional conservation methods"
    ],
    correct: 0,
    explanation: "The last sentence states Johnson's core CLAIM: integration makes conservation both more equitable AND effective."
  },
  {
    prompt: "Critics of standardized testing argue that such assessments measure test-taking ability rather than knowledge. Proponents counter that they provide the only objective, comparable metric. Both positions, however, may overstate their cases: recent meta-analyses suggest that test scores correlate moderately with academic performance but are far from the sole predictor of success.",
    options: [
      "To argue against the use of standardized testing",
      "To defend standardized testing against its critics",
      "To present two opposing views and then offer a more nuanced position",
      "To describe the methodology of recent meta-analyses on testing"
    ],
    correct: 0,
    explanation: `Critics say X. Proponents say Y. \u201CBoth may overstate\u201D + nuanced conclusion = thesis, antithesis, synthesis.`
  },
  {
    prompt: "The discovery of high concentrations of phosphine gas in the atmosphere of Venus initially generated enormous excitement among astrobiologists, as phosphine on Earth is primarily produced by biological processes. Subsequent analyses, however, have called the detection itself into question, with several research teams arguing that the spectral data was misinterpreted and that sulfur dioxide better explains the observed signal.",
    options: [
      "It provides additional evidence supporting the initial discovery",
      "It introduces a complication that undermines the significance of the first sentence's claim",
      "It explains the biological process by which phosphine is produced",
      "It shifts the focus from Venus to Earth-based phosphine research"
    ],
    correct: 0,
    explanation: `\u201CHowever\u201D + \u201Ccalled into question\u201D = the second sentence challenges the excitement from the first. Its function is to COMPLICATE the initial claim.`
  }
];

const CROSSTEXT_ITEMS_EXERCISE_DATA: MatchingItem[] = [
  {
    prompt: `Text 1:\nPsychologist Carol Dweck\u2019s research on mindset has demonstrated that students who believe intelligence is malleable \u2014 a \u2018growth mindset\u2019 \u2014 consistently outperform those who view intelligence as fixed. Dweck argues that praising effort rather than innate ability fosters this growth orientation and leads to greater academic resilience.\n\nText 2:\nEducation researcher Li Zhao contends that the growth mindset framework, while appealing, oversimplifies the relationship between belief and achievement. Zhao points to studies showing that mindset interventions produce only modest effects and argues that structural factors \u2014 funding, class size, teacher quality \u2014 remain far more predictive of student success than any individual psychological orientation.\n\nBased on the texts, how would Zhao (Text 2) most likely respond to Dweck\u2019s argument in Text 1?`,
    options: [
      "By agreeing that praising effort is more effective than praising ability",
      "By arguing that Dweck's research methodology is fundamentally flawed",
      "By acknowledging the concept's appeal while arguing that it overstates mindset's role relative to systemic factors",
      "By proposing an alternative psychological framework that better explains achievement"
    ],
    correct: 2,
    explanation: `Zhao says the framework is \u201Cappealing\u201D but \u201Coversimplifies\u201D and structural factors matter more. Classic QUALIFICATION.`
  },
  {
    prompt: `Text 1:\nHistorian Marcus Webb argues that the Industrial Revolution\u2019s most transformative effect was not economic but social: mass migration from rural areas to cities restructured family life, community bonds, and individual identity. Webb contends that urbanization, more than any technological innovation, defined the modern experience.\n\nText 2:\nEconomic historian Sarah Chen maintains that the Revolution\u2019s impact cannot be meaningfully separated into social and economic categories. The urbanization Webb describes, Chen argues, was driven entirely by economic forces \u2014 factory labor demand, agricultural collapse, and capital concentration. To treat social transformation as distinct from economic transformation creates a false dichotomy.\n\nWhich choice best describes the relationship between the two texts?`,
    options: [
      "Text 2 provides additional evidence supporting Text 1's central claim",
      "Text 2 challenges Text 1's analytical framework by arguing that the categories it separates are inseparable",
      "Text 2 focuses on a different historical period than Text 1",
      "Text 2 agrees with Text 1's conclusion but offers different evidence"
    ],
    correct: 1,
    explanation: `Webb separates social from economic. Chen argues they CAN\u2019T be separated \u2014 a \u201Cfalse dichotomy.\u201D Challenge to the FRAMEWORK.`
  },
  {
    prompt: `Text 1:\nNeuroscientist Dr. Amara Osei\u2019s research suggests that bilingualism provides significant cognitive benefits. Her studies indicate bilingual individuals demonstrate enhanced executive function, greater cognitive flexibility, and delayed onset of age-related cognitive decline compared to monolingual peers.\n\nText 2:\nCognitive psychologist Dr. Reyes notes that while early bilingual advantage studies were promising, recent large-scale replications have produced inconsistent results. Reyes argues the advantage may be smaller than initially reported and may depend on age of acquisition, proficiency level, and specific tasks measured \u2014 suggesting the relationship is more complex than a simple comparison implies.\n\nBased on the texts, how does Reyes\u2019s position relate to Osei\u2019s?`,
    options: [
      "Reyes entirely rejects Osei's claim that bilingualism provides cognitive benefits",
      "Reyes agrees with Osei's findings but questions whether they apply to all age groups",
      "Reyes qualifies Osei's claims by suggesting the benefits may be less consistent and more context-dependent than presented",
      "Reyes proposes an entirely different explanation for the cognitive patterns Osei observed"
    ],
    correct: 2,
    explanation: `Reyes doesn\u2019t reject benefits entirely but says they\u2019re \u201Csmaller than reported\u201D and depend on multiple factors. Classic QUALIFICATION.`
  },
  {
    prompt: `Text 1:\nArchitect Maya Lin has long argued that effective public memorials should create spaces for personal reflection rather than imposing a single narrative. Her Vietnam Veterans Memorial invites each visitor to construct their own relationship with the loss it represents.\n\nText 2:\nArt critic James Harrigan contends that Lin\u2019s approach, while powerful for the Vietnam Memorial, should not be treated as a universal template. Some historical events \u2014 particularly those involving systemic injustice \u2014 require memorials that explicitly name perpetrators and mechanisms of harm. To leave interpretation entirely open risks allowing visitors to forget or minimize causes of suffering.\n\nWhich choice best describes the relationship between the two texts?`,
    options: [
      "Text 2 entirely rejects the approach described in Text 1",
      "Text 2 accepts Text 1's approach for certain contexts but argues it is inappropriate for others",
      "Text 2 proposes the same philosophy as Text 1 using different terminology",
      "Text 2 provides historical evidence that contradicts Text 1's claims about the Vietnam Memorial"
    ],
    correct: 1,
    explanation: `Harrigan says Lin\u2019s approach is \u201Cpowerful\u201D for Vietnam but \u201Cshould not be a universal template.\u201D Scope-limited agreement.`
  }
];

const CHALLENGE_ITEMS_EXERCISE_DATA: MatchingItem[] = [
  {
    prompt: "Text 1:\nClimate scientist Dr. Mora argues that even limiting warming to 1.5\u00B0C will expose 48% of the global population to dangerous heat conditions by 2100. The damage, Mora contends, is already locked in by existing atmospheric CO<sub>2</sub> levels.\n\nText 2:\nEnvironmental economist Dr. Nordhaus, while not disputing the physical projections, argues that Mora's framing ignores humanity's capacity for adaptation. Historical evidence shows populations have repeatedly adjusted to changing climates through technology, infrastructure, and migration \u2014 factors Mora's model treats as static.",
    options: [
      "Whether climate change is caused by human activity",
      "Whether 1.5\u00B0C of warming is physically possible",
      "Whether human adaptive capacity should be factored into projections of climate impact",
      "Whether migration is a viable response to climate change"
    ],
    correct: 0,
    explanation: "Both accept the physical science. The disagreement is whether Mora's projections should account for human adaptation (Nordhaus says yes, Mora's model doesn't)."
  },
  {
    prompt: "The prevailing view among linguists holds that language shapes thought only weakly \u2014 providing labels but not fundamentally constraining cognition. Yet a 2023 study of the Pirah\u00E3 people of Brazil, whose language lacks fixed number words, found that speakers consistently struggled with exact quantity tasks that speakers of numbered languages perform easily. The researchers concluded not that language determines thought, but that it calibrates cognitive habits: without number words, the mental algorithms for exact counting never develop through daily practice.",
    options: [
      "It presents a consensus view, introduces apparently contradictory evidence, then offers a nuanced reconciliation",
      "It argues against the prevailing view using a single decisive counterexample",
      "It describes an experiment and critiques its methodology",
      "It traces the historical evolution of a linguistic theory"
    ],
    correct: 0,
    explanation: `Prevailing view \u2192 contradictory evidence (Pirah\u00E3) \u2192 nuanced conclusion (\u201Ccalibrates\u201D not \u201Cdetermines\u201D). Three-part reconciliation structure.`
  },
  {
    prompt: "When physicist Richard Feynman was asked to investigate the 1986 Challenger disaster, he famously dunked an O-ring in ice water during a televised hearing, demonstrating that the rubber lost its resilience in cold \u2014 the direct cause of the shuttle's failure. What is less remembered is that engineers at Morton Thiokol had warned NASA the night before launch that cold temperatures posed exactly this risk. The lesson of Challenger is often framed as an engineering failure, but it was fundamentally a failure of organizational communication: the right information existed but could not travel upward through a hierarchy incentivized to launch on schedule.",
    options: [
      "To celebrate Feynman's role in identifying the technical cause of the disaster",
      "To argue that the Challenger disaster should be understood primarily as a communication failure rather than an engineering failure",
      "To describe the properties of O-rings under cold conditions",
      "To compare the organizational structures of NASA and Morton Thiokol"
    ],
    correct: 0,
    explanation: `The passage reframes Challenger: not engineering failure but \u201Cfundamentally a failure of organizational communication.\u201D The purpose is to shift the common interpretation.`
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 7,
  title: "Text Structure, Purpose & Cross-Text",
  subtitle: "Identifying author\u2019s purpose and organization",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },    { id: "quiz", label: "Practice", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "star" },    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  warmup: [
    {
      source: "WIC",
      stem: "The researcher\u2019s tone throughout the article was notably _______, presenting each finding with careful qualifications and acknowledging the limitations of the study at every turn.\n\nWhich word best completes the text?",
      choices: ["circumspect", "dismissive", "indifferent", "effusive"],
      correct: 0,
      explanation: "\u201CCareful qualifications\u201D and \u201Cacknowledging limitations\u201D = cautious and thoughtful. \u201CCircumspect\u201D = wary, careful.",
    },
    {
      source: "Transitions",
      stem: "The volcanic eruption devastated the island\u2019s agriculture. _______ the local fishing industry, which depended on clear coastal waters, was equally affected by the ash runoff.\n\nWhich transition best completes the text?",
      choices: ["For example,", "In contrast,", "Moreover,", "Nevertheless,"],
      correct: 2,
      explanation: "Agriculture devastated + fishing also affected = adding another negative effect. \u201CMoreover\u201D = in addition.",
    },
    {
      source: "Conventions",
      stem: "The council decided that neither the proposed highway expansion nor the alternative transit _______ sufficient to address the region\u2019s growing transportation needs.\n\nWhich choice conforms to Standard English?",
      choices: ["plan, were", "plan were", "plan; was", "plan was"],
      correct: 3,
      explanation: "\u201CNeither\u2026nor\u201D \u2014 verb agrees with nearer subject \u201Cplan\u201D (singular) = \u201Cwas.\u201D",
    },
    {
      source: "WIC",
      stem: "The architect\u2019s latest building was widely praised for its _______ \u2014 a seamless integration of glass, steel, and reclaimed wood that felt simultaneously modern and organic.\n\nWhich word best completes the text?",
      choices: ["austerity", "coherence", "uniformity", "eclecticism"],
      correct: 1,
      explanation: "\u201CSeamless integration\u201D of different materials that feels unified = \u201Ccoherence\u201D (logical, consistent whole).",
    },
    {
      source: "Evidence",
      stem: "A researcher claims that urban green spaces reduce stress. Which finding, if true, would most directly support this claim?",
      choices: [
        "Park funding has increased in most major cities.",
        "People who walk through parks show lower cortisol levels than those who walk through commercial districts.",
        "Cities with parks have higher property values.",
        "Urban residents prefer living near green spaces."
      ],
      correct: 1,
      explanation: "Cortisol = stress hormone. Lower levels after park walks directly links green spaces to stress reduction.",
    },
  ],

  lessons: [
    {
      id: "intro",
      title: "Reading Beyond the Words",
      subtitle: "Structure, purpose, and connections",
      body: [
        "This module covers two question types from the Craft & Structure domain that require you to analyze HOW and WHY a passage is written, not just WHAT it says.",
        "Text Structure & Purpose (~2-3 per test): What is the main purpose of the passage? What function does a particular sentence serve? These ask about the author\u2019s intent and the passage\u2019s organizational logic.",
        "Cross-Text Connections (~1 per test): The only paired-passage question on the digital SAT. You read Text 1 and Text 2, then determine how the authors\u2019 perspectives relate.",
        "Together these account for about 5-6% of the section \u2014 a small slice, but they\u2019re often the questions that separate strong readers from average ones.",
      ],
      visual: "stats",
    },
    {
      id: "purpose-types",
      title: "Common Passage Purposes",
      subtitle: "What is the author trying to do?",
      body: [
        "Every passage on the SAT has a purpose. The most common purposes you\u2019ll encounter:",
        "INFORM/DESCRIBE: Present factual information. Neutral, explanatory tone.\n\"Researchers at the University of Tokyo have developed a new technique for...\"",
        "ARGUE/PERSUADE: Advocate for a position. The author has a clear stance.\n\"The conventional explanation for this phenomenon fails to account for...\"",
        "COMPARE/CONTRAST: Present similarities or differences.\n\"While traditional methods rely on X, the new approach instead uses Y...\"",
        "QUALIFY/COMPLICATE: Acknowledge limits or add nuance.\n\"Although the theory has proven useful, recent findings suggest it may not apply to...\"",
        "INTRODUCE/CONTEXTUALIZE: Set up background that frames what follows.\n\"For centuries, scholars assumed that... However, a 2019 discovery challenged this assumption.\"",
      ],
      visual: "purpose-types",
    },
    {
      id: "sentence-function",
      title: "Sentence Function Questions",
      subtitle: "What role does this sentence play?",
      body: [
        "Some questions ask about the function of a SPECIFIC sentence. Think of each sentence as having a job:",
        "CLAIM: States the author\u2019s main argument.\nEVIDENCE: Provides data, examples, or facts to support a claim.\nCOUNTERPOINT: Presents an opposing view.\nCONCESSION: Acknowledges a limitation before continuing.\nTRANSITION: Shifts from one idea to the next.\nCONTEXT: Provides background information.",
        "STRATEGY: Don\u2019t just read WHAT the sentence says \u2014 ask what it DOES. Does it support the previous sentence? Challenge it? Shift direction?",
        "KEY TRAP: Answers that describe the sentence\u2019s CONTENT accurately but misidentify its FUNCTION. A sentence might mention a study (content), but its function might be to challenge the main argument.",
      ],
      visual: "sentence-roles",
    },
    {
      id: "structure-signals",
      title: "Structure Signal Words",
      subtitle: "The road signs of a passage",
      body: [
        "Passages reveal their structure through signal words. Learn to spot these:",
        "CAUSE/EFFECT: because, therefore, consequently, as a result, thus, since, due to\nCONTRAST: however, but, although, while, whereas, nevertheless, despite, yet\nADDITION: furthermore, moreover, additionally, also, similarly\nCONCESSION: although, while it is true that, admittedly, granted, to be sure\nSEQUENCE: first, then, subsequently, finally, initially, eventually",
        "Most important for Text Structure: CONTRAST and CONCESSION signals. These tell you the passage is doing something more complex than simply presenting information \u2014 it\u2019s weighing multiple perspectives.",
      ],
    },
    {
      id: "cross-text-intro",
      title: "Cross-Text Connections",
      subtitle: "The only paired passage on the digital SAT",
      body: [
        "Cross-Text questions present two short passages (Text 1 and Text 2) and ask how the authors\u2019 perspectives relate. This appears roughly once per test.",
        "The question almost always asks:\n\u2022 How would Author 2 respond to Author 1\u2019s claim?\n\u2022 What is the relationship between the two texts?\n\u2022 On what point do the authors agree/disagree?",
        "CRITICAL STRATEGY:\n1. Read Text 1. Identify the MAIN CLAIM.\n2. Read Text 2. Identify the MAIN CLAIM.\n3. Determine the relationship BEFORE looking at answers.\n4. The SAT almost never presents texts that completely agree.",
      ],
    },
    {
      id: "cross-text-relationships",
      title: "The Five Relationship Types",
      subtitle: "How two texts connect",
      body: [
        "DIRECT DISAGREEMENT: Opposing positions on the same issue.\nText 1: \"Social media strengthens communities...\"\nText 2: \"Social media fragments communities...\"",
        "QUALIFICATION: Author 2 partially agrees but adds important limits.\nText 1: \"Exercise improves mental health.\"\nText 2: \"While exercise helps, its benefits depend heavily on context and intensity.\"",
        "DIFFERENT SCOPE: Same topic but different aspects. Text 1 discusses economic causes; Text 2 discusses cultural causes.",
        "EXTENSION: Author 2 builds on Author 1\u2019s argument. Text 1 identifies a problem; Text 2 proposes a solution.",
        "EVIDENCE: One text provides specific evidence that supports or undermines the other\u2019s claim.",
      ],
      visual: "cross-text",
    },
    {
      id: "cross-text-traps",
      title: "Cross-Text Traps",
      subtitle: "Common wrong answer patterns",
      body: [
        "TRAP 1: \"They completely agree.\" The SAT rarely pairs texts that fully agree. Almost always wrong.",
        "TRAP 2: Misidentifying the scope of disagreement. The authors might agree on the PROBLEM but disagree on the SOLUTION. The answer must capture the SPECIFIC point.",
        "TRAP 3: Bringing in outside knowledge. The answer must be based ONLY on what\u2019s stated in the two passages.",
        "TRAP 4: Confusing tone with position. Different tones (formal vs. casual) don\u2019t equal different positions.",
      ],
    },
    {
      id: "framework",
      title: "The Analysis Framework",
      subtitle: "Your approach for structure and cross-text questions",
      body: [
        "FOR TEXT STRUCTURE/PURPOSE:\n1. Read the full passage.\n2. Ask: is the author informing, arguing, comparing, qualifying, or contextualizing?\n3. For sentence function: identify the sentence\u2019s JOB.\n4. Eliminate answers that describe content but misidentify function.",
        "FOR CROSS-TEXT:\n1. Summarize Text 1\u2019s main claim in one sentence.\n2. Summarize Text 2\u2019s main claim in one sentence.\n3. Determine the relationship BEFORE looking at answers.\n4. Match the answer to your identified relationship.\n5. Check scope \u2014 the answer must capture the SPECIFIC point of agreement/disagreement.",
      ],
    },
  ],

  quiz: [
    {
      passage: "For decades, ecologists assumed that tropical rainforests maintained biodiversity primarily through stability \u2014 millions of years of consistent climate allowing species to accumulate. More recently, however, researchers have proposed that periodic disturbances, including droughts, floods, and volcanic activity, may actually be the engine of diversification, creating niches and driving rapid adaptation.",
      stem: "Which choice best describes the main purpose of the text?",
      choices: [
        "To compare stable ecosystems with disturbed ecosystems",
        "To argue that rainforests are less stable than believed",
        "To present a newer hypothesis that challenges a longstanding assumption about biodiversity",
        "To describe various disturbances affecting rainforests"
      ],
      correct: 2,
      explanation: "\u201CFor decades, assumed X... More recently, however, proposed Y\u201D = presenting a newer hypothesis that challenges traditional view.",
      type: "purpose",
      difficulty: "medium",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "The diplomat\u2019s response was carefully _______, avoiding any language that could be interpreted as either endorsement or criticism of the proposed treaty.",
      stem: "Which word best completes the text?",
      choices: ["dismissive", "neutral", "verbose", "inflammatory"],
      correct: 1,
      explanation: "\u201CAvoiding endorsement or criticism\u201D = deliberately non-committal. \u201CNeutral\u201D fits.",
      type: "interleaved",
      difficulty: "medium",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "The octopus\u2019s ability to change color in milliseconds has long fascinated biologists. A 2023 Nature study revealed that this camouflage is not controlled by the brain alone: the skin cells themselves contain light-sensitive proteins that detect and respond to visual information independently. This finding suggests that the octopus effectively \u2018sees\u2019 with its entire body surface.",
      stem: "Which choice best describes the function of the last sentence?",
      choices: [
        "It provides a vivid interpretation capturing the significance of the finding",
        "It introduces a new topic unrelated to the discussion",
        "It presents a counterargument to the study\u2019s conclusions",
        "It describes the methodology of the 2023 study"
      ],
      correct: 0,
      explanation: "\u201CSees with its entire body\u201D is an interpretive summary of what the finding MEANS.",
      type: "function",
      difficulty: "medium",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "Although the Mediterranean diet has been consistently associated with reduced cardiovascular risk, nutritionist Dr. Sharma cautions that these correlations may reflect broader lifestyle factors. Mediterranean populations also tend to have stronger social networks, more physical activity, and lower work-related stress \u2014 all of which independently benefit heart health.",
      stem: "Which choice best describes the main purpose of the text?",
      choices: [
        "To compare Mediterranean dietary habits with those of other regions",
        "To identify confounding variables that complicate diet-health correlations",
        "To recommend a specific approach to nutrition research",
        "To argue that the Mediterranean diet has no health benefits"
      ],
      correct: 1,
      explanation: "Sharma doesn\u2019t deny the association but points out confounding variables.",
      type: "purpose",
      difficulty: "medium",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "The city\u2019s public transit system has seen ridership increase by 30% since the new routes were added. _______ officials are now considering further expansion to underserved neighborhoods.",
      stem: "Which transition best completes the text?",
      choices: ["Nevertheless,", "In contrast,", "Accordingly,", "For instance,"],
      correct: 2,
      explanation: "Ridership up \u2192 therefore considering expansion. \u201CAccordingly\u201D = as a result.",
      type: "interleaved",
      difficulty: "medium",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "Philosopher Hannah Arendt distinguished between \u2018labor\u2019 \u2014 the repetitive biological maintenance of life \u2014 and \u2018work\u2019 \u2014 the creation of durable objects that outlast their makers. In Arendt\u2019s framework, a farmer\u2019s daily cultivation is labor, while a sculptor\u2019s statue is work. This distinction illuminates a tension at the heart of modern economies: automation of labor frees humans from biological necessity but raises urgent questions about the meaning of human activity in a post-labor world.",
      stem: "Which choice best describes the function of the last sentence?",
      choices: [
        "It refutes Arendt\u2019s distinction between labor and work",
        "It applies Arendt\u2019s theoretical distinction to a contemporary practical concern",
        "It provides a historical example illustrating Arendt\u2019s categories",
        "It introduces a completely new philosophical framework"
      ],
      correct: 1,
      explanation: "The last sentence takes Arendt\u2019s abstract distinction and connects it to modern automation. It APPLIES theory to a contemporary issue.",
      type: "function",
      difficulty: "hard",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "The concept of \u2018rewilding\u2019 \u2014 reintroducing apex predators to ecosystems from which they\u2019ve been eliminated \u2014 has gained traction among conservationists. Its celebrated case study, wolves in Yellowstone (1995), showed cascading effects: wolf predation on elk allowed vegetation to recover, which stabilized riverbanks, which altered river courses. Yet critics argue that Yellowstone\u2019s success may not be replicable in landscapes shared with agriculture, where predator-livestock conflicts create economic and political obstacles no ecological argument can easily overcome.",
      stem: "Which choice best describes the overall structure of the text?",
      choices: [
        "It traces the historical development of an ecological theory",
        "It compares two competing approaches to wildlife conservation",
        "It defines a concept, presents supporting evidence, and introduces a significant limitation",
        "It argues against rewilding by presenting economic evidence"
      ],
      correct: 2,
      explanation: "Definition (rewilding) then evidence (Yellowstone) then limitation (\u201CYet critics...\u201D). Clear three-part structure.",
      type: "purpose",
      difficulty: "hard",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "The museum\u2019s newest exhibit, which features artifacts from three ancient _______ has already attracted over 50,000 visitors in its first month.",
      stem: "Which choice conforms to Standard English?",
      choices: ["civilizations", "civilizations;", "civilizations,", "civilizations."],
      correct: 2,
      explanation: "The \u201Cwhich\u201D clause is nonessential and needs to close with a comma before the main clause continues.",
      type: "interleaved",
      difficulty: "medium",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "Text 1:\nLinguist Dr. Keiko Tanaka argues that the rapid decline of indigenous languages represents an irreplaceable loss of human knowledge. Each language encodes unique ways of categorizing reality that cannot be fully captured through translation.\n\nText 2:\nAnthropologist Dr. Samuel Oduya, while sharing Tanaka\u2019s concern, argues that framing the issue as \u2018knowledge preservation\u2019 risks reducing living languages to museum artifacts. The most effective revitalization focuses not on documentation but on creating conditions that make speaking the language practically advantageous for younger generations.",
      stem: "Based on the texts, how does Oduya\u2019s position relate to Tanaka\u2019s?",
      choices: [
        "Oduya agrees that language loss matters but advocates for a different approach to addressing it",
        "Oduya provides evidence contradicting Tanaka\u2019s research",
        "Oduya extends Tanaka\u2019s argument by proposing additional knowledge types encoded in language",
        "Oduya rejects Tanaka\u2019s claim that indigenous languages encode unique knowledge"
      ],
      correct: 0,
      explanation: "Oduya \u201Cshares Tanaka\u2019s concern\u201D (agrees on problem) but argues for different solution. Same diagnosis, different prescription.",
      type: "cross-text",
      difficulty: "medium",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "Text 1:\nEconomist Dr. Fournier argues that universal basic income (UBI) is the most efficient mechanism for addressing poverty. Unconditional cash transfers eliminate bureaucratic overhead of means-tested welfare while preserving individual autonomy.\n\nText 2:\nPolitical scientist Dr. Hassan maintains that UBI\u2019s appeal is largely theoretical. Pilot programs in Finland and Ontario showed minimal effects, and funding UBI at a meaningful level \u2014 20-30% of GDP \u2014 makes it an impractical distraction from targeted interventions that could be implemented immediately.",
      stem: "Which choice best describes the relationship between the two texts?",
      choices: [
        "Text 2 supports Text 1 with additional evidence from pilot programs",
        "Text 2 provides empirical evidence and practical objections that challenge Text 1\u2019s theoretical advocacy",
        "Text 2 addresses a different economic policy",
        "Both texts agree on the goal but disagree about timeline"
      ],
      correct: 1,
      explanation: "Fournier argues UBI is efficient (theoretical). Hassan counters with data and feasibility concerns. Theory vs. evidence.",
      type: "cross-text",
      difficulty: "hard",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "Text 1:\nPaleontologist Dr. Chen proposes that the Permian mass extinction was primarily caused by massive Siberian volcanic eruptions releasing carbon dioxide and toxic gases, triggering ocean acidification and atmospheric warming.\n\nText 2:\nGeochemist Dr. Al-Rashid supports the volcanic hypothesis but adds a crucial mechanism: the eruptions ignited vast underground coal deposits, multiplying carbon emissions far beyond volcanic activity alone. This \u2018coal-burning\u2019 phase was the true tipping point making the extinction the most severe in Earth\u2019s history.",
      stem: "Based on the texts, how does Al-Rashid\u2019s position relate to Chen\u2019s?",
      choices: [
        "Al-Rashid supports Chen\u2019s general hypothesis while proposing an additional amplifying mechanism",
        "Al-Rashid contradicts Chen by proposing coal burning rather than volcanism",
        "Al-Rashid questions the severity of the extinction Chen describes",
        "Al-Rashid agrees on timeline but disagrees on geographic location"
      ],
      correct: 0,
      explanation: "Al-Rashid \u201Csupports the volcanic hypothesis\u201D but \u201Cadds a crucial mechanism.\u201D EXTENSION, not contradiction.",
      type: "cross-text",
      difficulty: "hard",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "Despite the company\u2019s public commitment to sustainability, internal documents revealed a significant _______ between its stated environmental goals and its actual manufacturing practices.",
      stem: "Which word best completes the text?",
      choices: ["alignment", "similarity", "discrepancy", "correlation"],
      correct: 2,
      explanation: "\u201CDespite commitment\u201D + gap between stated goals and actual practices = \u201Cdiscrepancy.\u201D",
      type: "interleaved",
      difficulty: "medium",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "For decades, cognitive scientists have debated whether decision-making is fundamentally rational, with irrationalities being computational errors, or fundamentally heuristic, with rationality being post-hoc justification. Psychologist Gerd Gigerenzer has proposed a middle ground: heuristics are not irrational shortcuts but \u2018ecological rationality\u2019 \u2014 decision rules evolved to produce good-enough outcomes in actual environments, even if they fail under artificial laboratory conditions.",
      stem: "Which choice best describes the function of the first sentence?",
      choices: [
        "It presents the resolution to a longstanding debate",
        "It establishes a binary debate that the rest of the passage will complicate",
        "It provides evidence supporting the view that decision-making is rational",
        "It describes Gigerenzer\u2019s specific research methodology"
      ],
      correct: 1,
      explanation: "The first sentence sets up a binary. The rest presents Gigerenzer\u2019s middle ground. Its FUNCTION is to establish the either/or that gets complicated.",
      type: "function",
      difficulty: "hard",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "The James Webb Space Telescope\u2019s detection of carbon dioxide in exoplanet WASP-39b\u2019s atmosphere marked the first definitive identification of this molecule in an exoplanetary atmosphere. While the finding does not indicate life \u2014 WASP-39b is a gas giant exceeding 900\u00B0C \u2014 it demonstrates that JWST possesses the spectroscopic sensitivity to detect atmospheric biosignatures on smaller, cooler rocky planets. The real significance lies not in what it found but in what it proved the telescope is capable of finding.",
      stem: "Which choice best describes the main purpose of the text?",
      choices: [
        "To compare JWST\u2019s capabilities with previous telescopes",
        "To describe the process by which carbon dioxide was detected",
        "To explain that a discovery\u2019s importance lies in the methodological capability it demonstrates rather than its direct content",
        "To argue that WASP-39b may harbor conditions suitable for life"
      ],
      correct: 2,
      explanation: "The passage explicitly states: \u201Cthe real significance lies not in what it found but in what it proved capable of finding.\u201D",
      type: "purpose",
      difficulty: "hard",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
  ],

  challenge: [
    {
      passage: "Text 1:\nClimate scientist Dr. Mora argues that even limiting warming to 1.5\u00B0C will expose 48% of the global population to dangerous heat conditions by 2100. The damage, Mora contends, is already locked in by existing atmospheric CO<sub>2</sub> levels.\n\nText 2:\nEnvironmental economist Dr. Nordhaus, while not disputing the physical projections, argues that Mora\u2019s framing ignores humanity\u2019s capacity for adaptation. Historical evidence shows populations have repeatedly adjusted to changing climates through technology, infrastructure, and migration \u2014 factors Mora\u2019s model treats as static.",
      stem: "Which choice best captures the core disagreement between the texts?",
      choices: [
        "Whether 1.5\u00B0C of warming is physically possible",
        "Whether climate change is caused by human activity",
        "Whether human adaptive capacity should be factored into projections of climate impact",
        "Whether migration is a viable response to climate change"
      ],
      correct: 2,
      explanation: "Both accept the physical science. The disagreement is whether Mora\u2019s projections should account for human adaptation (Nordhaus says yes, Mora\u2019s model doesn\u2019t).",
      type: "cross-text",
      difficulty: "hard",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "The prevailing view among linguists holds that language shapes thought only weakly \u2014 providing labels but not fundamentally constraining cognition. Yet a 2023 study of the Pirah\u00E3 people of Brazil, whose language lacks fixed number words, found that speakers consistently struggled with exact quantity tasks that speakers of numbered languages perform easily. The researchers concluded not that language determines thought, but that it calibrates cognitive habits: without number words, the mental algorithms for exact counting never develop through daily practice.",
      stem: "Which choice best describes the overall structure of the passage?",
      choices: [
        "It argues against the prevailing view using a single decisive counterexample",
        "It describes an experiment and critiques its methodology",
        "It traces the historical evolution of a linguistic theory",
        "It presents a consensus view, introduces apparently contradictory evidence, then offers a nuanced reconciliation"
      ],
      correct: 3,
      explanation: "Prevailing view \u2192 contradictory evidence (Pirah\u00E3) \u2192 nuanced conclusion (\u201Ccalibrates\u201D not \u201Cdetermines\u201D). Three-part reconciliation structure.",
      type: "function",
      difficulty: "hard",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
    {
      passage: "When physicist Richard Feynman was asked to investigate the 1986 Challenger disaster, he famously dunked an O-ring in ice water during a televised hearing, demonstrating that the rubber lost its resilience in cold \u2014 the direct cause of the shuttle\u2019s failure. What is less remembered is that engineers at Morton Thiokol had warned NASA the night before launch that cold temperatures posed exactly this risk. The lesson of Challenger is often framed as an engineering failure, but it was fundamentally a failure of organizational communication: the right information existed but could not travel upward through a hierarchy incentivized to launch on schedule.",
      stem: "Which choice best describes the main purpose of the text?",
      choices: [
        "To argue that the Challenger disaster should be understood primarily as a communication failure rather than an engineering failure",
        "To compare the organizational structures of NASA and Morton Thiokol",
        "To describe the properties of O-rings under cold conditions",
        "To celebrate Feynman\u2019s role in identifying the technical cause of the disaster"
      ],
      correct: 0,
      explanation: "The passage reframes Challenger: not engineering failure but \u201Cfundamentally a failure of organizational communication.\u201D The purpose is to shift the common interpretation.",
      type: "purpose",
      difficulty: "hard",
      domain: "Craft & Structure",
      skill: "text_structure",
    },
  ],

  takeaways: [
    "Ask what the passage or sentence DOES, not just what it says.",
    "For purpose questions: is the author informing, arguing, comparing, qualifying, or contextualizing?",
    "For sentence function: identify the sentence's JOB \u2014 claim, evidence, counterpoint, concession.",
    "For cross-text questions: summarize each text's claim, then determine the relationship BEFORE looking at answers.",
  ],
};
