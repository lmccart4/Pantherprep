// Shared test-type + course metadata. Single source of truth consumed by
// /home (test-family cards) and /skills (root picker tiles).

import type { TestType } from "@/types/question";

export const TESTS: Record<TestType, { name: string; desc: string; color: string }> = {
  sat: { name: "SAT", desc: "College readiness", color: "#C8102E" },
  nmsqt: { name: "PSAT/NMSQT", desc: "National Merit", color: "#d4a017" },
  psat89: { name: "PSAT 8/9", desc: "Grades 8–9", color: "#06b6d4" },
};

export const COURSE_ROUTES: Record<TestType, { rw: string; math: string }> = {
  sat: { rw: "/courses/sat-rw", math: "/courses/sat-math" },
  nmsqt: { rw: "/courses/nmsqt-rw", math: "/courses/nmsqt-math" },
  psat89: { rw: "/courses/psat89-rw", math: "/courses/psat89-math" },
};

// All 6 (testType, section, course-slug) tuples in the order the skill
// root picker renders them. Each row is directly bindable to a tile.
export const TEST_COURSES: Array<{
  testType: TestType;
  section: "math" | "rw";
  course: string; // canonical slug used in Firestore + /skills/[course] URLs
  title: string;
  subtitle: string;
  color: string;
}> = [
  { testType: "sat",    section: "math", course: "sat-math",    title: "SAT Math",                     subtitle: "Algebra, advanced math, geometry", color: TESTS.sat.color },
  { testType: "sat",    section: "rw",   course: "sat-rw",      title: "SAT Reading & Writing",        subtitle: "Craft, expression, conventions",   color: TESTS.sat.color },
  { testType: "nmsqt",  section: "math", course: "nmsqt-math",  title: "PSAT/NMSQT Math",              subtitle: "Same curriculum, NMSQT scoring",   color: TESTS.nmsqt.color },
  { testType: "nmsqt",  section: "rw",   course: "nmsqt-rw",    title: "PSAT/NMSQT Reading & Writing", subtitle: "Same curriculum, NMSQT scoring",   color: TESTS.nmsqt.color },
  { testType: "psat89", section: "math", course: "psat89-math", title: "PSAT 8/9 Math",                subtitle: "Grades 8–9 baseline",              color: TESTS.psat89.color },
  { testType: "psat89", section: "rw",   course: "psat89-rw",   title: "PSAT 8/9 Reading & Writing",   subtitle: "Grades 8–9 baseline",              color: TESTS.psat89.color },
];
