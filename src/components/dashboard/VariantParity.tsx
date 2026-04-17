import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { DashboardData } from "@/lib/queries/dashboard";

export function VariantParity({
  parity,
  variantCounts,
}: {
  parity: DashboardData["variantParity"];
  variantCounts: DashboardData["variantCounts"];
}) {
  const mismatched = parity.filter((p) => p.a !== p.b);
  const total = variantCounts.A + variantCounts.B || 1;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
      {/* Summary */}
      <div className="rounded-3xl bg-cream-100 p-8 ring-1 ring-ink-200 flex flex-col">
        <span className="chip bg-teal-tint text-teal mb-3">
          <span className="block h-1.5 w-1.5 rounded-full bg-teal" />
          A · B parity
        </span>
        <h3 className="display text-2xl text-ink-950 mt-2 mb-4">
          Variant-balans
        </h3>
        <p className="text-sm text-ink-700 mb-6 leading-relaxed">
          Elke skill zou evenveel variant-A als variant-B vragen moeten hebben.
          Afwijkingen wijzen op een generatiefout.
        </p>

        {/* A vs B bar */}
        <div>
          <div className="flex h-14 overflow-hidden rounded-2xl">
            <div
              className="flex items-center justify-center bg-ink-950 text-cream-50 mono text-sm font-semibold transition-all"
              style={{
                width: `${(variantCounts.A / total) * 100}%`,
              }}
            >
              A · {variantCounts.A}
            </div>
            <div
              className="flex items-center justify-center bg-violet text-cream-50 mono text-sm font-semibold transition-all"
              style={{
                width: `${(variantCounts.B / total) * 100}%`,
              }}
            >
              B · {variantCounts.B}
            </div>
          </div>
          <p className="mt-4 text-xs text-ink-500 mono uppercase tracking-[0.18em]">
            Totaal: {total} vragen
          </p>
        </div>

        <div
          className={`mt-auto pt-6 flex items-center gap-3 rounded-2xl border-l-4 p-4 ${
            mismatched.length === 0
              ? "bg-success-tint border-success"
              : "bg-error-tint border-error"
          }`}
        >
          {mismatched.length === 0 ? (
            <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-error shrink-0" />
          )}
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] font-semibold text-ink-800">
              {mismatched.length === 0 ? "Perfect gebalanceerd" : "Afwijking gedetecteerd"}
            </div>
            <div className="text-xs text-ink-700 mt-0.5">
              {mismatched.length === 0
                ? "Alle skills hebben A=B"
                : `${mismatched.length} skills met ongelijke variants`}
            </div>
          </div>
        </div>
      </div>

      {/* Per-skill list */}
      <div className="rounded-3xl bg-cream-100 p-6 lg:p-8 ring-1 ring-ink-200">
        <h3 className="mono text-[10px] uppercase tracking-[0.2em] text-ink-500 mb-5">
          Per skill — A &nbsp;·&nbsp; B
        </h3>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
          {parity.map((p) => {
            const balanced = p.a === p.b;
            return (
              <div
                key={p.skillId}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  balanced ? "" : "bg-error-tint/60"
                }`}
              >
                <span className="text-xs text-ink-800 truncate flex-1">
                  {p.skillName}
                </span>
                <span className="mono text-xs text-ink-600 shrink-0">
                  <span className={balanced ? "text-ink-800" : "text-error font-semibold"}>
                    {p.a}
                  </span>
                  <span className="opacity-40 mx-1">·</span>
                  <span className={balanced ? "text-ink-800" : "text-error font-semibold"}>
                    {p.b}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
