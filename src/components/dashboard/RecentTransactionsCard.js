import Card from "@/components/ui/Card";
import RecentTransactionItem from "./RecentTransactionItem";

const RECENT = [
  { name: "Compra supermercado", date: "12 May", amount: "-$85.30", type: "expense" },
  { name: "Pago salario", date: "10 May", amount: "+$2,400.00", type: "income" },
  { name: "Suscripción streaming", date: "08 May", amount: "-$12.99", type: "expense" },
];

export default function RecentTransactionsCard() {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Transacciones recientes</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Últimos movimientos registrados.</p>
      </div>
      <ul className="space-y-3">
        {RECENT.map((transaction) => (
          <RecentTransactionItem key={transaction.name} transaction={transaction} />
        ))}
      </ul>
    </Card>
  );
}
