"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import {
  FormatVisual,
  PacingChartVisual,
  EliminationVisual,
  StrategyGridVisual,
  ScoreTargetsVisual,
} from "./lesson-visuals";

export default function SATRWModule14() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "format-visual": <FormatVisual />,
        "pacing-chart": <PacingChartVisual />,
        "elimination-visual": <EliminationVisual />,
        "strategy-grid": <StrategyGridVisual />,
        "score-targets": <ScoreTargetsVisual />,
      }}
      nextModuleHref="/courses/sat-rw/15"
      nextModuleLabel="Module 15: Form, Structure & Sense"
    />
  );
}

/* ═══════════════════════════════════════════════════════
 * MODULE 14 — Rhetorical Synthesis
 * ═══════════════════════════════════════════════════════ */

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 14,
  title: "Rhetorical Synthesis",
  subtitle: "Combining information from notes effectively",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "challenge", label: "Challenge", icon: "trophy" },
    { id: "complete", label: "Complete", icon: "complete" },
  ],

  /* ──────── WARM-UP (Prior-module retrieval) ──────── */
  warmup: [
    {
      source: "Module 13 — Transitions",
      stem: "The city\u2019s new public transit system has reduced average commute times by 25% since its launch last year. ______, ridership has exceeded projections by 40%, suggesting strong public demand for reliable mass transit options.\n\nWhich transition most logically connects these sentences?",
      choices: ["For instance", "Despite this", "By contrast", "Furthermore"],
      correct: 3,
      explanation:
        "Both sentences present positive outcomes (shorter commutes + high ridership). Addition relationship. \u2018Furthermore\u2019 adds a second supporting point.",
    },
    {
      source: "Module 11 — Weaken",
      stem: "A school district implemented a later start time for high schools (shifting from 7:30 AM to 8:45 AM) and found that average student GPAs increased by 0.3 points over the following year. The district concluded that later start times improve academic performance.\n\nWhich finding would most weaken the district\u2019s conclusion?",
      choices: [
        "Some students preferred the earlier start time",
        "The district simultaneously implemented a new tutoring program, reduced class sizes, and updated its curriculum during the same year",
        "Sleep is important for cognitive function",
        "Other school districts have also considered later start times"
      ],
      correct: 1,
      explanation:
        "Confounding variables: three other changes happened simultaneously. The GPA increase could be from tutoring, smaller classes, or new curriculum \u2014 not the start time.",
    },
    {
      source: "Module 13 — Synthesis",
      stem: "Notes: The Great Pacific Garbage Patch covers an area roughly twice the size of Texas. Most of the debris consists of microplastics less than 5mm in diameter. Marine animals ingest microplastics, which enter the food chain. A 2023 study found microplastics in 90% of sampled commercial fish.\n\nA writer wants to emphasize the threat to human health through the food chain. Which choice most effectively accomplishes this goal?",
      choices: [
        "A 2023 study revealing microplastics in 90% of commercial fish demonstrates that ocean pollution directly threatens human health, as marine animals ingest microplastics that travel through the food chain to our dinner plates.",
        "The Great Pacific Garbage Patch is a massive concentration of ocean debris approximately twice the size of Texas.",
        "Most debris in the Great Pacific Garbage Patch consists of microplastics less than 5mm in diameter.",
        "Ocean currents concentrate floating debris into the Great Pacific Garbage Patch."
      ],
      correct: 0,
      explanation:
        "Goal: HUMAN HEALTH through FOOD CHAIN. B connects: fish ingest microplastics \u2192 food chain \u2192 90% of commercial fish \u2192 human consumption.",
    },
    {
      source: "Module 5 — Vocabulary",
      stem: "Despite the committee\u2019s unanimous recommendation, the CEO remained ______: she acknowledged the proposal\u2019s merits but insisted on reviewing additional data before committing to any course of action.\n\nWhich choice completes the text with the most logical and precise word?",
      choices: ["noncommittal", "dismissive", "hostile", "enthusiastic"],
      correct: 0,
      explanation:
        "\u2018Acknowledged merits BUT insisted on more data before committing\u2019 = willing to consider but not yet decided. \u2018Noncommittal\u2019 means not expressing a definite opinion or course of action.",
    },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "format",
      title: "The Digital SAT Format",
      subtitle: "Know the battlefield",
      body: [
        "The digital SAT Reading & Writing section consists of TWO modules, each 32 minutes with 27 questions. That's 64 minutes and 54 questions total.",
        "KEY FEATURE: The second module is ADAPTIVE. If you perform well on Module 1, you get a harder (but higher-scoring) Module 2. If you struggle on Module 1, you get an easier Module 2 with a lower scoring ceiling.",
        "IMPLICATION: Module 1 performance matters enormously. Getting 20+ correct in Module 1 virtually guarantees you'll see the harder Module 2, which is necessary for scores above ~650. This means: do NOT rush through Module 1. Accuracy in Module 1 is worth more than speed.",
        "Each question appears one at a time on screen. You can flag questions and return to them WITHIN the same module, but you cannot go back to Module 1 once you've started Module 2.",
      ],
      visual: "format-visual",
    },
    {
      id: "pacing",
      title: "Pacing: The 71-Second Budget",
      subtitle: "How to spend your time",
      body: [
        "32 minutes / 27 questions = approximately 71 seconds per question. But NOT every question deserves 71 seconds.",
        "FAST QUESTIONS (30-45 seconds): Conventions (grammar), simple vocabulary, straightforward transitions. You either know it or you don't \u2014 don't overthink.\n\nMEDIUM QUESTIONS (60-90 seconds): Central idea, detail, most evidence questions. Read carefully but efficiently.\n\nSLOW QUESTIONS (90-120 seconds): Inference, strengthen/weaken, data interpretation, synthesis. These reward careful analysis.",
        "TIME BANKING: By spending 30 seconds on easy questions, you bank time for hard ones. If you save 30 seconds each on 10 easy questions, that's 5 extra minutes for the 5 hardest questions.",
        "DANGER ZONE: If you have fewer than 10 minutes left and more than 8 questions remaining, you're behind. Start making faster decisions and don't leave anything blank.",
      ],
      visual: "pacing-chart",
    },
    {
      id: "triage",
      title: "Question Triage",
      subtitle: "Easy \u2192 Medium \u2192 Hard",
      body: [
        "On the digital SAT, questions within each module are roughly ordered by type (conventions first, then vocabulary, then reading comprehension) but NOT strictly by difficulty. This means easy and hard questions can appear throughout.",
        "TRIAGE STRATEGY:\n\u2022 If you immediately know the answer \u2192 answer and move on (30 seconds).\n\u2022 If you need to think \u2192 work it, but set a mental 90-second limit.\n\u2022 If you're stuck after 90 seconds \u2192 flag it, make your best guess, and come back if time permits.",
        "WHY FLAG AND MOVE: Spending 3 minutes on one hard question means 3 minutes stolen from 2-3 easier questions you haven't reached yet. The SAT gives the same points for every correct answer \u2014 a hard question is worth exactly the same as an easy one.",
        "GOLDEN RULE: Never leave a question blank. There is no penalty for wrong answers on the digital SAT. Always guess, even if you're completely unsure.",
      ],
    },
    {
      id: "elimination",
      title: "Process of Elimination",
      subtitle: "Your most powerful tool",
      body: [
        "You don't need to find the RIGHT answer \u2014 you need to eliminate the WRONG ones. On a 4-choice question, eliminating even 1 wrong answer increases your odds from 25% to 33%. Eliminating 2 gives you 50%.",
        "ELIMINATION TRIGGERS \u2014 the answer is probably wrong if it:\n\u2022 Contains absolute language (\"always,\" \"never,\" \"all,\" \"none\") when the passage uses qualified language\n\u2022 Introduces information not found in the passage\n\u2022 Is too broad or too narrow for the question asked\n\u2022 Contradicts any specific detail in the passage\n\u2022 Uses the right words from the passage but in the wrong relationship",
        "THE \"ALMOST RIGHT\" TRAP: The most dangerous wrong answer isn't the obviously wrong one \u2014 it's the one that's 90% right with one subtle flaw. This is why you must check EVERY part of each answer against the passage.",
        "STRATEGY: On hard questions, don't try to identify the right answer first. Instead, find reasons to eliminate wrong answers. The last one standing is correct.",
      ],
      visual: "elimination-visual",
    },
    {
      id: "reading-speed",
      title: "Efficient Reading",
      subtitle: "Speed without sacrificing comprehension",
      body: [
        "Digital SAT passages are SHORT \u2014 typically 75-150 words. You don't need speed-reading techniques. What you need is ACTIVE reading: reading with purpose.",
        "BEFORE READING THE PASSAGE: Glance at the question first. Knowing what you're looking for helps you read more efficiently. If the question asks about the author's main argument, you can focus on the thesis. If it asks about a specific detail, you can scan for it.",
        "WHILE READING: Note the passage's main point, any shifts or contrasts (\"however,\" \"but,\" \"although\"), and the author's tone. These three things answer 80% of reading questions.",
        "AFTER READING: Before looking at choices, try to answer the question in your own words. Then find the choice that matches. This prevents you from being influenced by attractive-but-wrong answers.",
      ],
    },
    {
      id: "type-strategy",
      title: "Question-Type Strategies",
      subtitle: "Quick reference by category",
      body: [
        "CONVENTIONS (M1-4): Look for the grammatical principle being tested. Subject-verb agreement? Comma usage? Identify the rule, apply it, move on. Don't overthink \u2014 these are usually fast.",
        "VOCABULARY (M5-6): Read the full sentence for context clues. Eliminate choices that are wrong TONE even if they're close in meaning. Check for secondary meanings of familiar words.",
        "CRAFT & STRUCTURE (M7-8): For purpose questions, ask what the author is DOING, not what they're saying. For cross-text, summarize each text before comparing.",
        "INFORMATION & IDEAS (M9-12): The answer is always in the passage. For inference, choose the smallest logical leap. For evidence, SUPPORTS \u2260 RELATES. For data, read labels first.",
        "EXPRESSION & SYNTHESIS (M13): For synthesis, read the GOAL first. For transitions, identify the relationship before looking at choices.",
      ],
      visual: "strategy-grid",
    },
    {
      id: "mental-game",
      title: "The Mental Game",
      subtitle: "Confidence, stress, and recovery",
      body: [
        "BEFORE THE TEST: Get 8+ hours of sleep the two nights before (not just the night before). Eat a protein-rich breakfast. Arrive early. The goal is zero surprises.",
        "DURING THE TEST: If you encounter a question that stumps you, don't panic. Flag it, make a guess, and move on. One hard question doesn't affect your overall score if you handle the rest well.",
        "THE CONFIDENCE TRAP: Don't spend extra time on questions you're confident about just to double-check. Your first instinct on grammar and vocabulary questions is usually right. Move on and bank that time.",
        "RECOVERY AFTER MODULE 1: You get a 10-minute break between modules. Use it. Stand up, stretch, drink water, eat a snack. Don't think about Module 1 \u2014 you can't change it. Reset mentally for Module 2.",
        "IF YOU'RE RUNNING OUT OF TIME: Answer every remaining question. Guess on any flagged questions you can't reach. Never leave blanks.",
      ],
    },
    {
      id: "score-strategy",
      title: "Score Optimization",
      subtitle: "Maximizing your score strategically",
      body: [
        "THE ADAPTIVE SCORING INSIGHT: On the digital SAT, the difficulty of Module 2 determines your score ceiling. To reach 700+, you need to trigger the hard Module 2 by performing well on Module 1.",
        "TARGET ACCURACY BY SCORE GOAL:\n\u2022 500-550: Get conventions and easy vocabulary right (~15-18 correct per module)\n\u2022 550-600: Add detail and central idea questions (~18-21 correct)\n\u2022 600-650: Add evidence and inference (~21-23 correct)\n\u2022 650-700: Add synthesis and strengthen/weaken (~23-25 correct)\n\u2022 700+: Near-perfect on Module 1, strong on hard Module 2",
        "ERROR ANALYSIS: After practice tests, categorize your mistakes:\n\u2022 Didn't know the rule/concept \u2192 Study the content (review module lessons)\n\u2022 Knew the concept but made a careless error \u2192 Slow down on that question type\n\u2022 Ran out of time \u2192 Improve pacing (speed up on easy, flag hard ones earlier)\n\u2022 Down to two choices and picked wrong \u2192 Practice elimination and re-reading",
        "THE 80/20 RULE: 80% of score improvement comes from 20% of the skills. For most students, that 20% is: conventions rules, vocabulary context clues, main idea identification, and transitions.",
      ],
      visual: "score-targets",
    },
  ],

  /* ──────── QUIZ (Timed Drill) ──────── */
  quiz: [
    {
      passage:
        "The committee of scientists, along with several government officials, ______ scheduled to present findings at next month's conference.",
      stem: "Which choice completes the text correctly?",
      choices: ["were being", "have been", "is", "are"],
      correct: 2,
      explanation:
        "Subject is \"committee\" (singular), and \"along with\" is a parenthetical \u2014 it doesn't change the subject number. Singular subject \u2192 \"is.\" A fast conventions question: identify the rule, apply, move on.",
      type: "conventions",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "Though the film received mixed reviews from critics, audiences found it deeply ______: many reported leaving the theater in tears and continuing to think about the story for days afterward.",
      stem: "Which choice completes the text with the most logical word?",
      choices: ["perplexing", "affecting", "ostentatious", "conventional"],
      correct: 1,
      explanation:
        "\"Tears\" and \"continuing to think\" = emotionally moving. \"Affecting\" means emotionally moving or touching. \"Conventional\" = ordinary, \"perplexing\" = confusing, \"ostentatious\" = showy.",
      type: "vocabulary",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "Urban ecologist Dr. Tanaka has found that cities with extensive green roof programs \u2014 where vegetation is grown on building rooftops \u2014 experience measurably lower ambient temperatures than comparable cities without such programs. In Phoenix, Arizona, neighborhoods with green roof coverage exceeding 30% recorded summer temperatures averaging 3.2 degrees Fahrenheit lower than nearby neighborhoods without green roofs, reducing both energy consumption for cooling and heat-related hospital visits.",
      stem: "Which choice best states the main idea of the text?",
      choices: [
        "Dr. Tanaka studies urban ecology in Phoenix, Arizona",
        "All cities should require green roofs on commercial buildings",
        "Phoenix, Arizona, has the hottest summers of any American city",
        "Green roof programs can meaningfully reduce urban temperatures and their associated health and energy costs"
      ],
      correct: 3,
      explanation:
        "The passage presents evidence that green roofs lower temperatures AND reduce energy/health costs. B captures both findings. A is too narrow. C overgeneralizes. D isn't stated.",
      type: "central",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The new vaccine showed 94% efficacy in clinical trials, making it one of the most effective vaccines ever developed. ______, distribution challenges in rural areas meant that many of the communities most vulnerable to the disease were the last to receive it.",
      stem: "Which transition most logically connects these sentences?",
      choices: [
        "Furthermore",
        "Similarly",
        "Despite this success",
        "As a result"
      ],
      correct: 2,
      explanation:
        "Sentence 1: great success (94% efficacy). Sentence 2: but distribution problems hurt vulnerable communities. Contrast between the success and the limitation. \"Despite this success\" acknowledges the positive then pivots to the problem.",
      type: "transition",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "Notes:\n\u2022 Greenland's ice sheet contains enough water to raise global sea levels by approximately 7.4 meters.\n\u2022 Ice loss from Greenland has accelerated sixfold since the 1990s.\n\u2022 Current models predict Greenland could lose 10-30% of its ice by 2100.\n\u2022 Greenland's ice loss contributes to approximately 25% of current global sea level rise.\n\u2022 Some glaciologists argue that models underestimate ice loss because they don't fully account for feedback loops.\n\nThe writer wants to emphasize the urgency and scale of the threat posed by Greenland's ice loss.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Greenland's ice sheet could lose 10-30% of its ice by 2100, according to current models.",
        "Greenland is located in the Arctic and its ice sheet is one of the largest in the world.",
        "Greenland's ice sheet, which contains enough water to raise sea levels by 7.4 meters, is melting \u2014 and current models may underestimate the threat.",
        "With ice loss accelerating sixfold since the 1990s and already contributing 25% of global sea level rise, Greenland's ice sheet \u2014 which holds enough water to raise oceans by 7.4 meters \u2014 represents one of the most urgent threats in climate science, particularly as some scientists warn that current models may underestimate the danger."
      ],
      correct: 3,
      explanation:
        "Goal: URGENCY and SCALE. B uses the most alarming notes (sixfold acceleration, 25% of sea level rise, 7.4m total potential, models may underestimate) in a structure that builds urgency. A uses some but not as comprehensively. C is just a projection. D introduces info not in notes.",
      type: "synthesis",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "Behavioral economist Dr. Levy argues that \"loss aversion\" \u2014 people's tendency to feel losses roughly twice as strongly as equivalent gains \u2014 explains why consumers resist switching service providers even when better options are available.",
      stem: "Which finding would most effectively support this claim?\n\nClaim: Dr. Levy argues that the psychological pain of giving up a current service outweighs the potential benefit of switching to a better one.",
      choices: [
        "Many consumers report satisfaction with their current service providers",
        "Dr. Levy has published extensively on consumer psychology",
        "Service providers frequently offer discounts to attract new customers",
        "In experiments, subjects demanded an average of $200 in savings before they would switch from their current phone plan to an objectively superior one costing $100 less \u2014 requiring twice the actual benefit before the perceived loss of the familiar plan felt justified"
      ],
      correct: 3,
      explanation:
        "The claim is about loss aversion in switching. B provides a direct demonstration: people require $200 in savings (2x the actual $100 benefit) before switching \u2014 exactly matching the \"twice as strongly\" loss aversion ratio. Specific, quantitative, and directly on-claim.",
      type: "evidence",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "A widely cited study found that students who handwrite notes retain information better than those who type notes on laptops. The researchers concluded that the physical act of handwriting engages deeper cognitive processing.",
      stem: "Which finding, if true, would most weaken this conclusion?",
      choices: [
        "The study was conducted at a single university",
        "Some students prefer typing to handwriting",
        "When laptop users were instructed to summarize rather than transcribe lectures verbatim, the retention difference between handwriting and typing disappeared \u2014 suggesting that the advantage was due to the summarization strategy forced by handwriting's slower speed, not the physical act itself",
        "Handwriting is slower than typing"
      ],
      correct: 2,
      explanation:
        "The conclusion claims the PHYSICAL ACT of handwriting is key. B shows that when typists also summarize (instead of transcribing), the advantage vanishes. This means the benefit came from summarization (which handwriting's slowness forces), not from the physical act itself.",
      type: "weaken",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "When the Dutch East India Company established its trading post in Nagasaki in 1641, Japan's Tokugawa shogunate confined all European contact to a tiny artificial island called Dejima, measuring just 120 by 75 meters. For over two hundred years, this postage-stamp-sized outpost served as Japan's sole window to Western science, medicine, and technology \u2014 with Japanese scholars, known as rangaku practitioners, painstakingly translating Dutch texts on anatomy, astronomy, and chemistry.",
      stem: "Which inference is best supported by the text?",
      choices: [
        "Japan had no scientific tradition before European contact",
        "Dejima was the largest trading post in Asia",
        "Despite extreme restrictions on foreign contact, the Tokugawa shogunate recognized enough value in Western knowledge to maintain a carefully controlled channel for intellectual exchange",
        "The Dutch East India Company controlled all trade between Asia and Europe"
      ],
      correct: 2,
      explanation:
        "Japan severely restricted contact (tiny island, one country) BUT maintained it for 200+ years and scholars translated texts. If Western knowledge had no value, they would have closed Dejima entirely. B captures this: restriction + maintenance = controlled value recognition.",
      type: "inference",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
  ],

  /* ──────── CHALLENGE ──────── */
  challenge: [
    {
      passage:
        "Economists studying the gig economy found that workers on platform-based jobs (ride-sharing, food delivery) earn an average hourly wage that appears competitive with traditional employment. However, after accounting for vehicle depreciation, fuel, insurance, self-employment taxes, and unpaid waiting time between jobs, researchers hypothesized that effective hourly compensation drops below minimum wage for the majority of gig workers.",
      stem: "Which finding would most strengthen this hypothesis?",
      choices: [
        "A comprehensive analysis of 40,000 ride-share drivers' tax returns revealed that 74% earned less than their state's minimum wage after deducting IRS-standard vehicle costs and self-employment taxes, with median effective pay of $6.20 per hour including idle time",
        "Traditional employment offers benefits like health insurance",
        "Some gig workers enjoy flexible scheduling",
        "Gig economy companies have grown rapidly in recent years"
      ],
      correct: 0,
      explanation:
        "The hypothesis claims that after costs, most gig workers earn below minimum wage. B provides comprehensive data (40,000 tax returns) showing exactly this: 74% below minimum wage, with a specific effective rate ($6.20/hr). The scale and specificity make this the strongest support.",
      type: "strengthen",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "A popular theory in education suggests that matching instruction to students' preferred 'learning styles' (visual, auditory, kinesthetic) improves academic outcomes. Many schools have invested heavily in learning-style assessments and differentiated instruction based on these categorizations.",
      stem: "Which finding would most weaken this theory?",
      choices: [
        "Learning style assessments are commercially available",
        "A meta-analysis of 29 controlled experiments found no significant difference in learning outcomes when instruction matched students' self-reported learning styles versus when it deliberately mismatched them \u2014 but did find that certain teaching methods were universally more effective regardless of student preference",
        "Students have different preferences for how they receive information",
        "Some teachers find it difficult to differentiate instruction"
      ],
      correct: 1,
      explanation:
        "The theory predicts that matching styles to instruction improves outcomes. B directly refutes this: controlled experiments show NO benefit to matching, and universal methods work better. This eliminates both the match benefit and the premise that styles matter for instruction.",
      type: "weaken",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The archaeological site at G\u00f6bekli Tepe, dating to approximately 9600 BCE, contains massive carved stone pillars arranged in circles \u2014 structures that required coordinated effort from hundreds of workers.\n\n_________, the discovery forced archaeologists to reconsider their assumption that monumental architecture only emerged after the development of agriculture and settled communities.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: [
        "Because the site predates any known farming community by at least a millennium",
        "For example",
        "Nevertheless",
        "Similarly"
      ],
      correct: 0,
      explanation:
        "Sentence 2 explains WHY the discovery was paradigm-shifting. C provides the critical missing link: the site predates farming by 1,000+ years, which is what forced the reconsideration. 'Because' introduces the causal reason. A/D don't fit logically. B implies contrast but this is cause-effect.",
      type: "transition",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "When neuroscientist Paul MacLean proposed his 'triune brain' model in the 1960s \u2014 suggesting the human brain consists of three evolutionary layers (reptilian, limbic, neocortex) stacked atop one another \u2014 it offered an elegant explanation for why emotions sometimes override rational thought. The model remains widely taught in psychology courses and popular science books. However, modern neuroimaging studies have shown that brain regions MacLean assigned to different evolutionary 'layers' are in fact densely interconnected, with the 'reptilian' brainstem participating in complex cognitive tasks and the 'rational' neocortex deeply involved in emotional processing.",
      stem: "Which inference is best supported by the text?",
      choices: [
        "Brain imaging technology is unreliable",
        "The triune brain model, while intuitively appealing, oversimplifies brain organization by suggesting a strict functional hierarchy that modern neuroscience has shown does not exist",
        "Paul MacLean was not a qualified neuroscientist",
        "Emotions are always more powerful than rational thought"
      ],
      correct: 1,
      explanation:
        "The passage says the model was 'elegant' (intuitive) but modern evidence shows regions are 'densely interconnected' across supposed layers. B captures both: the model oversimplifies by suggesting strict hierarchy that doesn't exist. A attacks the person (unsupported). C/D are unsupported.",
      type: "inference",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "Notes on the decline of the American chestnut:\n\u2022 Before 1900, an estimated 4 billion American chestnut trees dominated Eastern forests\n\u2022 A fungal blight accidentally imported on Japanese chestnut nursery stock was first detected in New York in 1904\n\u2022 By 1950, the blight had killed an estimated 3.5 billion trees\n\u2022 The American Chestnut Foundation has developed blight-resistant hybrids using backcross breeding with Chinese chestnuts, achieving trees that are 15/16 American chestnut with Chinese blight resistance\n\nA conservation writer wants to frame the American chestnut story as one of catastrophic loss followed by scientific hope.",
      stem: "Which choice most effectively achieves this goal?",
      choices: [
        "The American Chestnut Foundation has been working to develop blight-resistant trees through breeding programs.",
        "Japanese chestnut nursery stock accidentally carried a fungal blight to New York in 1904.",
        "The near-total destruction of 3.5 billion American chestnuts by an imported fungus ranks among the worst ecological disasters in North American history, yet decades of painstaking backcross breeding have now produced trees that carry the chestnut's genetic heritage with a borrowed resistance \u2014 offering the possibility that a species once given up for dead may reclaim its place in Eastern forests.",
        "The American chestnut was once a common tree in Eastern forests, but a fungal blight killed many of them."
      ],
      correct: 2,
      explanation:
        "The goal requires BOTH catastrophic loss AND scientific hope. C delivers both with scale (3.5 billion, 'worst ecological disasters') and hope ('borrowed resistance,' 'reclaim its place'). The contrast structure perfectly matches the requested framing. A is too mild. B/D cover only one half.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The diplomat's proposal was deliberately ________ \u2014 broad enough to satisfy both factions without committing either side to specific concessions, a strategic vagueness that kept negotiations alive when precision would have ended them.",
      stem: "Which choice best completes the text?",
      choices: ["meticulous", "ambiguous", "redundant", "provocative"],
      correct: 1,
      explanation:
        "'Broad enough to satisfy both factions without committing' and 'strategic vagueness' both signal deliberate imprecision. 'Ambiguous' means open to multiple interpretations, which perfectly matches intentional vagueness used diplomatically. 'Meticulous' means precise (opposite). 'Provocative' means inflammatory. 'Redundant' means repetitive.",
      type: "vocabulary",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
  ],

  takeaways: [
    "Module 1 accuracy is critical for triggering hard Module 2.",
    "Budget ~71 seconds per question — bank time from easy questions.",
    "Flag and move after 90 seconds on hard questions.",
    "Eliminate wrong answers before selecting right ones.",
    "Never leave a question blank — no penalty for guessing.",
    "Read the question before the passage for efficiency.",
    "Categorize mistakes: content, careless, time, or elimination.",
  ],
};
