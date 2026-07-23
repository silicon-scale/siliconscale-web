import { neon } from "@neondatabase/serverless"
import { next, rewrite } from "@vercel/edge"
import {
  injectAdminNoIndexHtml,
  injectBlogSeoHtml,
  injectPageSeoHtml,
  type BlogSeoFields,
} from "./lib/server/seo.js"
import {
  resolveCaseStudySeo,
  resolveStaticPageSeo,
} from "./lib/server/route-meta.js"
import { getSiteUrl } from "./lib/server/site.js"

/**
 * Only run on document routes we care about for SEO.
 * Exclude assets, API, sitemap, robots — those must hit filesystem/rewrites.
 */
export const config = {
  matcher: [
    "/",
    "/about",
    "/services",
    "/work",
    "/work/:slug*",
    "/blog",
    "/blog/:slug*",
    "/contact",
    "/team",
    "/tool-stack",
    "/privacy",
    "/terms",
    "/admin",
    "/admin/:path*",
  ],
}

function getDatabaseUrl(): string | null {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    null
  )
}

async function fetchPublishedSeo(slug: string): Promise<BlogSeoFields | null> {
  const databaseUrl = getDatabaseUrl()
  if (!databaseUrl) return null

  const sql = neon(databaseUrl)
  const rows = await sql`
    SELECT
      slug,
      title,
      excerpt,
      content,
      cover_image_url,
      tags,
      meta_title,
      meta_description,
      published_at,
      updated_at
    FROM posts
    WHERE slug = ${slug}
      AND status = 'published'
    LIMIT 1
  `

  if (!rows.length) return null
  const row = rows[0] as Record<string, unknown>
  return {
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt ?? ""),
    content: row.content ? String(row.content) : "",
    cover_image_url: row.cover_image_url ? String(row.cover_image_url) : null,
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    meta_title: row.meta_title ? String(row.meta_title) : null,
    meta_description: row.meta_description ? String(row.meta_description) : null,
    published_at: row.published_at ? new Date(String(row.published_at)).toISOString() : null,
    updated_at: row.updated_at ? new Date(String(row.updated_at)).toISOString() : null,
  }
}

/**
 * Load the SPA shell. Prefer a direct /index.html fetch; if that fails in
 * production, fall back to rewrite so /blog etc. never become NOT_FOUND
 * (bare next() serves index for "/" only — not for /blog).
 */
async function loadShellHtml(request: Request): Promise<string | null> {
  try {
    const indexUrl = new URL("/index.html", request.url)
    const htmlResponse = await fetch(indexUrl, {
      headers: {
        accept: "text/html",
        // Hint for platforms that skip middleware on subrequests
        "x-middleware-subrequest": "true",
      },
    })
    if (!htmlResponse.ok) return null
    return await htmlResponse.text()
  } catch {
    return null
  }
}

function spaFallback(request: Request): Response {
  return rewrite(new URL("/index.html", request.url))
}

function htmlResponse(html: string): Response {
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  })
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const accept = request.headers.get("accept") ?? ""

  // Skip non-document fetches (JS/CSS/images) — let them hit static assets.
  if (accept && !accept.includes("text/html") && !accept.includes("*/*")) {
    return next()
  }

  const pathname =
    url.pathname.length > 1 && url.pathname.endsWith("/")
      ? url.pathname.slice(0, -1)
      : url.pathname

  try {
    // Admin — noindex
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      const shell = await loadShellHtml(request)
      if (!shell) return spaFallback(request)
      const injected = injectAdminNoIndexHtml(shell, pathname)
      return new Response(injected, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "private, no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      })
    }

    // Blog post
    const blogMatch = pathname.match(/^\/blog\/([^/]+)$/)
    if (blogMatch) {
      const slug = decodeURIComponent(blogMatch[1])
      if (!slug || slug.includes(".")) return spaFallback(request)
      const post = await fetchPublishedSeo(slug)
      if (!post) return spaFallback(request)
      const shell = await loadShellHtml(request)
      if (!shell) return spaFallback(request)
      return htmlResponse(injectBlogSeoHtml(shell, post))
    }

    // Case study
    const workMatch = pathname.match(/^\/work\/([^/]+)$/)
    if (workMatch) {
      const slug = decodeURIComponent(workMatch[1])
      const meta = resolveCaseStudySeo(slug)
      if (!meta) return spaFallback(request)
      const shell = await loadShellHtml(request)
      if (!shell) return spaFallback(request)
      return htmlResponse(injectPageSeoHtml(shell, meta, getSiteUrl()))
    }

    // Static marketing routes (including /blog listing and /)
    const staticMeta = resolveStaticPageSeo(pathname)
    if (staticMeta) {
      const shell = await loadShellHtml(request)
      if (!shell) return spaFallback(request)
      return htmlResponse(injectPageSeoHtml(shell, staticMeta, getSiteUrl()))
    }

    return spaFallback(request)
  } catch (error) {
    console.error("[middleware] SEO injection failed", error)
    return spaFallback(request)
  }
}
