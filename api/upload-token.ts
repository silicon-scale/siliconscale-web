import type { HandleUploadBody } from "@vercel/blob/client"
import { handleUpload } from "@vercel/blob/client"
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { requireAdmin } from "./lib/auth.js"
import { json, methodNotAllowed, serverError } from "./lib/response.js"

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
    const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as HandleUploadBody

    // Do NOT pass onUploadCompleted — local vercel dev cannot resolve callbackUrl.
    const jsonResponse = await handleUpload({
      body,
      request: req,
      token,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
          "image/avif",
        ],
        maximumSizeInBytes: 15 * 1024 * 1024,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ purpose: "blog-cover" }),
      }),
    })

    json(res, 200, jsonResponse)
  } catch (error) {
    serverError(res, error)
  }
}
