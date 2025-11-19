import Card from "@/components/ui/Card";
import TransactionRow from "./TransactionRow";

const HEADERS = ["Concepto", "Cuenta", "Categoría", "Monto", "Fecha"];

export default function TransactionsTable({ transactions = [] }) {
  return (
    <Card className="p-0">
      <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-slate-100 px-6 py-4 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-300 lg:grid">
        {HEADERS.map((header) => (
          <span key={header}>{header}</span>
        ))}
      </div>
      {transactions.length ? (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </div>
      ) : (
        <p className="px-6 py-8 text-sm text-slate-500 dark:text-slate-400">No se encontraron transacciones.</p>
      )}
    </Card>
  );
}
