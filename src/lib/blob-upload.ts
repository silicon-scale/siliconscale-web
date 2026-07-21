import { upload, type PutBlobResult } from "@vercel/blob/client"

export interface UploadCoverImageOptions {
  pathname?: string
  onProgress?: (percentage: number) => void
  abortSignal?: AbortSignal
}

function sanitizeUploadName(filename: string): string {
  const base = filename.split(/[/\\]/).pop() || "cover"
  const dot = base.lastIndexOf(".")
  const ext = dot > 0 ? base.slice(dot).toLowerCase().replace(/[^a-z0-9.]/g, "") : ".png"
  const name = (dot > 0 ? base.slice(0, dot) : base)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

  return `${name || "cover"}${ext || ".png"}`
}

/**
 * Upload a cover image directly to Vercel Blob via the client-upload flow.
 * Requires a valid admin session cookie (Phase 2 login).
 */
export async function uploadCoverImage(
  file: File,
  options: UploadCoverImageOptions = {},
): Promise<PutBlobResult> {
  const pathname = options.pathname ?? `blog/covers/${sanitizeUploadName(file.name)}`

  return upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/upload-token",
    clientPayload: JSON.stringify({ kind: "cover" }),
    abortSignal: options.abortSignal,
    multipart: file.size > 4 * 1024 * 1024,
    onUploadProgress: options.onProgress
      ? ({ percentage }) => options.onProgress?.(percentage)
      : undefined,
  })
}

export function isUploadAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const err = error as { name?: string; message?: string }
  return (
    err.name === "AbortError" ||
    err.name === "BlobRequestAbortedError" ||
    /abort(ed)?/i.test(err.message ?? "")
  )
}
