import { cn } from "@/lib/cn";

const ACCENT_STYLES: Record<
  "terracotta" | "teal" | "ochre" | "violet" | "neutral",
  { bg: string; ring: string; text: string; dot: string }
> = {
  terracotta: {
    bg: "bg-terracotta-tint",
    ring: "ring-terracotta/30",
    text: "text-terracotta",
    dot: "bg-terracotta",
  },
  teal: {
    bg: "bg-teal-tint",
    ring: "ring-teal/30",
    text: "text-teal",
    dot: "bg-teal",
  },
  ochre: {
    bg: "bg-ochre-tint",
    ring: "ring-ochre/40",
    text: "text-ochre",
    dot: "bg-ochre",
  },
  violet: {
    bg: "bg-violet-tint",
    ring: "ring-violet/30",
    text: "text-violet",
    dot: "bg-violet",
  },
  neutral: {
    bg: "bg-cream-100",
    ring: "ring-ink-200",
    text: "text-ink-950",
    dot: "bg-ink-500",
  },
};

export function MetricTile({
  label,
  value,
  suffix,
  accent = "neutral",
  className,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  accent?: "terracotta" | "teal" | "ochre" | "violet" | "neutral";
  className?: string;
}) {
  const s = ACCENT_STYLES[accent];
  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 rounded-2xl p-6 ring-1 transition-all hover:scale-[1.02]",
        s.bg,
        s.ring,
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn("block h-1.5 w-1.5 rounded-full", s.dot)} />
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-ink-700">
          {label}
        </span>
      </div>
      <span className={cn("display text-5xl leading-none font-normal", s.text)}>
        {value}
        {suffix && (
          <span className="ml-1 mono text-base text-ink-500 font-normal">
            {suffix}
          </span>
        )}
      </span>
    </div>
  );
}
