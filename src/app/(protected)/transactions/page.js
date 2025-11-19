import TransactionsHeader from "@/components/transactions/TransactionsHeader";
import TransactionsFilters from "@/components/transactions/TransactionsFilters";
import TransactionsTable from "@/components/transactions/TransactionsTable";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <TransactionsHeader />
      <TransactionsFilters />
      <TransactionsTable />
    </div>
  );
}
