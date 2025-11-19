import { badRequest, jsonResponse, notFound, serverError } from "@/lib/api";
import { query, transaction as runTransaction } from "@/lib/db";

const allowedTypes = new Set(["income", "expense", "transfer"]);

// Convierte el parámetro :id a entero o lanza error si no es válido.
function parseId(params) {
  const { id } = params;
  const parsed = Number(id);
  if (!Number.isInteger(parsed)) throw new Error("ID inválido");
  return parsed;
}

// Reutilizado para revertir o aplicar el efecto de la transacción en la cuenta.
function balanceDelta(type, amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) {
    throw new Error("Monto inválido");
  }
  if (type === "income") return value;
  if (type === "expense") return -value;
  return 0;
}

// Devuelve los datos de una transacción concreta.
export async function GET(_request, { params }) {
  try {
    const transactionId = parseId(params);
    const { rows } = await query(
      `SELECT id, user_id AS "userId", account_id AS "accountId", category_id AS "categoryId",
              type, amount, currency, exchange_rate AS "exchangeRate",
              description, notes, transaction_date AS "transactionDate", created_at AS "createdAt"
         FROM transactions WHERE id = $1`,
      [transactionId]
    );

    if (!rows.length) {
      return notFound("Transacción no encontrada");
    }

    return jsonResponse({ data: rows[0] });
  } catch (error) {
    if (error.message === "ID inválido") return badRequest(error.message);
    return serverError(error);
  }
}

// Permite editar la transacción y mantiene consistente el saldo de la cuenta.
export async function PUT(request, { params }) {
  try {
    const transactionId = parseId(params);
    const body = await request.json();

    if (body.type && !allowedTypes.has(body.type)) {
      return badRequest("type inválido");
    }

    const updated = await runTransaction(async (client) => {
      const existingResult = await client.query("SELECT * FROM transactions WHERE id = $1", [transactionId]);
      if (!existingResult.rows.length) {
        return null;
      }
      const current = existingResult.rows[0];

      const nextAmount = typeof body.amount !== "undefined" ? Number(body.amount) : Number(current.amount);
      if (Number.isNaN(nextAmount)) {
        throw new Error("Monto inválido");
      }

      const next = {
        account_id: body.accountId ?? current.account_id,
        category_id: body.categoryId ?? current.category_id,
        type: body.type ?? current.type,
        amount: nextAmount,
        currency: body.currency ?? current.currency,
        description: body.description ?? current.description,
        notes: body.notes ?? current.notes,
        transaction_date: body.transactionDate ?? current.transaction_date,
      };

      const needsBalanceUpdate =
        next.account_id !== current.account_id ||
        next.amount !== Number(current.amount) ||
        next.type !== current.type;

      if (needsBalanceUpdate) {
        const rollbackDelta = balanceDelta(current.type, current.amount);
        if (rollbackDelta !== 0) {
          await client.query("UPDATE accounts SET current_balance = current_balance - $1 WHERE id = $2", [rollbackDelta, current.account_id]);
        }
        const newDelta = balanceDelta(next.type, next.amount);
        if (newDelta !== 0) {
          await client.query("UPDATE accounts SET current_balance = current_balance + $1 WHERE id = $2", [newDelta, next.account_id]);
        }
      }

      const updateResult = await client.query(
        `UPDATE transactions
            SET account_id = $1,
                category_id = $2,
                type = $3,
                amount = $4,
                currency = $5,
                description = $6,
                notes = $7,
                transaction_date = $8,
                updated_at = now()
          WHERE id = $9
          RETURNING id, user_id AS "userId", account_id AS "accountId", category_id AS "categoryId",
                    type, amount, currency, description, notes, transaction_date AS "transactionDate", created_at AS "createdAt"`,
        [
          next.account_id,
          next.category_id,
          next.type,
          next.amount,
          next.currency,
          next.description,
          next.notes,
          next.transaction_date,
          transactionId,
        ]
      );

      return updateResult.rows[0];
    });

    if (!updated) {
      return notFound("Transacción no encontrada");
    }

    return jsonResponse({ data: updated });
  } catch (error) {
    if (error.message === "ID inválido" || error.message === "Monto inválido") {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}

// Elimina la transacción y revierte su impacto en la cuenta.
export async function DELETE(_request, { params }) {
  try {
    const transactionId = parseId(params);

    const deleted = await runTransaction(async (client) => {
      const existingResult = await client.query("SELECT * FROM transactions WHERE id = $1", [transactionId]);
      if (!existingResult.rows.length) {
        return false;
      }
      const current = existingResult.rows[0];

      const delta = balanceDelta(current.type, current.amount);
      if (delta !== 0) {
        await client.query("UPDATE accounts SET current_balance = current_balance - $1 WHERE id = $2", [delta, current.account_id]);
      }

      await client.query("DELETE FROM transactions WHERE id = $1", [transactionId]);
      return true;
    });

    if (!deleted) {
      return notFound("Transacción no encontrada");
    }

    return jsonResponse({ success: true });
  } catch (error) {
    if (error.message === "ID inválido") {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}
