import { getSiteUrl } from "./site.js"

export interface BlogSeoFields {
  slug: string
  title: string
  excerpt: string
  cover_image_url: string | null
  meta_title: string | null
  meta_description: string | null
  published_at: string | null
  updated_at: string | null
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function escapeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

/** Absolute URL for og:image / twitter:image (proxies private Blob covers). */
export function absoluteOgImageUrl(coverUrl: string | null | undefined, siteUrl = getSiteUrl()): string {
  const fallback = `${siteUrl}/android-chrome-512x512.png`
  if (!coverUrl) return fallback

  try {
    const parsed = new URL(coverUrl)
    if (parsed.hostname.endsWith(".private.blob.vercel-storage.com")) {
      const pathname = parsed.pathname.replace(/^\/+/, "")
      if (!pathname) return fallback
      return `${siteUrl}/api/media?pathname=${encodeURIComponent(pathname)}`
    }
    return coverUrl
  } catch {
    if (coverUrl.startsWith("/")) return `${siteUrl}${coverUrl}`
    return fallback
  }
}

export function resolvePostSeo(post: BlogSeoFields, siteUrl = getSiteUrl()) {
  const title = (post.meta_title?.trim() || post.title).trim()
  const description = (post.meta_description?.trim() || post.excerpt || title).trim()
  const pageUrl = `${siteUrl}/blog/${post.slug}`
  const image = absoluteOgImageUrl(post.cover_image_url, siteUrl)
  const published = post.published_at || post.updated_at || new Date().toISOString()
  const modified = post.updated_at || published

  return { title, description, pageUrl, image, published, modified, siteUrl }
}

function upsertMetaByName(html: string, name: string, content: string): string {
  const safe = escapeHtml(content)
  const re = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'][^"']*["']\\s*/?>`, "i")
  const tag = `<meta name="${name}" content="${safe}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`)
}

function upsertMetaByProperty(html: string, property: string, content: string): string {
  const safe = escapeHtml(content)
  const re = new RegExp(
    `<meta\\s+property=["']${property}["']\\s+content=["'][^"']*["']\\s*/?>`,
    "i",
  )
  const tag = `<meta property="${property}" content="${safe}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`)
}

function upsertTitle(html: string, title: string): string {
  const safe = escapeHtml(title)
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safe}</title>`)
  }
  return html.replace(/<\/head>/i, `    <title>${safe}</title>\n  </head>`)
}

function upsertCanonical(html: string, href: string): string {
  const safe = escapeHtml(href)
  const re = /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i
  const tag = `<link rel="canonical" href="${safe}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`)
}

function upsertJsonLd(html: string, jsonLd: Record<string, unknown>): string {
  const script = `<script type="application/ld+json">${escapeJsonLd(jsonLd)}</script>`
  // Replace a previous injection if present (middleware re-runs / caching)
  const existing = /<script type="application\/ld\+json">[\s\S]*?<\/script>/i
  if (existing.test(html) && html.includes('"@type":"Article"')) {
    return html.replace(existing, script)
  }
  return html.replace(/<\/head>/i, `    ${script}\n  </head>`)
}

/** Inject post SEO tags into the SPA index.html shell. */
export function injectBlogSeoHtml(html: string, post: BlogSeoFields): string {
  const seo = resolvePostSeo(post)
  const fullTitle = `${seo.title} — SiliconScale`

  let next = html
  next = upsertTitle(next, fullTitle)
  next = upsertMetaByName(next, "description", seo.description)
  next = upsertMetaByName(next, "author", "SiliconScale")
  next = upsertCanonical(next, seo.pageUrl)

  next = upsertMetaByProperty(next, "og:type", "article")
  next = upsertMetaByProperty(next, "og:url", seo.pageUrl)
  next = upsertMetaByProperty(next, "og:title", seo.title)
  next = upsertMetaByProperty(next, "og:description", seo.description)
  next = upsertMetaByProperty(next, "og:image", seo.image)
  next = upsertMetaByProperty(next, "og:site_name", "SiliconScale")

  next = upsertMetaByName(next, "twitter:card", "summary_large_image")
  next = upsertMetaByName(next, "twitter:title", seo.title)
  next = upsertMetaByName(next, "twitter:description", seo.description)
  next = upsertMetaByName(next, "twitter:image", seo.image)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: seo.title,
    description: seo.description,
    image: [seo.image],
    datePublished: seo.published,
    dateModified: seo.modified,
    author: {
      "@type": "Organization",
      name: "SiliconScale",
      url: seo.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "SiliconScale",
      url: seo.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${seo.siteUrl}/android-chrome-512x512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": seo.pageUrl,
    },
  }

  next = upsertJsonLd(next, jsonLd)
  return next
}
