"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import {
  SkillsOverview,
  SynthesisProcess,
  TransitionMap,
} from "./lesson-visuals";

export default function SATRWModule15() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "skills-overview": <SkillsOverview />,
        "synthesis-process": <SynthesisProcess />,
        "transition-map": <TransitionMap />,
      }}
      nextModuleHref="/courses/sat-rw/16"
      nextModuleLabel="Module 16: Expression Boss Battle"
    />
  );
}

/* ═══════════════════════════════════════════════════════
 * MODULE 15 — Form, Structure & Sense
 * (Boss Battle format from HTML — data extracted into quiz)
 * ═══════════════════════════════════════════════════════ */

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 15,
  title: "Form, Structure & Sense",
  subtitle: "Sentence placement and paragraph organization",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "quiz", label: "Practice", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  /* ──────── LESSONS ──────── */
  lessons: [
    {
      id: "battle-overview",
      title: "Expression & Strategy Skills",
      subtitle: "Combining everything you've learned",
      body: [
        "This module brings together all of your expression and strategy skills in a comprehensive practice set. You'll face synthesis, transition, expression, concision, and strategy questions at increasing difficulty.",
        "Key skills tested:\n\u2022 Synthesis: Using notes to accomplish a specific writing goal\n\u2022 Transitions: Connecting sentences with the right logical relationship\n\u2022 Expression: Revising to match a stated objective\n\u2022 Concision: Choosing the most efficient phrasing\n\u2022 Strategy: Making smart decisions under time pressure",
        "Remember: For synthesis questions, always read the GOAL first. For transitions, cover the transition word, read both sentences, and identify the relationship before looking at choices.",
      ],
      visual: "skills-overview",
    },
  ],

  /* ──────── QUIZ (Boss Battle Questions) ──────── */
  quiz: [
    /* ═══ PHASE 1: WARM-UP ═══ */
    {
      passage:
        "The museum's renovation expanded gallery space by 40% and added climate-controlled storage for its most fragile artifacts.\n\n______, the museum can now display works that were previously kept in permanent storage due to environmental sensitivity.",
      stem: "Which transition most logically connects these sentences?",
      choices: ["Nevertheless", "As a result", "For instance", "In contrast"],
      correct: 1,
      explanation:
        "Renovation improved climate control (cause) \u2192 can now display fragile works (effect). \"As a result\" correctly signals cause-effect.",
      type: "transition",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "Notes:\n\u2022 The golden poison frog (Phyllobates terribilis) is native to Colombia's Pacific coast.\n\u2022 A single frog produces enough toxin to kill 10 adult humans.\n\u2022 Indigenous Choco people use the frogs' toxin on blowdart tips for hunting.\n\u2022 Scientists are studying the toxin as a potential painkiller 200 times more potent than morphine.\n\u2022 The species is endangered due to habitat destruction from illegal gold mining.\n\nThe writer wants to highlight the frog's potential medical value.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Scientists studying the golden poison frog have discovered that its toxin may serve as the basis for a painkiller 200 times more potent than morphine, potentially transforming pain management.",
        "The golden poison frog, native to Colombia, produces enough toxin to kill 10 adult humans.",
        "The Choco people of Colombia have long used poison frog toxin on their blowdart tips for hunting.",
        "Illegal gold mining in Colombia is destroying the habitat of the golden poison frog."
      ],
      correct: 0,
      explanation:
        "Goal: MEDICAL value. B uses the painkiller note (200x morphine) and connects it to medical impact. A focuses on lethality, C on indigenous use, D on habitat destruction.",
      type: "synthesis",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The new bridge was built to connect the two neighborhoods.\n\nThe writer wants to emphasize the bridge's impact on community connection.",
      stem: "Which revision most effectively accomplishes this goal?",
      choices: [
        "The new bridge, which cost $14 million, was completed on schedule.",
        "The new pedestrian bridge, featuring wide walkways and community gathering spaces at each end, has transformed what was once a 45-minute detour into a five-minute walk, reuniting neighborhoods that had been effectively separated for decades.",
        "The bridge connects two neighborhoods that are near each other.",
        "A bridge was constructed between the neighborhoods."
      ],
      correct: 1,
      explanation:
        "Goal: COMMUNITY CONNECTION impact. B provides specific connection details (pedestrian, gathering spaces, 45min\u21925min, \"reuniting\"). A is bland. C adds no impact. D focuses on cost/timeline.",
      type: "expression",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The restaurant's menu features locally sourced ingredients and seasonal dishes that change monthly.\n\n______, its current autumn menu includes butternut squash ravioli made with squash from a farm less than ten miles away and a pear tart featuring fruit from the restaurant's own orchard.",
      stem: "Which transition most logically connects these sentences?",
      choices: ["In contrast", "For example", "However", "Therefore"],
      correct: 1,
      explanation:
        "Sentence 1: general claim (local, seasonal). Sentence 2: specific dishes illustrating the claim. \"For example\" introduces specific instances of a general pattern.",
      type: "transition",
      difficulty: "easy",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      stem: "Which choice expresses the idea most concisely without losing essential information?",
      choices: [
        "The university, having received a number of applications that was significantly higher than the number they had anticipated receiving, decided that they would extend the deadline by which applications must be submitted.",
        "Because applications increased significantly, the university extended its deadline.",
        "In light of the circumstances surrounding the unprecedented volume of applications that were submitted to the admissions office, university administrators came to the collective determination that an extension of the deadline would be warranted.",
        "Due to the fact that there was a significant increase in the total number of applications received by the admissions office, the university made the decision to extend the deadline for the submission of applications."
      ],
      correct: 1,
      explanation:
        "All four choices convey the same information: applications increased \u2192 deadline extended. B does it in 10 words. A uses 29, C uses 32, D uses 36. B preserves all essential information with maximum concision.",
      type: "concision",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "Notes:\n\u2022 Architect Tadao Ando is known for his minimalist concrete structures.\n\u2022 Ando is self-taught and never attended architecture school.\n\u2022 His Church of the Light (1989) in Osaka uses a cross-shaped opening in the wall to project natural light into the interior.\n\u2022 Ando won the Pritzker Architecture Prize in 1995.\n\u2022 Critics initially dismissed his work as too austere, but his designs are now considered masterpieces of light and space.\n\nThe writer wants to illustrate how Ando's unconventional background informed his distinctive approach to architecture.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Tadao Ando won the prestigious Pritzker Architecture Prize in 1995 for his minimalist concrete structures.",
        "Critics initially dismissed Ando's work as too austere, though his buildings are now considered masterpieces.",
        "Self-taught and unbounded by formal architectural training, Tadao Ando developed a radically minimalist style \u2014 exemplified by his Church of the Light, where a simple cross-shaped opening transforms bare concrete into a space suffused with spiritual luminosity.",
        "Tadao Ando's Church of the Light, built in 1989 in Osaka, features a cross-shaped opening that allows natural light into the interior."
      ],
      correct: 2,
      explanation:
        "Goal: unconventional BACKGROUND \u2192 distinctive APPROACH. B connects self-taught status to the minimalist result, using Church of the Light as the example. A doesn't mention background. C describes the building without connecting to background. D discusses reception, not approach.",
      type: "synthesis",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The study found that the policy had some effects.\n\nThe writer wants to convey the unexpected nature and magnitude of the policy's impact.",
      stem: "Which revision most effectively accomplishes this goal?",
      choices: [
        "The study's results regarding the policy were interesting and noteworthy.",
        "The policy, which was implemented two years ago, had results that were somewhat larger than anticipated.",
        "The study showed that the policy had an impact on the situation.",
        "Against every projection, the policy produced a 340% increase in small business formation \u2014 an outcome so dramatic that the researchers initially suspected a data error before confirming the finding."
      ],
      correct: 3,
      explanation:
        "Goal: UNEXPECTED + MAGNITUDE. C delivers both: \"Against every projection\" (unexpected), \"340% increase\" (magnitude), and \"initially suspected a data error\" (so unexpected they didn't believe it). A, B, D are vague or understated.",
      type: "expression",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The company invested $50 million in developing a fully autonomous delivery drone capable of navigating urban environments.\n\n______, regulatory agencies have not yet approved commercial drone delivery in most metropolitan areas, leaving the technology without a legal framework for deployment.",
      stem: "Which transition most logically connects these sentences?",
      choices: [
        "Moreover",
        "Similarly",
        "To date, however",
        "As a result"
      ],
      correct: 2,
      explanation:
        "Sentence 1: company invested heavily in drone tech. Sentence 2: regulations don't yet permit deployment. The technology exists but can't be used \u2014 a contrast between investment/capability and regulatory reality. \"To date, however\" signals a current limitation countering the positive investment.",
      type: "transition",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    /* ═══ PHASE 2: ESCALATION ═══ */
    {
      passage:
        "Notes:\n\u2022 The Great Pacific Garbage Patch covers approximately 1.6 million square kilometers.\n\u2022 80% of the debris originates from land-based sources, primarily in Asia.\n\u2022 The patch is mostly composed of microplastics too small to see with the naked eye, not large visible debris.\n\u2022 Ocean currents concentrate floating plastic in five major gyres worldwide.\n\u2022 The Ocean Cleanup project has removed over 200,000 kilograms of plastic from the patch since 2021.\n\nThe writer wants to correct a common misconception about the garbage patch while acknowledging cleanup efforts.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Contrary to popular imagery of a visible floating island of trash, the Great Pacific Garbage Patch is primarily composed of microplastics invisible to the naked eye \u2014 a reality that makes cleanup efforts like the Ocean Cleanup project, which has already removed over 200,000 kilograms since 2021, both more challenging and more impressive.",
        "The Great Pacific Garbage Patch is an enormous area of ocean debris covering 1.6 million square kilometers, with most debris originating from Asia.",
        "There are five major garbage patches in the world's oceans, concentrated by ocean current gyres.",
        "The Ocean Cleanup project has been working to remove plastic from the Great Pacific Garbage Patch since 2021."
      ],
      correct: 0,
      explanation:
        "Goal: CORRECT MISCONCEPTION + ACKNOWLEDGE CLEANUP. B does both: corrects the \"visible island\" misconception (actually microplastics) and acknowledges cleanup (200,000 kg removed). A misses the misconception. C misses the misconception. D is about gyres.",
      type: "synthesis",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      stem: "Which choice expresses the idea most concisely without losing essential information?",
      choices: [
        "During their summer excavation, the archaeological team made what was perhaps the most significant discovery of the entire season when they located and identified a burial chamber that had remained completely hidden from and undiscovered by all previous researchers.",
        "It was during the summer that the team of archaeologists was engaged in excavation work at the site and happened upon a burial chamber, one which had apparently never been discovered previously.",
        "The archaeological team, working at the site during the summer excavation season, made the discovery of a previously unknown burial chamber that had not been found or documented by any earlier expeditions to the same location.",
        "The team discovered an unknown burial chamber at the site."
      ],
      correct: 3,
      explanation:
        "Core info: team found an unknown burial chamber. B conveys this in 10 words. The other choices add \"summer,\" \"season,\" \"previous expeditions\" \u2014 details that don't change the essential meaning.",
      type: "concision",
      difficulty: "medium",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The author discusses the history of jazz music.\n\nThe writer wants to establish the author's authority and the scope of the analysis.",
      stem: "Which revision most effectively accomplishes this goal?",
      choices: [
        "Jazz has a long and interesting history that many people enjoy learning about.",
        "Drawing on three decades of archival research, interviews with over 200 musicians, and analysis of more than 5,000 recordings, musicologist Dr. Elaine Patterson traces jazz from its roots in New Orleans funeral marches through bebop, cool jazz, and fusion to its contemporary reinvention in hip-hop sampling.",
        "The author, who has written about music before, provides information about jazz history.",
        "In this book about jazz, the author talks about its history."
      ],
      correct: 1,
      explanation:
        "Goal: AUTHORITY + SCOPE. B establishes authority (three decades, 200 interviews, 5,000 recordings, musicologist title) and scope (New Orleans \u2192 bebop \u2192 cool \u2192 fusion \u2192 hip-hop). A, C, D are vague and establish neither.",
      type: "expression",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The novelist's depiction of small-town life in the American South has been praised for its vivid sense of place, atmospheric detail, and authentic dialogue.\n\n______, the same qualities that make her regional portraits so compelling have limited her readership, as some reviewers have dismissed her work as mere 'local color' rather than literature of universal significance.",
      stem: "Which transition most logically connects these sentences?",
      choices: ["Paradoxically", "As a result", "For instance", "Furthermore"],
      correct: 0,
      explanation:
        "Sentence 1: praised for regional qualities. Sentence 2: those same qualities limited her readership. The strengths ARE the weaknesses \u2014 a paradox. \"Paradoxically\" captures this self-contradicting dynamic where the same traits produce opposite outcomes.",
      type: "transition",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "Notes:\n\u2022 CRISPR gene editing technology was adapted from a natural bacterial immune system.\n\u2022 CRISPR can precisely modify DNA sequences in living organisms.\n\u2022 In 2023, the FDA approved the first CRISPR-based therapy for sickle cell disease.\n\u2022 Ethical concerns include the possibility of heritable 'germline' editing that would affect future generations.\n\u2022 The cost of CRISPR therapies currently ranges from $1-2 million per patient.\n\u2022 More than 40 clinical trials using CRISPR are currently underway for various diseases.\n\nThe writer wants to present CRISPR's medical promise while acknowledging ethical and practical barriers.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "The FDA's 2023 approval of a CRISPR therapy for sickle cell disease marks the beginning of a medical revolution, with over 40 clinical trials now underway \u2014 yet the technology faces significant barriers, including per-patient costs of $1-2 million and unresolved ethical questions about heritable genetic modifications that could affect future generations.",
        "CRISPR gene editing, adapted from bacterial immune systems, can precisely modify DNA in living organisms and has already led to 40 clinical trials.",
        "CRISPR technology raises ethical concerns because germline editing could affect future generations in ways that cannot be predicted.",
        "CRISPR gene editing was adapted from a natural bacterial immune system and can modify DNA sequences precisely."
      ],
      correct: 0,
      explanation:
        "Goal: PROMISE + BARRIERS. B delivers both: promise (FDA approval, 40 trials, medical revolution) and barriers (cost $1-2M, heritable editing ethics). A is promise-only. C is barriers-only. D is technical description.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "A student encounters the following question on the SAT with 12 minutes remaining and 6 questions left:\n\nThe passage discusses the implications of a recent archaeological discovery. The student has read the passage carefully but is torn between choices B and C, both of which seem plausible. The student has already spent 90 seconds on this question.",
      stem: "What is the best strategic approach?",
      choices: [
        "Skip the question entirely and leave it blank",
        "Choose B because it was the first instinct, mark the question, and move on to ensure time for the remaining 5 questions",
        "Spend another 2-3 minutes re-reading the passage to be absolutely certain",
        "Read all four choices two more times to be thorough"
      ],
      correct: 1,
      explanation:
        "12 minutes / 6 questions = 2 minutes each. Already spent 90 seconds. First instinct is usually reliable on the SAT. Mark it (in case you have time to return), choose the stronger option, and move on. A wastes too much time. C is never correct (no penalty for guessing). D is inefficient.",
      type: "strategy",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The building is very old and has historical importance.\n\nThe writer wants to evoke the building's historical gravitas through specific sensory detail.",
      stem: "Which revision most effectively accomplishes this goal?",
      choices: [
        "The historic building has stood for over 200 years and is an important part of the city's heritage.",
        "The building, which was constructed many years ago, is considered historically significant by many scholars.",
        "The Federal-style courthouse, its red brick darkened by two centuries of New England winters, still bears the iron ring where citizens once tethered their horses \u2014 a silent witness to every era from the Revolution to the present.",
        "It is a very old building that matters to people who study history."
      ],
      correct: 2,
      explanation:
        "Goal: GRAVITAS through SENSORY DETAIL. C provides architectural style (Federal), visual detail (darkened brick), time depth (two centuries), specific physical artifact (iron horse ring), and metaphor (\"silent witness\"). Sensory, specific, and evocative.",
      type: "expression",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The theory of continental drift, first proposed by Alfred Wegener in 1912, was ridiculed by the geological establishment for half a century because Wegener could not explain the mechanism by which continents moved.\n\n______, the discovery of seafloor spreading in the 1960s provided the missing mechanism \u2014 tectonic plates driven by convective currents in the mantle \u2014 and Wegener's once-dismissed theory became the foundation of modern geology.",
      stem: "Which transition most logically connects these sentences?",
      choices: [
        "Similarly",
        "Nevertheless",
        "It was not until",
        "Furthermore"
      ],
      correct: 2,
      explanation:
        "Sentence 1: theory ridiculed for 50 years (long failure). Sentence 2: 1960s discovery finally vindicated it. The transition needs to signal a temporal turning point after a long wait. \"It was not until\" captures the delayed vindication perfectly \u2014 something happened ONLY after decades.",
      type: "transition",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    /* ═══ PHASE 3: FINAL STAND ═══ */
    {
      passage:
        "Notes:\n\u2022 The Rosetta Stone was discovered by French soldiers in Egypt in 1799.\n\u2022 The stone contains the same decree written in three scripts: hieroglyphic, demotic, and ancient Greek.\n\u2022 Jean-Francois Champollion deciphered Egyptian hieroglyphics in 1822 using the stone.\n\u2022 Before Champollion's breakthrough, hieroglyphics had been undecipherable for over 1,400 years.\n\u2022 The Rosetta Stone is currently housed in the British Museum; Egypt has repeatedly requested its return.\n\nThe writer wants to argue for the Rosetta Stone's significance as a key to understanding an entire civilization.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Jean-Francois Champollion was a French scholar who deciphered Egyptian hieroglyphics.",
        "By providing the same text in hieroglyphic, demotic, and ancient Greek, the Rosetta Stone gave Jean-Francois Champollion the key to deciphering Egyptian hieroglyphics in 1822 \u2014 unlocking a writing system that had been impenetrable for over 1,400 years and opening the entirety of ancient Egyptian civilization to modern scholarship.",
        "The Rosetta Stone contains writing in three different scripts: hieroglyphic, demotic, and ancient Greek.",
        "The Rosetta Stone, discovered in Egypt in 1799, is currently displayed in the British Museum despite Egypt's requests for its return."
      ],
      correct: 1,
      explanation:
        "Goal: SIGNIFICANCE as KEY to CIVILIZATION. B connects the stone's three scripts to Champollion's decipherment to the unlocking of 1,400 years of impenetrable writing \u2014 showing how one object opened an entire civilization. A is about location/politics. C is description. D is biography.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      stem: "Which choice expresses the idea most concisely without losing essential information?",
      choices: [
        "The researchers came to the conclusion that, based on the totality of the evidence that they had gathered and analyzed over the course of their multi-year investigation, the phenomenon they had been studying could not be adequately explained by any of the existing theoretical frameworks that were currently available.",
        "After years of study, the researchers concluded that no existing theory adequately explains the phenomenon.",
        "It was the researchers' belief, following their extensive and thorough investigation spanning multiple years, that the theoretical models presently available in the field were insufficient and inadequate for the purpose of providing a satisfactory explanation of the phenomenon under investigation.",
        "The researchers, who had spent several years conducting their research study, arrived at the determination that the phenomenon they were investigating was not able to be explained by theories that currently existed in the relevant academic literature."
      ],
      correct: 1,
      explanation:
        "Core meaning: researchers concluded existing theories don't explain the phenomenon. B says this in 16 words. A uses 43 words, C uses 46, D uses 39. All convey identical information \u2014 B is maximally concise.",
      type: "concision",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The city's ambitious plan to convert all public buses to electric power by 2028 has been widely praised by environmental advocates as a model for urban sustainability.\n\n______, the city has secured only 30% of the estimated $800 million needed to purchase the electric fleet, and the sole manufacturer capable of producing buses at the required scale has a three-year order backlog.",
      stem: "Which transition most logically connects these sentences?",
      choices: [
        "In addition",
        "Similarly",
        "As a consequence",
        "The reality, however, is that"
      ],
      correct: 3,
      explanation:
        "Sentence 1: ambitious, praised plan (ideal). Sentence 2: funding gap + manufacturing bottleneck (reality). This is aspiration vs. reality \u2014 a contrast between the praised vision and the practical obstacles. \"The reality, however, is that\" perfectly signals the shift from ideal to actual.",
      type: "transition",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "The scientist made a discovery about the ocean.\n\nThe writer wants to convey the discovery's paradigm-shifting implications for the field.",
      stem: "Which revision most effectively accomplishes this goal?",
      choices: [
        "A marine biologist discovered something new about the ocean.",
        "Dr. Yamamoto's discovery of a vast microbial ecosystem thriving beneath the ocean floor \u2014 in rock formations previously assumed to be sterile \u2014 has upended a foundational assumption of marine biology and expanded the known boundaries of life on Earth.",
        "Dr. Yamamoto found microbes living under the ocean floor, which was an interesting finding.",
        "The ocean contains many things that scientists are still discovering."
      ],
      correct: 1,
      explanation:
        "Goal: PARADIGM-SHIFTING implications. B provides specificity (sub-floor microbial ecosystem, Dr. Yamamoto), the shift (\"upended a foundational assumption\"), and the significance (\"expanded the known boundaries of life on Earth\"). A, C, D are vague and convey no paradigm shift.",
      type: "expression",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "Notes:\n\u2022 Iceland generates nearly 100% of its electricity from renewable sources (geothermal and hydroelectric).\n\u2022 Iceland's unique geology \u2014 sitting atop the Mid-Atlantic Ridge \u2014 provides abundant geothermal energy.\n\u2022 Iceland exports its renewable energy expertise to developing nations.\n\u2022 Despite renewable electricity, Iceland's transportation sector still relies heavily on imported fossil fuels.\n\u2022 Iceland aims to achieve full carbon neutrality by 2040.\n\nThe writer wants to present a nuanced assessment of Iceland's renewable energy achievements and remaining challenges.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Iceland exports its renewable energy expertise to other countries and aims to be carbon neutral by 2040.",
        "Although Iceland generates nearly 100% of its electricity from renewable sources \u2014 a feat enabled by its geothermal-rich geology \u2014 the nation's transportation sector remains dependent on imported fossil fuels, illustrating that even the world's leader in renewable electricity faces significant hurdles in achieving its 2040 carbon neutrality goal.",
        "Iceland generates nearly all its electricity from geothermal and hydroelectric sources, taking advantage of its unique geology atop the Mid-Atlantic Ridge.",
        "Iceland's position on the Mid-Atlantic Ridge gives it access to abundant geothermal energy."
      ],
      correct: 1,
      explanation:
        "Goal: NUANCED \u2014 achievements AND challenges. B delivers both: near-100% renewable electricity (achievement) + transportation fossil fuel dependency (challenge) + 2040 goal framing the gap. A is achievements only. C is two facts. D is geology only.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "A student is about to begin Module 2 of the SAT R&W section. She scored well on Module 1, so she's receiving the harder version of Module 2. She notices that the reading passages seem significantly more complex and the questions more challenging than in Module 1.",
      stem: "What is the most effective strategic mindset for this student?",
      choices: [
        "Rush through the questions as quickly as possible to avoid running out of time",
        "Recognize that receiving the hard module is a positive sign of strong Module 1 performance, maintain confidence, and apply the same strategies \u2014 knowing that on the harder module, each correct answer is worth more toward the final score",
        "Skip all the hard-looking questions and only answer easy ones",
        "Panic \u2014 the harder questions mean she'll probably score poorly"
      ],
      correct: 1,
      explanation:
        "Getting the hard Module 2 is GOOD \u2014 it means strong M1 performance and a higher scoring ceiling. Each correct answer on the hard module contributes more to the final score. The right approach: stay confident, apply strategies, don't rush. A leads to anxiety errors. C sacrifices accuracy. D wastes high-value questions.",
      type: "strategy",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "The philosopher Hannah Arendt argued that evil is most dangerous not when it is dramatic and extraordinary but when it becomes routine \u2014 when ordinary people participate in harmful systems without critical reflection.\n\n______, Arendt coined the phrase 'the banality of evil' to describe how Adolf Eichmann, a key architect of the Holocaust, appeared at his trial not as a monster but as a disturbingly ordinary bureaucrat who had simply followed orders without questioning their moral implications.",
      stem: "Which transition most logically connects these sentences?",
      choices: [
        "Furthermore",
        "In contrast",
        "However",
        "To illustrate this concept"
      ],
      correct: 3,
      explanation:
        "Sentence 1: Arendt's abstract principle (evil becomes routine). Sentence 2: specific example (Eichmann as ordinary bureaucrat). The second sentence ILLUSTRATES the first with a concrete case. \"To illustrate this concept\" signals the move from abstract to specific.",
      type: "transition",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "transitions",
    },
    {
      passage:
        "Notes:\n\u2022 Beethoven composed some of his greatest works, including the Ninth Symphony, while almost entirely deaf.\n\u2022 Beethoven used conversation books where visitors wrote questions and he responded verbally.\n\u2022 He reportedly sawed the legs off his piano to feel vibrations through the floor while composing.\n\u2022 Modern audiological analysis suggests Beethoven's deafness was caused by otosclerosis, a bone disease of the inner ear.\n\u2022 The Ninth Symphony's choral finale, 'Ode to Joy,' has become a universal symbol of human unity.\n\nThe writer wants to emphasize the extraordinary nature of Beethoven's late creative achievement given his disability.",
      stem: "Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Beethoven used conversation books to communicate with visitors because he could not hear their questions.",
        "Composing almost entirely without the sense most essential to his art, Beethoven resorted to extraordinary measures \u2014 sawing the legs off his piano to feel vibrations through the floor \u2014 and produced works of such transcendent power that his Ninth Symphony's finale became a universal symbol of human unity.",
        "The Ninth Symphony, composed late in Beethoven's life, features a famous choral finale known as 'Ode to Joy.'",
        "Beethoven's deafness was likely caused by otosclerosis, a bone disease of the inner ear, according to modern audiological analysis."
      ],
      correct: 1,
      explanation:
        "Goal: EXTRAORDINARY achievement GIVEN disability. B connects deafness (composing without hearing) \u2192 adaptation (sawing piano legs, feeling vibrations) \u2192 result (transcendent works, universal symbol). The progression from limitation through resourcefulness to greatness captures the extraordinary nature.",
      type: "synthesis",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
    {
      passage:
        "Climate change is a problem that affects many places.\n\nThe writer wants to convey the immediacy and human cost of climate change through a specific, grounded example.",
      stem: "Which revision most effectively accomplishes this goal?",
      choices: [
        "Rising sea levels and extreme weather events threaten coastal communities on every continent.",
        "In Dhaka, Bangladesh, where monsoon flooding now submerges entire neighborhoods for weeks each year, a grandmother named Fatima has rebuilt her family's home four times since 2015 \u2014 each time a few feet higher, each time wondering if this will be the year the water doesn't recede.",
        "Climate change is a serious global issue that impacts communities around the world in various ways.",
        "Many scientists believe that climate change will have significant effects on the planet in the coming decades."
      ],
      correct: 1,
      explanation:
        "Goal: IMMEDIACY + HUMAN COST through SPECIFIC example. C provides a real place (Dhaka), a real person (Fatima), concrete details (rebuilt 4 times, higher each time), and emotional resonance (\"wondering if this will be the year\"). This is the most grounded, immediate, human version of the abstract concept.",
      type: "expression",
      difficulty: "hard",
      domain: "Expression of Ideas",
      skill: "rhetorical_synthesis",
    },
  ],

  takeaways: [
    "For synthesis: read the GOAL first every time — circle exactly which notes match the goal.",
    "For transitions: cover the word, identify the relationship between the sentences, then match.",
    "For expression: match the revision to the EXACT stated objective — look for specificity and precision.",
    "Flag and move after 90 seconds — never leave blanks, bank time from easy questions.",
    "Expression & Strategy covers ~20% of the SAT R&W section — mastering synthesis and transitions is high-value.",
  ],
};
