import { jsonResponse } from "@/lib/api";
import { getSessionUserFromRequest } from "@/lib/session";

export async function GET(request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) {
    return jsonResponse({ data: null }, { status: 401 });
  }
  return jsonResponse({ data: user });
}
