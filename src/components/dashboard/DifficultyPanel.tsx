import { HorizontalBar } from "@/components/viz/HorizontalBar";
import type { DashboardData } from "@/lib/queries/dashboard";

const DIFFICULTY_CONFIG = [
  { level: 1 as const, label: "MCQ · Basis",         color: "var(--teal)" },
  { level: 2 as const, label: "SJT · Licht",          color: "var(--teal)" },
  { level: 3 as const, label: "Diagnose · Middel",    color: "var(--ochre)" },
  { level: 4 as const, label: "Case · Zwaar",         color: "var(--terracotta)" },
  { level: 5 as const, label: "Best Alt. · Expert",   color: "var(--magenta)" },
];

export function DifficultyPanel({
  difficultyDistribution,
}: {
  difficultyDistribution: DashboardData["difficultyDistribution"];
}) {
  const total = Object.values(difficultyDistribution).reduce((a, b) => a + b, 0) || 1;
  const hasData = total > 0 && Object.values(difficultyDistribution).some((v) => v > 0);

  const rows = DIFFICULTY_CONFIG.map(({ level, label, color }) => ({
    label,
    value: difficultyDistribution[level],
    color,
    suffix: ` · ${Math.round((difficultyDistribution[level] / total) * 100)}%`,
  }));

  return (
    <div className="rounded-3xl bg-cream-100 p-8 ring-1 ring-ink-200">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <span className="chip bg-terracotta-tint text-terracotta mb-3">
            <span className="block h-1.5 w-1.5 rounded-full bg-terracotta" />
            Cognitieve diepte
          </span>
          <h3 className="display text-2xl text-ink-950 mt-2">
            Moeilijkheidsverdeling
          </h3>
          <p className="text-sm text-ink-700 mt-1">
            Item-type bepaalt moeilijkheid — van basis MCQ (1) tot expert BestAlt (5).
          </p>
        </div>
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-500 pt-1 hidden sm:block">
          100% = {total}
        </div>
      </div>

      {hasData ? (
        <HorizontalBar rows={rows} />
      ) : (
        <div className="space-y-3">
          {DIFFICULTY_CONFIG.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="text-sm text-ink-600 w-40 shrink-0">{label}</span>
              <div className="flex-1 h-2 rounded-full bg-cream-200 overflow-hidden">
                <div
                  className="h-full w-0 rounded-full transition-all"
                  style={{ background: color }}
                />
              </div>
              <span className="mono text-xs text-ink-400 w-10 text-right">—</span>
            </div>
          ))}
          <p className="mono text-[10px] uppercase tracking-[0.15em] text-ink-400 pt-2">
            Wordt gevuld na Fase 2 pipeline run
          </p>
        </div>
      )}
    </div>
  );
}
