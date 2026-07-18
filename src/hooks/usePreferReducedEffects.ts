import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'

type NavigatorWithMemory = Navigator & { deviceMemory?: number }

/**
 * Prefer reduced GPU/compositor effects (no blur, pause loops, simpler reels).
 * Android: always true — core count is not a proxy for compositing weakness.
 * Other platforms: reduced-motion, or low core/memory heuristics.
 */
export function detectPreferReducedEffects(
  prefersReducedMotion: boolean | null,
): boolean {
  if (prefersReducedMotion) return true
  if (typeof navigator === 'undefined') return false

  const nav = navigator as NavigatorWithMemory
  const isAndroid = /Android/i.test(nav.userAgent || '')

  if (isAndroid) return true

  const cores = nav.hardwareConcurrency ?? 8
  const mem = nav.deviceMemory
  const lowCores = cores <= 4
  const lowMem = typeof mem === 'number' && mem <= 4

  if (lowCores && (lowMem || typeof mem !== 'number')) return true

  return false
}

export function usePreferReducedEffects(): boolean {
  const prefersReducedMotion = useReducedMotion()
  return useMemo(
    () => detectPreferReducedEffects(prefersReducedMotion),
    [prefersReducedMotion],
  )
}

export function getPreferReducedEffectsDebugInfo(
  prefersReducedMotion: boolean | null = false,
) {
  if (typeof navigator === 'undefined') {
    return {
      cores: 'unknown' as const,
      mem: 'unknown' as const,
      isAndroid: false,
      preferSimple: false,
    }
  }

  const nav = navigator as NavigatorWithMemory
  const isAndroid = /Android/i.test(nav.userAgent || '')

  return {
    cores: nav.hardwareConcurrency ?? ('unknown' as const),
    mem:
      typeof nav.deviceMemory === 'number'
        ? nav.deviceMemory
        : ('unknown' as const),
    isAndroid,
    preferSimple: detectPreferReducedEffects(prefersReducedMotion),
  }
}
