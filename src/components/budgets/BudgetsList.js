import BudgetCard from "./BudgetCard";

export default function BudgetsList({ budgets = [], currency = "COP", onEdit, onDelete }) {
  if (!budgets.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
        Aún no tienes presupuestos registrados. Crea uno para controlar tus gastos por categoría.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {budgets.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} currency={currency} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
