import { notFound } from "next/navigation";
import { SkillCatalogPageClient } from "@/components/skills/skill-catalog-page";

const VALID_COURSES = [
  "sat-math",
  "sat-rw",
  "nmsqt-math",
  "nmsqt-rw",
  "psat89-math",
  "psat89-rw",
] as const;

export function generateStaticParams() {
  return VALID_COURSES.map((course) => ({ course }));
}

export default async function SkillCatalogPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;

  if (!VALID_COURSES.includes(course as (typeof VALID_COURSES)[number])) {
    notFound();
  }

  return <SkillCatalogPageClient course={course} />;
}
