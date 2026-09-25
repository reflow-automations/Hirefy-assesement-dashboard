import { splitQuestionText } from "@/lib/question-presentation";
import { cn } from "@/lib/cn";

/** One reading layout for the catalogue, single-question demo and quiz. */
export function QuestionContent({ text, className }: { text: string; className?: string }) {
  const { context, prompt } = splitQuestionText(text);
  return (
    <div
      className={cn("min-w-0 text-ink-950", className)}
      style={{ fontFamily: "var(--font-sans)", fontSize: "1.125rem", lineHeight: 1.65, overflowWrap: "anywhere" }}
      data-question-content
    >
      {context && (
        <div className="mb-5 rounded-xl border border-ink-200 bg-cream-50 p-4 sm:p-5">
          <p className="whitespace-pre-wrap m-0" data-question-context>{context}</p>
        </div>
      )}
      <p className="whitespace-pre-wrap m-0 font-semibold" data-question-prompt>{prompt}</p>
    </div>
  );
}
