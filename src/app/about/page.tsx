import { Container } from "@/components/layout/Container";
import { ESCO_COLOR_VAR, ESCO_DESCRIPTION, ESCO_LABEL } from "@/lib/esco";
import type { EscoType } from "@/lib/types";

const PIPELINE = [
  {
    n: "01",
    title: "Beroep & ESCO",
    body: "Input is een beroepstitel; de pipeline fetcht de officiële ESCO-taxonomie (kerncompetenties, kennis, gereedschappen) als startpunt.",
    accent: "terracotta",
  },
  {
    n: "02",
    title: "Marktonderzoek 2026",
    body: "Een tweede agent verrijkt de skills met actueel marktinzicht — welke vaardigheden zijn in 2026 onmisbaar voor dit beroep in Nederland?",
    accent: "ochre",
  },
  {
    n: "03",
    title: "Vraaggeneratie",
    body: "Per skill genereert een Senior Assessment Architect-agent 10 vragen (5 variant A + 5 variant B) verdeeld over 5 item-types: MCQ, SJT, Case, Diagnose en BestAlt — elk met een vaste cognitieve diepte.",
    accent: "teal",
  },
  {
    n: "04",
    title: "Auditcontrole",
    body: "Elke vraag doorloopt een tweede beoordelingsronde op distractor-kwaliteit, antwoordlengte-parity, scoring-regels en variant-balans.",
    accent: "violet",
  },
] as const;

const ACCENTS = {
  terracotta: { bg: "bg-terracotta-tint", text: "text-terracotta", dot: "bg-terracotta" },
  ochre: { bg: "bg-ochre-tint", text: "text-ochre", dot: "bg-ochre" },
  teal: { bg: "bg-teal-tint", text: "text-teal", dot: "bg-teal" },
  violet: { bg: "bg-violet-tint", text: "text-violet", dot: "bg-violet" },
};

const ESCO_TYPES: EscoType[] = ["core", "knowledge", "tool"];

// Item type taxonomy (Fase 2)
const ITEM_TYPES = [
  {
    key: "MCQ",
    label: "Multiple Choice",
    short: "MCQ",
    color: "var(--teal)",
    difficulty: "1–2",
    description:
      "Klassieke meerkeuzevraag met 4 opties en één correct antwoord. Test feitenkennis en begrip op het laagste cognitieve niveau. Snel te beantwoorden; geschikt als anker in de vraagset.",
  },
  {
    key: "SJT",
    label: "Situational Judgement",
    short: "SJT",
    color: "var(--ochre)",
    difficulty: "2–3",
    description:
      "Kandidaten kiezen de meest passende reactie op een werkscenario. Antwoorden zijn gewogen (0–100%) — er is niet één 'fout' antwoord, maar één optimale keuze. Meet professioneel oordeel.",
  },
  {
    key: "Case",
    label: "Casus",
    short: "Case",
    color: "var(--terracotta)",
    difficulty: "4",
    description:
      "Langer scenario met context-rijke informatie. De kandidaat moet analyse en synthese toepassen om tot een verantwoorde beslissing te komen. Typisch 2-3× langer dan een MCQ.",
  },
  {
    key: "Diagnose",
    label: "Diagnose",
    short: "Diagnose",
    color: "var(--violet)",
    difficulty: "3",
    description:
      "Vijf opties, waarvan er exact twee correct zijn. Partial-credit scoring: beide goed = 1 punt, één goed = 0.5 punt. Test analytisch denken en het herkennen van meervoudige oorzaken.",
  },
  {
    key: "BestAlt",
    label: "Best Alternative",
    short: "BestAlt",
    color: "var(--magenta)",
    difficulty: "5",
    description:
      "Alle vier opties zijn plausibel, maar één is duidelijk superieur. Gewogen scoring op basis van relatieve kwaliteit. Het hoogste cognitieve niveau: evalueren en creëren.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mesh-hero" />
        <Container size="default" className="relative py-16 lg:py-24">
          <div className="max-w-3xl">
            <span className="chip bg-ochre-tint text-ochre">
              <span className="block h-1.5 w-1.5 rounded-full bg-ochre" />
              Methodiek
            </span>
            <h1 className="display text-ink-950 mt-6 fade-up">
              Hoe een assessment{" "}
              <span className="italic text-ochre">tot stand komt.</span>
            </h1>
            <p
              className="text-ink-700 mt-8 text-xl leading-relaxed fade-up"
              style={{ animationDelay: "100ms" }}
            >
              Elke Hirefy-assessment is het product van een zorgvuldige pipeline
              die vier bronnen combineert: de Europese taxonomie, actueel
              marktonderzoek, vijf psychometrische item-types, en een audit-slag.
            </p>
          </div>
        </Container>
      </section>

      {/* PIPELINE */}
      <section>
        <Container size="default" className="py-12 lg:py-20">
          <h2 className="display text-ink-950 mb-10">De pipeline</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PIPELINE.map((p) => {
              const a = ACCENTS[p.accent];
              return (
                <div
                  key={p.n}
                  className={`relative overflow-hidden rounded-2xl ${a.bg} p-6 ring-1 ring-ink-200 hover:shadow-md transition-all hover:-translate-y-1`}
                >
                  <div className={`mono text-sm font-semibold mb-4 ${a.text}`}>
                    {p.n}
                  </div>
                  <h3 className="display text-xl text-ink-950 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ESCO */}
      <section>
        <Container size="default" className="py-12 lg:py-16">
          <div className="max-w-3xl mb-12">
            <span className="chip bg-terracotta-tint text-terracotta mb-4">
              <span className="block h-1.5 w-1.5 rounded-full bg-terracotta" />
              Europese taxonomie
            </span>
            <h2 className="display text-ink-950">ESCO</h2>
            <p className="text-ink-700 mt-5 text-lg leading-relaxed">
              ESCO (European Skills, Competences, Qualifications and
              Occupations) is de meertalige standaard van de Europese Commissie.
              Elk beroep is opgesplitst in drie typen vaardigheden:
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {ESCO_TYPES.map((t) => (
              <div
                key={t}
                className="rounded-2xl bg-cream-100 p-6 ring-1 ring-ink-200 hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-40"
                  style={{ background: ESCO_COLOR_VAR[t] }}
                />
                <div className="relative">
                  <div
                    className="mono text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 flex items-center gap-2"
                    style={{ color: ESCO_COLOR_VAR[t] }}
                  >
                    <span
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{ background: ESCO_COLOR_VAR[t] }}
                    />
                    {t}
                  </div>
                  <h3 className="display text-2xl text-ink-950 mb-3">
                    {ESCO_LABEL[t]}
                  </h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    {ESCO_DESCRIPTION[t]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ITEM TYPES */}
      <section>
        <Container size="default" className="py-12 lg:py-16">
          <div className="max-w-3xl mb-12">
            <span className="chip bg-violet-tint text-violet mb-4">
              <span className="block h-1.5 w-1.5 rounded-full bg-violet" />
              Psychometrisch design
            </span>
            <h2 className="display text-ink-950">
              Vijf <span className="italic text-violet">item-types</span>
            </h2>
            <p className="text-ink-700 mt-5 text-lg leading-relaxed">
              Elke skill bevat precies 10 vragen — 5 per variant — verdeeld over
              vijf item-types met oplopende cognitieve diepte. Zo meet één
              assessment zowel feitenkennis (MCQ) als professioneel oordeel
              (BestAlt):
            </p>
          </div>

          <ol className="space-y-3">
            {ITEM_TYPES.map((item, i) => (
              <li
                key={item.key}
                className="flex gap-6 items-start p-6 rounded-2xl bg-cream-100 ring-1 ring-ink-200 hover:shadow-md transition-all relative overflow-hidden group"
              >
                <div
                  aria-hidden
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-2"
                  style={{ background: item.color }}
                />
                <div
                  className="display text-5xl leading-none w-14 shrink-0 font-normal"
                  style={{ color: item.color }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="display text-2xl text-ink-950">
                      {item.label}
                    </h3>
                    <span
                      className="mono text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded"
                      style={{
                        color: item.color,
                        background: `color-mix(in srgb, ${item.color} 12%, transparent)`,
                      }}
                    >
                      {item.short}
                    </span>
                  </div>
                  <p className="text-ink-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-500 pt-3 shrink-0">
                  Niveau {item.difficulty}
                </span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* VARIANTS */}
      <section>
        <Container size="default" className="py-12 lg:py-20">
          <div className="rounded-3xl bg-gradient-to-br from-teal-tint via-cream-100 to-violet-tint p-8 lg:p-12 ring-1 ring-ink-200">
            <div className="max-w-2xl">
              <span className="chip bg-teal-tint text-teal mb-4">
                <span className="block h-1.5 w-1.5 rounded-full bg-teal" />
                Variant A · B
              </span>
              <h2 className="display text-ink-950">Waarom twee varianten?</h2>
              <p className="text-ink-700 mt-5 text-lg leading-relaxed">
                Elke skill heeft twee gelijkwaardige vraagsets (variant A en B)
                van even moeilijk kaliber. Zo kunnen kandidaten bij herkansing
                met een andere set getoetst worden, zonder dat de
                moeilijkheidsgraad wijzigt. Handig voor eerlijke selectie en een
                vergelijkbare benchmark.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
