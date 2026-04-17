import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { Stats } from "@/lib/types";

export async function getStats(): Promise<Stats> {
  const supabase = createServerClient();
  const [jobs, skills, questions, escoSkills] = await Promise.all([
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("questions").select("*", { count: "exact", head: true }),
    supabase
      .from("skills")
      .select("*", { count: "exact", head: true })
      .eq("in_esco", true),
  ]);

  const skillsCount = skills.count ?? 0;
  const escoCount = escoSkills.count ?? 0;

  return {
    jobs: jobs.count ?? 0,
    skills: skillsCount,
    questions: questions.count ?? 0,
    escoPercentage:
      skillsCount > 0 ? Math.round((escoCount / skillsCount) * 100) : 0,
  };
}
