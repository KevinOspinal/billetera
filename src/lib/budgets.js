import { query } from "@/lib/db";

const DEFAULT_CURRENCY = "COP";

export function mapBudgetRow(row) {
  const limitAmount = Number(row.limitAmount ?? row.limit_amount ?? 0);
  const spentAmount = Number(row.spentAmount ?? row.spent_amount ?? 0);
  const usage = limitAmount > 0 ? Math.min(100, Math.round((spentAmount / limitAmount) * 100)) : 0;

  return {
    id: row.id,
    userId: row.userId ?? row.user_id,
    categoryId: row.categoryId ?? row.category_id,
    categoryName: row.categoryName ?? row.category_name ?? "Sin categoría",
    color: row.color ?? "#38bdf8",
    period: row.period,
    periodStart: formatDateValue(row.periodStart ?? row.period_start),
    periodEnd: formatDateValue(row.periodEnd ?? row.period_end),
    limitAmount,
    spentAmount,
    usage,
    status: row.status,
  };
}

function formatDateValue(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

async function getUserCurrency(userId) {
  const { rows } = await query('SELECT currency FROM users WHERE id = $1', [userId]);
  return rows[0]?.currency ?? DEFAULT_CURRENCY;
}

export async function getBudgetsData(userId) {
  if (!userId) {
    throw new Error("userId es requerido para obtener presupuestos");
  }

  const [currency, budgetsResult] = await Promise.all([
    getUserCurrency(userId),
    query(
      `SELECT
          b.id,
          b.user_id AS "userId",
          b.category_id AS "categoryId",
          COALESCE(c.name, 'Sin categoría') AS "categoryName",
          COALESCE(c.color, '#38bdf8') AS color,
          b.period,
          b.period_start AS "periodStart",
          b.period_end AS "periodEnd",
          b.limit_amount AS "limitAmount",
          b.status,
          COALESCE((
            SELECT SUM(t.amount)
              FROM transactions t
             WHERE t.user_id = b.user_id
               AND t.category_id = b.category_id
               AND t.type = 'expense'
               AND t.deleted_at IS NULL
               AND t.transaction_date BETWEEN b.period_start AND b.period_end
          ), 0) AS "spentAmount"
         FROM budgets b
    LEFT JOIN categories c ON c.id = b.category_id
        WHERE b.user_id = $1
        ORDER BY b.period_start DESC, b.id DESC`,
      [userId]
    ),
  ]);

  const budgets = budgetsResult.rows.map(mapBudgetRow);

  const totals = budgets.reduce(
    (acc, budget) => {
      acc.limit += budget.limitAmount;
      acc.spent += budget.spentAmount;
      return acc;
    },
    { limit: 0, spent: 0 }
  );

  return {
    currency,
    budgets,
    totals,
  };
}
