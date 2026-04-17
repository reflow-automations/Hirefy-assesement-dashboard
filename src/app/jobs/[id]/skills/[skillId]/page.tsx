import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Lock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { BloomDistribution } from "@/components/viz/BloomDistribution";
import { VariantSplit } from "@/components/skill/VariantSplit";
import { getJob } from "@/lib/queries/jobs";
import { getSkill } from "@/lib/queries/skills";
import { listQuestionsBySkill } from "@/lib/queries/questions";
import { humanizeTitle } from "@/lib/text";

export const revalidate = 3600;

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string; skillId: string }>;
}) {
  const { id, skillId } = await params;
  const jobId = Number(id);
  const skillIdNum = Number(skillId);
  if (Number.isNaN(jobId) || Number.isNaN(skillIdNum)) notFound();

  const [job, skill, questions] = await Promise.all([
    getJob(jobId),
    getSkill(skillIdNum),
    listQuestionsBySkill(skillIdNum),
  ]);

  if (!job || !skill || skill.job_id !== jobId) notFound();

  const typeCounts = questions.reduce(
    (acc, q) => ({ ...acc, [q.type]: (acc[q.type] ?? 0) + 1 }),
    {} as Record<string, number>,
  );

  const categoryAccent =
    skill.category === "Generiek"
      ? { chip: "bg-teal-tint text-teal", dot: "bg-teal" }
      : { chip: "bg-terracotta-tint text-terracotta", dot: "bg-terracotta" };

  return (
    <>
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="mesh-hero" />
        <Container size="wide" className="relative py-10 lg:py-16">
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-2 mono text-xs text-ink-700 hover:text-violet transition group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            {humanizeTitle(job.title)}
          </Link>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {skill.category && (
                <span className={`chip ${categoryAccent.chip}`}>
                  <span
                    className={`block h-1.5 w-1.5 rounded-full ${categoryAccent.dot}`}
                  />
                  {skill.category}
                </span>
              )}
              {skill.in_esco && (
                <span className="chip bg-violet-tint text-violet">
                  <Star className="h-3 w-3 fill-violet" />
                  ESCO-geregistreerd
                </span>
              )}
            </div>
            <h1 className="display text-ink-950 fade-up">{skill.name}</h1>
            {skill.relevance && (
              <p
                className="mt-6 text-xl text-ink-700 leading-relaxed fade-up max-w-3xl"
                style={{ animationDelay: "100ms" }}
              >
                {skill.relevance}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* OVERVIEW */}
      <section>
        <Container size="wide" className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl bg-cream-100 p-8 lg:p-10 space-y-10">
              <BloomDistribution questions={questions} />

              <div>
                <h3 className="mono text-[11px] uppercase tracking-[0.2em] text-ink-500 mb-4">
                  Vraagtypes
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <TypeStat
                    label="Kennis"
                    value={typeCounts["kennis"] ?? 0}
                    tint="bg-teal-tint"
                    text="text-teal"
                    dot="bg-teal"
                  />
                  <TypeStat
                    label="Situationeel"
                    value={typeCounts["situatie"] ?? 0}
                    tint="bg-ochre-tint"
                    text="text-ochre"
                    dot="bg-ochre"
                  />
                  <TypeStat
                    label="Casus"
                    value={typeCounts["casus"] ?? 0}
                    tint="bg-terracotta-tint"
                    text="text-terracotta"
                    dot="bg-terracotta"
                  />
                </div>
              </div>
            </div>

            {/* Schalen card */}
            <div className="rounded-3xl bg-gradient-to-br from-violet-tint via-cream-100 to-ochre-tint p-8 ring-1 ring-ink-200 relative overflow-hidden">
              <div className="mono text-[11px] uppercase tracking-[0.2em] text-violet mb-4 flex items-center gap-2">
                <span className="block h-1.5 w-1.5 rounded-full bg-violet" />
                Beoordelingsschalen
              </div>
              {skill.assessment_data ? (
                <pre className="mono text-xs text-ink-800 overflow-auto max-h-96">
                  {JSON.stringify(skill.assessment_data, null, 2)}
                </pre>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="h-4 w-4 text-ink-500" />
                    <span className="mono text-[10px] uppercase tracking-[0.15em] text-ink-500">
                      In ontwikkeling
                    </span>
                  </div>
                  <p className="text-ink-700 text-sm leading-relaxed mb-6">
                    Specifieke beoordelingsschalen — competentieniveaus,
                    prestatiecriteria en observeerbare gedragsankers — worden in
                    een volgende fase van de pipeline toegevoegd.
                  </p>
                  <div className="space-y-2">
                    {[
                      { l: "Beginner", pct: 20 },
                      { l: "Gevorderd", pct: 40 },
                      { l: "Competent", pct: 60 },
                      { l: "Bekwaam", pct: 80 },
                      { l: "Expert", pct: 100 },
                    ].map((lvl, i) => (
                      <div key={lvl.l} className="flex items-center gap-3">
                        <span
                          className="mono text-[10px] uppercase tracking-[0.1em] text-ink-700 w-20"
                          style={{ opacity: 0.4 + i * 0.12 }}
                        >
                          {lvl.l}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-cream-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-teal via-ochre to-terracotta"
                            style={{
                              width: `${lvl.pct}%`,
                              opacity: 0.3 + i * 0.15,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* QUESTIONS */}
      <section>
        <Container size="wide" className="py-12 lg:py-16">
          <div className="mb-10 max-w-3xl">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-ochre mb-3 inline-flex items-center gap-2">
              <span className="block h-1.5 w-1.5 rounded-full bg-ochre" />
              Assessment-inhoud
            </span>
            <h2 className="display text-ink-950">
              Vragen<span className="italic text-ochre">bank</span>
            </h2>
            <p className="text-ink-700 mt-5 text-lg leading-relaxed">
              Twee volledige varianten van 5 vragen (2× kennis, 2× situationeel,
              1× casus) — geschikt voor primaire afname en herkansing. Schakel
              tussen varianten of verberg de antwoorden om zelf te proberen.
            </p>
          </div>
          <VariantSplit questions={questions} />
        </Container>
      </section>
    </>
  );
}

function TypeStat({
  label,
  value,
  tint,
  text,
  dot,
}: {
  label: string;
  value: number;
  tint: string;
  text: string;
  dot: string;
}) {
  return (
    <div className={`rounded-2xl p-4 ${tint}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`block h-1.5 w-1.5 rounded-full ${dot}`} />
        <span className={`mono text-[10px] uppercase tracking-[0.15em] font-semibold ${text}`}>
          {label}
        </span>
      </div>
      <div className="display text-3xl text-ink-950 leading-none">{value}</div>
    </div>
  );
}
