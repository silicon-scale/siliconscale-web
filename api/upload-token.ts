import type { HandleUploadBody } from "@vercel/blob/client"
import { handleUpload } from "@vercel/blob/client"
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { requireAdmin } from "./lib/auth"
import { json, methodNotAllowed, serverError } from "./lib/response"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    methodNotAllowed(res, ["POST"])
    return
  }

  if (!requireAdmin(req, res)) return

  try {
    const body = req.body as HandleUploadBody
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_pathname, _clientPayload, _multipart) => ({
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
