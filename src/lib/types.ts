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
  selection_reasoning: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  job_id: number;
  name: string;
  relevance: string | null;
  in_esco: boolean | null;
  assessment_data: Record<string, unknown> | null;
  audit_status: string | null;
  audit_timestamp: string | null;
  /** Skill-definitie (max 25 woorden) — Fase 2: kolom D uit klant blueprint */
  description: string | null;
  created_at: string;
  updated_at: string;
}

// ── Legacy question type (Fase 1) ─────────────────────────────────────────────
export type QuestionType = "kennis" | "situatie" | "casus";

// ── New item type taxonomy (Fase 2) — source of truth when populated ─────────
export type ItemType = "MCQ" | "SJT" | "Case" | "Diagnose" | "BestAlt";

// Unified display type: prefer item_type, fall back to type
export type DisplayType = ItemType | QuestionType;

export type QuestionVariant = "A" | "B";

// Single-choice letters — use `string` on Question.correct_answer since
// Diagnose can be multi-answer ("a,c")
export type CorrectAnswer = "a" | "b" | "c" | "d" | "e";

export interface QuestionOptions {
  a: string;
  b: string;
  c: string;
  d: string;
  /** Only present for Diagnose questions (5-option multiple-correct) */
  e?: string;
}

// ── Scoring rules (Fase 2) ────────────────────────────────────────────────────
export interface ScoringRuleBinary {
  type: "binary";
  correct_answer: string;
  score_correct: number;
  score_wrong: number;
}
export interface ScoringRulePartialCredit {
  type: "partial_credit";
  correct: string[];
  score_correct: number; // per correct answer
  score_wrong: number;   // per wrong answer (can be negative)
  min_score: number;
}
export interface ScoringRuleWeighted {
  type: "weighted";
  weights: Record<string, number>; // e.g. {a: 1.0, b: 0.6, c: 0.3, d: 0.0}
}
export type ScoringRule =
  | ScoringRuleBinary
  | ScoringRulePartialCredit
  | ScoringRuleWeighted;

// ── Review status (Fase 2 pipeline workflow) ──────────────────────────────────
export type ReviewStatus =
  | "pending"
  | "ai_validated"
  | "needs_review"
  | "sme_approved"
  | "sme_rejected"
  | "generation_failed";

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
  /** Legacy (Fase 1) — use item_type as source of truth when available */
  type: QuestionType;
  /** Fase 2 — preferred type taxonomy. Null for Fase 1 questions. */
  item_type: ItemType | null;
  question: string;
  options: QuestionOptions;
  /**
   * Single letter for MCQ/Case/SJT/BestAlt ("a"–"d").
   * Comma-separated for Diagnose ("a,c").
   * Typed as string to accommodate both.
   */
  correct_answer: string;
  explanation: string | null;
  bloom_level: string | null; // raw — always normalize via normalizeBloom()
  audit_status: string | null;
  audit_action: string | null;
  audit_notes: string | null;
  audit_scores: Record<string, unknown> | null;
  audit_timestamp: string | null;
  /** Fase 2 — difficulty 1 (easy) to 5 (hardest). Null for Fase 1. */
  difficulty: number | null;
  /** Fase 2 — scoring rule jsonb. Null for Fase 1 (use simple binary). */
  scoring_rule: ScoringRule | null;
  /** Internal deduplication prefix — not shown in UI */
  stem_prefix: string | null;
  /** Fase 2 pipeline review workflow status */
  review_status: ReviewStatus | null;
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
