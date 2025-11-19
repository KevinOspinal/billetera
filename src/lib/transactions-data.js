import { query } from "@/lib/db";

export async function getUserAccounts(userId) {
  if (!userId) {
    throw new Error("userId es requerido para obtener las cuentas");
  }

  const { rows } = await query(
    `SELECT id, name, type, currency
       FROM accounts
      WHERE user_id = $1
      ORDER BY name`,
    [userId]
  );

  return rows;
}

export async function getUserCategories(userId) {
  if (!userId) {
    throw new Error("userId es requerido para obtener las categorías");
  }

  const { rows } = await query(
    `SELECT id, name, type
       FROM categories
      WHERE user_id = $1
      ORDER BY name`,
    [userId]
  );

  return rows;
}

export async function getUserTransactions(userId, { limit = 50, offset = 0, filters = {} } = {}) {
  if (!userId) {
    throw new Error("userId es requerido para obtener transacciones");
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const clauses = ["t.user_id = $1", "t.deleted_at IS NULL"];
  const params = [userId];
  let paramIndex = params.length + 1;

  const { type, categoryId, accountId, startDate, endDate } = filters ?? {};

  if (type === "income" || type === "expense") {
    clauses.push(`t.type = $${paramIndex++}`);
    params.push(type);
  }

  const categoryNumber = Number(categoryId);
  if (Number.isFinite(categoryNumber) && categoryNumber > 0) {
    clauses.push(`t.category_id = $${paramIndex++}`);
    params.push(categoryNumber);
  }

  const accountNumber = Number(accountId);
  if (Number.isFinite(accountNumber) && accountNumber > 0) {
    clauses.push(`t.account_id = $${paramIndex++}`);
    params.push(accountNumber);
  }

  if (startDate) {
    clauses.push(`t.transaction_date >= $${paramIndex++}`);
    params.push(startDate);
  }

  if (endDate) {
    clauses.push(`t.transaction_date <= $${paramIndex++}`);
    params.push(endDate);
  }

  const whereClause = clauses.join(" AND ");
  const limitPlaceholder = paramIndex++;
  const offsetPlaceholder = paramIndex++;

  const filterParams = [...params];

  const [dataResult, countResult] = await Promise.all([
    query(
      `SELECT
        t.id,
        t.description,
        t.amount,
        t.type,
        t.currency,
        t.transaction_date AS "transactionDate",
        COALESCE(t.notes, '') AS notes,
        a.id AS "accountId",
        a.name AS "accountName",
        COALESCE(c.id, 0) AS "categoryId",
        COALESCE(c.name, 'Sin categoría') AS "categoryName"
       FROM transactions t
 INNER JOIN accounts a ON a.id = t.account_id
  LEFT JOIN categories c ON c.id = t.category_id
      WHERE ${whereClause}
   ORDER BY t.transaction_date DESC, t.id DESC
   LIMIT $${limitPlaceholder} OFFSET $${offsetPlaceholder}`,
      [...filterParams, safeLimit, safeOffset]
    ),
    query(
      `SELECT COUNT(*)::int AS total
         FROM transactions t
        WHERE ${whereClause}`,
      filterParams
    ),
  ]);

  return {
    items: dataResult.rows,
    total: countResult.rows[0]?.total ?? 0,
  };
}
