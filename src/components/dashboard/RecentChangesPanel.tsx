import Link from "next/link";
import type { DashboardData } from "@/lib/queries/dashboard";
import type { UsageData } from "@/lib/queries/usage";

const number = new Intl.NumberFormat("nl-NL");
const money = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const date = new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Amsterdam" });

export function LearnPanel({ jobs }: { jobs: DashboardData["learnByJob"] }) {
  const total = jobs.reduce((sum, job) => sum + job.total, 0);

  return (
    <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink-200 pb-5">
        <div>
          <h3 className="display text-2xl text-ink-950">Leervermogen</h3>
          <p className="mt-2 text-sm text-ink-700">Apart vragenblok per beroep, verdeeld over niveau 1 t/m 5 en varianten A/B.</p>
        </div>
        <strong className="display text-3xl text-learn">{number.format(total)} vragen</strong>
      </div>
      {jobs.length === 0 ? (
        <p className="py-6 text-sm text-ink-700">Er zijn nog geen leerbaarheidsvragen geregistreerd.</p>
      ) : (
        <div className="divide-y divide-ink-200">
          {jobs.map((job) => (
            <div key={job.jobId} className="grid gap-3 py-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:items-center">
              <div>
                <Link href={`/jobs/${job.jobId}`} className="font-medium text-ink-950 underline-offset-4 hover:underline">{job.title}</Link>
                <p className="mt-1 text-xs text-ink-500">Job {job.jobId} · status {job.status ?? "onbekend"}</p>
              </div>
              <div className="text-sm text-ink-800"><strong className="text-ink-950">{job.total}</strong> Learn-vragen</div>
              <div className="text-xs text-ink-700">Niveau 1-5: {[1, 2, 3, 4, 5].map((level) => job.levels[level as 1 | 2 | 3 | 4 | 5]).join(" / ")}</div>
              <div className="text-xs text-ink-700">{job.needsReview} in review · {job.smeApproved} SME-goedgekeurd</div>
            </div>
          ))}
        </div>
      )}
      <p className="border-t border-ink-200 pt-4 text-xs leading-relaxed text-ink-600">Het niveau is de opgeslagen indeling, geen gemeten moeilijkheid. AI-validatie of een complete job betekent geen inhoudelijke kandidaatvrijgave.</p>
    </div>
  );
}

export function UsagePanel({ usage }: { usage: UsageData }) {
  if (!usage.available) {
    return <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200"><h3 className="display text-2xl text-ink-950">Claude-gebruik</h3><p className="mt-3 text-sm text-ink-700">Kostenregistratie is momenteel niet beschikbaar. Er wordt geen nulbedrag getoond zolang de bron niet gelezen kan worden.</p></div>;
  }

  const rows = usage.rows.filter((row) => row.calls > 0);
  const last = rows.map((row) => row.lastRecordedAt).filter((value): value is string => Boolean(value)).sort().at(-1);
  const totalCalls = rows.reduce((sum, row) => sum + row.calls, 0);
  const totalEstimate = rows.reduce((sum, row) => sum + (row.estimatedUsd ?? 0), 0);
  const incomplete = rows.reduce((sum, row) => sum + row.incompleteCalls, 0);
  const unpriced = rows.reduce((sum, row) => sum + row.unpricedCalls, 0);

  return (
    <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink-200 pb-5">
        <div><h3 className="display text-2xl text-ink-950">Claude-gebruik</h3><p className="mt-2 text-sm text-ink-700">Geregistreerde Claude-calls voor de vragenpipeline. Perplexity is nog niet opgenomen.</p></div>
        <div className="text-right"><strong className="display text-3xl text-violet">{money.format(totalEstimate)}</strong><p className="text-xs text-ink-600">Schatting over geregistreerde calls</p></div>
      </div>
      <div className="grid gap-2 py-4 text-sm text-ink-800 sm:grid-cols-2"><span>{number.format(totalCalls)} calls geregistreerd</span><span>{last ? `Laatste registratie: ${date.format(new Date(last))}` : "Nog geen calls geregistreerd"}</span></div>
      {rows.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-ink-200 text-xs text-ink-600"><tr><th className="py-2 font-medium">Beroep</th><th className="py-2 font-medium">Calls</th><th className="py-2 font-medium">Inputtokens</th><th className="py-2 font-medium">Outputtokens</th><th className="py-2 text-right font-medium">Geschat</th></tr></thead><tbody>{rows.map((row) => <tr key={row.jobId} className="border-b border-ink-200/60"><td className="py-3 pr-4"><Link href={`/jobs/${row.jobId}`} className="text-ink-950 underline-offset-4 hover:underline">{row.title}</Link></td><td>{number.format(row.calls)}</td><td>{row.inputTokens == null ? "Onbekend" : number.format(row.inputTokens)}</td><td>{row.outputTokens == null ? "Onbekend" : number.format(row.outputTokens)}</td><td className="text-right">{row.estimatedUsd == null ? "Onbekend" : money.format(row.estimatedUsd)}</td></tr>)}</tbody></table></div>}
      <p className="mt-5 border-t border-ink-200 pt-4 text-xs leading-relaxed text-ink-600">Dit bedrag omvat alleen geregistreerde Claude-calls, geen Perplexity, en is geen factuur of compleet runbedrag. {incomplete > 0 ? `${incomplete} calls missen de cache-uitsplitsing of andere usagegegevens. ` : ""}{unpriced > 0 ? `${unpriced} calls hebben geen prijs. ` : ""}Interne providerpogingen kunnen ontbreken. Controleer de datum van de laatste registratie.</p>
    </div>
  );
}
