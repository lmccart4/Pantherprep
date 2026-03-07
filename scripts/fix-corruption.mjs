#!/usr/bin/env node
// Fix corrupted module files by removing ALL domain/skill annotations
// (both correct and corrupt), repairing broken strings, then V3 can re-annotate cleanly.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const BASE = '/Users/lukemccarthy/pantherprep/app/(authenticated)/courses';

// Recursively find all page.tsx files
function findPages(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findPages(full));
    } else if (entry === 'page.tsx') {
      results.push(full);
    }
  }
  return results;
}

function fixFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const result = [];
  let fixes = 0;
  let removals = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Skip domain/skill annotation lines (added by V1 or V3 scripts)
    if (/^domain:\s*"/.test(trimmed) || /^skill:\s*"/.test(trimmed)) {
      removals++;

      // Check if this domain/skill line was inserted inside a string
      // Pattern: previous line ends with string fragment (no closing quote before comma)
      // and next line starts with }{ or similar LaTeX continuation
      if (result.length > 0 && i + 1 < lines.length) {
        const prevLine = result[result.length - 1];
        const nextLine = lines[i + 1];

        // If next line is also a skill: line, skip it too (will be caught next iteration)
        // If previous line was a broken string and next line continues it, rejoin
        if (/^skill:\s*"/.test(trimmed)) {
          // This is a skill line - check if NEXT line is a string continuation
          // that needs to be joined with the line BEFORE the domain: line
          const nextTrimmed = lines[i + 1]?.trim();
          if (nextTrimmed && /^\}\{/.test(nextTrimmed) || /^\\\\/.test(nextTrimmed)) {
            // Next line is a LaTeX continuation - will be handled when we get there
          }
        }
      }
      continue;
    }

    // Check if this line is a LaTeX continuation that should be joined with previous line
    // Pattern: previous line ends with something like `\frac{5,` (broken mid-LaTeX)
    // and this line starts with `}{` or similar
    if (result.length > 0) {
      const prevLine = result[result.length - 1];
      const prevTrimmed = prevLine.trimEnd();

      // Detect if prev line is a broken string: ends with text followed by comma,
      // but the comma is inside a LaTeX expression (no closing quote)
      // And current line starts with }{ which is LaTeX continuation
      if (/^\s*\}\{/.test(lines[i]) || /^\s*\}[^,{]*\$/.test(lines[i])) {
        // Check if previous line looks like a broken string mid-LaTeX
        // A string line that was split: has opening " but no closing " before end
        const strMatch = prevTrimmed.match(/^(\s*)"(.*)$/);
        if (strMatch && !prevTrimmed.endsWith('",') && !prevTrimmed.endsWith('"')) {
          // Previous line is a broken string start, join with this line
          // Remove trailing comma that was part of the LaTeX split
          let fixed = prevTrimmed;
          if (fixed.endsWith(',')) {
            fixed = fixed.slice(0, -1);
          }
          result[result.length - 1] = fixed + lines[i].trim();
          fixes++;
          continue;
        }
      }
    }

    // Also fix trailing comma issues: if we removed domain/skill lines,
    // the previous property might now have a double comma or missing comma
    result.push(lines[i]);
  }

  // Clean up: remove any lines that are just `domain:` or `skill:` leftovers
  // and fix double commas or missing commas before closing braces
  const cleaned = [];
  for (let i = 0; i < result.length; i++) {
    const line = result[i];
    const trimmed = line.trim();

    // Fix: if a property line lost its trailing comma because we removed annotation lines
    // Check: current line is a property, next non-empty line is another property or }
    cleaned.push(line);
  }

  if (removals > 0 || fixes > 0) {
    writeFileSync(filePath, cleaned.join('\n'));
    const rel = filePath.replace(BASE + '/', '');
    console.log(`  Fixed ${rel}: removed ${removals} annotation lines, rejoined ${fixes} broken strings`);
  }
  return { removals, fixes };
}

console.log('Fixing corrupted module files...\n');

// Skip sat-math/6 which was manually annotated correctly
const SKIP = ['sat-math/6/page.tsx'];

const pages = findPages(BASE);
let totalRemovals = 0;
let totalFixes = 0;

for (const page of pages) {
  const rel = page.replace(BASE + '/', '');
  if (SKIP.includes(rel)) {
    console.log(`  Skipping ${rel} (manually annotated)`);
    continue;
  }
  const { removals, fixes } = fixFile(page);
  totalRemovals += removals;
  totalFixes += fixes;
}

console.log(`\nDone! Removed ${totalRemovals} annotation lines, rejoined ${totalFixes} broken strings.`);
