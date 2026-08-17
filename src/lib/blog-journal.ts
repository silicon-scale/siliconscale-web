import type { Post } from '@/types/post'

/** Agency byline until posts carry a real author field. */
export const JOURNAL_AUTHOR = {
  name: 'SiliconScale',
  initials: 'SS',
} as const

export type FeaturedHighlightIcon =
  | 'sparkles'
  | 'users'
  | 'shield'
  | 'lock'
  | 'code'
  | 'shopping'
  | 'bot'
  | 'layers'

export type FeaturedHighlight = {
  id: string
  label: string
  icon: FeaturedHighlightIcon
}

/** Reusable highlight chips for the featured cover composition. */
export const DEFAULT_FEATURED_HIGHLIGHTS: FeaturedHighlight[] = [
  { id: 'systems', label: 'Custom systems', icon: 'code' },
  { id: 'shipping', label: 'Shipped in production', icon: 'sparkles' },
  { id: 'shopify', label: 'Headless Shopify', icon: 'shopping' },
  { id: 'privacy', label: 'Production-ready delivery', icon: 'shield' },
]

const TAG_HIGHLIGHT_MAP: Array<{ match: RegExp; highlight: FeaturedHighlight }> = [
  {
    match: /shopify|ecommerce|e-commerce|store/i,
    highlight: { id: 'shopify', label: 'Headless Shopify', icon: 'shopping' },
  },
  {
    match: /ai|agent|llm|automation/i,
    highlight: { id: 'ai', label: 'AI & automation', icon: 'bot' },
  },
  {
    match: /api|backend|system|platform|dashboard/i,
    highlight: { id: 'systems', label: 'Custom systems', icon: 'code' },
  },
  {
    match: /team|founders|culture|remote/i,
    highlight: { id: 'teams', label: 'Founder partnership', icon: 'users' },
  },
  {
    match: /security|privacy|auth/i,
    highlight: { id: 'privacy', label: 'Privacy & security', icon: 'lock' },
  },
  {
    match: /design|ui|ux|component/i,
    highlight: { id: 'design', label: 'Design systems', icon: 'layers' },
  },
  {
    match: /ship|launch|production|deploy/i,
    highlight: { id: 'shipping', label: 'Shipped in production', icon: 'sparkles' },
  },
]

/**
 * Prefer highlights inferred from post tags; pad with agency defaults to 4.
 */
export function getFeaturedHighlights(post: Post, limit = 4): FeaturedHighlight[] {
  const fromTags: FeaturedHighlight[] = []
  const seen = new Set<string>()

  for (const tag of post.tags) {
    for (const { match, highlight } of TAG_HIGHLIGHT_MAP) {
      if (!match.test(tag) || seen.has(highlight.id)) continue
      seen.add(highlight.id)
      fromTags.push(highlight)
    }
  }

  for (const fallback of DEFAULT_FEATURED_HIGHLIGHTS) {
    if (fromTags.length >= limit) break
    if (seen.has(fallback.id)) continue
    seen.add(fallback.id)
    fromTags.push(fallback)
  }

  return fromTags.slice(0, limit)
}

/** Uppercase editorial date: `AUG 10, 2026`. */
export function formatJournalDate(value: string | null): string {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
      .format(new Date(value))
      .toUpperCase()
  } catch {
    return ''
  }
}

export function splitFeaturedAndArchive(posts: Post[]): {
  featured: Post | null
  archive: Post[]
} {
  if (!posts.length) return { featured: null, archive: [] }
  const [featured, ...archive] = posts
  return { featured, archive }
}

export function matchesJournalSearch(post: Post, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const haystack = [
    post.title,
    post.excerpt,
    post.meta_title ?? '',
    post.meta_description ?? '',
    ...post.tags,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(q)
}
