"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { RoutingSimulator } from "@/components/course/activities/routing-simulator";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import { ScoreProjector } from "@/components/course/activities/score-projector";
import { MiniDiagnostic } from "@/components/course/mini-diagnostic";
import { CompleteScreen } from "@/components/course/complete-screen";
import { WorksheetScreen } from "./worksheet-screen";
import {
  TestStructureVisual,
  AnatomyVisual,
  AdaptiveVisual,
  DomainsVisual,
  StrategyVisual,
  GrowthVisual,
  ScoreProjectorVisual,
} from "./lesson-visuals";

const EC_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "A student reads a vocabulary-in-context question and immediately picks \"benevolent\" because it sounds positive and the passage seems positive. But the correct answer was \"pragmatic\" — the passage described a practical, results-oriented approach, not a kind one.",
    "options": [
      "Misread the Question",
      "Vocabulary Gap",
      "Trap Answer",
      "Didn't Use Evidence"
    ],
    "correct": 2,
    "explanation": "This is a <b>Trap Answer</b>. The student matched a vague feeling (\"positive\") instead of the specific meaning. \"Benevolent\" (kind) and \"pragmatic\" (practical) are both positive but mean very different things. Fix: predict your own word BEFORE looking at choices."
  },
  {
    "prompt": "A student answers a grammar question about subject-verb agreement. The sentence reads: \"The collection of rare stamps ___ valuable.\" The student chose \"are\" because \"stamps\" is plural. The correct answer was \"is\" because the subject is \"collection\" (singular).",
    "options": [
      "Careless Error",
      "Didn't Use Evidence",
      "Time Pressure",
      "Grammar Rule Gap"
    ],
    "correct": 3,
    "explanation": "This is a <b>Grammar Rule Gap</b>. The student doesn't know the rule: the subject is \"collection\" (singular), not \"stamps.\" Prepositional phrases between subject and verb are traps. Fix: learn to identify the true subject by crossing out intervening phrases."
  },
  {
    "prompt": "A student reads a transition question. The first sentence describes a problem; the second sentence describes a solution. The student chose \"Furthermore\" instead of \"However\" because they rushed and didn't read the second sentence carefully.",
    "options": [
      "Didn't Use Evidence",
      "Time Pressure",
      "Vocabulary Gap",
      "Careless Error"
    ],
    "correct": 0,
    "explanation": "This is <b>Didn't Use Evidence</b>. The student didn't read both sentences carefully enough to notice the problem→solution shift. Fix: always read the sentence before AND after the transition blank to determine the logical relationship."
  },
  {
    "prompt": "A student correctly identifies that a question is asking about the \"main purpose\" of a passage, but confuses it with the \"main idea.\" They pick a choice that states what the passage is about, rather than WHY the author wrote it.",
    "options": [
      "Vocabulary Gap",
      "Didn't Use Evidence",
      "Trap Answer",
      "Misread the Question"
    ],
    "correct": 3,
    "explanation": "This is a <b>Misread the Question</b>. \"Main idea\" (what the text says) and \"main purpose\" (why the author wrote it) require different answers. Fix: underline the key phrase in the question stem. Purpose = why. Idea = what."
  },
  {
    "prompt": "A student encounters a rhetorical synthesis question (the bullet-point format) for the first time and doesn't understand what it's asking. They pick the longest answer choice because it seems most complete.",
    "options": [
      "Grammar Rule Gap",
      "Didn't Use Evidence",
      "Unfamiliar Format",
      "Misread the Question"
    ],
    "correct": 2,
    "explanation": "This is an <b>Unfamiliar Format</b> error. Rhetorical synthesis questions are unique to the digital SAT Suite. The student needs to learn: (1) read the goal in the stem, (2) identify which bullet points are relevant to that goal, (3) pick the choice that uses those points effectively. Fix: dedicated practice with this question type in Module 9."
  },
  {
    "prompt": "A student gets a \"command of evidence — quantitative\" question with a bar graph. They misread the y-axis scale and interpret 15,000 as 1,500. Their chosen answer is based on this incorrect reading.",
    "options": [
      "Careless Error",
      "Vocabulary Gap",
      "Misread the Question",
      "Didn't Use Evidence"
    ],
    "correct": 0,
    "explanation": "This is a <b>Careless Error</b>. The student has the skill to read graphs but made a mechanical mistake with the axis labels. Fix: always read BOTH axes carefully, check the units, and verify the scale before interpreting the data."
  }
];

const DIAG_QUESTIONS = [
  { domain: "Craft & Structure", domainColor: "#f472b6", difficulty: "easy", passage: "The city council's proposal to convert the abandoned rail yard into a public park was met with ________ enthusiasm from local residents, many of whom had spent years advocating for more green space in the neighborhood.", stem: "Which choice completes the text with the most logical and precise word?", choices: ["qualified", "token", "unreserved", "manufactured"], correct: 2, explanation: "\"Unreserved\" means wholehearted/without reservation. The residents had \"spent years advocating\" for this \u2014 they'd be genuinely enthusiastic. \"Token\" means minimal, \"manufactured\" means fake, and \"qualified\" means limited \u2014 all contradict the passage's positive tone." },
  { domain: "Craft & Structure", domainColor: "#f472b6", difficulty: "easy", passage: "Chef Hana Yoshida's new cookbook doesn't just collect recipes \u2014 it traces each dish to a specific memory from her childhood in rural Hokkaido, weaving personal narrative through precise culinary instruction.", stem: "Which choice best states the main purpose of the text?", choices: ["To review the quality of recipes in Yoshida's cookbook", "To explain the cultural significance of Hokkaido cuisine", "To describe how Yoshida's cookbook combines storytelling with cooking", "To argue that memoir-style cookbooks are superior to traditional ones"], correct: 2, explanation: "The passage describes how the cookbook \"weaves personal narrative through precise culinary instruction\" \u2014 it combines stories with recipes. It doesn't review quality, make an argument about cookbook styles, or focus on Hokkaido cuisine broadly." },
  { domain: "Craft & Structure", domainColor: "#f472b6", difficulty: "hard", passage: "Text 1: Economist Ravi Patel argues that remote work has permanently restructured labor markets, enabling companies to hire from a global talent pool and reducing the geographic concentration of economic opportunity.\n\nText 2: Sociologist Clara Mu\u00f1oz contends that the shift to remote work has primarily benefited high-income knowledge workers while leaving service and manufacturing workers further behind, potentially widening economic inequality.", stem: "Based on the texts, how would Mu\u00f1oz most likely respond to Patel's argument?", choices: ["By suggesting that service workers should transition to knowledge work", "By questioning whether remote work is truly permanent", "By arguing that Patel overlooks who actually benefits from remote work", "By agreeing that remote work has restructured labor markets"], correct: 2, explanation: "Mu\u00f1oz focuses on inequality \u2014 remote work benefits some but not others. She would challenge Patel's optimistic view by pointing out that the benefits are unevenly distributed." },
  { domain: "Information & Ideas", domainColor: "#60a5fa", difficulty: "easy", passage: "Marine biologists studying coral reef ecosystems in the Pacific Ocean observed that reefs located near river mouths showed significantly lower biodiversity than those in open ocean locations. The researchers attributed this difference to increased sediment and nutrient runoff from agricultural activity upstream.", stem: "Which choice best states the main idea of the text?", choices: ["Agricultural runoff is the leading cause of coral reef decline worldwide", "Coral reefs near river mouths have reduced biodiversity due to agricultural runoff", "Marine biologists need more funding to study coral reef ecosystems", "Pacific Ocean reefs are more vulnerable to pollution than Atlantic reefs"], correct: 1, explanation: "The passage specifically links lower biodiversity near river mouths to agricultural runoff. Choice B captures this precisely. A overgeneralizes (\"worldwide\"), C compares oceans (not in the passage), and D is about funding (not mentioned)." },
  { domain: "Information & Ideas", domainColor: "#60a5fa", difficulty: "hard", passage: "A psychologist surveyed 500 high school students about study habits and found that students who studied in 25-minute intervals with short breaks scored an average of 12% higher on exams than students who studied in continuous sessions of two hours or more.", stem: "Which finding, if true, would most directly weaken the psychologist's implied conclusion that interval studying improves exam performance?", choices: ["The study was published in a well-regarded journal", "Teachers reported that students seemed more engaged in class", "The interval-study group also had higher GPAs prior to the experiment", "Some students prefer longer study sessions"], correct: 2, explanation: "If the interval group already had higher GPAs, the difference in exam scores might be due to pre-existing ability, not the study method. This is a confounding variable." },
  { domain: "Information & Ideas", domainColor: "#60a5fa", difficulty: "medium", passage: "A researcher asked whether a new fertilizer increased crop yield in tomato plants. Over eight weeks, 30 plants receiving the fertilizer produced an average of 4.2 kg of tomatoes, while 30 control plants produced an average of 3.8 kg.", stem: "Which choice most accurately describes a limitation of the study design?", choices: ["The researcher should have used a different fertilizer", "The study used too many plants to draw meaningful conclusions", "The 0.4 kg difference may not be statistically significant given natural variation", "Tomatoes are not representative of all crops"], correct: 2, explanation: "With only 30 plants per group and a relatively small difference (0.4 kg), natural variation could account for the results. This is a key statistical reasoning skill." },
  { domain: "Std. English Conventions", domainColor: "#34d399", difficulty: "medium", passage: "The documentary series, which profiles groundbreaking women in STEM fields across six ________ audiences with its compelling storytelling and stunning cinematography.", stem: "Which choice completes the text so that it conforms to the conventions of Standard English?", choices: ["episodes have captivated", "episodes, has captivated", "episodes, have captivated", "episodes; has captivated"], correct: 1, explanation: "The subject is \"series\" (singular). The \"which\" clause is non-essential and needs commas on both sides: \"series, which profiles...episodes, has captivated.\" B correctly closes the non-essential clause with a comma and uses the singular verb \"has.\"" },
  { domain: "Std. English Conventions", domainColor: "#34d399", difficulty: "easy", passage: "By the time the rescue team arrived at the remote mountain ________ trapped hikers had already managed to signal a passing helicopter using a reflective emergency blanket.", stem: "Which choice completes the text so that it conforms to the conventions of Standard English?", choices: ["village, the", "village; the", "village the", "village. The"], correct: 0, explanation: "This sentence has an introductory adverbial clause (\"By the time...village\") that must be separated from the main clause by a comma. A semicolon or period would incorrectly split the introductory clause from its main clause." },
  { domain: "Std. English Conventions", domainColor: "#34d399", difficulty: "medium", passage: "Neither the lead architect nor the structural engineers ________ comfortable approving the revised building plans without conducting additional soil testing at the proposed construction site.", stem: "Which choice completes the text so that it conforms to the conventions of Standard English?", choices: ["were", "is", "has been", "was"], correct: 0, explanation: "With \"neither...nor,\" the verb agrees with the CLOSER subject \u2014 \"engineers\" (plural). So \"were\" is correct. This is a frequently tested agreement pattern." },
  { domain: "Expression of Ideas", domainColor: "#fbbf24", difficulty: "medium", passage: "The museum's latest exhibition traces the evolution of Japanese woodblock printing from the 17th century to the present day. ________ the exhibit examines how contemporary artists have adapted traditional ukiyo-e techniques to address modern themes like urbanization and climate change.", stem: "Which choice completes the text with the most logical transition?", choices: ["In contrast,", "Nevertheless,", "In particular,", "Similarly,"], correct: 2, explanation: "\"In particular\" works because the second sentence gives a specific example of what the exhibition covers. It narrows from the general (evolution of woodblock printing) to the specific (contemporary artists adapting techniques)." },
  { domain: "Expression of Ideas", domainColor: "#fbbf24", difficulty: "easy", passage: "Researchers have found that bilingual individuals often outperform monolinguals on tasks requiring cognitive flexibility, such as switching between different rules or perspectives. ________ some studies suggest that these advantages may diminish or disappear when other factors like socioeconomic status and education level are controlled for.", stem: "Which choice completes the text with the most logical transition?", choices: ["Furthermore,", "Therefore,", "However,", "For example,"], correct: 2, explanation: "\"However\" signals the contrast between the initial finding (bilingual advantages) and the complication (advantages may disappear when controlling for other factors)." },
  { domain: "Expression of Ideas", domainColor: "#fbbf24", difficulty: "medium", passage: "While researching a topic, a student has taken the following notes:\n\u2022 The axolotl is a salamander native to Lake Xochimilco in Mexico City.\n\u2022 Unlike most amphibians, axolotls retain their larval features throughout adulthood (neoteny).\n\u2022 Axolotls can regenerate lost limbs, heart tissue, and portions of their brain.\n\u2022 Scientists study axolotl regeneration to understand potential applications in human medicine.", stem: "The student wants to emphasize the scientific significance of the axolotl. Which choice most effectively uses relevant information from the notes to accomplish this goal?", choices: ["Because axolotls can regenerate limbs, heart tissue, and brain matter, scientists study them to explore potential applications in human medicine.", "The axolotl is a salamander found in Lake Xochimilco that stays in its larval form throughout life.", "The axolotl, which is native to Mexico City, is a salamander that scientists find interesting.", "Axolotls are unique amphibians that live in a lake in Mexico City and exhibit neoteny."], correct: 0, explanation: "The goal is \"scientific significance.\" Choice B connects regeneration ability (the remarkable trait) directly to medical research (why it matters to science). A and C describe the animal but don't emphasize significance. D is vague." },
];

export default function PSAT89RWModule1() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "test-structure": <TestStructureVisual />,
        "anatomy": <AnatomyVisual />,
        "adaptive": <AdaptiveVisual />,
        "domains": <DomainsVisual />,
        "strategy": <StrategyVisual />,
        "growth": <GrowthVisual />,
        "score-projector": <ScoreProjectorVisual />,
      }}
      activities={{
        "activity-routing": (goNext: () => void) => (
          <RoutingSimulator
            maxQuestions={27}
            section="rw"
            testType="psat89"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "diagnostic": (goNext: () => void) => (
          <MiniDiagnostic
            questions={DIAG_QUESTIONS}
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-ec-qs": (goNext: () => void) => (
          <MatchingExercise
            items={EC_QS_EXERCISE}
            title="Error Classification"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "error-worksheet": (goNext: () => void) => (
          <ErrorAnalysisWorksheet
            domains={["Craft & Structure", "Information & Ideas", "Standard English Conventions", "Expression of Ideas"]}
            testLabel="PSAT 8/9 Reading & Writing"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "worksheet": (goNext: () => void) => (
          <WorksheetScreen onComplete={goNext} />
        ),
        "score-projector": (goNext: () => void) => (
          <ScoreProjector
            testType="psat89"
            section="rw"
            maxM1={27}
            maxM2={27}
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "complete": () => (
          <CompleteScreen
            title="Module 1 Complete!"
            description="You've learned the PSAT 8/9 R&W structure, explored all four question types, completed your diagnostic assessment, and built your personalized study plan."
            accentColor="#06b6d4"
            courseHref="/courses/psat89-rw"
            courseLabel="← Course Home"
            nextHref="/courses/psat89-rw/2"
            nextLabel="Module 2: Words in Context →"
            takeaways={[
              "The PSAT 8/9 R&W section has 54 questions in 64 minutes, split into two adaptive modules of 27 questions each.",
              "Every question has its own short passage (25–150 words) — no more long reading passages with multiple questions.",
              "Module 1 performance determines your Module 2 difficulty — and your score ceiling. Accuracy in Module 1 matters most.",
              "The four domains are Craft & Structure (~28%), Information & Ideas (~26%), Standard English Conventions (~26%), and Expression of Ideas (~20%).",
              "Words in Context is the single most common question type (~20% of the test). Building vocabulary pays off.",
              "There's no penalty for wrong answers — never leave a question blank.",
              "Your PSAT 8/9 score uses the same scale as the SAT — every point of growth here carries forward to future tests.",
              "Error analysis is the most powerful study tool: identify why you missed a question, not just what you missed.",
            ]}
          />
        ),
      }}
      lessonLastLabel="Start Diagnostic"
      nextModuleHref="/courses/psat89-rw/2"
      nextModuleLabel="Module 2: Words in Context"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "rw",
  moduleNum: 1,
  title: "Welcome & Diagnostic",
  subtitle:
    "Understand the test, see how questions actually work, establish your baseline, and build your study plan.",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "activity-routing", label: "Routing Simulator", icon: "zap" },
    { id: "diagnostic", label: "Mini Diagnostic", icon: "clipboard" },
    { id: "exercise-ec-qs", label: "Error Classification", icon: "zap" },
    { id: "error-worksheet", label: "Error Analysis Worksheet", icon: "zap" },
    { id: "worksheet", label: "Worksheet", icon: "clipboard" },
    { id: "score-projector", label: "Score Projector", icon: "chart" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "test-structure",
      title: "Digital PSAT 8/9 R&W: Structure & Format",
      subtitle: "Know Your Test",
      body: [
        "The PSAT 8/9 is the first test in the SAT Suite \u2014 the same adaptive format and question style as the PSAT 10 and SAT, but calibrated for 8th and 9th graders. Simpler vocabulary, more accessible passages, more straightforward analysis. Everything you need is either already in your literacy toolkit or covered in this course.",
      ],
      visual: "test-structure",
    },
    {
      id: "anatomy",
      title: "Anatomy of a PSAT R&W Question",
      subtitle: "Interactive Walkthrough",
      body: [
        "This is what you\u2019ll see on test day \u2014 a short passage on the left, a question on the right. Click the highlighted portions of the passage to see annotations, then try answering. Use the tabs to explore all four question types.",
      ],
      visual: "anatomy",
    },
    {
      id: "adaptive",
      title: "The Adaptive Module System",
      subtitle: "How It Works",
      body: [
        "The PSAT 8/9 uses multistage adaptive testing. Your Module 1 performance determines which version of Module 2 you get \u2014 and that determines your maximum possible score.",
      ],
      visual: "adaptive",
    },
    {
      id: "domains",
      title: "The Four Content Domains",
      subtitle: "Content Breakdown",
      body: [
        "Questions appear in this exact order within each module. Click each domain card to flip it and see the specific skills tested.",
      ],
      visual: "domains",
    },
    {
      id: "strategy",
      title: "The PSAT 8/9 R&W Strategy Toolkit",
      subtitle: "Preview",
      body: [
        "These six strategies will be your tools throughout the course. Click each card to learn more. We\u2019ll practice all of them in depth in Modules 2\u20139.",
      ],
      visual: "strategy",
    },
    {
      id: "growth",
      title: "Your Growth Trajectory",
      subtitle: "The Big Picture",
      body: [
        "The PSAT 8/9 is your starting line, not your finish line. Every test in the SAT Suite shares the same scale \u2014 so a 500 here means the same thing as a 500 on the SAT.",
      ],
      visual: "growth",
    },
  ],

};
