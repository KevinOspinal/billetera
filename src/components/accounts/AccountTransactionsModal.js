import Modal from "@/components/ui/Modal";
import TransactionRow from "@/components/transactions/TransactionRow";

export default function AccountTransactionsModal({ open = false, transactions = [] }) {
  return (
    <Modal open={open} title="Movimientos de la cuenta">
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {transactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </Modal>
  );
}
