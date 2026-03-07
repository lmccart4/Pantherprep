/**
 * generate-remaining.mjs (v3)
 *
 * Handles ALL remaining unmapped exercises, including files that
 * already have activities. Adds missing exercises to existing
 * activities prop or creates new ones.
 *
 * Also handles display-only data as visual components.
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
// Exercise mapper — handles ALL known formats
// ────────────────────────────────────────────

function mapExercise(name, items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const s = items[0]; // sample
  const keys = Object.keys(s).sort().join(",");

  // ─── DISPLAY-ONLY (skip) ───
  // HOMEWORK {color,detail,icon,task}
  if (s.task && s.icon && s.detail) return { type: "display", kind: "homework" };
  // PHASES {color,hp,icon,name,subtitle}
  if (s.hp !== undefined && s.name && s.color) return { type: "display", kind: "phases" };
  // RULES {num,source,text}
  if (s.num !== undefined && s.source && s.text && !s.opts && !s.c) return { type: "display", kind: "rules" };
  // ROOTS_TABLE {examples,meaning,root}
  if (s.root && s.meaning && s.examples) return { type: "display", kind: "roots" };
  // DECON {notes,tags,title}
  if (s.notes && s.tags && s.title && !s.opts) return { type: "display", kind: "decon" };
  // FUNC_PASSAGES {sentences}
  if (s.sentences && Object.keys(s).length === 1) return { type: "display", kind: "passages" };
  // CIR {center,eq,r}
  if (s.center !== undefined && s.eq && s.r !== undefined) return { type: "display", kind: "circles" };
  // ANG {a,p,s,t} / TRI/CMP {acc,p,s} — geometry display
  if (s.p && s.s && !s.opts && !s.fb && !s.choices && (s.t !== undefined || s.a !== undefined || s.acc !== undefined)) return { type: "display", kind: "geometry" };
  // TBL_ROWS {0,1,2,3} — table row data
  if (s["0"] !== undefined && s["1"] !== undefined) return { type: "display", kind: "table" };
  // TENSE_ITEMS {blanks,passage} — passage with blanks (complex interactive)
  if (s.blanks && s.passage && !s.opts) return { type: "display", kind: "blanks" };
  // EVM {claim,quotes} — evidence mapping display
  if (s.claim && s.quotes && !s.opts) return { type: "display", kind: "evidence" };
  // EVI {claims,passage} — evidence display
  if (s.claims && s.passage && !s.opts && !s.c) return { type: "display", kind: "evidence" };
  // SEMI_TESTS/COLON_TESTS {left,ok,reason,right}
  if (s.left && s.right && s.ok !== undefined && s.reason) return { type: "display", kind: "punctuation-tests" };

  // ─── MATCHING EXERCISE (options/choices + correct answer) ───

  // {prompt, options, correct, explain}
  if (s.options && (s.correct !== undefined || s.c !== undefined) && (s.prompt || s.scenario || s.q)) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.prompt || it.scenario || it.q || "Select the best answer:",
        options: it.options,
        correct: normalize_correct(it.correct ?? it.c, it.options),
        explanation: it.explain || it.explanation || it.fb || "",
      })),
    };
  }

  // {correct,fb,opts,q} / {c,fb,opts,q}
  if (s.opts && (s.q || s.prompt || s.scenario || s.claim)) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.q || it.prompt || it.scenario || it.claim || "Select the best answer:",
        options: it.opts,
        correct: normalize_correct(it.correct ?? it.c, it.opts),
        explanation: it.fb || it.explain || "",
      })),
    };
  }

  // {c,ch,fb,q}
  if (s.ch && s.q) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.q,
        options: it.ch,
        correct: normalize_correct(it.c ?? it.correct, it.ch),
        explanation: it.fb || "",
      })),
    };
  }

  // {answer,choices,...,passage} — quiz-style
  if (s.choices && s.passage && (s.answer !== undefined || s.correct !== undefined)) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.passage,
        options: it.choices,
        correct: normalize_correct(it.answer ?? it.correct, it.choices),
        explanation: it.explain || it.fb || "",
      })),
    };
  }

  // {correct,opts,phrase}
  if (s.phrase && s.opts) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.phrase,
        options: it.opts,
        correct: normalize_correct(it.correct, it.opts),
        explanation: "",
      })),
    };
  }

  // {correct,expr,fb,opts} / {display,expr,opts}
  if (s.expr && s.opts) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.display || it.expr,
        options: it.opts,
        correct: normalize_correct(it.correct ?? it.c, it.opts),
        explanation: it.fb || "",
      })),
    };
  }

  // {correct,fb,scenario} — scenario with no opts → make it FillIn
  if (s.scenario && s.correct !== undefined && !s.opts && !s.options) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: it.scenario,
        answer: it.correct,
        solution: it.fb || "",
      })),
    };
  }

  // {correct,fb,q} / {c,fb,q} — without opts → FillIn
  if ((s.q || s.stem) && (s.correct !== undefined || s.c !== undefined) && !s.opts && !s.options && !s.ch && !s.choices) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: it.q || it.stem,
        answer: it.correct ?? it.c,
        solution: it.fb || "",
      })),
    };
  }

  // ─── FILL-IN EXERCISE ───

  // {answer/ans, prompt/p, solution/s, tier/t}
  if ((s.answer !== undefined || s.ans !== undefined) && (s.prompt || s.p) && (s.solution || s.s) && !s.opts && !s.options && !s.choices) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: it.prompt || it.p,
        answer: it.answer ?? it.ans,
        tolerance: it.tolerance || it.accept || it.acc,
        solution: it.solution || it.s || "",
        tier: it.tier || it.t,
      })),
    };
  }

  // {correct/c, eq, fb} — equation solve
  if (s.eq && (s.correct !== undefined || s.c !== undefined) && !s.opts) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: `Solve: ${it.eq}`,
        answer: it.correct ?? it.c,
        solution: it.fb || it.reveal || "",
      })),
    };
  }

  // {answers, expr, solution, technique}
  if (s.expr && s.answers && s.solution) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: `Factor: ${it.expr}`,
        answer: Array.isArray(it.answers) ? it.answers[0] : it.answers,
        solution: it.solution + (it.technique ? ` (${it.technique})` : ""),
      })),
    };
  }

  // {correct,eq1,eq2,fb}
  if (s.eq1 && s.eq2) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: `Solve the system:\n${it.eq1}\n${it.eq2}`,
        answer: it.correct ?? it.c,
        solution: it.fb || "",
      })),
    };
  }

  // ─── CLASSIFICATION EXERCISE ───

  // COURTROOM {crime,explain,fix,sentence,verdict}
  if (s.crime && s.sentence && s.verdict) {
    const categories = [...new Set(items.map(it => it.crime))];
    return {
      type: "ClassificationExercise",
      categories,
      items: items.map(it => ({
        prompt: it.sentence,
        correct: it.crime,
        explanation: `${it.verdict}. ${it.explain}` + (it.fix ? ` Fix: "${it.fix}"` : ""),
      })),
    };
  }

  // {ic, text} — clause identification
  if (s.ic !== undefined && s.text) {
    return {
      type: "ClassificationExercise",
      categories: ["Independent Clause", "Dependent Clause"],
      items: items.map(it => ({
        prompt: it.text,
        correct: it.ic ? "Independent Clause" : "Dependent Clause",
        explanation: "",
      })),
    };
  }

  // {cat, text, why}
  if (s.cat && s.text && s.why) {
    const categories = [...new Set(items.map(it => it.cat))];
    return {
      type: "ClassificationExercise",
      categories,
      items: items.map(it => ({
        prompt: it.text,
        correct: it.cat,
        explanation: it.why,
      })),
    };
  }

  // {c,fb,text} — classification by category (c is string/number)
  if (s.text && s.c !== undefined && s.fb && !s.opts && !s.options) {
    if (typeof items[0].c === "string" || (typeof items[0].c === "number" && items[0].c < 10)) {
      const categories = [...new Set(items.map(it => String(it.c)))];
      if (categories.length <= 6) {
        return {
          type: "ClassificationExercise",
          categories,
          items: items.map(it => ({
            prompt: it.text,
            correct: String(it.c),
            explanation: it.fb,
          })),
        };
      }
    }
  }

  // {c,fb,sent} — classify sentences
  if (s.sent && s.c !== undefined && s.fb) {
    const categories = [...new Set(items.map(it => String(it.c)))];
    return {
      type: "ClassificationExercise",
      categories,
      items: items.map(it => ({
        prompt: it.sent,
        correct: String(it.c),
        explanation: it.fb,
      })),
    };
  }

  // {c,word} — classify words
  if (s.word && s.c !== undefined && !s.opts && !s.fb) {
    const categories = [...new Set(items.map(it => String(it.c)))];
    return {
      type: "SorterExercise",
      buckets: categories,
      items: items.map(it => ({
        text: it.word,
        correct: String(it.c),
      })),
    };
  }

  // {c,fb,s1,s2} — relationship classification
  if (s.s1 && s.s2 && s.c !== undefined) {
    const categories = [...new Set(items.map(it => String(it.c)))];
    return {
      type: "ClassificationExercise",
      categories,
      items: items.map(it => ({
        prompt: `Sentence 1: "${it.s1}"\nSentence 2: "${it.s2}"`,
        correct: String(it.c),
        explanation: it.fb || "",
      })),
    };
  }

  // {c,fb,stem} — classification by stem
  if (s.stem && s.c !== undefined && s.fb && !s.opts && !s.choices) {
    const categories = [...new Set(items.map(it => String(it.c)))];
    return {
      type: "ClassificationExercise",
      categories,
      items: items.map(it => ({
        prompt: it.stem,
        correct: String(it.c),
        explanation: it.fb,
      })),
    };
  }

  // ─── SORTER EXERCISE ───

  // {label,order,words} — spectrum sorting
  if (s.label && s.order && s.words) {
    const buckets = items.map(it => it.label);
    const allItems = [];
    for (const it of items) {
      for (const w of it.words || []) {
        allItems.push({ text: w, correct: it.label });
      }
    }
    return {
      type: "SorterExercise",
      buckets,
      items: allItems,
    };
  }

  // {passage,statements} — statement sorter
  if (s.passage && s.statements) {
    // Can't easily make this interactive without more context
    return { type: "display", kind: "statement-sorter" };
  }

  // ─── SPECIAL: HUNT_ITEMS ───
  // {correctVerb,explain,sentence,subjectIdx,verbChoices,words}
  if (s.verbChoices && s.words && s.correctVerb) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.sentence || it.words.join(" "),
        options: it.verbChoices,
        correct: normalize_correct(it.correctVerb, it.verbChoices),
        explanation: it.explain || "",
      })),
    };
  }

  // ─── SPECIAL: BATTLE_QUESTIONS ───
  // {answer,choices,diff,explain,id,passage,phase,skill}
  if (s.choices && s.passage && s.answer !== undefined && s.phase) {
    return {
      type: "BossBattle",
      items: items.map(it => ({
        passage: it.passage || null,
        stem: "Which choice completes the text so that it conforms to Standard English?",
        choices: it.choices,
        correct: normalize_correct(it.answer, it.choices),
        explanation: it.explain || "",
        difficulty: it.diff || undefined,
        skill: it.skill || undefined,
      })),
    };
  }

  // ─── SPECIAL: {explain,right,wrong} MOD_DATA ───
  if (s.wrong && s.right && s.explain && !s.opts) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: `Which is correct?\n\nA) ${it.wrong}\nB) ${it.right}`,
        options: [it.wrong, it.right],
        correct: 1,
        explanation: it.explain,
      })),
    };
  }

  // ─── SPECIAL: {does,says,sent} SD_DATA ───
  if (s.does && s.says && s.sent) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.sent,
        options: [it.says, it.does, "Neither"],
        correct: 0, // "says" is option 0
        explanation: `What it SAYS: ${it.says}\nWhat it DOES: ${it.does}`,
      })),
    };
  }

  // ─── SPECIAL: TRAPS {fb,passage,q,right,trap,wrong} ───
  if (s.trap && s.right && s.wrong && s.passage) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.passage + (it.q ? "\n\n" + it.q : ""),
        options: [it.right, it.wrong],
        correct: 0,
        explanation: `Trap: ${it.trap}. ${it.fb || ""}`,
      })),
    };
  }
  // TRAPS variant {claim,fb,right,trap,wrong}
  if (s.trap && s.right && s.wrong && s.claim) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.claim,
        options: [it.right, it.wrong],
        correct: 0,
        explanation: `Trap: ${it.trap}. ${it.fb || ""}`,
      })),
    };
  }

  // ─── SPECIAL: {c,fb,passage,wrong} AUT ───
  if (s.passage && s.wrong && s.c !== undefined && !s.opts && !s.options) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.passage,
        options: ["Correct interpretation", it.wrong],
        correct: 0,
        explanation: it.fb || "",
      })),
    };
  }

  // ─── SPECIAL: {c,claim,fb,passage} INF ───
  if (s.claim && s.passage && s.c !== undefined && !s.opts) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: `${it.passage}\n\nClaim: "${it.claim}"`,
        options: ["Supported", "Not supported"],
        correct: normalize_correct(it.c, ["Supported", "Not supported"]),
        explanation: it.fb || "",
      })),
    };
  }

  // ─── SPECIAL: {c,fb,s} EC ───
  if (s.s && s.c !== undefined && s.fb && Object.keys(s).length === 3) {
    const categories = [...new Set(items.map(it => String(it.c)))];
    return {
      type: "ClassificationExercise",
      categories,
      items: items.map(it => ({
        prompt: it.s,
        correct: String(it.c),
        explanation: it.fb,
      })),
    };
  }

  // ─── SPECIAL: MORPH {distractors,meaning,parts,target} ───
  if (s.target && s.parts && s.distractors && s.meaning) {
    return {
      type: "MatchingExercise",
      items: items.map(it => {
        const allOpts = [it.target, ...it.distractors].sort(() => Math.random() - 0.5);
        return {
          prompt: `Word parts: ${it.parts}\nMeaning: ${it.meaning}`,
          options: allOpts,
          correct: allOpts.indexOf(it.target),
          explanation: `The target word is "${it.target}" (${it.parts} → ${it.meaning})`,
        };
      }),
    };
  }

  // ─── SPECIAL: TONE_PASSAGES {explain,text,tone} ───
  if (s.text && s.tone && s.explain && !s.opts) {
    const tones = [...new Set(items.map(it => it.tone))];
    return {
      type: "ClassificationExercise",
      categories: tones,
      items: items.map(it => ({
        prompt: it.text,
        correct: it.tone,
        explanation: it.explain,
      })),
    };
  }

  // ─── SPECIAL: WARMUP_ITEMS {answer,choices,diff,domain,explain,passage} ───
  if (s.passage && s.choices && s.answer !== undefined && s.domain) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.passage,
        options: it.choices,
        correct: normalize_correct(it.answer, it.choices),
        explanation: it.explain || "",
      })),
    };
  }

  console.log(`  [SKIP] ${name}: unhandled format, keys: ${keys}`);
  return null;
}

function normalize_correct(val, options) {
  if (val === undefined || val === null) return 0;
  if (Array.isArray(val)) return typeof val[0] === "number" ? val[0] : 0;
  if (typeof val === "number") return val;
  if (typeof val === "string" && options) {
    const idx = options.indexOf(val);
    if (idx >= 0) return idx;
  }
  return 0;
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
// Page updater — handles both new and existing activities
// ────────────────────────────────────────────

function processModule(course, moduleNum) {
  const jsonPath = path.join(DATA_DIR, course, `module-${moduleNum}.json`);
  const pagePath = path.join(PAGES_DIR, course, String(moduleNum), "page.tsx");

  if (!existsSync(jsonPath) || !existsSync(pagePath)) return null;

  const data = JSON.parse(readFileSync(jsonPath, "utf8"));
  const tsx = readFileSync(pagePath, "utf8");

  const exerciseEntries = Object.entries(data.exercises || {}).filter(
    ([, v]) => Array.isArray(v) && v.length > 0
  );
  if (exerciseEntries.length === 0) return null;

  // Find exercises not yet wired
  const unmapped = exerciseEntries.filter(([name]) => {
    const screenId = "exercise-" + name.toLowerCase().replace(/_/g, "-");
    return !tsx.includes(screenId) && !tsx.includes(name);
  });

  if (unmapped.length === 0) return null;

  // Map exercises
  const mappedExercises = [];
  const skipped = [];
  for (const [name, items] of unmapped) {
    const result = mapExercise(name, items);
    if (!result) {
      skipped.push(name);
      continue;
    }
    if (result.type === "display") {
      // Display-only data — skip for now (could be lesson visuals later)
      continue;
    }
    mappedExercises.push({ name, mapped: result, label: exerciseLabel(name) });
  }

  if (mappedExercises.length === 0) return null;

  // Generate the code
  let updatedTSX = tsx;
  const hasActivities = tsx.includes("activities=");
  const importsNeeded = new Set();
  const dataConstants = [];
  const activityEntries = [];

  for (const ex of mappedExercises) {
    const constName = ex.name.toUpperCase() + "_EXERCISE";
    const screenId = `exercise-${ex.name.toLowerCase().replace(/_/g, "-")}`;

    if (ex.mapped.type === "MatchingExercise") {
      importsNeeded.add("matching");
      dataConstants.push(`const ${constName}: MatchingItem[] = ${JSON.stringify(ex.mapped.items, null, 2)};`);
      activityEntries.push({
        screenId,
        jsx: `        "${screenId}": (\n          <MatchingExercise\n            items={${constName}}\n            title="${ex.label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`,
      });
    } else if (ex.mapped.type === "FillInExercise") {
      importsNeeded.add("fillin");
      dataConstants.push(`const ${constName}: FillInItem[] = ${JSON.stringify(ex.mapped.items, null, 2)};`);
      activityEntries.push({
        screenId,
        jsx: `        "${screenId}": (\n          <FillInExercise\n            items={${constName}}\n            title="${ex.label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`,
      });
    } else if (ex.mapped.type === "ClassificationExercise") {
      importsNeeded.add("classification");
      dataConstants.push(`const ${constName}: ClassificationItem[] = ${JSON.stringify(ex.mapped.items, null, 2)};`);
      activityEntries.push({
        screenId,
        jsx: `        "${screenId}": (\n          <ClassificationExercise\n            items={${constName}}\n            categories={${JSON.stringify(ex.mapped.categories)}}\n            title="${ex.label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`,
      });
    } else if (ex.mapped.type === "SorterExercise") {
      importsNeeded.add("sorter");
      dataConstants.push(`const ${constName}: SorterItem[] = ${JSON.stringify(ex.mapped.items, null, 2)};`);
      activityEntries.push({
        screenId,
        jsx: `        "${screenId}": (\n          <SorterExercise\n            items={${constName}}\n            buckets={${JSON.stringify(ex.mapped.buckets)}}\n            title="${ex.label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`,
      });
    } else if (ex.mapped.type === "BossBattle") {
      importsNeeded.add("boss");
      dataConstants.push(`const ${constName}: QuizQuestion[] = ${JSON.stringify(ex.mapped.items, null, 2)};`);
      activityEntries.push({
        screenId,
        jsx: `        "${screenId}": (goNext) => (\n          <BossBattle\n            questions={${constName}}\n            title="${ex.label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={goNext}\n          />\n        )`,
      });
    }
  }

  if (activityEntries.length === 0) return null;

  // Add imports
  const importMap = {
    matching: 'import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";',
    fillin: 'import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";',
    classification: 'import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";',
    sorter: 'import { SorterExercise, type SorterItem } from "@/components/course/activities/sorter-exercise";',
    boss: 'import { BossBattle } from "@/components/course/activities/boss-battle";',
  };

  for (const key of importsNeeded) {
    const imp = importMap[key];
    const modPath = imp.match(/from\s+"([^"]+)"/)?.[1];
    if (modPath && updatedTSX.includes(modPath)) continue;
    // Also check barrel imports
    if (key === "boss" && updatedTSX.includes("BossBattle")) continue;
    if (key === "matching" && updatedTSX.includes("MatchingExercise")) continue;
    if (key === "fillin" && updatedTSX.includes("FillInExercise")) continue;
    if (key === "classification" && updatedTSX.includes("ClassificationExercise")) continue;
    if (key === "sorter" && updatedTSX.includes("SorterExercise")) continue;
    updatedTSX = addImportSafe(updatedTSX, imp);
  }

  // Need QuizQuestion type for BossBattle
  if (importsNeeded.has("boss") && !updatedTSX.includes("QuizQuestion")) {
    updatedTSX = addImportSafe(updatedTSX, 'import type { QuizQuestion } from "@/types/module";');
  }

  // Add data constants before MODULE_CONFIG
  const configStart = updatedTSX.indexOf("const MODULE_CONFIG");
  if (configStart > 0) {
    updatedTSX = updatedTSX.substring(0, configStart) +
      dataConstants.join("\n\n") + "\n\n" +
      updatedTSX.substring(configStart);
  }

  // Add screens
  for (const ae of activityEntries) {
    updatedTSX = addScreen(updatedTSX, ae.screenId, exerciseLabel(ae.screenId.replace("exercise-", "").replace(/-/g, "_")), "zap");
  }

  // Add/merge activities
  if (hasActivities) {
    // Merge into existing activities prop
    const activitiesJSX = activityEntries.map(ae => ae.jsx).join(",\n");
    // Find the closing }} of the activities prop and insert before it
    const closingPattern = /(\s*\}\})\s*\n\s*(nextModuleHref|\/\>)/;
    const match = updatedTSX.match(closingPattern);
    if (match) {
      const insertPos = updatedTSX.indexOf(match[0]);
      updatedTSX = updatedTSX.substring(0, insertPos) +
        ",\n" + activitiesJSX +
        "\n" + match[0].trimStart();
    }
  } else {
    // Create new activities prop
    const activitiesJSX = activityEntries.map(ae => ae.jsx).join(",\n");
    const activitiesProp = `\n      activities={{\n${activitiesJSX}\n      }}`;
    updatedTSX = addActivitiesProp(updatedTSX, activitiesProp);
  }

  writeFileSync(pagePath, updatedTSX);
  return mappedExercises.map(e => e.name);
}

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

function addImportSafe(tsx, importLine) {
  const lines = tsx.split("\n");
  let lastImportIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    if (lines[i].startsWith("import ")) lastImportIdx = i;
  }
  if (lastImportIdx === -1) {
    lines.splice(1, 0, importLine);
  } else {
    lines.splice(lastImportIdx + 1, 0, importLine);
  }
  return lines.join("\n");
}

function addScreen(tsx, id, label, icon) {
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

for (const course of COURSES) {
  const dataDir = path.join(DATA_DIR, course);
  if (!existsSync(dataDir)) continue;

  for (const f of readdirSync(dataDir).filter(f => f.endsWith(".json"))) {
    const num = f.replace("module-", "").replace(".json", "");
    const result = processModule(course, num);
    if (result && result.length > 0) {
      console.log(`+ ${course}/${num}: ${result.join(", ")}`);
      totalUpdated++;
    }
  }
}

console.log(`\nDone: ${totalUpdated} modules updated`);
