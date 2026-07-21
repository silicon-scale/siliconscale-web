import { ADMIN_UNAUTHORIZED_EVENT } from "@/lib/admin-api"

export interface UploadCoverImageOptions {
  pathname?: string
  onProgress?: (percentage: number) => void
  abortSignal?: AbortSignal
}

export interface UploadCoverImageResult {
  url: string
  pathname?: string
  contentType?: string
  downloadUrl?: string
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

function fileToBase64(file: File, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return
      // Reading is half the perceived work; upload is the other half.
      onProgress(Math.round((event.loaded / event.total) * 50))
    }
    reader.onload = () => {
      const result = String(reader.result || "")
      const comma = result.indexOf(",")
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

/**
 * Upload a cover image via our authenticated API (server → Vercel Blob put).
 * Uses the Blob store without a browser PUT to vercel.com (avoids local CORS/400).
 */
export async function uploadCoverImage(
  file: File,
  options: UploadCoverImageOptions = {},
): Promise<UploadCoverImageResult> {
  if (file.size > 4 * 1024 * 1024) {
    throw new Error("Image is too large (max 4MB). Compress the image and try again.")
  }

  options.onProgress?.(0)
  const data = await fileToBase64(file, options.onProgress)
  options.onProgress?.(55)

  const res = await fetch("/api/upload", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    signal: options.abortSignal,
    body: JSON.stringify({
      filename: options.pathname?.split("/").pop() || sanitizeUploadName(file.name),
      contentType: file.type || "application/octet-stream",
      data,
      access: "public",
    }),
  })

  options.onProgress?.(90)

  const payload = (await res.json().catch(() => ({}))) as {
    error?: string
    url?: string
    pathname?: string
    contentType?: string
    downloadUrl?: string
  }

  if (!res.ok || !payload.url) {
    if (res.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(ADMIN_UNAUTHORIZED_EVENT))
      throw new Error("Your admin session expired. Please sign in again.")
    }
    throw new Error(payload.error || `Upload failed (${res.status})`)
  }

  options.onProgress?.(100)
  return {
    url: payload.url,
    pathname: payload.pathname,
    contentType: payload.contentType,
    downloadUrl: payload.downloadUrl,
  }
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
