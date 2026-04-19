import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import type { StudyPlan } from "@/types/study-plan";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";

interface Props {
  plan: StudyPlan;
  profile: AdaptiveProfile | null;
}

export function SkillProgress({ plan, profile }: Props) {
  const rows = plan.currentWeekSkills.map((skill) => {
    const data = profile?.skills?.[skill];
    const mastery = data?.mastery ?? 0;
    const target =
      plan.skillQueue.find((q) => q.skill === skill)?.targetMastery ?? 0.8;
    return { skill, mastery, target };
  });

  return (
    <div className="border-2 border-ink bg-paper-card">
      <div className="border-b border-rule-hair p-4">
        <div className="kicker">This week&rsquo;s skills</div>
      </div>
      <div className="divide-y divide-rule-hair">
        {rows.length === 0 && (
          <div className="p-4 font-body italic text-ink-3">
            No skills assigned this week.
          </div>
        )}
        {rows.map(({ skill, mastery, target }) => (
          <div key={skill} className="p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-display text-[18px] text-ink">
                {skillLabel(skill)}
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3">
                {Math.round(mastery * 100)}% &middot; target{" "}
                {Math.round(target * 100)}%
              </span>
            </div>
            <div className="relative h-2 bg-rule-hair">
              <div
                className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-300"
                style={{ width: `${Math.min(100, mastery * 100)}%` }}
              />
              <div
                className="absolute inset-y-0 w-[2px] bg-accent"
                style={{ left: `${Math.min(100, target * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
