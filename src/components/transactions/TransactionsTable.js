import Card from "@/components/ui/Card";
import TransactionRow from "./TransactionRow";

const DATA = [
  { id: 1, concept: "Combustible", account: "Auto", category: "Transporte", amount: "-$45.00", type: "expense", date: "15 May" },
  { id: 2, concept: "Freelance", account: "Banco", category: "Ingresos", amount: "+$650.00", type: "income", date: "14 May" },
  { id: 3, concept: "Restaurante", account: "Tarjeta", category: "Ocio", amount: "-$32.10", type: "expense", date: "12 May" },
];

const HEADERS = ["Concepto", "Cuenta", "Categoría", "Monto", "Fecha"];

export default function TransactionsTable() {
  return (
    <Card className="p-0">
      <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-slate-100 px-6 py-4 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-300 lg:grid">
        {HEADERS.map((header) => (
          <span key={header}>{header}</span>
        ))}
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {DATA.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </Card>
  );
}
