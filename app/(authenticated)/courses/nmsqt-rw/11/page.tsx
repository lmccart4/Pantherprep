"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import {
  ErrorCategoriesVisual,
  TrapPatternsVisual,
  DomainTriageVisual,
  ErrorJournalVisual,
} from "./lesson-visuals";

export default function NMSQTRWModule11() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/nmsqt-rw/12"
      nextModuleLabel="Module 12: Final Review & Strategies"
      visuals={{
        "error-categories": <ErrorCategoriesVisual />,
        "trap-patterns": <TrapPatternsVisual />,
        "domain-triage": <DomainTriageVisual />,
        "error-journal": <ErrorJournalVisual />,
      }}
      activities={{
        "exercise-m1": (goNext: () => void) => (
          <MatchingExercise
            items={M1_EXERCISE_DATA}
            title="M1"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-m2-hard": (goNext: () => void) => (
          <MatchingExercise
            items={M2_HARD_EXERCISE_DATA}
            title="M2 Hard"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-m2-std": (goNext: () => void) => (
          <MatchingExercise
            items={M2_STD_EXERCISE_DATA}
            title="M2 Std"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "error-analysis": (goNext: () => void) => (
          <ErrorAnalysisWorksheet
            domains={["Craft & Structure", "Information & Ideas", "Standard English Conventions", "Expression of Ideas"]}
            testLabel="PSAT/NMSQT Reading & Writing"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
      }}
    />
  );
}

const M1_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "The architect described her design philosophy as _______ — every element must serve a function, and anything purely decorative is eliminated.",
    "options": [
      "extravagant",
      "utilitarian",
      "ornamental",
      "whimsical"
    ],
    "correct": 1,
    "explanation": "\"Every element serves a function\" = utilitarian."
  },
  {
    "prompt": "The negotiations were _______ by mutual distrust, with each side interpreting the other's proposals as strategic maneuvers rather than genuine concessions.",
    "options": [
      "facilitated",
      "hampered",
      "resolved",
      "celebrated"
    ],
    "correct": 1,
    "explanation": "\"Mutual distrust\" = hindered. \"Hampered.\""
  },
  {
    "prompt": "Critics praised the documentary for its _______ portrayal, noting the filmmaker allowed subjects to tell their own stories without imposing a narrative.",
    "options": [
      "sensationalized",
      "partisan",
      "nuanced",
      "superficial"
    ],
    "correct": 2,
    "explanation": "\"Own stories, no imposed narrative\" = careful/balanced. \"Nuanced.\""
  },
  {
    "prompt": "The essay begins with global ocean temperature data. <u>It then narrows to one Australian reef and a marine biologist who has studied it for 20 years.</u> It concludes by returning to the global perspective.",
    "options": [
      "Shifts from global data to a personal case study.",
      "Introduces a counterargument.",
      "Provides statistical analysis.",
      "Summarizes the conclusion."
    ],
    "correct": 0,
    "explanation": "Global → specific reef + person = zoom-in structure."
  },
  {
    "prompt": "A city removed a downtown highway. Property values rose 30%, new parks attracted 2M visitors, and air quality improved. The author argues infrastructure removal can be as transformative as construction.",
    "options": [
      "Two theories evaluated.",
      "Chronological history.",
      "Decision described, effects cataloged, general principle drawn.",
      "Problem without solution."
    ],
    "correct": 2,
    "explanation": "Decision → effects → principle. Inductive reasoning."
  },
  {
    "prompt": "<strong>Text 1 (Osei):</strong> Ancient Polynesian navigation was primarily based on memorized star paths.<br><strong>Text 2 (Kim):</strong> Stars were central but Osei underestimates ocean swells — wave patterns felt through canoe hulls on cloudy nights.",
    "options": [
      "Rejection of non-instrument navigation.",
      "Complete disagreement.",
      "Extension to new areas.",
      "Accepts stellar navigation but qualifies by adding ocean swells."
    ],
    "correct": 3,
    "explanation": "Agrees stars important + adds swells as crucial backup. Qualification."
  },
  {
    "prompt": "<strong>Text 1 (Chen):</strong> Free will is an illusion — every decision is the inevitable product of brain states and physical laws.<br><strong>Text 2 (Brennan):</strong> Even if decisions are physically determined, the subjective experience of deliberation constitutes meaningful agency not captured by physical descriptions.",
    "options": [
      "Whether determinism eliminates meaningful agency or subjective experience adds something.",
      "Whether brains follow physics.",
      "Whether humans have brains.",
      "Whether philosophy is useful."
    ],
    "correct": 0,
    "explanation": "Both accept physical causation. Disagree on whether subjective experience adds meaningful agency."
  },
  {
    "prompt": "A Detroit garden program converted 1,500 vacant lots, producing 350K lbs of produce annually and reducing crime 18%. However, 80% of gardeners came from above-median-income households.",
    "options": [
      "Significant benefits but disproportionately served higher-income residents.",
      "Lots should not be converted.",
      "Program solved food insecurity.",
      "Gardens are ineffective at reducing crime."
    ],
    "correct": 0,
    "explanation": "Benefits + equity problem. Main idea captures both."
  },
  {
    "prompt": "Identical resumes with different names: traditionally African American names received 50% fewer callbacks. Blind screening eliminated the disparity.",
    "options": [
      "All employers are racist.",
      "Name-based bias can be reduced through blind screening.",
      "African American candidates are less qualified.",
      "Blind screening eliminates all discrimination."
    ],
    "correct": 1,
    "explanation": "Removing names fixed the gap → gap was name-based. (B) is precise without overgeneralizing."
  },
  {
    "prompt": "Each firefly species uses unique flash patterns. Some predatory species mimic prey species' patterns to lure males into ambushes.",
    "options": [
      "All fireflies have identical flashes.",
      "Fireflies communicate only by sound.",
      "Predatory fireflies are brighter.",
      "Flash patterns are species-specific signals exploitable by mimicking predators."
    ],
    "correct": 3,
    "explanation": "Species-specific + predator mimicry = exploitable signals."
  },
  {
    "prompt": "Dr. Reyes argues universal pre-K generates long-term returns exceeding costs.",
    "options": [
      "Pre-K teachers report high satisfaction.",
      "30-year study: pre-K children earned 25% more as adults, 60% less incarceration, $7 return per $1 invested.",
      "Private pre-K costs $12K/year.",
      "Pre-K enrollment up 40%."
    ],
    "correct": 1,
    "explanation": "Claim: returns exceed costs. (B) gives the $7 return per $1 ROI."
  },
  {
    "prompt": "| Method | Speed | Latency | Cost | Coverage |\n|---|---|---|---|---|\n| Fiber | 1,000 Mbps | 5ms | $70 | 43% |\n| Cable | 300 | 15 | $60 | 89% |\n| 5G | 200 | 25 | $50 | 32% |\n| Satellite | 100 | 600 | $110 | 99% |\n\nSupport the claim that satellite fills a gap despite limitations?",
    "options": [
      "Fiber is fastest.",
      "Satellite reaches 99% but at higher cost ($110) and 40-120x slower latency than terrestrial options.",
      "5G is cheapest.",
      "Cable balances speed and coverage."
    ],
    "correct": 1,
    "explanation": "Gap-filling (99% coverage) + limitations (cost, latency). Both addressed."
  },
  {
    "prompt": "Dr. Park argues bilinguals show delayed dementia onset.",
    "options": [
      "Second language easiest before 12.",
      "Bilingual programs in 30 states.",
      "Bilinguals use different brain regions.",
      "Study of 648 patients: bilinguals developed symptoms 4.5 years later than monolinguals with similar profiles."
    ],
    "correct": 3,
    "explanation": "4.5-year delay with controlled variables = direct support."
  },
  {
    "prompt": "Each of the 50 states _______ its own renewable energy policies, creating a patchwork of regulations.",
    "options": [
      "were establishing",
      "have established",
      "has established",
      "are establishing"
    ],
    "correct": 2,
    "explanation": "\"Each\" is singular → \"has.\""
  },
  {
    "prompt": "The conductor raised her baton, _______ the audience fell silent, and the first notes filled the hall.",
    "options": [
      "baton. the",
      "baton; the",
      "baton the",
      "baton, the"
    ],
    "correct": 2,
    "explanation": "Comma after introductory phrase. Wait — reread. \"Raised her baton\" is a complete clause. \"The audience fell silent\" is another. Three short ICs: comma+comma+and is acceptable for a series of short ICs."
  },
  {
    "prompt": "The study compared retrieval practice with rereading and found that the retrieval group _______ significantly more material one week later.",
    "options": [
      "was retaining",
      "retained",
      "are retaining",
      "have retained"
    ],
    "correct": 1,
    "explanation": "\"Found\" (past) → \"retained\" (past). Consistent tense."
  },
  {
    "prompt": "To qualify, applicants must submit an essay, provide two recommendation letters, _______ an interview with the committee.",
    "options": [
      "completing",
      "and completing",
      "and complete",
      "and to complete"
    ],
    "correct": 2,
    "explanation": "Must submit, provide, and complete. Parallel infinitives."
  },
  {
    "prompt": "The preservation of ancient _______ has given historians invaluable insight into daily life in Pompeii.",
    "options": [
      "texts, which include graffiti and personal letters",
      "texts, which include graffiti and personal letters,",
      "texts; which include graffiti and personal letters,",
      "texts — which include graffiti and personal letters —"
    ],
    "correct": 1,
    "explanation": "Nonessential \"which\" clause needs commas on both sides."
  },
  {
    "prompt": "The vaccine trial showed promising Phase II results. _______ researchers cautioned that larger Phase III trials were necessary.",
    "options": [
      "Moreover,",
      "For example,",
      "However,",
      "Similarly,"
    ],
    "correct": 2,
    "explanation": "Promising → caution needed. Contrast. \"However.\""
  },
  {
    "prompt": "The drought devastated wheat crops. _______ bread prices rose 22% within three months.",
    "options": [
      "For instance,",
      "Consequently,",
      "Nevertheless,",
      "In contrast,"
    ],
    "correct": 1,
    "explanation": "Drought → price rise. Cause/effect. \"Consequently.\""
  },
  {
    "prompt": "Her early paintings were large-scale urban oils. _______ her later work consisted of intimate watercolor portraits.",
    "options": [
      "Therefore,",
      "Indeed,",
      "By contrast,",
      "Moreover,"
    ],
    "correct": 2,
    "explanation": "Large/urban/oil → small/portrait/watercolor. Opposition. \"By contrast.\""
  },
  {
    "prompt": "Notes:\n\u2022 The cassowary disperses seeds of 200+ plant species through its droppings.\n\u2022 It can reach 50 km/h and kick hard enough to kill a human.\n\u2022 Population declined 30% due to habitat loss.\n\u2022 Listed as vulnerable on the IUCN Red List.\n\u2022 Native to tropical forests in New Guinea and NE Australia.\n\nGoal: Emphasize the cassowary\u2019s ecological importance?",
    "options": [
      "Native to New Guinea and Australia, one of the largest flightless birds.",
      "Serves as critical seed disperser for 200+ plant species, essential for forest regeneration.",
      "Can run 50 km/h and kick lethally.",
      "Population declined 30%, listed as vulnerable."
    ],
    "correct": 1,
    "explanation": "Goal: ecological importance. (C) = seed dispersal + 200 species + regeneration."
  },
  {
    "prompt": "Notes:\n\u2022 Antikythera mechanism dates to ~100 BCE, discovered in a 1901 shipwreck.\n\u2022 Ancient Greek analog computer predicting astronomical positions and eclipses.\n\u2022 Contains 30+ meshing bronze gears.\n\u2022 No comparable complexity until 14th-century European clockwork.\n\u2022 Internal mechanism reconstructed via X-ray tomography in 2006.\n\nGoal: Introduce the mechanism by emphasizing how it challenges assumptions about ancient tech?",
    "options": [
      "Contains 30+ bronze gears, classified as an analog computer.",
      "Built ~100 BCE with 30+ gears, it predicted eclipses \u2014 complexity not seen again for 1,400 years, upending assumptions about ancient engineering.",
      "Researchers used X-ray tomography in 2006 to understand its gears.",
      "Discovered in a 1901 shipwreck by sponge divers."
    ],
    "correct": 1,
    "explanation": "(C): date + capability + 1,400-year gap = directly challenges assumptions."
  }
];

const M2_HARD_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "The word \"cleave\" can mean either \"to split apart\" or \"to cling together.\" The geologist used the term precisely when she noted that the mineral _______ along its natural planes of weakness.",
    "options": [
      "bonded",
      "cleaved",
      "adhered",
      "fractured"
    ],
    "correct": 1,
    "explanation": "\"Along planes of weakness\" = splitting. \"Cleaved\" in the geological sense means split along natural planes."
  },
  {
    "prompt": "<strong>Text 1:</strong> Economist Torres argues that wealth taxes are the most effective tool for reducing inequality because they directly target accumulated capital.<br><strong>Text 2:</strong> Economist Nakamura agrees inequality must be addressed but argues wealth taxes are easily circumvented through offshore accounts and asset restructuring, making progressive consumption taxes more practical.",
    "options": [
      "Whether wealth taxes or consumption taxes are more effectively implementable.",
      "Whether taxes should exist.",
      "Whether capital accumulation matters.",
      "Whether inequality exists."
    ],
    "correct": 0,
    "explanation": "Both want to reduce inequality. They disagree on which TAX MECHANISM is most practical."
  },
  {
    "prompt": "The novel is structured as a palindrome: the first and last chapters mirror each other, as do the second and second-to-last, converging on a pivotal central chapter. <u>This symmetry forces readers to reconsider early events in light of later revelations, transforming what initially seemed like a straightforward chronology into a meditation on how endings reshape our understanding of beginnings.</u>",
    "options": [
      "Provides biographical context about the author.",
      "Introduces a counterargument about the novel.",
      "Explains the interpretive EFFECT of the palindrome structure on the reading experience.",
      "Describes the plot of the novel."
    ],
    "correct": 2,
    "explanation": "The underlined sentence describes what the structure DOES to readers — the effect of the form, not the content."
  },
  {
    "prompt": "Researchers found that trees in urban areas grow 25% faster than rural counterparts. However, they also die 30% sooner, resulting in a net loss of carbon sequestration capacity despite the accelerated growth.",
    "options": [
      "Rural trees are more important than urban trees.",
      "Carbon sequestration is unrelated to tree growth rate.",
      "Urban trees are healthier than rural trees.",
      "Urban trees grow faster but die sooner, negating the carbon benefit of accelerated growth."
    ],
    "correct": 3,
    "explanation": "Faster growth + earlier death = net loss. Main idea captures the paradox."
  },
  {
    "prompt": "| Diet | Weight Loss (kg) | Muscle Retained (%) | Adherence (%) | Nutrient Deficiency Risk |\n|---|---|---|---|---|\n| Mediterranean | 4.2 | 92% | 85% | Low |\n| Keto | 7.1 | 78% | 52% | Moderate |\n| Intermittent Fasting | 5.8 | 88% | 71% | Low |\n| Very Low Calorie | 9.3 | 65% | 34% | High |\n\nSupport the claim that the Mediterranean diet offers the most sustainable results?",
    "options": [
      "While Mediterranean diet produces moderate weight loss (4.2 kg), it leads in muscle retention (92%), adherence (85%), and has low deficiency risk \u2014 suggesting more sustainable long-term outcomes.",
      "Very Low Calorie achieves maximum weight loss at 9.3 kg.",
      "Keto produces 7.1 kg weight loss, more than Mediterranean.",
      "Intermittent fasting has 71% adherence."
    ],
    "correct": 0,
    "explanation": "\"Most sustainable\" = not just weight loss but retention + adherence + safety. (C) shows Mediterranean leads on all sustainability metrics."
  },
  {
    "prompt": "The playwright's revision history reveals that the final monologue — now considered the play's emotional climax — was originally a stage direction reading simply \"Character exits.\" The 200-word speech was added during the last week of rehearsals.",
    "options": [
      "The playwright was an inexperienced writer.",
      "Significant creative breakthroughs can occur late in the production process, fundamentally transforming a work.",
      "Actors should write their own monologues.",
      "The original stage direction was superior to the monologue."
    ],
    "correct": 1,
    "explanation": "The most important moment was created at the last minute → late additions can be transformative."
  },
  {
    "prompt": "Having been exposed to extreme heat for several _______ the satellite's solar panels began to show signs of degradation.",
    "options": [
      "hours, the",
      "hours; the",
      "hours the",
      "hours. The"
    ],
    "correct": 0,
    "explanation": "\"Having been exposed\" is a participial phrase. Comma separates it from the main clause."
  },
  {
    "prompt": "The researchers published their findings in three journals simultaneously, _______ their methodology, their results, and their policy recommendations.",
    "options": [
      "they detailed",
      "to detail",
      "and detailed",
      "detailing"
    ],
    "correct": 3,
    "explanation": "\"Detailing\" as a participial phrase modifying \"researchers published.\""
  },
  {
    "prompt": "The museum's collection spans five centuries of art, from Renaissance masterworks to contemporary installations, _______ it one of the most comprehensive in the region.",
    "options": [
      "which makes",
      "and makes",
      "it makes",
      "making"
    ],
    "correct": 3,
    "explanation": "\"Making\" = participial phrase modifying the entire preceding clause."
  },
  {
    "prompt": "The data showed improvement in patient outcomes. _______ the researchers emphasized that the sample size was too small to draw definitive conclusions.",
    "options": [
      "Nonetheless,",
      "For example,",
      "Furthermore,",
      "Consequently,"
    ],
    "correct": 0,
    "explanation": "Improvement → but can't conclude yet. \"Nonetheless\" = despite that."
  },
  {
    "prompt": "Ancient Egyptians developed papyrus scrolls for record-keeping. _______ the Chinese independently invented paper from plant fibers around 100 CE.",
    "options": [
      "However,",
      "Specifically,",
      "Therefore,",
      "Similarly,"
    ],
    "correct": 3,
    "explanation": "Two civilizations, similar innovation. Parallel development. \"Similarly.\""
  },
  {
    "prompt": "Notes:\n\u2022 CRISPR can correct 6,000+ genetic diseases.\n\u2022 First therapy for sickle cell disease in 2020 clinical trial.\n\u2022 Ethical concerns about germline \u201Cdesigner baby\u201D editing.\n\u2022 China reported first CRISPR-edited births in 2018 (condemned).\n\u2022 Adapted for human cells in 2013 at the Broad Institute.\n\nGoal: Present CRISPR\u2019s medical potential while acknowledging risks?",
    "options": [
      "CRISPR was adapted for human cells in 2013.",
      "The 2018 gene-edited births were condemned internationally.",
      "CRISPR could correct 6,000 genetic diseases.",
      "Since treating sickle cell disease in 2020, CRISPR has shown potential to address 6,000+ genetic diseases \u2014 but its power has also raised serious ethical concerns, underscored by the condemned 2018 report of gene-edited human births in China."
    ],
    "correct": 3,
    "explanation": "Dual goal: potential + risks. (B) includes sickle cell success + 6,000 diseases AND ethical concerns + condemned births."
  },
  {
    "prompt": "The diplomat was known for her _______ approach — she never committed to a position publicly until she had secured enough private agreements to guarantee the outcome.",
    "options": [
      "transparent",
      "impulsive",
      "confrontational",
      "circumspect"
    ],
    "correct": 3,
    "explanation": "\"Never committed until secured agreements\" = cautious/strategic. \"Circumspect.\""
  },
  {
    "prompt": "The study found that noise pollution above 65 decibels increased cardiovascular risk by 18%. _______ researchers recommended that urban planning incorporate sound barriers along highways adjacent to residential areas.",
    "options": [
      "For this reason,",
      "Nevertheless,",
      "In contrast,",
      "Similarly,"
    ],
    "correct": 0,
    "explanation": "Finding → recommendation based on it. Cause/effect. \"For this reason.\""
  }
];

const M2_STD_EXERCISE_DATA: MatchingItem[] = [
  {
    "prompt": "The teacher was known for her _______ patience, calmly repeating explanations until every student understood.",
    "options": [
      "declining",
      "remarkable",
      "artificial",
      "limited"
    ],
    "correct": 1,
    "explanation": "\"Calmly repeating until every student understood\" = exceptional patience. \"Remarkable.\""
  },
  {
    "prompt": "<strong>Text 1:</strong> Dr. Lin argues exercise improves mental health.<br><strong>Text 2:</strong> Dr. Patel agrees but notes benefits require at least 150 minutes weekly — below that threshold, effects are minimal.",
    "options": [
      "Rejects the research.",
      "Disagrees entirely.",
      "Accepts the benefit but qualifies by adding a minimum dose requirement.",
      "Extends to new populations."
    ],
    "correct": 2,
    "explanation": "Agrees + adds condition = qualification."
  },
  {
    "prompt": "The article first describes how smartphones changed communication, then examines their effects on attention spans, and finally argues that the benefits outweigh the costs.",
    "options": [
      "Chronological history.",
      "Presents two equal arguments.",
      "Describes a technology, examines drawbacks, argues net positive.",
      "Problem-solution."
    ],
    "correct": 2,
    "explanation": "Description → examination of effects → evaluative conclusion."
  },
  {
    "prompt": "The city planted 10,000 trees along major roads. Within five years, air quality in those corridors improved by 22%, and summer temperatures dropped by an average of 2°C compared to unplanted streets.",
    "options": [
      "Urban tree planting produced measurable improvements in air quality and temperature.",
      "The city wasted money on trees.",
      "Temperature is unrelated to vegetation.",
      "Trees are expensive to plant."
    ],
    "correct": 0,
    "explanation": "Trees planted → air quality up 22% + temps down 2°C. Direct cause and effect."
  },
  {
    "prompt": "Students who took handwritten notes scored 15% higher on conceptual questions than laptop note-takers, even though laptop users recorded more words. Researchers suggest handwriting forces students to process and summarize information.",
    "options": [
      "All students prefer handwriting.",
      "Handwritten notes contain more information.",
      "Laptops should be banned from classrooms.",
      "The cognitive effort of handwriting promotes deeper understanding than verbatim transcription."
    ],
    "correct": 3,
    "explanation": "More words (laptop) ≠ better understanding. Handwriting forces processing → deeper learning."
  },
  {
    "prompt": "Dr. Reyes argues community gardens improve food security in urban areas.",
    "options": [
      "Community gardens are popular in many cities.",
      "Gardening is good exercise.",
      "A study of 200 households near community gardens found they consumed 30% more fresh vegetables and spent 20% less on groceries than comparable households without nearby gardens.",
      "Many schools have started garden programs."
    ],
    "correct": 2,
    "explanation": "Claim: improve food security. (B) shows more vegetables + lower costs = direct food security improvement."
  },
  {
    "prompt": "Neither the principal nor the teachers _______ aware of the policy change until the announcement.",
    "options": [
      "were",
      "is",
      "has been",
      "was"
    ],
    "correct": 0,
    "explanation": "\"Neither…nor\" — verb agrees with nearer subject \"teachers\" (plural) → \"were.\""
  },
  {
    "prompt": "The building, originally constructed in 1890 as a textile mill, _______ into luxury apartments in 2018.",
    "options": [
      "are converted",
      "was converted",
      "has converting",
      "were converted"
    ],
    "correct": 1,
    "explanation": "\"Building\" (singular) + specific past date (2018) → \"was converted.\""
  },
  {
    "prompt": "Scientists study coral reefs to understand marine biodiversity, _______ the data they collect helps inform conservation policy.",
    "options": [
      "biodiversity, the",
      "biodiversity the",
      "biodiversity. The,",
      "biodiversity; the"
    ],
    "correct": 3,
    "explanation": "Two ICs → semicolon."
  },
  {
    "prompt": "The new highway reduced commute times by 20%. _______ it displaced 300 families from their homes.",
    "options": [
      "Moreover,",
      "Consequently,",
      "However,",
      "For instance,"
    ],
    "correct": 2,
    "explanation": "Benefit (faster commute) → cost (displaced families). Contrast. \"However.\""
  },
  {
    "prompt": "The researcher first tested the drug on cells in a lab. _______ she moved to animal trials.",
    "options": [
      "For example,",
      "In contrast,",
      "Subsequently,",
      "Nevertheless,"
    ],
    "correct": 2,
    "explanation": "Lab → then animals. Time sequence. \"Subsequently.\""
  },
  {
    "prompt": "Notes:\n\u2022 Honey has low moisture (17%) and acidic pH, preventing bacterial growth.\n\u2022 3,000-year-old honey found in Egyptian tombs was still edible.\n\u2022 Bees produce honey by regurgitating and evaporating nectar.\n\u2022 Average bee produces $\\frac{1}{12}$th teaspoon in its lifetime.\n\nGoal: Explain WHY honey doesn\u2019t spoil?",
    "options": [
      "Found in 3,000-year-old Egyptian tombs.",
      "Low moisture (17%) and acidic pH create an environment hostile to bacteria, preventing spoilage.",
      "Bees regurgitate nectar to make honey.",
      "A single bee produces very little honey."
    ],
    "correct": 1,
    "explanation": "Goal: explain WHY. (B) = mechanism (moisture + pH \u2192 no bacteria)."
  },
  {
    "prompt": "The singer's voice was _______ — barely above a whisper — yet every word carried clearly to the back of the concert hall.",
    "options": [
      "thunderous",
      "monotone",
      "subdued",
      "shrill"
    ],
    "correct": 2,
    "explanation": "\"Barely above a whisper\" = quiet/restrained. \"Subdued.\""
  },
  {
    "prompt": "The lake had been polluted for decades. _______ after a $50 million cleanup effort, fish populations returned to pre-industrial levels.",
    "options": [
      "Similarly,",
      "In addition,",
      "For instance,",
      "However,"
    ],
    "correct": 3,
    "explanation": "Polluted (negative) → cleaned up, recovered (positive turnaround). Contrast. \"However.\""
  },
  {
    "prompt": "Notes:\n\u2022 The platypus lays eggs, has venom, uses electroreception, and has a genome mixing bird, reptile, and mammal genes.\n\u2022 Native to eastern Australia.\n\u2022 Population stable but habitat threatened by drought and development.\n\nGoal: Present the platypus as biologically unique?",
    "options": [
      "Population is threatened by drought.",
      "Laying eggs like a reptile, delivering venom like a snake, and detecting prey electrically like a shark \u2014 all with a genome blending bird, reptile, and mammal DNA \u2014 the platypus defies every conventional category of classification.",
      "Found in rivers and streams.",
      "Native to eastern Australia."
    ],
    "correct": 1,
    "explanation": "Goal: biologically unique. (B) lists cross-class traits + mixed genome."
  }
];

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "rw",
  moduleNum: 11,
  title: "Error Analysis Workshop",
  subtitle:
    "Analyze mistakes and strengthen weak areas -- turn errors into insights.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-m1", label: "M1", icon: "zap" },
    { id: "exercise-m2-hard", label: "M2 Hard", icon: "zap" },
    { id: "exercise-m2-std", label: "M2 Std", icon: "zap" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "error-analysis", label: "Error Analysis", icon: "clipboard" },
    { id: "challenge", label: "Challenge", icon: "flame" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  warmup: [
    {
      source: "Module 4 -- Words in Context",
      stem: "The architect described her design philosophy as _______ -- every element must serve a function, and anything purely decorative is eliminated.\n\nWhich word best completes the text?",
      choices: ["extravagant", "utilitarian", "ornamental", "whimsical"],
      correct: 1,
      explanation: '"Every element serves a function" = utilitarian.',
    },
    {
      source: "Module 4 -- Words in Context",
      stem: "The negotiations were _______ by mutual distrust, with each side interpreting the other's proposals as strategic maneuvers rather than genuine concessions.\n\nWhich word best completes the text?",
      choices: ["facilitated", "hampered", "resolved", "celebrated"],
      correct: 1,
      explanation: '"Mutual distrust" = hindered. "Hampered."',
    },
    {
      source: "Module 7 -- Structure",
      stem: "The essay begins with global ocean temperature data. It then narrows to one Australian reef and a marine biologist who has studied it for 20 years. It concludes by returning to the global perspective.\n\nWhich choice best describes the function of the second sentence?",
      choices: [
        "Shifts from global data to a personal case study.",
        "Introduces a counterargument.",
        "Provides statistical analysis.",
        "Summarizes the conclusion."
      ],
      correct: 0,
      explanation:
        "Global -> specific reef + person = zoom-in structure.",
    },
    {
      source: "Module 5 -- Inferences",
      stem: "Identical resumes with different names: traditionally African American names received 50% fewer callbacks. Blind screening eliminated the disparity.\n\nBased on the text, which inference is best supported?",
      choices: [
        "All employers are racist.",
        "Name-based bias can be reduced through blind screening.",
        "African American candidates are less qualified.",
        "Blind screening eliminates all discrimination."
      ],
      correct: 1,
      explanation:
        "Removing names fixed the gap -> gap was name-based. (B) is precise without overgeneralizing.",
    },
  ],

  lessons: [
    {
      id: "error-categories",
      title: "Four Error Categories",
      subtitle: "Classify WHY you missed each question",
      visual: "error-categories",
      body: [
        "Every wrong answer falls into one of four categories: (1) Content Gap -- you didn't know the rule, concept, or vocabulary. (2) Trap Answer -- you knew the material but fell for a distractor. (3) Misread -- you misread the passage, question, or a key word. (4) Time Pressure -- you rushed and didn't apply your full process.",
        "Content Gaps require study. Trap Answers require strategy refinement. Misreads require reading discipline. Time Pressure requires pacing practice.",
        "After every practice set, classify each error. The pattern tells you exactly what to work on.",
      ],
    },
    {
      id: "trap-patterns",
      title: "Common Trap Answer Patterns",
      subtitle: "Recognize the traps before they catch you",
      visual: "trap-patterns",
      body: [
        "Scope traps: Too broad, too narrow, or slightly off-topic. The answer is about the right subject but at the wrong level of specificity.",
        "Reversal traps: The answer uses the right vocabulary but reverses the relationship (cause/effect flipped, support/undermine swapped). Always check the DIRECTION of the relationship.",
        "Partial-truth traps: The answer is partially correct but includes one wrong detail. Read every word of every answer choice -- one wrong word makes the whole answer wrong.",
      ],
    },
    {
      id: "domain-triage",
      title: "Domain Triage",
      subtitle: "Prioritize your weakest areas",
      visual: "domain-triage",
      body: [
        "After analyzing your errors, rank domains by accuracy: lowest accuracy = highest priority for study. A domain where you score 50% has more room for improvement than one where you score 90%.",
        "For each weak domain, go back to the relevant module: Conventions -> Modules 2-3. Words in Context -> Module 4. Central Ideas/Inferences -> Module 5. Evidence -> Module 6. Structure -> Module 7. Transitions/Synthesis -> Modules 8-9.",
        "Spend 70% of study time on weak domains and 30% maintaining strong ones. This is the fastest path to score improvement.",
      ],
    },
    {
      id: "error-journal",
      title: "The Error Journal Method",
      subtitle: "Track patterns over time",
      visual: "error-journal",
      body: [
        "Keep a running log of every error with: (1) Question type/domain, (2) What you chose vs. what was correct, (3) WHY you chose wrong (the error category), (4) The rule or insight you should have applied.",
        "Review your error journal before every practice session. After 3-4 sessions, clear patterns emerge: maybe you consistently miss modifier questions, or you always fall for scope traps on central idea questions.",
        "The error journal converts random practice into targeted improvement. Without it, you're likely repeating the same mistakes.",
      ],
    },
  ],

  quiz: [
    {
      passage:
        "Critics praised the documentary for its _______ portrayal, noting the filmmaker allowed subjects to tell their own stories without imposing a narrative.",
      stem: "Which word best completes the text?",
      choices: ["sensationalized", "partisan", "nuanced", "superficial"],
      correct: 2,
      explanation:
        '"Own stories, no imposed narrative" = careful/balanced. "Nuanced."',
      type: "WIC",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A city removed a downtown highway. Property values rose 30%, new parks attracted 2M visitors, and air quality improved. The author argues infrastructure removal can be as transformative as construction.",
      stem: "Which choice best describes the overall structure?",
      choices: [
        "Two theories evaluated.",
        "Chronological history.",
        "Decision described, effects cataloged, general principle drawn.",
        "Problem without solution."
      ],
      correct: 2,
      explanation: "Decision -> effects -> principle. Inductive reasoning.",
      type: "Structure",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Text 1 (Osei): Ancient Polynesian navigation was primarily based on memorized star paths.\n\nText 2 (Kim): Stars were central but Osei underestimates ocean swells -- wave patterns felt through canoe hulls on cloudy nights.",
      stem: "How does Kim relate to Osei?",
      choices: [
        "Rejection of non-instrument navigation.",
        "Complete disagreement.",
        "Extension to new areas.",
        "Accepts stellar navigation but qualifies by adding ocean swells."
      ],
      correct: 3,
      explanation:
        "Agrees stars important + adds swells as crucial backup. Qualification.",
      type: "Cross-Text",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Text 1 (Chen): Free will is an illusion -- every decision is the inevitable product of brain states and physical laws.\n\nText 2 (Brennan): Even if decisions are physically determined, the subjective experience of deliberation constitutes meaningful agency not captured by physical descriptions.",
      stem: "What is the core of the disagreement?",
      choices: [
        "Whether determinism eliminates meaningful agency or subjective experience adds something.",
        "Whether brains follow physics.",
        "Whether humans have brains.",
        "Whether philosophy is useful."
      ],
      correct: 0,
      explanation:
        "Both accept physical causation. Disagree on whether subjective experience adds meaningful agency.",
      type: "Cross-Text",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A Detroit garden program converted 1,500 vacant lots, producing 350K lbs of produce annually and reducing crime 18%. However, 80% of gardeners came from above-median-income households.",
      stem: "Which choice best states the main idea of the text?",
      choices: [
        "Significant benefits but disproportionately served higher-income residents.",
        "Lots should not be converted.",
        "Program solved food insecurity.",
        "Gardens are ineffective at reducing crime."
      ],
      correct: 0,
      explanation: "Benefits + equity problem. Main idea captures both.",
      type: "Central Ideas",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Each firefly species uses unique flash patterns. Some predatory species mimic prey species' patterns to lure males into ambushes.",
      stem: "Based on the text, which inference is best supported?",
      choices: [
        "All fireflies have identical flashes.",
        "Fireflies communicate only by sound.",
        "Predatory fireflies are brighter.",
        "Flash patterns are species-specific signals exploitable by mimicking predators."
      ],
      correct: 3,
      explanation:
        "Species-specific + predator mimicry = exploitable signals.",
      type: "Inferences",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Dr. Reyes argues universal pre-K generates long-term returns exceeding costs.",
      stem: "Which finding would most directly support Reyes's claim?",
      choices: [
        "Pre-K teachers report high satisfaction.",
        "30-year study: pre-K children earned 25% more as adults, 60% less incarceration, $7 return per $1 invested.",
        "Private pre-K costs $12K/year.",
        "Pre-K enrollment up 40%."
      ],
      correct: 1,
      explanation:
        "Claim: returns exceed costs. (B) gives the $7 return per $1 ROI.",
      type: "Textual Evidence",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Internet access data: Fiber offers 1,000 Mbps speed, 5ms latency, $70 cost, 43% coverage. Cable offers 300 Mbps, 15ms, $60, 89% coverage. 5G offers 200 Mbps, 25ms, $50, 32% coverage. Satellite offers 100 Mbps, 600ms latency, $110, 99% coverage.",
      stem: "Which choice supports the claim that satellite internet fills a gap despite limitations?",
      choices: [
        "5G is cheapest.",
        "Fiber is fastest.",
        "Satellite reaches 99% coverage but at higher cost ($110) and 40-120x slower latency than terrestrial options.",
        "Cable balances speed and coverage."
      ],
      correct: 2,
      explanation:
        "Gap-filling (99% coverage) + limitations (cost, latency). Both addressed.",
      type: "Quantitative Evidence",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Each of the 50 states _______ its own renewable energy policies, creating a patchwork of regulations.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "were establishing",
        "have established",
        "has established",
        "are establishing"
      ],
      correct: 2,
      explanation: '"Each" is singular -> "has."',
      type: "Conventions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The study compared retrieval practice with rereading and found that the retrieval group _______ significantly more material one week later.",
      stem: "Which choice conforms to Standard English?",
      choices: ["was retaining", "retained", "are retaining", "have retained"],
      correct: 1,
      explanation:
        '"Found" (past) -> "retained" (past). Consistent tense.',
      type: "Conventions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "To qualify, applicants must submit an essay, provide two recommendation letters, _______ an interview with the committee.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "completing",
        "and completing",
        "and complete",
        "and to complete"
      ],
      correct: 2,
      explanation:
        "Must submit, provide, and complete. Parallel infinitives.",
      type: "Conventions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The vaccine trial showed promising Phase II results. _______ researchers cautioned that larger Phase III trials were necessary.",
      stem: "Which transition best completes the text?",
      choices: ["Moreover,", "For example,", "However,", "Similarly,"],
      correct: 2,
      explanation:
        'Promising -> caution needed. Contrast. "However."',
      type: "Transitions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The drought devastated wheat crops. _______ bread prices rose 22% within three months.",
      stem: "Which transition best completes the text?",
      choices: [
        "For instance,",
        "Consequently,",
        "Nevertheless,",
        "In contrast,"
      ],
      correct: 1,
      explanation:
        'Drought -> price rise. Cause/effect. "Consequently."',
      type: "Transitions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Her early paintings were large-scale urban oils. _______ her later work consisted of intimate watercolor portraits.",
      stem: "Which transition best completes the text?",
      choices: ["Therefore,", "Indeed,", "By contrast,", "Moreover,"],
      correct: 2,
      explanation:
        'Large/urban/oil -> small/portrait/watercolor. Opposition. "By contrast."',
      type: "Transitions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The cassowary disperses seeds of 200+ plant species through its droppings. It can reach 50 km/h and kick hard enough to kill a human. Population declined 30% due to habitat loss. Listed as vulnerable on the IUCN Red List. Native to tropical forests in New Guinea and NE Australia.",
      stem: "Which choice emphasizes the cassowary's ecological importance?",
      choices: [
        "Native to New Guinea and Australia, one of the largest flightless birds.",
        "Serves as critical seed disperser for 200+ plant species, essential for forest regeneration.",
        "Can run 50 km/h and kick lethally.",
        "Population declined 30%, listed as vulnerable."
      ],
      correct: 1,
      explanation:
        "Goal: ecological importance. (C) = seed dispersal + 200 species + regeneration.",
      type: "Synthesis",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Antikythera mechanism dates to ~100 BCE, discovered in a 1901 shipwreck. Ancient Greek analog computer predicting astronomical positions and eclipses. Contains 30+ meshing bronze gears. No comparable complexity until 14th-century European clockwork. Internal mechanism reconstructed via X-ray tomography in 2006.",
      stem: "Which choice introduces the mechanism by emphasizing how it challenges assumptions about ancient technology?",
      choices: [
        "Researchers used X-ray tomography in 2006 to understand its gears.",
        "Discovered in a 1901 shipwreck by sponge divers.",
        "Built ~100 BCE with 30+ gears, it predicted eclipses -- complexity not seen again for 1,400 years, upending assumptions about ancient engineering.",
        "Contains 30+ bronze gears, classified as an analog computer."
      ],
      correct: 2,
      explanation:
        "(C): date + capability + 1,400-year gap = directly challenges assumptions.",
      type: "Synthesis",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  challenge: [
    {
      passage:
        'The word "cleave" can mean either "to split apart" or "to cling together." The geologist used the term precisely when she noted that the mineral _______ along its natural planes of weakness.',
      stem: "Which word best completes the text?",
      choices: ["bonded", "cleaved", "adhered", "fractured"],
      correct: 1,
      explanation:
        '"Along planes of weakness" = splitting. "Cleaved" in the geological sense means split along natural planes.',
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Text 1: Economist Torres argues that wealth taxes are the most effective tool for reducing inequality because they directly target accumulated capital.\n\nText 2: Economist Nakamura agrees inequality must be addressed but argues wealth taxes are easily circumvented through offshore accounts and asset restructuring, making progressive consumption taxes more practical.",
      stem: "What is the core disagreement?",
      choices: [
        "Whether wealth taxes or consumption taxes are more effectively implementable.",
        "Whether taxes should exist.",
        "Whether capital accumulation matters.",
        "Whether inequality exists."
      ],
      correct: 0,
      explanation:
        "Both want to reduce inequality. They disagree on which TAX MECHANISM is most practical.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        'The novel is structured as a palindrome: the first and last chapters mirror each other, as do the second and second-to-last, converging on a pivotal central chapter. This symmetry forces readers to reconsider early events in light of later revelations, transforming what initially seemed like a straightforward chronology into a meditation on how endings reshape our understanding of beginnings.',
      stem: "Which choice best describes the function of the second sentence?",
      choices: [
        "Provides biographical context about the author.",
        "Introduces a counterargument about the novel.",
        "Explains the interpretive EFFECT of the palindrome structure on the reading experience.",
        "Describes the plot of the novel."
      ],
      correct: 2,
      explanation:
        "The sentence describes what the structure DOES to readers -- the effect of the form, not the content.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Researchers found that trees in urban areas grow 25% faster than rural counterparts. However, they also die 30% sooner, resulting in a net loss of carbon sequestration capacity despite the accelerated growth.",
      stem: "Which choice best states the main idea?",
      choices: [
        "Rural trees are more important than urban trees.",
        "Carbon sequestration is unrelated to tree growth rate.",
        "Urban trees are healthier than rural trees.",
        "Urban trees grow faster but die sooner, negating the carbon benefit of accelerated growth."
      ],
      correct: 3,
      explanation:
        "Faster growth + earlier death = net loss. Main idea captures the paradox.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Diet comparison data: Mediterranean achieves 4.2 kg weight loss, 92% muscle retained, 85% adherence, low deficiency risk. Keto achieves 7.1 kg, 78% muscle, 52% adherence, moderate risk. Intermittent Fasting achieves 5.8 kg, 88% muscle, 71% adherence, low risk. Very Low Calorie achieves 9.3 kg, 65% muscle, 34% adherence, high risk.",
      stem: "Which choice supports the claim that the Mediterranean diet offers the most sustainable results?",
      choices: [
        "Intermittent fasting has 71% adherence.",
        "Keto produces 7.1 kg weight loss, more than Mediterranean.",
        "Very Low Calorie achieves maximum weight loss at 9.3 kg.",
        "While Mediterranean diet produces moderate weight loss (4.2 kg), it leads in muscle retention (92%), adherence (85%), and has low deficiency risk -- suggesting more sustainable long-term outcomes."
      ],
      correct: 3,
      explanation:
        '"Most sustainable" = not just weight loss but retention + adherence + safety. (C) shows Mediterranean leads on all sustainability metrics.',
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The diplomat was known for her _______ approach -- she never committed to a position publicly until she had secured enough private agreements to guarantee the outcome.",
      stem: "Which word best completes the text?",
      choices: ["transparent", "impulsive", "confrontational", "circumspect"],
      correct: 3,
      explanation:
        '"Never committed until secured agreements" = cautious/strategic. "Circumspect."',
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  takeaways: [
    "Module 1 accuracy is everything. Hard Module 2 unlocks the upper score range.",
    "The adaptive system means every M1 question affects your ceiling.",
    "Hard M2 questions are more nuanced -- secondary meanings, subtle cross-text, complex data.",
    "Build stamina for back-to-back timed modules.",
    "Routing questions -- M1 errors that could have changed your assignment -- are highest-value study targets.",
  ],
};
