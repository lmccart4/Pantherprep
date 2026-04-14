// Shim: SKILL_MAP now lives in @/lib/skill-mapping. Re-exported here for
// backward compatibility with the seed script and any other tooling that
// imports from the scripts path. New code should import directly from
// @/lib/skill-mapping.
export { SKILL_MAP, TAXONOMY_ADDITIONS, type SkillMapping } from "../lib/skill-mapping";
