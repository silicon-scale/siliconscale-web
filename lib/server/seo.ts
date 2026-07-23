import { getSiteUrl } from "./site.js"
import {
  breadcrumbJsonLd,
  defaultOgImage,
  type PageSeoMeta,
} from "./route-meta.js"

export interface BlogSeoFields {
  slug: string
  title: string
  excerpt: string
  content?: string
  cover_image_url: string | null
  tags?: string[]
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
export function absoluteOgImageUrl(
  coverUrl: string | null | undefined,
  siteUrl = getSiteUrl(),
): string {
  const fallback = defaultOgImage(siteUrl)
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

function wordCount(markdown: string | undefined): number | undefined {
  if (!markdown?.trim()) return undefined
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\[\]()!-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  return words.length || undefined
}

export function resolvePostSeo(post: BlogSeoFields, siteUrl = getSiteUrl()) {
  const title = (post.meta_title?.trim() || post.title).trim()
  const description = (post.meta_description?.trim() || post.excerpt || title).trim()
  const pageUrl = `${siteUrl}/blog/${post.slug}`
  const image = absoluteOgImageUrl(post.cover_image_url, siteUrl)
  const published = post.published_at || post.updated_at || new Date().toISOString()
  const modified = post.updated_at || published
  const words = wordCount(post.content)
  const sections = (post.tags ?? []).map((t) => t.trim()).filter(Boolean)

  return { title, description, pageUrl, image, published, modified, siteUrl, words, sections }
}

export function upsertMetaByName(html: string, name: string, content: string): string {
  const safe = escapeHtml(content)
  const re = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'][^"']*["']\\s*/?>`, "i")
  const tag = `<meta name="${name}" content="${safe}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`)
}

export function upsertMetaByProperty(html: string, property: string, content: string): string {
  const safe = escapeHtml(content)
  const re = new RegExp(
    `<meta\\s+property=["']${property}["']\\s+content=["'][^"']*["']\\s*/?>`,
    "i",
  )
  const tag = `<meta property="${property}" content="${safe}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`)
}

export function upsertTitle(html: string, title: string): string {
  const safe = escapeHtml(title)
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safe}</title>`)
  }
  return html.replace(/<\/head>/i, `    <title>${safe}</title>\n  </head>`)
}

export function upsertCanonical(html: string, href: string): string {
  const safe = escapeHtml(href)
  const re = /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i
  const tag = `<link rel="canonical" href="${safe}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`)
}

function stripInjectedJsonLd(html: string): string {
  return html.replace(
    /<script type="application\/ld\+json" id="ss-seo-jsonld">[\s\S]*?<\/script>\s*/gi,
    "",
  )
}

function injectJsonLdBlocks(html: string, blocks: Record<string, unknown>[]): string {
  if (!blocks.length) return html
  const scripts = blocks
    .map(
      (block) =>
        `<script type="application/ld+json" id="ss-seo-jsonld">${escapeJsonLd(block)}</script>`,
    )
    .join("\n    ")
  let next = stripInjectedJsonLd(html)
  // Also strip legacy Article-only injection without id
  next = next.replace(
    /<script type="application\/ld\+json">[\s\S]*?"@type"\s*:\s*"(Article|BlogPosting|Organization|WebSite|BreadcrumbList)"[\s\S]*?<\/script>\s*/gi,
    "",
  )
  return next.replace(/<\/head>/i, `    ${scripts}\n  </head>`)
}

/** Inject SEO tags for a resolved page meta object into the SPA shell. */
export function injectPageSeoHtml(html: string, meta: PageSeoMeta, siteUrl = getSiteUrl()): string {
  const canonical = `${siteUrl}${meta.canonicalPath === "/" ? "/" : meta.canonicalPath}`
  const image = meta.ogImage || defaultOgImage(siteUrl)
  const ogType = meta.ogType ?? "website"

  let next = html
  next = upsertTitle(next, meta.title)
  next = upsertMetaByName(next, "description", meta.description)
  next = upsertMetaByName(next, "author", "SiliconScale")
  next = upsertCanonical(next, canonical)

  if (meta.noindex) {
    next = upsertMetaByName(next, "robots", "noindex, nofollow")
  } else {
    // Clear noindex if present from a previous cached shell
    next = upsertMetaByName(next, "robots", "index, follow")
  }

  next = upsertMetaByProperty(next, "og:type", ogType)
  next = upsertMetaByProperty(next, "og:url", canonical)
  next = upsertMetaByProperty(next, "og:title", meta.title)
  next = upsertMetaByProperty(next, "og:description", meta.description)
  next = upsertMetaByProperty(next, "og:image", image)
  next = upsertMetaByProperty(next, "og:image:width", "1200")
  next = upsertMetaByProperty(next, "og:image:height", "630")
  next = upsertMetaByProperty(next, "og:site_name", "SiliconScale")

  next = upsertMetaByName(next, "twitter:card", "summary_large_image")
  next = upsertMetaByName(next, "twitter:title", meta.title)
  next = upsertMetaByName(next, "twitter:description", meta.description)
  next = upsertMetaByName(next, "twitter:image", image)

  if (meta.jsonLd?.length) {
    next = injectJsonLdBlocks(next, meta.jsonLd)
  }

  return next
}

/** Inject post SEO tags into the SPA index.html shell. */
export function injectBlogSeoHtml(html: string, post: BlogSeoFields): string {
  const seo = resolvePostSeo(post)
  const fullTitle = `${seo.title} — SiliconScale`

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: seo.title, path: `/blog/${post.slug}` },
  ])

  const blogPosting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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

  if (seo.words) blogPosting.wordCount = seo.words
  if (seo.sections.length) blogPosting.articleSection = seo.sections

  return injectPageSeoHtml(html, {
    title: fullTitle,
    description: seo.description,
    canonicalPath: `/blog/${post.slug}`,
    ogType: "article",
    ogImage: seo.image,
    jsonLd: [blogPosting, breadcrumbs],
  })
}

export function injectAdminNoIndexHtml(html: string, pathname: string): string {
  const siteUrl = getSiteUrl()
  return injectPageSeoHtml(html, {
    title: "Admin — SiliconScale",
    description: "SiliconScale admin",
    canonicalPath: pathname.startsWith("/") ? pathname : `/${pathname}`,
    noindex: true,
    ogImage: defaultOgImage(siteUrl),
  })
}
