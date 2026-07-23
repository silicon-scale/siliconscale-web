import type { VercelRequest, VercelResponse } from "@vercel/node"
import { listPosts } from "../lib/server/posts.js"
import { methodNotAllowed, serverError } from "../lib/server/response.js"
import { getSiteUrl } from "../lib/server/site.js"

const STATIC_ROUTES: Array<{ path: string; priority: string }> = [
  { path: "/", priority: "1.0" },
  { path: "/about", priority: "0.8" },
  { path: "/services", priority: "0.8" },
  { path: "/work", priority: "0.8" },
  { path: "/team", priority: "0.6" },
  { path: "/contact", priority: "0.9" },
  { path: "/tool-stack", priority: "0.5" },
  { path: "/blog", priority: "0.8" },
  { path: "/privacy", priority: "0.3" },
  { path: "/terms", priority: "0.3" },
]

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function toLastmod(iso: string | null | undefined): string {
  if (!iso) return new Date().toISOString().slice(0, 10)
  return new Date(iso).toISOString().slice(0, 10)
}

function urlEntry(loc: string, lastmod: string, priority: string): string {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
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
    const today = new Date().toISOString().slice(0, 10)
    const entries: string[] = STATIC_ROUTES.map((route) =>
      urlEntry(`${siteUrl}${route.path === "/" ? "/" : route.path}`, today, route.priority),
    )

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
