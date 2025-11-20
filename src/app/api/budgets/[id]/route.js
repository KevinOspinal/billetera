import { badRequest, jsonResponse, notFound, serverError } from "@/lib/api";
import { query } from "@/lib/db";
import { mapBudgetRow } from "@/lib/budgets";

// Asegura que el id sea numérico antes de consultar la BD.
function parseId(params = {}) {
  const raw = params.id;
  if (raw === undefined || raw === null) {
    throw new Error("ID inválido");
  }

  const trimmed = typeof raw === "string" ? raw.trim() : String(raw);
  if (!trimmed) {
    throw new Error("ID inválido");
  }

  const numeric = Number.parseInt(trimmed, 10);
  if (Number.isNaN(numeric)) {
    throw new Error("ID inválido");
  }
  return numeric;
}

// Actualiza los campos enviados para el presupuesto dado.
export async function PUT(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const budgetId = parseId(params);
    const body = await request.json();

    const fields = [];
    const values = [];
    [
      ["category_id", body.categoryId],
      ["period", body.period],
      ["period_start", body.periodStart],
      ["period_end", body.periodEnd],
      ["limit_amount", body.limitAmount],
      ["status", body.status],
    ].forEach(([column, value]) => {
      if (typeof value !== "undefined") {
        fields.push(`${column} = $${fields.length + 1}`);
        values.push(value);
      }
    });

    if (!fields.length) return badRequest("No hay datos para actualizar");

    values.push(budgetId);
    values.push(budgetId);
    const updateResult = await query(
      `UPDATE budgets SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING id`,
      values
    );

    if (!updateResult.rows.length) return notFound("Presupuesto no encontrado");

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

    return jsonResponse({ data: mapBudgetRow(rows[0]) });
  } catch (error) {
    if (error.message === "ID inválido") return badRequest(error.message);
    return serverError(error);
  }
}

// Elimina el presupuesto definitivamente.
export async function DELETE(_request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const budgetId = parseId(params);
    const { rows } = await query("DELETE FROM budgets WHERE id = $1 RETURNING id", [budgetId]);
    if (!rows.length) return notFound("Presupuesto no encontrado");
    return jsonResponse({ success: true });
  } catch (error) {
    if (error.message === "ID inválido") return badRequest(error.message);
    return serverError(error);
  }
}
