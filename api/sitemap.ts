import type { VercelRequest, VercelResponse } from "@vercel/node"
import { listPosts } from "../lib/server/posts.js"
import { methodNotAllowed, serverError } from "../lib/server/response.js"
import {
  CASE_STUDY_SEO,
  STATIC_ROUTE_SEO,
  STATIC_SITEMAP_LASTMOD,
} from "../lib/server/route-meta.js"
import { getSiteUrl } from "../lib/server/site.js"

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function toLastmod(iso: string | null | undefined): string {
  if (!iso) return STATIC_SITEMAP_LASTMOD
  return new Date(iso).toISOString().slice(0, 10)
}

function urlEntry(loc: string, lastmod: string | null, priority: string): string {
  const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>${lastmodLine}
    <priority>${priority}</priority>
  </url>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    methodNotAllowed(res, ["GET", "HEAD"])
    return
  }

  try {
    const siteUrl = getSiteUrl()
    const entries: string[] = []

    // Static marketing routes — stable lastmod (not "today")
    const staticPriority: Record<string, string> = {
      "/": "1.0",
      "/contact": "0.9",
      "/about": "0.8",
      "/services": "0.8",
      "/work": "0.8",
      "/blog": "0.8",
      "/team": "0.6",
      "/tool-stack": "0.5",
      "/privacy": "0.3",
      "/terms": "0.3",
    }

    for (const route of Object.values(STATIC_ROUTE_SEO)) {
      const path = route.path
      entries.push(
        urlEntry(
          `${siteUrl}${path === "/" ? "/" : path}`,
          STATIC_SITEMAP_LASTMOD,
          staticPriority[path] ?? "0.5",
        ),
      )
    }

    // Case studies
    for (const slug of Object.keys(CASE_STUDY_SEO)) {
      entries.push(
        urlEntry(`${siteUrl}/work/${slug}`, STATIC_SITEMAP_LASTMOD, "0.7"),
      )
    }

    // Published blog posts — real dates
    const posts = await listPosts("published")
    for (const post of posts) {
      entries.push(
        urlEntry(
          `${siteUrl}/blog/${post.slug}`,
          toLastmod(post.updated_at || post.published_at),
          "0.7",
        ),
      )
    }

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`

    res.setHeader("Content-Type", "application/xml; charset=utf-8")
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400")
    if (req.method === "HEAD") {
      res.status(200).end()
      return
    }
    res.status(200).send(body)
  } catch (error) {
    serverError(res, error)
  }
}
