import type { Post } from "@/types/post"

export async function listPublishedPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts?status=published", {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(data.error || `Failed to load posts (${res.status})`)
  }

  const data = (await res.json()) as { posts?: Post[] }
  return data.posts ?? []
}

export async function getPublishedPost(slug: string): Promise<Post> {
  const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  })

  const data = (await res.json().catch(() => ({}))) as {
    error?: string
    post?: Post
  }

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
