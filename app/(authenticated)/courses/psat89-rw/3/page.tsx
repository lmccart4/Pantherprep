"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";
import {
  SixStructuresVisual,
  PurposeVsTopicVisual,
  FiveRelationshipsVisual,
} from "./lesson-visuals";

const STRUCT_EXERCISE: MatchingItem[] = [
  {
    prompt: "The population of monarch butterflies has declined by 80% since the 1990s. Scientists attribute this decline primarily to habitat loss, as the milkweed plants monarchs depend on have been eliminated by agricultural herbicides across the Midwest.",
    options: ["Cause/Effect", "Compare/Contrast", "Problem/Solution", "Chronological"],
    correct: 0,
    explanation: "The passage explains WHY monarchs declined (cause: herbicides eliminated milkweed) and the RESULT (effect: 80% population drop)."
  },
  {
    prompt: "While traditional museums display objects behind glass and expect quiet observation, interactive science centers encourage visitors to touch exhibits, conduct experiments, and make noise. Both approaches aim to educate, but they differ fundamentally in how they engage their audiences.",
    options: ["Cause/Effect", "Compare/Contrast", "Problem/Solution", "Claim/Evidence"],
    correct: 1,
    explanation: `\u201CWhile...both...but they differ\u201D \u2014 classic comparison structure contrasting two approaches to museum education.`
  },
  {
    prompt: `Urban flooding has become increasingly severe as cities expand impervious surfaces like roads and parking lots. To address this, several cities have adopted \u201Cgreen infrastructure\u201D \u2014 rain gardens, permeable pavement, and rooftop gardens that absorb stormwater naturally.`,
    options: ["Cause/Effect", "Compare/Contrast", "Problem/Solution", "Description"],
    correct: 2,
    explanation: `Sentence 1 = problem (flooding from impervious surfaces). Sentence 2 = solution (\u201CTo address this\u201D + green infrastructure examples).`
  },
  {
    prompt: "In 1928, Alexander Fleming noticed that a mold had contaminated one of his bacterial cultures. He observed that bacteria near the mold had died. Over the next decade, researchers Howard Florey and Ernst Chain developed Fleming's observation into penicillin, which was first used to treat patients in 1941.",
    options: ["Cause/Effect", "Compare/Contrast", "Problem/Solution", "Chronological"],
    correct: 3,
    explanation: `Dates and sequence markers (1928, \u201COver the next decade,\u201D 1941) signal chronological order tracing the discovery of penicillin.`
  },
  {
    prompt: `Linguist Noam Chomsky argues that humans are born with an innate capacity for language, a \u201Cuniversal grammar\u201D hardwired into the brain. Evidence for this claim includes the observation that children worldwide acquire language at similar developmental stages, regardless of the complexity of their native language.`,
    options: ["Cause/Effect", "Compare/Contrast", "Claim/Evidence", "Chronological"],
    correct: 2,
    explanation: `\u201CArgues that\u201D = claim. \u201CEvidence for this claim includes\u201D = evidence. Classic claim/evidence structure.`
  },
  {
    prompt: "The axolotl is a remarkable amphibian native to Lake Xochimilco in Mexico City. Unlike most salamanders, it retains its larval features throughout adulthood, including external gills and a wide, flat tail. This phenomenon, known as neoteny, makes the axolotl one of the most studied organisms in regenerative biology.",
    options: ["Cause/Effect", "Problem/Solution", "Claim/Evidence", "Description"],
    correct: 3,
    explanation: "The passage describes characteristics of the axolotl (features, habitat, classification). It describes WHAT it is, not arguing a claim or solving a problem."
  }
];

const PVST_EXERCISE: ClassificationItem[] = [
  { prompt: "To explain how coral bleaching occurs", correct: "Purpose", explanation: "This describes what the author is DOING (explaining a process). Purpose verbs: explain, argue, describe, challenge." },
  { prompt: "Coral reef ecosystems in the Pacific Ocean", correct: "Topic", explanation: "This is WHAT the passage is about (a subject), not WHY the author wrote it. No purpose verb." },
  { prompt: "To argue that current conservation policies are insufficient", correct: "Purpose", explanation: `\u201CTo argue\u201D is a purpose verb. The author is trying to convince the reader of a position.` },
  { prompt: "The history of the space program in the 1960s", correct: "Topic", explanation: "This names a subject area. It doesn't say what the author is DOING with that subject." },
  { prompt: "To challenge the assumption that bilingualism always provides cognitive advantages", correct: "Purpose", explanation: `\u201CTo challenge\u201D is a purpose verb. The author is pushing back against a common belief.` },
  { prompt: "Recent developments in renewable energy technology", correct: "Topic", explanation: `This describes subject matter. A purpose statement would say what the author DOES with this topic (e.g., \u201Cto evaluate recent developments...\u201D).` },
  { prompt: "To qualify earlier findings by noting important limitations", correct: "Purpose", explanation: `\u201CTo qualify\u201D is a purpose verb. The author is adding nuance to existing claims.` },
  { prompt: "To illustrate how a general ecological principle applies to urban environments", correct: "Purpose", explanation: `\u201CTo illustrate\u201D is a purpose verb. The author provides a concrete example of an abstract concept.` }
];

const SFUNC_EXERCISE: MatchingItem[] = [
  {
    prompt: `Many educators have embraced project-based learning as a way to increase student engagement. <strong style="color:#f472b6">However, a 2022 study of 15,000 students found no significant difference in test scores between project-based and traditional classrooms.</strong> The researchers suggested that the benefits of project-based learning may lie in skills not measured by standardized tests.`,
    options: ["Introduces a complication/counterpoint", "Provides supporting evidence", "States the main claim", "Offers a solution"],
    correct: 0,
    explanation: `The highlighted sentence begins with \u201CHowever\u201D and presents data that COMPLICATES the initial claim. It functions as a counterpoint.`
  },
  {
    prompt: `<strong style="color:#f472b6">The city of Barcelona has transformed its urban planning approach by creating \u201Csuperblocks\u201D \u2014 clusters of streets closed to through-traffic and redesigned as pedestrian-friendly public spaces.</strong> Since the program began in 2016, air pollution in superblock areas has dropped by 25%, and pedestrian activity has increased by 10%.`,
    options: ["Introduces the main topic/claim", "Provides an example", "Summarizes the conclusion", "Transitions to a new idea"],
    correct: 0,
    explanation: "The first sentence introduces the subject (superblocks) and the main claim (Barcelona transformed its approach). The rest provides supporting data."
  },
  {
    prompt: `Dr. Elena Vasquez has spent two decades studying the migration patterns of gray whales along the Pacific coast. Her team tracks individual whales using photo identification of natural markings. <strong style="color:#f472b6">In one remarkable case, her team identified a whale that had traveled over 14,000 miles in a single season \u2014 the longest recorded migration of any mammal.</strong>`,
    options: ["States the main argument", "Provides a specific example to illustrate", "Introduces a counterargument", "Defines a key term"],
    correct: 1,
    explanation: `The highlighted sentence gives a SPECIFIC, concrete example (one whale, 14,000 miles) that illustrates the broader research. This is the \u201Cillustrate\u201D function.`
  },
  {
    prompt: `Traditional theories of language acquisition emphasize the role of imitation \u2014 children learn by copying what they hear. <strong style="color:#f472b6">Chomsky challenged this view, arguing that children produce sentences they have never heard before, suggesting an innate language capacity.</strong> This debate between \u201Cnurture\u201D and \u201Cnature\u201D continues to shape linguistic research today.`,
    options: ["Summarizes the passage", "Presents an opposing viewpoint", "Provides supporting evidence", "Defines technical terminology"],
    correct: 1,
    explanation: `\u201CChallenged this view\u201D explicitly signals that Chomsky's position OPPOSES the traditional theory. The highlighted sentence introduces a contrasting perspective.`
  }
];

const CROSS_EXERCISE: MatchingItem[] = [
  {
    prompt: `Text 1:\nEconomist Lisa Park argues that raising the minimum wage to $15/hour would significantly reduce poverty rates, as millions of workers would see their annual income rise above the federal poverty line.\n\nText 2:\nEconomist James Reed cautions that a sharp minimum wage increase could lead to job losses, as small businesses may not be able to absorb the higher labor costs and could reduce their workforce.\n\nWhat is the relationship between the two texts?`,
    options: ["Agree", "Disagree", "Extend", "Qualify", "Apply"],
    correct: 1,
    explanation: "Park says raising the wage helps (reduces poverty). Reed says it hurts (causes job losses). They take opposing positions on the same policy."
  },
  {
    prompt: `Text 1:\nMarine biologist Dr. Tanaka has documented that coral reefs exposed to rising ocean temperatures lose their symbiotic algae, resulting in bleaching events that can kill entire reef systems within months.\n\nText 2:\nBuilding on Tanaka\u2019s findings, researcher Dr. Osei has identified three coral species that appear resistant to temperature-induced bleaching, suggesting that targeted conservation of these resilient species could help preserve reef biodiversity.\n\nWhat is the relationship between the two texts?`,
    options: ["Agree", "Disagree", "Extend", "Qualify", "Apply"],
    correct: 2,
    explanation: `\u201CBuilding on Tanaka\u2019s findings\u201D = Text 2 accepts Text 1 and adds NEW information (resistant species). This extends the research.`
  },
  {
    prompt: `Text 1:\nPsychologist Dr. Rivera claims that social media use among teenagers leads to increased rates of anxiety and depression, citing a longitudinal study of 5,000 adolescents over three years.\n\nText 2:\nDr. Chen acknowledges the correlation Rivera identified but notes that teenagers who already experienced anxiety were significantly more likely to use social media heavily, making it unclear whether social media causes anxiety or anxious teens simply use it more.\n\nWhat is the relationship between the two texts?`,
    options: ["Agree", "Disagree", "Extend", "Qualify", "Apply"],
    correct: 3,
    explanation: `\u201CAcknowledges...but notes\u201D = Text 2 accepts the data but adds a limitation (correlation vs. causation). This qualifies the original claim.`
  },
  {
    prompt: `Text 1:\nHistorian Maria Santos has argued that the development of the printing press was the most transformative technological innovation of the second millennium, as it democratized access to information and enabled the rapid spread of new ideas.\n\nText 2:\nDigital media scholar Amir Hassan contends that the internet has replicated and amplified every effect Santos attributes to the printing press, but on a global scale and at a speed that Gutenberg could never have imagined.\n\nWhat is the relationship between the two texts?`,
    options: ["Agree", "Disagree", "Extend", "Qualify", "Apply"],
    correct: 4,
    explanation: `Text 2 takes Text 1\u2019s framework (transformative technology that democratizes information) and APPLIES it to a different case (the internet). The structure of the argument is the same, applied to a new subject.`
  },
  {
    prompt: `Text 1:\nResearch on urban green spaces consistently shows that access to parks and gardens improves mental health outcomes, with residents living near green spaces reporting lower levels of stress and anxiety.\n\nText 2:\nA comprehensive review of 47 studies confirms that proximity to nature is associated with measurable reductions in cortisol levels, blood pressure, and self-reported anxiety, with effects observed across age groups, income levels, and geographic regions.\n\nWhat is the relationship between the two texts?`,
    options: ["Agree", "Disagree", "Extend", "Qualify", "Apply"],
    correct: 0,
    explanation: "Both texts support the same conclusion: green spaces/nature improve mental health. Text 2 provides additional supporting evidence from a broader review."
  }
];

const TRAPS_EXERCISE: MatchingItem[] = [
  {
    prompt: "A recent study found that students who eat breakfast perform better on standardized tests than students who skip it. The researchers controlled for socioeconomic status, sleep quality, and prior academic achievement.\n\nWhich choice best describes the main purpose of the text?",
    options: ["To present evidence linking breakfast to test performance", "To describe the eating habits of students"],
    correct: 0,
    explanation: "Trap: Topic disguised as purpose. The wrong answer describes the TOPIC (eating habits) but not the PURPOSE. The passage isn't just describing habits \u2014 it's presenting evidence for a specific claim (breakfast \u2192 performance)."
  },
  {
    prompt: "Traditional farming relies heavily on chemical pesticides that kill both harmful insects and beneficial pollinators. Organic farming, by contrast, uses natural pest management techniques that target specific pests while preserving pollinator populations.\n\nWhich choice best describes the structure of the text?",
    options: ["It contrasts two farming approaches and their effects on pollinators", "It explains the causes of pollinator decline"],
    correct: 0,
    explanation: "Trap: Partial match (only half the passage). The wrong answer only describes the FIRST sentence (traditional farming's effects). The passage is structured as a COMPARISON between two approaches. Always account for the WHOLE passage."
  },
  {
    prompt: "<strong>Text 1:</strong> Professor Lin argues that artificial intelligence will create more jobs than it eliminates by spawning entirely new industries. <strong>Text 2:</strong> Dr. Torres agrees that AI will create new industries but emphasizes that displaced workers may lack the skills to fill these new roles without significant retraining.\n\nHow would Torres most likely respond to Lin?",
    options: ["By accepting Lin's premise while identifying a complication", "By disagreeing with Lin's central claim"],
    correct: 0,
    explanation: `Trap: Oversimplifying the relationship. Torres doesn't DISAGREE \u2014 she \u201Cagrees that AI will create new industries.\u201D She QUALIFIES Lin's claim by adding a complication (skills gap). \u201CDisagree\u201D oversimplifies what's actually a qualify relationship.`
  },
  {
    prompt: "The documentary explores the lives of three families in different countries who have adopted completely plant-based diets. Through intimate interviews, the filmmaker reveals both the health benefits and social challenges these families face.\n\nWhich choice best describes the main purpose of the text?",
    options: ["To examine the experiences of families who have adopted plant-based diets", "To argue that plant-based diets are healthier than traditional diets"],
    correct: 0,
    explanation: "Trap: Assuming a position the author doesn't take. The passage presents BOTH benefits and challenges neutrally \u2014 it doesn't argue for plant-based diets. The wrong answer assumes the author is advocating a position when the purpose is actually to examine/explore."
  }
];

export default function PSAT89RWModule3() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "six-structures": <SixStructuresVisual />,
        "purpose-vs-topic": <PurposeVsTopicVisual />,
        "five-relationships": <FiveRelationshipsVisual />,
      }}
      activities={{
        "exercise-struct": (goNext: () => void) => (
          <MatchingExercise items={STRUCT_EXERCISE} title="Struct" accentColor={MODULE_CONFIG.accentColor} onComplete={goNext} />
        ),
        "exercise-pvst": (goNext: () => void) => (
          <ClassificationExercise items={PVST_EXERCISE} categories={["Purpose","Topic"]} title="Pvst" accentColor={MODULE_CONFIG.accentColor} onComplete={goNext} />
        ),
        "exercise-sfunc": (goNext: () => void) => (
          <MatchingExercise items={SFUNC_EXERCISE} title="Sfunc" accentColor={MODULE_CONFIG.accentColor} onComplete={goNext} />
        ),
        "exercise-cross": (goNext: () => void) => (
          <MatchingExercise items={CROSS_EXERCISE} title="Cross" accentColor={MODULE_CONFIG.accentColor} onComplete={goNext} />
        ),
        "exercise-traps": (goNext: () => void) => (
          <MatchingExercise items={TRAPS_EXERCISE} title="Traps" accentColor={MODULE_CONFIG.accentColor} onComplete={goNext} />
        )
      }}
      nextModuleHref="/courses/psat89-rw/4"
      nextModuleLabel="Module 4: Central Ideas, Details & Inferences"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "rw",
  moduleNum: 3,
  title: "Text Structure & Cross-Text",
  subtitle: "Topic 3A \\u2014 Recognizing Text Structures",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-struct", label: "Struct", icon: "zap" },
    { id: "exercise-pvst", label: "Pvst", icon: "zap" },
    { id: "exercise-sfunc", label: "Sfunc", icon: "zap" },
    { id: "exercise-cross", label: "Cross", icon: "zap" },
    { id: "exercise-traps", label: "Traps", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],
  lessons: [
    {
      id: "3a",
      title: "Text Structure",
      subtitle: "Topic 3A \u2014 Recognizing Text Structures",
      body: [
        "Text Structure questions ask how a passage is organized. The answer isn't about what the passage says \u2014 it's about the organizational pattern the author chose.",
        "The Six Structures:\n\u2022 Cause/Effect: Explains WHY something happens or its results. Signal: because, therefore, as a result, consequently, led to\n\u2022 Compare/Contrast: Shows similarities and/or differences. Signal: similarly, in contrast, whereas, unlike, on the other hand\n\u2022 Problem/Solution: Identifies a problem and proposes or evaluates solutions. Signal: the challenge, to address this, one approach\n\u2022 Chronological/Sequence: Events or steps in time order. Signal: first, then, subsequently, after, finally, in 1923\n\u2022 Claim/Evidence: States a position and supports it with facts, data, or examples. Signal: argues, evidence suggests, studies show\n\u2022 Description/Classification: Describes characteristics or groups items into categories. Signal: is characterized by, includes, types of",
        `Strategy: When you see a text structure question, ask yourself: \u201CWhat is the relationship between the sentences?\u201D Don't summarize \u2014 identify the pattern.`,
        `Common Question Stems:\n\u2022 \u201CWhich choice best describes the overall structure of the text?\u201D\n\u2022 \u201CWhich choice best describes the function of the underlined sentence?\u201D\n\u2022 \u201CThe text is primarily organized by...\u201D`
      ],
      visual: "six-structures",
    },
    {
      id: "3b",
      title: "Author's Purpose",
      subtitle: "Topic 3B \u2014 Identifying Author's Purpose",
      body: [
        "Purpose questions ask why the author wrote the passage. Don't confuse this with what the passage says \u2014 purpose is about the author's goal.",
        `Eight Common Purposes:\n\u2022 Argue/Persuade: Convince the reader of a position. Uses evidence, logic, appeals.\n\u2022 Inform/Explain: Teach the reader about a topic. Neutral tone, factual.\n\u2022 Describe: Paint a picture using sensory details or vivid language.\n\u2022 Compare: Show similarities and differences between two or more things.\n\u2022 Challenge: Question or push back against a common belief or existing claim.\n\u2022 Qualify: Add nuance or limitations to a claim. \u201CThis is true, but only under certain conditions.\u201D\n\u2022 Illustrate: Provide a concrete example of an abstract idea.\n\u2022 Contextualize: Provide background that helps the reader understand something.`,
        "Purpose \u2260 Topic. If a passage is about coral reefs, the topic is coral reefs. But the purpose might be to argue for stronger protections, to explain how bleaching works, or to challenge a common misconception. The answer choices will use purpose verbs, not topic nouns.",
        `The \u201CMain Purpose\u201D vs. \u201CFunction of a Sentence\u201D:\n\u2022 Main purpose: Why did the author write the entire passage? Look at the big picture.\n\u2022 Function of a sentence: What role does this specific sentence play within the passage? (Introduces a claim, provides evidence, offers a counterexample, transitions to a new idea, etc.)`
      ],
      visual: "purpose-vs-topic",
    },
    {
      id: "3c",
      title: "Cross-Text Connections",
      subtitle: "Topic 3C \u2014 Analyzing Paired Passages",
      body: [
        "These questions give you two short texts (Text 1 and Text 2) and ask how they relate. This is the most challenging Craft & Structure skill \u2014 but also the rarest (only 1\u20132 questions per test).",
        `Five Relationship Types:\n\u2022 Agree: Both authors support the same claim or reach similar conclusions.\n\u2022 Disagree: Authors take opposing positions on the same issue.\n\u2022 Extend: Text 2 builds on Text 1 by adding new evidence, applications, or implications.\n\u2022 Qualify: Text 2 adds limitations or conditions to Text 1's claim. (\u201CYes, but only when...\u201D)\n\u2022 Apply: Text 2 applies Text 1's general principle to a specific case (or vice versa).`,
        `Strategy for Paired Passages:\n\u2022 Step 1: Read Text 1. Summarize its main claim in one sentence.\n\u2022 Step 2: Read Text 2. Summarize its main claim in one sentence.\n\u2022 Step 3: Ask: \u201CDoes Text 2 agree, disagree, extend, qualify, or apply Text 1?\u201D\n\u2022 Step 4: Read the question stem carefully. It often specifies the direction: \u201CHow would Author 2 respond to Author 1?\u201D`,
        `Common question stems: \u201CBased on the texts, how would [Author 2] most likely respond to [Author 1's claim]?\u201D \u00B7 \u201CWhich choice best describes the relationship between the two texts?\u201D \u00B7 \u201CBoth authors would most likely agree that...\u201D`
      ],
      visual: "five-relationships",
    },
  ],
  quiz: [
    { stem: "Which choice best describes the overall structure of the text?", choices: ["It describes a process and explains its function.", "It makes a claim and then challenges it.", "It presents a problem and proposes a solution.", "It compares two competing theories."], correct: 0, explanation: "The passage describes HOW bees communicate (waggle dance process) and explains WHY it matters (allows efficient food exploitation). This is describe process + explain function." },
    { stem: "Which choice best states the main purpose of the text?", choices: ["To compare Petra's water system to modern infrastructure", "To describe Petra's significance as a trading center and its engineering achievements", "To argue that Petra was the most advanced ancient city", "To explain why the Nabataean civilization eventually declined"], correct: 1, explanation: "The passage describes two things about Petra: its role as a trading hub and its water system. No argument, no comparison, no decline mentioned. Purpose = describe significance." },
    { stem: "Based on the texts, how would Williams most likely respond to Patel?", choices: ["By questioning whether any dietary changes can address climate change", "By arguing that lab-grown meat is more nutritious than plant-based options", "By agreeing with the goal but proposing a different solution", "By rejecting the idea that livestock farming has environmental consequences"], correct: 2, explanation: `Williams \u201Csupports reducing...impact\u201D (agrees with the goal) \u201Cbut contends that...plant-based diets\u201D (proposes a different solution). They share the goal but disagree on the method.` },
    { stem: "Which choice best describes the function of the highlighted sentence?", choices: ["It transitions from a general recommendation to a specific real-world application.", "It introduces a counterargument to the opening claim.", "It provides the study's conclusion.", "It challenges the researchers' recommendation."], correct: 0, explanation: "Sentence 1 = general recommendation. Highlighted sentence = the law that TESTED the recommendation (transitions from theory to practice). Sentence 3 = result. The highlighted sentence bridges the gap." },
    { stem: "Which choice best describes the main purpose of the text?", choices: ["To argue that all adults should take creativity courses", "To describe the steps in Dr. Chen's divergent thinking course", "To challenge the assumption that creativity cannot be developed", "To compare innate creativity with learned creativity"], correct: 2, explanation: `\u201CWhile many assume...suggests otherwise\u201D = the text CHALLENGES a common assumption. The study is evidence FOR the challenge, not the purpose itself. The purpose verb is \u201Cchallenge.\u201D` },
    { stem: "Which choice best describes the relationship between the two texts?", choices: ["Text 2 contradicts Text 1's claim that the printing press was important.", "Both texts agree on the printing press's impact but emphasize different aspects of it.", "Text 2 argues that Text 1's claim is historically inaccurate.", "Text 2 provides additional evidence supporting Text 1's argument."], correct: 1, explanation: "Both agree the press was revolutionary (not contradicting). But Kim emphasizes religious impact while Reyes emphasizes scientific impact. They agree on the big picture, disagree on which impact was most significant." },
    { stem: "Which choice best describes the structure of the text?", choices: ["It compares the octopus's nervous system to that of other animals.", "It presents a claim and then provides a counter-example.", "It traces the evolutionary development of octopus intelligence.", "It describes an unusual biological feature and explains its functional implications."], correct: 3, explanation: "Sentence 1 = unusual feature (neurons in arms, not brain). Sentence 2 = what this enables (autonomous arm movement). Structure = describe feature + explain implication." },
    { stem: "Based on the texts, how would Okafor most likely characterize Nakamura's argument?", choices: ["As overly broad, since only certain types of homework show benefits", "As fundamentally correct in its conclusions", "As based on outdated research methods", "As irrelevant to current educational debates"], correct: 0, explanation: "Okafor's data challenges the general benefit of homework BUT she notes an exception (parental interaction homework). She would say Nakamura's claim is too broad \u2014 it applies only to specific types. This is a QUALIFY relationship." },
    { stem: "Which choice best describes the function of the highlighted sentence in the overall structure of the text?", choices: ["It explains the rhetorical strategy that made Carson's work broadly influential.", "It criticizes Carson's departure from standard scientific writing.", "It provides the central scientific evidence for Carson's claims.", "It compares Carson's book to other environmental publications."], correct: 0, explanation: "Sentence 1 = what Carson did (documented pesticide effects). Highlighted sentence = HOW she did it differently (narrative techniques). Sentence 3 = why that approach mattered (broad impact). The function is explaining the strategy." },
    { stem: "Which choice best describes the overall structure of the text?", choices: ["It presents two competing theories about brain development.", "It describes a scientific finding and then discusses its potential application.", "It traces the history of research on exercise and cognition.", "It argues against current educational practices."], correct: 1, explanation: "Sentence 1 = scientific finding (exercise \u2192 BDNF \u2192 neuron growth). Sentence 2 = application to education (exercise breaks in schools). The passage moves from discovery to potential real-world use." },
  ],
  takeaways: [
    "Text Structure asks how the passage is organized \u2014 not what it says. Look for the pattern (cause/effect, compare/contrast, problem/solution, etc.).",
    "Purpose asks why the author wrote it. Purpose \u2260 topic. Look for purpose verbs: argue, explain, challenge, qualify, illustrate.",
    "\u201CFunction of a sentence\u201D asks what role ONE sentence plays within the whole passage (introduces, supports, qualifies, transitions, etc.).",
    "Cross-Text questions give you two texts. Summarize each in one sentence, then classify: agree, disagree, extend, qualify, or apply.",
    "Wrong answers on purpose questions often describe the topic accurately but the purpose incorrectly (e.g., \u201Cdescribes coral reefs\u201D when the purpose is to \u201Cargue for their protection\u201D).",
    "These questions are rare (~3\u20135 per test) but highly strategic \u2014 they\u2019re questions many students get wrong, so getting them right gives you an edge.",
  ],
};
