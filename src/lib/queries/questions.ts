import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { Question, QuestionOptions } from "@/lib/types";

function safeOptions(raw: unknown): QuestionOptions | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.a === "string" &&
    typeof o.b === "string" &&
    typeof o.c === "string" &&
    typeof o.d === "string"
  ) {
    const opts: QuestionOptions = { a: o.a, b: o.b, c: o.c, d: o.d };
    // Diagnose questions have a 5th option
    if (typeof o.e === "string") opts.e = o.e;
    return opts;
  }
  return null;
}

export async function listQuestionsBySkill(
  skillId: number,
): Promise<Question[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("skill_id", skillId)
    .order("variant")
    .order("question_number");
  if (error) throw error;
  return (data ?? [])
    .map((r) => {
      const options = safeOptions((r as { options: unknown }).options);
      if (!options) return null;
      return { ...(r as unknown as Question), options };
    })
    .filter((r): r is Question => r !== null);
}

export async function listQuestionsByJob(jobId: number): Promise<Question[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("job_id", jobId)
    .order("skill_id")
    .order("variant")
    .order("question_number");
  if (error) throw error;
  return (data ?? [])
    .map((r) => {
      const options = safeOptions((r as { options: unknown }).options);
      if (!options) return null;
      return { ...(r as unknown as Question), options };
    })
    .filter((r): r is Question => r !== null);
}

export async function getQuestion(id: number): Promise<Question | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const options = safeOptions((data as { options: unknown }).options);
  if (!options) return null;
  return { ...(data as unknown as Question), options };
}

export async function getSiblingVariantQuestion(
  q: Pick<Question, "skill_id" | "variant" | "question_number">,
): Promise<Question | null> {
  const other = q.variant === "A" ? "B" : "A";
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("skill_id", q.skill_id)
    .eq("variant", other)
    .eq("question_number", q.question_number)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const options = safeOptions((data as { options: unknown }).options);
  if (!options) return null;
  return { ...(data as unknown as Question), options };
}
