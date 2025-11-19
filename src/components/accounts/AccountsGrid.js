"use client";

import AccountCard from "./AccountCard";

export default function AccountsGrid({ accounts = [], principalId, onEdit, onDelete, onTransfer, onView, onMakePrimary }) {
  if (!accounts.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        No hay cuentas registradas todavía. Crea tu primera cuenta para comenzar a controlar tus saldos.
      </div>
    );
  }

  const sortedAccounts = [...accounts].sort((a, b) => {
    if (a.id === principalId) return -1;
    if (b.id === principalId) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {sortedAccounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          isPrincipal={principalId === account.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onTransfer={onTransfer}
          onView={onView}
          onMakePrimary={onMakePrimary}
        />
      ))}
    </div>
  );
}
