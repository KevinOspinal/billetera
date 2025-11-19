import { formatCurrency } from "@/lib/format";

export default function ExpensesByCategoryChart({ categories = [], currency }) {
  if (!categories.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Sin gastos registrados en los últimos 30 días.</p>;
  }

  return (
    <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
      {categories.map((category) => (
        <li key={category.label} className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-medium text-slate-900 dark:text-slate-100">{category.label}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatCurrency(category.amount, currency)}
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{category.percentage}%</span>
        </li>
      ))}
    </ul>
  );
}
