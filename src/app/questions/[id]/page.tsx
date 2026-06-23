import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { DemoQuestionEditable } from "@/components/question/DemoQuestionEditable";
import {
  getQuestion,
  getSiblingVariantQuestion,
} from "@/lib/queries/questions";
import { getSkill } from "@/lib/queries/skills";
import { getJob } from "@/lib/queries/jobs";
import { humanizeTitle } from "@/lib/text";

export const revalidate = 3600;

export default async function QuestionDemoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const qid = Number(id);
  if (Number.isNaN(qid)) notFound();

  const question = await getQuestion(qid);
  if (!question) notFound();

  const [skill, sibling] = await Promise.all([
    getSkill(question.skill_id),
    getSiblingVariantQuestion({
      skill_id: question.skill_id,
      variant: question.variant,
      question_number: question.question_number,
    }),
  ]);
  const job = skill ? await getJob(skill.job_id) : null;

  return (
    <section className="relative">
      <div className="mesh-hero" />
      <Container size="narrow" className="relative py-10 lg:py-16">
        {/* Breadcrumb */}
        <nav className="mb-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <Link
            href="/"
            className="mono uppercase tracking-[0.15em] text-ink-500 hover:text-violet transition"
          >
            Catalogus
          </Link>
          {job && (
            <>
              <span className="text-ink-400">/</span>
              <Link
                href={`/jobs/${job.id}`}
                className="text-ink-700 hover:text-violet transition"
              >
                {humanizeTitle(job.title)}
              </Link>
            </>
          )}
          {skill && job && (
            <>
              <span className="text-ink-400">/</span>
              <Link
                href={`/jobs/${job.id}/skills/${skill.id}`}
                className="text-ink-700 hover:text-violet transition"
              >
                {skill.name}
              </Link>
            </>
          )}
        </nav>

        <Link
          href={
            job && skill ? `/jobs/${job.id}/skills/${skill.id}` : "/"
          }
          className="inline-flex items-center gap-2 mono text-xs text-ink-700 hover:text-violet transition group mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Terug naar vaardigheid
        </Link>

        <div className="mb-10">
          <span className="chip bg-violet-tint text-violet">
            <span className="block h-1.5 w-1.5 rounded-full bg-violet animate-pulse" />
            Demo-modus
          </span>
          <h1 className="display text-ink-950 mt-4">
            Probeer de{" "}
            <span className="italic text-violet">vraag.</span>
          </h1>
          <p className="text-ink-700 mt-5 text-lg leading-relaxed">
            Kies een antwoord en onthul de uitleg. Zo ervaar je direct hoe de
            assessment voelt vanuit kandidaat-perspectief.
          </p>
        </div>

        <div className="rounded-3xl bg-cream-100 p-8 lg:p-12 ring-1 ring-ink-200 shadow-[0_18px_36px_-8px_rgba(42,33,26,0.08)]">
          <DemoQuestionEditable
            question={question}
            siblingHref={sibling ? `/questions/${sibling.id}` : null}
          />
        </div>
      </Container>
    </section>
  );
}
