import { redirect } from "next/navigation";
import TransactionsHeader from "@/components/transactions/TransactionsHeader";
import TransactionsFilters from "@/components/transactions/TransactionsFilters";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import TransactionsPagination from "@/components/transactions/TransactionsPagination";
import { getSessionUser } from "@/lib/session";
import { getUserAccounts, getUserCategories, getUserTransactions } from "@/lib/transactions-data";

function isValidDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parsePositiveNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default async function TransactionsPage({ searchParams }) {
  const user = await getSessionUser();
  const userId = Number(user?.id);

  if (!userId) {
    redirect("/login");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(Number(resolvedSearchParams?.page) || 1, 1);
  const typeFilter = resolvedSearchParams?.type === "income" || resolvedSearchParams?.type === "expense" ? resolvedSearchParams.type : "";
  const categoryId = parsePositiveNumber(resolvedSearchParams?.category);
  const accountId = parsePositiveNumber(resolvedSearchParams?.account);
  const startDate = isValidDate(resolvedSearchParams?.start) ? resolvedSearchParams.start : "";
  const endDate = isValidDate(resolvedSearchParams?.end) ? resolvedSearchParams.end : "";

  const pageSize = 5;
  const offset = (currentPage - 1) * pageSize;

  const filters = { type: typeFilter, categoryId, accountId, startDate, endDate };

  const [accounts, categories, transactionsResult] = await Promise.all([
    getUserAccounts(userId),
    getUserCategories(userId),
    getUserTransactions(userId, { limit: pageSize, offset, filters }),
  ]);

  const { items: transactions, total } = transactionsResult;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const filterValuesForClient = {
    type: typeFilter,
    categoryId: categoryId ? String(categoryId) : "",
    accountId: accountId ? String(accountId) : "",
    startDate,
    endDate,
  };
  const paginationQuery = {
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(categoryId ? { category: String(categoryId) } : {}),
    ...(accountId ? { account: String(accountId) } : {}),
    ...(startDate ? { start: startDate } : {}),
    ...(endDate ? { end: endDate } : {}),
  };

  return (
    <div className="space-y-6">
      <TransactionsHeader />
      <TransactionsFilters accounts={accounts} categories={categories} filters={filterValuesForClient} />
      <TransactionsTable transactions={transactions} />
      <TransactionsPagination currentPage={currentPage} totalPages={totalPages} query={paginationQuery} />
    </div>
  );
}
