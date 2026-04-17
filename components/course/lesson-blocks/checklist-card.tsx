"use client";

import { useState, useEffect, useCallback } from "react";

interface ChecklistCardProps {
  items: string[];
  storageKey?: string;
  accentColor?: string;
}

export function ChecklistCard({
  items,
  storageKey,
  accentColor = "#a78bfa",
}: ChecklistCardProps) {
  const [checked, setChecked] = useState<boolean[]>(() => new Array(items.length).fill(false));

  // Load from localStorage on mount
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(`checklist-${storageKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === items.length) {
          setChecked(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [storageKey, items.length]);

  // Save to localStorage on change
  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(`checklist-${storageKey}`, JSON.stringify(checked));
    } catch {
      // Ignore storage errors
    }
  }, [checked, storageKey]);

  const toggle = useCallback((i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }, []);

  const doneCount = checked.filter(Boolean).length;
  const allDone = doneCount === items.length;

  return (
    <div
      className="rounded-[18px] border bg-glass p-6 shadow-[0_4px_32px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.03)] -[20px]"
      style={{
        borderColor: allDone ? `${accentColor}33` : "var(--color-glass-border, rgba(255,255,255,.05))",
        boxShadow: allDone
          ? `0 4px 32px rgba(0,0,0,.2), 0 0 40px ${accentColor}15, inset 0 1px 0 rgba(255,255,255,.03)`
          : undefined,
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-text-muted">
          Checklist
        </span>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold transition-colors duration-300"
          style={{
            backgroundColor: allDone ? `${accentColor}22` : "var(--color-bg-surface)",
            color: allDone ? accentColor : "var(--color-text-muted)",
          }}
        >
          {doneCount} / {items.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-border-default">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(doneCount / items.length) * 100}%`,
            backgroundColor: accentColor,
            opacity: 0.7,
          }}
        />
      </div>

      {/* Items */}
      <div className="space-y-1">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 hover:bg-[rgba(255,255,255,.02)]"
          >
            <div
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200"
              style={{
                borderColor: checked[i] ? accentColor : "var(--color-border-default)",
                backgroundColor: checked[i] ? `${accentColor}22` : "transparent",
              }}
            >
              {checked[i] && (
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={accentColor}
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span
              className="text-sm leading-relaxed transition-all duration-200"
              style={{
                color: checked[i] ? "var(--color-text-muted)" : "var(--color-text-secondary, #bcbcc8)",
                textDecoration: checked[i] ? "line-through" : "none",
                opacity: checked[i] ? 0.6 : 1,
              }}
            >
              {item}
            </span>
          </button>
        ))}
      </div>

      {/* Completion message */}
      {allDone && (
        <div
          className="mt-4 rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-all duration-300"
          style={{
            backgroundColor: `${accentColor}0d`,
            borderColor: `${accentColor}33`,
            color: accentColor,
          }}
        >
          All items complete!
        </div>
      )}
    </div>
  );
}
