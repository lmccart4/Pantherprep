"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import {
  TwoPassVisual,
  PacingVisual,
  FlaggingVisual,
} from "./lesson-visuals";

export default function NMSQTRWModule10() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "two-pass": <TwoPassVisual />,
        "pacing": <PacingVisual />,
        "flagging": <FlaggingVisual />,
      }}
      nextModuleHref="/courses/nmsqt-rw/11"
      nextModuleLabel="Module 11: Error Analysis Workshop"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "rw",
  moduleNum: 10,
  title: "Timed Practice Simulation",
  subtitle:
    "Full-section timed practice with review -- all domains, test-day pacing.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "warmup", label: "Warm-Up", icon: "brain" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  warmup: [
    {
      source: "Module 4 -- Words in Context",
      stem: "The ambassador's remarks were carefully _______ to avoid offending either party while still conveying the urgency of the situation.\n\nWhich word best completes the text?",
      choices: ["improvised", "calibrated", "exaggerated", "obscured"],
      correct: 1,
      explanation:
        '"Carefully" + "avoid offending" + "convey urgency" = precisely adjusted. "Calibrated" = carefully adjusted for a specific purpose.',
    },
    {
      source: "Module 4 -- Words in Context",
      stem: 'The once-_______ neighborhood had undergone a dramatic transformation, with luxury condominiums replacing the abandoned warehouses that had stood empty for decades.\n\nWhich word best completes the text?',
      choices: ["affluent", "prestigious", "vibrant", "desolate"],
      correct: 3,
      explanation:
        '"Abandoned warehouses, empty for decades" = the neighborhood WAS empty/bleak. "Desolate" = deserted, empty.',
    },
    {
      source: "Module 7 -- Structure",
      stem: 'The essay opens by describing the widespread belief that Thomas Edison invented the light bulb single-handedly. It then details the contributions of at least a dozen other inventors whose work Edison built upon. The essay concludes that innovation is almost always collaborative.\n\nWhich choice best describes the function of the second sentence?',
      choices: [
        "It introduces a counterargument to the essay's thesis.",
        "It provides evidence that complicates the opening claim, supporting the essay's argument for collaborative innovation.",
        "It supports the popular narrative about Edison.",
        "It summarizes the essay's conclusion."
      ],
      correct: 1,
      explanation:
        'The second sentence shows OTHER inventors\' contributions, which undermines the "single-handed" belief and supports the collaborative thesis.',
    },
    {
      source: "Module 5 -- Inferences",
      stem: "A study of 5,000 chess players found that those who began playing before age 7 achieved grandmaster status at significantly higher rates. However, early starters also reported spending twice as many hours practicing weekly. The study could not determine whether the advantage stemmed from early cognitive development or simply from accumulated practice time.\n\nBased on the text, which inference is best supported?",
      choices: [
        "The age-related advantage may reflect practice hours rather than a developmental window.",
        "Chess should be taught in preschools.",
        "Starting chess before age 7 causes superior cognitive development.",
        "Players who start after age 12 cannot achieve grandmaster status."
      ],
      correct: 0,
      explanation:
        'The advantage MIGHT be practice hours, not age. (B) captures this uncertainty.',
    },
  ],

  lessons: [
    {
      id: "two-pass",
      title: "The Two-Pass Method",
      subtitle: "Maximize your score under time pressure",
      visual: "two-pass",
      body: [
        "Pass 1 -- Quick Wins (20 min): Answer every question you're confident about. Flag anything that takes more than 90 seconds. Pass 2 -- Flagged Items (12 min): Return to flagged questions with fresh eyes.",
        "Never leave blanks. No penalty for guessing on the Digital PSAT. If you're stuck after 90 seconds, eliminate what you can, pick your best guess, flag it, and move on.",
        "Domain order on the real test: Craft & Structure -> Information & Ideas -> Standard English Conventions -> Expression of Ideas. This module follows that order.",
      ],
    },
    {
      id: "pacing",
      title: "Pacing by Question Type",
      subtitle: "Know your speed targets",
      visual: "pacing",
      body: [
        "Fast (~60s): Words in Context, Conventions, Transitions. These are pattern-recognition questions -- if you've drilled them, they should be automatic.",
        "Moderate (~80s): Central Ideas, Inferences, Structure. These require careful reading but shouldn't need re-reading if you read actively the first time.",
        "Slow (~90s): Quantitative Evidence, Cross-Text, Rhetorical Synthesis. These have more information to process. Budget extra time but stay disciplined.",
      ],
    },
    {
      id: "flag-strategy",
      title: "Strategic Flagging",
      subtitle: "Flag smart, not often",
      visual: "flagging",
      body: [
        "Flag questions where you've narrowed to 2 choices but aren't sure. Don't flag questions where you're completely lost -- just guess and move on.",
        "The best flag strategy: answer the question with your best guess BEFORE flagging. This way, even if you run out of time on Pass 2, you have an answer recorded.",
        "On Pass 2, context from other passages sometimes helps with flagged questions. Fresh eyes after a mental break can resolve uncertainty.",
      ],
    },
  ],

  quiz: [
    {
      passage:
        "The ambassador's remarks were carefully _______ to avoid offending either party while still conveying the urgency of the situation.",
      stem: "Which word best completes the text?",
      choices: ["improvised", "calibrated", "exaggerated", "obscured"],
      correct: 1,
      explanation:
        '"Carefully" + "avoid offending" + "convey urgency" = precisely adjusted. "Calibrated."',
      type: "WIC",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Although the CEO projected confidence during the press conference, insiders described the company's financial situation as _______, with quarterly losses accelerating and key investors withdrawing support.",
      stem: "Which word best completes the text?",
      choices: ["promising", "precarious", "transparent", "stable"],
      correct: 1,
      explanation:
        '"Losses accelerating, investors withdrawing" = dangerously unstable. "Precarious."',
      type: "WIC",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The biologist's hypothesis was _______ by the discovery of a fossil that exhibited characteristics of both reptiles and mammals, exactly as her evolutionary model had predicted.",
      stem: "Which word best completes the text?",
      choices: ["overlooked", "refuted", "complicated", "vindicated"],
      correct: 3,
      explanation:
        'Fossil matched predictions exactly = proved correct. "Vindicated."',
      type: "WIC",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The passage presents two competing explanations for the extinction of the woolly mammoth: climate change reducing habitat and overhunting by humans. It describes evidence for both but ultimately argues that the two factors were synergistic -- each alone was insufficient, but together they were devastating.",
      stem: "Which choice best describes the overall structure?",
      choices: [
        "It presents a problem and argues no solution exists.",
        "It describes a chronological sequence of events.",
        "It presents two alternatives, then argues they worked together rather than independently.",
        "It compares the woolly mammoth to modern endangered species."
      ],
      correct: 2,
      explanation:
        "Two explanations presented -> argued to be synergistic (combined effect). Not either/or but both.",
      type: "Structure",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        'Text 1: Sociologist Brennan argues that remote work fundamentally undermines workplace culture by eliminating the informal interactions -- hallway conversations, lunch discussions, spontaneous collaborations -- that build trust and shared identity.\n\nText 2: Sociologist Okafor counters that Brennan\'s definition of "workplace culture" is outdated, rooted in mid-20th-century office norms. Okafor argues that remote workers build equally strong cultures through digital channels, shared documentation, and asynchronous communication.',
      stem: "Based on the texts, what is the core of the disagreement?",
      choices: [
        "Whether informal interactions can occur digitally.",
        "Whether remote workers are productive.",
        'Whether "workplace culture" should be defined by in-person norms or can take new forms.',
        "Whether remote work exists."
      ],
      correct: 2,
      explanation:
        "Brennan defines culture by physical interactions. Okafor says culture can form differently. The dispute is about the DEFINITION of workplace culture.",
      type: "Cross-Text",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Text 1: Historian Nakamura argues that the atomic bombings of Hiroshima and Nagasaki were militarily unnecessary because Japan was already seeking surrender through diplomatic channels.\n\nText 2: Historian Chen acknowledges the diplomatic overtures but argues they were conditional -- Japan's military leadership insisted on terms that the Allies could not accept, making the diplomatic path insufficient to end the war quickly.",
      stem: "How does Chen respond to Nakamura?",
      choices: [
        "By completely agreeing with Nakamura's assessment.",
        "By focusing on events after the bombings.",
        "By accepting that diplomatic activity existed but arguing its terms were unacceptable, making it insufficient.",
        "By arguing that Japan never sought any form of surrender."
      ],
      correct: 2,
      explanation:
        "Chen agrees diplomacy existed (partial acceptance) but qualifies: the terms were unacceptable, so diplomacy alone wouldn't have ended the war. Classic qualification.",
      type: "Cross-Text",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "When the Brazilian government began requiring ethanol blending in gasoline in the 1970s, critics predicted economic disaster. Instead, the policy created a domestic biofuel industry that now employs 800,000 workers and has reduced the country's dependence on imported oil by over 40%. The success, however, came at an environmental cost: sugarcane plantations expanded into sensitive ecosystems, and some researchers estimate that ethanol production has contributed to 15% of Brazil's recent deforestation.",
      stem: "Which choice best states the main idea of the text?",
      choices: [
        "Brazil's ethanol policy was an unqualified success.",
        "Critics were correct to predict economic disaster from ethanol blending.",
        "Brazil's ethanol policy achieved significant economic benefits but caused serious environmental damage.",
        "Sugarcane plantations are the primary cause of deforestation in Brazil."
      ],
      correct: 2,
      explanation:
        "The passage presents BOTH economic success (800K jobs, reduced oil dependence) AND environmental cost (deforestation). The main idea balances both.",
      type: "Central Ideas",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        'Archaeological evidence from Catalhoyuk, a 9,000-year-old settlement in modern Turkey, challenges assumptions about early agricultural societies. Unlike later civilizations, Catalhoyuk shows no evidence of a ruling class: houses are uniform in size, burials contain similar grave goods regardless of location, and there are no public buildings or monuments that would indicate centralized authority.',
      stem: "Which choice best states the central idea?",
      choices: [
        "Turkish archaeological sites are more important than those in other regions.",
        "Evidence from Catalhoyuk suggests that early agricultural life did not necessarily produce social hierarchies.",
        "Early agricultural societies were always egalitarian.",
        "Catalhoyuk was the first city in human history."
      ],
      correct: 1,
      explanation:
        '"Challenges assumptions" + uniform houses + similar burials + no authority buildings = agricultural society without hierarchy. (C) captures this precisely with "not necessarily."',
      type: "Central Ideas",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Researchers studying decision-making found that people presented with three options consistently avoided the extremes and chose the middle option, regardless of the options' actual merits. When a $50, $100, and $200 product were offered, most chose the $100 option. But when the same $100 product was presented alongside $30 and $100 alternatives, it became the \"extreme\" and was avoided in favor of the $30 option.",
      stem: "Which inference is best supported by the text?",
      choices: [
        "The $30 product was the highest quality option.",
        "Consumer preferences are influenced more by the relative positioning of options than by the options' inherent qualities.",
        "The $100 product was always the best value.",
        "Companies should always offer three products."
      ],
      correct: 1,
      explanation:
        "The SAME $100 product was chosen or avoided depending on what it was placed next to. This proves positioning matters more than inherent quality.",
      type: "Inferences",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Linguist Dr. Patel argues that endangered languages contain irreplaceable knowledge about local ecosystems that is lost when the language dies.",
      stem: "Which finding would most directly support Patel's claim?",
      choices: [
        "Most endangered languages are spoken by fewer than 1,000 people.",
        "The number of endangered languages has doubled since 1950.",
        "The Tuyuca language of the Amazon has 52 distinct terms for types of rainfall that correspond to specific ecological conditions Western science has no vocabulary for.",
        "Language preservation programs have been implemented in 30 countries."
      ],
      correct: 2,
      explanation:
        "The claim is about IRREPLACEABLE ecosystem knowledge. (B) shows specific ecological terms with no Western equivalent -- proving knowledge loss.",
      type: "Textual Evidence",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Urban planners compiled data on green infrastructure: Singapore has 47 km$^2$ park area with 8,200 trees per km$^2$ and air quality index of 52. Tokyo has 32 km$^2$ with 5,100 trees per km$^2$ and AQI of 45. London has 38 km$^2$ with 3,800 trees per km$^2$ and AQI of 58. Phoenix has 15 km$^2$ with 950 trees per km$^2$ and AQI of 78.",
      stem: "Which choice supports the claim that higher tree density is associated with better air quality?",
      choices: [
        "Singapore has the highest tree density and the highest average temperature.",
        "Tokyo has the best air quality index (45) and the second-highest tree density (5,100/km$^2$), while Phoenix has the worst air quality (78) and the lowest tree density (950/km$^2$).",
        "Singapore has the largest park area at 47 km$^2$.",
        "London's average temperature is 11.9\u00B0C, the lowest among the four cities."
      ],
      correct: 1,
      explanation:
        "The claim links tree density to air quality. (B) compares high-tree/good-AQI (Tokyo) with low-tree/bad-AQI (Phoenix).",
      type: "Quantitative Evidence",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Energy analysts compiled data: Solar costs $36/MWh, emits 41 g CO<sub>2</sub>/kWh, uses 20 km<sup>2</sup> per GW. Wind costs $30/MWh, emits 11 g CO<sub>2</sub>/kWh, uses 72 km<sup>2</sup> per GW. Nuclear costs $69/MWh, emits 12 g CO<sub>2</sub>/kWh, uses 1.3 km<sup>2</sup> per GW. Natural Gas costs $44/MWh, emits 490 g CO<sub>2</sub>/kWh, uses 0.4 km<sup>2</sup> per GW.",
      stem: "Which choice supports the claim that nuclear power offers the best combination of low emissions and minimal land use?",
      choices: [
        "Solar energy has the lowest cost at $36/MWh.",
        "Wind produces only 11 g/kWh of CO<sub>2</sub>, the lowest among all four sources.",
        "Nuclear emits just 12 g CO<sub>2</sub>/kWh -- comparable to wind -- while requiring only 1.3 km<sup>2</sup> per GW, far less land than solar (20) or wind (72).",
        "Natural gas has the smallest land footprint at 0.4 km<sup>2</sup> per GW."
      ],
      correct: 2,
      explanation:
        "Claim: nuclear = best LOW EMISSIONS + LOW LAND USE combo. (C) shows both: emissions comparable to wind AND tiny land use. (D) mentions gas land use but gas has terrible emissions.",
      type: "Quantitative Evidence",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The museum's collection of Renaissance paintings, which includes works by Botticelli, Raphael, and Titian, _______ one of the most comprehensive in the Western Hemisphere.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "is considered",
        "were considering",
        "have been considering",
        "are considered"
      ],
      correct: 0,
      explanation:
        'Subject is "collection" (singular). The "which" clause is nonessential. "Is considered."',
      type: "Conventions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Having published her first novel at the age of nineteen, the young _______ attracted comparisons to the Bronte sisters from literary critics.",
      stem: "Which choice conforms to Standard English?",
      choices: ["author, she", "author; she", "author", "author. She"],
      correct: 2,
      explanation:
        '"Having published" is a participial phrase that must be followed directly by the subject it modifies: "the young author."',
      type: "Conventions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The research team analyzed soil samples from three continents, _______ their findings suggested that microplastic contamination was far more widespread than previous studies had indicated.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "continents their",
        "continents; their",
        "continents, and, their",
        "continents, their"
      ],
      correct: 1,
      explanation:
        'Two ICs: "The team analyzed..." and "their findings suggested..." Semicolon correctly joins them. (A) = comma splice.',
      type: "Conventions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The filmmaker wanted to capture the raw energy of street protests without _______ the participants' safety or compromising the documentary's journalistic integrity.",
      stem: "Which choice conforms to Standard English?",
      choices: [
        "to endanger",
        "endangering",
        "having endangered",
        "she endangered"
      ],
      correct: 1,
      explanation:
        '"Without" + gerund. Parallel to "compromising" later in the sentence. "Endangering."',
      type: "Conventions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The painting's vivid reds and oranges immediately draw the viewer's eye to the foreground. _______ the muted blues and grays of the background create a sense of depth and distance.",
      stem: "Which transition best completes the text?",
      choices: ["For example,", "Therefore,", "Meanwhile,", "Similarly,"],
      correct: 2,
      explanation:
        'Two simultaneous visual effects. "Meanwhile" = at the same time.',
      type: "Transitions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The orchestra's performance of Beethoven's Fifth was technically flawless. _______ critics felt it lacked the emotional intensity that distinguishes a good performance from a great one.",
      stem: "Which transition best completes the text?",
      choices: ["For instance,", "Accordingly,", "Nevertheless,", "Moreover,"],
      correct: 2,
      explanation:
        'Technically flawless (positive) -> lacked emotion (negative despite the positive). "Nevertheless."',
      type: "Transitions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        'The city banned single-use plastic bags in 2020. _______ a follow-up study found that overall plastic waste in landfills had actually increased by 12%, driven by a surge in thicker "reusable" bags that consumers discarded after one use.',
      stem: "Which transition best completes the text?",
      choices: [
        "Surprisingly,",
        "For instance,",
        "As a result,",
        "In addition,"
      ],
      correct: 0,
      explanation:
        'Ban expected to reduce waste -> waste actually increased. Unexpected. "Surprisingly."',
      type: "Transitions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The platypus is one of only five species of egg-laying mammals. Male platypuses have venomous spurs. The platypus uses electroreception to detect prey underwater. The platypus genome contains genes from birds, reptiles, and mammals. Indigenous Australians have cultural stories about the platypus dating back thousands of years.",
      stem: "Which choice effectively presents the platypus as an animal that defies biological classification?",
      choices: [
        "The platypus defies easy classification: it lays eggs like a reptile, produces venom like a snake, detects prey through electroreception like a shark, and has a genome containing genes from birds, reptiles, and mammals.",
        "The platypus is one of only five species of monotremes, or egg-laying mammals.",
        "Male platypuses possess venomous spurs, making them one of the few venomous mammals in the world.",
        "The platypus has been featured in Indigenous Australian cultural stories for thousands of years."
      ],
      correct: 0,
      explanation:
        'Goal: defies classification. (C) lists traits from multiple animal classes + mixed genome -- directly supporting the "defies classification" framing.',
      type: "Synthesis",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The Svalbard Global Seed Vault, opened in 2008, stores over 1.1 million seed samples from around the world. It is located inside a mountain on a remote Norwegian island, 1,300 km from the North Pole. The vault's permafrost location keeps seeds frozen even without electricity. In 2015, seeds were withdrawn for the first time -- to replace collections destroyed by the Syrian civil war. The vault currently holds seeds from 6,000 plant species.",
      stem: "Which choice introduces the seed vault by emphasizing both its purpose and its real-world use?",
      choices: [
        "Opened in 2008, the vault stores over 1.1 million seed samples representing 6,000 plant species.",
        "The vault's permafrost location ensures seeds remain frozen even during power outages.",
        "The Svalbard Global Seed Vault is located inside a mountain on a remote Norwegian island, 1,300 km from the North Pole.",
        "The Svalbard Global Seed Vault -- a repository of over 1.1 million seed samples frozen inside an Arctic mountain -- proved its value in 2015, when seeds were withdrawn for the first time to replace collections destroyed by Syria's civil war."
      ],
      correct: 3,
      explanation:
        "Goal: purpose + real-world use. (C) introduces purpose (repository of seeds) AND real-world use (2015 Syria withdrawal).",
      type: "Synthesis",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  challenge: [
    {
      passage:
        'The word "sanction" can mean either "to approve" or "to penalize." In diplomatic contexts, this ambiguity can create significant confusion. When the United Nations announced it would sanction the regime, commentators initially _______ whether the organization intended to legitimize or punish the government.',
      stem: "Which word best completes the text?",
      choices: ["debated", "confirmed", "ignored", "resolved"],
      correct: 0,
      explanation:
        'Ambiguity about meaning -> people questioned which sense was intended. "Debated" captures the uncertainty.',
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Text 1: Neuroscientist Park argues that adolescent risk-taking is primarily driven by an imbalance between a mature limbic system (which drives reward-seeking) and an immature prefrontal cortex (which controls impulse regulation).\n\nText 2: Neuroscientist Alvarez agrees the brain regions Park identifies are relevant but argues that framing adolescence as a 'deficit' in prefrontal control is misleading. Alvarez contends that heightened risk-taking is an adaptive feature that promotes exploration and social learning during a critical developmental window.",
      stem: "What is the fundamental nature of the disagreement?",
      choices: [
        "Whether the prefrontal cortex develops during adolescence.",
        "Whether adolescence is a real developmental stage.",
        "Whether adolescent risk-taking is a developmental flaw or an adaptive feature.",
        "Whether the limbic system is involved in risk-taking."
      ],
      correct: 2,
      explanation:
        "Both agree on the brain regions. They disagree on INTERPRETATION: Park sees a deficit/imbalance, Alvarez sees an adaptive feature.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Health policy researchers compared healthcare systems: US spends 17.8% GDP with life expectancy 77.0 and infant mortality 5.4. Germany spends 12.8% with life expectancy 81.3 and infant mortality 3.1. Japan spends 11.1% with life expectancy 84.6 and infant mortality 1.8. UK spends 12.4% with life expectancy 81.0 and infant mortality 3.7.",
      stem: "Which choice supports the claim that higher healthcare spending does not necessarily produce better health outcomes?",
      choices: [
        "All four countries spend more than 10% of GDP on healthcare.",
        "Germany and the UK have similar life expectancies despite different spending levels.",
        "The US spends the most on healthcare (17.8% of GDP) yet has the lowest life expectancy (77.0), the highest infant mortality (5.4), and the highest uninsured rate among all four countries.",
        "Japan has the lowest infant mortality rate at 1.8 per 1,000 births."
      ],
      correct: 2,
      explanation:
        "(C) shows the US spends the MOST but performs the WORST on every metric -- directly disproving a spending->outcomes link.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Mycelium (fungal root networks) can decompose plastic in weeks -- a process that normally takes centuries. Researchers at Yale discovered a fungus that can survive on polyurethane alone. Mycelium-based packaging is already used by companies like IKEA. Growing mycelium packaging requires 12% of the energy needed to produce equivalent Styrofoam. The global mycelium market is projected to reach $4.2 billion by 2030.",
      stem: "Which choice effectively presents mycelium technology as having both environmental and commercial promise?",
      choices: [
        "Mycelium technology offers a compelling dual promise: its ability to decompose plastic in weeks and produce packaging at just 12% of Styrofoam's energy cost has already attracted companies like IKEA, helping fuel a market projected to reach $4.2 billion by 2030.",
        "Growing mycelium packaging uses only 12% of the energy required for Styrofoam production.",
        "Yale researchers discovered a fungus that can decompose polyurethane plastic.",
        "The global mycelium market is expected to be worth $4.2 billion by 2030."
      ],
      correct: 0,
      explanation:
        "Goal: environmental + commercial promise. (B) includes decomposition + energy savings (environmental) AND IKEA adoption + market projection (commercial).",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The mathematician's proof was elegant in its _______ -- rather than building an elaborate argument across dozens of pages, she resolved the conjecture in just three lines by revealing a hidden symmetry that previous researchers had overlooked.",
      stem: "Which word best completes the text?",
      choices: ["complexity", "verbosity", "brevity", "obscurity"],
      correct: 2,
      explanation:
        '"Three lines" vs. "dozens of pages" = short/concise. "Brevity" = concise expression.',
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        'The playwright\'s most acclaimed work is structured as a series of monologues delivered by characters who never appear on stage together. The audience must piece together the relationships from contradictions and overlaps in the characters\' accounts. Critics have described the experience as "detective work disguised as theater."',
      stem: "Which choice best describes the function of the second sentence?",
      choices: [
        "It provides background on the playwright's career.",
        "It describes the active role the structural choice assigns to the audience.",
        "It summarizes the critics' response to the play.",
        "It introduces the characters' motivations."
      ],
      correct: 1,
      explanation:
        "The sentence shows what the STRUCTURE requires of the audience -- it's about the audience's role, which is a consequence of the structural choice.",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  takeaways: [
    "The two-pass method maximizes points: lock in easy wins first, then tackle flagged items.",
    "Error categorization matters more than raw score. Know WHY you miss questions.",
    "Four error types: content gap (did not know the rule), trap answer (fell for distractor), misread (skimmed too fast), time pressure (rushed at end).",
    "Your top 2 error patterns are your highest-leverage study targets.",
    "Conventions and WIC should be your fastest domains. Budget extra time for Evidence and Synthesis.",
  ],
};
