import type { QuestionVariant } from "@/lib/types";
import { cn } from "@/lib/cn";

export function VariantBadge({
  variant,
  active = false,
}: {
  variant: QuestionVariant;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "mono inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition",
        active
          ? "bg-ink-950 text-cream-50 shadow-sm"
          : "bg-cream-200 text-ink-800 ring-1 ring-ink-200",
      )}
    >
      {variant}
    </span>
  );
}
