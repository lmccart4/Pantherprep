"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  StatsVisual,
  ToneSorter,
  ClueIdentifier,
  ConnotationDemo,
  TierVisual,
  ProcessFramework,
} from "./lesson-visuals";

const TONE_PASSAGES_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "Despite receiving widespread acclaim for her earlier novels, the author's latest work has been met with ______ reviews, with critics noting its disjointed narrative and underdeveloped characters.",
    "correct": "negative",
    "explanation": "\"Despite acclaim\" + \"disjointed\" + \"underdeveloped\" = the reviews are negative."
  },
  {
    "prompt": "The researcher's ______ approach to data collection — involving meticulous cross-referencing and triple verification of every data point — ensured that the study's conclusions were virtually unassailable.",
    "correct": "positive",
    "explanation": "\"Meticulous,\" \"triple verification,\" and \"unassailable\" conclusions = positive, careful approach."
  },
  {
    "prompt": "The committee ______ the proposal, noting that while the concept showed promise, the implementation timeline and budget estimates required significant revision.",
    "correct": "neutral",
    "explanation": "They didn't reject or accept it — they gave qualified feedback. \"Showed promise\" but \"required revision\" = measured/neutral response."
  },
  {
    "prompt": "The dancer's ______ performance captivated the audience, with each movement flowing seamlessly into the next in a display of extraordinary physical control.",
    "correct": "positive",
    "explanation": "\"Captivated,\" \"seamlessly,\" \"extraordinary\" = strongly positive."
  },
  {
    "prompt": "Although the policy was ______ in its ambitions, its reliance on voluntary compliance and lack of enforcement mechanisms ultimately rendered it ineffective.",
    "correct": "positive",
    "explanation": "Tricky! The policy failed (negative outcome), but the BLANK describes the ambitions themselves, which were positive. \"Although\" signals the blank contrasts with \"ineffective.\""
  },
  {
    "prompt": "The archaeologist's ______ claims about the site's age — made without sufficient radiocarbon dating or peer review — drew sharp criticism from the broader scientific community.",
    "correct": "negative",
    "explanation": "\"Without sufficient\" evidence + \"sharp criticism\" = the claims were irresponsible/negative."
  }
];

const CLUE_ITEMS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Unlike the ______ designs of her contemporaries, which favored ornate decoration and complex layering, Nakamura's architecture emphasized clean lines and open space.",
    "options": [
      "innovative",
      "minimalist",
      "elaborate",
      "conventional"
    ],
    "correct": 2,
    "explanation": "Contrast clue: \"Unlike\" tells us the blank is what her contemporaries did — ornate and complex = elaborate. Nakamura is the minimalist one; the blank describes the others."
  },
  {
    "prompt": "The diplomat's ______ response — carefully avoiding direct criticism while still expressing reservations about the treaty's enforcement provisions — demonstrated her skill in navigating sensitive political situations.",
    "options": [
      "measured",
      "evasive",
      "diplomatic",
      "ambiguous"
    ],
    "correct": 0,
    "explanation": "Example clue: the dash introduces HOW she responded — careful, balanced, not too direct but still substantive. \"Measured\" captures this precisely. \"Diplomatic\" is too on-the-nose/circular. \"Evasive\" is too negative."
  },
  {
    "prompt": "Because the region's infrastructure had been severely compromised by decades of neglect, even routine maintenance tasks proved ______.",
    "options": [
      "unnecessary",
      "straightforward",
      "arduous",
      "feasible"
    ],
    "correct": 2,
    "explanation": "Logic clue: If infrastructure is severely compromised, routine tasks become difficult. \"Arduous\" (requiring great effort) fits."
  },
  {
    "prompt": "The novelist's prose is characterized by its ______ — a spareness and economy of expression in which every word serves a deliberate purpose and no sentence contains an unnecessary element.",
    "options": [
      "verbosity",
      "concision",
      "elegance",
      "complexity"
    ],
    "correct": 1,
    "explanation": "Definition clue: the dash restates the blank's meaning. \"Spareness,\" \"economy of expression,\" \"no unnecessary element\" = concision."
  },
  {
    "prompt": "While many of her peers dismissed the theory as speculative, Dr. Okafor remained ______, continuing her research for another decade until she had gathered sufficient evidence to convince even her harshest critics.",
    "options": [
      "skeptical",
      "indifferent",
      "steadfast",
      "cautious"
    ],
    "correct": 2,
    "explanation": "Contrast clue: \"While\" signals opposition. Peers dismissed it, but she was the opposite — persistent, unwavering. \"Steadfast\" means firmly resolved."
  },
  {
    "prompt": "The composer's early works, though technically proficient, lacked the emotional ______ that would later define her mature compositions — audiences often described them as competent but cold.",
    "options": [
      "restraint",
      "complexity",
      "resonance",
      "precision"
    ],
    "correct": 2,
    "explanation": "Definition/example clue: the works were \"competent but cold\" — so they lacked emotional impact/depth. \"Resonance\" means the quality of evoking emotion."
  },
  {
    "prompt": "The journalist's investigation revealed that the company had taken ______ steps to conceal the environmental damage, including falsifying reports, intimidating witnesses, and bribing local officials.",
    "options": [
      "inadequate",
      "transparent",
      "deliberate",
      "modest"
    ],
    "correct": 2,
    "explanation": "Example clue: falsifying reports, intimidating witnesses, and bribing officials are all intentional, calculated actions. \"Deliberate\" captures this purposefulness."
  },
  {
    "prompt": "The discovery of high concentrations of microplastics in Arctic ice cores, thousands of miles from any industrial source, underscored the ______ nature of plastic pollution — no ecosystem on Earth, however remote, remains untouched.",
    "options": [
      "localized",
      "pervasive",
      "temporary",
      "visible"
    ],
    "correct": 1,
    "explanation": "Logic clue: plastic found in remote Arctic + \"no ecosystem untouched\" = pollution is everywhere. \"Pervasive\" means spread throughout."
  }
];

export default function SATRWModule5() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "stats": <StatsVisual />,
        "tone-sorter": <ToneSorter />,
        "clue-identifier": <ClueIdentifier />,
        "connotation-demo": <ConnotationDemo />,
        "tier-visual": <TierVisual />,
        "process-framework": <ProcessFramework />,
      }}
      activities={{
        "exercise-tone-passages": (goNext: () => void) => (
          <ClassificationExercise
            items={TONE_PASSAGES_EXERCISE}
            categories={["negative","positive","neutral"]}
            title="Tone Passages"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-clue-items": (goNext: () => void) => (
          <MatchingExercise
            items={CLUE_ITEMS_EXERCISE}
            title="Clue"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/sat-rw/6"
      nextModuleLabel="Module 6: Advanced Vocabulary & Precision"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 5,
  title: "Words in Context",
  subtitle:
    "Words in Context = ~20% of the SAT R&W",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-tone-passages", label: "Tone Passages", icon: "zap" },
    { id: "exercise-clue-items", label: "Clue Items", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "intro",
      title: "The Most Common Question Type",
      subtitle: "Words in Context = ~20% of the SAT R&W",
      body: ["Words in Context questions are the single most frequent question type on the entire SAT Reading & Writing section — averaging 10-11 questions per test. Master these, and you've locked down one-fifth of your score.","Each question gives you a short passage (25-50 words) with a blank. Four vocabulary words are offered as choices. Your job: pick the word that is most logical AND most precise in that specific context.","This is NOT a memorization test. The SAT tests whether you can use context clues to determine meaning — even for words you've never seen before. That said, knowing common Tier 2 academic vocabulary gives you a massive advantage."],
      visual: "stats",
    },
    {
      id: "tone-first",
      title: "Strategy #1: Tone First",
      subtitle: "Positive, negative, or neutral?",
      body: ["Before looking at the answer choices, read the passage and determine the TONE of the blank. Is the passage describing something positive, negative, or neutral?","This one step eliminates wrong answers instantly. If the passage describes a scientist's careful, methodical approach, the blank needs a positive or neutral word — you can immediately cross out anything negative like \"reckless\" or \"haphazard.\"","POSITIVE indicators: praise words, success language, words like \"impressive,\" \"effective,\" \"skillfully\"\nNEGATIVE indicators: criticism, failure, words like \"despite,\" \"unfortunately,\" \"flawed\"\nNEUTRAL indicators: factual description, no judgment, reporting language"],
      visual: "tone-sorter",
    },
    {
      id: "context-clues",
      title: "Strategy #2: Context Clue Types",
      subtitle: "The passage always tells you the answer",
      body: ["The SAT builds context clues into every Words in Context passage. Learn to spot these four types:","DEFINITION CLUE: The passage restates the meaning nearby.\n\"The artist's OEUVRE — her complete body of work — spans four decades.\"","CONTRAST CLUE: Signal words like \"but,\" \"however,\" \"unlike,\" \"rather than\" tell you the blank is the OPPOSITE of something stated.\n\"Unlike her predecessor's cautious approach, the new director pursued a ______ strategy.\" → The blank must mean something opposite of cautious.","EXAMPLE CLUE: The passage gives specific examples that reveal the blank's meaning.\n\"The politician's ______ behavior — refusing to compromise, insulting opponents, and rejecting expert advice — alienated even her allies.\"","LOGIC CLUE: The cause-and-effect or sequential logic of the passage points to the meaning.\n\"Because the data was ______, the researchers could not draw any reliable conclusions.\" → The blank must describe data that prevents reliable conclusions."],
      visual: "clue-identifier",
    },
    {
      id: "connotation",
      title: "Strategy #3: Connotation Matters",
      subtitle: "Words that mean similar things feel different",
      body: ["Many SAT answer choices are near-synonyms — they have similar dictionary definitions but different CONNOTATIONS (emotional associations). The SAT tests whether you can pick the one with the right \"feel.\"","Consider: \"thrifty\" vs. \"cheap\" vs. \"frugal\" vs. \"stingy\"\nAll describe someone who doesn't spend much money, but:\n• Thrifty = positive (smart with money)\n• Frugal = positive/neutral (disciplined spending)\n• Cheap = negative (unwilling to spend even when appropriate)\n• Stingy = strongly negative (meanly unwilling to share)","On the SAT, two choices often have the right general meaning, but one has the wrong connotation for the passage's tone. If the passage is praising someone's spending habits, \"thrifty\" fits but \"stingy\" doesn't — even though both involve not spending money.","STRATEGY: After narrowing to two choices that both seem to fit, ask: \"Does the passage view this positively, negatively, or neutrally?\" Then pick the word whose connotation matches."],
      visual: "connotation-demo",
    },
    {
      id: "secondary",
      title: "Trap: Secondary Meanings",
      subtitle: "Common words with uncommon definitions",
      body: ["The SAT loves testing secondary meanings of common words. You know the word, but not in the way the passage uses it.","EXAMPLE: \"The company's gravity was evident in the CEO's somber tone.\"\n\"Gravity\" here means SERIOUSNESS, not the physical force. The SAT would offer choices like: weight, seriousness, attraction, importance.","More secondary meanings the SAT tests:\n• \"Check\" = to restrain (not a bank check)\n• \"Novel\" = new/original (not a book)\n• \"Temper\" = to moderate/soften (not anger)\n• \"Harbor\" = to hold/shelter (not a port)\n• \"Qualify\" = to limit/modify (not to meet requirements)\n• \"Fashion\" = to create/shape (not clothing style)\n• \"Arrest\" = to stop/capture attention (not a police action)\n• \"Cultivate\" = to develop/nurture (not farming)","STRATEGY: If a common word appears as an answer choice, consider whether the passage might be using it in an unusual way. Don't default to the most familiar definition."],
    },
    {
      id: "tier2",
      title: "Tier 2 Academic Vocabulary",
      subtitle: "The 'sweet spot' the SAT targets",
      body: ["The SAT focuses on Tier 2 vocabulary — words that appear across academic contexts but aren't common in everyday speech. These are words like \"substantiate,\" \"ambivalent,\" \"pervasive,\" and \"ephemeral.\"","They're not obscure or esoteric (Tier 3) — you won't see words like \"defenestration\" or \"syzygy.\" And they're not basic everyday words (Tier 1) like \"happy\" or \"run.\"","Building Tier 2 vocabulary is one of the highest-ROI test prep activities. Research shows that a targeted list of 300-500 words covers the vast majority of SAT vocabulary questions. We'll build this vocabulary throughout Units 2 and 3.","For now, focus on the PROCESS: use context clues first, then let vocabulary knowledge confirm your answer. Even if you don't know a word, you can usually narrow to two choices using tone and context — then educated guessing gives you 50/50 odds instead of 25%."],
      visual: "tier-visual",
    },
    {
      id: "process",
      title: "The 4-Step Process",
      subtitle: "Your approach for every Words in Context question",
      body: ["STEP 1: Read the passage. Before looking at choices, predict what type of word belongs in the blank. Determine tone (positive/negative/neutral) and the general meaning needed.","STEP 2: Identify context clues. Find the definition, contrast, example, or logic clue that points to the answer. Underline it mentally.","STEP 3: Scan the choices. Eliminate any that have the wrong tone or don't match the context clues. You should be able to cut at least 1-2 immediately.","STEP 4: Choose the most PRECISE match. Among remaining options, pick the word that most specifically fits. \"Innovative\" might work, but \"pioneering\" might be more precise if the passage describes someone doing something for the first time.","COMMON MISTAKE: Picking a word that generally fits the topic instead of one that precisely fits the blank. Every word in the right answer must earn its place."],
      visual: "process-framework",
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      stem: "The study found that participants who exercised regularly _______ fewer symptoms of anxiety than those in the control group. Which choice completes the text with the most logical and precise word?",
      choices: ["exhibited", "imagined", "created", "ignored"],
      correct: 0,
      explanation: "\"Found that\" + comparison to control group = reporting a measured result. \"Exhibited\" = displayed/showed.",
    },
    {
      stem: "The city council, which _______ approved the budget last Tuesday, will reconvene in March to discuss infrastructure spending. Which choice conforms to the conventions of Standard English?",
      choices: ["unanimous", "unanimously", "unanimity", "unanimousness"],
      correct: 1,
      explanation: "Need an adverb to modify the verb \"approved.\" \"Unanimously\" is the adverb form.",
    },
    {
      stem: "Researchers found that adding nitrogen to soil increased crop yields by 35%. However, excessive nitrogen caused algal blooms in nearby waterways, suggesting that _______ Which choice most logically completes the text?",
      choices: ["crop yields are unrelated to soil composition.", "the benefits of nitrogen fertilization must be balanced against its environmental costs.", "algal blooms improve water quality.", "nitrogen has no effect on agriculture."],
      correct: 1,
      explanation: "Benefits (yield increase) + costs (algal blooms) = need balance. Classic \"however\" pivot.",
    },
    {
      stem: "The orchestra performed Beethoven's Ninth Symphony; _______ the audience responded with a ten-minute standing ovation. Which choice conforms to the conventions of Standard English?",
      choices: ["afterward,", "afterwards;", "afterward:", "afterward"],
      correct: 0,
      explanation: "After a semicolon, the transitional adverb \"afterward\" needs a comma before the independent clause continues.",
    },
    {
      stem: "A 2023 survey of 500 teachers found that 78% reported increased student engagement when using interactive digital tools compared to traditional lectures. Which choice best describes the role of this finding?",
      choices: ["It contradicts the claim that technology aids learning.", "It provides quantitative evidence supporting the effectiveness of digital tools.", "It raises concerns about screen time.", "It compares two unrelated teaching methods."],
      correct: 1,
      explanation: "Specific percentage from a study = quantitative evidence supporting the claim about digital tools.",
    },
    {
      stem: "The author's latest novel, a sweeping epic set across three continents and spanning four decades, demonstrates her remarkable ability to _______ complex narratives without sacrificing emotional intimacy. Which choice completes the text with the most logical and precise word?",
      choices: ["abbreviate", "discard", "simplify", "orchestrate"],
      correct: 3,
      explanation: "Managing complex, multi-threaded narratives = orchestrating (arranging/coordinating many elements skillfully). Not simplifying (that would reduce complexity).",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      passage: "The mountain village, accessible only by a narrow winding road that became impassable during winter storms, had remained largely ______ by modern development.",
      stem: "Which choice completes the text?",
      choices: ["untouched", "restricted", "improved", "affected"],
      correct: 0,
      explanation: "The village is hard to reach (narrow road, impassable in winter), so modern development hasn't reached it. \"Untouched\" means not affected or changed.",
      difficulty: "easy",
    },
    {
      passage: "The comedian's ______ delivery — every pause timed to perfection, every word precisely chosen for maximum impact — transformed even mundane observations into moments of genuine hilarity.",
      stem: "Which choice completes the text?",
      choices: ["spontaneous", "monotonous", "impeccable", "verbose"],
      correct: 2,
      explanation: "\"Every pause timed to perfection, every word precisely chosen\" = flawless execution. \"Impeccable\" means faultless.",
      difficulty: "easy",
    },
    {
      passage: "Rather than simply memorizing formulas, the physics teacher encouraged students to develop an ______ understanding of the principles, one that would allow them to apply concepts to unfamiliar problems.",
      stem: "Which choice completes the text?",
      choices: ["superficial", "theoretical", "rigid", "intuitive"],
      correct: 3,
      explanation: "Contrast with \"memorizing formulas\" + ability to \"apply to unfamiliar problems\" = deep, instinctive understanding. \"Intuitive\" means understood at a gut level.",
      difficulty: "easy",
    },
    {
      passage: "Although the initial findings appeared to ______ the researcher's hypothesis, subsequent experiments with larger sample sizes produced contradictory results that called the entire framework into question.",
      stem: "Which choice completes the text?",
      choices: ["undermine", "substantiate", "ignore", "complicate"],
      correct: 1,
      explanation: "\"Although\" signals contrast: initial findings did X, BUT later experiments contradicted. So the initial findings SUPPORTED the hypothesis. \"Substantiate\" means to provide evidence for.",
      difficulty: "medium",
    },
    {
      passage: "The architect's design was praised for its ______, achieving a striking visual impact through the use of only three materials: concrete, glass, and steel.",
      stem: "Which choice completes the text?",
      choices: ["grandeur", "austerity", "elegance", "complexity"],
      correct: 2,
      explanation: "\"Striking visual impact\" with only three materials = beauty through simplicity. \"Elegance\" captures graceful effectiveness. \"Complexity\" contradicts the simplicity.",
      difficulty: "medium",
    },
    {
      passage: "The senator's position on the trade agreement has been notably ______: she has voiced support for its economic provisions while simultaneously criticizing its environmental protections as inadequate.",
      stem: "Which choice completes the text?",
      choices: ["hostile", "ambivalent", "transparent", "resolute"],
      correct: 1,
      explanation: "She supports parts while criticizing others — mixed feelings. \"Ambivalent\" means having contradictory attitudes toward something.",
      difficulty: "medium",
    },
    {
      passage: "The documentary filmmaker ______ accepted the criticism, acknowledging that her portrayal of the community had been incomplete and promising to incorporate additional perspectives in future projects.",
      stem: "Which choice completes the text?",
      choices: ["angrily", "graciously", "dismissively", "reluctantly"],
      correct: 1,
      explanation: "She acknowledged the criticism and promised to improve — a positive, mature response. \"Graciously\" means in a courteous, kind manner.",
      difficulty: "medium",
    },
    {
      passage: "Far from being a static document, the Constitution has proven remarkably ______, accommodating profound social transformations through both formal amendments and evolving judicial interpretation over more than two centuries.",
      stem: "Which choice completes the text?",
      choices: ["prescient", "rigid", "controversial", "adaptable"],
      correct: 3,
      explanation: "\"Far from static\" + \"accommodating social transformations\" + \"evolving interpretation\" = flexible. \"Adaptable\" captures this precisely. \"Prescient\" (having foresight) misses the point.",
      difficulty: "hard",
    },
    {
      passage: "The critic argued that the gallery's decision to exhibit the controversial works was not an act of artistic courage but rather a ______ attempt to generate publicity, noting that the exhibition coincided precisely with the gallery's annual fundraising campaign.",
      stem: "Which choice completes the text?",
      choices: ["spontaneous", "reluctant", "sincere", "calculated"],
      correct: 3,
      explanation: "\"Not courage but rather...\" + timed with fundraising = strategic, intentional. \"Calculated\" means done with deliberate intent (negative connotation here).",
      difficulty: "hard",
    },
    {
      passage: "While the novelist's early works featured ______ plots involving dozens of characters across multiple continents and time periods, her later novels achieved greater emotional depth through tightly focused narratives centered on a single family.",
      stem: "Which choice completes the text?",
      choices: ["sprawling", "simplistic", "predictable", "cohesive"],
      correct: 0,
      explanation: "\"Dozens of characters across multiple continents and time periods\" = spread out, expansive. \"Sprawling\" means spreading over a large area. Contrasts with \"tightly focused.\"",
      difficulty: "hard",
    },
    {
      passage: "The ecologist cautioned against interpreting the recent uptick in the eagle population as evidence of full recovery, noting that the species' long-term viability remained ______ given ongoing threats from habitat fragmentation and pesticide contamination.",
      stem: "Which choice completes the text?",
      choices: ["assured", "irrelevant", "unprecedented", "precarious"],
      correct: 3,
      explanation: "\"Cautioned against\" optimism + \"ongoing threats\" = still unstable/uncertain. \"Precarious\" means not securely held, dangerously uncertain.",
      difficulty: "hard",
    },
  ],

  takeaways: [
    "Determine the TONE of the blank (positive, negative, neutral) before looking at answer choices — this eliminates 1-2 wrong answers immediately.",
    "Find the context clue: contrast clues (although, unlike, but), logic clues (cause/effect), definition clues (restated near dashes or commas).",
    "After tone and clue, eliminate choices that don't match, then pick the most precise remaining option.",
    "Tier 2 vocabulary (academic words used across subjects) is what the SAT tests most — not obscure or technical terms.",
    "Secondary meanings of common words are a frequent trap — a word you know well may have an uncommon definition the SAT targets.",
  ],
};
