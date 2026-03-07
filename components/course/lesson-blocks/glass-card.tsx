"use client";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}

export function GlassCard({ children, className = "", accentColor }: GlassCardProps) {
  return (
    <div
      className={`rounded-[18px] border border-glass-border bg-glass p-7 shadow-[0_4px_32px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.03)] backdrop-blur-[20px] ${className}`}
      style={accentColor ? { boxShadow: `0 4px 32px rgba(0,0,0,.2), 0 0 40px ${accentColor}15, inset 0 1px 0 rgba(255,255,255,.03)` } : undefined}
    >
      {children}
    </div>
  );
}

interface InfoCalloutProps {
  color: string;
  label: string;
  children: React.ReactNode;
}

export function InfoCallout({ color, label, children }: InfoCalloutProps) {
  return (
    <div
      className="mt-4 rounded-xl border px-5 py-4 text-sm leading-[1.7] text-[#bcbcc8]"
      style={{ background: `${color}0d`, borderColor: `${color}33` }}
    >
      <strong style={{ color }}>{label} </strong>
      {children}
    </div>
  );
}
