"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { QuestionCard } from "./QuestionCard";
import { QuestionEditor } from "./QuestionEditor";
import { ReviewStatusControl } from "./ReviewStatusControl";
import type { Question } from "@/lib/types";

/**
 * QuestionCard met QC-affordances: een review-status dropdown en een potlood om
 * de vraag inline te bewerken. Wijzigingen gaan via `onChange` terug naar de
 * parent (VariantSplit), zodat ze blijven staan bij het wisselen van variant.
 */
export function EditableQuestionCard({
  question,
  reveal,
  onChange,
}: {
  question: Question;
  reveal: boolean;
  onChange: (updated: Question) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <QuestionEditor
        question={question}
        onCancel={() => setEditing(false)}
        onSaved={(updated) => {
          onChange(updated);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <QuestionCard
      question={question}
      reveal={reveal}
      headerExtra={
        <div className="flex items-center gap-2">
          <ReviewStatusControl
            questionId={question.id}
            value={question.review_status}
            onChange={(status) => onChange({ ...question, review_status: status })}
          />
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Vraag bewerken"
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-ink-500 transition hover:bg-cream-200 hover:text-violet"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      }
    />
  );
}
