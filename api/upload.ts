import { put } from "@vercel/blob"
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { requireAdmin } from "./lib/auth"
import { badRequest, json, methodNotAllowed, serverError } from "./lib/response"

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4.5mb",
    },
  },
}

function sanitizeUploadName(filename: string): string {
  const base = filename.split(/[/\\]/).pop() || "cover"
  const dot = base.lastIndexOf(".")
  const ext = dot > 0 ? base.slice(dot).toLowerCase().replace(/[^a-z0-9.]/g, "") : ".png"
  const name = (dot > 0 ? base.slice(0, dot) : base)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

  return `${name || "cover"}${ext || ".png"}`
}

/**
 * Server-side Blob upload for admin cover images.
 * Avoids browser CORS failures against vercel.com/api/blob during local vercel dev.
 * Limit ~4.5MB (Vercel function body). Compress larger images before upload.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    methodNotAllowed(res, ["POST"])
    return
  }

  if (!requireAdmin(req, res)) return

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    json(res, 500, {
      error:
        "BLOB_READ_WRITE_TOKEN is not set. Add it to .env.local and restart vercel dev.",
    })
    return
  }

  try {
    const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as {
      filename?: string
      contentType?: string
      data?: string
      access?: "public" | "private"
    }

    if (!body?.filename || !body?.data) {
      badRequest(res, "filename and data (base64) are required")
      return
    }

    const buffer = Buffer.from(body.data, "base64")
    if (!buffer.length) {
      badRequest(res, "Empty file data")
      return
    }
    if (buffer.length > 4 * 1024 * 1024) {
      badRequest(
        res,
        "Image is too large for upload (max 4MB). Compress the image and try again.",
      )
      return
    }

    const contentType = body.contentType || "application/octet-stream"
    if (!contentType.startsWith("image/")) {
      badRequest(res, "Only image uploads are allowed")
      return
    }

    const pathname = `blog/covers/${sanitizeUploadName(body.filename)}`
    const access = body.access === "private" ? "private" : "public"

    try {
      const blob = await put(pathname, buffer, {
        access,
        token,
        contentType,
        addRandomSuffix: true,
      })
      json(res, 200, {
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        downloadUrl: blob.downloadUrl,
      })
    } catch (error) {
      // If the store is private-only, retry once as private so local upload still works.
      const message = error instanceof Error ? error.message : String(error)
      if (access === "public" && /public|access|private/i.test(message)) {
        const blob = await put(pathname, buffer, {
          access: "private",
          token,
          contentType,
          addRandomSuffix: true,
        })
        json(res, 200, {
          url: blob.url,
          pathname: blob.pathname,
          contentType: blob.contentType,
          downloadUrl: blob.downloadUrl,
          warning: "Store appears private-only; uploaded as private.",
        })
        return
      }
      throw error
    }
  } catch (error) {
    serverError(res, error)
  }
}
