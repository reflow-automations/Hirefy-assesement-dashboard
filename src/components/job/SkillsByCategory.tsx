import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { SkillWithCounts } from "@/lib/queries/skills";
import { cn } from "@/lib/cn";

export function SkillsByCategory({
  skills,
  jobId,
}: {
  skills: SkillWithCounts[];
  jobId: number;
}) {
  const generiek = skills.filter((s) => s.category === "Generiek");
  const sectorSpecifiek = skills.filter(
    (s) => s.category === "Sector-specifiek",
  );
  const uncategorized = skills.filter(
    (s) => s.category !== "Generiek" && s.category !== "Sector-specifiek",
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <SkillColumn
        label="Generiek"
        sub="Transversale competenties"
        accent="teal"
        skills={generiek}
        jobId={jobId}
      />
      <SkillColumn
        label="Sector-specifiek"
        sub="Domein-gebonden expertise"
        accent="terracotta"
        skills={sectorSpecifiek}
        jobId={jobId}
      />
      {uncategorized.length > 0 && (
        <SkillColumn
          label="Overig"
          sub="Niet gecategoriseerd"
          accent="neutral"
          skills={uncategorized}
          jobId={jobId}
        />
      )}
    </div>
  );
}

const ACCENT: Record<
  "teal" | "terracotta" | "neutral",
  { chipBg: string; chipText: string; dot: string; hoverBg: string }
> = {
  teal: {
    chipBg: "bg-teal-tint",
    chipText: "text-teal",
    dot: "bg-teal",
    hoverBg: "group-hover:bg-teal-tint",
  },
  terracotta: {
    chipBg: "bg-terracotta-tint",
    chipText: "text-terracotta",
    dot: "bg-terracotta",
    hoverBg: "group-hover:bg-terracotta-tint",
  },
  neutral: {
    chipBg: "bg-cream-200",
    chipText: "text-ink-800",
    dot: "bg-ink-500",
    hoverBg: "group-hover:bg-cream-200",
  },
};

function SkillColumn({
  label,
  sub,
  accent,
  skills,
  jobId,
}: {
  label: string;
  sub: string;
  accent: "teal" | "terracotta" | "neutral";
  skills: SkillWithCounts[];
  jobId: number;
}) {
  const a = ACCENT[accent];
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className={cn("chip", a.chipBg, a.chipText)}>
          <span className={cn("block h-1.5 w-1.5 rounded-full", a.dot)} />
          {label}
        </span>
        <span className="mono text-xs text-ink-500">
          {skills.length} · {sub}
        </span>
      </div>

      <ul className="space-y-2.5">
        {skills.map((s) => (
          <li key={s.id}>
            <Link
              href={`/jobs/${jobId}/skills/${s.id}`}
              className="group relative flex items-start gap-4 p-5 rounded-2xl bg-cream-100 border border-ink-200 hover:border-ink-300 hover:shadow-md transition-all"
            >
              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-40 pointer-events-none",
                  a.hoverBg,
                )}
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
