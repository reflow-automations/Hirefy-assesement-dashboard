import type { EscoType } from "./types";

export const ESCO_LABEL: Record<EscoType, string> = {
  core: "Kerncompetenties",
  knowledge: "Kennis",
  tool: "Gereedschap & technieken",
};

export const ESCO_DESCRIPTION: Record<EscoType, string> = {
  core: "Gedragsmatige en transversale vaardigheden die het beroep structureel definiëren.",
  knowledge: "Theoretische fundamenten en domeinkennis die vereist zijn.",
  tool: "Concrete instrumenten, methodes en technieken die toegepast worden.",
};

export const ESCO_COLOR_VAR: Record<EscoType, string> = {
  core: "var(--esco-core)",
  knowledge: "var(--esco-knowledge)",
  tool: "var(--esco-tool)",
};
