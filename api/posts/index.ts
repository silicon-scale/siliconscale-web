import type { VercelRequest, VercelResponse } from "@vercel/node"
import { requireAdmin } from "../lib/auth"
import { createPost, listPosts } from "../lib/posts"
import { badRequest, json, methodNotAllowed, serverError } from "../lib/response"
import type { PostInput, PostStatus } from "../lib/types"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const statusParam = typeof req.query.status === "string" ? req.query.status : undefined
      if (statusParam && statusParam !== "draft" && statusParam !== "published") {
        badRequest(res, "Invalid status filter. Use draft or published.")
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
