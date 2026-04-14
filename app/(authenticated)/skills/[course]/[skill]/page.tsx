import { notFound } from "next/navigation";
import { MATH_SKILLS, RW_SKILLS } from "@/lib/adaptive/adaptive-engine";
import { SkillDetailPageClient } from "@/components/skills/skill-detail-page";

const VALID_COURSES = [
  "sat-math",
  "sat-rw",
  "nmsqt-math",
  "nmsqt-rw",
  "psat89-math",
  "psat89-rw",
] as const;

export function generateStaticParams() {
  const params: { course: string; skill: string }[] = [];
  for (const course of VALID_COURSES) {
    const taxonomy: Record<string, string[]> = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
    for (const skills of Object.values(taxonomy)) {
      for (const skill of skills) {
        params.push({ course, skill });
      }
    }
  }
  return params;
}

function skillExistsInCourse(course: string, skill: string): boolean {
  const taxonomy: Record<string, string[]> = course.includes("math") ? MATH_SKILLS : RW_SKILLS;
  for (const skills of Object.values(taxonomy)) {
    if (skills.includes(skill)) return true;
  }
  return false;
}

export default async function SkillDetailRoute({
  params,
}: {
  params: Promise<{ course: string; skill: string }>;
}) {
  const { course, skill } = await params;
  if (!VALID_COURSES.includes(course as (typeof VALID_COURSES)[number]) || !skillExistsInCourse(course, skill)) {
    notFound();
  }
  return <SkillDetailPageClient course={course} skill={skill} />;
}
