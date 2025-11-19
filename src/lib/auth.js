import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const TOKEN_NAME = "session";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 días

function getSecretKey() {
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET no está definido");
  }
  return new TextEncoder().encode(process.env.AUTH_SECRET);
}

export function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export async function createSessionToken(payload) {
  const secret = getSecretKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(secret);
}

export async function verifySessionToken(token) {
  const secret = getSecretKey();
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export function buildSessionCookie(token) {
  return `${TOKEN_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TOKEN_TTL_SECONDS};`;
}

export function clearSessionCookie() {
  return `${TOKEN_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`;
}

export function getTokenFromRequest(request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      return [name, rest.join("=")];
    })
  );
  return cookies[TOKEN_NAME] ?? null;
}
