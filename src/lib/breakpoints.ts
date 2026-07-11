/**
 * Shared breakpoints — single source of truth for JS media queries.
 * Mirror of `--breakpoint-*` in `src/index.css` and Tailwind `theme.extend.screens`.
 *
 * Collapsed from one-offs in AUDIT.md §1.5:
 * - 600px → sm (640)
 * - 860px → tablet (900)
 * - Footer / Connect 900px → tablet (same intent)
 *
 * Canonical set:
 *   xs 480 | sm 640 | md 768 | tablet 900 | lg 1024
 *   | xl 1280 | 2xl 1536 | ultrawide 2560
 */
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  tablet: 900,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  ultrawide: 2560,
} as const

export type BreakpointName = keyof typeof BREAKPOINTS

/** Mobile / tablet-portrait boundary (Tailwind `md`, former `useIsMobile`) */
export const MOBILE_BREAKPOINT = BREAKPOINTS.md

export function maxWidthQuery(bp: BreakpointName): string {
  return `(max-width: ${BREAKPOINTS[bp] - 1}px)`
}

export function minWidthQuery(bp: BreakpointName): string {
  return `(min-width: ${BREAKPOINTS[bp]}px)`
}
