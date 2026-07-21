import type { VercelResponse } from "@vercel/node"

export function json(res: VercelResponse, status: number, body: unknown): void {
  res.status(status).setHeader("Content-Type", "application/json").json(body)
}

export function methodNotAllowed(res: VercelResponse, allowed: string[]): void {
  res
    .status(405)
    .setHeader("Allow", allowed.join(", "))
    .json({ error: "Method not allowed" })
}

export function badRequest(res: VercelResponse, message: string): void {
  json(res, 400, { error: message })
}

export function notFound(res: VercelResponse, message = "Not found"): void {
  json(res, 404, { error: message })
}

export function serverError(res: VercelResponse, error: unknown): void {
  const message = error instanceof Error ? error.message : "Internal server error"
  console.error("[api]", error)
  json(res, 500, { error: message })
}
