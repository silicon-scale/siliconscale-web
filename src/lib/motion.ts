/**
 * Shared Framer Motion easing — cubic-bezier(0.22, 1, 0.36, 1).
 * Replaces the triplicated local arrays in Navbar / HeroSection / FinalCTA.
 */
export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const

/** Hero entrance: 0.75s + 2×0.14s stagger ≈ 1.03s — ambient loops wait until settled. */
export const ENTRANCE_SETTLE_MS = 1100
