import {
  BLOOM_COLOR_VAR,
  BLOOM_LABEL,
  BLOOM_ORDER,
  normalizeBloom,
} from "@/lib/bloom";
import type { Question, BloomLevel } from "@/lib/types";

export function BloomDistribution({ questions }: { questions: Question[] }) {
  const counts: Record<BloomLevel, number> = {
    onthouden: 0,
    begrijpen: 0,
    toepassen: 0,
    analyseren: 0,
    evalueren: 0,
    creeren: 0,
  };
  for (const q of questions) {
    const lvl = normalizeBloom(q.bloom_level);
    if (lvl) counts[lvl]++;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h3 className="mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
          Bloom-verdeling
        </h3>
        <span className="mono text-xs text-ink-500">{total} vragen</span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-3 overflow-hidden rounded-full bg-cream-100 ring-1 ring-ink-200">
        {BLOOM_ORDER.map((level) => {
          const pct = (counts[level] / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={level}
              style={{
                width: `${pct}%`,
                background: BLOOM_COLOR_VAR[level],
              }}
              title={`${BLOOM_LABEL[level]}: ${counts[level]}`}
              className="transition-all hover:brightness-110"
            />
          );
        })}
      </div>

      {/* Legend as colored tiles */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {BLOOM_ORDER.map((level, idx) => (
          <div
            key={level}
            className="rounded-xl p-3 ring-1 ring-ink-200 bg-cream-50 hover:ring-ink-300 transition"
          >
            <div
              className="mono text-[9px] uppercase tracking-[0.12em] font-semibold mb-1.5 inline-flex items-center gap-1.5"
              style={{ color: BLOOM_COLOR_VAR[level] }}
            >
              <span
                aria-hidden
                className="block h-1.5 w-1.5 rounded-full"
                style={{ background: BLOOM_COLOR_VAR[level] }}
              />
              B{idx + 1} · {BLOOM_LABEL[level]}
            </div>
            <div className="display text-2xl text-ink-950 leading-none">
              {counts[level]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
