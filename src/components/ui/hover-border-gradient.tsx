'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Direction = 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT'

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = 'button',
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType
    containerClassName?: string
    className?: string
    duration?: number
    clockwise?: boolean
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

  // Gold-forward, subtle shimmer that matches the site theme.
  const movingMap: Record<Direction, string> = {
    TOP: 'radial-gradient(22% 55% at 50% 0%, rgba(201,169,110,0.95) 0%, rgba(201,169,110,0) 100%)',
    LEFT: 'radial-gradient(18% 48% at 0% 50%, rgba(201,169,110,0.95) 0%, rgba(201,169,110,0) 100%)',
    BOTTOM:
      'radial-gradient(22% 55% at 50% 100%, rgba(201,169,110,0.95) 0%, rgba(201,169,110,0) 100%)',
    RIGHT:
      'radial-gradient(18% 48% at 100% 50%, rgba(201,169,110,0.95) 0%, rgba(201,169,110,0) 100%)',
  }

  const highlight =
    'radial-gradient(85% 190% at 50% 50%, rgba(201,169,110,0.85) 0%, rgba(255,255,255,0.22) 28%, rgba(201,169,110,0) 70%)'

  useEffect(() => {
    if (hovered) return
    const interval = window.setInterval(() => {
      setDirection((prev) => rotateDirection(prev))
    }, duration * 1000)
    return () => window.clearInterval(interval)
  }, [duration, hovered, rotateDirection])

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative inline-flex rounded-full p-px',
        'bg-black/20 hover:bg-black/10 transition-colors duration-300',
        'border border-white/10',
        'shadow-[0_18px_60px_rgba(0,0,0,0.55)]',
        containerClassName
      )}
      {...props}
    >
      {/* content */}
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

      {/* animated border glow */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={{ filter: 'blur(2px)' }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: 'linear', duration }}
      />

      {/* inner cutout to keep glow outside */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[2px] z-[1] rounded-[inherit] bg-[#050505]"
      />
    </Tag>
  )
}

