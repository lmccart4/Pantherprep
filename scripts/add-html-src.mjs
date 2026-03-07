#!/usr/bin/env node
/**
 * Adds htmlSrc property to MODULE_CONFIG in all course module pages.
 * Maps each Next.js module route to its original HTML source file.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COURSES_DIR = path.join(ROOT, "app", "(authenticated)", "courses");

// Map course route prefix to HTML file pattern
const HTML_MAP = {
  "sat-rw": (n) => `/course/SAT_RW_module${n}.html`,
  "sat-math": (n) => `/math-course/module-${n}.html`,
  "nmsqt-rw": (n) => `/nmsqt-rw-course/PSAT_NMSQT_RW_module-${n}.html`,
  "nmsqt-math": (n) => `/nmsqt-math-course/module-${n}.html`,
  "psat89-rw": (n) => `/psat89-rw-course/PSAT_89_RW_module-${n}.html`,
  "psat89-math": (n) => `/psat89-math-course/module-${n}.html`,
};

let updated = 0;
let skipped = 0;
let noHtml = 0;

for (const [course, getPath] of Object.entries(HTML_MAP)) {
  const courseDir = path.join(COURSES_DIR, course);
  if (!fs.existsSync(courseDir)) continue;

  const modules = fs.readdirSync(courseDir).filter((d) => /^\d+$/.test(d));

  for (const modNum of modules) {
    const pagePath = path.join(courseDir, modNum, "page.tsx");
    if (!fs.existsSync(pagePath)) continue;

    const htmlRelPath = getPath(modNum);
    const htmlAbsPath = path.join(ROOT, "public", htmlRelPath);

    if (!fs.existsSync(htmlAbsPath)) {
      console.log(`  NO HTML: ${course}/${modNum} -> ${htmlRelPath}`);
      noHtml++;
      continue;
    }

    let content = fs.readFileSync(pagePath, "utf8");

    // Skip if htmlSrc is already present
    if (content.includes("htmlSrc")) {
      skipped++;
      continue;
    }

    // Find MODULE_CONFIG and add htmlSrc after accentColor line
    const accentColorPattern = /(\s*accentColor:\s*"[^"]+",?\s*\n)/;
    const match = content.match(accentColorPattern);

    if (match) {
      const indent = match[1].match(/^(\s*)/)?.[1] || "  ";
      const insertion = `${indent}htmlSrc: "${htmlRelPath}",\n`;
      content = content.replace(accentColorPattern, `$1${insertion}`);
      fs.writeFileSync(pagePath, content);
      console.log(`  UPDATED: ${course}/${modNum} -> ${htmlRelPath}`);
      updated++;
    } else {
      console.log(`  SKIP (no accentColor): ${course}/${modNum}`);
      skipped++;
    }
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${noHtml} missing HTML`);
