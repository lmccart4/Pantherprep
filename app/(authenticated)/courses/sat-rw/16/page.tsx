"use client";

import { ModuleShell } from "@/components/course/module-shell";
import { BossBattle } from "@/components/course/activities";
import type { ModuleConfig, QuizQuestion } from "@/types/module";

export default function SATRWModule16() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      activities={{
        "boss-battle": (goNext) => (
          <BossBattle
            questions={BOSS_QS}
            title="Expression Boss Battle"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
      }}
      nextModuleHref="/courses/sat-rw/17"
      nextModuleLabel="Module 17: Full R&W Review"
    />
  );
}

/* ═══════════════════════════════════════════════════════
 * MODULE 16 — Expression Boss Battle
 * ═══════════════════════════════════════════════════════ */

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 16,
  title: "Expression Boss Battle",
  subtitle: "Mixed expression skills challenge",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "boss-battle", label: "Boss Battle", icon: "boss" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  takeaways: [
    "Review every question you missed — write down the rule or strategy you should have used.",
    "Redo your slowest correct answers under a timer to build speed without sacrificing accuracy.",
    "Check your weakest question type and re-read the corresponding module lesson.",
    "Each question type you master adds 1-2 correct answers per test to your score.",
    "The biggest gains come from mastering conventions, vocabulary, and central idea questions.",
  ],
};

/* ──────── BOSS BATTLE QUESTIONS ──────── */

const BOSS_QS: QuizQuestion[] = [
  /* ── BLOCK 1: CONVENTIONS (Q1-5) ── */
  {
    passage:
      "The harbor seals that inhabit the rocky coastline near the research station ______ significantly more vocal during the mating season, producing a range of calls that researchers have only recently begun to catalog.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ["becomes", "is becoming", "become", "has become"],
    correct: 2,
    explanation:
      "Subject is \"seals\" (plural). Present tense for a recurring pattern. Plural subject + present tense = \"become.\"",
    type: "conventions",
    difficulty: "medium",
  },
  {
    passage:
      "Although the architect's original blueprints called for a glass facade, the city's historic preservation ______ insisted that the building's exterior remain consistent with the 19th-century brick structures on the surrounding block.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: [
      "committee that reviews all new construction in the district",
      "committee, which reviews all new construction in the district",
      "committee which reviews all new construction in the district",
      "committee, which reviews all new construction in the district,"
    ],
    correct: 3,
    explanation:
      "\"Which reviews all new construction\" is a nonrestrictive clause (extra info, not essential to identify which committee). Nonrestrictive clauses require commas on BOTH sides. A has both commas correctly.",
    type: "conventions",
    difficulty: "medium",
  },
  {
    passage:
      "The documentary examines the environmental impact of fast fashion; ______ it traces a single cotton T-shirt from a farm in Uzbekistan through factories in Bangladesh to retail stores in the United States.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ["specific,", "specifically,", "being specific,", "to be specific:"],
    correct: 1,
    explanation:
      "After a semicolon, we need an independent clause or a transitional adverb followed by a comma. \"Specifically,\" is a transitional adverb that introduces a concrete example of the general claim. This is the standard punctuation pattern.",
    type: "conventions",
    difficulty: "medium",
  },
  {
    passage:
      "Neither the lead researcher nor her graduate ______ able to replicate the anomalous results that had generated so much excitement at the initial conference presentation.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: [
      "assistants were",
      "assistants was",
      "assistants are",
      "assistant's were"
    ],
    correct: 0,
    explanation:
      "\"Neither...nor\" \u2014 verb agrees with the noun CLOSEST to it: \"assistants\" (plural). Past tense context (\"had generated\"). Plural + past = \"assistants were.\"",
    type: "conventions",
    difficulty: "medium",
  },
  {
    passage:
      "The coral reef restoration project, which marine biologists have described as one of the most ambitious ______ has already shown promising results in its first two years.",
    stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: [
      "undertaken, in the Caribbean",
      "undertaken in the Caribbean",
      "undertaken in the Caribbean,",
      "undertaken in the Caribbean;"
    ],
    correct: 2,
    explanation:
      "The clause \"which marine biologists...Caribbean\" is a nonrestrictive parenthetical. It needs a comma to close the clause before returning to the main sentence (\"has already shown\"). A correctly closes the clause with a comma.",
    type: "conventions",
    difficulty: "medium",
  },
  /* ── BLOCK 2: VOCABULARY (Q6-9) ── */
  {
    passage:
      "Despite the author's reputation for dense, theoretical prose, her latest book is surprisingly ______: written in clear, conversational language that makes complex ideas accessible to general readers.",
    stem: "Which choice completes the text with the most logical and precise word?",
    choices: ["verbose", "lucid", "obscure", "arcane"],
    correct: 1,
    explanation:
      "\"Clear, conversational language\" + \"accessible\" = transparent, easy to understand. \"Lucid\" means clear and easy to understand. \"Obscure\" and \"arcane\" mean the opposite. \"Verbose\" means wordy.",
    type: "vocabulary",
    difficulty: "medium",
  },
  {
    passage:
      "The diplomat's response to the crisis was deliberately ______: by refusing to commit to a specific course of action, she preserved flexibility while avoiding the appearance of indecision.",
    stem: "Which choice completes the text with the most logical and precise word?",
    choices: ["reckless", "ambiguous", "impulsive", "transparent"],
    correct: 1,
    explanation:
      "\"Refusing to commit\" + \"preserved flexibility\" = intentionally unclear. \"Ambiguous\" means open to multiple interpretations. The key word is \"deliberately\" \u2014 this was strategic vagueness, not accidental.",
    type: "vocabulary",
    difficulty: "medium",
  },
  {
    passage:
      "The documentary filmmaker's approach was not neutral; she had a clear ______ \u2014 to expose the environmental damage caused by industrial farming \u2014 that shaped every editorial decision from interview selection to soundtrack.",
    stem: "Which choice completes the text with the most logical and precise word?",
    choices: ["hobby", "whim", "agenda", "accident"],
    correct: 2,
    explanation:
      "A clear purpose that shaped all decisions = an \"agenda.\" Not neutral + intentional shaping = a deliberate plan. \"Hobby\" is too casual, \"whim\" is impulsive, \"accident\" contradicts intentionality.",
    type: "precision",
    difficulty: "medium",
  },
  {
    passage:
      "The ruins of the ancient amphitheater, though ______ by centuries of neglect and seismic activity, still convey the grandeur of the original structure through their massive stone arches and tiered seating carved directly into the hillside.",
    stem: "Which choice completes the text with the most logical and precise word?",
    choices: ["diminished", "enhanced", "replicated", "embellished"],
    correct: 0,
    explanation:
      "\"Neglect and seismic activity\" are destructive forces, BUT the grandeur still shows through. \"Diminished\" = made smaller/lesser. The ruins are damaged but still impressive. \"Enhanced\" and \"embellished\" suggest improvement.",
    type: "vocabulary",
    difficulty: "medium",
  },
  /* ── BLOCK 3: CRAFT & STRUCTURE (Q10-13) ── */
  {
    passage:
      "While popular accounts often describe the mantis shrimp's remarkable color vision \u2014 with 16 types of photoreceptors compared to humans' three \u2014 as evidence of a richer visual experience, marine biologist Dr. Thoen's research suggests a more nuanced picture. The shrimp's visual system appears optimized not for color discrimination but for rapid color recognition, allowing instant identification of prey and predators without the neural processing time that human-style color analysis requires.",
    stem: "Which choice best describes the main purpose of the text?",
    choices: [
      "To complicate a popular assumption about mantis shrimp vision by presenting research suggesting their visual system serves a different function than commonly believed",
      "To argue that mantis shrimp have poor vision",
      "To compare human and mantis shrimp intelligence",
      "To describe the habitat of the mantis shrimp"
    ],
    correct: 0,
    explanation:
      "\"While popular accounts...\" sets up the common view, then \"more nuanced picture\" signals a complication. The passage doesn't say the vision is worse \u2014 it serves a DIFFERENT function (rapid recognition vs. rich experience). B captures this nuance.",
    type: "purpose",
    difficulty: "medium",
  },
  {
    passage:
      "Economists have long debated whether raising the minimum wage increases unemployment. A 2023 meta-analysis of 50 years of research found no consistent evidence that moderate increases cause significant job losses. However, the study's authors cautioned that their findings apply only to increases of 10-15% above current levels; the effects of substantially larger increases remain poorly understood.",
    stem: "Which choice best describes the function of the last sentence in the overall structure of the text?",
    choices: [
      "It introduces a completely new topic unrelated to minimum wage",
      "It provides additional evidence supporting the meta-analysis",
      "It qualifies the study's conclusion by specifying the scope within which it applies",
      "It contradicts the findings of the meta-analysis"
    ],
    correct: 2,
    explanation:
      "The last sentence doesn't contradict \u2014 it LIMITS the scope. \"Only to increases of 10-15%\" and \"substantially larger increases remain poorly understood\" = the conclusion is valid but bounded. B captures this qualifying function.",
    type: "function",
    difficulty: "medium",
  },
  {
    passage:
      "Text 1:\nArchaeologist Dr. Yamamoto argues that the collapse of the Maya civilization was triggered primarily by prolonged drought, citing paleoclimate data showing a series of severe dry periods between 800-1000 CE that would have devastated the agricultural systems sustaining Maya cities.\n\nText 2:\nWhile acknowledging the role of drought, historian Dr. Reyes contends that environmental stress alone cannot explain the Maya collapse. Reyes points out that some Maya cities survived the same droughts that destroyed others, suggesting that political fragmentation, warfare between city-states, and the breakdown of trade networks made certain cities vulnerable to environmental shocks that more resilient communities weathered successfully.",
    stem: "Based on the texts, how would Dr. Reyes most likely respond to Dr. Yamamoto's argument?",
    choices: [
      "By suggesting that the Maya civilization did not actually collapse",
      "By agreeing that drought was the sole cause of the Maya collapse",
      "By arguing that drought played no role in the Maya collapse",
      "By contending that drought was a contributing factor but that political and economic fragility determined which communities collapsed"
    ],
    correct: 3,
    explanation:
      "Reyes \"acknowledges the role of drought\" (doesn't reject it) but says \"alone cannot explain\" because some cities survived the same droughts. The KEY variable is political/economic resilience. C captures this: drought contributed, but vulnerability determined outcomes.",
    type: "crosstext",
    difficulty: "hard",
  },
  {
    passage:
      "In 1947, when Jackie Robinson broke Major League Baseball's color barrier, he was not the best player in the Negro Leagues \u2014 that distinction belonged to Josh Gibson, whose career statistics rivaled Babe Ruth's. Branch Rickey, the Brooklyn Dodgers executive who recruited Robinson, chose him not for his athletic superiority but for his temperament: Robinson's ability to endure abuse without retaliating, Rickey calculated, would prove to white audiences that integration could work.",
    stem: "Which choice best describes the main purpose of the text?",
    choices: [
      "To reveal that Robinson's selection was based on strategic temperament rather than pure athletic merit",
      "To argue that Josh Gibson was better than Jackie Robinson",
      "To criticize Branch Rickey's decision-making process",
      "To describe the history of the Negro Leagues"
    ],
    correct: 0,
    explanation:
      "The passage contrasts athletic ability (Gibson was better) with the actual selection criterion (Robinson's temperament). The purpose is to reveal the strategic REASONING behind the choice \u2014 not talent but the ability to endure abuse.",
    type: "purpose",
    difficulty: "hard",
  },
  /* ── BLOCK 4: INFORMATION & IDEAS (Q14-20) ── */
  {
    passage:
      "The concept of 'rewilding' \u2014 reintroducing predators and other keystone species to ecosystems from which they've been eliminated \u2014 has gained momentum as a conservation strategy. In Yellowstone, the 1995 reintroduction of wolves triggered a 'trophic cascade': wolves reduced elk populations, which allowed overgrazed riverbank vegetation to recover, which stabilized stream banks, which altered the physical course of rivers. This single intervention reshaped an entire landscape, suggesting that rewilding can restore not just individual species but the complex ecological processes that sustain biodiversity.",
    stem: "Which choice best states the main idea of the text?",
    choices: [
      "The Yellowstone wolf reintroduction demonstrates that restoring keystone species can regenerate entire ecosystems through cascading ecological effects",
      "Wolves are the most important predator in North American ecosystems",
      "Elk populations in Yellowstone were too large before wolves were reintroduced",
      "Rewilding is controversial among conservationists"
    ],
    correct: 0,
    explanation:
      "The passage describes rewilding concept \u2192 Yellowstone example (wolves \u2192 elk \u2192 vegetation \u2192 rivers) \u2192 broader principle (restoring processes, not just species). B captures both the specific example and the broader implication.",
    type: "central",
    difficulty: "medium",
  },
  {
    passage:
      "A study of 1,000 startup companies found that those founded by individuals over 45 had a 2.3 times higher success rate than those founded by individuals under 30. The researchers noted that older founders typically had deeper industry knowledge, larger professional networks, and more management experience. Interestingly, venture capital firms allocated 72% of their funding to founders under 35.",
    stem: "Which inference is best supported by the text?",
    choices: [
      "There appears to be a significant misalignment between where venture capital is allocated and where founder success is most likely, suggesting age bias may influence investment decisions",
      "The study proves that age causes startup success",
      "Older people are better at everything than younger people",
      "Venture capital firms are investing optimally by focusing on young founders"
    ],
    correct: 0,
    explanation:
      "Higher success for 45+ founders BUT 72% of VC money goes to under-35 founders = investment patterns don't match success patterns. B captures this misalignment and suggests bias as a possible explanation, without overstating.",
    type: "inference",
    difficulty: "hard",
  },
  {
    passage:
      "Urban planner Dr. Santos argues that mixed-use zoning \u2014 allowing residential, commercial, and office space in the same neighborhoods \u2014 reduces car dependency more effectively than dedicated bike lanes or public transit alone.\n\nClaim: Dr. Santos argues that mixed-use development addresses the root cause of car dependency rather than just its symptoms.",
    stem: "Which finding would most effectively support this claim?",
    choices: [
      "A study of 50 cities found that residents of mixed-use neighborhoods made 40% fewer car trips than residents of single-use neighborhoods, regardless of the availability of bike lanes or transit \u2014 because daily needs like groceries, workplaces, and schools were within walking distance",
      "Dr. Santos has studied urban planning for over 20 years",
      "Some residents prefer living in single-use residential neighborhoods",
      "Mixed-use zoning has been adopted by several progressive cities"
    ],
    correct: 0,
    explanation:
      "The claim is about ROOT CAUSE (distance between destinations) vs. symptoms (how people travel). B shows that in mixed-use areas, car trips dropped 40% REGARDLESS of transit/bike availability \u2014 because destinations were walkable. This demonstrates that proximity, not transit, is the fundamental factor.",
    type: "evidence",
    difficulty: "hard",
  },
  {
    passage:
      "Researchers studied the impact of different teaching methods on long-term retention of science concepts.\n\n| Method | Immediate test | 1-month retention | 6-month retention |\n| Lecture only | 78% | 41% | 18% |\n| Lecture + discussion | 82% | 58% | 34% |\n| Hands-on lab | 76% | 67% | 52% |\n| Project-based | 71% | 69% | 61% |",
    stem: "Which claim is best supported by the data in the table?",
    choices: [
      "Methods with higher initial scores do not necessarily produce better long-term retention; in fact, project-based learning, which had the lowest immediate scores, showed the highest retention at six months",
      "Lecture is the most effective teaching method because it produces the highest immediate test scores",
      "Hands-on lab activities are always superior to lecture-based instruction",
      "All teaching methods produce identical results over time"
    ],
    correct: 0,
    explanation:
      "Lecture: highest immediate (78%) but lowest 6-month (18%). Project-based: lowest immediate (71%) but highest 6-month (61%). B accurately captures this inverse relationship between initial performance and long-term retention.",
    type: "data",
    difficulty: "hard",
  },
  {
    passage:
      "Neuroscientist Dr. Park proposes that bilingual individuals may have a reduced risk of Alzheimer's disease because constantly managing two language systems strengthens the brain's executive control networks, building 'cognitive reserve' that delays the onset of symptoms.",
    stem: "Which finding, if true, would most strengthen Dr. Park's proposal?",
    choices: [
      "Alzheimer's disease affects millions of people worldwide",
      "Brain imaging studies show that bilingual individuals who developed Alzheimer's had significantly more physical brain deterioration at the time of diagnosis than monolingual patients with equivalent symptoms \u2014 suggesting the bilingual brain tolerates more damage before symptoms appear",
      "Many bilingual individuals learned their second language in childhood",
      "Bilingual individuals tend to have higher incomes than monolingual individuals"
    ],
    correct: 1,
    explanation:
      "The proposal is about \"cognitive reserve\" (brain tolerates more damage). B provides direct evidence: bilingual Alzheimer's patients had MORE brain damage but EQUIVALENT symptoms \u2014 meaning their brains compensated longer. This is literally cognitive reserve in action.",
    type: "strengthen",
    difficulty: "hard",
  },
  {
    passage:
      "A study of emergency room visits found that patients who arrived during the day shift (7 AM-3 PM) waited an average of 45 minutes, those arriving during the evening shift (3 PM-11 PM) waited 78 minutes, and those arriving during the overnight shift (11 PM-7 AM) waited just 22 minutes. However, the study also found that patients treated during the overnight shift had a 23% higher rate of misdiagnosis than those treated during the day shift. The researchers concluded that ______",
    stem: "Which choice most logically completes the text?",
    choices: [
      "patients should always visit the emergency room during the day shift",
      "wait times have no relationship to the quality of medical care",
      "overnight emergency care is superior to daytime care in all respects",
      "shorter wait times during overnight shifts may come at the cost of diagnostic accuracy, possibly due to reduced staffing, physician fatigue, or limited access to specialist consultations"
    ],
    correct: 3,
    explanation:
      "Shortest wait (overnight) + highest misdiagnosis (overnight) = speed-quality tradeoff. B captures this and offers plausible explanations (fatigue, staffing, specialists) without overstating. A contradicts the data. C overgeneralizes. D is contradicted.",
    type: "completion",
    difficulty: "hard",
  },
  {
    passage:
      "The village of Eyam in Derbyshire, England, is known as the 'Plague Village' for a remarkable act of collective sacrifice during the 1665 bubonic plague. When the disease arrived via a flea-infested cloth shipment from London, the village's rector, William Mompesson, persuaded residents to quarantine the entire village \u2014 sealing themselves in to prevent the plague from spreading to neighboring communities. By the time the plague subsided fourteen months later, 260 of Eyam's 350 residents had died, but the surrounding villages were spared.",
    stem: "Which inference is best supported by the text?",
    choices: [
      "The residents of Eyam chose to accept a high probability of their own deaths in order to protect the wider community, demonstrating an extraordinary form of communal altruism",
      "All English villages during the 1665 plague enacted similar quarantines",
      "The bubonic plague was caused by contaminated cloth",
      "William Mompesson was the most important person in English history"
    ],
    correct: 0,
    explanation:
      "350 residents sealed themselves in knowing plague was present \u2192 260 died \u2192 surrounding villages spared. They knowingly accepted extreme personal risk for collective benefit. B captures this altruistic sacrifice. C oversimplifies (flea-infested cloth). D isn't supported (\"remarkable\" implies unusual).",
    type: "inference",
    difficulty: "hard",
  },
  /* ── BLOCK 5: EXPRESSION & SYNTHESIS (Q21-27) ── */
  {
    passage:
      "The museum's collection of Impressionist paintings is widely considered one of the finest in the Western Hemisphere.\n\n______, its holdings of post-war contemporary art have been criticized as uneven and lacking major works by several key movements.",
    stem: "Which transition most logically connects these sentences?",
    choices: ["For instance", "Furthermore", "By contrast", "As a result"],
    correct: 2,
    explanation:
      "Sentence 1: Impressionist collection is excellent (positive). Sentence 2: contemporary collection is uneven (negative). Different evaluations of different parts = contrast. \"By contrast\" signals the shift.",
    type: "transition",
    difficulty: "medium",
  },
  {
    passage:
      "Notes:\n\u2022 The Svalbard Global Seed Vault stores over 1.1 million seed samples from around the world.\n\u2022 The vault is located inside a mountain on a Norwegian Arctic island.\n\u2022 Its permafrost location ensures seeds remain frozen even without electricity.\n\u2022 The vault serves as a backup for national seed banks, which are vulnerable to war, natural disasters, and funding cuts.\n\u2022 In 2015, Syria withdrew seeds from Svalbard to replace samples destroyed in the civil war.\n\u2022 The vault contains no genetically modified seeds.\n\nThe writer wants to illustrate the vault's real-world importance through a concrete example.",
    stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: [
      "The Svalbard Global Seed Vault, located inside an Arctic mountain in Norway, stores over 1.1 million seed samples in naturally frozen conditions.",
      "The vault's importance was demonstrated in 2015 when Syria withdrew seeds to replace samples from its national seed bank that had been destroyed during the civil war \u2014 proving that the vault's role as a global backup against catastrophe is not theoretical but urgently practical.",
      "The Svalbard Seed Vault does not accept genetically modified seeds and is located in permafrost that keeps samples frozen without electricity.",
      "National seed banks around the world are vulnerable to war, natural disasters, and funding cuts."
    ],
    correct: 1,
    explanation:
      "Goal: REAL-WORLD importance through CONCRETE EXAMPLE. B uses the Syria withdrawal (specific 2015 event) to demonstrate the vault's purpose in action \u2014 a national collection destroyed by war, recovered through the backup. A is description. C is two facts. D is the problem without the solution.",
    type: "synthesis",
    difficulty: "hard",
  },
  {
    passage:
      "The composer's early symphonies adhered closely to classical forms, drawing favorable comparisons to Haydn and Mozart.\n\n______, her later works abandoned traditional structure entirely, incorporating electronic sounds, spoken word, and extended silences that polarized critics but earned her a devoted following among avant-garde audiences.",
    stem: "Which transition most logically connects these sentences?",
    choices: [
      "As a result",
      "In addition",
      "Over time, however",
      "Similarly"
    ],
    correct: 2,
    explanation:
      "Sentence 1: early work = classical, traditional. Sentence 2: later work = avant-garde, non-traditional. This is a temporal shift AND a contrast. \"Over time, however\" captures both the progression and the reversal.",
    type: "transition",
    difficulty: "hard",
  },
  {
    passage:
      "The glacier is melting.\n\nThe writer wants to convey the scale and irreversibility of the glacier's retreat through precise scientific detail.",
    stem: "Which revision most effectively accomplishes this goal?",
    choices: [
      "Scientists are worried about the glacier because it is shrinking.",
      "The glacier is retreating at a rate that concerns many researchers.",
      "The glacier has been getting smaller for some time now.",
      "Since 1980, the Jakobshavn glacier \u2014 Greenland's fastest-moving ice stream \u2014 has retreated over 40 kilometers and thinned by more than 200 meters, a loss of ice mass that glaciologists estimate would take approximately 10,000 years to rebuild under current climate conditions."
    ],
    correct: 3,
    explanation:
      "Goal: SCALE + IRREVERSIBILITY through SCIENTIFIC DETAIL. C provides specific glacier (Jakobshavn), measurements (40km retreat, 200m thinning), timeframe (since 1980), and irreversibility (10,000 years to rebuild). A, B, D are vague with no scientific detail.",
    type: "expression",
    difficulty: "hard",
  },
  {
    passage:
      "Notes:\n\u2022 Frida Kahlo painted 55 self-portraits out of approximately 200 total paintings.\n\u2022 Kahlo suffered lifelong pain from a bus accident at age 18 that left her with a broken spinal column, pelvis, and other injuries.\n\u2022 Her paintings frequently depict physical suffering, surgical imagery, and the boundary between the internal body and external world.\n\u2022 Kahlo was deeply influenced by Mexican folk art and pre-Columbian symbolism.\n\u2022 Her work was relatively obscure during her lifetime but has become iconic since the 1970s feminist art movement.\n\nThe writer wants to argue that Kahlo's personal suffering was central to her artistic vision.",
    stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: [
      "Frida Kahlo produced approximately 200 paintings during her career, including 55 self-portraits influenced by Mexican folk art.",
      "Frida Kahlo's work was not well known during her lifetime but became iconic after the 1970s feminist art movement.",
      "Kahlo's catastrophic bus accident at 18, which left her with a broken spine and pelvis, became the defining subject of her art \u2014 her 55 self-portraits repeatedly depict physical suffering, surgical imagery, and the blurred boundary between body and world, transforming personal agony into a radical visual language.",
      "Kahlo was influenced by Mexican folk art and pre-Columbian symbolism in her approximately 200 paintings."
    ],
    correct: 2,
    explanation:
      "Goal: suffering CENTRAL to art. B connects the accident (cause of suffering) \u2192 self-portraits depicting suffering, surgery, body/world boundary \u2192 transforms pain into art. The causal chain from injury to artistic vision is the argument.",
    type: "synthesis",
    difficulty: "hard",
  },
  {
    passage:
      "The pharmaceutical company's stock price has risen 340% over the past five years, making it one of the best-performing investments in the healthcare sector.\n\n______, an ongoing federal investigation into the company's pricing practices has created significant uncertainty about its long-term regulatory outlook.",
    stem: "Which transition most logically connects these sentences?",
    choices: [
      "At the same time",
      "As a result",
      "For example",
      "In addition"
    ],
    correct: 0,
    explanation:
      "Sentence 1: very positive (stock up 340%). Sentence 2: concerning (federal investigation, uncertainty). These are simultaneous truths in tension \u2014 the stock performs well BUT trouble looms. \"At the same time\" captures the coexistence of contradictory realities.",
    type: "transition",
    difficulty: "hard",
  },
  {
    passage:
      "Notes:\n\u2022 Octopuses have approximately 500 million neurons, comparable to a dog.\n\u2022 About two-thirds of an octopus's neurons are in its eight arms, not its central brain.\n\u2022 Octopuses can solve complex puzzles, use tools, and recognize individual human faces.\n\u2022 They have the shortest lifespan of any comparably intelligent animal \u2014 typically 1-2 years.\n\u2022 Octopuses are solitary and do not transmit learned behaviors to offspring.\n\nThe writer wants to highlight a paradox about octopus intelligence.",
    stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: [
      "The octopus presents a profound biological paradox: despite possessing intelligence comparable to far longer-lived animals \u2014 solving puzzles, using tools, recognizing human faces \u2014 each octopus dies within one to two years and, as a solitary animal, passes none of its learned knowledge to the next generation, meaning every octopus must rediscover intelligence from scratch.",
      "Octopuses have about 500 million neurons, with two-thirds located in their arms rather than their central brain.",
      "Octopuses can solve puzzles and recognize individual human faces, abilities that require significant cognitive processing.",
      "Octopuses are solitary animals that typically live only one to two years."
    ],
    correct: 0,
    explanation:
      "Goal: PARADOX. B identifies the contradiction: remarkable intelligence BUT ultra-short lifespan AND no cultural transmission = intelligence dies with each individual. \"Rediscover intelligence from scratch\" crystallizes the paradox. A is anatomy. C is lifespan. D is abilities without the paradox.",
    type: "synthesis",
    difficulty: "hard",
  },
];
