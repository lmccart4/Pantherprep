"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import {
  StatsVisual,
  SynthesisStepsVisual,
  TransitionMapVisual,
  FrameworkVisual,
} from "./lesson-visuals";

/* ═══════════════════════════════════════════════════════
 * MODULE 13 — Transitions
 * Logical connections between ideas
 * ═══════════════════════════════════════════════════════ */

export default function SATRWModule13() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "stats": <StatsVisual />,
        "synthesis-steps": <SynthesisStepsVisual />,
        "transition-map": <TransitionMapVisual />,
        "framework-visual": <FrameworkVisual />,
      }}
      nextModuleHref="/courses/sat-rw/14"
      nextModuleLabel="Module 14: Rhetorical Synthesis"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 13,
  title: "Transitions",
  subtitle:
    "Logical connections between ideas",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "quiz", label: "Quiz", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "flame" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── WARM-UP (Interleaved retrieval from prior modules) ──────── */
  warmup: [
    {
      source: "M11 \u2014 Strengthen",
      stem: "Archaeologist Dr. Patel proposes that ancient trade routes through the Sahara were established much earlier than previously believed, based on the discovery of Mediterranean pottery fragments at sites in southern Algeria dated to 3000 BCE.\n\nWhich finding would most strengthen Dr. Patel\u2019s proposal?",
      choices: [
        "The Sahara was wetter 5,000 years ago than it is today",
        "Other archaeologists have studied Saharan trade routes",
        "Chemical analysis of the pottery fragments matches clay deposits found only in coastal Sicily, confirming the fragments were transported across the Sahara rather than produced locally",
        "The pottery fragments are well-preserved"
      ],
      correct: 2,
      explanation:
        "Patel claims Mediterranean pottery at Saharan sites = early trade. The key assumption: the pottery actually came FROM the Mediterranean. B confirms this with chemical evidence tracing the clay to Sicily.",
    },
    {
      source: "M9 \u2014 Inference",
      stem: "A study of professional orchestras found that when auditions were conducted behind a screen \u2014 preventing the jury from seeing candidates \u2014 the proportion of women advancing to final rounds increased by 50%. The researchers noted that this effect was strongest in orchestras that had previously employed very few women.\n\nWhich inference is best supported by the text?",
      choices: [
        "The study proves that orchestras are intentionally discriminatory",
        "Visual bias related to gender appears to have influenced audition outcomes, and the screen eliminated this bias, particularly benefiting orchestras with the most entrenched gender imbalances",
        "All orchestras should use blind auditions",
        "Women are better musicians than men"
      ],
      correct: 1,
      explanation:
        "Screen (no visual) \u2192 50% more women advanced, especially where few women existed before. B infers visual-based gender bias was at work, carefully avoiding overstating.",
    },
    {
      source: "M10 \u2014 Data",
      stem: "Researchers compared reading comprehension scores across different study methods. Results showed: Highlighting \u2014 72% immediate recall, 28% one-week recall; Summarizing \u2014 68% immediate, 51% one-week; Self-testing \u2014 65% immediate, 62% one-week.\n\nWhich claim is best supported by the data?",
      choices: [
        "All study methods are equally effective",
        "Self-testing is too difficult for most students",
        "Highlighting is the most effective study method",
        "Methods that produce lower immediate recall can produce substantially higher long-term retention, suggesting effortful retrieval strategies outperform passive review"
      ],
      correct: 3,
      explanation:
        "Highlighting: highest immediate (72%) but lowest 1-week (28%). Self-testing: lowest immediate (65%) but highest 1-week (62%). B captures this inverse pattern.",
    },
    {
      source: "M3 \u2014 Conventions",
      stem: "Neither the sudden rainstorm ______ the unexpected road closure prevented the marathon runners from completing the course within the qualifying time.\n\nWhich choice conforms to Standard English conventions?",
      choices: ["and", "but", "or", "nor"],
      correct: 3,
      explanation:
        "\u2018Neither...nor\u2019 is a correlative conjunction pair. \u2018Neither A nor B\u2019 is the standard construction.",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "intro",
      title: "Writing With Purpose",
      subtitle: "Expression, synthesis, and transitions",
      body: [
        "Unit 4 covers the writing side of the SAT R&W section. These questions don't test grammar (that was Unit 1) \u2014 they test whether you can write EFFECTIVELY: choosing the right expression, connecting ideas logically, and synthesizing information from notes.",
        "Three question types in this unit:\n\u2022 Rhetorical Synthesis (~4-5 per test): Given a set of bullet-point notes, which sentence effectively uses them for a stated purpose?\n\u2022 Transitions (~2-3 per test): Which word or phrase most logically connects two sentences?\n\u2022 Effective Expression (~1-2 per test): Which revision most effectively accomplishes a stated goal?",
        "Together these represent roughly 15% of the section \u2014 a significant chunk, and one where the right strategies make a huge difference.",
      ],
      visual: "stats",
    },
    {
      id: "synthesis-intro",
      title: "Rhetorical Synthesis",
      subtitle: "The SAT's most unique question type",
      body: [
        "Rhetorical synthesis questions give you a set of bullet-point notes (usually 4-5 facts) and ask: \"Which choice most effectively uses relevant information from the notes to accomplish [a specific goal]?\"",
        "The goal is critical. It tells you:\n\u2022 What PURPOSE the sentence should serve (introduce, compare, argue, describe)\n\u2022 Which notes are RELEVANT (you usually don't need all of them)\n\u2022 What AUDIENCE or CONTEXT the sentence should address",
        "EXAMPLE GOAL: \"...emphasize the economic benefits of the new policy.\"\nThis tells you to focus on notes about economics and benefits \u2014 ignore notes about political controversy or implementation timeline.",
        "This is the most common question type in Expression & Strategy. Master it and you've locked in 4-5 questions per test.",
      ],
    },
    {
      id: "synthesis-strategy",
      title: "Synthesis Strategy",
      subtitle: "The 3-step approach",
      body: [
        "STEP 1: Read the GOAL first. Before looking at the notes, understand what the sentence needs to accomplish. Underline key words in the goal: emphasize, compare, introduce, argue, describe, contrast.",
        "STEP 2: Identify RELEVANT notes. Based on the goal, which notes contain information that serves the stated purpose? Cross out irrelevant notes mentally.",
        "STEP 3: Evaluate each choice for:\n\u2022 RELEVANCE: Does it use information that serves the goal?\n\u2022 ACCURACY: Does it faithfully represent the notes (no distortion)?\n\u2022 COMPLETENESS: Does it include the most important relevant information?\n\u2022 FLUENCY: Is it well-written and clear?",
        "COMMON TRAP: An answer that uses ALL the notes but doesn't serve the stated goal. Using more notes isn't always better \u2014 using the RIGHT notes is what matters.",
      ],
      visual: "synthesis-steps",
    },
    {
      id: "transitions-intro",
      title: "Transitions",
      subtitle: "The logical glue between sentences",
      body: [
        "Transition questions give you two sentences and ask which word or phrase best connects them. The key is identifying the LOGICAL RELATIONSHIP between the ideas.",
        "ADDITION/CONTINUATION: furthermore, moreover, additionally, also, similarly, likewise, in the same way\nUse when the second sentence adds more of the same type of information.",
        "CONTRAST: however, nevertheless, on the other hand, by contrast, yet, still, despite this, conversely\nUse when the second sentence presents an opposing or unexpected idea.",
        "CAUSE/EFFECT: therefore, consequently, as a result, thus, accordingly, hence, for this reason\nUse when the second sentence is a consequence of the first.",
        "EXAMPLE/SPECIFICATION: for instance, for example, specifically, in particular, namely\nUse when the second sentence illustrates or specifies the first.",
      ],
      visual: "transition-map",
    },
    {
      id: "transitions-strategy",
      title: "Transition Strategy",
      subtitle: "Read BOTH sentences before choosing",
      body: [
        "STRATEGY: Cover the transition word. Read both sentences. Ask: What is the logical relationship? THEN look at the choices.",
        "TRAP 1: Choosing a transition that SOUNDS good but doesn't match the logical relationship. \"Furthermore\" sounds sophisticated, but if the second sentence contradicts the first, you need \"however.\"",
        "TRAP 2: Confusing addition with example. \"Furthermore\" means \"in addition to what I just said, here's MORE.\" \"For instance\" means \"here's a SPECIFIC CASE of what I just said.\" These serve different logical functions.",
        "TRAP 3: Using a causal transition when the relationship is merely sequential. \"The conference ended at 5 PM. Therefore, dinner was served at 6 PM.\" The dinner wasn't CAUSED by the conference ending \u2014 \"Subsequently\" or \"Afterward\" is correct.",
      ],
    },
    {
      id: "expression",
      title: "Effective Expression",
      subtitle: "Which revision best accomplishes the goal?",
      body: [
        "Expression questions give you a sentence and a goal (\"emphasize the researcher's surprise,\" \"establish a formal tone,\" \"highlight the contrast\") and ask which revision best accomplishes it.",
        "These test your ear for writing \u2014 can you hear the difference between:\n\u2022 \"The results were unexpected\" (neutral)\n\u2022 \"The results defied every prediction\" (emphasizes surprise)\n\u2022 \"The results, while noteworthy, fell within expected parameters\" (minimizes surprise)",
        "STRATEGY: Focus on the GOAL word. If the goal says \"emphasize,\" look for strong, specific language. If it says \"qualify,\" look for hedging and nuance. If it says \"formal tone,\" eliminate casual language.",
        "KEY INSIGHT: The best answer matches the goal PRECISELY. Not vaguely, not approximately \u2014 precisely. Every word in the goal matters.",
      ],
    },
    {
      id: "concision",
      title: "Concision & Clarity",
      subtitle: "Say more with less",
      body: [
        "Some expression questions test concision \u2014 can you identify the version that communicates the same information in fewer, clearer words?",
        "WORDY: \"Due to the fact that the weather conditions were unfavorable, the event was postponed to a later date.\"\nCONCISE: \"The event was postponed due to bad weather.\"",
        "REDUNDANCY TRAPS:\n\u2022 \"Past history\" (history is already past)\n\u2022 \"Future plans\" (plans are already future)\n\u2022 \"Completely unanimous\" (unanimous already means complete)\n\u2022 \"Advanced forward\" (advance already means forward)\n\u2022 \"Collaborate together\" (collaborate already means together)",
        "RULE: If two answer choices convey the same meaning, choose the shorter one UNLESS the longer version adds specific, important information that the shorter one lacks.",
      ],
    },
    {
      id: "framework",
      title: "The Expression Framework",
      subtitle: "Your approach for every writing question",
      body: [
        "FOR RHETORICAL SYNTHESIS:\n1. Read the GOAL first.\n2. Identify which notes are relevant to the goal.\n3. Find the answer that uses the right notes for the right purpose.\n4. Reject answers that include irrelevant notes or distort the information.",
        "FOR TRANSITIONS:\n1. Cover the transition. Read both sentences.\n2. Identify the logical relationship: addition, contrast, cause/effect, or example?\n3. Choose the transition that matches the relationship.\n4. Make sure the transition doesn't change the meaning of either sentence.",
        "FOR EXPRESSION:\n1. Read the goal carefully \u2014 what exactly does the sentence need to do?\n2. Evaluate each choice against the goal.\n3. Choose the answer that most PRECISELY accomplishes the stated objective.\n4. When in doubt, prefer concise, specific language over vague, wordy language.",
      ],
      visual: "framework-visual",
    },
  ],

  /* ──────── QUIZ ──────── */
  quiz: [
    {
      passage:
        "Historian Dr. Nakamura argues that the widespread adoption of the printing press in 15th-century Europe was driven primarily by commercial demand from the merchant class, not by intellectual interest from universities.",
      stem: "Which finding would most directly support Dr. Nakamura\u2019s argument?",
      choices: [
        "Analysis of early print shop records reveals that 70% of initial orders came from merchants seeking standardized contracts, price lists, and trade correspondence, while university orders accounted for less than 10% of revenue in the first two decades",
        "The printing press was invented by Johannes Gutenberg around 1440",
        "Some merchants were illiterate and relied on scribes",
        "Universities had large manuscript libraries before the printing press"
      ],
      correct: 0,
      explanation:
        "Nakamura: commercial demand drove adoption, not universities. B provides direct evidence: 70% merchant orders vs. <10% university orders in early decades.",
      type: "evidence",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "Notes:\n\u2022 The Dead Sea is the lowest point on Earth's surface, at 430 meters below sea level.\n\u2022 The Dead Sea's salinity is roughly 34%, nearly ten times saltier than the ocean.\n\u2022 The Dead Sea has been shrinking by approximately one meter per year since the 1960s.\n\u2022 Jordan, Israel, and the Palestinian territories all border the Dead Sea.\n\u2022 The shrinkage is caused primarily by diversion of the Jordan River for agriculture and drinking water.\n\nGoal: alert readers to an environmental crisis affecting the Dead Sea",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "The Dead Sea is shrinking by approximately one meter per year, a crisis driven primarily by the diversion of the Jordan River for agriculture and drinking water that threatens to permanently alter one of Earth's most distinctive natural features.",
        "The Dead Sea has been declining since the 1960s, and several countries border it.",
        "The Dead Sea, bordered by Jordan, Israel, and the Palestinian territories, is the lowest point on Earth's surface at 430 meters below sea level.",
        "The Dead Sea's remarkable salinity \u2014 roughly 34%, nearly ten times that of the ocean \u2014 makes it one of the world's most unusual bodies of water."
      ],
      correct: 0,
      explanation:
        "Goal: ALERT to CRISIS. C uses the alarming rate (1 meter/year), the cause (river diversion), and stakes language (\"crisis,\" \"permanently alter\"). A and B are descriptive, not alarming. D is vague.",
      type: "synthesis",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "The museum's new interactive exhibit has been praised by educators for its ability to engage children with complex scientific concepts through hands-on activities. ______, attendance among families with children under 12 has increased by 60% since the exhibit opened.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["Nevertheless", "In contrast", "Accordingly", "For instance"],
      correct: 2,
      explanation:
        "Praise from educators (cause) \u2192 attendance increase (effect). The attendance rise is a logical consequence of the exhibit's quality. \"Accordingly\" signals that the result follows from what was stated.",
      type: "transition",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "Notes:\n\u2022 The axolotl is a salamander native to Lake Xochimilco in Mexico City.\n\u2022 Axolotls can regenerate entire limbs, portions of their hearts, and spinal cord tissue.\n\u2022 The wild axolotl population has declined by 99.5% since 1998.\n\u2022 Axolotls are widely used in regenerative medicine research.\n\u2022 Urbanization and water pollution in Mexico City are the primary threats to wild axolotls.\n\nGoal: argue that protecting the axolotl serves both conservation and scientific interests",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "The axolotl, a salamander native to Lake Xochimilco in Mexico City, has seen its wild population decline by 99.5% since 1998.",
        "Urbanization and water pollution in Mexico City threaten the wild axolotl, a species native to Lake Xochimilco.",
        "Axolotls are used in regenerative medicine research because they can regenerate limbs, heart tissue, and spinal cord tissue.",
        "With wild populations having declined by 99.5% due to urbanization and pollution, the axolotl's extraordinary regenerative abilities \u2014 which make it invaluable to medical research \u2014 mean that protecting this species serves both conservation and scientific imperatives."
      ],
      correct: 3,
      explanation:
        "Goal: argue BOTH conservation AND science. C links decline (conservation urgency) to regenerative abilities (scientific value), making the case that protection serves both purposes. A is conservation only. B is science only. D is threat description only.",
      type: "synthesis",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "The novelist's earlier works were characterized by dense, multi-layered prose that rewarded close reading but alienated casual readers. ______, her most recent novel employs a stripped-down style \u2014 short sentences, minimal description, direct dialogue \u2014 that has dramatically expanded her readership while drawing criticism from longtime fans who valued the complexity of her earlier voice.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: [
        "Furthermore",
        "As a result of this success",
        "In her latest departure",
        "Similarly"
      ],
      correct: 2,
      explanation:
        "Sentence 1: dense, complex style. Sentence 2: stripped-down, simple style. This is a CHANGE/SHIFT. \"In her latest departure\" signals a deliberate move away from the established pattern. \"Similarly\" contradicts the shift. \"Furthermore\" doesn't capture the change.",
      type: "transition",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "The city council voted 7-2 to approve the controversial rezoning plan.\n\nGoal: The writer wants to emphasize the level of opposition the plan faced before its approval.",
      stem: "Which choice most effectively accomplishes this goal?",
      choices: [
        "The rezoning plan was approved by the city council.",
        "After months of heated public debate, packed town halls, and a petition signed by 3,000 residents opposing the measure, the city council narrowly approved the controversial rezoning plan in a 7-2 vote.",
        "Seven of the nine city council members voted to approve the rezoning plan, with two dissenting.",
        "The city council approved the rezoning plan by a vote of 7-2."
      ],
      correct: 1,
      explanation:
        "Goal: EMPHASIZE OPPOSITION. B provides specific details of opposition (months of debate, packed town halls, 3,000-signature petition) before noting the approval. A, C, D describe the vote itself but don't capture the opposition.",
      type: "expression",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "Marine biologist Dr. Okafor proposes that deep-sea bioluminescence evolved primarily as a predator avoidance mechanism, not for communication or prey attraction as previously assumed.",
      stem: "Which finding would most strengthen Dr. Okafor\u2019s proposal?",
      choices: [
        "Some bioluminescent species use light to attract prey",
        "Species that produce bioluminescence matching the wavelength of downwelling light \u2014 effectively making themselves invisible from below by eliminating their silhouette \u2014 survive predation at three times the rate of non-luminescent species at the same depth",
        "Deep-sea environments are completely dark below 1,000 meters",
        "Many deep-sea organisms are bioluminescent"
      ],
      correct: 1,
      explanation:
        "Okafor: bioluminescence = predator avoidance. B shows the mechanism (counter-illumination eliminates silhouette) AND the outcome (3x survival rate). Direct evidence for the predator-avoidance function.",
      type: "strengthen",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "Notes:\n\u2022 Dr. Chen's 2024 study analyzed 10,000 research papers across 50 scientific disciplines.\n\u2022 Papers with authors from 3+ countries were cited 67% more than single-country papers.\n\u2022 The citation advantage was strongest in climate science, epidemiology, and particle physics.\n\u2022 Dr. Chen attributes the advantage to diverse methodological approaches and access to varied datasets.\n\u2022 Critics note that international collaborations tend to receive more funding, which may independently increase visibility.\n\nGoal: present Dr. Chen's findings while acknowledging a significant limitation",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Critics have questioned Dr. Chen's study, arguing that funding differences explain the citation gap between international and domestic research papers.",
        "Dr. Chen analyzed 10,000 research papers and found that international collaboration increases citations by 67%, proving that diverse teams produce better science.",
        "While Dr. Chen's analysis of 10,000 papers found that internationally authored research receives 67% more citations \u2014 likely due to diverse methodologies and datasets \u2014 critics note that the higher funding typically available to international collaborations could independently account for some of the visibility advantage.",
        "Dr. Chen's 2024 study found that internationally authored papers receive 67% more citations than single-country papers, with the advantage strongest in fields like climate science and epidemiology."
      ],
      correct: 2,
      explanation:
        "Goal: findings + limitation. C presents findings (67% more citations, explains why) AND acknowledges the limitation (funding as confound). A is findings only. B overstates (\"proving\"). D is criticism only.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "The company's decision to relocate its headquarters from San Francisco to Austin was expected to save $40 million annually in operating costs. ______, a survey of employees conducted six months after the move revealed that 30% of senior engineers had resigned rather than relocate, resulting in recruitment and training costs that nearly offset the projected savings.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: [
        "Furthermore",
        "In practice, however",
        "For example",
        "Consequently"
      ],
      correct: 1,
      explanation:
        "Sentence 1: expected to save $40M (prediction). Sentence 2: reality \u2014 resignations nearly wiped out savings. This is a contrast between expectation and reality. \"In practice, however\" signals that the real-world outcome differed from the projection.",
      type: "transition",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "The researcher found a correlation between sleep duration and test performance.\n\nGoal: The writer wants to convey the strength and specificity of the finding.",
      stem: "Which choice most effectively accomplishes this goal?",
      choices: [
        "The researcher's analysis of 2,000 students revealed that each additional hour of sleep was associated with a 7-point increase in test scores, a relationship that held consistently across age groups, subjects, and socioeconomic backgrounds.",
        "Sleep and test performance were found to be related in the researcher's study.",
        "The researcher found some evidence suggesting a possible link between how much sleep students get and how they perform on tests.",
        "The researcher found that sleep affects test performance."
      ],
      correct: 0,
      explanation:
        "Goal: STRENGTH and SPECIFICITY. B provides sample size (2,000), exact relationship (7 points per hour), and scope of consistency (age, subject, SES). A is vague. C hedges excessively. D is the weakest possible statement.",
      type: "expression",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "Notes:\n\u2022 Architect Zaha Hadid (1950-2016) was the first woman to receive the Pritzker Architecture Prize (2004).\n\u2022 Hadid was born in Baghdad, Iraq, and studied mathematics at the American University of Beirut before turning to architecture.\n\u2022 Her designs are characterized by fluid, curving forms that challenge conventional geometric structures.\n\u2022 Notable buildings include the Heydar Aliyev Center in Baku and the London Aquatics Centre for the 2012 Olympics.\n\u2022 Hadid faced persistent gender discrimination throughout her career, with several major commissions canceled after public criticism of a woman designing large-scale structures.\n\nGoal: emphasize how Hadid's achievements were shaped by the obstacles she overcame",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Zaha Hadid designed the London Aquatics Centre for the 2012 Olympics and the Heydar Aliyev Center in Baku, Azerbaijan.",
        "Zaha Hadid, born in Baghdad and educated in mathematics, became known for fluid, curving architectural designs that challenged conventional structures.",
        "Despite facing persistent gender discrimination \u2014 including the cancellation of major commissions specifically because she was a woman designing large-scale structures \u2014 Zaha Hadid became the first woman to receive the Pritzker Architecture Prize, reshaping the field with buildings like the Heydar Aliyev Center and the London Aquatics Centre.",
        "Zaha Hadid, who died in 2016, was the first woman to win architecture's highest honor, the Pritzker Prize, in 2004."
      ],
      correct: 2,
      explanation:
        "Goal: achievements SHAPED BY obstacles. B explicitly connects the discrimination (canceled commissions) to achievements (Pritzker Prize, major buildings) with \"despite\" \u2014 showing she succeeded THROUGH the obstacles. A, C, D mention achievements but not the obstacle-achievement connection.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "The initial clinical trials of the gene therapy showed remarkable results, with 85% of patients experiencing complete remission of symptoms within six months. ______, the treatment's long-term effects remain unknown, and researchers caution that the three-year follow-up period is insufficient to rule out delayed complications or symptom recurrence.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["As a result", "That said", "Moreover", "For example"],
      correct: 1,
      explanation:
        "Sentence 1: remarkable results (very positive). Sentence 2: but long-term effects unknown (tempering the optimism). \"That said\" introduces a qualification or caveat \u2014 acknowledging the positive while pivoting to a limitation. It's more precise than \"however\" because it specifically means \"despite what I just said.\"",
      type: "transition",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
  ],

  /* ──────── CHALLENGE ──────── */
  challenge: [
    {
      passage:
        "Notes on the discovery of high-temperature superconductors:\n\u2022 In 1986, Bednorz and M\u00fcller discovered ceramic compounds that superconduct at 35K (-238\u00b0C)\n\u2022 Previous superconductors required cooling below 23K (-250\u00b0C) with expensive liquid helium\n\u2022 The new ceramics could be cooled with relatively cheap liquid nitrogen (boiling point 77K)\n\u2022 This discovery earned Bednorz and M\u00fcller the 1987 Nobel Prize in Physics \u2014 just one year after publication",
      stem: "A physics textbook author wants to emphasize why the 1986 discovery was revolutionary for practical applications. Which choice most effectively achieves this goal?",
      choices: [
        "Bednorz and M\u00fcller discovered ceramic superconductors in 1986 and won the Nobel Prize the following year.",
        "High-temperature superconductors are ceramic compounds that conduct electricity with zero resistance.",
        "The Nobel Prize in Physics is awarded annually to scientists who make important discoveries.",
        "By raising the superconducting threshold above 23K to 35K, Bednorz and M\u00fcller enabled the use of liquid nitrogen \u2014 a coolant roughly fifty times cheaper than the liquid helium previously required \u2014 making superconductor research accessible to laboratories worldwide."
      ],
      correct: 3,
      explanation:
        "The goal asks about practical revolution. B connects the temperature increase directly to its practical impact: switching from expensive helium to cheap nitrogen, making research widely accessible. A mentions the Nobel but not why it was practical. C defines but doesn't explain significance. D is irrelevant.",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "The Renaissance painter Caravaggio revolutionized European art with his dramatic use of chiaroscuro \u2014 extreme contrasts between light and dark that gave his figures an almost three-dimensional presence. _________, his violent temperament and frequent brawls (including a murder conviction) forced him into exile, cutting short what might have been an even more prolific career.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["However", "Furthermore", "In other words", "For example"],
      correct: 0,
      explanation:
        "Sentence 1: artistic brilliance. Sentence 2: personal flaws cut career short. This is a contrast between professional genius and personal destruction. \u2018However\u2019 signals this pivot from positive to negative.",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "A marine biologist studying octopus cognition observed that individual octopuses in her lab developed distinct strategies for opening puzzle boxes \u2014 some used brute force, others methodically tested each latch, and one consistently watched other octopuses solve the puzzle before attempting it.\n\nGoal: emphasize the diversity of problem-solving approaches among individual octopuses",
      stem: "Which choice most effectively achieves the stated goal?",
      choices: [
        "Rather than converging on a single solution, each octopus in the study developed its own cognitive style \u2014 from brute-force manipulation to systematic testing to social observation \u2014 suggesting individual variation in invertebrate problem-solving that parallels differences seen in primates.",
        "The researcher found that octopuses are intelligent animals capable of solving problems.",
        "Some octopuses were faster at opening boxes than others.",
        "Octopuses in the lab were able to open puzzle boxes."
      ],
      correct: 0,
      explanation:
        "The goal is about diversity of approaches. C explicitly names three distinct strategies and frames them as individual variation, directly emphasizing the diversity. A is too vague. B is generic. D mentions speed, not approach diversity.",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "Notes on urban heat islands:\n\u2022 Cities are 1-3\u00b0C warmer than surrounding rural areas due to heat-absorbing concrete and asphalt\n\u2022 Dark rooftops can reach 70\u00b0C (158\u00b0F) on summer afternoons\n\u2022 Green roofs (vegetated roof systems) reduce building surface temperatures by 30-40\u00b0C\n\u2022 A 2019 study in Chicago found that neighborhoods with green roof coverage above 30% showed measurable reductions in emergency room visits for heat-related illness",
      stem: "A public health official wants to argue that green roofs are a cost-effective health intervention, not merely an environmental amenity. Which choice most effectively achieves this goal?",
      choices: [
        "Cities are significantly warmer than rural areas, a phenomenon known as the urban heat island effect.",
        "Dark rooftops can reach extremely high temperatures during summer, which is a problem for urban areas.",
        "Green roofs are vegetated systems installed on building rooftops that can reduce surface temperatures.",
        "While green roofs are often framed as an environmental feature, Chicago\u2019s data demonstrates their direct public health impact: neighborhoods exceeding 30% green roof coverage experienced measurably fewer heat-related emergency room visits, suggesting that rooftop vegetation functions as preventive healthcare infrastructure."
      ],
      correct: 3,
      explanation:
        "The goal is about reframing green roofs as health interventions. C does exactly this: it acknowledges the environmental framing, then pivots to Chicago\u2019s health data, and explicitly relabels them as \u2018preventive healthcare infrastructure.\u2019 A/B/D describe facts but don't make the health argument.",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "Early astronomers assumed that the universe was static and eternal \u2014 a view so deeply held that even Einstein modified his equations with a \u2018cosmological constant\u2019 to prevent his theory from predicting an expanding universe. _________, when Edwin Hubble demonstrated in 1929 that galaxies are moving apart, Einstein reportedly called his cosmological constant \u2018the biggest blunder\u2019 of his career.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["Similarly", "Nevertheless", "Consequently", "For instance"],
      correct: 2,
      explanation:
        "Sentence 1: Einstein went to great lengths to maintain a static universe model. Sentence 2: Hubble proved the universe IS expanding, so Einstein\u2019s effort was wasted. \u2018Consequently\u2019 shows the causal chain: Hubble\u2019s proof resulted in Einstein admitting his error.",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "A longitudinal study tracked 1,200 students who participated in structured debate programs from middle school through college. Compared to matched controls, debate participants scored significantly higher on standardized tests of critical thinking, showed greater comfort with ambiguity in complex problems, and were three times more likely to change their position on an issue when presented with compelling counter-evidence.\n\nGoal: highlight how debate training develops intellectual flexibility rather than merely persuasive skill",
      stem: "Which choice most effectively achieves the stated goal?",
      choices: [
        "The longitudinal study followed students from middle school through college and found several positive outcomes.",
        "The study\u2019s most striking finding was not that debaters argued more effectively, but that they were three times more likely to revise their own positions in response to strong evidence \u2014 suggesting that structured argumentation cultivates the willingness to be persuaded, not just the ability to persuade.",
        "Students who participated in debate scored higher on critical thinking tests than students who did not.",
        "Debate programs help students become better at arguing their positions and winning arguments."
      ],
      correct: 1,
      explanation:
        "The goal is about intellectual flexibility vs. persuasive skill. C directly contrasts these: \u2018not that debaters argued more effectively, but that they revised their own positions.\u2019 It highlights the flexibility finding and reframes debate as teaching open-mindedness. A is partial. B says the opposite. D is generic.",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
  ],

  takeaways: [
    "For synthesis questions, always read the GOAL first — it tells you which notes matter and which to ignore.",
    "For transitions, cover the transition word, read both sentences, and identify the relationship (addition, contrast, cause/effect, example) before looking at choices.",
    "For expression questions, match the answer to the EXACT stated objective — the goal word tells you everything (emphasize, qualify, compare, etc.).",
    "The most concise version that preserves all essential information is almost always the correct choice.",
    "Transition categories to know: addition (moreover, furthermore), contrast (however, nevertheless), cause/effect (consequently, as a result), example (for instance, specifically).",
  ],
};
