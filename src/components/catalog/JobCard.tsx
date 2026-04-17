import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { JobListItem } from "@/lib/queries/jobs";
import { parseHierarchical, humanizeTitle } from "@/lib/text";

const SECTOR_ACCENTS: Record<string, { bg: string; tint: string; text: string }> = {
  "1": { bg: "bg-violet", tint: "bg-violet-tint", text: "text-violet" },
  "2": { bg: "bg-terracotta", tint: "bg-terracotta-tint", text: "text-terracotta" },
  "3": { bg: "bg-teal", tint: "bg-teal-tint", text: "text-teal" },
  "4": { bg: "bg-ochre", tint: "bg-ochre-tint", text: "text-ochre" },
  "5": { bg: "bg-magenta", tint: "bg-magenta-tint", text: "text-magenta" },
};

function getSectorAccent(sector: string | null) {
  if (!sector) return SECTOR_ACCENTS["2"];
  const code = sector.match(/^(\d)/)?.[1];
  return code && SECTOR_ACCENTS[code] ? SECTOR_ACCENTS[code] : SECTOR_ACCENTS["2"];
}

export function JobCard({ job, featured = false }: { job: JobListItem; featured?: boolean }) {
  const sector = parseHierarchical(job.sector);
  const accent = getSectorAccent(job.sector);
  const escoPct =
    job.skill_count > 0
      ? Math.round((job.esco_count / job.skill_count) * 100)
      : 0;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-cream-100 border border-ink-200 hover:border-ink-300 transition-all hover:shadow-[0_18px_36px_-8px_rgba(42,33,26,0.12)] hover:-translate-y-1 ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {/* Colored top band */}
      <div className={`h-1.5 ${accent.bg}`} />

      {/* Decorative tint blob */}
      <div
        aria-hidden
        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${accent.tint} blur-2xl opacity-60 transition-all duration-500 group-hover:scale-150 group-hover:opacity-80`}
      />

      <div className="relative flex flex-1 flex-col p-6 lg:p-8">
        {/* Sector chip */}
        <div className="flex items-center justify-between gap-4">
          <span
            className={`chip ${accent.tint} ${accent.text}`}
            style={{ borderRadius: 999 }}
          >
            <span className={`block h-1.5 w-1.5 rounded-full ${accent.bg}`} />
            {sector.label || "Beroep"}
          </span>
          {featured && (
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-violet flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Uitgelicht
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={`display ${
            featured ? "text-4xl lg:text-5xl" : "text-2xl lg:text-3xl"
          } text-ink-950 leading-[1.05] mt-6`}
        >
          {humanizeTitle(job.title)}
        </h3>

        {/* Market insight */}
        {job.market_insight && (
          <p
            className={`mt-4 text-ink-700 leading-relaxed ${
              featured ? "text-base line-clamp-4" : "text-sm line-clamp-3"
            }`}
          >
            {job.market_insight}
          </p>
        )}

        {/* Stats row */}
        <div className="mt-auto pt-8">
          <div className="flex items-end justify-between gap-4">
            <div className="flex gap-5">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-1.5">
                  Skills
                </div>
                <div className="display text-3xl text-ink-950 leading-none">
                  {job.skill_count}
                </div>
              </div>
              <div className="w-px bg-ink-200" />
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-1.5">
                  ESCO
                </div>
                <div className="display text-3xl text-ink-950 leading-none">
                  {escoPct}
                  <span className="mono text-base text-ink-500 ml-0.5">%</span>
                </div>
              </div>
            </div>

            <span
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${accent.tint} ${accent.text} transition-all group-hover:${accent.bg.replace(
                "bg-",
                "",
              )} group-hover:bg-ink-950 group-hover:text-cream-50 group-hover:rotate-45`}
            >
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
