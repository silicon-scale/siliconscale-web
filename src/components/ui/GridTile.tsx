'use client'

import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const GRID_TILE_SIZE_PX = 28

type GridTileProps = {
  index: number
  /** Controlled one-shot / static lit state (optional). */
  glowing?: boolean
  /** Animation delay in seconds. Randomised at mount by BackgroundGrid when omitted. */
  delay?: number
  /** CSS infinite glow loop (preferred over Framer for reliable repeat). */
  enableIndependentLoop?: boolean
  /** Glow cycle length in seconds. */
  duration?: number
  className?: string
}

/**
 * One bordered square in the card background grid.
 * Glow uses CSS @keyframes + infinite iteration (see `.ss-grid-tile--animate` in index.css).
 */
export function GridTile({
  index,
  glowing = false,
  delay,
  enableIndependentLoop = false,
  duration,
  className,
}: GridTileProps) {
  const prefersReducedMotion = useReducedMotion()

  const timing = useMemo(() => {
    // Deterministic per-index fallback; BackgroundGrid usually passes mount-time randoms
    const baseDelay = delay ?? (index * 0.91) % 6
    const baseDuration = duration ?? 9 + (index % 5)
    return { delay: baseDelay, duration: baseDuration }
  }, [delay, duration, index])

  const canAnimate = !prefersReducedMotion && enableIndependentLoop

  return (
    <div
      aria-hidden
      className={cn(
        'ss-grid-tile box-border border border-white/[0.06]',
        canAnimate && 'ss-grid-tile--animate',
        !canAnimate && glowing && 'ss-grid-tile--lit',
        className,
      )}
      style={{
        width: GRID_TILE_SIZE_PX,
        height: GRID_TILE_SIZE_PX,
        ...(canAnimate
          ? {
              animationDelay: `${timing.delay}s`,
              animationDuration: `${timing.duration}s`,
            }
          : null),
      }}
    />
  )
}

export default GridTile
