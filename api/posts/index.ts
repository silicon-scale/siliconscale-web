import type { VercelRequest, VercelResponse } from "@vercel/node"
import { isAdminRequest, requireAdmin } from "../lib/auth.js"
import { createPost, listPosts } from "../lib/posts.js"
import { badRequest, json, methodNotAllowed, serverError } from "../lib/response.js"
import type { PostInput, PostStatus } from "../lib/types.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const statusParam = typeof req.query.status === "string" ? req.query.status : undefined
      if (statusParam && statusParam !== "draft" && statusParam !== "published") {
        badRequest(res, "Invalid status filter. Use draft or published.")
        return
      }

      // Public callers may only list published posts. Full / draft lists need admin.
      if (statusParam !== "published" && !isAdminRequest(req)) {
        res.status(401).json({ error: "Unauthorized" })
        return
      }

      const posts = await listPosts(statusParam as PostStatus | undefined)
      json(res, 200, { posts })
      return
    }

    if (req.method === "POST") {
      if (!requireAdmin(req, res)) return

      const body = (req.body ?? {}) as PostInput
      if (!body.slug || !body.title) {
        badRequest(res, "slug and title are required")
        return
      }

      const post = await createPost(body)
      json(res, 201, { post })
      return
    }

    methodNotAllowed(res, ["GET", "POST"])
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      badRequest(res, "A post with this slug already exists")
      return
    }
    serverError(res, error)
  }
}
