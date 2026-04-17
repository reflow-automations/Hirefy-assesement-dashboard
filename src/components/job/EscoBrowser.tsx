"use client";

import { useState } from "react";
import { Donut } from "@/components/viz/Donut";
import { ESCO_COLOR_VAR, ESCO_DESCRIPTION, ESCO_LABEL } from "@/lib/esco";
import type { EscoEntry, EscoType } from "@/lib/types";
import { cn } from "@/lib/cn";

const TYPES: EscoType[] = ["core", "knowledge", "tool"];

const TAB_STYLES: Record<EscoType, { bg: string; text: string; ring: string; dot: string }> = {
  core: {
    bg: "bg-terracotta-tint",
    text: "text-terracotta",
    ring: "ring-terracotta",
    dot: "bg-terracotta",
  },
  knowledge: {
    bg: "bg-teal-tint",
    text: "text-teal",
    ring: "ring-teal",
    dot: "bg-teal",
  },
  tool: {
    bg: "bg-ochre-tint",
    text: "text-ochre",
    ring: "ring-ochre",
    dot: "bg-ochre",
  },
};

export function EscoBrowser({ entries }: { entries: EscoEntry[] }) {
  const [active, setActive] = useState<EscoType>("core");

  const counts = TYPES.reduce(
    (acc, t) => ({ ...acc, [t]: entries.filter((e) => e.type === t).length }),
    {} as Record<EscoType, number>,
  );
  const total = entries.length;
  const filtered = entries.filter((e) => e.type === active);
  const activeStyle = TAB_STYLES[active];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr]">
      {/* Sidebar: donut + tabs */}
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8 rounded-3xl bg-cream-100">
          <Donut
            segments={TYPES.map((t) => ({
              label: ESCO_LABEL[t],
              value: counts[t],
              color: ESCO_COLOR_VAR[t],
            }))}
            centerValue={total}
            centerLabel="Items"
            size={200}
            thickness={24}
          />
        </div>
        <div className="space-y-2">
          {TYPES.map((t) => {
            const s = TAB_STYLES[t];
            const isActive = active === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActive(t)}
                className={cn(
                  "w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all border",
                  isActive
                    ? `${s.bg} border-transparent shadow-sm`
                    : "bg-cream-100 border-ink-200 hover:border-ink-300",
                )}
              >
                <span className={cn("block h-2 w-2 rounded-full", s.dot)} />
                <span
                  className={cn(
                    "flex-1 text-sm font-medium",
                    isActive ? s.text : "text-ink-800",
                  )}
                >
                  {ESCO_LABEL[t]}
                </span>
                <span
                  className={cn(
                    "mono text-xs",
                    isActive ? s.text : "text-ink-500",
                  )}
                >
                  {counts[t]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-3xl bg-cream-100 p-6 lg:p-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
          <h3 className={cn("display text-3xl", activeStyle.text)}>
            {ESCO_LABEL[active]}
          </h3>
          <span className="mono text-xs text-ink-500">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </span>
        </div>
        <p className="text-ink-700 mb-8 max-w-prose leading-relaxed">
          {ESCO_DESCRIPTION[active]}
        </p>
        <ul className="space-y-2">
          {filtered.map((entry, i) => (
            <li
              key={i}
              className="group flex gap-4 p-4 rounded-xl bg-cream-50 ring-1 ring-ink-200 hover:ring-ink-300 hover:shadow-sm transition-all"
            >
              <span
                aria-hidden
                className={cn(
                  "mt-1.5 block h-2 w-2 shrink-0 rounded-full ring-4 transition-transform group-hover:scale-125",
                  activeStyle.dot,
                )}
                style={{
                  boxShadow: `0 0 0 4px ${activeStyle.dot === "bg-terracotta" ? "var(--terracotta-tint)" : activeStyle.dot === "bg-teal" ? "var(--teal-tint)" : "var(--ochre-tint)"}`,
                }}
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-ink-950 font-semibold leading-snug">
                  {entry.vaardigheid}
                </h4>
                {entry.beschrijving && (
                  <p className="mt-1.5 text-sm text-ink-700 leading-relaxed">
                    {entry.beschrijving}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
