import { query } from "@/lib/db";

function normalizeAccount(row) {
  return {
    ...row,
    initialBalance: Number(row.initialBalance ?? 0),
    currentBalance: Number(row.currentBalance ?? 0),
  };
}

async function getPrincipalSummary(accountId) {
  if (!accountId) {
    return { monthlyIncome: 0, monthlyExpenses: 0, net: 0, categories: [] };
  }

  const [totalsResult, categoriesResult] = await Promise.all([
    query(
      `SELECT
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS "totalIncome",
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS "totalExpense"
         FROM transactions
        WHERE account_id = $1
          AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE)`,
      [accountId]
    ),
    query(
      `SELECT COALESCE(c.name, 'Sin categoría') AS label,
              SUM(t.amount) AS amount
         FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id
        WHERE t.account_id = $1
          AND t.type = 'expense'
          AND t.transaction_date >= DATE_TRUNC('month', CURRENT_DATE)
     GROUP BY COALESCE(c.name, 'Sin categoría')
     ORDER BY amount DESC
     LIMIT 5`,
      [accountId]
    ),
  ]);

  const monthlyIncome = Number(totalsResult.rows[0]?.totalIncome ?? 0);
  const monthlyExpenses = Number(totalsResult.rows[0]?.totalExpense ?? 0);

  const categories = categoriesResult.rows.map((row) => ({
    label: row.label,
    amount: Number(row.amount ?? 0),
  }));

  return { monthlyIncome, monthlyExpenses, net: monthlyIncome - monthlyExpenses, categories };
}

export async function getAccountsOverview(userId) {
  if (!userId) {
    throw new Error("userId es requerido para obtener cuentas");
  }

  const { rows } = await query(
    `SELECT id,
            user_id AS "userId",
            name,
            type,
            currency,
            initial_balance AS "initialBalance",
            current_balance AS "currentBalance",
            status,
            created_at AS "createdAt"
       FROM accounts
      WHERE user_id = $1
      ORDER BY created_at ASC`,
    [userId]
  );

  const accounts = rows.map(normalizeAccount);
  const principalAccount =
    accounts.find((account) => account.status === "primary") ??
    accounts.find((account) => account.type === "bank") ??
    accounts[0] ??
    null;

  const principalSummary = principalAccount ? await getPrincipalSummary(principalAccount.id) : { monthlyExpenses: 0, categories: [] };

  return {
    accounts,
    principalAccount,
    principalSummary,
  };
}
