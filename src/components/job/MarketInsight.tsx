import { Quote } from "lucide-react";

export function MarketInsight({ insight }: { insight: string | null }) {
  if (!insight) return null;
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ochre-tint via-terracotta-tint to-cream-100 p-8 lg:p-12 ring-1 ring-ochre/20">
      <Quote
        aria-hidden
        className="absolute -top-2 -left-2 h-24 w-24 text-ochre/20"
        strokeWidth={1}
      />
      <div className="relative">
        <span className="mono text-[11px] uppercase tracking-[0.2em] text-terracotta mb-4 inline-flex items-center gap-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-terracotta" />
          Marktinzicht · 2026
        </span>
        <p className="display text-2xl lg:text-4xl leading-[1.15] text-ink-950 italic max-w-3xl">
          &ldquo;{insight}&rdquo;
        </p>
      </div>
    </div>
  );
}
