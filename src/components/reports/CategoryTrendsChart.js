import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";

const COLORS = ["from-sky-400 to-cyan-500", "from-rose-400 to-orange-400", "from-fuchsia-400 to-purple-500", "from-emerald-400 to-lime-500", "from-indigo-400 to-blue-500"];

export default function CategoryTrendsChart({ categories = [], currency = "COP" }) {
  const total = categories.reduce((sum, category) => sum + Number(category.amount ?? 0), 0);
  const safeCategories = categories.length
    ? categories
    : [{ label: "Aún no hay movimientos", amount: 0, percentage: 0 }];

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Distribución</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Gastos por categoría</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Total analizado: {formatCurrency(total, currency)}</p>
      </div>
      <ul className="space-y-4">
        {safeCategories.map((category, index) => {
          const color = COLORS[index % COLORS.length];
          const progress = Math.min(100, category.percentage ?? 0);
          return (
            <li key={`${category.label}-${index}`} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
                <span className="font-medium text-slate-900 dark:text-slate-100">{category.label}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(category.amount ?? 0, currency)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${progress}%` }} />
                </div>
                <span>{progress}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
