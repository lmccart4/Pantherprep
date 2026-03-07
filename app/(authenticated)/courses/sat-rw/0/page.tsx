"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { RoutingSimulator } from "@/components/course/activities/routing-simulator";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import {
  FormatVisual,
  DomainsVisual,
  ScoreRangesVisual,
  RoadmapVisual,
  ChecklistVisual,
} from "./lesson-visuals";

export default function SATRWModule0() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "format": <FormatVisual />,
        "domains": <DomainsVisual />,
        "score-ranges": <ScoreRangesVisual />,
        "roadmap": <RoadmapVisual />,
        "checklist": <ChecklistVisual />,
      }}
      activities={{
        "activity-routing": (goNext: () => void) => (
          <RoutingSimulator
            maxQuestions={27}
            section="rw"
            testType="sat"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "error-worksheet": (goNext: () => void) => (
          <ErrorAnalysisWorksheet
            domains={["Craft & Structure", "Information & Ideas", "Standard English Conventions", "Expression of Ideas"]}
            testLabel="SAT Reading & Writing"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
      }}
      nextModuleHref="/courses/sat-rw/1"
      nextModuleLabel="Module 1: Sentence Boundaries"
    />
  );
}

/* ═══════════════════════════════════════════════════════
 * MODULE 0 — Know Your Battlefield: Diagnostic & Roadmap
 * ═══════════════════════════════════════════════════════ */

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 0,
  title: "Know Your Battlefield",
  subtitle:
    "Assess your baseline and build a study plan — understand the SAT R&W section structure, scoring, and your personalized roadmap.",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "activity-routing", label: "Routing Simulator", icon: "zap" },
    { id: "error-worksheet", label: "Error Analysis Worksheet", icon: "zap" },
    { id: "quiz", label: "Diagnostic", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "test-overview",
      title: "The SAT R&W Section: Structure & Format",
      subtitle: "Know Your Test",
      body: [
        "The SAT Reading & Writing section has 54 total questions split into two adaptive modules of 27 questions each, with 32 minutes per module (64 minutes total).",
        "That gives you roughly 71 seconds per question on average. Every question is multiple choice with 4 options. There is no penalty for wrong answers — always answer every question.",
        "The section uses multistage adaptive testing (MST). Module 1 contains mixed-difficulty questions. Your performance on Module 1 determines which version of Module 2 you receive.",
        "If you perform well on Module 1, you are routed to the harder Module 2, which unlocks scores up to 800. If you score below the threshold, you receive the easier Module 2, which caps your maximum score.",
      ],
      visual: "format",
    },
    {
      id: "four-domains",
      title: "The Four Content Domains",
      subtitle: "What the SAT Tests",
      body: [
        "Craft & Structure (~28%, ~15 Qs): Words in Context (~5 Qs) — select the most precise word. Text Structure & Purpose (~3 Qs) — identify function/organization. Cross-Text Connections (~2 Qs) — analyze how two texts relate.",
        "Information & Ideas (~26%, ~14 Qs): Central Ideas (~3 Qs) — main idea, key details. Evidence — Textual (~3 Qs) — select supporting quotations. Evidence — Quantitative (~3 Qs) — interpret tables/graphs. Inferences (~3 Qs) — draw logical conclusions.",
        "Standard English Conventions (~26%, ~14 Qs): Boundaries (~4 Qs) — comma splices, run-ons, semicolons, colons. Form, Structure & Sense (~6 Qs) — SVA, tense, pronouns, modifiers, parallelism.",
        "Expression of Ideas (~20%, ~11 Qs): Transitions (~5 Qs) — most logical connecting word. Rhetorical Synthesis (~6 Qs) — use notes to achieve a rhetorical goal.",
      ],
      visual: "domains",
    },
    {
      id: "scoring",
      title: "Score Ranges & What They Mean",
      subtitle: "Setting Your Target",
      body: [
        "720–800 (96th–99th+ percentile): Ivy League / Top-20 competitive.",
        "620–710 (85th–95th percentile): Selective colleges, merit scholarship range.",
        "530–610 (65th–84th percentile): State flagships, solid foundation.",
        "480–520 (50th–64th percentile): College ready, above benchmark.",
        "200–470 (Below 50th percentile): Focus on Conventions first.",
      ],
      visual: "score-ranges",
    },
    {
      id: "module-path",
      title: "Your Learning Path",
      subtitle: "The Roadmap",
      body: [
        "Modules 1–3: Standard English Conventions — Grammar, punctuation, advanced rules.",
        "Module 4: Boss Battle: Grammar Golem — 25-question conventions boss fight.",
        "Modules 5–7: Vocabulary & Craft — Words in Context, precision, text structure.",
        "Module 8: Boss Battle: Syntax Serpent — 25-question craft boss fight.",
        "Modules 9–11: Information & Ideas — Central ideas, evidence, logical reasoning.",
        "Module 12: Boss Battle: Data Specter — 25-question information boss fight.",
        "Modules 13–15: Expression & Strategy — Synthesis, transitions, test strategy + boss.",
        "Modules 16–18: Practice & Finale — Full tests, diagnostics, study plan.",
      ],
      visual: "roadmap",
    },
    {
      id: "preparation",
      title: "Pre-Test Checklist",
      subtitle: "Get Ready",
      body: [
        "Before you begin your diagnostic, make sure you have everything in place:",
        "1. Bluebook app installed\n2. Quiet testing environment identified\n3. Phone silenced and out of reach\n4. Scratch paper and pencil ready\n5. 64 uninterrupted minutes available\n6. Water bottle nearby\n7. Know your target RW score",
        "This module's diagnostic will assess your baseline across all four domains. Your results will tell you exactly where to focus your study time.",
      ],
      visual: "checklist",
    },
  ],

  /* ──────── DIAGNOSTIC QUIZ (28 domain-mapped questions) ──────── */
  quiz: [
    /* ── Craft & Structure: Words in Context ── */
    {
      passage:
        "The architect\u2019s latest design was praised for its ______ approach, combining traditional materials with cutting-edge technology in ways no one had attempted before.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["methodical", "conventional", "prudent", "innovative"],
      correct: 3,
      explanation:
        '"No one had attempted before" signals novelty. "Innovative" means introducing new methods or ideas.',
      difficulty: "easy",
      type: "craft",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Marine biologists found that coral reefs near urban coastlines show signs of ______, with once-vibrant ecosystems now appearing bleached and lifeless.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["decline", "stagnation", "fluctuation", "surge"],
      correct: 0,
      explanation:
        '"Bleached and lifeless" from "once-vibrant" = deterioration. "Decline" = gradual decrease in vitality.',
      difficulty: "easy",
      type: "craft",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "While the senator publicly expressed full support for the bill, her private correspondence revealed a more ______ stance, raising concerns about specific provisions she found problematic.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["enthusiastic", "ambivalent", "indifferent", "decisive"],
      correct: 1,
      explanation:
        "Public support vs. private concerns = mixed feelings. \"Ambivalent\" = simultaneous conflicting emotions.",
      difficulty: "medium",
      type: "craft",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The historian argued that the treaty, far from being spontaneous goodwill, was actually a ______ maneuver designed to buy time while the nation rebuilt its military forces.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["calculated", "spontaneous", "reluctant", "impulsive"],
      correct: 0,
      explanation:
        '"Designed to buy time" and "far from spontaneous" = deliberate planning. "Calculated" = done with full awareness.',
      difficulty: "medium",
      type: "craft",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Critics contend the new development plan would ______ the very community identity residents spent decades cultivating, replacing locally owned shops with corporate chains.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["displace", "erode", "reveal", "strengthen"],
      correct: 1,
      explanation:
        'Gradual destruction of identity through replacement = "erode," to gradually wear away.',
      difficulty: "medium",
      type: "craft",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── Craft & Structure: Text Structure & Purpose ── */
    {
      passage:
        "Honeybees perform a \"waggle dance\" to communicate food source locations. The dancing bee moves in a figure-eight: the angle relative to the sun indicates direction, while the waggle duration indicates distance. This remarkable behavior allows a single scout to guide thousands of foragers to a precise location.",
      stem: "Which choice best describes the function of the last sentence?",
      choices: [
        "It provides a specific example supporting a general claim.",
        "It introduces a phenomenon the rest of the text will explain.",
        "It presents a finding that challenges a previous assumption.",
        "It summarizes the overall significance of the process described above."
      ],
      correct: 3,
      explanation:
        "The final sentence wraps up by stating the overall effect \u2014 one scout guiding thousands.",
      difficulty: "medium",
      type: "craft",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── Craft & Structure: Cross-Text Connections ── */
    {
      passage:
        "Text 1: Psychologist Carol Dweck argues that praising children for effort rather than innate ability fosters a \"growth mindset\" that leads to greater resilience.\n\nText 2: Researcher Li Zhao found that in collectivist cultures, students praised for natural talent showed increased motivation, suggesting the praise-mindset relationship may be more culturally dependent than assumed.",
      stem: "How would Zhao most likely respond to Dweck\u2019s argument?",
      choices: [
        "By agreeing effort-based praise is always superior.",
        "By suggesting neither type of praise significantly affects achievement.",
        "By rejecting the concept of growth mindset entirely.",
        "By arguing Dweck\u2019s findings may not apply universally across cultural contexts."
      ],
      correct: 3,
      explanation:
        "Zhao\u2019s research shows cultural dependence, which qualifies Dweck\u2019s broader claim without rejecting it.",
      difficulty: "hard",
      type: "craft",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── Information & Ideas: Central Ideas ── */
    {
      passage:
        "In the 1960s, the Green Revolution introduced high-yield crop varieties to developing nations, dramatically increasing food production. However, these crops required expensive fertilizers that many small-scale farmers could not afford. While national output rose, rural inequality often worsened as wealthier farmers benefited disproportionately.",
      stem: "Which choice best states the main idea?",
      choices: [
        "Small-scale farmers benefited most from new crop varieties.",
        "High-yield crops require significantly more water than traditional crops.",
        "The Green Revolution increased production but also contributed to greater rural inequality.",
        "The Green Revolution failed to increase food production."
      ],
      correct: 2,
      explanation:
        "The passage presents both increased production AND unequal distribution. Only B captures both.",
      difficulty: "easy",
      type: "information",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Lichen, often overlooked as mere patches on rocks, are remarkable symbiotic organisms consisting of a fungus and a photosynthetic partner. This partnership allows lichen to thrive in harsh environments, from Antarctic rocks to volcanic fields. Scientists now use lichen as air quality indicators because they absorb pollutants directly from the atmosphere.",
      stem: "Which choice best states the main idea?",
      choices: [
        "Air pollution is the primary threat to lichen worldwide.",
        "Lichen are deceptively complex organisms whose biology makes them both resilient and scientifically useful.",
        "Lichen are composed of two organisms living together.",
        "Scientists recently discovered lichen can survive in extreme environments."
      ],
      correct: 1,
      explanation:
        "Only C captures all three aspects: symbiotic nature, resilience, and scientific utility.",
      difficulty: "medium",
      type: "information",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── Information & Ideas: Command of Evidence (Textual) ── */
    {
      passage:
        "A team studying elephant communication proposed that elephants use low-frequency infrasound rumbles to coordinate group movements across hundreds of square miles. They recorded distinct rumble patterns that preceded group directional changes by 30\u201345 minutes.",
      stem: "Which finding would most directly support the claim?",
      choices: [
        "Captive elephants produce fewer rumbles than wild ones.",
        "Separate groups changed direction simultaneously after one group produced a specific rumble.",
        "Infrasound can travel through the ground as well as the air.",
        "Elephants have larger ear structures than most land mammals."
      ],
      correct: 1,
      explanation:
        "Separate groups coordinating after a specific rumble directly demonstrates the coordination function.",
      difficulty: "medium",
      type: "information",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Literary scholar Priya Nair argues that fragmented narrative structures in contemporary fiction reflect a shift in how authors conceptualize memory \u2014 as inherently reconstructive, assembled from fragments rather than retrieved as complete episodes.",
      stem: "Which quotation would best illustrate Nair\u2019s claim?",
      choices: [
        '"She remembered that Tuesday perfectly \u2014 every detail as clear as glass."',
        '"The past returned to him not as a story but as shards \u2014 a color, a sound \u2014 that he arranged and rearranged, never sure of the order."',
        '"He had always prided himself on his excellent memory."',
        '"The novel followed strict chronological structure from childhood to old age."'
      ],
      correct: 1,
      explanation:
        '"Shards" that are "arranged and rearranged, never sure of the order" directly depicts memory as reconstructive fragments.',
      difficulty: "hard",
      type: "information",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── Information & Ideas: Command of Evidence (Quantitative) ── */
    {
      passage:
        "A study tracked 500 students\u2019 reading habits and test scores over two years.\n\nWeekly Reading \u2192 Avg. R&W Improvement:\n0 hours \u2192 +5 points\n1\u20133 hours \u2192 +22 points\n4\u20137 hours \u2192 +41 points\n8+ hours \u2192 +38 points",
      stem: "Which choice most accurately describes the data?",
      choices: [
        "Improvements increased consistently proportional to reading time.",
        "Reading 8+ hours produced double the improvement of 1\u20133 hours.",
        "Students who did no reading showed no improvement.",
        "Improvement generally increased with reading time, though the highest group did not show the greatest gains."
      ],
      correct: 3,
      explanation:
        "The 8+ group (+38) trails the 4\u20137 group (+41). Only C captures this nuance.",
      difficulty: "hard",
      type: "information",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── Information & Ideas: Inferences ── */
    {
      passage:
        "Deep-sea anglerfish have evolved a bioluminescent lure dangling above their mouths. In the perpetual darkness where food is scarce and encounters infrequent, this lure attracts prey directly toward the anglerfish\u2019s jaws. This adaptation suggests that ______",
      stem: "Which choice most logically completes the text?",
      choices: [
        "anglerfish are the most common deep-sea species.",
        "active pursuit would be an inefficient survival strategy in this environment.",
        "all deep-sea fish have developed bioluminescence.",
        "anglerfish expend significant energy swimming to hunt."
      ],
      correct: 1,
      explanation:
        "A passive lure in a dark, scarce environment implies active pursuit would waste energy.",
      difficulty: "medium",
      type: "information",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Sociologist Maria Reyes studied civic engagement before and after community gardens were installed in three low-income areas. While only 12% of residents actively gardened, trust in neighbors rose 34% and meeting attendance rose 28%. These findings imply that ______",
      stem: "Which choice most logically completes the text?",
      choices: [
        "gardens are ineffective because so few residents participate.",
        "the low rate shows residents were not interested in improvement.",
        "the gardens\u2019 impact extended well beyond direct participants.",
        "gardens should be replaced with larger meeting spaces."
      ],
      correct: 2,
      explanation:
        "12% participated but trust rose 34% \u2014 this gap shows spillover effects beyond participants.",
      difficulty: "medium",
      type: "information",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── Conventions: Form, Structure & Sense ── */
    {
      passage:
        "The collection of rare manuscripts, which ______ donated to the university library in 1952, remains one of the most valuable holdings in the institution\u2019s history.",
      stem: "Which choice conforms to Standard English?",
      choices: ["are", "were", "have been", "was"],
      correct: 3,
      explanation:
        'Subject is "collection" (singular), not "manuscripts." Singular = "was."',
      difficulty: "easy",
      type: "conventions",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "When the documentary crew arrived at the remote village, they discovered that the elder who ______ the oral history tradition for six decades had just agreed to be filmed.",
      stem: "Which choice conforms to Standard English?",
      choices: ["would maintain", "had maintained", "maintained", "maintains"],
      correct: 1,
      explanation:
        'Maintaining happened before two past events. Past perfect "had maintained" shows prior completion.',
      difficulty: "medium",
      type: "conventions",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Neither the lead researcher nor her graduate ______ able to replicate the results of the initial experiment.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "assistants were",
        "assistants was",
        "assistant are",
        "assistant were"
      ],
      correct: 0,
      explanation:
        'With "neither...nor," verb agrees with nearer subject. "Assistants" (plural) = "were."',
      difficulty: "medium",
      type: "conventions",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The artist, whose murals depicting scenes of community resilience ______ her national acclaim, has announced a new series on environmental justice.",
      stem: "Which choice conforms to Standard English?",
      choices: ["earns", "earning", "has earned", "have earned"],
      correct: 3,
      explanation:
        'Subject of relative clause is "murals" (plural). "Have earned" is correct.',
      difficulty: "hard",
      type: "conventions",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── Conventions: Boundaries ── */
    {
      passage:
        "The museum\u2019s new exhibit features artifacts from ancient Mesopotamia ______ visitors can interact with holographic reconstructions of the original sites.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "Mesopotamia;",
        "Mesopotamia, and",
        "Mesopotamia,",
        "Mesopotamia"
      ],
      correct: 0,
      explanation:
        "Two independent clauses need proper separation. A semicolon correctly joins them.",
      difficulty: "easy",
      type: "conventions",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Dr. Alvarez, who has studied volcanic activity for over thirty ______ that the region faces a significant eruption risk within the next decade.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "years; believes",
        "years. Believes",
        "years believes",
        "years, believes"
      ],
      correct: 3,
      explanation:
        "The nonrestrictive clause needs a closing comma. Then the main clause resumes.",
      difficulty: "medium",
      type: "conventions",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The company announced three major changes ______ a complete restructuring, a $500 million investment in renewable energy, and the closure of its least profitable plants.",
      stem: "Which choice conforms to Standard English?",
      choices: ["changes:", "changes;", "changes,", "changes\u2014"],
      correct: 0,
      explanation:
        "A colon introduces a list that specifies the preceding clause.",
      difficulty: "medium",
      type: "conventions",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── Expression of Ideas: Transitions ── */
    {
      passage:
        "Early solar panels in the 1970s converted less than 10% of sunlight into electricity. ______, modern cells routinely achieve above 20%, with some prototypes exceeding 40%.",
      stem: "Which transition is most logical?",
      choices: ["In other words,", "Similarly,", "In contrast,", "For instance,"],
      correct: 2,
      explanation:
        'Low then vs. high now = contrast. "In contrast" signals the shift.',
      difficulty: "easy",
      type: "expression",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The city council approved funding for a new transit line. ______, several members expressed concern that the eight-year timeline was unrealistic.",
      stem: "Which transition is most logical?",
      choices: ["Therefore,", "Specifically,", "However,", "In addition,"],
      correct: 2,
      explanation:
        'Approval followed by concerns = concession/contrast. "However" signals that.',
      difficulty: "easy",
      type: "expression",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Researchers found meditation participants showed reduced cortisol, improved sleep, and reduced anxiety. ______, the small sample size of 30 and lack of control group mean these findings should be interpreted cautiously.",
      stem: "Which transition is most logical?",
      choices: ["Similarly,", "That said,", "Furthermore,", "As a result,"],
      correct: 1,
      explanation:
        '"That said" acknowledges positives while pivoting to a qualification.',
      difficulty: "medium",
      type: "expression",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── Expression of Ideas: Rhetorical Synthesis ── */
    {
      passage:
        "Notes on the JWST:\n\u2022 Launched December 25, 2021\n\u2022 Primary mirror 6.5 meters \u2014 nearly 3x larger than Hubble\u2019s\n\u2022 Positioned ~1 million miles from Earth\n\u2022 Observes primarily in infrared\n\u2022 Infrared lets it see through cosmic dust that blocks visible light",
      stem: "The student wants to emphasize the JWST\u2019s advantage over Hubble. Which choice best accomplishes this?",
      choices: [
        "On Dec 25, 2021, the JWST was launched to observe in infrared light.",
        "Launched in 2021 at L2, the JWST observes in infrared wavelengths.",
        "The JWST\u2019s 6.5-meter mirror collects infrared light from distant objects.",
        "With a mirror nearly 3x larger than Hubble\u2019s, the JWST can also peer through cosmic dust invisible to its predecessor by observing in infrared."
      ],
      correct: 3,
      explanation:
        "Only B directly compares to Hubble (mirror size) AND highlights a unique capability (infrared dust penetration).",
      difficulty: "hard",
      type: "expression",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Notes on monarch migration:\n\u2022 Monarchs travel up to 3,000 miles from Canada/US to Mexico each fall\n\u2022 Millions overwinter in oyamel fir forests in Michoac\u00e1n\n\u2022 Logging and climate change have reduced these forests ~70% since 1971\n\u2022 Conservation organizations have established protected biosphere reserves",
      stem: "The student wants to present the threat and the response. Which choice best accomplishes this?",
      choices: [
        "Monarchs travel 3,000 miles each fall to reach Michoac\u00e1n, Mexico.",
        "Since 1971, logging and climate change have destroyed ~70% of the forests where millions of monarchs overwinter, prompting organizations to establish protected reserves.",
        "Millions of monarchs overwinter in Michoac\u00e1n, and organizations have worked to protect these areas.",
        "Monarchs use the sun to navigate 3,000 miles, but their destination forests have been reduced."
      ],
      correct: 1,
      explanation:
        "B specifies the threat (70% loss), the species affected, and the response (reserves).",
      difficulty: "hard",
      type: "expression",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Notes on space economics:\n\u2022 Apollo cost ~$257 billion (2023 dollars)\n\u2022 SpaceX developed Falcon 9 for ~$390 million\n\u2022 Falcon 9\u2019s reusable first stage cuts launch costs ~30%\n\u2022 NASA now contracts with SpaceX for ISS missions\n\u2022 Private space companies have attracted $10B+ in VC since 2010",
      stem: "The student wants to argue private companies fundamentally changed space economics. Which choice best accomplishes this?",
      choices: [
        "Apollo cost $257B vs. Falcon 9\u2019s $390M \u2014 and reusable tech cuts launch costs 30%, showing how private companies transformed space economics.",
        "Private companies have attracted $10B+ in VC, and NASA now contracts with SpaceX.",
        "The Falcon 9 cost $390M to develop and features a reusable first stage.",
        "NASA spent $257B on Apollo, and private companies have attracted $10B in VC."
      ],
      correct: 0,
      explanation:
        "B makes the strongest argument by directly comparing costs AND citing reusability savings.",
      difficulty: "hard",
      type: "expression",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  takeaways: [
    "54 questions in 64 minutes, two 27-question adaptive modules.",
    "Every question pairs one short passage with one question.",
    "Domain order: Craft, Info, Conventions, Expression — easy to hard within each.",
    "Module 1 accuracy determines your score ceiling.",
    "Missing easy questions costs more points than missing hard ones.",
    "No penalty for wrong answers — never leave a blank.",
    "Conventions tests learnable rules — fastest path to gains.",
  ],
};
