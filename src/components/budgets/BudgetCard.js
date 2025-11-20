import Card from "@/components/ui/Card";
import BudgetProgressBar from "./BudgetProgressBar";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";

export default function BudgetCard({ budget, currency = "COP", onEdit, onDelete }) {
  const progress = Math.max(0, Math.min(100, Number(budget.usage ?? 0)));

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{budget.categoryName}</p>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{budget.period}</span>
      </div>
      <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        {`${formatCurrency(budget.spentAmount, currency)} / ${formatCurrency(budget.limitAmount, currency)}`}
      </p>
      <BudgetProgressBar progress={progress} />
      <p className="text-xs text-slate-500 dark:text-slate-400">{progress}% utilizado</p>
      <div className="flex justify-end gap-2 pt-2">
        {onEdit ? (
          <Button size="sm" variant="ghost" onClick={() => onEdit(budget)}>
            Editar
          </Button>
        ) : null}
        {onDelete ? (
          <Button size="sm" variant="ghost" onClick={() => onDelete(budget)}>
            Eliminar
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
