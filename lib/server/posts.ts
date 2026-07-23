import { getSql } from "./db.js"
import { computeReadingTimeMinutes } from "./reading-time.js"
import { normalizeMarkdownContent } from "./normalize-markdown.js"
import type { Post, PostInput, PostStatus, PostUpdateInput } from "./types.js"

function rowToPost(row: Record<string, unknown>): Post {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    cover_image_url: row.cover_image_url ? String(row.cover_image_url) : null,
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    status: row.status as PostStatus,
    reading_time_minutes: Number(row.reading_time_minutes ?? 1),
    meta_title: row.meta_title ? String(row.meta_title) : null,
    meta_description: row.meta_description ? String(row.meta_description) : null,
    published_at: row.published_at ? new Date(String(row.published_at)).toISOString() : null,
    created_at: new Date(String(row.created_at)).toISOString(),
    updated_at: new Date(String(row.updated_at)).toISOString(),
  }
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return []
  return tags.map((tag) => String(tag).trim()).filter(Boolean)
}

function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function listPosts(status?: PostStatus): Promise<Post[]> {
  const rows = status
    ? await getSql()`
        SELECT *
        FROM posts
        WHERE status = ${status}
        ORDER BY COALESCE(published_at, created_at) DESC
      `
    : await getSql()`
        SELECT *
        FROM posts
        ORDER BY updated_at DESC
      `

  return rows.map((row) => rowToPost(row as Record<string, unknown>))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const rows = await getSql()`
    SELECT *
    FROM posts
    WHERE slug = ${slug}
    LIMIT 1
  `
  if (!rows.length) return null
  return rowToPost(rows[0] as Record<string, unknown>)
}

export async function getPostById(id: string): Promise<Post | null> {
  const rows = await getSql()`
    SELECT *
    FROM posts
    WHERE id = ${id}::uuid
    LIMIT 1
  `
  if (!rows.length) return null
  return rowToPost(rows[0] as Record<string, unknown>)
}

export async function createPost(input: PostInput): Promise<Post> {
  const slug = normalizeSlug(input.slug)
  if (!slug) throw new Error("Slug is required")
  if (!input.title?.trim()) throw new Error("Title is required")

  const content = normalizeMarkdownContent(input.content ?? "")
  const status: PostStatus = input.status ?? "draft"
  const readingTime = computeReadingTimeMinutes(content)
  const publishedAt = status === "published" ? new Date().toISOString() : null

  const rows = await getSql()`
    INSERT INTO posts (
      slug,
      title,
      excerpt,
      content,
      cover_image_url,
      tags,
      status,
      reading_time_minutes,
      meta_title,
      meta_description,
      published_at
    )
    VALUES (
      ${slug},
      ${input.title.trim()},
      ${input.excerpt?.trim() ?? ""},
      ${content},
      ${input.cover_image_url ?? null},
      ${normalizeTags(input.tags)},
      ${status},
      ${readingTime},
      ${input.meta_title ?? null},
      ${input.meta_description ?? null},
      ${publishedAt}
    )
    RETURNING *
  `

  return rowToPost(rows[0] as Record<string, unknown>)
}

export async function updatePost(id: string, input: PostUpdateInput): Promise<Post | null> {
  const existing = await getPostById(id)
  if (!existing) return null

  const slug = input.slug !== undefined ? normalizeSlug(input.slug) : existing.slug
  if (!slug) throw new Error("Slug is required")

  const title = input.title !== undefined ? input.title.trim() : existing.title
  if (!title) throw new Error("Title is required")

  const content =
    input.content !== undefined
      ? normalizeMarkdownContent(input.content)
      : existing.content
  const excerpt = input.excerpt !== undefined ? input.excerpt.trim() : existing.excerpt
  const coverImageUrl =
    input.cover_image_url !== undefined ? input.cover_image_url : existing.cover_image_url
  const tags = input.tags !== undefined ? normalizeTags(input.tags) : existing.tags
  const status = input.status !== undefined ? input.status : existing.status
  const metaTitle = input.meta_title !== undefined ? input.meta_title : existing.meta_title
  const metaDescription =
    input.meta_description !== undefined ? input.meta_description : existing.meta_description
  const readingTime = computeReadingTimeMinutes(content)

  let publishedAt = existing.published_at
  if (status === "published" && !publishedAt) {
    publishedAt = new Date().toISOString()
  }
  if (status === "draft") {
    publishedAt = null
  }

  const rows = await getSql()`
    UPDATE posts
    SET
      slug = ${slug},
      title = ${title},
      excerpt = ${excerpt},
      content = ${content},
      cover_image_url = ${coverImageUrl},
      tags = ${tags},
      status = ${status},
      reading_time_minutes = ${readingTime},
      meta_title = ${metaTitle},
      meta_description = ${metaDescription},
      published_at = ${publishedAt},
      updated_at = NOW()
    WHERE id = ${id}::uuid
    RETURNING *
  `

  if (!rows.length) return null
  return rowToPost(rows[0] as Record<string, unknown>)
}

export async function deletePost(id: string): Promise<boolean> {
  const rows = await getSql()`
    DELETE FROM posts
    WHERE id = ${id}::uuid
    RETURNING id
  `
  return rows.length > 0
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

export { normalizeSlug }
