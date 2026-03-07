"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  SampleQuestionVisual,
  ThreeStepVisual,
  FiveGoalsVisual,
} from "./lesson-visuals";

const GOL_EXERCISE: FillInItem[] = [
  {
    "prompt": "The student wants to highlight a key difference between the two conservation strategies.",
    "answer": 1,
    "solution": "Keywords: \"highlight a key difference\" → Compare/Contrast. The answer must mention BOTH strategies and show how they differ."
  },
  {
    "prompt": "The student wants to provide an overview of the research findings for a general audience.",
    "answer": 0,
    "solution": "Keywords: \"provide an overview\" → Summarize. The answer should cover the main points broadly without getting into minor details."
  },
  {
    "prompt": "The student wants to make a compelling case for increasing public transit funding.",
    "answer": 2,
    "solution": "Keywords: \"make a compelling case\" → Argue. The answer must present a position AND include the strongest supporting evidence."
  },
  {
    "prompt": "The student wants to emphasize the unexpected scale of the discovery.",
    "answer": 4,
    "solution": "Keywords: \"emphasize the unexpected scale\" → Emphasize. Look for the answer that foregrounds the most impressive detail."
  },
  {
    "prompt": "The student wants to explain how the new technology works.",
    "answer": 3,
    "solution": "Keywords: \"explain how\" → Describe/Explain. The answer should clearly convey the process or mechanism."
  },
  {
    "prompt": "The student wants to stress the urgency of addressing climate change in coastal cities.",
    "answer": 4,
    "solution": "Keywords: \"stress the urgency\" → Emphasize. The answer should foreground the most alarming or time-sensitive information."
  },
  {
    "prompt": "The student wants to contrast the economic impacts of the two policies.",
    "answer": 1,
    "solution": "Keywords: \"contrast the economic impacts\" → Compare/Contrast. Must mention BOTH policies and their different economic effects."
  },
  {
    "prompt": "The student wants to introduce the topic of vertical farming to readers unfamiliar with it.",
    "answer": 0,
    "solution": "Keywords: \"introduce the topic...unfamiliar\" → Summarize. Needs a broad, accessible overview."
  }
];

const NTS_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Title: Notes on coral reef restoration\n\nNotes:\n\u2022 Coral reefs support approximately 25% of all marine species.\n\u2022 A team at the University of Hawaii has developed a method to grow coral fragments in underwater nurseries.\n\u2022 The fragments can be transplanted to damaged reefs, where they grow 40 times faster than natural coral.\n\u2022 The project has restored over 100 acres of reef since 2018.\n\u2022 Coral reefs worldwide have declined by 50% over the past 30 years due to ocean warming.\n\nGoal: emphasize the success of the restoration effort",
    "options": [
      "Bullets 2, 3, and 4 (method, speed, and acreage restored)",
      "All five bullets",
      "Bullets 1, 2, and 3 (biodiversity, method, and speed)",
      "Bullets 1 and 5 (biodiversity and decline)"
    ],
    "correct": 0,
    "explanation": "The goal is to emphasize SUCCESS. Bullet 2 (method), 3 (40x faster growth), and 4 (100 acres restored) are the success metrics. Bullet 1 (importance) and 5 (decline) provide context but don\u2019t demonstrate the restoration\u2019s success."
  },
  {
    "prompt": "Title: Notes on two electric vehicle companies\n\nNotes:\n\u2022 Company A produces sedans priced at $35,000\u2013$50,000 with a range of 250\u2013350 miles.\n\u2022 Company B produces SUVs and trucks priced at $55,000\u2013$80,000 with a range of 200\u2013300 miles.\n\u2022 Company A sold 450,000 vehicles in 2023.\n\u2022 Company B sold 120,000 vehicles in 2023.\n\u2022 Both companies plan to open new factories in the southeastern United States.\n\nGoal: contrast the two companies\u2019 product strategies",
    "options": [
      "Bullets 1, 2, and 5 (products and expansion)",
      "Bullets 1 and 2 (vehicle types, prices, and ranges)",
      "All five bullets",
      "Bullets 3 and 4 (sales figures)"
    ],
    "correct": 1,
    "explanation": "The goal is to contrast PRODUCT STRATEGIES (what they make, pricing, features). Bullets 1 and 2 directly compare vehicle types, prices, and ranges. Bullets 3\u20134 are about sales (not strategy). Bullet 5 shows similarity, not contrast."
  },
  {
    "prompt": "Title: Notes on sleep research\n\nNotes:\n\u2022 A 2023 study at Stanford tracked 500 adults over two years.\n\u2022 Participants who slept fewer than 6 hours per night had a 33% higher risk of cardiovascular disease.\n\u2022 Participants who slept 7\u20138 hours showed the lowest risk across all health metrics.\n\u2022 The study controlled for diet, exercise, and pre-existing conditions.\n\u2022 Dr. Sarah Chen, the lead researcher, called the findings \u201Ca wake-up call for public health policy.\u201D\n\nGoal: make an argument for workplace policies that encourage adequate sleep",
    "options": [
      "Bullets 1 and 4 (study design and controls)",
      "Bullets 2 and 3 (risk data)",
      "Bullet 5 only (expert quote)",
      "Bullets 2, 3, and 5 (risks, optimal sleep, and expert call to action)"
    ],
    "correct": 3,
    "explanation": "To ARGUE for workplace policies, you need both the alarming evidence (bullets 2\u20133: health risks and optimal range) AND the call to action (bullet 5: \"wake-up call for public health policy\"). Bullet 1 is study design background, and bullet 4 is methodology \u2014 less persuasive for an argument."
  }
];

const SYN_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Title: Notes on the James Webb Space Telescope\n\nNotes:\n\u2022 The James Webb Space Telescope (JWST) was launched on December 25, 2021.\n\u2022 It cost approximately $10 billion and took over 20 years to develop.\n\u2022 JWST orbits the Sun at a point 1 million miles from Earth.\n\u2022 Its infrared instruments can detect light from galaxies that formed 13.5 billion years ago.\n\u2022 Within its first year, JWST produced images that challenged existing models of early galaxy formation.\n\nGoal: emphasize the scientific impact of the JWST",
    "options": [
      "Launched on December 25, 2021, the James Webb Space Telescope cost approximately $10 billion and took over 20 years to develop.",
      "By detecting light from galaxies that formed 13.5 billion years ago, the James Webb Space Telescope has produced images that challenged existing models of early galaxy formation within its first year of operation.",
      "The James Webb Space Telescope orbits the Sun at a point 1 million miles from Earth, far beyond the Moon\u2019s orbit.",
      "The James Webb Space Telescope, which cost $10 billion, was launched in 2021 and orbits 1 million miles from Earth."
    ],
    "correct": 1,
    "explanation": "The goal is SCIENTIFIC IMPACT. C combines the telescope\u2019s capability (13.5 billion-year-old light) with its result (challenged existing models) \u2014 this IS the impact. A and D focus on cost/logistics. B focuses on location."
  },
  {
    "prompt": "Title: Notes on urban beekeeping\n\nNotes:\n\u2022 Urban beekeeping has grown by 300% in major U.S. cities since 2015.\n\u2022 City bees often produce more honey per hive than rural bees due to diverse urban plant life.\n\u2022 New York, Chicago, and San Francisco have all legalized rooftop beekeeping.\n\u2022 Some ecologists warn that too many honeybees in cities may outcompete native pollinators for resources.\n\u2022 A 2022 study found that urban bee colonies had lower rates of certain parasitic infections than rural colonies.\n\nGoal: present a balanced view of urban beekeeping that acknowledges both benefits and concerns",
    "options": [
      "Some ecologists are concerned that the 300% growth in urban beekeeping since 2015 may threaten native pollinator populations in major cities.",
      "While urban beekeeping offers benefits such as higher honey production and lower parasite infection rates, ecologists warn it may harm native pollinators by increasing competition for resources.",
      "City bees produce more honey and have lower infection rates than rural bees, according to a 2022 study.",
      "Urban beekeeping has grown by 300% since 2015, with cities like New York, Chicago, and San Francisco legalizing rooftop hives."
    ],
    "correct": 1,
    "explanation": "The goal is BALANCED (both benefits AND concerns). Only C presents BOTH sides: benefits (honey, lower infections) and concerns (harm to native pollinators). A and B are positive only. D is negative only."
  },
  {
    "prompt": "Title: Notes on the Dead Sea\n\nNotes:\n\u2022 The Dead Sea, located between Israel and Jordan, sits at 430 meters below sea level \u2014 the lowest point on Earth\u2019s surface.\n\u2022 Its salt concentration is approximately 34%, nearly 10 times saltier than the ocean.\n\u2022 The high salinity allows swimmers to float effortlessly on the surface.\n\u2022 The Dead Sea has been shrinking by approximately 1 meter per year since the 1960s due to water diversion from the Jordan River.\n\u2022 Tourism to the Dead Sea generates over $1 billion annually for the surrounding region.\n\nGoal: explain why the Dead Sea is a popular tourist destination",
    "options": [
      "The Dead Sea has been shrinking by about 1 meter per year since the 1960s because of water diversion from the Jordan River.",
      "The Dead Sea sits at the lowest point on Earth\u2019s surface, 430 meters below sea level, between Israel and Jordan.",
      "With a salt concentration 10 times that of the ocean, the Dead Sea allows visitors to float effortlessly on its surface, contributing to a tourism industry worth over $1 billion annually.",
      "Located between Israel and Jordan, the Dead Sea is approximately 34% salt, making it nearly 10 times saltier than the ocean."
    ],
    "correct": 2,
    "explanation": "The goal is explaining tourist POPULARITY. B connects the unique experience (floating from high salinity) to tourism revenue ($1 billion) \u2014 explaining WHY people visit and how popular it is. A is geography. C is about shrinkage. D is a fact about salinity without connecting to tourism."
  }
];

const DIF_EXERCISE: MatchingItem[] = [
  {
    "prompt": "Title: Notes on the Amazon rainforest\n\nNotes:\n\u2022 The Amazon rainforest covers approximately 5.5 million square kilometers across nine South American countries.\n\u2022 It contains an estimated 10% of all species on Earth, including over 40,000 plant species and 1,300 bird species.\n\u2022 Deforestation has destroyed roughly 17% of the Amazon since 1970, primarily for cattle ranching and soy farming.\n\u2022 Indigenous communities have lived in and managed the Amazon for thousands of years.\n\u2022 A 2023 study found that intact sections of the Amazon absorb 2 billion tons of CO<sub>2</sub> annually, making it a critical buffer against climate change.\n\nGoal: summarize the key facts about the Amazon rainforest for a geography report",
    "options": [
      "Indigenous communities have managed the Amazon for thousands of years, preserving its 40,000 plant species.",
      "Spanning 5.5 million square kilometers across nine countries and containing 10% of all species on Earth, the Amazon rainforest is one of the planet\u2019s most biodiverse ecosystems.",
      "The Amazon absorbs 2 billion tons of CO<sub>2</sub> annually, making it critical in the fight against climate change.",
      "Deforestation has destroyed 17% of the Amazon since 1970, threatening the 10% of Earth\u2019s species that live there."
    ],
    "correct": 1,
    "explanation": "SUMMARIZE for geography: needs the broadest overview (size, location, biodiversity). B covers all three. A focuses only on threats. C focuses only on indigenous management. D focuses only on climate role."
  },
  {
    "prompt": "Title: Notes on the Amazon rainforest\n\nNotes:\n\u2022 The Amazon rainforest covers approximately 5.5 million square kilometers across nine South American countries.\n\u2022 It contains an estimated 10% of all species on Earth, including over 40,000 plant species and 1,300 bird species.\n\u2022 Deforestation has destroyed roughly 17% of the Amazon since 1970, primarily for cattle ranching and soy farming.\n\u2022 Indigenous communities have lived in and managed the Amazon for thousands of years.\n\u2022 A 2023 study found that intact sections of the Amazon absorb 2 billion tons of CO<sub>2</sub> annually, making it a critical buffer against climate change.\n\nGoal: argue for stronger protections against Amazon deforestation",
    "options": [
      "The Amazon covers 5.5 million square kilometers and contains over 40,000 plant species and 1,300 bird species.",
      "Indigenous communities have lived in the Amazon for thousands of years.",
      "Since deforestation has already destroyed 17% of the Amazon \u2014 home to 10% of Earth\u2019s species and a carbon sink absorbing 2 billion tons of CO<sub>2</sub> annually \u2014 stronger protections are urgently needed to prevent further irreversible losses.",
      "A 2023 study found that intact Amazon forest absorbs 2 billion tons of CO<sub>2</sub> per year."
    ],
    "correct": 2,
    "explanation": "ARGUE for protections: needs evidence of what\u2019s at stake + a call to action. C combines the threat (17% destroyed), the stakes (biodiversity + climate), and an argumentative conclusion (\"urgently needed\"). A is descriptive. B and D provide facts without arguing."
  },
  {
    "prompt": "Title: Notes on the Amazon rainforest\n\nNotes:\n\u2022 The Amazon rainforest covers approximately 5.5 million square kilometers across nine South American countries.\n\u2022 It contains an estimated 10% of all species on Earth, including over 40,000 plant species and 1,300 bird species.\n\u2022 Deforestation has destroyed roughly 17% of the Amazon since 1970, primarily for cattle ranching and soy farming.\n\u2022 Indigenous communities have lived in and managed the Amazon for thousands of years.\n\u2022 A 2023 study found that intact sections of the Amazon absorb 2 billion tons of CO<sub>2</sub> annually, making it a critical buffer against climate change.\n\nGoal: emphasize the Amazon\u2019s role in combating climate change",
    "options": [
      "The Amazon spans nine South American countries and has lost 17% of its forest cover since 1970.",
      "Absorbing an estimated 2 billion tons of CO<sub>2</sub> every year, the intact Amazon rainforest serves as one of Earth\u2019s most critical buffers against climate change.",
      "With over 40,000 plant species and 1,300 bird species, the Amazon is Earth\u2019s most biodiverse ecosystem.",
      "Indigenous communities have sustainably managed the Amazon rainforest for thousands of years."
    ],
    "correct": 1,
    "explanation": "EMPHASIZE climate role: foreground the CO<sub>2</sub> absorption data. D leads with the impressive number (2 billion tons) and ends with the emphatic conclusion (\"most critical buffers against climate change\"). A, B, and C don\u2019t focus on climate."
  }
];

export default function PSAT89RWModule9() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "sample-question": <SampleQuestionVisual />,
        "three-step": <ThreeStepVisual />,
        "five-goals": <FiveGoalsVisual />,
      }}
      activities={{
        "exercise-gol": (goNext: () => void) => (
          <FillInExercise
            items={GOL_EXERCISE}
            title="Goal Identifier"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-nts": (goNext: () => void) => (
          <MatchingExercise
            items={NTS_EXERCISE}
            title="Note Selector"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-syn": (goNext: () => void) => (
          <MatchingExercise
            items={SYN_EXERCISE}
            title="Synthesis Practice"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-dif": (goNext: () => void) => (
          <MatchingExercise
            items={DIF_EXERCISE}
            title="Same Notes, Different Goals"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/psat89-rw/10"
      nextModuleLabel="Module 10: Full Test Strategy & Timed Practice"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "rw",
  moduleNum: 9,
  title: "Rhetorical Synthesis",
  subtitle:
    "What It Looks Like",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-gol", label: "Goal Identifier", icon: "zap" },
    { id: "exercise-nts", label: "Note Selector", icon: "zap" },
    { id: "exercise-syn", label: "Synthesis Practice", icon: "zap" },
    { id: "exercise-dif", label: "Same Notes, Different Goals", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "sample",
      title: "Anatomy of a Rhetorical Synthesis Question",
      subtitle: "What It Looks Like",
      body: ["Here's the format you'll see on test day. Study each component:","Instead of a passage, you see a set of bulleted notes. Instead of \"What does the author mean?\", the question asks \"Which sentence effectively uses the notes to accomplish [specific goal]?\" Once you understand the format, these become reliable points."],
      visual: "sample-question",
    },
    {
      id: "9a",
      title: "The Three-Step Method for Synthesis",
      subtitle: "Topic 9A — Goal → Select → Evaluate",
      body: ["The key insight: the GOAL in the question tells you everything. Different goals require different notes.","Step 1 — GOAL: Read the question stem. Underline the rhetorical goal. What is the student trying to do?\nStep 2 — SELECT: Which bullet points are relevant to that goal? Cross out notes that don’t serve the goal.\nStep 3 — EVALUATE: Which answer choice uses the RIGHT notes AND connects them in a way that achieves the goal?","Why the Goal Matters Most:\nThe same set of notes can produce DIFFERENT correct answers depending on the goal. All four answer choices will use information from the notes — but only one uses the right information arranged to achieve the specific goal.","In the example above: The goal is \"emphasize ongoing significance.\" A and B focus on the PAST (launch, original mission). D is a chronological summary. Only C emphasizes that Voyager is STILL significant today (\"continues to transmit\")."],
      visual: "three-step",
    },
    {
      id: "9b",
      title: "The Five Goal Types",
      subtitle: "Topic 9B — Summarize, Compare, Argue, Describe & Emphasize",
      body: ["Nearly every rhetorical synthesis question uses one of five goal types. Learn to recognize each one and you'll know exactly what to look for.","1. Summarize\nCue words: \"present an overview,\" \"introduce the topic,\" \"summarize the research\"\nWhat to look for: The answer that covers the MOST important points without getting lost in minor details. Broad + accurate.","2. Compare / Contrast\nCue words: \"highlight a difference,\" \"compare the two,\" \"contrast X and Y\"\nWhat to look for: The answer that mentions BOTH things being compared and shows how they differ (or are similar). Must include information about BOTH sides.","3. Argue / Persuade\nCue words: \"make an argument,\" \"support the claim that,\" \"convince the reader\"\nWhat to look for: The answer that presents a clear position AND includes the strongest supporting evidence from the notes.","4. Describe / Explain\nCue words: \"describe the process,\" \"explain how,\" \"present the findings\"\nWhat to look for: The answer that accurately conveys the relevant information clearly. Usually the most straightforward goal.","5. Emphasize\nCue words: \"emphasize the significance,\" \"highlight the impact,\" \"stress the importance\"\nWhat to look for: The answer that foregrounds the MOST impressive or impactful detail, often placing it in the emphatic position (end of sentence).","Common trap: An answer choice that uses accurate information from the notes but serves the WRONG goal. Every choice may be factually correct — the question isn’t asking \"which is true?\" but \"which achieves the goal?\""],
      visual: "five-goals",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      passage: "Notes: \"Notes on monarch butterfly migration\"\n\n• Monarch butterflies migrate up to 3,000 miles from Canada and the northern U.S. to central Mexico each fall.\n• The journey takes approximately two months and spans multiple generations of butterflies.\n• Monarchs navigate using a combination of the Sun’s position and Earth’s magnetic field.\n• Habitat loss and pesticide use have reduced the monarch population by an estimated 80% since the 1990s.\n• Conservation groups have launched milkweed planting campaigns, as milkweed is the only plant on which monarchs lay their eggs.",
      stem: "Which choice most effectively uses relevant information from the notes to emphasize the navigational abilities of monarch butterflies?",
      choices: ["Monarch butterflies lay their eggs exclusively on milkweed plants and migrate from northern regions to central Mexico each fall.", "Conservation groups have launched milkweed planting campaigns to help monarch butterflies, whose population has declined by 80%.", "Navigating by the Sun’s position and Earth’s magnetic field, monarch butterflies complete a 3,000-mile journey from Canada to Mexico — a feat that spans two months and multiple generations.", "Monarch butterflies migrate up to 3,000 miles each fall, but their population has declined by 80% since the 1990s."],
      correct: 2,
      explanation: "EMPHASIZE navigation: C foregrounds the HOW (Sun + magnetic field) and connects it to the impressive WHAT (3,000 miles, two months, multiple generations). A buries navigation. B and D don’t mention navigation at all.",
    },
    {
      passage: "Notes: \"Notes on two ancient writing systems\"\n\n• Cuneiform was developed in Mesopotamia around 3400 BCE using wedge-shaped marks pressed into clay tablets.\n• Egyptian hieroglyphs emerged around 3200 BCE and used pictorial symbols carved into stone or painted on papyrus.\n• Cuneiform was used primarily for trade records, legal documents, and administrative texts.\n• Hieroglyphs served religious and ceremonial purposes and were often found in temples and tombs.\n• Both systems remained in use for over 3,000 years before being replaced.",
      stem: "Which choice most effectively uses relevant information from the notes to contrast the primary purposes of cuneiform and hieroglyphs?",
      choices: ["Cuneiform and Egyptian hieroglyphs are two of the oldest writing systems in human history, both lasting over 3,000 years.", "Developed around 3400 BCE in Mesopotamia, cuneiform is one of the earliest known writing systems.", "Cuneiform used wedge-shaped marks on clay tablets, whereas hieroglyphs used pictorial symbols on stone and papyrus.", "While cuneiform was used primarily for practical purposes like trade and legal records, Egyptian hieroglyphs served mainly religious and ceremonial functions in temples and tombs."],
      correct: 3,
      explanation: "CONTRAST purposes: B mentions BOTH systems and directly contrasts their functions (practical/trade vs. religious/ceremonial). A compares longevity, not purpose. C contrasts physical form, not purpose. D only discusses cuneiform.",
    },
    {
      passage: "Notes: \"Notes on vertical farming\"\n\n• Vertical farms grow crops in stacked indoor layers using LED lights and hydroponic systems.\n• They use approximately 95% less water than traditional outdoor farming.\n• Vertical farms can operate year-round regardless of climate or season.\n• The startup costs for a vertical farm range from $2 million to $10 million.\n• Leafy greens and herbs are the most commonly grown vertical farm crops.",
      stem: "Which choice most effectively uses relevant information from the notes to introduce the concept of vertical farming to readers unfamiliar with it?",
      choices: ["Because vertical farms use 95% less water, they represent a promising solution to agricultural water scarcity.", "Vertical farms use 95% less water than traditional farms and can grow crops year-round, though they require $2–10 million in startup costs.", "Leafy greens and herbs are the most commonly grown crops in vertical farms, which cost between $2 million and $10 million to establish.", "Vertical farming — a method of growing crops in stacked indoor layers using LED lights and hydroponic systems — uses 95% less water than traditional farming and can operate year-round regardless of climate."],
      correct: 3,
      explanation: "INTRODUCE to unfamiliar readers: B defines what vertical farming IS (stacked layers, LEDs, hydroponics) before listing key advantages. A skips the definition. C leads with crops, not the concept. D assumes the reader already knows what vertical farming is.",
    },
    {
      passage: "Notes: \"Notes on the Rosetta Stone\"\n\n• The Rosetta Stone was discovered by French soldiers in Egypt in 1799.\n• It contains the same text written in three scripts: Greek, Demotic, and hieroglyphics.\n• French scholar Jean-François Champollion deciphered the hieroglyphic script in 1822 by comparing it to the known Greek text.\n• Before Champollion’s breakthrough, Egyptian hieroglyphics had been undecipherable for over 1,400 years.\n• The Rosetta Stone has been housed in the British Museum since 1802.",
      stem: "Which choice most effectively uses relevant information from the notes to explain how the Rosetta Stone enabled the decipherment of hieroglyphics?",
      choices: ["The Rosetta Stone contains text written in three scripts: Greek, Demotic, and hieroglyphics.", "Because the Rosetta Stone presented the same text in Greek and hieroglyphics, Champollion was able to decipher the previously unreadable hieroglyphic script in 1822 by comparing it to the known Greek translation.", "Egyptian hieroglyphics were undecipherable for over 1,400 years before Jean-François Champollion decoded them in 1822.", "Discovered in Egypt in 1799, the Rosetta Stone has been housed in the British Museum since 1802."],
      correct: 1,
      explanation: "EXPLAIN HOW: C walks through the mechanism — same text in both scripts allowed comparison, which enabled decipherment. A is about location/history. B describes the stone but not the process. D states the result without explaining how.",
    },
    {
      passage: "Notes: \"Notes on two renewable energy approaches\"\n\n• Solar panel efficiency has increased from 6% in 1960 to over 22% in 2024.\n• Wind turbines now generate electricity at a cost of 2–5 cents per kilowatt-hour, competitive with fossil fuels.\n• Solar energy production drops significantly on cloudy days and stops entirely at night.\n• Wind energy output depends on wind speed and can be unpredictable in many regions.\n• Battery storage technology has improved but remains expensive, costing $150–$300 per kilowatt-hour.",
      stem: "Which choice most effectively uses relevant information from the notes to highlight a shared challenge facing both solar and wind energy?",
      choices: ["Both solar and wind energy face the challenge of inconsistent output — solar production drops on cloudy days and stops at night, while wind energy depends on unpredictable wind speeds — and battery storage remains expensive.", "Solar panel efficiency has improved dramatically, rising from 6% in 1960 to over 22% today.", "Solar energy stops entirely at night, which is a significant limitation of the technology.", "Wind turbines generate electricity at 2–5 cents per kilowatt-hour, making wind energy cost-competitive with fossil fuels."],
      correct: 0,
      explanation: "HIGHLIGHT SHARED CHALLENGE: C mentions BOTH sources, identifies the shared problem (inconsistent output), gives specific examples for each, and adds the battery storage complication. A and B are positive about only one source. D only discusses solar.",
    },
    {
      passage: "Notes: \"Notes on the history of animation\"\n\n• The first animated feature film, El Apóstol, was produced in Argentina in 1917.\n• Walt Disney’s Snow White and the Seven Dwarfs (1937) was the first full-color, full-length animated feature.\n• Pixar’s Toy Story (1995) was the first feature film made entirely with computer-generated imagery (CGI).\n• Today, animated films regularly gross over $1 billion worldwide at the box office.\n• Hand-drawn animation has largely been replaced by CGI, though studios like Studio Ghibli in Japan continue the traditional technique.",
      stem: "Which choice most effectively uses relevant information from the notes to describe the technological evolution of animated filmmaking?",
      choices: ["Studio Ghibli in Japan continues to produce hand-drawn animation, even as most studios have shifted to CGI.", "From the first animated feature in 1917 to Disney’s pioneering use of full color in 1937 to Pixar’s introduction of CGI in 1995, animated filmmaking has undergone a series of technological transformations.", "Toy Story, released in 1995, was the first feature film produced entirely with computer-generated imagery.", "Animated films regularly gross over $1 billion worldwide, demonstrating the genre’s enormous commercial success."],
      correct: 1,
      explanation: "DESCRIBE EVOLUTION: C traces the chronological development across three milestones (1917, 1937, 1995), showing progression. A is about commercial success. B is about one studio’s resistance. D covers only one milestone.",
    },
    {
      passage: "Notes: \"Notes on urban heat islands\"\n\n• Urban areas can be 5–10°F warmer than surrounding rural areas, a phenomenon known as the urban heat island effect.\n• Dark surfaces like asphalt and rooftops absorb and re-emit solar heat, raising local temperatures.\n• Heat islands increase energy consumption for air conditioning by 15–20% in affected cities.\n• Cities like Los Angeles and Phoenix have begun painting rooftops and roads with reflective white coatings to reduce heat absorption.\n• A 2021 study found that urban heat disproportionately affects low-income neighborhoods, which often have fewer trees and more pavement.",
      stem: "Which choice most effectively uses relevant information from the notes to argue that urban heat islands are an issue of environmental justice?",
      choices: ["Urban heat islands occur because dark surfaces like asphalt absorb solar heat, making cities 5–10°F warmer than rural areas.", "Urban heat islands increase air conditioning costs by 15–20%, making them a significant energy concern for growing cities.", "Cities like Los Angeles and Phoenix have started painting surfaces with reflective coatings to combat urban heat islands.", "Because urban heat disproportionately affects low-income neighborhoods — which often have fewer trees and more pavement — addressing the heat island effect is not just an environmental issue but a matter of environmental justice."],
      correct: 3,
      explanation: "ARGUE for environmental justice: D connects the equity data (disproportionate impact on low-income areas, fewer trees, more pavement) to an explicit justice claim. A explains the science. B describes solutions. C focuses on energy costs.",
    },
    {
      passage: "Notes: \"Notes on octopus intelligence\"\n\n• Octopuses have approximately 500 million neurons, about two-thirds of which are located in their arms rather than their central brain.\n• In laboratory tests, octopuses have solved mazes, opened jars, and used coconut shells as portable shelters.\n• Unlike most intelligent species, octopuses are solitary and do not engage in social learning.\n• Octopuses have the largest brain-to-body ratio of any invertebrate.\n• Their short lifespan of 1–5 years means each octopus must learn everything independently, without parental guidance.",
      stem: "Which choice most effectively uses relevant information from the notes to highlight what makes octopus intelligence unusual compared to other intelligent animals?",
      choices: ["Unlike most intelligent species that rely on social learning, octopuses develop their remarkable cognitive abilities — from solving mazes to using tools — entirely independently within a lifespan of just 1–5 years, with most neurons distributed across their arms rather than centralized in a brain.", "Octopuses are solitary creatures that do not learn from parents or peers, yet they can solve complex problems in laboratory settings.", "In lab tests, octopuses have demonstrated impressive problem-solving abilities, including solving mazes and opening jars.", "Octopuses have approximately 500 million neurons and the largest brain-to-body ratio of any invertebrate."],
      correct: 0,
      explanation: "HIGHLIGHT what’s UNUSUAL: C weaves together the key contrasts with other intelligent animals (no social learning, short lifespan, decentralized neurons) alongside evidence of ability (mazes, tools). A lists facts without the comparison. B shows ability but not what’s unusual. D is too brief.",
    },
    {
      passage: "Notes: \"Notes on two approaches to language preservation\"\n\n• The Endangered Languages Project, run by a university consortium, documents dying languages through audio and video recordings stored in a digital archive.\n• The Māori Language Commission in New Zealand promotes Māori by integrating it into schools, government, and media, resulting in a 20% increase in fluent speakers since 2001.\n• Over 40% of the world’s approximately 7,000 languages are considered endangered.\n• Documentation preserves a linguistic record but does not necessarily produce new speakers.\n• Revitalization programs require significant government funding and community participation but can restore languages to active daily use.",
      stem: "Which choice most effectively uses relevant information from the notes to contrast the two preservation approaches and their outcomes?",
      choices: ["Over 40% of the world’s 7,000 languages are endangered, prompting efforts like the Endangered Languages Project and the Māori Language Commission.", "While the Endangered Languages Project preserves dying languages through digital recordings, it does not produce new speakers; by contrast, New Zealand’s Māori revitalization program has increased fluent speakers by 20% by integrating the language into schools, government, and media.", "The Māori Language Commission has increased fluent Māori speakers by 20% since 2001, demonstrating the effectiveness of government-led language programs.", "Revitalization programs require significant government funding, whereas documentation projects primarily need academic resources and digital infrastructure."],
      correct: 1,
      explanation: "CONTRAST approaches AND outcomes: B names both approaches, describes each method, and contrasts their results (preservation without new speakers vs. 20% increase in fluency). A lists both but doesn’t contrast. C covers only Māori. D contrasts resources, not approaches/outcomes.",
    },
    {
      passage: "Notes: \"Notes on the placebo effect\"\n\n• The placebo effect occurs when patients experience real symptom improvement after receiving an inactive treatment they believe is real.\n• In clinical trials, placebos have been shown to reduce pain, lower blood pressure, and alleviate symptoms of depression.\n• Brain imaging studies reveal that placebos can trigger the release of endorphins and dopamine, the same chemicals activated by real medications.\n• The strength of the placebo effect varies: larger pills, brand-name packaging, and more expensive-seeming treatments produce stronger effects.\n• Researchers debate whether the placebo effect reflects genuine physiological change or primarily shifts in patient self-reporting.",
      stem: "Which choice most effectively uses relevant information from the notes to make an argument that the placebo effect involves real biological changes, not just subjective perception?",
      choices: ["Brain imaging studies provide compelling evidence that the placebo effect is biologically real: placebos trigger the release of endorphins and dopamine — the same neurochemicals activated by actual medications — demonstrating genuine physiological change rather than mere shifts in self-reporting.", "Researchers continue to debate whether the placebo effect reflects genuine physiological change or primarily shifts in how patients report their symptoms.", "The placebo effect occurs when patients improve after receiving inactive treatments, and it can reduce pain, lower blood pressure, and alleviate depression.", "Interestingly, the placebo effect is stronger when placebos are presented in larger pills or brand-name packaging, suggesting that patient expectations play an important role."],
      correct: 0,
      explanation: "ARGUE for biological reality: C uses the brain imaging evidence (endorphins, dopamine — same chemicals as real drugs) to make the case that the effect is physiologically real, directly countering the \"subjective perception\" interpretation. A is descriptive. B supports the role of expectation (the OTHER side). D presents the debate neutrally without arguing.",
    },
  ],
  takeaways: [
    "Rhetorical synthesis = bulleted notes + a specific goal. No passage to interpret \u2014 just information to assemble.",
    "Three-step method: Identify the GOAL \u2192 Select the relevant NOTES \u2192 Evaluate which answer achieves the goal.",
    "The goal is everything. The same notes produce different correct answers for different goals.",
    "Five goal types: Summarize, Compare, Argue, Describe, Emphasize.",
    "All four answer choices use information from the notes. The question isn\u2019t \"which is true?\" but \"which achieves the goal?\"",
    "For compare/contrast goals, the answer MUST mention both sides.",
    "For emphasize goals, look for which answer foregrounds the most impactful detail.",
    "Read the goal first, THEN look at the answer choices. This prevents you from getting distracted by choices that are accurate but serve the wrong purpose.",
  ],
};
