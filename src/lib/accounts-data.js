import { query } from "@/lib/db";

function normalizeAccount(row) {
  return {
    ...row,
    initialBalance: Number(row.initialBalance ?? 0),
    currentBalance: Number(row.currentBalance ?? 0),
  };
}

async function getUserMonthlySummary(userId) {
  if (!userId) {
    return { monthlyIncome: 0, monthlyExpenses: 0, net: 0, categories: [] };
  }

  const [totalsResult, categoriesResult] = await Promise.all([
    query(
      `SELECT
          DATE_TRUNC('month', transaction_date) AS "month",
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS "totalIncome",
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS "totalExpense"
         FROM transactions
        WHERE user_id = $1
          AND deleted_at IS NULL
     GROUP BY "month"
     ORDER BY "month" DESC
     LIMIT 1`,
      [userId]
    ),
    query(
      `SELECT COALESCE(c.name, 'Sin categoría') AS label,
              SUM(t.amount) AS amount
         FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id
        WHERE t.user_id = $1
          AND t.type = 'expense'
          AND t.deleted_at IS NULL
          AND t.transaction_date >= DATE_TRUNC('month', CURRENT_DATE)
     GROUP BY COALESCE(c.name, 'Sin categoría')
     ORDER BY amount DESC
     LIMIT 5`,
      [userId]
    ),
  ]);

  const totals = totalsResult.rows[0] ?? {};
  const monthlyIncome = Number(totals.totalIncome ?? 0);
  const monthlyExpenses = Number(totals.totalExpense ?? 0);

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

  const principalSummary = await getUserMonthlySummary(userId);
  const syncedAccounts = accounts.map((account) => {
    if (principalAccount && account.id === principalAccount.id) {
      return { ...account, currentBalance: principalSummary.net };
    }
    return account;
  });

  return {
    accounts: syncedAccounts,
    principalAccount: principalAccount ? { ...principalAccount, currentBalance: principalSummary.net } : null,
    principalSummary,
  };
}
