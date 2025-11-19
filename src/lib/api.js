// Utilidades para homogeneizar respuestas JSON en los endpoints.
export function jsonResponse(data, init = {}) {
  return Response.json(data, init);
}

export function badRequest(message) {
  return jsonResponse({ error: message }, { status: 400 });
}

export function notFound(message = "Recurso no encontrado") {
  return jsonResponse({ error: message }, { status: 404 });
}

export function serverError(error) {
  console.error(error);
  return jsonResponse({ error: "Error interno" }, { status: 500 });
}
