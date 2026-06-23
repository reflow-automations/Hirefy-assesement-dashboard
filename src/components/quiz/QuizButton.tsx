import Link from "next/link";
import { Play } from "lucide-react";

/**
 * Link-knop naar de quiz van een beroep. Kleur hard via inline style omdat de
 * globale unlayered `a { color: inherit }`-regel Tailwind's text-utility anders
 * overschrijft (zie ExportButton).
 */
export function QuizButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      style={{ color: "var(--cream-50)" }}
      className="mono inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-violet px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] shadow-sm transition hover:bg-ink-950"
    >
      <Play className="h-3.5 w-3.5" />
      Start quiz
    </Link>
  );
}
