import Card from "@/components/ui/Card";
import { formatCurrency, formatShortDate } from "@/lib/format";

const METRICS = [
  { id: "income", label: "Ingresos" },
  { id: "expense", label: "Gastos" },
  { id: "savings", label: "Ahorro neto" },
];

export default function ReportsHeader({ summary, range, currency = "COP" }) {
  const coverage = summary?.coverage ?? 0;
  const coverageLabel =
    coverage >= 100 ? "Ingresos cubren todos los gastos" : `Cobertura del ${Math.min(coverage, 999)}% de gastos`;

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Panel de análisis</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Reportes financieros</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {range?.start && range?.end
              ? `Del ${formatShortDate(range.start)} al ${formatShortDate(range.end)}`
              : "Selecciona un rango para analizar tus movimientos"}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-300">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cobertura</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{Math.min(coverage, 999)}%</p>
          <p>{coverageLabel}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {METRICS.map((metric) => (
          <div key={metric.id} className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              {formatCurrency(summary?.[metric.id] ?? 0, currency)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
