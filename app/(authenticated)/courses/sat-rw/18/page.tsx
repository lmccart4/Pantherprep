"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import { GrowthTracker } from "@/components/course/activities/growth-tracker";
import {
  ConventionsReview,
  VocabReview,
  InfoReview,
  ExpressionReview,
  TestDayChecklist,
} from "./lesson-visuals";

export default function SATRWModule18() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "conventions-review-visual": <ConventionsReview />,
        "vocab-review-visual": <VocabReview />,
        "info-review-visual": <InfoReview />,
        "expression-review-visual": <ExpressionReview />,
        "test-day-visual": <TestDayChecklist />,
      }}
      activities={{
        "error-analysis": (goNext: () => void) => (
          <ErrorAnalysisWorksheet
            domains={["Craft & Structure", "Information & Ideas", "Standard English Conventions", "Expression of Ideas"]}
            testLabel="SAT Reading & Writing"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "growth-tracker": (goNext: () => void) => (
          <GrowthTracker
            testType="sat"
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

/* ═══════════════════════════════════════════════════════
 * MODULE 18 — Practice Test & Error Analysis (LAST MODULE)
 * ═══════════════════════════════════════════════════════ */

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 18,
  title: "Practice Test & Error Analysis",
  subtitle: "Full-length R&W section with deep review",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Review", icon: "book" },
    { id: "quiz", label: "Diagnostic", icon: "target" },
    { id: "error-analysis", label: "Error Analysis", icon: "clipboard" },
    { id: "growth-tracker", label: "Growth Tracker", icon: "chart" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS (Comprehensive Review) ──────── */
  lessons: [
    {
      id: "conventions-review",
      title: "Standard English Conventions",
      subtitle: "Unit 1 \u00b7 Modules 1-4",
      body: [
        "Subject-verb agreement: Find the TRUE subject, ignore parentheticals",
        "Comma rules: FANBOYS after comma, semicolons between independent clauses",
        "Restrictive vs. nonrestrictive: \"that\" = essential, \"which\" = extra info (commas)",
        "Pronoun clarity: Each pronoun must have ONE clear antecedent",
        "Modifier placement: Modifiers must be next to what they modify",
        "Apostrophes: Possession (dog's) vs. plurals (dogs) vs. it's/its",
      ],
      visual: "conventions-review-visual",
    },
    {
      id: "vocabulary-review",
      title: "Vocabulary & Craft",
      subtitle: "Unit 2 \u00b7 Modules 5-8",
      body: [
        "Words in context: Tone + context clues + secondary meanings",
        "Precision: Scope, intensity, and domain must match exactly",
        "Text structure: Ask what the author is DOING, not just saying",
        "Purpose: Identify the goal \u2014 argue, inform, compare, qualify",
        "Function: What JOB does the sentence/paragraph serve?",
        "Cross-text: Summarize each text independently before comparing",
      ],
      visual: "vocab-review-visual",
    },
    {
      id: "info-ideas-review",
      title: "Information & Ideas",
      subtitle: "Unit 3 \u00b7 Modules 9-12",
      body: [
        "Central idea: One-sentence summary BEFORE looking at choices",
        "Detail: Go back to the passage. Find the EXACT sentence",
        "Inference: Smallest logical leap from stated evidence",
        "Textual evidence: SUPPORTS the claim, not just RELATES to the topic",
        "Data: Read labels first, identify trends, then match to claim",
        "Strengthen/Weaken: Find the hidden assumption, then confirm or attack it",
        "Completion: Choose the most moderate, well-supported conclusion",
        "Correlation does NOT equal causation \u2014 the SAT's favorite trap",
      ],
      visual: "info-review-visual",
    },
    {
      id: "expression-review",
      title: "Expression & Strategy",
      subtitle: "Unit 4 \u00b7 Modules 13-15",
      body: [
        "Synthesis: Read the GOAL first, identify relevant notes, match to purpose",
        "Transitions: Cover the word, read both sentences, identify the relationship",
        "Expression: Match revision to the EXACT stated objective",
        "Concision: Shortest version that preserves all essential information",
        "71-second budget: Bank time from easy Qs for hard ones",
        "Flag and move after 90 seconds \u2014 every Q is worth the same points",
        "Never leave a question blank \u2014 no penalty for guessing",
      ],
      visual: "expression-review-visual",
    },
  ],

  /* ──────── QUIZ (Final Diagnostic \u2014 15 Questions) ──────── */
  quiz: [
    /* ── CONVENTIONS (3) ── */
    {
      passage:
        "The researchers, who had been studying the migration patterns of Arctic terns for over a decade, ______ that the birds' routes had shifted significantly northward in response to changing ocean temperatures.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["discovered", "has discovered", "discovering", "discovers"],
      correct: 0,
      explanation:
        "Subject: \"researchers\" (plural). Past context (\"had been studying\" + \"had shifted\"). Plural + past = \"discovered.\"",
      type: "conventions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The city's newest park, designed by landscape architect Maya Lin ______ features a series of earthen mounds that visitors can climb for panoramic views of the downtown skyline.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "\u2014 who also designed the Vietnam Veterans Memorial,",
        "\u2014who also designed the Vietnam Veterans Memorial\u2014",
        "who also designed the Vietnam Veterans Memorial",
        "who also designed the Vietnam Veterans Memorial,"
      ],
      correct: 1,
      explanation:
        "The clause about the Vietnam Memorial is a nonrestrictive parenthetical. It can be set off with dashes (em dashes on both sides). A correctly uses paired em dashes to enclose the aside.",
      type: "conventions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Neither the intense heat of the Sahara ______ the subzero temperatures of Antarctica have prevented extremophile bacteria from establishing thriving colonies in conditions once thought incompatible with life.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["and", "but", "or", "nor"],
      correct: 3,
      explanation:
        "\"Neither...nor\" is a correlative conjunction pair. \"Neither A nor B\" is the standard construction. \"Or\" pairs with \"either,\" not \"neither.\"",
      type: "conventions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── VOCABULARY & CRAFT (3) ── */
    {
      passage:
        "The scientist's findings were ______: rather than confirming the existing model as expected, her data revealed an entirely different mechanism at work, one that required a fundamental reconceptualization of the process.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["revelatory", "inconsequential", "predictable", "redundant"],
      correct: 0,
      explanation:
        "\"Entirely different mechanism\" + \"fundamental reconceptualization\" = eye-opening, transformative discovery. \"Revelatory\" means revealing something previously unknown and significant.",
      type: "vocabulary",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Text 1:\nHistorian Dr. Walsh argues that the printing press was the single most transformative invention in human history, enabling the rapid dissemination of knowledge that fueled the Renaissance, the Reformation, and the Scientific Revolution.\n\nText 2:\nDr. Patel counters that the printing press merely accelerated trends already underway. Manuscript culture was already spreading literacy among the merchant class, universities were already challenging Church authority, and scientific inquiry was already emerging in the Islamic world centuries before Gutenberg.",
      stem: "Based on the texts, how would Dr. Patel most likely respond to Dr. Walsh's claim?",
      choices: [
        "By suggesting that Islamic science was more important than European science",
        "By agreeing that the printing press was uniquely transformative",
        "By claiming that the printing press had no effect on European history",
        "By arguing that the printing press was an important accelerant of existing trends rather than the singular cause of intellectual transformation Walsh describes"
      ],
      correct: 3,
      explanation:
        "Patel doesn't deny the press's importance (\"merely accelerated\") but challenges \"single most transformative\" \u2014 the trends were ALREADY underway. B captures this nuance: accelerant, not singular cause.",
      type: "crosstext",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A recent study of smartphone usage among teenagers found that those who spent more than four hours daily on social media reported significantly higher rates of anxiety and sleep disruption. The researchers noted, however, that the study could not determine whether social media use caused these outcomes or whether teenagers already experiencing anxiety and sleep problems were simply more likely to turn to their phones for comfort and distraction.",
      stem: "Which choice best describes the function of the second sentence?",
      choices: [
        "It introduces a completely new topic",
        "It introduces a directional ambiguity \u2014 the data shows an association but cannot establish which variable is the cause and which is the effect",
        "It provides additional evidence supporting the first sentence's findings",
        "It contradicts the findings of the first sentence"
      ],
      correct: 1,
      explanation:
        "Sentence 1: correlation found. Sentence 2: can't determine direction \u2014 does social media CAUSE anxiety, or does anxiety CAUSE social media use? This is the reverse causation problem. B captures the directional ambiguity.",
      type: "function",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── INFORMATION & IDEAS (5) ── */
    {
      passage:
        "Economists studying the 'resource curse' have found that countries rich in natural resources like oil and minerals often experience slower economic growth, more corruption, and less democratic governance than resource-poor countries. The proposed explanation: resource wealth concentrates power in the hands of those who control extraction, reduces incentives for economic diversification, and funds patronage networks that undermine democratic accountability.",
      stem: "Which choice best states the main idea of the text?",
      choices: [
        "Mining is harmful to the environment",
        "Economists cannot agree on the effects of natural resources",
        "Natural resource wealth paradoxically often hinders rather than helps economic and political development, due to the concentration of power and reduced incentives for diversification",
        "All resource-rich countries are corrupt and undemocratic"
      ],
      correct: 2,
      explanation:
        "The passage describes the paradox (resource-rich BUT slower growth/more corruption) and explains why (power concentration, reduced diversification, patronage). B captures both the paradox and the mechanism.",
      type: "central",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A city tested four interventions to reduce speeding on residential streets.\n\n| Intervention | Cost | Speed reduction | Resident approval | Accidents (change) |\n| Speed bumps | $12,000 | 31% | 43% | -52% |\n| Radar speed signs | $8,500 | 14% | 89% | -18% |\n| Narrowed lanes | $45,000 | 27% | 34% | -44% |\n| Public art installations | $22,000 | 19% | 92% | -24% |\n\nA city council member argues that radar speed signs offer the best overall value.",
      stem: "Does the data support this claim?",
      choices: [
        "The data partially supports this claim: radar signs have the lowest cost ($8,500) and highest approval (89%), but they also have the smallest speed reduction (14%) and accident reduction (-18%), suggesting they are the most popular and affordable option but not the most effective at improving safety",
        "Yes, because radar signs are the cheapest option",
        "Yes, because resident approval is the only factor that matters",
        "No, because speed bumps are clearly superior in every way"
      ],
      correct: 0,
      explanation:
        "Radar signs: cheapest + most popular BUT least effective at speed/accident reduction. B accurately captures the trade-off \u2014 best value depends on whether you prioritize cost/popularity or safety outcomes.",
      type: "data",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Neuroscientist Dr. Rivera proposes that chronic sleep deprivation impairs the brain's glymphatic system \u2014 a waste-clearance mechanism that operates primarily during deep sleep \u2014 allowing toxic proteins associated with Alzheimer's disease to accumulate.",
      stem: "Which finding, if true, would most strengthen Dr. Rivera's proposal?",
      choices: [
        "Some people can function well on six hours of sleep",
        "Many people report feeling tired during the day",
        "Brain imaging studies show that individuals with documented histories of chronic sleep deprivation have significantly higher concentrations of beta-amyloid plaques \u2014 a protein linked to Alzheimer's \u2014 compared to age-matched controls with normal sleep patterns, and the accumulation is proportional to the severity and duration of sleep loss",
        "Alzheimer's disease affects millions of people worldwide"
      ],
      correct: 2,
      explanation:
        "The proposal: sleep deprivation \u2192 impaired waste clearance \u2192 toxic protein accumulation \u2192 Alzheimer's risk. B provides direct evidence of the proposed mechanism: sleep-deprived people have MORE toxic proteins, proportional to sleep loss severity. This is exactly what the glymphatic theory predicts.",
      type: "strengthen",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "In 1983, an Australian physician named Barry Marshall was so frustrated by his colleagues' refusal to believe that stomach ulcers were caused by bacteria rather than stress that he deliberately drank a petri dish of Helicobacter pylori. He developed severe gastritis within days, then cured himself with antibiotics \u2014 proving his theory and eventually winning the Nobel Prize in 2005. Before Marshall's self-experiment, ulcer patients had been told for decades to reduce stress and avoid spicy food, treatments that managed symptoms but never addressed the actual cause.",
      stem: "Which inference is best supported by the text?",
      choices: [
        "Stress has no effect on the human body",
        "All stomach problems are caused by bacteria",
        "Barry Marshall was irresponsible for experimenting on himself",
        "Established medical consensus can persist for decades even when wrong, and challenging it may require evidence so dramatic that it cannot be ignored or explained away"
      ],
      correct: 3,
      explanation:
        "Decades of wrong treatment (stress/diet) despite the bacterial cause. Marshall needed to DRINK bacteria and cure himself to convince colleagues. B captures the broader principle: entrenched consensus resists challenge and may require extreme evidence to overturn.",
      type: "inference",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A wildlife conservation study compared two approaches to protecting endangered species in three national parks.\n\n| Approach | Park | Species recovered | Cost (5 years) | Habitat restored (hectares) |\n| Single-species focus | Yellowstone | 3 of 8 targeted | $12M | 4,200 |\n| Single-species focus | Everglades | 2 of 6 targeted | $9M | 2,800 |\n| Ecosystem restoration | Olympic | 11 of 14 at-risk | $8M | 15,600 |",
      stem: "Which conclusion is best supported by the data?",
      choices: [
        "The ecosystem restoration approach recovered a larger proportion of at-risk species (79%) at lower cost per species and restored significantly more habitat than the single-species approach (33-38% recovery), suggesting that restoring entire ecosystems may be more efficient than targeting individual species",
        "Yellowstone is a better managed park than the Everglades",
        "Single-species conservation never works",
        "All conservation approaches are equally effective"
      ],
      correct: 0,
      explanation:
        "Single-species: 3/8=38% and 2/6=33% recovery at $12M and $9M. Ecosystem: 11/14=79% at $8M with 15,600 hectares restored (vs. 2,800-4,200). B accurately synthesizes: higher recovery rate, lower cost, more habitat restored.",
      type: "data",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── EXPRESSION & STRATEGY (4) ── */
    {
      passage:
        "Notes:\n\u2022 The Voyager Golden Record contains 115 images, greetings in 55 languages, and 90 minutes of music.\n\u2022 It was launched into space aboard Voyager 1 and 2 in 1977.\n\u2022 The record was designed by a team led by astronomer Carl Sagan.\n\u2022 Its intended audience is any extraterrestrial civilization that might find the spacecraft.\n\u2022 The record includes Chuck Berry's 'Johnny B. Goode,' a Beethoven string quartet, and traditional music from cultures around the world.\n\nThe writer wants to emphasize the record as an act of optimistic communication across cosmic distances.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "The Voyager Golden Record was launched aboard Voyager 1 and 2 and is intended for extraterrestrial civilizations.",
        "Carl Sagan led the team that designed the Voyager Golden Record, which includes Chuck Berry and Beethoven among its musical selections.",
        "In 1977, Carl Sagan's team launched humanity's most ambitious message in a bottle \u2014 the Voyager Golden Record, carrying greetings in 55 languages, Beethoven quartets, and Chuck Berry alongside music from cultures spanning the globe, all addressed to an unknown audience among the stars and traveling outward with no guarantee it would ever be found.",
        "The Voyager Golden Record, launched in 1977, contains 115 images and music from around the world."
      ],
      correct: 2,
      explanation:
        "Goal: OPTIMISTIC COMMUNICATION across COSMIC DISTANCES. C uses \"message in a bottle\" metaphor, the diversity of content (55 languages, Beethoven, Chuck Berry, global cultures), the cosmic audience (\"among the stars\"), and the optimism (\"no guarantee\" yet sent anyway). This captures hope projected into the void.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The 14th-century Black Death killed an estimated one-third of Europe's population, devastating economies and social structures across the continent.\n\n______, the massive labor shortage that resulted gave surviving peasants unprecedented bargaining power, leading to higher wages, the decline of serfdom, and social mobility that would have been unthinkable before the plague.",
      stem: "Which transition most logically connects these sentences?",
      choices: [
        "Furthermore",
        "Similarly",
        "In an unexpected historical irony",
        "As a result of improved healthcare"
      ],
      correct: 2,
      explanation:
        "Sentence 1: devastating catastrophe. Sentence 2: beneficial consequences for survivors. A catastrophe producing positive outcomes is an irony. \"In an unexpected historical irony\" captures the paradoxical relationship between mass death and improved conditions for survivors.",
      type: "transition",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The teacher helped her students learn.\n\nThe writer wants to convey the transformative, lasting impact of the teacher on her students' lives.",
      stem: "Which revision most effectively accomplishes this goal?",
      choices: [
        "The teacher won several awards for her teaching methods and curriculum design.",
        "The teacher was effective in helping students with their studies.",
        "Students reported that the teacher was helpful and knowledgeable.",
        "Twenty years later, her former students still describe Ms. Okafor as the person who taught them not just calculus but how to believe they were capable of understanding anything \u2014 a conviction that carried them through college, careers, and challenges she never witnessed but made possible."
      ],
      correct: 3,
      explanation:
        "Goal: TRANSFORMATIVE, LASTING impact. C provides time depth (20 years), specific subject (calculus), broader lesson (believing in capability), and long-term consequences (college, careers, challenges). \"Made possible\" connects the teacher to outcomes decades later.",
      type: "expression",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The startup's initial product failed spectacularly, losing $3 million in its first year and prompting half the engineering team to resign.\n\n______, the lessons learned from that failure directly informed the design of the company's second product, which generated $50 million in revenue within eighteen months and established the company as an industry leader.",
      stem: "Which transition most logically connects these sentences?",
      choices: [
        "In addition",
        "Predictably",
        "As feared",
        "Crucially, however"
      ],
      correct: 3,
      explanation:
        "Sentence 1: spectacular failure. Sentence 2: failure's lessons led to massive success. \"Crucially, however\" signals both the reversal (however) and the importance of the connection (crucially) \u2014 the failure wasn't just overcome, it was essential to the success.",
      type: "transition",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  takeaways: [
    "Get 8+ hours of sleep the night before — your second night of good sleep matters most.",
    "Accuracy over speed in Module 1 — it determines your Module 2 difficulty and score ceiling.",
    "Budget ~71 seconds per question, bank time from easy ones, flag and move after 90 seconds on hard questions.",
    "Answer every question — there is no penalty for guessing.",
    "If Module 2 is harder, that is a positive sign of strong Module 1 performance — each correct answer is worth more.",
    "Trust your preparation, stay calm, and apply the strategies you have learned across all 18 modules.",
  ],
};
