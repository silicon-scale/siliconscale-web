import type { Post } from '@/types/post'

/** Agency byline until posts carry a real author field. */
export const JOURNAL_AUTHOR = {
  name: 'SiliconScale',
  initials: 'SS',
} as const

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

/**
 * The most recent post is both the cover story AND stays listed in the
 * archive grid below it — the archive isn't "everything except the cover,"
 * it's the full list, with the cover simply promoted up top too.
 */
export function splitFeaturedAndArchive(posts: Post[]): {
  featured: Post | null
  archive: Post[]
} {
  if (!posts.length) return { featured: null, archive: [] }
  const [featured] = posts
  return { featured, archive: posts }
}

/** Compact relative time for archive cards: "2 months ago", "Just now". */
export function formatRelativeTime(value: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000)

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, secondsInUnit] of units) {
    const amount = Math.floor(seconds / secondsInUnit)
    if (amount >= 1) return `${amount} ${unit}${amount > 1 ? 's' : ''} ago`
  }
  return 'Just now'
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
