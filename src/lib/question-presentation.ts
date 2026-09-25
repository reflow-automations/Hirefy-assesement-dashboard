/** Convert legacy storage markers into candidate-facing sections without rewriting content. */
export function splitQuestionText(raw: string): { context: string | null; prompt: string } {
  const text = raw.replace(/\r\n?/g, "\n").trim();
  const match = text.match(/^\[(?:REGEL|CASE|CONSTRAINTS)\]\s*([\s\S]*?)\s+VRAAG:\s*([\s\S]+)$/);
  if (match) return { context: match[1].trim(), prompt: match[2].trim() };
  return { context: null, prompt: text.replace(/^\[(?:REGEL|CASE|CONSTRAINTS)\]\s*/, "") };
}

/** Portable plain text: retain line breaks; do not require HTML, Markdown or storage markers. */
export function candidateQuestionText(raw: string): string {
  const { context, prompt } = splitQuestionText(raw);
  return context ? `${context}\n\n${prompt}` : prompt;
}
