import { HorizontalBar } from "@/components/viz/HorizontalBar";
import { BLOOM_COLOR_VAR, BLOOM_LABEL, BLOOM_ORDER } from "@/lib/bloom";
import type { DashboardData } from "@/lib/queries/dashboard";

export function BloomPanel({
  bloomCounts,
}: {
  bloomCounts: DashboardData["bloomCounts"];
}) {
  const total = Object.values(bloomCounts).reduce((a, b) => a + b, 0) || 1;
  const rows = BLOOM_ORDER.map((level) => ({
    label: BLOOM_LABEL[level],
    value: bloomCounts[level],
    color: BLOOM_COLOR_VAR[level],
    suffix: ` · ${Math.round((bloomCounts[level] / total) * 100)}%`,
  }));

  return (
    <div className="rounded-3xl bg-cream-100 p-8 ring-1 ring-ink-200">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <span className="chip bg-magenta-tint text-magenta mb-3">
            <span className="block h-1.5 w-1.5 rounded-full bg-magenta" />
            Cognitieve niveaus
          </span>
          <h3 className="display text-2xl text-ink-950 mt-2">
            Bloom-verdeling
          </h3>
          <p className="text-sm text-ink-700 mt-1">
            Over alle {total} vragen, gegroepeerd per bloom-level.
          </p>
        </div>
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-500 pt-1 hidden sm:block">
          100% = {total}
        </div>
      </div>
      <HorizontalBar rows={rows} />
    </div>
  );
}
