import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'

type NavigatorWithMemory = Navigator & { deviceMemory?: number }

/**
 * Capability gate for the /services card reel.
 * Low-capability / Android mid-range devices get a document-flow whileInView
 * list instead of the sticky scroll-physics reel (GPU compositing bound).
 */
export function detectPreferSimpleServicesReel(
  prefersReducedMotion: boolean | null,
): boolean {
  if (prefersReducedMotion) return true
  if (typeof navigator === 'undefined') return false

  const nav = navigator as NavigatorWithMemory
  const cores = nav.hardwareConcurrency ?? 8
  const mem = nav.deviceMemory
  const isAndroid = /Android/i.test(nav.userAgent || '')
  const lowCores = cores <= 4
  const lowMem = typeof mem === 'number' && mem <= 4

  // Explicit low-end: few cores and (low or unknown memory)
  if (lowCores && (lowMem || typeof mem !== 'number')) return true
  // Android secondary signal: low cores or low deviceMemory
  if (isAndroid && (lowCores || lowMem)) return true

  return false
}

export function usePreferSimpleServicesReel(): boolean {
  const prefersReducedMotion = useReducedMotion()
  return useMemo(
    () => detectPreferSimpleServicesReel(prefersReducedMotion),
    [prefersReducedMotion],
  )
}
