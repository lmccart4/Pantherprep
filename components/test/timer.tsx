"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimerProps {
  initialSeconds: number;
  onExpire: () => void;
  paused?: boolean;
  className?: string;
}

export function Timer({ initialSeconds, onExpire, paused = false, className }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const expired = timeLeft <= 0;

  useEffect(() => {
    if (paused || expired) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, expired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft < 300 && timeLeft >= 60;
  const isDanger = timeLeft < 60;

  return (
    <span
      className={cn(
        "font-mono text-lg font-bold tabular-nums tracking-wider",
        !isWarning && !isDanger && "text-ink",
        isWarning && "text-amber",
        isDanger && "animate-pulse text-accent",
        className
      )}
    >
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
