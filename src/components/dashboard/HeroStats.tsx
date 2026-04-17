import { MetricTile } from "@/components/viz/MetricTile";
import type { DashboardData } from "@/lib/queries/dashboard";

export function HeroStats({ data }: { data: DashboardData["totals"] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
      <MetricTile label="Beroepen" value={data.jobs} accent="terracotta" />
      <MetricTile label="Vaardigheden" value={data.skills} accent="teal" />
      <MetricTile label="Vragen" value={data.questions} accent="ochre" />
      <MetricTile label="Varianten A·B" value={data.variantPairs} accent="violet" />
      <MetricTile
        label="In ESCO"
        value={data.escoPercentage}
        suffix="%"
        accent="terracotta"
      />
      <MetricTile
        label="Ø / skill"
        value={data.avgQuestionsPerSkill}
        accent="teal"
      />
    </div>
  );
}
