import { Donut } from "@/components/viz/Donut";
import type { DashboardData } from "@/lib/queries/dashboard";

// ── Type Composition ─────────────────────────────────────────────────────────

export function TypeCompositionPanel({
  typeCounts,
  itemTypeCounts,
}: {
  typeCounts: DashboardData["typeCounts"];
  itemTypeCounts: DashboardData["itemTypeCounts"];
}) {
  const totalItems =
    itemTypeCounts.MCQ +
    itemTypeCounts.SJT +
    itemTypeCounts.Case +
    itemTypeCounts.Diagnose +
    itemTypeCounts.BestAlt;
  const totalLegacy = typeCounts.kennis + typeCounts.situatie + typeCounts.casus;

  // Show Fase 2 item types if any are populated
  const useFase2 = totalItems > 0;
  const total = useFase2 ? totalItems || 1 : totalLegacy || 1;

  const segments = useFase2
    ? [
        { label: "MCQ",      value: itemTypeCounts.MCQ,      color: "var(--teal)" },
        { label: "SJT",      value: itemTypeCounts.SJT,      color: "var(--ochre)" },
        { label: "Case",     value: itemTypeCounts.Case,     color: "var(--terracotta)" },
        { label: "Diagnose", value: itemTypeCounts.Diagnose, color: "var(--violet)" },
        { label: "Best Alt", value: itemTypeCounts.BestAlt,  color: "var(--magenta)" },
      ]
    : [
        { label: "Kennis",      value: typeCounts.kennis,   color: "var(--teal)" },
        { label: "Situationeel",value: typeCounts.situatie, color: "var(--ochre)" },
        { label: "Casus",       value: typeCounts.casus,    color: "var(--terracotta)" },
      ];

  return (
    <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200 flex flex-col">
      <div className="mb-4">
        <span className="chip bg-teal-tint text-teal mb-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-teal" />
          {useFase2 ? "Item-types (Fase 2)" : "Vraagtypes"}
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
          <li key={s.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-800">
              <span aria-hidden className="block h-2 w-2 rounded-full" style={{ background: s.color }} />
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

// ── Audit Panel ───────────────────────────────────────────────────────────────

export function AuditPanel({
  auditCounts,
}: {
  auditCounts: DashboardData["auditCounts"];
}) {
  const entries = Object.entries(auditCounts);
  const total = entries.reduce((a, [, v]) => a + v, 0) || 1;

  const statusColor: Record<string, string> = {
    pending:  "var(--ochre)",
    approved: "var(--success)",
    rejected: "var(--error)",
    unknown:  "var(--ink-400)",
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
        <Donut segments={segments} size={160} thickness={20} centerValue={total} centerLabel="Vragen" />
      </div>
      <ul className="mt-auto space-y-2 pt-4 border-t border-ink-200">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-800">
              <span aria-hidden className="block h-2 w-2 rounded-full" style={{ background: s.color }} />
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

// ── Review Status Panel (Fase 2) ─────────────────────────────────────────────

const REVIEW_LABEL: Record<string, string> = {
  pending:          "Nog te valideren",
  ai_validated:     "AI gevalideerd",
  needs_review:     "Handmatig review",
  sme_approved:     "SME goedgekeurd",
  sme_rejected:     "SME afgewezen",
  generation_failed:"Generatie fout",
  unknown:          "Onbekend",
};
const REVIEW_COLOR: Record<string, string> = {
  pending:          "var(--violet)",
  ai_validated:     "var(--teal)",
  needs_review:     "var(--ochre)",
  sme_approved:     "var(--success)",
  sme_rejected:     "var(--error)",
  generation_failed:"var(--magenta)",
  unknown:          "var(--ink-400)",
};

export function ReviewStatusPanel({
  reviewStatusCounts,
}: {
  reviewStatusCounts: DashboardData["reviewStatusCounts"];
}) {
  const entries = Object.entries(reviewStatusCounts).filter(([, v]) => v > 0);
  const total = entries.reduce((a, [, v]) => a + v, 0) || 1;

  const segments = entries.map(([key, value]) => ({
    label: REVIEW_LABEL[key] ?? key,
    value,
    color: REVIEW_COLOR[key] ?? "var(--ink-400)",
  }));

  return (
    <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200 flex flex-col">
      <div className="mb-4">
        <span className="chip bg-violet-tint text-violet mb-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-violet" />
          Review-workflow
        </span>
        <h3 className="display text-xl text-ink-950 mt-2">Review status</h3>
      </div>
      <div className="flex items-center justify-center py-4">
        <Donut segments={segments} size={160} thickness={20} centerValue={total} centerLabel="Vragen" />
      </div>
      <ul className="mt-auto space-y-2 pt-4 border-t border-ink-200">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-800">
              <span aria-hidden className="block h-2 w-2 rounded-full" style={{ background: s.color }} />
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
