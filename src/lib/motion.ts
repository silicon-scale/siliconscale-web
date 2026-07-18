/**
 * Shared motion tokens — keep CSS reveal classes in index.css in sync.
 * Framer cubic-bezier(0.22, 1, 0.36, 1) ↔ CSS below.
 */
export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const
export const REVEAL_EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** Hero item translate duration (seconds) — was Framer HERO_DURATION. */
export const HERO_REVEAL_DURATION_S = 0.75
/** Nav shell translate duration (seconds) — was REVEAL_TRANSITION.duration. */
export const NAV_REVEAL_DURATION_S = 0.7
/** Hero staggerChildren — used as transition-delay steps. */
export const HERO_STAGGER_S = 0.14

/**
 * Ambient loops wait until entrance settles:
 * 0.75s + 2×0.14s stagger ≈ 1.03s → 1100ms.
 */
export const ENTRANCE_SETTLE_MS = 1100

/** Desktop hero travel (px) — Framer y: 80. */
export const HERO_TRAVEL_Y_DESKTOP_PX = 80
/** Mobile hero travel (px) — audit: 36–48; pick mid. */
export const HERO_TRAVEL_Y_MOBILE_PX = 42
/** Navbar entrance travel (px) — Framer y: -70. */
export const NAV_TRAVEL_Y_PX = 70

/** Count-up / stat tween duration (seconds). */
export const COUNT_UP_DURATION_S = 1.35

/**
 * Map linear progress [0,1] through cubic-bezier(0.22, 1, 0.36, 1) — REVEAL_EASE.
 * Solves X(t)=x then returns Y(t) (CSS timing-function semantics).
 */
export function easeRevealProgress(x: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1

  const cx = REVEAL_EASE[0]
  const bx = REVEAL_EASE[2]
  const cy = REVEAL_EASE[1]
  const by = REVEAL_EASE[3]

  let t = x
  for (let i = 0; i < 12; i++) {
    const mt = 1 - t
    const currentX = 3 * cx * mt * mt * t + 3 * bx * mt * t * t + t * t * t
    const dx = currentX - x
    if (Math.abs(dx) < 1e-6) break
    const dXdt =
      3 * cx * mt * mt - 6 * cx * mt * t + 3 * bx * mt * t - 3 * bx * t * t + 3 * t * t
    if (Math.abs(dXdt) < 1e-6) break
    t -= dx / dXdt
    t = Math.max(0, Math.min(1, t))
  }

  const mt = 1 - t
  return 3 * cy * mt * mt * t + 3 * by * mt * t * t + t * t * t
}
