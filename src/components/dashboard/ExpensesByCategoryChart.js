import { formatCurrency } from "@/lib/format";

const GRADIENTS = [
  ["#fb7185", "#f43f5e"],
  ["#fbbf24", "#f97316"],
  ["#34d399", "#059669"],
  ["#60a5fa", "#2563eb"],
  ["#c084fc", "#a855f7"],
];

export default function ExpensesByCategoryChart({ categories = [], currency }) {
  if (!categories.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Sin gastos registrados en los últimos 30 días.</p>;
  }

  const sorted = [...categories].sort((a, b) => Number(b.amount ?? 0) - Number(a.amount ?? 0));

  return (
    <div className="space-y-4">
      {sorted.map((category, index) => {
        const gradient = GRADIENTS[index % GRADIENTS.length];
        const percentage = category.percentage ?? Math.round((category.amount / sorted.reduce((sum, item) => sum + (item.amount ?? 0), 0)) * 100);

        return (
          <div key={category.label} className="space-y-1 rounded-2xl border border-slate-800/40 bg-slate-900/30 px-4 py-3">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
                />
                <p className="font-semibold text-slate-100">{category.label}</p>
              </div>
              <p className="text-xs uppercase tracking-wide text-slate-400">{percentage}%</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold text-slate-100">{formatCurrency(category.amount, currency)}</p>
              <p className="text-xs text-slate-400">Objetivo mensual</p>
            </div>
            <div className="h-2 rounded-full bg-slate-800/80">
              <div
                className="h-full rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
