'use client'

import { useCallback, useRef, useState, type ButtonHTMLAttributes, type MouseEvent } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

type SplashOrigin = {
  x: number
  y: number
  radius: number
}

type SplashVariant = 'filled' | 'outline'

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

type SplashHoverButtonBaseProps = {
  /** Fill color revealed by the splash (defaults per variant). */
  splashColor?: string
  /** `filled` = white button + dark splash; `outline` = transparent + white splash. */
  variant?: SplashVariant
  className?: string
  children: React.ReactNode
}

type SplashHoverButtonAsButton = SplashHoverButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never
  }

type SplashHoverButtonAsLink = SplashHoverButtonBaseProps &
  Omit<LinkProps, 'className' | 'children'> & {
    to: string
  }

export type SplashHoverButtonProps = SplashHoverButtonAsButton | SplashHoverButtonAsLink

function resolveVariant(variant: SplashVariant, splashColor?: string) {
  if (variant === 'outline') {
    return {
      splashColor: splashColor ?? '#ffffff',
      shellClass: 'bg-transparent',
      reducedShellClass: 'bg-transparent hover:bg-white',
      reducedLabelClass: 'text-white group-hover/splash:text-black',
    }
  }

  return {
    splashColor: splashColor ?? WORK_CARD_BG,
    shellClass: 'bg-white',
    reducedShellClass: 'bg-white hover:bg-[#1c1c1c]',
    reducedLabelClass: 'text-black group-hover/splash:text-white',
  }
}

/**
 * CTA button with a cursor-origin clip-path splash on hover.
 * Text/icon stay above the splash layer; touch devices get a brief active splash.
 * Pass `to` for react-router Link; omit for button.
 */
export function SplashHoverButton(props: SplashHoverButtonProps) {
  const {
    className,
    children,
    splashColor: splashColorProp,
    variant = 'filled',
    to,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
    ...rest
  } = props

  const { splashColor, shellClass, reducedShellClass, reducedLabelClass } = resolveVariant(
    variant,
    splashColorProp,
  )

  const prefersReducedMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [origin, setOrigin] = useState<SplashOrigin>({ x: 0, y: 0, radius: 0 })
  const shellRef = useRef<HTMLElement>(null)
  const touchActiveRef = useRef(false)

  const setOriginFromPoint = useCallback((clientX: number, clientY: number) => {
    const el = shellRef.current
    if (!el) return
    setOrigin(getOriginFromPoint(clientX, clientY, el.getBoundingClientRect()))
  }, [])

  const splashTransition = { duration: SPLASH_DURATION, ease: SPLASH_EASE }

  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    if (touchActiveRef.current) return
    setOriginFromPoint(event.clientX, event.clientY)
    setHovered(true)
    onMouseEnter?.(event as MouseEvent<HTMLButtonElement & HTMLAnchorElement>)
  }

  const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
    if (touchActiveRef.current) return
    setOriginFromPoint(event.clientX, event.clientY)
    setHovered(false)
    onMouseLeave?.(event as MouseEvent<HTMLButtonElement & HTMLAnchorElement>)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchActiveRef.current = true
    const touch = event.touches[0]
    if (touch) setOriginFromPoint(touch.clientX, touch.clientY)
    setHovered(true)
    onTouchStart?.(event as React.TouchEvent<HTMLButtonElement & HTMLAnchorElement>)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    setHovered(false)
    window.setTimeout(() => {
      touchActiveRef.current = false
    }, 320)
    onTouchEnd?.(event as React.TouchEvent<HTMLButtonElement & HTMLAnchorElement>)
  }

  const handleTouchCancel = (event: React.TouchEvent<HTMLElement>) => {
    setHovered(false)
    touchActiveRef.current = false
    onTouchCancel?.(event as React.TouchEvent<HTMLButtonElement & HTMLAnchorElement>)
  }

  const shellClassName = cn(
    'group/splash relative inline-flex items-center overflow-hidden rounded-button no-underline',
    shellClass,
    className,
  )

  const interactionProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  }

  if (prefersReducedMotion) {
    const reducedClassName = cn(
      'group/splash inline-flex items-center gap-2 rounded-button transition-colors duration-300 no-underline',
      reducedShellClass,
      className,
    )

    if (to) {
      return (
        <Link
          ref={shellRef as React.RefObject<HTMLAnchorElement>}
          to={to}
          className={reducedClassName}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchCancel}
          {...(rest as Omit<LinkProps, 'className' | 'children' | 'to'>)}
        >
          <span
            className={cn(
              'splash-hover-label inline-flex items-center gap-2 transition-colors duration-300',
              reducedLabelClass,
            )}
          >
            {children}
          </span>
        </Link>
      )
    }

    return (
      <button
        ref={shellRef as React.RefObject<HTMLButtonElement>}
        type="button"
        className={reducedClassName}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <span
          className={cn(
            'splash-hover-label inline-flex items-center gap-2 transition-colors duration-300',
            reducedLabelClass,
          )}
        >
          {children}
        </span>
      </button>
    )
  }

  const splashLayer = (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
      style={{ backgroundColor: splashColor, willChange: 'clip-path' }}
      initial={false}
      animate={{
        clipPath: hovered ? circleClip(origin, origin.radius) : circleClip(origin, 0),
      }}
      transition={splashTransition}
    />
  )

  const labelLayer = (
    <span
      className={cn(
        'relative z-10 inline-flex items-center gap-2 mix-blend-difference',
        variant === 'outline' ? 'text-white' : 'text-white',
      )}
    >
      {children}
    </span>
  )

  if (to) {
    return (
      <Link
        ref={shellRef as React.RefObject<HTMLAnchorElement>}
        to={to}
        className={shellClassName}
        {...interactionProps}
        {...(rest as Omit<LinkProps, 'className' | 'children' | 'to'>)}
      >
        {splashLayer}
        {labelLayer}
      </Link>
    )
  }

  return (
    <motion.button
      ref={shellRef as React.RefObject<HTMLButtonElement>}
      type="button"
      className={shellClassName}
      {...interactionProps}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {splashLayer}
      {labelLayer}
    </motion.button>
  )
}
