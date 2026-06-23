import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { getJob } from "@/lib/queries/jobs";
import { listSkillsByJob } from "@/lib/queries/skills";
import { listQuestionsByJob } from "@/lib/queries/questions";
import { humanizeTitle } from "@/lib/text";

export const revalidate = 3600;

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jobId = Number(id);
  if (Number.isNaN(jobId)) notFound();

  const [job, skills, questions] = await Promise.all([
    getJob(jobId),
    listSkillsByJob(jobId),
    listQuestionsByJob(jobId),
  ]);
  if (!job) notFound();

  const skillNames: Record<number, string> = {};
  for (const s of skills) skillNames[s.id] = s.name;

  return (
    <section className="relative">
      <div className="mesh-hero" />
      <Container size="narrow" className="relative py-10 lg:py-16">
        <Link
          href={`/jobs/${job.id}`}
          className="mb-8 inline-flex items-center gap-2 mono text-xs text-ink-700 hover:text-violet transition group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          {humanizeTitle(job.title)}
        </Link>

        <div className="mb-8">
          <span className="chip bg-violet-tint text-violet">
            <span className="block h-1.5 w-1.5 rounded-full bg-violet animate-pulse" />
            Quiz-modus
          </span>
          <h1 className="display text-ink-950 mt-4">
            Controleer de <span className="italic text-violet">vragen.</span>
          </h1>
          <p className="text-ink-700 mt-4 text-lg leading-relaxed">
            Loop door alle vragen van dit beroep. Klik een antwoord en zie meteen
            of het goed of fout is, inclusief de toelichting.
          </p>
        </div>

        <QuizRunner
          questions={questions}
          jobTitle={humanizeTitle(job.title)}
          jobId={job.id}
          skillNames={skillNames}
        />
      </Container>
    </section>
  );
}
