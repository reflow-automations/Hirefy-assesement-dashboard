import Link from "next/link";
import { HorizontalBar } from "@/components/viz/HorizontalBar";
import { ProgressRing } from "@/components/viz/ProgressRing";
import { ESCO_COLOR_VAR, ESCO_LABEL } from "@/lib/esco";
import type { EscoType } from "@/lib/types";
import type { DashboardData } from "@/lib/queries/dashboard";

export function EscoPanel({
  escoTypeCounts,
  escoPercentage,
  escoSkills,
  totalSkills,
  nonEscoSkills,
}: {
  escoTypeCounts: DashboardData["escoTypeCounts"];
  escoPercentage: number;
  escoSkills: number;
  totalSkills: number;
  nonEscoSkills: DashboardData["nonEscoSkills"];
}) {
  const types: EscoType[] = ["core", "knowledge", "tool"];
  const rows = types.map((t) => ({
    label: ESCO_LABEL[t],
    value: escoTypeCounts[t],
    color: ESCO_COLOR_VAR[t],
  }));

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr_1fr]">
      {/* ESCO type breakdown */}
      <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200">
        <span className="chip bg-terracotta-tint text-terracotta mb-3">
          <span className="block h-1.5 w-1.5 rounded-full bg-terracotta" />
          ESCO-typen
        </span>
        <h3 className="display text-xl text-ink-950 mt-2 mb-6">
          Verdeling vaardigheidstypen
        </h3>
        <HorizontalBar rows={rows} />
      </div>

      {/* Coverage ring */}
      <div className="rounded-3xl bg-gradient-to-br from-violet-tint via-cream-100 to-terracotta-tint p-6 ring-1 ring-ink-200 flex flex-col items-center justify-center text-center">
        <span className="chip bg-violet-tint text-violet mb-4">
          <span className="block h-1.5 w-1.5 rounded-full bg-violet" />
          ESCO-dekking
        </span>
        <ProgressRing
          value={escoPercentage}
          size={180}
          thickness={16}
          color="var(--violet)"
          centerValue={`${escoPercentage}%`}
          centerLabel="in ESCO"
        />
        <p className="mt-5 text-sm text-ink-700 max-w-xs">
          <strong className="text-ink-950">{escoSkills}</strong> van{" "}
          <strong className="text-ink-950">{totalSkills}</strong> skills bestaat
          al in de Europese ESCO-taxonomie.
        </p>
      </div>

      {/* Non-ESCO list */}
      <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200">
        <span className="chip bg-ochre-tint text-ochre mb-3">
          <span className="block h-1.5 w-1.5 rounded-full bg-ochre" />
          Buiten ESCO
        </span>
        <h3 className="display text-xl text-ink-950 mt-2 mb-1">
          Opkomende skills
        </h3>
        <p className="text-xs text-ink-500 mb-5">
          Vaardigheden die ESCO (nog) niet registreert — meestal nieuwere of
          sector-specifieke expertise.
        </p>
        {nonEscoSkills.length === 0 ? (
          <p className="text-sm text-ink-500 italic">Alle skills in ESCO.</p>
        ) : (
          <ul className="space-y-1.5 max-h-72 overflow-y-auto">
            {nonEscoSkills.slice(0, 12).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/jobs/${s.jobId}/skills/${s.id}`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-cream-200 transition group"
                >
                  <span className="text-sm text-ink-800 truncate">
                    {s.name}
                  </span>
                  <span className="mono text-[10px] uppercase tracking-[0.15em] text-ochre opacity-0 group-hover:opacity-100 transition shrink-0 ml-2">
                    bekijk →
                  </span>
                </Link>
              </li>
            ))}
            {nonEscoSkills.length > 12 && (
              <li className="text-xs text-ink-500 text-center pt-2 mono uppercase tracking-widest">
                +{nonEscoSkills.length - 12} meer
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
