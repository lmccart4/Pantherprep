import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** When true, includes the hard offset "stamp" shadow for hero cards. */
  raised?: boolean;
}

export function GlassCard({ className, children, raised, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "border-2 border-ink bg-paper-card p-7 transition-transform duration-200",
        raised && "shadow-[5px_5px_0_var(--color-ink)]",
        "hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { GlassCard as PaperCard };
