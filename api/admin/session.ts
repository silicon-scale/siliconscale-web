import type { VercelRequest, VercelResponse } from "@vercel/node"
import { isAdminRequest } from "../lib/auth.js"
import { json, methodNotAllowed } from "../lib/response.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    methodNotAllowed(res, ["GET"])
    return
  }

  json(res, 200, { authenticated: isAdminRequest(req) })
}
