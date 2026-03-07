/**
 * rebuild-broken.mjs
 *
 * Rebuilds all 30 files that were truncated by generate-remaining.mjs.
 * Reads JSON data + HTML source + surviving file content to reconstruct
 * each page.tsx completely.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

// ────────────────────────────────────────────
// Configuration
// ────────────────────────────────────────────

const BROKEN_FILES = [
  "nmsqt-math/2","nmsqt-math/3","nmsqt-math/4","nmsqt-math/5","nmsqt-math/6","nmsqt-math/7",
  "nmsqt-rw/2","nmsqt-rw/3","nmsqt-rw/4","nmsqt-rw/7",
  "psat89-math/2","psat89-math/3","psat89-math/4","psat89-math/6",
  "psat89-rw/1","psat89-rw/3","psat89-rw/4","psat89-rw/5","psat89-rw/6","psat89-rw/7","psat89-rw/8","psat89-rw/9",
  "sat-math/2","sat-math/3","sat-math/7",
  "sat-rw/1","sat-rw/4","sat-rw/5","sat-rw/6","sat-rw/8",
];

const ACCENT_COLORS = {
  "sat-rw": "#C8102E",
  "sat-math": "#C8102E",
  "nmsqt-rw": "#d4a017",
  "nmsqt-math": "#d4a017",
  "psat89-rw": "#06b6d4",
  "psat89-math": "#06b6d4",
};

const TEST_TYPES = {
  "sat-rw": "sat", "sat-math": "sat",
  "nmsqt-rw": "nmsqt", "nmsqt-math": "nmsqt",
  "psat89-rw": "psat89", "psat89-math": "psat89",
};

const SECTIONS = {
  "sat-rw": "rw", "sat-math": "math",
  "nmsqt-rw": "rw", "nmsqt-math": "math",
  "psat89-rw": "rw", "psat89-math": "math",
};

const FUNC_NAMES = {
  "sat-rw": (n) => `SATRWModule${n}`,
  "sat-math": (n) => `SATMathModule${n}`,
  "nmsqt-rw": (n) => `NMSQTRWModule${n}`,
  "nmsqt-math": (n) => `NMSQTMathModule${n}`,
  "psat89-rw": (n) => `PSAT89RWModule${n}`,
  "psat89-math": (n) => `PSAT89MathModule${n}`,
};

function htmlPath(course, num) {
  const map = {
    "sat-rw": `public/course/SAT_RW_module${num}.html`,
    "sat-math": `public/math-course/module-${num}.html`,
    "nmsqt-rw": `public/nmsqt-rw-course/PSAT_NMSQT_RW_module-${num}.html`,
    "nmsqt-math": `public/nmsqt-math-course/module-${num}.html`,
    "psat89-rw": `public/psat89-rw-course/PSAT_89_RW_module-${num}.html`,
    "psat89-math": `public/psat89-math-course/module-${num}.html`,
  };
  return map[course];
}

// ────────────────────────────────────────────
// HTML metadata extraction
// ────────────────────────────────────────────

function extractModuleTitle(html) {
  const m = html.match(/<title>(.*?)<\/title>/);
  if (!m) return "Module";
  const title = m[1];
  // Extract just "Module N: Foo" part (before first em dash)
  const parts = title.split("—");
  let modTitle = parts[0].trim();
  // Strip "Module N: " prefix to get just the topic
  const topicMatch = modTitle.match(/Module\s+\d+:\s*(.*)/);
  return topicMatch ? topicMatch[1].trim() : modTitle;
}

function extractSubtitle(html) {
  // Try SUBTITLE constant
  let m = html.match(/const\s+SUBTITLE\s*=\s*[`"]([\s\S]*?)[`"]/);
  if (m) return m[1].replace(/\n/g, " ").trim();
  // Try subtitle property
  m = html.match(/subtitle["']?\s*[:=]\s*[`"]([\s\S]*?)[`"]/);
  if (m) return m[1].replace(/\n/g, " ").trim().substring(0, 120);
  return "";
}

// ────────────────────────────────────────────
// Question normalizers (from v2)
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
      correct: q.correct !== undefined && q.correct !== null ? q.correct : (q.answer ?? q.c ?? 0),
      explanation: q.explanation || q.explain || "",
    };
  }
  // {passage, choices, correct, explain} — no stem
  if (q.passage && q.choices) {
    return {
      source: q.source || undefined,
      stem: q.passage,
      choices: q.choices,
      correct: q.correct !== undefined && q.correct !== null ? q.correct : (q.answer ?? q.c ?? 0),
      explanation: q.explain || q.explanation || "",
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
      correct: q.correct !== undefined && q.correct !== null ? q.correct : (q.answer ?? q.c ?? 0),
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
      correct: q.correct !== undefined && q.correct !== null ? q.correct : (q.answer ?? q.c ?? 0),
      explanation: q.explain || q.explanation || "",
      difficulty: mapDifficulty(q.diff || q.difficulty),
    };
  }
  // {title, bullets, goal, choices, answer} — rhetorical synthesis
  if (q.bullets && q.goal && q.choices) {
    const passage = `Notes: "${q.title || ""}"\n\n${q.bullets.map(b => "• " + b).join("\n")}`;
    return {
      passage,
      stem: `Which choice most effectively uses relevant information from the notes to ${q.goal}?`,
      choices: q.choices,
      correct: q.answer ?? q.correct ?? 0,
      explanation: q.explain || "",
    };
  }
  return null;
}

function extractAnswerFromSolution(solution) {
  if (!solution) return "";
  // Try to find "= X" or "= X." at the end
  const m = solution.match(/=\s*([^\s.]+)\s*\.?\s*$/);
  if (m) return m[1];
  return "";
}

function mapDifficulty(d) {
  if (d === "easy" || d === "medium" || d === "hard") return d;
  return undefined;
}

// ────────────────────────────────────────────
// Exercise mapper (comprehensive, from v3)
// ────────────────────────────────────────────

function normalize_correct(val, options) {
  if (val === undefined || val === null) return 0;
  if (Array.isArray(val)) return typeof val[0] === "number" ? val[0] : 0;
  if (typeof val === "number") return val;
  if (typeof val === "string" && options) {
    const idx = options.indexOf(val);
    if (idx >= 0) return idx;
    // Try case-insensitive match
    const lower = val.toLowerCase();
    for (let i = 0; i < options.length; i++) {
      if (typeof options[i] === "string" && options[i].toLowerCase() === lower) return i;
    }
  }
  return 0;
}

function mapExercise(name, items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const s = items[0];
  const keys = Object.keys(s).sort().join(",");

  // ─── SHORT-KEY FILL-IN (before display-only checks) ───
  // {a, p, s} or {a, p, s, t} — answer, prompt, solution
  if (s.p && s.a !== undefined && s.s && !s.opts && !s.options && Object.keys(s).length <= 4) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: it.p,
        answer: it.a !== null && it.a !== undefined ? it.a : extractAnswerFromSolution(it.s),
        solution: it.s || "",
        tier: it.t,
      })),
    };
  }
  // {ans, p, s, t, acc} — with string answer and acceptance variants
  if (s.p && s.ans !== undefined && s.s) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: it.p,
        answer: it.ans,
        solution: it.s || "",
        tier: it.t,
      })),
    };
  }
  // {acc, p, s} — FillIn with acceptance tolerance (EXP, FAC patterns)
  if (s.p && s.s && s.acc !== undefined && s.a === undefined && s.ans === undefined && !s.opts) {
    return {
      type: "FillInExercise",
      items: items.map(it => ({
        prompt: it.p,
        answer: Array.isArray(it.acc) ? it.acc[0] : (it.acc ?? ""),
        solution: it.s || "",
      })),
    };
  }

  // ─── DISPLAY-ONLY (skip) ───
  if (s.task && s.icon && s.detail) return null;
  if (s.hp !== undefined && s.name && s.color) return null;
  if (s.num !== undefined && s.source && s.text && !s.opts && !s.c) return null;
  if (s.root && s.meaning && s.examples) return null;
  if (s.notes && s.tags && s.title && !s.opts) return null;
  if (s.sentences && Object.keys(s).length === 1) return null;
  if (s.center !== undefined && s.eq && s.r !== undefined) return null;
  if (s.p && s.s && !s.opts && !s.fb && !s.choices && (s.t !== undefined || s.a !== undefined || s.acc !== undefined)) return null;
  if (s["0"] !== undefined && s["1"] !== undefined) return null;
  if (s.blanks && s.passage && !s.opts) return null;
  if (s.claim && s.quotes && !s.opts) return null;
  if (s.claims && s.passage && !s.opts && !s.c) return null;
  if (s.left && s.right && s.ok !== undefined && s.reason) {
    return {
      type: "ClassificationExercise",
      categories: ["Correct", "Incorrect"],
      items: items.map(it => ({
        prompt: `"${it.left} ; ${it.right}"`,
        correct: it.ok ? "Correct" : "Incorrect",
        explanation: it.reason,
      })),
    };
  }
  if (s.passage && s.statements) return null;

  // ─── BOSS BATTLE (must check before MatchingExercise) ───
  if (s.choices && (s.passage || s.stem) && (s.answer !== undefined || s.correct !== undefined) && s.phase) {
    return {
      type: "BossBattle",
      items: items.map(it => ({
        passage: it.passage || null,
        stem: it.stem || "Which choice completes the text so that it conforms to Standard English?",
        choices: it.choices,
        correct: it.answer ?? it.correct ?? 0,
        explanation: it.explain || "",
        difficulty: mapDifficulty(it.diff || it.difficulty),
        skill: it.skill || undefined,
      })),
    };
  }

  // ─── MATCHING EXERCISE ───
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

  if (s.broken && s.options) {
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

  // Scenario with no opts → FillIn
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
  if ((s.answer !== undefined || s.ans !== undefined) && (s.prompt || s.p) && (s.solution || s.s) && !s.opts && !s.options && !s.choices) {
    return {
      type: "FillInExercise",
      items: items.map(it => {
        let tol = it.tolerance || it.accept || it.acc;
        if (Array.isArray(tol)) tol = undefined; // Tolerance must be a number, not array
        if (typeof tol === "string") tol = undefined;
        return {
          prompt: it.prompt || it.p,
          answer: it.answer ?? it.ans,
          tolerance: tol,
          solution: it.solution || it.s || "",
          tier: it.tier || it.t,
        };
      }),
    };
  }

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
  if (s.sentence && s.verdict && (s.crime !== undefined)) {
    const categories = [...new Set(items.map(it => it.crime || "Correct"))];
    return {
      type: "ClassificationExercise",
      categories,
      items: items.map(it => ({
        prompt: it.sentence,
        correct: it.crime || "Correct",
        explanation: `${it.verdict}. ${it.explain}` + (it.fix ? ` Fix: "${it.fix}"` : ""),
      })),
    };
  }

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

  if (s.word && s.c !== undefined && !s.opts) {
    const categories = [...new Set(items.map(it => String(it.c)))];
    if (s.fb) {
      // Has explanations → ClassificationExercise
      return {
        type: "ClassificationExercise",
        categories,
        items: items.map(it => ({
          prompt: it.word,
          correct: String(it.c),
          explanation: it.fb || "",
        })),
      };
    }
    return {
      type: "SorterExercise",
      buckets: categories,
      items: items.map(it => ({
        text: it.word,
        correct: String(it.c),
      })),
    };
  }

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
  if (s.label && s.order && s.words) {
    const buckets = items.map(it => it.label);
    const allItems = [];
    for (const it of items) {
      for (const w of it.words || []) {
        allItems.push({ text: w, correct: it.label });
      }
    }
    return { type: "SorterExercise", buckets, items: allItems };
  }

  // {passage, wordA, wordB, correct, explainA, explainB} — precision showdown
  if (s.wordA && s.wordB && s.passage) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: `${it.passage}\n\nA) ${it.wordA}  B) ${it.wordB}`,
        options: [`A — ${it.wordA}`, `B — ${it.wordB}`],
        correct: it.correct === "B" ? 1 : 0,
        explanation: it.correct === "B" ? (it.explainB || "") : (it.explainA || ""),
      })),
    };
  }

  // {parts, options, correct, bestAnswer, explain} — sentence builder
  if (s.parts && s.options && s.bestAnswer !== undefined) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: `Join: "${it.parts[0]}" ___ "${it.parts[1]}"`,
        options: it.options.map(o => JSON.stringify(o)),
        correct: it.bestAnswer,
        explanation: it.explain || "",
      })),
    };
  }

  // {a, b, c, fb} — classify equation systems
  if (s.a && s.b && s.c !== undefined && s.fb && !s.opts) {
    const categories = [...new Set(items.map(it => String(it.c)))];
    return {
      type: "ClassificationExercise",
      categories,
      items: items.map(it => ({
        prompt: `System:\n${it.a}\n${it.b}`,
        correct: String(it.c),
        explanation: it.fb,
      })),
    };
  }

  // ─── SPECIAL FORMATS ───
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

  if (s.does && s.says && s.sent) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.sent,
        options: [it.says, it.does, "Neither"],
        correct: 0,
        explanation: `What it SAYS: ${it.says}\nWhat it DOES: ${it.does}`,
      })),
    };
  }

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

  if (s.target && s.parts && s.distractors && s.meaning) {
    return {
      type: "MatchingExercise",
      items: items.map(it => {
        const partsStr = Array.isArray(it.parts)
          ? it.parts.map(p => typeof p === "object" ? `${p.type || ""}: ${p.text || ""}` : String(p)).join(", ")
          : String(it.parts);
        const distractors = (it.distractors || []).map(d => typeof d === "object" ? d.text || String(d) : String(d));
        const allOpts = [it.target, ...distractors];
        return {
          prompt: `Word parts: ${partsStr}\nMeaning: ${it.meaning}`,
          options: allOpts,
          correct: 0, // target is always first
          explanation: `The target word is "${it.target}" (${partsStr} → ${it.meaning})`,
        };
      }),
    };
  }

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

  // {word, opts, c, fb}
  if (s.word && s.opts && s.c !== undefined) {
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

  // {passage, clue, opts, fb}
  if (s.passage && s.opts) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.passage + (it.clue ? ` [Clue: ${it.clue}]` : ""),
        options: it.opts || it.choices,
        correct: normalize_correct(it.c ?? it.correct ?? it.answer, it.opts || it.choices),
        explanation: it.fb || it.explain || "",
      })),
    };
  }

  if (s.passage && s.choices) {
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

  if (s.clueType && s.choices) {
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

  // Generic with opts/ch/choices
  if (s.opts || s.ch || s.choices) {
    return {
      type: "MatchingExercise",
      items: items.map(it => ({
        prompt: it.prompt || it.q || it.word || it.passage || it.text || it.phrase || it.sentence || "Select the best answer:",
        options: it.opts || it.ch || it.choices || [],
        correct: normalize_correct(it.c ?? it.correct ?? it.answer, it.opts || it.ch || it.choices || []),
        explanation: it.fb || it.explain || it.explanation || "",
      })),
    };
  }

  if (s.sentence && s.error && s.fix) {
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

  console.log(`  [SKIP] ${name}: unhandled format, keys: ${keys}`);
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
// Lesson extractor (from JSON data)
// ────────────────────────────────────────────

function generateLessonsTSX(lessons) {
  if (!lessons || lessons.length === 0) return "";
  const slides = [];
  for (const lesson of lessons) {
    const parts = [];
    parts.push(`id: ${JSON.stringify(lesson.id || lesson.title?.toLowerCase().replace(/\s+/g, "-") || "slide")},`);
    parts.push(`title: ${JSON.stringify(lesson.title || "")},`);
    if (lesson.subtitle) parts.push(`subtitle: ${JSON.stringify(lesson.subtitle)},`);
    if (lesson.body && lesson.body.length > 0) {
      parts.push(`body: ${JSON.stringify(lesson.body)},`);
    }
    if (lesson.visual) parts.push(`visual: ${JSON.stringify(lesson.visual)},`);
    slides.push(`    {\n      ${parts.join("\n      ")}\n    },`);
  }
  return slides.join("\n");
}

// ────────────────────────────────────────────
// Navigation link finder
// ────────────────────────────────────────────

function getNextModuleInfo(course, moduleNum) {
  // Check if there's a next module page
  const nextNum = moduleNum + 1;
  const nextPagePath = path.join("app/(authenticated)/courses", course, String(nextNum), "page.tsx");
  if (existsSync(nextPagePath)) {
    // Try to get title from the next module's HTML
    const hp = htmlPath(course, nextNum);
    if (hp && existsSync(hp)) {
      const html = readFileSync(hp, "utf8");
      const title = extractModuleTitle(html);
      return {
        href: `/courses/${course}/${nextNum}`,
        label: `Module ${nextNum}: ${title}`,
      };
    }
    return {
      href: `/courses/${course}/${nextNum}`,
      label: `Module ${nextNum}`,
    };
  }
  return null;
}

// ────────────────────────────────────────────
// Hand-crafted data extractor
// ────────────────────────────────────────────

function extractHandcraftedData(brokenContent) {
  // Extract any data constants defined BEFORE the function
  const funcStart = brokenContent.indexOf("export default function");
  if (funcStart <= 0) return { preFunction: "", dataArrayNames: [] };

  const preFunction = brokenContent.substring(0, funcStart);
  // Find all const declarations that are data arrays
  const dataArrayNames = [];
  const constPattern = /const\s+(\w+)\s*:\s*\w+\[\]/g;
  let m;
  while ((m = constPattern.exec(preFunction)) !== null) {
    dataArrayNames.push(m[1]);
  }

  return { preFunction, dataArrayNames };
}

// ────────────────────────────────────────────
// Extract pre-existing activity entries from broken file
// ────────────────────────────────────────────

function extractExistingActivities(brokenContent) {
  // Find activities that use hand-crafted data (not *_EXERCISE or *_EXERCISE_DATA)
  const activities = [];
  const actMatch = brokenContent.match(/activities=\{\{([\s\S]*)\}\}/);
  if (!actMatch) return activities;

  const block = actMatch[1];
  // Find entries that reference hand-crafted constants
  const entryPattern = /"([^"]+)":\s*\((?:goNext\) =>)?\s*\(/g;
  let m;
  while ((m = entryPattern.exec(block)) !== null) {
    const screenId = m[1];
    // Skip auto-generated exercise entries
    if (screenId.startsWith("exercise-")) continue;
    activities.push(screenId);
  }

  return activities;
}

// ────────────────────────────────────────────
// File builder
// ────────────────────────────────────────────

function rebuildFile(courseModule) {
  const [course, numStr] = courseModule.split("/");
  const moduleNum = parseInt(numStr);
  const pagePath = path.join("app/(authenticated)/courses", course, numStr, "page.tsx");
  const jsonPath = path.join("data", course, `module-${numStr}.json`);
  const hp = htmlPath(course, moduleNum);

  if (!existsSync(pagePath)) { console.log(`  SKIP ${courseModule}: no page.tsx`); return false; }
  if (!existsSync(jsonPath)) { console.log(`  SKIP ${courseModule}: no JSON data`); return false; }

  const brokenContent = readFileSync(pagePath, "utf8");
  const data = JSON.parse(readFileSync(jsonPath, "utf8"));
  const html = hp && existsSync(hp) ? readFileSync(hp, "utf8") : "";

  // Extract metadata
  const title = extractModuleTitle(html);
  const subtitle = extractSubtitle(html);
  const accentColor = ACCENT_COLORS[course];
  const testType = TEST_TYPES[course];
  const section = SECTIONS[course];
  const funcName = FUNC_NAMES[course](moduleNum);

  // No longer need to extract hand-crafted data — we map everything from JSON

  // Process JSON exercises
  const exerciseEntries = Object.entries(data.exercises || {}).filter(
    ([, v]) => Array.isArray(v) && v.length > 0
  );

  // Process lessons
  const lessons = data.lessons || [];
  const warmupQs = (data.warmup || []).map(normalizeWarmup).filter(Boolean);
  const rawQuiz = (data.quiz || []).length > 0 ? data.quiz : data.practice || [];
  const quizQs = rawQuiz.map(normalizeQuiz).filter(Boolean);
  const challengeQs = (data.challenge || []).map(normalizeQuiz).filter(Boolean);

  // Map exercises
  const allExercises = [];
  const importsNeeded = new Set();

  // Map all exercises from JSON data
  for (const [name, items] of exerciseEntries) {
    const mapped = mapExercise(name, items);
    if (!mapped) continue;

    const screenId = `exercise-${name.toLowerCase().replace(/_/g, "-")}`;
    // Skip if already mapped
    if (allExercises.some(e => e.screenId === screenId)) continue;

    const label = exerciseLabel(name);
    const constName = name.toUpperCase() + "_EXERCISE";

    if (mapped.type === "MatchingExercise") {
      importsNeeded.add("matching");
      allExercises.push({
        screenId,
        constName,
        constType: "MatchingItem",
        constData: mapped.items,
        jsx: `        "${screenId}": (\n          <MatchingExercise\n            items={${constName}}\n            title="${label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`,
      });
    } else if (mapped.type === "FillInExercise") {
      importsNeeded.add("fillin");
      allExercises.push({
        screenId,
        constName,
        constType: "FillInItem",
        constData: mapped.items,
        jsx: `        "${screenId}": (\n          <FillInExercise\n            items={${constName}}\n            title="${label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`,
      });
    } else if (mapped.type === "ClassificationExercise") {
      importsNeeded.add("classification");
      allExercises.push({
        screenId,
        constName,
        constType: "ClassificationItem",
        constData: mapped.items,
        categories: mapped.categories,
        jsx: `        "${screenId}": (\n          <ClassificationExercise\n            items={${constName}}\n            categories={${JSON.stringify(mapped.categories)}}\n            title="${label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`,
      });
    } else if (mapped.type === "SorterExercise") {
      importsNeeded.add("sorter");
      allExercises.push({
        screenId,
        constName,
        constType: "SorterItem",
        constData: mapped.items,
        buckets: mapped.buckets,
        jsx: `        "${screenId}": (\n          <SorterExercise\n            items={${constName}}\n            buckets={${JSON.stringify(mapped.buckets)}}\n            title="${label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`,
      });
    } else if (mapped.type === "BossBattle") {
      importsNeeded.add("boss");
      allExercises.push({
        screenId,
        constName,
        constType: "QuizQuestion",
        constData: mapped.items,
        jsx: `        "${screenId}": (goNext) => (\n          <BossBattle\n            questions={${constName}}\n            title="${label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={goNext}\n          />\n        )`,
      });
    }
  }

  // Build imports
  const imports = ['import { ModuleShell } from "@/components/course/module-shell";'];
  imports.push('import type { ModuleConfig } from "@/types/module";');

  const importMap = {
    matching: 'import { MatchingExercise, type MatchingItem } from "@/components/course/activities/matching-exercise";',
    fillin: 'import { FillInExercise, type FillInItem } from "@/components/course/activities/fill-in-exercise";',
    classification: 'import { ClassificationExercise, type ClassificationItem } from "@/components/course/activities/classification-exercise";',
    sorter: 'import { SorterExercise, type SorterItem } from "@/components/course/activities/sorter-exercise";',
    boss: 'import { BossBattle } from "@/components/course/activities/boss-battle";',
  };

  for (const key of importsNeeded) {
    if (importMap[key]) imports.push(importMap[key]);
  }
  if (importsNeeded.has("boss") || quizQs.length > 0 || challengeQs.length > 0) {
    if (!imports.some(i => i.includes("QuizQuestion"))) {
      imports[1] = 'import type { ModuleConfig, QuizQuestion } from "@/types/module";';
    }
  }

  // Build screens array
  const screens = [
    '    { id: "welcome", label: "Welcome", icon: "wave" },',
  ];
  if (warmupQs.length > 0) {
    screens.push('    { id: "warmup", label: "Warm-Up", icon: "brain" },');
  }
  if (lessons.length > 0) {
    screens.push('    { id: "lesson", label: "Lesson", icon: "book" },');
  }
  // Add exercise screens
  for (const ex of allExercises) {
    const label = exerciseLabel(ex.screenId.replace("exercise-", "").replace(/-/g, "_"));
    screens.push(`    { id: "${ex.screenId}", label: "${label}", icon: "zap" },`);
  }
  if (quizQs.length > 0) {
    screens.push('    { id: "quiz", label: "Practice Quiz", icon: "target" },');
  }
  if (challengeQs.length > 0) {
    screens.push('    { id: "challenge", label: "Challenge", icon: "star" },');
  }
  screens.push('    { id: "complete", label: "Complete", icon: "trophy" },');

  // Build data constants for mapped exercises
  const dataConstants = [];
  for (const ex of allExercises) {
    dataConstants.push(`const ${ex.constName}: ${ex.constType}[] = ${JSON.stringify(ex.constData, null, 2)};`);
  }

  // Build activities prop
  let activitiesProp = "";
  if (allExercises.length > 0) {
    const entries = allExercises.map(e => e.jsx).join(",\n");
    activitiesProp = `\n      activities={{\n${entries}\n      }}`;
  }

  // Build next module info
  const nextInfo = getNextModuleInfo(course, moduleNum);
  let nextProps = "";
  if (nextInfo) {
    nextProps = `\n      nextModuleHref="${nextInfo.href}"\n      nextModuleLabel="${nextInfo.label}"`;
  }

  // Build MODULE_CONFIG
  const configParts = [];
  configParts.push(`  testType: "${testType}",`);
  configParts.push(`  section: "${section}",`);
  configParts.push(`  moduleNum: ${moduleNum},`);
  configParts.push(`  title: ${JSON.stringify(title)},`);
  configParts.push(`  subtitle:\n    ${JSON.stringify(subtitle || `Master the concepts in Module ${moduleNum}`)},`);
  configParts.push(`  accentColor: "${accentColor}",`);
  configParts.push(`\n  screens: [\n${screens.join("\n")}\n  ],`);

  if (lessons.length > 0) {
    configParts.push(`\n  lessons: [\n${generateLessonsTSX(lessons)}\n  ],`);
  }

  if (warmupQs.length > 0) {
    configParts.push(`\n  /* ──────── WARMUP ──────── */\n  warmup: [\n${generateWarmupQuestionsTSX(warmupQs)}\n  ],`);
  }

  if (quizQs.length > 0) {
    configParts.push(`\n  /* ──────── PRACTICE QUIZ ──────── */\n  quiz: [\n${generateQuizQuestionsTSX(quizQs)}\n  ],`);
  }

  if (challengeQs.length > 0) {
    configParts.push(`\n  /* ──────── CHALLENGE ──────── */\n  challenge: [\n${generateQuizQuestionsTSX(challengeQs)}\n  ],`);
  }

  // Assemble the file
  const fileParts = [];
  fileParts.push('"use client";\n');
  fileParts.push(imports.join("\n"));
  fileParts.push("");

  // Add exercise data constants
  if (dataConstants.length > 0) {
    fileParts.push(dataConstants.join("\n\n"));
    fileParts.push("");
  }

  // Function
  fileParts.push(`export default function ${funcName}() {`);
  fileParts.push("  return (");
  fileParts.push("    <ModuleShell");
  fileParts.push("      config={MODULE_CONFIG}");
  if (activitiesProp) fileParts.push(activitiesProp);
  if (nextProps) fileParts.push(nextProps);
  fileParts.push("    />");
  fileParts.push("  );");
  fileParts.push("}");
  fileParts.push("");

  // MODULE_CONFIG
  fileParts.push(`const MODULE_CONFIG: ModuleConfig = {\n${configParts.join("\n")}\n};`);
  fileParts.push("");

  writeFileSync(pagePath, fileParts.join("\n"));
  return true;
}

// ────────────────────────────────────────────
// Parse hand-crafted activities from broken file
// ────────────────────────────────────────────

function parseHandcraftedActivities(content, dataArrayNames) {
  const activities = [];
  const funcStart = content.indexOf("export default function");
  if (funcStart < 0) return activities;

  // Check for known Phase 9 patterns
  // These are activities that use non-_EXERCISE constants

  // sat-rw/4: BossBattle with BOSS_QUESTIONS
  if (content.includes("BOSS_QUESTIONS") && content.includes("BossBattle")) {
    activities.push({
      screenId: "boss-battle",
      label: "Boss Battle",
      importKey: "boss",
      jsx: `        "boss-battle": (goNext) => (\n          <BossBattle\n            questions={BOSS_QUESTIONS}\n            title="Boss Battle"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={goNext}\n          />\n        )`,
    });
  }

  // sat-rw/5: SorterExercise with TONE_ITEMS + MatchingExercise with CLUE_MATCHING_ITEMS
  if (content.includes("TONE_ITEMS") && content.includes("SorterExercise")) {
    activities.push({
      screenId: "tone-sorter",
      label: "Tone Sorter",
      importKey: "sorter",
      jsx: `        "tone-sorter": (\n          <SorterExercise\n            items={TONE_ITEMS}\n            buckets={["positive", "negative", "neutral"]}\n            title="Tone Sorter"\n            subtitle="Classify the tone of each passage"\n            accentColor="${ACCENT_COLORS["sat-rw"]}"\n            onComplete={() => {}}\n          />\n        )`,
    });
  }
  if (content.includes("CLUE_MATCHING_ITEMS") && content.includes("MatchingExercise")) {
    activities.push({
      screenId: "clue-practice",
      label: "Clue Practice",
      importKey: "matching",
      jsx: `        "clue-practice": (\n          <MatchingExercise\n            items={CLUE_MATCHING_ITEMS}\n            title="Context Clue Practice"\n            subtitle="Identify the type of context clue"\n            accentColor="${ACCENT_COLORS["sat-rw"]}"\n            onComplete={() => {}}\n          />\n        )`,
    });
  }

  // sat-rw/6: MatchingExercise with SHOWDOWN_ITEMS + SECONDARY_ITEMS
  if (content.includes("SHOWDOWN_ITEMS") && content.includes("MatchingExercise")) {
    activities.push({
      screenId: "showdown",
      label: "Precision Showdown",
      importKey: "matching",
      jsx: `        "showdown": (\n          <MatchingExercise\n            items={SHOWDOWN_ITEMS}\n            title="Precision Showdown"\n            subtitle="Choose the more precise word for the context"\n            accentColor="${ACCENT_COLORS["sat-rw"]}"\n            onComplete={() => {}}\n          />\n        )`,
    });
  }
  if (content.includes("SECONDARY_ITEMS") && !content.includes("SECONDARY_ITEMS_EXERCISE")) {
    activities.push({
      screenId: "secondary",
      label: "Secondary Meanings",
      importKey: "matching",
      jsx: `        "secondary": (\n          <MatchingExercise\n            items={SECONDARY_ITEMS}\n            title="Secondary Meanings"\n            subtitle="Identify the secondary meaning of common words"\n            accentColor="${ACCENT_COLORS["sat-rw"]}"\n            onComplete={() => {}}\n          />\n        )`,
    });
  }

  // nmsqt-math/2-7 & psat89-math/2-4,6: various pre-existing exercises with hand-crafted titles
  // These use constants like SOLVER_ITEMS, FACTORING_ITEMS etc. that were defined inline
  // Check for known patterns
  for (const name of dataArrayNames) {
    // Skip if already added above or if it's a generated _EXERCISE constant
    if (name.endsWith("_EXERCISE") || name.endsWith("_EXERCISE_DATA")) continue;
    if (activities.some(a => a.jsx.includes(name))) continue;

    // Determine the component type from the type annotation
    const typeMatch = content.match(new RegExp(`const\\s+${name}\\s*:\\s*(\\w+)\\[\\]`));
    const typeName = typeMatch ? typeMatch[1] : "";

    let importKey = "matching";
    let component = "MatchingExercise";
    if (typeName === "FillInItem") { importKey = "fillin"; component = "FillInExercise"; }
    else if (typeName === "ClassificationItem") { importKey = "classification"; component = "ClassificationExercise"; }
    else if (typeName === "SorterItem") { importKey = "sorter"; component = "SorterExercise"; }
    else if (typeName === "QuizQuestion") { importKey = "boss"; component = "BossBattle"; }
    else if (typeName === "MatchingItem") { importKey = "matching"; component = "MatchingExercise"; }
    else continue; // Unknown type, skip

    const screenId = name.toLowerCase().replace(/_/g, "-");
    const label = exerciseLabel(name);

    if (component === "BossBattle") {
      activities.push({
        screenId,
        label,
        importKey,
        jsx: `        "${screenId}": (goNext) => (\n          <BossBattle\n            questions={${name}}\n            title="${label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={goNext}\n          />\n        )`,
      });
    } else if (component === "SorterExercise") {
      activities.push({
        screenId,
        label,
        importKey,
        jsx: `        "${screenId}": (\n          <${component}\n            items={${name}}\n            buckets={[]}\n            title="${label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`,
      });
    } else {
      activities.push({
        screenId,
        label,
        importKey,
        jsx: `        "${screenId}": (\n          <${component}\n            items={${name}}\n            title="${label}"\n            accentColor={MODULE_CONFIG.accentColor}\n            onComplete={() => {}}\n          />\n        )`,
      });
    }
  }

  return activities;
}

// ────────────────────────────────────────────
// Main
// ────────────────────────────────────────────

let rebuilt = 0;

for (const cm of BROKEN_FILES) {
  console.log(`Rebuilding ${cm}...`);
  try {
    if (rebuildFile(cm)) {
      rebuilt++;
      console.log(`  OK`);
    }
  } catch (e) {
    console.error(`  ERROR: ${e.message}`);
  }
}

console.log(`\nRebuilt ${rebuilt} / ${BROKEN_FILES.length} files`);
