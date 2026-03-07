import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";

const courses = ['sat-rw','sat-math','nmsqt-rw','nmsqt-math','psat89-rw','psat89-math'];

for (const course of courses) {
  const dir = 'data/' + course;
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const num = f.replace('module-','').replace('.json','');
    const d = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
    const pagePath = 'app/(authenticated)/courses/' + course + '/' + num + '/page.tsx';
    if (!existsSync(pagePath)) { console.log(course+'/'+num+': PAGE MISSING'); continue; }
    const tsx = readFileSync(pagePath, 'utf8');

    const hasQuiz = /quiz:\s*(\[|[A-Z_]+)/.test(tsx);
    const hasWarmup = /warmup:\s*(\[|[A-Z_]+)/.test(tsx);
    const hasChallenge = /challenge:\s*(\[|[A-Z_]+)/.test(tsx);
    const hasActivities = tsx.includes('activities=');

    const exerciseEntries = Object.entries(d.exercises || {}).filter(([,v]) => Array.isArray(v) && v.length > 0);

    const missing = [];
    if ((d.warmup||[]).length > 0 && !hasWarmup) missing.push('warmup('+d.warmup.length+')');
    if (((d.quiz||[]).length > 0 || (d.practice||[]).length > 0) && !hasQuiz) {
      const qCount = (d.quiz||[]).length || (d.practice||[]).length;
      missing.push('quiz('+qCount+')');
    }
    if ((d.challenge||[]).length > 0 && !hasChallenge) missing.push('challenge('+d.challenge.length+')');

    // Check for unmapped exercises
    for (const [name, items] of exerciseEntries) {
      const screenId = 'exercise-' + name.toLowerCase().replace(/_/g, '-');
      if (!tsx.includes(screenId) && !tsx.includes(name)) {
        const sample = items[0];
        const keys = Object.keys(sample).sort().join(',');
        missing.push(`${name}[${items.length}]{${keys}}`);
      }
    }

    if (missing.length > 0) console.log(course+'/'+num+': '+missing.join(' | '));
  }
}
