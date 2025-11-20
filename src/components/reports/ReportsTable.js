import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";

function formatChange(current, previous) {
  const diff = Number(current ?? 0) - Number(previous ?? 0);
  const diffPercent = previous ? (diff / previous) * 100 : null;
  const sign = diff > 0 ? "+" : "";
  return {
    diff,
    label: diffPercent !== null ? `${sign}${diffPercent.toFixed(1)}% vs periodo anterior` : "",
  };
}

export default function ReportsTable({ comparison = [], currency = "COP" }) {
  const rows = comparison.length
    ? comparison
    : [
        { metric: "Ingresos", current: 0, previous: 0 },
        { metric: "Gastos", current: 0, previous: 0 },
        { metric: "Ahorro", current: 0, previous: 0 },
      ];

  return (
    <Card className="p-0">
      <div className="grid grid-cols-4 gap-4 border-b border-slate-100 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:border-slate-800">
        <span>Métrica</span>
        <span>Actual</span>
        <span>Anterior</span>
        <span>Variación</span>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {rows.map((row) => {
          const change = formatChange(row.current, row.previous);
          const isPositive = change.diff >= 0;
          return (
            <div key={row.metric} className="grid grid-cols-4 gap-4 px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{row.metric}</span>
              <span>{formatCurrency(row.current, currency)}</span>
              <span>{formatCurrency(row.previous, currency)}</span>
              <span className={isPositive ? "text-emerald-400" : "text-rose-400"}>{change.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
