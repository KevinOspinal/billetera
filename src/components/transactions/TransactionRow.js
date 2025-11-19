import { formatCurrency, formatShortDate } from "@/lib/format";
import TransactionTypeBadge from "./TransactionTypeBadge";

export default function TransactionRow({ transaction }) {
  const concept = transaction.description || transaction.categoryName || "Movimiento";
  const account = transaction.accountName ?? "Cuenta";
  const category = transaction.categoryName ?? "Sin categoría";
  const amountValue = Number(transaction.amount) || 0;
  const formattedAmount = formatCurrency(Math.abs(amountValue), transaction.currency ?? "COP");
  const displayAmount = `${transaction.type === "expense" ? "-" : "+"}${formattedAmount}`;
  const formattedDate = formatShortDate(transaction.transactionDate);

  return (
    <div className="flex flex-col gap-3 px-4 py-4 text-sm text-slate-600 dark:text-slate-300 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:items-center lg:gap-4 lg:px-6">
      <span className="font-semibold text-slate-900 dark:text-slate-100">{concept}</span>
      <span>{account}</span>
      <span>{category}</span>
      <span className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-100">
        <TransactionTypeBadge type={transaction.type} />
        {displayAmount}
      </span>
      <span>{formattedDate}</span>
    </div>
  );
}
