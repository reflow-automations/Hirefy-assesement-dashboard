import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { SectorCrumbs } from "@/components/job/SectorCrumbs";
import { MarketInsight } from "@/components/job/MarketInsight";
import { EscoBrowser } from "@/components/job/EscoBrowser";
import { SkillsByCategory } from "@/components/job/SkillsByCategory";
import { getJob, safeEsco } from "@/lib/queries/jobs";
import { listSkillsByJob } from "@/lib/queries/skills";
import { humanizeTitle } from "@/lib/text";
import { MetricTile } from "@/components/viz/MetricTile";

export const revalidate = 3600;

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jobId = Number(id);
  if (Number.isNaN(jobId)) notFound();

  const [job, skills] = await Promise.all([
    getJob(jobId),
    listSkillsByJob(jobId),
  ]);

  if (!job) notFound();
  const esco = safeEsco(job.esco_raw_data);
  const questionTotal = skills.reduce((a, s) => a + s.question_count, 0);

  return (
    <>
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="mesh-hero" />
        <Container size="wide" className="relative py-12 lg:py-20">
          <SectorCrumbs job={job} />
          <h1 className="display text-ink-950 mt-8 fade-up max-w-4xl">
            {humanizeTitle(job.title)}
          </h1>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <MetricTile label="Skills" value={skills.length} accent="teal" />
            <MetricTile label="Vragen" value={questionTotal} accent="ochre" />
            <MetricTile label="ESCO-items" value={esco.length} accent="terracotta" />
            <MetricTile
              label="Status"
              value={job.status?.replace(/_/g, " ") ?? "—"}
              accent="violet"
            />
          </div>
        </Container>
      </section>

      {/* MARKET */}
      {job.market_insight && (
        <section>
          <Container size="wide" className="py-12">
            <MarketInsight insight={job.market_insight} />
          </Container>
        </section>
      )}

      {/* ESCO */}
      {esco.length > 0 && (
        <section>
          <Container size="wide" className="py-12 lg:py-20">
            <div className="mb-10 max-w-3xl">
              <span className="mono text-[11px] uppercase tracking-[0.2em] text-violet mb-3 inline-flex items-center gap-2">
                <span className="block h-1.5 w-1.5 rounded-full bg-violet" />
                Europese taxonomie
              </span>
              <h2 className="display text-ink-950">
                Het vakgebied{" "}
                <span className="italic text-teal">volgens ESCO</span>
              </h2>
              <p className="text-ink-700 mt-5 text-lg leading-relaxed">
                De Europese Skills, Competences, Qualifications and Occupations
                database definieert dit beroep via drie lagen: kerncompetenties,
                theoretische kennis, en concrete gereedschappen.
              </p>
            </div>
            <EscoBrowser entries={esco} />
          </Container>
        </section>
      )}

      {/* SKILLS */}
      <section>
        <Container size="wide" className="py-12 lg:py-20">
          <div className="mb-10 max-w-3xl">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-terracotta mb-3 inline-flex items-center gap-2">
              <span className="block h-1.5 w-1.5 rounded-full bg-terracotta" />
              Assessment-opbouw
            </span>
            <h2 className="display text-ink-950">
              Vaardigheden &amp;{" "}
              <span className="italic text-terracotta">schalen</span>
            </h2>
            <p className="text-ink-700 mt-5 text-lg leading-relaxed">
              Elke vaardigheid is uitgewerkt in 10 vragen (5 primaire, 5
              alternatieve) verdeeld over Bloom-niveaus. Klik een vaardigheid
              voor de detail-breakdown.
            </p>
          </div>
          <SkillsByCategory skills={skills} jobId={job.id} />
        </Container>
      </section>
    </>
  );
}
