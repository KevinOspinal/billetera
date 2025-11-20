"use client";

import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";

export default function AccountsHeader({ principal, summary, onAddAccount }) {
  return (
    <div className="space-y-4 rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Cuentas</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Controla el saldo disponible y los gastos de tu cuenta principal.</p>
        </div>
        <Button onClick={onAddAccount}>Nueva cuenta</Button>
      </div>

      {principal ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Saldo disponible (ingresos - gastos)</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{principal.name}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {formatCurrency(summary?.net ?? 0, principal.currency)}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Ingresos</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(summary?.monthlyIncome ?? 0, principal.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Gastos</p>
                <p className="font-semibold text-red-600 dark:text-red-400">
                  {formatCurrency(summary?.monthlyExpenses ?? 0, principal.currency)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Gastos del mes</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(summary?.monthlyExpenses ?? 0, principal.currency)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Principales categorías</p>
            {summary?.categories?.length ? (
              <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {summary.categories.map((category) => (
                  <li key={category.label} className="flex items-center justify-between">
                    <span>{category.label}</span>
                    <span className="font-medium">{formatCurrency(category.amount, principal.currency)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No tienes gastos registrados este mes.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Aún no tienes cuentas registradas.</p>
      )}
    </div>
  );
}
