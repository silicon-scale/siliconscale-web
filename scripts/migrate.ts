import { neon } from "@neondatabase/serverless"

async function main() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL
  if (!url) {
    console.error("Set DATABASE_URL or POSTGRES_URL before running migrations.")
    process.exit(1)
  }

  const sql = neon(url)

  console.log("Running posts migration...")

  await sql`
    DO $$ BEGIN
      CREATE TYPE post_status AS ENUM ('draft', 'published');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$
  `

  await sql`
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
    )
  `

  await sql`CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug)`
  await sql`CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status)`
  await sql`
    CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at DESC NULLS LAST)
      WHERE status = 'published'
  `

  console.log("Migration complete.")
}

main().catch((error) => {
  console.error("Migration failed:", error)
  process.exit(1)
})
