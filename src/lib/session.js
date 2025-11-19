import { cookies } from "next/headers";
import { getTokenFromRequest, verifySessionToken } from "@/lib/auth";

export async function getSessionUser() {
  const store = await cookies();
  const token = store?.get?.("session")?.value;
  if (!token) return null;
  try {
    const payload = await verifySessionToken(token);
    return { id: payload.sub, name: payload.name, email: payload.email };
  } catch (error) {
    console.error("Fallo al verificar token de sesión", error);
    return null;
  }
}

export async function getSessionUserFromRequest(request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  try {
    const payload = await verifySessionToken(token);
    return { id: payload.sub, name: payload.name, email: payload.email };
  } catch (error) {
    console.error("Fallo al verificar token de sesión", error);
    return null;
  }
}
