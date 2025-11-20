import { badRequest, jsonResponse, serverError } from "@/lib/api";
import { query } from "@/lib/db";
import { mapBudgetRow } from "@/lib/budgets";

/**
 * GET /api/budgets?userId=1
 * - El frontend necesita todos los presupuestos abiertos para renderizar cards y barras de progreso.
 * - Ordenamos por fecha de inicio para que el más reciente aparezca primero.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return badRequest("userId es requerido");

    const { rows } = await query(
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
         FROM budgets
   LEFT JOIN categories c ON c.id = b.category_id
        WHERE b.user_id = $1
        ORDER BY b.period_start DESC`,
      [userId]
    );
    return jsonResponse({ data: rows.map(mapBudgetRow) });
  } catch (error) {
    return serverError(error);
  }
}

/**
 * POST /api/budgets
 * - Exigimos todos los campos necesarios para poder pintar correctamente las barre de progreso
 *   (necesitamos rango, categoría y límite).
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, categoryId, period, periodStart, periodEnd, limitAmount, status = "active" } = body;

    if (!userId || !categoryId || !period || !periodStart || !periodEnd || !limitAmount) {
      return badRequest("Campos obligatorios: userId, categoryId, period, periodStart, periodEnd, limitAmount");
    }

    const insertResult = await query(
      `INSERT INTO budgets (user_id, category_id, period, period_start, period_end, limit_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [userId, categoryId, period, periodStart, periodEnd, limitAmount, status]
    );

    const budgetId = insertResult.rows[0].id;
    const { rows } = await query(
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
        WHERE b.id = $1`,
      [budgetId]
    );

    return jsonResponse({ data: mapBudgetRow(rows[0]) }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
