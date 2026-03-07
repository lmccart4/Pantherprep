/**
 * Seed script: extracts questions from all HTML files in public/ and uploads to Firestore.
 *
 * Usage:
 *   npx ts-node --esm scripts/seed-questions.ts [--dry-run]
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS env var or Firebase Admin default credentials.
 */

import * as fs from "fs";
import * as path from "path";
import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const DRY_RUN = process.argv.includes("--dry-run");
const PUBLIC = path.resolve(__dirname, "../public");

// ── Firebase Admin Init ──
if (!DRY_RUN) {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath) {
    const cred = JSON.parse(fs.readFileSync(credPath, "utf-8")) as ServiceAccount;
    initializeApp({ credential: cert(cred) });
  } else {
    initializeApp();
  }
}

const db = DRY_RUN ? null : getFirestore();

// ── Types ──
interface RawDiagQuestion {
  num?: number;
  module?: number;
  type?: string;
  passage?: string;
  question?: string;
  A?: string;
  B?: string;
  C?: string;
  D?: string;
  correct?: string;
  domain?: string;
  skill?: string;
  sec?: string;
  explanations?: Record<string, string>;
}

interface RawCourseQuestion {
  passage?: string;
  stem?: string;
  q?: string;
  choices?: string[];
  ch?: string[];
  correct?: number;
  c?: number;
  type?: string;
  explain?: string;
  fb?: string;
  domain?: string;
  diff?: string;
  skill?: string;
  source?: string;
}

interface SeedQuestion {
  id: string;
  testType: string;
  section: string;
  module?: number;
  domain: string;
  skill: string;
  difficulty: string;
  type: string;
  passage?: string;
  stem: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  explanations?: Record<string, string>;
  tags: string[];
}

// ── Helpers ──
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Extract a JavaScript array from an HTML file by finding `const NAME = [...]`
 * and evaluating it in a sandboxed context.
 */
function extractArray(html: string, varName: string): unknown[] {
  // Match the const declaration and capture everything from [ to the matching ]
  const pattern = new RegExp(`(?:const|var|let)\\s+${varName}\\s*=\\s*\\[`);
  const match = pattern.exec(html);
  if (!match) return [];

  const start = match.index + match[0].length - 1; // position of [
  let depth = 0;
  let end = start;

  for (let i = start; i < html.length; i++) {
    if (html[i] === "[") depth++;
    else if (html[i] === "]") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  const arrayStr = html.slice(start, end);

  try {
    // Wrap in parentheses to make it an expression
    const fn = new Function(`return (${arrayStr});`);
    return fn() as unknown[];
  } catch (e) {
    console.warn(`  Failed to parse ${varName}: ${(e as Error).message}`);
    return [];
  }
}

function letterToIndex(letter: string): number {
  return "ABCD".indexOf(letter.toUpperCase());
}

function indexToLetter(i: number): string {
  return "ABCD"[i] ?? "A";
}

// ── Extractors ──

function extractDiagnosticQuestions(
  filePath: string,
  testType: string,
  section: string,
  varNames: string[]
): SeedQuestion[] {
  const html = fs.readFileSync(filePath, "utf-8");
  const results: SeedQuestion[] = [];

  for (const varName of varNames) {
    const raw = extractArray(html, varName) as RawDiagQuestion[];
    if (!raw.length) continue;

    for (let i = 0; i < raw.length; i++) {
      const q = raw[i];
      const isRW = section === "rw";
      const qType = q.type === "SPR" ? "spr" : "mc";
      const id = `${testType}-${section}-diag-q${i + 1}`;

      const options =
        qType === "mc" && q.A != null
          ? [q.A, q.B!, q.C!, q.D!]
          : undefined;

      // Build explanation string
      let explanation = "";
      if (q.explanations) {
        if (q.correct && q.explanations[q.correct]) {
          explanation = q.explanations[q.correct];
        } else {
          explanation = Object.values(q.explanations).join(" | ");
        }
      }

      results.push({
        id,
        testType,
        section,
        module: q.module,
        domain: q.domain ?? (isRW ? "Reading & Writing" : "Math"),
        skill: q.skill ?? "",
        difficulty: "medium",
        type: qType,
        passage: q.passage || undefined,
        stem: q.question ?? "",
        options,
        correctAnswer: q.correct ?? "",
        explanation,
        explanations: q.explanations,
        tags: ["diagnostic"],
      });
    }
  }

  return results;
}

function extractPracticeTestQuestions(
  filePath: string,
  testType: string
): SeedQuestion[] {
  const html = fs.readFileSync(filePath, "utf-8");
  const results: SeedQuestion[] = [];

  for (const [varName, section] of [["RW", "rw"], ["MATH", "math"]] as const) {
    const raw = extractArray(html, varName) as RawDiagQuestion[];
    if (!raw.length) continue;

    for (let i = 0; i < raw.length; i++) {
      const q = raw[i];
      const qType = q.type === "SPR" ? "spr" : "mc";
      const id = `${testType}-${section}-pt-q${i + 1}`;

      const options =
        qType === "mc" && q.A != null
          ? [q.A, q.B!, q.C!, q.D!]
          : undefined;

      let explanation = "";
      if (q.explanations) {
        if (q.correct && q.explanations[q.correct]) {
          explanation = q.explanations[q.correct];
        } else {
          explanation = Object.values(q.explanations).join(" | ");
        }
      }

      results.push({
        id,
        testType,
        section,
        module: q.module,
        domain: q.domain ?? (section === "rw" ? "Reading & Writing" : "Math"),
        skill: q.skill ?? "",
        difficulty: "medium",
        type: qType,
        passage: q.passage || undefined,
        stem: q.question ?? "",
        options,
        correctAnswer: q.correct ?? "",
        explanation,
        explanations: q.explanations,
        tags: ["practice-test"],
      });
    }
  }

  return results;
}

function extractCourseModuleQuestions(
  filePath: string,
  testType: string,
  section: string,
  moduleNum: number,
  arrayNames: string[]
): SeedQuestion[] {
  const html = fs.readFileSync(filePath, "utf-8");
  const results: SeedQuestion[] = [];

  for (const varName of arrayNames) {
    const raw = extractArray(html, varName) as RawCourseQuestion[];
    if (!raw.length) continue;

    const tag = varName.toLowerCase().includes("warmup")
      ? "warmup"
      : varName.toLowerCase().includes("challenge") || varName.toLowerCase().includes("chal") || varName === "CHALL_A" || varName === "CHALL_B"
        ? "challenge"
        : varName.toLowerCase().includes("pst")
          ? "practice"
          : varName.toLowerCase().includes("quiz")
            ? "quiz"
            : varName.toLowerCase().includes("diag")
              ? "diagnostic"
              : "practice";

    for (let i = 0; i < raw.length; i++) {
      const q = raw[i];
      const stem = q.stem ?? q.q ?? q.passage ?? "";
      const choices = q.choices ?? q.ch;
      const correctIdx = q.correct ?? q.c;
      const explanation = q.explain ?? q.fb ?? "";

      if (!stem && !choices) continue; // Skip non-question data

      const correctAnswer =
        correctIdx != null && choices
          ? indexToLetter(correctIdx)
          : String(correctIdx ?? "");

      const slugTag = slugify(varName);
      const id = `${testType}-${section}-mod${moduleNum}-${slugTag}-q${i + 1}`;

      results.push({
        id,
        testType,
        section,
        module: moduleNum,
        domain: q.domain ?? (section === "rw" ? "Reading & Writing" : "Math"),
        skill: q.skill ?? q.type ?? "",
        difficulty: (q.diff as string) ?? "medium",
        type: choices ? "mc" : "spr",
        passage: q.passage && q.stem ? q.passage : undefined,
        stem,
        options: choices,
        correctAnswer,
        explanation,
        tags: [`module-${moduleNum}`, tag],
      });
    }
  }

  return results;
}

// ── File Discovery ──

interface FileSpec {
  path: string;
  testType: string;
  section: string;
  kind: "diagnostic" | "practice-test" | "course-module";
  moduleNum?: number;
  varNames?: string[];
}

function discoverFiles(): FileSpec[] {
  const specs: FileSpec[] = [];

  // Diagnostics
  const diagMap: [string, string, string, string[]][] = [
    ["diagnostics/sat-math.html", "sat", "math", ["ALL_QUESTIONS"]],
    ["diagnostics/sat-rw.html", "sat", "rw", ["Q"]],
    ["diagnostics/nmsqt-math.html", "nmsqt", "math", ["Q"]],
    ["diagnostics/nmsqt-rw.html", "nmsqt", "rw", ["Q"]],
    ["diagnostics/psat89-math.html", "psat89", "math", ["Q"]],
    ["diagnostics/psat89-rw.html", "psat89", "rw", ["Q"]],
  ];

  for (const [file, testType, section, varNames] of diagMap) {
    const full = path.join(PUBLIC, file);
    if (fs.existsSync(full)) {
      specs.push({ path: full, testType, section, kind: "diagnostic", varNames });
    }
  }

  // Practice tests
  for (const [file, testType] of [
    ["practice-tests/sat-full.html", "sat"],
    ["practice-tests/nmsqt-full.html", "nmsqt"],
    ["practice-tests/psat89-full.html", "psat89"],
  ] as const) {
    const full = path.join(PUBLIC, file);
    if (fs.existsSync(full)) {
      specs.push({ path: full, testType, section: "both", kind: "practice-test" });
    }
  }

  // Course modules - SAT R&W
  for (let m = 0; m <= 18; m++) {
    const full = path.join(PUBLIC, `course/SAT_RW_module${m}.html`);
    if (fs.existsSync(full)) {
      specs.push({
        path: full,
        testType: "sat",
        section: "rw",
        kind: "course-module",
        moduleNum: m,
        varNames: ["WARMUP", "QUIZ", "CHALLENGE", "PRACTICE"],
      });
    }
  }

  // Course modules - SAT Math
  for (let m = 1; m <= 10; m++) {
    const full = path.join(PUBLIC, `math-course/module-${m}.html`);
    if (fs.existsSync(full)) {
      specs.push({
        path: full,
        testType: "sat",
        section: "math",
        kind: "course-module",
        moduleNum: m,
        varNames: ["WARMUP_QS", "RATIO_QS", "ANGLE_QS", "CIRCLE_QS", "FORMULA_QS",
          "TRI_QS", "SKILL_QS", "DD_QS", "SC_QS", "DT_QS", "PI_QS", "BS_QS",
          "BP_QS", "GI_QS", "PM_QS", "PST", "EVALS", "DR_QS", "TFS", "COMPS",
          "BEH_QS", "FLIPS", "CONF", "CHAINS", "TABLE_QS", "STUDY_QS", "MISLEAD_QS"],
      });
    }
  }

  // NMSQT Math
  for (let m = 1; m <= 8; m++) {
    const full = path.join(PUBLIC, `nmsqt-math-course/module-${m}.html`);
    if (fs.existsSync(full)) {
      specs.push({
        path: full,
        testType: "nmsqt",
        section: "math",
        kind: "course-module",
        moduleNum: m,
        varNames: ["WARMUP_QS", "SOLVER_QS", "FORM_QS", "SYS_QS", "INEQ_QS",
          "TRAP_QS", "WPT_QS", "PST", "FACTOR_QS", "EXPS", "GROWTH_QS",
          "RATIO_QS", "TABLE_QS", "MISLEAD_QS", "STUDY_QS",
          "ANGLE_QS", "CIRCLE_QS", "FORMULA_QS", "TRI_QS",
          "SKILL_QS", "DD_QS", "SC_QS", "DT_QS", "PI_QS", "BS_QS",
          "BP_QS", "GI_QS", "MIX_QS"],
      });
    }
  }

  // NMSQT R&W
  for (let m = 1; m <= 12; m++) {
    const full = path.join(PUBLIC, `nmsqt-rw-course/PSAT_NMSQT_RW_module-${m}.html`);
    if (fs.existsSync(full)) {
      specs.push({
        path: full,
        testType: "nmsqt",
        section: "rw",
        kind: "course-module",
        moduleNum: m,
        varNames: ["WARMUP", "PRACTICE", "CHALLENGE", "DIAG_QS", "WU", "PR", "CH",
          "CHA", "CHB", "CHALL_A", "CHALL_B", "QUIZ", "SIM"],
      });
    }
  }

  // PSAT 8/9 Math
  for (let m = 1; m <= 8; m++) {
    const full = path.join(PUBLIC, `psat89-math-course/module-${m}.html`);
    if (fs.existsSync(full)) {
      specs.push({
        path: full,
        testType: "psat89",
        section: "math",
        kind: "course-module",
        moduleNum: m,
        varNames: ["DIAG_QS", "WARMUP_QS", "Q", "PST",
          "PREREQ", "SOLV", "FORMS", "SYS", "INQ", "TRP", "WPT",
          "EXP", "QF", "WF", "FAC", "CLS",
          "RAT", "PCT", "PRB", "MIS", "STD",
          "ANG", "TRI", "FRM", "CIR", "CMP",
          "SKL", "SPD", "SHC",
          "DT", "PIY", "BS", "BP", "TRP"],
      });
    }
  }

  // PSAT 8/9 R&W
  for (let m = 1; m <= 10; m++) {
    const full = path.join(PUBLIC, `psat89-rw-course/PSAT_89_RW_module-${m}.html`);
    if (fs.existsSync(full)) {
      specs.push({
        path: full,
        testType: "psat89",
        section: "rw",
        kind: "course-module",
        moduleNum: m,
        varNames: ["QUIZ", "WARMUP", "PRACTICE", "CHALLENGE", "DIAG_QS"],
      });
    }
  }

  return specs;
}

// ── Main ──

async function main() {
  const files = discoverFiles();
  const allQuestions: SeedQuestion[] = [];

  console.log(`Found ${files.length} files to process\n`);

  for (const spec of files) {
    const rel = path.relative(PUBLIC, spec.path);
    process.stdout.write(`Processing ${rel}...`);

    let questions: SeedQuestion[] = [];

    try {
      switch (spec.kind) {
        case "diagnostic":
          questions = extractDiagnosticQuestions(
            spec.path,
            spec.testType,
            spec.section,
            spec.varNames!
          );
          break;
        case "practice-test":
          questions = extractPracticeTestQuestions(spec.path, spec.testType);
          break;
        case "course-module":
          questions = extractCourseModuleQuestions(
            spec.path,
            spec.testType,
            spec.section,
            spec.moduleNum!,
            spec.varNames!
          );
          break;
      }
    } catch (e) {
      console.log(` ERROR: ${(e as Error).message}`);
      continue;
    }

    console.log(` ${questions.length} questions`);
    allQuestions.push(...questions);
  }

  console.log(`\nTotal questions extracted: ${allQuestions.length}`);

  // Deduplicate by ID
  const byId = new Map<string, SeedQuestion>();
  for (const q of allQuestions) {
    byId.set(q.id, q);
  }
  const unique = Array.from(byId.values());
  console.log(`Unique questions: ${unique.length}`);

  // Summary by test type
  const summary: Record<string, number> = {};
  for (const q of unique) {
    const key = `${q.testType}-${q.section}`;
    summary[key] = (summary[key] ?? 0) + 1;
  }
  console.log("\nBreakdown:");
  for (const [key, count] of Object.entries(summary).sort()) {
    console.log(`  ${key}: ${count}`);
  }

  if (DRY_RUN) {
    console.log("\n[DRY RUN] Skipping Firestore upload.");
    // Write to a JSON file for inspection
    const outPath = path.join(__dirname, "questions-dump.json");
    fs.writeFileSync(outPath, JSON.stringify(unique, null, 2));
    console.log(`Wrote ${unique.length} questions to ${outPath}`);
    return;
  }

  // Upload to Firestore in batches of 500
  console.log("\nUploading to Firestore...");
  const BATCH_SIZE = 500;
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = db!.batch();
    const chunk = unique.slice(i, i + BATCH_SIZE);

    for (const q of chunk) {
      const ref = db!.collection("questions").doc(q.id);
      batch.set(ref, q);
    }

    await batch.commit();
    console.log(`  Uploaded batch ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} questions)`);
  }

  console.log("\nDone!");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
