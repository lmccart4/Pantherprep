"use client";

import { ModuleShell } from "@/components/course/module-shell";
import type { ModuleConfig } from "@/types/module";
import { RoutingSimulator } from "@/components/course/activities/routing-simulator";
import { ErrorAnalysisWorksheet } from "@/components/course/activities/error-analysis-worksheet";
import {
  TestStructureVisual,
  DomainsVisual,
  AdaptiveVisual,
  SelectionIndexVisual,
  ErrorClassificationVisual,
  GrowthVisual,
} from "./lesson-visuals";

export default function NMSQTRWModule1() {
  return (
    <ModuleShell
      config={MODULE_CONFIG}
      visuals={{
        "test-structure": <TestStructureVisual />,
        "four-domains": <DomainsVisual />,
        "adaptive-system": <AdaptiveVisual />,
        "selection-index": <SelectionIndexVisual />,
        "error-classification": <ErrorClassificationVisual />,
        "growth-trajectory": <GrowthVisual />,
      }}
      activities={{
        "activity-routing": (goNext: () => void) => (
          <RoutingSimulator
            maxQuestions={27}
            section="rw"
            testType="nmsqt"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
        "error-worksheet": (goNext: () => void) => (
          <ErrorAnalysisWorksheet
            domains={["Craft & Structure", "Information & Ideas", "Standard English Conventions", "Expression of Ideas"]}
            testLabel="PSAT/NMSQT Reading & Writing"
            accentColor={MODULE_CONFIG.accentColor}
            onComplete={goNext}
          />
        ),
      }}
      nextModuleHref="/courses/nmsqt-rw/2"
      nextModuleLabel="Module 2: Sentence Boundaries"
    />
  );
}

const MODULE_CONFIG: ModuleConfig = {
  testType: "nmsqt",
  section: "rw",
  moduleNum: 1,
  title: "Diagnostic & Orientation",
  subtitle:
    "Assess your baseline R&W skills, understand the test structure, and build your personalized study plan.",
  accentColor: "#d4a017",
  screens: [
    { id: "welcome", label: "Welcome", icon: "welcome" },
    { id: "lesson", label: "Lesson", icon: "lesson" },
    { id: "activity-routing", label: "Routing Simulator", icon: "zap" },
    { id: "error-worksheet", label: "Error Analysis Worksheet", icon: "zap" },
    { id: "complete", label: "Complete", icon: "complete" },
  ],
  lessons: [
    /* ── Slide 1: Test Structure ── */
    {
      id: "test-structure",
      title: "Digital PSAT/NMSQT: R&W Structure",
      subtitle: "Know Your Test",
      visual: "test-structure",
      body: [
        "The PSAT/NMSQT Reading & Writing section is a single combined section -- no separate 'Reading' and 'Writing' tests. Every question pairs a short passage (25--150 words) with a single multiple-choice question. You'll face $54$ of these mini-tasks across two adaptive modules.",
        "Total time: $64$ minutes ($32$ per module). That gives you roughly $71$ seconds per question. All questions are multiple choice with 4 options (A/B/C/D). Scoring ranges from $160$ to $760$.",
        "There is no penalty for wrong answers -- answer every single question, even if you have to guess. A random guess gives you a $25\\%$ chance. Never leave anything blank.",
        "One passage, one question. This is the biggest shift from the old paper PSAT. You won't see $10$ questions about the same $700$-word passage anymore. Each question is a fresh, self-contained reading task.",
      ],
    },
    /* ── Slide 2: Four Content Domains ── */
    {
      id: "four-domains",
      title: "The Four Content Domains",
      subtitle: "Content Breakdown",
      visual: "four-domains",
      body: [
        "Craft & Structure (~$28\\%$, 13--15 questions): Words in Context, Text Structure & Purpose, Cross-Text Connections. The first questions you see in each module -- and the easiest.",
        "Information & Ideas (~$26\\%$, 12--14 questions): Central Ideas & Details, Command of Evidence (Textual & Quantitative), Inferences.",
        "Standard English Conventions (~$26\\%$, 11--15 questions): Boundaries (comma splices, run-ons, fragments), Form/Structure/Sense (subject-verb agreement, verb tense, modifiers, parallelism). All use the same prompt: 'Which choice conforms to the conventions of Standard English?'",
        "Expression of Ideas (~$20\\%$, 8--12 questions): Transitions and Rhetorical Synthesis. The hardest questions on the test appear here.",
        "Questions always appear in domain order: Craft & Structure $\\to$ Information & Ideas $\\to$ Conventions $\\to$ Expression of Ideas, easy to hard within each domain.",
      ],
    },
    /* ── Slide 3: Adaptive Module System ── */
    {
      id: "adaptive-system",
      title: "The Adaptive Module System",
      subtitle: "How It Works",
      visual: "adaptive-system",
      body: [
        "The PSAT/NMSQT uses multistage adaptive testing (MST). Module 1 contains mixed-difficulty questions. Your performance on Module 1 determines which version of Module 2 you receive.",
        "If you perform well on Module 1, you are routed to the harder Module 2, which unlocks scores up to $760$.",
        "If you score below the threshold, you receive the easier Module 2, which caps your maximum score at roughly $600$--$630$ -- even if you ace every question.",
        "The Module 1 Imperative: Accuracy on the first $27$ questions matters more than speed. Getting routed to the harder Module 2 is the single most important factor in your score.",
      ],
    },
    /* ── Slide 4: Selection Index & National Merit ── */
    {
      id: "selection-index",
      title: "The Selection Index: Why R&W Matters Most",
      subtitle: "National Merit Pathway",
      visual: "selection-index",
      body: [
        "The PSAT/NMSQT is the only test that determines National Merit eligibility. The Selection Index formula double-weights your Reading & Writing score:",
        "Selection Index $= (2 \\times \\text{RW} + \\text{Math}) \\div 10$. Range: $48$--$228$. R&W contributes two-thirds of your index.",
        "A $10$-point RW improvement adds $+2$ to your Selection Index. The same Math improvement adds only $+1$. Point for point, the Reading & Writing section is twice as valuable as Math for National Merit.",
        "Commended Student cutoff: ~$210$. Semifinalist cutoffs vary by state ($210$--$225$). NJ Semifinalist (2026): $225$ -- among the highest cutoffs nationally.",
      ],
    },
    /* ── Slide 5: Error Classification ── */
    {
      id: "error-classification",
      title: "Error Classification & Analysis",
      subtitle: "Know Your Mistakes",
      visual: "error-classification",
      body: [
        "Every wrong answer falls into one of four error types. Correctly identifying your error type is the key to knowing what to study.",
        "Content Gap: You didn't know the rule, word, or concept. Fix: review the relevant module.",
        "Trap Answer: You fell for a distractor that was designed to look correct. Fix: learn the common trap patterns for each question type.",
        "Misread: You went too fast and missed a key word or detail. Fix: always re-read what the question asks before selecting your answer.",
        "Time Pressure: You ran out of time and had to guess. Fix: practice pacing -- use the two-pass method to answer confident questions first, then return to flagged ones.",
      ],
    },
    /* ── Slide 6: Growth Trajectory ── */
    {
      id: "growth-trajectory",
      title: "Your Growth Trajectory",
      subtitle: "The Big Picture",
      visual: "growth-trajectory",
      body: [
        "The PSAT/NMSQT shares the exact same format as the PSAT 8/9 and SAT -- same question types, same timing, same domains. A $600$ here means the same thing as a $600$ on the SAT. Everything you build now transfers directly.",
        "PSAT 8/9 (8th--9th Grade): R&W score range $120$--$720$. Simpler passages, more common vocabulary.",
        "PSAT/NMSQT (10th--11th Grade): R&W score range $160$--$760$. National Merit eligibility (11th grade only).",
        "SAT (11th--12th Grade): R&W score range $200$--$800$. Hardest passages, most nuanced vocabulary.",
        "College Readiness Benchmark (R&W): $460$. Scoring $460+$ means you're on track for college-level reading & writing.",
      ],
    },
  ],

  takeaways: [
    "The RW section has 54 questions in 64 minutes, split into two 27-question adaptive modules of 32 minutes each.",
    "Every question pairs one short passage with one question -- no more 10-question-per-passage marathons.",
    "Questions always appear in domain order: Craft & Structure, Information & Ideas, Conventions, Expression of Ideas -- easy to hard within each domain.",
    "Module 1 performance determines your Module 2 difficulty -- and your score ceiling. Accuracy on Module 1 matters more than speed.",
    "The Selection Index double-weights RW -- this section is worth twice as much as Math for National Merit qualification.",
    "There is no penalty for wrong answers -- never leave a question blank.",
    "Standard English Conventions (~26% of the section) tests a finite set of learnable rules -- it is the fastest path to score gains.",
    "Error analysis is your most powerful tool: classify why you missed a question, not just what you missed.",
  ],
};
