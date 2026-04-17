export function ProgressRing({
  value,
  max = 100,
  size = 120,
  thickness = 10,
  color = "var(--violet)",
  trackColor = "var(--cream-200)",
  centerValue,
  centerLabel,
}: {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  centerValue?: string | number;
  centerLabel?: string;
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, Math.max(0, value / max));
  const dash = circumference * pct;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          style={{ transition: "stroke-dasharray 700ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {centerValue !== undefined && (
          <span className="display text-3xl leading-none text-ink-950">
            {centerValue}
          </span>
        )}
        {centerLabel && (
          <span className="mono mt-1.5 text-[9px] uppercase tracking-[0.18em] text-ink-500">
            {centerLabel}
          </span>
        )}
      </div>
    </div>
  );
}
