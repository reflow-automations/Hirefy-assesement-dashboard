import { AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import type { DashboardData } from "@/lib/queries/dashboard";

export function QualityPanel({
  content,
  totalQuestions,
}: {
  content: DashboardData["content"];
  totalQuestions: number;
}) {
  const longestCorrectPct = totalQuestions
    ? Math.round((content.correctIsLongest / totalQuestions) * 100)
    : 0;
  const highSpreadPct = totalQuestions
    ? Math.round((content.highLengthSpread / totalQuestions) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Char counts */}
      <div className="rounded-3xl bg-cream-100 p-8 ring-1 ring-ink-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-tint">
            <FileText className="h-5 w-5 text-teal" />
          </span>
          <div>
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-500 block mb-0.5">
              Gemiddelde lengtes
            </span>
            <h3 className="display text-xl text-ink-950 leading-none">
              Inhoudsdiepte
            </h3>
          </div>
        </div>

        <div className="space-y-5">
          <LengthRow
            label="Vraag"
            value={content.avgQuestionChars}
            suffix="tekens"
            color="var(--teal)"
            max={400}
          />
          <LengthRow
            label="Optie (a/b/c/d)"
            value={content.avgOptionChars}
            suffix="tekens"
            color="var(--ochre)"
            max={400}
          />
          <LengthRow
            label="Toelichting"
            value={content.avgExplanationChars}
            suffix="tekens"
            color="var(--terracotta)"
            max={400}
          />
        </div>

        <div className="mt-6 pt-5 border-t border-ink-200 grid grid-cols-2 gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
              Kortste vraag
            </div>
            <div className="display text-2xl text-ink-950 mt-1">
              {content.shortestQuestionChars}
            </div>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
              Langste vraag
            </div>
            <div className="display text-2xl text-ink-950 mt-1">
              {content.longestQuestionChars}
            </div>
          </div>
        </div>
      </div>

      {/* Quality flags */}
      <div className="rounded-3xl bg-gradient-to-br from-cream-100 to-ochre-tint p-8 ring-1 ring-ink-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-tint">
            <CheckCircle2 className="h-5 w-5 text-violet" />
          </span>
          <div>
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-500 block mb-0.5">
              Kwaliteitscontrole
            </span>
            <h3 className="display text-xl text-ink-950 leading-none">
              Antwoord-parity
            </h3>
          </div>
        </div>

        <p className="text-sm text-ink-700 mb-6 leading-relaxed">
          De belangrijkste kwaliteitsregel in de pipeline: antwoordlengte mag
          geen aanwijzing zijn voor correctheid. Twee signalen houden we in de
          gaten:
        </p>

        <div className="space-y-4">
          <QualityFlag
            label="Correct antwoord is (strikt) langste"
            count={content.correctIsLongest}
            pct={longestCorrectPct}
            total={totalQuestions}
            warnAbove={20}
          />
          <QualityFlag
            label="Grote lengte-spreiding (max > 2× min)"
            count={content.highLengthSpread}
            pct={highSpreadPct}
            total={totalQuestions}
            warnAbove={15}
          />
        </div>

        <p className="mt-6 text-xs text-ink-500 leading-relaxed">
          Lage scores = betere kwaliteit. Hoge scores wijzen op vragen die
          herzien zouden kunnen worden.
        </p>
      </div>
    </div>
  );
}

function LengthRow({
  label,
  value,
  suffix,
  color,
  max,
}: {
  label: string;
  value: number;
  suffix?: string;
  color: string;
  max: number;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm text-ink-800 font-medium">{label}</span>
        <span className="mono text-xs text-ink-500">
          Ø {value}
          {suffix && ` ${suffix}`}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-cream-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function QualityFlag({
  label,
  count,
  pct,
  total,
  warnAbove,
}: {
  label: string;
  count: number;
  pct: number;
  total: number;
  warnAbove: number;
}) {
  const isWarn = pct > warnAbove;
  return (
    <div
      className={`rounded-2xl border-l-4 p-4 ${
        isWarn
          ? "bg-error-tint border-error"
          : "bg-success-tint border-success"
      }`}
    >
      <div className="flex items-center gap-3">
        {isWarn ? (
          <AlertTriangle className="h-5 w-5 text-error shrink-0" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-ink-950">{label}</div>
          <div className="mono text-xs text-ink-700 mt-0.5">
            {count} van {total} vragen · {pct}%
          </div>
        </div>
        <div
          className={`display text-3xl leading-none ${
            isWarn ? "text-error" : "text-success"
          }`}
        >
          {pct}
          <span className="mono text-sm ml-0.5">%</span>
        </div>
      </div>
    </div>
  );
}
