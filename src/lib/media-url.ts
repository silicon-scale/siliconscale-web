/**
 * Convert a Vercel Blob URL into a browser-usable URL.
 * Private stores return 403 on direct access — proxy those through /api/media.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return ""

  try {
    const parsed = new URL(url)
    if (parsed.hostname.endsWith(".private.blob.vercel-storage.com")) {
      const pathname = parsed.pathname.replace(/^\/+/, "")
      if (!pathname) return url
      return `/api/media?pathname=${encodeURIComponent(pathname)}`
    }
  } catch {
    // Not an absolute URL — return as-is (already relative / proxied).
  }

  return url
}
