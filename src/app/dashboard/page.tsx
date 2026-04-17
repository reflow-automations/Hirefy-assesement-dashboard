import { Container } from "@/components/layout/Container";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { BloomPanel } from "@/components/dashboard/BloomPanel";
import {
  AuditPanel,
  CategoryPanel,
  TypeCompositionPanel,
} from "@/components/dashboard/CompositionPanels";
import { EscoPanel } from "@/components/dashboard/EscoPanel";
import { QualityPanel } from "@/components/dashboard/QualityPanel";
import { SkillsTable } from "@/components/dashboard/SkillsTable";
import { VariantParity } from "@/components/dashboard/VariantParity";
import { getDashboardData } from "@/lib/queries/dashboard";
import { BarChart3 } from "lucide-react";

export const revalidate = 3600;

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mesh-hero" />
        <Container size="wide" className="relative py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal via-violet to-terracotta shadow-md">
              <BarChart3 className="h-5 w-5 text-cream-50" strokeWidth={2} />
            </span>
            <span className="chip bg-violet-tint text-violet">
              <span className="block h-1.5 w-1.5 rounded-full bg-violet animate-pulse" />
              Dashboard · live data
            </span>
          </div>
          <h1 className="display text-ink-950 max-w-3xl fade-up">
            Overzicht <span className="italic text-violet">&amp;</span> inzicht.
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg text-ink-700 leading-relaxed fade-up"
            style={{ animationDelay: "100ms" }}
          >
            Alle cijfers achter de catalogus op één plek — pipeline-samenstelling,
            ESCO-dekking, kwaliteitsindicatoren, en per-skill diepte.
          </p>
        </Container>
      </section>

      {/* HERO STATS */}
      <section>
        <Container size="wide" className="py-2 lg:py-4">
          <HeroStats data={data.totals} />
        </Container>
      </section>

      {/* BLOOM OVERVIEW */}
      <section>
        <Container size="wide" className="py-10 lg:py-14">
          <div className="mb-8">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-magenta mb-3 inline-flex items-center gap-2">
              <span className="block h-1.5 w-1.5 rounded-full bg-magenta" />
              Sectie 01 · Pipeline-samenstelling
            </span>
            <h2 className="display text-ink-950">Hoe de vragen opgebouwd zijn</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_3fr]">
            <BloomPanel bloomCounts={data.bloomCounts} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <TypeCompositionPanel typeCounts={data.typeCounts} />
              <CategoryPanel categoryCounts={data.categoryCounts} />
              <AuditPanel auditCounts={data.auditCounts} />
            </div>
          </div>
        </Container>
      </section>

      {/* ESCO */}
      <section>
        <Container size="wide" className="py-10 lg:py-14">
          <div className="mb-8">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-terracotta mb-3 inline-flex items-center gap-2">
              <span className="block h-1.5 w-1.5 rounded-full bg-terracotta" />
              Sectie 02 · Europese taxonomie
            </span>
            <h2 className="display text-ink-950">
              ESCO-<span className="italic text-terracotta">dekking</span>
            </h2>
          </div>
          <EscoPanel
            escoTypeCounts={data.escoTypeCounts}
            escoPercentage={data.totals.escoPercentage}
            escoSkills={data.totals.escoSkills}
            totalSkills={data.totals.skills}
            nonEscoSkills={data.nonEscoSkills}
          />
        </Container>
      </section>

      {/* QUALITY */}
      <section>
        <Container size="wide" className="py-10 lg:py-14">
          <div className="mb-8">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-ochre mb-3 inline-flex items-center gap-2">
              <span className="block h-1.5 w-1.5 rounded-full bg-ochre" />
              Sectie 03 · Inhoudskwaliteit
            </span>
            <h2 className="display text-ink-950">
              Lengte <span className="italic text-ochre">&amp;</span> parity
            </h2>
          </div>
          <QualityPanel
            content={data.content}
            totalQuestions={data.totals.questions}
          />
        </Container>
      </section>

      {/* VARIANT PARITY */}
      <section>
        <Container size="wide" className="py-10 lg:py-14">
          <div className="mb-8">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-teal mb-3 inline-flex items-center gap-2">
              <span className="block h-1.5 w-1.5 rounded-full bg-teal" />
              Sectie 04 · Variant-balans
            </span>
            <h2 className="display text-ink-950">
              A <span className="italic text-teal">·</span> B pariteit
            </h2>
          </div>
          <VariantParity
            parity={data.variantParity}
            variantCounts={data.variantCounts}
          />
        </Container>
      </section>

      {/* SKILLS TABLE */}
      <section>
        <Container size="wide" className="py-10 lg:py-14">
          <div className="mb-8">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-violet mb-3 inline-flex items-center gap-2">
              <span className="block h-1.5 w-1.5 rounded-full bg-violet" />
              Sectie 05 · Skills-overzicht
            </span>
            <h2 className="display text-ink-950">
              Alle <span className="italic text-violet">vaardigheden</span>
            </h2>
          </div>
          <SkillsTable skills={data.skillsTable} />
        </Container>
      </section>
    </>
  );
}
