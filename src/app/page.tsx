import { Container } from "@/components/layout/Container";
import { JobsGrid } from "@/components/catalog/JobsGrid";
import { StatsStrip } from "@/components/catalog/StatsStrip";
import { listJobs } from "@/lib/queries/jobs";
import { getStats } from "@/lib/queries/stats";
import { Search, ArrowDown } from "lucide-react";

export const revalidate = 3600;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sector?: string }>;
}) {
  const { q, sector } = await searchParams;
  const [jobs, stats] = await Promise.all([
    listJobs({ query: q, sector }),
    getStats(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mesh-hero">
          <span />
        </div>
        <Container size="wide" className="relative py-20 lg:py-28">
          <div className="max-w-5xl">
            <div className="fade-up flex items-center gap-3 mb-8">
              <span className="chip bg-violet-tint text-violet">
                <span className="block h-1.5 w-1.5 rounded-full bg-violet animate-pulse" />
                Catalogus · 2026
              </span>
              <span className="mono text-xs text-ink-500">
                v2026.1 · {stats.jobs} beroepen · {stats.questions} vragen
              </span>
            </div>

            <h1 className="display text-ink-950 fade-up" style={{ animationDelay: "80ms" }}>
              Een bibliotheek
              <br />
              van{" "}
              <span className="italic text-terracotta relative inline-block">
                skill-based
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  className="absolute -bottom-2 left-0 w-full h-3 text-ochre"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6 Q 75 1, 150 6 T 298 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              assessments.
            </h1>

            <p
              className="mt-10 max-w-2xl text-lg lg:text-xl text-ink-700 leading-relaxed fade-up"
              style={{ animationDelay: "160ms" }}
            >
              Elke assessment begint bij de Europese{" "}
              <strong className="text-teal font-semibold">ESCO-taxonomie</strong>, wordt
              verrijkt met <strong className="text-terracotta font-semibold">marktinzicht
              2026</strong> en uitgewerkt via <strong className="text-violet font-semibold">Bloom&apos;s
              taxonomy</strong> — van feitenkennis tot casusredenering.
            </p>

            {/* Search */}
            <form
              className="mt-10 flex items-stretch gap-0 max-w-xl fade-up"
              style={{ animationDelay: "240ms" }}
            >
              <label className="sr-only" htmlFor="q">
                Zoek een beroep
              </label>
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-500 pointer-events-none" />
                <input
                  id="q"
                  name="q"
                  defaultValue={q}
                  placeholder="Zoek een beroep, skill of sector…"
                  className="w-full h-14 pl-14 pr-4 rounded-l-full bg-cream-100 border border-ink-200 border-r-0 text-ink-950 placeholder:text-ink-400 focus:outline-none focus:border-violet focus:bg-cream-50 transition"
                />
              </div>
              <button
                type="submit"
                className="mono px-7 h-14 rounded-r-full bg-ink-950 text-cream-50 text-xs uppercase tracking-[0.15em] hover:bg-violet transition-colors"
              >
                Zoeken
              </button>
            </form>

            {/* Scroll indicator */}
            <div
              className="mt-16 flex items-center gap-3 fade-up"
              style={{ animationDelay: "320ms" }}
            >
              <ArrowDown className="h-4 w-4 text-ink-500 animate-bounce" />
              <span className="mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
                Verken de catalogus
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* STATS */}
      <section>
        <Container size="wide" className="py-12">
          <StatsStrip stats={stats} />
        </Container>
      </section>

      {/* CATALOG */}
      <section>
        <Container size="wide" className="py-12 lg:py-20">
          <div className="mb-10 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <span className="mono text-[11px] uppercase tracking-[0.2em] text-violet mb-3 block">
                · Bibliotheek
              </span>
              <h2 className="display text-ink-950">Beroepen</h2>
            </div>
            <span className="mono text-xs text-ink-500">
              {jobs.length} {jobs.length === 1 ? "resultaat" : "resultaten"}
              {q ? ` voor "${q}"` : ""}
            </span>
          </div>
          <JobsGrid jobs={jobs} />
        </Container>
      </section>
    </>
  );
}
