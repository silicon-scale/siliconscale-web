/**
 * JS mirrors of CSS brand primitives for canvas / Framer Motion strings
 * that cannot reference `var(--brand-*)`. Must stay in sync with `src/index.css`.
 */
export const BRAND_GOLD_RGB = '143, 171, 212'

export function brandGoldAlpha(alpha: number): string {
  return `rgba(${BRAND_GOLD_RGB}, ${alpha})`
}
