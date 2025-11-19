import { badRequest, jsonResponse, serverError } from "@/lib/api";
import { query, transaction as runTransaction } from "@/lib/db";

const allowedTypes = new Set(["income", "expense", "transfer"]);

// Construye el WHERE dinámico a partir de los filtros opcionales.
function buildFilters(searchParams) {
  const clauses = [];
  const values = [];
  let idx = 1;

  const userId = searchParams.get("userId");
  if (!userId) {
    throw new Error("userId es requerido");
  }
  clauses.push(`user_id = $${idx++}`);
  values.push(userId);

  const accountId = searchParams.get("accountId");
  if (accountId) {
    clauses.push(`account_id = $${idx++}`);
    values.push(accountId);
  }

  const categoryId = searchParams.get("categoryId");
  if (categoryId) {
    clauses.push(`category_id = $${idx++}`);
    values.push(categoryId);
  }

  const type = searchParams.get("type");
  if (type) {
    clauses.push(`type = $${idx++}`);
    values.push(type);
  }

  const startDate = searchParams.get("startDate");
  if (startDate) {
    clauses.push(`transaction_date >= $${idx++}`);
    values.push(startDate);
  }

  const endDate = searchParams.get("endDate");
  if (endDate) {
    clauses.push(`transaction_date <= $${idx++}`);
    values.push(endDate);
  }

  return { whereClause: clauses.join(" AND "), values };
}

// Determina cuánto debe sumarse/restarse al saldo de la cuenta.
function balanceDelta(type, amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) {
    throw new Error("Monto inválido");
  }
  if (type === "income") return value;
  if (type === "expense") return -value;
  return 0; // transfer se manejaría aparte
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { whereClause, values } = buildFilters(searchParams);
    const limit = Number(searchParams.get("limit")) || 50;

    const { rows } = await query(
      `SELECT id, user_id AS "userId", account_id AS "accountId", category_id AS "categoryId",
              type, amount, currency, exchange_rate AS "exchangeRate", description, notes,
              transaction_date AS "transactionDate", created_at AS "createdAt"
         FROM transactions
        WHERE ${whereClause}
        ORDER BY transaction_date DESC, id DESC
        LIMIT $${values.length + 1}`,
      [...values, limit]
    );

    return jsonResponse({ data: rows });
  } catch (error) {
    if (error.message === "userId es requerido") {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, accountId, categoryId, type, amount, currency = "COP", description = "", notes = "", transactionDate } = body;

    if (!userId || !accountId || !categoryId || !type || !amount || !transactionDate) {
      return badRequest("userId, accountId, categoryId, type, amount y transactionDate son obligatorios");
    }

    if (!allowedTypes.has(type)) {
      return badRequest("type inválido");
    }

    const created = await runTransaction(async (client) => {
      const insertResult = await client.query(
        `INSERT INTO transactions (user_id, account_id, category_id, type, amount, currency, description, notes, transaction_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, user_id AS "userId", account_id AS "accountId", category_id AS "categoryId",
                   type, amount, currency, description, notes, transaction_date AS "transactionDate", created_at AS "createdAt"`,
        [userId, accountId, categoryId, type, amount, currency, description, notes, transactionDate]
      );

      const delta = balanceDelta(type, amount);
      if (delta !== 0) {
        await client.query("UPDATE accounts SET current_balance = current_balance + $1 WHERE id = $2", [delta, accountId]);
      }

      return insertResult.rows[0];
    });

    return jsonResponse({ data: created }, { status: 201 });
  } catch (error) {
    if (error.message === "Monto inválido") {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}
