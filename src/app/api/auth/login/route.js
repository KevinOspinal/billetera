import { badRequest, jsonResponse, serverError } from "@/lib/api";
import { query } from "@/lib/db";
import { verifyPassword, createSessionToken, buildSessionCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return badRequest("Email y contraseña son obligatorios");
    }

    const { rows } = await query(
      `SELECT id, name, email, password_hash
         FROM users
        WHERE email = $1`,
      [email]
    );

    if (!rows.length) {
      return badRequest("Credenciales inválidas");
    }

    const user = rows[0];
    if (!user.password_hash || !verifyPassword(password, user.password_hash)) {
      return badRequest("Credenciales inválidas");
    }

    const token = await createSessionToken({ sub: user.id.toString(), name: user.name, email: user.email });
    const cookie = buildSessionCookie(token);

    return new Response(JSON.stringify({ data: { id: user.id, name: user.name, email: user.email } }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
      },
    });
  } catch (error) {
    return serverError(error);
  }
}
