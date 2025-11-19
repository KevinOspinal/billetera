import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardActions from "@/components/dashboard/DashboardActions";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ExpensesOverviewCard from "@/components/dashboard/ExpensesOverviewCard";
import RecentTransactionsCard from "@/components/dashboard/RecentTransactionsCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardActions />
      <SummaryCards />
      <div className="grid gap-6 lg:grid-cols-2">
        <ExpensesOverviewCard />
        <RecentTransactionsCard />
      </div>
    </div>
  );
}
