import TransactionTypeBadge from "@/components/transactions/TransactionTypeBadge";

export default function RecentTransactionItem({ transaction }) {
  const { name, date, amount, type } = transaction;

  return (
    <li className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
      <div>
        <p className="font-semibold text-slate-900 dark:text-slate-100">{name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{date}</p>
      </div>
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
        <TransactionTypeBadge type={type} />
        <span>{amount}</span>
      </div>
    </li>
  );
}
