import { JobCard } from "./JobCard";
import type { JobListItem } from "@/lib/queries/jobs";

export function JobsGrid({ jobs }: { jobs: JobListItem[] }) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-ink-300 bg-cream-100/50 p-16 text-center">
        <p className="display text-2xl text-ink-800">
          Geen beroepen gevonden
        </p>
        <p className="mt-2 text-ink-500">
          Probeer een andere zoekterm of filter.
        </p>
      </div>
    );
  }

  // Bento: first card featured (spans 2×2 on md+), rest normal
  return (
    <div className="stagger grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[minmax(280px,auto)]">
      {jobs.map((job, i) => (
        <JobCard key={job.id} job={job} featured={i === 0 && jobs.length > 2} />
      ))}
    </div>
  );
}
