import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface UsageRow {
  jobId: number | null;
  title: string;
  calls: number;
  inputTokens: number | null;
  outputTokens: number | null;
  estimatedUsd: number | null;
  incompleteCalls: number;
  unpricedCalls: number;
  firstRecordedAt: string | null;
  lastRecordedAt: string | null;
}

export interface UsageProvider {
  provider: string;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  usd: number;
}

export type UsageData =
  | { available: false }
  | { available: true; rows: UsageRow[]; providers: UsageProvider[] };

export const USAGE_PERIODS = ["24h", "7d", "30d", "90d", "all"] as const;
export type UsagePeriod = (typeof USAGE_PERIODS)[number];

export function parseUsagePeriod(value: string | string[] | undefined): UsagePeriod {
  return typeof value === "string" && USAGE_PERIODS.includes(value as UsagePeriod)
    ? value as UsagePeriod
    : "30d";
}

const PERIOD_MS: Record<Exclude<UsagePeriod, "all">, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
};

export async function getUsageData(period: UsagePeriod): Promise<UsageData> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { available: false };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("job_model_costs")
    .select("job_id,title")
    .order("job_id", { ascending: false });

  if (error) {
    console.error("Hirefy usage view unavailable:", error.code);
    return { available: false };
  }

  // The view is all-time. Aggregate protected call rows after the date filter,
  // so every displayed count, token total and amount covers the same period.
  const titles = new Map((data ?? []).map((job) => [Number(job.job_id), String(job.title)]));
  const rows = new Map<number | null, UsageRow>();
  const providers = new Map<string, UsageProvider>();
  const cutoff = period === "all" ? null : new Date(Date.now() - PERIOD_MS[period]).toISOString();
  for (let offset = 0; ; offset += 1000) {
    let query = admin.from("model_call_usage")
      .select("id,job_id,provider,input_tokens,output_tokens,estimated_usd,usage_quality,started_at")
      .order("id", { ascending: true }).range(offset, offset + 999);
    if (cutoff) query = query.gte("started_at", cutoff);
    const page = await query;
    if (page.error) {
      console.error("Hirefy usage rows unavailable:", page.error.code);
      return { available: false };
    }
    for (const call of page.data ?? []) {
      const jobId = call.job_id == null ? null : Number(call.job_id);
      const row = rows.get(jobId) ?? {
        jobId,
        title: jobId == null ? "Testkosten (proefruns, niet aan een beroep gekoppeld)" : titles.get(jobId) ?? `Job ${jobId}`,
        calls: 0,
        inputTokens: null,
        outputTokens: null,
        estimatedUsd: null,
        incompleteCalls: 0,
        unpricedCalls: 0,
        firstRecordedAt: null,
        lastRecordedAt: null,
      };
      row.calls++;
      if (call.input_tokens != null) row.inputTokens = (row.inputTokens ?? 0) + Number(call.input_tokens);
      if (call.output_tokens != null) row.outputTokens = (row.outputTokens ?? 0) + Number(call.output_tokens);
      if (call.estimated_usd != null) row.estimatedUsd = (row.estimatedUsd ?? 0) + Number(call.estimated_usd);
      if (call.usage_quality !== "reported") row.incompleteCalls++;
      if (call.estimated_usd == null) row.unpricedCalls++;
      if (!row.firstRecordedAt || call.started_at < row.firstRecordedAt) row.firstRecordedAt = call.started_at;
      if (!row.lastRecordedAt || call.started_at > row.lastRecordedAt) row.lastRecordedAt = call.started_at;
      rows.set(jobId, row);

      const key = String(call.provider ?? "unknown");
      const group = providers.get(key) ?? { provider: key, calls: 0, inputTokens: 0, outputTokens: 0, usd: 0 };
      group.calls++;
      group.inputTokens += Number(call.input_tokens ?? 0);
      group.outputTokens += Number(call.output_tokens ?? 0);
      group.usd += Number(call.estimated_usd ?? 0);
      providers.set(key, group);
    }
    if ((page.data ?? []).length < 1000) break;
  }

  return {
    available: true,
    providers: [...providers.values()],
    // Meest recente kosten bovenaan, zodat nieuwe runs en proeven direct zichtbaar zijn.
    rows: [...rows.values()].sort((a, b) => (b.lastRecordedAt ?? "").localeCompare(a.lastRecordedAt ?? "") || (b.jobId ?? -1) - (a.jobId ?? -1)),
  };
}
