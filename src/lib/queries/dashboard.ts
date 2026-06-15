import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import { safeEsco } from "@/lib/queries/jobs";
import type {
  EscoType,
  ItemType,
  Job,
  Question,
  ReviewStatus,
  Skill,
} from "@/lib/types";

export interface DashboardData {
  // Top-line counts
  totals: {
    jobs: number;
    skills: number;
    questions: number;
    variantPairs: number;
    escoSkills: number;
    escoPercentage: number;
    avgQuestionsPerSkill: number;
  };

  // Pipeline composition
  /** Difficulty distribution 1-5 (Fase 2) */
  difficultyDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
  typeCounts: { kennis: number; situatie: number; casus: number };
  /** Fase 2 item type counts — populated after pipeline upgrade */
  itemTypeCounts: Record<ItemType, number>;
  variantCounts: { A: number; B: number };
  categoryCounts: { generiek: number; sectorSpecifiek: number; other: number };
  auditCounts: Record<string, number>; // key = status (pending|...) value = count
  /** Fase 2 review status counts */
  reviewStatusCounts: Record<ReviewStatus | "unknown", number>;

  // ESCO analysis
  escoTypeCounts: Record<EscoType, number>;
  nonEscoSkills: { id: number; name: string; jobId: number }[];

  // Content quality
  content: {
    avgQuestionChars: number;
    avgExplanationChars: number;
    avgOptionChars: number;
    longestQuestionChars: number;
    shortestQuestionChars: number;
    // Answer-length-parity: count of questions where correct is strictly longest
    correctIsLongest: number;
    // Count of questions where max/min option length ratio > 2 (spread too wide)
    highLengthSpread: number;
  };

  // Skills table
  skillsTable: {
    id: number;
    name: string;
    jobId: number;
    category: string | null;
    inEsco: boolean;
    questionCount: number;
    /** item_type counts per skill — 0 for Fase 1 skills */
    itemTypeCounts: Record<ItemType, number>;
    avgDifficulty: number | null;
  }[];

  // Variant parity — per skill, count of A vs B questions (ideally equal)
  variantParity: {
    skillId: number;
    skillName: string;
    a: number;
    b: number;
  }[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = createServerClient();

  const [jobsRes, skillsRes, questionsRes] = await Promise.all([
    supabase.from("jobs").select("id, title, sector, esco_raw_data"),
    supabase.from("skills").select("id, name, job_id, category, in_esco, audit_status"),
    supabase
      .from("questions")
      .select(
        "id, skill_id, job_id, variant, item_type, question, options, correct_answer, explanation, audit_status, review_status, difficulty",
      ),
  ]);

  if (jobsRes.error) throw jobsRes.error;
  if (skillsRes.error) throw skillsRes.error;
  if (questionsRes.error) throw questionsRes.error;

  const jobs = (jobsRes.data ?? []) as unknown as Pick<
    Job,
    "id" | "title" | "sector" | "esco_raw_data"
  >[];
  const skills = (skillsRes.data ?? []) as unknown as Skill[];
  const questions = (questionsRes.data ?? []) as unknown as Question[];

  // ---- Totals ----
  const jobsCount = jobs.length;
  const skillsCount = skills.length;
  const questionsCount = questions.length;
  const escoSkills = skills.filter((s) => s.in_esco).length;
  const escoPercentage = skillsCount
    ? Math.round((escoSkills / skillsCount) * 100)
    : 0;
  const avgQuestionsPerSkill = skillsCount
    ? Math.round((questionsCount / skillsCount) * 10) / 10
    : 0;

  // Variant-pairs = min(A,B) counted per skill×question_number — approx as
  // questions.length/2 since pipeline is designed to produce pairs.
  const variantPairs = Math.floor(questionsCount / 2);

  // ---- Difficulty distribution (Fase 2) ----
  const difficultyDistribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  };
  for (const q of questions) {
    const d = (q as unknown as { difficulty: number | null }).difficulty;
    if (d && d >= 1 && d <= 5) difficultyDistribution[d as 1 | 2 | 3 | 4 | 5]++;
  }

  // ---- Type counts (legacy Fase 1) ----
  const typeCounts = { kennis: 0, situatie: 0, casus: 0 };
  for (const q of questions) {
    if (q.type === "kennis") typeCounts.kennis++;
    else if (q.type === "situatie") typeCounts.situatie++;
    else if (q.type === "casus") typeCounts.casus++;
  }

  // ---- Item type counts (Fase 2) ----
  const itemTypeCounts: Record<ItemType, number> = {
    MCQ: 0, SJT: 0, Case: 0, Diagnose: 0, BestAlt: 0,
  };
  for (const q of questions) {
    const it = (q as unknown as { item_type: ItemType | null }).item_type;
    if (it && it in itemTypeCounts) itemTypeCounts[it]++;
  }

  // ---- Review status counts (Fase 2) ----
  const reviewStatusCounts: Record<ReviewStatus | "unknown", number> = {
    ai_validated: 0, needs_review: 0, sme_approved: 0,
    sme_rejected: 0, generation_failed: 0, unknown: 0,
  };
  for (const q of questions) {
    const rs = (q as unknown as { review_status: ReviewStatus | null }).review_status;
    const key: ReviewStatus | "unknown" = rs ?? "unknown";
    reviewStatusCounts[key] = (reviewStatusCounts[key] ?? 0) + 1;
  }

  // ---- Variant counts ----
  const variantCounts = { A: 0, B: 0 };
  for (const q of questions) {
    if (q.variant === "A") variantCounts.A++;
    else if (q.variant === "B") variantCounts.B++;
  }

  // ---- Category counts ----
  const categoryCounts = { generiek: 0, sectorSpecifiek: 0, other: 0 };
  for (const s of skills) {
    if (s.category === "Generiek") categoryCounts.generiek++;
    else if (s.category === "Sector-specifiek") categoryCounts.sectorSpecifiek++;
    else categoryCounts.other++;
  }

  // ---- Audit counts (questions level) ----
  const auditCounts: Record<string, number> = {};
  for (const q of questions) {
    const key = q.audit_status ?? "unknown";
    auditCounts[key] = (auditCounts[key] ?? 0) + 1;
  }

  // ---- ESCO type counts across all jobs ----
  const escoTypeCounts: Record<EscoType, number> = {
    core: 0,
    knowledge: 0,
    tool: 0,
  };
  for (const j of jobs) {
    const esco = safeEsco(j.esco_raw_data as Job["esco_raw_data"]);
    for (const entry of esco) {
      escoTypeCounts[entry.type]++;
    }
  }

  // ---- Non-ESCO skills (emerging / sector-specific) ----
  const nonEscoSkills = skills
    .filter((s) => s.in_esco === false)
    .map((s) => ({ id: s.id, name: s.name, jobId: s.job_id }));

  // ---- Content quality ----
  let totalQChars = 0;
  let totalExplChars = 0;
  let totalOptChars = 0;
  let optCount = 0;
  let longestQ = 0;
  let shortestQ = Number.POSITIVE_INFINITY;
  let correctIsLongest = 0;
  let highLengthSpread = 0;

  for (const q of questions) {
    const qLen = q.question.length;
    totalQChars += qLen;
    longestQ = Math.max(longestQ, qLen);
    shortestQ = Math.min(shortestQ, qLen);
    totalExplChars += (q.explanation ?? "").length;

    const optLens: Record<"a" | "b" | "c" | "d", number> = {
      a: q.options.a?.length ?? 0,
      b: q.options.b?.length ?? 0,
      c: q.options.c?.length ?? 0,
      d: q.options.d?.length ?? 0,
    };
    const lens = Object.values(optLens);
    totalOptChars += lens.reduce((a, b) => a + b, 0);
    optCount += 4;

    // For Diagnose ("a,c"), take the first letter; skip multi-correct for this metric
    const firstCorrect = q.correct_answer.split(",")[0]?.trim() ?? "";
    const correctLen = optLens[firstCorrect as "a" | "b" | "c" | "d"] ?? 0;
    const maxLen = Math.max(...lens);
    const minLen = Math.min(...lens) || 1;
    if (correctLen === maxLen && lens.filter((l) => l === maxLen).length === 1) {
      correctIsLongest++;
    }
    if (maxLen / minLen > 2) highLengthSpread++;
  }

  // ---- Skills table with per-skill bloom counts ----
  const questionsBySkill = new Map<number, Question[]>();
  for (const q of questions) {
    const arr = questionsBySkill.get(q.skill_id) ?? [];
    arr.push(q);
    questionsBySkill.set(q.skill_id, arr);
  }

  const skillsTable = skills
    .map((s) => {
      const qs = questionsBySkill.get(s.id) ?? [];
      const itc: Record<ItemType, number> = {
        MCQ: 0, SJT: 0, Case: 0, Diagnose: 0, BestAlt: 0,
      };
      let totalDiff = 0;
      let diffCount = 0;
      for (const q of qs) {
        const it = (q as unknown as { item_type: ItemType | null }).item_type;
        if (it && it in itc) itc[it]++;
        const d = (q as unknown as { difficulty: number | null }).difficulty;
        if (d) { totalDiff += d; diffCount++; }
      }
      return {
        id: s.id,
        name: s.name,
        jobId: s.job_id,
        category: s.category,
        inEsco: s.in_esco === true,
        questionCount: qs.length,
        itemTypeCounts: itc,
        avgDifficulty: diffCount ? Math.round((totalDiff / diffCount) * 10) / 10 : null,
      };
    })
    .sort((a, b) => b.questionCount - a.questionCount);

  // ---- Variant parity (should be ~equal per skill) ----
  const variantParity = skills
    .map((s) => {
      const qs = questionsBySkill.get(s.id) ?? [];
      return {
        skillId: s.id,
        skillName: s.name,
        a: qs.filter((q) => q.variant === "A").length,
        b: qs.filter((q) => q.variant === "B").length,
      };
    })
    .sort((a, b) => Math.abs(a.a - a.b) - Math.abs(b.a - b.b));

  return {
    totals: {
      jobs: jobsCount,
      skills: skillsCount,
      questions: questionsCount,
      variantPairs,
      escoSkills,
      escoPercentage,
      avgQuestionsPerSkill,
    },
    difficultyDistribution,
    typeCounts,
    itemTypeCounts,
    variantCounts,
    categoryCounts,
    auditCounts,
    reviewStatusCounts,
    escoTypeCounts,
    nonEscoSkills,
    content: {
      avgQuestionChars: questionsCount ? Math.round(totalQChars / questionsCount) : 0,
      avgExplanationChars: questionsCount
        ? Math.round(totalExplChars / questionsCount)
        : 0,
      avgOptionChars: optCount ? Math.round(totalOptChars / optCount) : 0,
      longestQuestionChars: longestQ,
      shortestQuestionChars: shortestQ === Number.POSITIVE_INFINITY ? 0 : shortestQ,
      correctIsLongest,
      highLengthSpread,
    },
    skillsTable,
    variantParity,
  };
}

