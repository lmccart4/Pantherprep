"use client";

import { useState } from "react";
import type { LessonSlide } from "@/types/module";
import { renderMath } from "@/lib/katex-render";

interface LessonViewerProps {
  slides: LessonSlide[];
  accentColor: string;
  visuals?: Record<string, React.ReactNode>;
  onComplete: () => void;
  /** Custom label for the last slide's button (default: "Continue") */
  lastSlideLabel?: string;
}

export function LessonViewer({ slides, accentColor, visuals, onComplete, lastSlideLabel }: LessonViewerProps) {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const isLast = idx === slides.length - 1;

  return (
    <div className="mx-auto min-h-screen max-w-[800px] px-5 pb-16 pt-5">
      {/* Header */}
      <div className="mb-8 border-b border-border-default pb-7 pt-10">
        {slide.subtitle && (
          <div
            className="mb-2.5 text-[11px] font-bold uppercase tracking-[2.5px]"
            style={{ color: accentColor }}
          >
            {slide.subtitle}
          </div>
        )}
        <h1 className="mb-1.5 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-text-primary">
          {slide.title}
        </h1>
      </div>

      {/* Body */}
      <div className="mb-8 space-y-3">
        {slide.body.map((p, i) => (
          <p key={i} className="text-[.93rem] leading-[1.7] text-[#ccc]">
            {renderMath(p)}
          </p>
        ))}
      </div>

      {/* Visual */}
      {slide.visual && visuals?.[slide.visual] && (
        <div className="mb-8">{visuals[slide.visual]}</div>
      )}

      {/* Navigation dots */}
      <div className="mb-6 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="h-2 w-2 rounded-full border-none transition-all duration-300"
            style={{
              backgroundColor: i === idx ? accentColor : "var(--color-border-default)",
              transform: i === idx ? "scale(1.25)" : "scale(1)",
              boxShadow: i === idx ? `0 0 8px ${accentColor}80` : "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-center gap-3">
        {idx > 0 && (
          <button
            onClick={() => setIdx(idx - 1)}
            className="cursor-pointer rounded-lg border border-border-default bg-bg-surface px-6 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-border-hover"
          >
            ← Previous
          </button>
        )}
        <button
          onClick={() => (isLast ? onComplete() : setIdx(idx + 1))}
          className="cursor-pointer rounded-lg border-none px-6 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
          style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
        >
          {isLast ? (lastSlideLabel ?? "Continue") : "Next"} →
        </button>
      </div>
    </div>
  );
}
