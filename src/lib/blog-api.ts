import type { Post } from "@/types/post"

async function readJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text()
  const trimmed = text.trimStart()
  if (!trimmed) {
    throw new Error(`Empty API response (${res.status})`)
  }
  try {
    return JSON.parse(trimmed) as T
  } catch {
    // Vite-only (`pnpm dev`) used to return transformed `api/*.ts` source here.
    if (/^import\b/.test(trimmed) || trimmed.includes("API routes are unavailable")) {
      throw new Error(
        "Blog API is not running. Stop `pnpm dev` and start `pnpm dev:full` (vercel dev).",
      )
    }
    throw new Error(`Invalid API response (${res.status})`)
  }
}

export async function listPublishedPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts?status=published", {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  })

  const data = await readJsonResponse<{ error?: string; posts?: Post[] }>(res)

  if (!res.ok) {
    throw new Error(data.error || `Failed to load posts (${res.status})`)
  }

  return data.posts ?? []
}

export async function getPublishedPost(slug: string): Promise<Post> {
  const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  })

  const data = await readJsonResponse<{ error?: string; post?: Post }>(res)

  if (!res.ok || !data.post) {
    const err = new Error(data.error || `Post not found (${res.status})`) as Error & {
      status?: number
    }
    err.status = res.status
    throw err
  }

  if (data.post.status !== "published") {
    const err = new Error("Post not found") as Error & { status?: number }
    err.status = 404
    throw err
  }

  return data.post
}

export function getRelatedPosts(current: Post, all: Post[], limit = 3): Post[] {
  const tags = new Set(current.tags.map((t) => t.toLowerCase()))
  if (!tags.size) {
    return all.filter((p) => p.id !== current.id).slice(0, limit)
  }

  return all
    .filter((p) => p.id !== current.id)
    .map((p) => ({
      post: p,
      score: p.tags.reduce(
        (n, tag) => n + (tags.has(tag.toLowerCase()) ? 1 : 0),
        0,
      ),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.post)
}

export function formatPostDate(value: string | null): string {
  if (!value) return ""
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value))
  } catch {
    return ""
  }
}
