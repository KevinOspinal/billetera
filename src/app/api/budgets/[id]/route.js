import { badRequest, jsonResponse, notFound, serverError } from "@/lib/api";
import { query } from "@/lib/db";

// Asegura que el id sea numérico antes de consultar la BD.
function parseId(params) {
  const { id } = params;
  const numeric = Number(id);
  if (!Number.isInteger(numeric)) throw new Error("ID inválido");
  return numeric;
}

// Actualiza los campos enviados para el presupuesto dado.
export async function PUT(request, { params }) {
  try {
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
    const { rows } = await query(
      `UPDATE budgets SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING id, user_id AS "userId", category_id AS "categoryId", period,
                  period_start AS "periodStart", period_end AS "periodEnd",
                  limit_amount AS "limitAmount", status, created_at AS "createdAt"`,
      values
    );

    if (!rows.length) return notFound("Presupuesto no encontrado");

    return jsonResponse({ data: rows[0] });
  } catch (error) {
    if (error.message === "ID inválido") return badRequest(error.message);
    return serverError(error);
  }
}

// Elimina el presupuesto definitivamente.
export async function DELETE(_request, { params }) {
  try {
    const budgetId = parseId(params);
    const { rows } = await query("DELETE FROM budgets WHERE id = $1 RETURNING id", [budgetId]);
    if (!rows.length) return notFound("Presupuesto no encontrado");
    return jsonResponse({ success: true });
  } catch (error) {
    if (error.message === "ID inválido") return badRequest(error.message);
    return serverError(error);
  }
}
