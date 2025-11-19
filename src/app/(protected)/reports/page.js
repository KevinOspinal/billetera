import ReportsHeader from "@/components/reports/ReportsHeader";
import ReportsFilters from "@/components/reports/ReportsFilters";
import IncomeVsExpensesChart from "@/components/reports/IncomeVsExpensesChart";
import CategoryTrendsChart from "@/components/reports/CategoryTrendsChart";
import ReportsTable from "@/components/reports/ReportsTable";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <ReportsHeader />
      <ReportsFilters />
      <div className="grid gap-6 lg:grid-cols-2">
        <IncomeVsExpensesChart />
        <CategoryTrendsChart />
      </div>
      <ReportsTable />
    </div>
  );
}
