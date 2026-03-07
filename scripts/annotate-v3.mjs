#!/usr/bin/env node
// V3: Simple state-machine approach - track quiz/challenge sections and annotate
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const BASE = '/Users/lukemccarthy/pantherprep/app/(authenticated)/courses';

const MODULE_MAP = {
  'sat-math/2': { d: 'Algebra', s: 'linear_equations' },
  'sat-math/3': { d: 'Advanced Math', s: 'quadratic_equations' },
  'sat-math/4': { d: 'Advanced Math', s: 'exponential_functions' },
  'sat-math/5': { d: 'Problem Solving & Data', s: 'ratios_rates' },
  'sat-math/7': { d: 'Problem Solving & Data', s: 'scatterplots' },
  'sat-math/8': { d: 'Algebra', s: 'linear_equations' },
  'sat-math/9': { d: 'Algebra', s: 'linear_equations' },
  'sat-math/10': { d: 'Algebra', s: 'linear_equations' },
  'sat-rw/0': { d: 'Information & Ideas', s: 'central_ideas' },
  'sat-rw/1': { d: 'Standard English Conventions', s: 'punctuation_boundaries' },
  'sat-rw/2': { d: 'Standard English Conventions', s: 'subject_verb_agreement' },
  'sat-rw/3': { d: 'Standard English Conventions', s: 'modifiers' },
  'sat-rw/5': { d: 'Craft & Structure', s: 'vocabulary_in_context' },
  'sat-rw/6': { d: 'Craft & Structure', s: 'vocabulary_in_context' },
  'sat-rw/7': { d: 'Craft & Structure', s: 'text_structure' },
  'sat-rw/9': { d: 'Information & Ideas', s: 'central_ideas' },
  'sat-rw/10': { d: 'Information & Ideas', s: 'inferences' },
  'sat-rw/11': { d: 'Information & Ideas', s: 'quantitative_evidence' },
  'sat-rw/13': { d: 'Expression of Ideas', s: 'transitions' },
  'sat-rw/14': { d: 'Expression of Ideas', s: 'rhetorical_synthesis' },
  'sat-rw/15': { d: 'Expression of Ideas', s: 'organization' },
  'sat-rw/17': { d: 'Information & Ideas', s: 'central_ideas' },
  'sat-rw/18': { d: 'Information & Ideas', s: 'central_ideas' },
  'nmsqt-math/2': { d: 'Algebra', s: 'linear_equations' },
  'nmsqt-math/3': { d: 'Advanced Math', s: 'quadratic_equations' },
  'nmsqt-math/4': { d: 'Problem Solving & Data', s: 'ratios_rates' },
  'nmsqt-math/5': { d: 'Geometry & Trig', s: 'triangles' },
  'nmsqt-math/6': { d: 'Problem Solving & Data', s: 'scatterplots' },
  'nmsqt-math/7': { d: 'Algebra', s: 'linear_equations' },
  'nmsqt-math/8': { d: 'Algebra', s: 'linear_equations' },
  'nmsqt-rw/2': { d: 'Standard English Conventions', s: 'punctuation_boundaries' },
  'nmsqt-rw/3': { d: 'Standard English Conventions', s: 'subject_verb_agreement' },
  'nmsqt-rw/4': { d: 'Craft & Structure', s: 'vocabulary_in_context' },
  'nmsqt-rw/5': { d: 'Information & Ideas', s: 'central_ideas' },
  'nmsqt-rw/6': { d: 'Information & Ideas', s: 'details_evidence' },
  'nmsqt-rw/7': { d: 'Craft & Structure', s: 'text_structure' },
  'nmsqt-rw/8': { d: 'Expression of Ideas', s: 'transitions' },
  'nmsqt-rw/9': { d: 'Expression of Ideas', s: 'organization' },
  'nmsqt-rw/10': { d: 'Information & Ideas', s: 'central_ideas' },
  'nmsqt-rw/11': { d: 'Information & Ideas', s: 'central_ideas' },
  'nmsqt-rw/12': { d: 'Information & Ideas', s: 'central_ideas' },
  'psat89-math/2': { d: 'Algebra', s: 'linear_equations' },
  'psat89-math/3': { d: 'Advanced Math', s: 'quadratic_equations' },
  'psat89-math/4': { d: 'Problem Solving & Data', s: 'ratios_rates' },
  'psat89-math/5': { d: 'Geometry & Trig', s: 'triangles' },
  'psat89-math/6': { d: 'Problem Solving & Data', s: 'scatterplots' },
  'psat89-math/7': { d: 'Algebra', s: 'linear_equations' },
  'psat89-math/8': { d: 'Algebra', s: 'linear_equations' },
  'psat89-rw/2': { d: 'Standard English Conventions', s: 'punctuation_boundaries' },
  'psat89-rw/3': { d: 'Standard English Conventions', s: 'subject_verb_agreement' },
  'psat89-rw/4': { d: 'Craft & Structure', s: 'vocabulary_in_context' },
  'psat89-rw/5': { d: 'Information & Ideas', s: 'central_ideas' },
  'psat89-rw/6': { d: 'Standard English Conventions', s: 'comma_usage' },
  'psat89-rw/7': { d: 'Craft & Structure', s: 'text_structure' },
  'psat89-rw/8': { d: 'Expression of Ideas', s: 'transitions' },
  'psat89-rw/9': { d: 'Information & Ideas', s: 'central_ideas' },
  'psat89-rw/10': { d: 'Information & Ideas', s: 'central_ideas' },
};

function processFile(moduleKey, filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const mapping = MODULE_MAP[moduleKey];
  if (!mapping) return 0;

  const lines = content.split('\n');
  const result = [];
  let inQuizOrChallenge = false;
  let arrayBraceDepth = 0; // Track [ ] depth for the quiz/challenge array
  let questionBraceDepth = 0;
  let hasSkillInCurrentQuestion = false;
  let changeCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect start of quiz or challenge array
    if (!inQuizOrChallenge && /^\s*(quiz|challenge):\s*\[/.test(line)) {
      inQuizOrChallenge = true;
      arrayBraceDepth = 0;
      questionBraceDepth = 0;
      result.push(line);
      continue;
    }

    if (!inQuizOrChallenge) {
      result.push(line);
      continue;
    }

    // Count braces on this line
    for (const ch of line) {
      if (ch === '[') arrayBraceDepth++;
      if (ch === ']') {
        arrayBraceDepth--;
        if (arrayBraceDepth < 0) {
          // End of quiz/challenge array
          inQuizOrChallenge = false;
        }
      }
      if (ch === '{') {
        questionBraceDepth++;
        if (questionBraceDepth === 1) {
          hasSkillInCurrentQuestion = false;
        }
      }
      if (ch === '}') {
        questionBraceDepth--;
      }
    }

    // Check if current line has skill/domain
    if (/^\s*(skill|domain)\s*:/.test(line)) {
      hasSkillInCurrentQuestion = true;
    }

    // If we're closing a top-level question object (depth went from 1 to 0)
    if (questionBraceDepth === 0 && /\}/.test(trimmed) && !hasSkillInCurrentQuestion && inQuizOrChallenge) {
      // Insert domain and skill before this closing brace
      // Find the indent
      const indent = line.match(/^(\s*)/)?.[1] || '    ';

      // Make sure previous line ends with comma
      const prevIdx = result.length - 1;
      if (prevIdx >= 0 && !result[prevIdx].trimEnd().endsWith(',')) {
        result[prevIdx] = result[prevIdx].trimEnd() + ',';
      }

      result.push(`${indent}  domain: "${mapping.d}",`);
      result.push(`${indent}  skill: "${mapping.s}",`);
      changeCount++;
    }

    result.push(line);
  }

  if (changeCount > 0) {
    writeFileSync(filePath, result.join('\n'));
    console.log(`  ✓ ${moduleKey}: +${changeCount} questions`);
  }
  return changeCount;
}

console.log('V3: Annotating remaining unannotated quiz questions...\n');
let total = 0;
for (const moduleKey of Object.keys(MODULE_MAP)) {
  const filePath = join(BASE, moduleKey, 'page.tsx');
  try { readFileSync(filePath); } catch { continue; }
  total += processFile(moduleKey, filePath);
}
console.log(`\nDone! Annotated ${total} additional questions.`);
