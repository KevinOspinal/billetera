import { badRequest, jsonResponse, notFound, serverError } from "@/lib/api";
import { query } from "@/lib/db";

/**
 * Convierte el parámetro dinámico en entero y nos asegura que no se inyecten
 * strings o UUIDs inesperados. Si falla lanzamos y centralizamos el manejo abajo.
 */
function ensureId(params) {
  const { id } = params;
  const accountId = Number(id);
  if (!Number.isInteger(accountId)) {
    throw new Error("ID inválido");
  }
  return accountId;
}

/**
 * GET /api/accounts/:id → trae una única cuenta. Ideal para vistas de detalle o
 * formularios de edición que necesitan el snapshot actual.
 */
export async function GET(_request, { params }) {
  try {
    const accountId = ensureId(params);
    const { rows } = await query(
      `SELECT id, user_id AS "userId", name, type, currency, initial_balance AS "initialBalance",
              current_balance AS "currentBalance", status, created_at AS "createdAt"
         FROM accounts WHERE id = $1`,
      [accountId]
    );

    if (!rows.length) {
      return notFound("Cuenta no encontrada");
    }

    return jsonResponse({ data: rows[0] });
  } catch (error) {
    if (error.message === "ID inválido") {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}

/**
 * PUT /api/accounts/:id
 * - No forzamos enviar todos los campos; construimos dinámicamente la sentencia con lo que venga.
 * - Esto permite que un formulario parcial (por ejemplo solo el nombre) funcione igual de bien.
 */
export async function PUT(request, { params }) {
  try {
    const accountId = ensureId(params);
    const body = await request.json();
    const fields = [];
    const values = [];

    [
      ["name", body.name],
      ["type", body.type],
      ["currency", body.currency],
      ["status", body.status],
      ["initial_balance", body.initialBalance],
      ["current_balance", body.currentBalance],
    ].forEach(([column, value]) => {
      if (typeof value !== "undefined") {
        fields.push(`${column} = $${fields.length + 1}`);
        values.push(value);
      }
    });

    if (!fields.length) {
      return badRequest("No hay datos para actualizar");
    }

    values.push(accountId);
    const { rows } = await query(
      `UPDATE accounts SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING id, user_id AS "userId", name, type, currency,
                  initial_balance AS "initialBalance", current_balance AS "currentBalance", status, created_at AS "createdAt"`,
      values
    );

    if (!rows.length) {
      return notFound("Cuenta no encontrada");
    }

    return jsonResponse({ data: rows[0] });
  } catch (error) {
    if (error.message === "ID inválido") {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}

/**
 * DELETE /api/accounts/:id
 * - Operación idempotente: si no existe devolvemos 404, si se borra respondemos success.
 */
export async function DELETE(_request, { params }) {
  try {
    const accountId = ensureId(params);
    const { rows } = await query("DELETE FROM accounts WHERE id = $1 RETURNING id", [accountId]);
    if (!rows.length) {
      return notFound("Cuenta no encontrada");
    }

    return jsonResponse({ success: true });
  } catch (error) {
    if (error.message === "ID inválido") {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}
