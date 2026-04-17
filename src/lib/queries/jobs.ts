import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { Job, EscoEntry } from "@/lib/types";

export interface JobListItem {
  id: number;
  title: string;
  sector: string | null;
  sub_sector: string | null;
  job_family: string | null;
  market_insight: string | null;
  status: string | null;
  skill_count: number;
  esco_count: number;
}

export async function listJobs(filters?: {
  sector?: string;
  query?: string;
}): Promise<JobListItem[]> {
  const supabase = createServerClient();
  let q = supabase
    .from("jobs")
    .select(
      "id, title, sector, sub_sector, job_family, market_insight, status, skills(id, in_esco)",
    );

  if (filters?.sector) q = q.eq("sector", filters.sector);
  if (filters?.query) q = q.ilike("title", `%${filters.query}%`);

  const { data, error } = await q.order("id");
  if (error) throw error;
  const rows = (data ?? []) as unknown as Array<
    Omit<JobListItem, "skill_count" | "esco_count"> & {
      skills: { id: number; in_esco: boolean | null }[];
    }
  >;

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    sector: r.sector,
    sub_sector: r.sub_sector,
    job_family: r.job_family,
    market_insight: r.market_insight,
    status: r.status,
    skill_count: r.skills?.length ?? 0,
    esco_count: r.skills?.filter((s) => s.in_esco).length ?? 0,
  }));
}

export async function getJob(id: number): Promise<Job | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return data as unknown as Job;
}

export async function listDistinctSectors(): Promise<string[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("jobs").select("sector");
  if (error) throw error;
  const set = new Set<string>();
  (data ?? []).forEach((r) => {
    if (r.sector) set.add(r.sector as string);
  });
  return Array.from(set).sort();
}

export function safeEsco(data: Job["esco_raw_data"]): EscoEntry[] {
  if (!Array.isArray(data)) return [];
  return data.filter(
    (e): e is EscoEntry =>
      !!e &&
      typeof e === "object" &&
      "type" in e &&
      "vaardigheid" in e &&
      ["core", "knowledge", "tool"].includes((e as EscoEntry).type),
  );
}
