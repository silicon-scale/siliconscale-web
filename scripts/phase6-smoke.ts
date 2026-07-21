/**
 * Phase 6 reliability smoke test against a running `pnpm dev:full` server.
 * Usage: node --import tsx --env-file=.env.local --env-file=.env scripts/phase6-smoke.ts
 */
const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000"

type Json = Record<string, unknown> | null

const jar = { cookie: "" }

async function req(
  path: string,
  opts: RequestInit = {},
  useJar = true,
): Promise<{ status: number; json: Json; text: string }> {
  const headers = new Headers(opts.headers)
  if (useJar && jar.cookie) headers.set("Cookie", jar.cookie)

  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  const setCookies =
    typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : []
  for (const c of setCookies) {
    const part = c.split(";")[0]
    if (part.startsWith("admin_session=")) {
      jar.cookie =
        part === "admin_session=" || /admin_session=;/.test(part) ? "" : part
    }
  }
  const sc = res.headers.get("set-cookie")
  if (sc?.includes("admin_session=")) {
    const part = sc.split(";")[0]
    jar.cookie = /Max-Age=0/i.test(sc) || part === "admin_session=" ? "" : part
  }

  const text = await res.text()
  let json: Json = null
  try {
    json = JSON.parse(text) as Record<string, unknown>
  } catch {
    /* not json */
  }
  return { status: res.status, json, text }
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg)
  console.log("OK:", msg)
}

async function main() {
  const password = process.env.ADMIN_PASSWORD?.trim()
  assert(password, "ADMIN_PASSWORD is set")

  // Auth gates
  let r = await req(
    "/api/posts",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "x", title: "x" }),
    },
    false,
  )
  assert(r.status === 401, `unauthenticated write rejected (${r.status})`)

  r = await req("/api/admin/session", {}, false)
  assert(r.json && r.json.authenticated === false, "session reports unauthenticated")

  r = await req(
    "/api/admin/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong-password" }),
    },
    false,
  )
  assert(r.status === 401, "bad password rejected")

  r = await req("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  })
  assert(r.status === 200 && jar.cookie.includes("admin_session="), "login succeeds")

  r = await req("/api/admin/session")
  assert(r.json && r.json.authenticated === true, "session authenticated")

  const slug = `phase6-smoke-${Date.now()}`
  r = await req("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug,
      title: "Phase 6 Smoke Post",
      excerpt: "Smoke excerpt for meta fallback testing.",
      content: "# Smoke\n\nPhase 6 reliability content.",
      tags: ["smoke", "phase6"],
      status: "draft",
      meta_title: "Phase 6 Smoke Meta",
      meta_description: "Phase 6 smoke meta description.",
    }),
  })
  assert(r.status === 201 && r.json && (r.json.post as { id?: string })?.id, "create draft")
  const id = (r.json!.post as { id: string }).id

  // Public must not see draft (no cookie)
  r = await req(`/api/posts/${slug}`, {}, false)
  assert(r.status === 404, "draft hidden from public")

  // Admin can fetch by UUID
  r = await req(`/api/posts/${id}`)
  assert(r.status === 200 && (r.json?.post as { id?: string })?.id === id, "admin GET by UUID")

  const pngB64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  r = await req("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: "phase6-smoke.png",
      contentType: "image/png",
      data: pngB64,
    }),
  })
  assert(r.status === 200 && (r.json as { url?: string })?.url, "cover upload")
  const coverUrl = (r.json as { url: string }).url

  r = await req(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "published",
      cover_image_url: coverUrl,
      title: "Phase 6 Smoke Post",
      slug,
      excerpt: "Smoke excerpt for meta fallback testing.",
      content: "# Smoke\n\nPublished.",
      tags: ["smoke", "phase6"],
      meta_title: "Phase 6 Smoke Meta",
      meta_description: "Phase 6 smoke meta description.",
    }),
  })
  assert(
    r.status === 200 && (r.json?.post as { status?: string })?.status === "published",
    "publish",
  )

  r = await req("/api/posts?status=published", {}, false)
  assert(
    ((r.json?.posts as Array<{ slug: string }>) || []).some((p) => p.slug === slug),
    "public list includes post",
  )

  r = await req(`/api/posts/${slug}`, {}, false)
  assert(r.status === 200, "public get by slug")

  r = await req(`/blog/${slug}`, { headers: { Accept: "text/html" } }, false)
  assert(r.status === 200, "blog HTML 200")
  assert(r.text.includes("Phase 6 Smoke Meta"), "injected title/meta title")
  assert(r.text.includes("Phase 6 smoke meta description."), "injected description")
  assert(r.text.includes(`https://siliconscale.dev/blog/${slug}`), "canonical URL")
  assert(r.text.includes("Article"), "JSON-LD Article present")

  r = await req("/sitemap.xml", {}, false)
  assert(r.text.includes(`/blog/${slug}`), "sitemap includes post")

  r = await req("/api/posts/no-such-post-zzzz", {}, false)
  assert(r.status === 404, "unknown slug 404")

  r = await req(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Phase 6 Smoke Post (edited)" }),
  })
  assert(
    r.status === 200 &&
      String((r.json?.post as { title?: string })?.title || "").includes("edited"),
    "edit post",
  )

  const savedCookie = jar.cookie
  jar.cookie = ""
  r = await req(
    "/api/upload",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: "x.png",
        contentType: "image/png",
        data: pngB64,
      }),
    },
    false,
  )
  assert(r.status === 401, "unauthenticated upload rejected")

  jar.cookie = "admin_session=invalid.token.value"
  r = await req("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug: "should-fail", title: "Nope" }),
  })
  assert(r.status === 401, "invalid session rejected")

  jar.cookie = savedCookie
  r = await req(`/api/posts/${id}`, { method: "DELETE" })
  assert(r.status === 200, "delete post")

  r = await req(`/api/posts/${slug}`, {}, false)
  assert(r.status === 404, "deleted post not found")

  r = await req("/sitemap.xml", {}, false)
  assert(!r.text.includes(`/blog/${slug}`), "sitemap drops deleted post")

  r = await req("/api/admin/logout", { method: "POST" })
  assert(r.status === 200, "logout")

  console.log("\nPhase 6 smoke checks passed.")
}

main().catch((err) => {
  console.error("\nFAIL:", err instanceof Error ? err.message : err)
  process.exit(1)
})
