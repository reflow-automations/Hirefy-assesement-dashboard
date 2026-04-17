import { Donut } from "@/components/viz/Donut";
import type { DashboardData } from "@/lib/queries/dashboard";

export function TypeCompositionPanel({
  typeCounts,
}: {
  typeCounts: DashboardData["typeCounts"];
}) {
  const total =
    typeCounts.kennis + typeCounts.situatie + typeCounts.casus || 1;
  const segments = [
    { label: "Kennis", value: typeCounts.kennis, color: "var(--teal)" },
    { label: "Situationeel", value: typeCounts.situatie, color: "var(--ochre)" },
    { label: "Casus", value: typeCounts.casus, color: "var(--terracotta)" },
  ];

  return (
    <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200 flex flex-col">
      <div className="mb-4">
        <span className="chip bg-teal-tint text-teal mb-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-teal" />
          Vraagtypes
        </span>
        <h3 className="display text-xl text-ink-950 mt-2">Verdeling</h3>
      </div>
      <div className="flex items-center justify-center py-4">
        <Donut
          segments={segments}
          size={160}
          thickness={20}
          centerValue={total}
          centerLabel="Vragen"
        />
      </div>
      <ul className="mt-auto space-y-2 pt-4 border-t border-ink-200">
        {segments.map((s) => (
          <li
            key={s.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2 text-ink-800">
              <span
                aria-hidden
                className="block h-2 w-2 rounded-full"
                style={{ background: s.color }}
              />
              {s.label}
            </span>
            <span className="mono text-xs text-ink-500">
              {s.value} · {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoryPanel({
  categoryCounts,
}: {
  categoryCounts: DashboardData["categoryCounts"];
}) {
  const total =
    categoryCounts.generiek +
      categoryCounts.sectorSpecifiek +
      categoryCounts.other || 1;

  const segments = [
    { label: "Generiek", value: categoryCounts.generiek, color: "var(--teal)" },
    {
      label: "Sector-specifiek",
      value: categoryCounts.sectorSpecifiek,
      color: "var(--terracotta)",
    },
    {
      label: "Overig",
      value: categoryCounts.other,
      color: "var(--ink-400)",
    },
  ].filter((s) => s.value > 0);

  return (
    <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200 flex flex-col">
      <div className="mb-4">
        <span className="chip bg-terracotta-tint text-terracotta mb-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-terracotta" />
          Skill-categorie
        </span>
        <h3 className="display text-xl text-ink-950 mt-2">Samenstelling</h3>
      </div>
      <div className="flex items-center justify-center py-4">
        <Donut
          segments={segments}
          size={160}
          thickness={20}
          centerValue={total}
          centerLabel="Skills"
        />
      </div>
      <ul className="mt-auto space-y-2 pt-4 border-t border-ink-200">
        {segments.map((s) => (
          <li
            key={s.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2 text-ink-800">
              <span
                aria-hidden
                className="block h-2 w-2 rounded-full"
                style={{ background: s.color }}
              />
              {s.label}
            </span>
            <span className="mono text-xs text-ink-500">
              {s.value} · {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AuditPanel({
  auditCounts,
}: {
  auditCounts: DashboardData["auditCounts"];
}) {
  const entries = Object.entries(auditCounts);
  const total = entries.reduce((a, [, v]) => a + v, 0) || 1;

  const statusColor: Record<string, string> = {
    pending: "var(--ochre)",
    approved: "var(--success)",
    rejected: "var(--error)",
    unknown: "var(--ink-400)",
  };

  const segments = entries.map(([key, value]) => ({
    label: capitalize(key),
    value,
    color: statusColor[key] ?? "var(--ink-400)",
  }));

  return (
    <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200 flex flex-col">
      <div className="mb-4">
        <span className="chip bg-ochre-tint text-ochre mb-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-ochre" />
          Pipeline-audit
        </span>
        <h3 className="display text-xl text-ink-950 mt-2">Status</h3>
      </div>
      <div className="flex items-center justify-center py-4">
        <Donut
          segments={segments}
          size={160}
          thickness={20}
          centerValue={total}
          centerLabel="Vragen"
        />
      </div>
      <ul className="mt-auto space-y-2 pt-4 border-t border-ink-200">
        {segments.map((s) => (
          <li
            key={s.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2 text-ink-800">
              <span
                aria-hidden
                className="block h-2 w-2 rounded-full"
                style={{ background: s.color }}
              />
              {s.label}
            </span>
            <span className="mono text-xs text-ink-500">
              {s.value} · {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
