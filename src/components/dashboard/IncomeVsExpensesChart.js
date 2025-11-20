"use client";

import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";

const TICKS = 4;
const SCALE_POWER = 0.6;
const PADDING_X = 8;
const PADDING_Y = 6;
const DRAW_WIDTH = 100 - PADDING_X * 2;
const DRAW_HEIGHT = 100 - PADDING_Y * 2;
const compactFormatter = new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 });

function buildPoints(values = [], maxValue) {
  if (!values.length) return [];
  const safeMax = maxValue || 1;
  const step = values.length > 1 ? DRAW_WIDTH / (values.length - 1) : DRAW_WIDTH;
  return values.map((value, index) => ({
    x: PADDING_X + index * step,
    y: PADDING_Y + DRAW_HEIGHT - Math.pow(Number(value) / safeMax, SCALE_POWER) * DRAW_HEIGHT,
  }));
}

function buildBars(values = [], maxValue) {
  if (!values.length) return [];
  const safeMax = maxValue || 1;
  const width = DRAW_WIDTH / values.length;
  return values.map((value, index) => ({
    x: PADDING_X + index * width + width * 0.15,
    width: width * 0.7,
    height: Math.pow(Number(value) / safeMax, SCALE_POWER) * DRAW_HEIGHT,
  }));
}

function buildPath(points = []) {
  if (!points.length) return "";
  if (points.length === 1) {
    const { y } = points[0];
    return `M0,${y} L100,${y}`;
  }

  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const current = points[i];
    const controlX = (prev.x + current.x) / 2;
    path += ` C${controlX},${prev.y} ${controlX},${current.y} ${current.x},${current.y}`;
  }
  return path;
}

export default function IncomeVsExpensesChart({ labels = [], income = [], expense = [] }) {
  const hasData = income.some((value) => Number(value) > 0) || expense.some((value) => Number(value) > 0);
  const maxValue = Math.max(...income, ...expense, 1);
  const totalIncome = income.reduce((sum, value) => sum + Number(value ?? 0), 0);
  const totalExpense = expense.reduce((sum, value) => sum + Number(value ?? 0), 0);
  const netResult = totalIncome - totalExpense;

  const incomePoints = buildPoints(income, maxValue);
  const expensePoints = buildPoints(expense, maxValue);
  const incomeBars = buildBars(income, maxValue);

  const tickValues = Array.from({ length: TICKS }, (_, index) => Math.round((maxValue / (TICKS - 1)) * index));

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap gap-6">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Este mes</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Ingresos vs. Gastos</h3>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-300">
          <div>
            <p className="uppercase tracking-wide text-[10px] text-slate-400">Ingresos</p>
            <p className="text-sm font-semibold text-indigo-400">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="uppercase tracking-wide text-[10px] text-slate-400">Gastos</p>
            <p className="text-sm font-semibold text-rose-400">{formatCurrency(totalExpense)}</p>
          </div>
          <div>
            <p className="uppercase tracking-wide text-[10px] text-slate-400">Resultado</p>
            <p className={`text-sm font-semibold ${netResult >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {formatCurrency(netResult)}
            </p>
          </div>
        </div>
      </div>
      <div className="relative h-72 overflow-hidden rounded-2xl border border-slate-800/60 bg-[#050915] p-4">
        {hasData ? (
          <>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full text-white/70">
              <defs>
                <linearGradient id="incomeLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#a5b4fc" />
                  <stop offset="1" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="expenseLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fca5a5" />
                  <stop offset="1" stopColor="#f87171" />
                </linearGradient>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="1" stopColor="transparent" />
                </linearGradient>
                <pattern id="chartGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100" height="100" fill="url(#chartGrid)" />
              {tickValues.map((value) => {
                const y = PADDING_Y + DRAW_HEIGHT - Math.pow(value / maxValue, SCALE_POWER) * DRAW_HEIGHT;
                return (
                  <line
                    key={value}
                    x1={PADDING_X}
                    y1={y}
                    x2={100 - PADDING_X}
                    y2={y}
                    stroke="rgba(148,163,184,0.08)"
                    strokeWidth="0.3"
                  />
                );
              })}
              {incomeBars.map((bar, index) => (
                <rect
                  key={`bar-${index}`}
                  x={bar.x}
                  y={PADDING_Y + DRAW_HEIGHT - bar.height}
                  width={bar.width}
                  height={bar.height}
                  fill="url(#barGradient)"
                  opacity="0.45"
                />
              ))}
              <path d={buildPath(expensePoints)} fill="none" stroke="url(#expenseLine)" strokeWidth="2" strokeLinecap="round" />
              <path d={buildPath(incomePoints)} fill="none" stroke="url(#incomeLine)" strokeWidth="2" strokeLinecap="round" />
              {incomePoints.map((point) => (
                <circle key={`income-${point.x}`} cx={point.x} cy={point.y} r="1.3" fill="#c7d2fe" />
              ))}
              {expensePoints.map((point) => (
                <circle key={`expense-${point.x}`} cx={point.x} cy={point.y} r="1.3" fill="#fecdd3" />
              ))}
            </svg>
            <div className="absolute inset-y-4 left-6 flex flex-col justify-between text-[10px] text-slate-400">
              {[...tickValues].reverse().map((value) => (
                <span key={`tick-${value}`}>{compactFormatter.format(value)}</span>
              ))}
            </div>
            <div className="absolute left-10 right-10 bottom-3 flex justify-between text-xs text-slate-400">
              {labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">Aún no hay datos este mes.</div>
        )}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          Ingresos
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Gastos
        </div>
      </div>
    </Card>
  );
}
