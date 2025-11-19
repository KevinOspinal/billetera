import { badRequest, jsonResponse, notFound, serverError } from "@/lib/api";
import { query } from "@/lib/db";

function parseId(params) {
  const numeric = Number(params.id);
  if (!Number.isInteger(numeric)) throw new Error("ID inválido");
  return numeric;
}

// Permite renombrar una categoría o cambiar su tipo/color.
export async function PUT(request, { params }) {
  try {
    const categoryId = parseId(params);
    const body = await request.json();

    const fields = [];
    const values = [];
    [
      ["name", body.name],
      ["type", body.type],
      ["color", body.color],
    ].forEach(([column, value]) => {
      if (typeof value !== "undefined") {
        fields.push(`${column} = $${fields.length + 1}`);
        values.push(value);
      }
    });

    if (!fields.length) return badRequest("No hay datos para actualizar");

    values.push(categoryId);
    const { rows } = await query(
      `UPDATE categories SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING id, user_id AS "userId", name, type, color, created_at AS "createdAt"`,
      values
    );

    if (!rows.length) return notFound("Categoría no encontrada");

    return jsonResponse({ data: rows[0] });
  } catch (error) {
    if (error.message === "ID inválido") return badRequest(error.message);
    return serverError(error);
  }
}

// Eliminación física (en un futuro podríamos migrar a soft-delete si hay referencias).
export async function DELETE(_request, { params }) {
  try {
    const categoryId = parseId(params);
    const { rows } = await query("DELETE FROM categories WHERE id = $1 RETURNING id", [categoryId]);
    if (!rows.length) return notFound("Categoría no encontrada");
    return jsonResponse({ success: true });
  } catch (error) {
    if (error.message === "ID inválido") return badRequest(error.message);
    return serverError(error);
  }
}
