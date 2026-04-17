"use client";

import { useState } from "react";
import { Check, X, Sparkles, RotateCcw } from "lucide-react";
import type { Question, ScoringRule } from "@/lib/types";
import { TypeBadge, DifficultyBadge } from "./TypeBadge";
import { VariantBadge } from "./VariantBadge";
import { cn } from "@/lib/cn";

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseCorrect(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function getLetters(q: Question): string[] {
  if (q.options.e) return ["a", "b", "c", "d", "e"];
  return ["a", "b", "c", "d"];
}

function getWeight(rule: ScoringRule | null, letter: string): number | null {
  if (!rule || rule.type !== "weighted") return null;
  return rule.weights[letter] ?? null;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function DemoQuestion({
  question,
  siblingHref,
}: {
  question: Question;
  siblingHref?: string | null;
}) {
  const displayType = question.item_type ?? question.type;
  const isDiagnose = question.item_type === "Diagnose" || !!question.options.e;
  const isWeighted = question.item_type === "SJT" || question.item_type === "BestAlt";

  const letters = getLetters(question);
  const correctAnswers = parseCorrect(question.correct_answer);

  // Single-select state (all types except Diagnose)
  const [pickedSingle, setPickedSingle] = useState<string | null>(null);
  // Multi-select state (Diagnose only)
  const [pickedSet, setPickedSet] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);

  const canReveal = isDiagnose ? pickedSet.size > 0 : pickedSingle !== null;

  const reset = () => {
    setPickedSingle(null);
    setPickedSet(new Set());
    setRevealed(false);
  };

  const toggleMulti = (letter: string) => {
    if (revealed) return;
    setPickedSet((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) {
        next.delete(letter);
      } else {
        // Diagnose: max 2 selections
        if (next.size < 2) next.add(letter);
      }
      return next;
    });
  };

  // ── Scoring feedback ─────────────────────────────────────────────────────────
  const feedbackResult = (() => {
    if (!revealed) return null;
    if (isDiagnose) {
      // Partial credit: count hits
      const hits = [...pickedSet].filter((l) => correctAnswers.includes(l)).length;
      if (hits === 2) return "perfect";
      if (hits === 1) return "partial";
      return "wrong";
    }
    if (isWeighted && question.scoring_rule?.type === "weighted") {
      // Weighted: highest weight wins
      const pickedWeight = getWeight(question.scoring_rule, pickedSingle ?? "") ?? 0;
      const maxWeight = Math.max(...Object.values(question.scoring_rule.weights));
      if (pickedWeight === maxWeight) return "correct";
      if (pickedWeight >= 0.5) return "partial";
      return "wrong";
    }
    // Standard binary
    return pickedSingle === correctAnswers[0] ? "correct" : "wrong";
  })();

  return (
    <div>
      {/* ── Badges ── */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <VariantBadge variant={question.variant} active />
        <TypeBadge type={displayType} />
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="mono text-xs text-ink-500 ml-auto">
          Vraag #{question.question_number}
        </span>
      </div>

      {/* ── Instruction for Diagnose ── */}
      {isDiagnose && (
        <p className="mono text-[11px] uppercase tracking-[0.2em] text-violet mb-4 flex items-center gap-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-violet" />
          Selecteer de 2 juiste antwoorden (5 opties)
        </p>
      )}

      <h2 className="display text-ink-950 text-3xl lg:text-4xl leading-[1.15]">
        {question.question}
      </h2>

      {/* ── Options ── */}
      <div className="mt-10 space-y-3">
        {letters.map((letter) => {
          const optionText = question.options[letter as keyof typeof question.options];
          if (!optionText) return null;

          const isCorrect = correctAnswers.includes(letter);
          const weight = getWeight(question.scoring_rule, letter);

          // Diagnose multi-select state
          const isPickedMulti = pickedSet.has(letter);
          // Single-select state
          const isPickedSingle = pickedSingle === letter;
          const isPicked = isDiagnose ? isPickedMulti : isPickedSingle;

          const showCorrect = revealed && isCorrect;
          const showWrongPick = revealed && isPicked && !isCorrect;
          const showNeutral = revealed && !isPicked && !isCorrect;

          return (
            <button
              key={letter}
              type="button"
              disabled={revealed}
              onClick={() => {
                if (revealed) return;
                if (isDiagnose) toggleMulti(letter);
                else setPickedSingle(letter);
              }}
              className={cn(
                "w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all group",
                "disabled:cursor-default",
                // pre-reveal
                !revealed && isPicked && "border-violet bg-violet-tint shadow-md",
                !revealed && !isPicked && "border-ink-200 bg-cream-50 hover:border-ink-400 hover:bg-cream-100 hover:translate-x-0.5",
                // post-reveal
                showCorrect && "border-success bg-success-tint shadow-md",
                showWrongPick && "border-error bg-error-tint",
                showNeutral && "border-ink-200 bg-cream-50 opacity-40",
              )}
            >
              <span
                className={cn(
                  "mono flex h-10 w-10 items-center justify-center text-sm shrink-0 rounded-full font-semibold transition",
                  !revealed && isPicked && "bg-violet text-cream-50",
                  !revealed && !isPicked && "bg-cream-200 text-ink-700 group-hover:bg-ink-950 group-hover:text-cream-50",
                  showCorrect && "bg-success text-cream-50",
                  showWrongPick && "bg-error text-cream-50",
                  showNeutral && "bg-cream-200 text-ink-500",
                )}
              >
                {showCorrect ? (
                  <Check className="h-5 w-5" />
                ) : showWrongPick ? (
                  <X className="h-5 w-5" />
                ) : (
                  letter.toUpperCase()
                )}
              </span>

              <span className="flex-1 min-w-0">
                <span
                  className={cn(
                    "text-base leading-relaxed block",
                    showCorrect ? "text-ink-950 font-medium" : !revealed && isPicked ? "text-ink-950" : "text-ink-800",
                  )}
                >
                  {optionText}
                </span>
                {/* Weight display for SJT/BestAlt — only after reveal */}
                {revealed && isWeighted && weight !== null && (
                  <span className="mono text-[10px] uppercase tracking-[0.15em] text-ink-400 mt-1 block">
                    Weging: {(weight * 100).toFixed(0)}%
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── CTA ── */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {!revealed ? (
          <button
            type="button"
            disabled={!canReveal}
            onClick={() => setRevealed(true)}
            className={cn(
              "mono inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all",
              canReveal
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

      {/* ── Feedback panel ── */}
      {revealed && (
        <div
          className={cn(
            "fade-up mt-8 rounded-2xl p-6 border-l-4",
            feedbackResult === "perfect" || feedbackResult === "correct"
              ? "border-success bg-success-tint"
              : feedbackResult === "partial"
                ? "border-ochre bg-ochre-tint"
                : "border-error bg-error-tint",
          )}
        >
          <div
            className={cn(
              "mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2 mb-2",
              feedbackResult === "perfect" || feedbackResult === "correct"
                ? "text-success"
                : feedbackResult === "partial"
                  ? "text-ochre"
                  : "text-error",
            )}
          >
            {feedbackResult === "perfect" || feedbackResult === "correct" ? (
              <><Check className="h-4 w-4" />Correct beantwoord</>
            ) : feedbackResult === "partial" ? (
              <><Check className="h-4 w-4" />Gedeeltelijk correct</>
            ) : (
              <>
                <X className="h-4 w-4" />
                {isDiagnose
                  ? `Juiste antwoorden: ${correctAnswers.map((l) => l.toUpperCase()).join(" en ")}`
                  : isWeighted
                    ? "Niet het optimale antwoord"
                    : `Het juiste antwoord was ${(correctAnswers[0] ?? "").toUpperCase()}`}
              </>
            )}
          </div>

          {isDiagnose && feedbackResult === "partial" && (
            <p className="mono text-xs text-ochre mt-1 mb-2">
              Juiste antwoorden: {correctAnswers.map((l) => l.toUpperCase()).join(" en ")}
            </p>
          )}

          {question.explanation && (
            <p className="mt-1 text-ink-800 leading-relaxed max-w-prose text-sm">
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
