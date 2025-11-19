import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardActions from "@/components/dashboard/DashboardActions";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ExpensesOverviewCard from "@/components/dashboard/ExpensesOverviewCard";
import RecentTransactionsCard from "@/components/dashboard/RecentTransactionsCard";
import { getDashboardData } from "@/lib/dashboard";
import { getSessionUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getSessionUser();
  const userId = Number(user?.id);

  if (!userId) {
    redirect("/login");
  }

  const { summary, expensesByCategory, recentTransactions } = await getDashboardData(userId);

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardActions />
      <SummaryCards summary={summary} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ExpensesOverviewCard categories={expensesByCategory} currency={summary.currency} />
        <RecentTransactionsCard transactions={recentTransactions} currency={summary.currency} />
      </div>
    </div>
  );
}
