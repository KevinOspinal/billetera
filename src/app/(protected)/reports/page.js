import { redirect } from "next/navigation";
import ReportsHeader from "@/components/reports/ReportsHeader";
import ReportsFilters from "@/components/reports/ReportsFilters";
import IncomeVsExpensesChart from "@/components/reports/IncomeVsExpensesChart";
import CategoryTrendsChart from "@/components/reports/CategoryTrendsChart";
import ReportsTable from "@/components/reports/ReportsTable";
import { getSessionUser } from "@/lib/session";
import { getReportsData } from "@/lib/reports";
import { getUserAccounts, getUserCategories } from "@/lib/transactions-data";

export default async function ReportsPage({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;
  const user = await getSessionUser();
  const userId = Number(user?.id);

  if (!userId) {
    redirect("/login");
  }

  const filters = {
    startDate: searchParams?.startDate,
    endDate: searchParams?.endDate,
    accountId: searchParams?.accountId,
    categoryId: searchParams?.categoryId,
  };

  const [accounts, categories, reportData] = await Promise.all([
    getUserAccounts(userId),
    getUserCategories(userId),
    getReportsData(userId, filters),
  ]);

  const initialFilters = {
    startDate: filters.startDate ?? reportData.range.start,
    endDate: filters.endDate ?? reportData.range.end,
    accountId: filters.accountId ?? "",
    categoryId: filters.categoryId ?? "",
  };

  const filtersKey = JSON.stringify(initialFilters);

  return (
    <div className="space-y-6">
      <ReportsHeader summary={reportData.summary} range={reportData.range} currency={reportData.currency} />
      <ReportsFilters key={filtersKey} initialFilters={initialFilters} accounts={accounts} categories={categories} />
      <div className="grid gap-6 lg:grid-cols-2">
        <IncomeVsExpensesChart timeline={reportData.timeline} currency={reportData.currency} />
        <CategoryTrendsChart categories={reportData.categories} currency={reportData.currency} />
      </div>
      <ReportsTable comparison={reportData.comparison} currency={reportData.currency} />
    </div>
  );
}
