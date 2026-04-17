"use client";

import type { ModuleScreen } from "@/types/module";

const ICON_MAP: Record<string, string> = {
  wave: "\uD83D\uDC4B",
  welcome: "\uD83D\uDC4B",
  brain: "\uD83E\uDDE0",
  warmup: "\uD83E\uDDE0",
  book: "\uD83D\uDCDA",
  lesson: "\uD83D\uDCDA",
  target: "\uD83C\uDFAF",
  quiz: "\uD83C\uDFAF",
  practice: "\uD83C\uDFAF",
  trophy: "\uD83C\uDFC6",
  complete: "\uD83C\uDFC6",
  star: "\u2B50",
  sparkles: "\u2728",
  exercise: "\uD83D\uDCAA",
  flame: "\uD83D\uDD25",
  boss: "\uD83D\uDC32",
  swords: "\u2694\uFE0F",
  search: "\uD83D\uDD0D",
  palette: "\uD83C\uDFA8",
  clipboard: "\uD83D\uDCCB",
  zap: "\u26A1",
  pencil: "\u270F\uFE0F",
  rocket: "\uD83D\uDE80",
  hammer: "\uD83D\uDD28",
  lightbulb: "\uD83D\uDCA1",
  chart: "\uD83D\uDCCA",
};

function resolveIcon(icon?: string): string {
  if (!icon) return "";
  if (ICON_MAP[icon]) return ICON_MAP[icon];
  // Already an emoji (starts with non-ASCII)
  if (icon.codePointAt(0)! > 127) return icon;
  return icon;
}

/** Collapse the full screen list into 4-5 summary cards for the welcome view. */
function summarizeScreens(screens: ModuleScreen[]): ModuleScreen[] {
  const hidden = new Set(["welcome", "complete"]);
  const result: ModuleScreen[] = [];
  let exerciseCount = 0;

  for (const s of screens) {
    if (hidden.has(s.id)) continue;
    const isExercise = s.id.startsWith("exercise-") || s.id === "checklist" ||
      s.id.startsWith("activity-") || s.id === "error-worksheet" ||
      s.id === "score-projector" || s.id === "challenge";
    if (isExercise) {
      exerciseCount++;
      if (exerciseCount === 1) {
        result.push({ id: "_practice", label: "Practice", icon: "exercise" });
      }
    } else {
      result.push(s);
    }
  }
  return result;
}

interface WelcomeScreenProps {
  moduleNum: number;
  title: string;
  subtitle: string;
  accentColor: string;
  screens: ModuleScreen[];
  onStart: () => void;
}

export function WelcomeScreen({ moduleNum, title, subtitle, accentColor, screens, onStart }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10 text-center">
      <span
        className="mb-4 inline-block rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-[2px] text-ink"
        style={{ backgroundColor: accentColor }}
      >
        Module {moduleNum}
      </span>
      <h1 className="mb-2 max-w-[600px] font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight">
        <span
          className="bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
          style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
        >
          {title}
        </span>
      </h1>
      <p className="mx-auto mb-8 max-w-[500px] text-[1.05rem] text-text-muted">{subtitle}</p>

      <div className="mb-10 grid w-full max-w-[640px] grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
        {summarizeScreens(screens).map((s) => (
          <div
            key={s.id}
            className="rounded-[14px] border border-white/[0.06] bg-white/[0.03] p-4 text-center  transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.05]"
          >
            {s.icon && (
              <div className="mb-2 text-[1.8rem] leading-none">{resolveIcon(s.icon)}</div>
            )}
            <div className="text-[.8rem] font-semibold text-text-secondary">{s.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="cursor-pointer rounded-[10px] border-none px-9 py-3.5 text-base font-bold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
        style={{ background: `linear-gradient(135deg, ${accentColor}, #a855f7)` }}
      >
        Start Module
      </button>
    </div>
  );
}
