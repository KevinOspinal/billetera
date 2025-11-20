import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";

const COLORS = ["#fb7185", "#facc15", "#34d399", "#60a5fa", "#c084fc"];

export default function ExpensesDonutChart({ categories = [], currency = "COP" }) {
  const total = categories.reduce((sum, category) => sum + Number(category.amount ?? 0), 0);
  const slices = categories
    .map((category, index) => ({
      label: category.label ?? `Categoría ${index + 1}`,
      amount: Number(category.amount ?? 0),
      percentage: total ? Math.round((Number(category.amount ?? 0) / total) * 100) : 0,
      color: COLORS[index % COLORS.length],
    }))
    .filter((slice) => slice.amount > 0);

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const circleSlices = [];
  let cumulative = 0;
  slices.forEach((slice) => {
    const fraction = total ? slice.amount / total : 0;
    const dash = fraction * circumference;
    circleSlices.push({ slice, dash, offset: cumulative });
    cumulative += dash;
  });

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Por categoría</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Desglose de gastos</h3>
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative mx-auto h-56 w-56">
          <svg viewBox="0 0 140 140" className="h-full w-full">
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(15,23,42,0.4)" />
              </filter>
            </defs>
            <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(226,232,240,0.15)" strokeWidth="14" />
            {circleSlices.map(({ slice, dash, offset }) => (
              <circle
                key={slice.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth="14"
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                filter="url(#shadow)"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Total</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">{formatCurrency(total, currency)}</p>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {slices.length ? (
            slices.map((slice) => (
              <div
                key={slice.label}
                className="flex items-center justify-between rounded-xl border border-slate-800/40 bg-slate-900/20 px-3 py-2 text-sm text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                  <span className="font-medium text-slate-100">{slice.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-50">{formatCurrency(slice.amount, currency)}</p>
                  <p className="text-xs text-slate-500">{slice.percentage}%</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Aún no registras gastos este mes.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
