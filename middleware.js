import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const PUBLIC_PATHS = new Set(["/login", "/"]);

function normalizePathname(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const filtered = segments.filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));
  return filtered.length ? `/${filtered.join("/")}` : "/";
}

export async function middleware(request) {
  const pathname = normalizePathname(request.nextUrl.pathname);
  const token = request.cookies.get("session")?.value;
  let session = null;

  if (token) {
    try {
      session = await verifySessionToken(token);
    } catch (error) {
      console.error("Token inválido", error);
    }
  }

  const isPublic = PUBLIC_PATHS.has(pathname);

  if (!session && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && pathname === "/login") {
    const redirectUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
