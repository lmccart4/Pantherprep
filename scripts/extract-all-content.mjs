#!/usr/bin/env node
/**
 * extract-all-content.mjs
 *
 * Reads every old HTML module file in public/ and extracts ALL data structures
 * (questions, exercises, lessons, domains, strategies, etc.) into normalized JSON.
 *
 * Output: data/<course>/<module>.json for each module
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, basename } from "path";
import vm from "vm";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const PUBLIC = join(ROOT, "public");
const OUT = join(ROOT, "data");

const COURSES = [
  { dir: "course", prefix: "SAT_RW_module", course: "sat-rw" },
  { dir: "math-course", prefix: "module-", course: "sat-math" },
  { dir: "nmsqt-rw-course", prefix: "PSAT_NMSQT_RW_module-", course: "nmsqt-rw" },
  { dir: "nmsqt-math-course", prefix: "module-", course: "nmsqt-math" },
  { dir: "psat89-rw-course", prefix: "PSAT_89_RW_module-", course: "psat89-rw" },
  { dir: "psat89-math-course", prefix: "module-", course: "psat89-math" },
];

/**
 * Minimal mock bootstrap — only provides the lowest-level dependencies.
 * Does NOT declare useState/useEffect/etc since data sections often declare those themselves.
 */
const MOCK_BOOTSTRAP = `
  var React = { createElement: function(){return null}, useState: function(v){return [v,function(){}]}, useEffect: function(){}, useCallback: function(fn){return fn}, useRef: function(){return {current:null}}, useMemo: function(fn){return fn()} };
  var ReactDOM = { createRoot: function(){ return {render:function(){}} } };
  var document = {
    getElementById: function(){ return {innerHTML:'',style:{},classList:{add:function(){},remove:function(){}},addEventListener:function(){},removeEventListener:function(){},querySelector:function(){return null},querySelectorAll:function(){return []}} },
    querySelector: function(){return null},
    querySelectorAll: function(){return []},
    createElement: function(){ return {style:{},appendChild:function(){},addEventListener:function(){},setAttribute:function(){}} },
    body: {style:{},appendChild:function(){}}
  };
  var window = { innerWidth:1200, innerHeight:800, addEventListener:function(){}, removeEventListener:function(){}, devicePixelRatio:1, location:{search:'',href:''}, history:{pushState:function(){}} };
  var localStorage = { getItem:function(){return null}, setItem:function(){} };
  var setTimeout = function(){return 0};
  var setInterval = function(){return 0};
  var clearInterval = function(){};
  var clearTimeout = function(){};
  var console = { log:function(){}, error:function(){}, warn:function(){} };
  var alert = function(){};
  var confirm = function(){return true};
  var requestAnimationFrame = function(){return 0};
  var cancelAnimationFrame = function(){};
  var navigator = { userAgent:'' };
  var Set = (typeof globalThis !== 'undefined' && globalThis.Set) || function(arr) { this._items = arr || []; this.has = function(v){return this._items.indexOf(v) >= 0}; this.add = function(v){this._items.push(v)}; this.delete = function(v){this._items = this._items.filter(function(x){return x!==v})}; this.size = 0; };
`;

/** Extract the largest inline <script> block from HTML */
function extractScript(html) {
  const scripts = [];
  let idx = 0;
  while (true) {
    const start = html.indexOf("<script>", idx);
    if (start === -1) break;
    const end = html.indexOf("</script>", start);
    if (end === -1) break;
    scripts.push(html.substring(start + 8, end));
    idx = end + 9;
  }
  return scripts.sort((a, b) => b.length - a.length)[0] || null;
}

/** Find data section cutoff — only stop at FUNCTION definitions, not variable assignments */
function findDataCutoff(script) {
  // Component function patterns (these are rendering code, not data)
  const funcPatterns = [
    /\n\s*function\s+(Welcome|App|LessonViewer|ModuleComplete|WarmUpScreen|DiagnosticScreen|DiagnosticQuiz|Exercises|ProgressBar|Badge|Card|Callout|QuizChoice|SlideTestStructure|SlideAnatomy|SlideAdaptive|SlideDomains|SlideStrategy|SlideGrowth|SlideScoreProjector|BattleArena|PracticeQuiz|ResultsScreen|MiniToneSorter|ClueTypeVisual|ConnotationScale|TierVisual|ProcessFramework|ToneSorter|CluePractice|NavLinks)\s*\(/g,
    /\n\s*function\s+(goScreen|renderScreen|renderWelcome|renderWarmup|renderLesson|renderPractice|renderComplete|renderSteps|nextScreen|updateProgressDots|startTimer|toggleTimer)\s*\(/g,
  ];

  // Comment markers
  const commentPatterns = [
    "/* ========== COMPONENTS",
    "/* ── Welcome ──",
    "/* ── Components ──",
    "/* ───── COMPONENTS",
    "// ── Components ──",
    "// ========== COMPONENTS",
    "/* ── Screens ── */",
    "/* ── Screen rendering ── */",
  ];

  let cutoff = script.length;

  for (const pat of funcPatterns) {
    let m;
    while ((m = pat.exec(script)) !== null) {
      if (m.index < cutoff) cutoff = m.index;
    }
  }

  for (const marker of commentPatterns) {
    const idx = script.indexOf(marker);
    if (idx > 0 && idx < cutoff) cutoff = idx;
  }

  // For vanilla JS files: also cut at the first DOM rendering function
  // But NOT at variable declarations like `let currentScreen = 0;`
  const vanillaFuncPattern = /\n\s*function\s+(render[A-Z]\w*|go[A-Z]\w*|start[A-Z]\w*|toggle[A-Z]\w*|init[A-Z]\w*|show[A-Z]\w*|update[A-Z]\w*|check[A-Z]\w*|answer[A-Z]\w*|submit[A-Z]\w*|score[A-Z]\w*|calc[A-Z]\w*|mk[A-Z]\w*)\s*\(/g;
  let m;
  while ((m = vanillaFuncPattern.exec(script)) !== null) {
    if (m.index < cutoff) cutoff = m.index;
  }

  return cutoff;
}

/** Evaluate data section in sandboxed vm and collect variables */
function evaluateData(code) {
  const ctx = vm.createContext({});
  vm.runInContext(MOCK_BOOTSTRAP, ctx, { timeout: 2000 });
  const preKeys = new Set(Object.keys(ctx));

  // Convert const/let to var so they become context properties
  const converted = code.replace(/^(const|let)\s+/gm, "var ");

  try {
    vm.runInContext(converted, ctx, { timeout: 15000 });
  } catch {
    // Fall back to statement-by-statement
    const stmts = splitStatements(converted);
    for (const stmt of stmts) {
      if (!stmt.trim()) continue;
      try {
        vm.runInContext(stmt, ctx, { timeout: 3000 });
      } catch {
        // Skip failed statements silently
      }
    }
  }

  // Collect new variables (exclude functions and mocks)
  const result = {};
  for (const key of Object.keys(ctx)) {
    if (preKeys.has(key)) continue;
    const val = ctx[key];
    if (val === null || val === undefined || typeof val === "function") continue;
    try {
      JSON.stringify(val);
      result[key] = val;
    } catch {
      // Skip non-serializable
    }
  }
  return result;
}

/** Split JS into statement chunks at top-level semicolons */
function splitStatements(code) {
  const stmts = [];
  let current = "";
  let braceD = 0, bracketD = 0, parenD = 0;
  let inStr = false, strCh = "";
  let inTemplate = false, templateD = 0;

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const prev = i > 0 ? code[i - 1] : "";

    if (inStr) {
      current += ch;
      if (ch === strCh && prev !== "\\") inStr = false;
      continue;
    }

    if (ch === "`") {
      inTemplate = !inTemplate;
      current += ch;
      continue;
    }
    if (inTemplate) {
      current += ch;
      if (ch === "$" && code[i + 1] === "{") templateD++;
      if (ch === "}" && templateD > 0) templateD--;
      continue;
    }

    if ((ch === '"' || ch === "'") && prev !== "\\") {
      inStr = true;
      strCh = ch;
      current += ch;
      continue;
    }

    // Skip comments
    if (ch === "/" && code[i + 1] === "/") {
      const eol = code.indexOf("\n", i);
      if (eol > 0) { current += code.substring(i, eol + 1); i = eol; continue; }
    }
    if (ch === "/" && code[i + 1] === "*") {
      const ec = code.indexOf("*/", i + 2);
      if (ec > 0) { i = ec + 1; continue; }
    }

    if (ch === "{") braceD++;
    if (ch === "}") braceD--;
    if (ch === "[") bracketD++;
    if (ch === "]") bracketD--;
    if (ch === "(") parenD++;
    if (ch === ")") parenD--;

    current += ch;

    if (ch === ";" && braceD === 0 && bracketD === 0 && parenD === 0) {
      stmts.push(current);
      current = "";
    }
  }
  if (current.trim()) stmts.push(current);
  return stmts;
}

/**
 * Fallback extractor: pull individual variable declarations from full script
 * using regex, then evaluate them with dependencies resolved.
 * Used for vanilla JS files where data is interspersed with functions.
 */
function extractVarsFromFullScript(script) {
  // Find all top-level variable declarations (var/const/let NAME = [...] or {...})
  // We look for array and object literal assignments to UPPERCASE or known data names
  const varPattern = /(?:^|\n)\s*(?:var|const|let)\s+([A-Z_][A-Z0-9_]*)\s*=\s*\[/g;
  const objPattern = /(?:^|\n)\s*(?:var|const|let)\s+([A-Z_][A-Z0-9_]*)\s*=\s*\{/g;
  // Also catch: var warmupIdx = 0, etc — skip these
  // Also catch lowercase data vars like: var pstA = {}, etc — skip these

  const varNames = new Set();
  let m;
  while ((m = varPattern.exec(script)) !== null) varNames.add(m[1]);
  while ((m = objPattern.exec(script)) !== null) varNames.add(m[1]);

  // Also find camelCase data arrays
  const camelPattern = /(?:^|\n)\s*(?:var|const|let)\s+(WARMUP_QS|SOLVER_QS|FORM_QS|SYS_QS|INEQ_QS|TRAP_QS|WPT_QS|RATIO_QS|TABLE_QS|STUDY_QS|MISLEAD_QS|CHAINS|ANGLE_QS|CIRCLE_QS|FORMULA_QS|TRI_QS|SKILL_QS|DD_QS|SC_QS|DT_QS|PI_QS|BS_QS|BP_QS|GI_QS|MIX_QS|PCT_QS|CMP_QS|PREREQ|SOLV|FORMS|SYS|INQ|TRP|WPT)\s*=\s*\[/g;
  while ((m = camelPattern.exec(script)) !== null) varNames.add(m[1]);

  if (varNames.size === 0) return {};

  // Extract each variable's full declaration using bracket counting
  const result = {};
  const ctx = vm.createContext({});
  vm.runInContext(MOCK_BOOTSTRAP, ctx, { timeout: 2000 });

  // First inject any color/token declarations
  const colorDecls = script.match(/(?:^|\n)\s*(?:var|const|let)\s+C\s*=\s*\{[^}]*\}/);
  if (colorDecls) {
    try {
      vm.runInContext(colorDecls[0].replace(/^(const|let)\s+/gm, "var "), ctx, { timeout: 1000 });
    } catch { /* skip */ }
  }

  const preKeys = new Set(Object.keys(ctx));

  for (const name of varNames) {
    const declPattern = new RegExp(`(?:var|const|let)\\s+${name}\\s*=\\s*`);
    const match = declPattern.exec(script);
    if (!match) continue;

    const startIdx = match.index;
    // Find the end of the declaration by counting brackets
    let depth = 0;
    let started = false;
    let endIdx = startIdx;
    let inStr = false;
    let strCh = "";

    for (let i = match.index + match[0].length; i < script.length; i++) {
      const ch = script[i];
      const prev = script[i - 1];

      if (inStr) {
        if (ch === strCh && prev !== "\\") inStr = false;
        continue;
      }
      if ((ch === '"' || ch === "'") && prev !== "\\") { inStr = true; strCh = ch; continue; }

      if (ch === "[" || ch === "{") { depth++; started = true; }
      if (ch === "]" || ch === "}") depth--;

      if (started && depth === 0) {
        // Find the semicolon
        endIdx = script.indexOf(";", i);
        if (endIdx === -1) endIdx = i + 1;
        else endIdx++;
        break;
      }
    }

    const decl = script.substring(startIdx, endIdx).replace(/^(const|let)\s+/gm, "var ");
    try {
      vm.runInContext(decl, ctx, { timeout: 3000 });
    } catch {
      // Skip
    }
  }

  // Collect results
  for (const key of Object.keys(ctx)) {
    if (preKeys.has(key)) continue;
    const val = ctx[key];
    if (val === null || val === undefined || typeof val === "function") continue;
    try {
      JSON.stringify(val);
      result[key] = val;
    } catch { /* skip */ }
  }

  return result;
}

/** Process a single HTML file */
function processFile(htmlPath) {
  const html = readFileSync(htmlPath, "utf-8");
  const script = extractScript(html);
  if (!script || script.length < 200) return null;

  const cutoff = findDataCutoff(script);
  const dataSection = script.substring(0, cutoff);

  let vars = {};

  if (dataSection.length >= 50) {
    vars = evaluateData(dataSection);
  }

  // If primary extraction got very little, try the fallback
  if (Object.keys(vars).length < 3) {
    const fallbackVars = extractVarsFromFullScript(script);
    // Merge fallback vars (prefer fallback if primary got nothing useful)
    if (Object.keys(fallbackVars).length > Object.keys(vars).length) {
      vars = { ...vars, ...fallbackVars };
    }
  }

  // Last resort: try full script evaluation
  if (Object.keys(vars).length === 0) {
    vars = evaluateData(script);
  }

  if (Object.keys(vars).length === 0) return null;

  return classifyVariables(vars);
}

/** Classify extracted variables into semantic categories */
function classifyVariables(vars) {
  const result = {
    lessons: null,
    warmup: [],
    quiz: [],
    practice: [],
    challenge: [],
    exercises: {},
    domains: null,
    strategies: null,
    keyTakeaways: null,
    navigation: null,
    screens: null,
    screenLabels: null,
    checklist: null,
    scoreTable: null,
    metadata: {},
    raw: { ...vars },
  };

  // Known keys mapping to categories
  const warmupKeys = new Set(["WARMUP", "WU", "WARMUP_QS", "W"]);
  const quizKeys = new Set(["QUIZ", "QUIZ_QUESTIONS", "DQ", "DIAG_QS", "Q"]);
  const practiceKeys = new Set(["PST", "PR", "PRACTICE", "SIM", "QUESTIONS"]);
  const challengeKeys = new Set(["CHA", "CHB", "CHALLENGE", "CHALL_A", "CHALL_B", "CHALLENGE_QUESTIONS"]);
  const ignoreKeys = new Set([
    // Color/style tokens
    "C", "F", "ACCENT", "ACCENT2", "AMBER", "BLUE", "PURPLE", "RED", "DARK", "CARD",
    "BORDER", "MUTED", "TEXT", "SUB", "NAV", "SCREENS", "SCREEN_LABELS",
    "KEY_TAKEAWAYS", "DOMAINS", "STRATS", "LESSONS", "CL_ITEMS", "CL_KEY", "WS_KEY",
    "TRAP_NAMES", "SCORE_TABLE", "MODULE_PATH",
    // State variables
    "currentScreen", "warmupIdx", "warmupAnswers", "warmupAnswered",
    "pstA", "pstConf", "pstTime", "pstTimer", "pstRunning",
    // DOM/style functions stored as objects
    "btn", "glass", "crd", "psg", "dbg",
  ]);

  // Direct assignments
  if (vars.LESSONS) result.lessons = vars.LESSONS;
  if (vars.DOMAINS) result.domains = vars.DOMAINS;
  if (vars.STRATS) result.strategies = vars.STRATS;
  if (vars.KEY_TAKEAWAYS) result.keyTakeaways = vars.KEY_TAKEAWAYS;
  if (vars.NAV) result.navigation = vars.NAV;
  if (vars.SCREENS) result.screens = vars.SCREENS;
  if (vars.SCREEN_LABELS) result.screenLabels = vars.SCREEN_LABELS;
  if (vars.CL_ITEMS) result.checklist = vars.CL_ITEMS;
  if (vars.SCORE_TABLE) result.scoreTable = vars.SCORE_TABLE;
  if (vars.MODULE_PATH) result.metadata.modulePath = vars.MODULE_PATH;

  // Questions
  for (const key of warmupKeys) {
    if (vars[key] && Array.isArray(vars[key])) result.warmup.push(...vars[key]);
  }
  for (const key of quizKeys) {
    if (vars[key] && Array.isArray(vars[key])) result.quiz.push(...vars[key]);
  }
  for (const key of practiceKeys) {
    if (vars[key] && Array.isArray(vars[key])) result.practice.push(...vars[key]);
  }
  for (const key of challengeKeys) {
    if (vars[key] && Array.isArray(vars[key])) result.challenge.push(...vars[key]);
  }

  // Everything else
  for (const [key, value] of Object.entries(vars)) {
    if (ignoreKeys.has(key)) continue;
    if (warmupKeys.has(key) || quizKeys.has(key) || practiceKeys.has(key) || challengeKeys.has(key)) continue;
    // Skip single-value state vars
    if (typeof value === "number" || typeof value === "boolean") continue;
    if (typeof value === "string" && value.length < 100) { result.metadata[key] = value; continue; }

    if (Array.isArray(value) && value.length > 0) {
      if (typeof value[0] === "object" && value[0] !== null) {
        result.exercises[key] = value;
      } else {
        result.metadata[key] = value;
      }
    } else if (typeof value === "object" && value !== null) {
      result.metadata[key] = value;
    }
  }

  return result;
}

function getModuleNum(filename, prefix) {
  return basename(filename, ".html").replace(prefix, "").replace(/^-/, "");
}

// ── Main ──
function main() {
  console.log("=== PantherPrep Content Extraction ===\n");
  let totalFiles = 0, totalQ = 0;

  for (const course of COURSES) {
    const dir = join(PUBLIC, course.dir);
    if (!existsSync(dir)) continue;

    const outDir = join(OUT, course.course);
    mkdirSync(outDir, { recursive: true });

    const files = readdirSync(dir)
      .filter(f => f.endsWith(".html") && f !== "index.html" && !f.includes(".code-workspace"))
      .sort((a, b) => (parseInt(a.replace(/\D/g, "")) || 0) - (parseInt(b.replace(/\D/g, "")) || 0));

    console.log(`── ${course.course} (${files.length} modules) ──`);

    for (const file of files) {
      const moduleNum = getModuleNum(file, course.prefix);
      const result = processFile(join(dir, file));

      if (result) {
        writeFileSync(join(outDir, `module-${moduleNum}.json`), JSON.stringify(result, null, 2));

        const qCount = result.warmup.length + result.quiz.length + result.practice.length +
          result.challenge.length + Object.values(result.exercises).reduce((s, a) => s + (Array.isArray(a) ? a.length : 0), 0);
        totalQ += qCount;
        totalFiles++;

        const parts = [`${qCount}Q`];
        if (result.lessons) parts.push(`${result.lessons.length}L`);
        if (result.domains) parts.push(`${result.domains.length}D`);
        const ex = Object.keys(result.exercises);
        if (ex.length) parts.push(`ex:${ex.join(",")}`);
        console.log(`  ${moduleNum}: ${parts.join(" | ")}`);
      } else {
        console.log(`  ${moduleNum}: [FAILED]`);
      }
    }
    console.log();
  }

  // Diagnostics and practice tests
  for (const type of ["diagnostics", "practice-tests"]) {
    const dir = join(PUBLIC, type);
    if (!existsSync(dir)) continue;

    const outDir = join(OUT, type);
    mkdirSync(outDir, { recursive: true });

    const files = readdirSync(dir).filter(f => f.endsWith(".html"));
    console.log(`── ${type} (${files.length} files) ──`);

    for (const file of files) {
      const name = basename(file, ".html");
      const result = processFile(join(dir, file));

      if (result) {
        writeFileSync(join(outDir, `${name}.json`), JSON.stringify(result, null, 2));
        const qCount = result.warmup.length + result.quiz.length + result.practice.length +
          result.challenge.length + Object.values(result.exercises).reduce((s, a) => s + (Array.isArray(a) ? a.length : 0), 0);
        totalQ += qCount;
        totalFiles++;
        console.log(`  ${name}: ${qCount}Q`);
      } else {
        console.log(`  ${name}: [FAILED]`);
      }
    }
    console.log();
  }

  console.log(`=== Done: ${totalFiles} files, ${totalQ} questions/exercises ===`);
}

main();
