import { MetricTile } from "@/components/viz/MetricTile";
import type { Stats } from "@/lib/types";

export function StatsStrip({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
      <MetricTile label="Beroepen" value={stats.jobs} accent="terracotta" />
      <MetricTile label="Vaardigheden" value={stats.skills} accent="teal" />
      <MetricTile label="Vragen" value={stats.questions} accent="ochre" />
      <MetricTile
        label="In ESCO"
        value={stats.escoPercentage}
        suffix="%"
        accent="violet"
      />
    </div>
  );
}
