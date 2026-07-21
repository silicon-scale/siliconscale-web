import { marked } from "marked"
import {
  FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import {
  AdminApiError,
  createPost,
  listAllPosts,
  slugifyTitle,
  updatePost,
} from "@/lib/admin-api"
import { uploadCoverImage, isUploadAbortError } from "@/lib/blob-upload"
import type { Post, PostStatus } from "@/types/post"
import { AdminChrome, AdminGate } from "./AdminShell"

const AUTOSAVE_MS = 30_000

marked.setOptions({ gfm: true, breaks: true })

interface EditorForm {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string
  tags: string
  status: PostStatus
  meta_title: string
  meta_description: string
}

function emptyForm(): EditorForm {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    tags: "",
    status: "draft",
    meta_title: "",
    meta_description: "",
  }
}

function postToForm(post: Post): EditorForm {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    cover_image_url: post.cover_image_url ?? "",
    tags: post.tags.join(", "),
    status: post.status,
    meta_title: post.meta_title ?? "",
    meta_description: post.meta_description ?? "",
  }
}

function formToPayload(form: EditorForm) {
  return {
    title: form.title.trim(),
    slug: form.slug.trim() || slugifyTitle(form.title),
    excerpt: form.excerpt.trim(),
    content: form.content,
    cover_image_url: form.cover_image_url.trim() || null,
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    status: form.status,
    meta_title: form.meta_title.trim() || null,
    meta_description: form.meta_description.trim() || null,
  }
}

function AdminEditorInner() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id
  const navigate = useNavigate()
  const location = useLocation()
  const seeded = (location.state as { post?: Post } | null)?.post

  const [form, setForm] = useState<EditorForm>(() =>
    seeded && seeded.id === id ? postToForm(seeded) : emptyForm(),
  )
  const [postId, setPostId] = useState<string | null>(id ?? null)
  const [slugLocked, setSlugLocked] = useState(Boolean(id))
  const [loading, setLoading] = useState(Boolean(id) && !seeded)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  const formRef = useRef(form)
  const dirtyRef = useRef(dirty)
  const postIdRef = useRef(postId)
  const savingRef = useRef(saving)
  const uploadAbortRef = useRef<AbortController | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    return () => {
      uploadAbortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    formRef.current = form
  }, [form])
  useEffect(() => {
    dirtyRef.current = dirty
  }, [dirty])
  useEffect(() => {
    postIdRef.current = postId
  }, [postId])
  useEffect(() => {
    savingRef.current = saving
  }, [saving])

  useEffect(() => {
    if (!id || seeded?.id === id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const posts = await listAllPosts()
        const found = posts.find((p) => p.id === id)
        if (!found) throw new AdminApiError("Post not found", 404)
        if (!cancelled) {
          setForm(postToForm(found))
          setPostId(found.id)
          setSlugLocked(true)
          setDirty(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof AdminApiError ? err.message : "Failed to load post")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, seeded])

  const previewHtml = useMemo(() => {
    try {
      return marked.parse(form.content || "_Nothing to preview yet._", {
        async: false,
      }) as string
    } catch {
      return "<p>Preview unavailable.</p>"
    }
  }, [form.content])

  const updateField = <K extends keyof EditorForm>(key: K, value: EditorForm[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === "title" && !slugLocked) {
        next.slug = slugifyTitle(String(value))
      }
      return next
    })
    setDirty(true)
    setNotice(null)
  }

  const persist = useCallback(
    async (opts?: { silent?: boolean; statusOverride?: PostStatus }) => {
      const current = formRef.current
      const payload = formToPayload({
        ...current,
        status: opts?.statusOverride ?? current.status,
      })

      if (!payload.title) {
        if (!opts?.silent) setError("Title is required before saving.")
        return null
      }
      if (!payload.slug) {
        if (!opts?.silent) setError("Slug is required before saving.")
        return null
      }

      setSaving(true)
      if (!opts?.silent) {
        setError(null)
        setNotice(null)
      }

      try {
        let saved: Post
        const existingId = postIdRef.current
        if (existingId) {
          saved = await updatePost(existingId, payload)
        } else {
          saved = await createPost(payload)
          setPostId(saved.id)
          postIdRef.current = saved.id
          if (isNew) {
            navigate(`/admin/edit/${saved.id}`, { replace: true, state: { post: saved } })
          }
        }
        setForm(postToForm(saved))
        setSlugLocked(true)
        setDirty(false)
        dirtyRef.current = false
        const stamp = new Date().toLocaleTimeString()
        setLastSavedAt(stamp)
        if (!opts?.silent) {
          setNotice(
            saved.status === "published"
              ? `Published “${saved.title}”.`
              : `Saved draft “${saved.title}”.`,
          )
        } else {
          setNotice(`Autosaved at ${stamp}.`)
        }
        return saved
      } catch (err) {
        const message =
          err instanceof AdminApiError ? err.message : "Save failed. Check your connection."
        setError(message)
        return null
      } finally {
        setSaving(false)
      }
    },
    [isNew, navigate],
  )

  // Autosave drafts every 30s when dirty
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!dirtyRef.current || savingRef.current) return
      const status = formRef.current.status
      // Only autosave as draft unless already published (then keep status)
      void persist({
        silent: true,
        statusOverride: status === "published" ? "published" : "draft",
      })
    }, AUTOSAVE_MS)
    return () => window.clearInterval(timer)
  }, [persist])

  function cancelCoverUpload(showNotice = true) {
    if (!uploadAbortRef.current) return
    uploadAbortRef.current.abort()
    uploadAbortRef.current = null
    setUploading(false)
    setUploadPct(0)
    if (coverInputRef.current) coverInputRef.current.value = ""
    if (showNotice) {
      setError(null)
      setNotice("Upload cancelled. You can choose another image.")
    }
  }

  async function handleCoverFile(file: File | null) {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Cover must be an image file.")
      return
    }

    // Cancel any in-flight upload before starting a new one.
    if (uploadAbortRef.current) {
      uploadAbortRef.current.abort()
      uploadAbortRef.current = null
    }

    const controller = new AbortController()
    uploadAbortRef.current = controller

    setUploading(true)
    setUploadPct(0)
    setError(null)
    setNotice(null)
    try {
      const result = await uploadCoverImage(file, {
        abortSignal: controller.signal,
        onProgress: (pct) => {
          if (uploadAbortRef.current === controller) {
            setUploadPct(Math.round(pct))
          }
        },
      })
      if (controller.signal.aborted || uploadAbortRef.current !== controller) return
      updateField("cover_image_url", result.url)
      setNotice("Cover image uploaded.")
    } catch (err) {
      if (isUploadAbortError(err) || controller.signal.aborted) {
        // cancelCoverUpload / superseding upload already handled UI state
        if (uploadAbortRef.current === controller) {
          setNotice("Upload cancelled. You can choose another image.")
        }
        return
      }
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      if (uploadAbortRef.current === controller) {
        uploadAbortRef.current = null
        setUploading(false)
        setUploadPct(0)
        if (coverInputRef.current) coverInputRef.current.value = ""
      }
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await persist()
  }

  async function publish() {
    updateField("status", "published")
    await persist({ statusOverride: "published" })
  }

  if (loading) {
    return (
      <AdminChrome title={isNew ? "New post" : "Edit post"}>
        <p className="text-sm text-white/50" role="status">
          Loading editor…
        </p>
      </AdminChrome>
    )
  }

  return (
    <AdminChrome
      title={isNew ? "New post" : "Edit post"}
      actions={
        <Link
          to="/admin"
          className="rounded-button inline-flex min-h-11 items-center border border-white/15 px-4 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white"
        >
          All posts
        </Link>
      }
    >
      {notice ? (
        <p
          className="mb-4 rounded-button border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100"
          role="status"
        >
          {notice}
          {lastSavedAt && notice.startsWith("Autosaved") ? null : lastSavedAt ? (
            <span className="ml-2 text-emerald-100/60">({lastSavedAt})</span>
          ) : null}
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

      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <Field label="Title" htmlFor="title">
              <input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={inputClass}
                required
              />
            </Field>

            <Field label="Slug" htmlFor="slug" hint="URL path under /blog/">
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugLocked(true)
                  updateField("slug", e.target.value)
                }}
                className={inputClass}
                required
              />
            </Field>

            <Field label="Excerpt" htmlFor="excerpt" hint="Listing + default meta description">
              <textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                rows={3}
                className={inputClass}
              />
            </Field>

            <Field label="Tags" htmlFor="tags" hint="Comma-separated">
              <input
                id="tags"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                className={inputClass}
                placeholder="shopify, ai, case-study"
              />
            </Field>

            <div>
              <span className="mb-2 block text-sm text-white/70">Status</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Post status">
                {(["draft", "published"] as PostStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateField("status", status)}
                    className={`rounded-button min-h-11 px-4 text-sm capitalize transition-colors ${
                      form.status === status
                        ? "bg-brand-gold text-brand-black"
                        : "border border-white/15 text-white/70 hover:border-white/30"
                    }`}
                    aria-pressed={form.status === status}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <span className="mb-2 block text-sm text-white/70">Cover image</span>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragging(false)
                  const file = e.dataTransfer.files?.[0] ?? null
                  void handleCoverFile(file)
                }}
                className={`rounded-button border border-dashed px-4 py-8 text-center transition-colors ${
                  dragging
                    ? "border-brand-gold/60 bg-brand-gold/10"
                    : "border-white/20 bg-white/[0.03]"
                }`}
              >
                {form.cover_image_url ? (
                  <img
                    src={form.cover_image_url}
                    alt="Cover preview"
                    className="mx-auto mb-4 max-h-40 rounded-button object-cover"
                    width={320}
                    height={160}
                  />
                ) : null}
                <p className="text-sm text-white/55">
                  {uploading
                    ? `Uploading… ${uploadPct}%`
                    : "Drag & drop an image, or choose a file"}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <label className="inline-flex min-h-11 cursor-pointer items-center rounded-button border border-white/15 px-4 text-sm text-white/80 hover:border-white/30">
                    {uploading ? "Replace file" : "Choose file"}
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                      className="sr-only"
                      onChange={(e) => {
                        const next = e.target.files?.[0] ?? null
                        void handleCoverFile(next)
                      }}
                    />
                  </label>
                  {uploading ? (
                    <button
                      type="button"
                      className="rounded-button inline-flex min-h-11 items-center border border-red-400/30 px-4 text-sm text-red-200 transition-colors hover:border-red-400/50"
                      onClick={() => cancelCoverUpload()}
                    >
                      Cancel upload
                    </button>
                  ) : null}
                  {form.cover_image_url && !uploading ? (
                    <button
                      type="button"
                      className="min-h-11 text-sm text-white/45 underline-offset-4 hover:text-white/70 hover:underline"
                      onClick={() => updateField("cover_image_url", "")}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <Field label="Meta title" htmlFor="meta_title" hint="Optional — falls back to title">
              <input
                id="meta_title"
                value={form.meta_title}
                onChange={(e) => updateField("meta_title", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field
              label="Meta description"
              htmlFor="meta_description"
              hint="Optional — falls back to excerpt"
            >
              <textarea
                id="meta_description"
                value={form.meta_description}
                onChange={(e) => updateField("meta_description", e.target.value)}
                rows={2}
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Content (Markdown)" htmlFor="content">
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              rows={22}
              className={`${inputClass} min-h-[28rem] font-mono text-[13px] leading-relaxed`}
              spellCheck
            />
          </Field>
          <div>
            <span className="mb-2 block text-sm text-white/70">Live preview</span>
            <div
              className="admin-md-preview min-h-[28rem] overflow-auto rounded-button border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-relaxed text-white/85"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-button min-h-11 bg-brand-gold px-5 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : dirty ? "Save" : "Saved"}
          </button>
          <button
            type="button"
            disabled={saving || uploading}
            onClick={() => void publish()}
            className="rounded-button min-h-11 border border-white/15 px-5 text-sm text-white/85 transition-colors hover:border-white/30 disabled:opacity-50"
          >
            Save & publish
          </button>
          {dirty ? (
            <span className="text-xs text-amber-200/80">Unsaved changes · autosaves every 30s</span>
          ) : lastSavedAt ? (
            <span className="text-xs text-white/40">Last saved {lastSavedAt}</span>
          ) : null}
        </div>
      </form>
    </AdminChrome>
  )
}

const inputClass =
  "w-full min-h-11 rounded-button border border-white/15 bg-white/[0.04] px-3 py-2 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-gold/60 focus:ring-2 focus:ring-brand-gold/25"

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm text-white/70">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-white/40">{hint}</p> : null}
    </div>
  )
}

export default function AdminEditor() {
  return (
    <AdminGate>
      <AdminEditorInner />
    </AdminGate>
  )
}
