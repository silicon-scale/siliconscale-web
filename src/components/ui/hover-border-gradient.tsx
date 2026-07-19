'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { brandGoldAlpha } from '@/lib/brand'

type Direction = 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT'

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = 'button',
  duration = 1,
  clockwise = true,
  /** When false, hold on current direction (used to defer shimmer until entrance settles). */
  animateActive = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType
    containerClassName?: string
    className?: string
    duration?: number
    clockwise?: boolean
    animateActive?: boolean
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState(false)
  const [direction, setDirection] = useState<Direction>('TOP')

  const rotateDirection = useCallback(
    (current: Direction): Direction => {
      const directions: Direction[] = ['TOP', 'LEFT', 'BOTTOM', 'RIGHT']
      const idx = directions.indexOf(current)
      const next = clockwise
        ? (idx - 1 + directions.length) % directions.length
        : (idx + 1) % directions.length
      return directions[next]
    },
    [clockwise]
  )

  // Softer radial falloff replaces former filter:blur(2px) on this layer —
  // same gold shimmer ring, painted without a live blur filter.
  const movingMap: Record<Direction, string> = {
    TOP: `radial-gradient(32% 72% at 50% -8%, ${brandGoldAlpha(0.95)} 0%, ${brandGoldAlpha(0.55)} 38%, ${brandGoldAlpha(0)} 78%)`,
    LEFT: `radial-gradient(28% 65% at -8% 50%, ${brandGoldAlpha(0.95)} 0%, ${brandGoldAlpha(0.55)} 38%, ${brandGoldAlpha(0)} 78%)`,
    BOTTOM: `radial-gradient(32% 72% at 50% 108%, ${brandGoldAlpha(0.95)} 0%, ${brandGoldAlpha(0.55)} 38%, ${brandGoldAlpha(0)} 78%)`,
    RIGHT: `radial-gradient(28% 65% at 108% 50%, ${brandGoldAlpha(0.95)} 0%, ${brandGoldAlpha(0.55)} 38%, ${brandGoldAlpha(0)} 78%)`,
  }

  const highlight = `radial-gradient(95% 210% at 50% 50%, ${brandGoldAlpha(0.85)} 0%, rgba(255,255,255,0.22) 30%, ${brandGoldAlpha(0)} 74%)`

  useEffect(() => {
    if (hovered || !animateActive) return
    const interval = window.setInterval(() => {
      setDirection((prev) => rotateDirection(prev))
    }, duration * 1000)
    return () => window.clearInterval(interval)
  }, [duration, hovered, rotateDirection, animateActive])

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative inline-flex rounded-button p-px',
        'bg-black/20 hover:bg-black/10 transition-colors duration-300',
        'border border-white/10',
        'shadow-[0_18px_60px_rgba(0,0,0,0.55)]',
        containerClassName
      )}
      {...props}
    >
      <span
        className={cn(
          'relative z-10 inline-flex items-center justify-center rounded-[inherit]',
          'px-5 py-2.5',
          'bg-white text-black',
          'transition-colors duration-300',
          'group-hover:bg-white/95',
          className
        )}
      >
        {children}
      </span>

      {/* Soft-edge border glow — paint only, no filter:blur */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-px z-0 rounded-[inherit]"
        style={{ filter: 'none' }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: 'linear', duration }}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-[2px] z-[1] rounded-[inherit] bg-page"
      />
    </Tag>
  )
}
