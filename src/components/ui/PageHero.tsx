'use client'

import { useMemo, type CSSProperties, type ReactNode } from 'react'
import { usePreferReducedEffects } from '@/hooks/usePreferReducedEffects'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'

type Pixel = {
  id: number
  top: number
  left: number
  size: number
  opacity: number
  duration: number
  delay: number
  driftX: number
  driftY: number
}

const PIXEL_COUNT_DESKTOP = 34
const PIXEL_COUNT_MOBILE = 16

function makePixels(count: number): Pixel[] {
  return Array.from({ length: count }, (_, id) => {
    const duration = 5 + Math.random() * 6
    return {
      id,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 3 + Math.random() * 2,
      opacity: 0.14 + Math.random() * 0.16,
      duration,
      // Negative delay scaled to each particle's own duration so it starts
      // mid-cycle instead of every particle beginning in sync.
      delay: -Math.random() * duration,
      driftX: 34 + Math.random() * 44,
      driftY: 34 + Math.random() * 44,
    }
  })
}

type PageHeroBackdropProps = {
  className?: string
  /** Off on pages that already render their own ambient glow (Services, ToolStack). */
  showGlow?: boolean
}

/**
 * Background-only layer — vignette glow + slow drifting pixel particles +
 * bottom fade. Fills whatever `position: relative` container it's dropped
 * into via `inset: 0`, so it works both as the backdrop of the plain
 * `PageHero` wrapper below AND layered directly into a page's own bespoke
 * hero markup (see About.tsx, FinalCTA.tsx) without assuming any padding.
 */
export function PageHeroBackdrop({ className, showGlow = true }: PageHeroBackdropProps) {
  const preferReducedEffects = usePreferReducedEffects()
  const isMobile = useIsMobile()

  const pixels = useMemo(
    () =>
      preferReducedEffects ? [] : makePixels(isMobile ? PIXEL_COUNT_MOBILE : PIXEL_COUNT_DESKTOP),
    [preferReducedEffects, isMobile],
  )

  return (
    <div
      className={cn('page-hero-backdrop pointer-events-none absolute inset-0 z-0 overflow-hidden', className)}
      aria-hidden
    >
      {showGlow ? <div className="page-hero-glow" /> : null}
      {pixels.map((pixel) => (
        <span
          key={pixel.id}
          className="page-hero-pixel"
          style={
            {
              top: `${pixel.top}%`,
              left: `${pixel.left}%`,
              width: pixel.size,
              height: pixel.size,
              opacity: pixel.opacity,
              animationDuration: `${pixel.duration}s`,
              animationDelay: `${pixel.delay}s`,
              '--page-hero-pixel-x': `${pixel.driftX}px`,
              '--page-hero-pixel-y': `${pixel.driftY}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

type PageHeroProps = {
  children: ReactNode
  className?: string
  showGlow?: boolean
}

/**
 * Full-bleed hero-band wrapper for inner pages. Sits at full section width
 * (independent of whatever narrower max-width shell the page's own title
 * markup uses) and owns the top padding that clears the fixed navbar —
 * callers pass their page's existing top-padding value via `className` so
 * there's no double-padding once this replaces it. Height is driven purely
 * by content (padding-top + children), not a fixed viewport-height hero. A
 * subtle bottom border marks this as its own band, right after the
 * heading/subtitle — `mb-*` (not `pb-*`) so the border sits flush against
 * the heading's own margin but whatever follows this component still gets
 * breathing room below the line, instead of butting straight up against it.
 */
export function PageHero({ children, className, showGlow = true }: PageHeroProps) {
  return (
    <div
      className={cn(
        'page-hero relative w-full overflow-hidden bg-page border-b border-white/10 mb-10 sm:mb-12 lg:mb-14',
        className,
      )}
    >
      <PageHeroBackdrop showGlow={showGlow} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
