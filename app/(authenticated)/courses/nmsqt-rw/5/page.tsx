"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  ScopeTrapVisual,
  HedgingVisual,
  PredictionMethodVisual,
} from "./lesson-visuals";

export default function NMSQTRWModule5() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/nmsqt-rw/6"
      nextModuleLabel="Module 6: Command of Evidence"
      visuals={{
        "scope-trap": <ScopeTrapVisual />,
        "hedging": <HedgingVisual />,
        "prediction-method": <PredictionMethodVisual />,
      }}
      activities={{
        "exercise-scope": (goNext: () => void) => (
          <MatchingExercise
            items={SCOPE_EXERCISE_DATA}
            title="Scope"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-infer": (goNext: () => void) => (
          <MatchingExercise
            items={INFER_EXERCISE_DATA}
            title="Infer"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}
    />
  );
}

const SCOPE_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Neuroscientist Dr. Maria Chen has found that bilingual individuals show significantly greater gray matter density in regions of the brain associated with executive function. Her longitudinal study of 500 adults revealed that those who actively used two languages daily outperformed monolinguals on tasks requiring cognitive flexibility, even when controlling for education level and socioeconomic status.",
    "options": [
      "Learning a second language is the most effective way to improve cognitive abilities.",
      "Education level has no effect on cognitive flexibility.",
      "Dr. Chen has conducted the largest study of bilingualism ever undertaken.",
      "Bilingualism provides significant cognitive advantages through increased brain density in areas linked to executive function."
    ],
    "correct": 3,
    "explanation": "(A) ✓ Correct scope — captures the study's finding without overstating.\n(B) ✗ Too Broad + Unsupported — \"most effective way\" is not claimed.\n(C) ✗ Off-Topic — \"largest study ever\" is not stated.\n(D) ✗ Contradicts — the study controlled for education, not dismissed it."
  },
  {
    "prompt": "The James Webb Space Telescope's first deep-field image revealed thousands of galaxies in a patch of sky roughly the size of a grain of sand held at arm's length. Among these, astronomers identified several galaxies that appear to have formed within 300 million years of the Big Bang — far earlier than existing models predicted was possible. The discovery has prompted a reexamination of current theories about the rate of galaxy formation in the early universe.",
    "options": [
      "The JWST is the most powerful telescope ever built.",
      "The JWST has discovered galaxies that formed earlier than expected, challenging existing models of early galaxy formation.",
      "The Big Bang theory is now considered incorrect by most astronomers.",
      "JWST images show galaxies in a very small area of sky."
    ],
    "correct": 1,
    "explanation": "(A) ✓ Correct — captures the discovery and its significance precisely.\n(B) ✗ Off-Topic — telescope capability isn't the passage's point.\n(C) ✗ Too Broad / Contradicts — the passage says models need reexamination, not that the Big Bang theory is wrong.\n(D) ✗ Too Narrow — this is one detail, not the main point."
  },
  {
    "prompt": "In a clinical trial involving 3,200 participants with chronic insomnia, researchers found that cognitive behavioral therapy for insomnia (CBT-I) produced sleep improvements that persisted for at least 12 months after treatment ended. By contrast, participants who received sleep medication showed initial improvements but returned to baseline levels within three months of discontinuing the drugs. The researchers noted that CBT-I addresses the underlying thought patterns and behaviors that perpetuate insomnia rather than merely treating symptoms.",
    "options": [
      "CBT-I produces more durable improvements in chronic insomnia than medication because it addresses root causes rather than symptoms.",
      "A study of 3,200 participants compared CBT-I with medication.",
      "Sleep medication is completely ineffective for treating insomnia.",
      "All people with insomnia should stop taking medication immediately."
    ],
    "correct": 0,
    "explanation": "(A) ✓ Correct — captures the comparison and the mechanism.\n(B) ✗ Too Broad / Contradicts — medication showed \"initial improvements,\" so it's not completely ineffective.\n(C) ✗ Too Narrow — restates the study design, not the finding.\n(D) ✗ Off-Topic / Unsupported — the passage makes no such recommendation."
  }
];

const INFER_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "Arctic foxes undergo a dramatic seasonal color change, shifting from brown in summer to white in winter. Researchers studying a population in Iceland, however, have noticed that an increasing number of foxes retain their brown coats through the winter months. The trend correlates closely with rising average winter temperatures in the region over the past two decades. Based on these observations, the researchers suggest that _______",
    "options": [
      "reduced snow cover is making brown coats more advantageous for winter camouflage in some regions.",
      "temperature directly controls fur color through a simple genetic switch.",
      "white fur is no longer useful for Arctic foxes in any environment.",
      "Arctic foxes are evolving to become a different species."
    ],
    "correct": 0,
    "explanation": "The passage links rising temperatures → less snow cover (implied) → brown coats persist. (B) connects all three elements precisely. (A) \"any environment\" is too absolute. (C) speciation is unsupported. (D) the passage shows correlation, not a direct genetic mechanism."
  },
  {
    "prompt": "A team of economists studied the impact of remote work policies on urban commercial real estate in 15 major cities between 2020 and 2024. They found that office vacancy rates rose by an average of 18 percentage points, while residential rents in suburban areas within commuting distance increased by 12%. Meanwhile, commercial property values in downtown cores declined by 24% on average. The economists concluded that _______",
    "options": [
      "remote work policies have had no meaningful impact on the housing market.",
      "all downtown commercial real estate will eventually become worthless.",
      "the pandemic caused temporary disruptions that will reverse within five years.",
      "remote work has created a permanent shift in demand from urban commercial spaces to suburban residential areas."
    ],
    "correct": 3,
    "explanation": "The data shows office vacancies up + suburban rents up + downtown values down = demand shift. (A) matches this precisely. (B) \"worthless\" is extreme. (C) contradicts the 12% suburban rent increase. (D) \"temporary\" and \"five years\" are unsupported."
  },
  {
    "prompt": "Paleontologists studying fossilized dinosaur footprints in a Colorado river bed discovered something unexpected: alongside the massive sauropod tracks, they found numerous parallel trackways of smaller theropods moving in the same direction at consistent spacing. The smaller tracks showed no signs of pursuit behavior — no sudden acceleration, no diverging paths. The researchers propose that _______",
    "options": [
      "the footprints were made at different times and only appear to be contemporaneous.",
      "all dinosaurs were social animals that traveled in herds.",
      "theropods were always peaceful herbivores despite their predatory anatomy.",
      "some theropod species may have moved in coordinated groups alongside larger dinosaurs rather than hunting them."
    ],
    "correct": 3,
    "explanation": "Parallel tracks + same direction + consistent spacing + no pursuit behavior = coordinated movement. (A) captures this with appropriate hedging (\"may have\"). (B) \"all dinosaurs\" is far too broad. (C) \"always peaceful herbivores\" contradicts known science and goes beyond the passage. (D) contradicts the researchers' interpretation."
  },
  {
    "prompt": "Marine biologists monitoring coral reefs in the Maldives observed that while most coral species experienced severe bleaching during the 2023 heat wave, colonies of Porites lobata showed minimal stress responses. Genetic analysis revealed that these colonies carried a heat-resistant variant of a symbiotic algae species that most other coral types lack. The biologists suggest that _______",
    "options": [
      "the heat wave had no negative effects on coral reefs in the Maldives.",
      "Porites lobata will be the only coral species to survive climate change.",
      "coral bleaching is no longer a significant threat to marine ecosystems.",
      "the presence of heat-resistant algae variants may determine which coral species survive warming ocean temperatures."
    ],
    "correct": 3,
    "explanation": "Heat-resistant algae → specific corals survived bleaching. (A) logically extends this finding. (B) contradicts \"severe bleaching\" in most species. (C) \"only species\" is unsupported extreme. (D) contradicts \"severe bleaching\" in most species."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "rw",
  moduleNum: 5,
  title: "Central Ideas & Inferences",
  subtitle:
    "Main ideas, supporting details, and drawing conclusions -- read for what the passage proves, not what it says.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-scope", label: "Scope", icon: "zap" },
    { id: "exercise-infer", label: "Infer", icon: "zap" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "flame" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  warmup: [
    {
      source: "Module 4 -- Words in Context",
      stem: "The documentary revealed that the company had systematically _______ evidence of contamination, concealing test results from regulators for over a decade.\n\nWhich word best completes the text?",
      choices: ["analyzed", "generated", "suppressed", "distributed"],
      correct: 2,
      explanation: '"Concealing test results from regulators" = hiding evidence. "Suppressed."',
    },
    {
      source: "Module 3 -- Agreement",
      stem: "The committee, along with several external advisors and two former board _______ unanimously approved the revised charter.\n\nWhich choice conforms to Standard English?",
      choices: ["members have", "members, has", "members, have", "members; has"],
      correct: 1,
      explanation: '"Committee" (singular) is the subject. "Along with...members" is parenthetical.',
    },
    {
      source: "Module 4 -- Words in Context",
      stem: "The playwright's early comedies were lighthearted and _______ , relying on physical humor and simple misunderstandings to entertain audiences.\n\nWhich word best completes the text?",
      choices: ["somber", "provocative", "austere", "whimsical"],
      correct: 3,
      explanation: '"Lighthearted," "physical humor," "simple misunderstandings" = playful. "Whimsical."',
    },
    {
      source: "Module 2 -- Boundaries",
      stem: "Because the telescope's primary mirror had been ground to the wrong _______ NASA engineers designed corrective optics that could be installed during a spacewalk.\n\nWhich choice conforms to Standard English?",
      choices: ["specifications. NASA", "specifications; NASA", "specifications, NASA", "specifications NASA"],
      correct: 2,
      explanation: '"Because...specifications" is a dependent clause. A comma separates it from the IC.',
    },
    {
      source: "Module 4 -- Words in Context",
      stem: "The negotiations between the two corporations had stalled for months, with each side _______ to make the first concession on the revenue-sharing arrangement.\n\nWhich word best completes the text?",
      choices: ["reluctant", "obligated", "eager", "prepared"],
      correct: 0,
      explanation: '"Stalled for months" signals no progress. "Reluctant" = unwilling.',
    },
    {
      source: "Module 3 -- Agreement",
      stem: "Neither the original hypothesis nor the two alternative explanations proposed by the research _______ consistent with the experimental data.\n\nWhich choice conforms to Standard English?",
      choices: ["team, was", "team were", "team, were", "team was"],
      correct: 1,
      explanation: 'With "neither...nor," the verb agrees with the nearer subject: "explanations" (plural) = "were."',
    },
    {
      source: "Module 4 -- Words in Context",
      stem: "The city\u2019s decision to convert abandoned railway lines into elevated parks _______ both its commitment to green space and its creative approach to urban renewal.\n\nWhich word best completes the text?",
      choices: ["exemplified", "questioned", "obscured", "undermined"],
      correct: 0,
      explanation: 'Converting railways into parks shows commitment and creativity. "Exemplified" = served as a typical example of.',
    },
    {
      source: "Module 2 -- Boundaries",
      stem: "The orchestra performed the symphony with technical precision _______ the emotional depth of the interpretation left many audience members visibly moved.\n\nWhich choice conforms to Standard English?",
      choices: ["and; the", "and, the", "and the", ", and the"],
      correct: 3,
      explanation: 'Two ICs joined by comma + "and" (FANBOYS). The comma goes before "and," not after it.',
    },
  ],

  lessons: [
    {
      id: "central-ideas",
      title: "Central Ideas: The Scope Trap",
      subtitle: "Not too broad, not too narrow",
      visual: "scope-trap",
      body: [
        "Central Ideas questions (~$5$ per test) ask: 'Which choice best states the main idea of the text?' The biggest trap is scope -- answers that are too broad, too narrow, or slightly off-topic.",
        "Too Broad: Goes beyond what the passage discusses. Too Narrow: Captures only one detail instead of the main point. Off-Topic: Accurate statement but not what the passage is about.",
        "The correct answer captures the central finding or argument at the right level of specificity. It should be supported by the passage as a whole, not just one sentence.",
      ],
    },
    {
      id: "inferences",
      title: "Inferences: What the Passage Proves",
      subtitle: "Conservative, evidence-based conclusions",
      visual: "hedging",
      body: [
        "Inference questions ask: 'Based on the text, which inference is best supported?' or 'The researchers concluded that _______.'",
        "The key principle: The correct inference is the most conservative conclusion that the evidence supports. It often uses hedging language ('may,' 'suggests,' 'could') rather than absolute language ('always,' 'proves,' 'all').",
        "Eliminate answers that: Use absolutes ('always,' 'never,' 'all'), Make causal claims the passage doesn't support, Extend beyond the passage's scope, or Contradict any detail in the passage.",
      ],
    },
    {
      id: "prediction",
      title: "The Prediction Method for R&W",
      subtitle: "Cover the choices, predict the answer",
      visual: "prediction-method",
      body: [
        "Before looking at answer choices: Read the passage carefully. Identify context clues. Predict what word, idea, or conclusion should fill the blank or answer the question.",
        "Then scan the choices for the one closest to your prediction. This prevents you from being lured by trap answers that sound good but don't match the passage.",
        "For inference questions, ask: 'What is the most boring, conservative conclusion I can draw from this evidence?' That's usually the right answer.",
      ],
    },
  ],

  quiz: [
    {
      passage: "Archaeologist Dr. Yolanda Rivera has spent a decade excavating a pre-Columbian settlement in central Mexico. Her team discovered an elaborate system of raised garden beds connected by canals -- a technique previously thought to have been used only in the Valley of Mexico. The garden system at Rivera's site is 200 years older than any previously documented example, suggesting that the agricultural innovation originated outside the Aztec heartland.",
      stem: "Which choice best states the main idea of the text?",
      choices: ["The Aztecs invented the raised garden bed system used throughout Mesoamerica.", "Rivera's discovery of an earlier raised garden system suggests the technique did not originate where scholars previously believed.", "Agricultural practices in pre-Columbian Mexico were highly advanced.", "Rivera has spent ten years working at a site in central Mexico."],
      correct: 1,
      explanation: "(A) captures the discovery and its significance. (B) Too Narrow. (C) Contradicts. (D) Too Broad.",
      type: "Central Ideas",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: "A longitudinal study of identical twins separated at birth found that twins raised in different socioeconomic environments showed remarkably similar personality traits, including openness and conscientiousness, despite having very different life experiences. However, the twins diverged significantly in their political views and religious practices, traits that the researchers classified as more strongly shaped by environmental factors. The researchers concluded that _______",
      stem: "Which choice most logically completes the text?",
      choices: ["environment has no meaningful effect on human development.", "personality is entirely determined by genetics.", "identical twins are always similar regardless of their environment.", "genetic factors play a larger role in fundamental personality traits than in beliefs and practices shaped by social context."],
      correct: 3,
      explanation: "Similar personality + different beliefs = genetics > environment for personality. (A) captures this precisely.",
      type: "Inferences",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: "Music therapist Kenji Yamada works with patients recovering from traumatic brain injuries. He has observed that patients who lost the ability to speak can often still sing familiar songs from before their injury. This phenomenon, Yamada explains, occurs because melody and language are processed in different brain regions -- damage to the left hemisphere's speech centers leaves the right hemisphere's musical processing largely intact.",
      stem: "Which choice best states the main idea of the text?",
      choices: ["Brain injury patients can sometimes sing but not speak because music and language use different neural pathways.", "The left hemisphere of the brain controls all language functions.", "Kenji Yamada is a music therapist who works with brain injury patients.", "Music therapy is the most effective treatment for traumatic brain injuries."],
      correct: 0,
      explanation: "(A) main idea -- the phenomenon and its explanation. (B) Too Narrow. (C) Too Broad. (D) Unsupported.",
      type: "Central Ideas",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: "Ecologists studying a restored prairie in Iowa found that plots where they had planted 16 different native grass and wildflower species produced 240% more biomass than plots with only one species. The diverse plots also showed greater resistance to drought and required no fertilizer, while the monoculture plots needed regular nutrient supplements to maintain productivity. The ecologists concluded that _______",
      stem: "Which choice most logically completes the text?",
      choices: ["species diversity increases ecosystem productivity and resilience, reducing the need for artificial inputs.", "prairie ecosystems are more productive than forests.", "monoculture farming should be immediately banned in all agricultural regions.", "planting exactly 16 species is optimal for all ecosystems."],
      correct: 0,
      explanation: "More species = more biomass + drought resistance + no fertilizer. (A) captures this. (B)-(D) unsupported extremes.",
      type: "Inferences",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: "A team of material scientists developed a new type of concrete that incorporates graphene nanotubes, making it 35% stronger than conventional concrete while using 30% less cement. Since cement production accounts for approximately 8% of global carbon dioxide emissions, the researchers suggest that _______",
      stem: "Which choice most logically completes the text?",
      choices: ["graphene concrete will completely eliminate carbon emissions from construction.", "the new concrete is too expensive for practical use.", "cement production is the leading cause of climate change.", "widespread adoption of graphene-enhanced concrete could significantly reduce the construction industry's carbon footprint."],
      correct: 3,
      explanation: "Less cement needed = less CO<sub>2</sub>. (A) logically follows with appropriate hedging.",
      type: "Inferences",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: "Studies of deep-sea hydrothermal vents have revealed ecosystems that thrive without any sunlight, supported entirely by chemosynthetic bacteria that derive energy from hydrogen sulfide. These ecosystems support complex food webs including tube worms, shrimp, and crabs. The discovery challenged the long-held assumption that _______",
      stem: "Which choice most logically completes the text?",
      choices: ["deep-sea environments are completely devoid of life.", "hydrothermal vents are common features of the ocean floor.", "all complex ecosystems ultimately depend on solar energy as their primary energy source.", "chemosynthetic bacteria are more efficient than photosynthetic organisms."],
      correct: 2,
      explanation: '"Thrive without sunlight" challenged an assumption -- that assumption must be about sunlight being necessary.',
      type: "Inferences",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: `Literary critic Amara Osei argues that the novels of Chimamanda Ngozi Adichie deliberately resist classification within a single literary tradition. While Western reviewers frequently categorize Adichie\u2019s work as \u201cpostcolonial literature,\u201d Osei notes that Adichie\u2019s narrative techniques draw equally from the Igbo oral storytelling tradition and 19th-century European realism, creating a hybrid form that defies simple categorization.`,
      stem: "Which choice best states the main idea of the text?",
      choices: ["Adichie\u2019s novels blend multiple literary traditions in a way that resists single-category classification.", "Western literary categories are always inadequate for non-Western literature.", "Igbo oral tradition is the primary influence on Adichie\u2019s writing.", "Adichie is the most important African novelist writing today."],
      correct: 0,
      explanation: "(A) captures Osei\u2019s argument precisely. (B) superlative unsupported. (C) \u201calways inadequate\u201d is too broad \u2014 the argument is about Adichie specifically. (D) Too Narrow \u2014 the passage says she draws \u201cequally\u201d from Igbo and European traditions.",
      type: "Central Ideas",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: `Historian Dr. James Whitfield has reexamined primary sources from the American Constitutional Convention of 1787, focusing on private correspondence between delegates that was previously overlooked. His analysis reveals that several prominent Framers expressed deep reservations about the Electoral College even as they voted to adopt it, viewing it as a necessary compromise rather than an ideal system. Whitfield argues that the conventional narrative of the Framers as unified champions of the Electoral College oversimplifies their actual positions.`,
      stem: "Which choice best states the main idea of the text?",
      choices: ["Dr. Whitfield has examined letters from the Constitutional Convention.", "The Electoral College should be abolished because the Framers didn\u2019t really support it.", "All of the Framers secretly opposed the Electoral College.", "Newly examined private letters show that the Framers were more divided on the Electoral College than the standard historical account suggests."],
      correct: 3,
      explanation: "(A) captures the finding and its significance. (B) Off-Topic \u2014 policy recommendation not made. (C) Too Narrow \u2014 method, not finding. (D) Contradicts \u2014 \u201cseveral,\u201d not \u201call,\u201d and they voted FOR it.",
      type: "Central Ideas",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: `Transportation engineers analyzing traffic patterns in Barcelona found that the city\u2019s \u201csuperblock\u201d design \u2014 which restricts car traffic in clusters of nine city blocks while prioritizing pedestrians and cyclists \u2014 reduced vehicle emissions in affected areas by 25% and increased retail foot traffic by 30%. However, traffic volume on streets bordering the superblocks increased by 15%.`,
      stem: "Which choice best states the main idea of the text?",
      choices: ["Reducing car traffic always increases retail activity.", "Superblocks are the best urban design strategy for all cities worldwide.", "Barcelona\u2019s superblock design successfully reduces emissions and increases foot traffic within the blocks but displaces some vehicle traffic to surrounding streets.", "The superblock design has only negative effects on surrounding neighborhoods."],
      correct: 2,
      explanation: "(A) captures both the benefits AND the trade-off. (B) \u201cbest\u201d and \u201call cities\u201d are unsupported. (C) \u201calways\u201d is too absolute. (D) Contradicts \u2014 the passage shows positive effects within blocks.",
      type: "Central Ideas",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: `Geneticist Dr. Elena Vasquez studies epigenetic changes \u2014 modifications to gene expression that don\u2019t alter the DNA sequence itself \u2014 in children of parents who experienced severe famine. Her research has found that these children show distinct metabolic patterns, including heightened fat storage and altered insulin sensitivity, even when raised with adequate nutrition. Vasquez proposes that _______`,
      stem: "Which choice most logically completes the text?",
      choices: ["all children of famine survivors will develop metabolic disorders.", "parental experiences of famine can trigger epigenetic changes that affect offspring metabolism independently of the offspring\u2019s own nutritional environment.", "DNA mutations caused by famine are passed to the next generation.", "epigenetic changes are always harmful to offspring."],
      correct: 1,
      explanation: "Parents\u2019 famine \u2192 children\u2019s metabolism changed despite adequate nutrition = experience transmitted epigenetically. (A) captures this. (B) Contradicts \u2014 \u201cdon\u2019t alter the DNA sequence.\u201d (C) \u201call\u201d is too absolute. (D) \u201calways harmful\u201d unsupported.",
      type: "Inferences",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: `A survey of 2,000 American adults found that 73% reported feeling overwhelmed by the volume of news available through digital platforms. The same respondents, however, spent an average of 4.2 hours daily consuming digital news \u2014 more than double the time spent a decade ago. Researchers described this pattern as a \u201cnews paradox\u201d in which _______`,
      stem: "Which choice most logically completes the text?",
      choices: ["digital news platforms are deliberately designed to cause anxiety.", "Americans are better informed than ever before.", "people should limit their news consumption to reduce stress.", "people consume more news despite finding the experience increasingly stressful."],
      correct: 3,
      explanation: "Feel overwhelmed + consume more than ever = paradox of increased consumption despite negative experience. (A) captures the paradox. (B) \u201cbetter informed\u201d isn\u2019t established. (C) platform design not discussed. (D) recommendation not made.",
      type: "Inferences",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: `Architect Maya Lin, best known for designing the Vietnam Veterans Memorial, approaches public spaces with the philosophy that the landscape itself should dictate the design. Her Wave Field installations \u2014 undulating earthwork sculptures \u2014 emerge from careful study of the natural topography rather than imposing a predetermined form. Lin describes her process as \u201clistening to the land\u201d before making any design decisions.`,
      stem: "Which choice best states the main idea of the text?",
      choices: ["Maya Lin designed the Vietnam Veterans Memorial.", "All architects should follow Lin\u2019s approach to landscape design.", "Lin\u2019s design philosophy centers on responding to natural landscapes rather than imposing external forms on them.", "Wave Field installations are the most innovative public art of the 21st century."],
      correct: 2,
      explanation: "(A) captures the philosophy. (B) Too Narrow \u2014 biographical detail. (C) superlative unsupported. (D) prescriptive recommendation not made.",
      type: "Central Ideas",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: `Psychologists studying the \u201ctesting effect\u201d found that students who took practice tests on material they had studied retained 50% more information one week later than students who spent the same amount of time re-reading the material. Crucially, the benefit held even when the practice tests were taken without feedback \u2014 simply the act of retrieving information from memory strengthened the memory itself. The researchers concluded that _______`,
      stem: "Which choice most logically completes the text?",
      choices: ["all students should replace all studying with practice tests.", "practice tests are only useful when followed by immediate feedback.", "the cognitive act of retrieval, not the correction of errors, is the primary mechanism by which practice testing improves long-term retention.", "re-reading is a completely worthless study strategy."],
      correct: 2,
      explanation: "Benefit held WITHOUT feedback \u2192 retrieval itself (not error correction) drives the effect. (A) matches precisely. (B) Contradicts \u2014 benefit held without feedback. (C) \u201ccompletely worthless\u201d is extreme. (D) \u201call\u201d and \u201creplace all studying\u201d are unsupported.",
      type: "Inferences",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: `Marine archaeologist Dr. Fatima Al-Hassan uses satellite imagery to locate ancient shipwrecks in shallow coastal waters. Her technique identifies the distinctive discoloration patterns that wooden ship timbers create in surrounding sediment after centuries of decomposition. In the past three years, Al-Hassan has identified 47 potential wreck sites in the Mediterranean \u2014 12 of which have been confirmed through underwater excavation.`,
      stem: "Which choice best states the main idea of the text?",
      choices: ["The Mediterranean contains more shipwrecks than any other body of water.", "Satellite-based detection of sediment patterns offers a productive new method for locating ancient shipwrecks.", "Dr. Al-Hassan has found 47 potential shipwreck sites.", "Underwater excavation is the only reliable way to confirm shipwreck locations."],
      correct: 1,
      explanation: "(A) captures the method and its success. (B) Too Narrow \u2014 a detail, not the significance. (C) Off-Topic \u2014 the passage is about detection, not confirmation methods. (D) Unsupported comparison.",
      type: "Central Ideas",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  challenge: [
    {
      passage: "Physicists studying superconducting materials have long searched for compounds that exhibit zero electrical resistance at room temperature. A team at the University of Rochester reported achieving superconductivity in a hydrogen-rich compound at 15\u00B0C but only under pressures of 267 gigapascals. Subsequent attempts by independent laboratories to replicate the results have produced inconsistent outcomes. The researchers maintain that _______",
      stem: "Which choice most logically completes the text?",
      choices: ["the inconsistent replication results are likely due to subtle differences in sample preparation rather than flaws in the original findings.", "superconductivity is impossible at temperatures above absolute zero.", "the extreme pressures required make the discovery irrelevant to practical applications.", "room-temperature superconductivity has been definitively achieved and is ready for commercial applications."],
      correct: 0,
      explanation: 'The researchers "maintain" (defend) their results. (A) is what researchers would logically argue.',
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: "Economist Dr. Sarah Park analyzed wage data from 12 countries that implemented national minimum wage increases of 15% or more between 2015 and 2023. In 9 of the 12 countries, employment in low-wage sectors declined by an average of 2.3% in the year following the increase. However, median income among workers who retained their jobs rose by an average of 11%, and consumer spending in affected communities increased by 4.7%. Park argues that _______",
      stem: "Which choice most logically completes the text?",
      choices: ["governments should never raise the minimum wage because it causes unemployment.", "the employment declines were entirely caused by automation rather than wage increases.", "minimum wage increases create a trade-off in which some job losses are offset by significant income and spending gains among remaining workers.", "minimum wage increases always lead to net positive economic outcomes."],
      correct: 2,
      explanation: "Job losses + income gains + spending gains = mixed results, best described as a trade-off.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: "Researchers studying the placebo effect in clinical pain trials made a surprising discovery: patients who were openly told they were receiving a placebo -- with no deception whatsoever -- still reported 30% greater pain relief than patients who received no treatment. Brain imaging confirmed that the open-label placebo activated the same neural pain-modulation pathways as genuine analgesic medications. The researchers suggest that _______",
      stem: "Which choice most logically completes the text?",
      choices: ["all pain medication is no more effective than a placebo.", "patients who reported pain relief were likely lying about their symptoms.", "the placebo effect is entirely a product of deception and expectation.", "the therapeutic ritual of taking a pill may activate pain-relief mechanisms regardless of the patient's knowledge of its contents."],
      correct: 3,
      explanation: "Open placebo + still worked + same brain pathways = the ACT of treatment (ritual) matters, not belief.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: `Anthropologist Dr. Kenji Matsumoto studied food-sharing practices among three indigenous communities in the Amazon Basin. He found that families who shared food most frequently with non-relatives were not the wealthiest or most food-secure families, as predicted by standard reciprocity models. Instead, the most generous sharers were families of intermediate wealth. Matsumoto observed that these families received the most social invitations, were consulted most often in community decisions, and had the highest rates of receiving help during personal crises. He proposes that _______`,
      stem: "Which choice most logically completes the text?",
      choices: ["intermediate-wealth families share food because they have more than they need.", "food sharing among intermediate-wealth families functions primarily as a social investment that yields returns in influence and community support.", "all food sharing in indigenous communities is motivated by self-interest.", "wealthy families refuse to share food with their communities."],
      correct: 1,
      explanation: `Intermediate wealth families share most \u2192 receive social invitations + consultation + crisis help = sharing yields social capital. (A) connects these precisely. (B) \u201call\u201d and \u201cself-interest\u201d are oversimplifications. (C) \u201crefuse\u201d is unsupported \u2014 they share less, not not at all. (D) the passage says they\u2019re NOT the most food-secure, contradicting \u201cmore than they need.\u201d`,
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: `Geologists analyzing ice cores from Antarctica discovered that atmospheric CO<sub>2</sub> levels and global temperatures have risen and fallen in close synchronization over the past 800,000 years. However, detailed analysis of the timing reveals that temperature increases consistently precede CO<sub>2</sub> increases by approximately 200 to 800 years during natural climate cycles. Climate scientists note that this lag does not undermine the role of CO<sub>2</sub> in climate change because _______`,
      stem: "Which choice most logically completes the text?",
      choices: ["the ice core data is unreliable and should be disregarded.", "CO<sub>2</sub> has no effect on global temperature.", "temperature always causes CO<sub>2</sub> changes, never the reverse.", "the initial temperature rise from orbital changes triggers CO<sub>2</sub> release, which then amplifies warming in a feedback cycle."],
      correct: 3,
      explanation: `Scientists say the lag \u201cdoes not undermine\u201d CO<sub>2</sub>\u2019s role \u2014 so CO<sub>2</sub> still matters despite not being the initial trigger. (A) explains this: orbital warming \u2192 CO<sub>2</sub> release \u2192 MORE warming (feedback). (B) contradicts \u201cdoes not undermine the role of CO<sub>2</sub>.\u201d (C) contradicts the scientists\u2019 acceptance of the data. (D) \u201cnever the reverse\u201d contradicts the feedback mechanism implied.`,
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage: `Urban planners in Singapore implemented a congestion pricing system that charges drivers variable fees based on real-time traffic density. In the first year, peak-hour traffic volume decreased by 22%, average commute times dropped by 15 minutes, and public transit ridership increased by 18%. However, analysis of demographic data revealed that the reduction in driving was concentrated almost entirely among lower- and middle-income commuters, while high-income drivers continued using roads at pre-implementation rates. Critics argue that _______`,
      stem: "Which choice most logically completes the text?",
      choices: ["congestion pricing effectively functions as a regressive tax that prices lower-income drivers off the road while leaving wealthy drivers\u2019 behavior unchanged.", "public transit is inherently inferior to private car transportation.", "congestion pricing has no effect on traffic volume.", "Singapore should eliminate all road fees to promote equity."],
      correct: 0,
      explanation: "Traffic reduction only from lower/middle income + wealthy unchanged = system disproportionately affects less wealthy. Critics would call this regressive. (A) captures the critique. (B) contradicts the 22% reduction. (C) policy prescription beyond the critique. (D) off-topic value judgment.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  takeaways: [
    "The central idea is the one claim the entire passage supports. Details, examples, and data are evidence -- not the main point.",
    "The three scope traps are too broad (vague generalization), too narrow (one detail presented as the whole idea), and off-topic (plausible but unsupported by the passage).",
    "For inference questions, the correct answer is always the most directly supported conclusion -- not the most interesting, surprising, or extreme.",
    "The prediction method works here too: predict the answer before looking at choices. If your prediction matches one option closely, that is almost always correct.",
    "When two answers seem equally good, check the qualifying words -- 'some' vs. 'all,' 'may' vs. 'will,' 'primarily' vs. 'exclusively.' The PSAT rewards precision.",
  ],
};
