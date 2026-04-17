import { BLOOM_COLOR_VAR, BLOOM_LABEL, BLOOM_TIER } from "@/lib/bloom";
import type { BloomLevel } from "@/lib/types";

export function BloomBadge({
  level,
  compact = false,
}: {
  level: BloomLevel;
  compact?: boolean;
}) {
  return (
    <span
      className="chip"
      style={{
        background: BLOOM_COLOR_VAR[level],
        color: "#fff",
        opacity: 0.92,
      }}
      title={`Bloom niveau ${BLOOM_TIER[level]}`}
    >
      <span
        aria-hidden
        className="mono opacity-70"
        style={{ fontSize: "0.85em" }}
      >
        B{BLOOM_TIER[level]}
      </span>
      {!compact && BLOOM_LABEL[level]}
    </span>
  );
}
