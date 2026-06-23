"use client";

import { useState, useTransition } from "react";
import { Check, Save, X } from "lucide-react";
import { updateQuestion } from "@/app/actions/questions";
import type { Question, QuestionOptions } from "@/lib/types";
import { cn } from "@/lib/cn";

function lettersOf(opts: QuestionOptions): string[] {
  return opts.e !== undefined ? ["a", "b", "c", "d", "e"] : ["a", "b", "c", "d"];
}

function parseCorrect(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

const FIELD =
  "w-full rounded-xl border border-ink-200 bg-cream-50 p-3 text-sm leading-relaxed text-ink-900 transition focus:border-violet focus:outline-none focus:ring-2 focus:ring-violet/20";

/**
 * Inline bewerkformulier voor één vraag. Wijzigt alleen de INHOUD
 * (vraag, opties, juist antwoord, toelichting); de review-status blijft ongemoeid.
 */
export function QuestionEditor({
  question,
  onCancel,
  onSaved,
  embedded = false,
}: {
  question: Question;
  onCancel: () => void;
  onSaved: (updated: Question) => void;
  embedded?: boolean;
}) {
  const letters = lettersOf(question.options);
  const isMulti =
    question.item_type === "Diagnose" || question.options.e !== undefined;
  const src = question.options as unknown as Record<string, string | undefined>;

  const [vraag, setVraag] = useState(question.question);
  const [opts, setOpts] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    for (const l of letters) o[l] = src[l] ?? "";
    return o;
  });
  const [correct, setCorrect] = useState<Set<string>>(
    () => new Set(parseCorrect(question.correct_answer)),
  );
  const [toelichting, setToelichting] = useState(question.explanation ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggleCorrect = (l: string) => {
    setCorrect((prev) => {
      const next = new Set(prev);
      if (isMulti) {
        if (next.has(l)) next.delete(l);
        else next.add(l);
      } else {
        next.clear();
        next.add(l);
      }
      return next;
    });
  };

  const save = () => {
    setError(null);
    if (!vraag.trim()) {
      setError("Vraag mag niet leeg zijn");
      return;
    }
    for (const l of letters) {
      if (!opts[l]?.trim()) {
        setError(`Optie ${l.toUpperCase()} mag niet leeg zijn`);
        return;
      }
    }
    if (correct.size === 0) {
      setError("Selecteer minstens één juist antwoord");
      return;
    }

    const orderedCorrect = letters.filter((l) => correct.has(l));
    const optionsPayload: QuestionOptions = {
      a: opts.a,
      b: opts.b,
      c: opts.c,
      d: opts.d,
      ...(letters.includes("e") ? { e: opts.e } : {}),
    };
    const explanationPayload = toelichting.trim() ? toelichting : null;
    const correctPayload = orderedCorrect.join(",");

    startTransition(async () => {
      const res = await updateQuestion({
        id: question.id,
        question: vraag,
        options: optionsPayload,
        correct_answer: correctPayload,
        explanation: explanationPayload,
      });
      if (res.ok) {
        onSaved({
          ...question,
          question: vraag,
          options: optionsPayload,
          correct_answer: correctPayload,
          explanation: explanationPayload,
        });
      } else {
        setError(res.error ?? "Opslaan mislukt");
      }
    });
  };

  const Tag = embedded ? "div" : "article";

  return (
    <Tag
      className={cn(
        !embedded &&
          "rounded-2xl border border-ink-200 border-l-4 border-l-violet bg-cream-100 p-6 lg:p-8",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
          Vraag {question.question_number} bewerken
        </span>
      </div>

      <label className="mono mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-ink-500">
        Vraag
      </label>
      <textarea
        value={vraag}
        onChange={(e) => setVraag(e.target.value)}
        rows={3}
        className={FIELD}
      />

      <div className="mt-5">
        <label className="mono mb-2 block text-[10px] uppercase tracking-[0.18em] text-ink-500">
          Antwoordopties{" "}
          <span className="text-ink-400">
            {isMulti
              ? "· klik de letters van de juiste antwoorden"
              : "· klik de letter van het juiste antwoord"}
          </span>
        </label>
        <div className="space-y-2">
          {letters.map((l) => {
            const isCorrect = correct.has(l);
            return (
              <div key={l} className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => toggleCorrect(l)}
                  aria-label={`Markeer optie ${l.toUpperCase()} als juist`}
                  aria-pressed={isCorrect}
                  className={cn(
                    "mono mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition",
                    isCorrect
                      ? "bg-success text-cream-50"
                      : "bg-cream-200 text-ink-700 hover:bg-ink-950 hover:text-cream-50",
                  )}
                >
                  {isCorrect ? <Check className="h-4 w-4" /> : l.toUpperCase()}
                </button>
                <textarea
                  value={opts[l]}
                  onChange={(e) =>
                    setOpts((prev) => ({ ...prev, [l]: e.target.value }))
                  }
                  rows={2}
                  className={FIELD}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <label className="mono mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-ink-500">
          Toelichting
        </label>
        <textarea
          value={toelichting}
          onChange={(e) => setToelichting(e.target.value)}
          rows={3}
          className={FIELD}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg border-l-4 border-error bg-error-tint px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="mono inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream-50 shadow-sm transition hover:bg-violet disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {pending ? "Opslaan…" : "Opslaan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="mono inline-flex items-center gap-2 rounded-full bg-cream-200 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink-800 transition hover:bg-cream-300 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
          Annuleren
        </button>
      </div>
    </Tag>
  );
}
