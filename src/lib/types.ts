// Domain types — hand-narrowed jsonb columns for the Hirefy schema.
// Mirrors the Supabase `public` schema on project kfsvykbptevghxkufsjc.

export type EscoType = "core" | "knowledge" | "tool";

export interface EscoEntry {
  type: EscoType;
  vaardigheid: string;
  beschrijving: string;
}

export interface Job {
  id: number;
  title: string;
  sector: string | null;
  sub_sector: string | null;
  job_family: string | null;
  esco_raw_data: EscoEntry[] | null;
  market_insight: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export type SkillCategory = "Generiek" | "Sector-specifiek";

export interface Skill {
  id: number;
  job_id: number;
  name: string;
  category: SkillCategory | null;
  relevance: string | null;
  in_esco: boolean | null;
  assessment_data: Record<string, unknown> | null;
  audit_status: string | null;
  audit_timestamp: string | null;
  created_at: string;
  updated_at: string;
}

export type QuestionType = "kennis" | "situatie" | "casus";
export type QuestionVariant = "A" | "B";
export type CorrectAnswer = "a" | "b" | "c" | "d";

export interface QuestionOptions {
  a: string;
  b: string;
  c: string;
  d: string;
}

// Canonical Bloom levels — normalized via lib/bloom.ts
export type BloomLevel =
  | "onthouden"
  | "begrijpen"
  | "toepassen"
  | "analyseren"
  | "evalueren"
  | "creeren";

export interface Question {
  id: number;
  skill_id: number;
  job_id: number;
  variant: QuestionVariant;
  question_number: number;
  type: QuestionType;
  question: string;
  options: QuestionOptions;
  correct_answer: CorrectAnswer;
  explanation: string | null;
  bloom_level: string | null; // raw — always normalize via normalizeBloom()
  audit_status: string | null;
  audit_action: string | null;
  audit_notes: string | null;
  audit_scores: Record<string, unknown> | null;
  audit_timestamp: string | null;
  created_at: string;
  updated_at: string;
}

// Aggregate stats
export interface Stats {
  jobs: number;
  skills: number;
  questions: number;
  escoPercentage: number;
}
