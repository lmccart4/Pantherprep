"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig, QuizQuestion } from "@/types/module";
import { BossBattle } from "@/components/course/activities/boss-battle";

const BATTLE_QUESTIONS_EXERCISE: QuizQuestion[] = [
  {
    "passage": "The documentary offers a ______ look at the challenges facing migrant workers, presenting their stories without sentimentality or political bias.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "provocative",
      "sympathetic",
      "superficial",
      "candid"
    ],
    "correct": 3,
    "explanation": "\"Without sentimentality or political bias\" = honest, direct, unfiltered. \"Candid\" means frank and open. \"Sympathetic\" implies emotional leaning, which contradicts \"without sentimentality.\"",
    "difficulty": "easy",
    "skill": "vocab"
  },
  {
    "passage": "Although the new treatment showed promise in early trials, the researchers cautioned that the results were ______ and that larger studies were needed before any conclusions could be drawn.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "controversial",
      "definitive",
      "preliminary",
      "negligible"
    ],
    "correct": 2,
    "explanation": "\"Early trials\" + \"larger studies needed\" + \"before conclusions\" = initial, not yet confirmed. \"Preliminary\" means coming before the main part. \"Definitive\" is the opposite.",
    "difficulty": "easy",
    "skill": "vocab"
  },
  {
    "passage": "The honeybee's waggle dance, first decoded by ethologist Karl von Frisch in the 1940s, is one of the most sophisticated communication systems in the animal kingdom. Through precise movements that encode both distance and direction, a foraging bee can guide its hivemates to a food source with remarkable accuracy.",
    "stem": "What is the main purpose of this text?",
    "choices": [
      "To argue that honeybees are more intelligent than other insects",
      "To describe a notable animal communication behavior and its discoverer",
      "To explain why Karl von Frisch won the Nobel Prize",
      "To compare different navigation methods used by social insects"
    ],
    "correct": 1,
    "explanation": "The passage describes the waggle dance and credits von Frisch. Straightforward inform/describe purpose.",
    "difficulty": "easy",
    "skill": "purpose"
  },
  {
    "passage": "The architect's renovation preserved the building's historic facade while ______ transforming the interior into a modern, light-filled workspace that bore almost no resemblance to its former configuration.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "gradually",
      "carefully",
      "slightly",
      "radically"
    ],
    "correct": 3,
    "explanation": "\"Almost no resemblance to its former configuration\" = complete, dramatic transformation. \"Radically\" means in a thorough, fundamental way. \"Carefully\" might seem right (preservation requires care) but the blank modifies the interior transformation, which was dramatic.",
    "difficulty": "medium",
    "skill": "precision"
  },
  {
    "passage": "Marine plastic pollution has reached crisis proportions, with an estimated 8 million metric tons entering the oceans annually. However, recent innovations in biodegradable materials suggest that the tide may be turning. Researchers at several universities have developed plant-based polymers that decompose fully within months of exposure to seawater.",
    "stem": "What is the function of the second sentence ('However, recent innovations...')?",
    "choices": [
      "It shifts the discussion to a completely unrelated topic",
      "It provides evidence supporting the claim in the first sentence",
      "It questions the accuracy of the statistics cited in the first sentence",
      "It introduces a hopeful counterpoint to the problem established in the first sentence"
    ],
    "correct": 3,
    "explanation": "\"However\" signals contrast. The first sentence establishes a problem (crisis); the second introduces potential solutions (innovations). Function: hopeful counterpoint.",
    "difficulty": "medium",
    "skill": "function"
  },
  {
    "passage": "The novelist's early works were praised for their emotional intensity, but critics often noted that her plots relied on ______ coincidences that strained the reader's willingness to suspend disbelief.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "plausible",
      "deliberate",
      "improbable",
      "subtle"
    ],
    "correct": 2,
    "explanation": "\"Strained the reader's willingness to suspend disbelief\" = the coincidences were hard to believe. \"Improbable\" means unlikely to happen. \"Plausible\" is the opposite.",
    "difficulty": "medium",
    "skill": "vocab"
  },
  {
    "passage": "The senator attempted to ______ the growing controversy by issuing a carefully worded statement that acknowledged mistakes without assigning blame to any specific individual.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "temper",
      "publicize",
      "increase",
      "ignore"
    ],
    "correct": 0,
    "explanation": "\"Temper\" here means to moderate or soften — not anger. The senator is trying to soften the controversy with a careful statement. Secondary meaning: temper = to reduce the intensity of.",
    "difficulty": "medium",
    "skill": "secondary"
  },
  {
    "passage": "Text 1:\nSociologist Dr. Park argues that remote work has fundamentally improved work-life balance, allowing employees to reclaim hours previously lost to commuting and to structure their days around personal needs and peak productivity periods.\n\nText 2:\nOrganizational psychologist Dr. Reeves contends that while remote work offers scheduling flexibility, it has also eroded the boundary between professional and personal life. Reeves's research shows that remote workers log an average of 2.5 additional hours per day and report higher rates of burnout than their in-office counterparts.",
    "stem": "Based on the texts, how would Reeves (Text 2) most likely respond to Park's argument?",
    "choices": [
      "By arguing that the flexibility Park describes comes with hidden costs that undermine the benefits",
      "By proposing that all companies should return to in-office work",
      "By agreeing that remote work improves work-life balance",
      "By questioning Park's qualifications as a researcher"
    ],
    "correct": 0,
    "explanation": "Reeves acknowledges flexibility but shows it comes with longer hours and burnout — hidden costs. Qualification: the benefit is real but incomplete.",
    "difficulty": "medium",
    "skill": "crosstext"
  },
  {
    "passage": "Far from the ______ figure portrayed in popular culture, the historical Cleopatra was a multilingual diplomat, naval commander, and economic strategist whose political acumen kept Egypt independent for two decades despite the overwhelming military power of Rome.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "controversial",
      "powerful",
      "glamorous",
      "passive"
    ],
    "correct": 3,
    "explanation": "\"Far from the ______ figure\" contrasts with the real active Cleopatra (diplomat, commander, strategist). Popular culture often portrays her as decorative/romantic rather than active. \"Passive\" is what she was NOT — the passage corrects this misconception.",
    "difficulty": "medium",
    "skill": "precision"
  },
  {
    "passage": "The poet's use of antiquated diction — words drawn from 17th-century religious texts — lends her contemporary verse an air of ______ that contrasts sharply with the mundane suburban settings she describes.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "simplicity",
      "nostalgia",
      "solemnity",
      "confusion"
    ],
    "correct": 2,
    "explanation": "17th-century religious language creates a serious, sacred tone. \"Solemnity\" means dignified seriousness. This contrasts with \"mundane suburban settings.\" \"Nostalgia\" is about longing for the past, not gravitas.",
    "difficulty": "hard",
    "skill": "vocab"
  },
  {
    "passage": "Economist Raj Chetty's research has demonstrated that a child's zip code is among the strongest predictors of their future income — more predictive, in fact, than either parental education or individual test scores. This finding has been widely cited by advocates of place-based investment policies. Chetty himself, however, has cautioned against interpreting the data as evidence that geography alone determines outcomes, noting that the correlation reflects a complex web of institutional, social, and economic factors that happen to cluster geographically.",
    "stem": "What is the function of the last sentence?",
    "choices": [
      "It contradicts Chetty's original research findings",
      "It proposes an alternative explanation unrelated to geography",
      "It qualifies how Chetty's data should be interpreted, warning against an oversimplified conclusion",
      "It provides additional statistical evidence supporting the zip code finding"
    ],
    "correct": 2,
    "explanation": "Chetty \"cautioned against\" oversimplification — the data is real but the interpretation shouldn't be simplistic. The sentence's function is to QUALIFY the finding against misuse.",
    "difficulty": "hard",
    "skill": "function"
  },
  {
    "passage": "The startup's rapid growth initially ______ investor confidence, but the company's inability to translate user engagement into sustainable revenue eventually raised serious concerns about its long-term viability.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "undermined",
      "complicated",
      "arrested",
      "bolstered"
    ],
    "correct": 3,
    "explanation": "\"Initially ______ confidence\" BUT \"eventually raised concerns\" = the growth first built up confidence, then problems emerged. \"Bolstered\" means to strengthen or support. \"Arrested\" (stopped) is a trap secondary meaning that doesn't fit the contrast.",
    "difficulty": "hard",
    "skill": "secondary"
  },
  {
    "passage": "The assumption that ancient civilizations developed agriculture independently in response to similar environmental pressures has been challenged by geneticist Dr. Lydia Okafor. By analyzing DNA from 12,000-year-old grain samples across three continents, Okafor has shown that early domesticated crops share genetic markers suggesting a single origin point from which agricultural knowledge — and the crops themselves — were gradually disseminated through trade networks and migration.",
    "stem": "What is the main purpose of this text?",
    "choices": [
      "To argue that ancient trade networks were more extensive than previously believed",
      "To compare agricultural techniques across three continents",
      "To describe the process by which ancient crops were genetically modified",
      "To present research that challenges the independent-origin model of agricultural development"
    ],
    "correct": 3,
    "explanation": "\"Has been challenged\" by research showing a \"single origin point\" vs. the \"independent development\" assumption. Purpose: present challenging research.",
    "difficulty": "hard",
    "skill": "purpose"
  },
  {
    "passage": "Text 1:\nArt historian Dr. Miriam Jacobs argues that the primary value of public art lies in its capacity to provoke dialogue and challenge assumptions. The most successful public artworks, Jacobs contends, are those that generate debate — even heated controversy — because this engagement demonstrates that art is actively shaping public consciousness rather than merely decorating public spaces.\n\nText 2:\nUrban planner Carlos Mendez maintains that public art's value should be measured by its capacity to foster community cohesion rather than controversy. Mendez points to studies showing that murals, sculptures, and installations that reflect local identity and heritage strengthen residents' sense of belonging and correlate with reduced vandalism and increased civic participation.",
    "stem": "Which choice best describes the relationship between the two texts?",
    "choices": [
      "The texts advocate for different criteria by which to evaluate public art's success",
      "Text 2 argues that public art has no meaningful social impact",
      "Text 2 supports Text 1's argument with additional evidence",
      "Both texts agree that public art should be controversial"
    ],
    "correct": 0,
    "explanation": "Jacobs measures success by dialogue/controversy. Mendez measures by community cohesion/belonging. Same subject (public art's value) but fundamentally different evaluation criteria.",
    "difficulty": "hard",
    "skill": "crosstext"
  },
  {
    "passage": "The committee's report was notable less for its conclusions — which largely echoed previous findings — than for the ______ with which it documented the agency's systematic failures, naming specific officials and detailing exact dates and decisions that led to the crisis.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "urgency",
      "brevity",
      "specificity",
      "objectivity"
    ],
    "correct": 2,
    "explanation": "\"Naming specific officials,\" \"detailing exact dates and decisions\" = precise, detailed documentation. \"Specificity\" means the quality of being detailed and exact. \"Objectivity\" (neutrality) doesn't capture the detailed naming.",
    "difficulty": "hard",
    "skill": "precision"
  },
  {
    "passage": "While the orchestra's technical execution was flawless, the performance felt ______ — mechanically precise but lacking the spontaneous energy and emotional risk-taking that transforms a competent rendition into a memorable one.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "chaotic",
      "innovative",
      "uninspired",
      "controversial"
    ],
    "correct": 2,
    "explanation": "\"Mechanically precise but lacking spontaneous energy and emotional risk-taking\" = technically good but flat/lifeless. \"Uninspired\" means lacking imagination or excitement. Perfect contrast with flawless but emotionally empty.",
    "difficulty": "hard",
    "skill": "vocab"
  },
  {
    "passage": "Text 1:\nPhysicist Dr. Amari contends that the search for extraterrestrial intelligence should focus primarily on detecting technological signatures — radio signals, laser pulses, or atmospheric pollutants that would indicate an industrialized civilization. These signatures, Amari argues, are the most detectable and the most unambiguous evidence of intelligent life.\n\nText 2:\nAstrobiologist Dr. Chen argues that Amari's approach suffers from anthropocentric bias — the assumption that alien civilizations would develop along technological pathways similar to humanity's. Chen advocates instead for a broader search framework that includes biosignatures (chemical indicators of any biological activity), arguing that limiting the search to technological markers risks overlooking the vast majority of life that may exist in non-technological forms.",
    "stem": "Based on the texts, how does Chen's position relate to Amari's?",
    "choices": [
      "Chen rejects the possibility of detecting extraterrestrial technology",
      "Chen supports Amari's approach but recommends additional funding",
      "Chen agrees with Amari on methods but disagrees on the likelihood of finding intelligent life",
      "Chen argues that Amari's framework is too narrow and proposes a more inclusive alternative"
    ],
    "correct": 3,
    "explanation": "Chen says Amari's approach is anthropocentric and \"too narrow\" — risks \"overlooking the vast majority of life.\" Proposes broader framework. This is a challenge to scope with an alternative.",
    "difficulty": "hard",
    "skill": "crosstext"
  },
  {
    "passage": "The decline of pollinator populations has been attributed to a constellation of factors: pesticide exposure, habitat loss, climate change, and disease. Of these, neonicotinoid pesticides have received the most public attention, largely due to several high-profile studies linking them to colony collapse in honeybees. Yet some entomologists argue that this focus on a single chemical class has obscured the more fundamental threat: the wholesale conversion of diverse ecosystems into agricultural monocultures that eliminate the varied floral resources pollinators need to survive.",
    "stem": "What is the function of the last sentence?",
    "choices": [
      "It dismisses pesticide exposure as irrelevant to pollinator decline",
      "It summarizes the previous sentences' main points",
      "It provides statistical evidence about monoculture farming",
      "It redirects attention from a widely discussed factor to what some scientists consider a more fundamental one"
    ],
    "correct": 3,
    "explanation": "\"Yet some argue this focus has obscured the more fundamental threat\" — the sentence doesn't dismiss pesticides but REDIRECTS attention to habitat loss via monoculture. Function: refocusing the analysis.",
    "difficulty": "hard",
    "skill": "function"
  },
  {
    "passage": "The CEO's public apology was widely regarded as ______, not because observers doubted her sincerity but because the carefully vetted, legally reviewed statement felt more like corporate crisis management than genuine accountability.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "dishonest",
      "insufficient",
      "performative",
      "premature"
    ],
    "correct": 2,
    "explanation": "\"Not because observers doubted her sincerity\" eliminates \"dishonest.\" The issue is it FELT like a performance — \"carefully vetted, legally reviewed, crisis management.\" \"Performative\" means done for show, going through the motions. She may be sincere, but the format undermines it.",
    "difficulty": "hard",
    "skill": "precision"
  },
  {
    "passage": "Although the initial findings were promising, the research team was careful not to ______ the significance of their results, acknowledging that their small sample size and limited geographic scope meant that broader claims would be premature.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "dismiss",
      "publicize",
      "overstate",
      "verify"
    ],
    "correct": 2,
    "explanation": "Small sample + limited scope + \"broader claims premature\" = they were careful not to exaggerate. \"Overstate\" means to express too strongly. The team showed appropriate intellectual humility about their findings.",
    "difficulty": "hard",
    "skill": "secondary"
  },
  {
    "passage": "Literary critic Amelia Thornton has proposed that the resurgence of interest in Octavia Butler's science fiction reflects not merely a belated recognition of Butler's literary merit but a broader cultural shift. In an era marked by climate anxiety, pandemic experience, and debates over systemic inequality, Thornton argues, Butler's speculative explorations of adaptation, community resilience, and power feel less like fiction and less like prophecy — and more like a practical framework for navigating an uncertain present.",
    "stem": "What is the main purpose of this text?",
    "choices": [
      "To criticize the publishing industry for overlooking Butler's work",
      "To provide a biography of science fiction writer Octavia Butler",
      "To argue that Butler's renewed popularity reflects contemporary cultural anxieties rather than purely literary reassessment",
      "To compare Butler's work with that of other science fiction writers"
    ],
    "correct": 2,
    "explanation": "Thornton argues the resurgence reflects \"a broader cultural shift\" — climate, pandemic, inequality make Butler feel relevant NOW. Purpose: connecting literary revival to cultural moment.",
    "difficulty": "hard",
    "skill": "purpose"
  },
  {
    "passage": "Text 1:\nNeurologist Dr. Singh argues that screen time limits for children are essential, citing studies showing that excessive screen exposure correlates with reduced attention spans, disrupted sleep patterns, and delayed language development in children under five.\n\nText 2:\nDevelopmental psychologist Dr. Torres contends that the screen time debate oversimplifies a nuanced issue. Torres argues that the CONTENT of screen engagement matters far more than duration — interactive educational programs and video calls with family members produce measurably different cognitive effects than passive consumption of entertainment content. Blanket time limits, Torres suggests, conflate fundamentally different activities under a single misleading metric.",
    "stem": "Which choice best describes the relationship between the two texts?",
    "choices": [
      "Text 2 entirely agrees with Text 1's recommendation for screen time limits",
      "Text 2 denies that screen exposure has any negative effects on children",
      "Text 2 provides additional evidence supporting the correlations described in Text 1",
      "Text 2 argues that Text 1's approach is too simplistic because it treats all screen time as equivalent"
    ],
    "correct": 3,
    "explanation": "Torres says the debate \"oversimplifies\" and \"conflates fundamentally different activities.\" The issue isn't WHETHER screens affect kids but that a blanket time-based approach ignores the crucial content variable.",
    "difficulty": "hard",
    "skill": "crosstext"
  },
  {
    "passage": "The restoration of the 16th-century fresco required extraordinary patience: conservators worked in sessions of no more than thirty minutes, using single-hair brushes under magnification to remove centuries of accumulated grime without disturbing the ______ pigments beneath.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "vibrant",
      "original",
      "faded",
      "fragile"
    ],
    "correct": 3,
    "explanation": "\"Extraordinary patience,\" \"30-minute sessions,\" \"single-hair brushes,\" \"without disturbing\" = the pigments are extremely delicate. \"Fragile\" captures why such extreme care is needed. \"Original\" and \"faded\" describe the pigments but don't explain the caution.",
    "difficulty": "hard",
    "skill": "vocab"
  },
  {
    "passage": "Philosopher Martha Nussbaum has argued that a liberal arts education serves not merely as career preparation but as training in democratic citizenship. By exposing students to diverse perspectives through literature, history, and philosophy, Nussbaum contends, universities cultivate the empathetic imagination and critical thinking skills that democratic self-governance requires. Without citizens capable of reasoning through complex moral and political questions, she warns, democracy degrades into mere majoritarianism.",
    "stem": "What is the function of the last sentence?",
    "choices": [
      "It presents a counterargument to Nussbaum's position",
      "It introduces a new argument unrelated to education",
      "It articulates the stakes of Nussbaum's argument — what is at risk if education fails in its broader purpose",
      "It provides a concrete example of Nussbaum's educational philosophy"
    ],
    "correct": 2,
    "explanation": "\"Without citizens capable of reasoning... democracy degrades\" = this is what happens if the education Nussbaum advocates for fails. The sentence raises the stakes by showing the consequence of NOT doing what she proposes.",
    "difficulty": "hard",
    "skill": "function"
  },
  {
    "passage": "The journalist's investigation did not merely reveal isolated instances of misconduct; it exposed a ______ pattern of abuse that implicated officials at every level of the organization, from entry-level supervisors to the executive board.",
    "stem": "Which choice completes the text so that it conforms to Standard English?",
    "choices": [
      "systemic",
      "surprising",
      "recent",
      "minor"
    ],
    "correct": 0,
    "explanation": "\"Not isolated instances\" + \"every level\" + \"entry-level to executive board\" = the pattern was embedded throughout the system. \"Systemic\" means relating to or affecting an entire system. It's the precise word for organization-wide, structural problems.",
    "difficulty": "hard",
    "skill": "precision"
  }
];

export default function SATRWModule8() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}

      activities={{
        "exercise-battle-questions": (goNext) => (
          <BossBattle
            questions={BATTLE_QUESTIONS_EXERCISE}
            title="Battle Questions"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        )
      }}

      nextModuleHref="/courses/sat-rw/9"
      nextModuleLabel="Module 9: Central Ideas & Comprehension"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "sat",
  section: "rw",
  moduleNum: 8,
  title: "Craft & Structure Boss Battle",
  subtitle:
    "The Lexicon Wraith stirs...",
  accentColor: "#C8102E",
  screens: [
    { id: "welcome", label: "Welcome", icon: "wave" },
    { id: "exercise-battle-questions", label: "Battle Questions", icon: "zap" },
    { id: "complete", label: "Complete", icon: "trophy" },
  ],

  takeaways: [
    "Craft & Structure covers ~28% of the SAT R&W section — vocabulary, text structure, and cross-text connections.",
    "For vocabulary: use the 4-step process — tone first, find clues, eliminate, choose precision.",
    "For precision: check scope, intensity, and domain differences between near-synonyms.",
    "For purpose: ask what the author is DOING, not just what the text says.",
    "For sentence function: identify each sentence's JOB — claim, evidence, counterpoint, concession, context.",
    "For cross-text: summarize each text's main claim independently before looking at answers.",
  ],
};
