import Link from "next/link";
import type { DashboardData } from "@/lib/queries/dashboard";
import type { UsageData, UsagePeriod } from "@/lib/queries/usage";
import { describeJobStatus } from "@/lib/job-status";

const number = new Intl.NumberFormat("nl-NL");
const money = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const preciseMoney = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "USD", minimumFractionDigits: 3, maximumFractionDigits: 3 });
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
          {jobs.map((job) => {
            const status = describeJobStatus({
              id: job.jobId,
              status: job.status,
              skillCount: job.skillCount,
              questionCount: job.questionCount,
            });
            return (
            <div key={job.jobId} className="grid gap-3 py-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:items-center">
              <div>
                <Link href={`/jobs/${job.jobId}`} className="font-medium text-ink-950 underline-offset-4 hover:underline">{job.title}</Link>
                <p className="mt-1 text-xs text-ink-600">Job {job.jobId} · {status.label}</p>
              </div>
              <div className="text-sm text-ink-800"><strong className="text-ink-950">{job.total}</strong> Learn-vragen</div>
              <div className="text-xs text-ink-700">Niveau 1-5: {[1, 2, 3, 4, 5].map((level) => job.levels[level as 1 | 2 | 3 | 4 | 5]).join(" / ")}</div>
              <div className="text-xs text-ink-700">{job.needsReview} vragen vragen aandacht · {job.smeApproved} vakinhoudelijk goedgekeurd</div>
              {status.explanation && <p className="text-sm leading-relaxed text-ink-700 lg:col-span-4">{status.explanation}</p>}
            </div>
          );})}
        </div>
      )}
      <p className="border-t border-ink-200 pt-4 text-xs leading-relaxed text-ink-600">Het niveau is de opgeslagen indeling, geen gemeten moeilijkheid. AI-validatie of een complete job betekent geen inhoudelijke kandidaatvrijgave.</p>
    </div>
  );
}

const periodOptions: { value: UsagePeriod; label: string }[] = [
  { value: "24h", label: "Laatste 24 uur" },
  { value: "7d", label: "Laatste 7 dagen" },
  { value: "30d", label: "Laatste 30 dagen" },
  { value: "90d", label: "Laatste 90 dagen" },
  { value: "all", label: "Alles" },
];

export function UsagePanel({ usage, period }: { usage: UsageData; period: UsagePeriod }) {
  if (!usage.available) {
    return <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200"><h3 className="display text-2xl text-ink-950">AI-gebruik</h3><p className="mt-3 text-sm text-ink-700">Kostenregistratie is momenteel niet beschikbaar. Er wordt geen nulbedrag getoond zolang de bron niet gelezen kan worden.</p></div>;
  }

  const rows = usage.rows.filter((row) => row.calls > 0);
  const last = rows.map((row) => row.lastRecordedAt).filter((value): value is string => Boolean(value)).sort().at(-1);
  const totalCalls = rows.reduce((sum, row) => sum + row.calls, 0);
  const totalEstimate = rows.reduce((sum, row) => sum + (row.estimatedUsd ?? 0), 0);
  const incomplete = rows.reduce((sum, row) => sum + row.incompleteCalls, 0);
  const unpriced = rows.reduce((sum, row) => sum + row.unpricedCalls, 0);
  const claude = usage.providers.find((provider) => provider.provider === "anthropic");
  const perplexity = usage.providers.find((provider) => provider.provider === "perplexity");

  return (
    <div className="rounded-3xl bg-cream-100 p-6 ring-1 ring-ink-200">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink-200 pb-5">
        <div><h3 className="display text-2xl text-ink-950">AI-gebruik</h3><p className="mt-2 text-sm text-ink-700">Geregistreerde calls voor de vragenpipeline, per aanbieder uitgesplitst.</p></div>
        <div className="text-right"><strong className="display text-3xl text-violet">{money.format(totalEstimate)}</strong><p className="text-xs text-ink-600">Gemengde kostenbasis, geen factuur</p></div>
      </div>
      <form action="/dashboard" method="get" className="flex flex-wrap items-end gap-3 py-4">
        <div className="flex flex-col gap-1"><label htmlFor="usage-period" className="text-sm font-medium text-ink-800">Kostenperiode</label><select id="usage-period" name="periode" defaultValue={period} className="rounded-lg bg-cream-50 px-3 py-2 text-sm text-ink-950 ring-1 ring-ink-200 focus:outline-2 focus:outline-violet">{periodOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        <button type="submit" className="rounded-lg bg-violet px-4 py-2 text-sm font-medium text-cream-50 focus:outline-2 focus:outline-offset-2 focus:outline-violet">Toon periode</button>
        <p className="w-full text-xs text-ink-600">Deze keuze verandert alleen het kostenoverzicht. De vragenbank hierboven toont de huidige voorraad.</p>
      </form>
      {rows.length === 0 ? <p className="border-t border-ink-200 py-5 text-sm text-ink-700">Geen modelcalls geregistreerd in deze periode. Dit zegt niets over calls die de collector niet kon vastleggen.</p> : <div className="grid gap-2 py-4 text-sm text-ink-800 sm:grid-cols-2"><span>{number.format(totalCalls)} calls geregistreerd</span><span>{last ? `Laatste registratie: ${date.format(new Date(last))}` : "Nog geen calls geregistreerd"}</span></div>}
      <div className="mb-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl bg-violet-tint p-4 text-ink-800"><strong className="block text-ink-950">Claude, lijstprijsschatting</strong>{claude ? <><span>{number.format(claude.calls)} calls · {money.format(claude.usd)}</span><small className="mt-1 block text-ink-600">{number.format(claude.inputTokens)} input · {number.format(claude.outputTokens)} output</small></> : "Geen calls geregistreerd"}</div>
        <div className="rounded-xl bg-teal-tint p-4 text-ink-800"><strong className="block text-ink-950">Perplexity, providerbedrag</strong>{perplexity ? <><span>{number.format(perplexity.calls)} calls · {preciseMoney.format(perplexity.usd)}</span><small className="mt-1 block text-ink-600">{number.format(perplexity.inputTokens)} input · {number.format(perplexity.outputTokens)} output</small></> : "Geen calls geregistreerd"}</div>
      </div>
      {rows.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-ink-200 text-xs text-ink-600"><tr><th className="py-2 font-medium">Beroep</th><th className="py-2 font-medium">Calls</th><th className="py-2 font-medium">Inputtokens</th><th className="py-2 font-medium">Outputtokens</th><th className="py-2 text-right font-medium">Bedrag</th></tr></thead><tbody>{rows.map((row) => <tr key={row.jobId ?? "unassigned"} className="border-b border-ink-200/60"><td className="py-3 pr-4">{row.jobId == null ? row.title : <Link href={`/jobs/${row.jobId}`} className="text-ink-950 underline-offset-4 hover:underline">{row.title}</Link>}</td><td>{number.format(row.calls)}</td><td>{row.inputTokens == null ? "Onbekend" : number.format(row.inputTokens)}</td><td>{row.outputTokens == null ? "Onbekend" : number.format(row.outputTokens)}</td><td className="text-right">{row.estimatedUsd == null ? "Onbekend" : money.format(row.estimatedUsd)}</td></tr>)}</tbody></table></div>}
      <p className="mt-5 border-t border-ink-200 pt-4 text-xs leading-relaxed text-ink-600">De totaalsom combineert Claude-lijstprijsschattingen met door Perplexity gemelde kosten. Dit is geen factuur of volledig runbedrag. {incomplete > 0 ? `${incomplete} calls missen de cache-uitsplitsing of andere usagegegevens. ` : ""}{unpriced > 0 ? `${unpriced} calls hebben geen prijs. ` : ""}De geannuleerde Deel-3-run van job 11 heeft geen bewaarde modelusage; interne providerpogingen kunnen ook ontbreken. Controleer de datum van de laatste registratie.</p>
    </div>
  );
}
