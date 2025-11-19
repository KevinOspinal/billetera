import BudgetsHeader from "@/components/budgets/BudgetsHeader";
import BudgetsList from "@/components/budgets/BudgetsList";
import BudgetForm from "@/components/budgets/BudgetForm";

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <BudgetsHeader />
      <BudgetsList />
      <BudgetForm />
    </div>
  );
}
