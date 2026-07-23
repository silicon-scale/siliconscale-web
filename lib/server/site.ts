const PRODUCTION_SITE_URL = "https://siliconscale.dev"

/**
 * Canonical public origin for SEO (canonical, og:url, sitemap).
 * Prefers SITE_URL; falls back to production domain (not preview URLs).
 */
export function getSiteUrl(): string {
  const fromEnv = (process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? "").trim()
  if (fromEnv) return fromEnv.replace(/\/+$/, "")
  return PRODUCTION_SITE_URL
}

export { PRODUCTION_SITE_URL }
