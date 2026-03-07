"use client";

interface DataTableProps {
  rows: [string, string][];
  /** Map of row labels to highlighted values for emphasis */
  highlights?: Record<string, string>;
}

export function DataTable({ rows, highlights }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-border-default">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
              Feature
            </th>
            <th className="border-b border-border-default bg-bg-surface px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={i}>
              <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-semibold text-text-secondary last:border-b-0">
                {label}
              </td>
              <td className="border-b border-border-default px-4 py-3 text-[#bcbcc8] last:border-b-0">
                {highlights?.[label] ? (
                  <span>
                    <code className="rounded-md bg-accent-purple-soft px-2 py-0.5 font-mono text-[13px] font-medium text-accent-purple">
                      {highlights[label]}
                    </code>{" "}
                    {value.replace(highlights[label], "").trim()}
                  </span>
                ) : (
                  value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
