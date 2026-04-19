import type { StudyPlan } from "@/types/study-plan";
import { skillLabel } from "@/lib/adaptive/adaptive-engine";
import { cn } from "@/lib/utils";

export function WeekStrip({ plan }: { plan: StudyPlan }) {
  const totalWeeks = Math.max(1, (plan.skillQueue?.at(-1)?.assignedWeek ?? 0) + 1);
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i);
  const skillsByWeek: Record<number, string[]> = {};
  for (const entry of plan.skillQueue ?? []) {
    skillsByWeek[entry.assignedWeek] ??= [];
    skillsByWeek[entry.assignedWeek].push(entry.skill);
  }

  function statusFor(w: number): "done" | "active" | "upcoming" | "skipped" {
    if ((plan.skippedWeeks ?? []).includes(w)) return "skipped";
    if (w < plan.currentWeekIndex) return "done";
    if (w === plan.currentWeekIndex) return "active";
    return "upcoming";
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {weeks.map((w) => {
        const status = statusFor(w);
        const skills = skillsByWeek[w] ?? [];
        return (
          <div
            key={w}
            className={cn(
              "border-2 p-4",
              status === "active" && "border-ink bg-ink text-paper",
              status === "done" && "border-rule-hair bg-paper-card opacity-60",
              status === "upcoming" && "border-rule-hair bg-paper-card",
              status === "skipped" && "border-rule-hair bg-paper-card opacity-40"
            )}
          >
            <div className={cn("kicker mb-2", status === "active" && "text-paper/70")}>
              Week {w + 1}
            </div>
            <div
              className={cn(
                "mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]",
                status === "active" ? "text-paper" : "text-ink-3"
              )}
            >
              {status === "active"
                ? "This week"
                : status === "done"
                  ? "Done"
                  : status === "skipped"
                    ? "Skipped"
                    : "Upcoming"}
            </div>
            <ul
              className={cn(
                "flex flex-col gap-1 font-body text-[13px]",
                status === "active" ? "text-paper" : "text-ink-2"
              )}
            >
              {skills.length === 0 && <li className="italic opacity-60">—</li>}
              {skills.map((s) => (
                <li key={s}>{skillLabel(s)}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
