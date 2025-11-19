import { badRequest, jsonResponse, serverError } from "@/lib/api";
import { query } from "@/lib/db";

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
      `SELECT id, user_id AS "userId", category_id AS "categoryId", period,
              period_start AS "periodStart", period_end AS "periodEnd",
              limit_amount AS "limitAmount", status, created_at AS "createdAt"
         FROM budgets
        WHERE user_id = $1
        ORDER BY period_start DESC`,
      [userId]
    );
    return jsonResponse({ data: rows });
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

    const { rows } = await query(
      `INSERT INTO budgets (user_id, category_id, period, period_start, period_end, limit_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, user_id AS "userId", category_id AS "categoryId", period,
                 period_start AS "periodStart", period_end AS "periodEnd",
                 limit_amount AS "limitAmount", status, created_at AS "createdAt"`,
      [userId, categoryId, period, periodStart, periodEnd, limitAmount, status]
    );

    return jsonResponse({ data: rows[0] }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
