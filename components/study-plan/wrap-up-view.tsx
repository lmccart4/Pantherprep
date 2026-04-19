import Link from "next/link";
import type { StudyPlan } from "@/types/study-plan";
import type { AdaptiveProfile } from "@/lib/adaptive/performance-service";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";

interface Props {
  plan: StudyPlan;
  profile: AdaptiveProfile | null;
}

export function WrapUpView({ plan, profile }: Props) {
  const finalSessions = Object.keys(plan.completedDays ?? {}).length;
  const rows = plan.skillQueue.map((q) => {
    const mastery = profile?.skills?.[q.skill]?.mastery ?? 0;
    return { skill: q.skill, mastery, target: q.targetMastery };
  });

  return (
    <div className="mx-auto max-w-[720px]">
      <div className="kicker mb-2">Test day is behind you</div>
      <h2 className="mb-4 font-display text-[clamp(36px,4vw,56px)] leading-tight text-ink">
        Plan{" "}
        <em className="text-accent" style={{ fontStyle: "italic" }}>
          archived
        </em>
        .
      </h2>
      <p className="mb-6 font-body text-[15px] italic text-ink-2">
        You logged {finalSessions} session{finalSessions === 1 ? "" : "s"} against this plan.
      </p>

      <div className="mb-6 border-2 border-ink bg-paper-card">
        <div className="border-b border-rule-hair p-4">
          <div className="kicker">Where you landed</div>
        </div>
        <div className="divide-y divide-rule-hair">
          {rows.map(({ skill, mastery, target }) => (
            <div key={skill} className="grid grid-cols-[1fr_auto] gap-4 p-4">
              <span className="font-display text-[16px] text-ink">{skillLabel(skill)}</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3">
                {Math.round(mastery * 100)}% &middot; target {Math.round(target * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/coach-chat?focus=composer"
        className="inline-block border-2 border-ink bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-fg hover:bg-ink"
      >
        How&rsquo;d it go? &rarr;
      </Link>
    </div>
  );
}
