import type { ReactNode } from "react";
import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import type { Question } from "@/lib/types";
import { TypeBadge, DifficultyBadge } from "./TypeBadge";
import { cn } from "@/lib/cn";

const ITEM_TYPE_BORDER: Record<string, string> = {
  // Fase 2
  MCQ:      "border-l-teal",
  SJT:      "border-l-ochre",
  Case:     "border-l-terracotta",
  Diagnose: "border-l-violet",
  BestAlt:  "border-l-magenta",
  // Fase 1 fallback
  kennis:   "border-l-teal",
  situatie: "border-l-ochre",
  casus:    "border-l-terracotta",
};

/** All letters to display — 5 for Diagnose, 4 for all others */
function getLetters(q: Question): string[] {
  if (q.options.e) return ["a", "b", "c", "d", "e"];
  return ["a", "b", "c", "d"];
}

/** Parse correct_answer: "a,c" → ["a","c"], "b" → ["b"] */
function parseCorrect(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export function QuestionCard({
  question,
  reveal = true,
  headerExtra,
}: {
  question: Question;
  reveal?: boolean;
  /** Optionele controls (review-status, potlood) rechtsboven in de header. */
  headerExtra?: ReactNode;
}) {
  const displayType = question.item_type ?? question.type;
  const borderClass = ITEM_TYPE_BORDER[displayType] ?? "border-l-ink-300";
  const letters = getLetters(question);
  const correctAnswers = reveal ? parseCorrect(question.correct_answer) : [];
  const isDiagnose = question.item_type === "Diagnose" || letters.length === 5;

  return (
    <article
      className={cn(
        "rounded-2xl bg-cream-100 p-6 lg:p-8 border border-ink-200 border-l-4 hover:shadow-md transition-all",
        borderClass,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-cream-200 text-ink-700">
            Vraag {question.question_number}
          </span>
          <TypeBadge type={displayType} />
          <DifficultyBadge difficulty={question.difficulty} />
        </div>
        <div className="flex items-center gap-3">
          {headerExtra}
          <Link
            href={`/questions/${question.id}`}
            className="group inline-flex items-center gap-1.5 mono text-xs text-ink-500 hover:text-violet transition"
          >
            Demo
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      {isDiagnose && (
        <p className="mono text-[10px] uppercase tracking-[0.18em] text-violet mb-3">
          Selecteer de 2 juiste antwoorden
        </p>
      )}

      <p className="text-ink-950 text-base lg:text-lg leading-relaxed mb-6">
        {question.question}
      </p>

      <ul className="space-y-2">
        {letters.map((letter) => {
          const isCorrect = reveal && correctAnswers.includes(letter);
          const optionText = question.options[letter as keyof typeof question.options];
          if (!optionText) return null;
          return (
            <li
              key={letter}
              className={cn(
                "flex gap-3 p-3.5 rounded-xl border transition",
                isCorrect
                  ? "border-success bg-success-tint"
                  : "border-ink-200 bg-cream-50",
              )}
            >
              <span
                className={cn(
                  "mono w-7 h-7 flex items-center justify-center text-xs shrink-0 rounded-full font-semibold",
                  isCorrect
                    ? "bg-success text-cream-50"
                    : "bg-cream-200 text-ink-700",
                )}
              >
                {isCorrect ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  letter.toUpperCase()
                )}
              </span>
              <span
                className={cn(
                  "text-sm leading-relaxed flex-1",
                  isCorrect ? "text-ink-950 font-medium" : "text-ink-700",
                )}
              >
                {optionText}
              </span>
              {/* SJT / BestAlt: show weights when revealing */}
              {reveal &&
                question.scoring_rule?.type === "weighted" &&
                question.scoring_rule.weights[letter] !== undefined && (
                  <span className="mono text-[10px] text-ink-400 shrink-0 self-center">
                    {(question.scoring_rule.weights[letter] * 100).toFixed(0)}%
                  </span>
                )}
            </li>
          );
        })}
      </ul>

      {reveal && question.explanation && (
        <div className="mt-6 rounded-xl bg-violet-tint/60 border-l-4 border-violet p-4">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-violet font-semibold mb-1.5">
            Toelichting
          </div>
          <p className="text-sm text-ink-800 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </article>
  );
}
