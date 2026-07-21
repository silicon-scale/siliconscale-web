import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AdminApiError, deletePost, listAllPosts } from "@/lib/admin-api"
import type { Post } from "@/types/post"
import { AdminChrome, AdminGate } from "./AdminShell"

function formatDate(value: string | null): string {
  if (!value) return "—"
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value))
  } catch {
    return "—"
  }
}

function AdminPostsInner() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listAllPosts()
      setPosts(data)
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Failed to load posts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleDelete(post: Post) {
    const confirmed = window.confirm(`Delete “${post.title}”? This cannot be undone.`)
    if (!confirmed) return

    setDeletingId(post.id)
    setNotice(null)
    setError(null)
    try {
      await deletePost(post.id)
      setPosts((prev) => prev.filter((p) => p.id !== post.id))
      setNotice(`Deleted “${post.title}”.`)
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Delete failed")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminChrome
      title="All posts"
      actions={
        <Link
          to="/admin/new"
          className="rounded-button inline-flex min-h-11 items-center bg-brand-gold px-4 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
        >
          New Post
        </Link>
      }
    >
      {notice ? (
        <p
          className="mb-4 rounded-button border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100"
          role="status"
        >
          {notice}
        </p>
      ) : null}
      {error ? (
        <p
          className="mb-4 rounded-button border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-white/50" role="status">
          Loading posts…
        </p>
      ) : posts.length === 0 ? (
        <div className="rounded-button border border-dashed border-white/15 px-6 py-16 text-center">
          <p className="font-sans text-white/60">No posts yet.</p>
          <Link
            to="/admin/new"
            className="mt-4 inline-flex min-h-11 items-center text-sm text-brand-gold underline-offset-4 hover:underline"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-sans text-base font-medium text-white">
                    {post.title || "Untitled"}
                  </h2>
                  <span
                    className={`rounded-button px-2 py-0.5 text-xs uppercase tracking-wide ${
                      post.status === "published"
                        ? "bg-emerald-500/15 text-emerald-200"
                        : "bg-white/10 text-white/55"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-white/45">
                  /{post.slug} · {post.reading_time_minutes} min · updated{" "}
                  {formatDate(post.updated_at)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/admin/edit/${post.id}`}
                  state={{ post }}
                  className="rounded-button inline-flex min-h-11 items-center border border-white/15 px-4 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => void handleDelete(post)}
                  disabled={deletingId === post.id}
                  className="rounded-button inline-flex min-h-11 items-center border border-red-400/25 px-4 text-sm text-red-200 transition-colors hover:border-red-400/50 disabled:opacity-50"
                  aria-label={`Delete ${post.title}`}
                >
                  {deletingId === post.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminChrome>
  )
}

export default function AdminPosts() {
  return (
    <AdminGate>
      <AdminPostsInner />
    </AdminGate>
  )
}
