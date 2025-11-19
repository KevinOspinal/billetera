import { badRequest, jsonResponse, serverError } from "@/lib/api";
import { query } from "@/lib/db";

/**
 * GET /api/categories?userId=1&type=expense
 * - Soporta filtro opcional por tipo para que el frontend pueda poblar selects separados
 *   (ej: ingresos vs gastos).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return badRequest("userId es requerido");

    const type = searchParams.get("type");
    const params = [userId];
    const conditions = ["user_id = $1"];
    if (type) {
      params.push(type);
      conditions.push(`type = $${params.length}`);
    }

    const { rows } = await query(
      `SELECT id, user_id AS "userId", name, type, color, created_at AS "createdAt"
         FROM categories
        WHERE ${conditions.join(" AND ")}
        ORDER BY name ASC`,
      params
    );

    return jsonResponse({ data: rows });
  } catch (error) {
    return serverError(error);
  }
}

/**
 * POST /api/categories
 * - Sirve para construir el catálogo personalizado del usuario; de momento no validamos
 *   duplicados por nombre, pero podría añadirse en la BD con un índice único.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, name, type, color } = body;
    if (!userId || !name || !type) {
      return badRequest("userId, name y type son obligatorios");
    }

    const { rows } = await query(
      `INSERT INTO categories (user_id, name, type, color)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id AS "userId", name, type, color, created_at AS "createdAt"`,
      [userId, name, type, color]
    );

    return jsonResponse({ data: rows[0] }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
