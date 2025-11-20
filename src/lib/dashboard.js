import { query } from "@/lib/db";

const DEFAULT_CURRENCY = "COP";
const DAYS_WINDOW = 30;
const RECENT_TRANSACTIONS_LIMIT = 5;

function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

async function getUserCurrency(userId) {
  const { rows } = await query('SELECT currency FROM users WHERE id = $1', [userId]);
  return rows[0]?.currency ?? DEFAULT_CURRENCY;
}

async function getSummaryStats(userId) {
  const [balanceResult, monthlyTotalsResult] = await Promise.all([
    query(
      `SELECT COALESCE(SUM(current_balance), 0) AS "totalBalance"
         FROM accounts
        WHERE user_id = $1`,
      [userId]
    ),
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
  ]);

  const monthlyTotals = monthlyTotalsResult.rows[0] ?? {};
  const consolidatedBalance = toNumber(balanceResult.rows[0]?.totalBalance);
  const monthlyIncome = toNumber(monthlyTotals.totalIncome);
  const monthlyExpenses = toNumber(monthlyTotals.totalExpense);
  const month = monthlyTotals.month ?? null;

  return {
    availableBalance: monthlyIncome - monthlyExpenses,
    consolidatedBalance,
    monthlyIncome,
    monthlyExpenses,
    month,
  };
}

async function getWeeklyIncomeExpenses(userId) {
  const { rows } = await query(
    `WITH weekly AS (
        SELECT CEIL(EXTRACT(DAY FROM transaction_date) / 7.0)::int AS week,
               SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
               SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
          FROM transactions
         WHERE user_id = $1
           AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY week
    )
    SELECT week, income, expense
      FROM weekly
     ORDER BY week`,
    [userId]
  );

  const today = new Date();
  const currentWeek = Math.min(Math.max(Math.ceil(today.getDate() / 7), 1), 5);
  const maxWeekFromData = rows.reduce((max, row) => Math.max(max, row.week ?? 0), 0);
  const weeksToShow = Math.min(Math.max(currentWeek, maxWeekFromData, 1), 5);
  const labels = Array.from({ length: weeksToShow }, (_, index) => `Sem ${index + 1}`);
  const income = Array(weeksToShow).fill(0);
  const expense = Array(weeksToShow).fill(0);

  rows.forEach((row) => {
    const index = Math.min(Math.max(row.week - 1, 0), labels.length - 1);
    income[index] = Number(row.income ?? 0);
    expense[index] = Number(row.expense ?? 0);
  });

  return { labels, income, expense };
}

async function getExpensesByCategory(userId, interval = "month") {
  let filter = "t.transaction_date >= DATE_TRUNC('month', CURRENT_DATE)";
  if (interval === "week") {
    filter = "t.transaction_date >= CURRENT_DATE - INTERVAL '7 days'";
  } else if (interval === "today") {
    filter = "t.transaction_date >= CURRENT_DATE";
  } else if (interval === "month30") {
    filter = `t.transaction_date >= CURRENT_DATE - INTERVAL '${DAYS_WINDOW} days'`;
  }

  const { rows } = await query(
    `SELECT
        COALESCE(c.name, 'Sin categoría') AS label,
        SUM(t.amount) AS amount
       FROM transactions t
  LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.user_id = $1
        AND t.type = 'expense'
        AND t.deleted_at IS NULL
        AND ${filter}
   GROUP BY COALESCE(c.name, 'Sin categoría')
   ORDER BY amount DESC
   LIMIT 5`,
    [userId]
  );

  const totalSpent = rows.reduce((total, row) => total + toNumber(row.amount), 0);

  return rows.map((row) => {
    const amount = toNumber(row.amount);
    return {
      label: row.label,
      amount,
      percentage: totalSpent ? Math.round((amount / totalSpent) * 100) : 0,
    };
  });
}

async function getRecentTransactions(userId) {
  const { rows } = await query(
    `SELECT
        t.id,
        t.description,
        t.amount,
        t.currency,
        t.type,
        t.transaction_date AS "transactionDate",
        COALESCE(c.name, 'Sin categoría') AS "categoryName",
        a.name AS "accountName"
       FROM transactions t
 INNER JOIN accounts a ON a.id = t.account_id
  LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.user_id = $1
        AND t.deleted_at IS NULL
   ORDER BY t.transaction_date DESC, t.id DESC
   LIMIT $2`,
    [userId, RECENT_TRANSACTIONS_LIMIT]
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.description || row.categoryName || row.accountName,
    category: row.categoryName,
    account: row.accountName,
    amount: toNumber(row.amount),
    currency: row.currency,
    type: row.type,
    date: row.transactionDate,
  }));
}

export async function getDashboardData(userId) {
  if (!userId) {
    throw new Error("userId es requerido para obtener el dashboard");
  }

  const parsedUserId = Number(userId);
  if (!Number.isFinite(parsedUserId)) {
    throw new Error("userId inválido");
  }

  const [currency, summary, monthCategories, weekCategories, todayCategories, transactions, weeklySeries] = await Promise.all([
    getUserCurrency(parsedUserId),
    getSummaryStats(parsedUserId),
    getExpensesByCategory(parsedUserId, "month"),
    getExpensesByCategory(parsedUserId, "week"),
    getExpensesByCategory(parsedUserId, "today"),
    getRecentTransactions(parsedUserId),
    getWeeklyIncomeExpenses(parsedUserId),
  ]);

  return {
    summary: { ...summary, currency },
    expensesByCategory: {
      month: monthCategories,
      week: weekCategories,
      today: todayCategories,
    },
    recentTransactions: transactions.map((transaction) => ({
      ...transaction,
      currency: transaction.currency ?? currency,
    })),
    weeklySeries,
  };
}

export async function getUserSummaryStats(userId) {
  if (!userId) {
    throw new Error("userId es requerido para obtener el resumen");
  }
  return getSummaryStats(userId);
}
