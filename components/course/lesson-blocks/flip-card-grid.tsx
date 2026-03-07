"use client";

import { useState } from "react";

interface FlipCard {
  title: string;
  /** Icon emoji or short text */
  icon?: string;
  /** Subtitle / stats shown on front */
  subtitle?: string;
  /** Front-side description */
  front: string;
  /** Back-side detail */
  back: string;
  color: string;
}

interface FlipCardGridProps {
  cards: FlipCard[];
  columns?: 2 | 3;
}

export function FlipCardGrid({ cards, columns = 2 }: FlipCardGridProps) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setFlipped((p) => ({ ...p, [i]: !p[i] }));

  return (
    <div
      className="grid gap-3.5"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {cards.map((card, i) => {
        const isFlipped = flipped[i];
        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="cursor-pointer rounded-[14px] border bg-bg-deep p-[18px] text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: isFlipped ? `${card.color}33` : "var(--color-border-default)",
              boxShadow: isFlipped ? `0 0 20px ${card.color}11` : "none",
            }}
          >
            {!isFlipped ? (
              <div>
                {card.icon && card.subtitle ? (
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <span className="font-mono text-xl font-bold" style={{ color: card.color }}>
                      {card.icon}
                    </span>
                    <span className="text-[15px] font-bold text-text-primary">{card.title}</span>
                  </div>
                ) : card.icon ? (
                  <>
                    <div className="mb-1.5 text-center text-[2rem]">{card.icon}</div>
                    <div className="mb-1 text-center text-sm font-bold text-text-primary">{card.title}</div>
                  </>
                ) : (
                  <div className="mb-2 text-[15px] font-bold text-text-primary">{card.title}</div>
                )}
                {card.subtitle && (
                  <div className="mb-1.5 text-[13px] font-medium text-text-muted">{card.subtitle}</div>
                )}
                <div className="text-[13px] leading-relaxed text-text-muted">{card.front}</div>
                <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: card.color }}>
                  tap to see details →
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm leading-[1.7] text-[#bcbcc8]">{card.back}</div>
                <div className="mt-2 text-right text-[11px] font-medium opacity-70" style={{ color: card.color }}>
                  ← tap to flip back
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
