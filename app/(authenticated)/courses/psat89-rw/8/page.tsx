"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { SorterExercise, type SorterItem } from "@/components/course/activities/sorter-exercise";
import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";
import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";
import {
  ToolkitVisual,
  CausationTestVisual,
} from "./lesson-visuals";

const CAT_EXERCISE: SorterItem[] = [
  {
    "text": "furthermore",
    "correct": "0"
  },
  {
    "text": "however",
    "correct": "1"
  },
  {
    "text": "therefore",
    "correct": "2"
  },
  {
    "text": "for instance",
    "correct": "3"
  },
  {
    "text": "nevertheless",
    "correct": "1"
  },
  {
    "text": "as a result",
    "correct": "2"
  },
  {
    "text": "in addition",
    "correct": "0"
  },
  {
    "text": "subsequently",
    "correct": "4"
  },
  {
    "text": "conversely",
    "correct": "1"
  },
  {
    "text": "consequently",
    "correct": "2"
  },
  {
    "text": "likewise",
    "correct": "0"
  },
  {
    "text": "specifically",
    "correct": "3"
  },
  {
    "text": "meanwhile",
    "correct": "4"
  },
  {
    "text": "in contrast",
    "correct": "1"
  },
  {
    "text": "accordingly",
    "correct": "2"
  },
  {
    "text": "moreover",
    "correct": "0"
  }
];

const REL_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "Sentence 1: \"The company reported record profits in the third quarter.\"\nSentence 2: \"It announced plans to expand into three new markets.\"",
    "correct": "2",
    "explanation": "Record profits LED TO expansion plans. Idea 1 caused Idea 2. Cause/effect."
  },
  {
    "prompt": "Sentence 1: \"Classical music has been shown to reduce stress in hospital patients.\"\nSentence 2: \"Jazz music has been found to improve focus and creativity in office settings.\"",
    "correct": "0",
    "explanation": "Both sentences present a PARALLEL finding about different music genres. Neither causes the other. Addition."
  },
  {
    "prompt": "Sentence 1: \"The city invested $50 million in a new public transit system.\"\nSentence 2: \"Traffic congestion increased by 12% over the following year.\"",
    "correct": "1",
    "explanation": "You’d expect investment to REDUCE congestion, but it increased. The second idea contradicts the expected outcome. Contrast."
  },
  {
    "prompt": "Sentence 1: \"The Sahara Desert receives less than 3 inches of rain per year.\"\nSentence 2: \"The Atacama Desert in Chile gets less than 0.6 inches annually.\"",
    "correct": "3",
    "explanation": "The second sentence provides a specific EXAMPLE that illustrates extreme dryness. Example."
  },
  {
    "prompt": "Sentence 1: \"Researchers first collected soil samples from 20 locations across the valley.\"\nSentence 2: \"They analyzed the samples for heavy metal contamination.\"",
    "correct": "4",
    "explanation": "First they collected, THEN they analyzed. This is a time sequence. Sequence."
  },
  {
    "prompt": "Sentence 1: \"Electric vehicles produce zero direct emissions.\"\nSentence 2: \"Manufacturing their batteries requires mining lithium, which has significant environmental costs.\"",
    "correct": "1",
    "explanation": "Sentence 1 highlights a benefit; sentence 2 introduces a complication. These ideas are in tension. Contrast."
  },
  {
    "prompt": "Sentence 1: \"The drought destroyed over 60% of the wheat crop.\"\nSentence 2: \"Bread prices rose by 40% within three months.\"",
    "correct": "2",
    "explanation": "Crop destruction directly caused price increases. Clear cause/effect chain."
  },
  {
    "prompt": "Sentence 1: \"The museum features over 10,000 artifacts from ancient Egypt.\"\nSentence 2: \"One of its centerpieces is a 3,000-year-old sarcophagus decorated with gold leaf.\"",
    "correct": "3",
    "explanation": "The second sentence gives a specific EXAMPLE of one artifact from the collection. Example."
  }
];

const FIL_EXERCISE: MatchingItem[] = [
  {
    "prompt": "The experiment produced results that directly contradicted the original hypothesis. ___, the researchers decided to redesign their methodology.",
    "options": [
      "Furthermore",
      "Similarly",
      "For example",
      "Consequently"
    ],
    "correct": 3,
    "explanation": "The contradictory results CAUSED the redesign. Cause/effect \u2192 \"Consequently.\" \"Furthermore\" (addition) and \"Similarly\" (addition) don’t show causation. \"For example\" introduces an illustration, not a result."
  },
  {
    "prompt": "Many critics dismissed the novel when it was first published in 1925. ___, it is now considered one of the greatest works of American literature.",
    "options": [
      "In addition",
      "Therefore",
      "However",
      "For instance"
    ],
    "correct": 2,
    "explanation": "Initial dismissal vs. current acclaim = contrast. \"However\" signals the reversal. \"Therefore\" would mean the dismissal CAUSED the acclaim, which is backwards."
  },
  {
    "prompt": "Honeybees are essential pollinators for crops like almonds, apples, and blueberries. ___, wild bees and butterflies contribute significantly to the pollination of tomatoes, peppers, and wildflowers.",
    "options": [
      "As a result",
      "Nevertheless",
      "Similarly",
      "In conclusion"
    ],
    "correct": 2,
    "explanation": "Both sentences describe pollinators contributing to different crops. The ideas are parallel \u2192 addition. \"Similarly\" shows the parallel. \"Nevertheless\" (contrast) is wrong because there’s no tension."
  },
  {
    "prompt": "The town council allocated $2 million to renovate the historic theater. ___, the project included restoring the original 1920s ceiling murals and replacing the outdated electrical system.",
    "options": [
      "Therefore",
      "However",
      "Specifically",
      "On the other hand"
    ],
    "correct": 2,
    "explanation": "The second sentence gives DETAILS about what the renovation included. Example/specification \u2192 \"Specifically.\" \"Therefore\" would wrongly suggest causation. \"However\" introduces contrast that isn’t there."
  },
  {
    "prompt": "The archaeological team spent three years excavating the site. ___, they cataloged and preserved over 5,000 artifacts for museum display.",
    "options": [
      "Moreover",
      "For example",
      "Afterward",
      "In contrast"
    ],
    "correct": 2,
    "explanation": "Excavating came first, then cataloging/preserving. Time sequence \u2192 \"Afterward.\" \"Moreover\" (addition) misses the time relationship. \"In contrast\" wrongly suggests opposition."
  }
];

const TRP_EXERCISE: MatchingItem[] = [
  {
    "prompt": "The medication reduced symptoms in 80% of patients. However, the FDA approved it for widespread use.\n\nWhat\u2019s wrong with this transition?",
    "options": [
      "Needs addition (moreover, furthermore)",
      "Needs cause/effect (therefore, consequently)",
      "Needs example (for instance)",
      "Transition is correct"
    ],
    "correct": 1,
    "explanation": "Positive trial results CAUSED FDA approval. \"However\" implies the approval is surprising or contradictory, but it’s the expected outcome. Should be \"Consequently\" or \"Therefore.\""
  },
  {
    "prompt": "The city\u2019s population has grown by 30% over the past decade. Therefore, neighboring suburbs have experienced similar growth trends.\n\nWhat\u2019s wrong with this transition?",
    "options": [
      "Needs contrast (however, nevertheless)",
      "Transition is correct",
      "Needs addition (similarly, likewise)",
      "Needs sequence (subsequently)"
    ],
    "correct": 2,
    "explanation": "The city didn’t CAUSE the suburbs to grow. Both are experiencing the same trend independently \u2192 parallel relationship. Should be \"Similarly\" or \"Likewise.\""
  },
  {
    "prompt": "Renewable energy sources like solar and wind are becoming cheaper every year. For example, many governments are investing heavily in renewable infrastructure.\n\nWhat\u2019s wrong with this transition?",
    "options": [
      "Needs addition (moreover)",
      "Transition is correct",
      "Needs contrast (however)",
      "Needs cause/effect (as a result, consequently)"
    ],
    "correct": 3,
    "explanation": "Cheaper renewables LED TO government investment. \"For example\" would mean government investment is an EXAMPLE of getting cheaper, which doesn’t make sense. Should be \"As a result\" or \"Consequently.\""
  },
  {
    "prompt": "The first act of the play introduced the main characters and established the central conflict. In contrast, the second act developed the subplot and raised the stakes.\n\nWhat\u2019s wrong with this transition?",
    "options": [
      "Needs addition (furthermore)",
      "Needs sequence (then, next, subsequently)",
      "Needs cause/effect (therefore)",
      "Transition is correct"
    ],
    "correct": 1,
    "explanation": "Acts 1 and 2 aren’t opposing each other \u2014 they’re sequential parts of the same story. \"In contrast\" wrongly implies opposition. Should be \"Then\" or \"Subsequently.\""
  }
];

const SPD_EXERCISE: ClassificationItem[] = [
  {
    "prompt": "Sentence 1: \"The soil was too acidic for most crops.\"\nSentence 2: \"The farmers added limestone to raise the pH.\"",
    "correct": "1",
    "explanation": ""
  },
  {
    "prompt": "Sentence 1: \"Cheetahs are the fastest land animals.\"\nSentence 2: \"Peregrine falcons are the fastest animals overall, reaching speeds above 240 mph in a dive.\"",
    "correct": "1",
    "explanation": ""
  },
  {
    "prompt": "Sentence 1: \"The team won the first two games of the series.\"\nSentence 2: \"They lost the next three games and were eliminated.\"",
    "correct": "1",
    "explanation": ""
  },
  {
    "prompt": "Sentence 1: \"The restaurant uses locally sourced vegetables.\"\nSentence 2: \"It partners with a nearby farm for its grass-fed beef.\"",
    "correct": "1",
    "explanation": ""
  },
  {
    "prompt": "Sentence 1: \"Deforestation has reduced the habitat available to orangutans.\"\nSentence 2: \"Their population has declined by over 50% in the past two decades.\"",
    "correct": "3",
    "explanation": ""
  },
  {
    "prompt": "Sentence 1: \"The study surveyed 10,000 participants across 15 countries.\"\nSentence 2: \"In Japan, 78% of respondents reported high job satisfaction.\"",
    "correct": "2",
    "explanation": ""
  },
  {
    "prompt": "Sentence 1: \"The candidate promised to lower taxes.\"\nSentence 2: \"She proposed a 15% reduction in the income tax rate.\"",
    "correct": "2",
    "explanation": ""
  },
  {
    "prompt": "Sentence 1: \"The architect completed the initial blueprints in March.\"\nSentence 2: \"The construction crew began laying the foundation in June.\"",
    "correct": "2",
    "explanation": ""
  },
  {
    "prompt": "Sentence 1: \"Vitamin D deficiency is linked to weakened bones.\"\nSentence 2: \"It may also contribute to depression and fatigue.\"",
    "correct": "1",
    "explanation": ""
  },
  {
    "prompt": "Sentence 1: \"Critics gave the film overwhelmingly negative reviews.\"\nSentence 2: \"It earned over $800 million at the global box office.\"",
    "correct": "2",
    "explanation": ""
  }
];

export default function PSAT89RWModule8() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "toolkit": <ToolkitVisual />,
        "causation-test": <CausationTestVisual />,
      }}
      activities={{
        "exercise-cat": (goNext: () => void) => (
          <SorterExercise
            items={CAT_EXERCISE}
            buckets={["0","1","2","3","4"]}
            title="Category Sorter"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-rel": (goNext: () => void) => (
          <ClassificationExercise
            items={REL_EXERCISE}
            categories={["2","0","1","3","4"]}
            title="Name the Relationship"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-fil": (goNext: () => void) => (
          <MatchingExercise
            items={FIL_EXERCISE}
            title="Fill the Blank"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-trp": (goNext: () => void) => (
          <MatchingExercise
            items={TRP_EXERCISE}
            title="Trap Spotter"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "exercise-spd": (goNext: () => void) => (
          <ClassificationExercise
            items={SPD_EXERCISE}
            categories={["1","3","2"]}
            title="Speed Round"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/psat89-rw/9"
      nextModuleLabel="Module 9: Rhetorical Synthesis"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "psat89",
  section: "rw",
  moduleNum: 8,
  title: "Transitions",
  subtitle:
    "Topic 8A \\u2014 Read \\u2192 Name \\u2192 Match",
  accentColor: "#06b6d4",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "lesson", label: "Lesson", icon: "book" },
    { id: "exercise-cat", label: "Category Sorter", icon: "zap" },
    { id: "exercise-rel", label: "Name the Relationship", icon: "zap" },
    { id: "exercise-fil", label: "Fill the Blank", icon: "zap" },
    { id: "exercise-trp", label: "Trap Spotter", icon: "zap" },
    { id: "exercise-spd", label: "Speed Round", icon: "zap" },
    { id: "quiz", label: "Practice Quiz", icon: "target" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  lessons: [
    {
      id: "8a",
      title: "The Three-Step Method",
      subtitle: "Topic 8A — Read → Name → Match",
      body: ["Transition questions are pattern-recognition problems. Follow these three steps and you'll get them right almost every time.","Step 1 — READ: Read the sentence BEFORE and AFTER the blank. What is the relationship between these two ideas?","Step 2 — NAME: Label the relationship: addition, contrast, cause/effect, sequence, example, or summary.","Step 3 — MATCH: Pick the answer choice that belongs to the category you named. Eliminate all choices from wrong categories.","Why This Works: On the PSAT, the four answer choices almost always come from different categories. You'll typically see one addition word, one contrast word, one cause/effect word, and one example word. If you can name the category correctly, you can eliminate three wrong answers instantly.","Common mistake: Students try to \"hear\" which word sounds best without analyzing the relationship. This leads to errors because many transition words sound smooth in a sentence but create the wrong logical connection. Always name the category first."],
      visual: "toolkit",
    },
    {
      id: "8b",
      title: "Tricky Transitions & Common Traps",
      subtitle: "Topic 8B — Lookalikes, Degree Traps & Paragraph-Level Transitions",
      body: ["Most transition questions are straightforward, but a few patterns trip students up. Here's how to handle them.","Trap 1: Same Category, Wrong Word — Sometimes two answer choices are from the same category but differ in nuance.\n• \"Similarly\" vs. \"Likewise\": Nearly identical — either usually works. Don't overthink these.\n• \"Therefore\" vs. \"Consequently\": Both are cause/effect. Interchangeable on the PSAT.\n• \"However\" vs. \"Nevertheless\": Both contrast, but \"nevertheless\" means \"despite that, the thing still happened.\" \"However\" is a simple contrast.","Trap 2: The \"Sounds Good\" Trap — \"Moreover\" and \"however\" are the two most commonly chosen wrong answers because they sound sophisticated. Students pick them when they can't decide, hoping they'll work. They only work if the relationship actually IS addition or contrast.","Trap 3: Paragraph-Level Transitions — Some questions ask for a transition at the START of a new paragraph. The trick: you must read the END of the previous paragraph to understand the relationship.\n\n• Within a paragraph: Read the sentence before and after the blank.\n• Between paragraphs: Read the last sentence of the previous paragraph and the first sentence of the new paragraph.","Trap 4: Addition vs. Cause/Effect — This is the most common confusion. Both \"move forward\" — but in different ways:\n• Addition: Idea 2 is ANOTHER point supporting the same argument. (\"Dolphins are intelligent. Furthermore, they display complex social behaviors.\")\n• Cause/Effect: Idea 1 CAUSES or LEADS TO idea 2. (\"The drought destroyed crops. Consequently, food prices rose sharply.\")","The causation test: Ask yourself: \"Did Idea 1 directly cause or lead to Idea 2?\" If yes → cause/effect. If no, and Idea 2 just adds another supporting point → addition."],
      visual: "causation-test",
    },
  ],

  /* ──────── PRACTICE QUIZ ──────── */
  quiz: [
    {
      passage: "Astronomers have long studied Mars for signs of past water activity. ___, recent missions have discovered mineral deposits that form only in the presence of liquid water, providing strong evidence that rivers once flowed across the planet’s surface.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["However", "Subsequently", "In fact", "For example"],
      correct: 2,
      explanation: "The second sentence STRENGTHENS the first by providing confirming evidence. \"In fact\" signals emphasis/confirmation of the preceding claim. \"However\" wrongly introduces contrast. \"For example\" could work but \"in fact\" better captures the confirmatory relationship.",
    },
    {
      passage: "The new highway bypass was designed to reduce traffic in the downtown area. ___, commuters report that their travel times have decreased by an average of 15 minutes.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["Nevertheless", "In contrast", "For instance", "As a result"],
      correct: 3,
      explanation: "The bypass (cause) → decreased travel times (effect). \"As a result\" correctly signals cause/effect. \"Nevertheless\" and \"In contrast\" wrongly suggest the outcome contradicts the intention.",
    },
    {
      passage: "Many species of birds migrate thousands of miles each fall. ___, the Arctic tern travels from pole to pole — a round trip of approximately 44,000 miles.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["For example", "Therefore", "However", "Moreover"],
      correct: 0,
      explanation: "The Arctic tern is a SPECIFIC EXAMPLE of a bird that migrates thousands of miles. \"For example\" introduces the illustration. \"Moreover\" (addition) is close but doesn’t capture the specific-to-general relationship as well.",
    },
    {
      passage: "The novelist spent a decade researching the historical period before writing a single page of the manuscript. ___, she traveled to archives in six countries, interviewed dozens of historians, and read over 300 primary source documents.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["Nevertheless", "In contrast", "As a result", "Specifically"],
      correct: 3,
      explanation: "The second sentence gives DETAILS about what the research involved. \"Specifically\" introduces elaboration/specification. \"As a result\" would mean the research caused the traveling, but the traveling WAS the research.",
    },
    {
      passage: "Japan’s population has been steadily declining since 2010, with birth rates falling to historic lows. ___, the country’s workforce has shrunk significantly, prompting the government to invest in automation and robotics.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["Similarly", "Consequently", "For instance", "However"],
      correct: 1,
      explanation: "Population decline CAUSED workforce shrinkage and investment in automation. Clear cause/effect chain → \"Consequently.\" \"Similarly\" (addition) misses the causal relationship. \"However\" wrongly introduces contrast.",
    },
    {
      passage: "Supporters of the new education policy argue that standardized testing provides an objective measure of student achievement. ___, critics contend that such tests fail to capture creativity, critical thinking, and collaborative skills.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["Similarly", "On the other hand", "Therefore", "Furthermore"],
      correct: 1,
      explanation: "Supporters say one thing; critics say the opposite. Clear contrast between two viewpoints → \"On the other hand.\" \"Furthermore\" and \"Similarly\" wrongly suggest the critics are ADDING to the supporters’ argument.",
    },
    {
      passage: "Dr. Chen’s research team has published groundbreaking work on gene therapy for inherited diseases. ___, the team has secured over $40 million in federal grants to fund clinical trials.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["In contrast", "In addition", "Nevertheless", "For example"],
      correct: 1,
      explanation: "Publications AND grants are two achievements being listed. The second doesn’t illustrate or result from the first — it’s an additional accomplishment. \"In addition\" signals the parallel. \"For example\" would mean the grants are an example of publications, which doesn’t make sense.",
    },
    {
      passage: "While early computers filled entire rooms and required specialized operators, modern smartphones can perform billions of calculations per second while fitting in a pocket. ___, the cost of computing power has plummeted: a calculation that cost $1 in 1960 now costs a fraction of a cent.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["Subsequently", "Nevertheless", "In contrast", "Furthermore"],
      correct: 3,
      explanation: "The passage already made the contrast (early computers vs. smartphones). The new sentence adds ANOTHER way computing has improved (cost reduction). Addition → \"Furthermore.\" \"In contrast\" would be redundant since the contrast was already made.",
    },
    {
      passage: "The restoration of the wetlands along the river’s edge had an unexpected cascading effect. Native fish populations rebounded within two years. ___, herons, kingfishers, and other wading birds returned to the area, attracted by the abundant fish.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["In turn", "However", "Moreover", "For example"],
      correct: 0,
      explanation: "This is a CHAIN of cause/effect: wetlands restored → fish rebounded → birds returned (attracted by fish). \"In turn\" signals a cascading sequence where each effect becomes the cause of the next. \"Moreover\" (addition) misses the causal chain.",
    },
    {
      passage: "The pharmaceutical company’s initial trials showed promising results for the new drug, with 73% of participants experiencing significant symptom reduction. ___, the drug produced severe side effects in nearly 15% of participants, leading regulators to require additional safety studies before approving it for public use.",
      stem: "Which choice completes the text with the most logical transition?",
      choices: ["As a result", "In addition", "However", "For instance"],
      correct: 2,
      explanation: "Promising efficacy results vs. severe side effects = contrast. \"However\" correctly signals the reversal from positive to negative. \"In addition\" wrongly treats the side effects as another positive finding. \"As a result\" would mean good results caused bad side effects.",
    },
  ],
  takeaways: [
    "Three-step method: Read the relationship \u2192 Name the category \u2192 Match the word.",
    "Six categories: addition, contrast, cause/effect, sequence, example, summary.",
    "PSAT answer choices almost always come from different categories. Name the category and you eliminate three wrong answers.",
    "Don't pick \"however\" or \"moreover\" just because they sound good. They only work if the relationship is actually contrast or addition.",
    "Addition vs. cause/effect: Ask \"Did Idea 1 cause Idea 2?\" If yes \u2192 cause/effect. If it just adds a parallel point \u2192 addition.",
    "For paragraph-level transitions, read the END of the previous paragraph to find the relationship.",
    "These should be your fastest questions \u2014 15\u201320 seconds each once you know the categories.",
  ],
};
