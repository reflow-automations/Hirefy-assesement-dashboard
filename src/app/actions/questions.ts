"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasAccess } from "@/lib/access";
import { REVIEW_STATUS_VALUES } from "@/lib/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const optionsSchema = z.object({
  a: z.string(),
  b: z.string(),
  c: z.string(),
  d: z.string(),
  e: z.string().optional(),
});

const updateSchema = z.object({
  id: z.number().int().positive(),
  question: z.string().trim().min(1, "Vraag mag niet leeg zijn"),
  options: optionsSchema,
  correct_answer: z.string().trim().min(1, "Juist antwoord ontbreekt"),
  explanation: z.string().nullable().optional(),
});

const statusSchema = z.object({
  id: z.number().int().positive(),
  review_status: z.enum(REVIEW_STATUS_VALUES),
});

export type UpdateQuestionInput = z.input<typeof updateSchema>;

function revalidateQuestionPages() {
  // Beide routes waar een vraag getoond wordt; dynamische segmenten => "page".
  revalidatePath("/jobs/[id]/skills/[skillId]", "page");
  revalidatePath("/questions/[id]", "page");
}

/**
 * Werkt de INHOUD van een vraag bij (vraag, opties, juist antwoord, toelichting).
 * Laat review_status bewust ongemoeid — status wijzig je los via setReviewStatus.
 */
export async function updateQuestion(
  input: UpdateQuestionInput,
): Promise<ActionResult> {
  if (!(await hasAccess())) return { ok: false, error: "Geen toegang" };

  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ongeldige invoer" };
  }
  const { id, question, options, correct_answer, explanation } = parsed.data;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("questions")
    .update({
      question,
      options,
      correct_answer,
      explanation: explanation ?? null,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidateQuestionPages();
  return { ok: true };
}

/** Zet alleen de review-status van een vraag (handmatige QC-triage vanuit het dashboard). */
export async function setReviewStatus(input: {
  id: number;
  review_status: (typeof REVIEW_STATUS_VALUES)[number];
}): Promise<ActionResult> {
  if (!(await hasAccess())) return { ok: false, error: "Geen toegang" };

  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Ongeldige status" };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("questions")
    .update({ review_status: parsed.data.review_status })
    .eq("id", parsed.data.id);

  if (error) return { ok: false, error: error.message };

  revalidateQuestionPages();
  return { ok: true };
}
