import { neon } from "@neondatabase/serverless"
import { next } from "@vercel/edge"
import { injectBlogSeoHtml, type BlogSeoFields } from "./lib/server/seo.js"

export const config = {
  matcher: ["/blog/:slug*"],
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
      cover_image_url,
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
    cover_image_url: row.cover_image_url ? String(row.cover_image_url) : null,
    meta_title: row.meta_title ? String(row.meta_title) : null,
    meta_description: row.meta_description ? String(row.meta_description) : null,
    published_at: row.published_at ? new Date(String(row.published_at)).toISOString() : null,
    updated_at: row.updated_at ? new Date(String(row.updated_at)).toISOString() : null,
  }
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const accept = request.headers.get("accept") ?? ""

  // Only rewrite HTML document requests (skip module/asset fetches).
  if (accept && !accept.includes("text/html")) {
    return next()
  }

  const match = url.pathname.match(/^\/blog\/([^/]+)\/?$/)
  if (!match) {
    return next()
  }

  const slug = decodeURIComponent(match[1])
  if (!slug || slug.includes(".")) {
    return next()
  }

  try {
    const post = await fetchPublishedSeo(slug)
    if (!post) {
      return next()
    }

    const htmlResponse = await fetch(new URL("/index.html", request.url))
    if (!htmlResponse.ok) {
      return next()
    }

    const html = await htmlResponse.text()
    const injected = injectBlogSeoHtml(html, post)

    const headers = new Headers(htmlResponse.headers)
    headers.set("Content-Type", "text/html; charset=utf-8")
    headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300")
    headers.delete("content-encoding")
    headers.delete("content-length")

    return new Response(injected, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("[middleware] blog SEO injection failed", error)
    return next()
  }
}
