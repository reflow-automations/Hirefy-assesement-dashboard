"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { DemoQuestion } from "./DemoQuestion";
import { QuestionEditor } from "./QuestionEditor";
import type { Question } from "@/lib/types";

/**
 * Demo-vraag met een potlood om dezelfde vraag inline te bewerken.
 * De editor draait "embedded" omdat de demo-pagina al een kaart-chrome heeft.
 */
export function DemoQuestionEditable({
  question: initial,
  siblingHref,
}: {
  question: Question;
  siblingHref?: string | null;
}) {
  const [question, setQuestion] = useState(initial);
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <QuestionEditor
        question={question}
        embedded
        onCancel={() => setEditing(false)}
        onSaved={(updated) => {
          setQuestion(updated);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label="Vraag bewerken"
        className="absolute -right-2 -top-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-3 py-1.5 text-ink-600 shadow-sm transition hover:bg-violet hover:text-cream-50"
      >
        <Pencil className="h-3.5 w-3.5" />
        <span className="mono text-[10px] uppercase tracking-[0.15em]">Bewerk</span>
      </button>
      <DemoQuestion question={question} siblingHref={siblingHref} />
    </div>
  );
}
