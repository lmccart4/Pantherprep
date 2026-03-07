/**
 * Shuffle all multiple-choice answer options across every course module page.
 * Handles both quoted ("options"/"correct") and unquoted (choices/correct) formats.
 * Uses a seeded PRNG per-question so results are deterministic but well-distributed.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COURSES_DIR = path.join(__dirname, "..", "app", "(authenticated)", "courses");

// Simple seeded PRNG (mulberry32)
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

function shuffleArray(arr, rng) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Match a JS/TS array literal that spans multiple lines.
 * Returns the full match, the items as strings, and positions.
 */
function extractArrayItems(text, startIdx) {
  // Find the opening bracket
  const openBracket = text.indexOf("[", startIdx);
  if (openBracket === -1) return null;

  // Find matching close bracket, handling nesting
  let depth = 1;
  let i = openBracket + 1;
  while (i < text.length && depth > 0) {
    if (text[i] === "[") depth++;
    else if (text[i] === "]") depth--;
    i++;
  }
  if (depth !== 0) return null;

  const closeBracket = i - 1;
  const arrayContent = text.slice(openBracket + 1, closeBracket);

  // Parse individual items - split by comma but respect quotes and nesting
  const items = [];
  let current = "";
  let inString = false;
  let stringChar = "";
  let nestDepth = 0;

  for (let j = 0; j < arrayContent.length; j++) {
    const ch = arrayContent[j];
    if (inString) {
      current += ch;
      if (ch === stringChar && arrayContent[j - 1] !== "\\") {
        inString = false;
      }
    } else if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      stringChar = ch;
      current += ch;
    } else if (ch === "[" || ch === "(") {
      nestDepth++;
      current += ch;
    } else if (ch === "]" || ch === ")") {
      nestDepth--;
      current += ch;
    } else if (ch === "," && nestDepth === 0) {
      const trimmed = current.trim();
      if (trimmed) items.push(trimmed);
      current = "";
    } else {
      current += ch;
    }
  }
  const last = current.trim();
  if (last) items.push(last);

  return {
    start: openBracket,
    end: closeBracket + 1,
    items,
    raw: text.slice(openBracket, closeBracket + 1),
  };
}

/**
 * Process a single file: find all options/choices arrays with correct indices,
 * shuffle them, and rewrite.
 */
function processFile(filePath) {
  let text = fs.readFileSync(filePath, "utf-8");
  let changes = 0;

  // Pattern: find "options": [ or choices: [ or "choices": [
  // followed later by "correct": N or correct: N
  const arrayPattern = /(?:"options"|"choices"|choices)\s*:\s*\[/g;
  let match;

  // Collect all replacements first (to handle offset shifts)
  const replacements = [];

  while ((match = arrayPattern.exec(text)) !== null) {
    const arrResult = extractArrayItems(text, match.index);
    if (!arrResult || arrResult.items.length < 2) continue;

    // Find the "correct" field after the array
    const afterArray = text.slice(arrResult.end);
    const correctMatch = afterArray.match(/^[\s,]*"?correct"?\s*:\s*(\d+)/);
    if (!correctMatch) continue;

    const correctIdx = parseInt(correctMatch[1], 10);
    if (correctIdx >= arrResult.items.length) continue;

    // Get the correct item before shuffling
    const correctItem = arrResult.items[correctIdx];

    // Seed based on the correct answer content for determinism
    const seed = hashString(correctItem + arrResult.items.length);
    const rng = mulberry32(seed);

    // Shuffle
    const shuffled = shuffleArray(arrResult.items, rng);

    // Find new index of correct item
    const newCorrectIdx = shuffled.indexOf(correctItem);
    if (newCorrectIdx === correctIdx && shuffled.length > 2) {
      // If it didn't move and there are enough items, that's fine -
      // the shuffle is random, sometimes items stay put
    }

    // Build replacement array string
    // Preserve the original formatting style
    const originalArray = arrResult.raw;
    const isMultiline = originalArray.includes("\n");

    let newArrayStr;
    if (isMultiline) {
      // Detect indentation from original
      const lines = originalArray.split("\n");
      const itemIndent = lines.length > 1 ? lines[1].match(/^(\s*)/)?.[1] || "      " : "      ";
      newArrayStr = "[\n" + shuffled.map((item, i) => {
        const comma = i < shuffled.length - 1 ? "," : "";
        return `${itemIndent}${item}${comma}`;
      }).join("\n") + "\n" + itemIndent.replace(/  $/, "") + "]";
    } else {
      newArrayStr = "[" + shuffled.join(", ") + "]";
    }

    // Build replacement for the correct field
    const correctFieldStart = arrResult.end + correctMatch.index;
    const correctFieldEnd = arrResult.end + correctMatch.index + correctMatch[0].length;
    const correctFieldOriginal = correctMatch[0];
    const newCorrectField = correctFieldOriginal.replace(/\d+$/, String(newCorrectIdx));

    replacements.push({
      arrayStart: arrResult.start,
      arrayEnd: arrResult.end,
      newArray: newArrayStr,
      correctStart: correctFieldStart,
      correctEnd: correctFieldEnd,
      newCorrect: newCorrectField,
    });

    changes++;
  }

  // Apply replacements in reverse order to preserve positions
  for (let i = replacements.length - 1; i >= 0; i--) {
    const r = replacements[i];
    // Replace correct field first (it comes after the array)
    text = text.slice(0, r.correctStart) + r.newCorrect + text.slice(r.correctEnd);
    // Replace array
    text = text.slice(0, r.arrayStart) + r.newArray + text.slice(r.arrayEnd);
  }

  if (changes > 0) {
    fs.writeFileSync(filePath, text, "utf-8");
  }
  return changes;
}

// Find all page.tsx files in courses
function findPageFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPageFiles(full));
    } else if (entry.name === "page.tsx") {
      results.push(full);
    }
  }
  return results;
}

const files = findPageFiles(COURSES_DIR);
let totalChanges = 0;

for (const f of files) {
  const changes = processFile(f);
  if (changes > 0) {
    const rel = path.relative(COURSES_DIR, f);
    console.log(`  ${rel}: ${changes} question sets shuffled`);
    totalChanges += changes;
  }
}

console.log(`\nDone! Shuffled ${totalChanges} question sets across ${files.length} files.`);
