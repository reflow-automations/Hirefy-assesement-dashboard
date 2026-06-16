import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Lock } from "lucide-react";
import { Container } from "@/components/layout/Container";
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

  // Use item_type when available (Fase 2), fall back to legacy type
  const typeCounts = questions.reduce(
    (acc, q) => {
      const key = q.item_type ?? q.type;
      return { ...acc, [key]: (acc[key] ?? 0) + 1 };
    },
    {} as Record<string, number>,
  );
  const hasItemTypes = questions.some((q) => q.item_type);

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
              {skill.in_esco && (
                <span className="chip bg-violet-tint text-violet">
                  <Star className="h-3 w-3 fill-violet" />
                  ESCO-geregistreerd
                </span>
              )}
            </div>
            <h1 className="display text-ink-950 fade-up">{skill.name}</h1>
            {skill.description && (
              <p
                className="mt-4 text-base text-ink-600 leading-relaxed fade-up max-w-2xl font-medium"
                style={{ animationDelay: "80ms" }}
              >
                {skill.description}
              </p>
            )}
            {skill.relevance && (
              <p
                className="mt-4 text-xl text-ink-700 leading-relaxed fade-up max-w-3xl"
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
              <ItemTypeDistribution questions={questions} hasItemTypes={hasItemTypes} />

              <div>
                <h3 className="mono text-[11px] uppercase tracking-[0.2em] text-ink-500 mb-4">
                  Vraagtypes
                </h3>
                {hasItemTypes ? (
                  // Fase 2: 5 item types
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                    <TypeStat label="MCQ"      value={typeCounts["MCQ"] ?? 0}      tint="bg-teal-tint"       text="text-teal"       dot="bg-teal" />
                    <TypeStat label="SJT"      value={typeCounts["SJT"] ?? 0}      tint="bg-ochre-tint"      text="text-ochre"      dot="bg-ochre" />
                    <TypeStat label="Casus"    value={typeCounts["Case"] ?? 0}     tint="bg-terracotta-tint" text="text-terracotta" dot="bg-terracotta" />
                    <TypeStat label="Diagnose" value={typeCounts["Diagnose"] ?? 0} tint="bg-violet-tint"     text="text-violet"     dot="bg-violet" />
                    <TypeStat label="Best Alt" value={typeCounts["BestAlt"] ?? 0}  tint="bg-magenta-tint"    text="text-magenta"    dot="bg-magenta" />
                  </div>
                ) : (
                  // Fase 1: legacy 3 types
                  <div className="grid grid-cols-3 gap-3">
                    <TypeStat label="Kennis"      value={typeCounts["kennis"] ?? 0}   tint="bg-teal-tint"       text="text-teal"       dot="bg-teal" />
                    <TypeStat label="Situationeel" value={typeCounts["situatie"] ?? 0} tint="bg-ochre-tint"      text="text-ochre"      dot="bg-ochre" />
                    <TypeStat label="Casus"        value={typeCounts["casus"] ?? 0}   tint="bg-terracotta-tint" text="text-terracotta" dot="bg-terracotta" />
                  </div>
                )}
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
              {hasItemTypes
                ? "Twee volledige varianten van 5 vragen (1× MCQ, 1× SJT, 1× Casus, 1× Diagnose, 1× Best Alt.) — elke variant dekt alle cognitieve niveaus en vraagformaten. Schakel tussen varianten of probeer het zelf."
                : "Twee volledige varianten van 5 vragen (2× kennis, 2× situationeel, 1× casus) — geschikt voor primaire afname en herkansing. Schakel tussen varianten of verberg de antwoorden om zelf te proberen."}
            </p>
          </div>
          <VariantSplit questions={questions} />
        </Container>
      </section>
    </>
  );
}

// ── Item Type Distribution ────────────────────────────────────────────────────

const ITEM_SEGMENTS = [
  { key: "MCQ",      label: "MCQ",      color: "var(--teal)" },
  { key: "SJT",      label: "SJT",      color: "var(--ochre)" },
  { key: "Case",     label: "Case",     color: "var(--terracotta)" },
  { key: "Diagnose", label: "Diagnose", color: "var(--violet)" },
  { key: "BestAlt",  label: "Best Alt", color: "var(--magenta)" },
];

const LEGACY_SEGMENTS = [
  { key: "kennis",   label: "Kennis",       color: "var(--teal)" },
  { key: "situatie", label: "Situationeel", color: "var(--ochre)" },
  { key: "casus",    label: "Casus",        color: "var(--terracotta)" },
];

import type { Question } from "@/lib/types";

function ItemTypeDistribution({
  questions,
  hasItemTypes,
}: {
  questions: Question[];
  hasItemTypes: boolean;
}) {
  const counts: Record<string, number> = {};
  for (const q of questions) {
    const key = q.item_type ?? q.type;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  const total = questions.length || 1;
  const segments = hasItemTypes ? ITEM_SEGMENTS : LEGACY_SEGMENTS;
  const diffCounts: Record<number, number> = {};
  for (const q of questions) {
    if (q.difficulty) diffCounts[q.difficulty] = (diffCounts[q.difficulty] ?? 0) + 1;
  }
  const hasDifficulty = Object.keys(diffCounts).length > 0;

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <h3 className="mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
          {hasItemTypes ? "Item-types" : "Vraagtypes"}
        </h3>
        <span className="mono text-xs text-ink-500">{questions.length} vragen</span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-3 overflow-hidden rounded-full bg-cream-200 ring-1 ring-ink-200">
        {segments.map(({ key, color }) => {
          const pct = ((counts[key] ?? 0) / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={key}
              style={{ width: `${pct}%`, background: color }}
              className="transition-all hover:brightness-110"
            />
          );
        })}
      </div>

      {/* Counts grid */}
      <div className={`grid gap-2 ${hasItemTypes ? "grid-cols-5" : "grid-cols-3"}`}>
        {segments.map(({ key, label, color }) => (
          <div key={key} className="rounded-xl p-3 ring-1 ring-ink-200 bg-cream-50">
            <div
              className="mono text-[9px] uppercase tracking-[0.12em] font-semibold mb-1.5 flex items-center gap-1"
              style={{ color }}
            >
              <span className="block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
              {label}
            </div>
            <div className="display text-2xl text-ink-950 leading-none">
              {counts[key] ?? 0}
            </div>
          </div>
        ))}
      </div>

      {/* Difficulty bar (Fase 2 only) */}
      {hasDifficulty && (
        <div className="pt-4 border-t border-ink-200">
          <div className="mono text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-3">
            Moeilijkheid (1–5)
          </div>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-cream-200">
            {[1, 2, 3, 4, 5].map((d) => {
              const pct = ((diffCounts[d] ?? 0) / total) * 100;
              const colors = ["var(--teal)","var(--teal)","var(--ochre)","var(--terracotta)","var(--magenta)"];
              return pct > 0 ? (
                <div key={d} style={{ width: `${pct}%`, background: colors[d - 1] }} />
              ) : null;
            })}
          </div>
          <div className="flex justify-between mono text-[9px] text-ink-400 mt-1.5 uppercase tracking-[0.1em]">
            <span>Basis</span><span>Expert</span>
          </div>
        </div>
      )}
    </div>
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
