import TransactionTypeBadge from "./TransactionTypeBadge";

export default function TransactionRow({ transaction }) {
  const { concept, account, category, amount, type, date } = transaction;
  return (
    <div className="flex flex-col gap-3 px-4 py-4 text-sm text-slate-600 dark:text-slate-300 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:items-center lg:gap-4 lg:px-6">
      <span className="font-semibold text-slate-900 dark:text-slate-100">{concept}</span>
      <span>{account}</span>
      <span>{category}</span>
      <span className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-100">
        <TransactionTypeBadge type={type} />
        {amount}
      </span>
      <span>{date}</span>
    </div>
  );
}
