import type { VercelRequest, VercelResponse } from "@vercel/node"
import { buildClearSessionCookie } from "../../lib/server/auth.js"
import { json, methodNotAllowed } from "../../lib/server/response.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    methodNotAllowed(res, ["POST"])
    return
  }

  res.setHeader("Set-Cookie", buildClearSessionCookie())
  json(res, 200, { ok: true })
}
