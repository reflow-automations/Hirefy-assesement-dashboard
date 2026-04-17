interface Row {
  label: string;
  value: number;
  color: string;
  suffix?: string;
}

export function HorizontalBar({
  rows,
  max,
}: {
  rows: Row[];
  /** Override the max; defaults to max(rows.value) */
  max?: number;
}) {
  const localMax = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="space-y-3">
      {rows.map((r, i) => {
        const pct = (r.value / localMax) * 100;
        return (
          <div key={i}>
            <div className="flex items-baseline justify-between text-sm mb-1.5">
              <span className="text-ink-800 font-medium flex items-center gap-2">
                <span
                  aria-hidden
                  className="block h-2 w-2 rounded-full"
                  style={{ background: r.color }}
                />
                {r.label}
              </span>
              <span className="mono text-xs text-ink-500">
                {r.value}
                {r.suffix}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-cream-200 overflow-hidden ring-1 ring-ink-200/50">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  background: r.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
