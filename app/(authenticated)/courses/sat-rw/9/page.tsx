"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  StatsVisual,
  ScopeVisual,
  InferenceScaleVisual,
  LiteraryElementsVisual,
  FrameworkVisual,
} from "./lesson-visuals";

/* ═══════════════════════════════════════════════════════
 * MODULE 9 — Central Ideas & Details
 * Main ideas, supporting evidence, summaries
 * ═══════════════════════════════════════════════════════ */

export default function SATRWModule9() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "stats": <StatsVisual />,
        "scope-visual": <ScopeVisual />,
        "inference-scale": <InferenceScaleVisual />,
        "literary-elements": <LiteraryElementsVisual />,
        "framework-visual": <FrameworkVisual />,
      }}
      nextModuleHref="/courses/sat-rw/10"
      nextModuleLabel="Module 10: Inferences & Evidence"
      activities={{
        "exercise-mainidea-items": (goNext: () => void) => (
          <MatchingExercise
            items={MAINIDEA_ITEMS_EXERCISE_DATA}
            title="Mainidea"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-inference-items": (goNext: () => void) => (
          <MatchingExercise
            items={INFERENCE_ITEMS_EXERCISE_DATA}
            title="Inference"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

const MAINIDEA_ITEMS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "For decades, the prevailing theory held that the extinction of large Ice Age mammals — mammoths, giant sloths, saber-toothed cats — was driven primarily by human hunting. However, a 2023 study analyzing fossilized pollen and sediment layers across North America revealed that many of these species had already begun declining centuries before humans arrived on the continent. The researchers argue that rapid climate shifts at the end of the Pleistocene disrupted the ecosystems these animals depended on, and that human hunting, while a contributing factor, merely accelerated an extinction process already underway.",
    "options": [
      "The Pleistocene era was characterized by extreme weather events that affected all animal species equally",
      "Human hunting was the sole cause of Ice Age mammal extinctions",
      "A study suggests that climate change, not just human hunting, played a primary role in Ice Age extinctions",
      "Scientists have discovered new fossils of Ice Age mammals in North America"
    ],
    "correct": 2,
    "explanation": "The passage presents a traditional theory (human hunting) and then a newer study that challenges it (climate-driven decline preceded humans). B captures both the challenge and the nuance (not JUST hunting). A is the old view being challenged. C and D misrepresent the content."
  },
  {
    "prompt": "When Alma Thomas began exhibiting her vibrant abstract paintings in the 1960s, she was already in her seventies — a Black woman artist entering the mainstream art world at an age when most careers are winding down. Her mosaic-like compositions, inspired by the view of flowers and trees from her Washington, D.C., window, employed bold bands of color that anticipated developments in Color Field painting. Though she received significant recognition in her final years, including becoming the first African American woman to have a solo exhibition at the Whitney Museum, Thomas's contributions to American abstraction remained largely overlooked by art historians until a major reassessment began in the 2010s.",
    "options": [
      "Washington, D.C., has produced many important American artists",
      "Alma Thomas's significant contributions to American abstract art were not fully recognized until decades after her career",
      "Abstract painting in the 1960s was dominated by the Color Field movement",
      "Alma Thomas was the first African American woman to exhibit at the Whitney Museum"
    ],
    "correct": 1,
    "explanation": "The passage covers Thomas's late-career emergence, her artistic significance, and the delayed recognition. B captures the full arc. A is one detail, not the central idea. C and D aren't the passage's focus."
  },
  {
    "prompt": "The octopus's three hearts, blue blood, and ability to change color in milliseconds have made it a subject of intense scientific interest. But it is the animal's cognitive abilities that have most surprised researchers. Octopuses can solve complex puzzles, navigate mazes, and distinguish individual human faces — capabilities previously thought to require the kind of centralized brain structure that octopuses lack. Instead, roughly two-thirds of an octopus's neurons are distributed throughout its eight arms, each of which can act semi-independently. This decentralized nervous system challenges fundamental assumptions about the relationship between brain structure and intelligence.",
    "options": [
      "The octopus's decentralized nervous system challenges traditional assumptions about what brain structures are necessary for intelligence",
      "The eight arms of an octopus operate independently of its central brain",
      "Researchers have successfully trained octopuses to solve puzzles and navigate mazes",
      "Octopuses have three hearts and blue blood, making them biologically unique"
    ],
    "correct": 0,
    "explanation": "The passage starts with physical features, pivots to cognitive abilities (\"But it is...\"), then reveals the surprising mechanism (decentralized neurons) and its implication (challenges assumptions). B captures the core argument. A and D are supporting details."
  },
  {
    "prompt": "In the decades following the Second World War, the Brazilian government pursued an aggressive program of road construction through the Amazon rainforest, motivated by a vision of economic development and national integration. These roads succeeded in opening previously inaccessible regions to farming and mining but also triggered a pattern of deforestation that has since destroyed roughly 17% of the original forest cover. A 2022 study found that deforested areas near roads experienced not only biodiversity loss but also significant changes in local rainfall patterns, suggesting that the ecological consequences of road construction extend far beyond the immediate footprint of the roads themselves.",
    "options": [
      "Brazil's post-war road construction in the Amazon opened regions for economic development but caused ecological damage extending beyond deforestation itself",
      "The Amazon rainforest has lost 17% of its original cover due to farming and mining",
      "A 2022 study demonstrated that deforestation affects rainfall patterns",
      "Road construction is the primary threat to tropical rainforests worldwide"
    ],
    "correct": 0,
    "explanation": "The passage traces roads → economic opening → deforestation → ecological consequences beyond deforestation (rainfall changes). A captures the full arc. B is one statistic, C overgeneralizes (\"worldwide\"), D is one finding."
  }
];

const INFERENCE_ITEMS_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "After implementing a four-day work week in 2022, the technology firm reported a 23% increase in employee satisfaction scores and a 15% reduction in turnover. Productivity metrics, measured by project completion rates and client satisfaction surveys, remained statistically unchanged from the previous year's five-day schedule.",
    "options": [
      "All technology companies should adopt a four-day work week",
      "The company saved money by closing its offices one day per week",
      "A four-day work week always increases productivity",
      "The reduced schedule improved employee well-being without significantly harming output"
    ],
    "correct": 3,
    "explanation": "Satisfaction up, turnover down, productivity unchanged = employees are happier and output didn't suffer. B captures this precisely. A says \"always\" (too strong). C is about cost savings (not mentioned). D overgeneralizes from one company."
  },
  {
    "prompt": "Archaeological evidence from the ancient city of Mohenjo-daro reveals a sophisticated urban drainage system — covered channels running beneath every street, connected to individual household waste outlets. The consistency and precision of this infrastructure across the entire city suggests a level of centralized planning and public health awareness that would not be seen again in urban design for thousands of years.",
    "options": [
      "The city's drainage system indicates that Mohenjo-daro had an organized governmental authority capable of large-scale infrastructure projects",
      "Mohenjo-daro's residents had a greater understanding of germ theory than medieval Europeans",
      "Mohenjo-daro was the largest city in the ancient world",
      "All ancient civilizations had advanced drainage systems"
    ],
    "correct": 0,
    "explanation": "\"Consistency and precision across the entire city\" + \"centralized planning\" = an organized authority must have existed to coordinate this. B follows logically. A jumps to germ theory (not mentioned). C and D are unsupported generalizations."
  },
  {
    "prompt": "Dr. Okafor's study tracked 3,000 adults over fifteen years and found that those who maintained strong social connections had a 50% greater likelihood of survival than those with weaker ties. Notably, this association held regardless of age, sex, initial health status, or socioeconomic position, and the magnitude of the effect was comparable to that of quitting smoking.",
    "options": [
      "The health benefits of social connections are robust across different demographic groups and rival the impact of major health interventions",
      "Lonely people should be prescribed social activities by their doctors",
      "The study proves that loneliness directly causes premature death",
      "Social connections are more important than medical treatment for longevity"
    ],
    "correct": 0,
    "explanation": "The effect \"held regardless of\" demographic factors (robust across groups) and was \"comparable to quitting smoking\" (major health intervention). B captures this. A overstates (\"more important than medical treatment\" — not compared). D says \"proves\" and \"directly causes\" — correlation isn't causation."
  },
  {
    "prompt": "The traditional Japanese art of kintsugi involves repairing broken pottery with lacquer mixed with gold, silver, or platinum. Rather than disguising the damage, the technique highlights the cracks, transforming them into luminous veins that make the repaired object arguably more beautiful — and certainly more valuable — than the original unbroken piece.",
    "options": [
      "Kintsugi is the most popular art form in Japan",
      "Gold is the most commonly used metal in kintsugi repair",
      "The philosophy behind kintsugi values history and imperfection rather than concealing flaws",
      "Japanese pottery is more valuable than pottery from other cultures"
    ],
    "correct": 2,
    "explanation": "\"Rather than disguising\" + \"highlights the cracks\" + \"more beautiful\" = the philosophy VALUES the damage rather than hiding it. B captures this underlying philosophy. A, C, and D aren't supported."
  },
  {
    "prompt": "A longitudinal study of 5,000 children found that those who were read to daily before age three had vocabularies approximately 30% larger than peers who were read to less frequently by the time they entered kindergarten. The researchers noted, however, that the vocabulary gap narrowed significantly by third grade regardless of early reading exposure, suggesting that school-based literacy instruction can substantially compensate for differences in home reading environments.",
    "options": [
      "Schools should replace home reading with intensive vocabulary programs",
      "Reading to children before age three permanently determines their vocabulary size",
      "Children who are not read to before age three can never catch up academically",
      "Early reading provides an initial advantage that school instruction later reduces, suggesting both home and school environments contribute to language development"
    ],
    "correct": 3,
    "explanation": "Initial 30% gap → gap \"narrowed significantly\" by third grade = early reading helps initially but school compensates. B captures both the advantage AND the convergence. A says \"permanently\" (contradicted by narrowing). D says \"never\" (contradicted)."
  },
  {
    "prompt": "Between 2015 and 2023, the city of Copenhagen reduced its carbon emissions by 80% — far exceeding the reductions achieved by any other major European capital during the same period. Officials attribute this success primarily to the city's investment in district heating systems powered by waste incineration and biomass, which supply 99% of the city's heating needs. Critics, however, note that waste incineration produces its own pollutants and that Copenhagen has increasingly imported waste from neighboring countries to fuel its incinerators.",
    "options": [
      "Carbon emissions are the only important measure of environmental impact",
      "Copenhagen should stop using waste incineration immediately",
      "Copenhagen's carbon reduction strategy involves tradeoffs that complicate its environmental record",
      "All European cities should adopt Copenhagen's approach to carbon reduction"
    ],
    "correct": 2,
    "explanation": "Impressive carbon reductions BUT incinerators produce pollutants AND import waste = success comes with complications. A captures this nuance. B, C, D overstate or oversimplify."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 9,
  title: "Central Ideas & Details",
  subtitle:
    "Main ideas, supporting evidence, summaries",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },    { id: "quiz", label: "Quiz", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "flame" },    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARM-UP (Interleaved retrieval from prior modules) ──────── */
  warmup: [
    {
      source: "Module 8 Review",
      stem: "The novelist's ability to capture the ______ of small-town life \u2014 the whispered gossip, the unspoken rivalries, the fierce loyalty \u2014 earned her comparisons to writers who had spent decades in rural communities.\n\nWhich choice completes the text with the most logical and precise word?",
      choices: ["nuances", "monotony", "hardships", "simplicity"],
      correct: 0,
      explanation:
        "'Nuances' = subtle distinctions. The passage lists specific subtle social dynamics, not simplicity or monotony.",
    },
    {
      source: "Module 7 Review",
      stem: "The architect argued that buildings should not merely shelter their inhabitants _______ they should inspire, challenge, and transform the way people experience physical space.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "inhabitants they",
        "inhabitants, they",
        "inhabitants. They",
        "inhabitants; they"
      ],
      correct: 3,
      explanation:
        "Two independent clauses joined by a semicolon. (A) is a comma splice. (C) is a run-on.",
    },
    {
      source: "Module 6 Review",
      stem: "While the journalist's tone throughout the profile remained largely admiring, her choice to include the CEO's evasive responses to questions about labor practices served to _______ the otherwise flattering portrait.\n\nWhich choice completes the text with the most logical and precise word?",
      choices: ["dismiss", "reinforce", "simplify", "complicate"],
      correct: 3,
      explanation:
        "'Complicate' = make less straightforward. Including evasive responses adds a critical dimension to an admiring piece.",
    },
    {
      source: "Module 5 Review",
      stem: "In her analysis of Renaissance patronage, historian Vasquez demonstrated that the Medici family's support for artists was motivated less by aesthetic appreciation than by a calculated desire to project political _______ through cultural dominance.\n\nWhich choice completes the text with the most logical and precise word?",
      choices: ["anonymity", "neutrality", "spontaneity", "legitimacy"],
      correct: 3,
      explanation:
        "'Legitimacy' = the quality of being accepted as valid authority. The Medicis used art to project political power.",
    },
    {
      source: "Module 8 Review",
      stem: "The phenomenon known as 'island gigantism' \u2014 whereby species evolve to be significantly larger on isolated islands than their mainland counterparts \u2014 has been observed in organisms ranging from Komodo dragons to the now-extinct dodo. Biologists attribute the effect primarily to the absence of large predators, which removes the survival advantage of being small enough to hide.\n\nBased on the text, which choice best describes the relationship between predator absence and island gigantism?",
      choices: [
        "Predator absence directly causes genetic mutations that increase body size",
        "Without predators selecting against large body size, there is no disadvantage to growing bigger, allowing larger individuals to thrive",
        "Island environments have more food resources, which causes animals to grow larger",
        "Island gigantism occurs randomly and is unrelated to predator presence"
      ],
      correct: 1,
      explanation:
        "The passage says predator absence 'removes the survival advantage of being small enough to hide' \u2014 meaning without that selective pressure, larger size isn't penalized.",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "intro",
      title: "The Foundation of Reading",
      subtitle: "Understanding what you read",
      body: [
        "Unit 3 covers Information & Ideas \u2014 the comprehension domain. These questions test whether you actually UNDERSTAND what a passage says, what it implies, and what conclusions the evidence supports.",
        "Central Ideas & Details questions ask: What is the passage mainly about? What specific information does the passage provide? These appear roughly 5-6 times per test.",
        "Inference questions ask: What can you reasonably conclude based on the passage? What does the evidence suggest? These appear roughly 2-4 times per test.",
        "Unlike Craft & Structure (HOW it's written) or Conventions (grammar), these questions focus purely on WHAT the passage communicates. The good news: the answer is always in the passage.",
      ],
      visual: "stats",
    },
    {
      id: "central-idea",
      title: "Central Idea Questions",
      subtitle: "What is the passage MAINLY about?",
      body: [
        "Central Idea questions ask you to identify the main point of a passage. The passage might discuss multiple things, but only one choice captures the CENTRAL idea \u2014 the one that everything else supports.",
        "STRATEGY: After reading, ask yourself: \"If I had to summarize this passage in one sentence, what would I say?\" That sentence is the central idea.",
        "COMMON TRAPS:\n\u2022 Too narrow: An answer that describes ONE detail but not the whole passage.\n\u2022 Too broad: An answer so general it could apply to many passages.\n\u2022 Off-topic: An answer about something the passage mentions but isn't the main point.\n\u2022 Distortion: An answer that twists the passage's meaning or overstates its claims.",
        "The best answer is specific enough to distinguish this passage from others, but broad enough to cover the whole passage \u2014 not just one paragraph.",
      ],
      visual: "scope-visual",
    },
    {
      id: "details",
      title: "Supporting Detail Questions",
      subtitle: "What does the passage specifically state?",
      body: [
        "Detail questions ask about specific information stated in the passage. The answer is explicitly there \u2014 you just need to find it.",
        "These questions often begin with:\n\u2022 \"According to the passage...\"\n\u2022 \"The passage states that...\"\n\u2022 \"Which detail from the passage supports...\"",
        "STRATEGY: When you see a detail question, go back to the passage. Don't rely on memory. Find the exact sentence that answers the question, then match it to a choice.",
        "TRAP: Answer choices that are TRUE in real life but NOT stated in the passage. The SAT tests whether you can distinguish between what a passage actually says and what you already know about the topic.",
      ],
    },
    {
      id: "inference",
      title: "Inference Questions",
      subtitle: "What can you REASONABLY conclude?",
      body: [
        "Inference questions ask what the passage IMPLIES without directly stating. This is the hardest comprehension skill because it requires reading between the lines.",
        "An inference is NOT a guess. It's a logical conclusion supported by evidence in the passage. Think of it as: What MUST be true based on what the passage says?",
        "EXAMPLE: A passage says \"After the regulation was enacted, pollution levels in the river decreased by 40% over three years.\"\nVALID inference: The regulation was at least somewhat effective at reducing pollution.\nINVALID inference: The regulation was the ONLY reason pollution decreased. (Maybe other factors contributed.)",
        "RULE: The correct inference is the one that requires the SMALLEST logical leap from what's stated. If you have to assume multiple unstated things to reach a conclusion, it's probably wrong.",
      ],
      visual: "inference-scale",
    },
    {
      id: "summary",
      title: "Summary Questions",
      subtitle: "Which choice best summarizes the passage?",
      body: [
        "Summary questions are a variant of Central Idea. Instead of asking for the main point, they ask which choice best summarizes the passage's content.",
        "A good summary:\n\u2022 Captures the main idea and key supporting points\n\u2022 Maintains the passage's emphasis (doesn't elevate minor details)\n\u2022 Preserves the passage's tone and perspective\n\u2022 Doesn't add information not in the passage",
        "A bad summary:\n\u2022 Focuses on one paragraph while ignoring others\n\u2022 Changes the passage's emphasis or conclusion\n\u2022 Includes the reader's opinions or outside knowledge\n\u2022 Overstates or understates the passage's claims",
        "STRATEGY: Check each answer choice against every part of the passage. If an answer ignores a major section or elevates a minor detail, it's incomplete.",
      ],
    },
    {
      id: "literary",
      title: "Reading Literary Passages",
      subtitle: "Fiction and poetry on the SAT",
      body: [
        "About 20-25% of SAT passages are literary \u2014 fiction excerpts or poems. These require slightly different reading strategies:",
        "CHARACTERS: Who is the narrator? Who are the characters? What is their relationship? What is the emotional dynamic?",
        "TONE/MOOD: What atmosphere does the passage create? Is the narrator nostalgic, anxious, reflective, detached? Literary passages often test your ability to read emotional register.",
        "FIGURATIVE LANGUAGE: Literary passages may use metaphor, simile, imagery, or symbolism. The SAT won't ask you to identify literary devices by name, but it will ask what the language SUGGESTS or what effect it creates.",
        "STRATEGY: For literary passages, pay extra attention to the emotional arc. What does the character feel at the beginning? Does it change? The central idea of a literary passage is often about an emotional realization or a shift in perspective.",
      ],
      visual: "literary-elements",
    },
    {
      id: "science-social",
      title: "Reading Science & Social Science",
      subtitle: "Data-rich informational passages",
      body: [
        "About 50-60% of SAT passages are informational \u2014 science, social science, and history. These passages often present research findings, arguments, or analyses.",
        "SCIENCE PASSAGES: Focus on the CLAIM, the EVIDENCE, and the CONCLUSION. What did the researchers find? What does it mean? What are the limitations?",
        "SOCIAL SCIENCE PASSAGES: Focus on the ARGUMENT and the EVIDENCE. What position is the author taking? What supports it? Is there a counterargument?",
        "KEY SKILL: Distinguishing between what the passage CLAIMS and what it PROVES. A passage might claim that X causes Y, but the evidence might only show a correlation, not causation. The SAT tests whether you can catch this distinction.",
        "DATA: Some passages include tables, graphs, or charts. When they do, the questions will ask you to connect the data to the passage's claims. We'll cover this in detail in Module 10.",
      ],
    },
    {
      id: "framework",
      title: "The Comprehension Framework",
      subtitle: "Your approach for every reading question",
      body: [
        "STEP 1: Read the passage actively. Don't just let words wash over you. As you read, identify: What is the topic? What is the author's position or the passage's main point? What evidence is given?",
        "STEP 2: Identify the question type. Is it asking for the central idea, a specific detail, an inference, or a summary? This tells you WHERE to look and HOW to evaluate answers.",
        "STEP 3: For detail questions, go back to the passage and find the specific sentence. For inference questions, find the evidence that supports the conclusion.",
        "STEP 4: Evaluate each answer choice against the passage. The correct answer must be fully supported. If any part of an answer contradicts the passage or requires unstated assumptions, eliminate it.",
        "GOLDEN RULE: The answer is always in the passage. If you can't point to specific text that supports your choice, reconsider.",
      ],
      visual: "framework-visual",
    },
  ],

  /* ──────── QUIZ ──────── */
  quiz: [
    {
      passage:
        "Researchers at MIT have developed a new desalination membrane that uses graphene oxide to filter salt from seawater at a fraction of the energy cost of conventional reverse-osmosis systems. In laboratory tests, the membrane removed 99.6% of sodium chloride while allowing water to pass through at rates up to ten times faster than existing commercial membranes. The team estimates that if the technology can be scaled to industrial production, it could reduce the cost of desalinated water by up to 70%, potentially transforming access to clean drinking water in arid coastal regions worldwide.",
      stem: "Which choice best states the main idea of the text?",
      choices: [
        "Reverse-osmosis systems are too expensive for widespread use",
        "MIT has developed a new type of graphene oxide material",
        "Arid coastal regions currently lack access to clean drinking water",
        "A new desalination technology could dramatically reduce the cost of converting seawater to drinking water"
      ],
      correct: 3,
      explanation:
        "The passage describes a new technology, its lab performance, and its potential to reduce desalination costs by 70%. B captures the core: new tech + dramatic cost reduction potential.",
      type: "central",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The monarch butterfly's annual migration spans up to 3,000 miles, from breeding grounds in the northern United States and Canada to overwintering sites in the oyamel fir forests of central Mexico. Unlike most migratory species, no single monarch completes the entire round trip. The northward journey takes three to four generations, with each successive generation flying a portion of the route before reproducing and dying. Only the 'super generation' born in late summer makes the complete southward journey, living up to eight months \u2014 roughly eight times longer than its parents.",
      stem: "According to the passage, what is distinctive about the 'super generation' of monarch butterflies?",
      choices: [
        "They make the complete southward migration and live significantly longer than other generations",
        "They are the largest monarchs ever recorded",
        "They can fly faster than other generations of monarchs",
        "They breed exclusively in the oyamel fir forests"
      ],
      correct: 0,
      explanation:
        "The passage explicitly states the super generation \"makes the complete southward journey\" and lives \"up to eight months \u2014 roughly eight times longer.\" B matches these specific details.",
      type: "detail",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A team of marine biologists studying deep-sea hydrothermal vents discovered thriving communities of organisms \u2014 giant tube worms, eyeless shrimp, and chemosynthetic bacteria \u2014 at depths where sunlight never penetrates and water temperatures exceed 400\u00B0C. These ecosystems derive their energy not from photosynthesis but from chemical reactions between minerals released by the vents and the surrounding seawater, a process called chemosynthesis.",
      stem: "Which inference is best supported by the text?",
      choices: [
        "Deep-sea organisms are more evolved than surface-dwelling organisms",
        "Hydrothermal vents are found in all of Earth's oceans",
        "Chemosynthesis produces more energy than photosynthesis",
        "Life can exist independently of sunlight by utilizing alternative energy sources"
      ],
      correct: 3,
      explanation:
        "Organisms thrive without sunlight using chemosynthesis = life doesn't require solar energy. B is the logical inference. A (\"more evolved\"), C (\"all oceans\"), D (\"more energy\") aren't supported.",
      type: "inference",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "When cognitive psychologist George Miller published his famous 1956 paper 'The Magical Number Seven, Plus or Minus Two,' he proposed that human short-term memory has a limited capacity of roughly seven items. Subsequent research, however, has substantially revised this estimate downward. Psychologist Nelson Cowan's influential 2001 review concluded that the true capacity is closer to four items, and that Miller's higher estimate reflected participants' use of 'chunking' \u2014 the unconscious grouping of individual items into larger meaningful units. A phone number like 8005551234, for instance, is ten digits but can be chunked into three groups (800-555-1234), effectively reducing the memory load.",
      stem: "Which choice best states the main idea of the text?",
      choices: [
        "Nelson Cowan's research disproved all previous theories about memory",
        "George Miller's research on short-term memory was fundamentally wrong",
        "Phone numbers are easier to remember when broken into groups",
        "The capacity of short-term memory is smaller than originally proposed, with the earlier estimate inflated by the brain's tendency to group information"
      ],
      correct: 3,
      explanation:
        "The passage presents Miller's original finding, then shows how later research revised it downward by identifying chunking as a confound. B captures both the revision and the explanation.",
      type: "central",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "In her landmark 1962 book Silent Spring, Rachel Carson documented the devastating effects of the pesticide DDT on bird populations, particularly its role in thinning eggshells to the point that parent birds crushed their own eggs. The book sparked a public outcry that led directly to the establishment of the Environmental Protection Agency in 1970 and a nationwide ban on DDT in 1972. Today, populations of bald eagles, peregrine falcons, and brown pelicans \u2014 all species driven to the brink of extinction by DDT \u2014 have made dramatic recoveries.",
      stem: "Which inference is best supported by the text?",
      choices: [
        "All endangered species will eventually recover if given enough time",
        "DDT is the only chemical that has ever threatened bird populations",
        "Public awareness and policy action can successfully reverse environmental damage caused by human activity",
        "Rachel Carson personally lobbied Congress to create the EPA"
      ],
      correct: 2,
      explanation:
        "Book \u2192 public outcry \u2192 policy changes \u2192 species recovery = public awareness + policy can reverse damage. B captures this chain. A isn't stated. C (\"only\") and D (\"all\") overgeneralize.",
      type: "inference",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The house had been emptied of everything but echoes. Mara stood in the doorway of what had been her grandmother's kitchen, where the air still carried the ghost of cardamom and burned sugar. The linoleum, once hidden beneath a patchwork of rugs her grandmother had collected from three continents, now stretched bare and scarred beneath the overhead light. She had come to collect the last of the boxes, but instead found herself standing very still, listening to the house breathe without its furniture, its curtains, its voice.",
      stem: "Which choice best describes the main effect of the passage?",
      choices: [
        "It provides detailed information about the grandmother's multicultural background",
        "It establishes a tense, suspenseful mood suggesting something dangerous is about to happen",
        "It conveys a sense of accomplishment as Mara completes a difficult task",
        "It creates an atmosphere of loss and absence as a character encounters a space emptied of its former life"
      ],
      correct: 3,
      explanation:
        "\"Emptied of everything but echoes,\" \"ghost of cardamom,\" \"bare and scarred,\" \"breathe without its furniture\" = the passage is saturated with absence and loss. B captures the emotional effect. A (accomplishment) misreads the tone.",
      type: "literary",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Behavioral economist Richard Thaler's concept of 'nudging' \u2014 designing choice environments to guide people toward better decisions without restricting their options \u2014 has been widely adopted by governments worldwide. The UK's Behavioural Insights Team, for example, increased organ donor registration by 100,000 per year simply by changing the default option on driver's license forms. However, philosopher Cass Sunstein, who co-authored the original work on nudging with Thaler, has recently acknowledged that nudges are most effective for simple, one-time decisions and may be insufficient for addressing deeply entrenched behaviors such as chronic overeating or persistent financial mismanagement, which require more sustained interventions.",
      stem: "Which choice best states the main idea of the text?",
      choices: [
        "While nudging has demonstrated success for simple behavioral changes, its limitations for more complex, persistent behaviors are increasingly recognized",
        "Richard Thaler and Cass Sunstein fundamentally disagree about behavioral economics",
        "Governments should stop using nudging and adopt stricter regulatory approaches",
        "Nudging has been proven ineffective as a policy tool"
      ],
      correct: 0,
      explanation:
        "Success examples (organ donation) + but limitations for complex behaviors (Sunstein's acknowledgment) = effective but with recognized limits. B captures both the success and the qualification.",
      type: "central",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A 2024 study of 12,000 scientific papers found that research conducted by teams spanning multiple institutions and countries was cited 45% more frequently than single-institution studies, even after controlling for factors such as journal prestige, author reputation, and research funding levels. The citation advantage was most pronounced in interdisciplinary fields and least pronounced in highly specialized subfields where a single laboratory might possess all necessary expertise.",
      stem: "Which inference is best supported by the text?",
      choices: [
        "Multi-institution research is always of higher quality than single-institution research",
        "Citation count is the only valid measure of research quality",
        "Highly specialized research has less scientific value than interdisciplinary research",
        "Collaborative research across institutions may produce work of broader impact, particularly in fields requiring diverse expertise"
      ],
      correct: 3,
      explanation:
        "Higher citations for multi-institution work + most pronounced in interdisciplinary fields = collaboration produces broader impact, especially where diverse expertise helps. B uses appropriate hedging (\"may\"). A says \"always\" (too strong).",
      type: "inference",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "We were the last to leave the lake that summer, my father and I. The other cabins had shuttered their windows weeks before, their docks pulled ashore like beached canoes. But my father kept finding reasons to stay \u2014 a fence that needed mending, a shutter that had come loose, the northern pike that he swore was getting bigger each day and would certainly take his lure tomorrow. I was twelve and understood none of this. I understand now that he was not fixing fences. He was holding the door open against something that was coming, something that had already arrived in the careful way my mother folded her clothes into suitcases back in the city.",
      stem: "Which inference is best supported by the text?",
      choices: [
        "The narrator did not enjoy spending summers at the lake",
        "The family could not afford to return to the city",
        "The narrator's father was an avid fisherman who loved spending time outdoors",
        "The narrator's parents' marriage was ending, and the father was delaying the family's return to avoid confronting this reality"
      ],
      correct: 3,
      explanation:
        "\"Holding the door open against something that was coming\" + \"already arrived\" + mother \"folding clothes into suitcases\" (suggesting departure/separation) = the father was avoiding the end of the marriage. The narrator says they didn't understand at 12 but understands now.",
      type: "literary",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The discovery that certain gut bacteria can metabolize the immunosuppressive drug tacrolimus has forced a fundamental reconsideration of how medications are dosed. Transplant patients who harbor high levels of the bacterium Faecalibacterium prausnitzii require significantly higher doses of tacrolimus to achieve therapeutic blood levels \u2014 in some cases, up to three times the standard dose. Gastroenterologist Dr. Nasir Malik proposes that routine gut microbiome profiling before transplant surgery could allow physicians to personalize drug dosages based on each patient's bacterial composition, potentially reducing both drug toxicity from overdosing and organ rejection from underdosing.",
      stem: "Which choice best states the main idea of the text?",
      choices: [
        "Tacrolimus is an ineffective immunosuppressive drug",
        "All patients should undergo microbiome profiling as part of routine medical care",
        "The interaction between gut bacteria and drug metabolism may require personalized dosing based on individual microbiome profiles",
        "Gut bacteria are harmful to transplant patients and should be eliminated before surgery"
      ],
      correct: 2,
      explanation:
        "Bacteria affect drug metabolism \u2192 patients need different doses \u2192 proposal for personalized dosing based on microbiome. B captures the central argument: bacteria-drug interaction necessitates personalized approaches.",
      type: "central",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  /* ──────── CHALLENGE (Main Idea + Inference practice items) ──────── */
  challenge: [
    {
      passage:
        "For decades, the prevailing theory held that the extinction of large Ice Age mammals \u2014 mammoths, giant sloths, saber-toothed cats \u2014 was driven primarily by human hunting. However, a 2023 study analyzing fossilized pollen and sediment layers across North America revealed that many of these species had already begun declining centuries before humans arrived on the continent. The researchers argue that rapid climate shifts at the end of the Pleistocene disrupted the ecosystems these animals depended on, and that human hunting, while a contributing factor, merely accelerated an extinction process already underway.",
      stem: "Which choice best states the main idea of the passage?",
      choices: [
        "The Pleistocene era was characterized by extreme weather events that affected all animal species equally",
        "Human hunting was the sole cause of Ice Age mammal extinctions",
        "A study suggests that climate change, not just human hunting, played a primary role in Ice Age extinctions",
        "Scientists have discovered new fossils of Ice Age mammals in North America"
      ],
      correct: 2,
      explanation:
        "The passage presents a traditional theory (human hunting) and then a newer study that challenges it (climate-driven decline preceded humans). B captures both the challenge and the nuance (not JUST hunting). A is the old view being challenged. C and D misrepresent the content.",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "When Alma Thomas began exhibiting her vibrant abstract paintings in the 1960s, she was already in her seventies \u2014 a Black woman artist entering the mainstream art world at an age when most careers are winding down. Her mosaic-like compositions, inspired by the view of flowers and trees from her Washington, D.C., window, employed bold bands of color that anticipated developments in Color Field painting. Though she received significant recognition in her final years, including becoming the first African American woman to have a solo exhibition at the Whitney Museum, Thomas's contributions to American abstraction remained largely overlooked by art historians until a major reassessment began in the 2010s.",
      stem: "Which choice best states the main idea of the passage?",
      choices: [
        "Washington, D.C., has produced many important American artists",
        "Alma Thomas's significant contributions to American abstract art were not fully recognized until decades after her career",
        "Abstract painting in the 1960s was dominated by the Color Field movement",
        "Alma Thomas was the first African American woman to exhibit at the Whitney Museum"
      ],
      correct: 1,
      explanation:
        "The passage covers Thomas's late-career emergence, her artistic significance, and the delayed recognition. B captures the full arc. A is one detail, not the central idea. C and D aren't the passage's focus.",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The octopus's three hearts, blue blood, and ability to change color in milliseconds have made it a subject of intense scientific interest. But it is the animal's cognitive abilities that have most surprised researchers. Octopuses can solve complex puzzles, navigate mazes, and distinguish individual human faces \u2014 capabilities previously thought to require the kind of centralized brain structure that octopuses lack. Instead, roughly two-thirds of an octopus's neurons are distributed throughout its eight arms, each of which can act semi-independently. This decentralized nervous system challenges fundamental assumptions about the relationship between brain structure and intelligence.",
      stem: "Which choice best states the main idea of the passage?",
      choices: [
        "The octopus's decentralized nervous system challenges traditional assumptions about what brain structures are necessary for intelligence",
        "The eight arms of an octopus operate independently of its central brain",
        "Researchers have successfully trained octopuses to solve puzzles and navigate mazes",
        "Octopuses have three hearts and blue blood, making them biologically unique"
      ],
      correct: 0,
      explanation:
        "The passage starts with physical features, pivots to cognitive abilities (\"But it is...\"), then reveals the surprising mechanism (decentralized neurons) and its implication (challenges assumptions). B captures the core argument. A and D are supporting details.",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "In the decades following the Second World War, the Brazilian government pursued an aggressive program of road construction through the Amazon rainforest, motivated by a vision of economic development and national integration. These roads succeeded in opening previously inaccessible regions to farming and mining but also triggered a pattern of deforestation that has since destroyed roughly 17% of the original forest cover. A 2022 study found that deforested areas near roads experienced not only biodiversity loss but also significant changes in local rainfall patterns, suggesting that the ecological consequences of road construction extend far beyond the immediate footprint of the roads themselves.",
      stem: "Which choice best states the main idea of the passage?",
      choices: [
        "Brazil's post-war road construction in the Amazon opened regions for economic development but caused ecological damage extending beyond deforestation itself",
        "The Amazon rainforest has lost 17% of its original cover due to farming and mining",
        "A 2022 study demonstrated that deforestation affects rainfall patterns",
        "Road construction is the primary threat to tropical rainforests worldwide"
      ],
      correct: 0,
      explanation:
        "The passage traces roads \u2192 economic opening \u2192 deforestation \u2192 ecological consequences beyond deforestation (rainfall changes). A captures the full arc. B is one statistic, C overgeneralizes (\"worldwide\"), D is one finding.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "After implementing a four-day work week in 2022, the technology firm reported a 23% increase in employee satisfaction scores and a 15% reduction in turnover. Productivity metrics, measured by project completion rates and client satisfaction surveys, remained statistically unchanged from the previous year's five-day schedule.",
      stem: "Which inference is best supported by the passage?",
      choices: [
        "All technology companies should adopt a four-day work week",
        "The company saved money by closing its offices one day per week",
        "A four-day work week always increases productivity",
        "The reduced schedule improved employee well-being without significantly harming output"
      ],
      correct: 3,
      explanation:
        "Satisfaction up, turnover down, productivity unchanged = employees are happier and output didn't suffer. B captures this precisely. A says \"always\" (too strong). C is about cost savings (not mentioned). D overgeneralizes from one company.",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Archaeological evidence from the ancient city of Mohenjo-daro reveals a sophisticated urban drainage system \u2014 covered channels running beneath every street, connected to individual household waste outlets. The consistency and precision of this infrastructure across the entire city suggests a level of centralized planning and public health awareness that would not be seen again in urban design for thousands of years.",
      stem: "Which inference is best supported by the passage?",
      choices: [
        "The city's drainage system indicates that Mohenjo-daro had an organized governmental authority capable of large-scale infrastructure projects",
        "Mohenjo-daro's residents had a greater understanding of germ theory than medieval Europeans",
        "Mohenjo-daro was the largest city in the ancient world",
        "All ancient civilizations had advanced drainage systems"
      ],
      correct: 0,
      explanation:
        "\"Consistency and precision across the entire city\" + \"centralized planning\" = an organized authority must have existed to coordinate this. B follows logically. A jumps to germ theory (not mentioned). C and D are unsupported generalizations.",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Dr. Okafor's study tracked 3,000 adults over fifteen years and found that those who maintained strong social connections had a 50% greater likelihood of survival than those with weaker ties. Notably, this association held regardless of age, sex, initial health status, or socioeconomic position, and the magnitude of the effect was comparable to that of quitting smoking.",
      stem: "Which inference is best supported by the passage?",
      choices: [
        "The health benefits of social connections are robust across different demographic groups and rival the impact of major health interventions",
        "Lonely people should be prescribed social activities by their doctors",
        "The study proves that loneliness directly causes premature death",
        "Social connections are more important than medical treatment for longevity"
      ],
      correct: 0,
      explanation:
        "The effect \"held regardless of\" demographic factors (robust across groups) and was \"comparable to quitting smoking\" (major health intervention). B captures this. A overstates (\"more important than medical treatment\" \u2014 not compared). D says \"proves\" and \"directly causes\" \u2014 correlation isn't causation.",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The traditional Japanese art of kintsugi involves repairing broken pottery with lacquer mixed with gold, silver, or platinum. Rather than disguising the damage, the technique highlights the cracks, transforming them into luminous veins that make the repaired object arguably more beautiful \u2014 and certainly more valuable \u2014 than the original unbroken piece.",
      stem: "Which inference is best supported by the passage?",
      choices: [
        "Kintsugi is the most popular art form in Japan",
        "Gold is the most commonly used metal in kintsugi repair",
        "The philosophy behind kintsugi values history and imperfection rather than concealing flaws",
        "Japanese pottery is more valuable than pottery from other cultures"
      ],
      correct: 2,
      explanation:
        "\"Rather than disguising\" + \"highlights the cracks\" + \"more beautiful\" = the philosophy VALUES the damage rather than hiding it. B captures this underlying philosophy. A, C, and D aren't supported.",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A longitudinal study of 5,000 children found that those who were read to daily before age three had vocabularies approximately 30% larger than peers who were read to less frequently by the time they entered kindergarten. The researchers noted, however, that the vocabulary gap narrowed significantly by third grade regardless of early reading exposure, suggesting that school-based literacy instruction can substantially compensate for differences in home reading environments.",
      stem: "Which inference is best supported by the passage?",
      choices: [
        "Schools should replace home reading with intensive vocabulary programs",
        "Reading to children before age three permanently determines their vocabulary size",
        "Children who are not read to before age three can never catch up academically",
        "Early reading provides an initial advantage that school instruction later reduces, suggesting both home and school environments contribute to language development"
      ],
      correct: 3,
      explanation:
        "Initial 30% gap \u2192 gap \"narrowed significantly\" by third grade = early reading helps initially but school compensates. B captures both the advantage AND the convergence. A says \"permanently\" (contradicted by narrowing). D says \"never\" (contradicted).",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Between 2015 and 2023, the city of Copenhagen reduced its carbon emissions by 80% \u2014 far exceeding the reductions achieved by any other major European capital during the same period. Officials attribute this success primarily to the city's investment in district heating systems powered by waste incineration and biomass, which supply 99% of the city's heating needs. Critics, however, note that waste incineration produces its own pollutants and that Copenhagen has increasingly imported waste from neighboring countries to fuel its incinerators.",
      stem: "Which inference is best supported by the passage?",
      choices: [
        "Carbon emissions are the only important measure of environmental impact",
        "Copenhagen should stop using waste incineration immediately",
        "Copenhagen's carbon reduction strategy involves tradeoffs that complicate its environmental record",
        "All European cities should adopt Copenhagen's approach to carbon reduction"
      ],
      correct: 2,
      explanation:
        "Impressive carbon reductions BUT incinerators produce pollutants AND import waste = success comes with complications. A captures this nuance. B, C, D overstate or oversimplify.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  takeaways: [
    "The answer is always in the passage — summarize in one sentence before looking at choices.",
    "For main idea questions, check scope — the correct answer is not too broad and not too narrow.",
    "For detail questions, go back to the passage and find the exact sentence that answers the question.",
    "For inference questions, choose the smallest logical leap from the evidence — avoid answers that overstate.",
    "When missing easy questions, slow down and re-read the relevant part of the passage before choosing.",
  ],
};
