import { badRequest, jsonResponse, serverError } from "@/lib/api";
import { query, transaction } from "@/lib/db";

function parseId(value, field) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${field} inválido`);
  }
  return parsed;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const userId = Number(body.userId);
    const amount = Number(body.amount);

    if (!userId || !amount || amount <= 0) {
      return badRequest("userId y amount válido son obligatorios");
    }

    const fromAccountId = parseId(body.fromAccountId, "fromAccountId");
    const toAccountId = parseId(body.toAccountId, "toAccountId");

    if (fromAccountId === toAccountId) {
      return badRequest("Las cuentas deben ser distintas");
    }

    const description = body.description?.trim() || "Transferencia interna";
    const notes = body.notes?.trim() || "";
    const transactionDate = body.transactionDate ?? new Date().toISOString().slice(0, 10);

    const { rows: accountRows } = await query(
      `SELECT id, user_id AS "userId", currency, current_balance AS "currentBalance"
         FROM accounts
        WHERE id = ANY($1::int[])`,
      [[fromAccountId, toAccountId]]
    );

    if (accountRows.length !== 2) {
      return badRequest("No se encontraron ambas cuentas");
    }

    const fromAccount = accountRows.find((account) => account.id === fromAccountId);
    const toAccount = accountRows.find((account) => account.id === toAccountId);

    if (fromAccount.userId !== userId || toAccount.userId !== userId) {
      return badRequest("Las cuentas no pertenecen al usuario");
    }

    await transaction(async (client) => {
      await client.query(
        `INSERT INTO transactions (user_id, account_id, category_id, type, amount, currency, description, notes, transaction_date)
         VALUES ($1, $2, NULL, 'expense', $3, $4, $5, $6, $7)`,
        [userId, fromAccountId, amount, fromAccount.currency, description, notes, transactionDate]
      );

      await client.query("UPDATE accounts SET current_balance = current_balance - $1 WHERE id = $2", [amount, fromAccountId]);

      await client.query(
        `INSERT INTO transactions (user_id, account_id, category_id, type, amount, currency, description, notes, transaction_date)
         VALUES ($1, $2, NULL, 'income', $3, $4, $5, $6, $7)`,
        [userId, toAccountId, amount, toAccount.currency, description, notes, transactionDate]
      );

      await client.query("UPDATE accounts SET current_balance = current_balance + $1 WHERE id = $2", [amount, toAccountId]);
    });

    const { rows: updatedAccounts } = await query(
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
        WHERE id = ANY($1::int[])`,
      [[fromAccountId, toAccountId]]
    );

    return jsonResponse({ data: updatedAccounts });
  } catch (error) {
    if (error.message?.endsWith("inválido") || error.message?.includes("Las cuentas")) {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}
