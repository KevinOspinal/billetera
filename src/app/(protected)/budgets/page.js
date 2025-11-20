import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getBudgetsData } from "@/lib/budgets";
import { getUserCategories } from "@/lib/transactions-data";
import BudgetsClient from "@/components/budgets/BudgetsClient";
import { getUserSummaryStats } from "@/lib/dashboard";

export default async function BudgetsPage() {
  const user = await getSessionUser();
  const userId = Number(user?.id);

  if (!userId) {
    redirect("/login");
  }

  const [budgetsData, categories, summary] = await Promise.all([
    getBudgetsData(userId),
    getUserCategories(userId),
    getUserSummaryStats(userId),
  ]);
  const expenseCategories = categories.filter((category) => category.type === "expense");

  return (
    <div className="space-y-6">
      <BudgetsClient
        userId={userId}
        budgets={budgetsData.budgets}
        totals={budgetsData.totals}
        categories={expenseCategories}
        currency={budgetsData.currency}
        availableBalance={summary.availableBalance}
      />
    </div>
  );
}
