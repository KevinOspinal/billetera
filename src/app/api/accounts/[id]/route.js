import { badRequest, jsonResponse, notFound, serverError } from "@/lib/api";
import { query } from "@/lib/db";

/**
 * Convierte el parámetro dinámico en entero y nos asegura que no se inyecten
 * strings o UUIDs inesperados. Si el enrutador no entrega `params.id`, tratamos de
 * extraer el último segmento directamente desde la URL.
 */
function ensureId(request, params = {}) {
  let raw = params?.id;

  if ((raw === undefined || raw === null) && request) {
    try {
      const url = request.nextUrl ?? new URL(request.url);
      const segments = url.pathname.split("/").filter(Boolean);
      raw = segments[segments.length - 1];
    } catch {
      raw = undefined;
    }
  }

  if (raw === undefined || raw === null) {
    throw new Error("ID inválido");
  }

  const normalized = typeof raw === "string" ? raw.trim() : String(raw);
  if (!normalized) {
    throw new Error("ID inválido");
  }

  const accountId = Number.parseInt(normalized, 10);
  if (Number.isNaN(accountId)) {
    throw new Error("ID inválido");
  }

  return accountId;
}

/**
 * GET /api/accounts/:id → trae una única cuenta. Ideal para vistas de detalle o
 * formularios de edición que necesitan el snapshot actual.
 */
export async function GET(request, { params }) {
  try {
    const accountId = ensureId(request, params);
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
    const accountId = ensureId(request, params);
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
export async function DELETE(request, { params }) {
  try {
    const accountId = ensureId(request, params);
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
