"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  StatsVisual,
  FunctionGridVisual,
  RelationshipGridVisual,
} from "./lesson-visuals";

const CROSS_QS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "<strong>Text 1 (Rivera):</strong> Automation will create more jobs than it eliminates — the industrial revolution displaced workers but ultimately generated far more employment.<br><br><strong>Text 2 (Park):</strong> AI-driven automation threatens cognitive work — the very jobs that absorbed displaced manual workers before. Without policy intervention, the transition could be devastating.",
    "options": [
      "By questioning Rivera's historical accuracy.",
      "By agreeing entirely with Rivera.",
      "By rejecting that automation affects the labor market.",
      "By accepting historical precedent is relevant but arguing AI differs fundamentally from past disruptions."
    ],
    "correct": 3,
    "explanation": "Park agrees automation transforms markets but argues AI is DIFFERENT. Classic qualification — accepts the premise, adds a limitation."
  },
  {
    "prompt": "<strong>Text 1 (Chen):</strong> Migratory birds navigate primarily using the Earth's magnetic field. Birds with magnetic disruptors became disoriented.<br><br><strong>Text 2 (Okafor):</strong> The same species navigated accurately with disrupted magnetics when they could see the night sky. Stellar navigation may be a backup — or primary — system.",
    "options": [
      "As irrelevant to bird migration.",
      "As fundamentally incorrect.",
      "As an oversimplification that underestimates stellar navigation.",
      "As entirely consistent with her findings."
    ],
    "correct": 2,
    "explanation": "Okafor doesn't reject magnetic navigation — she says it may not be the PRIMARY system. Qualification."
  },
  {
    "prompt": "<strong>Text 1 (Alvarez):</strong> Gatsby's central theme is the corruption of the American Dream by materialism.<br><br><strong>Text 2 (Osei):</strong> Gatsby's corruption reflects a systemic critique of class immobility — Gatsby acquires wealth but never the social legitimacy of old money.",
    "options": [
      "Osei argues materialism is irrelevant.",
      "Osei disagrees with Alvarez.",
      "Osei focuses on a different novel.",
      "Osei extends Alvarez by adding a structural class dimension beyond individual materialism."
    ],
    "correct": 3,
    "explanation": "Osei builds ON Alvarez (accepts corruption theme) and goes further (personal → systemic). Extension."
  }
];

const SD_DATA_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Although the theory has been widely accepted for decades, recent experimental data has raised significant questions about its core assumptions.",
    "options": [
      "Recent data challenges a long-accepted theory.",
      "Introduces a tension/conflict that the passage will likely explore — signals a shift from consensus to doubt.",
      "Neither"
    ],
    "correct": 0,
    "explanation": "What it SAYS: Recent data challenges a long-accepted theory.\nWhat it DOES: Introduces a tension/conflict that the passage will likely explore — signals a shift from consensus to doubt."
  },
  {
    "prompt": "For example, a 2022 study of 3,000 participants found that the predicted correlation between diet and disease risk was weaker than previous models suggested.",
    "options": [
      "Neither",
      "A large study found a weaker diet-disease link than expected.",
      "Provides specific evidence supporting the previous sentence's claim that the theory is being questioned."
    ],
    "correct": 1,
    "explanation": "What it SAYS: A large study found a weaker diet-disease link than expected.\nWhat it DOES: Provides specific evidence supporting the previous sentence's claim that the theory is being questioned."
  },
  {
    "prompt": "Dr. Yamamoto, a leading researcher in the field, has proposed an alternative framework that accounts for genetic variation among populations.",
    "options": [
      "Introduces a potential resolution to the conflict — shifts from critique to a constructive alternative.",
      "Neither",
      "A researcher proposed a new framework incorporating genetic variation."
    ],
    "correct": 2,
    "explanation": "What it SAYS: A researcher proposed a new framework incorporating genetic variation.\nWhat it DOES: Introduces a potential resolution to the conflict — shifts from critique to a constructive alternative."
  },
  {
    "prompt": "The debate over the origins of language in Homo sapiens remains one of the most contested questions in anthropology.",
    "options": [
      "Establishes context and frames the passage's topic as an ongoing scholarly controversy.",
      "Neither",
      "Language origins are heavily debated in anthropology."
    ],
    "correct": 2,
    "explanation": "What it SAYS: Language origins are heavily debated in anthropology.\nWhat it DOES: Establishes context and frames the passage's topic as an ongoing scholarly controversy."
  },
  {
    "prompt": "These findings, however, do not necessarily invalidate the original theory — they may instead suggest that the theory needs to be refined rather than replaced.",
    "options": [
      "The findings might mean the theory needs updating, not rejection.",
      "Qualifies the earlier critique by introducing a more moderate interpretation — a concession that prevents the argument from being overstated.",
      "Neither"
    ],
    "correct": 0,
    "explanation": "What it SAYS: The findings might mean the theory needs updating, not rejection.\nWhat it DOES: Qualifies the earlier critique by introducing a more moderate interpretation — a concession that prevents the argument from being overstated."
  },
  {
    "prompt": "To understand why this matters, consider the practical implications for clinical medicine.",
    "options": [
      "Neither",
      "Functions as a transition — pivots from theoretical discussion to real-world application.",
      "There are practical medical implications to consider."
    ],
    "correct": 2,
    "explanation": "What it SAYS: There are practical medical implications to consider.\nWhat it DOES: Functions as a transition — pivots from theoretical discussion to real-world application."
  }
];

export default function NMSQTRWModule7() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "stats": <StatsVisual />,
        "function-grid": <FunctionGridVisual />,
        "relationship-grid": <RelationshipGridVisual />,
      }}
      activities={{
        "exercise-cross-qs": (goNext: () => void) => (
          <MatchingExercise
            items={CROSS_QS_EXERCISE}
            title="Cross"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-sd-data": (goNext: () => void) => (
          <MatchingExercise
            items={SD_DATA_EXERCISE}
            title="Says vs. Does"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/nmsqt-rw/8"
      nextModuleLabel="Module 8: Connecting the Dots"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "rw",
  moduleNum: 7,
  title: "How It's Built",
  subtitle:
    "Why structure questions are different",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-cross-qs", label: "Cross Qs", icon: "zap" },
    { id: "exercise-sd-data", label: "Says vs. Does", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "star" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "why",
      title: "Reading Like an Architect",
      subtitle: "Why structure questions are different",
      body: ["Most reading questions ask what a passage says. Structure questions ask how and why it's built. Text Structure/Purpose (~4 questions) and Cross-Text Connections (~2 questions) total about 6 of your 54 questions.","The key shift: read for FUNCTION, not content. Every sentence has a job — claim, evidence, counterpoint, or transition. Once you see the architecture, these questions become straightforward.","Three question types: Overall purpose (\"Which choice best describes the structure?\"), Sentence function (\"What does the underlined sentence do?\"), Cross-text (\"How would Author 2 respond to Author 1?\")"],
      visual: "stats",
    },
    {
      id: "functions",
      title: "Six Sentence Functions",
      subtitle: "Every sentence has a job",
      body: ["Every PSAT passage sentence performs one of six roles. Learning to tag them instantly is the core skill for structure questions.","CLAIM — States the author's position or main argument.\nEVIDENCE — Facts, studies, or examples supporting the claim.\nCOUNTERPOINT — An opposing view or objection.\nCONCESSION — Acknowledges the counterpoint has some merit.\nTRANSITION — Shifts between ideas or sections.\nCONTEXT — Background or setup information.","Practice this: before answering any structure question, label every sentence in the passage with its function. The answer becomes obvious."],
      visual: "function-grid",
    },
    {
      id: "cross-text",
      title: "Cross-Text Relationships",
      subtitle: "How two texts relate",
      body: ["Cross-text questions give you two short passages and ask how the authors relate. There are four possible relationships:","AGREEMENT — Both support the same position.\nDISAGREEMENT — Opposite conclusions on the same question.\nQUALIFICATION — Author 2 accepts the basic point but adds a limitation. (\"Yes, but...\")\nEXTENSION — Author 2 builds on Author 1's idea, taking it further.","The PSAT strongly favors QUALIFICATION. Author 2 usually agrees with Author 1 on the facts but disagrees on emphasis, scope, or interpretation. Map the relationship before looking at choices."],
      visual: "relationship-grid",
    },
    {
      id: "says-does",
      title: "Says vs. Does",
      subtitle: "Content vs. function — the key distinction",
      body: ["\"Says\" = what information the sentence communicates.\n\"Does\" = what role it plays in the argument.\n\nStructure questions ask about \"does.\" The most common trap is picking an answer that accurately describes what a sentence SAYS but misidentifies what it DOES.","EXAMPLE: \"However, a 2023 study found that the drug's effectiveness decreases by 40% after six months.\"\n\nSays: A study found the drug becomes less effective over time.\nDoes: Introduces evidence that qualifies the previous claim about the drug's benefits.","Before answering, always ask: \"Why did the author include this sentence?\" not \"What does this sentence mean?\""],
    },
  ],

  /* ──────── WARMUP ──────── */
  warmup: [
    {
      stem: "The festival attracted visitors from twelve _______ local businesses reported a 40% revenue increase during the event. Which choice conforms to Standard English?",
      choices: ["countries, local", "countries: local", "countries; local", "countries local"],
      correct: 2,
      explanation: "Two ICs — semicolon joins them.",
    },
    {
      stem: "The cellist performed with technical precision and emotional depth that _______ even the most discerning critics. Which word best completes the text?",
      choices: ["amused", "alarmed", "impressed", "baffled"],
      correct: 2,
      explanation: "\"Technical precision and emotional depth\" are positive → \"impressed.\"",
    },
    {
      stem: "Rooftop gardens reduced energy use by 25%, but installation costs remain prohibitive, suggesting that _______ Which choice most logically completes the text?",
      choices: ["all buildings should be required to install them.", "rooftop gardens have no environmental benefits.", "adoption will require financial incentives to offset initial costs.", "energy consumption is unrelated to building design."],
      correct: 2,
      explanation: "Benefits + cost barrier = need subsidies.",
    },
    {
      stem: "The report highlighted three achievements: reducing emissions by 30%, _______ and eliminating single-use plastics. Which choice conforms to Standard English?",
      choices: ["the implementation of renewable energy,", "implementing renewable energy,", "to implement renewable energy,", "renewable energy was implemented,"],
      correct: 1,
      explanation: "Parallel gerunds: reducing, implementing, eliminating.",
    },
    {
      stem: "The historian argues that the conventional narrative _______ their actual positions, as private letters reveal deep reservations. Which word best completes the text?",
      choices: ["captures", "validates", "oversimplifies", "strengthens"],
      correct: 2,
      explanation: "\"Deep reservations\" contradicts \"unified champions\" — oversimplifies.",
    },
    {
      stem: "A study found that free-ranging cats kill 1.3–4 billion birds annually in the U.S., making them the largest source of anthropogenic bird mortality. How does this finding relate to the claim that outdoor cats harm bird populations?",
      choices: ["It raises an unrelated comparison.", "It provides a counterexample.", "It qualifies the claim.", "It offers direct quantitative support."],
      correct: 3,
      explanation: "Specific kill numbers = direct quantitative support for \"harm.\"",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      passage: "Biologist Dr. Tanaka has spent two decades studying the social behavior of elephants. Her research has revealed that elephant herds are led by the oldest female, whose accumulated knowledge of food and water sources is critical to the group's survival. <u>When Tanaka removed the matriarch from a study group temporarily, the remaining elephants showed significantly increased stress hormones and made poorer foraging decisions.</u> Tanaka argues that elephant society depends on intergenerational knowledge transfer.",
      stem: "Which choice best describes the function of the underlined sentence?",
      choices: ["It presents a finding that challenges Tanaka's overall argument.", "It provides experimental evidence that supports the claim about the matriarch's importance.", "It describes the methodology of Tanaka's research without drawing conclusions.", "It introduces a new topic unrelated to the main idea."],
      correct: 1,
      explanation: "The underlined sentence shows what happened when the matriarch was removed (more stress, worse decisions) — directly proving the matriarch matters. It's evidence for the claim.",
      difficulty: "easy",
    },
    {
      passage: "The muralist approached each new commission not as an opportunity to display technical virtuosity, but as a chance to _______ the stories and struggles of the community where the mural would stand.",
      stem: "Which word best completes the text?",
      choices: ["obscure", "commemorate", "undermine", "parody"],
      correct: 1,
      explanation: "\"Stories and struggles of the community\" + \"not technical virtuosity but community focus\" → \"commemorate\" = honor/preserve in memory.",
      difficulty: "easy",
    },
    {
      passage: "The novelist's early works were celebrated for their _______ prose style — clean, spare sentences that communicated maximum meaning with minimum words.",
      stem: "Which word best completes the text?",
      choices: ["ornate", "verbose", "economical", "ambiguous"],
      correct: 2,
      explanation: "\"Clean, spare, maximum meaning with minimum words\" = economical.",
      difficulty: "easy",
    },
    {
      passage: "The passage begins by describing the conventional view that coral reefs are fragile ecosystems highly vulnerable to climate change. It then introduces recent research showing that certain reef systems have demonstrated unexpected resilience, adapting to warmer temperatures through symbiotic shifts. The passage concludes by arguing that conservation strategies should account for this adaptive capacity rather than assuming inevitable decline.",
      stem: "Which choice best describes the overall structure of the text?",
      choices: ["It compares two competing scientific theories without taking a position.", "It describes a natural phenomenon in chronological order.", "It presents a problem and argues that no solution exists.", "It introduces a conventional view, presents contrasting evidence, then argues for a revised approach."],
      correct: 3,
      explanation: "The structure is: conventional view (fragile) → contrasting evidence (resilient) → revised conclusion (change conservation approach). B captures this three-part progression.",
      difficulty: "medium",
    },
    {
      passage: "<strong>Text 1:</strong> Historian Lee argues that the Roman Empire fell primarily because of economic decline — debasement of currency, overtaxation, and disrupted trade routes weakened the empire from within.<br><br><strong>Text 2:</strong> Historian Patel agrees that economic factors played a role but contends that the decisive factor was the empire's inability to integrate the Germanic peoples who settled within its borders, leading to internal fragmentation that economic weakness alone would not have caused.",
      stem: "Based on the texts, how would Patel most likely respond to Lee?",
      choices: ["By agreeing that economic decline contributed but maintaining that political-cultural failure to integrate was the more decisive cause.", "By providing additional evidence for economic decline.", "By questioning whether the Roman Empire actually fell.", "By arguing that economic factors were completely irrelevant."],
      correct: 0,
      explanation: "Patel agrees economics \"played a role\" (partial agreement) but argues integration failure was more decisive. Qualification with a different emphasis.",
      difficulty: "medium",
    },
    {
      passage: "The architect's designs were notable for their _______ of natural and industrial materials — glass and steel framing would open onto living walls of native plants, and concrete floors gave way to courtyards of reclaimed wood.",
      stem: "Which word best completes the text?",
      choices: ["elimination", "integration", "imitation", "separation"],
      correct: 1,
      explanation: "Natural + industrial materials combined harmoniously. \"Integration\" = combining into a unified whole.",
      difficulty: "easy",
    },
    {
      passage: "<strong>Text 1:</strong> Psychologist Kim argues that social media use among teenagers is strongly associated with increased anxiety and depression, pointing to correlational studies showing higher rates of mental health issues among heavy users.<br><br><strong>Text 2:</strong> Psychologist Okonjo notes that while the correlational data Kim cites is accurate, longitudinal studies tracking the same individuals over time show much weaker effects. Okonjo suggests the correlation may reflect that anxious teenagers seek out social media rather than social media causing anxiety.",
      stem: "Based on the texts, what is Okonjo's position relative to Kim's?",
      choices: ["Total rejection of the correlation between social media and anxiety.", "Acceptance of Kim's data but disagreement about the direction of causation.", "Indifference to the research question.", "Complete agreement with Kim's conclusions."],
      correct: 1,
      explanation: "Okonjo says the correlation is \"accurate\" (accepts data) but argues causation may run the opposite direction (reverse causation). Classic qualification on methodology.",
      difficulty: "medium",
    },
    {
      passage: "<u>Despite its name, the \"Dark Ages\" in medieval Europe were characterized by significant artistic and intellectual achievements that are often overlooked.</u> Monasteries preserved and copied classical texts. Irish monks produced illuminated manuscripts of extraordinary beauty. The Carolingian Renaissance under Charlemagne saw a revival of learning. These examples suggest that the period's reputation for cultural stagnation is largely undeserved.",
      stem: "Which choice best describes the function of the underlined sentence?",
      choices: ["It presents the passage's central claim that the \"Dark Ages\" label is misleading.", "It transitions from one topic to a new, unrelated topic.", "It introduces a concession to a counterargument.", "It provides evidence for a claim made earlier in the passage."],
      correct: 0,
      explanation: "The underlined sentence states the main argument (achievements overlooked, name misleading). Everything that follows is evidence. This is the claim.",
      difficulty: "medium",
    },
    {
      passage: "<strong>Text 1:</strong> Nutritionist Alvarez argues that intermittent fasting provides metabolic benefits beyond simple calorie reduction, including improved insulin sensitivity and cellular repair through autophagy.<br><br><strong>Text 2:</strong> Nutritionist Brennan responds that while the cellular mechanisms Alvarez describes are real, they have been demonstrated primarily in animal studies, and the few human trials show benefits no greater than those achieved through sustained moderate calorie reduction.",
      stem: "How would Brennan most likely characterize Alvarez's claims?",
      choices: ["As completely fabricated without scientific basis.", "As revolutionary findings that demand immediate dietary changes.", "As based on real mechanisms but overstated when applied to humans.", "As irrelevant to the field of nutrition."],
      correct: 2,
      explanation: "Brennan says the mechanisms are \"real\" (accepts science) but the human evidence doesn't support the extra claims (limits application). Qualification on evidence quality.",
      difficulty: "hard",
    },
    {
      passage: "The study begins with a review of existing research on urban heat islands. <u>It then describes the researchers' novel approach of using satellite thermal imaging combined with ground-level sensors to create high-resolution temperature maps.</u> Finally, it presents findings showing that tree canopy coverage is the single strongest predictor of neighborhood temperature variation.",
      stem: "Which choice best describes the function of the underlined sentence?",
      choices: ["It provides a counterargument to the existing research.", "It summarizes the findings of previous studies.", "It explains the methodology the researchers used to gather their data.", "It introduces the study's main conclusion about tree coverage."],
      correct: 2,
      explanation: "The underlined sentence describes HOW the researchers collected data (methodology), positioned between the lit review and the findings.",
      difficulty: "hard",
    },
    {
      passage: "<strong>Text 1:</strong> Economist Torres argues that universal basic income (UBI) would reduce poverty without disincentivizing work, citing a Finnish pilot program where recipients reported higher well-being and equal employment rates.<br><br><strong>Text 2:</strong> Economist Nakamura notes that the Finnish pilot involved only 2,000 participants over two years and argues that scaling UBI nationally would create fiscal pressures and behavioral changes that a small pilot cannot capture.",
      stem: "Based on the texts, what is Nakamura's main criticism of Torres's evidence?",
      choices: ["The pilot's small scale and duration make it insufficient for predicting national-level outcomes.", "The Finnish pilot never occurred.", "UBI is morally wrong regardless of economic evidence.", "The Finnish participants were not actually receiving basic income."],
      correct: 0,
      explanation: "Nakamura doesn't dispute the pilot's results — she argues the SCALE is too small to generalize. The pilot is valid but insufficient as evidence for national policy.",
      difficulty: "hard",
    },
    {
      passage: "The diplomat's memoir reveals a leader who was both idealistic and _______ — passionately committed to democratic principles yet willing to make calculated compromises when political reality demanded flexibility.",
      stem: "Which word best completes the text?",
      choices: ["naive", "inflexible", "reckless", "pragmatic"],
      correct: 3,
      explanation: "\"Calculated compromises when reality demanded flexibility\" = pragmatic (dealing with things practically rather than ideologically).",
      difficulty: "medium",
    },
  ],

  /* ──────── CHALLENGE ──────── */
  challenge: [
    {
      passage: "In the opening stanza of the poem, the speaker describes a winter landscape in precise, almost clinical detail — bare branches, frozen earth, colorless sky. <u>In the second stanza, without transition, the speaker shifts to addressing a lover in language rich with color, warmth, and movement.</u> The juxtaposition continues throughout the poem, alternating between external desolation and internal passion.",
      stem: "Which choice best describes the function of the underlined sentence in the context of the poem's structure?",
      choices: ["It summarizes the poem's conclusion.", "It describes the poem's tonal shift from detached observation to intimate address, establishing the contrast that structures the entire work.", "It provides evidence that the speaker lives in a cold climate.", "It introduces the poem's central conflict between nature and civilization."],
      correct: 1,
      explanation: "The underlined sentence identifies the STRUCTURAL principle of the poem (alternation between cold exterior/warm interior). It describes the tonal shift that the rest of the passage explains as the poem's organizing device.",
    },
    {
      passage: "<strong>Text 1:</strong> Art historian Ramos argues that Frida Kahlo's self-portraits should be understood primarily as political statements. Kahlo's unflinching depictions of physical suffering, Ramos claims, were deliberate challenges to conventional beauty standards and assertions of female bodily autonomy in a patriarchal society.<br><br><strong>Text 2:</strong> Art historian Chen agrees that Kahlo's work carries political dimensions but argues that reducing her art to political statement overlooks its deeply personal, even therapeutic function. Chen points to Kahlo's private diaries, which describe painting as a way to process and survive chronic pain — suggesting the work's primary purpose was personal rather than political.",
      stem: "Based on the texts, how does Chen's interpretation relate to Ramos's?",
      choices: ["Chen accepts Kahlo's work has political dimensions but argues this reading is incomplete without acknowledging its primarily personal motivation.", "Chen extends Ramos's political reading by adding new examples.", "Chen completely rejects the idea that Kahlo's work has any political significance.", "Chen argues that art cannot be simultaneously personal and political."],
      correct: 0,
      explanation: "Both agree the work has political dimensions (surface agreement on facts). But they disagree on what's PRIMARY — Ramos says political, Chen says personal. Chen qualifies Ramos by accepting the political reading but arguing it's secondary to the personal.",
    },
    {
      passage: "The short story opens with the protagonist methodically cleaning his apartment — wiping surfaces, organizing bookshelves, aligning picture frames. The narrator describes each action in meticulous detail. <u>Only in the final paragraph does the reader learn that the protagonist is preparing for a visit from his estranged daughter, whom he has not seen in three years.</u>",
      stem: "Which choice best describes the effect of revealing the daughter's visit in the final paragraph?",
      choices: ["It recontextualizes the preceding actions, transforming what appeared to be mundane routine into an expression of anxiety and desire for reconnection.", "It contradicts the earlier description of the cleaning.", "It introduces a subplot unrelated to the cleaning.", "It provides exposition about the protagonist's career."],
      correct: 0,
      explanation: "The late reveal REFRAMES everything before it. The cleaning wasn't routine — it was preparation driven by emotional stakes. This is a structural technique (delayed revelation that recontextualizes prior events).",
    },
    {
      passage: "<strong>Text 1:</strong> Philosopher Nakamura argues that artificial intelligence will never achieve genuine consciousness because consciousness requires subjective, first-person experience — what philosopher Thomas Nagel called \"what it is like\" to be something — and no amount of computational complexity can generate subjective experience from objective processes.<br><br><strong>Text 2:</strong> Computer scientist Obi argues that Nakamura's position rests on an unproven assumption: that subjective experience cannot emerge from complex information processing. Obi points out that human consciousness itself emerges from objective neural processes, and that dismissing AI consciousness requires explaining why biological information processing can produce consciousness but silicon-based processing cannot.",
      stem: "Based on the texts, what is the fundamental nature of the disagreement between Nakamura and Obi?",
      choices: ["They disagree about whether humans are conscious.", "They disagree about whether AI technology is advancing rapidly.", "They disagree about whether subjective experience can emerge from objective computational processes — Nakamura assumes it cannot, while Obi argues this assumption is unjustified.", "They disagree about the definition of information processing."],
      correct: 2,
      explanation: "Both engage with the same philosophical question (can computation produce consciousness?). Nakamura ASSUMES the answer is no; Obi challenges that assumption by pointing to the analogy with biological neural processes. The disagreement is about the premise, not the conclusion.",
    },
    {
      passage: "The playwright structures the first act as a series of parallel scenes: in each, a different family member tells the same story from their perspective. <u>The stories agree on basic facts — the date, the location, the people present — but diverge dramatically on motivations, emotions, and meaning.</u> By the second act, the audience understands that the family's central conflict is not about what happened but about what it meant.",
      stem: "Which choice best describes the function of the underlined sentence?",
      choices: ["It identifies the precise nature of the parallel structure — factual agreement but interpretive divergence — which sets up the play's thematic concern.", "It introduces a character not mentioned elsewhere.", "It describes the physical staging of the play.", "It provides a summary of the play's conclusion."],
      correct: 0,
      explanation: "The underlined sentence pinpoints WHAT makes the parallel scenes structurally meaningful: same facts, different interpretations. This is the structural mechanism that produces the play's theme (conflict over meaning, not facts).",
    },
  ],

  takeaways: [
    "Every sentence has a function. Structure questions test whether you can identify it.",
    "'Says' vs. 'Does' -- wrong answers describe content when questions ask about function.",
    "Cross-text relationships: agreement, disagreement, qualification, extension. The PSAT favors qualification.",
    "Ask 'Why did the author include this?' not 'What does this mean?'",
    "Literary passages ask about effect (tension, setting, character) not argument structure.",
  ],
};
