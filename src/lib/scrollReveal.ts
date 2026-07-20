/** Shared scroll-reveal timing — keep in sync with `.scroll-reveal` in index.css */

export const SCROLL_REVEAL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)' as const

/** Primary reveal duration (400–700ms range). */
export const SCROLL_REVEAL_DURATION_MS = 600

/** Default upward travel for fade/slide reveals. */
export const SCROLL_REVEAL_OFFSET_Y_PX = 24

/** Stagger between grouped items (cards, grid cells). */
export const SCROLL_REVEAL_STAGGER_MS = 80

/** Cap total stagger so long lists don't feel sluggish. */
export const SCROLL_REVEAL_MAX_STAGGER_MS = 320

export const SCROLL_REVEAL_THRESHOLD = 0.2

export const SCROLL_REVEAL_ROOT_MARGIN = '0px 0px -5% 0px'

/** Looser IO for large stat blocks — triggers reliably on mobile viewports. */
export const COUNT_UP_IN_VIEW_THRESHOLD = 0.08

export const COUNT_UP_IN_VIEW_ROOT_MARGIN = '0px 0px 8% 0px'

export function scrollRevealDelayMs(
  staggerIndex = 0,
  extraDelayMs = 0,
): number {
  const stagger = Math.min(
    staggerIndex * SCROLL_REVEAL_STAGGER_MS,
    SCROLL_REVEAL_MAX_STAGGER_MS,
  )
  return stagger + extraDelayMs
}

export function scrollRevealDelay(
  staggerIndex = 0,
  extraDelayMs = 0,
): string {
  return `${scrollRevealDelayMs(staggerIndex, extraDelayMs)}ms`
}
