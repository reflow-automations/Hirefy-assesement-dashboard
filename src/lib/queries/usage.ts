import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface UsageRow {
  jobId: number;
  title: string;
  calls: number;
  inputTokens: number | null;
  outputTokens: number | null;
  estimatedUsd: number | null;
  incompleteCalls: number;
  unpricedCalls: number;
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

export async function getUsageData(): Promise<UsageData> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { available: false };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("job_model_costs")
    .select("job_id,title,recorded_calls,input_tokens,output_tokens,estimated_usd,calls_with_incomplete_usage,unpriced_calls,last_recorded_at")
    .order("job_id", { ascending: false });

  if (error) {
    console.error("Hirefy usage view unavailable:", error.code);
    return { available: false };
  }

  // The view groups by job. Read the protected call table separately to keep
  // provider-reported Perplexity costs distinct from Claude list-price estimates.
  const providers = new Map<string, UsageProvider>();
  for (let offset = 0; ; offset += 1000) {
    const page = await admin.from("model_call_usage")
      .select("id,provider,input_tokens,output_tokens,estimated_usd")
      .order("id", { ascending: true }).range(offset, offset + 999);
    if (page.error) {
      console.error("Hirefy usage rows unavailable:", page.error.code);
      return { available: false };
    }
    for (const call of page.data ?? []) {
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
    rows: (data ?? []).map((row) => ({
      jobId: Number(row.job_id),
      title: String(row.title),
      calls: Number(row.recorded_calls ?? 0),
      inputTokens: row.input_tokens == null ? null : Number(row.input_tokens),
      outputTokens: row.output_tokens == null ? null : Number(row.output_tokens),
      estimatedUsd: row.estimated_usd == null ? null : Number(row.estimated_usd),
      incompleteCalls: Number(row.calls_with_incomplete_usage ?? 0),
      unpricedCalls: Number(row.unpriced_calls ?? 0),
      lastRecordedAt: row.last_recorded_at ?? null,
    })),
  };
}
