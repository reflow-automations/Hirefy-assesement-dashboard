import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { DashboardData } from "@/lib/queries/dashboard";
import type { ItemType } from "@/lib/types";

const ITEM_COLORS: Record<ItemType, string> = {
  MCQ:      "var(--teal)",
  SJT:      "var(--ochre)",
  Case:     "var(--terracotta)",
  Diagnose: "var(--violet)",
  BestAlt:  "var(--magenta)",
};
const ITEM_ORDER: ItemType[] = ["MCQ", "SJT", "Case", "Diagnose", "BestAlt"];

export function SkillsTable({
  skills,
}: {
  skills: DashboardData["skillsTable"];
}) {
  return (
    <div className="rounded-3xl bg-cream-100 ring-1 ring-ink-200 overflow-hidden">
      <div className="p-6 lg:p-8 border-b border-ink-200 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="chip bg-teal-tint text-teal mb-3">
            <span className="block h-1.5 w-1.5 rounded-full bg-teal" />
            Per-skill overzicht
          </span>
          <h3 className="display text-2xl text-ink-950 mt-2">
            Alle vaardigheden
          </h3>
          <p className="text-sm text-ink-500 mt-1">
            Gesorteerd op aantal vragen. Klik voor details.
          </p>
        </div>
        {/* Item type legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {ITEM_ORDER.map((type) => (
            <span
              key={type}
              className="mono text-[10px] uppercase tracking-[0.1em] flex items-center gap-1.5 text-ink-600"
            >
              <span
                aria-hidden
                className="block h-1.5 w-1.5 rounded-full"
                style={{ background: ITEM_COLORS[type] }}
              />
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-ink-500">
              <th className="text-left font-normal mono text-[10px] uppercase tracking-[0.18em] px-6 py-3">
                Skill
              </th>
              <th className="text-left font-normal mono text-[10px] uppercase tracking-[0.18em] px-3 py-3">
                Categorie
              </th>
              <th className="text-left font-normal mono text-[10px] uppercase tracking-[0.18em] px-3 py-3">
                ESCO
              </th>
              <th className="text-left font-normal mono text-[10px] uppercase tracking-[0.18em] px-3 py-3 min-w-[160px]">
                Item-types
              </th>
              <th className="text-right font-normal mono text-[10px] uppercase tracking-[0.18em] px-3 py-3">
                Ø Moeilijkheid
              </th>
              <th className="text-right font-normal mono text-[10px] uppercase tracking-[0.18em] px-3 py-3">
                Vragen
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {skills.map((s) => {
              const total = s.questionCount || 1;
              const hasItemTypes = ITEM_ORDER.some((t) => s.itemTypeCounts[t] > 0);
              return (
                <tr
                  key={s.id}
                  className="group border-b border-ink-200/60 last:border-b-0 hover:bg-cream-200/40 transition"
                >
                  <td className="px-6 py-4 text-ink-950 font-medium max-w-xs">
                    <Link
                      href={`/jobs/${s.jobId}/skills/${s.id}`}
                      className="hover:text-violet transition"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-3 py-4">
                    {s.category && (
                      <span
                        className={`chip ${
                          s.category === "Generiek"
                            ? "bg-teal-tint text-teal"
                            : "bg-terracotta-tint text-terracotta"
                        }`}
                      >
                        {s.category}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    {s.inEsco ? (
                      <span className="chip bg-violet-tint text-violet">
                        <Star className="h-2.5 w-2.5 fill-violet" />
                        Ja
                      </span>
                    ) : (
                      <span className="mono text-[10px] text-ink-500 uppercase tracking-widest">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    {hasItemTypes ? (
                      <div className="w-36">
                        {/* Proportional stacked bar */}
                        <div className="flex h-2 overflow-hidden rounded-full bg-cream-200">
                          {ITEM_ORDER.map((type) => {
                            const pct = (s.itemTypeCounts[type] / total) * 100;
                            return pct > 0 ? (
                              <div
                                key={type}
                                style={{ width: `${pct}%`, background: ITEM_COLORS[type] }}
                                title={`${type}: ${s.itemTypeCounts[type]}`}
                              />
                            ) : null;
                          })}
                        </div>
                      </div>
                    ) : (
                      <span className="mono text-[10px] text-ink-400 uppercase tracking-widest">
                        Fase 1
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-right mono text-ink-950">
                    {s.avgDifficulty !== null ? (
                      <span className="chip bg-cream-200 text-ink-700">
                        {s.avgDifficulty.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-ink-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-right mono text-ink-950">
                    {s.questionCount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/jobs/${s.jobId}/skills/${s.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cream-200 text-ink-700 hover:bg-ink-950 hover:text-cream-50 transition"
                      aria-label={`Bekijk ${s.name}`}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
