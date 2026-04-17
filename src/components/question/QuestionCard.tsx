import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import type { Question, CorrectAnswer } from "@/lib/types";
import { normalizeBloom } from "@/lib/bloom";
import { BloomBadge } from "./BloomBadge";
import { TypeBadge } from "./TypeBadge";
import { cn } from "@/lib/cn";

const LETTERS: CorrectAnswer[] = ["a", "b", "c", "d"];

const TYPE_BORDER: Record<string, string> = {
  kennis: "border-l-teal",
  situatie: "border-l-ochre",
  casus: "border-l-terracotta",
};

export function QuestionCard({
  question,
  reveal = true,
}: {
  question: Question;
  reveal?: boolean;
}) {
  const bloom = normalizeBloom(question.bloom_level);
  return (
    <article
      className={cn(
        "rounded-2xl bg-cream-100 p-6 lg:p-8 border border-ink-200 border-l-4 hover:shadow-md transition-all",
        TYPE_BORDER[question.type] ?? "border-l-ink-300",
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-cream-200 text-ink-700">
            Vraag {question.question_number}
          </span>
          <TypeBadge type={question.type} />
          {bloom && <BloomBadge level={bloom} />}
        </div>
        <Link
          href={`/questions/${question.id}`}
          className="group inline-flex items-center gap-1.5 mono text-xs text-ink-500 hover:text-violet transition"
        >
          Demo
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </header>

      <p className="text-ink-950 text-base lg:text-lg leading-relaxed mb-6">
        {question.question}
      </p>

      <ul className="space-y-2">
        {LETTERS.map((letter) => {
          const isCorrect = reveal && question.correct_answer === letter;
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
                  "text-sm leading-relaxed",
                  isCorrect ? "text-ink-950 font-medium" : "text-ink-700",
                )}
              >
                {question.options[letter]}
              </span>
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
