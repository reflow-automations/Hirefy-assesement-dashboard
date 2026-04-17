import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { Skill } from "@/lib/types";

export interface SkillWithCounts extends Skill {
  question_count: number;
}

export async function listSkillsByJob(jobId: number): Promise<SkillWithCounts[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*, questions(id)")
    .eq("job_id", jobId)
    .order("id");
  if (error) throw error;
  const rows = (data ?? []) as unknown as Array<
    Skill & { questions: { id: number }[] }
  >;
  return rows.map((r) => ({
    ...r,
    question_count: r.questions?.length ?? 0,
  }));
}

export async function getSkill(id: number): Promise<Skill | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Skill) ?? null;
}
