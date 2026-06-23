"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Lange tekst inklapbaar tonen met een "Lees meer"-knop. Korte tekst
 * (onder `threshold` tekens) wordt gewoon volledig getoond zonder knop.
 */
export function ExpandableText({
  text,
  clampLines = 6,
  threshold = 280,
  className,
}: {
  text: string;
  clampLines?: number;
  threshold?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const needsToggle = text.length > threshold;

  if (!needsToggle) {
    return (
      <p className={cn("whitespace-pre-line leading-relaxed", className)}>{text}</p>
    );
  }

  return (
    <div>
      <p
        className={cn("whitespace-pre-line leading-relaxed", className)}
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: clampLines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mono mt-3 inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-700 transition hover:bg-cream-300"
      >
        {expanded ? "Lees minder" : "Lees meer"}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")}
        />
      </button>
    </div>
  );
}
