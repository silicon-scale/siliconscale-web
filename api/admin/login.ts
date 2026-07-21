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
    const adminPassword = process.env.ADMIN_PASSWORD?.trim()
    if (!adminPassword) {
      json(res, 500, {
        error:
          "ADMIN_PASSWORD is not configured. Add it to .env.local (and the Vercel dashboard), then restart vercel dev.",
      })
      return
    }

    const body = (req.body ?? {}) as { password?: string }
    const password = typeof body.password === "string" ? body.password : ""

    if (!password) {
      badRequest(res, "Password is required")
      return
    }

    if (!timingSafeCompare(password, adminPassword)) {
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
