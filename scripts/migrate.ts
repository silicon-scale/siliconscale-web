import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { neon } from "@neondatabase/serverless"

/** Load `.env` without requiring `source` (avoids shell breaking on `&` in URLs). */
function loadEnvFile(filename = ".env") {
  const fullPath = resolve(process.cwd(), filename)
  if (!existsSync(fullPath)) return

  for (const line of readFileSync(fullPath, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const eq = trimmed.indexOf("=")
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

async function main() {
  loadEnvFile()

  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL
  if (!url) {
    console.error("Set DATABASE_URL or POSTGRES_URL in .env before running migrations.")
    process.exit(1)
  }

  const sql = neon(url)

  console.log("Running posts migration...")

  await sql.query(`
    DO $$ BEGIN
      CREATE TYPE post_status AS ENUM ('draft', 'published');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await sql.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      cover_image_url TEXT,
      tags TEXT[] NOT NULL DEFAULT '{}',
      status post_status NOT NULL DEFAULT 'draft',
      reading_time_minutes INTEGER NOT NULL DEFAULT 1,
      meta_title TEXT,
      meta_description TEXT,
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await sql.query(`CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug)`)
  await sql.query(`CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status)`)
  await sql.query(`
    CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at DESC NULLS LAST)
      WHERE status = 'published';
  `)

  console.log("Migration complete.")
}

main().catch((error) => {
  console.error("Migration failed:", error)
  process.exit(1)
})
