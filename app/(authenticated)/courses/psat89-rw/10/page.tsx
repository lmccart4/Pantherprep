"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import { GrowthTracker } from "@/components/course/activities/growth-tracker";
import {
  TwoPassVisual,
  PacingVisual,
  EliminationVisual,
} from "./lesson-visuals";

export default function PSAT89RWModule10() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref={undefined}
      nextModuleLabel={undefined}
      visuals={{
        "two-pass": <TwoPassVisual />,
        "pacing": <PacingVisual />,
        "elimination": <EliminationVisual />,
      }}
      activities={{
        "error-analysis": (goNext: () => void) => (
          <ErrorAnalysisWorksheet
            domains={["Craft & Structure", "Information & Ideas", "Standard English Conventions", "Expression of Ideas"]}
            testLabel="PSAT 8/9 Reading & Writing"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "growth-tracker": (goNext: () => void) => (
          <GrowthTracker
            testType="psat89"
            section="rw"
            totalQuestions={54}
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
      }}
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "rw",
  moduleNum: 10,
  title: "Review & Error Analysis",
  subtitle: "Analyze patterns and strengthen weak areas",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "error-analysis", label: "Error Analysis", icon: "clipboard" },
    { id: "growth-tracker", label: "Growth Tracker", icon: "chart" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],
  lessons: [
    {
      id: "10a",
      title: "The Two-Pass System",
      subtitle: "Topic 10A \u2014 Two-Pass Strategy",
      body: [
        "The single most important R&W strategy: don\u2019t get stuck. Every question is worth the same number of points.",
        "Pass 1 (first 25 min): Move through all 27 questions. If you can answer it in ~60 seconds, answer it. If not, flag it and move on.\n\nPass 2 (last 7 min): Return to flagged questions. You now have context from the full module and can focus your remaining time.\n\nLast 30 seconds: Answer ALL remaining blanks. There is no penalty for guessing.",
        "Why This Works for R&W:\nR&W questions vary dramatically in difficulty. A transitions question might take 15 seconds; a Command of Evidence question with a data table might take 2 minutes. The two-pass system prevents you from spending 3 minutes on a hard question while easy points sit unanswered later in the module.",
      ],
      visual: "two-pass",
    },
    {
      id: "10b",
      title: "Pacing Checkpoints & Question Triage",
      subtitle: "Topic 10B \u2014 Pacing Strategy",
      body: [
        "Know where you should be at key time intervals so you can adjust your pace in real time.",
        "Pacing Checkpoints:\n\u2022 8 min \u2192 Finishing Question 7. If you\u2019re on Q5 or earlier, speed up.\n\u2022 16 min \u2192 Finishing Question 14. Halfway mark. If you\u2019ve flagged more than 5, you may be flagging too aggressively.\n\u2022 25 min \u2192 Finishing Question 27 (Pass 1 complete). Time to start Pass 2.\n\u2022 31 min \u2192 1 minute left. Answer ALL remaining blanks. Guess on anything still flagged.",
        "Speed by Question Type:\n\u2022 ~20 sec: Transitions (Module 8) \u2014 Read relationship, name category, pick word.\n\u2022 ~45 sec: Grammar/Conventions (Modules 6\u20137) \u2014 Find the error, pick the fix.\n\u2022 ~60 sec: Vocabulary in context, Central Ideas (Modules 2\u20133) \u2014 Read passage, identify the key.\n\u2022 ~75 sec: Inference, Command of Evidence (Modules 4\u20135) \u2014 Read carefully, evaluate each choice.\n\u2022 ~90 sec: Rhetorical Synthesis (Module 9) \u2014 Read notes, identify goal, match answer.",
        "The 90-second rule: If you\u2019ve spent 90 seconds on any question and you\u2019re stuck, pick your best guess, flag it, and move on. You can always come back in Pass 2.",
      ],
      visual: "pacing",
    },
    {
      id: "10c",
      title: "Answer Elimination",
      subtitle: "Topic 10C \u2014 Elimination Strategy",
      body: [
        "On the PSAT, eliminating wrong answers is often easier than finding the right one.",
        "Wrong-Answer Patterns on R&W:\n\u2022 Too extreme: Uses absolute language (\u201calways,\u201d \u201cnever,\u201d \u201ccompletely\u201d) when the passage is more nuanced.\n\u2022 Right topic, wrong claim: Discusses the same subject but makes a claim the passage doesn\u2019t support. Very common on inference questions.\n\u2022 Half right: First part is correct, but the second part adds an unsupported claim. Read the ENTIRE answer choice.\n\u2022 Out of scope: Introduces information not present in the passage at all. If you can\u2019t point to specific text, eliminate it.",
        "Power of 50/50: If you can eliminate just 2 wrong answers, your guessing odds go from 25% to 50%. On a 27-question module, turning even 3 \u201cwild guesses\u201d into \u201ceducated 50/50s\u201d can be worth 1\u20132 extra correct answers.",
      ],
      visual: "elimination",
    },
  ],
  quiz: [
    {
      passage:
        "The architect\u2019s design was intentionally austere, relying on clean lines and bare concrete rather than decorative flourishes.",
      stem: "As used in the passage, \u201caustere\u201d most nearly means:",
      choices: [
        "severe and strict",
        "plain and unadorned",
        "cold and unfriendly",
        "old and outdated"
      ],
      correct: 1,
      explanation:
        "\u201cAustere\u201d here describes a design with \u201cclean lines and bare concrete\u201d without decoration \u2192 plain and unadorned. \u201cSevere\u201d is a common meaning but doesn\u2019t fit the architectural context.",
      type: "Vocabulary",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Despite the proliferation of streaming services, many consumers report feeling overwhelmed by the number of choices available to them.",
      stem: "As used in the passage, \u201cproliferation\u201d most nearly means:",
      choices: ["rapid increase", "improvement", "decline", "regulation"],
      correct: 0,
      explanation:
        "Consumers are \u201coverwhelmed by the number of choices\u201d \u2014 there are too many services. \u201cProliferation\u201d = rapid increase/spread.",
      type: "Vocabulary",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "For decades, scientists assumed that the deep ocean floor was a barren wasteland. Then, in 1977, researchers aboard the submersible Alvin discovered hydrothermal vents teeming with life \u2014 giant tube worms, ghostly white crabs, and bacteria that thrived not on sunlight but on chemical energy from the Earth\u2019s interior.",
      stem: "Which choice best states the central idea of the passage?",
      choices: [
        "The submersible Alvin was an important tool for deep-sea exploration.",
        "The deep ocean floor is too dark for most organisms to survive.",
        "The discovery of hydrothermal vent communities overturned assumptions about where life can exist.",
        "Bacteria in the deep ocean use chemical energy rather than sunlight."
      ],
      correct: 2,
      explanation:
        "The passage moves from an old assumption (barren) to a discovery that challenged it (life at vents). C captures this full arc. D is a detail, not the central idea.",
      type: "Central Idea",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A 2022 study tracked 1,200 remote workers over 18 months. Those who maintained a consistent morning routine \u2014 exercising, eating breakfast, and starting work at the same time each day \u2014 reported 34% higher job satisfaction and 22% fewer missed deadlines than those with irregular schedules.",
      stem: "Which inference is best supported by the passage?",
      choices: [
        "Remote workers are more productive than office workers.",
        "Morning exercise is the most important factor in job satisfaction.",
        "Remote work is only effective for workers who are naturally organized.",
        "Consistent daily routines may contribute to better professional outcomes for remote workers."
      ],
      correct: 3,
      explanation:
        "The data shows correlation between routine consistency and positive outcomes. C uses hedging language (\u201cmay contribute\u201d) appropriate for observational data. A compares to office workers (not in the passage). B isolates one factor.",
      type: "Inference",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Microplastics \u2014 fragments smaller than 5 millimeters \u2014 have been found in every ocean on Earth. A 2023 study detected them in Arctic sea ice, suggesting that even the most remote ecosystems are not immune to plastic pollution.",
      stem: "Which finding, if true, would most directly support the passage\u2019s claim about the reach of microplastic pollution?",
      choices: [
        "A company developed a new biodegradable plastic alternative.",
        "Microplastics were detected in freshwater lakes at the summit of the Himalayas.",
        "A beach cleanup in California collected 10,000 pounds of plastic waste.",
        "Ocean currents transport debris from coastal areas to the open sea."
      ],
      correct: 1,
      explanation:
        "The claim is that \u201ceven the most remote ecosystems\u201d are affected. Himalayan summit lakes (B) are among the most remote places on Earth \u2014 finding microplastics there directly supports the claim.",
      type: "Evidence",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The traditional model of scientific publishing \u2014 in which researchers submit papers to journals, wait months for peer review, and publish behind paywalls \u2014 is increasingly being challenged. Preprint servers like arXiv and bioRxiv allow researchers to share findings immediately, and open-access journals make published work freely available. Critics of the old model argue that paywalls restrict the flow of knowledge; defenders counter that peer review ensures quality.",
      stem: "Which choice best summarizes the passage?",
      choices: [
        "Scientific publishing is undergoing a shift as new platforms challenge the traditional paywall and peer-review model.",
        "Preprint servers are more reliable than traditional peer-reviewed journals.",
        "Open-access journals have completely replaced traditional publishing.",
        "Peer review is no longer necessary in modern scientific publishing."
      ],
      correct: 0,
      explanation:
        "The passage describes a SHIFT (traditional model \u201cincreasingly being challenged\u201d by alternatives). B captures this without taking sides. A, C, and D overstate or distort the passage.",
      type: "Central Idea",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "When the spotted lanternfly was first detected in Pennsylvania in 2014, entomologists warned it could devastate vineyards and orchards across the eastern United States. By 2023, the insect had spread to 14 states, and the USDA reported crop losses exceeding $50 million annually in Pennsylvania alone.",
      stem: "Based on the passage, which statement is best supported?",
      choices: [
        "Early warnings about the spotted lanternfly\u2019s potential impact appear to have been justified.",
        "Vineyards have been affected more severely than orchards.",
        "The USDA has failed to respond to the spotted lanternfly threat.",
        "The spotted lanternfly has been successfully contained to Pennsylvania."
      ],
      correct: 0,
      explanation:
        "Entomologists warned of devastation; it spread to 14 states with $50M+ in losses. The early warnings were justified (B). A contradicts the spread. C and D are unsupported.",
      type: "Inference",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Dr. Elena Ruiz argues that bilingual education programs improve not just language skills but overall cognitive flexibility. She points to studies showing that bilingual students outperform monolingual peers on tasks requiring attention switching and problem-solving.",
      stem: "Which choice best describes the function of the underlined portion of the passage?",
      choices: [
        "It defines what cognitive flexibility means.",
        "It provides a counterargument to Dr. Ruiz\u2019s claim.",
        "It compares bilingual education to immersion programs.",
        "It offers evidence supporting Dr. Ruiz\u2019s broader argument about cognitive flexibility."
      ],
      correct: 3,
      explanation:
        "The studies about attention switching and problem-solving are cited AS EVIDENCE for the claim that bilingual education improves cognitive flexibility (B).",
      type: "Evidence",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The politician\u2019s speech was carefully calibrated to appeal to both progressive and moderate voters, balancing calls for reform with reassurances about fiscal responsibility.",
      stem: "As used in the passage, \u201ccalibrated\u201d most nearly means:",
      choices: [
        "randomly assembled from different sources",
        "loudly delivered to a large audience",
        "measured and tested in a laboratory",
        "precisely adjusted to achieve a desired effect"
      ],
      correct: 3,
      explanation:
        "The speech was designed to appeal to different groups by balancing specific elements. \u201cCalibrated\u201d = precisely adjusted for a purpose (B).",
      type: "Vocabulary",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A study compared four learning strategies. The results are shown in the table:\n\n| Method | Avg Score | Retention (2 weeks) |\n|---|---|---|\n| Re-reading notes | 72% | 41% |\n| Practice testing | 85% | 73% |\n| Teaching to a peer | 88% | 78% |\n| Highlighting only | 68% | 35% |",
      stem: "A student claims that active study methods produce better long-term retention than passive methods. Which data from the table most directly supports this claim?",
      choices: [
        "Re-reading notes produced a 72% average score.",
        "Highlighting produced the lowest average score at 68%.",
        "Practice testing and teaching to a peer had 2-week retention rates of 73% and 78%, compared to 41% and 35% for re-reading and highlighting.",
        "Teaching to a peer produced the highest average score at 88%."
      ],
      correct: 2,
      explanation:
        "The claim is about LONG-TERM RETENTION of active vs. passive methods. B directly compares retention rates for active methods (73%, 78%) against passive methods (41%, 35%).",
      type: "Quantitative",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "In the 1960s, the prevailing theory held that the universe would eventually stop expanding and collapse back on itself \u2014 the so-called \u201cBig Crunch.\u201d However, observations in 1998 revealed that the expansion of the universe is actually accelerating, driven by a mysterious force scientists have named \u201cdark energy.\u201d",
      stem: "It can most reasonably be inferred from the passage that:",
      choices: [
        "Dark energy will eventually cause the universe to collapse.",
        "The 1998 observations contradicted the previously dominant model of the universe\u2019s fate.",
        "The Big Crunch theory has been confirmed by recent observations.",
        "Scientists in the 1960s knew about dark energy but chose to ignore it."
      ],
      correct: 1,
      explanation:
        "The passage sets up the old theory (Big Crunch/collapse) and then says observations showed the opposite (accelerating expansion). B correctly identifies the contradiction.",
      type: "Inference",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "While some historians argue that the railroad primarily served economic interests, opening new markets for eastern manufacturers, others contend that the railroad\u2019s most significant impact was cultural \u2014 it united geographically isolated communities and created a shared national identity.",
      stem: "Which choice best describes the structure of the passage?",
      choices: [
        "It presents a claim and then refutes it with evidence.",
        "It argues that economic factors are more important than cultural ones.",
        "It describes a historical event in chronological order.",
        "It presents two competing interpretations of a historical development."
      ],
      correct: 3,
      explanation:
        "The passage says \u201csome historians argue X\u2026 others contend Y\u201d \u2014 two competing interpretations (C). It doesn\u2019t take sides or refute either.",
      type: "Evidence",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The museum\u2019s newest exhibition features over 200 artifacts from ancient Rome ___ many of which have never been displayed publicly before.",
      stem: "Which choice completes the text with the correct punctuation?",
      choices: ["Rome:", "Rome;", "Rome,", "Rome."],
      correct: 2,
      explanation:
        "The phrase \u201cmany of which have never been displayed\u201d is a nonrestrictive relative clause modifying \u201cartifacts.\u201d A comma correctly introduces it. A semicolon would require an independent clause to follow.",
      type: "Boundaries",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The city council approved the new park design ___ however, construction cannot begin until the environmental review is complete.",
      stem: "Which choice completes the text with the correct punctuation?",
      choices: ["design,", "design:", "design", "design;"],
      correct: 3,
      explanation:
        "\u201cHowever\u201d is a transitional adverb, NOT a conjunction. It cannot join two independent clauses with just a comma (that\u2019s a comma splice). Use a semicolon before \u201chowever.\u201d",
      type: "Boundaries",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The collection of handwritten letters from soldiers stationed overseas during World War II ___ donated to the Smithsonian in 2019.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["have been", "was", "are being", "were"],
      correct: 1,
      explanation:
        "Subject = \u201ccollection\u201d (singular). \u201cOf handwritten letters from soldiers stationed overseas during World War II\u201d is all prepositional phrases \u2014 noise. The collection WAS donated.",
      type: "Agreement",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Neither the lead researcher nor her assistants ___ able to replicate the results of the original experiment.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["is", "were", "has been", "was"],
      correct: 1,
      explanation:
        "With \u201cneither\u2026nor,\u201d the verb agrees with the CLOSER subject. \u201cAssistants\u201d (plural) is closer \u2192 \u201cwere.\u201d",
      type: "Agreement",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The archaeologists had been excavating the site for three months before they ___ the entrance to the burial chamber.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["will discover", "discover", "have discovered", "discovered"],
      correct: 3,
      explanation:
        "\u201cHad been excavating\u201d (past perfect progressive) sets the earlier action. The discovery happened at a specific past moment \u2192 simple past \u201cdiscovered.\u201d",
      type: "Tense",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Hoping to attract younger visitors, ___",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "the curatorial staff designed new interactive exhibits for the museum.",
        "the museum\u2019s new interactive exhibits were designed by the curatorial staff.",
        "new interactive exhibits were installed in the museum by the curatorial staff.",
        "interactive design was prioritized by the museum\u2019s curatorial staff."
      ],
      correct: 0,
      explanation:
        "\u201cHoping to attract younger visitors\u201d must be followed by WHO is hoping. The curatorial STAFF (people) are hoping \u2014 not the exhibits, the design, or the museum\u2019s possessive form. B is correct.",
      type: "Modifier",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The internship program offers students the opportunity to gain practical experience, to build professional networks, and ___ their resumes before graduation.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["to strengthen", "strengthen", "strengthening", "they strengthen"],
      correct: 0,
      explanation:
        "Parallel structure: \u201cto gain\u2026to build\u2026and to strengthen.\u201d All three items must be infinitives. C maintains the pattern.",
      type: "Parallel",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The scientists at the research station collect water samples weekly; ___ analyze the samples for bacterial contamination and chemical pollutants.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["they", "he or she", "it", "one"],
      correct: 0,
      explanation:
        "The antecedent is \u201cscientists\u201d (plural). The pronoun must also be plural \u2192 \u201cthey.\u201d \u201cHe or she\u201d and \u201cone\u201d are singular. \u201cIt\u201d refers to things, not people.",
      type: "Pronoun",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The Great Barrier Reef has lost approximately 50% of its coral cover since 1995 due to rising ocean temperatures and acidification. ___, the Australian government has committed $1.2 billion to reef restoration and water quality improvement.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["Furthermore", "For example", "In response", "However"],
      correct: 2,
      explanation:
        "The decline CAUSED a government response. \u201cIn response\u201d correctly signals that the commitment is a reaction to the coral loss. \u201cFurthermore\u201d (addition) misses the causal link.",
      type: "Transition",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Wind energy is one of the fastest-growing renewable energy sources in the United States. ___, solar energy has experienced even more dramatic growth, with installations increasing by 400% over the past decade.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["In contrast", "Therefore", "Nevertheless", "Similarly"],
      correct: 3,
      explanation:
        "Both wind and solar are growing rapidly \u2014 parallel developments. \u201cSimilarly\u201d shows the parallel. \u201cIn contrast\u201d would wrongly suggest opposition.",
      type: "Transition",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The novelist spent years researching the historical period. She traveled to archives in four countries, interviewed dozens of historians, and read over 300 primary source documents. ___, her novel received praise from both literary critics and historians for its accuracy.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["For instance", "On the other hand", "Meanwhile", "As a result"],
      correct: 3,
      explanation:
        "Extensive research LED TO praise for accuracy. Cause/effect \u2192 \u201cAs a result.\u201d \u201cFor instance\u201d would mean the praise is an example of research, which doesn\u2019t make sense.",
      type: "Transition",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Notes on a student\u2019s research about bioluminescence:\n\u2022 Bioluminescence is the production of light by living organisms through chemical reactions.\n\u2022 It is found in a wide range of species, including fireflies, jellyfish, and deep-sea fish.\n\u2022 In the deep ocean, where sunlight cannot penetrate, over 75% of organisms are bioluminescent.\n\u2022 Deep-sea organisms use bioluminescence for attracting prey, communicating with mates, and evading predators.\n\u2022 Researchers are studying bioluminescent proteins for potential medical applications, including tumor detection.",
      stem: "The student wants to emphasize the importance of bioluminescence in deep-sea ecosystems. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Bioluminescence is a chemical process that occurs in a wide range of species across many ecosystems.",
        "Bioluminescence, the production of light through chemical reactions, is found in fireflies, jellyfish, and deep-sea fish.",
        "Researchers are studying bioluminescent proteins for potential medical applications such as tumor detection.",
        "In the deep ocean, where sunlight cannot reach, over 75% of organisms have evolved bioluminescence, using it to attract prey, communicate with mates, and evade predators."
      ],
      correct: 3,
      explanation:
        "The goal is deep-sea IMPORTANCE. C combines the statistic (75% of organisms) with the functions (prey, mates, predators) \u2014 showing both prevalence and importance. A and D are too broad. B focuses on medical applications.",
      type: "Synthesis",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Notes on urban tree canopy research:\n\u2022 A 2023 study by the U.S. Forest Service analyzed satellite imagery of 100 U.S. cities.\n\u2022 Cities with more than 30% tree canopy cover had average summer temperatures 5\u20138\u00b0F lower than cities with less than 15% cover.\n\u2022 Tree canopy also reduces stormwater runoff by 20\u201340%, decreasing the burden on urban drainage systems.\n\u2022 Historically marginalized neighborhoods in the study had an average tree canopy cover of only 12%, compared to 27% in wealthier areas.\n\u2022 The study recommended that cities prioritize tree planting in neighborhoods with the lowest existing canopy.",
      stem: "The student wants to argue that tree-planting programs should prioritize underserved neighborhoods. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "A U.S. Forest Service study found that cities with more tree canopy cover experience lower temperatures and less stormwater runoff.",
        "Because historically marginalized neighborhoods have an average tree canopy cover of only 12% \u2014 less than half the 27% found in wealthier areas \u2014 prioritizing tree planting in these communities would address both environmental and equity concerns.",
        "Tree canopy reduces stormwater runoff by 20\u201340%, which decreases the burden on urban drainage systems.",
        "The study analyzed satellite imagery of 100 U.S. cities to measure differences in tree canopy cover."
      ],
      correct: 1,
      explanation:
        "ARGUE for prioritizing underserved areas: B presents the equity gap (12% vs. 27%), connects it to the recommendation, and frames it as both environmental and equity issue. A is descriptive. C is methodology. D is a single benefit without the equity argument.",
      type: "Synthesis",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Notes on a comparison of two desalination methods:\n\u2022 Reverse osmosis (RO) forces seawater through a membrane to remove salt, producing fresh water.\n\u2022 Thermal desalination heats seawater to create steam, which is then condensed into fresh water.\n\u2022 RO uses approximately 3\u20134 kWh of energy per cubic meter of water produced.\n\u2022 Thermal desalination uses 10\u201315 kWh per cubic meter.\n\u2022 RO membranes must be replaced every 3\u20135 years, adding to long-term maintenance costs.",
      stem: "The student wants to highlight a key difference in energy efficiency between the two methods. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Thermal desalination uses 10\u201315 kWh of energy per cubic meter of water, making it one of the more energy-intensive water purification methods.",
        "Reverse osmosis membranes must be replaced every 3\u20135 years, which increases the method\u2019s long-term maintenance costs.",
        "While both reverse osmosis and thermal desalination can produce fresh water from seawater, reverse osmosis requires only 3\u20134 kWh per cubic meter compared to thermal desalination\u2019s 10\u201315 kWh, making it significantly more energy efficient.",
        "Reverse osmosis forces seawater through a membrane, while thermal desalination heats seawater to produce steam."
      ],
      correct: 2,
      explanation:
        "CONTRAST energy efficiency: B mentions BOTH methods with specific energy data and draws a comparison (\u201csignificantly more energy efficient\u201d). A compares processes, not efficiency. C is about maintenance. D discusses only one method.",
      type: "Synthesis",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The researchers hypothesized that exposure to nature would reduce stress levels in office workers. After conducting a six-month study in which participants spent 30 minutes daily in a rooftop garden, the team found that cortisol levels dropped by an average of 18%. ___, participants reported improved mood, better sleep quality, and fewer headaches.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["For example", "However", "Additionally", "In other words"],
      correct: 2,
      explanation:
        "The first result is reduced cortisol. The new sentence lists MORE positive outcomes (mood, sleep, headaches). These are additional findings, not examples of cortisol reduction. \u201cAdditionally\u201d signals parallel results.",
      type: "Transition",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],
  takeaways: [
    "Use the Two-Pass System: answer easy questions on Pass 1, flag hard ones, then return on Pass 2.",
    "Every question is worth the same points \u2014 don\u2019t spend 3 minutes on one hard question while easy ones sit unanswered.",
    "Pacing checkpoints: Q7 by 8 min, Q14 by 16 min, Q27 by 25 min, then use remaining time for flagged questions.",
    "The 90-second rule: if you\u2019re stuck after 90 seconds, pick your best guess, flag it, and move on.",
    "Speed by type: transitions ~20 sec, grammar ~45 sec, vocabulary/central idea ~60 sec, inference/evidence ~75 sec, synthesis ~90 sec.",
    "Eliminate wrong answers: watch for too-extreme language, right-topic-wrong-claim, half-right, and out-of-scope traps.",
    "If you eliminate 2 wrong answers, your guessing odds jump from 25% to 50%.",
    "Answer ALL questions \u2014 there is no penalty for guessing on the PSAT.",
  ],
};
