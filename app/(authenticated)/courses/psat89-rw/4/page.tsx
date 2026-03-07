"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  CentralIdeaStepsVisual,
  StatedVsImpliedVisual,
  InferenceSpectrumVisual,
} from "./lesson-visuals";

const CEN_EXERCISE: MatchingItem[] = [
  {
    prompt: "For decades, scientists believed that the brain stopped producing new neurons in adulthood. However, research published in the late 1990s revealed that neurogenesis \u2014 the birth of new neurons \u2014 continues in specific brain regions throughout life, particularly the hippocampus, which is critical for memory and learning. This discovery has opened new avenues for treating neurodegenerative diseases like Alzheimer\u2019s.",
    options: [
      "The brain is the most complex organ in the human body.",
      "Scientists once believed neurogenesis stopped in adulthood, but new research shows it continues and may help treat brain diseases.",
      "Alzheimer\u2019s disease affects the hippocampus.",
      "The hippocampus is the most important region of the brain.",
    ],
    correct: 1,
    explanation: `The passage tells a story: old belief (no new neurons) \u2192 new discovery (neurogenesis continues) \u2192 implication (disease treatment). Answer B captures this full arc. A is too broad. C and D are details, not the central idea.`,
  },
  {
    prompt: `The common octopus can change the color, texture, and even the shape of its skin in milliseconds, allowing it to blend seamlessly with coral, rocks, or sandy ocean floors. Researchers have discovered that this ability relies not on eyesight but on light-sensitive proteins called opsins embedded directly in the skin cells, enabling the skin itself to \u201csee\u201d and respond to its surroundings.`,
    options: [
      "Octopuses are intelligent marine animals.",
      "Octopuses use their skin\u2019s light-sensitive proteins, rather than eyesight, to achieve rapid camouflage.",
      "Marine animals have developed many survival strategies.",
      "Opsins are proteins found in many animals.",
    ],
    correct: 1,
    explanation: `The passage\u2019s specific point: octopus camouflage works through skin-based opsins, NOT eyesight. That\u2019s both surprising and specific. A and C are too broad. D is a detail.`,
  },
  {
    prompt: "During the Great Migration of the early twentieth century, approximately six million Black Americans relocated from the rural South to cities in the North, Midwest, and West. While economic opportunity was a primary driver, many migrants also sought to escape the racial violence and legal oppression of Jim Crow laws. The migration fundamentally reshaped American culture, contributing to the Harlem Renaissance, the growth of jazz, and the rise of the civil rights movement.",
    options: [
      "The Great Migration was caused by economic factors.",
      "Many Black Americans moved to northern cities during the twentieth century.",
      "The Great Migration, driven by both economic opportunity and the desire to escape racial oppression, profoundly transformed American culture.",
      "The Harlem Renaissance was the most significant cultural movement of the twentieth century.",
    ],
    correct: 2,
    explanation: "C captures the full passage: WHAT happened (migration), WHY (economic + escape oppression), and RESULT (cultural transformation). A is too narrow (only one cause). B is too vague. D goes beyond the passage.",
  },
  {
    prompt: "A team of archaeologists working in southern Turkey has uncovered evidence that G\u00f6bekli Tepe, a massive stone complex dating to approximately 9600 BCE, was constructed by hunter-gatherers \u2014 not settled agricultural communities as previously assumed. The discovery challenges the long-held theory that monumental architecture required the surplus resources only farming societies could produce.",
    options: [
      "G\u00f6bekli Tepe is an archaeological site in Turkey.",
      "Hunter-gatherers at G\u00f6bekli Tepe built monumental architecture, challenging the assumption that such construction required agricultural societies.",
      "Archaeological discoveries are rewriting human history.",
      "Farming was not practiced in Turkey before 9600 BCE.",
    ],
    correct: 1,
    explanation: "B captures the specific finding (hunter-gatherers built it) AND its significance (challenges previous assumptions). A is just a fact. C is too broad. D is not stated.",
  },
];

const INF_EXERCISE: MatchingItem[] = [
  {
    prompt: `The city council voted 7\u20132 to approve the new park, with the two dissenting members citing budget concerns.\n\nClaim: "A majority of council members supported the park."`,
    options: ["Supported", "Not supported"],
    correct: 0,
    explanation: "7\u20132 IS a majority. This is just restating the vote count in different words.",
  },
  {
    prompt: `The city council voted 7\u20132 to approve the new park, with the two dissenting members citing budget concerns.\n\nClaim: "The dissenting members did not value public recreation."`,
    options: ["Supported", "Not supported"],
    correct: 1,
    explanation: "They cited BUDGET concerns, not opposition to recreation. You can\u2019t infer they don\u2019t value parks \u2014 they may have wanted the park but worried about cost.",
  },
  {
    prompt: `The city council voted 7\u20132 to approve the new park, with the two dissenting members citing budget concerns.\n\nClaim: "Budget was a consideration in the council's deliberations."`,
    options: ["Supported", "Not supported"],
    correct: 1,
    explanation: "The passage says two members cited budget concerns, so budget WAS discussed. But the passage doesn\u2019t say the full council debated it \u2014 just that two members raised it. This is a valid inference, slightly beyond restatement.",
  },
  {
    prompt: `After the factory closed, the town's population dropped from 12,000 to 8,500 within five years. Most of the departing residents were between 25 and 40 years old.\n\nClaim: "The factory closure contributed to the town's population decline."`,
    options: ["Supported", "Not supported"],
    correct: 1,
    explanation: `The passage places the decline AFTER the closure, and the timing strongly suggests a connection. But it doesn\u2019t explicitly say "because of the closure." Valid inference based on sequence and logic.`,
  },
  {
    prompt: `After the factory closed, the town's population dropped from 12,000 to 8,500 within five years. Most of the departing residents were between 25 and 40 years old.\n\nClaim: "The town will eventually become a ghost town."`,
    options: ["Supported", "Not supported"],
    correct: 1,
    explanation: "The passage describes a decline but never says it will continue to zero. The decline could stabilize. This extrapolates far beyond the text.",
  },
  {
    prompt: `After the factory closed, the town's population dropped from 12,000 to 8,500 within five years. Most of the departing residents were between 25 and 40 years old.\n\nClaim: "The town's remaining population likely skewed older after the decline."`,
    options: ["Supported", "Not supported"],
    correct: 1,
    explanation: "If working-age adults (25\u201340) left disproportionately, the remaining population would naturally have a higher average age. Logically supported but not directly stated.",
  },
];

const AUT_EXERCISE: MatchingItem[] = [
  {
    prompt: "Researchers have found that elephants communicate using infrasound \u2014 low-frequency vibrations undetectable to the human ear. These rumbles can travel through the ground for miles, allowing elephants to coordinate movements and warn of danger across vast distances. The discovery has led scientists to reconsider how many large animals might use seismic communication.",
    options: [
      "Correct interpretation",
      "Elephants have the most sophisticated communication system of any animal.",
    ],
    correct: 0,
    explanation: `The passage discusses elephant infrasound but never compares it to ALL other animals or claims it\u2019s "the most sophisticated." This goes beyond the text by making an unsupported superlative claim.`,
  },
  {
    prompt: "The tiny island nation of Tuvalu faces an existential threat from rising sea levels. With its highest point only 4.6 meters above sea level, even modest increases in ocean height could render the country uninhabitable. The government has begun negotiating \u201cclimate refugee\u201d agreements with neighboring nations, while simultaneously investing in coastal reinforcement projects.",
    options: [
      "Correct interpretation",
      "Tuvalu\u2019s government is negotiating with neighboring nations.",
    ],
    correct: 0,
    explanation: "This is TRUE but captures only ONE detail. As a central idea, it misses the bigger picture: the existential threat, the low elevation, and the dual strategy of negotiation AND reinforcement. Too narrow.",
  },
  {
    prompt: `A new study suggests that the "five-second rule" \u2014 the popular belief that food dropped on the floor is safe to eat if picked up within five seconds \u2014 has some basis in science. Researchers found that moisture, surface type, and contact time all affect bacterial transfer, with wet foods on tile picking up significantly more bacteria than dry foods on carpet. However, the researchers emphasized that some bacteria transfer happens almost instantly.`,
    options: [
      "Correct interpretation",
      "The five-second rule has been proven completely true by scientific research.",
    ],
    correct: 0,
    explanation: `The passage says the rule has "some basis" but ALSO says "some bacteria transfer happens almost instantly." The wrong answer distorts this nuanced finding into a definitive claim the passage doesn\u2019t make.`,
  },
  {
    prompt: "During the 2010s, streaming services fundamentally changed how audiences consumed television. Shows could now be released as entire seasons at once, enabling \u201cbinge-watching.\u201d This shift also affected how writers structured stories \u2014 with longer arcs and fewer recaps, since audiences were expected to watch episodes in rapid succession rather than waiting a week between installments.",
    options: [
      "Correct interpretation",
      "The history of television technology from the 1950s to today.",
    ],
    correct: 0,
    explanation: `The passage focuses specifically on 2010s streaming and its effect on storytelling. "The history of television technology from the 1950s to today" is far too broad \u2014 the passage doesn\u2019t discuss decades of TV history.`,
  },
];

export default function PSAT89RWModule4() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "central-idea-steps": <CentralIdeaStepsVisual />,
        "stated-vs-implied": <StatedVsImpliedVisual />,
        "inference-spectrum": <InferenceSpectrumVisual />,
      }}
      activities={{
        "exercise-cen": (goNext: () => void) => (
          <MatchingExercise
            items={CEN_EXERCISE}
            title="Central Ideas"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-inf": (goNext: () => void) => (
          <MatchingExercise
            items={INF_EXERCISE}
            title="Inferences"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-aut": (goNext: () => void) => (
          <MatchingExercise
            items={AUT_EXERCISE}
            title="Author\u2019s Purpose"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
      }}
      nextModuleHref="/courses/psat89-rw/5"
      nextModuleLabel="Module 5: Command of Evidence"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "rw",
  moduleNum: 4,
  title: "Central Ideas, Details & Inferences",
  subtitle: "Topic 4A \u2014 Topic vs. Central Idea, the \u201cSo What?\u201d Test, and Common Wrong-Answer Types",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-cen", label: "Central Ideas", icon: "zap" },
    { id: "exercise-inf", label: "Inferences", icon: "zap" },
    { id: "exercise-aut", label: "Author\u2019s Purpose", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "4a",
      title: "Central Ideas & Main Claims",
      subtitle: "Topic 4A \u2014 Topic vs. Central Idea, the \u201cSo What?\u201d Test, and Common Wrong-Answer Types",
      body: [
        `Central Idea questions ask: "What is the passage mainly about?" This isn\u2019t just the topic \u2014 it\u2019s the author\u2019s specific point about that topic.`,
        "Topic vs. Central Idea:\n\u2022 Topic: What the passage is about in 1\u20133 words. (Coral reefs. Sleep research. The Industrial Revolution.)\n\u2022 Central idea: The specific point the author makes about the topic. (Coral reefs are declining faster than predicted due to ocean acidification.)",
        `Step 1: Read the full passage. Identify the topic (1\u20133 words).\nStep 2: Ask "So what?" \u2014 What specific point does the author make about this topic?\nStep 3: Check: Does my central idea cover the WHOLE passage, not just one part?\nStep 4: Match to the answer choice that\u2019s neither too broad nor too narrow.`,
        `The "So What?" Test: After reading, complete this sentence: "This passage is about [topic], and the author\u2019s main point is that [central idea]." If you can\u2019t complete it, re-read the first and last sentences \u2014 they usually frame the central idea.`,
        `Four Wrong-Answer Types:\n\u2022 Too broad: "Discusses the importance of scientific research" \u2014 true but vague, could apply to thousands of passages.\n\u2022 Too narrow: Focuses on only one detail or example instead of the overall point.\n\u2022 Off-topic: Mentions something related but not actually discussed in the passage.\n\u2022 Distorted: Gets the topic right but the claim wrong (says the author supports X when they actually question X).`,
      ],
      visual: "central-idea-steps",
    },
    {
      id: "4b",
      title: "Key Details & Supporting Evidence",
      subtitle: "Topic 4B \u2014 Finding Details, Distinguishing Stated vs. Implied, and the Evidence-First Method",
      body: [
        "Detail questions ask you to find specific information stated directly in the passage. The answer is always there \u2014 you just have to find it.",
        "The Evidence-First Method: For every answer you choose, you should be able to point to the exact sentence(s) in the passage that support it. If you can\u2019t point to evidence, the answer is probably wrong.",
        `Rule 1: If the passage doesn\u2019t say it, don\u2019t choose it \u2014 even if it\u2019s true in real life.\nRule 2: Don\u2019t add your own knowledge. The PSAT only tests what\u2019s IN the text.\nRule 3: Beware of "strong" words: always, never, all, none, every, completely. The text usually uses more moderate language.\nRule 4: Details from only ONE part of the passage are too narrow for a central idea question, but perfect for a detail question.`,
        `Question stem clues: "According to the passage" or "The text states" = look for explicitly stated information. "Based on the passage, it can be inferred" = look for what the text implies.`,
      ],
      visual: "stated-vs-implied",
    },
    {
      id: "4c",
      title: "Making Inferences",
      subtitle: "Topic 4C \u2014 The Inference Spectrum, \u201cClosest to the Text\u201d Principle, and Logical Leaps to Avoid",
      body: [
        "Inference questions ask you to draw a logical conclusion that the passage supports but doesn\u2019t directly state. Think of it as reading between the lines \u2014 but staying close to the text.",
        `The Inference Spectrum:\n\u2022 Restated: "The population declined by 40%." \u2192 The population shrank. (Too obvious \u2014 not really an inference.)\n\u2022 Valid inference: "The population declined by 40% after the dam was built." \u2192 The dam likely contributed to the decline. (Supported by the text.)\n\u2022 Logical leap: "The population declined by 40%." \u2192 The species will go extinct. (The passage never says this \u2014 too extreme.)`,
        "On the PSAT, the correct answer is always the most conservative, best-supported inference \u2014 the one closest to what the text actually says.",
        "Three Inference Types on the PSAT:\n\u2022 Character/author inference: What can you infer about how this person thinks or feels? (Look for word choice, actions, reactions.)\n\u2022 Logical consequence: If the passage says X, what logically follows? (If a study shows A causes B, and this treatment uses A, then...)\n\u2022 Implicit comparison: The passage describes two things differently \u2014 what can you infer about how they differ?",
        `The "Closest to the Text" Principle: When two answers both seem plausible, pick the one that requires the FEWEST assumptions beyond what the passage states. The PSAT rewards cautious, evidence-based reasoning.`,
      ],
      visual: "inference-spectrum",
    },
  ],

  quiz: [
    {
      passage: "Honeybees are not native to the Americas. They were introduced by European colonists in the seventeenth century for honey production and crop pollination. Today, managed honeybee colonies pollinate roughly one-third of the food crops grown in the United States, making them economically indispensable \u2014 even though thousands of native bee species also contribute significantly to pollination.",
      stem: "Which choice best states the central idea of the text?",
      choices: [
        "European colonists introduced honeybees, which have become economically vital to U.S. agriculture despite being non-native.",
        "Honey production is the primary reason honeybees were brought to the Americas.",
        "Native bee species are more effective pollinators than honeybees.",
        "Honeybees are the only pollinators in the Americas."
      ],
      correct: 0,
      explanation: "B captures the full passage: origin (introduced by colonists), significance (economically vital), and nuance (non-native). A contradicts the passage (native bees also pollinate). C is not stated. D is too narrow (passage says both honey AND pollination).",
    },
    {
      passage: "The Library of Alexandria, founded in the third century BCE, is often cited as the greatest repository of knowledge in the ancient world. Scholars estimate it held between 400,000 and 700,000 scrolls. Contrary to popular belief, the library was not destroyed in a single catastrophic fire but declined gradually over several centuries due to reduced funding, political instability, and multiple smaller incidents of damage.",
      stem: "Based on the text, which statement about the Library of Alexandria is accurate?",
      choices: [
        "It was the only library in the ancient world.",
        "It contained exactly 500,000 scrolls.",
        "Its decline was gradual rather than sudden.",
        "It was destroyed in a single fire."
      ],
      correct: 2,
      explanation: `The passage explicitly states its decline was gradual: "not destroyed in a single catastrophic fire but declined gradually." A is directly contradicted. B says "exactly" when the passage gives a range. D is never stated.`,
    },
    {
      passage: "Studies have shown that bilingual children often perform better on tasks requiring cognitive flexibility \u2014 the ability to switch between different rules or perspectives. Researchers believe this advantage develops because bilingual children must constantly monitor which language to use in different social contexts, strengthening the brain\u2019s executive control systems.",
      stem: "It can most reasonably be inferred from the text that:",
      choices: [
        "Executive control systems are located in a specific brain region.",
        "All bilingual children are smarter than monolingual children.",
        "Managing two languages exercises cognitive skills that have broader applications.",
        "Bilingualism has no disadvantages."
      ],
      correct: 2,
      explanation: `The passage connects language monitoring to stronger executive control to better cognitive flexibility. B captures this chain: managing languages \u2192 cognitive benefits beyond language. A uses "all" and "smarter" (too extreme). C and D go beyond the text.`,
    },
    {
      passage: `When psychologist Walter Mischel conducted his famous "marshmallow test" in the late 1960s, he found that children who could delay gratification \u2014 waiting to receive two marshmallows instead of eating one immediately \u2014 tended to achieve better academic and social outcomes later in life. However, recent replications with larger and more diverse samples have shown that the correlation weakens significantly when researchers control for socioeconomic factors, suggesting that family wealth and stability, rather than innate self-control, may largely explain the original findings.`,
      stem: "Which choice best states the central idea of the text?",
      choices: [
        "Recent research suggests that socioeconomic factors, not self-control alone, may explain the outcomes originally attributed to delayed gratification.",
        "The marshmallow test proves that self-control determines life success.",
        "Walter Mischel\u2019s research methods were fundamentally flawed.",
        "Children from wealthy families always perform better on cognitive tests."
      ],
      correct: 0,
      explanation: `C captures the passage\u2019s arc: original finding \u2192 recent challenge \u2192 alternative explanation (socioeconomic factors). A restates the OLD claim the passage is challenging. B is too extreme (methods weren\u2019t "fundamentally flawed"). D uses "always" and "cognitive tests" (not stated).`,
    },
    {
      passage: `Ecologist Suzanne Simard discovered that trees in a forest communicate and share nutrients through an underground network of fungal threads called mycorrhizal networks. Through this "wood wide web," older trees can transfer carbon and nutrients to younger, shaded seedlings, boosting their survival rates. Simard\u2019s research has also revealed that when a tree is dying, it sometimes dumps its resources into the network, effectively bequeathing its nutrients to its neighbors.`,
      stem: "Based on the text, what can most reasonably be inferred about tree behavior?",
      choices: [
        "Dying trees always transfer their nutrients to nearby trees.",
        "Mycorrhizal networks only benefit young trees.",
        "Trees are conscious beings capable of making deliberate decisions.",
        "Trees have evolved mechanisms that facilitate resource sharing within forest communities."
      ],
      correct: 3,
      explanation: `The passage describes carbon transfer, nutrient sharing, and resource dumping \u2014 all mechanisms of resource sharing. B captures this without overclaiming. A implies consciousness (not stated). C contradicts the passage (dying trees also contribute). D uses "always" when the passage says "sometimes."`,
    },
    {
      passage: "In 1848, gold was discovered at Sutter\u2019s Mill in California, triggering one of the largest mass migrations in American history. An estimated 300,000 people arrived in California between 1848 and 1855. While some prospectors struck it rich, most found that the real money was in supplying miners with tools, food, and clothing. Levi Strauss, for instance, made his fortune not by mining but by selling durable denim pants to miners.",
      stem: "According to the text, what was true about the California Gold Rush?",
      choices: [
        "Exactly 300,000 people moved to California during the Gold Rush.",
        "Levi Strauss was the most successful Gold Rush entrepreneur.",
        "Supplying goods to miners was often more profitable than mining itself.",
        "Most prospectors became wealthy from mining gold."
      ],
      correct: 2,
      explanation: `The passage states "most found that the real money was in supplying miners." C paraphrases this accurately. A contradicts the passage ("most" did NOT get rich mining). B is not stated ("most successful" is never claimed). D says "exactly" when the passage says "an estimated."`,
    },
    {
      passage: "A team of marine biologists studying coral reefs near Indonesia found that certain species of parrotfish play a critical role in reef health by eating algae that would otherwise smother coral. When parrotfish populations declined due to overfishing, algae coverage increased by 60% within two years, and new coral growth dropped to near zero. The researchers argue that protecting parrotfish populations should be a priority in coral conservation efforts.",
      stem: "It can most reasonably be inferred from the text that without intervention:",
      choices: [
        "Algae is always harmful to marine ecosystems.",
        "All coral reefs worldwide will die within two years.",
        "Continued overfishing of parrotfish would likely accelerate coral reef decline in the studied region.",
        "Parrotfish are the only species that eat algae on coral reefs."
      ],
      correct: 2,
      explanation: "If removing parrotfish caused 60% more algae and near-zero coral growth, continuing that trend would worsen decline. B is the most conservative, supported inference. A is too extreme (worldwide, all). C and D go beyond what\u2019s stated.",
    },
    {
      passage: `Linguist John McWhorter argues that the widespread concern about texting ruining the English language is unfounded. He notes that abbreviations like "LOL" and "u" are not signs of linguistic decay but rather a new form of informal written language \u2014 what he calls "fingered speech." McWhorter points out that similar anxieties arose when the telephone was invented, when radio became popular, and when television entered homes, none of which destroyed the language. He suggests that texting actually demonstrates linguistic creativity, as users develop new ways to convey tone and nuance in a constrained medium.`,
      stem: "Which choice best describes how McWhorter would most likely characterize concerns about texting\u2019s effect on language?",
      choices: [
        "As an overreaction that ignores how texting harms formal writing skills",
        "As a recurring pattern of unfounded anxiety about new communication technologies",
        "As evidence that education standards have declined",
        "As a reasonable response to genuine linguistic decline"
      ],
      correct: 1,
      explanation: `McWhorter calls the concern "unfounded," compares it to past anxieties about phones/radio/TV (a recurring pattern), and argues texting shows creativity. B captures this. A contradicts his position. C is not his argument. D introduces "harms formal writing" which McWhorter doesn\u2019t discuss.`,
    },
    {
      passage: "For centuries, historians portrayed Genghis Khan primarily as a brutal conqueror whose armies left devastation across Asia and Europe. Recent scholarship, however, has painted a more complex picture. While acknowledging the violence of Mongol conquests, historians now emphasize that the Mongol Empire also established the most extensive trade network the world had seen, promoted religious tolerance across its territories, created a reliable postal system spanning thousands of miles, and facilitated unprecedented cultural exchange between East and West.",
      stem: "The text primarily serves to:",
      choices: [
        "Present a more nuanced historical assessment that acknowledges both the destructive and constructive aspects of the Mongol Empire",
        "Argue that Genghis Khan was a benevolent ruler",
        "Prove that the Mongol Empire was more advanced than European civilizations",
        "Challenge all previous scholarship about the Mongol Empire"
      ],
      correct: 0,
      explanation: `The passage presents BOTH sides: violence acknowledged AND positive contributions highlighted. B captures this nuance. A goes too far (never says "benevolent"). C makes a comparison not in the passage. D is too extreme ("all previous scholarship").`,
    },
    {
      passage: "The axolotl, a salamander native to Lake Xochimilco in Mexico City, possesses an extraordinary ability: it can regenerate entire limbs, spinal cord tissue, heart tissue, and even parts of its brain with no scarring. While many animals can regenerate to some degree \u2014 lizards regrow tails, starfish regrow arms \u2014 the axolotl\u2019s regeneration is uniquely comprehensive. Scientists studying axolotl regeneration have identified key genes involved in the process, raising the possibility that understanding these mechanisms could eventually inform treatments for human injuries and degenerative diseases.",
      stem: "It can most reasonably be inferred from the text that the author considers axolotl regeneration research to be:",
      choices: [
        "Potentially valuable for advancing human medical treatments",
        "The only way to develop treatments for degenerative diseases",
        "More important than all other biological research",
        "Unlikely to produce practical results for humans"
      ],
      correct: 0,
      explanation: `The passage ends with "raising the possibility" of informing human treatments \u2014 the author presents this as a genuine potential benefit, making B a supported inference. A contradicts the tone. C and D use extreme language ("all other," "only way") not supported by the text.`,
    },
  ],

  takeaways: [
    "Central Idea = the author\u2019s specific POINT, not just the topic. Use the \u201cSo What?\u201d test.",
    "The correct central idea covers the WHOLE passage \u2014 not too broad, not too narrow.",
    "\u201cPoint to the evidence\u201d \u2014 for every answer, you should be able to underline the supporting text.",
    "Don\u2019t add outside knowledge. The answer is always IN the passage.",
    "Beware of extreme words (always, never, all, none). The text is usually more moderate.",
    "Valid inferences stay close to the text. Pick the MOST conservative, best-supported conclusion.",
    "Four wrong-answer types: too broad, too narrow, off-topic, and distorted (wrong claim about right topic).",
    "Question stems tell you what to look for: \u201cstates\u201d = explicit, \u201cinferred\u201d = implicit, \u201cmainly about\u201d = central idea.",
  ],
};
