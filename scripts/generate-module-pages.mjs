/**
 * generate-module-pages.mjs (v2)
 *
 * Reads extracted JSON data from data/<course>/module-<num>.json
 * and updates existing Next.js module page TSX files with:
 * 1. Missing quiz/warmup/challenge questions
 * 2. Exercise screens wired through the activities prop
 *
 * Fixed from v1:
 * - Correct import paths (@/components/course/activities/)
 * - Import insertion only in top-of-file region
 * - Detects variable-reference warmup/quiz (e.g. warmup: WARMUP)
 * - Skips files that already have activities
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import path from "path";

const COURSES = [
  "sat-rw", "sat-math",
  "nmsqt-rw", "nmsqt-math",
  "psat89-rw", "psat89-math",
];

const DATA_DIR = "data";
const PAGES_DIR = "app/(authenticated)/courses";

// ────────────────────────────────────────────
// Normalizers
// ────────────────────────────────────────────

function normalizeWarmup(q) {
  if (q.q && q.ch) {
    return {
      source: q.source || undefined,
      stem: q.q,
      choices: q.ch,
      correct: q.c,
      explanation: q.fb || "",
    };
  }
  if (q.stem && q.choices) {
    return {
      source: q.source || undefined,
      stem: q.passage ? q.passage + " " + q.stem : q.stem,
      choices: q.choices,
      correct: q.correct,
      explanation: q.explanation || q.explain || "",
    };
  }
  return null;
}

function normalizeQuiz(q) {
  if (q.stem && q.choices) {
    return {
      passage: q.passage || null,
      stem: q.stem,
      choices: q.choices,
      correct: q.correct,
      explanation: q.explain || q.explanation || "",
      difficulty: mapDifficulty(q.diff || q.difficulty),
      domain: q.domain || undefined,
      skill: q.skill || undefined,
      type: q.type || undefined,
      trap: q.trap || null,
      trapAnswer: q.trapAnswer ?? undefined,
      trapDesc: q.trapDesc || null,
    };
  }
  if (q.q && q.ch) {
    return {
      stem: q.q,
      choices: q.ch,
      correct: q.c,
      explanation: q.fb || "",
      difficulty: mapDifficulty(q.diff),
      trap: q.trap || null,
      trapAnswer: q.trapAnswer ?? undefined,
      trapDesc: q.trapDesc || null,
    };
  }
  if (q.passage && q.choices) {
    return {
      passage: q.passage,
      stem: q.stem || "Which choice completes the text?",
      choices: q.choices,
      correct: q.correct,
      explanation: q.explain || q.explanation || "",
      difficulty: mapDifficulty(q.diff || q.difficulty),
    };
  }
  return null;
}

function mapDifficulty(d) {
  if (d === "easy" || d === "medium" || d === "hard") return d;
  return undefined;
}

// ────────────────────────────────────────────
// Exercise → Activity component mapping
// ────────────────────────────────────────────

function mapExercise(name, items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const sample = items[0];

  // {prompt, options, correct, explain} → MatchingExercise
  if (sample.options && sample.correct !== undefined) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.prompt || "Select the best answer:",
        options: it.options,
        correct: Array.isArray(it.correct) ? it.correct[0] : it.correct,
        explanation: it.explain || it.explanation || "",
      })),
    };
  }

  // {broken, options, correct, explain} → MatchingExercise
  if (sample.broken && sample.options) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: `Fix: "${it.broken}"`,
        options: it.options,
        correct: it.correct,
        explanation: it.explain || it.explanation || "",
      })),
    };
  }

  // {prompt, answer, solution, tier} → FillInExercise
  if (sample.prompt && sample.answer !== undefined && sample.solution) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: it.prompt,
        answer: it.answer,
        tolerance: it.tolerance,
        solution: it.solution,
        tier: it.tier,
      })),
    };
  }

  // {eq, correct, fb} → FillInExercise
  if (sample.eq && sample.correct !== undefined && sample.fb !== undefined && !sample.opts) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: `Solve: ${it.eq}`,
        answer: it.correct,
        solution: it.fb,
      })),
    };
  }

  // {eq1, eq2, correct, fb} → FillInExercise (systems)
  if (sample.eq1 && sample.eq2) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: `Solve the system:\n${it.eq1}\n${it.eq2}`,
        answer: it.correct,
        solution: it.fb || "",
      })),
    };
  }

  // {q, opts, correct, fb} → MatchingExercise
  if (sample.q && sample.opts && sample.correct !== undefined) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.q,
        options: it.opts,
        correct: it.correct,
        explanation: it.fb || "",
      })),
    };
  }

  // {word, opts, c, fb} → MatchingExercise
  if (sample.word && sample.opts && sample.c !== undefined) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.word + (it.parts ? ` (${it.parts})` : ""),
        options: it.opts,
        correct: it.c,
        explanation: it.fb || "",
      })),
    };
  }

  // {passage, clue, opts, fb} → MatchingExercise
  if (sample.passage && sample.opts) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.passage + (it.clue ? ` [Clue: ${it.clue}]` : ""),
        options: it.opts || it.choices,
        correct: it.c ?? it.correct ?? it.answer ?? 0,
        explanation: it.fb || it.explain || "",
      })),
    };
  }

  // {passage, choices, correct, fb} → MatchingExercise
  if (sample.passage && sample.choices) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.passage,
        options: it.choices,
        correct: it.correct ?? it.c ?? 0,
        explanation: it.fb || it.explain || "",
      })),
    };
  }

  // {phrase, correct, opts} → MatchingExercise
  if (sample.phrase && sample.opts) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.phrase,
        options: it.opts,
        correct: it.correct,
        explanation: "",
      })),
    };
  }

  // {passage, clueType, clueText, choices, answer, explain} → MatchingExercise
  if (sample.clueType && sample.choices) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.passage + (it.clueText ? ` [${it.clueType}: "${it.clueText}"]` : ""),
        options: it.choices,
        correct: it.answer ?? it.correct ?? 0,
        explanation: it.explain || it.fb || "",
      })),
    };
  }

  // Generic fallback with opts/ch/choices
  if (sample.opts || sample.ch || sample.choices) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.prompt || it.q || it.word || it.passage || it.text || it.phrase || it.sentence || "Select the best answer:",
        options: it.opts || it.ch || it.choices || [],
        correct: Array.isArray(it.c ?? it.correct ?? it.answer) ? (it.c ?? it.correct ?? it.answer)[0] : (it.c ?? it.correct ?? it.answer ?? 0),
        explanation: it.fb || it.explain || it.explanation || "",
      })),
    };
  }

  // {sentence, error, fix, explain} → MatchingExercise (as identification)
  if (sample.sentence && sample.error && sample.fix) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.sentence,
        options: ["Dangling modifier", "Squinting modifier", "Misplaced modifier", "No error"],
        correct: ["dangling", "squinting", "misplaced", "none"].indexOf(it.error.toLowerCase()),
        explanation: it.explain + (it.fix ? ` Corrected: "${it.fix}"` : ""),
      })),
    };
  }

  console.log(`  [SKIP] ${name}: unrecognized format, keys: ${Object.keys(sample).sort().join(",")}`);
  return null;
}

function exerciseLabel(name) {
  return name
    .replace(/_QS$|_ITEMS$|_DATA$/, "")
    .replace(/_/g, " ")
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// ────────────────────────────────────────────
// TSX code generators
// ────────────────────────────────────────────

function generateQuizQuestionsTSX(questions) {
  const lines = [];
  for (const q of questions) {
    const parts = [];
    if (q.passage) parts.push(`passage: ${JSON.stringify(q.passage)},`);
    parts.push(`stem: ${JSON.stringify(q.stem)},`);
    parts.push(`choices: ${JSON.stringify(q.choices)},`);
    parts.push(`correct: ${q.correct},`);
    parts.push(`explanation: ${JSON.stringify(q.explanation)},`);
    if (q.difficulty) parts.push(`difficulty: ${JSON.stringify(q.difficulty)},`);
    if (q.type) parts.push(`type: ${JSON.stringify(q.type)},`);
    if (q.domain) parts.push(`domain: ${JSON.stringify(q.domain)},`);
    if (q.skill) parts.push(`skill: ${JSON.stringify(q.skill)},`);
    if (q.trap) parts.push(`trap: ${JSON.stringify(q.trap)},`);
    if (q.trapAnswer !== undefined) parts.push(`trapAnswer: ${q.trapAnswer},`);
    if (q.trapDesc) parts.push(`trapDesc: ${JSON.stringify(q.trapDesc)},`);
    lines.push(`    {\n      ${parts.join("\n      ")}\n    },`);
  }
  return lines.join("\n");
}

function generateWarmupQuestionsTSX(questions) {
  const lines = [];
  for (const q of questions) {
    const parts = [];
    if (q.source) parts.push(`source: ${JSON.stringify(q.source)},`);
    parts.push(`stem: ${JSON.stringify(q.stem)},`);
    parts.push(`choices: ${JSON.stringify(q.choices)},`);
    parts.push(`correct: ${q.correct},`);
    parts.push(`explanation: ${JSON.stringify(q.explanation)},`);
    lines.push(`    {\n      ${parts.join("\n      ")}\n    },`);
  }
  return lines.join("\n");
}

// ────────────────────────────────────────────
// Page updater
// ────────────────────────────────────────────

function processModule(course, moduleNum) {
  const jsonPath = path.join(DATA_DIR, course, `module-${moduleNum}.json`);
  const pagePath = path.join(PAGES_DIR, course, String(moduleNum), "page.tsx");

  if (!existsSync(jsonPath)) return { status: "no-data" };
  if (!existsSync(pagePath)) return { status: "no-page" };

  const data = JSON.parse(readFileSync(jsonPath, "utf8"));
  const currentTSX = readFileSync(pagePath, "utf8");

  // Detect existing content - check for both inline arrays AND variable references
  const hasQuiz = /quiz:\s*(\[|[A-Z_]+)/.test(currentTSX);
  const hasWarmup = /warmup:\s*(\[|[A-Z_]+)/.test(currentTSX);
  const hasChallenge = /challenge:\s*(\[|[A-Z_]+)/.test(currentTSX);
  const hasActivities = currentTSX.includes("activities=");

  const needsQuiz = !hasQuiz && ((data.quiz || []).length > 0 || (data.practice || []).length > 0);
  const needsWarmup = !hasWarmup && (data.warmup || []).length > 0;
  const needsChallenge = !hasChallenge && (data.challenge || []).length > 0;
  const exerciseEntries = Object.entries(data.exercises || {}).filter(
    ([, items]) => Array.isArray(items) && items.length > 0
  );
  const needsExercises = !hasActivities && exerciseEntries.length > 0;

  if (!needsQuiz && !needsWarmup && !needsChallenge && !needsExercises) {
    return { status: "ok" };
  }

  const changes = [];
  let updatedTSX = currentTSX;

  // ─── Add missing questions to config ───
  if (needsWarmup) {
    const warmupQs = data.warmup.map(normalizeWarmup).filter(Boolean);
    if (warmupQs.length > 0) {
      const warmupTSX = `\n  /* ──────── WARMUP ──────── */\n  warmup: [\n${generateWarmupQuestionsTSX(warmupQs)}\n  ],`;
      updatedTSX = insertBeforeConfigEnd(updatedTSX, warmupTSX);
      changes.push(`warmup(${warmupQs.length})`);
      if (!updatedTSX.includes('"warmup"')) {
        updatedTSX = addScreen(updatedTSX, "warmup", "Warm-Up", "brain", "welcome");
      }
    }
  }

  if (needsQuiz) {
    const rawQuiz = (data.quiz || []).length > 0 ? data.quiz : data.practice || [];
    const quizQs = rawQuiz.map(normalizeQuiz).filter(Boolean);
    if (quizQs.length > 0) {
      const quizTSX = `\n  /* ──────── PRACTICE QUIZ ──────── */\n  quiz: [\n${generateQuizQuestionsTSX(quizQs)}\n  ],`;
      updatedTSX = insertBeforeConfigEnd(updatedTSX, quizTSX);
      changes.push(`quiz(${quizQs.length})`);
      if (!updatedTSX.includes('"quiz"')) {
        updatedTSX = addScreen(updatedTSX, "quiz", "Practice Quiz", "target", "lesson");
      }
    }
  }

  if (needsChallenge) {
    const challengeQs = data.challenge.map(normalizeQuiz).filter(Boolean);
    if (challengeQs.length > 0) {
      const challengeTSX = `\n  /* ──────── CHALLENGE ──────── */\n  challenge: [\n${generateQuizQuestionsTSX(challengeQs)}\n  ],`;
      updatedTSX = insertBeforeConfigEnd(updatedTSX, challengeTSX);
      changes.push(`challenge(${challengeQs.length})`);
      if (!updatedTSX.includes('"challenge"')) {
        updatedTSX = addScreen(updatedTSX, "challenge", "Challenge", "star", "quiz");
      }
    }
  }

  // ─── Add exercise activities ───
  if (needsExercises) {
    const exerciseScreens = [];

    for (const [name, items] of exerciseEntries) {
      const mapped = mapExercise(name, items);
      if (!mapped) continue;

      const screenId = `exercise-${name.toLowerCase().replace(/_/g, "-")}`;
      const label = exerciseLabel(name);
      exerciseScreens.push({ id: screenId, label, name, mapped });
    }

    if (exerciseScreens.length > 0) {
      // Add exercise screens
      for (const es of exerciseScreens) {
        updatedTSX = addScreen(updatedTSX, es.id, es.label, "zap", "lesson");
      }

      // Generate data constants and activities
      const imports = new Set();
      const activityEntries = [];
      const dataConstants = [];

      for (const es of exerciseScreens) {
        const m = es.mapped;
        const constName = es.name.toUpperCase() + "_EXERCISE_DATA";

        if (m.type === "MatchingExercise") {
          imports.add("matching");
          dataConstants.push(`const ${constName}: MatchingItem[] = ${JSON.stringify(m.items, null, 2)};`);
          activityEntries.push(
            `        "${es.id}": (\n          <MatchingExercise\n            items={${constName}}\n            title="${es.label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`
          );
        } else if (m.type === "FillInExercise") {
          imports.add("fillin");
          dataConstants.push(`const ${constName}: FillInItem[] = ${JSON.stringify(m.items, null, 2)};`);
          activityEntries.push(
            `        "${es.id}": (\n          <FillInExercise\n            items={${constName}}\n            title="${es.label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`
          );
        }
      }

      // Add imports at top of file (after last existing import, within first 15 lines)
      const importLines = [];
      if (imports.has("matching")) {
        importLines.push('import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";');
      }
      if (imports.has("fillin")) {
        importLines.push('import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";');
      }

      for (const imp of importLines) {
        updatedTSX = addImportSafe(updatedTSX, imp);
      }

      // Add data constants before MODULE_CONFIG
      const configStart = updatedTSX.indexOf("const MODULE_CONFIG");
      if (configStart > 0) {
        updatedTSX = updatedTSX.substring(0, configStart) +
          dataConstants.join("\n\n") + "\n\n" +
          updatedTSX.substring(configStart);
      }

      // Add activities prop to ModuleShell
      const activitiesProp = `\n      activities={{\n${activityEntries.join(",\n")}\n      }}`;
      updatedTSX = addActivitiesProp(updatedTSX, activitiesProp);

      changes.push(`exercises(${exerciseScreens.length} screens)`);
    }
  }

  if (changes.length > 0) {
    writeFileSync(pagePath, updatedTSX);
  }

  return { status: "updated", changes };
}

// ────────────────────────────────────────────
// TSX manipulation helpers
// ────────────────────────────────────────────

function insertBeforeConfigEnd(tsx, insertion) {
  const lastClose = tsx.lastIndexOf("};");
  if (lastClose === -1) return tsx;
  return tsx.substring(0, lastClose) + insertion + "\n" + tsx.substring(lastClose);
}

function addScreen(tsx, id, label, icon, afterId) {
  const screensMatch = tsx.match(/screens:\s*\[[\s\S]*?\],/);
  if (!screensMatch) return tsx;
  const screensBlock = screensMatch[0];
  if (screensBlock.includes(`"${id}"`)) return tsx;

  const newScreen = `    { id: "${id}", label: "${label}", icon: "${icon}" },`;
  const completePattern = /(\{[^}]*id:\s*"complete"[^}]*\})/;

  let updatedScreens;
  if (completePattern.test(screensBlock)) {
    updatedScreens = screensBlock.replace(completePattern, newScreen + "\n    $1");
  } else {
    const closeBracket = screensBlock.lastIndexOf("]");
    updatedScreens = screensBlock.substring(0, closeBracket) + newScreen + "\n  " + screensBlock.substring(closeBracket);
  }

  return tsx.replace(screensBlock, updatedScreens);
}

function addImportSafe(tsx, importLine) {
  const modulePath = importLine.match(/from\s+"([^"]+)"/)?.[1];
  if (modulePath && tsx.includes(modulePath)) return tsx;

  // Only search for import statements in the first 15 lines
  const lines = tsx.split("\n");
  let lastImportIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    if (lines[i].startsWith("import ")) lastImportIdx = i;
  }

  if (lastImportIdx === -1) {
    lines.splice(1, 0, importLine); // After "use client"
  } else {
    lines.splice(lastImportIdx + 1, 0, importLine);
  }

  return lines.join("\n");
}

function addActivitiesProp(tsx, activitiesProp) {
  if (tsx.includes("activities=")) return tsx;

  const shellMatch = tsx.match(/<ModuleShell\s[\s\S]*?\/>/);
  if (!shellMatch) return tsx;

  const shellJSX = shellMatch[0];
  const closingSlash = shellJSX.lastIndexOf("/>");
  const updatedShell = shellJSX.substring(0, closingSlash) + activitiesProp + "\n    " + shellJSX.substring(closingSlash);
  return tsx.replace(shellJSX, updatedShell);
}

// ────────────────────────────────────────────
// Main
// ────────────────────────────────────────────

let totalUpdated = 0;
let totalSkipped = 0;

for (const course of COURSES) {
  const dataDir = path.join(DATA_DIR, course);
  if (!existsSync(dataDir)) continue;

  const files = readdirSync(dataDir).filter(f => f.endsWith(".json"));
  for (const f of files) {
    const num = f.replace("module-", "").replace(".json", "");
    const result = processModule(course, num);

    if (result.status === "updated") {
      console.log(`+ ${course}/${num}: ${result.changes.join(", ")}`);
      totalUpdated++;
    } else if (result.status === "no-page") {
      console.log(`x ${course}/${num}: no page.tsx found`);
    } else if (result.status === "ok") {
      totalSkipped++;
    }
  }
}

console.log(`\nDone: ${totalUpdated} updated, ${totalSkipped} already complete`);
