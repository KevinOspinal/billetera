import { query } from "@/lib/db";
import { badRequest, jsonResponse, serverError } from "@/lib/api";

/**
 * GET /api/accounts?userId=1
 * - También podríamos deducir el userId del token de sesión, pero por ahora viene en la query.
 * - Siempre devolvemos camelCase para que coincida con los componentes del frontend.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return badRequest("userId es requerido");
    }

    const { rows } = await query(
      `SELECT id, user_id AS "userId", name, type, currency, initial_balance AS "initialBalance",
              current_balance AS "currentBalance", status, created_at AS "createdAt"
         FROM accounts
        WHERE user_id = $1
        ORDER BY created_at DESC`,
      [userId]
    );

    return jsonResponse({ data: rows });
  } catch (error) {
    return serverError(error);
  }
}

/**
 * POST /api/accounts
 * - Espera `userId` (futuro: vendrá del token), `name`, y opcionalmente tipo, moneda y saldo inicial.
 * - iniciamos `current_balance` con el mismo valor de `initial_balance` para evitar discrepancias.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, name, type = "bank", currency = "COP", initialBalance = 0 } = body;

    if (!userId || !name) {
      return badRequest("userId y name son obligatorios");
    }

    const { rows } = await query(
      `INSERT INTO accounts (user_id, name, type, currency, initial_balance, current_balance)
       VALUES ($1, $2, $3, $4, $5, $5)
       RETURNING id, user_id AS "userId", name, type, currency, initial_balance AS "initialBalance",
                 current_balance AS "currentBalance", status, created_at AS "createdAt"`,
      [userId, name, type, currency, Number(initialBalance)]
    );

    return jsonResponse({ data: rows[0] }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
