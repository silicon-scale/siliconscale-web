import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let sqlClient: NeonQueryFunction<false, false> | null = null

function getDatabaseUrl(): string {
  // Prefer pooled Neon URL from Vercel Neon / Postgres integration env vars.
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL
  if (!url) {
    throw new Error(
      "DATABASE_URL (or POSTGRES_URL) is not set. Connect Neon via Vercel's Neon integration.",
    )
  }
  return url
}

export function getSql(): NeonQueryFunction<false, false> {
  if (!sqlClient) {
    sqlClient = neon(getDatabaseUrl())
  }
  return sqlClient
}
