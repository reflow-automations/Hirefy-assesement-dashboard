"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
} from "lucide-react";
import type { Question, ScoringRule } from "@/lib/types";
import { TypeBadge, DifficultyBadge } from "@/components/question/TypeBadge";
import { VariantBadge } from "@/components/question/VariantBadge";
import { cn } from "@/lib/cn";

// ── Helpers ──────────────────────────────────────────────────────────────────
function parseCorrect(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}
function getLetters(q: Question): string[] {
  return q.options.e !== undefined ? ["a", "b", "c", "d", "e"] : ["a", "b", "c", "d"];
}
function getWeight(rule: ScoringRule | null, letter: string): number | null {
  if (!rule || rule.type !== "weighted") return null;
  return rule.weights[letter] ?? null;
}

// Weergave-labels per positie. De onderliggende optie-identiteit blijft de
// originele letter (a–e); we husselen alleen de volgorde waarin ze getoond worden.
const LABELS = ["A", "B", "C", "D", "E"];

function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOrders(questions: Question[]): Record<number, string[]> {
  const orders: Record<number, string[]> = {};
  questions.forEach((q, i) => {
    orders[i] = shuffle(getLetters(q));
  });
  return orders;
}

interface AnswerState {
  picked: string[];
  revealed: boolean;
}

function isCorrect(q: Question, a: AnswerState | undefined): boolean {
  if (!a?.revealed) return false;
  const correct = parseCorrect(q.correct_answer);
  if (q.item_type === "Diagnose" || q.options.e !== undefined) {
    return a.picked.length === 2 && a.picked.every((l) => correct.includes(l));
  }
  if (
    (q.item_type === "SJT" || q.item_type === "BestAlt") &&
    q.scoring_rule?.type === "weighted"
  ) {
    const weights = q.scoring_rule.weights;
    const max = Math.max(...Object.values(weights));
    return (weights[a.picked[0]] ?? -1) === max;
  }
  return a.picked[0] === correct[0];
}

// ── Component ────────────────────────────────────────────────────────────────
export function QuizRunner({
  questions,
  jobTitle,
  jobId,
  skillNames,
}: {
  questions: Question[];
  jobTitle: string;
  jobId: number;
  skillNames: Record<number, string>;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [finished, setFinished] = useState(false);
  // Gehusselde optie-volgorde per vraag. Leeg bij SSR/eerste render (natuurlijke
  // volgorde) en pas client-side geshuffeld in de effect → geen hydration-mismatch.
  const [orders, setOrders] = useState<Record<number, string[]>>({});
  useEffect(() => {
    setOrders(buildOrders(questions));
  }, [questions]);

  const total = questions.length;

  if (total === 0) {
    return (
      <div className="rounded-3xl border border-ink-200 bg-cream-100 p-10 text-center">
        <p className="display text-2xl text-ink-900">Geen vragen gevonden</p>
        <p className="mt-2 text-ink-600">Dit beroep heeft nog geen vragen.</p>
        <Link
          href={`/jobs/${jobId}`}
          className="mono mt-6 inline-block text-xs uppercase tracking-[0.15em] text-violet hover:underline"
        >
          Terug naar beroep
        </Link>
      </div>
    );
  }

  const correctCount = questions.reduce(
    (n, q, i) => n + (isCorrect(q, answers[i]) ? 1 : 0),
    0,
  );
  const answeredCount = Object.values(answers).filter((a) => a.revealed).length;

  // ── Resultaatscherm ──
  if (finished) {
    const pct = answeredCount > 0 ? Math.round((correctCount / total) * 100) : 0;
    return (
      <div className="rounded-3xl border border-ink-200 bg-cream-100 p-8 lg:p-12 text-center">
        <Trophy className="mx-auto h-12 w-12 text-ochre" strokeWidth={1.5} />
        <h2 className="display text-ink-950 mt-4 text-3xl">Quiz afgerond</h2>
        <p className="mt-3 text-ink-700">
          Je had <span className="font-semibold text-ink-950">{correctCount}</span> van{" "}
          {total} vragen goed ({pct}%).
        </p>
        {answeredCount < total && (
          <p className="mono mt-1 text-xs text-ink-500">
            {total - answeredCount} vragen overgeslagen
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setIndex(0);
              setFinished(false);
              setOrders(buildOrders(questions));
            }}
            className="mono inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-cream-50 transition hover:bg-violet"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Opnieuw
          </button>
          <Link
            href={`/jobs/${jobId}`}
            style={{ color: "var(--ink-800)" }}
            className="mono inline-flex items-center gap-2 rounded-full bg-cream-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition hover:bg-cream-300"
          >
            Terug naar beroep
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const ans = answers[index] ?? { picked: [], revealed: false };
  const order = orders[index] ?? getLetters(q);
  const displayLabelOf = (letter: string) => {
    const pos = order.indexOf(letter);
    return pos >= 0 ? LABELS[pos] : letter.toUpperCase();
  };
  const correct = parseCorrect(q.correct_answer);
  const isDiagnose = q.item_type === "Diagnose" || q.options.e !== undefined;
  const isWeighted = q.item_type === "SJT" || q.item_type === "BestAlt";
  const displayType = q.item_type ?? q.type;
  const isLast = index === total - 1;

  const setAns = (next: AnswerState) =>
    setAnswers((prev) => ({ ...prev, [index]: next }));

  const pick = (letter: string) => {
    if (ans.revealed) return;
    if (isDiagnose) {
      const has = ans.picked.includes(letter);
      const picked = has
        ? ans.picked.filter((l) => l !== letter)
        : ans.picked.length < 2
          ? [...ans.picked, letter]
          : ans.picked;
      setAns({ picked, revealed: picked.length === 2 });
    } else {
      setAns({ picked: [letter], revealed: true });
    }
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => {
    if (isLast) setFinished(true);
    else setIndex((i) => Math.min(total - 1, i + 1));
  };

  const questionCorrect = isCorrect(q, ans);

  return (
    <div>
      {/* Voortgang */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="mono text-xs text-ink-500">
            Vraag {index + 1} / {total}
          </span>
          <span className="mono text-xs text-ink-500">
            {correctCount} goed · {answeredCount} beantwoord
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-violet transition-all"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-ink-200 bg-cream-100 p-6 lg:p-10">
        {/* Badges */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <VariantBadge variant={q.variant} active />
          <TypeBadge type={displayType} />
          <DifficultyBadge difficulty={q.difficulty} />
          {skillNames[q.skill_id] && (
            <span className="chip bg-cream-200 text-ink-700">
              {skillNames[q.skill_id]}
            </span>
          )}
        </div>

        {isDiagnose && (
          <p className="mono mb-4 text-[11px] uppercase tracking-[0.2em] text-violet">
            Selecteer de 2 juiste antwoorden
          </p>
        )}

        <h2 className="text-ink-950 text-lg lg:text-xl font-medium leading-relaxed">
          {q.question}
        </h2>

        {/* Opties */}
        <div className="mt-8 space-y-3">
          {order.map((letter, i) => {
            const text = q.options[letter as keyof typeof q.options];
            if (!text) return null;
            const optionCorrect = correct.includes(letter);
            const picked = ans.picked.includes(letter);
            const showCorrect = ans.revealed && optionCorrect;
            const showWrong = ans.revealed && picked && !optionCorrect;
            const weight = getWeight(q.scoring_rule, letter);

            return (
              <button
                key={letter}
                type="button"
                disabled={ans.revealed}
                onClick={() => pick(letter)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all disabled:cursor-default",
                  !ans.revealed && picked && "border-violet bg-violet-tint",
                  !ans.revealed && !picked && "border-ink-200 bg-cream-50 hover:border-ink-400 hover:bg-cream-100",
                  showCorrect && "border-success bg-success-tint",
                  showWrong && "border-error bg-error-tint",
                  ans.revealed && !showCorrect && !showWrong && "border-ink-200 bg-cream-50 opacity-50",
                )}
              >
                <span
                  className={cn(
                    "mono flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    !ans.revealed && picked && "bg-violet text-cream-50",
                    !ans.revealed && !picked && "bg-cream-200 text-ink-700",
                    showCorrect && "bg-success text-cream-50",
                    showWrong && "bg-error text-cream-50",
                    ans.revealed && !showCorrect && !showWrong && "bg-cream-200 text-ink-500",
                  )}
                >
                  {showCorrect ? (
                    <Check className="h-4 w-4" />
                  ) : showWrong ? (
                    <X className="h-4 w-4" />
                  ) : (
                    LABELS[i]
                  )}
                </span>
                <span className="flex-1 self-center">
                  <span className="block text-sm leading-relaxed text-ink-900">{text}</span>
                  {ans.revealed && isWeighted && weight !== null && (
                    <span className="mono mt-1 block text-[10px] uppercase tracking-[0.15em] text-ink-400">
                      Weging: {(weight * 100).toFixed(0)}%
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {ans.revealed && (
          <div
            className={cn(
              "mt-6 rounded-2xl border-l-4 p-5",
              questionCorrect ? "border-success bg-success-tint" : "border-error bg-error-tint",
            )}
          >
            <div
              className={cn(
                "mono flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]",
                questionCorrect ? "text-success" : "text-error",
              )}
            >
              {questionCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {questionCorrect
                ? "Goed"
                : isDiagnose
                  ? `Juiste antwoorden: ${correct.map(displayLabelOf).join(" en ")}`
                  : isWeighted
                    ? "Niet het optimale antwoord"
                    : `Juiste antwoord: ${displayLabelOf(correct[0] ?? "")}`}
            </div>
            {q.explanation && (
              <p className="mt-2 text-sm leading-relaxed text-ink-800">{q.explanation}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigatie */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="mono inline-flex items-center gap-2 rounded-full bg-cream-200 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink-800 transition hover:bg-cream-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Vorige
        </button>
        <button
          type="button"
          onClick={goNext}
          className="mono inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream-50 shadow-sm transition hover:bg-violet"
        >
          {isLast ? "Bekijk resultaat" : "Volgende"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
