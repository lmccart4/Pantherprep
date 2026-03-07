"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";

export default function SATRWModule17() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      nextModuleHref="/courses/sat-rw/18"
      nextModuleLabel="Module 18: Practice Test & Error Analysis"
    />
  );
}

/* ═══════════════════════════════════════════════════════
 * MODULE 17 — Full R&W Review
 * ═══════════════════════════════════════════════════════ */

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 17,
  title: "Full R&W Review",
  subtitle: "Comprehensive review of all domains",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "quiz", label: "Practice Test", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── QUIZ (Full 27-Question Practice Test 2) ──────── */
  quiz: [
    /* ── BLOCK 1: CONVENTIONS (Q1-5) ── */
    {
      passage:
        "The collection of rare manuscripts, which the library acquired through a series of estate sales over the past decade, ______ now available to researchers for the first time through a new digital archive.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["were", "have been", "is", "are"],
      correct: 2,
      explanation:
        "Subject is \"collection\" (singular), not \"manuscripts.\" The \"which\" clause is parenthetical. Singular subject + present tense = \"is.\"",
      type: "conventions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The geologists discovered that the cave system extended much farther than previously ______ with passages stretching nearly twelve miles beneath the limestone plateau.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["estimated,", "estimated", "estimated:", "estimated;"],
      correct: 0,
      explanation:
        "\"The geologists discovered that the cave system extended much farther than previously estimated\" is a complete main clause. What follows (\"with passages stretching...\") is a participial phrase modifying the main clause. A comma correctly separates the clause from the modifying phrase.",
      type: "conventions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "When the orchestra performs Beethoven's Ninth ______ typically lasts over seventy minutes, making it one of the longest works in the standard symphonic repertoire.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "Symphony; the performance",
        "Symphony the performance",
        "Symphony. The performance,",
        "Symphony, the performance"
      ],
      correct: 3,
      explanation:
        "\"When the orchestra performs Beethoven's Ninth Symphony\" is a dependent clause and needs a comma before the main clause \"the performance typically lasts...\" A correctly uses a comma after the introductory dependent clause.",
      type: "conventions",
      difficulty: "easy",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Each of the proposed amendments to the city charter ______ been reviewed by the legal department and approved by a majority of the committee members before being submitted to voters.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["has", "have", "were", "are"],
      correct: 0,
      explanation:
        "\"Each\" is always singular. \"Each of the proposed amendments\" = each one. Singular subject + present perfect = \"has been reviewed.\"",
      type: "conventions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The documentary filmmaker, known for her immersive style of ______ spent three years living among the nomadic reindeer herders of northern Siberia before beginning to shoot a single frame of footage.",
      stem: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["storytelling:", "storytelling,", "storytelling", "storytelling;"],
      correct: 1,
      explanation:
        "\"Known for her immersive style of storytelling\" is a nonrestrictive appositive phrase modifying \"filmmaker.\" It needs a comma to close the phrase and return to the main verb \"spent.\" B correctly closes the parenthetical.",
      type: "conventions",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── BLOCK 2: VOCABULARY (Q6-9) ── */
    {
      passage:
        "The CEO's announcement that the company would lay off 2,000 workers was met with ______ by the remaining employees, who feared they might be next and grew reluctant to voice concerns or propose changes that might draw attention.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["indifference", "jubilation", "amusement", "trepidation"],
      correct: 3,
      explanation:
        "Feared being next + reluctant to draw attention = fear/anxiety. \"Trepidation\" means fear or anxiety about something that may happen. \"Jubilation\" is joy, \"indifference\" is not caring, \"amusement\" doesn't fit the stakes.",
      type: "vocabulary",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Although the two studies examined the same phenomenon, their conclusions were strikingly ______: the first claimed the effect was significant and robust, while the second found it to be negligible and inconsistent.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["redundant", "similar", "ambiguous", "divergent"],
      correct: 3,
      explanation:
        "\"Significant and robust\" vs. \"negligible and inconsistent\" = opposite conclusions. \"Divergent\" means going in different directions. \"Similar\" is the opposite. \"Ambiguous\" means unclear (both studies are clear, just different). \"Redundant\" means unnecessary.",
      type: "precision",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The diplomat was praised for her ______ approach to the negotiations: rather than demanding immediate concessions, she built trust through small agreements, gradually creating the conditions for a comprehensive deal.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["incremental", "haphazard", "dogmatic", "aggressive"],
      correct: 0,
      explanation:
        "\"Small agreements, gradually\" = step-by-step. \"Incremental\" means happening in small, gradual stages. \"Aggressive\" contradicts the patience. \"Haphazard\" means random. \"Dogmatic\" means rigidly ideological.",
      type: "vocabulary",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Critics praised the novelist's ability to create characters who feel ______ \u2014 not idealized heroes or villains but flawed, contradictory individuals whose motivations resist easy categorization.",
      stem: "Which choice completes the text with the most logical and precise word?",
      choices: ["exotic", "simplistic", "monotonous", "authentic"],
      correct: 3,
      explanation:
        "\"Not idealized\" + \"flawed, contradictory\" + \"resist easy categorization\" = real, true-to-life. \"Authentic\" means genuine, true to reality. \"Exotic\" means unusual, \"simplistic\" contradicts complexity, \"monotonous\" means boring.",
      type: "vocabulary",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── BLOCK 3: CRAFT & STRUCTURE (Q10-13) ── */
    {
      passage:
        "For decades, art historians dismissed the paintings of Artemisia Gentileschi as derivative of her father Orazio's work, attributing her most powerful canvases to him or to unnamed male collaborators. It was not until feminist scholars in the 1970s undertook a systematic reexamination of her oeuvre \u2014 matching brushwork analysis, pigment composition, and archival records of commissions \u2014 that Gentileschi emerged as one of the most technically accomplished painters of the Italian Baroque, whose innovations in depicting dramatic intensity and female agency had no precedent in the work of her father or contemporaries.",
      stem: "Which choice best describes the main purpose of the text?",
      choices: [
        "To describe how scholarly reexamination overturned decades of misattribution and revealed Artemisia Gentileschi's originality",
        "To criticize feminist scholarship in art history",
        "To explain techniques used in Italian Baroque painting",
        "To argue that Orazio Gentileschi was a lesser artist than his daughter"
      ],
      correct: 0,
      explanation:
        "The passage moves from: dismissed/misattributed \u2192 reexamination with evidence \u2192 revealed as original and innovative. The purpose is how scholarly reexamination corrected a historical error.",
      type: "purpose",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The widespread belief that goldfish have a three-second memory is entirely false. Studies have consistently demonstrated that goldfish can remember information for months. In one experiment, researchers trained goldfish to push a lever for food; the fish remembered the correct lever five months later. This finding is part of a broader body of research showing that many animals commonly assumed to lack cognitive abilities possess far more sophisticated mental capacities than popular culture suggests.",
      stem: "Which choice best describes the function of the third sentence in the overall structure of the text?",
      choices: [
        "It contradicts the findings described in the second sentence",
        "It introduces a new topic unrelated to goldfish memory",
        "It provides a specific experimental example that supports the claim made in the second sentence",
        "It transitions to a discussion of human memory"
      ],
      correct: 2,
      explanation:
        "Sentence 2: goldfish remember for months (general claim). Sentence 3: experiment with lever, remembered 5 months later (specific example). The third sentence provides concrete experimental evidence supporting the general claim.",
      type: "function",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Text 1:\nEconomist Dr. Petrov argues that universal basic income (UBI) would reduce poverty without discouraging work. He cites a Finnish pilot program in which 2,000 unemployed citizens received monthly payments; participants were no less likely to seek employment than a control group, and reported significantly lower stress and higher well-being.\n\nText 2:\nEconomist Dr. Tanaka cautions against generalizing from small pilot programs to national policy. She notes that the Finnish study's 2,000 participants knew the program was temporary and that being observed might have influenced their behavior. A permanent, universal program, Tanaka argues, could produce very different labor market effects than a short-term experiment with a small, self-aware sample.",
      stem: "Based on the texts, how would Dr. Tanaka most likely respond to Dr. Petrov's use of the Finnish study?",
      choices: [
        "By suggesting that Finland's economy is too different from other countries for the study to be relevant",
        "By arguing that UBI would definitely discourage work",
        "By contending that the study's small scale, temporary nature, and observation effects limit its applicability to permanent national policy",
        "By agreeing that the Finnish study conclusively proves UBI works"
      ],
      correct: 2,
      explanation:
        "Tanaka's objections are specific: small sample, temporary program, observation effects. She doesn't reject UBI entirely \u2014 she questions whether THIS evidence can justify NATIONAL policy. C captures her methodological concerns.",
      type: "crosstext",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The octopus, despite being an invertebrate with no backbone and a lifespan rarely exceeding two years, demonstrates problem-solving abilities that rival those of some primates. In laboratory settings, octopuses have unscrewed jars from the inside to escape, navigated complex mazes using spatial memory, and even used coconut shells as portable shelters \u2014 a behavior that meets the scientific definition of tool use. These cognitive feats challenge the long-held assumption that complex intelligence requires a vertebrate brain.",
      stem: "Which choice best describes the main purpose of the text?",
      choices: [
        "To describe the daily behavior of octopuses in the wild",
        "To present evidence that octopus intelligence challenges assumptions about the biological requirements for complex cognition",
        "To compare octopuses to primates in detail",
        "To argue that invertebrates are smarter than vertebrates"
      ],
      correct: 1,
      explanation:
        "The passage presents specific cognitive feats (jars, mazes, tools) and concludes they \"challenge the long-held assumption.\" The purpose is to use octopus evidence to question what biology intelligence requires.",
      type: "purpose",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── BLOCK 4: INFORMATION & IDEAS (Q14-20) ── */
    {
      passage:
        "Scientists have long known that trees in forests communicate through underground fungal networks, nicknamed the 'Wood Wide Web,' sharing nutrients and chemical warning signals. New research reveals a more complex picture: these networks are not purely cooperative. Dominant trees can monopolize network resources, and fungi sometimes act as parasites rather than mutualists, extracting more carbon from trees than they return in nutrients. The emerging view is that forest networks, like human economies, involve a dynamic mix of cooperation, competition, and exploitation.",
      stem: "Which choice best states the main idea of the text?",
      choices: [
        "Underground fungal networks in forests involve not just cooperation but also competition and exploitation, resembling complex economic systems",
        "Forest fungal networks are purely cooperative systems that benefit all trees equally",
        "Scientists do not understand how trees communicate",
        "Fungi are parasites that harm trees through underground networks"
      ],
      correct: 0,
      explanation:
        "The passage moves from the cooperative view \u2192 complication (not purely cooperative, also competition/exploitation) \u2192 conclusion (dynamic mix like economies). B captures the full complexity.",
      type: "central",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The Treaty of Tordesillas, signed in 1494 between Spain and Portugal, divided the newly discovered lands of the Americas along a meridian 370 leagues west of the Cape Verde Islands. Lands east of the line would belong to Portugal; lands west to Spain. This arbitrary division, ratified by Pope Alexander VI, is the reason Brazil \u2014 which juts eastward into the Atlantic \u2014 became a Portuguese-speaking nation while virtually every other country in South and Central America speaks Spanish.",
      stem: "According to the passage, what explains why Brazil speaks Portuguese while most of South America speaks Spanish?",
      choices: [
        "Portuguese explorers were more skilled navigators than Spanish explorers",
        "The Treaty of Tordesillas placed Brazil east of the dividing line, assigning it to Portugal's sphere while the rest of the Americas fell under Spain's",
        "Brazil was colonized before the rest of South America",
        "The Pope declared that Brazil should speak Portuguese"
      ],
      correct: 1,
      explanation:
        "The passage explicitly states: the meridian line placed lands east (Brazil juts east) under Portugal and lands west under Spain. B matches this detail directly.",
      type: "detail",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "In 2019, the Japanese art collective teamLab opened a permanent museum in Tokyo consisting entirely of digital art installations \u2014 no physical artworks, no frames, no traditional gallery spaces. Within its first year, the museum attracted 2.3 million visitors, making it the single most visited institution dedicated to a single artist or collective in the world. Notably, the museum's visitor demographics skewed dramatically younger than those of traditional art museums, with 68% of visitors under 35.",
      stem: "Which inference is best supported by the text?",
      choices: [
        "Traditional art museums may need to reconsider their approach if they wish to engage younger audiences, as the teamLab museum's success suggests that immersive, technology-driven experiences appeal to demographics that conventional galleries are not reaching",
        "Digital art is objectively superior to traditional art",
        "Physical art museums will close within the next decade",
        "All art should be digital"
      ],
      correct: 0,
      explanation:
        "Most visited + 68% under 35 + dramatically different from traditional museum demographics = digital/immersive experiences attract young audiences that traditional galleries miss. B draws this inference without overgeneralizing.",
      type: "inference",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A research team studied the relationship between urban green space and mental health outcomes across 30 cities.\n\n| Green space coverage | Depression rate | Anxiety rate | Self-reported well-being |\n| Under 10% | 14.2% | 18.7% | 5.8/10 |\n| 10-20% | 11.8% | 15.3% | 6.4/10 |\n| 20-35% | 9.1% | 12.4% | 7.1/10 |\n| Over 35% | 8.9% | 11.8% | 7.3/10 |",
      stem: "Which claim is best supported by the data in the table?",
      choices: [
        "Cities with green space over 35% have no mental health issues",
        "Green space has no effect on mental health outcomes",
        "Increasing green space is associated with improved mental health outcomes, though the benefits appear to diminish at higher coverage levels \u2014 the largest improvements occur when increasing from under 10% to 20-35%",
        "The data proves that green space causes improved mental health"
      ],
      correct: 2,
      explanation:
        "Depression drops sharply from 14.2\u219211.8\u21929.1 (big drops) then barely changes 9.1\u21928.9. Same pattern for anxiety and well-being. B correctly identifies: consistent association, diminishing returns at high levels, biggest gains in the lower-to-middle range.",
      type: "data",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Psychologist Dr. Okafor argues that the concept of 'grit' \u2014 persistence and passion for long-term goals \u2014 is overstated as a predictor of success. She contends that structural advantages such as wealth, social connections, and educational access play a far larger role than individual character traits.\n\nClaim: Dr. Okafor argues that grit's importance is overstated because structural factors are more predictive of success.",
      stem: "Which finding would most effectively support this claim?",
      choices: [
        "Grit can be measured using validated psychological scales",
        "Dr. Okafor has studied success factors for over fifteen years",
        "A longitudinal study found that students' socioeconomic status predicted college completion rates five times more strongly than their grit scores, and that among students with equal grit levels, those from wealthy families were three times more likely to graduate than those from low-income families",
        "Many successful people describe themselves as hardworking and persistent"
      ],
      correct: 2,
      explanation:
        "The claim: structure > grit. B provides direct comparative evidence: SES predicted success 5x more than grit, and equal grit + different wealth = 3x different outcomes. This shows grit alone doesn't overcome structural barriers.",
      type: "evidence",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "A study found that residents of walkable neighborhoods weigh an average of 8 pounds less than residents of car-dependent suburbs. The researchers concluded that neighborhood walkability directly promotes healthier body weight through increased physical activity.",
      stem: "Which finding, if true, would most weaken this conclusion?",
      choices: [
        "The study included over 10,000 participants",
        "Residents of walkable neighborhoods also had significantly higher incomes and education levels, and were more likely to have chosen their neighborhood specifically because of existing health-conscious lifestyles \u2014 suggesting self-selection rather than neighborhood influence",
        "Walkable neighborhoods often have better access to public transit",
        "Walking is a beneficial form of exercise"
      ],
      correct: 1,
      explanation:
        "The conclusion claims walkability CAUSES lower weight. B reveals self-selection: health-conscious people CHOOSE walkable neighborhoods. The weight difference may reflect pre-existing health behaviors and socioeconomic advantages, not the neighborhood's influence on behavior.",
      type: "weaken",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Archaeologists studying the ancient Indus Valley civilization have been unable to decipher its writing system, known as the Indus script. Unlike Egyptian hieroglyphics, which were decoded using the Rosetta Stone's parallel Greek text, the Indus script has no known bilingual inscription. The longest known Indus text contains only 26 characters, and the average inscription is just five characters long. Many scholars now believe that the Indus script ______",
      stem: "Which choice most logically completes the text?",
      choices: [
        "may never be fully deciphered without the discovery of a longer text or a bilingual inscription that provides an external reference point for interpretation",
        "was understood by all ancient civilizations in the region",
        "was used only for decorative purposes and contained no linguistic meaning",
        "encoded a language identical to modern Hindi"
      ],
      correct: 0,
      explanation:
        "No bilingual key + extremely short texts = insufficient data for decipherment. B is the logical conclusion: we need either longer texts or a bilingual key (like the Rosetta Stone was for hieroglyphics). A overstates (\"no linguistic meaning\" is unproven). C and D aren't supported.",
      type: "completion",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    /* ── BLOCK 5: EXPRESSION & SYNTHESIS (Q21-27) ── */
    {
      passage:
        "The new antibiotic proved remarkably effective in laboratory conditions, eliminating 99.8% of the targeted bacteria in controlled experiments.\n\n______, when tested in actual patients, the drug's effectiveness dropped to 62%, likely because the complex environment of the human body provides bacteria with defenses and hiding places that laboratory cultures cannot replicate.",
      stem: "Which transition most logically connects these sentences?",
      choices: [
        "As expected",
        "Furthermore",
        "In clinical trials, however",
        "Similarly"
      ],
      correct: 2,
      explanation:
        "Lab: 99.8% effective. Patients: 62% effective. This is a contrast between controlled conditions and real-world results. \"In clinical trials, however\" signals both the context shift (lab\u2192trials) and the contradiction.",
      type: "transition",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Notes:\n\u2022 Marie Curie was the first person to win Nobel Prizes in two different scientific disciplines (Physics 1903, Chemistry 1911).\n\u2022 Curie's research on radioactivity was conducted in a converted shed with no proper ventilation or safety equipment.\n\u2022 She carried test tubes of radioactive isotopes in her pockets and stored them in her desk drawer.\n\u2022 Curie died in 1934 of aplastic anemia, almost certainly caused by prolonged radiation exposure.\n\u2022 Her personal notebooks from the 1890s remain so radioactive that they are stored in lead-lined boxes and researchers must wear protective clothing to consult them.\n\nThe writer wants to illustrate the personal cost of Curie's scientific achievements.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Marie Curie worked in a converted shed without proper safety equipment during her early research career.",
        "Curie's notebooks from the 1890s are stored in lead-lined boxes because they are still highly radioactive.",
        "Marie Curie's pioneering research on radioactivity, conducted without safety precautions in a converted shed, ultimately killed her \u2014 her death from radiation-induced anemia in 1934 a direct consequence of the work that made her the only person to win Nobel Prizes in two different sciences, a cost made tangible by the fact that her notebooks remain too radioactive to handle without protective equipment nearly a century later.",
        "Marie Curie won Nobel Prizes in both Physics and Chemistry, the first person to receive the honor in two different scientific disciplines."
      ],
      correct: 2,
      explanation:
        "Goal: PERSONAL COST of ACHIEVEMENTS. B connects achievements (Nobel Prizes) to cost (no safety, death from radiation, notebooks still radioactive). The progression from triumph to sacrifice to lasting physical evidence of the danger illustrates the cost powerfully.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The endangered California condor population dropped to just 22 individuals in 1987, prompting a controversial decision to capture all remaining wild birds for a captive breeding program.\n\n______, the population has rebounded to over 500 birds, with more than 300 now flying free \u2014 making the condor recovery one of the most successful captive breeding programs in conservation history.",
      stem: "Which transition most logically connects these sentences?",
      choices: [
        "For example",
        "In the decades since",
        "In contrast",
        "Nevertheless"
      ],
      correct: 1,
      explanation:
        "Sentence 1: 1987, only 22 birds, captured for breeding. Sentence 2: population now 500+, 300 free. This is a temporal progression showing recovery over time. \"In the decades since\" captures the time elapsed and the consequent improvement.",
      type: "transition",
      difficulty: "medium",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The artist uses color in her paintings.\n\nThe writer wants to convey the visceral, emotional impact of the artist's use of color.",
      stem: "Which revision most effectively accomplishes this goal?",
      choices: [
        "Many art critics have noted that the artist uses color effectively in her paintings.",
        "The artist frequently uses red, blue, and yellow in her paintings.",
        "The artist's canvases assault the viewer with color \u2014 cadmium reds that pulse like open wounds, ultramarine blues so deep they seem to pull the eye inward, and acid yellows that vibrate against their backgrounds with an almost audible hum.",
        "The artist is known for including many colors in her work."
      ],
      correct: 2,
      explanation:
        "Goal: VISCERAL, EMOTIONAL impact. B uses sensory language (\"assault,\" \"pulse like open wounds,\" \"pull the eye inward,\" \"almost audible hum\") and specific pigment names (cadmium red, ultramarine, acid yellow). This is writing that makes you FEEL the color.",
      type: "expression",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Notes:\n\u2022 The Library of Congress is the largest library in the world, with over 170 million items.\n\u2022 The library adds approximately 12,000 items to its collection every working day.\n\u2022 Items include books, recordings, photographs, maps, sheet music, and digital files.\n\u2022 The library's web archive contains over 800 billion web pages preserved from the early internet era.\n\u2022 A complete physical tour of the library's shelves would cover approximately 838 miles.\n\nThe writer wants to convey the almost incomprehensible scale of the library's holdings.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "With over 170 million items spanning 838 miles of shelves, a collection growing by 12,000 items every working day, and a web archive preserving 800 billion pages from the early internet, the Library of Congress operates at a scale that defies ordinary comprehension.",
        "The Library of Congress contains many different types of items including books, recordings, photographs, maps, and digital files.",
        "The Library of Congress adds about 12,000 items per day to its collection of various materials.",
        "The Library of Congress is the world's largest library, containing over 170 million items including books, recordings, and photographs."
      ],
      correct: 0,
      explanation:
        "Goal: INCOMPREHENSIBLE SCALE. C stacks the most staggering numbers: 170 million items, 838 miles of shelves, 12,000 per day, 800 billion web pages \u2014 and explicitly names the effect (\"defies ordinary comprehension\"). A uses one number. B uses one. D lists types without conveying scale.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "The city's decision to replace a six-lane highway with a tree-lined boulevard and public park was initially condemned by commuters and business owners who predicted catastrophic traffic congestion and economic decline.\n\n______, traffic studies two years later showed that 35% of the highway's former users had switched to public transit, cycling, or remote work, and property values along the new boulevard had increased by 22%, attracting restaurants and shops that generated more tax revenue than the businesses displaced by construction.",
      stem: "Which transition most logically connects these sentences?",
      choices: [
        "Contrary to those predictions",
        "As feared",
        "In addition",
        "Predictably"
      ],
      correct: 0,
      explanation:
        "Sentence 1: predicted catastrophe (traffic, economic decline). Sentence 2: reality \u2014 traffic adapted, property values up, more revenue. The outcome contradicted the predictions. \"Contrary to those predictions\" directly signals this reversal.",
      type: "transition",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
    {
      passage:
        "Notes:\n\u2022 The James Webb Space Telescope can observe infrared light from galaxies formed 13.5 billion years ago.\n\u2022 Some of these ancient galaxies appear far larger and more structured than current models of early universe evolution predicted.\n\u2022 Existing models assumed that galaxies needed billions of years to grow to such sizes.\n\u2022 The observations have prompted some cosmologists to reconsider fundamental assumptions about the rate of galaxy formation.\n\u2022 Other scientists caution that the discrepancy may reflect measurement limitations rather than flaws in current models.\n\nThe writer wants to present a scientific discovery alongside the debate it has generated.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "The James Webb Space Telescope has made many important observations since its launch.",
        "The James Webb Space Telescope can observe galaxies that formed 13.5 billion years ago using infrared light.",
        "The Webb telescope's observation of unexpectedly large, structured galaxies in the early universe \u2014 galaxies that existing models say should not yet have existed \u2014 has sparked a scientific debate: while some cosmologists argue the discovery requires rethinking fundamental assumptions about galaxy formation, others caution that the apparent discrepancy may stem from measurement limitations rather than theoretical flaws.",
        "Some scientists believe that current models of galaxy formation may be wrong."
      ],
      correct: 2,
      explanation:
        "Goal: DISCOVERY + DEBATE. B presents the discovery (unexpectedly large early galaxies contradicting models) and BOTH sides of the debate (rethink assumptions vs. measurement limitations). A is just capability. C is one side. D is vague.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Information & Ideas",
      skill: "central_ideas",
    },
  ],

  takeaways: [
    "Compare your results to Practice Test 1 — identify which question types improved and which remain challenging.",
    "Targeted review of your weakest 2-3 question types will yield the fastest score gains.",
    "Each question type you master adds 1-2 correct answers per test.",
    "Focus on question types where you scored below 50% — these represent the highest-leverage improvement opportunities.",
    "Consistent, targeted practice beats random practice — use your results to guide your study plan.",
  ],
};
