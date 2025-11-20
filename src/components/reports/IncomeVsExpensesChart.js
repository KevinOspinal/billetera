import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";

const VIEWBOX = { width: 1000, height: 320 };
const PADDING = { top: 24, right: 32, bottom: 48, left: 48 };
const CURVATURE = 0.32;

function normalizeSeries(series = [], fallbackLength = 0) {
  if (!series.length && fallbackLength) {
    return Array(fallbackLength).fill(0);
  }
  return series.map((value) => Number(value ?? 0));
}

function buildPath(values = [], maxValue) {
  if (!values.length) return "";
  const plotWidth = VIEWBOX.width - PADDING.left - PADDING.right;
  const plotHeight = VIEWBOX.height - PADDING.top - PADDING.bottom;
  const stepX = values.length > 1 ? plotWidth / (values.length - 1) : plotWidth;

  return values
    .map((value, index) => {
      const x = PADDING.left + index * stepX;
      const normalized = maxValue ? Number(value ?? 0) / maxValue : 0;
      const y = PADDING.top + plotHeight - normalized * plotHeight || PADDING.top + plotHeight;
      return { x, y };
    })
    .reduce((path, current, index, arr) => {
      if (index === 0) {
        return `M ${current.x} ${current.y}`;
      }
      const previous = arr[index - 1];
      const deltaX = (current.x - previous.x) * CURVATURE;
      return `${path} C ${previous.x + deltaX} ${previous.y}, ${current.x - deltaX} ${current.y}, ${current.x} ${current.y}`;
    }, "");
}

function buildAreaPath(values = [], maxValue) {
  const path = buildPath(values, maxValue);
  if (!path) return "";
  const plotHeight = VIEWBOX.height - PADDING.top - PADDING.bottom;
  const baselineY = PADDING.top + plotHeight;
  return `${path} L ${VIEWBOX.width - PADDING.right} ${baselineY} L ${PADDING.left} ${baselineY} Z`;
}

function getExtremes(values = [], labels = []) {
  if (!values.length) return { value: 0, label: "" };
  const maxValue = Math.max(...values);
  const index = values.indexOf(maxValue);
  return { value: maxValue, label: labels[index] ?? "" };
}

export default function IncomeVsExpensesChart({ timeline, currency = "COP" }) {
  const labels = timeline?.labels ?? [];
  const income = normalizeSeries(timeline?.income, labels.length);
  const expense = normalizeSeries(timeline?.expense, labels.length);
  const maxValue = Math.max(...income, ...expense, 1);
  const hasData = income.some((value) => value > 0) || expense.some((value) => value > 0);

  const totalIncome = income.reduce((sum, value) => sum + value, 0);
  const totalExpense = expense.reduce((sum, value) => sum + value, 0);
  const netResult = totalIncome - totalExpense;
  const averageIncome = labels.length ? totalIncome / labels.length : 0;
  const highestExpense = getExtremes(expense, labels);

  const stats = [
    { label: "Balance neto", value: formatCurrency(netResult, currency), trend: netResult >= 0 ? "positivo" : "negativo" },
    { label: "Ingreso promedio", value: formatCurrency(averageIncome, currency), trend: null },
    { label: "Gasto más alto", value: `${formatCurrency(highestExpense.value, currency)} · ${highestExpense.label}`, trend: null },
  ];

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Análisis temporal</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Ingresos vs. gastos</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tendencia de tus movimientos en el periodo</p>
        </div>
        <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            Ingresos
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            Gastos
          </span>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 shadow-inner dark:border-slate-800">
        {hasData ? (
          <>
            <svg
              viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
              role="img"
              aria-label="Gráfico de ingresos y gastos"
              className="h-64 w-full text-white/40"
            >
              <defs>
                <linearGradient id="incomeArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
                  <stop offset="80%" stopColor="#4c1d95" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="expenseArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity="0.25" />
                  <stop offset="80%" stopColor="#7f1d1d" stopOpacity="0" />
                </linearGradient>
                <pattern id="gridPattern" width="80" height="80" patternUnits="userSpaceOnUse">
                  <rect width="80" height="80" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPattern)" />
              <path d={buildAreaPath(expense, maxValue)} fill="url(#expenseArea)" />
              <path d={buildAreaPath(income, maxValue)} fill="url(#incomeArea)" />
              <path d={buildPath(expense, maxValue)} fill="none" stroke="#fb7185" strokeWidth="6" strokeLinecap="round" />
              <path d={buildPath(income, maxValue)} fill="none" stroke="#a78bfa" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-x-8 bottom-4 flex justify-between text-[10px] tracking-wide text-slate-400">
              {labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-slate-400">Aún no hay movimientos en este rango.</div>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{stat.label}</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{stat.value}</p>
            {stat.trend ? <p className="text-xs text-emerald-400">{stat.trend === "positivo" ? "En línea con tus metas" : ""}</p> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
