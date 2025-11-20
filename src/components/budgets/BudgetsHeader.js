import { formatCurrency } from "@/lib/format";

export default function BudgetsHeader({ totals = { limit: 0, spent: 0 }, currency = "COP" }) {
  const remaining = totals.limit - totals.spent;
  const coverage = totals.limit > 0 ? Math.max(0, Math.min(100, Math.round((totals.spent / totals.limit) * 100))) : 0;

  return (
    <div className="space-y-4 rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/40">
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Planeación mensual</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Presupuestos</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Administra límites y monitorea el progreso.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Límite total</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{formatCurrency(totals.limit, currency)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Gastado</p>
          <p className="text-2xl font-semibold text-rose-500">{formatCurrency(totals.spent, currency)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Disponible</p>
          <p className="text-2xl font-semibold text-emerald-500">{formatCurrency(remaining, currency)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{coverage}% utilizado</p>
        </div>
      </div>
    </div>
  );
}
