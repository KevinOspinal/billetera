import Card from "@/components/ui/Card";
import BudgetProgressBar from "./BudgetProgressBar";

export default function BudgetCard({ budget }) {
  const { category, limit, spent } = budget;
  const progress = Math.round((spent / limit) * 100);

  return (
    <Card className="space-y-3">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{category}</p>
      <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{`$${spent} / $${limit}`}</p>
      <BudgetProgressBar progress={progress} />
      <p className="text-xs text-slate-500 dark:text-slate-400">{progress}% utilizado</p>
    </Card>
  );
}
