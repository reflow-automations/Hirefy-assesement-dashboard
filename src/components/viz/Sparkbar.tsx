/**
 * Compact horizontal bar — renders proportional colored segments side-by-side.
 * Used for per-row Bloom mini-charts in the skills table.
 */
export function Sparkbar({
  segments,
  height = 6,
}: {
  segments: { value: number; color: string; label?: string }[];
  height?: number;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  return (
    <div
      className="flex w-full overflow-hidden rounded-full bg-cream-200 ring-1 ring-ink-200/40"
      style={{ height }}
    >
      {segments.map((s, i) =>
        s.value === 0 ? null : (
          <div
            key={i}
            style={{
              width: `${(s.value / total) * 100}%`,
              background: s.color,
            }}
            title={s.label ? `${s.label}: ${s.value}` : `${s.value}`}
          />
        ),
      )}
    </div>
  );
}
