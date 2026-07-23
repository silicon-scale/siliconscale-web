import { get } from "@vercel/blob"
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { badRequest, methodNotAllowed, notFound, serverError } from "../lib/server/response.js"

/**
 * Public media proxy for private Vercel Blob objects (blog covers).
 * Only serves pathnames under blog/covers/ from our store.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    methodNotAllowed(res, ["GET", "HEAD"])
    return
  }

  try {
    const raw = typeof req.query.pathname === "string" ? req.query.pathname : ""
    const pathname = decodeURIComponent(raw).replace(/^\/+/, "")

    if (!pathname || pathname.includes("..") || pathname.includes("//")) {
      badRequest(res, "Invalid pathname")
      return
    }

    if (!pathname.startsWith("blog/covers/")) {
      badRequest(res, "Only blog cover media can be served")
      return
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      serverError(res, new Error("BLOB_READ_WRITE_TOKEN is not configured"))
      return
    }

    const result = await get(pathname, {
      access: "private",
      token,
    })

    if (!result || result.statusCode !== 200 || !result.stream) {
      notFound(res, "Media not found")
      return
    }

    const contentType = result.blob.contentType || "application/octet-stream"
    res.setHeader("Content-Type", contentType)
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
    if (result.blob.contentDisposition) {
      res.setHeader("Content-Disposition", result.blob.contentDisposition)
    }

    if (req.method === "HEAD") {
      res.status(200).end()
      return
    }

    res.status(200)
    const reader = result.stream.getReader()
    const pump = async (): Promise<void> => {
      const { done, value } = await reader.read()
      if (done) {
        res.end()
        return
      }
      res.write(Buffer.from(value))
      await pump()
    }
    await pump()
  } catch (error) {
    serverError(res, error)
  }
}
