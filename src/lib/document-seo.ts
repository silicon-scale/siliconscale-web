import {
  CASE_STUDY_SEO,
  STATIC_ROUTE_SEO,
} from "@/data/seo-routes"

const SITE_URL = "https://siliconscale.dev"
const DEFAULT_OG = `${SITE_URL}/og-image.png`

type PageSeoMeta = {
  title: string
  description: string
  canonicalPath: string
  ogType?: "website" | "article"
  ogImage?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown>[]
}

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
): void {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", rel)
    document.head.appendChild(el)
  }
  el.setAttribute("href", href)
}

function clearSeoJsonLd(): void {
  document.querySelectorAll('script[type="application/ld+json"][id^="ss-client-jsonld"]').forEach((n) => n.remove())
  const legacy = document.getElementById("blog-article-jsonld")
  legacy?.remove()
}

function upsertJsonLd(id: string, data: Record<string, unknown>): void {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement("script")
    el.id = id
    el.type = "application/ld+json"
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

function applyPageMeta(meta: PageSeoMeta): void {
  const canonical = `${SITE_URL}${meta.canonicalPath === "/" ? "/" : meta.canonicalPath}`
  const image = meta.ogImage || DEFAULT_OG

  document.title = meta.title
  upsertMeta("name", "description", meta.description)
  upsertMeta("name", "author", "SiliconScale")
  upsertLink("canonical", canonical)

  if (meta.noindex) {
    upsertMeta("name", "robots", "noindex, nofollow")
  } else {
    upsertMeta("name", "robots", "index, follow")
  }

  upsertMeta("property", "og:type", meta.ogType ?? "website")
  upsertMeta("property", "og:url", canonical)
  upsertMeta("property", "og:title", meta.title)
  upsertMeta("property", "og:description", meta.description)
  upsertMeta("property", "og:image", image)
  upsertMeta("property", "og:image:width", "1200")
  upsertMeta("property", "og:image:height", "630")
  upsertMeta("property", "og:site_name", "SiliconScale")

  upsertMeta("name", "twitter:card", "summary_large_image")
  upsertMeta("name", "twitter:title", meta.title)
  upsertMeta("name", "twitter:description", meta.description)
  upsertMeta("name", "twitter:image", image)

  clearSeoJsonLd()
  meta.jsonLd?.forEach((block, i) => {
    upsertJsonLd(`ss-client-jsonld-${i}`, block)
  })
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1)
  return pathname || "/"
}

/** Sync document head for client-side navigations (SPA). */
export function syncDocumentSeoForPath(pathname: string): void {
  const path = normalizePath(pathname)

  if (path === "/admin" || path.startsWith("/admin/")) {
    applyPageMeta({
      title: "Admin — SiliconScale",
      description: "SiliconScale admin",
      canonicalPath: path,
      noindex: true,
      ogImage: DEFAULT_OG,
    })
    return
  }

  const workMatch = path.match(/^\/work\/([^/]+)$/)
  if (workMatch) {
    const slug = decodeURIComponent(workMatch[1])
    const entry = CASE_STUDY_SEO[slug]
    if (entry) {
      applyPageMeta({
        title: entry.title,
        description: entry.description,
        canonicalPath: `/work/${slug}`,
        ogType: "article",
        ogImage: DEFAULT_OG,
      })
      return
    }
  }

  // Blog posts are handled by applyBlogPostDocumentSeo after fetch
  if (/^\/blog\/[^/]+$/.test(path)) {
    return
  }

  const staticEntry = STATIC_ROUTE_SEO[path]
  if (staticEntry) {
    applyPageMeta({
      title: staticEntry.title,
      description: staticEntry.description,
      canonicalPath: staticEntry.path,
      ogType: staticEntry.ogType ?? "website",
      ogImage: DEFAULT_OG,
    })
  }
}

export interface ClientPostSeo {
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

function resolveOgImage(coverUrl: string | null | undefined): string {
  if (!coverUrl) return DEFAULT_OG
  try {
    const parsed = new URL(coverUrl, window.location.origin)
    if (parsed.hostname.endsWith(".private.blob.vercel-storage.com")) {
      const pathname = parsed.pathname.replace(/^\/+/, "")
      if (!pathname) return DEFAULT_OG
      return `${SITE_URL}/api/media?pathname=${encodeURIComponent(pathname)}`
    }
    if (parsed.pathname.startsWith("/api/media")) {
      return `${SITE_URL}${parsed.pathname}${parsed.search}`
    }
    return parsed.href
  } catch {
    if (coverUrl.startsWith("/")) return `${SITE_URL}${coverUrl}`
    return DEFAULT_OG
  }
}

/** Keep browser document head in sync for blog post client-side navigations. */
export function applyBlogPostDocumentSeo(post: ClientPostSeo): () => void {
  const previousTitle = document.title
  const title = (post.meta_title?.trim() || post.title).trim()
  const description = (post.meta_description?.trim() || post.excerpt || title).trim()
  const pageUrl = `${SITE_URL}/blog/${post.slug}`
  const image = resolveOgImage(post.cover_image_url)
  const published = post.published_at || post.updated_at || new Date().toISOString()
  const modified = post.updated_at || published
  const fullTitle = `${title} — SiliconScale`
  const tags = (post.tags ?? []).map((t) => t.trim()).filter(Boolean)
  const words = post.content
    ? post.content
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[#>*_`\[\]()!-]/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : undefined

  applyPageMeta({
    title: fullTitle,
    description,
    canonicalPath: `/blog/${post.slug}`,
    ogType: "article",
    ogImage: image,
  })

  const blogPosting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: [image],
    datePublished: published,
    dateModified: modified,
    author: {
      "@type": "Organization",
      name: "SiliconScale",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "SiliconScale",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/android-chrome-512x512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  }
  if (words) blogPosting.wordCount = words
  if (tags.length) blogPosting.articleSection = tags

  upsertJsonLd("ss-client-jsonld-0", blogPosting)
  upsertJsonLd("ss-client-jsonld-1", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: pageUrl },
    ],
  })

  return () => {
    document.title = previousTitle
    clearSeoJsonLd()
  }
}
