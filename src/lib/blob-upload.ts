import { upload, type PutBlobResult } from "@vercel/blob/client"

export interface UploadCoverImageOptions {
  pathname?: string
  onProgress?: (percentage: number) => void
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
    onUploadProgress: options.onProgress
      ? ({ percentage }) => options.onProgress?.(percentage)
      : undefined,
  })
}
