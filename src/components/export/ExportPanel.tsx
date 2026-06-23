"use client";

import { useState } from "react";
import { Download, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface JobOption {
  id: number;
  title: string;
}

/**
 * Export-paneel op de catalogus: download alle beroepen in één keer, of klap
 * een selectielijst open om een subset van beroepen te kiezen. Navigeert naar
 * de /api/export route handler (die de .xlsx als download teruggeeft).
 */
export function ExportPanel({ jobs }: { jobs: JobOption[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const allSelected = jobs.length > 0 && selected.size === jobs.length;
  const count = selected.size;

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(jobs.map((j) => j.id)));

  const go = (href: string) => {
    window.location.href = href;
  };

  const downloadSelection = () => {
    if (count === 0) return;
    go(allSelected ? "/api/export" : `/api/export?jobs=${[...selected].join(",")}`);
  };

  return (
    <div className="rounded-3xl border border-ink-200 bg-cream-100 p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-teal inline-flex items-center gap-2">
            <span className="block h-1.5 w-1.5 rounded-full bg-teal" />
            Export
          </span>
          <h3 className="display text-2xl text-ink-950 mt-2">Vragensets exporteren</h3>
          <p className="text-ink-700 mt-1 text-sm">
            Download de vragen als Excel: alle beroepen in één keer, of een selectie.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => go("/api/export")}
            className="mono inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream-50 shadow-sm transition hover:bg-violet"
          >
            <Download className="h-3.5 w-3.5" />
            Alle beroepen
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="mono inline-flex items-center gap-2 rounded-full bg-cream-200 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink-800 transition hover:bg-cream-300"
          >
            Selecteer beroepen
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-6 border-t border-ink-200 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={toggleAll}
              className="mono text-[11px] uppercase tracking-[0.15em] text-violet hover:underline"
            >
              {allSelected ? "Deselecteer alles" : "Selecteer alles"}
            </button>
            <span className="mono text-xs text-ink-500">{count} geselecteerd</span>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => {
              const checked = selected.has(job.id);
              return (
                <li key={job.id}>
                  <button
                    type="button"
                    onClick={() => toggle(job.id)}
                    aria-pressed={checked}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                      checked
                        ? "border-violet bg-violet-tint"
                        : "border-ink-200 bg-cream-50 hover:border-ink-300",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
                        checked
                          ? "border-violet bg-violet text-cream-50"
                          : "border-ink-300",
                      )}
                    >
                      {checked && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="text-sm text-ink-900 leading-snug">{job.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6">
            <button
              type="button"
              onClick={downloadSelection}
              disabled={count === 0}
              className="mono inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-cream-50 shadow-sm transition hover:bg-violet disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {count === 0 ? "Selecteer beroepen" : `Download selectie (${count})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
