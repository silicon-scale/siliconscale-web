'use client'

import { useCallback, useRef, useState, type ButtonHTMLAttributes, type MouseEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

type SplashOrigin = {
  x: number
  y: number
  radius: number
}

const SPLASH_EASE = [0, 0, 0.2, 1] as const
const SPLASH_DURATION = 0.5
/** Work listing card shell — matches `.work-card-link` in WorkProjectCard */
const WORK_CARD_BG = '#1c1c1c'

function getOriginFromPoint(clientX: number, clientY: number, rect: DOMRect): SplashOrigin {
  const x = clientX - rect.left
  const y = clientY - rect.top
  const corners: [number, number][] = [
    [0, 0],
    [rect.width, 0],
    [0, rect.height],
    [rect.width, rect.height],
  ]
  const radius = Math.max(...corners.map(([cx, cy]) => Math.hypot(cx - x, cy - y)))
  return { x, y, radius }
}

function circleClip({ x, y }: SplashOrigin, radius: number) {
  return `circle(${radius}px at ${x}px ${y}px)`
}

export type SplashHoverButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Fill color revealed by the splash (default: WorkProjectCard shell gray). */
  splashColor?: string
}

/**
 * CTA button with a cursor-origin clip-path splash on hover.
 * Text/icon stay above the splash layer; touch devices get a brief active splash.
 */
export function SplashHoverButton({
  className,
  children,
  splashColor = WORK_CARD_BG,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
  ...rest
}: SplashHoverButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [origin, setOrigin] = useState<SplashOrigin>({ x: 0, y: 0, radius: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const touchActiveRef = useRef(false)

  const setOriginFromPoint = useCallback((clientX: number, clientY: number) => {
    const el = buttonRef.current
    if (!el) return
    setOrigin(getOriginFromPoint(clientX, clientY, el.getBoundingClientRect()))
  }, [])

  const splashTransition = { duration: SPLASH_DURATION, ease: SPLASH_EASE }

  const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
    if (touchActiveRef.current) return
    setOriginFromPoint(event.clientX, event.clientY)
    setHovered(true)
    onMouseEnter?.(event)
  }

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    if (touchActiveRef.current) return
    setOriginFromPoint(event.clientX, event.clientY)
    setHovered(false)
    onMouseLeave?.(event)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>) => {
    touchActiveRef.current = true
    const touch = event.touches[0]
    if (touch) setOriginFromPoint(touch.clientX, touch.clientY)
    setHovered(true)
    onTouchStart?.(event)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLButtonElement>) => {
    setHovered(false)
    window.setTimeout(() => {
      touchActiveRef.current = false
    }, 320)
    onTouchEnd?.(event)
  }

  const handleTouchCancel = (event: React.TouchEvent<HTMLButtonElement>) => {
    setHovered(false)
    touchActiveRef.current = false
    onTouchCancel?.(event)
  }

  if (prefersReducedMotion) {
    return (
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          'inline-flex items-center gap-2 rounded-button bg-white transition-colors duration-300',
          'hover:bg-[#1c1c1c] [&:hover_.splash-hover-label]:text-white',
          className,
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        {...rest}
      >
        <span className="splash-hover-label inline-flex items-center gap-2 text-black transition-colors duration-300">
          {children}
        </span>
      </button>
    )
  }

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className={cn(
        'relative inline-flex items-center overflow-hidden rounded-button bg-white',
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      {...rest}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={{ backgroundColor: splashColor, willChange: 'clip-path' }}
        initial={false}
        animate={{
          clipPath: hovered
            ? circleClip(origin, origin.radius)
            : circleClip(origin, 0),
        }}
        transition={splashTransition}
      />
      <span className="relative z-10 inline-flex items-center gap-2 text-white mix-blend-difference">
        {children}
      </span>
    </motion.button>
  )
}
