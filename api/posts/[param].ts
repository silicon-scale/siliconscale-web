import type { VercelRequest, VercelResponse } from "@vercel/node"
import { isAdminRequest, requireAdmin } from "../lib/auth.js"
import {
  deletePost,
  getPostById,
  getPostBySlug,
  isUuid,
  updatePost,
} from "../lib/posts.js"
import { badRequest, json, methodNotAllowed, notFound, serverError } from "../lib/response.js"
import type { PostUpdateInput } from "../lib/types.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const param = req.query.param
  const identifier = Array.isArray(param) ? param[0] : param

  if (!identifier) {
    badRequest(res, "Missing post identifier")
    return
  }

  try {
    if (req.method === "GET") {
      const post = isUuid(identifier)
        ? await getPostById(identifier)
        : await getPostBySlug(identifier)
      if (!post) {
        notFound(res, "Post not found")
        return
      }
      if (post.status !== "published" && !isAdminRequest(req)) {
        notFound(res, "Post not found")
        return
      }
      json(res, 200, { post })
      return
    }

    if (req.method === "PUT") {
      if (!requireAdmin(req, res)) return
      if (!isUuid(identifier)) {
        badRequest(res, "Update requires a valid post id (UUID)")
        return
      }

      const body = (req.body ?? {}) as PostUpdateInput
      const post = await updatePost(identifier, body)
      if (!post) {
        notFound(res, "Post not found")
        return
      }
      json(res, 200, { post })
      return
    }

    if (req.method === "DELETE") {
      if (!requireAdmin(req, res)) return
      if (!isUuid(identifier)) {
        badRequest(res, "Delete requires a valid post id (UUID)")
        return
      }

      const deleted = await deletePost(identifier)
      if (!deleted) {
        notFound(res, "Post not found")
        return
      }
      json(res, 200, { ok: true })
      return
    }

    methodNotAllowed(res, ["GET", "PUT", "DELETE"])
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      badRequest(res, "A post with this slug already exists")
      return
    }
    serverError(res, error)
  }
}
