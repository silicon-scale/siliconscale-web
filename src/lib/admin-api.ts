import type { Post, PostInput, PostUpdateInput } from "@/types/post"

export const ADMIN_UNAUTHORIZED_EVENT = "siliconscale:admin-unauthorized"

export class AdminApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "AdminApiError"
    this.status = status
  }
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof AdminApiError && error.status === 401
}

function notifyUnauthorized(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(ADMIN_UNAUTHORIZED_EVENT))
}

async function parseJson(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      ...init,
    })
  } catch {
    throw new AdminApiError("Network error. Check your connection and try again.", 0)
  }

  const data = await parseJson(res)

  if (!res.ok) {
    if (res.status === 401 && !path.includes("/api/admin/login")) {
      notifyUnauthorized()
      throw new AdminApiError("Your admin session expired. Please sign in again.", 401)
    }
    const message =
      typeof data.error === "string" ? data.error : `Request failed (${res.status})`
    throw new AdminApiError(message, res.status)
  }

  return data as T
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const data = await request<{ authenticated: boolean }>("/api/admin/session")
    return Boolean(data.authenticated)
  } catch (error) {
    // Session probe should not trigger the global unauthorized redirect loop.
    if (error instanceof AdminApiError && error.status === 0) throw error
    return false
  }
}

export async function adminLogin(password: string): Promise<void> {
  await request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  })
}

export async function adminLogout(): Promise<void> {
  await request("/api/admin/logout", { method: "POST" })
}

export async function listAllPosts(): Promise<Post[]> {
  const data = await request<{ posts: Post[] }>("/api/posts")
  return data.posts ?? []
}

export async function getAdminPost(idOrSlug: string): Promise<Post> {
  const data = await request<{ post: Post }>(
    `/api/posts/${encodeURIComponent(idOrSlug)}`,
  )
  return data.post
}

/** @deprecated Prefer getAdminPost — kept for call-site clarity */
export async function getPostBySlug(slug: string): Promise<Post> {
  return getAdminPost(slug)
}

export async function createPost(input: PostInput): Promise<Post> {
  const data = await request<{ post: Post }>("/api/posts", {
    method: "POST",
    body: JSON.stringify(input),
  })
  return data.post
}

export async function updatePost(id: string, input: PostUpdateInput): Promise<Post> {
  const data = await request<{ post: Post }>(`/api/posts/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  })
  return data.post
}

export async function deletePost(id: string): Promise<void> {
  await request(`/api/posts/${encodeURIComponent(id)}`, { method: "DELETE" })
}

export function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
