import { upload, type PutBlobResult } from "@vercel/blob/client"

export interface UploadCoverImageOptions {
  pathname?: string
  onProgress?: (percentage: number) => void
  abortSignal?: AbortSignal
}

/**
 * Upload a cover image directly to Vercel Blob via the client-upload flow.
 * Requires a valid admin session cookie (Phase 2 login).
 */
export async function uploadCoverImage(
  file: File,
  options: UploadCoverImageOptions = {},
): Promise<PutBlobResult> {
  const pathname = options.pathname ?? `blog/covers/${file.name}`

  return upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/upload-token",
    clientPayload: JSON.stringify({ kind: "cover" }),
    abortSignal: options.abortSignal,
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
