'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GridTile, GRID_TILE_SIZE_PX } from '@/components/ui/GridTile'

type BackgroundGridProps = {
  className?: string
  /** When false, tiles render static (borders only, no glow loops). */
  animate?: boolean
}

type Pocket = { cols: number; rows: number }

type TileTiming = { delay: number; duration: number }

/**
 * Full-card absolute layer (inset-0) with diagonal fade mask on THIS wrapper.
 * Tiles only render in the top-right pocket (~25–30% of the card).
 */
export function BackgroundGrid({ className, animate = true }: BackgroundGridProps) {
  const prefersReducedMotion = useReducedMotion()
  const glowEnabled = animate && !prefersReducedMotion
  const measureRef = useRef<HTMLDivElement>(null)
  const [pocket, setPocket] = useState<Pocket>({ cols: 6, rows: 6 })
  /** Per-tile random delay + cycle length — set once when pocket size changes. */
  const [timings, setTimings] = useState<TileTiming[]>([])

  useEffect(() => {
    const el = measureRef.current
    if (!el) return

    const measure = () => {
      const w = el.clientWidth || 320
      const h = el.clientHeight || 420
      // Pocket covers the soft-visible top-right under the diagonal mask
      const cols = Math.max(4, Math.min(10, Math.ceil((w * 0.28) / GRID_TILE_SIZE_PX)))
      const rows = Math.max(4, Math.min(10, Math.ceil((h * 0.32) / GRID_TILE_SIZE_PX)))
      setPocket((prev) =>
        prev.cols === cols && prev.rows === rows ? prev : { cols, rows },
      )
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const n = pocket.cols * pocket.rows
    // Initial stagger 0–6s; full cycle = ~4–6s breath + ~3–8s idle → 9–14s
    setTimings(
      Array.from({ length: n }, () => ({
        delay: Math.random() * 6,
        duration: 9 + Math.random() * 5,
      })),
    )
  }, [pocket.cols, pocket.rows])

  const tileCount = pocket.cols * pocket.rows

  /** ~1/3 of pocket tiles glow so twinkles stay sparse. */
  const glowable = useMemo(() => {
    const set = new Set<number>()
    for (let i = 0; i < tileCount; i++) {
      if ((i * 5 + 2) % 3 === 0) set.add(i)
    }
    return set
  }, [tileCount])

  return (
    <div
      ref={measureRef}
      aria-hidden
      data-background-grid
      className={cn(
        'pointer-events-none absolute inset-0 z-0 overflow-hidden',
        className,
      )}
      style={{
        /* Soft diagonal dissolve — long transparent→black ramp, no hard seam */
        maskImage:
          'linear-gradient(to top right, transparent 0%, transparent 35%, black 100%)',
        WebkitMaskImage:
          'linear-gradient(to top right, transparent 0%, transparent 35%, black 100%)',
      }}
    >
      <div
        className="absolute right-0 top-0"
        style={{
          display: 'grid',
          width: pocket.cols * GRID_TILE_SIZE_PX,
          height: pocket.rows * GRID_TILE_SIZE_PX,
          gridTemplateColumns: `repeat(${pocket.cols}, ${GRID_TILE_SIZE_PX}px)`,
          gridTemplateRows: `repeat(${pocket.rows}, ${GRID_TILE_SIZE_PX}px)`,
        }}
      >
        {Array.from({ length: tileCount }, (_, index) => {
          const t = timings[index]
          return (
            <GridTile
              key={index}
              index={index}
              delay={t?.delay ?? (index * 0.91) % 6}
              duration={t?.duration ?? 9 + (index % 5)}
              enableIndependentLoop={glowEnabled && glowable.has(index)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default BackgroundGrid
