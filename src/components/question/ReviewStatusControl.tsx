"use client";

import { useState, useTransition } from "react";
import {
  REVIEW_STATUS_VALUES,
  REVIEW_STATUS_LABELS,
} from "@/lib/types";
import type { ReviewStatus } from "@/lib/types";
import { setReviewStatus } from "@/app/actions/questions";
import { cn } from "@/lib/cn";

const DOT: Record<ReviewStatus, string> = {
  pending: "bg-ink-400",
  ai_validated: "bg-teal",
  needs_review: "bg-ochre",
  sme_approved: "bg-success",
  sme_rejected: "bg-error",
  generation_failed: "bg-error",
};

/** Inline dropdown om de review-status van een vraag te wijzigen (QC-triage). */
export function ReviewStatusControl({
  questionId,
  value,
  onChange,
}: {
  questionId: number;
  value: ReviewStatus | null;
  onChange: (status: ReviewStatus) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const current = (value ?? "pending") as ReviewStatus;

  return (
    <span className="inline-flex items-center gap-1.5" title={error ?? "Review-status"}>
      <span className={cn("block h-1.5 w-1.5 rounded-full", DOT[current], pending && "animate-pulse")} />
      <select
        value={current}
        disabled={pending}
        aria-label="Review-status wijzigen"
        onChange={(e) => {
          const next = e.target.value as ReviewStatus;
          startTransition(async () => {
            const res = await setReviewStatus({ id: questionId, review_status: next });
            if (res.ok) {
              setError(null);
              onChange(next);
            } else {
              setError(res.error ?? "Mislukt");
            }
          });
        }}
        className={cn(
          "mono cursor-pointer rounded-full border border-ink-200 bg-cream-100 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-ink-700 transition hover:border-ink-400 focus:border-violet focus:outline-none",
          error && "border-error text-error",
        )}
      >
        {REVIEW_STATUS_VALUES.map((s) => (
          <option key={s} value={s}>
            {REVIEW_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </span>
  );
}
