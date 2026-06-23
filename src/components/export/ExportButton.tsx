import { Download } from "lucide-react";

/**
 * Download-knop die naar de export route handler (/api/export) navigeert.
 * Read-only; de handler zet zelf de bestandsnaam via Content-Disposition.
 *
 * NB: dit is een <a>. De globale CSS heeft een unlayered `a { color: inherit }`
 * + `a:hover { color: violet }` die Tailwind's text-utility overschrijft, dus
 * de tekstkleur staat hier hard via inline style (wint van de selector).
 */
export function ExportButton({
  href,
  label = "Download .xlsx",
}: {
  href: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      style={{ color: "var(--cream-50)" }}
      className="mono inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-ink-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] shadow-sm ring-1 ring-ink-200 transition hover:bg-violet"
    >
      <Download className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}
