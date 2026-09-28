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

export type UsageData =
  | { available: false }
  | { available: true; rows: UsageRow[] };

export async function getUsageData(): Promise<UsageData> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { available: false };

  const { data, error } = await createAdminClient()
    .from("job_model_costs")
    .select("job_id,title,recorded_calls,input_tokens,output_tokens,estimated_usd,calls_with_incomplete_usage,unpriced_calls,last_recorded_at")
    .order("job_id", { ascending: false });

  if (error) {
    console.error("Hirefy usage view unavailable:", error.code);
    return { available: false };
  }

  return {
    available: true,
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
