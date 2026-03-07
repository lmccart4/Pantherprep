"use client";

import { ModuleShell } from "@/components/course/module-shell";
import { BossBattle } from "@/components/course/activities";
import type { ModuleConfig, QuizQuestion } from "@/types/module";

/* ═══════════════════════════════════════════════════════
 * MODULE 12 — Information Boss Battle
 * Mixed information skills challenge
 * ═══════════════════════════════════════════════════════ */

const BOSS_QUESTIONS: QuizQuestion[] = [
  /* ═══ PHASE 1: WARM-UP (8 Qs) ═══ */
  {
    passage:
      "Researchers at the University of Edinburgh have identified a gene variant carried by roughly 20% of the population that appears to confer a higher tolerance for pain. Individuals with this variant produce elevated levels of a naturally occurring opioid-like compound in the brain, effectively raising their pain threshold. The discovery may explain why pain perception varies so dramatically between individuals and could eventually inform the development of non-addictive pain medications modeled on the body's own chemistry.",
    stem: "Which choice best states the main idea of the text?",
    choices: [
      "Most people have a high tolerance for pain",
      "A genetic variant that raises pain tolerance has been identified, potentially explaining individual differences and opening new paths for pain medication",
      "Edinburgh researchers have studied pain for many years",
      "Non-addictive pain medications are currently available"
    ],
    correct: 1,
    explanation:
      "The passage describes discovery of a gene variant \u2192 explains pain variation \u2192 possible medication applications. B captures all three elements.",
    type: "central",
    difficulty: "easy",
  },
  {
    passage:
      "The Voyager 1 spacecraft, launched in 1977, crossed the heliopause \u2014 the boundary where the sun's solar wind gives way to interstellar space \u2014 in August 2012, making it the first human-made object to enter interstellar space. As of 2024, Voyager 1 was more than 15 billion miles from Earth, still transmitting data back to NASA via a 23-watt radio signal that takes over 22 hours to reach ground stations.",
    stem: "According to the passage, what makes Voyager 1's radio communication remarkable?",
    choices: [
      "It communicates using lasers rather than radio waves",
      "It can only transmit data once per year",
      "It uses advanced quantum communication technology",
      "Its 23-watt signal \u2014 roughly the power of a refrigerator light bulb \u2014 still transmits data from over 15 billion miles away, with a 22-hour travel time"
    ],
    correct: 3,
    explanation:
      "The passage specifically states: 23-watt signal, over 15 billion miles, 22 hours to reach ground stations. B matches these exact details.",
    type: "detail",
    difficulty: "easy",
  },
  {
    passage:
      "Between 2010 and 2020, the number of independent bookstores in the United States increased by 35%, reversing decades of decline. Industry analysts attribute this resurgence to bookstores repositioning themselves as community gathering spaces \u2014 hosting author events, book clubs, and children's story hours \u2014 rather than competing on price or selection with online retailers.",
    stem: "Which inference is best supported by the text?",
    choices: [
      "The number of independent bookstores will continue to increase indefinitely",
      "All retail businesses should convert to community gathering spaces",
      "Independent bookstores survived by offering experiential value that online retail cannot replicate",
      "Online retailers have gone out of business due to bookstore competition"
    ],
    correct: 2,
    explanation:
      "Bookstores grew by becoming community spaces, not by competing on price/selection with online. B captures this: they survived through experiential value (events, community) that online can't offer.",
    type: "inference",
    difficulty: "easy",
  },
  {
    passage:
      "Sociologist Dr. Mendez argues that public libraries have become essential social infrastructure for low-income communities, serving functions far beyond lending books.\n\nClaim: Dr. Mendez argues that libraries serve as critical community support systems for vulnerable populations.",
    stem: "Which finding would most effectively support this claim?",
    choices: [
      "Many libraries have modernized their buildings in recent years",
      "In a survey of 5,000 library patrons in low-income neighborhoods, 62% reported using the library primarily for internet access for job applications, 41% for free tax preparation assistance, and 28% for English language classes \u2014 services they could not afford elsewhere",
      "Libraries have operated in the United States since the 18th century",
      "Dr. Mendez has published extensively on urban sociology"
    ],
    correct: 1,
    explanation:
      "The claim is about libraries as SUPPORT SYSTEMS for VULNERABLE populations. B provides specific data showing library use for essential services (jobs, taxes, language) by people who can't afford alternatives. Direct, specific, measurable.",
    type: "evidence",
    difficulty: "medium",
  },
  {
    passage:
      "A health department tracked vaccination rates and disease incidence across four counties.\n\n| County | Vaccination rate | Flu cases per 1,000 | Hospitalization rate |\n|---|---|---|---|\n| Maple | 89% | 42 | 2.1% |\n| Cedar | 76% | 68 | 3.8% |\n| Birch | 61% | 95 | 5.7% |\n| Pine | 45% | 131 | 8.4% |",
    stem: "Which claim is best supported by the data in the table?",
    choices: [
      "All counties should mandate vaccination to eliminate the flu entirely",
      "Vaccination has no effect on flu incidence",
      "Maple County has the best healthcare system of the four counties",
      "There is a consistent inverse relationship between vaccination rates and both flu incidence and hospitalization rates across all four counties"
    ],
    correct: 3,
    explanation:
      "As vaccination goes up (45\u219261\u219276\u219289%), flu cases go down (131\u219295\u219268\u219242) and hospitalizations go down (8.4\u21925.7\u21923.8\u21922.1%). B accurately describes this consistent inverse relationship.",
    type: "data",
    difficulty: "medium",
  },
  {
    passage:
      "Marine biologists have observed that coral reefs near marine protected areas (MPAs) where fishing is prohibited show significantly higher biodiversity than reefs in unprotected waters. They conclude that fishing restrictions are the primary driver of reef biodiversity recovery.",
    stem: "Which finding, if true, would most strengthen this conclusion?",
    choices: [
      "Reefs that were recently granted MPA status but where enforcement has not yet begun show biodiversity levels similar to unprotected reefs, suggesting that the designation alone does not confer benefits \u2014 actual fishing reduction is necessary",
      "Some fishers have relocated to other areas since the MPAs were established",
      "Coral reefs are among the most biodiverse ecosystems on Earth",
      "Marine protected areas are expensive to enforce"
    ],
    correct: 0,
    explanation:
      "The conclusion claims fishing RESTRICTIONS drive recovery. B provides a natural control: areas with MPA status but no actual enforcement show NO benefit. This confirms that the actual reduction in fishing (not just the designation) is what matters.",
    type: "strengthen",
    difficulty: "medium",
  },
  {
    passage:
      "A study compared two groups of elderly patients recovering from hip replacement surgery. Group A received standard physical therapy. Group B received identical physical therapy supplemented by weekly visits from a therapy dog. After eight weeks, Group B showed 30% faster improvement in mobility scores and reported significantly lower pain levels than Group A. Notably, Group B also showed 40% lower rates of post-surgical depression. The researchers concluded that ______",
    stem: "Which choice most logically completes the text?",
    choices: [
      "depression is the primary barrier to surgical recovery",
      "animal-assisted therapy may provide both physical and psychological benefits that enhance surgical recovery outcomes beyond what physical therapy alone achieves",
      "all hospitals should replace physical therapists with therapy dogs",
      "therapy dogs are more effective than physical therapy"
    ],
    correct: 1,
    explanation:
      "Better mobility + lower pain + lower depression in the dog group = benefits were both physical and psychological. B is appropriately cautious (\"may provide\") and captures both dimensions. A and C overstate. D isn't supported.",
    type: "completion",
    difficulty: "medium",
  },
  {
    passage:
      "The traditional model of scientific discovery \u2014 a lone genius experiencing a sudden eureka moment \u2014 has been largely debunked by historians of science. Studies of major breakthroughs consistently reveal that innovation emerges from collaborative networks, incremental advances, and the cross-pollination of ideas across disciplines. Even discoveries attributed to individual scientists, such as Darwin's theory of evolution, were shaped by decades of correspondence, debate, and collective knowledge-building within scientific communities.",
    stem: "Which choice best states the main idea of the text?",
    choices: [
      "Darwin did not really discover evolution on his own",
      "Scientific communities are larger today than in the 19th century",
      "The history of science is poorly understood by the general public",
      "Scientific breakthroughs result from collaborative, incremental processes rather than isolated moments of individual genius"
    ],
    correct: 3,
    explanation:
      "The passage dismantles the \"lone genius\" model and replaces it with collaborative, incremental processes. Darwin is one example supporting this broader point, not the central idea itself.",
    type: "central",
    difficulty: "medium",
  },
  /* ═══ PHASE 2: ESCALATION (8 Qs) ═══ */
  {
    passage:
      "When Pixar Animation Studios was struggling in its early years, Steve Jobs considered selling it on multiple occasions. The company's first purely commercial product \u2014 a high-end graphics computer called the Pixar Image Computer \u2014 sold poorly, and the company lost money every year for its first decade. It was only when the team pivoted fully to animated storytelling, releasing Toy Story in 1995, that Pixar became profitable. Jobs later described keeping Pixar alive during those lean years as 'the best decision I ever made \u2014 and the luckiest.'",
    stem: "Which inference is best supported by the text?",
    choices: [
      "Pixar's eventual success was not a foregone conclusion and could easily have been prevented by early business decisions",
      "The Pixar Image Computer was technologically inferior to competitors",
      "Steve Jobs was primarily responsible for Pixar's creative output",
      "Toy Story was the most profitable animated film ever made"
    ],
    correct: 0,
    explanation:
      "Jobs considered selling, the company lost money for a decade, and he called keeping it both his best decision AND \"luckiest\" \u2014 implying it could have gone differently. B captures the contingency: success wasn't guaranteed.",
    type: "inference",
    difficulty: "medium",
  },
  {
    passage:
      "A school district found that students who participated in chess club scored an average of 18% higher on math standardized tests than non-participants. The district superintendent cited this as evidence that chess improves mathematical reasoning and proposed expanding the chess program to all schools.",
    stem: "Which finding, if true, would most weaken the superintendent's conclusion?",
    choices: [
      "Some students in chess club also participated in other extracurricular activities",
      "Students who joined chess club had scored 16% higher on math tests BEFORE joining the club, suggesting that pre-existing mathematical aptitude attracted students to chess rather than chess improving math skills",
      "Chess is a complex strategic game that requires analytical thinking",
      "The chess program was led by a popular and engaging teacher"
    ],
    correct: 1,
    explanation:
      "If chess students already scored 16% higher BEFORE joining, the 18% gap is almost entirely pre-existing. This is classic REVERSE CAUSATION: math talent \u2192 chess interest, not chess \u2192 math improvement. Only a 2% difference remains after accounting for pre-existing ability.",
    type: "weaken",
    difficulty: "hard",
  },
  {
    passage:
      "Researchers studied the effect of class size on student achievement across 200 elementary schools.\n\n| Class size | Avg. reading score | Avg. math score | Teacher satisfaction | Cost per student |\n|---|---|---|---|---|\n| 15-18 students | 87 | 84 | 91% | $14,200 |\n| 19-22 students | 84 | 82 | 78% | $11,500 |\n| 23-26 students | 81 | 80 | 62% | $9,800 |\n| 27-30 students | 78 | 77 | 44% | $8,200 |\n\nScores out of 100. All schools matched for socioeconomic factors and teacher experience.",
    stem: "A school board member argues that reducing class sizes to 15-18 students would dramatically improve student outcomes enough to justify the increased cost. Does the data support this claim?",
    choices: [
      "Yes, because smaller classes always produce better results",
      "No, because the test score differences are too small to measure",
      "The data shows a consistent but modest association between smaller classes and higher scores \u2014 roughly 3 points per tier reduction \u2014 suggesting meaningful but not dramatic improvement. Whether the $6,000 per-student cost increase justifies a 9-point gain requires a value judgment the data alone cannot make",
      "Yes, because teacher satisfaction is much higher in smaller classes"
    ],
    correct: 2,
    explanation:
      "Scores improve ~3 points per size reduction (78\u219281\u219284\u219287). Cost increases from $8,200 per student to $14,200 (adding $6,000). B accurately describes the trade-off: real but modest improvement, with the cost-benefit judgment being a policy question, not a data question.",
    type: "data",
    difficulty: "hard",
  },
  {
    passage:
      "Archaeologist Dr. Okonkwo argues that the ancient city of Great Zimbabwe, which flourished between 1100-1450 CE in present-day Zimbabwe, was a major center of international trade, not merely a regional power.\n\nClaim: Dr. Okonkwo argues that Great Zimbabwe participated in a global trading network extending far beyond Africa.",
    stem: "Which finding would most effectively support this claim?",
    choices: [
      "Great Zimbabwe's stone walls are among the largest ancient structures in sub-Saharan Africa",
      "Great Zimbabwe was declared a UNESCO World Heritage Site in 1986",
      "The site was home to an estimated 18,000 people at its peak",
      "Excavations at the site recovered Chinese ceramics from the Ming dynasty, glass beads manufactured in medieval India, and coins from the Arabian Peninsula \u2014 artifacts that could only have arrived through extensive trade networks spanning the Indian Ocean"
    ],
    correct: 3,
    explanation:
      "The claim is about GLOBAL trade beyond Africa. B provides physical evidence of goods from China, India, and Arabia \u2014 three continents reached through Indian Ocean trade networks. Specific, international, and directly demonstrates the claimed trade connections.",
    type: "evidence",
    difficulty: "hard",
  },
  {
    passage:
      "The widespread assumption that creativity is primarily a right-brain function has been thoroughly undermined by neuroimaging research. Studies using fMRI consistently show that creative tasks \u2014 whether composing music, writing poetry, or solving novel problems \u2014 activate distributed networks spanning BOTH hemispheres, with the degree of inter-hemispheric communication being a stronger predictor of creative output than activation in any single region. Neuroscientist Dr. Beaty's research suggests that creativity depends not on one side of the brain but on the brain's ability to dynamically integrate multiple, often competing, neural networks.",
    stem: "Which choice best states the main idea of the text?",
    choices: [
      "fMRI technology has revolutionized the study of the brain",
      "The right brain is responsible for artistic creativity while the left brain handles logic",
      "Dr. Beaty is the leading researcher in the field of creative neuroscience",
      "Neuroimaging research has revealed that creativity involves coordinated activity across both brain hemispheres rather than being localized to one side"
    ],
    correct: 3,
    explanation:
      "The passage debunks right-brain creativity and replaces it with: both hemispheres, distributed networks, inter-hemispheric communication. B captures the core finding.",
    type: "central",
    difficulty: "hard",
  },
  {
    passage:
      "Text:\nEcologist Dr. Navarro's field research found that bee populations within 2 kilometers of organic farms were 40% larger than populations near conventional farms. Dr. Navarro attributed this difference to the absence of neonicotinoid pesticides on organic farms.\n\nHowever, Dr. Navarro also noted that organic farms in the study had significantly more diverse crop plantings (averaging 12 crop varieties versus 3 for conventional farms) and maintained unplowed hedgerows and wildflower margins that conventional farms lacked.",
    stem: "Taken together, what do these findings most strongly suggest?",
    choices: [
      "Bee populations are increasing worldwide due to organic farming",
      "Organic farming is always better for the environment than conventional farming",
      "While pesticide absence may contribute to larger bee populations near organic farms, the greater habitat diversity \u2014 varied crops and preserved wild margins \u2014 represents a confounding variable that makes it impossible to attribute the difference solely to pesticide use",
      "Neonicotinoid pesticides are the sole cause of bee population decline"
    ],
    correct: 2,
    explanation:
      "Larger bee populations near organic farms, but organic farms ALSO have more crop diversity and wild margins. The synthesis: we can't isolate the pesticide effect because habitat diversity is a confound. B captures this nuance \u2014 both factors could contribute.",
    type: "synthesis",
    difficulty: "hard",
  },
  {
    passage:
      "Political scientist Dr. Osei has proposed that ranked-choice voting (RCV) reduces negative campaigning because candidates benefit from being voters' second or third choice and therefore have an incentive to avoid alienating supporters of rival candidates.",
    stem: "Which finding, if true, would most strengthen Dr. Osei's proposal?",
    choices: [
      "Dr. Osei has studied voting systems for two decades",
      "Ranked-choice voting is used in several countries around the world",
      "Some voters find ranked-choice ballots confusing",
      "An analysis of 400 elections found that campaigns in RCV jurisdictions used 35% fewer attack ads than campaigns in traditional plurality elections, and post-election surveys showed that candidates in RCV elections were significantly more likely to publicly praise opponents and seek policy common ground"
    ],
    correct: 3,
    explanation:
      "The claim is RCV reduces negative campaigning. B provides both behavioral data (35% fewer attack ads) AND a mechanism (candidates praising opponents, seeking common ground). The evidence matches the claim's direction and explains WHY.",
    type: "strengthen",
    difficulty: "hard",
  },
  {
    passage:
      "In 1848, Hungarian physician Ignaz Semmelweis discovered that mortality rates in maternity wards dropped from 18% to 2% when doctors washed their hands with a chlorine solution between performing autopsies and delivering babies. Despite this dramatic evidence, Semmelweis's findings were rejected by the medical establishment, which considered the suggestion that doctors' hands could transmit disease to be insulting to the profession. Semmelweis was dismissed from his hospital position and eventually committed to a mental institution, where he died at age 47. His work was only vindicated decades later when germ theory became accepted.",
    stem: "Which inference is best supported by the text?",
    choices: [
      "The medical establishment of the 1800s was entirely incompetent",
      "Handwashing is the most important medical practice ever discovered",
      "Semmelweis invented modern antiseptic techniques",
      "Scientific evidence alone may be insufficient to change established practices when it conflicts with the professional identity or institutional interests of those who must adopt it"
    ],
    correct: 3,
    explanation:
      "Dramatic evidence (18%\u21922%) was rejected because it was \"insulting to the profession.\" This shows evidence can fail against institutional/identity resistance. B captures this broader principle about evidence vs. institutional inertia.",
    type: "inference",
    difficulty: "hard",
  },
  /* ═══ PHASE 3: FINAL STAND (9 Qs) ═══ */
  {
    passage:
      "A tech company's internal study found that employees who used standing desks reported 25% fewer back pain complaints than employees who used traditional sitting desks. The company's wellness director concluded that standing desks reduce back pain and recommended purchasing standing desks for all employees.",
    stem: "Which finding, if true, would most weaken the wellness director's conclusion?",
    choices: [
      "Employees who chose standing desks were significantly younger (average age 31) and more physically active (exercising 4+ times per week) than those who kept sitting desks (average age 47, exercising 1-2 times per week), and younger, more active individuals generally experience less back pain regardless of desk type",
      "Standing desks cost more than traditional desks",
      "The study was conducted over a six-month period",
      "Some employees preferred sitting desks for ergonomic reasons"
    ],
    correct: 0,
    explanation:
      "Classic self-selection + confounding variables: standing desk users were younger AND more active \u2014 both independently associated with less back pain. The 25% reduction might be entirely explained by age and activity differences, not the desks themselves.",
    type: "weaken",
    difficulty: "hard",
  },
  {
    passage:
      "A team of linguists analyzed 3,000 hours of recorded conversation across 12 languages and found that, despite enormous variation in grammar, vocabulary, and phonology, speakers in all 12 languages transmitted information at remarkably similar rates \u2014 approximately 39 bits per second. Languages with simpler syllable structures (like Japanese, which uses fewer sounds per syllable) compensated by using faster speech rates, while languages with more complex syllables (like Vietnamese with its tonal system) were spoken more slowly but packed more information into each syllable. The researchers concluded that ______",
    stem: "Which choice most logically completes the text?",
    choices: [
      "there appears to be a universal cognitive bottleneck that constrains the rate at which the human brain can produce and process linguistic information, and languages have evolved different structural strategies to optimize transmission within this constraint",
      "speech rate is more important than vocabulary size",
      "Japanese is a simpler language than Vietnamese",
      "all languages are equally difficult to learn"
    ],
    correct: 0,
    explanation:
      "Same information rate across all languages + different structural strategies to achieve it = a universal cognitive constraint that languages adapt to differently. B captures both the universal rate AND the compensatory strategies.",
    type: "completion",
    difficulty: "hard",
  },
  {
    passage:
      "A city evaluated four different approaches to reducing homelessness over a three-year period.\n\n| Program | Participants | Housing rate at 3 years | Cost per participant | Emergency room visits (change) |\n|---|---|---|---|---|\n| Housing First | 450 | 82% | $22,000 | -64% |\n| Transitional shelters | 600 | 41% | $15,000 | -18% |\n| Job training | 380 | 28% | $8,500 | -12% |\n| Emergency shelters only | 1,200 | 9% | $4,500 | +8% |",
    stem: "Which claim is best supported by the data in the table?",
    choices: [
      "Housing First achieved the highest stable housing rate and largest reduction in emergency room usage, suggesting that despite higher per-participant costs, it may produce greater long-term value through reduced healthcare utilization",
      "All homeless individuals should be placed in Housing First programs immediately",
      "Job training programs should be eliminated because they had the lowest housing rate",
      "Emergency shelters are the most effective approach to reducing homelessness"
    ],
    correct: 0,
    explanation:
      "Housing First: 82% housed, -64% ER visits (highest on both). Higher cost ($22K) but dramatic ER reduction suggests downstream savings. B accurately captures the data pattern and the cost-effectiveness implication without overstating.",
    type: "data",
    difficulty: "hard",
  },
  {
    passage:
      "Evolutionary biologist Dr. Tanaka argues that the human preference for sweet tastes, once adaptive in environments where calorie-dense foods were scarce, has become maladaptive in modern food environments where sugar is abundant and cheap.\n\nClaim: Dr. Tanaka argues that an evolutionary trait that was once beneficial has become harmful in a changed environment.",
    stem: "Which finding would most effectively illustrate this concept?",
    choices: [
      "Humans have taste receptors for five basic flavors: sweet, sour, salty, bitter, and umami",
      "In controlled experiments, human subjects consistently chose sweeter options even when informed that the less sweet option was nutritionally superior, and this preference persisted even among subjects with diabetes who understood that excess sugar directly harmed their health \u2014 demonstrating the power of the evolved preference to override conscious knowledge of its harmful effects",
      "Some people prefer salty foods to sweet foods",
      "Sugar consumption has increased over the past century"
    ],
    correct: 1,
    explanation:
      "The claim is about an adaptive trait becoming maladaptive. B shows the preference overriding CONSCIOUS KNOWLEDGE of harm \u2014 even diabetics who KNOW sugar hurts them still choose it. This powerfully demonstrates the mismatch between evolved preference and modern consequences.",
    type: "evidence",
    difficulty: "hard",
  },
  {
    passage:
      "Philosopher Kwame Anthony Appiah has argued that identity categories \u2014 race, nationality, religion \u2014 are not fixed, natural kinds but 'labels' that gain meaning through social practice and that can be contested, revised, or abandoned as societies change. This does not mean identities are unreal or unimportant, Appiah emphasizes; rather, understanding their constructed nature is precisely what allows marginalized groups to challenge the definitions imposed on them and assert new ones. The danger, he suggests, lies not in having identities but in treating them as though they were eternal and unchangeable \u2014 a mistake that empowers those who would use identity to exclude rather than include.",
    stem: "Which choice best states the main idea of the text?",
    choices: [
      "Appiah believes that all identity categories should be abolished",
      "Appiah argues that race is the most important identity category",
      "Understanding identities as socially constructed rather than fixed is empowering because it reveals that definitions can be challenged and revised, particularly by those who have been marginalized",
      "Identity categories are unimportant in modern society"
    ],
    correct: 2,
    explanation:
      "Appiah: identities are constructed (not fixed) \u2192 understanding this is empowering \u2192 marginalized groups can challenge imposed definitions. B captures the full argument: constructed nature + empowerment through revision.",
    type: "central",
    difficulty: "hard",
  },
  {
    passage:
      "Text:\nA neuroscience study found that when subjects listened to their preferred music genre, activity in the brain's reward center (nucleus accumbens) increased by an average of 45% compared to silence. The same study found that listening to non-preferred genres produced only a 12% increase.\n\nA separate psychology study found that workers who listened to self-selected music while performing repetitive tasks completed 31% more units and reported 40% higher job satisfaction than workers in silent conditions. However, workers who listened to researcher-selected music showed no productivity benefit and reported the experience as distracting.",
    stem: "Taken together, what do these findings most strongly suggest?",
    choices: [
      "Music only benefits people who enjoy listening to music",
      "Music's cognitive and motivational benefits appear to depend critically on personal preference and choice \u2014 self-selected music activates reward pathways and enhances performance, while imposed music does not, suggesting that autonomy in music selection is the key variable",
      "Classical music is better for productivity than other genres",
      "All workplaces should play music to increase productivity"
    ],
    correct: 1,
    explanation:
      "Study 1: preferred music \u2192 strong reward response, non-preferred \u2192 weak response. Study 2: self-selected \u2192 productivity gains, researcher-selected \u2192 no benefit. SYNTHESIS: the CHOICE/preference is the key variable, not music itself. B combines both findings around this insight.",
    type: "synthesis",
    difficulty: "hard",
  },
  {
    passage:
      "A study found that neighborhoods with more street trees had 15% lower crime rates than similar neighborhoods without trees. Urban planners concluded that planting trees reduces crime by creating a more pleasant, watched-over environment that discourages criminal activity.",
    stem: "Which finding, if true, would most weaken the planners' conclusion?",
    choices: [
      "Trees provide environmental benefits such as shade and air filtration",
      "The study controlled for population density",
      "Some neighborhoods with many trees still had high crime rates",
      "Neighborhoods with more street trees were found to have significantly higher property values, median household incomes, and rates of homeownership \u2014 all factors independently associated with lower crime \u2014 suggesting that tree presence may be a proxy for neighborhood wealth rather than a direct crime deterrent"
    ],
    correct: 3,
    explanation:
      "Trees correlate with crime reduction, but B reveals trees also correlate with wealth indicators (property values, income, homeownership) that independently reduce crime. The trees might be a PROXY for wealth, not a cause of safety. Classic confounding variable.",
    type: "weaken",
    difficulty: "hard",
  },
  {
    passage:
      "Astronomers have discovered that roughly 70% of sun-like stars in the Milky Way have at least one planet in the habitable zone \u2014 the orbital region where liquid water could theoretically exist on a planet's surface. Given that the galaxy contains approximately 100 billion sun-like stars, this means there are roughly 70 billion potentially habitable worlds in our galaxy alone. Yet despite decades of searching using increasingly sensitive instruments, no confirmed evidence of extraterrestrial life has been detected. This discrepancy \u2014 known as the Fermi Paradox \u2014 suggests that ______",
    stem: "Which choice most logically completes the text?",
    choices: [
      "the Milky Way is the only galaxy that could harbor life",
      "human technology is too primitive to detect any form of extraterrestrial life",
      "extraterrestrial life definitely does not exist anywhere in the universe",
      "either the conditions required for life to arise and persist are far more restrictive than the habitable zone criterion alone implies, or there are other barriers to the development or detection of life that current models do not fully account for"
    ],
    correct: 3,
    explanation:
      "Many potentially habitable planets + no detected life = something is preventing, constraining, or hiding life. B captures this logically: either habitability requirements are stricter than we think, or other unknown barriers exist. Appropriately cautious and covers multiple possibilities.",
    type: "completion",
    difficulty: "hard",
  },
  {
    passage:
      "In the 1960s, psychologist Walter Mischel conducted the famous 'marshmallow test,' in which preschoolers were offered one marshmallow immediately or two if they waited fifteen minutes. Follow-up studies found that children who waited scored higher on SATs and had better life outcomes decades later. The study was widely cited as proof that self-control is a key predictor of success. However, a 2018 replication with a larger, more diverse sample found that the correlation between waiting and later outcomes largely disappeared once researchers controlled for family socioeconomic status. Children from wealthier families were more likely both to wait (having learned that promised rewards typically materialize) and to have better outcomes (due to the advantages wealth provides).",
    stem: "Which inference is best supported by the text?",
    choices: [
      "The original marshmallow test was fraudulent",
      "What appeared to be a measure of individual self-control may have actually been measuring socioeconomic advantage \u2014 children's willingness to wait reflected their prior experience with reliability of promises rather than an innate character trait",
      "Self-control has no effect on life outcomes",
      "All psychological studies from the 1960s are invalid"
    ],
    correct: 1,
    explanation:
      "Once SES was controlled, the effect disappeared. Wealthier kids both waited more (trusted promises) and had better outcomes (wealth advantages). B captures the reinterpretation: the test measured economic background, not innate self-control.",
    type: "inference",
    difficulty: "hard",
  },
];

export default function SATRWModule12() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      activities={{
        "boss-battle": (goNext) => (
          <BossBattle
            questions={BOSS_QUESTIONS}
            title="Information Boss Battle"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
      }}
      nextModuleHref="/courses/sat-rw/13"
      nextModuleLabel="Module 13: Transitions"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 12,
  title: "Information Boss Battle",
  subtitle:
    "Mixed information skills challenge",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "boss-battle", label: "Boss Battle", icon: "flame" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  takeaways: [
    "Information & Ideas covers ~26% of the SAT R&W section — central ideas, evidence, and logical reasoning.",
    "For central ideas: summarize each passage in one sentence before looking at choices.",
    "For detail questions: go back to the passage and find the exact sentence.",
    "For inferences: the correct answer requires the smallest logical leap from the evidence.",
    "For evidence: it must SUPPORT the claim, not just relate to the same topic.",
    "For data: read labels first, identify trends, then match to claim — watch for causation traps.",
    "For strengthen/weaken: identify the hidden assumption, then confirm or attack it.",
  ],
};
