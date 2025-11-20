import { redirect } from "next/navigation";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ExpensesOverviewCard from "@/components/dashboard/ExpensesOverviewCard";
import RecentTransactionsCard from "@/components/dashboard/RecentTransactionsCard";
import IncomeVsExpensesChart from "@/components/dashboard/IncomeVsExpensesChart";
import ExpensesDonutChart from "@/components/dashboard/ExpensesDonutChart";
import { getDashboardData } from "@/lib/dashboard";
import { getSessionUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getSessionUser();
  const userId = Number(user?.id);

  if (!userId) {
    redirect("/login");
  }

  const { summary, expensesByCategory, recentTransactions, weeklySeries } = await getDashboardData(userId);

  return (
    <div className="space-y-6">
      <SummaryCards summary={summary} />
      <div className="grid gap-6 lg:grid-cols-2">
        <IncomeVsExpensesChart labels={weeklySeries.labels} income={weeklySeries.income} expense={weeklySeries.expense} />
        <ExpensesDonutChart categories={expensesByCategory.month ?? []} currency={summary.currency} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ExpensesOverviewCard categories={expensesByCategory} currency={summary.currency} />
        <RecentTransactionsCard transactions={recentTransactions} currency={summary.currency} />
      </div>
    </div>
  );
}
