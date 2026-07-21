import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  buildSessionCookie,
  createAdminSessionToken,
  timingSafeCompare,
} from "../lib/auth"
import { badRequest, json, methodNotAllowed, serverError } from "../lib/response"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    methodNotAllowed(res, ["POST"])
    return
  }

  try {
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      serverError(res, new Error("ADMIN_PASSWORD is not configured"))
      return
    }

    const body = (req.body ?? {}) as { password?: string }
    const password = typeof body.password === "string" ? body.password : ""

    if (!password) {
      badRequest(res, "Password is required")
      return
    }

    if (!timingSafeCompare(password, adminPassword)) {
      // Uniform delay-ish response shape; avoid leaking whether password was close.
      json(res, 401, { error: "Invalid password" })
      return
    }

    const token = createAdminSessionToken()
    res.setHeader("Set-Cookie", buildSessionCookie(token))
    json(res, 200, { ok: true })
  } catch (error) {
    serverError(res, error)
  }
}
