"use client";

interface TestStage {
  name: string;
  range: string;
  description: string;
  color: string;
  flex?: number;
}

interface GrowthTrajectoryProps {
  tests: TestStage[];
  accentColor?: string;
}

export function GrowthTrajectory({
  tests,
  accentColor = "#a78bfa",
}: GrowthTrajectoryProps) {
  const totalFlex = tests.reduce((s, t) => s + (t.flex ?? 1), 0);

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="rounded-[14px] border border-border-default bg-bg-deep p-5">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
          Test Progression
        </div>
        <div className="flex h-10 w-full overflow-hidden rounded-xl">
          {tests.map((t, i) => {
            const widthPct = ((t.flex ?? 1) / totalFlex) * 100;
            return (
              <div
                key={i}
                className="flex items-center justify-center text-[11px] font-bold text-ink transition-all duration-300"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: t.color,
                  opacity: 0.8,
                  borderRight:
                    i < tests.length - 1
                      ? "2px solid var(--color-bg-deep)"
                      : undefined,
                }}
              >
                <span className="truncate px-1">{t.name}</span>
              </div>
            );
          })}
        </div>

        {/* Score ranges below bar */}
        <div className="mt-2 flex">
          {tests.map((t, i) => {
            const widthPct = ((t.flex ?? 1) / totalFlex) * 100;
            return (
              <div
                key={i}
                className="text-center text-[10px] font-medium text-text-muted"
                style={{ width: `${widthPct}%` }}
              >
                {t.range}
              </div>
            );
          })}
        </div>
      </div>

      {/* Details table */}
      <div className="overflow-hidden rounded-[14px] border border-border-default">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                Test
              </th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                Score Range
              </th>
              <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
                Key Differences
              </th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="font-semibold text-text-primary">
                      {t.name}
                    </span>
                  </div>
                </td>
                <td className="border-b border-border-default px-4 py-3 font-mono text-xs text-text-secondary last:border-b-0">
                  {t.range}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">
                  {t.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Benchmark callout */}
      <div
        className="rounded-xl border px-5 py-4 text-sm leading-[1.7] text-[#bcbcc8]"
        style={{
          backgroundColor: `${accentColor}0a`,
          borderColor: `${accentColor}33`,
        }}
      >
        <strong style={{ color: accentColor }}>Key Takeaway: </strong>
        Each test builds on the previous one. Skills you develop for earlier tests directly transfer to the SAT, with increasing complexity and score range.
      </div>
    </div>
  );
}
