"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import {
  StatsVisual,
  AnatomyVisual,
  StrengthenExamplesVisual,
  CausalTrapsVisual,
  FrameworkVisual,
} from "./lesson-visuals";

/* ═══════════════════════════════════════════════════════
 * MODULE 11 — Command of Quantitative Evidence
 * Tables, graphs, and data in passages
 * ═══════════════════════════════════════════════════════ */

export default function SATRWModule11() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "stats": <StatsVisual />,
        "anatomy-visual": <AnatomyVisual />,
        "strengthen-examples": <StrengthenExamplesVisual />,
        "causal-traps": <CausalTrapsVisual />,
        "framework-visual": <FrameworkVisual />,
      }}
      nextModuleHref="/courses/sat-rw/12"
      nextModuleLabel="Module 12: Information Boss Battle"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 11,
  title: "Command of Quantitative Evidence",
  subtitle:
    "Tables, graphs, and data in passages",
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
      source: "M9 \u2014 Central Idea",
      stem: "Recent studies of coral reef recovery in the Philippines have shown that marine protected areas where fishing is strictly prohibited recover biodiversity approximately four times faster than areas where limited fishing is permitted. Researchers attribute this to the cascading ecological effects of allowing top predators to reestablish, which restores natural competition and predation patterns throughout the food web.\n\nWhich choice best states the main idea of the text?",
      choices: [
        "Fishing should be banned worldwide to protect coral reefs",
        "Marine biologists disagree about the best way to protect coral reefs",
        "Strict fishing prohibitions in marine protected areas accelerate reef recovery by allowing natural predator-prey dynamics to reestablish",
        "Most people have a high tolerance for pain"
      ],
      correct: 2,
      explanation:
        "The passage links strict prohibition \u2192 faster recovery \u2192 predator reestablishment \u2192 restored food web. B captures this causal chain.",
    },
    {
      source: "M10 \u2014 Evidence",
      stem: "Psychologist Dr. Chen argues that workplace open-plan offices reduce employee productivity because constant visual and auditory distractions prevent sustained deep focus.\n\nWhich finding, if true, would most directly support Dr. Chen\u2019s argument?",
      choices: [
        "Employees moved from private offices to open plans showed a 32% decline in tasks requiring sustained concentration, with self-reported distraction as the primary cause",
        "A controlled study found that employees in open offices spent 73% less time in face-to-face interactions than those in private offices",
        "Some employees prefer open offices because they enjoy social interaction",
        "Many companies have adopted open-plan offices to reduce real estate costs"
      ],
      correct: 0,
      explanation:
        "Chen\u2019s claim: open offices \u2192 distractions \u2192 reduced productivity. C provides direct evidence: concentration tasks declined 32% with distraction cited as the cause.",
    },
    {
      source: "M5 \u2014 Vocabulary",
      stem: "The novelist\u2019s latest work has been described by critics as ______: its intricate plot, layered symbolism, and demanding vocabulary require careful, repeated reading to fully appreciate.\n\nWhich choice completes the text with the most logical and precise word?",
      choices: ["accessible", "exacting", "formulaic", "superficial"],
      correct: 1,
      explanation:
        "\u2018Intricate,\u2019 \u2018layered,\u2019 \u2018demanding\u2019 = requires significant effort. \u2018Exacting\u2019 means demanding great care and effort.",
    },
    {
      source: "M3 \u2014 Conventions",
      stem: "The researchers who conducted the longitudinal study ______ that early childhood nutrition has a measurable impact on academic achievement through adolescence.\n\nWhich choice conforms to Standard English conventions?",
      choices: ["concludes", "concluded", "has concluded", "concluding"],
      correct: 1,
      explanation:
        "Subject: \u2018researchers\u2019 (plural). Past tense context (longitudinal study = completed). Plural + past = \u2018concluded.\u2019",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "intro",
      title: "Thinking Like a Logician",
      subtitle: "The SAT's highest-order reasoning questions",
      body: [
        "Logical reasoning questions are the most challenging on the SAT R&W. They test whether you can evaluate the LOGIC of an argument, not just understand its content.",
        "These questions come in several forms:\n\u2022 Which finding would strengthen/weaken the claim? (~2-3 per test)\n\u2022 Which conclusion logically follows from the information? (~1-2 per test)\n\u2022 What assumption underlies the argument? (occasional)\n\u2022 Which statement best completes the passage's logical structure? (~1-2 per test)",
        "Together with synthesis questions (combining information from multiple parts of a passage), these represent the analytical ceiling of the SAT. Master them, and you can handle anything the test throws at you.",
      ],
      visual: "stats",
    },
    {
      id: "argument-parts",
      title: "Anatomy of an Argument",
      subtitle: "Claim, evidence, reasoning, assumption",
      body: [
        "Every argument has parts. The SAT tests whether you can identify them:",
        "CLAIM: The main point the argument is trying to establish.\n\"Urban gardens improve community health.\"",
        "EVIDENCE: Facts, data, or observations offered in support of the claim.\n\"Neighborhoods with community gardens show 15% lower rates of depression.\"",
        "REASONING: The logical connection between evidence and claim \u2014 HOW the evidence supports the claim.\n\"Access to green space and social interaction through gardening reduces stress.\"",
        "ASSUMPTION: An unstated belief that the argument requires to work. Every argument has hidden assumptions.\n\"The gardens caused the health improvement, not the other way around (i.e., healthier communities didn't simply build more gardens).\"",
        "The SAT tests all of these, but the most important skill is identifying ASSUMPTIONS \u2014 the invisible logical bridges that hold arguments together.",
      ],
      visual: "anatomy-visual",
    },
    {
      id: "strengthen",
      title: "Strengthen/Weaken Questions",
      subtitle: "The most common logical reasoning format",
      body: [
        "These questions present a passage with a claim and evidence, then ask which additional piece of information would STRENGTHEN or WEAKEN the argument.",
        "TO STRENGTHEN: Find information that:\n\u2022 Eliminates an alternative explanation\n\u2022 Provides additional supporting evidence\n\u2022 Confirms a key assumption\n\u2022 Shows the pattern holds in new contexts",
        "TO WEAKEN: Find information that:\n\u2022 Introduces a plausible alternative explanation\n\u2022 Contradicts the evidence or shows exceptions\n\u2022 Undermines a key assumption\n\u2022 Reveals a confounding variable",
        "CRITICAL INSIGHT: Strengthen/weaken questions are really about ASSUMPTIONS. The best way to strengthen an argument is to confirm its hidden assumption. The best way to weaken it is to attack that assumption.",
      ],
      visual: "strengthen-examples",
    },
    {
      id: "assumptions",
      title: "Finding Hidden Assumptions",
      subtitle: "The invisible bridges in every argument",
      body: [
        "An assumption is something the argument MUST be true for the conclusion to follow from the evidence, but that the argument doesn't explicitly state.",
        "TECHNIQUE: The Negation Test\n1. Identify what you think the assumption is.\n2. Negate it (imagine it's false).\n3. If the argument falls apart when the assumption is negated, you've found a real assumption.",
        "EXAMPLE:\nClaim: \"Students who take music lessons perform better academically.\"\nEvidence: \"Students in the school orchestra have higher GPAs than non-musicians.\"\n\nAssumption: Musical training causes the academic improvement (not: high-achieving students are simply more likely to choose music).\n\nNegate it: \"High-achieving students are more likely to choose music lessons regardless of any effect on academics.\"\n\nDoes the argument collapse? Yes \u2014 the correlation would exist even without causation. So this IS a key assumption.",
        "The SAT won't ask you to formally identify assumptions, but this thinking underlies every strengthen/weaken question.",
      ],
    },
    {
      id: "logical-completion",
      title: "Logical Completion Questions",
      subtitle: "Which conclusion follows from the evidence?",
      body: [
        "Some questions present a passage with evidence and ask which conclusion logically follows. These are like inference questions but more focused on logical structure than reading comprehension.",
        "THE KEY PRINCIPLE: The correct conclusion must follow NECESSARILY from the stated evidence. It cannot require additional assumptions or outside knowledge.",
        "COMMON TRAPS:\n\u2022 Conclusions that are TRUE but don't follow from THIS evidence\n\u2022 Conclusions that go beyond what the evidence can support (overgeneralization)\n\u2022 Conclusions that reverse a causal relationship\n\u2022 Conclusions about ALL cases when evidence covers only SOME",
        "EXAMPLE:\nEvidence: \"In a study of 500 companies, those with diverse leadership teams reported 19% higher revenue growth than those with homogeneous teams.\"\n\nValid conclusion: \"The data suggests a positive association between leadership diversity and revenue growth.\"\n\nInvalid conclusion: \"Leadership diversity causes higher revenue growth.\" (Correlation study \u2014 can't prove causation.)",
      ],
    },
    {
      id: "synthesis",
      title: "Synthesis Questions",
      subtitle: "Combining information from multiple sources",
      body: [
        "Synthesis questions ask you to combine information from different parts of a passage \u2014 or from a passage and a data display \u2014 to reach a conclusion that neither source alone supports.",
        "EXAMPLE: A passage discusses how deforestation reduces rainfall (Part A), and a table shows declining crop yields in deforested regions (Part B). The synthesis conclusion: deforestation may be indirectly reducing crop yields through its effect on rainfall.",
        "STRATEGY:\n1. Identify what each source contributes.\n2. Look for the LOGICAL CONNECTION between them.\n3. The correct answer combines both sources \u2014 reject answers that only use one.",
        "TRAP: Answers that accurately describe one source but ignore the other. The whole point of synthesis is combining information, so the answer must require BOTH sources.",
      ],
    },
    {
      id: "causal-reasoning",
      title: "Causal Reasoning Traps",
      subtitle: "The SAT's favorite logical pitfalls",
      body: [
        "The SAT loves testing whether you can spot flawed causal reasoning. Here are the most common patterns:",
        "CORRELATION \u2260 CAUSATION: Two things happening together doesn't mean one caused the other. Ice cream sales and drowning deaths both increase in summer \u2014 ice cream doesn't cause drowning. The hidden variable: hot weather.",
        "REVERSE CAUSATION: Maybe B causes A, not A causes B. \"Happy people exercise more\" could mean exercise causes happiness OR happiness causes exercise motivation.",
        "CONFOUNDING VARIABLE: A third factor might cause both. \"Coffee drinkers live longer\" \u2014 but coffee drinkers might also have higher incomes and better healthcare access.",
        "SELECTION BIAS: The sample isn't representative. \"Our customers love our product\" \u2014 of course; unhappy customers already left.",
        "On the SAT, these appear as:\n\u2022 Strengthen: answers that rule out alternative explanations\n\u2022 Weaken: answers that introduce confounding variables\n\u2022 Completion: choosing the appropriately cautious conclusion",
      ],
      visual: "causal-traps",
    },
    {
      id: "framework",
      title: "The Reasoning Framework",
      subtitle: "Your approach for every logical question",
      body: [
        "STEP 1: Identify the argument structure. What is the CLAIM? What EVIDENCE supports it? What is the logical REASONING connecting them?",
        "STEP 2: Find the gap. What ASSUMPTION does the argument make? What could go wrong between the evidence and the conclusion?",
        "STEP 3: For strengthen questions, find the answer that fills the gap \u2014 confirms the assumption or eliminates an alternative explanation.",
        "STEP 4: For weaken questions, find the answer that exposes the gap \u2014 introduces an alternative explanation or attacks the assumption.",
        "STEP 5: For completion questions, choose the conclusion that follows from the evidence WITHOUT requiring additional unstated information. The most cautious, well-supported conclusion is usually correct.",
        "GOLDEN RULE: The correct answer in logical reasoning is almost always the most MODERATE one. Extreme, absolute, or sweeping conclusions are almost always wrong.",
      ],
      visual: "framework-visual",
    },
  ],

  /* ──────── QUIZ ──────── */
  quiz: [
    {
      passage:
        "The ecologist, along with her team of graduate students, ______ conducting field research in the Amazon basin when the unexpected flooding began.",
      stem: "Which choice conforms to Standard English?",
      choices: ["have been", "was", "are", "were"],
      correct: 1,
      explanation:
        "\u2018The ecologist\u2019 is the subject (singular). \u2018Along with her team\u2019 is a parenthetical phrase that does not change the subject number. Singular subject \u2192 \u2018was.\u2019",
      type: "conventions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "Historians have long attributed the fall of the Roman Empire partly to lead poisoning from the empire's extensive use of lead pipes for water distribution. Critics of this theory note that lead pipes were used throughout the empire's 500-year history, not just during its decline.",
      stem: "Which finding, if true, would most strengthen the lead poisoning theory against the critics' objection?",
      choices: [
        "Modern cities also use lead pipes in some older neighborhoods",
        "Roman elites used lead-lined vessels for wine storage, which would have increased their lead exposure far beyond what pipes alone produced, and this practice became significantly more widespread during the later imperial period",
        "Lead poisoning affects the nervous system and can impair cognitive function",
        "The Roman Empire faced military threats from multiple foreign groups"
      ],
      correct: 1,
      explanation:
        "The critics say: pipes existed throughout, so why only decline at the end? A answers this by showing a SECOND, escalating source of lead exposure (wine vessels) that became more common in the later period. This explains why lead effects would worsen during the decline specifically.",
      type: "strengthen",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "A technology company found that teams using their new AI-powered project management software completed projects an average of 22% faster than teams using traditional methods. The company concluded that AI project management tools significantly improve team productivity.",
      stem: "Which finding, if true, would most weaken the company's conclusion?",
      choices: [
        "The teams assigned to use the AI software were selected from the company's highest-performing departments, while traditional-method teams were drawn from average-performing departments",
        "Project management is an important function in most organizations",
        "The AI software costs more than traditional project management tools",
        "Some team members found the AI software difficult to learn initially"
      ],
      correct: 0,
      explanation:
        "Selection bias: the AI teams were already high-performers. The 22% speed advantage might reflect pre-existing team quality, not the software. B undermines the causal claim by revealing that the groups weren't comparable from the start.",
      type: "weaken",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "A survey of 3,000 adults found that those who reported reading fiction regularly scored significantly higher on tests of empathy and social perception than non-fiction readers or non-readers. However, the survey also found that individuals who scored higher on baseline empathy measures were significantly more likely to choose fiction as their preferred reading material. Taken together, these findings suggest that ______",
      stem: "Which choice most logically completes the text?",
      choices: [
        "reading fiction is the most effective way to develop empathy",
        "non-fiction reading has no cognitive benefits",
        "empathetic people are better readers than non-empathetic people",
        "the relationship between fiction reading and empathy may be bidirectional \u2014 fiction may enhance empathy, but empathetic individuals may also be drawn to fiction, making it difficult to establish a clear causal direction"
      ],
      correct: 3,
      explanation:
        "Finding 1: fiction readers \u2192 higher empathy. Finding 2: high-empathy people \u2192 choose fiction. This is a classic reverse causation scenario \u2014 the arrow could go either way. B captures this bidirectional possibility appropriately.",
      type: "completion",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "Ecologist Dr. Rivera found that forests managed by indigenous communities in the Amazon showed 35% greater biodiversity than adjacent government-managed conservation areas. Dr. Rivera argues that indigenous management practices, particularly controlled burning and selective harvesting, actively promote biodiversity rather than merely preserving it.",
      stem: "Which finding, if true, would most strengthen Dr. Rivera's argument?",
      choices: [
        "Government conservation areas receive more funding than indigenous territories",
        "Indigenous communities have managed these forests for hundreds of years",
        "Satellite imagery confirmed that the indigenous-managed forests had a more heterogeneous canopy structure \u2014 varying tree heights, gaps, and clearings \u2014 that creates diverse microhabitats, and this structural diversity directly correlated with species counts",
        "Some indigenous communities have expressed interest in eco-tourism"
      ],
      correct: 2,
      explanation:
        "Rivera claims indigenous practices ACTIVELY promote biodiversity. B provides the mechanism: their management creates structural diversity (varying heights, gaps) that creates diverse habitats, which directly correlates with species counts. This connects specific practices to specific biodiversity outcomes.",
      type: "strengthen",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "A study found that students who participated in a school garden program showed improved science test scores compared to students who did not participate. The school district concluded that hands-on gardening experience improved scientific understanding.",
      stem: "Which finding, if true, would most weaken the district's conclusion?",
      choices: [
        "Students enjoyed participating in the garden program",
        "The garden program included both indoor and outdoor activities",
        "Science test scores have been rising nationally over the past decade",
        "The garden program was implemented in schools with the most experienced science teachers, who had volunteered to lead the program, while non-participating schools had higher teacher turnover rates"
      ],
      correct: 3,
      explanation:
        "The district credits gardens for score improvement. A reveals a confound: garden schools had the BEST teachers (experienced volunteers), while non-garden schools had high turnover. The score difference could be due to teacher quality, not gardening. The self-selection of enthusiastic experienced teachers is the real variable.",
      type: "weaken",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "The diplomat\u2019s speech was carefully ______: every phrase was calibrated to acknowledge the concerns of both parties without committing to a specific policy position.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["transparent", "decisive", "equivocal", "inflammatory"],
      correct: 2,
      explanation:
        "\u2018Acknowledge both sides without committing\u2019 = deliberately vague. \u2018Equivocal\u2019 means open to multiple interpretations, deliberately ambiguous.",
      type: "vocabulary",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "Neuroscientists compared brain scans of professional musicians and non-musicians. Musicians showed significantly larger volume in the auditory cortex, motor cortex, and corpus callosum compared to matched controls. Critically, the differences were proportional to the age at which musicians began training: those who started before age seven showed the largest structural differences, while those who started after age twelve showed differences barely distinguishable from non-musicians. These findings suggest that ______",
      stem: "Which choice most logically completes the text?",
      choices: [
        "musical training has no effect on brain structure after age twelve",
        "all children should begin musical training before age seven",
        "the brain's structural response to musical training is strongest during early developmental periods, indicating a critical window during which the brain is most responsive to this type of intensive practice",
        "professional musicians are born with larger brains than non-musicians"
      ],
      correct: 2,
      explanation:
        "Largest differences = earliest training. Smallest = latest training. Proportional relationship suggests a developmental window where the brain responds most. B captures this: critical period + responsiveness. C (born with) is contradicted by the training-age correlation. D is a recommendation the data doesn't make.",
      type: "completion",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "Climate scientist Dr. Tanaka proposes that the dramatic greening of the Sahara approximately 11,000 years ago was triggered by subtle changes in Earth's orbital parameters that increased summer solar radiation in the Northern Hemisphere. Critics argue that orbital changes alone were too gradual to explain the rapid ecological transformation observed in the geological record.",
      stem: "Which finding, if true, would most strengthen Dr. Tanaka's proposal against the critics?",
      choices: [
        "Other regions of Africa did not experience greening during the same period",
        "Dr. Tanaka has studied the Sahara for over twenty years",
        "Climate modeling shows that even small increases in monsoon rainfall can trigger a positive feedback loop: more vegetation \u2192 more moisture retention \u2192 more rainfall \u2192 more vegetation \u2014 meaning a gradual orbital trigger could produce a rapid ecological response through amplification",
        "The Sahara region was dry for millions of years before the greening event"
      ],
      correct: 2,
      explanation:
        "The critics say orbital changes are too gradual for rapid greening. B provides the missing mechanism: a positive feedback loop can AMPLIFY a gradual trigger into a rapid response. This directly answers how slow orbital change \u2192 fast ecological transformation.",
      type: "strengthen",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "A national report found that counties with higher rates of gun ownership had lower rates of burglary. Gun-rights advocates cited this as evidence that gun ownership deters property crime.",
      stem: "Which finding, if true, would most weaken the advocates' argument?",
      choices: [
        "Burglary rates have been declining nationwide over the past two decades",
        "Counties with higher gun ownership were predominantly rural with low population density and fewer valuable targets per square mile, while low-ownership counties were predominantly urban \u2014 suggesting that population density and urbanization, not gun ownership, account for the burglary rate differences",
        "Some counties had both high gun ownership and high burglary rates",
        "Gun ownership rates vary significantly across the United States"
      ],
      correct: 1,
      explanation:
        "The argument claims gun ownership \u2192 less burglary. B identifies a massive confounding variable: rural vs. urban. Rural areas naturally have both more guns AND less burglary (fewer targets, less density). The correlation might be entirely driven by rural/urban differences rather than any deterrent effect.",
      type: "weaken",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "Researchers studying language acquisition found that children raised in bilingual households reached vocabulary milestones in each individual language approximately 3-4 months later than monolingual peers. However, when the bilingual children's TOTAL vocabulary across both languages was measured, it consistently exceeded the monolingual children's single-language vocabulary by 10-15%. Furthermore, by age five, the bilingual children had caught up to monolingual peers in each individual language while maintaining their combined vocabulary advantage. These findings suggest that ______",
      stem: "Which choice most logically completes the text?",
      choices: [
        "parents should avoid raising children in bilingual households",
        "monolingual children have superior language abilities",
        "bilingual children are linguistically disadvantaged compared to monolingual peers",
        "the initial per-language delay in bilingual children reflects the cognitive challenge of managing two linguistic systems simultaneously, not a deficit, since their total linguistic knowledge exceeds that of monolingual children and the delay is temporary"
      ],
      correct: 3,
      explanation:
        "Per-language: slight delay. Total vocabulary: EXCEEDS monolingual. By age 5: caught up in each AND maintained total advantage. The delay is temporary and the overall capacity is greater. B captures all three findings and the logical conclusion that it's a challenge, not a deficit.",
      type: "completion",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "Text:\nOrnithologist Dr. Park's decade-long study found that migratory songbird populations in the eastern United States declined by an average of 29% between 2013 and 2023. Dr. Park identified habitat loss at wintering grounds in Central America as the primary driver, noting that 40% of the forest area used by these species for overwintering had been converted to agriculture during the same period.\n\nHowever, Dr. Park also found that bird populations in the western United States declined by only 8% during the same period, despite western species wintering in the same Central American regions affected by deforestation. Dr. Park noted that western migratory routes pass through fewer urban areas and agricultural zones than eastern routes.",
      stem: "Taken together, what do these findings most strongly suggest?",
      choices: [
        "Central American deforestation is not a significant factor in songbird decline",
        "Western bird species are more resilient to habitat loss than eastern species",
        "Urban development should be halted along all migratory routes",
        "While wintering ground habitat loss contributes to decline, conditions along the migration route itself \u2014 particularly exposure to urban and agricultural areas \u2014 appear to be an important additional factor explaining the disparity between eastern and western population trends"
      ],
      correct: 3,
      explanation:
        "Both east and west use the same wintering grounds, but east declined much more (29% vs 8%). The KEY difference: eastern routes pass through more urban/agricultural areas. SYNTHESIS: wintering habitat loss affects both, but route conditions explain the gap. B combines both findings correctly.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
  ],

  /* ──────── CHALLENGE ──────── */
  challenge: [
    {
      passage:
        "Researchers studying coral bleaching events hypothesized that corals in warmer equatorial waters would show greater heat tolerance than temperate corals, since long-term exposure to higher temperatures should select for heat-resistant genotypes.",
      stem: "Which finding would most strengthen this hypothesis?",
      choices: [
        "Some coral species are found in both equatorial and temperate waters",
        "When equatorial and temperate corals of the same species were exposed to identical heat stress in a lab, equatorial corals retained their symbiotic algae 40% longer \u2014 and genetic analysis revealed they carried three heat-shock protein variants absent in their temperate counterparts",
        "Coral bleaching has increased in frequency over the past 30 years",
        "Marine biologists have difficulty measuring water temperature precisely"
      ],
      correct: 1,
      explanation:
        "The hypothesis predicts equatorial corals are more heat-tolerant due to genetic adaptation. B directly demonstrates both the functional advantage (40% longer algae retention) AND the genetic mechanism (heat-shock protein variants), providing the strongest possible support.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "A tech company reported that employees who used their new AI writing assistant produced 35% more documents per week than those who didn't. The company concluded that AI tools significantly boost workplace productivity.",
      stem: "Which finding would most weaken this conclusion?",
      choices: [
        "The AI tool was expensive to develop",
        "Other companies have also developed AI writing tools",
        "Some employees preferred to write without AI assistance",
        "The employees who chose to use the AI tool were already the company's highest-output workers before the tool was introduced, and their productivity had been trending upward for months prior to its release"
      ],
      correct: 3,
      explanation:
        "The conclusion assumes the AI tool CAUSED the productivity increase. B reveals a fatal selection bias: high-output workers self-selected into using the tool, and they were already trending upward. The 35% difference likely reflects pre-existing differences, not the tool's effect.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "Archaeologists discovered that ancient Polynesian navigators could voyage thousands of miles across open ocean without instruments. Scholars proposed they used a mental model called a \u2018star compass\u2019 \u2014 memorizing the rising and setting positions of over 200 stars to maintain directional awareness.",
      stem: "Which finding would most strengthen this proposal?",
      choices: [
        "Ancient Polynesians built large ocean-going canoes",
        "Some stars are brighter than others in the Southern Hemisphere",
        "Ancient Polynesian pottery has been found on distant islands",
        "Modern navigators from the Carolinian Islands, trained in the same oral tradition, successfully sailed 2,500 miles from Hawaii to Tahiti using only star positions, wave patterns, and bird flight paths \u2014 arriving within 15 miles of their target without any instruments"
      ],
      correct: 3,
      explanation:
        "The proposal claims star-compass navigation works for long-distance voyaging. B provides direct empirical proof: practitioners of the same tradition achieved a 2,500-mile voyage with remarkable precision. This eliminates the objection that such navigation is theoretically impossible.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "A study of 500 schools found that those with later start times (8:30 AM or later) had 15% higher average test scores than those starting before 8:00 AM. Researchers concluded that later start times improve academic performance by allowing adolescents more sleep.",
      stem: "Which finding would most weaken this conclusion?",
      choices: [
        "Districts that shifted to later start times were predominantly affluent communities that simultaneously increased per-pupil spending by an average of $2,400 and hired additional support staff \u2014 while early-start districts were primarily underfunded rural schools with declining budgets",
        "Adolescents need 8-10 hours of sleep per night",
        "The study used standardized test scores as its measure",
        "Some students at early-start schools reported feeling tired"
      ],
      correct: 0,
      explanation:
        "The conclusion assumes later start times caused the score difference via better sleep. B reveals a devastating confounding variable: the late-start districts were wealthier, spent more per pupil, and had more staff. The 15% difference could be explained by funding, not sleep.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "While machine learning models have achieved superhuman performance on specific, well-defined tasks like chess and image classification, they consistently struggle with tasks requiring common-sense reasoning about everyday physical interactions \u2014 such as predicting that a ball will roll off a tilted table or that water will spill from an inverted cup. This discrepancy suggests that ________.",
      stem: "Which choice most logically completes the text?",
      choices: [
        "Machine learning will eventually surpass human intelligence in all domains",
        "Chess is an easier game than most people realize",
        "Pattern recognition in structured domains requires fundamentally different cognitive mechanisms than intuitive physical reasoning, which likely depends on embodied experience that current AI architectures cannot replicate through data alone",
        "Researchers should abandon machine learning research"
      ],
      correct: 2,
      explanation:
        "The passage describes a specific gap: good at structured pattern recognition, bad at physical common sense. B precisely addresses this gap \u2014 identifying the distinction (different cognitive mechanisms) and the likely cause (embodied experience). A is too extreme, C is absurd, D is irrelevant.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
    {
      passage:
        "Notes on the development of synthetic biology:\n\u2022 Researchers at the J. Craig Venter Institute created the first self-replicating synthetic cell (Mycoplasma mycoides JCVI-syn1.0) in 2010\n\u2022 The minimal genome project later reduced this to 473 genes \u2014 the smallest known genome capable of independent growth\n\u2022 Applications include engineered bacteria that produce biofuels, pharmaceuticals, and biodegradable plastics\n\u2022 Critics raise concerns about biosecurity and ecological risks of releasing synthetic organisms",
      stem: "A science writer wants to highlight the tension between synthetic biology's practical promise and its ethical challenges. Which choice most effectively achieves this goal?",
      choices: [
        "Synthetic biology is a field that involves creating artificial organisms, and some people are concerned about it.",
        "The minimal genome project showed that only 473 genes are needed for independent cell growth.",
        "While synthetic biology has advanced from creating the first self-replicating synthetic cell to engineering bacteria that produce biofuels and medicines, the prospect of releasing organisms with artificial genomes into ecosystems has intensified debates over biosecurity and the boundaries of human intervention in nature.",
        "The J. Craig Venter Institute created the first synthetic cell in 2010, which was an important scientific achievement."
      ],
      correct: 2,
      explanation:
        "The goal requires BOTH practical promise AND ethical tension. B delivers both: it names concrete applications (biofuels, medicines) showing promise, then pivots to the ethical concern (releasing artificial genomes, biosecurity debates). A/D are factual but miss the tension. C is too vague.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "quantitative_evidence",
    },
  ],

  takeaways: [
    "Identify the GAP in every argument — the hidden assumption between evidence and conclusion.",
    "To strengthen an argument: confirm the assumption or eliminate alternative explanations.",
    "To weaken an argument: introduce alternative explanations or attack the hidden assumption.",
    "For completion questions, the most moderate and well-supported conclusion is almost always correct.",
    "Logical reasoning is the hardest skill on the SAT — once you see the gap, strengthen and weaken questions become much clearer.",
  ],
};
