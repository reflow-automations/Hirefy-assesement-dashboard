import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import { humanizeTitle } from "@/lib/text";
import { REVIEW_STATUS_LABELS } from "@/lib/types";
import type { ReviewStatus } from "@/lib/types";

// Eén platte rij per vraag, klaar voor de Excel-export. Keys = kolom-keys in de
// route handler. Bewust ALLE vragen (incl. pending/needs_review) met status-
// kolommen erbij, zodat Robbie zijn QC kan doen op de twijfelgevallen.
export interface ExportRow {
  beroep: string;
  skill: string;
  variant: string;
  vraagnr: number | null;
  type: string;
  niveau: number | null;
  vraag: string;
  optie_a: string;
  optie_b: string;
  optie_c: string;
  optie_d: string;
  optie_e: string;
  juist_letter: string;
  juist_antwoord: string;
  toelichting: string;
  review_status: string;
  audit_notes: string;
}

const TYPE_LABEL: Record<string, string> = {
  MCQ: "MCQ",
  SJT: "SJT",
  Case: "Casus",
  Diagnose: "Diagnose",
  BestAlt: "Best Alt.",
  kennis: "Kennis",
  situatie: "Situationeel",
  casus: "Casus",
};

function parseCorrect(raw: unknown): string[] {
  if (typeof raw !== "string") return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

interface RawRow {
  variant: string | null;
  question_number: number | null;
  item_type: string | null;
  question: string | null;
  options: Record<string, unknown> | null;
  correct_answer: string | null;
  explanation: string | null;
  difficulty: number | null;
  review_status: string | null;
  audit_notes: string | null;
  skills: { name: string | null } | null;
  jobs: { title: string | null } | null;
}

function mapRow(r: RawRow): ExportRow {
  const opts = r.options ?? {};
  const opt = (k: string) =>
    typeof opts[k] === "string" ? (opts[k] as string) : "";
  const letters = parseCorrect(r.correct_answer);
  const correctText = letters
    .map((l) => opt(l))
    .filter(Boolean)
    .join("  |  ");
  const rawType = r.item_type ?? "";

  return {
    beroep: r.jobs?.title ? humanizeTitle(r.jobs.title) : "",
    skill: r.skills?.name ?? "",
    variant: r.variant ?? "",
    vraagnr: r.question_number,
    type: TYPE_LABEL[rawType] ?? rawType,
    niveau: r.difficulty,
    vraag: r.question ?? "",
    optie_a: opt("a"),
    optie_b: opt("b"),
    optie_c: opt("c"),
    optie_d: opt("d"),
    optie_e: opt("e"),
    juist_letter: letters.map((l) => l.toUpperCase()).join(", "),
    juist_antwoord: correctText,
    toelichting: r.explanation ?? "",
    review_status:
      REVIEW_STATUS_LABELS[r.review_status as ReviewStatus] ??
      r.review_status ??
      "",
    audit_notes: r.audit_notes ?? "",
  };
}

export async function getExportRows(opts: {
  jobIds?: number[];
  skillId?: number;
}): Promise<ExportRow[]> {
  const supabase = createServerClient();
  // LET OP: questions heeft geen `type`-kolom meer (Fase 1 verwijderd) — alleen item_type.
  let q = supabase
    .from("questions")
    .select(
      "variant, question_number, item_type, question, options, correct_answer, explanation, difficulty, review_status, audit_notes, skills(name), jobs(title)",
    );

  if (opts.skillId) q = q.eq("skill_id", opts.skillId);
  else if (opts.jobIds && opts.jobIds.length > 0) q = q.in("job_id", opts.jobIds);
  // geen filter => alle beroepen

  const { data, error } = await q
    .order("job_id")
    .order("skill_id")
    .order("variant")
    .order("question_number");

  if (error) throw error;
  return ((data ?? []) as unknown as RawRow[]).map(mapRow);
}
