import Card from "@/components/ui/Card";
import ExpensesTabs from "./ExpensesTabs";
import ExpensesByCategoryChart from "./ExpensesByCategoryChart";

export default function ExpensesOverviewCard() {
  return (
    <Card className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Resumen de gastos</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Seguimiento del comportamiento del gasto.</p>
        </div>
        <ExpensesTabs />
      </div>
      <ExpensesByCategoryChart />
    </Card>
  );
}
