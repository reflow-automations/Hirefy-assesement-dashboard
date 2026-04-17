import type { QuestionType } from "@/lib/types";

const TYPE_LABEL: Record<QuestionType, string> = {
  kennis: "Kennis",
  situatie: "Situationeel",
  casus: "Casus",
};

const TYPE_STYLE: Record<QuestionType, { bg: string; text: string; dot: string }> = {
  kennis: {
    bg: "bg-teal-tint",
    text: "text-teal",
    dot: "bg-teal",
  },
  situatie: {
    bg: "bg-ochre-tint",
    text: "text-ochre",
    dot: "bg-ochre",
  },
  casus: {
    bg: "bg-terracotta-tint",
    text: "text-terracotta",
    dot: "bg-terracotta",
  },
};

export function TypeBadge({ type }: { type: QuestionType }) {
  const s = TYPE_STYLE[type];
  return (
    <span className={`chip ${s.bg} ${s.text}`}>
      <span className={`block h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {TYPE_LABEL[type]}
    </span>
  );
}
