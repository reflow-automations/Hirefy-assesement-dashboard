import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { parseHierarchical } from "@/lib/text";
import type { Job } from "@/lib/types";

export function SectorCrumbs({ job }: { job: Job }) {
  const sector = parseHierarchical(job.sector);
  const sub = parseHierarchical(job.sub_sector);
  const family = parseHierarchical(job.job_family);

  const steps = [
    { code: sector.code, label: sector.label },
    { code: sub.code, label: sub.label },
    { code: family.code, label: family.label },
  ].filter((s) => s.label);

  return (
    <nav
      aria-label="Sector hiërarchie"
      className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs"
    >
      <Link
        href="/"
        className="chip bg-cream-100 text-ink-700 hover:bg-cream-200 transition"
      >
        Catalogus
      </Link>
      {steps.map((s, i) => (
        <span key={i} className="flex items-center gap-2">
          <ChevronRight className="h-3 w-3 text-ink-400" />
          <span className="chip bg-cream-100 text-ink-700">
            {s.code && <span className="text-ink-500">{s.code}</span>}
            <span>{s.label}</span>
          </span>
        </span>
      ))}
    </nav>
  );
}
