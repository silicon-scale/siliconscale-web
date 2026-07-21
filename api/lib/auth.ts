import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import type { VercelRequest, VercelResponse } from "@vercel/node"

export const ADMIN_SESSION_COOKIE = "admin_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error("SESSION_SECRET or ADMIN_PASSWORD must be set for admin auth.")
  }
  return secret
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url")
}

export function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export function createAdminSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS
  const payload = Buffer.from(JSON.stringify({ exp, v: 1 })).toString("base64url")
  const signature = signPayload(payload)
  return `${payload}.${signature}`
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false

  const [payload, signature] = token.split(".")
  if (!payload || !signature) return false

  const expected = signPayload(payload)
  if (!timingSafeCompare(signature, expected)) return false

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number
      v?: number
    }
    if (data.v !== 1 || typeof data.exp !== "number") return false
    return data.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {}
  return header.split(";").reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rest] = part.trim().split("=")
    if (!rawKey) return acc
    acc[rawKey] = decodeURIComponent(rest.join("="))
    return acc
  }, {})
}

export function getAdminSessionFromRequest(req: VercelRequest): string | undefined {
  const cookies = parseCookies(req.headers.cookie)
  return cookies[ADMIN_SESSION_COOKIE]
}

export function isAdminRequest(req: VercelRequest): boolean {
  return verifyAdminSessionToken(getAdminSessionFromRequest(req))
}

export function buildSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  return `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure}`
}

export function buildClearSessionCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  return `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
}

export function requireAdmin(
  req: VercelRequest,
  res: VercelResponse,
): boolean {
  if (isAdminRequest(req)) return true
  res.status(401).json({ error: "Unauthorized" })
  return false
}

export function generateCsrfToken(): string {
  return randomBytes(32).toString("base64url")
}
