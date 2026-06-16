import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { SkillWithCounts } from "@/lib/queries/skills";

export function SkillsList({
  skills,
  jobId,
}: {
  skills: SkillWithCounts[];
  jobId: number;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="chip bg-teal-tint text-teal">
          <span className="block h-1.5 w-1.5 rounded-full bg-teal" />
          Vaardigheden
        </span>
        <span className="mono text-xs text-ink-500">{skills.length} skills</span>
      </div>

      <ul className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
        {skills.map((s) => (
          <li key={s.id}>
            <Link
              href={`/jobs/${jobId}/skills/${s.id}`}
              className="group relative flex items-start gap-4 p-5 rounded-2xl bg-cream-100 border border-ink-200 hover:border-ink-300 hover:shadow-md transition-all"
            >
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-40 pointer-events-none group-hover:bg-teal-tint"
              />

              <div className="relative min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {s.in_esco && (
                    <span className="chip bg-violet-tint text-violet">
                      <Star className="h-2.5 w-2.5 fill-violet" />
                      ESCO
                    </span>
                  )}
                  <span className="mono text-[10px] text-ink-500 uppercase tracking-widest">
                    {s.question_count} vragen
                  </span>
                </div>
                <h4 className="text-ink-950 font-semibold leading-tight text-base lg:text-lg">
                  {s.name}
                </h4>
                {s.relevance && (
                  <p className="text-sm text-ink-700 mt-2 line-clamp-2 leading-relaxed">
                    {s.relevance}
                  </p>
                )}
              </div>

              <ArrowRight className="relative mt-1 h-5 w-5 shrink-0 text-ink-400 transition-all group-hover:text-ink-950 group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
