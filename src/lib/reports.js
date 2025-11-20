import { query } from "@/lib/db";

const DEFAULT_CURRENCY = "COP";

function toISODate(value) {
  return value.toISOString().slice(0, 10);
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function defaultRange() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  return { start, end: today };
}

function normalizeRange({ startDate, endDate }) {
  let range = defaultRange();
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (start) range.start = start;
  if (end && end >= range.start) {
    range.end = end;
  }
  return range;
}

function buildFilters(userId, range, { accountId, categoryId } = {}) {
  const conditions = ["t.user_id = $1", "t.deleted_at IS NULL"];
  const values = [userId];
  let index = values.length + 1;

  if (range?.start) {
    conditions.push(`t.transaction_date >= $${index++}`);
    values.push(toISODate(range.start));
  }

  if (range?.end) {
    conditions.push(`t.transaction_date <= $${index++}`);
    values.push(toISODate(range.end));
  }

  const accountNumber = Number(accountId);
  if (Number.isFinite(accountNumber) && accountNumber > 0) {
    conditions.push(`t.account_id = $${index++}`);
    values.push(accountNumber);
  }

  const categoryNumber = Number(categoryId);
  if (Number.isFinite(categoryNumber) && categoryNumber > 0) {
    conditions.push(`t.category_id = $${index++}`);
    values.push(categoryNumber);
  }

  return { clause: conditions.join(" AND "), values };
}

function buildCategoryFilters(userId, range, filters = {}) {
  const base = buildFilters(userId, range, filters);
  return {
    clause: `${base.clause} AND t.type = 'expense'`,
    values: base.values,
  };
}

function previousRange(range) {
  const duration = Math.max(1, Math.ceil((range.end - range.start) / (1000 * 60 * 60 * 24)) + 1);
  const prevEnd = new Date(range.start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - (duration - 1));
  return { start: prevStart, end: prevEnd };
}

function formatSummaryRow(row) {
  const income = Number(row?.income ?? 0);
  const expense = Number(row?.expense ?? 0);
  const savings = income - expense;
  const coverage = expense > 0 ? Math.round((income / expense) * 100) : 100;
  return { income, expense, savings, coverage: Math.max(0, coverage) };
}

async function getUserCurrency(userId) {
  const { rows } = await query('SELECT currency FROM users WHERE id = $1', [userId]);
  return rows[0]?.currency ?? DEFAULT_CURRENCY;
}

export async function getReportsData(userId, filters = {}) {
  if (!userId) {
    throw new Error("userId es requerido para obtener los reportes");
  }

  const parsedUserId = Number(userId);
  if (!Number.isFinite(parsedUserId)) {
    throw new Error("userId inválido para los reportes");
  }

  const range = normalizeRange(filters);
  const prevRange = previousRange(range);

  const summaryFilters = buildFilters(parsedUserId, range, filters);
  const previousFilters = buildFilters(parsedUserId, prevRange, filters);
  const categoryFilters = buildCategoryFilters(parsedUserId, range, filters);

  const summaryPromise = query(
    `SELECT
        COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount END), 0) AS income,
        COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount END), 0) AS expense
       FROM transactions t
      WHERE ${summaryFilters.clause}`,
    summaryFilters.values
  );

  const previousPromise = query(
    `SELECT
        COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount END), 0) AS income,
        COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount END), 0) AS expense
       FROM transactions t
      WHERE ${previousFilters.clause}`,
    previousFilters.values
  );

  const timelinePromise = query(
    `SELECT DATE_TRUNC('week', t.transaction_date) AS bucket,
            SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) AS income,
            SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS expense
       FROM transactions t
      WHERE ${summaryFilters.clause}
      GROUP BY bucket
      ORDER BY bucket`,
    summaryFilters.values
  );

  const categoriesPromise = query(
    `SELECT
        COALESCE(c.name, 'Sin categoría') AS label,
        SUM(t.amount) AS amount
       FROM transactions t
  LEFT JOIN categories c ON c.id = t.category_id
      WHERE ${categoryFilters.clause}
   GROUP BY COALESCE(c.name, 'Sin categoría')
   ORDER BY amount DESC
   LIMIT 5`,
    categoryFilters.values
  );

  const [currency, summaryResult, previousResult, timelineResult, categoriesResult] = await Promise.all([
    getUserCurrency(parsedUserId),
    summaryPromise,
    previousPromise,
    timelinePromise,
    categoriesPromise,
  ]);

  const summary = formatSummaryRow(summaryResult.rows[0]);
  const previous = formatSummaryRow(previousResult.rows[0]);

  const timelineLabels = timelineResult.rows.map((row) => {
    const date = new Date(row.bucket);
    return new Intl.DateTimeFormat("es-CO", { month: "short", day: "numeric" }).format(date);
  });
  const timelineIncome = timelineResult.rows.map((row) => Number(row.income ?? 0));
  const timelineExpense = timelineResult.rows.map((row) => Number(row.expense ?? 0));

  const totalCategories = categoriesResult.rows.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
  const categories = categoriesResult.rows.map((row) => {
    const amount = Number(row.amount ?? 0);
    return {
      label: row.label,
      amount,
      percentage: totalCategories ? Math.round((amount / totalCategories) * 100) : 0,
    };
  });

  const comparison = [
    { metric: "Ingresos", current: summary.income, previous: previous.income },
    { metric: "Gastos", current: summary.expense, previous: previous.expense },
    { metric: "Ahorro", current: summary.savings, previous: previous.savings },
  ];

  return {
    currency,
    range: { start: toISODate(range.start), end: toISODate(range.end) },
    summary,
    timeline: { labels: timelineLabels, income: timelineIncome, expense: timelineExpense },
    categories,
    comparison,
  };
}
