import type { DisplayType } from "@/lib/types";

// ── Labels ────────────────────────────────────────────────────────────────────
const LABEL: Record<string, string> = {
  // Fase 2 — item_type
  MCQ: "MCQ",
  SJT: "SJT",
  Case: "Casus",
  Diagnose: "Diagnose",
  BestAlt: "Best Alt.",
  // Fase 1 — legacy type
  kennis: "Kennis",
  situatie: "Situationeel",
  casus: "Casus",
};

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  // Fase 2
  MCQ:      { bg: "bg-teal-tint",      text: "text-teal",      dot: "bg-teal" },
  SJT:      { bg: "bg-ochre-tint",     text: "text-ochre",     dot: "bg-ochre" },
  Case:     { bg: "bg-terracotta-tint",text: "text-terracotta",dot: "bg-terracotta" },
  Diagnose: { bg: "bg-violet-tint",    text: "text-violet",    dot: "bg-violet" },
  BestAlt:  { bg: "bg-magenta-tint",   text: "text-magenta",   dot: "bg-magenta" },
  // Fase 1 fallback
  kennis:   { bg: "bg-teal-tint",      text: "text-teal",      dot: "bg-teal" },
  situatie: { bg: "bg-ochre-tint",     text: "text-ochre",     dot: "bg-ochre" },
  casus:    { bg: "bg-terracotta-tint",text: "text-terracotta",dot: "bg-terracotta" },
};

export function TypeBadge({ type }: { type: DisplayType | null | undefined }) {
  if (!type) return null;
  const s = STYLE[type] ?? { bg: "bg-cream-200", text: "text-ink-700", dot: "bg-ink-400" };
  return (
    <span className={`chip ${s.bg} ${s.text}`}>
      <span className={`block h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {LABEL[type] ?? type}
    </span>
  );
}

// ── Difficulty badge ─────────────────────────────────────────────────────────
const DIFFICULTY_LABEL: Record<number, string> = {
  1: "Basis",
  2: "Licht",
  3: "Middel",
  4: "Zwaar",
  5: "Expert",
};
const DIFFICULTY_STYLE: Record<number, { bg: string; text: string }> = {
  1: { bg: "bg-teal-tint",       text: "text-teal" },
  2: { bg: "bg-teal-tint",       text: "text-teal" },
  3: { bg: "bg-ochre-tint",      text: "text-ochre" },
  4: { bg: "bg-terracotta-tint", text: "text-terracotta" },
  5: { bg: "bg-magenta-tint",    text: "text-magenta" },
};

export function DifficultyBadge({ difficulty }: { difficulty: number | null | undefined }) {
  if (!difficulty) return null;
  const s = DIFFICULTY_STYLE[difficulty] ?? { bg: "bg-cream-200", text: "text-ink-700" };
  return (
    <span className={`chip ${s.bg} ${s.text}`}>
      <span className="mono">{difficulty}</span>
      <span className="opacity-70">/ 5 · {DIFFICULTY_LABEL[difficulty] ?? "?"}</span>
    </span>
  );
}
