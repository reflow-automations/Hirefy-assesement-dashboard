"use client";

import { useState } from "react";
import { Check, X, Sparkles, RotateCcw } from "lucide-react";
import type { Question, CorrectAnswer } from "@/lib/types";
import { normalizeBloom } from "@/lib/bloom";
import { BloomBadge } from "./BloomBadge";
import { TypeBadge } from "./TypeBadge";
import { VariantBadge } from "./VariantBadge";
import { cn } from "@/lib/cn";

const LETTERS: CorrectAnswer[] = ["a", "b", "c", "d"];

export function DemoQuestion({
  question,
  siblingHref,
}: {
  question: Question;
  siblingHref?: string | null;
}) {
  const [picked, setPicked] = useState<CorrectAnswer | null>(null);
  const [revealed, setRevealed] = useState(false);
  const bloom = normalizeBloom(question.bloom_level);
  const correct = question.correct_answer;

  const reset = () => {
    setPicked(null);
    setRevealed(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <VariantBadge variant={question.variant} active />
        <TypeBadge type={question.type} />
        {bloom && <BloomBadge level={bloom} />}
        <span className="mono text-xs text-ink-500 ml-auto">
          Vraag #{question.question_number}
        </span>
      </div>

      <h2 className="display text-ink-950 text-3xl lg:text-4xl leading-[1.15]">
        {question.question}
      </h2>

      <div className="mt-10 space-y-3">
        {LETTERS.map((letter) => {
          const isPicked = picked === letter;
          const isCorrect = correct === letter;
          const showCorrect = revealed && isCorrect;
          const showWrong = revealed && isPicked && !isCorrect;

          return (
            <button
              key={letter}
              type="button"
              disabled={revealed}
              onClick={() => !revealed && setPicked(letter)}
              className={cn(
                "w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all group",
                "disabled:cursor-default",
                !revealed &&
                  isPicked &&
                  "border-violet bg-violet-tint shadow-md",
                !revealed &&
                  !isPicked &&
                  "border-ink-200 bg-cream-50 hover:border-ink-400 hover:bg-cream-100 hover:translate-x-0.5",
                showCorrect && "border-success bg-success-tint shadow-md",
                showWrong && "border-error bg-error-tint",
                revealed &&
                  !isPicked &&
                  !isCorrect &&
                  "border-ink-200 bg-cream-50 opacity-50",
              )}
            >
              <span
                className={cn(
                  "mono flex h-10 w-10 items-center justify-center text-sm shrink-0 rounded-full font-semibold transition",
                  !revealed && isPicked && "bg-violet text-cream-50",
                  !revealed &&
                    !isPicked &&
                    "bg-cream-200 text-ink-700 group-hover:bg-ink-950 group-hover:text-cream-50",
                  showCorrect && "bg-success text-cream-50",
                  showWrong && "bg-error text-cream-50",
                  revealed &&
                    !isPicked &&
                    !isCorrect &&
                    "bg-cream-200 text-ink-500",
                )}
              >
                {showCorrect ? (
                  <Check className="h-5 w-5" />
                ) : showWrong ? (
                  <X className="h-5 w-5" />
                ) : (
                  letter.toUpperCase()
                )}
              </span>
              <span
                className={cn(
                  "text-base leading-relaxed pt-1.5",
                  showCorrect
                    ? "text-ink-950 font-medium"
                    : !revealed && isPicked
                      ? "text-ink-950"
                      : "text-ink-800",
                )}
              >
                {question.options[letter]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {!revealed ? (
          <button
            type="button"
            disabled={!picked}
            onClick={() => setRevealed(true)}
            className={cn(
              "mono inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all",
              picked
                ? "bg-ink-950 text-cream-50 hover:bg-violet hover:scale-105 shadow-md"
                : "bg-cream-200 text-ink-400 cursor-not-allowed",
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Toon antwoord
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={reset}
              className="mono inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-[0.15em] font-semibold bg-cream-200 text-ink-800 hover:bg-cream-300 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Opnieuw
            </button>
            {siblingHref && (
              <a
                href={siblingHref}
                className="mono inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-[0.15em] font-semibold bg-violet text-cream-50 hover:bg-ink-950 transition shadow-md"
              >
                Probeer variant {question.variant === "A" ? "B" : "A"} →
              </a>
            )}
          </>
        )}
      </div>

      {revealed && (
        <div
          className={cn(
            "fade-up mt-8 rounded-2xl p-6 border-l-4",
            picked === correct
              ? "border-success bg-success-tint"
              : "border-error bg-error-tint",
          )}
        >
          <div
            className={cn(
              "mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2",
              picked === correct ? "text-success" : "text-error",
            )}
          >
            {picked === correct ? (
              <>
                <Check className="h-4 w-4" />
                Correct beantwoord
              </>
            ) : (
              <>
                <X className="h-4 w-4" />
                Het juiste antwoord was {correct.toUpperCase()}
              </>
            )}
          </div>
          {question.explanation && (
            <p className="mt-3 text-ink-800 leading-relaxed max-w-prose">
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
