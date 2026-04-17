"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { QuestionCard } from "@/components/question/QuestionCard";
import type { Question, QuestionVariant } from "@/lib/types";
import { cn } from "@/lib/cn";

export function VariantSplit({ questions }: { questions: Question[] }) {
  const [variant, setVariant] = useState<QuestionVariant>("A");
  const [showAnswers, setShowAnswers] = useState(true);
  const filtered = questions
    .filter((q) => q.variant === variant)
    .sort((a, b) => a.question_number - b.question_number);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="inline-flex p-1 rounded-full bg-cream-200">
          {(["A", "B"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={cn(
                "mono text-xs uppercase tracking-[0.15em] px-6 py-2.5 rounded-full transition-all font-semibold",
                variant === v
                  ? "bg-ink-950 text-cream-50 shadow-sm"
                  : "text-ink-700 hover:text-ink-950",
              )}
            >
              Variant {v}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowAnswers((s) => !s)}
          className="inline-flex items-center gap-2 mono text-xs text-ink-700 hover:text-violet transition px-4 py-2 rounded-full bg-cream-100 hover:bg-cream-200"
        >
          {showAnswers ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Verberg antwoorden
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Toon antwoorden
            </>
          )}
        </button>
      </div>

      <div className="space-y-5 stagger" key={variant}>
        {filtered.map((q) => (
          <QuestionCard key={q.id} question={q} reveal={showAnswers} />
        ))}
      </div>
    </div>
  );
}
