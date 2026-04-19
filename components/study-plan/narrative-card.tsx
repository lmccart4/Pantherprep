import type { StudyPlan } from "@/types/study-plan";
import { formatRelative } from "@/lib/coach-chat";

export function NarrativeCard({ plan }: { plan: StudyPlan }) {
  if (!plan.weeklyNarrative) {
    return (
      <div className="border-2 border-rule-hair p-6">
        <div className="kicker mb-2">Awaiting Parker</div>
        <p className="font-body text-[14px] italic text-ink-3">
          Your first weekly note arrives Sunday night. In the meantime, start today&rsquo;s set.
        </p>
      </div>
    );
  }

  const body = plan.weeklyNarrative;
  const quote = plan.pullQuote;
  const renderBody = () => {
    if (!quote || !body.includes(quote)) return <>{body}</>;
    const parts = body.split(quote);
    return (
      <>
        {parts.map((chunk, i) => (
          <span key={i}>
            {chunk}
            {i < parts.length - 1 && (
              <em className="text-accent" style={{ fontStyle: "italic" }}>
                {quote}
              </em>
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="border-2 border-ink bg-paper-card p-6 shadow-[5px_5px_0_var(--color-ink)]">
      <div className="kicker mb-3">From Parker &middot; This week</div>
      <p className="font-body text-[16px] leading-[1.55] text-ink">{renderBody()}</p>
      <div className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-3">
        Updated {formatRelative(plan.lastRegeneratedAt)}
      </div>
    </div>
  );
}
