import type { BloomLevel } from "./types";

// Bloom's taxonomy — canonical ordering from low to high cognitive complexity.
export const BLOOM_ORDER: BloomLevel[] = [
  "onthouden",
  "begrijpen",
  "toepassen",
  "analyseren",
  "evalueren",
  "creeren",
];

export const BLOOM_LABEL: Record<BloomLevel, string> = {
  onthouden: "Onthouden",
  begrijpen: "Begrijpen",
  toepassen: "Toepassen",
  analyseren: "Analyseren",
  evalueren: "Evalueren",
  creeren: "Creëren",
};

export const BLOOM_TIER: Record<BloomLevel, number> = {
  onthouden: 1,
  begrijpen: 2,
  toepassen: 3,
  analyseren: 4,
  evalueren: 5,
  creeren: 6,
};

// Descriptions for the About/methodology page.
export const BLOOM_DESCRIPTION: Record<BloomLevel, string> = {
  onthouden: "Feiten en definities reproduceren.",
  begrijpen: "Concepten in eigen woorden uitleggen.",
  toepassen: "Kennis inzetten in bekende situaties.",
  analyseren: "Verbanden leggen en structuren ontleden.",
  evalueren: "Oordelen vellen op basis van criteria.",
  creeren: "Nieuwe oplossingen of ontwerpen formuleren.",
};

// CSS custom properties — mapped cool → warm to communicate complexity.
export const BLOOM_COLOR_VAR: Record<BloomLevel, string> = {
  onthouden: "var(--bloom-1)",
  begrijpen: "var(--bloom-2)",
  toepassen: "var(--bloom-3)",
  analyseren: "var(--bloom-4)",
  evalueren: "var(--bloom-5)",
  creeren: "var(--bloom-6)",
};

/**
 * Normalize a raw bloom_level string from the database to the canonical enum.
 * The database contains both "creeren" and "creëren" due to an LLM generation
 * inconsistency — this function smooths that out and strips diacritics.
 */
export function normalizeBloom(raw: string | null | undefined): BloomLevel | null {
  if (!raw) return null;
  const cleaned = raw
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip combining diacritics
  if ((BLOOM_ORDER as string[]).includes(cleaned)) {
    return cleaned as BloomLevel;
  }
  return null;
}

/** Bloom tiers grouped by question type — used for legend/teaching materials. */
export const BLOOM_BY_QUESTION_TYPE = {
  kennis: ["onthouden", "begrijpen"] as BloomLevel[],
  situatie: ["toepassen", "analyseren"] as BloomLevel[],
  casus: ["evalueren", "creeren"] as BloomLevel[],
};
