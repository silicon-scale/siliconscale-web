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
