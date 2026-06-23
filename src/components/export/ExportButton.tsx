import { Download } from "lucide-react";

/**
 * Download-knop die naar de export route handler (/api/export) navigeert.
 * Read-only; de handler zet zelf de bestandsnaam via Content-Disposition.
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
      className="mono inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-ink-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-cream-50 shadow-sm transition hover:bg-violet"
    >
      <Download className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}
