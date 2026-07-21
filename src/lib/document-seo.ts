const SITE_URL = "https://siliconscale.dev"

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

function upsertJsonLd(data: Record<string, unknown>): void {
  const id = "blog-article-jsonld"
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement("script")
    el.id = id
    el.type = "application/ld+json"
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

function resolveOgImage(coverUrl: string | null | undefined): string {
  const fallback = `${SITE_URL}/android-chrome-512x512.png`
  if (!coverUrl) return fallback
  try {
    const parsed = new URL(coverUrl, window.location.origin)
    if (parsed.hostname.endsWith(".private.blob.vercel-storage.com")) {
      const pathname = parsed.pathname.replace(/^\/+/, "")
      if (!pathname) return fallback
      return `${SITE_URL}/api/media?pathname=${encodeURIComponent(pathname)}`
    }
    if (parsed.pathname.startsWith("/api/media")) {
      return `${SITE_URL}${parsed.pathname}${parsed.search}`
    }
    return parsed.href
  } catch {
    if (coverUrl.startsWith("/")) return `${SITE_URL}${coverUrl}`
    return fallback
  }
}

export interface ClientPostSeo {
  slug: string
  title: string
  excerpt: string
  cover_image_url: string | null
  meta_title: string | null
  meta_description: string | null
  published_at: string | null
  updated_at: string | null
}

/** Keep browser document head in sync for client-side navigations. */
export function applyBlogPostDocumentSeo(post: ClientPostSeo): () => void {
  const previousTitle = document.title
  const title = (post.meta_title?.trim() || post.title).trim()
  const description = (post.meta_description?.trim() || post.excerpt || title).trim()
  const pageUrl = `${SITE_URL}/blog/${post.slug}`
  const image = resolveOgImage(post.cover_image_url)
  const published = post.published_at || post.updated_at || new Date().toISOString()
  const modified = post.updated_at || published
  const fullTitle = `${title} — SiliconScale`

  document.title = fullTitle
  upsertMeta("name", "description", description)
  upsertMeta("name", "author", "SiliconScale")
  upsertLink("canonical", pageUrl)

  upsertMeta("property", "og:type", "article")
  upsertMeta("property", "og:url", pageUrl)
  upsertMeta("property", "og:title", title)
  upsertMeta("property", "og:description", description)
  upsertMeta("property", "og:image", image)
  upsertMeta("property", "og:site_name", "SiliconScale")

  upsertMeta("name", "twitter:card", "summary_large_image")
  upsertMeta("name", "twitter:title", title)
  upsertMeta("name", "twitter:description", description)
  upsertMeta("name", "twitter:image", image)

  upsertJsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
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
  })

  return () => {
    document.title = previousTitle
    const jsonLd = document.getElementById("blog-article-jsonld")
    jsonLd?.remove()
  }
}
