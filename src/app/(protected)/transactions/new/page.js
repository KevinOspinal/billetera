import { redirect } from "next/navigation";
import TransactionForm from "@/components/transactions/TransactionForm";
import { getSessionUser } from "@/lib/session";
import { getUserAccounts, getUserCategories } from "@/lib/transactions-data";

export default async function NewTransactionPage({ searchParams }) {
  const user = await getSessionUser();
  const userId = Number(user?.id);

  if (!userId) {
    redirect("/login");
  }

  const [accounts, categories] = await Promise.all([getUserAccounts(userId), getUserCategories(userId)]);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialType = resolvedSearchParams?.type === "income" ? "income" : "expense";

  return (
    <div className="space-y-6">
      <TransactionForm accounts={accounts} categories={categories} defaultType={initialType} userId={userId} />
    </div>
  );
}
