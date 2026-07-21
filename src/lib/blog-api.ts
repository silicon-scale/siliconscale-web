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
