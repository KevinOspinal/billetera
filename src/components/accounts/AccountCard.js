"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";

const TYPE_LABELS = {
  bank: "Cuenta bancaria",
  credit: "Tarjeta de crédito",
  cash: "Efectivo",
  loan: "Préstamo",
};

export default function AccountCard({ account, isPrincipal, onEdit, onDelete, onTransfer, onView, onMakePrimary }) {
  const isCredit = account.type === "credit";
  const balance = formatCurrency(account.currentBalance, account.currency);
  const balanceClasses =
    account.currentBalance < 0 && !isCredit ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-50";

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-slate-500 dark:text-slate-400">{TYPE_LABELS[account.type] ?? account.type}</p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{account.name}</h3>
        </div>
        {isPrincipal ? (
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-sky-500 dark:text-slate-900">
            Principal
          </span>
        ) : null}
      </div>
      <p className={`text-3xl font-bold ${balanceClasses}`}>{balance}</p>
      <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Estado: {account.status ?? "activo"}</p>
      <div className="flex flex-wrap gap-2">
        {onTransfer && (
          <Button size="sm" onClick={() => onTransfer(account)}>
            {isCredit ? "Abonar" : "Transferir"}
          </Button>
        )}
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(account)}>
            Editar
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(account)}>
            Eliminar
          </Button>
        )}
        {onView && (
          <Button variant="ghost" size="sm" onClick={() => onView(account)}>
            Ver movimientos
          </Button>
        )}
        {!isPrincipal && onMakePrimary && (
          <Button variant="ghost" size="sm" onClick={() => onMakePrimary(account)}>
            Marcar principal
          </Button>
        )}
      </div>
    </Card>
  );
}
