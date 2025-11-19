import Card from "@/components/ui/Card";
import RecentTransactionItem from "./RecentTransactionItem";

export default function RecentTransactionsCard({ transactions = [], currency }) {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Transacciones recientes</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Últimos movimientos registrados.</p>
      </div>
      {transactions.length ? (
        <ul className="space-y-3">
          {transactions.map((transaction) => (
            <RecentTransactionItem key={transaction.id} transaction={transaction} currency={currency} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Aún no registras movimientos recientes.</p>
      )}
    </Card>
  );
}
