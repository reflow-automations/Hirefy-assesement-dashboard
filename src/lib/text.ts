/**
 * Parse hierarchical strings like "2511 – Systeemanalisten" into code + label.
 * Handles both en-dash (–) and hyphen (-).
 */
export function parseHierarchical(input: string | null | undefined): {
  code: string | null;
  label: string;
} {
  if (!input) return { code: null, label: "" };
  const match = input.match(/^(\S+)\s*[–-]\s*(.+)$/);
  if (match) return { code: match[1], label: match[2].trim() };
  return { code: null, label: input.trim() };
}

/** Deslugify an ESCO-style title: "artificiële-intelligentie-ingenieur" → "Artificiële intelligentie-ingenieur". */
export function humanizeTitle(slug: string): string {
  const spaced = slug.replace(/-/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
