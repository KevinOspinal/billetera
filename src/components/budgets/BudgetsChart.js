import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";

export default function BudgetsChart({ budgets = [], currency = "COP" }) {
  if (!budgets.length) {
    return null;
  }

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Distribución de gasto</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Límites vs. consumo</h3>
      </div>
      <div className="space-y-4">
        {budgets.map((budget) => {
          const usage = budget.limit > 0 ? Math.min(100, Math.round((budget.spent / budget.limit) * 100)) : 0;
          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
                <span className="font-medium text-slate-900 dark:text-slate-100">{budget.label}</span>
                <span>
                  {formatCurrency(budget.spent, currency)} / {formatCurrency(budget.limit, currency)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
                  style={{ width: `${usage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
